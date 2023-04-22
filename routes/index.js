var express = require('express');
var router = express.Router();
var indexController = require('../controllers/index');


router.get('/loadBooks', function(req, res, next) {
  indexController.loadBooks();
  res.sendStatus(200);
});


router.get('/books', function(req, res, next) {
  indexController.getBooks(req, res);
});


router.get('/books/:id', function(req, res, next) {
  indexController.getBook(req, res);
});

router.get('/books/:id/formats', function(req, res, next) {
  indexController.getBookFormats(req, res);
});

router.put('/books/:id', function(req, res, next) {
  indexController.updateBook(req, res);
});

router.delete('/books/:id', function(req, res, next) {
  indexController.deleteBook(req, res);
});

router.post('/books', function(req, res, next) {
  indexController.createBook(req, res);
});


module.exports = router;
