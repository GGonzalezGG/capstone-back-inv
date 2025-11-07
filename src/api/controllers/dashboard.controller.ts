import { Request, Response, NextFunction } from "express";
import { DashboardService } from "../../core/services/dashboard.service";

const dashboardService = new DashboardService();

export const getDashboardSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const summaryData = await dashboardService.getDashboardSummary();
    res.status(200).json({ status: "success", data: summaryData });
  } catch (error) {
    next(error);
  }
};
