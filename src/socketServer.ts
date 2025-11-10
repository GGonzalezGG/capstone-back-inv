import { Server } from "socket.io";
import { AuthSocket, socketAuth } from "./api/middlewares/socketAuth.middleware";

export const initSocketServer = (io: Server) => {
  // Aplicamos el middleware de autenticación a todas las conexiones entrantes
  io.use(socketAuth);

  // Lógica principal de conexión
  io.on("connection", (socket: AuthSocket) => {
    console.log(`Socket conectado: ${socket.id}`);

    // El 'socket.user' fue añadido por nuestro middleware 'socketAuth'
    const user = socket.user;

    if (!user) {
      // Por si acaso, aunque el middleware debería atrapar esto
      socket.disconnect();
      return;
    }

    // --- LÓGICA DE SALAS (ROOMS) ---
    // Unimos a los 'ADMIN' y 'MANAGER' a una sala especial
    // para que solo ellos reciban notificaciones del sistema.
    if (user.role === "ADMIN" || user.role === "MANAGER") {
      console.log(`Usuario ${user.id} (${user.role}) se unió a ADMIN_ROOM`);
      socket.join("ADMIN_ROOM");
    }

    // Unimos a cada usuario a su propia sala personal
    // (Útil si quisieras enviar notificaciones a un usuario específico)
    socket.join(user.id);

    socket.on("disconnect", () => {
      console.log(`Socket desconectado: ${socket.id}`);
    });
  });
};