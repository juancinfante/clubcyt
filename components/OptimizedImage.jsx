'use client';

import { buildCloudinaryUrl } from "@/lib/utils";


/**
 * Componente para renderizar imágenes optimizadas de Cloudinary.
 * @param {string} url - URL completa de Cloudinary.
 * @param {string} alt - Texto alternativo.
 * @param {number} width - Ancho deseado.
 * @param {number} height - Alto deseado.
 * @param {string} crop - Tipo de crop (ej: 'fill', 'thumb', etc.)
 * @param {string} className - Clases tailwind o CSS extra.
 */
export default function OptimizedImage({ url, alt = '', width, height, crop, className = '' }) {
  const optimizedUrl = buildCloudinaryUrl(url, { width, height, crop });

  return (
    <img 
      src={optimizedUrl} 
      alt={alt} 
      className={className}
    />
  );
}
