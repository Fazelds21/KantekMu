import { dbPromise } from "@/database/db";
import * as bcrypt from "bcryptjs";
import * as Crypto from "expo-crypto";

const API_URL = "http://192.168.1.14:3000";

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
  email: string;
  password: string;
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
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: data.email,
      password: data.password
    })
  })

  const result = await response.json();

  if (!response.ok){
    throw new Error(result.message)
  }

  return result.user

}

export async function registerUser(data: RegisterData) {
  const username = data.username.trim();
  const email = data.email.trim().toLowerCase();

  if (!username || !email || !data.password) {
    throw new Error("Semua field wajib diisi.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Format email tidak valid.");
  }

  if (data.password.length <= 7) {
    throw new Error("Password minimal 8 karakter.");
  }
  
  const response = await fetch(`${API_URL}/api/auth/register`,{
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userName: username,
      email: email,
      password: data.password,
      role: data.role
    })
  })

  const result = await response.json();

  if (!response.ok){
    throw new Error(result.message);
  }

  return result.message;

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
