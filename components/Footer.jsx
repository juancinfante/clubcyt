import React from 'react'

const Footer = () => {
    return (
        <div className="bg-indigo-500 mt-20">
            <div className="container mx-auto max-w-7xl">
                <div className="grid justify-center p-10 text-white">
                    <ul className='flex gap-10 text-xs'>
                        <li>
                            <a href="" className='text-white'>Productos</a>
                        </li>
                        <li>
                            <a href="" className='text-white'>Nosotros</a>
                        </li>
                        <li>
                            <a href="" className='text-white'>Contacto</a>
                        </li>
                        <li>
                            <a href="" className='text-white'>Cuenta</a>
                        </li>
                    </ul>
                    <p className='text-xs text-center mt-4'>© 2024 Club CyT</p>
                </div>
            </div>
        </div>
    )
}

export default Footer