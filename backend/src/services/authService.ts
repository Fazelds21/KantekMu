import bcrypt from "bcryptjs";
import { createUser, findUserByEmail } from "../repositories/userRepository.js";

export async  function registerUser(
  userName: string,
  email: string,
  password: string,
  role: "owner" | "customer",
) {

    if (!userName.trim()){
        throw new Error("Username wajib diisi.")
    }
    if (!email.trim()){
        throw new Error("Email wajib diisi.")
    }
    if (!password.trim()){
        throw new Error("Password wajib diisi.")
    }

    const existingUser = await findUserByEmail(email)
    if (existingUser){
        throw new Error("Email sudah terdaftar.")
    }

    const passwordHash = await bcrypt.hash(password, 10)

    return createUser(userName, email, passwordHash, role)
}

export async function loginUser(email: string, password: string){
    const existingUser = await findUserByEmail(email);
    if (!existingUser){
        throw new Error("Email atau password salah.");
    } 
    
    const passwordIsValid = await bcrypt.compare(password, existingUser.password_hash);
    if (!passwordIsValid){
        throw new Error("Email atau password salah.")}

    return {
            id: existingUser.id,
            username: existingUser.username,
            email: existingUser.email,
            role: existingUser.role}
}