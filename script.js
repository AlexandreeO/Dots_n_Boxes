// /*----- constants -----*/


const GRID_ROWS = 6;
const GRID_COLUMNS = 6;
const PLAYER1 = 1;
const PLAYER2 = 2;
const COLOUR = { PLAYER1: "red", PLAYER2: "green" };
const allDots = {};
const allLines = [["r0c1", "r0c2"]];
const dotsParent = document.querySelector("#dots");





// /*----- state/global variables -----*/


let firstDotClickID;
let secondDotClickID;
let currentPlayer;





/*----- FUNCTIONS -----*/




function makeGridPerSelection() {
    dotsParent.style.gridTemplateRows = `repeat(${GRID_ROWS + 1}, 10vmin)`;
    dotsParent.style.gridTemplateColumns = `repeat(${
        GRID_COLUMNS + 1
    }, 10vmin)`;
}




function renderDots() {
    makeGridPerSelection();
    for (let row = 0; row <= GRID_ROWS; row++) {
        for (let column = 0; column <= GRID_COLUMNS; column++) {
            createDotDiv(row, column);
        }
    }
}





// x1, y1 -> For first dot click
// x2, y2 -> For second dot click
let isFirstClick = true;
const lineCoOrdinates = { x1: 0, y1: 0, x2: 0, y2: 0 };


function handleDotClick(event) {
    if (isFirstClick) {
        firstDotClickID = event.target.id;
        lineCoOrdinates.x1 = event["x"];
        lineCoOrdinates.y1 = event["y"];
        // This is first click region
        // This gives us x1 and y1
        isFirstClick = false;
    } else {
        secondDotClickID = event.target.id;
        lineCoOrdinates.x2 = event["x"];
        lineCoOrdinates.y2 = event["y"];
        // This is second click region
        // This gives us x2 and y2
        isFirstClick = true;
        if (checkIfValidDotClicks()) {
            createLine();
        } else {
            // to do - display error message (invalid secod click)
        }
    }

    // console.log(event.target.id);
    // console.log(event["x"], event["y"]);
    event.target.style.backgroundColor = "grey";
}




function handleDotMouseOver(event) {

    console.log(event.target);
}




function createDotDiv(_row, _column) {
    const identifier = `r${_row}c${_column}`;

    /** Database Init */
    allDots[identifier] = {};

    /** Dom Logic */
    const dotDiv = document.createElement("div");
    dotDiv.id = identifier;
    dotDiv.style.border = "2px solid grey";
    dotDiv.style.borderRadius = "50%";
    dotDiv.style.width = "15px";
    dotDiv.style.height = "15px";
    dotDiv.style.margin = "auto";
    dotDiv.style.zIndex = 99999;
    dotDiv.addEventListener("click", handleDotClick);
    dotsParent.appendChild(dotDiv);
}

function createLine() {
    const dot1 = document.getElementById(firstDotClickID);
    const dot2 = document.getElementById(secondDotClickID);

    const line = document.createElement("div");
    line.classList.add("line");

    const x1 = dot1.offsetLeft + dot1.offsetWidth / 2;
    const y1 = dot1.offsetTop + dot1.offsetHeight / 2;
    const x2 = dot2.offsetLeft + dot2.offsetWidth / 2;
    const y2 = dot2.offsetTop + dot2.offsetHeight / 2;

    const lineLengthX = Math.abs(x2 - x1);
    const lineLengthY = Math.abs(y2 - y1);

    if (lineLengthX === 0) {
        // Vertical line
        line.style.width = "1px";
        line.style.height = `${lineLengthY}px`;
    } else if (lineLengthY === 0) {
        // Horizontal line
        line.style.width = `${lineLengthX}px`;
        line.style.height = "1px";
    }

    line.style.top = `${Math.min(y1, y2)}px`;
    line.style.left = `${Math.min(x1, x2)}px`;

    dotsParent.appendChild(line);
}

const dotLocation = { r1: 0, r2: 0, c1: 0, c2: 0 };

function extractDotRowsAndColumns() {
    dotLocation.r1 = firstDotClickID.charAt(1);
    dotLocation.r2 = secondDotClickID.charAt(1);
    dotLocation.c1 = firstDotClickID.charAt(3);
    dotLocation.c2 = secondDotClickID.charAt(3);
}

function checkIfValidDotClicks() {
    console.log(firstDotClickID);
    console.log(secondDotClickID);

    extractDotRowsAndColumns();
    //should return true or false
    if (
        dotLocation.r1 === dotLocation.r2 &&
        Math.abs(dotLocation.c1 - dotLocation.c2) == 1
    ) {
        return true;
    } else if (
        dotLocation.c1 === dotLocation.c2 &&
        Math.abs(dotLocation.r1 - dotLocation.r2) == 1
    ) {
        return true;
    } else {
        return false;
    }
}

function switchPlayer(PLAYER1, PLAYER2) {
    currentPlayer = currentPlayer === PLAYER1 ? PLAYER2 : PLAYER1;
}

renderDots();

// console.log(allDots);