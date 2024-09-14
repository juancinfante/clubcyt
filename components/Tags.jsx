import React from 'react'
import DiagonalArrow from '@/public/assets/diagonal-arrow.svg'

const Tags = () => {
  return (
    <>
        <div className="grid container mx-auto max-w-7xl">
            <ul className='flex flex-wrap gap-10 pt-10 justify-center'>
                <li className='bg-gray-100 py-1 px-3 rounded-full'><a href="" className='text-gray-600'>#Comida</a></li>
                <li className='bg-gray-100 py-1 px-3 rounded-full'><a href="" className='text-gray-600'>#Viajes</a></li>
                <li className='bg-gray-100 py-1 px-3 rounded-full'><a href="" className='text-gray-600'>#Hoteles</a></li>
                <li className='bg-gray-100 py-1 px-3 rounded-full'><a href="" className='text-gray-600'>#Fiesta</a></li>
                <li className='bg-gray-100 py-1 px-3 rounded-full'><a href="" className='text-gray-600'>#Folklore</a></li>
                <li className='bg-gray-100 py-1 px-3 rounded-full'><a href="" className='text-gray-600'>#Patios</a></li>
                <li className='bg-gray-100 py-1 px-3 rounded-full'><a href="" className='text-gray-600'>#CortedePelo</a></li>
                <li className='bg-gray-100 py-1 px-3 rounded-full'><a href="" className='text-gray-600'>#Cerveza</a></li>
            </ul>
        </div>
    </>
  )
}

export default Tags