import { Router } from "express";
import {
  createPatient,
  getAllActivePatients,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  reactivatePatient,
} from "../controllers/patient.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  createPatientSchema,
  updatePatientSchema,
  patientIdParamSchema,
} from "../../schemas/patient.schema";
import { protect, restrictTo } from "../middlewares/auth.middleware";

const router = Router();

// --- Todas las rutas de pacientes requieren estar logueado ---
router.use(protect);

/**
 * @route   GET /api/v1/patients
 * @desc    Obtener todos los pacientes ACTIVOS (para enfermeras)
 * @access  Autenticado (Todos los roles)
 */
router.get("/", getAllActivePatients);

/**
 * @route   GET /api/v1/patients/all
 * @desc    Obtener TODOS los pacientes (activos e inactivos, para admins)
 * @access  Protegido (ADMIN, MANAGER)
 */
router.get("/all", restrictTo("ADMIN", "MANAGER"), getAllPatients);

/**
 * @route   POST /api/v1/patients
 * @desc    Crear un nuevo paciente
 * @access  Protegido (Solo ADMIN y MANAGER)
 */
router.post(
  "/",
  restrictTo("ADMIN", "MANAGER"),
  validate({ body: createPatientSchema }),
  createPatient
);

/**
 * @route   GET /api/v1/patients/:id
 * @desc    Obtener un paciente por ID
 * @access  Autenticado (Todos los roles)
 */
router.get("/:id", validate({ params: patientIdParamSchema }), getPatientById);

/**
 * @route   PUT /api/v1/patients/:id
 * @desc    Actualizar un paciente (incluye desactivar)
 * @access  Protegido (Solo ADMIN y MANAGER)
 */
router.put(
  "/:id",
  restrictTo("ADMIN", "MANAGER"),
  validate({ params: patientIdParamSchema, body: updatePatientSchema }),
  updatePatient
);
/**
 * @route   PUT /api/v1/:id/reactivate
 * @desc    Volver a activar un paciente borrado lógicamente
 * @access  Protegido (Solo ADMIN y MANAGER)
 */
router.put(
  "/:id/reactivate",
  restrictTo("ADMIN", "MANAGER"),
  validate({ params: patientIdParamSchema }),
  reactivatePatient
);

/**
 * @route   DELETE /api/v1/patients/:id
 * @desc    Desactivar un paciente (Soft Delete)
 * @access  Protegido (Solo ADMIN y MANAGER)
 */
router.delete(
  "/:id",
  restrictTo("ADMIN", "MANAGER"),
  validate({ params: patientIdParamSchema }),
  deletePatient
);

export default router;
