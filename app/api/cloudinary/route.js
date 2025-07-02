import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import fs from "fs/promises";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configurar multer para manejar uploads temporales
const upload = multer({ dest: "/tmp" });

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const nombreComercio = formData.get("nombreComercio");

    if (!file || !nombreComercio) {
      return NextResponse.json({ error: "Falta archivo o nombre del comercio" }, { status: 400 });
    }

    // Convertir a buffer para guardar temporalmente
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = `/tmp/${file.name}`;
    await fs.writeFile(filePath, buffer);

    // Subir a Cloudinary con calidad automática y carpeta por comercio
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `clubcyt/comercios/${nombreComercio}`,
      transformation: [
        { quality: "auto" }  // Compresión inteligente
      ],
    });

    // Eliminar temporal
    await fs.unlink(filePath);

    // Retornar URL segura y public_id (opcional)
    return NextResponse.json({ 
      imageUrl: result.secure_url,
      public_id: result.public_id
    });

  } catch (error) {
    console.error("Error al subir imagen:", error);
    return NextResponse.json({ error: "Error al subir imagen" }, { status: 500 });
  }
}


export async function DELETE(req) {
  try {
    const { publicId } = await req.json();
    console.log(publicId)
    // Se espera que el publicId venga en el cuerpo de la solicitud
    if (!publicId) {
      return NextResponse.json({ error: "No se proporcionó el public_id" }, { status: 400 });
    }

    const result = await deleteImage(publicId);  // Llama a la función deleteImage
    if (result.success) {
      return NextResponse.json({ message: result.message });
    } else {
      return NextResponse.json({ error: result.message }, { status: 500 });
    }
  } catch (error) {
    console.error("Error al eliminar la imagen:", error);
    return NextResponse.json({ error: "Error al eliminar la imagen" }, { status: 500 });
  }
}

export async function deleteImage(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result === 'ok') {
      return { success: true, message: 'Imagen eliminada exitosamente' };
    } else {
      return { success: false, message: 'Error al eliminar la imagen' };
    }
  } catch (error) {
    console.error("Error al eliminar la imagen de Cloudinary:", error);
    return { success: false, message: 'Error al eliminar la imagen' };
  }
}