// server.js
// Server principal pentru jocul Fazan: Express (fisiere statice + API REST)
// + Socket.IO (logica de joc in timp real).

const path = require("path");
const fs = require("fs");
const http = require("http");
const crypto = require("crypto");
const express = require("express");
const { Server } = require("socket.io");
const { customAlphabet } = require("nanoid");

const {
  WORD_LIST,
  validateWord,
  pickBotWord,
  normalizeWord,
  getLastTwo,
  getLastN,
} = require("./data/dictionary");

const PORT = process.env.PORT || 3000;
const TURN_SECONDS = 15;
const STARTING_LIVES = 3;
const MAX_PLAYERS = 4;
const DATA_FILE = path.join(__dirname, "data", "players.json");

const nanoidCode = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 4);
const guestTagCode = customAlphabet("0123456789", 5);

// ---------------------------------------------------------------------------
// Autentificare: parole hash-uite (scrypt, din Node core - fara dependente
// noi) + token de sesiune semnat (HMAC), pe modelul folosit si la proiectul
// server-trivia. Schimbati SESSION_SECRET intr-un .env pentru productie.
// ---------------------------------------------------------------------------
const SESSION_SECRET = process.env.SESSION_SECRET || "fazan-schimba-acest-secret-in-productie";
const TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 zile

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
}
function verifyPassword(password, salt, hash) {
  const attempt = crypto.scryptSync(password, salt, 64).toString("hex");
  const a = Buffer.from(attempt, "hex");
  const b = Buffer.from(hash, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
function signToken(email) {
  const payload = Buffer.from(JSON.stringify({ email, exp: Date.now() + TOKEN_TTL_MS })).toString("base64url");
  const sig = crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}
function verifyToken(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  const [payload, sig] = token.split(".");
  const expected = crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("base64url");
  const a = Buffer.from(sig || "");
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!data.exp || Date.now() > data.exp) return null;
    return data; // { email, exp }
  } catch {
    return null;
  }
}

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Persistenta profile/leaderboard.
//
// Implicit: fisier JSON local (data/players.json). Simplu, dar pe hosting cu
// disc efemer (ex. Render free tier) se REseteaza la fiecare redeploy -
// e o limitare documentata oficial de Render: "Free web services cannot
// attach disks" / "any changes to local files are lost every redeploy".
//
// Optional: daca setati SUPABASE_URL + SUPABASE_SERVICE_KEY in environment,
// serverul scrie/citeste automat printr-o baza de date Supabase reala
// (gratuita, permanenta) prin REST API simplu (fetch), fara librarii noi.
// Vezi README.md, sectiunea "Persistenta permanenta cu Supabase", pentru
// pasii exacti de configurare (5 minute, nu necesita cod).
// ---------------------------------------------------------------------------
const SUPABASE_URL = (process.env.SUPABASE_URL || "").replace(/\/$/, "");
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || "";
const useSupabase = Boolean(SUPABASE_URL && SUPABASE_KEY);

function toSupabaseRow(p) {
  return {
    email: p.email,
    nickname: p.nickname,
    password_hash: p.passwordHash || null,
    password_salt: p.passwordSalt || null,
    wins: p.wins || 0,
    matches: p.matches || 0,
    losses: p.losses || 0,
    best_streak: p.bestStreak || 0,
    current_streak: p.currentStreak || 0,
    words_played: p.wordsPlayed || 0,
    score: p.score || 0,
  };
}
function fromSupabaseRow(r) {
  return {
    email: r.email,
    nickname: r.nickname,
    passwordHash: r.password_hash,
    passwordSalt: r.password_salt,
    wins: r.wins || 0,
    matches: r.matches || 0,
    losses: r.losses || 0,
    bestStreak: r.best_streak || 0,
    currentStreak: r.current_streak || 0,
    wordsPlayed: r.words_played || 0,
    score: r.score || 0,
  };
}

