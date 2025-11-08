import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deactivateUser,
  reactivateUser,
} from "../controllers/user.controller";
import { validate } from "../middlewares/validate.middleware";
import { updateUserSchema, userIdParamSchema } from "../../schemas/user.schema";
import { protect, restrictTo } from "../middlewares/auth.middleware";

const router = Router();

// --- Aplicamos protección a TODAS las rutas de usuarios ---
// 1. El usuario debe estar logueado (protect)
// 2. El usuario DEBE ser 'MANAGER' (restrictTo)
router.use(protect, restrictTo("ADMIN"));

/**
 * @route   GET /api/v1/users
 * @desc    Obtener lista de todos los usuarios
 * @access  Protegido (Solo ADMIN)
 */
router.get("/", getAllUsers);

/**
 * @route   GET /api/v1/users/:id
 * @desc    Obtener un usuario por ID
 * @access  Protegido (Solo ADMIN)
 */
router.get("/:id", validate({ params: userIdParamSchema }), getUserById);

/**
 * @route   PUT /api/v1/users/:id
 * @desc    Actualizar un usuario (rol, email, nombre, estado)
 * @access  Protegido (Solo ADMIN)
 */
router.put(
  "/:id",
  validate({ params: userIdParamSchema, body: updateUserSchema }),
  updateUser
);

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    Desactivar una cuenta de usuario (Soft Delete)
 * @access  Protegido (Solo ADMIN)
 */
router.delete("/:id", validate({ params: userIdParamSchema }), deactivateUser);

/**
 * @route   PUT /api/v1/users/:id/reactivate
 * @desc    Reactivar una cuenta de usuario
 * @access  Protegido (Solo ADMIN)
 */
router.put(
  "/:id/reactivate",
  validate({ params: userIdParamSchema }),
  reactivateUser
);

export default router;
