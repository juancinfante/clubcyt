import React from 'react'
import Hero from '@/components/Hero'
import Products from '@/components/Products'
import { connectDB } from '@/utils/mongoose'
import Categorias from '@/components/Categorias'
import Navbar from '@/components/Navbar'
import Separador from '@/components/Separador'
import Lista from '@/components/Lista'
import Tags from '@/components/Tags'
import ProductsNew from '@/components/ProductsNew'
import Publicidades from '@/components/Publicidades'
import CarouselPublicidades from '@/components/CarouselPublicidades'
import SliderPromo from '@/components/SliderPromo'
import { getPromociones } from '@/lib/actions/page'

export default async function page() {

  const promociones = await getPromociones();

  return (
    <>

      <Navbar />
      {/* <Hero /> */}
      <Products />
      {
        promociones != null ?
          <SliderPromo promociones={promociones} />
          :
          ""
      }
      <Publicidades />
      <CarouselPublicidades />
    </>
  )
}

