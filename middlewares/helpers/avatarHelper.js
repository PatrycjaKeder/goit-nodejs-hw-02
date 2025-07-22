const fs = require("fs").promises;
const Jimp = require("jimp");

// if public and temp  folder doesn't exist - create it

const isAccessible = (path) =>
  fs
    .access(path)
    .then(() => true)
    .catch(() => false);

const setupFolder = async (path) => {
  const folderExist = await isAccessible(path);

  if (!folderExist) {
    try {
      await fs.mkdir(path);
    } catch (e) {
      console.log("no permissions");
      process.exit(1);
    }
  }
};

const MAX_AVATAR_WIDTH = 250;
const MAX_AVATAR_HEIGHT = 250;

const isImageAndTransform = async (path) => {
  try {
    const image = await Jimp.read(path);

    const w = image.bitmap.width;
    const h = image.bitmap.height;
    const minDim = w < h ? w : h;
    const cropWidth = w > minDim ? minDim : w;
    const cropHeight = h > minDim ? minDim : h;
    const centerX = Math.round(w / 2 - cropWidth / 2);
    const centerY = Math.round(h / 2 - cropHeight / 2);
    await image
      .rotate(360)
      .crop(
        centerX < 0 ? 0 : centerX,
        centerY < 0 ? 0 : centerY,
        cropWidth,
        cropHeight
      )
      .resize(MAX_AVATAR_WIDTH, MAX_AVATAR_HEIGHT)
      .writeAsync(path);
    return true;
  } catch (error) {
    console.log("Error during image transformation:", error);
    return false;
  }
};
// const isImageAndTransform = async (path) =>
// new Promise((resolve) => {
//     Jimp.read(path, async (err, image) => {
//       if (err) resolve(false);

//       try {
//         const w = image.getWidth();
//         const h = image.getHeight();
//         const minDim = w < h ? w : h;

//         const cropWidth = w > minDim ? minDim : w;
//         const cropHeight = h > minDim ? minDim : h;

//         const centerX = Math.round(w / 2 - cropWidth / 2);
//         const centerY = Math.round(h / 2 - cropHeight / 2);

//         await image
//           .rotate(360)
//           .crop(
//             centerX < 0 ? 0 : centerX,
//             centerY < 0 ? 0 : centerY,
//             cropWidth,
//             cropHeight
//           )
//           .resize(MAX_AVATAR_WIDTH, MAX_AVATAR_HEIGHT)
//           .write(path);

//         resolve(true);
//       } catch (error) {
//         console.log(error);
//         resolve(false);
//       }
//     });
//   });

module.exports = { setupFolder, isImageAndTransform };
