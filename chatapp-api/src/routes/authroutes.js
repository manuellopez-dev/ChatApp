const router = require('express').Router();
const { body } = require('express-validator');
const authController  = require('../controllers/auth.controller');
const authMiddleware  = require('../middlewares/auth.middleware');
const validate        = require('../middlewares/validate.middleware');

router.post('/register', [
  body('username').trim().notEmpty().isLength({ min: 3, max: 50 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
], validate, authController.register);

router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], validate, authController.login);

router.get('/me', authMiddleware, authController.me);

module.exports = router;