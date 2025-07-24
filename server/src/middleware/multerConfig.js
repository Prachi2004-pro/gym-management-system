const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../cloudinary");

// Existing configuration for profile images
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Invoicify/ProfileImages",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

// New configuration for PDF uploads
const invoiceStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Invoicify/Invoices",
    allowed_formats: ["pdf"],
    resource_type: "raw",
    format: "pdf"
  },
});

// Create separate upload middlewares
const upload = multer({ storage: profileStorage });
const uploadPDF = multer({ 
  storage: invoiceStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

module.exports = { upload, uploadPDF };