async function supabaseUpsertPlayer(p) {
  if (!useSupabase) return;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/players`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify([toSupabaseRow(p)]),
    });
    if (!res.ok) console.error("Supabase upsert a esuat:", res.status, await res.text());
  } catch (err) {
    console.error("Supabase upsert - eroare de retea:", err.message);
  }
}

async function supabaseLoadAllPlayers() {
  if (!useSupabase) return {};
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/players?select=*`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    if (!res.ok) {
      console.error("Supabase load a esuat:", res.status, await res.text());
      return {};
    }
    const rows = await res.json();
    const db = {};
    for (const r of rows) db[r.email] = fromSupabaseRow(r);
    console.log(`Supabase: incarcate ${rows.length} conturi.`);
    return db;
  } catch (err) {
    console.error("Supabase load - eroare de retea:", err.message);
    return {};
  }
}

function loadPlayers() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch (e) {
    return {};
  }
}
function savePlayers(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Nu s-a putut salva players.json:", e.message);
  }
}
// Salveaza un singur cont, in ambele locuri disponibile: fisierul local
// (mereu, ca fallback rapid) + Supabase (daca e configurat, pentru
// persistenta reala peste redeploy-uri).
function persistPlayer(email) {
  savePlayers(PLAYERS_DB);
  if (useSupabase && PLAYERS_DB[email]) {
    supabaseUpsertPlayer(PLAYERS_DB[email]); // async, nu blocheaza raspunsul catre client
  }
}

let PLAYERS_DB = loadPlayers(); // keyed by email (lowercase) - populat complet mai jos, la boot

// Foloseste doar pentru conturi deja existente (dupa signup) — NU mai
// creeaza conturi noi implicit, ca sa nu ocolim parola.
function touchProfile(email, nickname) {
  const key = email.toLowerCase();
  if (!PLAYERS_DB[key]) return null;
  if (nickname) PLAYERS_DB[key].nickname = nickname;
  return PLAYERS_DB[key];
}

function publicProfile(p) {
  return { email: p.email, nickname: p.nickname };
}

function recordMatchResult({ email, nickname, won, wordsPlayed }) {
  if (!email) return;
  const profile = touchProfile(email, nickname);
  if (!profile) return;
  profile.matches += 1;
  profile.wordsPlayed += wordsPlayed || 0;
  if (won) {
    profile.wins += 1;
    profile.currentStreak += 1;
    profile.bestStreak = Math.max(profile.bestStreak, profile.currentStreak);
    profile.score += 100;
  } else {
    profile.losses += 1;
    profile.currentStreak = 0;
    profile.score += 10;
  }
  persistPlayer(email);
}

// ---------------------------------------------------------------------------
// API REST
// ---------------------------------------------------------------------------
const SERVER_STARTED_AT = new Date().toISOString();

app.get("/api/meta", (req, res) => {
  res.json({ serverStartedAt: SERVER_STARTED_AT, wordCount: WORD_LIST.length, googleClientId: process.env.GOOGLE_CLIENT_ID || null });
});

app.get("/api/dictionary", (req, res) => {
  res.json({ words: WORD_LIST });
});

app.get("/api/leaderboard", (req, res) => {
  const list = Object.values(PLAYERS_DB)
    .sort((a, b) => b.score - a.score)
    .slice(0, 50)
    .map((p) => ({
      nickname: p.nickname,
      wins: p.wins,
      matches: p.matches,
      winRate: p.matches ? Math.round((p.wins / p.matches) * 100) : 0,
      score: p.score,
    }));
  res.json({ leaderboard: list });
});

app.get("/api/profile", (req, res) => {
  const email = (req.query.email || "").toLowerCase();
  if (!email || !PLAYERS_DB[email]) {
    return res.status(404).json({ error: "Profil inexistent." });
  }
  const p = PLAYERS_DB[email];
  res.json({
    nickname: p.nickname,
    matches: p.matches,
    wins: p.wins,
    losses: p.losses,
    winRate: p.matches ? Math.round((p.wins / p.matches) * 100) : 0,
    bestStreak: p.bestStreak,
    currentStreak: p.currentStreak,
    wordsPlayed: p.wordsPlayed,
    score: p.score,
  });
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "");
}

