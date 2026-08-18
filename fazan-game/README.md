# 🐦 FAZAN — jocul românesc de cuvinte

Aplicație completă (backend + frontend) pentru jocul de cuvinte „Fazan”:
singleplayer cu boți, multiplayer în timp real (camere de până la 4 jucători),
roata de start, timer de 15 secunde, sistem de 3 vieți, validare de cuvinte
românești, leaderboard și profil.

**Stack:** Node.js + Express + Socket.IO (server) și HTML/CSS/JS simplu, fără
build step (client). Un singur serviciu web — asta face deploy-ul foarte simplu.

---

## 1. Structura proiectului

```
fazan-game/
├── server.js              ← serverul (Express + Socket.IO + logica jocului)
├── data/
│   ├── dictionary.js       ← lista de cuvinte românești + validare
│   └── players.json        ← (se creează automat) statistici jucători
├── public/                 ← tot ce vede browserul
│   ├── index.html
│   ├── css/style.css
│   └── js/app.js
├── package.json
├── render.yaml              ← configurare deploy automat pe Render
└── .gitignore
```

---

## 2. Cum rulezi proiectul LOCAL (pe calculatorul tău)

### Pasul 1 — Instalează Node.js
Descarcă și instalează versiunea LTS de aici: https://nodejs.org
Verifică instalarea:
```bash
node -v
npm -v
```

### Pasul 2 — Instalează dependențele
Deschide un terminal în folderul `fazan-game` și rulează:
```bash
npm install
```

### Pasul 3 — Pornește serverul
```bash
npm start
```
Vei vedea în terminal: `Fazan server ruleaza pe portul 3000`.

### Pasul 4 — Deschide jocul
Deschide browserul la: **http://localhost:3000**

Pentru a testa multiplayer-ul, deschide site-ul în 2-3 taburi/browsere diferite
(sau pe telefon, conectat la același Wi-Fi, folosind IP-ul calculatorului, ex.
`http://192.168.1.10:3000`).

---

## 3. Cum urci proiectul pe GitHub (de la zero)

### Pasul 1 — Creează un cont GitHub
Dacă nu ai deja unul: https://github.com/join

### Pasul 2 — Creează un repository nou
1. Intră pe https://github.com/new
2. Nume repository: `fazan-game` (sau ce nume vrei)
3. Alege **Public** sau **Private**
4. NU bifa „Add a README" (avem deja unul)
5. Apasă **Create repository**
6. GitHub îți va afișa o pagină cu comenzi — le vei folosi mai jos

### Pasul 3 — Instalează Git (dacă nu îl ai)
Descarcă de aici: https://git-scm.com/downloads

### Pasul 4 — Urcă proiectul
Deschide un terminal în folderul `fazan-game` și rulează, pe rând:

```bash
git init
git add .
git commit -m "Primul commit - Fazan game"
git branch -M main
git remote add origin https://github.com/NUMELE_TAU/fazan-game.git
git push -u origin main
```

Înlocuiește `NUMELE_TAU` cu username-ul tău de GitHub și `fazan-game` cu
numele exact al repository-ului creat mai sus (link-ul apare pe pagina
repository-ului, buton „Code" → HTTPS).

Dacă ți se cere autentificare, GitHub nu mai acceptă parola clasică — vei avea
nevoie de un **Personal Access Token**: Settings → Developer settings →
Personal access tokens → Generate new token (bifează `repo`), și folosește
acel token în loc de parolă când ți se cere.

De acum înainte, orice modificare o urci cu:
```bash
git add .
git commit -m "descriere modificare"
git push
```

---

## 4. Cum faci deploy pe Render.com (de la zero)

### Pasul 1 — Creează un cont Render
Intră pe https://render.com și creează un cont (poți folosi „Sign up with GitHub”,
ceea ce simplifică pasul următor).

### Pasul 2 — Conectează contul de GitHub
Dacă nu te-ai înregistrat direct cu GitHub, mergi în Dashboard → Account
Settings → GitHub → **Connect account** și autorizează Render să vadă
repository-urile tale (poți alege „All repositories” sau doar `fazan-game`).

### Pasul 3 — Creează un Web Service nou
1. În Dashboard Render, apasă **New +** → **Web Service**
2. Alege repository-ul `fazan-game` din listă (dacă nu apare, apasă
   „Configure account” și dă acces la el)
