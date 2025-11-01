/**
 * Clase de error personalizada para manejar errores operacionales (errores esperados de la API).
 * Extiende la clase 'Error' nativa de Node.js.
 */
class AppError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;

  /**
   * Crea una nueva instancia de AppError.
   * @param message El mensaje de error que verá el cliente.
   * @param statusCode El código de estado HTTP (ej. 404, 401, 403).
   */
  constructor(message: string, statusCode: number) {
    // Llama al constructor de la clase base (Error)
    super(message);

    this.statusCode = statusCode;
    // Asigna 'fail' para errores 4xx (cliente) y 'error' para 5xx (servidor)
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    // Marcamos esto como un error "operacional" (confiable, no un bug)
    this.isOperational = true;

    // Captura el stack trace para un mejor debugging, excluyendo este constructor
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
