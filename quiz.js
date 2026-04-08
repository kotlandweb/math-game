// Debug žinutė: padeda matyti, ar failas užsikrovė.
console.log("quiz.js loaded");

// Kiek klausimų bus viename teste.
const TOTAL_QUESTIONS = 10;

// Sugeneruoja visą užduočių banką (iš jo vėliau parenkami klausimai testui).
function buildBank() {
  const bank = [];
  // Esamas užduočių bankas: išlaikome ankstesnes generuotas užduotis
  // 20 daugybos klausimų.
  for (let i = 0; i < 20; i++) {
    const a = randInt(6, 25);
    const b = randInt(6, 25);
    bank.push({
      text: `${a} × ${b} = ?`,
      answer: a * b,
      level: "vidutinis"
    });
  }

  // 10 dalybos klausimų be liekanos.
  for (let i = 0; i < 10; i++) {
    const b = randInt(2, 12);
    const ans = randInt(6, 30);
    const a = b * ans;
    bank.push({
      text: `${a} ÷ ${b} = ?`,
      answer: ans,
      level: "vidutinis"
    });
  }

  // 20 judėjimo uždavinių (s = v * t).
  const vehicles = ["Automobilis", "Dviratininkas", "Traukinys", "Autobusas", "Motociklas"];
  for (let i = 0; i < 20; i++) {
    const v = randInt(10, 120);
    const t = randInt(1, 6);
    const who = vehicles[randInt(0, vehicles.length - 1)];
    bank.push({
      text: `${who} važiavo ${v} km/h greičiu ${t} valandas. Kiek kilometrų nuvažiavo?`,
      answer: v * t,
      level: "vidutinis"
    });
  }

  // Naujos 4-kl. lygio užduotys, suskirstytos pagal lygį:
  // Patenkinamas (paprasti sudėties/atėmimo uždaviniai)
  const patenkinamas = [
    { text: `23 + 45 = ?`, answer: 68, level: "patenkinamas" },
    { text: `70 - 28 = ?`, answer: 42, level: "patenkinamas" },
    { text: `36 + 14 = ?`, answer: 50, level: "patenkinamas" },
    { text: `81 - 33 = ?`, answer: 48, level: "patenkinamas" }
  ];
  patenkinamas.forEach((q) => bank.push(q));

  // Vidutinis (daugyba / dalyba / paprasti žodžiu uždaviniai)
  const vidutinis = [
    { text: `8 × 7 = ?`, answer: 56, level: "vidutinis" },
    { text: `9 × 6 = ?`, answer: 54, level: "vidutinis" },
    { text: `48 ÷ 6 = ?`, answer: 8, level: "vidutinis" },
    { text: `45 ÷ 9 = ?`, answer: 5, level: "vidutinis" },
    { text: `Mokykloje yra 4 eilės po 12 mokinių. Kiek mokinių iš viso?`, answer: 48, level: "vidutinis" }
  ];
  vidutinis.forEach((q) => bank.push(q));

  // Aukštesnysis (sudėtingesni žodžiu uždaviniai ir trupmenų uždaviniai)
  const aukstesnysis = [
    { text: `Tomas turi 24 obuolius. Jis padalijo juos po lygiai 6 draugams. Kiek obuolių gavo kiekvienas?`, answer: 4, level: "aukstesnysis" },
    { text: `Per 3 valandas traukinys nuvažiavo 210 km. Koks buvo vidutinis greitis (km/h)?`, answer: 70, level: "aukstesnysis" }
  ];
  aukstesnysis.forEach((q) => bank.push(q));

  // Trupmenų uždaviniai (klausiame atsakymo dešimtainiu skaičiumi arba leiskime įvesti trupmeną)
  // Trupmenų uždaviniai — visi uždaviniai parinkti taip, kad atsakymai būtų sveikieji skaičiai
  // Sunkesni trupmenų uždaviniai — visi su sveikais atsakymais
  const fractions = [
    { text: `1/2 + 1/2 = ?`, answer: 1, level: "aukstesnysis" },
    { text: `3/2 + 1/2 = ?`, answer: 2, level: "aukstesnysis" },
    { text: `5/2 + 1/2 = ?`, answer: 3, level: "aukstesnysis" },
    { text: `7/2 + 1/2 = ?`, answer: 4, level: "aukstesnysis" },
    { text: `3/4 + 1/4 = ?`, answer: 1, level: "aukstesnysis" },
    { text: `5/4 + 3/4 = ?`, answer: 2, level: "aukstesnysis" },
    { text: `9/4 + 3/4 = ?`, answer: 3, level: "aukstesnysis" },
    { text: `5/6 + 1/6 = ?`, answer: 1, level: "aukstesnysis" },
    { text: `7/6 + 5/6 = ?`, answer: 2, level: "aukstesnysis" },
    { text: `13/6 + 5/6 = ?`, answer: 3, level: "aukstesnysis" },
    { text: `2/3 + 1/3 = ?`, answer: 1, level: "aukstesnysis" },
    { text: `4/3 + 2/3 = ?`, answer: 2, level: "aukstesnysis" },
    { text: `5/3 + 1/3 = ?`, answer: 2, level: "aukstesnysis" },
    { text: `7/3 - 1/3 = ?`, answer: 2, level: "aukstesnysis" },
    { text: `5/4 - 1/4 = ?`, answer: 1, level: "aukstesnysis" },
    { text: `9/4 - 1/4 = ?`, answer: 2, level: "aukstesnysis" },
    { text: `11/6 - 5/6 = ?`, answer: 1, level: "aukstesnysis" },
    { text: `13/6 - 7/6 = ?`, answer: 1, level: "aukstesnysis" },
    { text: `11/4 - 3/4 = ?`, answer: 2, level: "aukstesnysis" },
    { text: `15/6 - 3/6 = ?`, answer: 2, level: "aukstesnysis" }
  ];
  fractions.forEach((q) => bank.push(q));
  return bank;
}

