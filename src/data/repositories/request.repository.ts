import { PrismaClient, Request, RequestStatus } from "@prisma/client";
import { CreateRequestDto } from "../../schemas/request.schema";

const prisma = new PrismaClient();

export class RequestRepository {
  /**
   * Crea una nueva petición y sus líneas de detalle DENTRO de una transacción.
   * Esto asegura que si falla la creación de una línea, toda la petición se revierte.
   */
  async createRequest(
    data: CreateRequestDto,
    requesterId: string
  ): Promise<Request> {
    const { patientId, items } = data;

    // Usamos una transacción interactiva para asegurar la integridad
    return prisma.$transaction(async (tx) => {
      // 1. Crear la Petición (Request) principal
      const newRequest = await tx.request.create({
        data: {
          requesterId,
          patientId,
          status: "PENDING",
        },
      });

      // 2. Crear las Líneas de Petición (RequestLine)
      await tx.requestLine.createMany({
        data: items.map((item) => ({
          requestId: newRequest.id,
          itemId: item.itemId,
          quantity: item.quantity,
        })),
      });

      return newRequest;
    });
  }

  /**
   * Actualiza el estado de una petición.
   */
  async updateRequestStatus(
    id: string,
    status: RequestStatus
  ): Promise<Request> {
    return prisma.request.update({
      where: { id },
      data: {
        status,
        // Si el estado es 'COMPLETED', guardamos la fecha de retiro
        completedAt: status === "COMPLETED" ? new Date() : undefined,
      },
    });
  }

  async findRequestById(id: string) {
    return prisma.request.findUnique({
      where: { id },
      include: {
        requestLines: {
          include: {
            item: true, // Incluye los detalles del insumo
          },
        },
        patient: true, // Incluye los detalles del paciente
        requester: true, // Incluye los detalles de la enfermera
      },
    });
  }

  async findRequestsByUserId(userId: string) {
    return prisma.request.findMany({
      where: { requesterId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        patient: true,
        requester: true,
        requestLines: { include: { item: true } },
      },
    });
  }

  async findAllRequests() {
    return prisma.request.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        patient: true,
        requester: true,
        requestLines: { include: { item: true } },
      },
    });
  }
}
