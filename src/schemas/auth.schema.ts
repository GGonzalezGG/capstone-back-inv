import { z } from "zod";
import { Role } from "@prisma/client";

// 1. Define el schema de 'body' para el registro
// Usamos .min(1) para asegurar que el string no esté vacío
export const registerSchema = z.object({
  name: z.string().min(1, {
    message: "El nombre es obligatorio.",
  }),
  email: z
    .string()
    .email({
      message: "Email no válido.",
    })
    .min(1, {
      message: "El email es obligatorio.",
    }),
  password: z
    .string()
    .min(1, {
      message: "La contraseña es obligatoria.",
    })
    .min(6, {
      message: "La contraseña debe tener al menos 6 caracteres.",
    }),
  role: z.nativeEnum(Role).optional(),
});

// 2. Define el schema de 'body' para el login
export const loginSchema = z.object({
  email: z
    .string()
    .email({
      message: "Email no válido.",
    })
    .min(1, {
      message: "El email es obligatorio.",
    }),
  password: z.string().min(1, {
    message: "La contraseña es obligatoria.",
  }),
});

// 3. Exportamos los tipos (opcional pero buena práctica)
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
