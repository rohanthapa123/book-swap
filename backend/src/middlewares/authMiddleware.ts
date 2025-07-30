import { NextFunction, Request, Response } from 'express';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("session on middleware", req.session)
  const user = req.session?.user;

  if (!user) {
    res.status(401).json({ message: 'Unauthorized: No session found' });
    return;
  }

  // Optional: Attach user to request object if needed
  (req as any).user = user;

  next();
};
