
//select Element 
let countSpan1 = document.querySelector(".count .sp1");
let countSpan2 = document.querySelector(".count .sp2");
let mainBullets = document.querySelector(".bullets"); 
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answereArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let myRes = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");
let loader = document.querySelector(".preloader");

//array for all answers
let allAnsweres = ["noun", "verb", "adjective", "adverb"];

//set options
let index = 0,
    rightAnswers = 0,
    countdownInterval;

// Fetch data use fetch api
async function getQuestions(api) {
    let data = fetch(api).then((res) => {
        return res.json();
    })
    return data;
}

getQuestions("TestData.json").then((data) => {
    return data.wordList;
}).then((data) => {
    let qCount = data.length;
    console.log(qCount);

    //function to create Bullets + set question count
    createBulltes(qCount);

    //open countdown function
    countdown(70,qCount);

    //function addQustions
    addQustions(data[index], qCount);

    //click on submit button
    submitButton.addEventListener('click', function() {
        //Get Right Answers
        let theRightAnswers = data[index].pos;
        
        //Increase index
        index++;
        if (index === qCount) {
            countSpan1.innerHTML = index;
        }
        else {
            countSpan1.innerHTML = index+1;
        }
        

        //Check The Answers
        checkAnswer(theRightAnswers, qCount);

        //Remove Previous Questions
        quizArea.innerHTML = "";
        answereArea.innerHTML = "";

        //Call addQustions function
        addQustions(data[index], qCount);

        //Handle Bullets Class
        handleBullets();

        //open countDown function
        clearInterval(countdownInterval);
        countdown(70,qCount);

        //show  result
        showResults(qCount);

    })

})

//function to create Bullets
function createBulltes(num) {
    countSpan2.innerHTML = num;
    countSpan1.innerHTML = index+1;

    //creat spans
    for(let i = 0; i < num; i++) {

        //create span
        let theBullet = document.createElement("span");

        if(i === 0){
            theBullet.className = 'on';
        }

        //append span into span container
        bulletsSpanContainer.appendChild(theBullet);
    }
}

//function ADD Qustions
function addQustions(obj, count) {
    if(index < count) {

        //create H2 Qustion Title
        let qustionTitle = document.createElement("h2");

        //creat qustion text
        let questionText = document.createTextNode(`${obj.word} is.......`);

        //Append text into h2
        qustionTitle.appendChild(questionText);

        //Append h2 inside quize area
        quizArea.appendChild(qustionTitle);

        //Create the Answers
        for(let i = 1; i <= allAnsweres.length; i++) {
            //create main answers div
            let mainDiv = document.createElement("div");

            //add class to main div
            mainDiv.className = "answer";

            //Create Radio Input
            let radioInput = document.createElement("input");

            //Add Type + Name + Id + Data-Atribute
            radioInput.name = "question";
            radioInput.type = "radio";
            radioInput.id = `answer_${i}`;
            radioInput.dataset.answer = allAnsweres[i-1];

            //Create Label
            let theLabel = document.createElement("label");

            //Add for Atributes
            theLabel.htmlFor = `answer_${i}`;

            //Create Text Label
            let theLabelText = document.createTextNode(allAnsweres[i-1]);

            //Add The Text To Label
            theLabel.appendChild(theLabelText);

            //Add Input + Label To Main Div
            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(theLabel);

            //Add Main Div To Answers Area
            answereArea.appendChild(mainDiv);
        }

    }
}

//Function to Chack the Answers
function checkAnswer (rAnswer, count) {
    
    let answers = document.getElementsByName("question");
    let theChoosenAnswer;

    for(let i = 0; i < answers.length; i++) {

        if(answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }

    if(rAnswer === theChoosenAnswer) {
        rightAnswers++;
    }


}

// function to handleBullets
function handleBullets () {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arraySpans = Array.from(bulletsSpans);
    arraySpans.forEach((span, spanIndex) => {
        if(index === spanIndex) {
            span.className = 'on';
        }
    })
}

//function to Show Result
function showResults(count) {
    let myRank = document.querySelector(".results .rank span");
    if(index === count) {
        quizArea.remove();
        answereArea.remove();
        submitButton.remove();
        mainBullets.remove();

        myRes.style.display = "block";
        let r = (rightAnswers / count) * 100;
        let re = parseInt(r);
        myRank.innerHTML = `${re}%`;

    }
}


//function for countDown
function countdown(duration, count) {
    if(index < count) {
        let minuts, seconds;
        countdownInterval = setInterval(function() {
            minuts = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minuts = minuts < 10 ? `0${minuts}` : minuts;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            countdownElement.innerHTML = `${minuts}:${seconds}`;

            if(--duration < 0) {
                clearInterval(countdownInterval);
                submitButton.click();
            }
        }, 1000)
    }
}

//function to specific loader
setTimeout(() => {
    loader.style.display = "none";
}, 2500);

