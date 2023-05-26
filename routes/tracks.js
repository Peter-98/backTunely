const express = require('express');
const router = express.Router();
const tracksController = require('../controllers/tracksController');

var middleware = require('../controllers/middleware');  


/**
 * @swagger
 * /tracks/search/{trackName}:
 *   get:
 *     summary: Busca canciones en Spotify
 *     description: Busca canciones en Spotify a partir de un término de búsqueda
 *     parameters:
 *       - in: path
 *         name: trackName
 *         required: true
 *         description: Término de búsqueda
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de canciones encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Nombre de la canción
 *                   album:
 *                     type: string
 *                     description: Nombre del álbum
 *                   artist:
 *                     type: string
 *                     description: Nombre del artista
 *                   releaseDate:
 *                     type: string
 *                     description: Fecha de lanzamiento del álbum
 *                   genres:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: Géneros del álbum
 *                   duration:
 *                     type: integer
 *                     description: Duración de la canción en milisegundos
 *                   image:
 *                     type: string
 *                     description: URL de la imagen del álbum
 *                   uri:
 *                     type: string
 *                     description: URI de la canción en Spotify
 *       400:
 *         description: Parámetros de búsqueda inválidos
 *       401:
 *         description: Token inválido o expirado
 *       404:
 *         description: Canciones no encontradas
 *       500:
 *         description: Error interno del servidor
 */
router.get('/search/:trackName', middleware.ensureAuthenticated, tracksController.searchSongs); //busca canciones API Spotify


/**
 * @swagger
 * /tracks/{searchTerm}:
 *   get:
 *     summary: Buscar canciones en la base de datos
 *     description: Busca canciones en la base de datos según el término de búsqueda.
 *     parameters:
 *       - in: path
 *         name: searchTerm
 *         required: true
 *         description: Término de búsqueda para canciones
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de canciones encontradas en la base de datos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *       404:
 *         description: No se encontraron canciones en la base de datos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de error
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de error
 */
router.get('/:searchTerm', tracksController.searchTracks); //busca canciones bbdd


/**
 * @swagger
 * /tracks:
 *   get:
 *     summary: Devuelve todas las canciones de la base de datos.
 *     responses:
 *       '200':
 *         description: OK. La petición ha tenido éxito.
 *         content:
 *           application/json:
 *       '404':
 *         description: No encontrado. No se encontraron canciones en la base de datos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tracks no encontradas
 */
router.get('/', tracksController.trackReadAll); //devuelve todas las canciones bbdd



/**
 * @swagger
 * /tracks:
 *   post:
 *     summary: Crea una nueva canción en la base de datos.
 *     description: Crea una nueva canción en la base de datos a partir de los datos proporcionados en el cuerpo de la petición.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tracks:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: Nombre de la canción.
 *                       example: "Bohemian Rhapsody"
 *                     image:
 *                       type: string
 *                       description: URL de la imagen de la canción.
 *                       example: "https://www.example.com/bohemian-rhapsody.jpg"
 *                     artist:
 *                       type: string
 *                       description: Artista de la canción.
 *                       example: "Queen"
 *                     album:
 *                       type: string
 *                       description: Álbum de la canción.
 *                       example: "A Night at the Opera"
 *                     releaseDate:
 *                       type: string
 *                       description: Fecha de lanzamiento de la canción en formato ISO 8601.
 *                       example: "1975-10-31T00:00:00Z"
 *                     uri:
 *                       type: string
 *                       description: URI de la canción en el servicio de streaming.
 *                       example: "spotify:track:6rqhFgbbKwnb9MLmUQDhG6"
 *                     duration:
 *                       type: number
 *                       description: Duración de la canción en segundos.
 *                       example: 354
 *                     genres:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Géneros de la canción.
 *                       example: ["Rock", "Progressive Rock"]
 *                     userId:
 *                       type: string
 *                       description: ID del usuario que creó la canción.
 *                       example: "608e468b9a64e43da3c3298a"
 *                     href:
 *                       type: string
 *                       description: Enlace a la canción en el servicio de streaming.
 *                       example: "https://open.spotify.com/track/6rqhFgbbKwnb9MLmUQDhG6"
 *                     coords:
 *                       type: object
 *                       properties:
 *                         type:
 *                           type: string
 *                           description: Tipo de coordenadas.
 *                           example: "Point"
 *                         coordinates:
 *                           type: array
 *                           items:
 *                             type: number
 *                           description: Coordenadas de la ubicación de la canción en formato [longitud, latitud].
 *                           example: [-3.7037902, 40.4167754]
 *                 example:
 *                   tracks:
 *                     - name: "Bohemian Rhapsody"
 *                       image: "https://www.example.com/bohemian-rhapsody.jpg"
 *                       artist: "Queen"
 *                       album: "A Night at the Opera"
 *                       releaseDate: "1975-10-31T00:00:00Z"
 *                       uri: "spotify:track:6rqhFgbbKwnb9MLmUQDhG6"
 *                       duration: 354
 *                       genres:
 *                         - "Rock"
 *                         - "Progressive Rock"
*/                     
router.post('/', middleware.ensureAuthenticated, tracksController.tracksCreate); // crear cancion en bbdd


