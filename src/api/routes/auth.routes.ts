import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import { loginSchema, registerSchema } from "../../schemas/auth.schema";
import { protect } from "../middlewares/auth.middleware"; // Asegúrate de importar 'protect'

const router = Router();

// POST /api/v1/auth/register
router.post("/register", validate({ body: registerSchema }), register);

// POST /api/v1/auth/login
router.post("/login", validate({ body: loginSchema }), login);

// RUTA DE PRUEBA:
router.get("/me", protect, (req, res) => {
  res.status(200).json({
    status: "success",
    user: req.user, // req.user es añadido por el middleware 'protect'
  });
});

export default router;
