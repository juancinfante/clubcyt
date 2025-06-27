"use client";

import React, { useRef } from 'react';
import html2canvas from 'html2canvas';

const Page = () => {
  const modalRef = useRef();

  const handleDownload = async () => {
    if (!modalRef.current) return;

    const canvas = await html2canvas(modalRef.current);
    const dataURL = canvas.toDataURL('image/jpeg', 1.0);

    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'mi_imagen.jpg';
    link.click();
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div
        ref={modalRef}
        className="relative w-64 h-64 bg-yellow-200 rounded-lg flex items-center justify-center text-center"
      >
        <p className="text-lg font-bold">Hola! Soy un ejemplo para exportar 🎉</p>
      </div>

      <button
        onClick={handleDownload}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
      >
        Descargar imagen
      </button>
    </div>
  );
};

export default Page;
