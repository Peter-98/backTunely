const mongoose = require('mongoose');

mongoose.connect('mongodb://mongodb:27017/tracks', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Conexión a MongoDB establecida correctamente');
    })
    .catch(err => {
        console.log('Error al conectar a MongoDB', err);
    });

module.exports = mongoose;