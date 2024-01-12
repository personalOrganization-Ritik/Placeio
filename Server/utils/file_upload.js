import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "profileImage") {
      cb(null, "./uploads/profile_avatar");
    } else if (file.fieldname === "resume") {
      cb(null, "./uploads/resume");
    } else if (file.fieldname === "logo") {
      cb(null, "./uploads/logo");
    } else if (file.fieldname === "photos") {
      cb(null, "./uploads/photos");
    } else {
      cb(new Error("Invalid file fieldname"), false);
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const imageFileFilter = (req, file, cb) => {
  const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"];

  if (allowedImageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type for profileImage"), false);
  }
};

const pdfFileFilter = (req, file, cb) => {
  const allowedPdfTypes = ["application/pdf"];

  if (allowedPdfTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type for resume"), false);
  }
};

const uploadFile = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 5,
  },
  fileFilter: (req, file, cb) => {
    if (
      file.fieldname === "profileImage" ||
      file.fieldname === "logo" ||
      file.fieldname === "photos"
    ) {
      imageFileFilter(req, file, cb);
    } else if (file.fieldname === "resume") {
      pdfFileFilter(req, file, cb);
    } else {
      cb(null, true);
    }
  },
});

export default uploadFile;
