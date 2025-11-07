import { Request, Response, NextFunction } from "express";
import { RequestService } from "../../core/services/request.service";
import { RequestStatus } from "@prisma/client";

const requestService = new RequestService();

export const createRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // req.user!.id (El '!' es seguro gracias al middleware 'protect')
    const request = await requestService.create(req.body, req.user!.id);
    res.status(201).json({ status: "success", data: request });
  } catch (error) {
    next(error);
  }
};

export const updateRequestStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status } = req.body as { status: RequestStatus };
    const request = await requestService.updateStatus(id, status);
    res.status(200).json({ status: "success", data: request });
  } catch (error) {
    next(error);
  }
};

export const getRequestById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const request = await requestService.getById(req.params.id);
    res.status(200).json({ status: "success", data: request });
  } catch (error) {
    next(error);
  }
};

export const getMyRequests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const requests = await requestService.getMyRequests(req.user!.id);
    res.status(200).json({ status: "success", data: requests });
  } catch (error) {
    next(error);
  }
};

export const getAllRequests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const requests = await requestService.getAllRequests();
    res.status(200).json({ status: "success", data: requests });
  } catch (error) {
    next(error);
  }
};