// Singleplayer ruleaza integral in browser (fara server) - de aceea are
// nevoie de un endpoint separat prin care sa raporteze rezultatul, ca
// profilul (meciuri, victorii, win rate) sa se actualizeze si pentru
// meciurile jucate impotriva botilor, nu doar cele din multiplayer.
app.post("/api/record-singleplayer", (req, res) => {
  const { token, won, wordsPlayed } = req.body || {};
  const decoded = token ? verifyToken(token) : null;
  if (!decoded || !decoded.email || !PLAYERS_DB[decoded.email]) {
    return res.status(401).json({ error: "Sesiune invalida - rezultatul nu a putut fi salvat." });
  }
  recordMatchResult({
    email: decoded.email,
    nickname: PLAYERS_DB[decoded.email].nickname,
    won: Boolean(won),
    wordsPlayed: Number(wordsPlayed) || 0,
  });
  res.json({ ok: true, profile: publicProfile(PLAYERS_DB[decoded.email]) });
});

app.post("/api/signup", (req, res) => {
  const { email, nickname, password } = req.body || {};
  if (!isValidEmail(email)) return res.status(400).json({ error: "Adresa de email nu este valida." });
  if (!nickname || !nickname.toString().trim()) return res.status(400).json({ error: "Nickname-ul este necesar." });
  if (nickname.toString().trim().length < 3) return res.status(400).json({ error: "Nickname-ul trebuie sa aiba cel putin 3 litere." });
  if (!password || password.toString().length < 6) {
    return res.status(400).json({ error: "Parola trebuie sa aiba cel putin 6 caractere." });
  }
  const key = email.toLowerCase();
  if (PLAYERS_DB[key]) {
    return res.status(409).json({ error: "Exista deja un cont cu acest email. Incearca sa te conectezi." });
  }
  const trimmedNickname = nickname.toString().trim().slice(0, 20);
  const nicknameTaken = Object.values(PLAYERS_DB).some(
    (p) => p.nickname.toLowerCase() === trimmedNickname.toLowerCase()
  );
  if (nicknameTaken) {
    return res.status(409).json({ error: "Acest nickname e deja folosit de altcineva. Alege altul." });
  }
  const { salt, hash } = hashPassword(password);
  PLAYERS_DB[key] = {
    email: key,
    nickname: trimmedNickname,
    passwordSalt: salt,
    passwordHash: hash,
    wins: 0,
    matches: 0,
    losses: 0,
    bestStreak: 0,
    currentStreak: 0,
    wordsPlayed: 0,
    score: 0,
  };
  persistPlayer(key);
  const token = signToken(key);
  res.json({ token, profile: publicProfile(PLAYERS_DB[key]) });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body || {};
  const key = (email || "").toLowerCase();
  const account = PLAYERS_DB[key];
  if (!account || !account.passwordHash || !verifyPassword(password || "", account.passwordSalt, account.passwordHash)) {
    return res.status(401).json({ error: "Email sau parola incorecta." });
  }
  const token = signToken(key);
  res.json({ token, profile: publicProfile(account) });
});

