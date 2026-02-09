// Debug žinutė: padeda matyti, ar failas užsikrovė.
console.log("quiz.js loaded");

// Kiek klausimų bus viename teste.
const TOTAL_QUESTIONS = 10;

// Sugeneruoja visą užduočių banką (iš jo vėliau parenkami klausimai testui).
function buildBank() {
  const bank = [];

  // 20 daugybos klausimų.
  for (let i = 0; i < 20; i++) {
    const a = randInt(6, 25);
    const b = randInt(6, 25);
    bank.push({
      text: `${a} × ${b} = ?`,
      answer: a * b
    });
  }

  // 10 dalybos klausimų be liekanos.
  for (let i = 0; i < 10; i++) {
    const b = randInt(2, 12);
    const ans = randInt(6, 30);
    const a = b * ans;
    bank.push({
      text: `${a} ÷ ${b} = ?`,
      answer: ans
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
      answer: v * t
    });
  }

  return bank;
}

// Pradinė būsena: sukuriame banką, ištraukiame klausimus ir nustatome pradinius kintamuosius.
let bank = buildBank();
let quiz = pickRandomUnique(bank, TOTAL_QUESTIONS);
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

// Fono efektas: krentantys skaičiai ir formulės.
function initFallingNumbers() {
  const container = document.querySelector(".numbers");
  if (!container) return;

  const count = 140;
  const symbols = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "−", "×", "÷", "=", "π", "√", "x²"];
  const formulas = ["a²+b²=c²", "√9=3", "2x+3=7", "sin x", "cos x", "E=mc²", "3×4=12", "12÷3=4"];

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
  questionEl.textContent = `(${i + 1}/${quiz.length}) ${quiz[i].text}`;
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

  const user = Number(raw);
  const correct = quiz[i].answer;
  const qText = quiz[i].text;
  const rule = getRuleForQuestion(qText);

  // Jei atsakymas teisingas - +1 taškas.
  if (user === correct) {
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
}

// Pilnas testo perkrovimas (jei prireiktų ateityje).
function restart() {
  bank = buildBank();
  quiz = pickRandomUnique(bank, TOTAL_QUESTIONS);
  i = 0;
  score = 0;
  reviewMode = false;
  mistakes.length = 0;
  scoreEl.textContent = score;
  resultScreen.classList.add("hidden");
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
  if (text.includes("nuvažiavo") || text.includes("važiavo") || text.includes("km/h")) {
    return "Taisyklė: atstumas s = v × t (greitis × laikas).";
  }
  return "Taisyklė: atidžiai perskaityk uždavinį ir atlik reikiamą veiksmą.";
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
