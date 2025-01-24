"use client"
import React, { use, useEffect, useState } from 'react';

export default function DescripcionProducto({ descripcion }) {

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, [])

    return (
        <>
            {
                isMounted ? <div className="w-full border border-gray-200 rounded-xl p-4 mt-5">
                    <p className='text-sm md:text-lg text-gray-700 w-full' dangerouslySetInnerHTML={{ __html: descripcion }}></p>
                </div> : null
            }
        </>

    );
}

