const controller = require('../controllers/order')
const router = require('express').Router();

router.post('/create', controller.placeOrder);
router.post('/getAll', controller.getOrders);
router.post('/:orderId', controller.changeOrderStatus);


module.exports = router;
