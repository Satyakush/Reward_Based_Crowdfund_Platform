const router = require('express').Router();
const { adminOnly } = require('../middleware/adminMiddleware');
const { getAdminOverview } = require('../controllers/adminController');

router.get('/overview', adminOnly, getAdminOverview);

module.exports = router;
