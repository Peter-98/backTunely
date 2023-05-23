const mongoose = require('./db');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true  },
  pass: { type: String, required: true },
});


const User = mongoose.model('User', userSchema);

module.exports = User;
