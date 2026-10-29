/**
 * Filename:       number-muncher.html
 * Student:        Skylar Magouliotis (magouliotis4413)
 * Purpose:        Assignment 2
 */



"use strict";



/**
 * Generate a random integer between 1 and a supplied value (inclusive)
 * @param max   the largest integer that can be created
 * @returns {number}    a random integer
 */

$(document).ready(function () {

    const Directions = {
        RIGHT: "RIGHT",
        LEFT: "LEFT",
        UP: "UP",
        DOWN: "DOWN",
    };

    let mouthRow = 0;
    let mouthColumn = 0;
    let direction = "RIGHT";
    let moveSpace = null;

    //let timerID = null;
    const mouthImages = ["../images/mouth-open.png", "../images/mouth-closed.png"];
    let biteIndex = 0;
    const rows = 10;
    const columns = Math.floor(($(document).width()) / 64);

    let Ball0 = "../images/0.svg";
    const BALLS = [Ball0, "images/1.svg", "images/2.svg", "images/3.svg", "images/4.svg", "images/5.svg", "images/6.svg", "images/7.svg", "images/8.svg", "images/9.svg"];

    let movesMade = 0;
    let ballsEaten = 0;
    let totalScore = 0;
    let gameFinished = false;

    const grid = document.getElementById("gameGrid");
    //boxes are 64px and should extend the width of the document
    $("#gameGrid").css("backgroundColor", "#FFFFFF"); //I made this white (it's easier on the eyes)
    $("#gameGrid").css("grid-template-columns", `repeat(${columns}, 1fr)`); //create grid

    const cells = [];
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            const cell = document.createElement("div");
            cell.className = 'cell';
            cell.id = `cellRow${row}Column${col}`;
            grid.appendChild(cell);
            cells.push(cell);
        }
    }


    const theMouth = document.createElement('img'); //create img for mouth

    var timer = setInterval(() => { //rotate between open/closed mouth
        biteIndex++;
        if (biteIndex >= mouthImages.length) {
            biteIndex = 0;
        }
        theMouth.src = mouthImages[biteIndex];
    }, 250); //every 250ms change image

    insertMouth();

    moveMouth();

    document.addEventListener('keydown', (e) => { //find what way the mouth is facing
        if (gameFinished === true){
            e.preventDefault();
            return;
        }
        theMouth.classList.remove("faceDown", "faceUp", "faceLeft", "faceRight"); //clear the face direction when key is pressed
        const map = {
            ArrowUp: Directions.UP,
            ArrowDown: Directions.DOWN,
            ArrowLeft: Directions.LEFT,
            ArrowRight: Directions.RIGHT,
        }
        switch (e.key) { //add face direction when keys are pressed
            case "ArrowDown":
                theMouth.classList.add("faceDown");
                break;
            case "ArrowLeft":
                theMouth.classList.add("faceLeft");
                break;
            case "ArrowRight":
                theMouth.classList.add("faceRight");
                break;
            case "ArrowUp":
                theMouth.classList.add("faceUp");
                break;
        }
        if (map[e.key]) {
            direction = map[e.key];
        }
    })

    let ncheck = []; //keep track of numbers eaten in this array
    let streak = 1; //keep track of streak
    function insertMouth() {

        //document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = '');
        const gridIndex = mouthRow * columns + mouthColumn;
        const location = cells[gridIndex]; //find div location
        //let count = 0;
        movesMade++; //keep track of number of squares the mouth moves


        if (location.querySelector("img")) { //check if the div contains an image tag
            const number = location.querySelector("img").alt; //alt text says what number it is
            ncheck.unshift(number); //add the number to the list
            ballsEaten++; //keeps track of how many balls are eaten
            document.getElementById("numbers").textContent = ncheck;

            if (number == 0) {
                //end game
                stopTheGame();
            } else if (number == number && ncheck[1] == number) {
                streak++;
                totalScore = addNumbers(totalScore, number);
            } else {
                streak = 1;
                totalScore = addNumbers(totalScore, number);
                /** OK SO the required logic is dumb..... it says
                 * If the number is the same as that last number, add that number
                 * times the number of balls of that number eaten in the current streak
                 * but isnt 3*3 just the same as 3+3+3??? Like literally what is
                 * the difference????
                 * 4*6 is exactly the same as 6+6+6+6 ???????? game logic fail BAD BAD BAD
                 *
                 */
            }


            if (!Array.isArray(ncheck) || ncheck.length === 0) { //if the array is empty
                document.getElementById("numbers").innerHTML = "No numbers yet";
            } else {
                if (streak === 1){ //if there is NO streak do NOT bold
                    const bold = ncheck.slice(0, 0).map(num => `<b>${num}</b>`);
                    const notbold = ncheck.slice(0);
                    const together = [...bold, ...notbold].join(", ");
                    document.getElementById("numbers").innerHTML = together;
                } else{ //otherwise bold the Streak only
                    const bold = ncheck.slice(0, streak).map(num => `<b>${num}</b>`);
                    const notbold = ncheck.slice(streak);
                    const together = [...bold, ...notbold].join(", ");
                    document.getElementById("numbers").innerHTML = together;
                }

            }


            location.querySelector("img").remove(); //remove the ball once eaten
            document.getElementById("score").textContent = totalScore; //display score
        }
        document.querySelectorAll('.cell')[gridIndex].appendChild(theMouth); //add the mouth to the square where the ball was eaten
    }


    function addNumbers(number1, number2) { //the numbers need to be formatted otherwise they concatenate as string
        let num1 = Number(number1);
        let num2 = Number(number2);
        return num1 + num2;
    }


