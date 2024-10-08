import React from 'react'

const Separador = ({texto}) => {
  return (
    <div className="w-full py-9 px-3 lg:px-0 hero">
        <div className="container max-w-6xl mx-auto">
            <h1 className='text-2xl'>{texto}</h1>
        </div>
    </div>
  )
}

export default Separador 