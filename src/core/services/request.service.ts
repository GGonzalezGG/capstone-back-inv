import { Request, RequestStatus } from "@prisma/client";
import { RequestRepository } from "../../data/repositories/request.repository";
import { InventoryRepository } from "../../data/repositories/inventory.repository";
import { CreateRequestDto } from "../../schemas/request.schema";
import AppError from "../../utils/AppError";

export class RequestService {
  private requestRepository: RequestRepository;
  private inventoryRepository: InventoryRepository;

  constructor() {
    this.requestRepository = new RequestRepository();
    // ¡Necesitamos el repositorio de inventario para verificar el stock!
    this.inventoryRepository = new InventoryRepository();
  }

  /**
   * Lógica de negocio para crear una nueva petición.
   */
  async create(data: CreateRequestDto, requesterId: string): Promise<Request> {
    // 1. Verificar que el paciente exista (si es necesario, aunque el FK lo hará)

    // 2. Lógica de negocio: Verificar el stock ANTES de crear.
    for (const item of data.items) {
      const stockItem = await this.inventoryRepository.findItemById(
        item.itemId
      );
      if (!stockItem) {
        throw new AppError(`El insumo con ID ${item.itemId} no existe.`, 404);
      }
      if (stockItem.quantityInStock < item.quantity) {
        throw new AppError(
          `Stock insuficiente para '${stockItem.name}'. Solicitado: ${item.quantity}, Disponible: ${stockItem.quantityInStock}`,
          400
        );
      }
    }

    // 3. Si todo el stock está bien, crear la petición
    return this.requestRepository.createRequest(data, requesterId);
  }

  /**
   * Lógica de negocio para actualizar el estado de una petición.
   */
  async updateStatus(id: string, status: RequestStatus): Promise<Request> {
    // 1. Obtener la petición y sus detalles
    const request = await this.requestRepository.findRequestById(id);
    if (!request) {
      throw new AppError("Petición no encontrada.", 404);
    }

    if (request.status === "COMPLETED" || request.status === "REJECTED") {
      throw new AppError(
        `La petición ya fue ${request.status} y no puede ser modificada.`,
        400
      );
    }

    // 2. Lógica de negocio CRÍTICA: Descontar stock al completar
    if (status === "COMPLETED") {
      // Usamos un bucle for...of (que permite 'await')
      for (const line of request.requestLines) {
        const currentStock = line.item.quantityInStock;
        const requestedQuantity = line.quantity;

        if (currentStock < requestedQuantity) {
          throw new AppError(
            `Stock insuficiente para '${line.item.name}' al momento de completar. Stock actual: ${currentStock}.`,
            400
          );
        }

        // Actualizar el stock del insumo
        await this.inventoryRepository.updateItem(line.itemId, {
          quantityInStock: currentStock - requestedQuantity,
        });
      }
    }

    // 3. Actualizar el estado de la petición
    return this.requestRepository.updateRequestStatus(id, status);
  }

  async getById(id: string): Promise<Request> {
    const request = await this.requestRepository.findRequestById(id);
    if (!request) {
      throw new AppError("Petición no encontrada.", 404);
    }
    return request;
  }

  async getMyRequests(userId: string) {
    return this.requestRepository.findRequestsByUserId(userId);
  }

  async getAllRequests() {
    return this.requestRepository.findAllRequests();
  }
}
