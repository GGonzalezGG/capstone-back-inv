import { Request, Response, NextFunction } from "express";
import { UserService } from "../../core/services/user.service";

const userService = new UserService();

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await userService.getAll();
    res.status(200).json({ status: "success", data: users });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.getById(req.params.id);
    res.status(200).json({ status: "success", data: user });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.update(req.params.id, req.body);
    res.status(200).json({ status: "success", data: user });
  } catch (error) {
    next(error);
  }
};

export const deactivateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await userService.deactivate(req.params.id);
    res.status(204).json({ status: "success", data: null });
  } catch (error) {
    next(error);
  }
};

export const reactivateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.reactivate(req.params.id);
    res.status(200).json({ status: "success", data: user });
  } catch (error) {
    next(error);
  }
};
