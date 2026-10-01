const db = require('../config/database');

// Membuat Transaksi Baru (Checkout)
exports.checkout = (req, res) => {
    const { game, userId, zoneId, item, amount, paymentMethod } = req.body;
    const trxId = 'TRX-' + Date.now();
    const status = 'Pending';

    const query = `INSERT INTO transactions (id, game, user_id, zone_id, item, amount, payment_method, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(query, [trxId, game, userId, zoneId, item, amount, paymentMethod, status], function(err) {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }

        let paymentData = {};
        if (paymentMethod === 'QRIS') {
            paymentData = {
                qr_string: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PAYMENT-${trxId}`,
                instruction: 'Scan QRIS di atas menggunakan e-wallet atau m-banking.'
            };
        } else {
            paymentData = {
                virtual_account: '8801' + Math.floor(1000000000 + Math.random() * 9000000000),
                bank: paymentMethod,
                instruction: `Transfer tepat sejumlah Rp ${amount.toLocaleString()} ke nomor Virtual Account di atas.`
            };
        }

        res.json({
            success: true,
            message: 'Transaksi berhasil dibuat.',
            transaction_id: trxId,
            payment_details: paymentData
        });
    });
};

// Simulasi Webhook Pembayaran Berhasil
exports.simulatePayment = (req, res) => {
    const { transaction_id } = req.body;
    const query = `UPDATE transactions SET status = 'Success' WHERE id = ?`;

    db.run(query, [transaction_id], function(err) {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
        res.json({ success: true, message: `Transaksi ${transaction_id} lunas!` });
    });
};

// Ambil Riwayat Transaksi
exports.getTransactions = (req, res) => {
    db.all("SELECT * FROM transactions ORDER BY created_at DESC", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
        res.json({ success: true, data: rows });
    });
};
