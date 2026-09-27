const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { getNotifications, markAllRead, markRead } = require('../controllers/notificationController');

router.use(protect);
router.get('/', getNotifications);
router.patch('/read-all', markAllRead);
router.patch('/:id/read', markRead);

module.exports = router;
