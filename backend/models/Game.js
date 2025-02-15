const mongoose = require('mongoose');
const Counter = require('./Counter');

const GameSchema = new mongoose.Schema({
  roomId: { type: Number, unique: true },
  board: [String],
  currentPlayer: String,
  winner: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

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
