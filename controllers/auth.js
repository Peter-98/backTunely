var mongoose = require('mongoose');
var User = require('../models/user');
const bcrypt = require('bcrypt');
var service = require('../controllers/service'); 

const sendJSONresponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};

module.exports.signup = async function(req, res) {
  try {
    const { email, pass } = req.body;
    console.log(req.body);
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Crear un nuevo usuario
    const hashedPassword = await bcrypt.hash(pass, 10);
    const newUser = new User({ email, pass: hashedPassword });
    await newUser.save();
    return res.status(200).json({ token: service.createToken(email) });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Error en el servidor' });
  }
};

module.exports.login = async function(req, res) {
  try {
    const { email, pass } = req.body;

    // Buscar el usuario por email
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Comparar la contraseña
    const passwordMatch = await bcrypt.compare(pass, user.pass);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar el token JWT
    const token = service.createToken(email);

    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};