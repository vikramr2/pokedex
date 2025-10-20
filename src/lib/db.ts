import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (!pool) {
    const required = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'] as const;
    for (const key of required) {
      if (!process.env[key]) {
        throw new Error(`Missing required env: ${key}`);
      }
    }

    const ssl = (process.env.DB_SSL === 'true') || process.env.DB_SERVER_CA || process.env.DB_CLIENT_CERT || process.env.DB_CLIENT_KEY
      ? {
          ca: process.env.DB_SERVER_CA,
          cert: process.env.DB_CLIENT_CERT,
          key: process.env.DB_CLIENT_KEY,
          // default true; allow opt-out via DB_SSL_REJECT_UNAUTHORIZED=false
          rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'false' ? false : true,
        }
      : undefined;

    console.log('Database config:', {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD ? '***' : 'undefined',
      ssl: ssl ? {
        enabled: true,
        ca: Boolean(ssl.ca),
        cert: Boolean(ssl.cert),
        key: Boolean(ssl.key),
        rejectUnauthorized: ssl.rejectUnauthorized,
      } : { enabled: false }
    });

    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      database: process.env.DB_NAME || 'pokemon_db',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
      ssl
    });
  }
  return pool;
}

export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const pool = getPool();
  const [rows] = await pool.query(text, params);
  return rows as T[];
}
