const express = require('express');
const router = express.Router();
const Game = require('../models/Game');

// Create a new game
router.post('/', async (req, res) => {
  try {
    const game = new Game({
      board: Array(9).fill(null),
      currentPlayer: 'X',
      winner: null,
    });
    await game.save();
    res.json({ gameId: game._id });
  } catch (error) {
    res.status(500).json({ error: 'Error creating new game' });
  }
});

// Join a game (assign 'X' or 'O')
router.post('/:id/join', async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    const game = await Game.findById(id);
    if (!game) return res.status(404).json({ error: 'Game not found' });
    console.log("1")

    const result = await game.addPlayer(username);
    console.log("2")
    
    if (!result.success) {
      return res.status(400).json({ error: result.message });
    }
    console.log("3")

    res.json({
      message: result.message,
      board: game.board,
      currentPlayer: game.currentPlayer,
      playerX: game.playerX,
      playerO: game.playerO,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error joining the game' });
  }
});

// Make a move
router.post('/:id/move', async (req, res) => {
  try {
    const { id } = req.params;
    const { player, position } = req.body;

    const game = await Game.findById(id);
    if (!game) return res.status(404).json({ error: 'Game not found' });

    // Validate the player and the move
    if (game.winner || game.board[position]) return res.status(400).json({ error: 'Invalid move' });

    if (player !== game.currentPlayer) {
      return res.status(400).json({ error: `It's ${game.currentPlayer}'s turn` });
    }

    game.board[position] = player;
    game.currentPlayer = player === 'X' ? 'O' : 'X';
    game.winner = checkWinner(game.board);
    game.updatedAt = Date.now();

    if (game.winner === 'draw') {
      game.currentPlayer = null;
    }

    await game.save();

    res.json({
      board: game.board,
      nextPlayer: game.currentPlayer,
      winner: game.winner,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error making move' });
  }
});

// Get game state
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const game = await Game.findById(id);
    if (!game) return res.status(404).json({ error: 'Game not found' });

    res.json({
      board: game.board,
      currentPlayer: game.currentPlayer,
      winner: game.winner,
      playerX: game.playerX,
      playerO: game.playerO,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching game state' });
  }
});

// List all games
router.get('/', async (req, res) => {
  try {
    const games = await Game.find().sort({ createdAt: -1 });
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching games' });
  }
});

function checkWinner(board) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  if (!board.includes(null)) {
    return 'draw';
  }

  return null;
}

module.exports = router;
