const helpers = {};

helpers.estaAutenticado = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  req.flash('mensajeError', 'No autorizado');
  return res.redirect('/usuarios/iniciarSesion');
};

module.exports = helpers;
