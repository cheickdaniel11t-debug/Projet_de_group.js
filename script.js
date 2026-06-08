const questionsData = [
  {
    question: "Quelle est la capitale officielle de la Côte d'Ivoire ?",
    choix: ["Abidjan", "Yamoussoukro", "Bouaké", "San Pedro"],
    reponseCorrecte: "Yamoussoukro",
  },
  {
    question: "Quel est le plus grand port de la Côte d'Ivoire ?",
    choix: [
      "Port de San Pedro",
      "Port d'Abidjan",
      "Port de Bassam",
      "Port de Yamoussoukro",
    ],
    reponseCorrecte: "Port d'Abidjan",
  },
  {
    question: "La Côte d'Ivoire est le premier producteur mondial de :",
    choix: ["Café", "Cacao", "Noix de cajou", "Huile de palme"],
    reponseCorrecte: "Cacao",
  },
  {
    question: "Qui est l'actuel président de la Côte d'Ivoire (en 2026) ?",
    choix: [
      "Laurent Gbagbo",
      "Henri Konan Bédié",
      "Alassane Ouattara",
      "Guillaume Soro",
    ],
    reponseCorrecte: "Alassane Ouattara",
  },
  {
    question: "Quel footballeur ivoirien est surnommé 'l'Eléphant' ?",
    choix: ["Yaya Touré", "Didier Drogba", "Wilfried Bony", "Gervinho"],
    reponseCorrecte: "Didier Drogba",
  },
  {
    question:
      "Quelle est la couleur principale du drapeau de la Côte d'Ivoire ?",
    choix: [
      "Bleu, blanc, rouge",
      "Vert, blanc, orange",
      "Rouge, jaune, vert",
      "Orange, blanc, vert",
    ],
    reponseCorrecte: "Orange, blanc, vert",
  },
  {
    question:
      "Quelle est la plus grande ville économique de la Côte d'Ivoire ?",
    choix: ["Yamoussoukro", "Abidjan", "Bouaké", "Daloa"],
    reponseCorrecte: "Abidjan",
  },
  {
    question:
      "Quel est le nom du groupe ethnique le plus important en Côte d'Ivoire ?",
    choix: ["Baoulé", "Bété", "Malinké", "Sénoufo"],
    reponseCorrecte: "Baoulé",
  },
  {
    question: "Quelle est la capitale de la France ?",
    choix: ["Lyon", "Paris", "Marseille", "Toulouse"],
    reponseCorrecte: "Paris",
  },
  {
    question: "Combien font 8 × 7 ?",
    choix: ["54", "56", "49", "63"],
    reponseCorrecte: "56",
  },
  {
    question: "Qui a peint La Joconde ?",
    choix: ["Van Gogh", "Picasso", "Léonard de Vinci", "Monet"],
    reponseCorrecte: "Léonard de Vinci",
  },
  {
    question: "En quelle année l'homme a-t-il marché sur la Lune ?",
    choix: ["1969", "1972", "1965", "1975"],
    reponseCorrecte: "1969",
  },
];

let questions = [];
let indexQuestion = 0;
let score = 0;
let timer;
let tempsRestant = 30;
let historique = JSON.parse(localStorage.getItem("quizHistorique")) || [];

// Éléments HTML
const startScreen = document.getElementById("startScreen");
const quizScreen = document.getElementById("quizScreen");
const resultScreen = document.getElementById("resultScreen");
const pseudoInput = document.getElementById("pseudo");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const timerEl = document.getElementById("timer");
const feedbackEl = document.getElementById("feedback");
const scoreTextEl = document.getElementById("scoreText");
const messageEl = document.getElementById("message");
const rankingEl = document.getElementById("ranking");

function melanger(tab) {
  for (let i = tab.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tab[i], tab[j]] = [tab[j], tab[i]];
  }
  return tab;
}

function demarrerTimer() {
  clearInterval(timer);
  tempsRestant = 30;
  timerEl.textContent = tempsRestant;

  timer = setInterval(() => {
    tempsRestant--;
    timerEl.textContent = tempsRestant;
    if (tempsRestant <= 0) {
      clearInterval(timer);
      feedbackEl.innerHTML = "⏰ <strong>Temps écoulé !</strong>";
      feedbackEl.style.color = "orange";
      setTimeout(questionSuivante, 1800);
    }
  }, 1000);
}

function afficherQuestion() {
  if (indexQuestion >= questions.length) {
    finQuiz();
    return;
  }

  const q = questions[indexQuestion];
  questionEl.textContent = q.question;
  feedbackEl.textContent = "";
  answersEl.innerHTML = "";

  const choixMelanges = melanger([...q.choix]);

  choixMelanges.forEach((choix) => {
    const btn = document.createElement("button");
    btn.classList.add("answer-btn");
    btn.textContent = choix;
    btn.addEventListener("click", () => verifierReponse(choix, btn));
    answersEl.appendChild(btn);
  });

  demarrerTimer();
}

function verifierReponse(choix, bouton) {
  clearInterval(timer);
  const q = questions[indexQuestion];
  const estCorrect = choix === q.reponseCorrecte;

  document.querySelectorAll(".answer-btn").forEach((b) => (b.disabled = true));

  if (estCorrect) {
    score++;
    bouton.classList.add("correct");
    feedbackEl.innerHTML = "✅ <strong>Correct !</strong>";
    feedbackEl.style.color = "green";
  } else {
    bouton.classList.add("wrong");
    feedbackEl.innerHTML = `❌ Faux ! La bonne réponse était : <strong>${q.reponseCorrecte}</strong>`;
    feedbackEl.style.color = "red";

    document.querySelectorAll(".answer-btn").forEach((b) => {
      if (b.textContent === q.reponseCorrecte) b.classList.add("correct");
    });
  }

  setTimeout(questionSuivante, 2200);
}

function questionSuivante() {
  indexQuestion++;
  afficherQuestion();
}

function finQuiz() {
  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  const pourcentage = Math.round((score / questions.length) * 100);
  scoreTextEl.textContent = `Score : ${score} / ${questions.length} (${pourcentage}%)`;

  let message = "";
  if (pourcentage === 100) message = "🎉 Parfait ! Tu es un génie !";
  else if (pourcentage >= 80) message = "🥇 Excellent travail !";
  else if (pourcentage >= 60) message = "👍 Bien joué !";
  else if (pourcentage >= 40) message = "🙂 Pas mal !";
  else message = "😅 Courage, réessaie !";

  messageEl.textContent = message;

  const pseudo = pseudoInput.value.trim() || "Anonyme";
  historique.push({
    pseudo,
    score,
    total: questions.length,
    date: new Date().toLocaleString("fr-FR"),
  });
  historique.sort((a, b) => b.score - a.score);
  historique = historique.slice(0, 20);
  localStorage.setItem("quizHistorique", JSON.stringify(historique));

  afficherClassement();
}

function afficherClassement() {
  rankingEl.innerHTML = "";
  historique.forEach((p, i) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>#${i + 1}</strong> ${p.pseudo} — ${p.score}/${p.total} <small>(${p.date})</small>`;
    rankingEl.appendChild(li);
  });
}

// Événements
startBtn.addEventListener("click", () => {
  if (!pseudoInput.value.trim()) {
    alert("Veuillez entrer un pseudo !");
    return;
  }

  questions = melanger([...questionsData]);
  indexQuestion = 0;
  score = 0;

  startScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  resultScreen.classList.add("hidden");

  afficherQuestion();
});

restartBtn.addEventListener("click", () => {
  resultScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
  pseudoInput.value = "";
});

afficherClassement();
