import { Request, Response, NextFunction } from "express";
import AppError from "../../utils/AppError";

/**
 * Middleware de manejo de errores global.
 * Express sabe que es un middleware de error porque tiene 4 argumentos.
 */
export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let status = "error";
  let message = "Algo salió mal en el servidor.";

  // Si el error es una instancia de nuestro AppError, usamos sus propiedades
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    status = err.status;
    message = err.message;

    // Logueamos los errores operacionales como advertencias
    console.warn(`[AppError ${statusCode}]: ${message}`);
  } else {
    // Si es un error desconocido (un bug), lo logueamos como un error grave
    console.error("[UNHANDLED_ERROR]:", err);
  }

  // Enviamos la respuesta JSON final al cliente
  res.status(statusCode).json({
    status,
    message,
  });
};