// Pradinė būsena: sukuriame banką, ištraukiame klausimus ir nustatome pradinius kintamuosius.
let bank = buildBank();

// Grąžina pasirinkto lygio reikšmę ('all' | 'patenkinamas' | 'vidutinis' | 'aukstesnysis')
function getSelectedLevel() {
  const el = document.getElementById('levelSelect');
  return el ? el.value : 'all';
}

// Sukuria testą pagal pasirinktą lygį
function makeQuiz() {
  const level = getSelectedLevel();
  let pool = level === 'all' ? bank : bank.filter((b) => b.level === level);
  if (!pool || pool.length === 0) pool = bank;
  return pickRandomUnique(pool, TOTAL_QUESTIONS);
}

let quiz = makeQuiz();

// Užtikriname, kad testas turėtų bent vieną trupmeninę užduotį
function ensureQuizHasFraction() {
  const hasFraction = quiz.some((q) => /\d+\s*\/\s*\d+/.test(q.text));
  if (hasFraction) return;
  const candidates = bank.filter((b) => /\d+\s*\/\s*\d+/.test(b.text));
  if (candidates.length === 0) return;
  const replaceIdx = randInt(0, Math.max(0, quiz.length - 1));
  quiz[replaceIdx] = candidates[randInt(0, candidates.length - 1)];
}
ensureQuizHasFraction();
let i = 0;
let score = 0;
let reviewMode = false;
const mistakes = [];

// Reikalingi HTML elementai.
const questionEl = document.getElementById("question");
const answerEl = document.getElementById("answer");
const nextBtn = document.getElementById("nextBtn");
const scoreEl = document.getElementById("score");
const resultEl = document.getElementById("result");
const cardEl = document.querySelector(".card");

const resultScreen = document.getElementById("resultScreen");
const finalScore = document.getElementById("finalScore");
const mistakesEl = document.getElementById("mistakes");
const repeatHintEl = document.getElementById("repeatHint");
const fixMistakesBtn = document.getElementById("fixMistakesBtn");
const levelSelect = document.getElementById('levelSelect');
if (levelSelect) {
  levelSelect.addEventListener('change', () => {
    // Kai keičiamas lygis, perkrauname testą
    restart();
  });
}

// Fono efektas: krentantys skaičiai ir formulės.
function initFallingNumbers() {
  const container = document.querySelector(".numbers");
  if (!container) return;

  const count = 140;
  // Supaprastintas formulių rinkinys - be sudėtingų/mokslinių išraiškų
  const symbols = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "−", "×", "÷", "="];
  const formulas = ["2x+3=7", "3×4=12", "12÷3=4", "4+5=9", "7-2=5"];

  for (let n = 0; n < count; n++) {
    const el = document.createElement("span");
    // Kas 7-ą elementą rodome formulę.
    const useFormula = n % 7 === 0;
    el.textContent = useFormula
      ? formulas[randInt(0, formulas.length - 1)]
      : symbols[randInt(0, symbols.length - 1)];
    el.style.setProperty("--x", `${Math.random() * 100}%`);
    el.style.setProperty("--dur", `${randInt(7, 16)}s`);
    // Neigiamas vėlinimas, kad skaičiai būtų matomi iš karto.
    el.style.setProperty("--delay", `-${Math.random() * 8}s`);
    el.style.setProperty("--size", `${useFormula ? randInt(14, 24) : randInt(12, 28)}px`);
    el.style.setProperty("--opa", `${(Math.random() * 0.35 + 0.15).toFixed(2)}`);
    container.appendChild(el);
  }
}