// Sign in with Google - verifica token-ul primit de la Google Identity
// Services printr-un simplu fetch (fara librarie noua) catre endpoint-ul
// oficial de verificare al Google. Necesita GOOGLE_CLIENT_ID in .env - vezi
// README.md, sectiunea "Sign in with Google", pentru pasii de configurare.
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
app.post("/api/google-login", async (req, res) => {
  const { credential } = req.body || {};
  if (!GOOGLE_CLIENT_ID) {
    return res.status(501).json({ error: "Sign in with Google nu este configurat pe acest server." });
  }
  if (!credential) return res.status(400).json({ error: "Lipseste token-ul Google." });
  try {
    const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
    if (!verifyRes.ok) return res.status(401).json({ error: "Token Google invalid." });
    const payload = await verifyRes.json();
    if (payload.aud !== GOOGLE_CLIENT_ID) {
      return res.status(401).json({ error: "Token Google nu corespunde acestei aplicatii." });
    }
    if (!payload.email || payload.email_verified !== "true") {
      return res.status(401).json({ error: "Email Google neverificat." });
    }
    const key = payload.email.toLowerCase();
    let account = PLAYERS_DB[key];
    if (!account) {
      // Cont nou, creat automat prin Google - fara parola (login mereu prin Google)
      const rawNickname = (payload.name || payload.email.split("@")[0]).toString().trim().slice(0, 20);
      const nickname = rawNickname.length >= 3 ? rawNickname : rawNickname + "___".slice(0, 3 - rawNickname.length);
      account = PLAYERS_DB[key] = {
        email: key, nickname, passwordHash: null, passwordSalt: null,
        wins: 0, matches: 0, losses: 0, bestStreak: 0, currentStreak: 0, wordsPlayed: 0, score: 0,
      };
      persistPlayer(key);
    }
    const token = signToken(key);
    res.json({ token, profile: publicProfile(account) });
  } catch (err) {
    console.error("Google login esuat:", err.message);
    res.status(500).json({ error: "Eroare la verificarea token-ului Google." });
  }
});

// ---------------------------------------------------------------------------
// Stare in memorie: rooms
// ---------------------------------------------------------------------------
/** @type {Map<string, Room>} */
const rooms = new Map();

function makeRoomCode() {
  let code;
  do {
    code = `FAZAN-${nanoidCode()}`;
  } while (rooms.has(code));
  return code;
}

function publicRoomList() {
  return Array.from(rooms.values())
    .filter((r) => r.isPublic && r.state === "lobby")
    .map((r) => ({
      code: r.code,
      name: r.name,
      count: r.players.size,
      max: MAX_PLAYERS,
    }));
}

function broadcastPublicRooms() {
  io.emit("public_rooms", { rooms: publicRoomList() });
}

function serializePlayers(room) {
  return Array.from(room.players.values()).map((p) => ({
    id: p.id,
    nickname: p.nickname,
    lives: p.lives,
    alive: p.alive,
    connected: p.connected,
    isBot: p.isBot,
    isHost: p.id === room.hostId,
    color: p.color,
  }));
}

function roomSnapshot(room) {
  return {
    code: room.code,
    name: room.name,
    state: room.state,
    players: serializePlayers(room),
    hostId: room.hostId,
    round: room.round,
    chainLength: room.chainLength || 2,
  };
}

function broadcastRoom(room) {
  io.to(room.code).emit("room_update", roomSnapshot(room));
}

const AVATAR_COLORS = ["#7C5CFF", "#FF6B9D", "#3EDBB5", "#FFB454", "#5FA8FF"];

function createRoom({ name, isPublic, hostSocket, hostNickname, hostEmail, chainLength }) {
  const code = makeRoomCode();
  const room = {
    code,
    name: name || `Camera lui ${hostNickname}`,
    isPublic: !!isPublic,
    hostId: hostSocket.id,
    players: new Map(),
    state: "lobby", // lobby | wheel | playing | ended
    order: [],
    currentIndex: 0,
    lastWord: null,
    requiredPrefix: null,
    usedWords: new Set(),
    turnTimer: null,
    turnEndsAt: null,
    round: 1,
    playAgainVotes: new Set(),
    chainLength: [2, 3, 4].includes(chainLength) ? chainLength : 2, // game mode: Clasic(2) / Greu(3) / Expert(4)
  };
  room.players.set(hostSocket.id, {
    id: hostSocket.id,
    nickname: hostNickname,
    email: hostEmail || null,
    lives: STARTING_LIVES,
    alive: true,
    connected: true,
    isBot: false,
    color: AVATAR_COLORS[0],
  });
  rooms.set(code, room);
  return room;
}

