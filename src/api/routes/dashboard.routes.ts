import { Router } from "express";
import { getDashboardSummary } from "../controllers/dashboard.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.use(protect);

/**
 * @route   GET /api/v1/dashboard
 * @desc    Obtener todos los datos agregados para el dashboard
 * @access  Autenticado (Todos los roles)
 */
router.get("/", getDashboardSummary);

export default router;
