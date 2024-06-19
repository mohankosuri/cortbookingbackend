const mongoose = require('../config/database');

const userSchema = new mongoose.Schema({
  fullname: String,
  mobile: String,
  password: String,
});

module.exports = mongoose.model('User', userSchema);

