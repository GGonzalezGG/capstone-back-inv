import { Item } from "@prisma/client";
import { InventoryRepository } from "../../data/repositories/inventory.repository";
import { CreateItemDto, UpdateItemDto } from "../../schemas/Inventory.schema";
import AppError from "../../utils/AppError";

export class InventoryService {
  private inventoryRepository: InventoryRepository;

  constructor() {
    this.inventoryRepository = new InventoryRepository();
  }

  async create(data: CreateItemDto): Promise<Item> {
    // Regla de negocio: No permitir items con el mismo nombre
    const existingItem = await this.inventoryRepository.findItemByName(
      data.name
    );
    if (existingItem) {
      throw new AppError("Ya existe un insumo con este nombre.", 400);
    }
    return this.inventoryRepository.createItem(data);
  }

  async getAll(): Promise<Item[]> {
    return this.inventoryRepository.getAllItems();
  }

  async getById(id: string): Promise<Item> {
    const item = await this.inventoryRepository.findItemById(id);
    if (!item) {
      throw new AppError("Insumo no encontrado.", 404);
    }
    return item;
  }

  async update(id: string, data: UpdateItemDto): Promise<Item> {
    // Verificar que el item existe
    await this.getById(id);

    // Regla de negocio: Si cambia el nombre, verificar que no exista otro
    if (data.name) {
      const existingItem = await this.inventoryRepository.findItemByName(
        data.name
      );
      // Si existe y NO es el mismo item que estamos editando
      if (existingItem && existingItem.id !== id) {
        throw new AppError("Ya existe otro insumo con este nombre.", 400);
      }
    }
    return this.inventoryRepository.updateItem(id, data);
  }

  async delete(id: string): Promise<Item> {
    // Verificar que el item existe
    await this.getById(id);
    // Usamos borrado lógico
    return this.inventoryRepository.softDeleteItem(id);
  }
}