/**
 * @swagger
 * /tracks/{id}:
 *   put:
 *     summary: Actualiza una canción en la base de datos
 *     description: Actualiza una canción en la base de datos a partir del ID proporcionado en la URL
 *     tags: [Tracks]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID de la canción a actualizar
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tracks:
 *                 type: array
 *                 items:
 *                   $ref: ''
 *             required:
 *               - tracks
 *     responses:
 *       '200':
 *         description: Canción actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 track:
 *                   $ref: ''
 *       '400':
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '404':
 *         description: Canción no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '500':
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.put('/:id', middleware.ensureAuthenticated, tracksController.tracksUpdate); // actualizar cancion en bbdd

/**
 * @swagger
 *
 * /tracks/details/{id}:
 *   get:
 *     summary: Obtiene los detalles de una canción en la base de datos por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la canción a buscar
 *     responses:
 *       200:
 *         description: Detalles de la canción encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Track'
 *       404:
 *         description: La canción no fue encontrada en la base de datos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de error explicando que la canción no fue encontrada
 *                 err:
 *                   type: string
 *                   description: Detalles del error ocurrido
 */
router.get('/details/:id', tracksController.searchTrackById); //ver detalles cancion en bbbdd

/**
 * @swagger
 * /tracks/{id}:
 *   post:
 *     summary: Crear un comentario de una canción en la base de datos
 *     tags: 
 *       - Tracks
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de la canción en la base de datos
 *         required: true
 *         schema:
 *           type: string
 *           example: 60997860042f4c00152822e9
 *     requestBody:
 *       description: Datos del comentario
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               author:
 *                 type: string
 *                 description: Autor del comentario
 *                 example: Usuario1
 *               comment:
 *                 type: string
 *                 description: Comentario
 *                 example: Me encanta esta canción
 *               rating:
 *                 type: number
 *                 description: Calificación del comentario (1-5)
 *                 example: 5
 *               userId:
 *                 type: string
 *                 description: ID del usuario que hace el comentario
 *                 example: 60a60a1c58b0f90015d9bfb4
 *               longitude:
 *                 type: number
 *                 description: Longitud de la ubicación del usuario que hace el comentario
 *                 example: -122.416
 *               latitude:
 *                 type: number
 *                 description: Latitud de la ubicación del usuario que hace el comentario
 *                 example: 37.779
 *               accuracy:
 *                 type: number
 *                 description: Precisión de la ubicación del usuario que hace el comentario
 *                 example: 3
 *     responses:
 *       '200':
 *         description: Comentario agregado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Comentario agregado exitosamente
 *                 track:
 *                   $ref: '#/components/schemas/Track'
 *       '400':
 *         description: Error en la solicitud del cliente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error en la solicitud del cliente
 *       '404':
 *         description: Canción no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No se encontró el track
 *       '500':
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error interno del servidor
 */
router.post('/:id', tracksController.commentCreate); // crear comentario de una cancion en bbdd

/**
 * @swagger
 * /tracks/{id}:
 *   delete:
 *     summary: Elimina una canción de la bbdd.
 *     tags: [Tracks]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de la canción a eliminar.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Canción eliminada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Track'
 *       404:
 *         description: No se encontró la canción con el ID proporcionado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de error.
 *                   example: Canción no encontrada.
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de error.
 *                   example: Error interno del servidor.
 */
router.delete('/:id', middleware.ensureAuthenticated, tracksController.deleteTrackById); // borra una cancion de la bbdd


/**
 * @swagger
 * /tracks/{id}/{commentId}:
 *   delete:
 *     summary: Elimina un comentario de una canción de la base de datos
 *     description: Elimina un comentario específico de una canción de la base de datos.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de la canción de la que se quiere eliminar el comentario
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         description: ID del comentario que se quiere eliminar
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Comentario eliminado correctamente
 *       '404':
 *         description: Track no encontrado o Comentario no encontrado
 *       '500':
 *         description: Error interno del servidor
 */
router.delete('/:id/:commentId', tracksController.deleteCommentById); // borra un comentario de una cancion de la bbdd


module.exports = router;

