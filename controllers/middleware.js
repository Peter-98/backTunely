var jwt = require('jsonwebtoken'); 
var moment = require('moment');
var config = require('../config');

exports.ensureAuthenticated = function(req, res, next) {
  if(!req.headers.authorization) { 
    return res
    .status(403)
    .send({message: "Petición sin cabecera de autorización"});
  }

  var token = req.headers.authorization.split(" ")[1]; 
  var payload = jwt.verify(token, config.TOKEN_SECRET, function(err, payload) {
    if (err) {
      switch (err.name) { 
        case 'JsonWebTokenError':
          return res.status(401).send({message: "Firma incorrecta"});
        case 'TokenExpiredError':
          return res.status(401).send({message: "Token caducado"});
        default:
          return res.status(401).send(err);
      }
    }
    req.user = payload.sub; 
    next(); 
  });
}