const { Schema, model } = require('mongoose');

const metrosSchema = new Schema({
  identifier: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    unique: false,
    trim: true
  },
  addressRegion: {
    type: String,
    required: true,
    unique: false,
    trim: true
  }
});

const Metros = model('Metros', metrosSchema);

module.exports = Metros;