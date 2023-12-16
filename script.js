// Constants for game configuration
const GRID_ROWS = 3;
const GRID_COLUMNS = 3;
const PLAYER1 = 1;
const PLAYER2 = 2;
const TIE = -1

// Other constants, variables, and DOM element references...
const COLOUR = { [PLAYER1]: "brown", [PLAYER2]: "teal" };
const SCORES = { [PLAYER1]: 0, [PLAYER2]: 0 };
const allDots = {};
const allLines = [["r0c1", "r0c2"]];
const dotsParent = document.querySelector("#dots");
const squareParent = document.querySelector("#squares");
const restartButton = document.getElementById("restart-btn");
const playerTurn = document.getElementById("player-turn");
const scoreEl = document.getElementById("scores");
const GAME_STATE = [];

// /*----- state/global variables -----*/

let firstDotClickID;
let secondDotClickID;
let currentPlayer;
let firstClickedDotEl;
let secondClickedDotEl;
let isSquareFormed = false;
let winner;

// /*----- global event listeners -----*/

restartButton.addEventListener("click", restartGame);

/*----- FUNCTIONS -----*/
// Initialization function to set up the game
function init() {
    // Initialize game state and variables...
    currentPlayer = PLAYER1;
    for (let row = 0; row < GRID_ROWS; row++) {
        for (let column = 0; column < GRID_COLUMNS; column++) {
            const square = {
                row,
                column,
                owner: null,
                top: false,
                right: false,
                bottom: false,
                left: false,
            };
            GAME_STATE.push(square);
        }
    }
    
    // Calls the functions to render the grid, dots, squares, and update display
    renderDots();
    renderBoxes();
    renderUpdate();
    // addHoverEffectToDots()
}

// Functions to render the grid, dots, and squares

function renderDots() {
    // Logic to create dots and place them on the grid
    makeGridPerSelection();
    for (let row = 0; row <= GRID_ROWS; row++) {
        for (let column = 0; column <= GRID_COLUMNS; column++) {
            createDotDiv(row, column);
        }
    }
}

function renderBoxes() {
    // Logic to create boxes on the grid
    GAME_STATE.forEach((square) => {
        const identifier = `square_r${square.row}c${square.column}`;

        /** Dom Logic */
        const squareDiv = document.createElement("div");
        squareDiv.id = identifier;
        squareDiv.className = "square";
        squareParent.appendChild(squareDiv);
    });
}

function renderUpdate() {
    // Update the game state and render changes on the board
    GAME_STATE.forEach((square) => {
        const identifier = `square_r${square.row}c${square.column}`;
        const squareDiv = document.getElementById(identifier);

        // updates the color of the square if it is owned by a player
        squareDiv.style.backgroundColor = COLOUR[square.owner];
    });
}

// x1, y1 -> For first dot click
// x2, y2 -> For second dot click
let isFirstClick = true;
const lineCoOrdinates = { x1: 0, y1: 0, x2: 0, y2: 0 };

// Functions to handle user interactions and game logic

function handleDotClick(event) {
    if (isFirstClick) {
        // This is first click region
        // This gives us x1 and y1
        firstClickedDotEl = event.target;
        firstDotClickID = event.target.id;
        lineCoOrdinates.x1 = event["x"];
        lineCoOrdinates.y1 = event["y"];
        event.target.style.backgroundColor = "grey";
        isFirstClick = false;
    } else {
        // This is second click region
        // This gives us x2 and y2
        secondClickedDotEl = event.target;
        secondDotClickID = event.target.id;
        lineCoOrdinates.x2 = event["x"];
        lineCoOrdinates.y2 = event["y"];
        event.target.style.backgroundColor = "grey";
        isFirstClick = true;
        if (checkIfValidDotClicks()) {
            // Check if a square is formed after each valid line creation -> The user who created this square formation line gets the point
            allDots[firstDotClickID] = true;
            allDots[secondDotClickID] = true;
            createLine();
            // console.log(`CurrentPLayer: ${currentPlayer}`);
            // if player completes a box, don't switch player
            if (!isSquareFormed) {
                switchPlayer();
            } else {
                isSquareFormed = false;
                checkWin();
            }
        } else {
            resetDotColourIfInvalidChoice();
            // display error message (invalid second click)
            const invalidMoveMessage = playerTurn.innerText;
            playerTurn.innerText = `TRY AGAIN - SELECT ONLY ADJENCENT DOTS`;
            setTimeout(() => {
                playerTurn.innerText = invalidMoveMessage;
            }, 1200);
        }
    }
}

function updateGameState() {
    // Logic to update the game state based on user moves
    const dotLocation = extractDotRowsAndColumns();

    const isVerticalLine = dotLocation.r1 !== dotLocation.r2;

    // "primary" square
    const squareRow = Math.min(dotLocation.r1, dotLocation.r2);
    const squareCol = Math.min(dotLocation.c1, dotLocation.c2);
    const primaryIndex = squareRow * GRID_COLUMNS + squareCol;
    
    
    //secondary (joining square)
    const secondaryColumn = isVerticalLine ? squareCol - 1 : squareCol;
    const secondaryRow = isVerticalLine ? squareRow : squareRow - 1;
    const secondaryIndex = secondaryRow * GRID_COLUMNS + secondaryColumn;

    if (
        squareRow >= 0 ||
        squareCol >= 0 ||
        squareRow < GRID_ROWS.length ||
        squareCol < GRID_COLUMNS.length
    ) {
        updateSquare(primaryIndex, isVerticalLine ? "left" : "top");
    }

    if (

        secondaryColumn >= 0 ||
        secondaryRow >= 0 ||
        secondaryColumn < GRID_COLUMNS.length||
        secondaryRow < GRID_ROWS.length 
    ) {
        updateSquare(secondaryIndex, isVerticalLine ? "right" : "bottom");
    }

}


