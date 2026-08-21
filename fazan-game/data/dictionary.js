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
  // ============================================================
  // EXTINDERE MARE — nume romanesti comune (masculine si feminine),
  // extrem de frecvente in jocul real de Fazan, lipseau complet inainte
  // ============================================================
  "andrei","alex","alexandru","mihai","stefan","vlad","radu","adrian",
  "sorin","marius","catalin","alin","dan","ion","gheorghe","vasile",
  "nicolae","constantin","petru","paul","victor","robert","sergiu",
  "eugen","emil","anton","cristian","dumitru","iulian","lucian","marian",
  "nicu","octavian","ovidiu","razvan","silviu","tudor","valentin","viorel",
  "bogdan","cosmin","florin","gabriel","daniel","cornel","costin","dorin",
  "eduard","gigel","horia","ilie","iosif","laurentiu","liviu","mircea",
  "petrica","remus","sabin","teodor","toma","virgil","aurel","claudiu",
  "codrin","dinu","edi","fane","george","ghita","ilarion","jean","lucas",
  "matei","max","nelu","oliver","pavel","relu","sandu","titus","vali",
  "andreea","alexandra","bianca","carmen","daniela","diana","gabriela",
  "georgiana","ioana","irina","laura","loredana","luminita","madalina",
  "mihaela","monica","nicoleta","oana","raluca","roxana","simona",
  "teodora","valentina","veronica","ana","maria","elena","cristina",
  "adriana","anca","anda","antonia","beatrice","camelia","claudia",
  "corina","cosmina","crina","delia","denisa","dorina","dana","elisa",
  "emilia","florentina","flavia","florina","gina","ileana","iuliana",
  "izabela","larisa","lavinia","liliana","livia","luiza","magda",
  "marinela","mirela","narcisa","natalia","paula","ramona","renata",
  "sabina","sanda","sonia","stela","tatiana","victoria","violeta",
  "aida","alma","amalia","amina","angela","antoaneta","aurelia",
  "bettina","brindusa","codruta","dumitra","emanuela","eva","felicia",
  "geta","gherghina","harieta","iolanda","iustina","jana","kira",
  "lenuta","letitia","lidia","marcela","margareta","marta","mia",
  "milena","nadia","nina","olga","otilia","petronela","rodica","ruxandra",
  "silvia","sofia","tania","vasilica","vera","viorica","zamfira","zina",
  // ============================================================
  // EXTINDERE MARE — cuvinte de argou / uzuale / mai putin "de dictionar",
  // dar extrem de comune in vorbirea reala, informala
  // ============================================================
  "caca","cacat","tampit","prost","idiot","nesimtit","obraznic","nebun",
  "smecher","misto","tare","fain","naspa","varza","penal","jenant",
  "circ","haos","belea","bucluc","ghinion","noroc","chef","distractie",
  "petrecere","gasca","gasti","galagie","zarva","tam","nam","nene",
  "tanti","mos","mosule","frate","fratioare","surioara","puiule",
  "dragule","scumpule","iubi","iubita","iubitul","gagica","gagiu",
  "baiatas","fetita","copilas","matusica","bunicuta","tataie","mamaie",
  "gargara","balarie","aiureala","tampenie","prostie","boacana",
  "gafa","greseala","eroare","scandal","cearta","gluma","farsa",
  "poanta","banc","bancuri","haz","haios","comic","tragic","dramatic",
  "fabulos","incredibil","uimitor","socant","socat","uimit","mirat",
  "curios","ciudat","bizar","straniu","misterios","enigmatic","secret",
  "ascuns","tainic","obscur","vag","confuz","clar","evident","logic",
  "absurd","ilogic","aiurea","degeaba","zadarnic","inutil","folositor",
  "necesar","obligatoriu","optional","posibil","imposibil","probabil",
  "improbabil","cert","incert","exact","aproximativ","precis","vag",
  // ============================================================
  // EXTINDERE MARE — cuvinte mai rare / "necunoscute" / abstracte
  // ============================================================
  "orb","surd","mut","chior","schiop","cocosat","pistruiat","ambitios",
  "orchestra","dirijor","simfonie","opera","balet","recital","turneu",
  "onoare","mandrie","invidie","gelozie","rusine","vinovatie","curaj",
  "lasitate","generozitate","zgarcenie","modestie","aroganta","trufie",
  "umilinta","demnitate","respect","dispret","admiratie","adoratie",
  "devotament","loialitate","tradare","fidelitate","infidelitate",
  "sinceritate","ipocrizie","minciuna","adevar","dreptate","nedreptate",
  "echitate","corectitudine","onestitate","integritate","virtute","viciu",
  "pacat","ispita","tentatie","abstinenta","cumpatare","exces","lacomie",
  "moderatie","echilibru","armonie","dizarmonie","conflict","pace",
  "razboi","batalie","lupta","victorie","infrangere","capitulare",
  "rezistenta","opozitie","sustinere","alianta","coalitie","tratat",
  "acord","dezacord","compromis","negociere","mediere","arbitraj",
  "judecata","verdict","sentinta","pedeapsa","recompensa","rasplata",
  "meritocratie","nobil","tradator","erou","laut","viteaz","fricos",
  "temerar","precaut","impulsiv","calculat","spontan","planificat",
  "organizat","haotic","metodic","dezordonat","riguros","laxist",
  "sever","indulgent","strict","permisiv","autoritar","democratic",
  "tiranic","despotic","liberal","conservator","traditional","modern",
  "arhaic","futurist","retrograd","progresist","revolutionar","evolutiv",
  "static","dinamic","stabil","instabil","volatil","constant","variabil",
  "uniform","divers","omogen","eterogen","complex","simplu","complicat",
  "elaborat","rafinat","sofisticat","primitiv","rudimentar","elementar",
  "avansat","superior","inferior","mediocru","exceptional","remarcabil",
  "ordinar","banal","obisnuit","neobisnuit","exotic","local","regional",
  "national","international","global","universal","particular","specific",
  "general","vag","concret","abstract","teoretic","practic","aplicat",
  "functional","decorativ","util","estetic","artistic","stiintific",
  "tehnic","tehnologic","industrial","comercial","economic","financiar",
  "monetar","fiscal","juridic","legal","ilegal","legitim","ilegitim",
  "constitutional","administrativ","birocratic","institutional",
  "guvernamental","politic","diplomatic","militar","strategic","tactic",
  "logistic","operational","structural","organizational","managerial",
  "executiv","legislativ","judiciar","civil","penal","comercial",
  // ============================================================
  // EXTINDERE MARE — cuvinte scurte (2-3 litere), extrem de utile pentru
  // deschideri/inchideri de lant care inainte erau blocate din lipsa
  // ============================================================
  "om","ou","ac","ea","ei","al","ah","oh","hei","na","ba","da","nu",
  "si","tu","eu","noi","voi","in","la","cu","pe","de","din","spre",
  "ok","ii","ie","io","ia","ala","asa","asta","aia","ele","eu","el",
  "un","o","va","ma","te","se","ne","le","mi","ti","si","or","ar",
  "vom","veti","vor","fu","fusei","era","eram","erai","fost","fiind",
  // ============================================================
  // EXTINDERE MARE — substantive obisnuite din multe domenii,
  // insuficient acoperite pana acum
  // ============================================================
  "orb","ureche","sprancene","umeri","incheietura","pumn","talpa",
  "genunchi","coapsa","abdomen","piept","clavicula","coloana","craniu",
  "maxilar","obraji","tample","ceafa","subsuoara","cot","index",
  "degetar","unghie","cuticula","calus","bataturi","cicatrice","aluniță",
  "riduri","pistrui","tatuaj","piercing","machiaj","ruj","fond",
  "pudra","rimel","fard","parfum","deodorant","crema","lotiune",
  "sampon","balsam","gel","spuma","ceara","pieptene","perie","foarfeca",
  "aparat","uscator","placa","ondulator","oglinda","chiuveta","cada",
  "dus","robinet","teava","canalizare","instalatie","electricitate",
  "gaz","incalzire","climatizare","ventilatie","izolatie","fundatie",
  "structura","schela","macara","excavator","buldozer","betoniera",
  "caramida","ciment","var","nisip","pietris","tabla","tigla","dranita",
  "cherestea","scandura","placaj","furnir","lac","vopsea","diluant",
  "pensula","rola","spatula","surubelnita","cheie","cioc","patent",
  "menghina","nicovala","ciocan","fierastrau","rangla","daltile",
  "burghiu","gaurit","insurubat","desurubat","masurat","taiat","lipit",
  "sudat","nituit","vopsit","lustruit","slefuit","polizat","frezat",
  "strunjit","forjat","turnat","laminat","extrudat","injectat",
  // forme cu articol hotarat, foarte comune in vorbire ("omul", "caiul"...)
  "omul","baiatul","fetita","copilul","barbatul","femeia","caiul","cainele",
  "pisica","ursul","lupul","vulpea","iepurele","soarele","luna","cerul",
  "pamantul","apa","focul","vantul","muntele","raul","marea","padurea",
  "orasul","satul","drumul","podul","casa","masina","cartea","mesajul",
  "timpul","anul","ziua","noaptea","dimineata","seara","prietenul",
  "dusmanul","regele","printul","printesa","imparatul","poporul",
  "tara","lumea","viata","moartea","dragostea","ura","fericirea",
  "tristetea","adevarul","minciuna","dreptatea","libertatea",
  // ============================================================
  // EXTINDERE URIASA — animale (mamifere, mai complet)
  // ============================================================
  "rinocer","hipopotam","girafa","zebra","antilopa","gazela","bizon",
  "bivol","capibara","leopard","pantera","jaguar","puma","ras","hiena",
  "sacal","dingo","coiot","vidra","nurca","dihor","jder","bursuc",
  "cartita","liliac","arici","opossum","koala","panda","urangutan",
  "cimpanzeu","babuin","lemur","tapir","porc-spinos","castor","marmota",
  "capra-neagra","muflon","ren","elan","caprioara","mistret","vidra",
  "focus","narval","balena-albastra","caseal","orca","dugong","manati",
  "vaca-de-mare","vulpe-polara","urs-polar","urs-brun","urs-panda",
  "tigru-siberian","leu-de-mare","elefant-de-mare",
  // pasari
  "vultur","soim","ereta","uliu","gaie","corb","cioara","stancuta",
  "gaita","coţofana","cuc","pupaza","ciocanitoare","privighetoare",
  "mierla","sturz","sticlete","canar","papagal","porumbel","turturea",
  "prepelita","fazan","potarniche","cocor","barza","lebada","gasca-salbatica",
  "rata-salbatica","pescarus","albatros","flamingo","pinguin-imperial",
  "struts","emu","kiwi","dropia","bufnita","cucuveaua","huhurez",
  "sfrancioc","fluturas","piigoi","vrabie","randunica","lastun","rindunica",
  "codobatura","ciocarlie","graur","cinteza","botgros","forfecuta",
  // pesti si vietuitoare acvatice
  "crap","stiuca","somn","pastrav","biban","caras","salau","lipan",
  "cega","morun","nisetru","pastruga","scrumbie","hering","macrou",
  "ton","sardina","hamsie","anghila","tipar","cambula","calcan",
  "limba-de-mare","platica","clean","mreana","scobar","avat","obletul",
  "guvid","zvartioaga","peste-spada","rechin-alb","rechin-tigru",
  "raie","pisica-de-mare","stea-de-mare","arici-de-mare","burete-de-mare",
  "coral","anemona","homar","langusta","creveti","midie","scoica",
  // insecte si alte nevertebrate
  "musca","tantar","purice","paduche","capusa","omida","viermisor",
  "rama","limax","buburuza","carabus","croitor","cosas","lacusta",
  "molie","albinuta","bondar","viespe-de-lemn","furnicar","termita",
  // ============================================================
  // EXTINDERE URIASA — geografie: tari, capitale, orase romanesti,
  // munti, rauri, mari/oceane
  // ============================================================
  "romania","moldova","ucraina","ungaria","bulgaria","serbia","polonia",
  "germania","franta","italia","spania","portugalia","anglia","scotia",
  "irlanda","olanda","belgia","elvetia","austria","cehia","slovacia",
  "slovenia","croatia","grecia","turcia","rusia","suedia","norvegia",
  "finlanda","danemarca","islanda","estonia","letonia","lituania",
  "albania","macedonia","muntenegru","bosnia","cipru","malta",
  "americ","canada","mexic","brazilia","argentina","chile","peru",
  "columbia","venezuela","cuba","japonia","china","india","coreea",
  "vietnam","thailanda","indonezia","filipine","malaysia","singapore",
  "egipt","maroc","tunisia","algeria","libia","nigeria","kenya",
  "etiopia","tanzania","africa","australia","zeelanda",
  "bucuresti","cluj","clujnapoca","timisoara","iasi","constanta",
  "craiova","brasov","galati","ploiesti","oradea","braila","arad",
  "pitesti","sibiu","bacau","targumures","baiamare","buzau","botosani",
  "satumare","ramnicuvalcea","suceava","piatraneamt","drobetaturnuseverin",
  "targujiu","focsani","bistrita","resita","slatina","alba","alexandria",
  "giurgiu","deva","hunedoara","zalau","sfantugheorghe","vaslui",
  "carei","medgidia","mangalia","tulcea","calarasi","slobozia",
  "moinesti","onesti","husi","panciu","adjud","fetesti","navodari",
  "carpati","fagaras","bucegi","retezat","apuseni","macin","ceahlau",
  "postavaru","piatracraiului","pareng","godeanu","semenic","calimani",
  "olt","siret","mures","prut","dunarea","arges","jiu","somes",
  "bistrita","ialomita","buzau","trotus","bahlui","crisul","timis",
  "neajlov","dambovita","vedea","teleorman","calmatui","barlad",
  "mediteran","atlantic","pacific","indian","arctic","adriatica",
  "egee","baltica","caspica","aral","rosie","neagra","azov",
  // ============================================================
  // EXTINDERE URIASA — minerale, roci, metale, pietre pretioase
  // ============================================================
  "granit","bazalt","calcar","gresie","marmura","cuart","cristal",
  "diamant","rubin","safir","smarald","opal","turcoaz","ametist",
  "topaz","granat","jad","onix","agat","perla","chihlimbar",
  "grafit","carbune","huila","lignit","turba","petrol","gaz-metan",
  "sare","gips","argila","caolin","bauxita","hematit","magnetit",
  "pirita","galena","malachit","azurit","mica","feldspat","talc",
  "azbest","zeolit","fosfat","nitrat","sulfat","carbonat","oxid",
  "aur","argint","platina","cupru","fier","zinc","plumb","staniu",
  "nichel","crom","mangan","titan","wolfram","molibden","cobalt",
  "mercur","aluminiu","magneziu","calciu","sodiu","potasiu","litiu",
  // ============================================================
  // EXTINDERE URIASA — directii cardinale, nationalitati, limbi
  // ============================================================
  "nord","sud","est","vest","nordest","nordvest","sudest","sudvest",
  "stanga","dreapta","centru","mijloc","varf","baza","capat","inceput",
  "englez","engleza","francez","franceza","german","germana","spaniol",
  "spaniola","italian","italiana","rus","rusa","chinez","chineza",
  "japonez","japoneza","coreean","coreeana","american","americana",
  "roman","romana","grec","greaca","turc","turca","arab","araba",
  "indian","indiana","brazilian","canadian","mexican","egiptean",
  "african","european","asiatic","australian","polonez","poloneza",
  "ceh","ceha","slovac","slovaca","ungur","unguresc","bulgar","bulgara",
  "sarb","sarba","croat","croata","olandez","olandeza","belgian",
  "elvetian","austriac","suedez","suedeza","norvegian","danez","daneza",
  "finlandez","irlandez","scotian","portughez","portugheza",
  // ============================================================
  // EXTINDERE URIASA — arene, cladiri, locuri publice, sport
  // ============================================================
  "arena","stadion","complex","piscina","sala","teren","pista",
  "velodrom","hipodrom","patinoar","tribuna","peluza","vestiar",
  "poarta-de-start","linia-de-sosire","fluier","cronometru","medalie",
  "podium","antrenament","incalzire","pauza","repriza","prelungiri",
  "penalty","cartonas","fault","henţ","ofsaid","corner","cornerul",
  "aut","tusa","centru","atac","aparare","portar","fundas","mijlocas",
  "atacant","rezerva","titular","selectioner","staff","cantonament",
  // ============================================================
  // EXTINDERE URIASA — plural cu articol hotarat pentru animale
  // ("norii" tip de cerinta - completam categoria cea mai cerute)
  // ============================================================
  "norii","pisicile","cainii","lupii","ursii","vulpile","iepurii",
  "cerbii","caprele","oile","porcii","vacile","caii","gainile",
  "cocosii","rate","gastele","albinele","furnicile","fluturii",
  "broastele","serpii","soparlele","pestii","rechinii","balenele",
  "delfinii","elefantii","girafele","zebrele","leii","tigrii",
  "maimutele","gorilele","cangurii","pinguinii","vulturii","soimii",
  "bufnitele","ciorile","vrabiile","berzele","crocodilii","testoasele",
  "veveritele","insectele","paianjenii","viespile","gandacii","melcii",
  "racii","crabii","muntii","padurile","campurile","dealurile",
  "vaile","raurile","lacurile","marile","insulele","stancile",
  "copacii","frunzele","florile","plantele","fructele","legumele",
  "gradinile","stejarii","brazii","salciile","casele","masinile",
  "cartile","mesajele","prietenii","dusmanii","orasele","satele",
  "drumurile","podurile","tarile","lumile","vietile","anii","zilele",
  // ============================================================
  // EXTINDERE — verbe la timpul trecut (perfect compus / imperfect),
  // extrem de comune in vorbire naturala
  // ============================================================
  "amfost","amavut","amfacut","amzis","amstiut","amputut","amvrut",
  "amvazut","amvenit","amplecat","amintrat","amiesit","amurcat",
  "amcoborat","amsarit","amcazut","amridicat","amadus","amdus",
  "amluat","ampus","amscos","amdeschis","aminchis","amspus",
  "amvorbit","amascultat","amauzit","amprivit","amgasit","ampierdut",
  "amcastigat","amjucat","amcantat","amdansat","amdesenat","amscris",
  "amcitit","aminvatat","ampredat","amintrebat","amraspuns","amgandit",
  "amvisat","amdormit","amtrezit","amspalat","amcuratat","amgatit",
  "ammancat","ambaut","amrespirat","amzambit","amras","amplans",
  "amstrigat","amconstruit","amreparat","amvandut","amcumparat",
  "amplatit","amasteptat","amcautat","amceput","amterminat",
  "amcontinuat","amoprit","amschimbat","amajutat","amsalvat",
  "amales","amdecis","amincercat","amreusit","amstudiat",
  "amdescoperit","aminventat","amcreat","amimaginat","amplanuit",
  "amorganizat","amcondus","amzburat","aminotat","amimpins","amtras",
  "amaruncat","amprins","amlovit","amatins","amapasat","amtinut",
  "eraserele","erau","fusesem","fusesi","fusese","fuseseram",
  "voiam","voiai","voia","voiam","voiati","voiau",
  "puteam","puteai","putea","puteam","puteati","puteau",
  "stiam","stiai","stia","stiam","stiati","stiau",
  // ============================================================
  // EXTINDERE — substantive uzuale suplimentare
  // ============================================================
  "telefonul","internetul","aplicatia","programul","robotul","unealta",
  "materialul","lemnul","metalul","plasticul","sticla","panza",
  "pielea","lana","bumbacul","matasea","firul","ata","nodul",
  "panglica","cutia","sacul","borcanul","vasul","cosul","valiza",
  "lanterna","bateria","cablul","priza","intrerupatorul","becul",
  "ecranul","tastatura","mouseul","imprimanta","scanner","router",
  "wifi","internet","website","aplicatia","softul","hardul",
  "procesorul","memoria","hardiscul","placa","monitorul","boxele",
  "castile","microfonul","camera","difuzorul","incarcatorul",
  "adaptorul","conectorul","stick","memorie","dischet","dvd","cd",
  "muzica","filmul","seria","jocul","aplicatia","softul","update",
  "versiunea","licenta","abonamentul","contul","parola","username",
  "email","mesaj","notificare","alerta","semnal","conexiune",
  "reteaua","serverul","baza","fisierul","folderul","directorul",
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