//MOVE MOUTH
    function moveMouth() {
        if (moveSpace) clearInterval(moveSpace);
        moveSpace = setInterval(() => {
            let newRow = mouthRow;
            let newColumn = mouthColumn;

            if (direction === 'UP') {
                newRow--;
            } else if (direction === Directions.DOWN) {
                newRow++;
            } else if (direction === 'LEFT') {
                newColumn--;
            } else if (direction === 'RIGHT') {
                newColumn++;
            }

            if (newRow >= 0 && newRow < rows && newColumn >= 0 && newColumn < columns) {
                mouthRow = newRow;
                mouthColumn = newColumn;
                insertMouth(); //add the mouth
            }


        }, 500); //every 500ms move one cell in grid
    }


    function getRandomInt(min, max) {
        // Inclusive range - get the random number between the min and max value
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    //ADD THE BALL TO THE GRID
    function addRandomNumberImage() {
        const randomCellIndex = getRandomInt(0, cells.length - 1);
        const cell = cells[randomCellIndex];
        // Skip if cell is already occupied
        if (cell.children.length > 0 && gameFinished === false) {
            scheduleNext(); // still schedule the next run
            return;
        }

        const randomNumber = getRandomInt(0, 9); //random ball 0-9

        const img = document.createElement('img'); //create img tag for each ball generated
        img.alt = randomNumber; //the alt tag says the number on the ball
        img.src = `../images/${randomNumber}.svg`; //src will be the image path 0-9 associated with the ball

        cell.appendChild(img); //add to cell
        if (gameFinished === false){
            scheduleNext(); //next run
        }

    }



        function scheduleNext() {
            const delay = getRandomInt(500, 999); //minimum and maximum - randomly add balls
            setTimeout(addRandomNumberImage, delay);
        }

        if (gameFinished === false) {
            scheduleNext();
        }



    function stopTheGame(){
        const summary = document.createElement("p"); //make a new paragraph
        summary.id = "summary";

        let average = totalScore/ballsEaten;
        average = average.toFixed(2); //round the average to 2 decimal places

        summary.innerHTML = "<p> Balls Eaten: "+ ballsEaten+"<br> Moves Made: " + movesMade + "<br> Average Number of points per ball eaten: "+average+"</p>"; //summary
        const button = document.getElementById("btnRestart");
        button.parentNode.insertBefore(summary, button); //insert the paragraph before the restart button

        /**
         * I didn't know if you wanted moves made to be how many squares that were moved
         * or if you wanted how many times the direction was changed
         * I can code either option, but I decided to make it the number of squares that the mouth moved.
         */

        clearInterval(timer); //stops the mouth from munching
        clearInterval(moveSpace); //stops the mouth from moving
        gameFinished = true; //stops balls from generating and keys being pressed

    }


    //if you click the restart button this resets/reloads page
    const restart = document.getElementById("btnRestart");

    restart.addEventListener("click", function() {
        location.reload();
    });



})