function checkWin() {
    const hasEmptySquare = GAME_STATE.some(square => !square.owner)
    if (hasEmptySquare) return;

    if (SCORES[PLAYER1] === SCORES[PLAYER2]) {
        winner = TIE
    } else {
        winner = SCORES[PLAYER1] > SCORES[PLAYER2] ? PLAYER1 : PLAYER2;
    }

    renderWinner()
}

function renderWinner() {
    playerTurn.innerText = winner === TIE ? `It's a TIE!` : `Player${winner} WINS`
    renderConfetti()
}


function renderConfetti() {
        const duration = 5 * 1000,
        animationEnd = Date.now() + duration,
        defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        // since particles fall down, start a bit higher than random
        confetti(
            Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            })
        );
        confetti(
            Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            })
        );
    }, 250);
}

function restartGame() {
    window.location.reload();
}

// ----------- UTILITY FUNCTIONS -----------:

function makeGridPerSelection() {
    dotsParent.style.gridTemplateRows = `repeat(${GRID_ROWS + 1}, 10vmin)`;
    dotsParent.style.gridTemplateColumns = `repeat(${
        GRID_COLUMNS + 1
    }, 10vmin)`;
    squareParent.style.gridTemplateRows = `repeat(${GRID_ROWS}, 10vmin)`;
    squareParent.style.gridTemplateColumns = `repeat(${GRID_COLUMNS}, 10vmin)`;
}

// if dot selection is invalid, the function below will make the background black again, and will also change the value of the allDots element to null, so it doesn't count.
function resetDotColourIfInvalidChoice() {
    for (let dotID in allDots) {
        if (dotID === firstDotClickID && allDots[dotID] !== true) {
            firstClickedDotEl.style.backgroundColor = "black";
        }
        if (dotID === secondDotClickID && allDots[dotID] !== true) {
            secondClickedDotEl.style.backgroundColor = "black";
        }
    }
    firstClickedDotEl = secondClickedDotEl = null;
}

// //functions to hover mouse hover effect considering the colour of the current player
// function handleDotHover(event) {
//     const dotID = event.target.id;
//     const dot = document.getElementById(dotID);
//     const currentPlayerColor = COLOUR[currentPlayer];
//     dot.style.backgroundColor = currentPlayerColor;
// }
// function addHoverEffectToDots() {
//     const dots = document.querySelectorAll("#dots > div");
//     dots.forEach(dot => {
//         dot.addEventListener("mouseover", handleDotHover);
//         dot.addEventListener("mouseout", function(event) {
//             event.target.style.backgroundColor = ""; // Reset to default when cursor leaves
//         });
//     });
// }

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
    // - 2 here is because of the with of the line, which dislocates it by 2px
    const x1 = dot1.offsetLeft + (dot1.offsetWidth / 2 - 2);
    const y1 = dot1.offsetTop + (dot1.offsetHeight / 2 - 2);
    const x2 = dot2.offsetLeft + (dot2.offsetWidth / 2 - 2);
    const y2 = dot2.offsetTop + (dot2.offsetHeight / 2 - 2);

    const lineLengthX = Math.abs(x2 - x1);
    const lineLengthY = Math.abs(y2 - y1);

    if (lineLengthX === 0) {
        // Vertical line
        line.style.width = "4px";
        line.style.height = `${lineLengthY}px`;
    } else if (lineLengthY === 0) {
        // Horizontal line
        line.style.width = `${lineLengthX}px`;
        line.style.height = "4px";
    }

    line.style.top = `${Math.min(y1, y2)}px`;
    line.style.left = `${Math.min(x1, x2)}px`;

    dotsParent.appendChild(line);

    updateGameState();
    renderUpdate();
}

function updateSquare(squareIndex, side) {
    //'top' or 'left' or 'right' or 'bottom'
    const square = GAME_STATE[squareIndex];
    // console.log({ square, squareIndex });
    // if (!square) return;
    
    square[side] = true;
    // check if all the sides are complete
    if (square.left && square.right && square.top && square.bottom) {
        square.owner = currentPlayer;
        isSquareFormed = true;
        SCORES[currentPlayer] += 1;
        renderScores();
    }

    // console.table(GAME_STATE);
}

function renderScores() {
    scoreEl.innerText = `Player1 :  ${SCORES[PLAYER1]}   |   Player2 :   ${SCORES[PLAYER2]}`;
}

function extractDotRowsAndColumns() {
    return {
        r1: firstDotClickID.charAt(1),
        r2: secondDotClickID.charAt(1),
        c1: firstDotClickID.charAt(3),
        c2: secondDotClickID.charAt(3),
    };
}

function checkIfValidDotClicks() {
    const dotLocation = extractDotRowsAndColumns();
    //should return true or false
    if (
        dotLocation.r1 === dotLocation.r2 &&
        Math.abs(dotLocation.c1 - dotLocation.c2) === 1
    ) {
        return true;
    } else if (
        dotLocation.c1 === dotLocation.c2 &&
        Math.abs(dotLocation.r1 - dotLocation.r2) === 1
    ) {
        return true;
    } else {
        return false;
    }
}

// function generateRandomComputerMove() {}  ----> optional
// function makeComputerMove() {}  ----> optional

function switchPlayer() {
    currentPlayer = currentPlayer === PLAYER1 ? PLAYER2 : PLAYER1;
    playerTurn.innerText = `Player ${currentPlayer}'s turn`;
}

init();
