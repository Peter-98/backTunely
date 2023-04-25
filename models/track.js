const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TrackSchema = require('./track');

const TrackSchema = new Schema({
    id: String,
    name: String,
    artists: [String],
    release_date: String,
    album_type: String,
    images: [String],
    album_group: String,
    comments: String,
    starts: Number
});

module.exports = mongoose.model('Track', TrackSchema);