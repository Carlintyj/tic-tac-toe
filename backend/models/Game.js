const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  board: [String],
  currentPlayer: String,
  winner: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Game', GameSchema);