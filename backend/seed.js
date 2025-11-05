const fs = require('fs');
const pool = require('./db');
const bcrypt = require('bcrypt');
require('dotenv').config();


(async () => {
const schema = fs.readFileSync(__dirname + '/models.sql', 'utf8');
await pool.query(schema);
const pw = await bcrypt.hash('password123', 10);
await pool.query(`INSERT INTO managers(email, password) VALUES($1,$2) ON CONFLICT (email) DO NOTHING`, ['manager@example.com', pw]);
console.log('DB seeded. Manager: manager@example.com / password123');
process.exit(0);
})();
