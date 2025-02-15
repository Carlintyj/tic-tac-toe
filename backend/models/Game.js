const mongoose = require('mongoose');
const Counter = require('./Counter');

const GameSchema = new mongoose.Schema({
  roomId: { type: Number, unique: true },
  board: {
    type: [String],
    required: true,
    default: Array(9).fill(null),
  },
  currentPlayer: {
    type: String,
    enum: ['X', 'O', null],
    default: 'X',
  },
  winner: {
    type: String,
    enum: ['X', 'O', 'draw', null],
    default: null,
  },
  playerX: {
    type: String,
    required: false,
  },
  playerO: {
    type: String,
    required: false,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// This function ensures the game cannot be started unless there are two different players
GameSchema.methods.addPlayer = async function (username) {
  if (!this.playerX) {
    this.playerX = username;
    await this.save();
    return { success: true, message: `Player X is ${username}. Waiting for Player O...` };
  } else if (!this.playerO && this.playerX !== username) {
    this.playerO = username;
    this.currentPlayer = 'X';
    await this.save();
    return { success: true, message: `Player O is ${username}. Game is starting!` };
  } else if (this.playerX === username || this.playerO === username) {
    return { success: true, message: "You are already in the game." };
  } else {
    return { success: false, message: "Error: Unable to join the game." };
  }
};

GameSchema.pre('save', async function (next) {
  if (!this.roomId) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { name: 'roomId' },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
      );
      this.roomId = counter.value;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model('Game', GameSchema);
