const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/DBAppNotas', {
// mongoose.connect('mongodb://jppachar:jpablopachar1993@ds139735.mlab.com:39735/dbappnotas', {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
}).then(db => console.log('La base de datos está conectada')).catch(error => console.log(error));
