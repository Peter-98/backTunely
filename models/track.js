const mongoose = require('./db');

const reviewSchema = new mongoose.Schema({
  author: { type: String, required: true },
  comment: { type: String, required: true },
  rating: {type: Number, required: true, min: 0, max: 5},
  createdOn: {type: Date, "default": Date.now },
  userId: { type: String },
  coords: {
    type: {type: String},
    coordinates: [Number]
}
});

const trackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  artist: { type: [String], required: true },
  album: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  genres: { type: [String] },
  duration: { type: Number, required: true },
  image: { type: String, required: false },
  href: { type: String, required: false },
  uri: { type: String, required: true },
  userId: { type: String, required: true },
  coords: {
    type: {type: String},
    coordinates: [Number]
},
  comments: [reviewSchema]
});


const Track = mongoose.model('Track', trackSchema);

module.exports = Track;
