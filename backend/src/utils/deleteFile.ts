import fs from 'fs';
import path from 'path';

/**
 * Deletes a file from the uploads directory.
 * @param filePath - The full path of the file to be deleted.
 */

export const deleteFile = (filePath: string): void => {
  // Ensure filePath is within the allowed directory (security check)
  const uploadsDir = path.join(__dirname, 'uploads');
  const absoluteFilePath = path.resolve(uploadsDir, filePath);

  // Check if the file is within the uploads directory
  if (!absoluteFilePath.startsWith(uploadsDir)) {
    console.error('Unauthorized file path access attempt');
    return;
  }

  // Check if the file exists before attempting to delete
  fs.access(absoluteFilePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`File not found: ${absoluteFilePath}`);
      return;
    }

    // Delete the file
    fs.unlink(absoluteFilePath, (err) => {
      if (err) {
        console.error(`Failed to delete file: ${absoluteFilePath}`);
        return;
      }
      console.log(`File deleted successfully: ${absoluteFilePath}`);
    });
  });
};
