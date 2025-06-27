"use client";

import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import qrcontainer from '@/public/assets/qrcontainer.jpeg';
import jsPDF from "jspdf";
const Page = () => {
  const modalRef = useRef();

  const handleDownloadPDF = async () => {
  if (!modalRef.current) return;

  const canvas = await html2canvas(modalRef.current);
  const imgData = canvas.toDataURL('image/png');

  // Calculás tamaño del PDF en función del canvas
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: [canvas.width, canvas.height]
  });

  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
  pdf.save("usuario_qr.pdf");
};

  return (
    <div className="flex flex-col items-center p-4">
      <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
        <div className="sm:flex sm:items-start">
          <div className="container mx-auto flex justify-center mt-10">
            <div className="relative" ref={modalRef}>
              {/* Imagen de fondo con borde redondeado */}
              <img
                src={qrcontainer.src}
                height={600}
                width={300}
                alt="QR Container"
                className="rounded-lg"
              />

              {/* Nombre del usuario encima del código QR */}
              <h3 className="absolute top-32 left-1/2 transform -translate-x-1/2 text-sm font-semibold text-gray-900">
                Juan cruz 
              </h3>

              {/* Imagen generada del QR superpuesta */}
              <img
                src="data:image/png;base64,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"
                alt="Generated QR Code"
                className="absolute mt- top-[50%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150px] h-[150px]"
              />

              {/* Texto debajo del código QR */}
              <p className="absolute bottom-28 font-bold py-1 px-2 rounded-lg left-1/2 transform -translate-x-1/2 text-black text-lg">
                Activo
              </p>
            </div>
          </div>
        </div>
      </div>


      <button
        onClick={handleDownloadPDF}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
      >
        Descargar imagen
      </button>
    </div>
  );
};

export default Page;
