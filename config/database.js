const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Membuat file database.sqlite di root folder
const dbPath = path.resolve(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Gagal terhubung ke database:', err.message);
    } else {
        console.log('Berhasil terhubung ke database SQLite.');
    }
});

// Inisialisasi Tabel
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        game_name TEXT,
        item_name TEXT,
        price INTEGER
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        game TEXT,
        user_id TEXT,
        zone_id TEXT,
        item TEXT,
        amount INTEGER,
        payment_method TEXT,
        status TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Masukkan data produk awal jika kosong
    db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
        if (row.count === 0) {
            const initialProducts = [
                ['Mobile Legends', '86 Diamonds', 20000],
                ['Mobile Legends', '172 Diamonds', 40000],
                ['Free Fire', '140 Diamonds', 20000],
                ['Genshin Impact', '300 Genesis Crystals', 65000]
            ];
            const stmt = db.prepare("INSERT INTO products (game_name, item_name, price) VALUES (?, ?, ?)");
            initialProducts.forEach(p => stmt.run(p));
            stmt.finalize();
            console.log("Data produk awal berhasil dimasukkan.");
        }
    });
});

module.exports = db;
