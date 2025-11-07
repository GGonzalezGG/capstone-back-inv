import { z } from "zod";
import { RequestStatus } from "@prisma/client"; // Importa el Enum de Prisma

// Schema para una línea de item individual
const requestItemSchema = z.object({
  itemId: z.string().cuid("El ID del insumo no es válido"),
  quantity: z
    .number()
    .int()
    .positive("La cantidad debe ser un número positivo"),
});

// Schema para crear una nueva petición (lo que envía el RequestForm)
export const createRequestSchema = z.object({
  patientId: z.string().cuid("El ID del paciente no es válido"),
  items: z
    .array(requestItemSchema)
    .min(1, "La petición debe tener al menos un insumo"),
});
export type CreateRequestDto = z.infer<typeof createRequestSchema>;

// Schema para actualizar el estado de una petición
export const updateRequestStatusSchema = z.object({
  status: z.nativeEnum(RequestStatus, {
    message:
      "El estado no es válido (debe ser PENDING, APPROVED, REJECTED, o COMPLETED)",
  }),
});
export type UpdateRequestStatusDto = z.infer<typeof updateRequestStatusSchema>;

// Schema para los parámetros de ruta (ej: /requests/:id)
export const requestIdParamSchema = z.object({
  id: z.string().cuid("El ID de la petición no es válido"),
});
export type RequestIdParamDto = z.infer<typeof requestIdParamSchema>;
