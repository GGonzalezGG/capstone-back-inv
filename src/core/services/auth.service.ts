import { Role, User } from "@prisma/client";
import { UserRepository } from "../../data/repositories/user.repository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AppError from "../../utils/AppError";

export class AuthService {
  private userRepository: UserRepository;
  private jwtSecret: string;

  constructor() {
    this.userRepository = new UserRepository();
    // Leer el secreto desde las variables de entorno
    this.jwtSecret = process.env.JWT_SECRET || "fallback_secret";
    if (this.jwtSecret === "fallback_secret") {
      console.warn("ADVERTENCIA: JWT_SECRET no está configurado en .env");
    }
  }

  async register(data: {
    name: string;
    email: string;
    password: string;
    role?: Role;
  }): Promise<User> {
    // 1. Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findUserByEmail(data.email);
    if (existingUser) {
      throw new AppError("El correo electrónico ya está registrado.", 400);
    }

    // 2. Hashear la contraseña
    const passwordHash = await bcrypt.hash(data.password, 10);

    // 3. Crear el usuario
    return this.userRepository.createUser({
      name: data.name,
      email: data.email,
      passwordHash: passwordHash,
      role: data.role,
    });
  }

  async login(data: {
    email: string;
    password: string;
  }): Promise<{ token: string }> {
    // 1. Encontrar al usuario
    const user = await this.userRepository.findUserByEmail(data.email);
    if (!user) {
      throw new AppError("Credenciales inválidas.", 401);
    }

    // 2. Verificar si la cuenta está activa
    if (!user.isActive) {
      throw new AppError("Esta cuenta ha sido desactivada.", 403);
    }

    // 3. Comparar contraseñas
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Credenciales inválidas.", 401);
    }

    // 4. Firmar el Token JWT
    const tokenPayload = {
      id: user.id,
      role: user.role,
    };

    const token = jwt.sign(tokenPayload, this.jwtSecret, {
      expiresIn: "7d", // El token expira en 7 días
    });

    return { token };
  }
}
