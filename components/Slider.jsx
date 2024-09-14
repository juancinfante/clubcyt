"use client"
// components/Slider.js
import { useState } from 'react';

const Slider = ({ fotos }) => {
  const [index, setIndex] = useState(0);
  const images = fotos;

  const nextSlide = () => {
    setIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full mx-auto">
      {/* Slider container */}
      <div className="flex overflow-hidden w-full">
        {images.map((image, i) => (
          <div
            key={i}
            className={`flex-shrink-0 w-full transition-transform transform ${i === index ? 'translate-x-0' : 'translate-x-full'} `}
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            <img src={image} className="w-full object-cover" alt={`Slide ${i + 1}`} />
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full"
      >
        &#10094;
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full"
      >
        &#10095;
      </button>
    </div>
  );
};

export default Slider;