// Parodo dabartinį klausimą ir atnaujina įvestį/taškus.
function show() {
  // Rodyti klausimą: jei yra trupmenų formatu a/b - konvertuojame į vertikalią trupmeną
  const prefix = `(${i + 1}/${quiz.length}) `;
  questionEl.innerHTML = prefix + formatQuestion(quiz[i].text);
  answerEl.value = "";
  answerEl.focus();
  scoreEl.textContent = score;
}

// Teisingo atsakymo animacijos.
function playCorrectEffect() {
  if (cardEl) {
    cardEl.classList.remove("wrong-flash");
    cardEl.classList.remove("correct-flash");
    void cardEl.offsetWidth;
    cardEl.classList.add("correct-flash");
  }

  if (scoreEl) {
    scoreEl.classList.remove("score-pop");
    void scoreEl.offsetWidth;
    scoreEl.classList.add("score-pop");
  }
}

// Neteisingo atsakymo animacija.
function playWrongEffect() {
  if (!cardEl) return;
  cardEl.classList.remove("correct-flash");
  cardEl.classList.remove("wrong-flash");
  void cardEl.offsetWidth;
  cardEl.classList.add("wrong-flash");
}

// Pagrindinis veiksmas: tikriname atsakymą ir pereiname į kitą klausimą.
nextBtn.addEventListener("click", () => {
  const raw = answerEl.value.trim();
  if (raw === "") {
    if (resultEl) resultEl.textContent = "Įvesk atsakymą.";
    return;
  }
  const user = parseAnswer(raw);
  const correct = quiz[i].answer;
  const qText = quiz[i].text;
  const rule = getRuleForQuestion(qText);

  // Lankstus palyginimas: leidžiame mažą paklaidą, kad dešimtainės/ trupmenų įvestys būtų
  // vertinamos teisingai (pvz. 0.333 ~ 1/3). EPSILON nustatyta 0.001.
  const EPSILON = 0.001;
  const isNumber = (v) => typeof v === 'number' && !isNaN(v) && isFinite(v);
  const isCorrect = isNumber(user) && isNumber(correct) && Math.abs(user - correct) < EPSILON;

  // Jei atsakymas teisingas - +1 taškas.
  if (isCorrect) {
    score++;
    playCorrectEffect();
  } else {
    // Jei neteisingas - išsaugome klaidą.
    playWrongEffect();
    mistakes.push({
      question: qText,
      user,
      correct,
      rule
    });
    // Atnaujiname viso puslapio klaidų santrauką ir paryškinimą
    updateGlobalMistakeSummary();
  }

  scoreEl.textContent = score;
  i++;
  if (i >= quiz.length) return finish();
  if (resultEl) {
    resultEl.textContent = "";
    resultEl.style.color = "";
  }
  show();
});

// Baigiamojo ekrano rodymas.
function finish() {
  resultScreen.classList.remove("hidden");
  finalScore.textContent = reviewMode
    ? `Klaidų taisymas: ${score} / ${quiz.length}`
    : `Surinkai ${score} / ${quiz.length}`;
  toggleFixMistakesButton();
  renderRepeatHint();
  renderMistakes();

  // Palikus aiškų, viso puslapio klaidų santraukos banerį
  const bannerId = 'mistakeSummaryBanner';
  let banner = document.getElementById(bannerId);
  const hintText = repeatHintEl ? repeatHintEl.textContent : '';
  if (!banner) {
    banner = document.createElement('div');
    banner.id = bannerId;
    document.body.prepend(banner);
  }
  banner.textContent = hintText ? `Reikėtų pasikartoti: ${hintText.replace(/^Reikėtų pasikartoti:\s*/,'')}` : '';
  document.body.classList.add('has-banner');
}

