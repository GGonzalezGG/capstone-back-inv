import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validate =
  (schema: z.ZodObject<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      // Zod envía un error con un formato específico
      return res.status(400).json(error);
    }
  };
