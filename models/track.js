const mongoose = require('db');

const reviewSchema = new mongoose.Schema({
  author: { type: String, required: true },
  comment: { type: [String], required: true },
  stars: { type: String, required: true }
});

const trackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  artist: { type: [String], required: true },
  album: { type: String, required: true },
  releaseDate: { type: Number, required: true },
  genres: { type: [String], required: true },
  duration: { type: Number, required: true },
  image: { type: [String], required: true },
  uri: { type: String, required: true },
  comments: [reviewSchema]
});


const Track = mongoose.model('Track', trackSchema);

module.exports = Track;
