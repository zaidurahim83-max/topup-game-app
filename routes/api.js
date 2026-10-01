const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');
const paymentController = require('../controllers/paymentController');

// Rute Produk
router.get('/products', productController.getProducts);

// Rute Transaksi & Pembayaran
router.post('/checkout', paymentController.checkout);
router.post('/simulate-payment', paymentController.simulatePayment);
router.get('/transactions', paymentController.getTransactions);

module.exports = router;
