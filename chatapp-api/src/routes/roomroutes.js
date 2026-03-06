const router = require('express').Router();
const { body } = require('express-validator');
const roomController = require('../controllers/room.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate       = require('../middlewares/validate.middleware');

router.use(authMiddleware);

router.get('/',           roomController.getRooms);
router.post('/', [
  body('name').trim().notEmpty().isLength({ max: 100 }),
  body('description').optional().trim().isLength({ max: 255 }),
], validate, roomController.createRoom);
router.get('/:roomId/messages', roomController.getMessages);

module.exports = router;