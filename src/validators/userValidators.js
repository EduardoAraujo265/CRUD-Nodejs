const { body, param } = require('express-validator');

const usuarioValidator = [
  body('nome').trim().notEmpty().withMessage('Nome é obrigatório').isLength({ max: 498 }),
  body('email').trim().isEmail().withMessage('Email inválido').normalizeEmail(),
  body('telefone')
    .trim()
    .matches(/^[0-9]{10,11}$/)
    .withMessage('Telefone deve conter 10 ou 11 dígitos numéricos'),
  body('senha')
    .isLength({ min: 8 })
    .withMessage('Senha deve ter ao menos 8 caracteres'),
];

const idParamValidator = [param('id').isInt().withMessage('ID inválido').toInt()];

module.exports = { usuarioValidator, idParamValidator };
