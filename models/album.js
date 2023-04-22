const mongoose = require('../db/dbConfig');
const Schema = mongoose.Schema;
const ArtistSchema = require('./artist');

const ArtistSchema = new Schema({
    id: String,
    album_type: String,
    artists: [String],
    release_date: String,
    album_type: String,
    images: String,
    genres: [String],
    tracks: [TrackSchema]
});

module.exports = mongoose.model('Artist', ArtistSchema);