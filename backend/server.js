const app = require('./app');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 4000;
dotenv.config();

mongoose.connect(process.env.MONGO_URI, {})
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Error connecting to MongoDB:', error));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});