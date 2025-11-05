import { Router } from "express";
import {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
} from "../controllers/inventory.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  createItemSchema,
  itemIdParamSchema,
  updateItemSchema,
} from "../../schemas/Inventory.schema";
import { protect } from "../middlewares/auth.middleware";
import { adminAuth } from "../middlewares/adminAuth.middleware";

const router = Router();

// --- Definición de Rutas ---

/**
 * @route   GET /api/v1/inventory
 * @desc    Obtener todos los insumos (activos)
 * @access  Autenticado (Todos los roles)
 */
router.get("/", protect, getAllItems);

/**
 * @route   GET /api/v1/inventory/:id
 * @desc    Obtener un insumo por ID
 * @access  Autenticado (Todos los roles)
 */
router.get(
  "/:id",
  protect,
  validate({ params: itemIdParamSchema }),
  getItemById
);

/**
 * @route   POST /api/v1/inventory
 * @desc    Crear un nuevo insumo
 * @access  Protegido (Solo ADMIN y MANAGER)
 */
router.post(
  "/",
  protect, // 1. Verifica que esté logueado
  adminAuth, // 2. Verifica que sea ADMIN o MANAGER
  validate({ body: createItemSchema }), // 3. Valida los datos
  createItem
);

/**
 * @route   PUT /api/v1/inventory/:id
 * @desc    Actualizar un insumo
 * @access  Protegido (Solo ADMIN y MANAGER)
 */
router.put(
  "/:id",
  protect,
  adminAuth,
  validate({ params: itemIdParamSchema, body: updateItemSchema }),
  updateItem
);

/**
 * @route   DELETE /api/v1/inventory/:id
 * @desc    Desactivar un insumo (Soft Delete)
 * @access  Protegido (Solo ADMIN y MANAGER)
 */
router.delete(
  "/:id",
  protect,
  adminAuth,
  validate({ params: itemIdParamSchema }),
  deleteItem
);

export default router;
