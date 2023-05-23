const express = require('express');
const router = express.Router();

var ctrlAuth = require('../controllers/auth'); 

// Rutas de registro y login
router.post('/signup', ctrlAuth.signup); 
router.post('/login', ctrlAuth.login);

module.exports = router;