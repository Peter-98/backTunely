const axios = require('axios');
require('dotenv').config();

// variables de entorno
const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

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
  console.log('Token obtenido: ', data.access_token);
  process.env.ACCESS_TOKEN = data.access_token;
}

async function searchSongs(query) {
  console.log(query);
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
    console.log(tracks);
    return tracks;
  } catch (error) {
    console.log(error);

    if (error.response && error.response.status === 401) {
      throw new Error('Token inválido o expirado');
    } else if (error.response && error.response.status === 400) {
      throw new Error('Parámetros de búsqueda inválidos');
    } else if (error.response && error.response.status === 404) {
      throw new Error('Canciones no encontradas');
    } else {
      throw new Error('Error interno del servidor');
    }
  }
}

module.exports = { getToken, searchSongs};
