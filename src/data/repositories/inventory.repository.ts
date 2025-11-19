import { PrismaClient, Item } from "@prisma/client";
import { CreateItemDto, UpdateItemDto } from "../../schemas/Inventory.schema";

export class InventoryRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createItem(data: CreateItemDto): Promise<Item> {
    return this.prisma.item.create({
      data: {
        ...data,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
      },
    });
  }

  async findItemById(id: string): Promise<Item | null> {
    return this.prisma.item.findUnique({
      where: { id },
    });
  }

  async findItemByName(name: string): Promise<Item | null> {
    return this.prisma.item.findUnique({
      where: { name },
    });
  }

  async getAllItems(): Promise<Item[]> {
    return this.prisma.item.findMany({
      where: { isActive: true }, // Por defecto, solo trae items activos
      orderBy: { name: "asc" },
    });
  }

  async updateItem(id: string, data: UpdateItemDto): Promise<Item> {
    return this.prisma.item.update({
      where: { id },
      data: {
        ...data,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
        description: data.description ?? undefined,
      },
    });
  }

  // Borrado Lógico (Soft Delete)
  // En lugar de borrar, marcamos el item como inactivo.
  async softDeleteItem(id: string): Promise<Item> {
    return this.prisma.item.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getLowStockCount(): Promise<number> {
    return this.prisma.item.count({
      where: {
        isActive: true,
        // Compara la cantidad en stock con el campo 'lowStockThreshold'
        quantityInStock: {
          lt: this.prisma.item.fields.lowStockThreshold,
        },
      },
    });
  }

  async getExpiringSoonCount(): Promise<number> {
    const now = new Date();
    const oneWeekLater = new Date();
    oneWeekLater.setDate(now.getDate() + 7);

    return this.prisma.item.count({
      where: {
        isActive: true,
        quantityInStock: { gt: 0 }, // Solo contar si hay stock físico
        expiryDate: {
          gte: now,        // Mayor o igual a hoy (no vencidos aún)
          lte: oneWeekLater // Menor o igual a una semana
        },
      },
    });
  }
}
