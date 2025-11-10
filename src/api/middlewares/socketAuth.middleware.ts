
import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import AppError from "../../utils/AppError";

// Este es el tipo de lo que esperamos que 'decoded' contenga
export interface SocketUser {
  id: string;
  role: Role;
}

// Definimos un tipo para el Socket "autenticado"
export interface AuthSocket extends Socket {
  user?: SocketUser;
}

/**
 * Middleware de Socket.IO para verificar el JWT.
 * Se ejecuta una vez, cuando el cliente intenta conectarse.
 */
export const socketAuth = (socket: AuthSocket, next: (err?: Error) => void) => {
  // Obtenemos el token de la data de autenticación del socket
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new AppError("No autorizado, no hay token.", 401));
  }

  try {
    const jwtSecret = process.env.JWT_SECRET!;
    
    // Verificamos el token
    const decoded = jwt.verify(token, jwtSecret) as SocketUser;

    // ¡Importante! Añadimos el 'user' al objeto 'socket'
    // para que podamos usarlo en el evento 'connection'.
    socket.user = decoded;

    next(); // Autenticación exitosa
  } catch (error) {
    return next(new AppError("Token no es válido.", 401));
  }
};