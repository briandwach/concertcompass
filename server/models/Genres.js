const { Schema, model } = require('mongoose');

const genresSchema = new Schema({
  identifier: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }
});

const Genres = model('Genres', genresSchema);

module.exports = Genres;