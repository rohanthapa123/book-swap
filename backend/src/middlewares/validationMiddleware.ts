import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';

export const validateDto = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoInstance = plainToInstance(dtoClass, req.body, {
      enableImplicitConversion: true, // 💥 Enables @Transform and type conversion
    });

    const errors = await validate(dtoInstance, {
      whitelist: true, // optional but clean
    });

    if (errors.length > 0) {
      res.status(400).json({
        message: 'Validation failed',
        errors: errors.map((err) => ({
          property: err.property,
          constraints: err.constraints,
        })),
      });
      return;
    }

    // 🧠 Replace req.body with transformed DTO (featured: boolean now)
    req.body = dtoInstance;

    next();
  };
};
