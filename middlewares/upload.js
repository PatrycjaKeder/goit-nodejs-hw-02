import multer from "multer";

import path from "path";

// const tempDir = path.join(process.cwd(), './', 'temp');

export const tempDir = path.resolve("temp");

const storage = multer.diskStorage({
  destination: tempDir,

  filename: (req, file, cb) => {
    const uniquePrefix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;

    const filename = `${uniquePrefix}_${file.originalname}`;

    cb(null, filename);
  },
});

const limits = {
  fileSize: 5 * 1024 * 1024,
};

// const fileFilter = (req, file, cb)=> {

//     if(file.originalname.split(".").pop() === "exe") {

//         cb(new Error("File extention not allow"));

//     }

//     cb(null, true);

// }

export const upload = multer({
  storage,

  limits,

  // fileFilter,
});
