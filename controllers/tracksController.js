const axios = require('axios');
const mongoose = require('mongoose');
const Track = require('../models/track');
const moment = require('moment');
require('dotenv').config();


// variables de entorno
const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;



const sendJSONresponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};

// función para obtener el token de acceso
async function getToken() {
  const url = 'https://accounts.spotify.com/api/token';
  const auth = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');
  const { data } = await axios.post(url, 'grant_type=client_credentials', {
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  const accessToken = data.access_token;
  process.env.ACCESS_TOKEN = accessToken;

  // Llamar al método getToken nuevamente después de 1 hora (3600 segundos * 1000 milisegundos)
  setTimeout(getToken, 36000);
}

const searchSongs = async (req, res) => {
  const query = req.params.trackName;

  try {
    const response = await axios.get(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`, {
      headers: {
        'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`
      }
    });

    const tracks = response.data.tracks.items.map((item) => {
      return {
        name: item.name,
        album: item.album.name,
        artist: item.artists[0].name,
        releaseDate: item.album.release_date,
        genres: item.album.genres,
        duration: item.duration_ms,
        image: item.album.images[0].url,
        uri: item.uri
      }
    });
    //sendJSONresponse(res, 200, { "message": tracks });
    res.json(tracks);
  } catch (error) {
    console.log(error);

    if (error.response && error.response.status === 401) {
      sendJSONresponse(res, 401, { "message": "Token inválido o expirado" });
    } else if (error.response && error.response.status === 400) {
      sendJSONresponse(res, 400, { "message": "Parámetros de búsqueda inválidos" });
    } else if (error.response && error.response.status === 404) {
      sendJSONresponse(res, 404, { "message": "Canciones no encontradas" });
    } else {
      sendJSONresponse(res, 500, { "message": "Error interno del servidor" });
    }
  }
}


const tracksCreate = async (req, res) => {
  try {
    const tracks = req.body.tracks;
    console.log(tracks);
    const tracksToSave = tracks.map((track) => {
      const releaseDate = new Date(track.releaseDate);
      console.log(track.coords);
      const coords = {
        type: track.coords.type,
        coordinates: track.coords.coordinates
      };
      console.log(coords);
      return new Track({
        name: track.name,
        image: track.image,
        artist: track.artist,
        album: track.album,
        releaseDate: releaseDate,
        uri: track.uri,
        duration: track.duration,
        genres: track.genres,
        userId: track.userId,
        href: track.href,
        coords: coords
      });
    });
    // Comprobar si existe alguna canción con el mismo nombre
    const existingTrack = await Track.findOne({ name: tracksToSave[0].name }).exec();
    if (existingTrack) {
      return sendJSONresponse(res, 409, { "message": "Ya existe una canción con el mismo nombre" });
    }
    const tracksSaved = await Track.insertMany(tracksToSave);
    sendJSONresponse(res, 201, { "message": "Tracks guardadas exitosamente" });
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      const errors = Object.keys(error.errors).map(key => error.errors[key].message);
      return sendJSONresponse(res, 400, { "message": errors.join(', ') });
    }
    sendJSONresponse(res, 500, { "message": "Error interno del servidor" });
  }
};



const trackReadAll = async (req, res) => {
  try {
    const tracks = await Track.find({}).exec();
    if (!tracks) {
      sendJSONresponse(res, 404, { "message": "Tracks no encontradas" });
    } else {
      sendJSONresponse(res, 200, tracks);
    }
  } catch (err) {
    sendJSONresponse(res, 404, err);
  }
};


const searchTracks = async (req, res) => {
  try {
    const searchTerm = req.params.searchTerm;
    const searchDate = Date.parse(searchTerm);
    let tracks;
    if (!isNaN(searchDate)) {
      tracks = await Track.find({
        releaseDate: searchDate
      }).exec();
    } else {
      tracks = await Track.find({
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { artist: { $regex: searchTerm, $options: "i" } }
        ]
      }).exec();
    }
    if (!tracks) {
      sendJSONresponse(res, 404, { "message": "Tracks no encontradas" });
    } else {
      sendJSONresponse(res, 200, tracks);
    }
  } catch (err) {
    sendJSONresponse(res, 404, err);
  }
};


