// data/dictionary.js
// Lista de cuvinte romanesti folosita pentru validarea jocului Fazan.
//
// IMPORTANT: aceasta este o lista de baza (~900 de cuvinte comune), suficienta
// pentru un joc functional, dar NU este un dictionar complet al limbii romane.
// Pentru productie, recomandam extinderea acestei liste cu un dictionar
// hunspell ro_RO complet (vezi instructiunile din README.md, sectiunea
// "Extinderea dictionarului").
//
// Formatul: un array simplu de string-uri, litere mici, cu diacritice.

const RAW_WORDS = [
  // animale
  "pisica","caine","lup","urs","vulpe","iepure","cerb","capra","oaie","porc",
  "vaca","cal","magar","gaina","cocos","rata","gasca","curcan","albina","furnica",
  "fluture","broasca","sarpe","soparla","pestera","peste","rechin","balena","delfin",
  "elefant","girafa","zebra","leu","tigru","panda","maimuta","gorila","cangur",
  "struts","pinguin","vultur","soim","bufnita","cioara","vrabie","randunica",
  "barza","pelican","crocodil","testoasa","aricel","veverita","hamster","sobolan",
  "sarpele","insecta","paianjen","scorpion","viespe","greier","libelula","gandac",
  "melc","rac","crab","stridie","caracatita","calmar","meduza","focă","morsa",
  // natura
  "munte","padure","camp","deal","vale","rau","lac","mare","ocean","insula",
  "plaja","desert","stanca","pestera","izvor","cascada","copac","frunza","radacina",
  "ramura","floare","iarba","planta","semanta","fruct","legume","gradina","livada",
  "vie","strugure","mar","para","piersica","cireasa","visina","prune","caisa",
  "portocala","lamaie","banana","ananas","pepene","capsuna","zmeura","afina",
  "nuca","alune","migdale","castane","ciuperca","muschi","licheni","stejar","brad",
  "salcie","plop","fag","tei","arin","mesteacan","salcam","nisip","pietris",
  "argila","lut","piatra","bolovan","minereu","aur","argint","fier","cupru",
  "otel","bronz","aluminiu","carbune","petrol","gaz","apa","aer","foc","pamant",
  "vant","furtuna","ploaie","ninsoare","zapada","gheata","bruma","roua","ceata",
  "nor","curcubeu","fulger","tunet","soare","luna","stea","planeta","cometa",
  "galaxie","univers","cer","orizont",
  // corp
  "cap","frunte","ochi","spranceana","gene","nas","gura","buze","dinte","limba",
  "obraz","barbie","urechi","gat","umar","brat","cot","mana","palma","deget",
  "unghii","piept","spate","burta","talie","sold","picior","genunchi","glezna",
  "calcai","talpa","inima","plamani","ficat","rinichi","stomac","creier","oase",
  "muschi","piele","par","sange","vena","nerv",
  // familie
  "mama","tata","frate","sora","bunic","bunica","nepot","nepoata","unchi",
  "matusa","varul","verisoara","cumnat","cumnata","socru","soacra","ginere",
  "nora","sot","sotie","copil","fiu","fiica","prieten","prietena","vecin",
  "vecina","coleg","colega","sef","angajat",
  // mancare si bucatarie
  "paine","unt","branza","lapte","iaurt","oua","ulei","otet","sare","zahar",
  "faina","orez","paste","cartofi","ceapa","usturoi","morcov","varza","salata",
  "rosii","castraveti","ardei","dovleac","vinete","mazare","fasole","linte",
  "carne","pui","vita","porc","miel","peste","supa","ciorba","tocana","friptura",
  "salam","costita","sunca","carnati","chiftele","sarmale","placinta","cozonac",
  "tort","prajitura","inghetata","ciocolata","bomboane","biscuiti","cafea","ceai",
  "suc","apa","vin","bere","must","miere","dulceata","gem","condimente","piper",
  "boia","cimbru","busuioc","patrunjel","marar","leustean","tarhon","scortisoara",
  "vanilie","masa","farfurie","lingura","furculita","cutit","pahar","cana","oala",
  "tigaie","cuptor","frigider","aragaz",
  // obiecte si casa
  "casa","apartament","camera","bucatarie","baie","dormitor","living","hol",
  "usa","fereastra","perete","tavan","podea","scara","balcon","acoperis",
  "gard","curte","gradina","garaj","mobila","pat","dulap","scaun","canapea",
  "birou","lampa","oglinda","covor","perna","patura","cearceaf","prosop",
  "sapun","sampon","periuta","pieptene","telefon","calculator","laptop",
  "televizor","radio","ceas","carte","caiet","pix","creion","guma","hartie",
  "foarfeca","lipici","rucsac","geanta","portofel","cheie","umbrela","ochelari",
  "palarie","caciula","fular","manusi","haina","tricou","pantaloni","fusta",
  "rochie","camasa","pulover","sacou","pantofi","ghete","sandale","ciorapi",
  "bijuterii","inel","cercei","colier","bratara","ceas",
  // orase, tari, geografie
  "romania","bucuresti","cluj","timisoara","iasi","brasov","constanta","sibiu",
  "oradea","craiova","galati","ploiesti","arad","pitesti","suceava","targu",
  "franta","paris","italia","roma","spania","madrid","germania","berlin",
  "anglia","londra","america","canada","japonia","china","india","egipt",
  "grecia","turcia","rusia","ucraina","polonia","austria","elvetia","olanda",
  "belgia","portugalia","suedia","norvegia","finlanda","danemarca","ungaria",
  "bulgaria","serbia","croatia","continent","europa","asia","africa","oceania",
  // verbe (infinitiv/forme comune)
  "alerga","merge","sta","veni","pleca","intra","iesi","urca","cobora","sari",
  "cadea","ridica","aduce","duce","lua","pune","scoate","baga","deschide",
  "inchide","spune","vorbi","asculta","auzi","vedea","privi","uita","gasi",
  "pierde","castiga","juca","canta","dansa","desena","scrie","citi","invata",
  "preda","intreba","raspunde","gandi","visa","dormi","trezi","spala","curata",
  "gati","manca","bea","mesteca","inghiti","respira","zambi","rade","plange",
  "striga","sopti","tacere","chema","striga","construi","distruge","repara",
  "vinde","cumpara","plati","imprumuta","dona","daruii","primi","trimite",
  "astepta","cauta","gasi","pierde","uita","aminti","promite","incepe",
  "termina","continua","opri","schimba","ajuta","salva","proteja","atac",
  "aparare","invinge","pierde","alege","decide","hotara","incerca","reusi",
  "esua","invata","preda","studia","examina","cerceta","descoperi","inventa",
  "crea","imagina","planui","organiza","conduce","zbura","inota","patina",
  "sari","catara","invarti","roti","impinge","trage","arunca","prinde",
  "lovi","atinge","apasa","tine","elibera","lega","dezlega","masura",
  // adjective
  "mare","mic","inalt","scund","gros","subtire","lung","scurt","larg",
  "ingust","greu","usor","tare","moale","fierbinte","rece","cald","rece",
  "uscat","umed","curat","murdar","nou","vechi","tanar","batran","frumos",
  "urat","bun","rau","fericit","trist","vesel","suparat","calm","agitat",
  "puternic","slab","sanatos","bolnav","obosit","odihnit","rapid","lent",
  "usor","dificil","simplu","complex","interesant","plictisitor","ieftin",
  "scump","liber","ocupat","gol","plin","deschis","inchis","aproape",
  "departe","sus","jos","stanga","dreapta","drept","strambe","curbat",
  "neted","aspru","stralucitor","intunecat","luminos","colorat","alb",
  "negru","rosu","verde","albastru","galben","portocaliu","violet","roz",
  "gri","maro","auriu","argintiu",
  // timp
  "luni","marti","miercuri","joi","vineri","sambata","duminica","ianuarie",
  "februarie","martie","aprilie","mai","iunie","iulie","august","septembrie",
  "octombrie","noiembrie","decembrie","primavara","vara","toamna","iarna",
  "dimineata","pranz","seara","noapte","ora","minut","secunda","saptamana",
  "luna","an","secol","moment","clipa","viitor","trecut","prezent","astazi",
  "maine","ieri","curand","tarziu","devreme",
  // scoala si munca
  "scoala","liceu","facultate","universitate","profesor","invatator","elev",
  "student","director","clasa","banca","tabla","catalog","lectie","tema",
  "examen","test","nota","diploma","materie","matematica","fizica","chimie",
  "biologie","istorie","geografie","literatura","gramatica","vocabular",
  "birou","fabrica","atelier","magazin","piata","banca","spital","clinica",
  "farmacie","politie","pompieri","armata","aeroport","gara","port","hotel",
  "restaurant","cafenea","biblioteca","muzeu","teatru","cinema","stadion",
  "parc","zoo",
  // transport
  "masina","autobuz","tramvai","metrou","tren","avion","vapor","barca",
  "bicicleta","motocicleta","camion","taxi","sofer","pilot","calator",
  "bilet","drum","strada","sosea","autostrada","pod","tunel","intersectie",
  "semafor","trotuar","parcare","benzinarie","volan","roata","motor",
  "frana","far","claxon",
  // sport si joc
  "fotbal","baschet","volei","tenis","inot","atletism","gimnastica","box",
  "lupte","judo","karate","ciclism","schi","patinaj","sah","carti","zaruri",
  "puzzle","joc","jucarie","minge","poarta","fileu","racheta","echipa",
  "antrenor","arbitru","meci","turneu","campionat","medalie","cupa","trofeu",
  "victorie","infrangere","remiza","scor","gol","punct",
  // altele diverse
  "idee","gand","vis","dorinta","speranta","teama","frica","curaj","iubire",
  "ura","bucurie","tristete","furie","surpriza","secret","adevar","minciuna",
  "poveste","legenda","mit","basm","poezie","cantec","muzica","instrument",
  "pian","vioara","chitara","tobe","fluier","trompeta","voce","sunet",
  "zgomot","liniste","culoare","forma","marime","numar","litera","cuvant",
  "propozitie","fraza","limba","alfabet","hartie","carte","ziar","revista",
  "scrisoare","mesaj","telefon","internet","website","aplicatie","program",
  "computer","robot","masina","unealta","instrument","material","lemn",
  "metal","plastic","sticla","hartie","panza","piele","lana","bumbac",
  "matase","fir","ata","nod","panglica","cutie","sac","borcan","sticla",
  "vas","cos","valiza","umbrela","lanterna","baterie","cablu","priza",
  "intrerupator","bec","becuri","becul"
];

