// utils/multer.ts
import multer from 'multer';

// Define your storage options (optional)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // where you want to store the files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Create a unique filename
  },
});

// Initialize multer with file limits and storage options
const upload = multer({
  storage: storage,
  limits: {
    files: 10, // Maximum of 10 files
    fileSize: 100 * 1024 * 1024, // Maximum file size 10MB (optional)
  },
  fileFilter: (req, file, cb) => {
    // You can add more filters for file types, if needed
    if (file.mimetype.startsWith('image/')) {
      cb(null, true); // accept the file
    } else {
      cb(new Error('Only image files are allowed')); // reject the file
    }
  },
});

export default upload;