3. Completează:
   - **Name**: `fazan-game` (va face parte din URL-ul final)
   - **Region**: alege cea mai apropiată de tine (ex. Frankfurt pentru Europa)
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free` (suficient pentru testare; are limitări — vezi mai jos)
4. Apasă **Create Web Service**

Render va face automat: clonare repo → `npm install` → `npm start`. După 1-3
minute, aplicația va fi live la o adresă de forma:

```
https://fazan-game.onrender.com
```

Acesta e link-ul pe care îl poți trimite prietenilor pentru a juca!

> **Alternativă mai rapidă:** dacă ai fișierul `render.yaml` (inclus în acest
> proiect) în repository, poți folosi **New +** → **Blueprint** în loc de
> „Web Service”, iar Render va citi automat configurația din `render.yaml`.

### Pasul 4 — Actualizări automate
De fiecare dată când faci `git push` pe branch-ul `main`, Render redeployază
automat aplicația (poți opri asta din Settings → Auto-Deploy dacă vrei control manual).

### Limitări importante ale planului Free de pe Render
- Serverul „adoarme” după ~15 minute de inactivitate și durează ~30-50s să
  „se trezească” la următoarea vizită (prima persoană care intră vede o
  întârziere).
- **Discul este efemer**: fișierul `data/players.json` (leaderboard/profile)
  se **resetează** la fiecare redeploy sau repornire. Pentru statistici
  persistente reale, vezi secțiunea 6 mai jos (bază de date).
- Nu are HTTPS custom domain gratuit ilimitat, dar subdomeniul
  `.onrender.com` vine cu HTTPS automat, deci ești acoperit.

---

## 5. Extinderea dictionarului de cuvinte (recomandat pentru productie)

Fișierul `data/dictionary.js` conține ~900 de cuvinte românești comune —
suficient pentru a juca, dar nu un dicționar complet. Pentru o experiență
mai bogată:

1. Descarcă un dicționar Hunspell românesc complet, de exemplu din
   repository-ul LibreOffice: https://github.com/LibreOffice/dictionaries
   (folderul `ro_RO`, fișierul `ro_RO.dic`)
2. Fișierul `.dic` are pe fiecare linie `cuvant/coduri_afix` — extrage doar
   partea de dinaintea lui `/` cu un script simplu (Python/Node), rezultând
   un cuvânt pe linie.
3. Înlocuiește array-ul `RAW_WORDS` din `data/dictionary.js` cu noua listă
   (poți încărca un fișier `.txt` cu `fs.readFileSync` și `.split("\n")` în
   loc să ții totul într-un array uriaș în cod).
4. Restul logicii (normalizare, prefix map, validare) rămâne neschimbată.

---

## 6. Persistență reală (opțional, pentru productie serioasă)

În versiunea curentă, leaderboard-ul și profilul sunt salvate într-un fișier
JSON pe disc (`data/players.json`) — simplu, dar **nu rezistă la redeploy pe
Render free tier** (disc efemer). Pentru productie:

- Adaugă o bază de date gratuită: **Render Postgres** (din Dashboard → New +
  → PostgreSQL) sau un serviciu extern (Supabase, Neon, MongoDB Atlas — toate
  au un tier gratuit).
- Înlocuiește funcțiile `loadPlayers` / `savePlayers` / `getOrCreateProfile`
  din `server.js` cu interogări către baza de date, în loc de citire/scriere
  de fișier.
- Autentificarea actuală (doar email, fără parolă) este o soluție **demo**.
  Pentru autentificare reală și sigură, integrează un provider precum
  Auth0, Clerk, sau Supabase Auth.

---

## 7. Ce face deja aplicația (complet funcțional)

- ✅ Ecran de welcome cu nickname + login opțional cu email (fără parolă, demo)
- ✅ Meniu principal cu toate cele 5 secțiuni
- ✅ Singleplayer cu 3 dificultăți și 1-3 boți (rulează local în browser)
- ✅ Multiplayer real-time: create room (cod unic gen. `FAZAN-XXXX`), join
  by code, camere publice cu listă live, limită strictă de 4 jucători
- ✅ Lobby cu jucători live, host, buton Start (min. 2 jucători)
- ✅ Roată animată de selecție a primului jucător
- ✅ Reguli Fazan complete: prefix de 2 litere, validare în dicționar,
  fără cuvinte repetate, blocarea cuvintelor „fără ieșire” (dead-end),
  diacritice românești normalizate corect (ă, â, î, ș, ț + variante ş/ţ)
- ✅ Timer de 15s cu culori (verde/galben/roșu) sincronizat pe server
- ✅ Sistem de 3 vieți, eliminare, victorie cu confetti
- ✅ Reconectare (dacă pierzi conexiunea, ai loc de reconectare rapidă
  înainte de a fi declarat time-out)
- ✅ Leaderboard live + pagină de profil cu statistici
- ✅ Sunete (Web Audio API, fără fișiere externe) și animații, ambele
  togglable din Settings
- ✅ Complet responsive (desktop/tabletă/telefon)
- ✅ Validarea cuvintelor + toată logica de joc rulează **pe server**
  pentru multiplayer (nu doar în browser), pentru a preveni cheating-ul

## 8. Limitări cunoscute / pentru viitor

- Dicționarul de bază are ~900 de cuvinte (vezi secțiunea 5 pentru extindere)
- Autentificarea e simplificată (fără parolă) — nu o folosi „ca atare” pentru
  date sensibile
- Statisticile se pierd la redeploy pe Render free tier fără o bază de date
  reală (vezi secțiunea 6)
- Room-urile și partidele trăiesc în memoria serverului: dacă serverul
  repornește (redeploy, crash), room-urile active se pierd — jucătorii ar
  trebui să creeze o cameră nouă

---

Distracție plăcută! 🎮🐦
