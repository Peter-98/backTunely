const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/admin', {useUnifiedTopology: true, useNewUrlParser: true, directConnection:true}).then(
 
    () => { console.log("Connected to DB") },
     
    err => { console.log(err) }
     
);

module.exports = mongoose;  