# Tic-Tac-Toe Game

This project is a real-time, multiplayer Tic-Tac-Toe game built with React for the frontend and Node.js for the backend. It allows users to play against each other in real time with synchronized game state management. 

## Features
- **Real-time multiplayer**: Players can compete with others in real-time.
- **Game state management**: The game state is handled by the backend and synced between players.
- **Victory/Draw announcements**: The game displays a modal to announce the winner or a draw.
- **Accessibility**: Includes keyboard navigation and screen reader support.

## Tech Stack
- **Frontend**: React, Material UI
- **Backend**: Node.js (Express.js)
- **State Management**: RESTful API for game state updates
- **Database**: MongoDB
- **Deployment**: Deployed on AWS

## Installation

### Prerequisites
- Node.js (v20.x or above)
- npm 
- MongoDB

### Steps to Set Up

#### 1. Clone the Repository

```bash
git clone https://github.com/Carlintyj/tic-tac-toe.git
cd tic-tac-toe
```

#### 2. Install Dependencies
For both frontend and backend, run the following:

```bash
# For backend
cd backend
npm install

# For frontend
cd ../src
npm install
```
Put in the .env file and required content in the backend folder.


#### 3. Start the Development Server
```bash
# For backend
cd backend
npm start

# For frontend
cd ../src
npm start
```

The frontend will be available at http://localhost:3000, and the backend will run on http://localhost:4000 (or whatever port you have configured).

## How to Play
1. Open the game in your browser.
2. Enter your username and either join an existing game or create a new one.
3. Take turns with your opponent to make a move on the grid.
4. The game will notify you of a win or draw after the game ends.


## Accessibility Considerations
This game has been designed to be accessible:

Keyboard Navigation:

- Use the Tab key to navigate between game squares.
- Use the Enter or Space key to place a move.

Screen Reader Support:

- ARIA labels are used for game squares and notifications, providing real-time feedback for screen readers.

Visual Focus:

- Clear visual focus styles are applied for better keyboard navigation.


### Architecture Diagram

![Architecture Diagram](<Architecture Diagram.png>)

### Architecture Breakdown:
1. **User Interface**:
   - Handles rendering the game board and UI components like the start screen and modals.
   - Interacts with the backend to fetch game data and send player moves.

2. **Frontend (React)**:
   - Controls the user experience (game flow, UI state).
   - Communicates with the backend through REST API calls for game data.

3. **REST API**:
   - Manages game state and player moves by providing endpoints for actions like joining a game, making a move, and retrieving game status.

4. **Authentication**:
   - Manages user sessions, ensuring that players are properly identified and associated with the correct game.

5. **Backend (Node.js / Express)**:
   - Handles the core game logic, including checking for valid moves, detecting wins, and updating the game state.
   - Serves as the central hub for all game-related actions.

6. **Database**:
   - Stores game data persistently, such as current game state, user information, and past game history.
   - Implemented using **MongoDB**

## API Specifications

## **1. Create a New Game**
### **Endpoint**
**POST** `/api/games/`

### **Request**
- No request body required.

### **Response**
```json
{
  "gameId": "65b7c6a7c9a4e2d1b3a8e6f4"
}
```
- `gameId` (string) – Unique identifier of the created game.

![API call 1](<API call 1.png>)

---

## **2. Join a Game**
### **Endpoint**
**POST** `/api/games/{id}/join`

### **Request**
**Path Parameter:**
- `id` (string) – The unique ID of the game.

**Body:**
```json
{
  "username": "player1"
}
```
- `username` (string) – The username of the player joining the game.

### **Response**
```json
{
  "message": "Player assigned as X",
  "board": [null, null, null, null, null, null, null, null, null],
  "currentPlayer": "X",
  "playerX": "player1",
  "playerO": null
}
```
- `message` (string) – Success or error message.
- `board` (array) – Current game board.
- `currentPlayer` (string) – The player whose turn it is.
- `playerX` (string) – Username of player assigned to 'X'.
- `playerO` (string) – Username of player assigned to 'O' (or `null` if unassigned).

### **Error Responses**
- **400 Bad Request**: Game is already full.
- **404 Not Found**: Game not found.

---

## **3. Make a Move**
### **Endpoint**
**POST** `/api/games/{id}/move`

### **Request**
**Path Parameter:**
- `id` (string) – The unique ID of the game.

**Body:**
```json
{
  "player": "X",
  "position": 4
}
```
- `player` (string) – The player making the move (`"X"` or `"O"`).
- `position` (integer) – The board index (0-8) where the player wants to place their move.

### **Response**
```json
{
  "board": [null, null, null, null, "X", null, null, null, null],
  "nextPlayer": "O",
  "winner": null
}
```
- `board` (array) – Updated game board.
- `nextPlayer` (string) – The player who has the next turn.
- `winner` (string or `null`) – `"X"`, `"O"`, `"draw"`, or `null` if no winner yet.

### **Error Responses**
- **400 Bad Request**: Invalid move or not the player's turn.
- **404 Not Found**: Game not found.

---

## **4. Get Game State**
### **Endpoint**
**GET** `/api/games/{id}`

### **Request**
**Path Parameter:**
- `id` (string) – The unique ID of the game.

### **Response**
```json
{
  "board": [null, null, null, null, "X", null, null, null, null],
  "currentPlayer": "O",
  "winner": null,
  "playerX": "player1",
  "playerO": "player2"
}
```
- `board` (array) – Current game board.
- `currentPlayer` (string) – The player whose turn it is.
- `winner` (string or `null`) – `"X"`, `"O"`, `"draw"`, or `null` if no winner yet.
- `playerX` (string) – Username of player assigned to 'X'.
- `playerO` (string) – Username of player assigned to 'O'.

### **Error Responses**
- **404 Not Found**: Game not found.

![API call 4](<API call 4.png>)

---

## **5. List All Games**
### **Endpoint**
**GET** `/api/games/`

### **Request**
- No request body required.

### **Response**
```json
[
  {
    "_id": "65b7c6a7c9a4e2d1b3a8e6f4",
    "board": [null, null, null, null, "X", null, null, null, null],
    "currentPlayer": "O",
    "winner": null,
    "playerX": "player1",
    "playerO": "player2",
    "createdAt": "2025-02-15T12:00:00Z"
  }
]
```
- List of game objects, each containing:
  - `_id` (string) – Game ID.
  - `board` (array) – Current game board.
  - `currentPlayer` (string) – The player whose turn it is.
  - `winner` (string or `null`) – `"X"`, `"O"`, `"draw"`, or `null` if no winner yet.
  - `playerX` (string) – Username of player assigned to 'X'.
  - `playerO` (string) – Username of player assigned to 'O'.
  - `createdAt` (string) – Timestamp when the game was created.

### **Error Responses**
- **500 Internal Server Error**: Failed to fetch games.