// Harta prefixe pentru fiecare lungime de lant suportata (2, 3, 4 litere) -
// game mode-uri diferite ("Clasic" = 2, "Greu" = 3, "Expert" = 4).
const PREFIX_MAPS = { 2: new Map(), 3: new Map(), 4: new Map() };
for (const n of [2, 3, 4]) {
  for (const w of WORD_LIST) {
    if (w.length < n) continue;
    const p = w.slice(0, n);
    if (!PREFIX_MAPS[n].has(p)) PREFIX_MAPS[n].set(p, []);
    PREFIX_MAPS[n].get(p).push(w);
  }
}
const PREFIX_MAP = PREFIX_MAPS[2]; // pastrat pentru compatibilitate

// Cateva terminatii scurte, foarte comune, despre care STIM ca nu au NICIUN
// continuator real in romana (ex. "nt" - nu exista cuvinte romanesti care
// sa inceapa cu "nt"). Le blocam explicit, in plus fata de verificarea
// automata prin dictionar, ca sa fim siguri ca nu scapa niciodata.
const KNOWN_DEAD_ENDINGS = new Set(["nt", "mp", "ct", "pt", "xt", "ft"]);

function getLastN(word, n) {
  const w = normalizeWord(word);
  if (w.length < n) return null;
  return w.slice(-n);
}
function getLastTwo(word) {
  return getLastN(word, 2);
}

