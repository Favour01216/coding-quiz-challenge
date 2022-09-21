let mainStartScreen = document.querySelector('.container-start');
let viewHighScoresBtn = document.querySelector('.view-high-scores');
let quizOpen = document.querySelector('.container-quiz');
let highScoreScreen = document.querySelector('.container-high-score');
let changeQuestionNum = document.querySelector('#question-num');
let questionPrompt = document.querySelector('#question');
let answerButtons = document.querySelectorAll('.answer');
let answerAlert = document.querySelector('#alert');
let timerEl = document.getElementById('timer');
let removeTimePlaceHold = document.getElementById('remove-time');
let gameIntro = document.createElement('h2');
let infoTag = document.createElement('p');
let startQuizBtn = document.createElement('button');
startQuizBtn.classList.add('.btn-start');
let cutDisplay = document.querySelector('.anchor');

let renderCount = 0 

let fakeRender = 0;

let sortedDictionary;  // Randomizes the questions in the questionDictionary object.
let sortedDictionaryIndex = 0; 

// Keeps track of the score for the user and displays it while he is doing the quiz
let scoreCount = 0; 
let updateScore = document.querySelector('.score-count')
updateScore.textContent = scoreCount; 

let highScoresList = [ ]; 
// The purpose of this function is to show and populate the main screen as well as hide any other screens behind it.
let mainScreen = function () {
    mainStartScreen.style.display = 'flex';
    highScoreScreen.style.display = 'none';

    gameIntro.textContent = "Welcome to The Ultimate Coding Quiz";
    infoTag.textContent = "Answer the multiple choice questions in the right amount of time. GOODLUCK!";
    startQuizBtn.textContent ="Start Quiz!";
    startQuizBtn.classList.add('btn-start')

    mainStartScreen.appendChild(gameIntro);
    mainStartScreen.appendChild(infoTag);
    mainStartScreen.appendChild(startQuizBtn);

    for (let i = 0; i < 3; i++) {
        mainStartScreen.children[i].setAttribute("style", "margin: 20px;")
    }
}

function countdown() {
    // Creates an h4 element to display the time count down
    let timeSeconds = document.createElement("h4");
    let timeStart = 20; // Starts timer at 20 seconds
    timeSeconds.classList.add('seconds'); 
       timerEl.appendChild(timeSeconds); // Appends it to the timer id
    // 
    let startTimer = setInterval(function() {
        // Once the timer starts this removes the placeholder
        if (timeStart === 20) {
            timerEl.removeChild(removeTimePlaceHold);
        }
        timeStart--;
        timeSeconds.textContent = timeStart;
        // If the timer falls below 0 the time interval stops and enters the submit highscore page
        if (timeStart < 0 ){
            timeSeconds.textContent = 0;
            clearInterval(startTimer);
            enterHighScore();
        }
        // If user finishes quiz before that time the the high score page is popped up
        else if (sortedDictionaryIndex === questionsDictionary.length) {
            timeSeconds.textContent = timeStart;
            clearInterval(startTimer);
        }
        
    }, 1000);
}

// This function randomizes the questions dictionary and then calls the loadQuestions function 
function initializeDictionary() {
    sortedDictionary = questionsDictionary.sort(function(){return 0.5 - Math.random()});
    loadQuestion();
}

// This function loads questions and values to the corresponding locations so that it appears as a question with four answer options 
function loadQuestion () {
    questionPrompt.innerText = sortedDictionary[sortedDictionaryIndex].question;
    changeQuestionNum.textContent = (sortedDictionaryIndex + 1);
    for (let i = 0; i < 4; i++) {
        answerButtons[i].innerText = sortedDictionary[sortedDictionaryIndex].answers[i]["answer"];
        answerButtons[i].value = sortedDictionary[sortedDictionaryIndex].answers[i]["status"];
    }
    answerButtons.forEach(item => {item.addEventListener('click',selectAnswer)})
}

function selectAnswer (event) {
    let selectedButton = event.target;

    if (selectedButton.value === "1"){
        correctAnswerAlert();
        scoreCount = scoreCount + 10;
        updateScore.textContent = scoreCount;
    }
    else {
        wrongAnswerAlert();
    }
    sortedDictionaryIndex ++;
    if(sortedDictionaryIndex === questionsDictionary.length) {
        enterHighScore();
    }
    if (sortedDictionaryIndex < questionsDictionary.length) {
        loadQuestion();
    }
}

// show up letting the player know the answer is correct
function correctAnswerAlert () {
    let time = 1;
    answerAlert.innerText = "Correct";
    answerAlert.style.backgroundColor="lightgreen";
    let startTimer = setInterval(function() {
        time--;
        if (time === 0){
            answerAlert.innerText = " ";
            answerAlert.style.backgroundColor="transparent";
            clearInterval(startTimer);
        }
        
    }, 1000);
}

// Pops up an alert saying the answer is incorrct
function wrongAnswerAlert () {
    let time = 1;
    answerAlert.style.backgroundColor="crimson";
    let startTimer = setInterval(function() {
        time--;
        if (time === 0){
            answerAlert.innerText = " ";
            answerAlert.style.backgroundColor="transparent";
            clearInterval(startTimer);
        }
        
    }, 1000);
}

