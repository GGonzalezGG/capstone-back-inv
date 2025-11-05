import { Request, Response, NextFunction } from "express";
import { InventoryService } from "../../core/services/inventory.service";

const inventoryService = new InventoryService();

export const createItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await inventoryService.create(req.body);
    res.status(201).json({ status: "success", data: item });
  } catch (error) {
    next(error);
  }
};

export const getAllItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const items = await inventoryService.getAll();
    res.status(200).json({ status: "success", data: items });
  } catch (error) {
    next(error);
  }
};

export const getItemById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await inventoryService.getById(req.params.id);
    res.status(200).json({ status: "success", data: item });
  } catch (error) {
    next(error);
  }
};

export const updateItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await inventoryService.update(req.params.id, req.body);
    res.status(200).json({ status: "success", data: item });
  } catch (error) {
    next(error);
  }
};

export const deleteItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await inventoryService.delete(req.params.id);
    res.status(204).json({ status: "success", data: null });
  } catch (error) {
    next(error);
  }
};
