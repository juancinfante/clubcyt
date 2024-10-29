"use client"
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";
import CardPromocion from "./CardPromocion";


const SliderPromo = ({ promociones, producto }) => {


  // Verifica si la fecha es pasada, ignorando la hora
function esFechaPasada(dateString) {
  const today = new Date();
  const selectedDate = new Date(dateString);
  // Normaliza ambas fechas a las 00:00:00 para ignorar la hora en la comparación
  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);

  return selectedDate < today;
}

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
  return (
    <div className="container mx-auto max-w-6xl mb-20 mt-20">
      <h1 className="ms-3 text-2xl font-semibold mb-8">Disfruta de las mejores promociones</h1>
      <Slider {...settings}>
        {

          [...promociones].reverse().map((prom, index) => (
            !esFechaPasada(prom.hasta) ? 
            <CardPromocion promocion={prom} key={index} producto={producto} />
            : ""
          ))
        }
      </Slider>
    </div>
  );
}

export default SliderPromo;