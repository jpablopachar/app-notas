const router = require('express').Router();

const Nota = require('../models/nota');

const { estaAutenticado } = require('../helpers/auth');

router.get('/notas/agregarNota', estaAutenticado, (req, res) => {
  res.render('notas/agregarNota');
});

router.post('/notas/agregarNota', estaAutenticado, async (req, res) => {
  const { titulo, descripcion } = req.body;
  const errores = [];

  if (!titulo) {
    errores.push({ texto: 'Debes ingresar un título' });
  }

  if (!descripcion) {
    errores.push({ texto: 'Debes ingresar una descripción' });
  }

  if (errores.length > 0) {
    res.render('notas/agregarNota', { errores, titulo, descripcion });
  } else {
    const nuevaNota = new Nota({ titulo, descripcion });

    nuevaNota.usuario = req.user.id;

    await nuevaNota.save();
    req.flash('mensajeCorrecto', 'Nota agregada correctamente');
    res.redirect('/notas');
  }
});

router.get('/notas', estaAutenticado, async (req, res) => {
  const notas = await Nota.find({ usuario: req.user.id }).sort({ fecha: 'desc' });

  res.render('notas/listarNotas', { notas });
});

router.get('/notas/editarNota/:id', estaAutenticado, async (req, res) => {
  const nota = await Nota.findById(req.params.id);

  res.render('notas/editarNota', { nota });
});

router.put('/notas/editarNota/:id', estaAutenticado, async (req, res) => {
  const { titulo, descripcion } = req.body;

  await Nota.findByIdAndUpdate(req.params.id, { titulo, descripcion });
  req.flash('mensajeCorrecto', 'Nota editada correctamente');
  res.redirect('/notas');
});

router.delete('/notas/eliminarNota/:id', estaAutenticado, async (req, res) => {
  await Nota.findByIdAndDelete(req.params.id);
  req.flash('mensajeCorrecto', 'Nota eliminada correctamente');
  res.redirect('/notas');
});

module.exports = router;
