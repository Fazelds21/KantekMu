import { dbPromise } from "@/database/db";
import * as bcrypt from "bcryptjs";
import * as Crypto from "expo-crypto";

bcrypt.setRandomFallback((byteCount) =>
  Array.from(Crypto.getRandomBytes(byteCount)),
);

export type RegisterData = {
  username: string;
  email: string;
  password: string;
  role: "owner" | "customer";
};

export type LoginData = {
  identifier: string;
  password: string;
  role: "owner" | "customer";
};

type UserRow = {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  role: "owner" | "customer";
};

export type AuthenticatedUser = {
  id: number;
  username: string;
  email: string;
  role: "owner" | "customer";
  stall?: {
    warungId: string;
    namaWarung: string;
  };
};

export async function loginUser(data: LoginData): Promise<AuthenticatedUser> {
  const db = await dbPromise;
  const identifier = data.identifier.trim();

  if (!identifier || !data.password) {
    throw new Error("Username/email dan password wajib diisi.");
  }

  const users = await db.getAllAsync<UserRow>(
    `SELECT id, username, email, password_hash, role
     FROM users
     WHERE username = ? COLLATE NOCASE OR email = ? COLLATE NOCASE`,
    identifier,
    identifier.toLowerCase(),
  );

  let authenticatedUser: UserRow | undefined;
  for (const user of users) {
    if (await bcrypt.compare(data.password, user.password_hash)) {
      authenticatedUser = user;
      break;
    }
  }

  if (!authenticatedUser) {
    throw new Error("Username/email atau password salah.");
  }

  if (authenticatedUser.role !== data.role) {
    throw new Error(
      `Akun ini terdaftar sebagai ${authenticatedUser.role === "owner" ? "Owner" : "Customer"}. Pilih role yang sesuai.`,
    );
  }

  if (authenticatedUser.role === "owner") {
    const stall = await db.getFirstAsync<{ id: number; name: string }>(
      "SELECT id, name FROM stalls WHERE owner_id = ? ORDER BY id LIMIT 1",
      authenticatedUser.id,
    );

    return {
      id: authenticatedUser.id,
      username: authenticatedUser.username,
      email: authenticatedUser.email,
      role: authenticatedUser.role,
      ...(stall && {
        stall: {
        warungId: String(stall.id),
        namaWarung: stall.name,
        },
      }),
    };
  }

  return {
    id: authenticatedUser.id,
    username: authenticatedUser.username,
    email: authenticatedUser.email,
    role: authenticatedUser.role,
  };
}

export async function registerUser(data: RegisterData) {
  const db = await dbPromise;

  const username = data.username.trim();
  const email = data.email.trim().toLowerCase();

  if (!username || !email || !data.password) {
    throw new Error("Semua field wajib diisi.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Format email tidak valid.");
  }

  if (data.password.length <= 8) {
    throw new Error("Password minimal 8 karakter.");
  }

  const existingUser = await db.getFirstAsync<{ id: number }>(
    "SELECT id FROM users WHERE email = ?",
    email,
  );

  if (existingUser) {
    throw new Error("Email sudah terdaftar.");
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  await db.runAsync(
    `INSERT INTO users (username, email, password_hash, role)
    VALUES (?, ?, ?, ?)`,
    username,
    email,
    passwordHash,
    data.role,
  );

  return { message: "Registrasi berhasil." };
}

export async function createOwnerStall(
  ownerId: number,
  stallName: string,
): Promise<{ warungId: string; namaWarung: string }> {
  const name = stallName.trim();
  if (!name) {
    throw new Error("Nama warung wajib diisi.");
  }

  const db = await dbPromise;
  const owner = await db.getFirstAsync<{ id: number }>(
    "SELECT id FROM users WHERE id = ? AND role = 'owner'",
    ownerId,
  );
  if (!owner) {
    throw new Error("Akun Owner tidak ditemukan. Silakan login kembali.");
  }

  const existingStall = await db.getFirstAsync<{ id: number; name: string }>(
    "SELECT id, name FROM stalls WHERE owner_id = ? ORDER BY id LIMIT 1",
    ownerId,
  );
  if (existingStall) {
    return {
      warungId: String(existingStall.id),
      namaWarung: existingStall.name,
    };
  }

  const result = await db.runAsync(
    "INSERT INTO stalls (owner_id, name) VALUES (?, ?)",
    ownerId,
    name,
  );

  return {
    warungId: String(result.lastInsertRowId),
    namaWarung: name,
  };
}
