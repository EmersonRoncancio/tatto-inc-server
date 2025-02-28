import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { envs } from 'src/configs/envs.configs';

cloudinary.config({
  cloud_name: envs.CLOUDINARY_NAME,
  api_key: envs.CLOUDINARY_API_KEY,
  api_secret: envs.CLOUDINARY_API_SECRET,
  secure: true,
});

export const cloudinaryAdapter = {
  uploadImage: async (filePath: string, folder: string) => {
    const nowFolder = folder.replace(/\s/g, '_');
    return cloudinary.uploader.upload(filePath, {
      folder: nowFolder,
      resource_type: 'auto',
    });
  },
  deleteImage: async (publicId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return cloudinary.uploader.destroy(publicId);
  },
  uploadImageOne: async (file: Express.Multer.File, folder: string) => {
    // Usar upload_stream para subir el archivo desde el buffer a una carpeta específica
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto', // Detecta el tipo de archivo automáticamente (imagen, audio, video, etc.)
          folder: folder, // Usar una carpeta específica (limpiando espacios)
        },
        (error, result) => {
          if (error) {
            reject(new Error(error.message));
          } else {
            if (result) {
              resolve(result); // El resultado será del tipo UploadApiResponse
            } else {
              reject(new Error('Upload failed, result is undefined'));
            }
          }
        },
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      stream.end(file.buffer); // Enviar el archivo (buffer) a Cloudinary
    });

    return result; // Devuelve el resultado de la subida con el tipo UploadApiResponse
  },
  uploadImages: async (files: Express.Multer.File[], folder: string) => {
    const uploadPromises = files.map((file) => {
      return new Promise<UploadApiResponse>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder: folder,
          },
          (error, result) => {
            if (error) {
              reject(new Error(error.message));
            } else if (result) {
              resolve(result);
            } else {
              reject(new Error('Upload failed, result is undefined'));
            }
          },
        );
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        stream.end(file.buffer);
      });
    });

    return Promise.all(uploadPromises); // Devuelve un array con los resultados de todas las imágenes subidas
  },
};
