const controller = require('../controllers/products')
const router = require('express').Router();

router.get('/search', controller.searchProducts);
router.get('/:productId', controller.getProduct);
router.get('/', controller.listAllProducts);
router.get('/getListedProducts', controller.listAllProductsSupplier);
router.post('/create', controller.createProduct);
router.post('/update', controller.updateProduct);
router.post('/updateStock', controller.updateStock);


module.exports = router;
