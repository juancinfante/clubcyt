"use client"

import Image from 'next/image';
import React from 'react';

const logos = [
    '/publicidad/casaterrav.png',
    '/publicidad/espiritus.jpg',
    '/publicidad/historias.jpg',
    '/publicidad/terraviva.png',
    '/publicidad/casaterrav.png',
    '/publicidad/espiritus.jpg',
    '/publicidad/historias.jpg',
    '/publicidad/terraviva.png',
];

const CarouselPublicidades = () => {
    return (
        <div className="mx-auto text-center relative overflow-hidden bg-white py-16">
            <h1 className='mb-10 text-lg'>Colaboradores</h1>
            <div className="flex animate-slide">
                {logos.map((logo, index) => (
                    <Image
                        width={80}
                        height={20}
                        className='mx-10'
                        key={index}
                        src={logo}
                        alt={`Logo ${index}`}
                        style={{height: "auto", width: "auto"}}
                    />
                ))}
                {/* Clonamos los logos para el efecto de carrusel continuo */}
                {logos.map((logo, index) => (

                    <Image
                        key={index + logos.length} // Asegura un key único
                        src={logo}
                        width={80}
                        height={20}
                        className='mx-10'
                        alt={`Logo ${index}`}
                        style={{height: "auto", width: "auto"}}
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
