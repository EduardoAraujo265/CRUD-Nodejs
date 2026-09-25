const { Router } = require('express');
const { body } = require('express-validator');
const controller = require('../controllers/authController');
const validate = require('../middleware/validate');

const router = Router();

router.post(
  '/login',
  [
    body('email').trim().isEmail().withMessage('Email inválido').normalizeEmail(),
    body('senha').notEmpty().withMessage('Senha é obrigatória'),
  ],
  validate,
  controller.login
);

router.post('/logout', controller.logout);

module.exports = router;
