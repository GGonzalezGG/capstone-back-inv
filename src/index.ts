import express, { Application, Request, Response, NextFunction } from "express";
import "dotenv/config"; // Asegúrate de cargar .env primero
import { globalErrorHandler } from "./api/middlewares/globalErrorHandler.middleware";
import authRoutes from "./api/routes/auth.routes";
import inventoryRoutes from "./api/routes/inventory.routes";
import AppError from "./utils/AppError"; // Importar AppError para el 404
import requestRoutes from "./api/routes/request.routes";
import patientRoutes from "./api/routes/patient.routes";
import dashboardRoutes from "./api/routes/dashboard.routes";
import userRoutes from "./api/routes/user.routes";
import { createServer } from "http"; //imports para websockets
import { Server } from "socket.io";
import { initSocketServer } from "./socketServer"

// (Importa tus otras rutas aquí: inventoryRoutes, requestRoutes)

const app: Application = express();
const port = process.env.PORT || 3001;

const httpServer = createServer(app);
// Exportamos 'io' para que los servicios puedan usarlo
export const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // La URL de tu frontend (React/Next)
    methods: ["GET", "POST"],
  },
});

// Middlewares
app.use(express.json()); // Para parsear JSON
app.use(express.urlencoded({ extended: true }));

// Rutas de la API
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/inventory", inventoryRoutes);
app.use("/api/v1/requests", requestRoutes);
app.use("/api/v1/patients", patientRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/users", userRoutes);

initSocketServer(io);

// --- MANEJO DE RUTAS NO ENCONTRADAS (404) ---
// Esto debe ir DESPUÉS de todas tus rutas exitosas
app.all(/.*/, (req: Request, res: Response, next: NextFunction) => {
  next(
    new AppError(
      `No se puede encontrar ${req.originalUrl} en este servidor.`,
      404
    )
  );
});

// --- MANEJO DE ERRORES GLOBAL ---
// Este middleware DEBE ser el último en registrarse.
// Atrapa todos los errores pasados por next()
app.use(globalErrorHandler);

// Iniciar el servidor
httpServer.listen(port, () => {
  console.log(`Servidor (y Socket.IO) corriendo en http://localhost:${port}`);
});