function clearTurnTimer(room) {
  if (room.turnTimer) {
    clearTimeout(room.turnTimer);
    room.turnTimer = null;
  }
}

function alivePlayers(room) {
  return room.order
    .map((id) => room.players.get(id))
    .filter((p) => p && p.alive);
}

function nextAliveIndex(room, fromIndex) {
  const n = room.order.length;
  for (let step = 1; step <= n; step++) {
    const idx = (fromIndex + step) % n;
    const p = room.players.get(room.order[idx]);
    if (p && p.alive) return idx;
  }
  return -1;
}

function startTurn(room) {
  clearTurnTimer(room);
  const currentId = room.order[room.currentIndex];
  const current = room.players.get(currentId);
  if (!current) return;

  room.turnEndsAt = Date.now() + TURN_SECONDS * 1000;
  // Acelasi mecanism de "turn token" ca in singleplayer (public/js/app.js) -
  // previne un bug grav unde un timer intarziat (bot fara cuvant valid)
  // putea lovi cu "timpul a expirat" un jucator complet diferit, mult mai
  // tarziu, provocand eliminari in cascada.
  room.turnToken = (room.turnToken || 0) + 1;
  const myToken = room.turnToken;

  io.to(room.code).emit("turn_changed", {
    currentPlayerId: currentId,
    lastWord: room.lastWord,
    requiredPrefix: room.requiredPrefix,
    turnEndsAt: room.turnEndsAt,
    round: room.round,
  });

  room.turnTimer = setTimeout(() => {
    if (room.turnToken !== myToken) return;
    handleTimeout(room);
  }, TURN_SECONDS * 1000 + 300);

  if (current.isBot) {
    const delay = 900 + Math.random() * 1800;
    setTimeout(() => {
      if (room.turnToken === myToken) botPlay(room, current, myToken);
    }, delay);
  }
}

function botPlay(room, bot, token) {
  if (room.state !== "playing") return;
  if (room.turnToken !== token) return;
  if (room.order[room.currentIndex] !== bot.id) return;
  const difficulty = room.difficulty || "medium";
  const word = pickBotWord(room.requiredPrefix, room.usedWords, difficulty, room.chainLength);
  if (word) {
    submitWordInternal(room, bot.id, word);
  } else {
    clearTurnTimer(room); // FIX: nu mai lasam timer-ul vechi sa "atarne"
    handleTimeout(room);
  }
}

function handleTimeout(room) {
  if (room.state !== "playing") return;
  const currentId = room.order[room.currentIndex];
  const current = room.players.get(currentId);
  if (!current) return;

  io.to(room.code).emit("time_expired", { playerId: currentId });
  loseLife(room, current);
}

function loseLife(room, player) {
  player.lives -= 1;
  io.to(room.code).emit("life_lost", { playerId: player.id, livesLeft: player.lives });

  if (player.lives <= 0) {
    player.alive = false;
    io.to(room.code).emit("player_eliminated", { playerId: player.id });
  }

  const survivors = alivePlayers(room);
  if (survivors.length <= 1) {
    endGame(room, survivors[0] || null);
    return;
  }

  advanceTurn(room);
}

function advanceTurn(room) {
  const nextIdx = nextAliveIndex(room, room.currentIndex);
  if (nextIdx === -1) {
    endGame(room, alivePlayers(room)[0] || null);
    return;
  }
  room.currentIndex = nextIdx;
  room.round += 1;
  startTurn(room);
}

