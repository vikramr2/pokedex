// One-time setup: creates the database + pokemon table and loads data/Pokemon.csv.
// Usage: node --env-file=.env.local scripts/setup-db.mjs
import fs from 'node:fs';
import mysql from 'mysql2/promise';

const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, DB_SSL } = process.env;

const conn = await mysql.createConnection({
  host: DB_HOST,
  port: Number(DB_PORT || 3306),
  user: DB_USER,
  password: DB_PASSWORD,
  ssl: DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  connectTimeout: 15000,
});

await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
await conn.query(`USE \`${DB_NAME}\``);
await conn.query(`
  CREATE TABLE IF NOT EXISTS pokemon (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type1 VARCHAR(20) NOT NULL,
    type2 VARCHAR(20),
    total INT,
    hp INT NOT NULL DEFAULT 0,
    attack INT NOT NULL DEFAULT 0,
    defense INT NOT NULL DEFAULT 0,
    sp_attack INT NOT NULL DEFAULT 0,
    sp_defense INT NOT NULL DEFAULT 0,
    speed INT NOT NULL DEFAULT 0,
    generation INT
  )
`);

// CSV has no header: id,name,type1,type2,total,hp,attack,defense,sp_attack,sp_defense,speed,generation
const rows = fs
  .readFileSync(new URL('../data/Pokemon.csv', import.meta.url), 'utf8')
  .trim()
  .split(/\r?\n/)
  .map((line) => line.split(','))
  .map(([id, name, type1, type2, ...nums]) => [Number(id), name, type1, type2 || null, ...nums.map(Number)]);

await conn.query(
  `INSERT INTO pokemon (id, name, type1, type2, total, hp, attack, defense, sp_attack, sp_defense, speed, generation)
   VALUES ? ON DUPLICATE KEY UPDATE name = VALUES(name)`,
  [rows]
);

const [[{ count }]] = await conn.query('SELECT COUNT(*) AS count FROM pokemon');
console.log(`Done: ${count} pokemon in ${DB_NAME}.pokemon`);
await conn.end();