// Normalizeaza un cuvant: elimina spatii, litere mici, unifica variantele
// de diacritice romanesti (virgula vs sedila) intr-o forma canonica.
function normalizeWord(word) {
  if (!word) return "";
  return word
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\u0219/g, "\u0219") // ș (comma below) canonical
    .replace(/\u015f/g, "\u0219") // ş (cedilla) -> ș
    .replace(/\u021b/g, "\u021b") // ț (comma below) canonical
    .replace(/\u0163/g, "\u021b") // ţ (cedilla) -> ț
    .replace(/[^a-zăâîșț]/g, ""); // pastreaza doar litere romanesti
}

const WORD_SET = new Set(RAW_WORDS.map(normalizeWord).filter(Boolean));
const WORD_LIST = Array.from(WORD_SET);

// Harta: prefix de 2 litere -> lista de cuvinte care incep cu acel prefix
const PREFIX_MAP = new Map();
for (const w of WORD_LIST) {
  if (w.length < 3) continue;
  const p = w.slice(0, 2);
  if (!PREFIX_MAP.has(p)) PREFIX_MAP.set(p, []);
  PREFIX_MAP.get(p).push(w);
}

function getLastTwo(word) {
  const w = normalizeWord(word);
  if (w.length < 2) return null;
  return w.slice(-2);
}

