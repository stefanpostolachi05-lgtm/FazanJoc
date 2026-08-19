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
  "intrerupator","bec","becuri","becul",
  // ============================================================
  // EXTINDERE — plural la substantivele deja listate (foarte
  // frecvente in vorbirea normala, lipseau complet inainte)
  // ============================================================
  "pisici","caini","lupi","ursi","vulpi","iepuri","cerbi","capre","oi","porci",
  "vaci","cai","magari","gaini","cocosi","rate","gaste","curcani","albine","furnici",
  "fluturi","broaste","serpi","soparle","pesti","rechini","balene","delfini","elefanti",
  "girafe","zebre","lei","tigri","maimute","gorile","canguri","pinguini","vulturi",
  "soimi","bufnite","ciori","vrabii","randunele","berze","pelicani","crocodili",
  "testoase","aricei","veverite","hamsteri","sobolani","insecte","paianjeni",
  "scorpioni","viespi","greieri","libelule","gandaci","melci","raci","crabi",
  "stridii","caracatite","calmari","meduze","foci","morse",
  "munti","paduri","campuri","dealuri","vai","rauri","lacuri","mari","oceane",
  "insule","plaje","deserturi","stanci","pesteri","izvoare","cascade","copaci",
  "frunze","radacini","ramuri","flori","plante","seminte","fructe","legume",
  "gradini","livezi","meri","peri","piersici","ciresi","visini","pruni","caisi",
  "portocali","lamai","banane","pepeni","capsuni","afine","nuci","alune","migdale",
  "castane","ciuperci","stejari","brazi","salcii","plopi","fagi","tei",
  "case","apartamente","camere","bucatarii","bai","dormitoare","usi","ferestre",
  "pereti","scari","balcoane","acoperisuri","garduri","curti","gradini","garaje",
  "mobile","paturi","dulapuri","scaune","canapele","birouri","lampi","oglinzi",
  "covoare","perne","paturi","prosoape","telefoane","calculatoare","carti","caiete",
  "pixuri","creioane","rucsacuri","genti","portofele","chei","umbrele","ochelari",
  "palarii","fulare","manusi","haine","tricouri","pantaloni","fuste","rochii",
  "camasi","pulovere","pantofi","ghete","sandale","ciorapi","inele","cercei",
  "bratari","masini","autobuze","trenuri","avioane","vapoare","biciclete",
  "camioane","drumuri","strazi","poduri","tuneluri","parcari","scoli","licee",
  "facultati","profesori","elevi","studenti","clase","teme","examene","note",
  "birouri","fabrici","ateliere","magazine","spitale","farmacii","restaurante",
  "cafenele","biblioteci","muzee","teatre","stadioane","parcuri","idei","ganduri",
  "vise","dorinte","sperante","secrete","povesti","cantece","culori","numere",
  "litere","cuvinte","propozitii","fraze","carti","ziare","mesaje","aplicatii",
  "programe","roboti","unelte","materiale",
  // ============================================================
  // EXTINDERE — conjugari uzuale (prezent) ale verbelor deja listate,
  // pentru ca jocul sa accepte forme naturale, nu doar infinitivul
  // ============================================================
  "alerg","alergi","alearga","alergam","alergati", "merg","mergi","merge","mergem","mergeti",
  "stau","stai","sta","stam","stati", "vin","vii","vine","venim","veniti",
  "plec","pleci","pleaca","plecam","plecati", "intru","intri","intra","intram","intrati",
  "ies","iesi","iese","iesim","iesiti", "urc","urci","urca","urcam","urcati",
  "cobor","cobori","coboara","coboram","coborati", "sar","sari","sare","sarim","sariti",
  "cad","cazi","cade","cadem","cadeti", "ridic","ridici","ridica","ridicam","ridicati",
  "aduc","aduci","aduce","aducem","aduceti", "duc","duci","duce","ducem","duceti",
  "iau","iei","ia","luam","luati", "pun","pui","pune","punem","puneti",
  "scot","scoti","scoate","scoatem","scoateti", "deschid","deschizi","deschide","deschidem","deschideti",
  "inchid","inchizi","inchide","inchidem","inchideti", "spun","spui","spune","spunem","spuneti",
  "vorbesc","vorbesti","vorbeste","vorbim","vorbiti", "ascult","asculti","asculta","ascultam","ascultati",
  "aud","auzi","aude","auzim","auziti", "vad","vezi","vede","vedem","vedeti",
  "privesc","privesti","priveste","privim","priviti", "gasesc","gasesti","gaseste","gasim","gasiti",
  "pierd","pierzi","pierde","pierdem","pierdeti", "castig","castigi","castiga","castigam","castigati",
  "joc","joci","joaca","jucam","jucati", "cant","canti","canta","cantam","cantati",
  "dansez","dansezi","danseaza","dansam","dansati", "desenez","desenezi","deseneaza","desenam","desenati",
  "scriu","scrii","scrie","scriem","scrieti", "citesc","citesti","citeste","citim","cititi",
  "invat","inveti","invata","invatam","invatati", "predau","predai","preda","predam","predati",
  "intreb","intrebi","intreaba","intrebam","intrebati", "raspund","raspunzi","raspunde","raspundem","raspundeti",
  "gandesc","gandesti","gandeste","gandim","ganditi", "visez","visezi","viseaza","visam","visati",
  "dorm","dormi","doarme","dormim","dormiti", "trezesc","trezesti","trezeste","trezim","treziti",
  "spal","speli","spala","spalam","spalati", "curat","curati","curata","curatam","curatati",
  "gatesc","gatesti","gateste","gatim","gatiti", "mananc","mananci","mananca","mancam","mancati",
  "beau","bei","bea","bem","beti", "respir","respiri","respira","respiram","respirati",
  "zambesc","zambesti","zambeste","zambim","zambiti", "rad","razi","rade","radem","radeti",
  "plang","plangi","plange","plangem","plangeti", "strig","strigi","striga","strigam","strigati",
  "construiesc","construiesti","construieste","construim","construiti", "repar","repari","repara","reparam","reparati",
  "vand","vinzi","vinde","vindem","vindeti", "cumpar","cumperi","cumpara","cumparam","cumparati",
  "platesc","platesti","plateste","platim","platiti", "astept","astepti","asteapta","asteptam","asteptati",
  "caut","cauti","cauta","cautam","cautati", "incep","incepi","incepe","incepem","incepeti",
  "termin","termini","termina","terminam","terminati", "continui","continua","continuam","continuati",
  "opresc","opresti","opreste","oprim","opriti", "schimb","schimbi","schimba","schimbam","schimbati",
  "ajut","ajuti","ajuta","ajutam","ajutati", "salvez","salvezi","salveaza","salvam","salvati",
  "aleg","alegi","alege","alegem","alegeti", "decid","decizi","decide","decidem","decideti",
  "incerc","incerci","incearca","incercam","incercati", "reusesc","reusesti","reuseste","reusim","reusiti",
  "studiez","studiezi","studiaza","studiam","studiati", "descopar","descoperi","descopera","descoperim","descoperiti",
  "inventez","inventezi","inventeaza","inventam","inventati", "creez","creezi","creeaza","creeam","creati",
  "imaginez","imaginezi","imagineaza","imaginam","imaginati", "planuiesc","planuiesti","planuieste","planuim","planuiti",
  "organizez","organizezi","organizeaza","organizam","organizati", "conduc","conduci","conduce","conducem","conduceti",
  "zbor","zbori","zboara","zburam","zburati", "inot","inoti","inoata","inotam","inotati",
  "impins","impingi","impinge","impingem","impingeti", "trag","tragi","trage","tragem","trageti",
  "arunc","arunci","arunca","aruncam","aruncati", "prind","prinzi","prinde","prindem","prindeti",
  "lovesc","lovesti","loveste","lovim","loviti", "ating","atingi","atinge","atingem","atingeti",
  "apas","apesi","apasa","apasam","apasati", "tin","tii","tine","tinem","tineti",
  "masor","masori","masoara","masuram","masurati", "sunt","esti","este","suntem","sunteti",
  "am","ai","are","avem","aveti", "fac","faci","face","facem","faceti",
  "stiu","stii","stie","stim","stiti", "pot","poti","poate","putem","puteti",
  "vreau","vrei","vrea","vrem","vreti",
  // ============================================================
  // EXTINDERE — pronume, numerale, adverbe, cuvinte de legatura
  // (extrem de comune in vorbirea zilnica, lipseau complet)
  // ============================================================
  "eu","tu","noi","voi","ele","mie","tie","noua","voua","lor","acesta","aceasta",
  "acestia","acestea","acela","aceea","aceia","acelea","cineva","nimeni","ceva",
  "nimic","tot","toate","toti","fiecare","altul","alta","altii","altele",
  "unu","doi","trei","patru","cinci","sase","sapte","opt","noua","zece",
  "unsprezece","doisprezece","douazeci","treizeci","patruzeci","cincizeci",
  "suta","mia","milion","miliard","prima","primul","ultima","ultimul",
  "bine","rau","repede","incet","mereu","niciodata","uneori","adesea",
  "foarte","prea","destul","aproape","departe","aici","acolo","azi","ieri",
  "maine","acum","atunci","curand","tarziu","devreme","poate","desigur",
  "sigur","cumva","undeva","oriunde","oricand","oricum","oricine","orice",
  "dupa","inainte","langa","peste","intre","fara","pentru","asupra",
  "impotriva","conform","datorita","gratie","despre","printre","catre",
  "spre","dedesubt","deasupra","inauntru","afara","inapoi","imprejur",
  "insa","totusi","deci","astfel","precum","daca","cand","unde","cum",
  "deoarece","fiindca","pentruca","incat","desi","chiar","macar","numai",
  "doar","abia","tocmai","iarasi","impreuna","separat",
];

// Normalizeaza un cuvant: elimina spatii, litere mici, si elimina
// diacriticele romanesti pentru COMPARATIE (ă/â -> a, î -> i, ș/ş -> s,
// ț/ţ -> t). Asta e fix-ul principal pentru bug-ul unde 95% din cuvinte
// erau respinse: dictionarul de mai sus e scris FARA diacritice, dar
// jucatorii scriu firesc CU diacritice ("măgar", nu "magar") - fara aceasta
// normalizare, cele doua forme nu se potriveau niciodata.
function normalizeWord(word) {
  if (!word) return "";
  return word
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[ăâ]/g, "a")
    .replace(/î/g, "i")
    .replace(/[șş]/g, "s")
    .replace(/[țţ]/g, "t")
    .replace(/[^a-z]/g, ""); // pastreaza doar litere latine, dupa normalizare
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
