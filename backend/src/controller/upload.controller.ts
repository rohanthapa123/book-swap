import { Request, Response } from 'express';
import logger from '../utils/logger';

export class UploadController {
  // 📥 Create about
  create = async (req: Request, res: Response) => {
    try {
      const image = req.body;

      logger.info('This is image', image);

      res.status(201).json({ message: 'Image uploaded', image: image.image });
    } catch (error: any) {
      logger.error('Create Error:', error.message);
      res
        .status(500)
        .json({ message: 'Failed to create about', error: error.message });
    }
  };
}
