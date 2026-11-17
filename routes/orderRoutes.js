const express = require('express');
const { placeOrder, getMyOrders, getAllOrders, updateOrderStatus, getSalesReport } = require('../controllers/orderController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);
router.post('/', placeOrder);
router.get('/report', authorizeRoles('admin'), getSalesReport);
router.get('/my-orders', getMyOrders);
router.get('/all', authorizeRoles('admin'), getAllOrders);
router.patch('/:id/status', authorizeRoles('admin'), updateOrderStatus);

module.exports = router;