"use client"

import Image from 'next/image';
import React from 'react';

const logos = [
    'https://res.cloudinary.com/dwjhbrsmf/image/upload/v1737639730/clubcyt/terraviva_qvimam.png',
    'https://res.cloudinary.com/dwjhbrsmf/image/upload/v1737639729/clubcyt/metacraneo_fk7mc2.png',
    'https://res.cloudinary.com/dwjhbrsmf/image/upload/v1737639728/clubcyt/hiar_u0pqr3.png',
    'https://res.cloudinary.com/dwjhbrsmf/image/upload/v1737639726/clubcyt/espiritus_vtk4ko.png',
    'https://res.cloudinary.com/dwjhbrsmf/image/upload/v1737639725/clubcyt/dlt_i3lfkp.png',
    'https://res.cloudinary.com/dwjhbrsmf/image/upload/v1737639721/clubcyt/casa_lwhgh9.png',
];

const CarouselPublicidades = () => {
    return (
        <div className="mx-auto text-center relative overflow-hidden bg-white py-16">
            <h1 className='mb-10 text-lg'>Colaboradores</h1>
            <div className="flex animate-slide">
                {logos.map((logo, index) => (
                    <Image
                        width={120}
                        height={0}
                        className='mx-10'
                        key={index}
                        src={logo}
                        alt={`Logo ${index}`}
                    />
                ))}
                {/* Clonamos los logos para el efecto de carrusel continuo */}
                {logos.map((logo, index) => (

                    <Image
                        key={index + logos.length} // Asegura un key único
                        src={logo}
                        width={120}
                        height={20}
                        className='mx-10'
                        alt={`Logo ${index}`}
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
