const express = require('express');
const router = express.Router();
const path = require('path');

// Mengarahkan halaman utama ke file index.html
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = router;
