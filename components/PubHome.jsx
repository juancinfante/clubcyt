import React from 'react'

const Publicidades = () => {
    return (
        <div className="container mx-auto max-w-7xl px-3 lg:p-0">
            <div className="w-full grid grid-cols-8 gap-4">
                <div className="col-span-12 md:col-span-4 h-[180px] bg-gray-200 flex justify-center items-center rounded-xl overflow-hidden">
                    <a href="https://www.instagram.com/hiar.viajes" target='_blank' className='w-full h-full object-fill'>
                        <img className='w-full h-full object-fill' src="https://res.cloudinary.com/dwjhbrsmf/image/upload/v1737637647/clubcyt/HIAR_632x180_f7pqbx.gif" alt="" />
                    </a>
                </div>
                <div className="col-span-12 md:col-span-2 h-[180px] bg-gray-200 flex justify-center items-center rounded-xl overflow-hidden">
                    <a href="https://sde.gob.ar/" target='_blank' className='w-full h-full object-fill'>
                        <img className='w-full h-full object-fill' src="https://res.cloudinary.com/dwjhbrsmf/image/upload/v1746484343/clubcyt/publicidad/mo6unknqfbe8al36look.gif" alt="" />
                    </a>
                </div>
                <div className="col-span-12 md:col-span-2 h-[180px] bg-gray-200 flex justify-center items-center rounded-xl overflow-hidden">
                    <a href="https://www.santiagociudad.gov.ar/" target='_blank' className='w-full h-full object-fill'>
                        <img className='w-full h-full object-fill' src="https://res.cloudinary.com/dwjhbrsmf/image/upload/v1720416250/terraviva/bwfshwiq8c2d9jwy4v3d.gif" alt="" />
                    </a>
                </div>
            </div>
        </div>
        
    )
}

export default Publicidades