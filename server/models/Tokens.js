const { Schema, model } = require('mongoose');

const tokensSchema = new Schema({
  accessToken: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  }, 
  refreshToken: {
    type: String, 
    required: true, 
    unique: false,
    trim: true
  }
});

const Tokens = model('Tokens', tokensSchema);

module.exports = Tokens;