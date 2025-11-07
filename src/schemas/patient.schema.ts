import { z } from "zod";

// Schema para crear un nuevo paciente
export const createPatientSchema = z.object({
  name: z.string().min(3, "El nombre es obligatorio"),
  rut: z.string().min(8, "El RUT es obligatorio"),
  // 'isActive' se manejará por defecto en la BD
});
export type CreatePatientDto = z.infer<typeof createPatientSchema>;

// Schema para actualizar un paciente (todos los campos son opcionales)
export const updatePatientSchema = z.object({
  name: z.string().min(3, "El nombre es obligatorio").optional(),
  rut: z.string().min(8, "El RUT es obligatorio").optional(),
  isActive: z.boolean().optional(),
});
export type UpdatePatientDto = z.infer<typeof updatePatientSchema>;

// Schema para los parámetros de ruta (ej: /patients/:id)
export const patientIdParamSchema = z.object({
  id: z.string().cuid("El ID del paciente no es válido"),
});
export type PatientIdParamDto = z.infer<typeof patientIdParamSchema>;
