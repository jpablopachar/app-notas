const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Usuario = require('../models/usuario');

passport.use(new LocalStrategy({
  usernameField: 'correo',
  passwordField: 'contrasena',
}, async (correo, contrasena, done) => {
  const usuario = await Usuario.findOne({ correo });

  if (!usuario) {
    done(null, false, { mensaje: 'Usuario no encontrado' });
  } else {
    const resultado = await usuario.compararContrasena(contrasena);

    if (resultado) {
      done(null, usuario);
    } else {
      done(null, false, { mensaje: 'Contraseña incorrecta' });
    }
  }
}));

passport.serializeUser((usuario, done) => {
  done(null, usuario.id);
});

passport.deserializeUser((id, done) => {
  Usuario.findById(id, (error, usuario) => {
    done(error, usuario);
  });
});
