const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const flash = require('connect-flash');
const passport = require('passport');
const path = require('path');
const morgan = require('morgan');
const methodOverride = require('method-override');

require('./database');
require('./config/passport');

const app = express();

/*                  Ajustes                     */
// Usa el puerto establecido o usa el puerto 3000
app.set('port', process.env.PORT || 3000);

/*                   Vistas                      */
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
}));
app.set('view engine', 'hbs');

/*             Archivos Estáticos                */
app.use(express.static(path.join(__dirname, 'public')));

/*                 Middleware                   */
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
// Permite autenticar al usuario y almacenar sus datos temporalmente
app.use(session({
  secret: 'misesionsecreta',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// Variables globales
app.use((req, res, next) => {
  res.locals.mensajeCorrecto = req.flash('mensajeCorrecto');
  res.locals.mensajeError = req.flash('mensajeError');
  res.locals.error = req.flash('error');
  res.locals.usuario = req.user || null;

  next();
});

/*                    Rutas                      */
app.use(require('./routes/index'));
app.use(require('./routes/notas'));
app.use(require('./routes/usuarios'));

// Escucha en el puerto establecido
app.listen(app.get('port'), () => console.log('Servidor en puerto', app.get('port')));
