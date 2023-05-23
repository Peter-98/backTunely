const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/tracks', {
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