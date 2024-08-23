const path = require('path');
const fs = require('fs/promises');

//the function that takes the image from it's folder and save in another folder in the specidied location
const extractImageInfo = async (imagePath) => {
    try {
      //read the image from the path user provides
      const imageBuffer = await fs.readFile(imagePath);
      const mimetype = path.extname(imagePath).replace('.', '');
      const originalName = path.basename(imagePath);

      // Validate image type and size
      if (!['JPEG', 'PNG', 'GIF'].includes(mimetype)) {
        return res.status(400).json({ error: 'Invalid image type' });
      }
      if (imageBuffer.length > 5 * 1024 * 1024) {
        return res.status(400).json({ error: 'Image size exceeds limit' });
      }

      // Generate a unique filename
      const filename = `${Date.now()}-${originalName}`;
      const targetPath = path.join('controllers/Users_Pictures',filename);
      
      //create the image file inside Users_Pictures
      await fs.writeFile(targetPath, imageBuffer);

    return targetPath;
    } catch (error) {
      console.error('Error extracting image info:', error);
      throw error;
    }
  }

  module.exports = extractImageInfo;