function submitWordInternal(room, playerId, rawWord) {
  if (room.state !== "playing") return { valid: false, reason: "Jocul nu este in desfasurare." };
  const currentId = room.order[room.currentIndex];
  if (currentId !== playerId) {
    return { valid: false, reason: "Nu este randul tau." };
  }
  const player = room.players.get(playerId);
  if (!player || !player.alive) return { valid: false, reason: "Nu mai esti in joc." };

  const result = validateWord(rawWord, room.requiredPrefix, room.usedWords, room.chainLength);
  if (!result.valid) {
    io.to(room.code).emit("word_rejected", { playerId, reason: result.reason, attempted: rawWord });
    return result;
  }

  clearTurnTimer(room);
  room.usedWords.add(result.normalized);
  room.lastWord = result.normalized;
  room.requiredPrefix = getLastN(result.normalized, room.chainLength);
  player.wordsThisMatch = (player.wordsThisMatch || 0) + 1;

  io.to(room.code).emit("word_accepted", {
    playerId,
    word: result.normalized,
    nextPrefix: room.requiredPrefix,
  });

  advanceTurn(room);
  return result;
}

// Forteaza eliminarea unui jucator (folosit la "quit" in timpul unui meci
// activ) - trateaza corect cazul in care era tocmai randul lui, ca sa nu
// ramana runda blocata la infinit (turnTimer ar referi un jucator disparut).
function forfeitPlayer(room, playerId) {
  const player = room.players.get(playerId);
  if (!player || !player.alive) return;
  player.alive = false;
  player.lives = 0;
  io.to(room.code).emit("player_eliminated", { playerId, forfeited: true });

  const survivors = alivePlayers(room);
  if (survivors.length <= 1) {
    endGame(room, survivors[0] || null);
    return;
  }
  if (room.order[room.currentIndex] === playerId) {
    advanceTurn(room);
  } else {
    broadcastRoom(room);
  }
}

function endGame(room, winner) {  clearTurnTimer(room);
  room.state = "ended";
  room.playAgainVotes = new Set();

  const results = Array.from(room.players.values())
    .filter((p) => !p.isBot)
    .map((p) => ({
      id: p.id,
      nickname: p.nickname,
      lives: p.lives,
      alive: p.alive,
      wordsPlayed: p.wordsThisMatch || 0,
      won: winner ? p.id === winner.id : false,
    }));

  for (const p of results) {
    if (p.email) continue;
  }
  for (const p of room.players.values()) {
    if (!p.isBot && p.email) {
      recordMatchResult({
        email: p.email,
        nickname: p.nickname,
        won: !!(winner && winner.id === p.id),
        wordsPlayed: p.wordsThisMatch || 0,
      });
    }
  }

  io.to(room.code).emit("game_over", {
    winnerId: winner ? winner.id : null,
    winnerNickname: winner ? winner.nickname : null,
    results,
  });
  broadcastRoom(room);
  broadcastPublicRooms();
}

function spinWheelAndStart(room) {
  room.state = "wheel";
  room.order = Array.from(room.players.keys());
  room.usedWords = new Set();
  room.lastWord = null;
  room.requiredPrefix = null;
  room.round = 1;
  for (const p of room.players.values()) {
    p.lives = STARTING_LIVES;
    p.alive = true;
    p.wordsThisMatch = 0;
  }

  const winnerIndex = Math.floor(Math.random() * room.order.length);
  const winnerId = room.order[winnerIndex];

  io.to(room.code).emit("wheel_spin", {
    order: room.order.map((id) => ({
      id,
      nickname: room.players.get(id).nickname,
    })),
    winnerId,
  });

  broadcastRoom(room);

  setTimeout(() => {
    room.state = "playing";
    room.currentIndex = winnerIndex;
    broadcastRoom(room);
    startTurn(room);
  }, 4200);
}

