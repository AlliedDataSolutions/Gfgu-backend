import { v2 as cloudinary } from 'cloudinary';
import { Request, Response ,NextFunction } from 'express';

import fs from 'fs';
import { cwd } from 'process';
import {join} from "path"


// Example usage:
const handleImageUpload = async (req:Request,resp:Response, next:NextFunction) => {
  
  try {
   
    cloudinary.config({ 
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
      api_key:  process.env.CLOUDINARY_API_KEY,
      api_secret:  process.env.CLOUDINARY_API_SECRET,
      secure: true
   });

  const fileData = req.body.file; // Assuming file data is sent in the request body
  const fileName = req.body.filename; // Assuming filename is sent in the request body

  if (!fileData || !fileName) {
    throw new Error('File data or filename is missing');
  }

  const uploadDir = join(cwd(), "upload");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = join(uploadDir, fileName);
  fs.writeFileSync(filePath, fileData.split(",")[1], 'base64');
  
  const result = await  cloudinary.uploader.unsigned_upload(filePath, "product_images",{
    resource_type : "auto"
  })
    
  resp.status(200).json({ message: 'Upload successful', data: result });

  fs.unlinkSync(filePath);

  } catch (error) {
    console.error('Upload failed:', error);
  }
};

export {
  handleImageUpload
}