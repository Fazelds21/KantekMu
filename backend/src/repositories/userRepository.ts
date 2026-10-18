import { pool } from "../config/database.js";

export async function createUser(
  userName: string,
  email: string,
  passwordHash: string,
  role: "owner" | "customer",
) {
  const result = await pool.query(
    `INSERT INTO public.users(username, email, password_hash, role) 
    VALUES ($1, $2, $3, $4) 
    RETURNING id, username, email, role`,
    [userName, email, passwordHash, role]
  );

  return result.rows[0]
}

export async function findUserByEmail(email: string) {
    const result = await pool.query(
        `SELECT id, username, email, role
        FROM public.users
        WHERE email = $1
        LIMIT 1`, [email]
    )

    return result.rows[0]
}