// Atnaujina / parodo viršutinį banerį ir porina puslapį, kai yra klaidų.
function updateGlobalMistakeSummary() {
  const bannerId = 'mistakeSummaryBanner';
  let banner = document.getElementById(bannerId);
  if (!banner) {
    banner = document.createElement('div');
    banner.id = bannerId;
    document.body.prepend(banner);
  }

  // Suskaičiuojame temų dažnius pagal klaidų masyvą
  const counts = {};
  mistakes.forEach((m) => {
    const topic = getTopicForQuestion(m.question);
    counts[topic] = (counts[topic] || 0) + 1;
  });
  const parts = Object.entries(counts)
    .sort((a,b) => b[1]-a[1])
    .map(([name,c]) => `${name} (${c})`);
  banner.textContent = parts.length ? `Reikėtų pasikartoti: ${parts.join(', ')}` : '';

  // Paryškinti puslapį, kad būtų aišku, jog yra klaidų
  if (mistakes.length > 0) {
    document.body.classList.add('has-banner');
    document.body.classList.add('has-mistake');
  } else {
    document.body.classList.remove('has-mistake');
    document.body.classList.remove('has-banner');
    const existing = document.getElementById(bannerId);
    if (existing) existing.remove();
  }
}

// Pilnas testo perkrovimas (jei prireiktų ateityje).
function restart() {
  bank = buildBank();
  quiz = makeQuiz();
  ensureQuizHasFraction();
  i = 0;
  score = 0;
  reviewMode = false;
  mistakes.length = 0;
  scoreEl.textContent = score;
  resultScreen.classList.add("hidden");
  // remove banner if present
  const existing = document.getElementById('mistakeSummaryBanner');
  if (existing) existing.remove();
  document.body.classList.remove('has-banner');
  show();
}

// Paleidžia mini testą tik iš klaidų.
function startMistakeReview() {
  if (mistakes.length === 0) return;
  const retryQuiz = mistakes.map((m) => ({
    text: m.question,
    answer: m.correct
  }));

  quiz = retryQuiz;
  i = 0;
  score = 0;
  reviewMode = true;
  mistakes.length = 0;
  scoreEl.textContent = score;
  resultScreen.classList.add("hidden");
  if (resultEl) resultEl.textContent = "";
  show();
}

// Rodo / slepia mygtuką „Ištaisyti klaidas“.
function toggleFixMistakesButton() {
  if (!fixMistakesBtn) return;
  if (mistakes.length === 0) {
    fixMistakesBtn.classList.add("hidden");
    return;
  }
  fixMistakesBtn.classList.remove("hidden");
}

// Atsitiktinis sveikas skaičius intervale [min, max].
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Paimame n atsitiktinių elementų be pasikartojimų.
function pickRandomUnique(arr, n) {
  const copy = [...arr];
  shuffle(copy);
  return copy.slice(0, Math.min(n, copy.length));
}

// Masyvo maišymas (Fisher-Yates).
function shuffle(a) {
  for (let k = a.length - 1; k > 0; k--) {
    const j = Math.floor(Math.random() * (k + 1));
    [a[k], a[j]] = [a[j], a[k]];
  }
}

// Parenka taisyklę pagal užduoties tipą.
function getRuleForQuestion(text) {
  if (text.includes("×")) {
    return "Taisyklė: daugyba reiškia, kad pirmą skaičių sudedame tiek kartų, kiek rodo antras. Pvz.: 12 × 3 = 36.";
  }
  if (text.includes("÷")) {
    return "Taisyklė: dalyba reiškia, kiek kartų daliklis telpa dalinyje. Pvz.: 12 ÷ 3 = 4.";
  }
  if (text.includes("/")) {
    return "Taisyklė: trupmenas galima užrašyti kaip a/b arba atsakymą dešimtainiu skaičiumi (pvz. 0.75).";
  }
  if (text.includes("nuvažiavo") || text.includes("važiavo") || text.includes("km/h")) {
    return "Taisyklė: atstumas s = v × t (greitis × laikas).";
  }
  return "Taisyklė: atidžiai perskaityk uždavinį ir atlik reikiamą veiksmą.";
}

