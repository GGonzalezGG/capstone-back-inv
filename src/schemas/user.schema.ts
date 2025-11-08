import { z } from "zod";
import { Role } from "@prisma/client";

// Schema para los parámetros de ruta (ej: /users/:id)
export const userIdParamSchema = z.object({
  id: z.string().cuid("El ID de usuario no es válido"),
});

// Schema para actualizar un usuario (solo MANAGER puede hacer esto)
// Hacemos todos los campos opcionales
export const updateUserSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .optional(),
  email: z.string().email("Email no válido").optional(),
  role: z
    .nativeEnum(Role, {
      message: "Rol no válido (debe ser NURSE, ADMIN, o MANAGER)",
    })
    .optional(),
  isActive: z.boolean().optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
