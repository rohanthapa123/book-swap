import { NextFunction, Request, Response } from 'express';
import path from 'path'; // Import the path module
import logger from '../utils/logger';

const fileUrlMiddleware = (
  fieldName: string = 'image',
  isArray: boolean = false,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Skip if no files were uploaded
    if (!req.files && !req.file) {
      return next();
    }

    logger.info(req.file?.path);

    try {
      // Handle array of files
      if (isArray && req.files) {
        const files = Array.isArray(req.files)
          ? req.files
          : Object.values(req.files).flat();

        // Create array of file URLs
        const fileUrls = files.map((file) => {
          // Use path.basename to handle file paths correctly
          const relativePath = path.basename(file.path); // Get the file name
          return `/uploads/${relativePath}`;
        });

        req.body[fieldName] = fileUrls;
      }
      // Handle single file
      else if (!isArray && req.file) {
        const relativePath = path.basename(req.file.path); // Get the file name
        req.body[fieldName] = `/uploads/${relativePath}`;
      }

      next();
    } catch (error) {
      console.error('File URL middleware error:', error);
      next(error);
    }
  };
};

export default fileUrlMiddleware;
