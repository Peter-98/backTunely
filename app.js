var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

require('dotenv').config();

var indexRouter = require('./routes/index');
var trackRouter = require('./routes/tracks');
var authRouter = require('./routes/auth');
var tracksController = require('./controllers/tracksController');
var bodyParser = require('body-parser');



var app = express();
app.use(cors());


var swaggerJsdoc = require('swagger-jsdoc');
var swaggerUi = require('swagger-ui-express');

// Define la configuración de Swagger
var swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Tunely',
      version: '1.0.0',
      description: 'Una API para acceder a la lista de operaciones de canciones y comentarios'
    },
  },
  apis: ['./routes/*.js'], // Rutas que contienen las definiciones de las anotaciones
};

// Genera la documentación Swagger a partir de las anotaciones en el código
var swaggerSpec = swaggerJsdoc(swaggerOptions);

// Agrega el middleware de Swagger a la aplicación
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Llamar a la función getToken para obtener el token de Spotify
tracksController.getToken();

// Actualizar el token cada hora
setInterval(() => {
  tracksController.getToken().catch((error) => {
    console.error('Error al obtener el token de Spotify', error);
  });
}, 3600000); // 1 hora en milisegundos


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(bodyParser.json({ limit: '50mb' }));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/tracks', trackRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { title: 'Error' }); // Agrega la variable title aquí
});

module.exports = app;
