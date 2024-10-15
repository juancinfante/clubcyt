import React from 'react'

const Publicidades = () => {
    return (
        <div className="container mx-auto max-w-6xl px-3 hidden lg:block">
            <div className="w-full grid grid-cols-8 gap-4">
                <div className="col-span-4 h-[160px] bg-gray-200 flex justify-center items-center rounded-xl overflow-hidden">
                    <img className='w-full h-full object-fill' src="https://bucket.glanacion.com/Club.LN/anexos/fotos/landings/Header_Club_LA_NACION.JPG" alt="" />
                </div>
                <div className="col-span-2 h-[160px] bg-gray-200 flex justify-center items-center rounded-xl overflow-hidden">
                    <img className='w-full h-full object-fill' src="https://res.cloudinary.com/dwjhbrsmf/image/upload/v1720559811/terraviva/b7cabc3k1nucsgaibs01.gif" alt="" />
                </div>
                <div className="col-span-2 h-[160px] bg-gray-200 flex justify-center items-center rounded-xl overflow-hidden">
                    <img className='w-full h-full object-fill' src="https://res.cloudinary.com/dwjhbrsmf/image/upload/v1720416250/terraviva/bwfshwiq8c2d9jwy4v3d.gif" alt="" />
                </div>
            </div>
        </div>
    )
}

export default Publicidades