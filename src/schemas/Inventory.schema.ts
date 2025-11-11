import { z } from "zod";

// Schema base (campos comunes)
const itemBaseSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z.string().nullable().optional(),
  category: z.string().min(3, "La categoría es obligatoria"),
  quantityInStock: z.number().int().min(0, "La cantidad no puede ser negativa"),
  lowStockThreshold: z
    .number()
    .int()
    .min(0, "El umbral no puede ser negativo")
    .default(10),
  expiryDate: z.string().datetime().optional().nullable(),
  isActive: z.boolean().default(true),
});

// Schema para crear un nuevo item
export const createItemSchema = itemBaseSchema;
export type CreateItemDto = z.infer<typeof createItemSchema>;

// Schema para actualizar un item (todos los campos son opcionales)
export const updateItemSchema = itemBaseSchema.partial();
export type UpdateItemDto = z.infer<typeof updateItemSchema>;

// Schema para los parámetros de ruta (ej: /inventory/:id)
export const itemIdParamSchema = z.object({
  id: z.string().cuid("El ID del insumo no es válido"),
});
export type ItemIdParamDto = z.infer<typeof itemIdParamSchema>;
