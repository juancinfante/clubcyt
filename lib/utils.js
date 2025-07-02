import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// src/utils/cloudinary.js

/**
 * Construye una URL optimizada de Cloudinary a partir de una URL completa
 * @param {string} originalUrl - URL completa de Cloudinary (ej: https://res.cloudinary.com/...)
 * @param {object} options - Opciones de transformación (width, height, crop, quality, format, etc.)
 * @returns {string} - URL optimizada con transformaciones
 */

export function buildCloudinaryUrl(originalUrl, options = {}) {

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  console.log('cloudName env:', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);

  if (!originalUrl) return ''; // por si viene null o undefined

  // Extraer el public_id de la URL
  try {
    const afterUpload = originalUrl.split('/upload/')[1]; // "v.../folder/file.jpg"
    const parts = afterUpload.split('/');
    // Eliminar el primer elemento que suele ser la versión (ej: "v1732674802")
    const publicId = parts.slice(1).join('/'); // "clubcyt/archivo.jpg"

    // Valores por defecto
    const {
      width,
      height,
      crop,
      quality = 'auto',
      format = 'auto'
    } = options;

    const transformations = [];
    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    if (crop) transformations.push(`c_${crop}`);
    if (quality) transformations.push(`q_${quality}`);
    if (format) transformations.push(`f_${format}`);

    const transString = transformations.join(',');

    return `https://res.cloudinary.com/${cloudName}/image/upload/${transString}/${publicId}`;
  } catch (e) {
    console.error('Error al construir Cloudinary URL:', e);
    return originalUrl; // si falla, devolver original
  }
}
