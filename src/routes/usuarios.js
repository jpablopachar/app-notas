const router = require('express').Router();
const passport = require('passport');

const Usuario = require('../models/usuario');

router.get('/usuarios/registrarse', (req, res) => {
  res.render('usuarios/registrarse');
});

router.post('/usuarios/registrarse', async (req, res) => {
  const { nombre, correo, contrasena, confirmarContrasena } = req.body;
  const errores = [];

  if (nombre.length <= 0) {
    errores.push({ texto: 'Debes ingresar tu nombre' });
  }

  if (correo.length <= 0) {
    errores.push({ texto: 'Debes ingresar tu correo' });
  }

  if (contrasena !== confirmarContrasena) {
    errores.push({ texto: 'Las contraseñas no coinciden' });
  }

  if (contrasena.length < 4) {
    errores.push({ texto: 'Las contraseña debe ser mayor a cuatro caracteres' });
  }

  if (errores.length > 0) {
    res.render('usuarios/registrarse', {
      errores,
      nombre,
      correo,
      contrasena,
      confirmarContrasena,
    });
  } else {
    const correoUsuario = await Usuario.findOne({ correo });

    if (correoUsuario) {
      req.flash('mensajeError', 'El correo ya ha sido ingresado');
      res.redirect('/usuarios/registrarse');
    }

    const nuevoUsuario = new Usuario({ nombre, correo, contrasena });

    nuevoUsuario.contrasena = await nuevoUsuario.encriptarContrasena(contrasena);

    await nuevoUsuario.save();
    req.flash('mensajeCorrecto', 'Haz sido registrado');
    res.redirect('/usuarios/iniciarSesion');
  }
});

router.get('/usuarios/iniciarSesion', (req, res) => {
  res.render('usuarios/iniciarSesion');
});

router.post('/usuarios/iniciarSesion', passport.authenticate('local', {
  successRedirect: '/notas',
  failureRedirect: '/usuarios/iniciarSesion',
  failureFlash: true,
}));

router.get('/usuarios/cerrarSesion', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
