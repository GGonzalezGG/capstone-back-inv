import { z } from "zod";

// Schema para el registro
export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    email: z.string().email("Email no válido"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    role: z.enum(["NURSE", "ADMIN", "MANAGER"]).optional(), // Opcional, el default se encarga
  }),
});

// Schema para el login
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Email no válido"),
    password: z.string().min(1, "La contraseña es requerida"),
  }),
});