const searchTrackById = async (req, res) => {
  try {
    const trackId = req.params.id;
    const track = await Track.findById(trackId).exec();
    if (!track) {
      sendJSONresponse(res, 404, { "message": "Track no encontrada" });
    } else {
      sendJSONresponse(res, 200, track);
    }
  } catch (err) {
    sendJSONresponse(res, 404, err);
  }
};


const deleteTrackById = async (req, res) => {
  try {
    const trackId = req.params.id;
    const track = await Track.findByIdAndRemove(trackId).exec();
    console.log('id:',trackId, 'objeto:', track );
    if (!track) {
      sendJSONresponse(res, 404, { "message": "Track no encontrada" });
    } else {
      sendJSONresponse(res, 200, track);
    }
  } catch (err) {
    sendJSONresponse(res, 404, err);
  }
};


const commentCreate = async (req, res) => {
  const trackId = req.params.id;
  console.log('id : ', trackId);
  const { author, comment, rating, userId, longitude, latitude, accuracy } = req.body;
  console.log(req.body);
  const newComment = {
    author: author,
    comment: comment,
    rating: rating,
    userId: userId,
    coords : {
      type: "Point",
      coordinates: [longitude, latitude, accuracy]
    }
  };

  try {
    const updatedTrack = await Track.findOneAndUpdate(
      { _id: trackId },
      { $push: { comments: newComment } },
      { new: true }
    );

    if (!updatedTrack) {
      sendJSONresponse(res, 404, { message: "No se encontró el track" });
    } else {
      sendJSONresponse(res, 200, { message: "Comentario agregado exitosamente", track: updatedTrack });
    }
  } catch (error) {
    console.error(error);
    sendJSONresponse(res, 500, { message: "Error interno del servidor" });
  }
};


const deleteCommentById = async (req, res) => {
  try {
    const id = req.params.id;
    const commentId = req.params.commentId;

    const track = await Track.findById(id).exec();
    if (!track) {
      return sendJSONresponse(res, 404, { "message": "Track no encontrada" });
    }
    const commentIndex = track.comments.findIndex(comment => comment._id.toString() === commentId);
    if (commentIndex === -1) {
      return sendJSONresponse(res, 404, { "message": "Comentario no encontrado" });
    }

    track.comments.splice(commentIndex, 1);
    await track.save();

    return sendJSONresponse(res, 200, { "message": "Comentario eliminado correctamente" });
  } catch (err) {
    console.error(err);
    return sendJSONresponse(res, 500, { "message": "Ha ocurrido un error al eliminar el comentario" });
  }
};


const tracksUpdate = async (req, res) => {
  try {
    const trackId = req.params.id;
    const trackToUpdate = req.body.tracks[0];
    console.log('BODY', trackToUpdate);
    console.log('RELEASEDATE:', trackToUpdate.releaseDate);
    const fecha = moment.utc(trackToUpdate.releaseDate, 'YYYY-MM-DD').toISOString();
    
    let coords; // Definir la variable coords aquí
    console.log('trackToUpdate.coords', trackToUpdate.coords);
    if (trackToUpdate.coords) {
      const { longitude, latitude, accuracy } = trackToUpdate.coords.coordinates;
      const coordinates = [longitude, latitude, accuracy];
    
      coords = {
        type: trackToUpdate.coords.type,
        coordinates:coordinates
      };
      console.log('coordinates', coordinates);
    }
    
    const updatedTrack = await Track.findByIdAndUpdate(trackId, {
      $set: {
        name: trackToUpdate.name,
        image: trackToUpdate.image,
        artist: trackToUpdate.artist,
        album: trackToUpdate.album,
        releaseDate: fecha,
        uri: trackToUpdate.uri,
        duration: trackToUpdate.duration,
        genres: trackToUpdate.genres,
        userId: trackToUpdate.userId,
        coords: coords,
        href: trackToUpdate.href
      }
    }, { new: true });
    if (!updatedTrack) {
      return sendJSONresponse(res, 404, { "message": "Canción no encontrada" });
    }

    sendJSONresponse(res, 200, { "message": "Canción actualizada exitosamente", "track": updatedTrack });
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      const errors = Object.keys(error.errors).map(key => error.errors[key].message);
      return sendJSONresponse(res, 400, { "message": errors.join(', ') });
    }
    sendJSONresponse(res, 500, { "message": "Error interno del servidor" });
  }
};







module.exports = { getToken, searchSongs, tracksCreate, trackReadAll, searchTracks, searchTrackById, commentCreate, deleteTrackById, deleteCommentById, tracksUpdate };
