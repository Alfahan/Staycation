const router = require('express').Router();
const adminController = require('../controllers/adminController');

router.get('/dashboard', adminController.viewDashboard);

// Endpoint Category
router.get('/category', adminController.viewCategory);
router.post('/category', adminController.addCategory);
router.put('/category', adminController.editCategory);
router.delete('/category/:id', adminController.deleteCategory);

// Endpoint Bank
router.get('/bank', adminController.viewBank);
router.post('/bank', adminController.addBank);

router.get('/item', adminController.viewItem);

router.get('/booking', adminController.viewBooking);

module.exports = router;