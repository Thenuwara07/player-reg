// import { Request, Response } from "express";

// export const handleFileUpload = (req: Request, res: Response) => {
//   if (!req.file) {
//     return res.status(400).json({ error: "No file uploaded" });
//   }

//   res.status(200).json({
//     message: "File uploaded successfully",
//     file: req.file,
//   });
// };
import { Request, Response } from "express";

export const uploadImage = async (req: Request, res: Response) => {
  try {
    // multer-storage-cloudinary attaches this
    const file = req.file as any;

    if (!file?.path) {
      return res.status(400).json({ message: "No image received" });
    }

    // file.path = secure https url
    // file.filename = public_id
    return res.status(200).json({
      url: file.path,
      publicId: file.filename,
    });
  } catch (err) {
    return res.status(500).json({ message: "Upload failed", err });
  }
};
