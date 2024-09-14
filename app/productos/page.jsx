import Categorias from '@/components/Categorias'
import Navbar from '@/components/Navbar'
import Products from '@/components/Products'
import Separador from '@/components/Separador'
import React from 'react'

const page = () => {
  return (
    <>
        <Navbar/>
        <Separador texto={"Buscar:"}/>
        <Products />
    </>
)
}

export default page