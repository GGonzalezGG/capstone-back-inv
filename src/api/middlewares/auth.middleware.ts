import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";

// Extendemos el tipo 'Request' de Express para añadir nuestra info del usuario
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: Role;
      };
    }
  }
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1]; // Espera "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: "No autorizado, no hay token." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      role: Role;
    };
    req.user = decoded; // Añadimos el usuario al objeto 'req'
    next();
  } catch (error) {
    res.status(401).json({ message: "Token no es válido." });
  }
};

// Middleware para restringir por rol
export const restrictTo = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para realizar esta acción." });
    }
    next();
  };
};

/*
 * Ejemplo de cómo usarlo en inventory.routes.ts:
 *
 * import { protect, restrictTo } from '../middlewares/auth.middleware.ts';
 *
 * // Esta ruta solo será accesible para ADMINS y MANAGERS que estén logueados
 * router.post(
 * '/',
 * protect,
 * restrictTo('ADMIN', 'MANAGER'),
 * createInventoryItemHandler
 * );
 *
 */