//highscore
function enterHighScore () {        
    let finalScore = document.querySelector(".your-score");
    let enterScore = document.querySelector(".high-score-input");
    let submitScore = document.querySelector(".high-score-enter");

    finalScore.textContent = "Final Score: "+scoreCount;

    quizOpen.style.display = 'none';
    highScoreScreen.style.display = 'flex';

    highScoreScreen.appendChild(finalScore);

    submitScore.addEventListener("click",function(event) {
        event.preventDefault();
        let scoreText = enterScore.value.trim();

        if (scoreText === " ") {
            enterHighScore();
        }

        highScoresList.push({
            name: scoreText,
            score: scoreCount});

        let sortedHighScoresList = highScoresList.sort((a,b) => { return b.score - a.score;})

        highScoresList = sortedHighScoresList;

        enterScore.value = " ";

        cutDisplay.style.display= 'none';
        
        storeScore();
        renderHighScores(1, scoreText, scoreCount);

    });

}

function renderHighScores(renderCount,scoreText,scoreCount) {
    let highScores = document.querySelector(".high-score-list");
    if (renderCount > 0) {
        let newRow = document.createElement('tr');
        let tdName = document.createElement("td");
        let tdScore = document.createElement("td");

        tdName.textContent = scoreText;
        tdScore.textContent = scoreCount;

        highScores.appendChild(newRow);
        newRow.appendChild(tdName);
        newRow.appendChild(tdScore);

        return;
    }
  
    renderCount++;
    for (let i = 0; i < highScoresList.length; i++) {
        let newRow = document.createElement('tr');
        let tdName = document.createElement('td');
        let tdScore = document.createElement('td');

        tdName.textContent = highScoresList[i].name;
        tdScore.textContent = highScoresList[i].score;
        
        highScores.appendChild(newRow);
        newRow.appendChild(tdName);
        newRow.appendChild(tdScore);
    }
  
}

function storeScore() {
    localStorage.setItem("highScoresList", JSON.stringify(highScoresList));
}

function init() {
    let storedScores = JSON.parse(localStorage.getItem("highScoresList"));

    if (storedScores !== null){
        highScoresList = storedScores;
    }

    renderHighScores(renderCount);

    return storedScores;
}

//--------------------------------
mainScreen();
init();
startQuizBtn.addEventListener("click", function() {
    mainStartScreen.style.display = 'none';
    quizOpen.style.display = 'flex';
    countdown();
    initializeDictionary();
});

viewHighScoresBtn.addEventListener('click', function() {
    mainStartScreen.style.display = 'none';
    quizOpen.style.display = 'none';
    highScoreScreen.style.display = 'flex';
    cutDisplay.style.display = 'none';
});

let questionsDictionary = [
    {
        question: 'What is the name of the fastest land animal?',
        answers: [
          { answer: 'Cheetah', status: 1 },
          { answer: 'Lion', status: 0 },
          { answer: 'Antelope', status: 0 },
          { answer: 'giraffe', status: 0 }
        ]
      },
      {
        question: 'What is the nationality of Picasso?',
        answers: [
          { answer: 'Spanish', status: 1 },
          { answer: 'French', status: 0 },
          { answer: 'German', status: 0 },
          { answer: 'Portuguese', status: 0 }
        ]
      },
      {
        question: 'What is the number one seller at Walmart?',
        answers: [
          { answer: 'T shirts', status: 0 },
          { answer: 'Milk', status: 0 },
          { answer: 'Water', status: 0 },
          { answer: 'Bananas', status: 1 }
        ]
      },
      {
        question: 'How many seasons did the Oprah Winfrey Show run for?',
        answers: [
          { answer: '12 seasons', status: 0 },
          { answer: '15 seasons', status: 0 },
          { answer: '25 seasons', status: 1 },
          { answer: '10 seasons', status: 0 }
        ]
      },
      {
        question: 'Was there room for jack to fit on the door?',
        answers: [
          { answer: 'No', status: 0 },
          { answer: 'Maybe', status: 0 },
          { answer: 'Yes', status: 1 },
          { answer: 'It was a tight squeeze', status: 0 }
        ]
      },
      {
        question: 'What famous character is known for saying, ILL BE BACK?',
        answers: [
          { answer: 'Captain America', status: 0 },
          { answer: 'The Terminator', status: 1 },
          { answer: 'James Bond', status: 0 },
          { answer: 'Bruce Lee', status: 0 }
        ]
      },
      {
        question: 'who invented the car',
        answers: [
          { answer: 'Thomas Edison', status: 0 },
          { answer: 'Carl Benz', status: 1 },
          { answer: 'Albert Einstein', status: 0 },
          { answer: 'Henry Ford', status: 0 }
        ]
      },
      {
        question: 'Whats the capital of Spain?',
        answers: [
          { answer: 'Barcelona', status: 0 },
          { answer: 'milan', status: 0 },
          { answer: 'seville', status: 0 },
          { answer: 'madrid', status: 1 }
        ]
     }, 
      {
        question: ' Which villain is known for saying the following: “Why So Serious?"',
        answers: [
            { answer: 'Batman', status: 0 },
            { answer: 'Iron man', status: 0 },
            { answer: 'Thor', status: 0 },
            { answer: 'Joker', status: 1 }
        ]   
     }, 
     {
      question: 'Which movie franchise is known for the following: “May the odds be ever in your favour.”',
      answers: [
          { answer: 'Maze Runner', status: 0 },
          { answer: 'Gladiator', status: 0 },
          { answer: 'Hobbit', status: 0 },
          { answer: 'The hunger games', status: 1 }
        ] 
   
    }

]





