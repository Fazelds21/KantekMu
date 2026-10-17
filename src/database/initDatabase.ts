
import { dbPromise } from "./db";

export async function initDatabase(): Promise<void> {
  const db = await dbPromise;

  // Mengaktifkan foreign key pada koneksi database ini
  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    -- 1. Tabel users: akun owner dan customer
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL
        CHECK (role IN ('owner', 'customer'))
    );

    -- 2. Tabel stalls: data warung
    CREATE TABLE IF NOT EXISTS stalls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_id INTEGER NOT NULL,
      name TEXT NOT NULL,

      FOREIGN KEY (owner_id)
        REFERENCES users(id)
    );

    -- 3. Tabel menu_items: menu setiap warung
    CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stall_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      price INTEGER NOT NULL CHECK (price >= 0),
      image_uri TEXT,
      is_available INTEGER NOT NULL DEFAULT 1
        CHECK (is_available IN (0, 1)),

      FOREIGN KEY (stall_id)
        REFERENCES stalls(id)
    );

    -- 4. Tabel tables: nomor meja dan identitas QR
    CREATE TABLE IF NOT EXISTS tables (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      table_number INTEGER NOT NULL UNIQUE,
      qr_identifier TEXT NOT NULL UNIQUE,
      is_active INTEGER NOT NULL DEFAULT 1
        CHECK (is_active IN (0, 1))
    );

    -- 5. Tabel orders: transaksi pesanan
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      table_id INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      status TEXT NOT NULL DEFAULT 'pending'
        CHECK (
          status IN (
            'pending',
            'preparing',
            'delivered',
            'cancelled'
          )
        ),

      FOREIGN KEY (user_id)
        REFERENCES users(id),

      FOREIGN KEY (table_id)
        REFERENCES tables(id)
    );

    -- 6. Tabel order_items: rincian menu pesanan
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      menu_item_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL CHECK (quantity > 0),
      unit_price INTEGER NOT NULL CHECK (unit_price >= 0),
      notes TEXT,
      status TEXT NOT NULL DEFAULT 'pending'
        CHECK (
          status IN (
            'pending',
            'preparing',
            'delivered',
            'cancelled'
          )
        ),

      FOREIGN KEY (order_id)
        REFERENCES orders(id),

      FOREIGN KEY (menu_item_id)
        REFERENCES menu_items(id)
    );

    -- 7. Tabel payments: pembayaran QRIS
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL UNIQUE,
      method TEXT NOT NULL DEFAULT 'qris',
      status TEXT NOT NULL DEFAULT 'pending'
        CHECK (
          status IN (
            'pending',
            'paid',
            'failed',
            'refunded'
          )
        ),
      amount INTEGER NOT NULL CHECK (amount >= 0),
      provider_reference TEXT,
      paid_at TEXT,

      FOREIGN KEY (order_id)
        REFERENCES orders(id)
    );
  `);

  console.log("Database KantekMu berhasil disiapkan.");
}

