import { Request, Response, NextFunction } from "express";
import AppError from "../../utils/AppError";

/**
 * Middleware para verificar si el usuario tiene rol de 'ADMIN' o 'MANAGER'.
 * Debe usarse SIEMPRE DESPUÉS del middleware 'auth'.
 */
export const adminAuth = (
  req: Request, // Usamos el tipo extendido
  res: Response,
  next: NextFunction
) => {
  // Verificamos si el usuario existe en la request (adjuntado por el middleware 'auth')
  if (!req.user) {
    return next(
      new AppError("No autorizado. Usuario no encontrado en la petición.", 401)
    );
  }

  const { role } = req.user;

  // Verificamos si el rol es el permitido
  if (role === "ADMIN" || role === "MANAGER") {
    // Si el rol es correcto, permitimos que continúe
    next();
  } else {
    // Si no tiene el rol, devolvemos un error de "Prohibido"
    return next(
      new AppError("No tienes permiso para realizar esta acción.", 403)
    );
  }
};
