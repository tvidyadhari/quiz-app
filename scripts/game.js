const game = document.querySelector(".game");
const loader = document.querySelector(".loader");
const question = document.querySelector(".question");
const options = document.querySelectorAll(".option-text");
const currentQuestionDOM = document.querySelector("#current-question");

//TODO: have a menu where user can choose what they want
const apiURL =
    "https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple";
let score = 0;
let correct = 0;
let currentQuestion = 0;
let questions = [];
const timerProgess = document.querySelector(".timer");
let timer = 5 * 1000; // 10 seconds; if this is changed; change the timer of css too
let intervalID = null;

const startGame = () => {
    score = 0;
    correct = 0;
    currentQuestion = 0;
    options.forEach((option) => option.addEventListener("click", handleClick));
    nextQuestion();
    loader.classList.add("hidden");
    game.classList.remove("hidden");
};

const populateQuestion = () => {
    // end game condition
    if (currentQuestion == 10) {
        clearInterval(intervalID);
        localStorage.setItem("score", score);
        return window.location.replace("end.html");
    }

    question.innerHTML = questions[currentQuestion].question;
    options.forEach((option, index) => {
        option.innerHTML = questions[currentQuestion].options[index];
    });
    currentQuestionDOM.innerHTML = `Question ${
        currentQuestion + 1
    }<span id="total">/ 10</span>`;

    currentQuestion += 1;
    // restarting css animation; ref: https://css-tricks.com/restart-css-animation/
    timerProgess.classList.remove("animate-timer");
    timerProgess.offsetWidth = timerProgess.offsetWidth;
    timerProgess.classList.add("animate-timer");
};

// timer + populate next question after timer runs out
const nextQuestion = () => {
    clearInterval(intervalID);
    populateQuestion();
    intervalID = setInterval(() => {
        console.log(currentQuestion);
        populateQuestion(); // add a question
    }, timer);
};

// handle left-click event
const handleClick = (event) => {
    const clickedOption = event.target;
    if (questions[currentQuestion - 1].answer === clickedOption.innerText) {
        score += 1;
        clickedOption.parentNode.classList.add("correct");
    } else clickedOption.parentNode.classList.add("wrong");
    setTimeout(() => {
        clickedOption.parentNode.classList.remove("correct");
        clickedOption.parentNode.classList.remove("wrong");
        nextQuestion();
    }, 250);
};

// util function for shuffling an array
// ref: https://en.wikipedia.org/wiki/Fisher-Yates_shuffle#The_modern_algorithm
let shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

// api call using fetch
fetch(apiURL)
    .then((response) => response.json()) // converting to json
    .then((data) => {
        // processing data
        questions = data.results.map((item) => {
            return {
                question: item.question,
                answer: item.correct_answer,
                options: shuffle([
                    ...item.incorrect_answers,
                    item.correct_answer,
                ]),
            };
        });
        // start game
        startGame();
    })
    .catch((err) => {
        document.body.innerHTML = "something went wrong";
        console.log(err);
    });
