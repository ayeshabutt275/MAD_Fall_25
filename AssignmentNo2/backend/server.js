const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',       // default XAMPP user
  password: '',       // leave empty
  database: 'ecommerce' // your database name in phpMyAdmin
});

db.connect(err => {
  if (err) {
    console.log('❌ Database connection failed:', err);
  } else {
    console.log('✅ Database connected successfully!');
  }
});

app.get('/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) return res.json(err);
    res.json(results);
  });
});

app.listen(5000, () => console.log('🚀 Server running on port 5000'));
