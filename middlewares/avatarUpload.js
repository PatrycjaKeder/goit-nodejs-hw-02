const fs = require("fs").promises;
const path = require("path");
const multer = require("multer");
const { v4: uuidV4 } = require("uuid");
const { isImageAndTransform } = require("./helpers/avatarHelper");

const tempDir = path.join(__dirname, "../public/temp");
const storageImgDir = path.join(__dirname, "../public/avatars");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const extensionWhiteList = [".jpg", ".jpeg", ".png", ".gif"];
const mimetypeWhiteList = ["image/jpg", "image/jpeg", "image/png", "image/gif"];

const uploadMiddleware = multer({
  storage,
  fileFilter: async (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;

    if (
      !extensionWhiteList.includes(extension) ||
      !mimetypeWhiteList.includes(mimetype)
    ) {
      return cb(null, false);
    }

    return cb(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

const validateAndTransformAvatar = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "File isn't a photo" });
  }

  const { path: tempFilePath } = req.file;

  const extension = path.extname(tempFilePath); // take an extension (eq. .jpg, .png etc.)
  const fileName = `${uuidV4()}${extension}`;
  const filePath = path.join(storageImgDir, fileName);

  try {
    await fs.rename(tempFilePath, filePath);

    req.file.destination = storageImgDir;
    req.file.path = filePath;
    req.file.filename = fileName; // name in db is a uuid, not originalName
  } catch (error) {
    console.log("Error in validateAndTransformAvatar:", error);
    await fs.unlink(tempFilePath);
    return next(error);
  }

  const isValidAndTransform = await isImageAndTransform(filePath);

  if (!isValidAndTransform) {
    await fs.unlink(filePath);
    return res.status(400).json({ message: "Avatar's validation failed" });
  }

  next();
};

module.exports = {
  uploadMiddleware,
  validateAndTransformAvatar,
};
