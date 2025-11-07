import { Request, Response, NextFunction } from "express";
import { PatientService } from "../../core/services/patient.service";

const patientService = new PatientService();

export const createPatient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const patient = await patientService.create(req.body);
    res.status(201).json({ status: "success", data: patient });
  } catch (error) {
    next(error);
  }
};

export const getAllActivePatients = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const patients = await patientService.getAllActive();
    res.status(200).json({ status: "success", data: patients });
  } catch (error) {
    next(error);
  }
};

export const getAllPatients = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const patients = await patientService.getAll();
    res.status(200).json({ status: "success", data: patients });
  } catch (error) {
    next(error);
  }
};

export const getPatientById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const patient = await patientService.getById(req.params.id);
    res.status(200).json({ status: "success", data: patient });
  } catch (error) {
    next(error);
  }
};

export const updatePatient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const patient = await patientService.update(req.params.id, req.body);
    res.status(200).json({ status: "success", data: patient });
  } catch (error) {
    next(error);
  }
};

export const deletePatient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await patientService.delete(req.params.id);
    res.status(204).json({ status: "success", data: null });
  } catch (error) {
    next(error);
  }
};

export const reactivatePatient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const patient = await patientService.reactivate(req.params.id);
    res.status(200).json({ status: "success", data: patient });
  } catch (error) {
    next(error);
  }
};
