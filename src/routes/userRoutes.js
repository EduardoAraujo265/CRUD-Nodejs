const { Router } = require('express');
const controller = require('../controllers/userController');
const { requireAuth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { usuarioValidator, idParamValidator } = require('../validators/userValidators');

const router = Router();

// Todas as rotas de usuários exigem admin autenticado.
router.use(requireAuth);

router.get('/', controller.listar);
router.post('/', usuarioValidator, validate, controller.criar);
router.patch('/:id', idParamValidator, usuarioValidator, validate, controller.atualizar);
router.delete('/:id', idParamValidator, validate, controller.remover);

module.exports = router;