// ---------------------------------------------------------------------------
// Socket.IO
// ---------------------------------------------------------------------------
io.on("connection", (socket) => {
  socket.data.nickname = null;
  socket.data.email = null;
  socket.data.roomCode = null;
  socket.data.authenticated = false;

  socket.on("set_identity", ({ nickname, email, token }, ack) => {
    const decoded = token ? verifyToken(token) : null;
    if (decoded && decoded.email && PLAYERS_DB[decoded.email]) {
      // Sesiune verificata pe server (token semnat) - jucator autentificat cu adevarat.
      socket.data.authenticated = true;
      socket.data.email = decoded.email;
      socket.data.nickname = (PLAYERS_DB[decoded.email].nickname || nickname || "Jucator").toString().slice(0, 20);
      if (nickname) touchProfile(decoded.email, nickname.toString().slice(0, 20));
      if (typeof ack === "function") ack({ authenticated: true, nickname: socket.data.nickname });
    } else {
      // Fara token valid = guest. Nickname-ul de guest e generat/validat aici,
      // nu doar trimis de client, ca sa ramana consistent chiar daca cineva
      // modifica JS-ul din browser.
      socket.data.authenticated = false;
      socket.data.email = null;
      const looksLikeGuestTag = /^Guest-\d{4,6}$/i.test((nickname || "").toString().trim());
      socket.data.nickname = looksLikeGuestTag
        ? nickname.toString().trim()
        : `Guest-${guestTagCode()}`;
      if (typeof ack === "function") ack({ authenticated: false, nickname: socket.data.nickname, tokenWasInvalid: Boolean(token) });
    }
  });

  socket.on("list_public_rooms", () => {
    socket.emit("public_rooms", { rooms: publicRoomList() });
  });

  socket.on("create_room", ({ name, isPublic, chainLength }, cb) => {
    if (!socket.data.authenticated) {
      return cb && cb({ ok: false, error: "Multiplayer este disponibil doar pentru conturi autentificate. Creează-ți un cont sau conectează-te." });
    }
    const room = createRoom({
      name,
      isPublic,
      hostSocket: socket,
      hostNickname: socket.data.nickname || "Gazda",
      hostEmail: socket.data.email,
      chainLength,
    });
    socket.join(room.code);
    socket.data.roomCode = room.code;
    broadcastRoom(room);
    broadcastPublicRooms();
    cb && cb({ ok: true, room: roomSnapshot(room) });
  });

  socket.on("join_room", ({ code }, cb) => {
    if (!socket.data.authenticated) {
      return cb && cb({ ok: false, error: "Multiplayer este disponibil doar pentru conturi autentificate. Creează-ți un cont sau conectează-te." });
    }
    const room = rooms.get((code || "").toUpperCase());
    if (!room) return cb && cb({ ok: false, error: "Camera nu exista." });
    if (room.state !== "lobby") return cb && cb({ ok: false, error: "Partida a inceput deja." });
    if (room.players.size >= MAX_PLAYERS) return cb && cb({ ok: false, error: "Camera este plina (4/4)." });

    const color = AVATAR_COLORS[room.players.size % AVATAR_COLORS.length];
    room.players.set(socket.id, {
      id: socket.id,
      nickname: socket.data.nickname || "Jucator",
      email: socket.data.email,
      lives: STARTING_LIVES,
      alive: true,
      connected: true,
      isBot: false,
      color,
    });
    socket.join(room.code);
    socket.data.roomCode = room.code;
    broadcastRoom(room);
    broadcastPublicRooms();
    cb && cb({ ok: true, room: roomSnapshot(room) });
  });

  socket.on("leave_room", () => {
    leaveCurrentRoom(socket);
  });

  socket.on("start_game", () => {
    const room = rooms.get(socket.data.roomCode);
    if (!room) return;
    if (room.hostId !== socket.id) return;
    if (room.players.size < 2) {
      socket.emit("error_message", { message: "Este nevoie de cel putin 2 jucatori." });
      return;
    }
    spinWheelAndStart(room);
  });

  socket.on("submit_word", ({ word }) => {
    const room = rooms.get(socket.data.roomCode);
    if (!room) return;
    submitWordInternal(room, socket.id, word);
  });

  // Transmite in timp real ce scrie jucatorul curent catre ceilalti din
  // camera - doar un "preview" de text, nu se valideaza nimic aici.
  socket.on("typing", ({ text }) => {
    const room = rooms.get(socket.data.roomCode);
    if (!room) return;
    socket.to(room.code).emit("player_typing", {
      playerId: socket.id,
      text: (text || "").toString().slice(0, 30),
    });
  });

  // Iesire fortata dintr-un meci in desfasurare - jucatorul e eliminat
  // (forfeit), nu doar scos silentios din room (evita blocarea rundei).
  socket.on("quit_match", () => {
    const room = rooms.get(socket.data.roomCode);
    if (!room) return;
    if (room.state === "playing" || room.state === "wheel") {
      forfeitPlayer(room, socket.id);
    }
    leaveCurrentRoom(socket);
  });

  socket.on("play_again", () => {
    const room = rooms.get(socket.data.roomCode);
    if (!room) return;
    room.playAgainVotes.add(socket.id);
    const humans = Array.from(room.players.values()).filter((p) => !p.isBot);
    io.to(room.code).emit("play_again_status", {
      votes: room.playAgainVotes.size,
      needed: humans.length,
    });
    if (room.playAgainVotes.size >= humans.length) {
      room.state = "lobby";
      broadcastRoom(room);
      spinWheelAndStart(room);
    }
  });

  socket.on("disconnect", () => {
    const room = rooms.get(socket.data.roomCode);
    if (!room) return;
    const player = room.players.get(socket.id);
    if (!player) return;

    player.connected = false;
    io.to(room.code).emit("player_disconnected", {
      playerId: socket.id,
      nickname: player.nickname,
    });

    if (room.state === "lobby") {
      room.players.delete(socket.id);
      if (room.hostId === socket.id) {
        const remaining = Array.from(room.players.keys());
        room.hostId = remaining[0] || null;
      }
      if (room.players.size === 0) {
        rooms.delete(room.code);
      } else {
        broadcastRoom(room);
      }
      broadcastPublicRooms();
      return;
    }

    // In timpul jocului: daca era randul lui, trateaza ca time-out dupa scurt delay
    // pentru a lasa loc unei eventuale reconectari rapide.
    if (room.state === "playing") {
      const currentId = room.order[room.currentIndex];
      if (currentId === socket.id && player.alive) {
        const tokenAtDisconnect = room.turnToken;
        setTimeout(() => {
          if (room.turnToken !== tokenAtDisconnect) return; // tura s-a schimbat deja intre timp
          if (!player.connected && player.alive && room.order[room.currentIndex] === socket.id) {
            handleTimeout(room);
          }
        }, 2000);
      }
    }
    broadcastRoom(room);
  });

  function leaveCurrentRoom(sock) {
    const room = rooms.get(sock.data.roomCode);
    if (!room) return;
    sock.leave(room.code);
    room.players.delete(sock.id);
    if (room.hostId === sock.id) {
      const remaining = Array.from(room.players.keys());
      room.hostId = remaining[0] || null;
    }
    sock.data.roomCode = null;
    if (room.players.size === 0) {
      rooms.delete(room.code);
    } else {
      broadcastRoom(room);
    }
    broadcastPublicRooms();
  }
});

server.listen(PORT, async () => {
  console.log(`Fazan server ruleaza pe portul ${PORT}`);
  if (useSupabase) {
    console.log("Supabase configurat - incarc conturile salvate...");
    const remote = await supabaseLoadAllPlayers();
    Object.assign(PLAYERS_DB, remote);
    console.log("Conturi disponibile dupa incarcare Supabase:", Object.keys(PLAYERS_DB).length);
  } else {
    console.log("Supabase NECONFIGURAT - folosesc doar fisierul local data/players.json (se poate reseta la redeploy pe Render free tier).");
  }
});
