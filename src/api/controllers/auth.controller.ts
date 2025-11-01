import { Request, Response, NextFunction } from "express";
import { AuthService } from "../../core/services/auth.service";

// Instanciamos el servicio una vez
const authService = new AuthService();

/**
 * Controlador para el registro de usuarios.
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Validar datos de entrada (opcional, si no se usa middleware)
    // const validatedData = registerSchema.parse(req.body);

    // 2. Llamar al servicio
    const user = await authService.register(req.body);

    // 3. Enviar respuesta exitosa
    // (Omitimos la contraseña en la respuesta)
    const { password, ...userWithoutPassword } = user;
    res.status(201).json({
      status: "success",
      data: {
        user: userWithoutPassword,
      },
    });
  } catch (error) {
    // 4. SI HAY UN ERROR, pasarlo al siguiente middleware (globalErrorHandler)
    next(error);
  }
};

/**
 * Controlador para el inicio de sesión de usuarios.
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Validar datos de entrada (opcional, si no se usa middleware)
    // const validatedData = loginSchema.parse(req.body);

    // 2. Llamar al servicio de login
    const { token } = await authService.login(req.body);

    // 3. Enviar respuesta exitosa con el token
    res.status(200).json({
      status: "success",
      token,
    });
  } catch (error) {
    // 4. SI HAY UN ERROR (ej. AppError), pasarlo al globalErrorHandler
    next(error);
  }
};
