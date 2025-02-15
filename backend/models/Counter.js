const mongoose = require('mongoose');

const CounterSchema = new mongoose.Schema({
  name: String,
  value: { type: Number, default: 1 },
});

const Counter = mongoose.model('Counter', CounterSchema);

module.exports = Counter;
