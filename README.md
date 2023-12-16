- Dots and Boxes Game
This Dots and Boxes game is a classic pencil-and-paper game now brought to life on the browser! The game involves drawing lines between dots to create squares and earn points. This repository contains the code that powers the interactive gameplay.

- Gameplay
The objective of the game is to create more squares than your opponent. Players take turns drawing a single line between two unjoined adjacent dots. When a player completes a square, they earn a point and get another turn. The game ends when all possible lines have been drawn, and the player with the most squares wins.

- Features
Interactive gameplay where players click on dots to form lines.
Dynamic scoring system to track points earned by completing squares.
Player turn switching for a competitive gaming experience.
Real-time updates on the game state and scores.

- Getting Started
To run the game locally, follow these steps:

Clone this repository to your local machine using git clone https://github.com/AlexandreeO/Dots_n_Boxes.git.
Open the index.html file in your preferred web browser.
Start playing! Click on dots to draw lines and compete to create squares.

- Code Structure
The codebase is organized into HTML, CSS, and JavaScript files:

index.html: Contains the structure of the game interface.
style.css: Stylesheet defining the visual aspects of the game elements.
script.js: JavaScript code implementing game mechanics, user interactions, and state management.

- Important Functions
handleDotClick(event): Handles user interactions with dots, allowing line creation and game state updates.
updateGameState(): Manages the game state, checks for completed squares, and updates scores.
switchPlayer(): Alternates between player turns for a competitive gaming experience.


- Future Enhancements
Future enhancements could include:

Adding animations or sound effects for a more engaging experience.
Implementing an AI opponent for single-player mode.
Customizing game rules or difficulty levels.
Fixing bugs (game state and creating wrong squares, lines moving on window resizing)
