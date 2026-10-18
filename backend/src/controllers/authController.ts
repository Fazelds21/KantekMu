import { Request, Response } from "express";
import { registerUser } from "../services/authService.js";

export async function register(req: Request, res: Response) {
  try {
    const { userName, email, password, role } = req.body;
    const user = await registerUser(userName, email, password, role);

    return res.status(201).json({
      message: "Registrasi berhasil.",
      user,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Email sudah terdaftar.") {
        return res.status(409).json({
          message: error.message,
        });
      }

      if (
        error.message === "Username wajib diisi." ||
        error.message === "Email wajib diisi." ||
        error.message === "Password wajib diisi."
      ) {
        return res.status(400).json({
            message: error.message
        });
      }

      
    }

    return res.status(500).json({
        message: "Terjadi kesalahan pada server."
    });
  }
}