// Un cuvant "inchide" jocul (nu este permis) daca nu exista NICI UN alt
// cuvant in dictionar care sa inceapa cu ultimele lui N litere (N = lungimea
// lantului pentru game mode-ul curent: 2, 3 sau 4).
function endsGame(word, chainLength = 2) {
  const lastN = getLastN(word, chainLength);
  if (!lastN) return true;
  if (chainLength === 2 && KNOWN_DEAD_ENDINGS.has(lastN)) return true;
  const map = PREFIX_MAPS[chainLength] || PREFIX_MAPS[2];
  const candidates = map.get(lastN) || [];
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
function validateWord(rawWord, requiredPrefix, usedWords, chainLength = 2) {
  const word = normalizeWord(rawWord);

  if (!word || word.length < 2) {
    return { valid: false, reason: "Cuvantul trebuie sa aiba cel putin 2 litere." };
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
  if (endsGame(word, chainLength)) {
    return {
      valid: false,
      reason: "Acest cuvant incheie jocul (nu exista niciun cuvant continuator) si nu este permis.",
    };
  }
  return { valid: true, normalized: word };
}

// Alege un cuvant valid pentru un bot, dat un prefix cerut si cuvintele deja folosite.
function pickBotWord(requiredPrefix, usedWords, difficulty, chainLength = 2) {
  const map = PREFIX_MAPS[chainLength] || PREFIX_MAPS[2];
  let candidates = requiredPrefix
    ? (map.get(requiredPrefix) || [])
    : WORD_LIST;

  candidates = candidates.filter((w) => !usedWords.has(w) && !endsGame(w, chainLength));

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
  getLastN,
  endsGame,
  isRealWord,
  validateWord,
  pickBotWord,
};