// Un cuvant "inchide" jocul (nu este permis) daca nu exista NICI UN alt
// cuvant in dictionar care sa inceapa cu ultimele lui doua litere.
function endsGame(word) {
  const last2 = getLastTwo(word);
  if (!last2) return true;
  const candidates = PREFIX_MAP.get(last2) || [];
  const others = candidates.filter((c) => c !== normalizeWord(word));
  return others.length === 0;
}

function isRealWord(word) {
  return WORD_SET.has(normalizeWord(word));
}

/**
 * Valideaza un cuvant conform regulilor Fazan.
 * @param {string} rawWord - cuvantul introdus de jucator
 * @param {string|null} requiredPrefix - prefixul de 2 litere cerut (null pt. primul cuvant)
 * @param {Set<string>} usedWords - cuvinte deja folosite in partida (normalizate)
 * @returns {{valid: boolean, reason?: string, normalized?: string}}
 */
function validateWord(rawWord, requiredPrefix, usedWords) {
  const word = normalizeWord(rawWord);

  if (!word || word.length < 3) {
    return { valid: false, reason: "Cuvantul trebuie sa aiba cel putin 3 litere." };
  }
  if (!isRealWord(word)) {
    return { valid: false, reason: "Cuvantul nu a fost gasit in dictionar." };
  }
  if (requiredPrefix && !word.startsWith(requiredPrefix)) {
    return {
      valid: false,
      reason: `Cuvantul trebuie sa inceapa cu "${requiredPrefix.toUpperCase()}".`,
    };
  }
  if (usedWords && usedWords.has(word)) {
    return { valid: false, reason: "Acest cuvant a fost deja folosit in aceasta partida." };
  }
  if (endsGame(word)) {
    return {
      valid: false,
      reason: "Acest cuvant incheie jocul (nu exista niciun cuvant continuator) si nu este permis.",
    };
  }
  return { valid: true, normalized: word };
}

// Alege un cuvant valid pentru un bot, dat un prefix cerut si cuvintele deja folosite.
function pickBotWord(requiredPrefix, usedWords, difficulty) {
  let candidates = requiredPrefix
    ? (PREFIX_MAP.get(requiredPrefix) || [])
    : WORD_LIST;

  candidates = candidates.filter((w) => !usedWords.has(w) && !endsGame(w));

  if (candidates.length === 0) return null;

  // Easy: uneori "greseste" (ras se timpul sau alege gresit) - simulat prin sansa de esec
  const failChance = difficulty === "easy" ? 0.35 : difficulty === "medium" ? 0.12 : 0.02;
  if (Math.random() < failChance) return null;

  const idx = Math.floor(Math.random() * candidates.length);
  return candidates[idx];
}

module.exports = {
  WORD_LIST,
  WORD_SET,
  PREFIX_MAP,
  normalizeWord,
  getLastTwo,
  endsGame,
  isRealWord,
  validateWord,
  pickBotWord,
};
