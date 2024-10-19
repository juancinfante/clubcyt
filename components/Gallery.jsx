"use client"
import { useState } from 'react';
import Image from 'next/image';
import Modal from 'react-modal';

// // Necesario para configurar los modales correctamente en Next.js
// Modal.setAppElement('#__next');

const Gallery = ( images ) => {

  const [isOpen, setIsOpen] = useState(false); // Estado para controlar el modal
  const [currentImage, setCurrentImage] = useState(null); // Imagen actual a mostrar en el modal

  // Función para abrir el modal
  const openModal = (image) => {
    setCurrentImage(image);
    setIsOpen(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsOpen(false);
    setCurrentImage(null);
  };

  const remainingImages = images.length - 5;

  return (
    <div>
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        {/* Primera imagen grande */}
        <div className="col-span-2 row-span-2 cursor-pointer" onClick={() => openModal(images[0])}>
          <Image
            src={images[0]}
            alt={"images[0]"}
            width={500}
            height={500}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Otras imágenes más pequeñas */}
        {images.slice(1, 5).map((image, index) => (
          <div key={index} className="relative cursor-pointer" onClick={() => openModal(image)}>
            <Image
              src={image[0]}
              alt={"image.alt"}
              width={300}
              height={300}
              className="object-cover w-full h-full"
            />
          </div>
        ))}

        {/* Imagen que indica que hay más fotos */}
        {remainingImages > 0 && (
          <div className="relative cursor-pointer" onClick={() => openModal(images[5])}>
            <Image
              src={images[5]}
              alt={"images[5]"}
              width={300}
              height={300}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white text-2xl">+{remainingImages}</span>
            </div>
          </div>
        )}
      </div>

      {/* Modal para mostrar la imagen grande */}
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Imagen Ampliada"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        {currentImage && (
          <div className="relative">
            <button onClick={closeModal} className="absolute top-2 right-2 text-white text-3xl font-bold">&times;</button>
            <Image
              src={currentImage.src}
              alt={currentImage.alt}
              width={1000}
              height={1000}
              className="object-cover max-w-full max-h-full"
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Gallery;
