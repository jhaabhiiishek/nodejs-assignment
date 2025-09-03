const controller = require('../controllers/admin')
const router = require('express').Router();

router.get('/analytics', controller.analytics);

module.exports = router;
