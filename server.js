require('dotenv').config();
const express = require('express');
const path = require('path');

const apiRoutes = require('./routes/api');
const webRoutes = require('./routes/web');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Folder File Statis Frontend (CSS, JS Klien)
app.use(express.static(path.join(__dirname, 'public')));

// Gunakan Rute
app.use('/api', apiRoutes);
app.use('/', webRoutes);

// Jalankan Server
app.listen(PORT, () => {
    console.log(`Server modular aktif di: http://localhost:${PORT}`);
});
