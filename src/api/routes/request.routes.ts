import { Router } from "express";
import {
  createRequest,
  updateRequestStatus,
  getRequestById,
  getMyRequests,
  getAllRequests,
} from "../controllers/request.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  createRequestSchema,
  updateRequestStatusSchema,
  requestIdParamSchema,
} from "../../schemas/request.schema";
// Corregido: Importamos 'protect' y 'restrictTo'
import { protect, restrictTo } from "../middlewares/auth.middleware";

const router = Router();

// --- Todas las rutas de peticiones requieren estar logueado ---
router.use(protect);

/**
 * @route   POST /api/v1/requests
 * @desc    Crear una nueva petición (Cualquier rol)
 * @access  Autenticado (NURSE, ADMIN, MANAGER)
 */
router.post("/", validate({ body: createRequestSchema }), createRequest);

/**
 * @route   GET /api/v1/requests/my
 * @desc    Obtener mis peticiones (Cualquier rol)
 * @access  Autenticado
 */
router.get("/my", getMyRequests);

/**
 * @route   GET /api/v1/requests/all
 * @desc    Obtener TODAS las peticiones (Solo Admin/Manager)
 * @access  Protegido (ADMIN, MANAGER)
 */
router.get("/all", restrictTo("ADMIN", "MANAGER"), getAllRequests);

/**
 * @route   GET /api/v1/requests/:id
 * @desc    Obtener una petición por ID (Cualquier rol)
 * @access  Autenticado (Se podría añadir lógica en el servicio para que
 * la enfermera solo vea la suya, pero por ahora está abierto)
 */
router.get("/:id", validate({ params: requestIdParamSchema }), getRequestById);

/**
 * @route   PUT /api/v1/requests/:id/status
 * @desc    Actualizar el estado (Aprobar, Rechazar, Completar)
 * @access  Protegido (ADMIN, MANAGER)
 */
router.put(
  "/:id/status",
  restrictTo("ADMIN", "MANAGER"),
  validate({ params: requestIdParamSchema, body: updateRequestStatusSchema }),
  updateRequestStatus
);

export default router;
