import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import AppError from "../../utils/AppError";

// 1. Interfaz para el objeto de schemas
export interface ValidateSchemaInput {
  body?: z.ZodObject<any>;
  params?: z.ZodObject<any>;
  query?: z.ZodObject<any>;
}

/**
 * Middleware de validación avanzado que valida 'body', 'params' y/o 'query'
 * basado en los schemas de Zod proporcionados.
 */
export const validate =
  (schemas: ValidateSchemaInput) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 2. Validar cada parte si el schema existe
      if (schemas.params) {
        // Usamos 'as any' para sobreescribir el tipo estricto de Express
        req.params = (await schemas.params.parseAsync(req.params)) as any;
      }
      if (schemas.body) {
        // req.body suele ser 'any', por lo que no siempre da error,
        // pero parsearlo es lo correcto.
        req.body = await schemas.body.parseAsync(req.body);
      }
      if (schemas.query) {
        // Usamos 'as any' para sobreescribir el tipo estricto de Express
        req.query = (await schemas.query.parseAsync(req.query)) as any;
      }

      // 3. Si todo es válido, continuar
      next();
    } catch (error) {
      // 4. Si Zod falla, formatear el error
      if (error instanceof ZodError) {
        // Corrección: Zod v3+ usa la propiedad '.issues' en lugar de '.errors'
        const errorMessage = error.issues
          .map((issue) => `${issue.path.join(".")} - ${issue.message}`)
          .join(", ");

        // Pasar al manejador de errores global
        return next(new AppError(`Validación fallida: ${errorMessage}`, 400));
      }

      // 5. Pasar cualquier otro error
      next(error);
    }
  };
