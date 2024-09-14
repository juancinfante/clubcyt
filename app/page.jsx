import React from 'react'
import Hero from '@/components/Hero'
import Products from '@/components/Products'
import { connectDB } from '@/utils/mongoose'
import Categorias from '@/components/Categorias'
import Navbar from '@/components/Navbar'
import Separador from '@/components/Separador'
import Lista from '@/components/Lista'
import Tags from '@/components/Tags'

const page = () => {

  return (
    <>
      <Navbar />
      <Hero />
      <Categorias />
      <Separador texto={"Todos"}/>
      <Lista cat={""}/>
      <Separador texto={"# Tags"}/>
      <Tags />
    </>
  )
}

export default page  