// Parsina vartotojo įvestį: leidžiame dešimtaines reikšmes arba trupmenas 'a/b'.
function parseAnswer(raw) {
  const s0 = raw.replace(',', '.').trim();
  const sNoCR = s0.replace(/\r/g, "");

  // Pabandome aptarnauti įklijuotas vertikalias trupmenas:
  // 1
  // --
  // 4
  const lines = sNoCR.split('\n').map(l => l.trim()).filter(l => l !== '');
  if (lines.length === 3) {
    // tikriname, ar vidurinis eilutė yra brūkšnys (----)
    if (/^[-‒–—]{1,}$/.test(lines[1])) {
      const num = Number(lines[0]);
      const den = Number(lines[2]);
      if (!isNaN(num) && !isNaN(den) && den !== 0) return num / den;
    }
  }
  if (lines.length === 2) {
    // kartais įklijuojama be brūkšnio: numerator\ndenominator
    const num = Number(lines[0]);
    const den = Number(lines[1]);
    if (!isNaN(num) && !isNaN(den) && den !== 0) return num / den;
  }

  // Palaikome formatus kaip "1--4", "1 - 4" arba su skirtingais brūkšniais
  const compactDash = sNoCR.match(/^(\d+)\s*[-‒–—]+\s*(\d+)$/);
  if (compactDash) {
    const num = Number(compactDash[1]);
    const den = Number(compactDash[2]);
    if (!isNaN(num) && !isNaN(den) && den !== 0) return num / den;
  }

  // Tradicinis trupmenos formatas a/b
  if (sNoCR.includes('/')) {
    const parts = sNoCR.split('/').map(p => p.trim());
    if (parts.length === 2) {
      const num = Number(parts[0]);
      const den = Number(parts[1]);
      if (!isNaN(num) && !isNaN(den) && den !== 0) return num / den;
    }
  }

  return Number(sNoCR);
}

// Papildoma pagalbinė funkcija: užtikrintai suformatuoja klausimo tekstą
// pakeičiant a/b trupmenas į HTML struktūrą, kuri atvaizduoja trupmeną vertikaliai.
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatQuestion(text) {
  // Pirmiausia užtikriname, kad tekstas būtų HTML-escaped
  let safe = escapeHtml(text);

  // Pakeičiame visus paprastus trupmenų formatus a/b į vertikalią trupmeną
  // pvz. "1/3" -> <span class="fraction"><span class="num">1</span><span class="bar"></span><span class="den">3</span></span>
  safe = safe.replace(/(\d+)\s*\/\s*(\d+)/g, function(_, p1, p2) {
    return `<span class="fraction"><span class="num">${p1}</span><span class="bar"></span><span class="den">${p2}</span></span>`;
  });

  return safe;
}

// Atvaizduoja klaidas rezultatų bloke.
function renderMistakes() {
  if (!mistakesEl) return;
  if (mistakes.length === 0) {
    mistakesEl.textContent = "Klaidų nėra. Puiku!";
    return;
  }

  mistakesEl.innerHTML = "";
  mistakes.forEach((m, idx) => {
    const item = document.createElement("div");
    item.className = "small mistake-item";
    item.style.marginBottom = "8px";
    const rulePart = m.rule ? `<span class="mistake-rule"> ${m.rule}</span>` : "";
    item.innerHTML =
      `${idx + 1}. ${m.question} | Tavo atsakymas: ` +
      `<span class="mistake-user">${m.user}</span> | ` +
      `Teisingas atsakymas: <span class="mistake-correct">${m.correct}</span>.` +
      `${rulePart}`;
    mistakesEl.appendChild(item);
    // Trumpas pulse efektas naujai pridėtam elementui
    item.classList.add('mistake-pulse');
    setTimeout(() => item.classList.remove('mistake-pulse'), 1000);
  });
}

// Nustato temą, kad galėtume rekomenduoti ką kartoti.
function getTopicForQuestion(text) {
  if (text.includes("×")) return "Daugyba";
  if (text.includes("÷")) return "Dalyba";
  if (text.includes("nuvažiavo") || text.includes("važiavo") || text.includes("km/h")) {
    return "Judėjimo uždaviniai";
  }
  return "Bendri skaičiavimai";
}

// Parodo patarimą, kurias temas reikėtų pasikartoti.
function renderRepeatHint() {
  if (!repeatHintEl) return;
  if (mistakes.length === 0) {
    repeatHintEl.textContent = reviewMode
      ? "Puiku, klaidos ištaisytos."
      : "Kartoti nereikia, viskas teisinga.";
    return;
  }

  const counts = {};
  mistakes.forEach((m) => {
    const topic = getTopicForQuestion(m.question);
    counts[topic] = (counts[topic] || 0) + 1;
  });

  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, c]) => `${name} (${c})`);
  repeatHintEl.textContent = `Reikėtų pasikartoti: ${sorted.join(", ")}.`;
}

// Mygtuko „Ištaisyti klaidas“ įvykis.
if (fixMistakesBtn) {
  fixMistakesBtn.addEventListener("click", startMistakeReview);
}

// Pradinis paleidimas.
initFallingNumbers();
show();
