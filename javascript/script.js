

document.addEventListener("DOMContentLoaded", () => {
    const timerDisplay = document.querySelector(".time");
    console.log(timerDisplay); // Logga för att se om timerDisplay finns
    
    if (!timerDisplay) {
        console.error('Elementet .time finns inte.');
        return;  // Stoppa koden om elementet inte finns
    }
    
    // Resten av din kod här...

   


const answerOptions = document.querySelector(".answers");
const nextQuestion = document.querySelector(".next-btn");
const questionStatus = document.querySelector(".q-status");
// const timerDisplay = document.querySelector(".time");
const resultCon = document.querySelector(".result-container");
const quizCon = document.querySelector(".quiz-container");
const appCon = document.querySelector(".app-container");
const qTitle = document.querySelector(".q-title");


let quizCategory = "geografi";
let currentQuestion = null;
const qIndexHistory = [];
let numbQuestion = 5;
const TIME_LIMIT = 10;
let currentTime = TIME_LIMIT;
let timer = null;
let correctCount = 0;

const showResult = () =>{
    quizCon.style.display = "none";
    resultCon.style.display = "block";

    const resultText = `Du svarade <b>${correctCount}</b> av <b>${numbQuestion}</b>
        frågor rätt,`;
    document.querySelector(".result-msg").innerHTML = resultText;

}

const resetTimer = () => {
    clearInterval(timer);
    currentTime = TIME_LIMIT
    timerDisplay.textContent = `${currentTime}s`;

}

const startTimer = () => {
    timer = setInterval(() => {
        currentTime--;
        timerDisplay.textContent = `${currentTime}s`;

        if(currentTime <= 0){
            clearInterval(timer);
            highlightCorrectAnswer();
            nextQuestion.style.visibility="visible";
            quizCon.querySelector(".q-timer").style.background = "#c31402";

            answerOptions.querySelectorAll(".a-option").forEach(option => option.style.pointerEvents="none");
            
        }
    }, 1000);
}

const getRandomQuestion = () => {
    const categoryQuestions = questions.find(cat => cat.category.toLowerCase() === quizCategory.toLowerCase()).questions || [];

    if (qIndexHistory.length >= Math.min(categoryQuestions.length, numbQuestion)) {
        return showResult();
    }

    // Filtrera ut frågor som inte har valts ännu
    const availableQuestions = categoryQuestions.filter((_, index) => !qIndexHistory.includes(index));

    // Välj en slumpmässig fråga
    const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];

    // Hitta rätt index för frågan i originalarrayen
    const qIndex = categoryQuestions.findIndex(q => q.question === randomQuestion.question);
    qIndexHistory.push(qIndex);

    return randomQuestion;
};


const highlightCorrectAnswer = () => {
    const correctOption = answerOptions.querySelectorAll(".a-option")[currentQuestion.correctAnswer];
    correctOption.classList.add("correct");
    const iconHTML = `<span class = "material-icons">check_circle</span>`;
    correctOption.insertAdjacentHTML("beforeend", iconHTML);
}

const handleAnswer = (option,ansIndex) =>{
    clearInterval(timer);
    const isCorrect = currentQuestion.correctAnswer === ansIndex;
    option.classList.add(isCorrect ? 'correct' : 'incorrect');

    !isCorrect ? highlightCorrectAnswer() : correctCount++;

    const iconHTML = `<span class = "material-icons">${isCorrect ? 'check_circle' : 'cancel'}</span>`;
    option.insertAdjacentHTML("beforeend", iconHTML);

    answerOptions.querySelectorAll(".a-option").forEach(option => option.style.pointerEvents="none");
    nextQuestion.style.visibility="visible";
} 

const renderQuestion =() => {
    currentQuestion = getRandomQuestion();
    if(!currentQuestion) return;
    
    resetTimer();
    startTimer();

    answerOptions.innerHTML = "";
    nextQuestion.style.visibility="hidden";
    quizCon.querySelector(".q-timer").style.background = "#32313c";
    document.querySelector(".q-question").textContent= currentQuestion.question;
    questionStatus.innerHTML = `<b>${qIndexHistory.length}</b> of <b>${numbQuestion}</b> Questions`;
    qTitle.innerHTML = `Quize App: ${quizCategory}`;
    

    currentQuestion.options.forEach((option ,index) => {
        const li = document.createElement("li");
        li.classList.add("a-option");
        li.textContent = option;
        answerOptions.appendChild(li);
        li.addEventListener("click", () => handleAnswer(li,index));
    });
}

const categoryMapping = {
    "Geografi": "Geografi",
    "Matematik": "Matematik"
};

const startQuiz = () => {
    appCon.style.display = "none";
    quizCon.style.display = "block";
    qIndexHistory.length = 0;

    // Hämta den aktiva knappens textinnehåll (t.ex. "Geografi")
    const activeCategoryText = appCon.querySelector(".category-btn.active").textContent;

    // Mappa den svenska texten på knappen till rätt kategori i questions.js
    quizCategory = categoryMapping[activeCategoryText] || "Geografi";  // Standard till "Geografi" om inget matchas

    numbQuestion = parseInt(appCon.querySelector(".no-q.active").textContent);

    renderQuestion();
}


document.querySelectorAll(".category-btn, .no-q").forEach(option => {
    option.addEventListener("click", () => {
        option.parentNode.querySelector(".active").classList.remove("active");
        option.classList.add("active");
    })
})

const restQuiz = () =>{
    resetTimer();
    correctCount = 0;
    qIndexHistory.length=0;
    appCon.style.display = "block";
    resultCon.style.display = "none";
}

renderQuestion();
nextQuestion.addEventListener("click", renderQuestion);
document.querySelector(".try-again").addEventListener("click", restQuiz);
document.querySelector(".start-btn").addEventListener("click", startQuiz);
});