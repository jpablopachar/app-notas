const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const UsuarioSchema = new Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true },
  contrasena: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
});

UsuarioSchema.methods.encriptarContrasena = async (contrasena) => {
  // Genera un hash
  const salt = await bcrypt.genSalt(10);
  // Contraseña cifrada
  const hash = bcrypt.hash(contrasena, salt);

  return hash;
};

UsuarioSchema.methods.compararContrasena = async function(contrasena) {
  // Toma la contraseña y la compara en la base de datos
  return await bcrypt.compare(contrasena, this.contrasena);
};

module.exports = mongoose.model('Usuario', UsuarioSchema);
