"use client"

import React from 'react';

const logos = [
    '/logos/3m.svg',
    '/logos/barstool-store.svg',
    '/logos/budweiser.svg',
    '/logos/buzzfeed.svg',
    '/logos/forbes.svg',
    '/logos/macys.svg',
    '/logos/menshealth.svg',
    '/logos/mrbeast.svg',
];

const CarouselPublicidades = () => {
    return (
        <div className="mx-auto text-center relative overflow-hidden bg-white py-16">
            <h1 className='mb-10 text-lg'>Colaboradores</h1>
            <div className="flex animate-slide">
                {logos.map((logo, index) => (
                    <img
                        className="h-12 mx-10"
                        key={index}
                        src={logo}
                        alt={`Logo ${index}`}
                    />
                ))}
                {/* Clonamos los logos para el efecto de carrusel continuo */}
                {logos.map((logo, index) => (

                    <img
                        key={index + logos.length} // Asegura un key único
                        src={logo}
                        alt={`Logo ${index}`}
                        className="h-12 mx-10"
                    />
                ))}
            </div>

            <style jsx>{`
        @keyframes slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-slide {
          animation: slide 15s linear infinite;
          white-space: nowrap;
        }

        .animate-slide:hover {
          animation-play-state: paused;
        }
      `}</style>
        </div>
    );
};

export default CarouselPublicidades;
