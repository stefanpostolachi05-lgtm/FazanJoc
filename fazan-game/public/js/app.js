// public/js/app.js
// Logica client pentru FAZAN. Vanilla JS, fara build step.

(() => {
  "use strict";

  // ------------------------------------------------------------------
  // Stare locala
  // ------------------------------------------------------------------
  const state = {
    nickname: localStorage.getItem("fazan_nickname") || "",
    email: localStorage.getItem("fazan_email") || "",
    token: localStorage.getItem("fazan_token") || "",
    isGuest: true,
    socket: null,
    myId: null,
    room: null, // ultima stare de room primita de la server
    dictionaryWords: [],
    settings: {
      sound: localStorage.getItem("fazan_sound") !== "0",
      anim: localStorage.getItem("fazan_anim") !== "0",
      bgMode: localStorage.getItem("fazan_bg_mode") || "letters",
    },
    sp: null, // stare singleplayer locala
    timerInterval: null,
    turnEndsAt: null,
  };

  // ------------------------------------------------------------------
  // Navigare intre ecrane
  // ------------------------------------------------------------------
  function showScreen(id) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
    const el = document.getElementById("screen-" + id);
    if (el) el.classList.add("active");
    window.scrollTo(0, 0);
  }

  document.querySelectorAll("[data-nav]").forEach((el) => {
    el.addEventListener("click", () => {
      const target = el.getAttribute("data-nav");
      handleNav(target);
    });
  });

  function handleNav(target) {
    if (target === "menu") showScreen("menu");
    else if (target === "singleplayer") showScreen("sp-setup");
    else if (target === "multiplayer") {
      if (state.isGuest) {
        toast("Multiplayer necesită cont. Creează unul gratuit din ecranul de start!");
        return;
      }
      showScreen("mp-hub");
      requestPublicRooms();
    } else if (target === "leaderboard") {
      loadLeaderboard();
      showScreen("leaderboard");
    } else if (target === "profile") {
      loadProfile();
      showScreen("profile");
    } else if (target === "settings") {
      showScreen("settings");
    }
  }

  // ------------------------------------------------------------------
  // Toast helper
  // ------------------------------------------------------------------
  function toast(msg) {
    const root = document.getElementById("toast-root");
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    root.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  }

  // ------------------------------------------------------------------
  // Sunet (Web Audio API — fara fisiere externe)
  // ------------------------------------------------------------------
  let audioCtx = null;
  function ensureAudio() {
    if (!audioCtx) {
      try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { /* noop */ }
    }
  }
  function beep(freq, duration, type = "sine", vol = 0.18) {
    if (!state.settings.sound) return;
    ensureAudio();
    if (!audioCtx) return;
    const volumeFactor = (typeof state.settings.volume === "number" ? state.settings.volume : 70) / 100;
    const effectiveVol = vol * volumeFactor;
    if (effectiveVol <= 0) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = effectiveVol;
    osc.connect(gain).connect(audioCtx.destination);
    const now = audioCtx.currentTime;
    gain.gain.setValueAtTime(effectiveVol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.start(now);
    osc.stop(now + duration);
  }
  const sfx = {
    correct: () => beep(720, 0.15, "sine"),
    wrong: () => beep(160, 0.25, "sawtooth"),
    turn: () => beep(480, 0.12, "triangle"),
    life: () => beep(300, 0.3, "square"),
    eliminated: () => beep(120, 0.5, "sawtooth"),
    win: () => { beep(660, 0.15); setTimeout(() => beep(880, 0.2), 130); setTimeout(() => beep(1050, 0.3), 280); },
    click: () => beep(500, 0.06, "square", 0.08),
  };
  document.addEventListener("click", () => { ensureAudio(); }, { once: true });

  // ------------------------------------------------------------------
  // Confetti minimalist
  // ------------------------------------------------------------------
  function launchConfetti() {
    if (!state.settings.anim) return;
    const root = document.getElementById("confetti-root");
    const colors = ["#7C5CFF", "#3EDBB5", "#FFB454", "#FF5C7A", "#5FA8FF"];
    for (let i = 0; i < 80; i++) {
      const piece = document.createElement("div");
      piece.className = "confetti-piece";
      const size = 6 + Math.random() * 6;
      piece.style.width = size + "px";
      piece.style.height = size * 0.4 + "px";
      piece.style.left = Math.random() * 100 + "vw";
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDuration = 2.4 + Math.random() * 1.8 + "s";
      piece.style.animationDelay = Math.random() * 0.4 + "s";
      root.appendChild(piece);
      setTimeout(() => piece.remove(), 5000);
    }
  }

  // ------------------------------------------------------------------
  // Fundal animat cu particule (litere plutitoare)
  // ------------------------------------------------------------------
  (function initBackground() {
    const canvas = document.getElementById("bg-canvas");
    const ctx = canvas.getContext("2d");
    let particles = [];
    const letters = "AĂÂBCDEFGHIÎJKLMNOPQRSȘTȚUVWXYZ".split("");
    const dotColors = ["124,92,255", "62,219,181", "255,180,84", "255,107,157"];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    function spawn() {
      particles = [];
      if (state.settings.bgMode === "none") return;
      const count = Math.min(28, Math.floor((canvas.width * canvas.height) / 45000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          letter: letters[Math.floor(Math.random() * letters.length)],
          color: dotColors[Math.floor(Math.random() * dotColors.length)],
          size: state.settings.bgMode === "particles" ? 2 + Math.random() * 4 : 14 + Math.random() * 20,
          speed: 0.15 + Math.random() * 0.3,
          drift: (Math.random() - 0.5) * 0.3,
          opacity: state.settings.bgMode === "particles" ? 0.15 + Math.random() * 0.25 : 0.04 + Math.random() * 0.07,
        });
      }
    }
    spawn();
    window.__respawnBg = spawn;

    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (state.settings.bgMode !== "none" && state.settings.anim) {
        for (const p of particles) {
          if (state.settings.bgMode === "particles") {
            ctx.fillStyle = `rgba(${p.color},${p.opacity})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillStyle = `rgba(124,92,255,${p.opacity})`;
            ctx.font = `600 ${p.size}px 'Space Grotesk', sans-serif`;
            ctx.fillText(p.letter, p.x, p.y);
          }
          p.y -= p.speed;
          p.x += p.drift;
          if (p.y < -30) { p.y = canvas.height + 30; p.x = Math.random() * canvas.width; }
        }
      }
      requestAnimationFrame(tick);
    }
    tick();
  })();

  // ------------------------------------------------------------------
  // WELCOME screen — Sign In / Sign Up / Guest
  // ------------------------------------------------------------------
  const welcomeBack = document.getElementById("welcome-back");
  const welcomeBackName = document.getElementById("welcome-back-name");
  const authFormsWrap = document.getElementById("auth-forms-wrap");
  const tabSignin = document.getElementById("tab-signin");
  const tabSignup = document.getElementById("tab-signup");
  const formSignin = document.getElementById("form-signin");
  const formSignup = document.getElementById("form-signup");
  const signinError = document.getElementById("signin-error");
  const signupError = document.getElementById("signup-error");
  const btnGuest = document.getElementById("btn-guest");
  const btnContinueSession = document.getElementById("btn-continue-session");
  const btnSwitchAccount = document.getElementById("btn-switch-account");

  function guestTag() {
    return "Guest-" + String(Math.floor(10000 + Math.random() * 90000));
  }

  function enterAsGuest() {
    state.isGuest = true;
    state.email = "";
    state.token = "";
    state.nickname = localStorage.getItem("fazan_nickname") && !state.email
      ? guestTag() // preferam mereu un tag proaspat de guest, ca sa fie clar ca nu esti logat
      : guestTag();
    localStorage.removeItem("fazan_email");
    localStorage.removeItem("fazan_token");
    localStorage.setItem("fazan_nickname", state.nickname);
    enterGame();
  }

  function enterAsAccount({ token, profile }) {
    state.isGuest = false;
    state.token = token;
    state.email = profile.email;
    state.nickname = profile.nickname;
    localStorage.setItem("fazan_token", token);
    localStorage.setItem("fazan_email", profile.email);
    localStorage.setItem("fazan_nickname", profile.nickname);
    enterGame();
  }

  function enterGame() {
    connectSocket();
    renderMenuIdentity();
    showScreen("menu");
  }

  function renderMenuIdentity() {
    const nickEl = document.getElementById("menu-nickname");
    const logoutBtn = document.getElementById("btn-logout");
    nickEl.textContent = (state.isGuest ? "👤 " : "👋 ") + state.nickname;
    // BUG FIX: butonul era complet ascuns pentru guests, deci nu aveau nicio
    // cale sa ajunga inapoi la ecranul de login. Acum ramane mereu vizibil,
    // doar textul si actiunea se schimba dupa starea contului.
    logoutBtn.classList.remove("hidden");
    logoutBtn.textContent = state.isGuest ? "Conectează-te / Creează cont" : "Ieși din cont";

    const lock = document.getElementById("menu-lock-multiplayer");
    const desc = document.getElementById("menu-desc-multiplayer");
    const card = document.getElementById("menu-card-multiplayer");
    lock.classList.toggle("hidden", !state.isGuest);
    card.classList.toggle("locked", state.isGuest);
    desc.textContent = state.isGuest ? "Necesită cont — Sign Up gratuit" : "Camere de până la 4 jucători";
  }

  document.getElementById("btn-logout").addEventListener("click", () => {
    localStorage.removeItem("fazan_token");
    localStorage.removeItem("fazan_email");
    localStorage.removeItem("fazan_nickname");
    state.token = "";
    state.email = "";
    state.isGuest = true;
    if (state.socket) { state.socket.disconnect(); state.socket = null; }
    showScreen("welcome");
    resetWelcomeForms();
  });

  function resetWelcomeForms() {
    welcomeBack.classList.add("hidden");
    authFormsWrap.classList.remove("hidden");
    formSignin.reset();
    formSignup.reset();
    signinError.textContent = "";
    signupError.textContent = "";
  }

  tabSignin.addEventListener("click", () => {
    tabSignin.classList.add("active"); tabSignup.classList.remove("active");
    formSignin.classList.remove("hidden"); formSignup.classList.add("hidden");
  });
  tabSignup.addEventListener("click", () => {
    tabSignup.classList.add("active"); tabSignin.classList.remove("active");
    formSignup.classList.remove("hidden"); formSignin.classList.add("hidden");
  });

  formSignin.addEventListener("submit", async (e) => {
    e.preventDefault();
    signinError.textContent = "";
    const email = document.getElementById("signin-email").value.trim();
    const password = document.getElementById("signin-password").value;
    const submitBtn = formSignin.querySelector("button[type=submit]");
    submitBtn.disabled = true;
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { signinError.textContent = data.error || "Eroare la conectare."; return; }
      enterAsAccount(data);
    } catch (e) {
      signinError.textContent = "Nu s-a putut contacta serverul. Încearcă din nou.";
    } finally {
      submitBtn.disabled = false;
    }
  });

  formSignup.addEventListener("submit", async (e) => {
    e.preventDefault();
    signupError.textContent = "";
    const nickname = document.getElementById("signup-nickname").value.trim().slice(0, 20);
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;
    const submitBtn = formSignup.querySelector("button[type=submit]");
    submitBtn.disabled = true;
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, nickname, password }),
      });
      const data = await res.json();
      if (!res.ok) { signupError.textContent = data.error || "Eroare la crearea contului."; return; }
      toast("Cont creat cu succes!");
      enterAsAccount(data);
    } catch (e) {
      signupError.textContent = "Nu s-a putut contacta serverul. Încearcă din nou.";
    } finally {
      submitBtn.disabled = false;
    }
  });

  btnGuest.addEventListener("click", enterAsGuest);

  btnContinueSession.addEventListener("click", () => {
    enterAsAccount({ token: state.token, profile: { email: state.email, nickname: state.nickname } });
  });
  btnSwitchAccount.addEventListener("click", () => {
    localStorage.removeItem("fazan_token");
    localStorage.removeItem("fazan_email");
    state.token = ""; state.email = "";
    resetWelcomeForms();
  });

  // Daca exista un token salvat din vizita anterioara, reluam automat
  // sesiunea, fara sa mai cerem un click de confirmare - verificarea reala
  // se face pe server, la conectarea socket-ului (set_identity + ack), iar
  // daca token-ul a expirat intre timp, cade automat inapoi la ecranul de
  // login (vezi handler-ul "connect" din connectSocket).
  (function checkSavedSession() {
    try {
      if (state.token && state.email && state.nickname) {
        authFormsWrap.classList.add("hidden");
        welcomeBackName.textContent = state.nickname;
        welcomeBack.classList.remove("hidden");
        welcomeBack.querySelector(".muted").textContent = "Te reconectăm automat...";
        btnContinueSession.classList.add("hidden");
        btnSwitchAccount.classList.add("hidden");
        enterAsAccount({ token: state.token, profile: { email: state.email, nickname: state.nickname } });
      }
    } catch (err) {
      // Orice eroare aici NU trebuie sa blocheze restul paginii (butoane,
      // setari etc.) - revenim la ecranul normal de login si continuam.
      console.error("Eroare la reluarea sesiunii salvate:", err);
      localStorage.removeItem("fazan_token");
      resetWelcomeForms();
    }
  })();

  // ------------------------------------------------------------------
  // Ticker decorativ cu exemple de lanturi Fazan (doar vizual)
  // ------------------------------------------------------------------
  (function initTicker() {
    const el = document.getElementById("word-ticker");
    if (!el) return;
    const chains = [
      ["RECHIN", "INOT", "OTIS", "ISVOR", "ORHIDEE"],
      ["MASINA", "NADEJDE", "DELUROS", "OSPATAR", "ARGINT"],
      ["PADURE", "REVISTA", "TATAL", "ALBASTRU", "TRUDA"],
      ["CANTEC", "ECOU", "OUA", "UART", "ARTIST"],
    ];
    let html = "";
    for (let r = 0; r < 3; r++) { // repetam de cateva ori ca sa umplem banda si sa poata bucla la infinit
      for (const chain of chains) {
        html += chain.map((w, i) => (i === 0 ? w : `<span class="arrow">→</span> ${w}`)).join(" ") + `<span style="opacity:.3">&nbsp;&nbsp;•&nbsp;&nbsp;</span>`;
      }
    }
    el.innerHTML = html;
  })();

  // ------------------------------------------------------------------
  // Socket.IO
  // ------------------------------------------------------------------
  function connectSocket() {
    if (state.socket) return;
    if (typeof io === "undefined") {
      // socket.io.js n-a reusit sa se incarce (server Render abia trezit
      // din somn / hiccup de retea). Reincercam sa il reincarcam activ,
      // in loc sa blocam tot restul scriptului cu o eroare aici.
      window.__fazanSocketRetries = (window.__fazanSocketRetries || 0) + 1;
      if (window.__fazanSocketRetries <= 6) {
        if (window.__fazanSocketRetries % 2 === 0) {
          const retryScript = document.createElement("script");
          retryScript.src = "/socket.io/socket.io.js?retry=" + window.__fazanSocketRetries;
          document.head.appendChild(retryScript);
        }
        setTimeout(connectSocket, 700);
      } else {
        toast("Nu ne putem conecta la server. Reîmprospătează pagina.");
      }
      return;
    }
    let s;
    try {
      s = io();
    } catch (err) {
      console.error("Conectare socket esuata:", err);
      toast("Nu ne putem conecta la server. Reîncearcă în câteva secunde.");
      return;
    }
    state.socket = s;

    // Plasa de siguranta: daca serverul Render tocmai s-a trezit din somn,
    // prima conexiune poate dura pana la ~50s. Daca nu s-a conectat deloc
    // in acest timp si incercam sa reluam o sesiune salvata, nu lasam
    // utilizatorul blocat pe "Te reconectam automat..." la infinit.
    const connectSafetyTimer = setTimeout(() => {
      if (!s.connected && state.token) {
        toast("Conexiunea durează mai mult ca de obicei — serverul poate fi în curs de pornire.");
      }
    }, 8000);

    s.on("connect", () => {
      clearTimeout(connectSafetyTimer);
      state.myId = s.id;
      s.emit("set_identity", { nickname: state.nickname, email: state.email || null, token: state.token || null }, (ack) => {
        if (!ack) return;
        if (state.token && !ack.authenticated) {
          // Token-ul salvat a expirat sau nu mai e valid - curatam sesiunea
          // si il trimitem inapoi la login, cu un mesaj clar (nu il lasam
          // "conectat" doar aparent, ca guest, fara sa stie de ce).
          localStorage.removeItem("fazan_token");
          localStorage.removeItem("fazan_email");
          state.token = ""; state.email = ""; state.isGuest = true;
          toast("Sesiunea a expirat. Te rugăm să te conectezi din nou.");
          showScreen("welcome");
          resetWelcomeForms();
          return;
        }
        state.isGuest = !ack.authenticated;
        state.nickname = ack.nickname || state.nickname;
        renderMenuIdentity();
      });
    });

    // reconectare: id nou dupa disconnect
    s.on("disconnect", () => {
      toast("Conexiune pierdută. Se încearcă reconectarea...");
    });
    s.io.on("reconnect", () => {
      state.myId = s.id;
      s.emit("set_identity", { nickname: state.nickname, email: state.email || null, token: state.token || null });
      toast("Reconectat!");
    });

    s.on("public_rooms", ({ rooms }) => renderPublicRooms(rooms));
    s.on("room_update", (room) => onRoomUpdate(room));
    s.on("wheel_spin", (data) => onWheelSpin(data));
    s.on("turn_changed", (data) => onTurnChanged(data));
    s.on("word_accepted", (data) => onWordAccepted(data));
    s.on("word_rejected", (data) => onWordRejected(data));
    s.on("time_expired", (data) => {
      if (data.playerId === state.myId) toast("Timpul a expirat!");
    });
    s.on("life_lost", (data) => onLifeLost(data));
    s.on("player_eliminated", (data) => onPlayerEliminated(data));
    s.on("player_typing", (data) => {
      if (state.settings.typingPreview) showTypingPreview(data.playerId, data.text);
    });
    s.on("player_disconnected", (data) => onPlayerDisconnected(data));
    s.on("game_over", (data) => onGameOver(data));
    s.on("play_again_status", (data) => {
      document.getElementById("play-again-count").textContent = `(${data.votes}/${data.needed})`;
    });
    s.on("error_message", (data) => toast(data.message));
  }

  // ------------------------------------------------------------------
  // MULTIPLAYER HUB
  // ------------------------------------------------------------------
  function requestPublicRooms() {
    if (state.socket) state.socket.emit("list_public_rooms");
  }
  document.getElementById("btn-refresh-rooms").addEventListener("click", requestPublicRooms);

  function renderPublicRooms(rooms) {
    const root = document.getElementById("public-rooms-list");
    if (!rooms.length) {
      root.innerHTML = `<p class="muted">Nicio cameră publică deschisă momentan. Creează una!</p>`;
      return;
    }
    root.innerHTML = "";
    rooms.forEach((r) => {
      const row = document.createElement("div");
      row.className = "room-row";
      row.innerHTML = `
        <div class="room-info">
          <b>${escapeHtml(r.name)}</b>
          <span class="room-count">${r.count}/${r.max} jucători · ${escapeHtml(r.code)}</span>
        </div>
        <button class="btn btn-secondary" data-join="${r.code}">Join</button>
      `;
      root.appendChild(row);
    });
    root.querySelectorAll("[data-join]").forEach((btn) => {
      btn.addEventListener("click", () => joinRoom(btn.getAttribute("data-join")));
    });
  }

  document.getElementById("btn-create-room").addEventListener("click", () => {
    const name = document.getElementById("input-room-name").value.trim();
    const isPublic = document.getElementById("input-room-public").checked;
    const chainLength = parseInt(document.getElementById("input-room-chain").value, 10);
    state.socket.emit("create_room", { name, isPublic, chainLength }, (res) => {
      if (!res.ok) return toast(res.error || "Eroare la crearea camerei.");
      state.room = res.room;
      renderLobby(res.room);
      showScreen("lobby");
    });
  });

  document.getElementById("btn-join-room").addEventListener("click", () => {
    const code = document.getElementById("input-join-code").value.trim().toUpperCase();
    if (!code) return toast("Introdu un cod de cameră.");
    joinRoom(code);
  });

  function joinRoom(code) {
    state.socket.emit("join_room", { code }, (res) => {
      if (!res.ok) return toast(res.error || "Nu s-a putut intra în cameră.");
      state.room = res.room;
      renderLobby(res.room);
      showScreen("lobby");
    });
  }

  document.querySelectorAll('[data-action="leave-room"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      if (state.socket) state.socket.emit("leave_room");
      state.room = null;
      showScreen("menu");
    });
  });

  // ------------------------------------------------------------------
  // ROOM UPDATES / LOBBY
  // ------------------------------------------------------------------
  function onRoomUpdate(room) {
    state.room = room;
    if (room.state === "lobby") {
      renderLobby(room);
      if (document.getElementById("screen-lobby").classList.contains("active") === false &&
          document.getElementById("screen-mp-hub").classList.contains("active") === false) {
        // ramai unde esti daca esti in joc deja (ex: cineva iese)
      }
    }
    if (room.state === "playing") renderSidebar(room);
  }

  function renderLobby(room) {
    document.getElementById("lobby-room-code").textContent = room.code;
    const wrap = document.getElementById("lobby-players");
    wrap.innerHTML = "";
    room.players.forEach((p, i) => {
      const row = document.createElement("div");
      row.className = "lobby-player-row";
      row.innerHTML = `
        <div class="avatar" style="background:${p.color}">${p.nickname.slice(0,1).toUpperCase()}</div>
        <div class="player-name-col">
          <div class="player-name-row">
            ${escapeHtml(p.nickname)} ${p.isHost ? '<span class="host-badge">HOST</span>' : ""}
          </div>
          <span class="muted" style="font-size:11.5px">${p.connected ? "Online" : "Deconectat"}</span>
        </div>
        <span class="${p.connected ? 'player-online-dot' : 'player-offline-dot'}"></span>
      `;
      wrap.appendChild(row);
    });
    for (let i = room.players.length; i < 4; i++) {
      const row = document.createElement("div");
      row.className = "lobby-player-row waiting-slot";
      row.innerHTML = `<div class="avatar" style="background:#333"></div><div class="player-name-col"><div class="player-name-row">Locul ${i+1} — Waiting...</div></div>`;
      wrap.appendChild(row);
    }

    const isHost = room.hostId === state.myId;
    const startBtn = document.getElementById("btn-start-game");
    const hint = document.getElementById("lobby-hint");
    if (isHost) {
      startBtn.classList.remove("hidden");
      startBtn.disabled = room.players.length < 2;
      hint.textContent = room.players.length < 2
        ? "Este nevoie de cel puțin 2 jucători pentru a începe."
        : "Poți începe partida oricând.";
    } else {
      startBtn.classList.add("hidden");
      hint.textContent = "Se așteaptă ca gazda să înceapă partida...";
    }
  }

  document.getElementById("btn-start-game").addEventListener("click", () => {
    state.socket.emit("start_game");
  });

  document.getElementById("btn-copy-code").addEventListener("click", () => {
    const code = document.getElementById("lobby-room-code").textContent;
    navigator.clipboard?.writeText(code).then(() => toast("Cod copiat!"));
  });

  // ------------------------------------------------------------------
  // WHEEL
  // ------------------------------------------------------------------
  function onWheelSpin({ order, winnerId }) {
    showScreen("wheel");
    const wrap = document.getElementById("wheel-names");
    const resultEl = document.getElementById("wheel-result");
    resultEl.classList.add("hidden");
    wrap.innerHTML = "";
    order.forEach((p) => {
      const el = document.createElement("div");
      el.className = "wheel-name-item";
      el.textContent = p.nickname;
      el.dataset.id = p.id;
      wrap.appendChild(el);
    });

    const items = Array.from(wrap.children);
    let cycles = 0;
    const totalCycles = items.length * 3 + items.findIndex((it) => it.dataset.id === winnerId) + 1;
    let idx = 0;
    let delay = 90;

    function step() {
      items.forEach((it) => it.classList.remove("highlight"));
      items[idx % items.length].classList.add("highlight");
      cycles++;
      idx++;
      if (cycles >= totalCycles) {
        const winnerName = order.find((p) => p.id === winnerId)?.nickname || "?";
        resultEl.textContent = `"${winnerName} începe runda!"`;
        resultEl.classList.remove("hidden");
        sfx.turn();
        return;
      }
      delay = delay + cycles * 2.2; // incetinire treptata
      setTimeout(step, delay);
    }
    step();
  }

  // ------------------------------------------------------------------
  // GAME SCREEN
  // ------------------------------------------------------------------
  const wordForm = document.getElementById("word-form");
  const inputWord = document.getElementById("input-word");
  const wordError = document.getElementById("word-error");

  function renderSidebar(room) {
    showScreen("game");
    document.getElementById("game-room-code").textContent = room.code;
    document.getElementById("game-round").textContent = "Runda " + room.round;
    const wrap = document.getElementById("players-sidebar");
    wrap.innerHTML = "";
    room.players.forEach((p) => {
      const el = document.createElement("div");
      el.className = "sidebar-player" + (p.alive ? "" : " eliminated");
      el.dataset.pid = p.id;
      const hearts = "❤️".repeat(p.lives) + "🖤".repeat(Math.max(0, 3 - p.lives));
      el.innerHTML = `
        <div class="avatar" style="background:${p.color}">${p.nickname.slice(0,1).toUpperCase()}</div>
        <div class="sidebar-player-info">
          <span class="sidebar-player-name">${escapeHtml(p.nickname)}${p.isBot ? " 🤖" : ""}</span>
          <span class="sidebar-lives">${p.alive ? hearts : '<span class="eliminated-tag">ELIMINAT</span>'}</span>
        </div>
      `;
      wrap.appendChild(el);
    });
  }

  function markCurrentTurn(playerId) {
    document.querySelectorAll(".sidebar-player").forEach((el) => {
      el.classList.toggle("current-turn", el.dataset.pid === playerId);
    });
  }

  function onTurnChanged(data) {
    showScreen("game");
    document.getElementById("game-round").textContent = "Runda " + data.round;
    markCurrentTurn(data.currentPlayerId);
    document.getElementById("last-word-display").textContent = data.lastWord ? data.lastWord.toUpperCase() : "—";
    document.getElementById("prefix-display").textContent = data.requiredPrefix ? data.requiredPrefix.toUpperCase() : "?";

    // BUG FIX: in singleplayer, jucatorul uman are id-ul fix "me" (vezi
    // startSingleplayer), nu id-ul de socket (state.myId) — comparatia veche
    // esua mereu si bloca definitiv caseta de input. In multiplayer real,
    // server-ul trimite id-uri de socket, deci acolo state.myId ramane corect.
    const isMe = state.sp ? data.currentPlayerId === "me" : data.currentPlayerId === state.myId;
    document.getElementById("game-turn-label").textContent = isMe
      ? "RÂNDUL TĂU!"
      : `Rândul lui ${playerNickname(data.currentPlayerId)}...`;
    wordError.classList.add("hidden");
    inputWord.value = "";
    inputWord.disabled = !isMe;
    clearTypingPreview();
    if (isMe) { inputWord.focus(); sfx.turn(); }

    state.turnEndsAt = data.turnEndsAt;
    startTimerLoop();
  }

  function playerNickname(id) {
    if (!state.room) return "?";
    const p = state.room.players.find((x) => x.id === id);
    return p ? p.nickname : "?";
  }

  // ------------------------------------------------------------------
  // TYPING PREVIEW — arata live ce scrie jucatorul curent (adversar in
  // multiplayer, sau botul in singleplayer), daca setarea e activata.
  // ------------------------------------------------------------------
  const typingPreviewEl = document.getElementById("typing-preview");
  function showTypingPreview(playerId, text) {
    if (playerId === state.myId && !state.sp) return; // nu ne aratam propriul text inapoi
    const name = state.sp ? "🤖 Bot" : playerNickname(playerId);
    if (!text) { clearTypingPreview(); return; }
    typingPreviewEl.textContent = `${name} scrie: ${text}`;
    typingPreviewEl.classList.remove("hidden");
  }
  function clearTypingPreview() {
    typingPreviewEl.textContent = "";
    typingPreviewEl.classList.add("hidden");
  }

  let typingThrottle = null;
  inputWord.addEventListener("input", () => {
    if (state.sp || !state.socket || inputWord.disabled) return;
    if (typingThrottle) return;
    typingThrottle = setTimeout(() => { typingThrottle = null; }, 150);
    state.socket.emit("typing", { text: inputWord.value });
  });

  function startTimerLoop() {
    clearInterval(state.timerInterval);
    const bar = document.getElementById("timer-bar");
    const text = document.getElementById("timer-text");
    const total = 15000;
    function tick() {
      const remaining = Math.max(0, state.turnEndsAt - Date.now());
      const pct = (remaining / total) * 100;
      bar.style.width = pct + "%";
      text.textContent = (remaining / 1000).toFixed(1) + "s";
      if (remaining <= 5000) bar.style.background = "var(--red)";
      else if (remaining <= 10000) bar.style.background = "var(--gold)";
      else bar.style.background = "var(--teal)";
      if (remaining <= 0) clearInterval(state.timerInterval);
    }
    tick();
    state.timerInterval = setInterval(tick, 100);
  }

  wordForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const word = inputWord.value.trim();
    if (!word) return;
    if (state.sp) {
      spSubmitWord(word);
      return;
    }
    state.socket.emit("typing", { text: "" });
    state.socket.emit("submit_word", { word });
    inputWord.disabled = true;
  });

  function onWordAccepted(data) {
    sfx.correct();
    document.getElementById("last-word-display").textContent = data.word.toUpperCase();
    wordError.classList.add("hidden");
  }

  function onWordRejected(data) {
    if (data.playerId !== state.myId) return;
    sfx.wrong();
    wordError.textContent = "❌ " + data.reason;
    wordError.classList.remove("hidden");
    inputWord.disabled = false;
    inputWord.focus();
  }

  function onLifeLost(data) {
    sfx.life();
    const el = document.querySelector(`.sidebar-player[data-pid="${data.playerId}"] .sidebar-lives`);
    if (el) {
      const hearts = "❤️".repeat(data.livesLeft) + "🖤".repeat(Math.max(0, 3 - data.livesLeft));
      el.innerHTML = hearts;
      el.classList.add("heart-lost");
      setTimeout(() => el.classList.remove("heart-lost"), 500);
    }
    if (data.playerId === state.myId) toast("Ai pierdut o viață!");
  }

  function onPlayerEliminated(data) {
    sfx.eliminated();
    if (state.settings.vibrate && navigator.vibrate) navigator.vibrate(data.playerId === state.myId ? [80, 40, 80] : 40);
    const el = document.querySelector(`.sidebar-player[data-pid="${data.playerId}"]`);
    if (el) el.classList.add("eliminated");
    toast(`${playerNickname(data.playerId)} a fost eliminat!`);
  }

  function onPlayerDisconnected(data) {
    const banner = document.getElementById("disconnect-banner");
    banner.textContent = `${data.nickname} s-a deconectat.`;
    banner.classList.remove("hidden");
    setTimeout(() => banner.classList.add("hidden"), 4000);
  }

  function onGameOver(data) {
    clearInterval(state.timerInterval);
    clearTypingPreview();
    showScreen("end");
    document.getElementById("end-winner-name").textContent = data.winnerNickname || "Egalitate";
    document.querySelector(".end-sub").textContent = data.winnerId ? "a câștigat partida!" : "Partida s-a încheiat.";
    const isWinner = data.winnerId === state.myId;
    if (isWinner) { sfx.win(); launchConfetti(); }

    const streakEl = document.getElementById("end-streak");
    streakEl.classList.add("hidden");
    if (state.sp) {
      if (data.spStreak > 1) {
        streakEl.textContent = `🔥 ${data.spStreak} victorii la rând!`;
        streakEl.classList.remove("hidden");
      }
    } else if (isWinner && !state.isGuest && state.email) {
      fetch("/api/profile?email=" + encodeURIComponent(state.email))
        .then((r) => (r.ok ? r.json() : null))
        .then((p) => {
          if (p && p.currentStreak > 1) {
            streakEl.textContent = `🔥 ${p.currentStreak} victorii la rând!`;
            streakEl.classList.remove("hidden");
          }
        })
        .catch(() => {});
    }

    const results = document.getElementById("end-results");
    results.innerHTML = "";
    data.results
      .sort((a, b) => b.won - a.won || b.wordsPlayed - a.wordsPlayed)
      .forEach((r) => {
        const row = document.createElement("div");
        row.className = "end-result-row" + (r.won ? " won" : "");
        row.innerHTML = `<span>${r.won ? "🏆 " : ""}${escapeHtml(r.nickname)}</span><span>${r.wordsPlayed} cuvinte · ${r.lives}❤️</span>`;
        results.appendChild(row);
      });
    document.getElementById("play-again-count").textContent = "";
  }

  document.getElementById("btn-play-again").addEventListener("click", () => {
    if (state.sp) { showScreen("sp-setup"); return; }
    state.socket.emit("play_again");
    toast("Ai votat pentru revanșă.");
  });
  document.getElementById("btn-leave-end").addEventListener("click", () => {
    if (state.socket) state.socket.emit("leave_room");
    state.sp = null;
    showScreen("menu");
  });

  // ------------------------------------------------------------------
  // QUIT DIN MECI — funcționează atât în multiplayer cât și singleplayer
  // ------------------------------------------------------------------
  document.getElementById("btn-quit-match").addEventListener("click", () => {
    if (!confirm("Sigur vrei să ieși din meci? Vei fi eliminat din partida curentă.")) return;
    clearInterval(state.timerInterval);
    clearTypingPreview();
    if (state.sp) {
      clearTimeout(state.sp.timeout);
      state.sp = null;
      showScreen("menu");
      toast("Ai ieșit din meci.");
      return;
    }
    if (state.socket) state.socket.emit("quit_match");
    showScreen("menu");
    toast("Ai ieșit din meci.");
  });

  // ------------------------------------------------------------------
  // SINGLEPLAYER (bots ruleaza local in browser, folosind dictionarul de pe server)
  // ------------------------------------------------------------------
  let spDifficulty = "medium";
  let spBotCount = 1;
  let spChainLength = 2;

  document.querySelectorAll("[data-diff]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-diff]").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      spDifficulty = btn.getAttribute("data-diff");
    });
  });
  document.querySelectorAll("[data-bots]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-bots]").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      spBotCount = parseInt(btn.getAttribute("data-bots"), 10);
    });
  });
  document.querySelectorAll("[data-chain]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-chain]").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      spChainLength = parseInt(btn.getAttribute("data-chain"), 10);
    });
  });
  document.querySelector('[data-diff="medium"]').classList.add("selected");
  document.querySelector('[data-bots="1"]').classList.add("selected");
  document.querySelector('[data-chain="2"]').classList.add("selected");

  async function ensureDictionary() {
    if (state.dictionaryWords.length) return;
    const res = await fetch("/api/dictionary");
    const data = await res.json();
    state.dictionaryWords = data.words;
    buildPrefixMap();
  }

  let PREFIX_MAPS = { 2: new Map(), 3: new Map(), 4: new Map() };
  const KNOWN_DEAD_ENDINGS = new Set(["nt", "mp", "ct", "pt", "xt", "ft"]);
  // Acelasi fix ca in data/dictionary.js: eliminam diacriticele la
  // comparatie, ca "măgar" si "magar" sa se potriveasca amandoua cu
  // intrarea din dictionar (care e scrisa fara diacritice).
  function normalizeWord(w) {
    return (w || "").toString().trim().toLowerCase()
      .replace(/[ăâ]/g, "a").replace(/î/g, "i")
      .replace(/[șş]/g, "s").replace(/[țţ]/g, "t")
      .replace(/[^a-z]/g, "");
  }
  function buildPrefixMap() {
    PREFIX_MAPS = { 2: new Map(), 3: new Map(), 4: new Map() };
    for (const n of [2, 3, 4]) {
      for (const w of state.dictionaryWords) {
        if (w.length < n) continue;
        const p = w.slice(0, n);
        if (!PREFIX_MAPS[n].has(p)) PREFIX_MAPS[n].set(p, []);
        PREFIX_MAPS[n].get(p).push(w);
      }
    }
  }
  function spEndsGame(word, chainLength) {
    const n = chainLength || 2;
    const lastN = word.slice(-n);
    if (lastN.length < n) return true;
    if (n === 2 && KNOWN_DEAD_ENDINGS.has(lastN)) return true;
    const cands = (PREFIX_MAPS[n].get(lastN) || []).filter((c) => c !== word);
    return cands.length === 0;
  }
  function spValidate(raw, prefix, used, chainLength) {
    const w = normalizeWord(raw);
    if (!w || w.length < 2) return { valid: false, reason: "Cuvantul trebuie sa aiba cel putin 2 litere." };
    if (!state.dictionaryWords.includes(w)) return { valid: false, reason: "Cuvantul nu a fost gasit in dictionar." };
    if (prefix && !w.startsWith(prefix)) return { valid: false, reason: `Cuvantul trebuie sa inceapa cu "${prefix.toUpperCase()}".` };
    if (used.has(w)) return { valid: false, reason: "Acest cuvant a fost deja folosit in aceasta partida." };
    if (spEndsGame(w, chainLength)) return { valid: false, reason: "Acest cuvant incheie jocul si nu este permis." };
    return { valid: true, normalized: w };
  }
  function spPickBotWord(prefix, used, difficulty, chainLength) {
    const n = chainLength || 2;
    let cands = prefix ? (PREFIX_MAPS[n].get(prefix) || []) : state.dictionaryWords;
    cands = cands.filter((w) => !used.has(w) && !spEndsGame(w, n));
    if (!cands.length) return null;
    const failChance = difficulty === "easy" ? 0.35 : difficulty === "medium" ? 0.12 : 0.02;
    if (Math.random() < failChance) return null;
    return cands[Math.floor(Math.random() * cands.length)];
  }

  document.getElementById("btn-start-sp").addEventListener("click", async () => {
    await ensureDictionary();
    startSingleplayer();
  });

  const BOT_NAMES = ["Bot Andrei", "Bot Elena", "Bot Radu", "Bot Ioana"];

  function startSingleplayer() {
    const players = [{ id: "me", nickname: state.nickname || "Tu", isBot: false, lives: 3, alive: true, color: "#7C5CFF", wordsThisMatch: 0 }];
    for (let i = 0; i < spBotCount; i++) {
      players.push({ id: "bot" + i, nickname: BOT_NAMES[i], isBot: true, lives: 3, alive: true, color: ["#3EDBB5","#FFB454","#FF6B9D"][i % 3], wordsThisMatch: 0 });
    }
    state.sp = {
      players,
      order: players.map((p) => p.id),
      currentIndex: 0,
      used: new Set(),
      lastWord: null,
      prefix: null,
      round: 1,
      difficulty: spDifficulty,
      chainLength: spChainLength,
      timeout: null,
    };
    state.room = {
      code: "SOLO",
      round: 1,
      players: players.map((p) => ({ ...p, connected: true, isHost: false })),
    };

    const winnerIdx = Math.floor(Math.random() * players.length);
    onWheelSpin({
      order: players.map((p) => ({ id: p.id, nickname: p.nickname })),
      winnerId: players[winnerIdx].id,
    });
    setTimeout(() => {
      state.sp.currentIndex = winnerIdx;
      renderSidebar(state.room);
      spStartTurn();
    }, 4300);
  }

  function spAlivePlayers() {
    return state.sp.order.map((id) => state.sp.players.find((p) => p.id === id)).filter((p) => p.alive);
  }
  function spNextAliveIndex(fromIndex) {
    const n = state.sp.order.length;
    for (let step = 1; step <= n; step++) {
      const idx = (fromIndex + step) % n;
      const p = state.sp.players.find((p) => p.id === state.sp.order[idx]);
      if (p && p.alive) return idx;
    }
    return -1;
  }

  function spStartTurn() {
    clearTimeout(state.sp.timeout);
    const currentId = state.sp.order[state.sp.currentIndex];
    const current = state.sp.players.find((p) => p.id === currentId);
    state.turnEndsAt = Date.now() + 15000;

    // "Turn token" - fiecare tura primeste un numar unic. Orice timer/callback
    // intarziat (bot care nu gaseste cuvant, typing-ul botului etc.) verifica
    // acest token inainte sa actioneze - daca nu mai corespunde turei curente,
    // e ignorat. Asta previne BUG-UL GRAV unde un timer "fantoma" ramas din
    // urma (de ex. cand botul nu gasea niciun cuvant valid) lovea cu
    // "Timpul a expirat!" un jucator complet diferit, mult mai tarziu,
    // provocand eliminari in cascada dupa multe runde.
    state.sp.turnToken = (state.sp.turnToken || 0) + 1;
    const myToken = state.sp.turnToken;

    onTurnChanged({
      currentPlayerId: currentId,
      lastWord: state.sp.lastWord,
      requiredPrefix: state.sp.prefix,
      turnEndsAt: state.turnEndsAt,
      round: state.sp.round,
    });

    state.sp.timeout = setTimeout(() => {
      if (state.sp.turnToken !== myToken) return; // timer expirat pentru o tura care nu mai e curenta
      spHandleTimeout();
    }, 15300);

    if (current.isBot) {
      // Bot "se gandeste" putin inainte sa inceapa (nu raspunde instant),
      // apoi scrie vizibil litera cu litera - tot procesul dureaza sub 3s.
      const thinkDelay = 900 + Math.random() * 900;
      setTimeout(() => {
        if (state.sp.turnToken === myToken) spBotStartTyping(current, myToken);
      }, thinkDelay);
    }
  }

  function spBotStartTyping(bot, token) {
    if (state.sp.turnToken !== token) return;
    if (state.sp.order[state.sp.currentIndex] !== bot.id) return;
    const word = spPickBotWord(state.sp.prefix, state.sp.used, state.sp.difficulty, state.sp.chainLength);
    if (!word) {
      // FIX: inainte, aici lipsea acest clearTimeout - timer-ul normal de
      // 15s ramanea sa "atarne" si lovea mai tarziu un jucator gresit.
      clearTimeout(state.sp.timeout);
      spHandleTimeout();
      return;
    }

    const totalTypingMs = Math.min(1400, 110 * word.length);
    const perLetter = totalTypingMs / word.length;
    let shown = "";
    let i = 0;
    const typer = setInterval(() => {
      if (state.sp.turnToken !== token || state.sp.order[state.sp.currentIndex] !== bot.id) {
        clearInterval(typer);
        return;
      }
      shown += word[i];
      i++;
      if (state.settings.typingPreview) showTypingPreview(bot.id, shown);
      if (i >= word.length) {
        clearInterval(typer);
        setTimeout(() => {
          if (state.sp.turnToken !== token) return;
          clearTypingPreview();
          if (state.sp.order[state.sp.currentIndex] === bot.id) spSubmitWordInternal(bot.id, word);
        }, 150);
      }
    }, Math.max(40, perLetter));
  }

  function spHandleTimeout() {
    const currentId = state.sp.order[state.sp.currentIndex];
    const current = state.sp.players.find((p) => p.id === currentId);
    toast("Timpul a expirat!");
    spLoseLife(current);
  }

  function spLoseLife(player) {
    player.lives -= 1;
    onLifeLost({ playerId: player.id, livesLeft: player.lives });
    if (player.lives <= 0) {
      player.alive = false;
      onPlayerEliminated({ playerId: player.id });
    }
    const survivors = spAlivePlayers();
    if (survivors.length <= 1) return spEndGame(survivors[0] || null);
    spAdvanceTurn();
  }

  function spAdvanceTurn() {
    const nextIdx = spNextAliveIndex(state.sp.currentIndex);
    if (nextIdx === -1) return spEndGame(spAlivePlayers()[0] || null);
    state.sp.currentIndex = nextIdx;
    state.sp.round += 1;
    spStartTurn();
  }

  function spSubmitWord(raw) {
    spSubmitWordInternal("me", raw);
  }

  function spSubmitWordInternal(playerId, raw) {
    const currentId = state.sp.order[state.sp.currentIndex];
    if (currentId !== playerId) return;
    const player = state.sp.players.find((p) => p.id === playerId);
    const result = spValidate(raw, state.sp.prefix, state.sp.used, state.sp.chainLength);
    if (!result.valid) {
      onWordRejected({ playerId, reason: result.reason });
      return;
    }
    clearTimeout(state.sp.timeout);
    state.sp.used.add(result.normalized);
    state.sp.lastWord = result.normalized;
    state.sp.prefix = result.normalized.slice(-(state.sp.chainLength || 2));
    player.wordsThisMatch += 1;
    onWordAccepted({ word: result.normalized });
    spAdvanceTurn();
  }

  function spEndGame(winner) {
    clearTimeout(state.sp.timeout);
    const iWon = winner && winner.id === "me";
    const prevStreak = parseInt(localStorage.getItem("fazan_sp_streak") || "0", 10);
    const newStreak = iWon ? prevStreak + 1 : 0;
    localStorage.setItem("fazan_sp_streak", String(newStreak));

    // Raporteaza rezultatul catre server, ca profilul (meciuri/victorii/
    // win rate) sa se actualizeze si pentru Singleplayer, nu doar Multiplayer -
    // singleplayer rulează integral local si altfel serverul n-ar afla niciodata.
    if (!state.isGuest && state.token) {
      const me = state.sp.players.find((p) => p.id === "me");
      fetch("/api/record-singleplayer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: state.token, won: iWon, wordsPlayed: me ? me.wordsThisMatch : 0 }),
      }).catch((err) => console.error("Nu am putut salva rezultatul pe server:", err));
    }

    onGameOver({
      winnerId: winner ? winner.id : null,
      winnerNickname: winner ? winner.nickname : null,
      spStreak: iWon ? newStreak : 0,
      results: state.sp.players.map((p) => ({
        id: p.id, nickname: p.nickname, lives: p.lives, alive: p.alive,
        wordsPlayed: p.wordsThisMatch, won: winner ? p.id === winner.id : false,
      })),
    });
  }

  // ------------------------------------------------------------------
  // LEADERBOARD / PROFILE / SETTINGS
  // ------------------------------------------------------------------
  async function loadLeaderboard() {
    const root = document.getElementById("leaderboard-list");
    root.innerHTML = `<p class="muted" style="padding:16px">Se încarcă...</p>`;
    try {
      const res = await fetch("/api/leaderboard");
      const data = await res.json();
      if (!data.leaderboard.length) {
        root.innerHTML = `<p class="muted" style="padding:16px">Niciun rezultat încă. Joacă o partidă autentificat cu email!</p>`;
        return;
      }
      root.innerHTML = "";
      const medals = ["🥇", "🥈", "🥉"];
      data.leaderboard.forEach((p, i) => {
        const row = document.createElement("div");
        row.className = "lb-row" + (i < 3 ? " top" + (i + 1) : "");
        row.innerHTML = `
          <span class="lb-rank">${i < 3 ? medals[i] : "#" + (i + 1)}</span>
          <span class="lb-name">${escapeHtml(p.nickname)}</span>
          <span class="lb-stat">${p.wins}V / ${p.matches}M</span>
          <span class="lb-stat">${p.winRate}%</span>
          <span class="lb-stat"><b>${p.score}</b> pct</span>
        `;
        root.appendChild(row);
      });
    } catch (e) {
      root.innerHTML = `<p class="muted" style="padding:16px">Nu s-a putut încărca leaderboard-ul.</p>`;
    }
  }

  async function loadProfile() {
    const root = document.getElementById("profile-content");
    if (!state.email) {
      root.innerHTML = `<p class="muted">Joci ca invitat — conectează-te cu un email din ecranul de start pentru a-ți salva statisticile.</p>`;
      return;
    }
    root.innerHTML = `<p class="muted">Se încarcă...</p>`;
    try {
      const res = await fetch("/api/profile?email=" + encodeURIComponent(state.email));
      if (!res.ok) {
        root.innerHTML = `<p class="muted">Nu ai jucat încă nicio partidă autentificat. Joacă una și revino aici!</p>`;
        return;
      }
      const p = await res.json();
      root.innerHTML = `
        <div class="profile-stat-row"><span>Nickname</span><b>${escapeHtml(p.nickname)}</b></div>
        <div class="profile-stat-row"><span>Meciuri jucate</span><b>${p.matches}</b></div>
        <div class="profile-stat-row"><span>Victorii</span><b>${p.wins}</b></div>
        <div class="profile-stat-row"><span>Înfrângeri</span><b>${p.losses}</b></div>
        <div class="profile-stat-row"><span>Win rate</span><b>${p.winRate}%</b></div>
        <div class="profile-stat-row"><span>Cel mai lung șir de victorii</span><b>${p.bestStreak}</b></div>
        <div class="profile-stat-row"><span>Cuvinte jucate total</span><b>${p.wordsPlayed}</b></div>
        <div class="profile-stat-row"><span>Punctaj total</span><b>${p.score}</b></div>
      `;
    } catch (e) {
      root.innerHTML = `<p class="muted">Eroare la încărcarea profilului.</p>`;
    }
  }

  document.getElementById("setting-sound").checked = state.settings.sound;
  document.getElementById("setting-anim").checked = state.settings.anim;
  document.getElementById("setting-sound").addEventListener("change", (e) => {
    state.settings.sound = e.target.checked;
    localStorage.setItem("fazan_sound", e.target.checked ? "1" : "0");
  });
  document.getElementById("setting-anim").addEventListener("change", (e) => {
    state.settings.anim = e.target.checked;
    localStorage.setItem("fazan_anim", e.target.checked ? "1" : "0");
  });

  // toggle: arata live ce scrie adversarul/botul
  state.settings.typingPreview = localStorage.getItem("fazan_typing_preview") !== "0";
  const settingTyping = document.getElementById("setting-typing");
  settingTyping.checked = state.settings.typingPreview;
  settingTyping.addEventListener("change", (e) => {
    state.settings.typingPreview = e.target.checked;
    localStorage.setItem("fazan_typing_preview", e.target.checked ? "1" : "0");
    if (!e.target.checked) clearTypingPreview();
  });

  // volum (afecteaza toate sunetele generate cu Web Audio API)
  state.settings.volume = parseInt(localStorage.getItem("fazan_volume") || "70", 10);
  const settingVolume = document.getElementById("setting-volume");
  settingVolume.value = state.settings.volume;
  settingVolume.addEventListener("input", (e) => {
    state.settings.volume = parseInt(e.target.value, 10);
    localStorage.setItem("fazan_volume", e.target.value);
  });

  // tema de culoare accent (pur vizual - schimba gradientul principal)
  const THEME_COLORS = {
    violet: { c1: "#7C5CFF", c2: "#5B8CFF" },
    teal: { c1: "#3EDBB5", c2: "#2FB89A" },
    gold: { c1: "#FFB454", c2: "#FF8A54" },
    pink: { c1: "#FF6B9D", c2: "#FF5C7A" },
  };
  function applyTheme(name) {
    const t = THEME_COLORS[name] || THEME_COLORS.violet;
    document.documentElement.style.setProperty("--violet", t.c1);
    document.documentElement.style.setProperty("--violet-2", t.c2);
    document.querySelectorAll("#theme-swatches .theme-swatch").forEach((el) => {
      el.classList.toggle("active", el.dataset.theme === name);
    });
    localStorage.setItem("fazan_theme", name);
  }
  document.querySelectorAll("#theme-swatches .theme-swatch").forEach((el) => {
    el.addEventListener("click", () => applyTheme(el.dataset.theme));
  });
  applyTheme(localStorage.getItem("fazan_theme") || "violet");

  // fundal de joc (particule / litere plutitoare / dezactivat)
  function applyBgMode(mode) {
    state.settings.bgMode = mode;
    localStorage.setItem("fazan_bg_mode", mode);
    document.querySelectorAll("#bg-theme-swatches .bg-swatch").forEach((el) => {
      el.classList.toggle("active", el.dataset.bg === mode);
    });
    if (window.__respawnBg) window.__respawnBg();
  }
  document.querySelectorAll("#bg-theme-swatches .bg-swatch").forEach((el) => {
    el.addEventListener("click", () => applyBgMode(el.dataset.bg));
  });
  applyBgMode(state.settings.bgMode);

  // vibrare la eliminare (daca dispozitivul suporta), timer marit, si
  // reduce-motion manual (in plus fata de cel al sistemului de operare)
  state.settings.vibrate = localStorage.getItem("fazan_vibrate") === "1";
  state.settings.bigTimer = localStorage.getItem("fazan_bigtimer") === "1";
  state.settings.reducedMotion = localStorage.getItem("fazan_reduced_motion") === "1";
  const settingVibrate = document.getElementById("setting-vibrate");
  const settingBigTimer = document.getElementById("setting-bigtimer");
  const settingReducedMotion = document.getElementById("setting-reduced-motion");
  if (!("vibrate" in navigator)) {
    settingVibrate.disabled = true;
    settingVibrate.closest(".switch-row").querySelector("span").textContent += " (indisponibil pe acest dispozitiv)";
  }
  settingVibrate.checked = state.settings.vibrate;
  settingVibrate.addEventListener("change", (e) => {
    state.settings.vibrate = e.target.checked;
    localStorage.setItem("fazan_vibrate", e.target.checked ? "1" : "0");
  });
  settingBigTimer.checked = state.settings.bigTimer;
  settingBigTimer.addEventListener("change", (e) => {
    state.settings.bigTimer = e.target.checked;
    localStorage.setItem("fazan_bigtimer", e.target.checked ? "1" : "0");
    document.body.classList.toggle("big-timer", e.target.checked);
  });
  document.body.classList.toggle("big-timer", state.settings.bigTimer);
  settingReducedMotion.checked = state.settings.reducedMotion;
  settingReducedMotion.addEventListener("change", (e) => {
    state.settings.reducedMotion = e.target.checked;
    localStorage.setItem("fazan_reduced_motion", e.target.checked ? "1" : "0");
    document.body.classList.toggle("force-reduced-motion", e.target.checked);
  });
  document.body.classList.toggle("force-reduced-motion", state.settings.reducedMotion);

  // ------------------------------------------------------------------
  // utilitare
  // ------------------------------------------------------------------
  function escapeHtml(str) {
    return (str || "").toString()
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // preincarca dictionarul pentru singleplayer instant
  ensureDictionary();

  // Badge "last updated" - arata cand a pornit ultima oara serverul (adica,
  // practic, ultimul deploy - pe Render un redeploy inseamna intotdeauna un
  // restart al procesului). Se actualizeaza periodic, ca sa fie "activ".
  function fmtRelativeTime(iso) {
    const diffMs = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return "chiar acum";
    if (mins < 60) return `acum ${mins} min`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `acum ${hrs}h`;
    const days = Math.floor(hrs / 24);
    return `acum ${days}z`;
  }
  let __lastUpdatedIso = null;
  function refreshLastUpdatedBadge() {
    const el = document.getElementById("last-updated-text");
    if (!el) return;
    if (__lastUpdatedIso) {
      const d = new Date(__lastUpdatedIso);
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yyyy = d.getFullYear();
      el.textContent = `Last updated ${dd}.${mm}.${yyyy} · ${fmtRelativeTime(__lastUpdatedIso)}`;
    }
  }
  fetch("/api/meta")
    .then((r) => r.json())
    .then((data) => {
      __lastUpdatedIso = data.serverStartedAt;
      refreshLastUpdatedBadge();
    })
    .catch(() => {
      const el = document.getElementById("last-updated-text");
      if (el) el.textContent = "offline";
    });
  setInterval(refreshLastUpdatedBadge, 30000);
})();
