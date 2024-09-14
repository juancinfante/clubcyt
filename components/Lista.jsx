"use client"
import React, { useEffect, useState } from 'react'
import CardProducto from './CardProducto';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const Lista = ({ cat }) => {
    const [productos, setProductos] = useState([]);
    // Estados para la paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const pathname = useParams();

    // Fetch products with filters and pagination
    const fetchProductos = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/productos?text=&categoria=${cat}&provincia=&page=&limit=`);
            const data = await res.json();
            console.log(data)
            setProductos(data.productos);
            setTotalPages(data.totalPages); // Actualizar el total de páginas
        } catch (error) {
            console.error("Error fetching products:", error);
        }
        setLoading(false); // Termina la carga
    };

    useEffect(() => {
        fetchProductos();
      },[]);

    return (
        <>
        <div className="container mx-auto max-w-7xl mb-20">
            <div className="grid grid-cols-12 w-100 gap-9 mt-5 p-3 lg:p-0">
          {loading ? (
              Array(8)
              .fill()
              .map((_, i) => <CardProducto key={i} loading={true} />)
            ) : productos.length === 0 ? (
                <h3 className="col-span-12 text-center font-semibold">No se encontraron productos para tu búsqueda.</h3>
            ) : (
            productos.map((producto) => (
                <CardProducto key={producto._id} producto={producto} loading={false} />
            ))
        )}
        </div>
        {/* Paginación */}
        <div className="flex justify-center items-center mt-5 gap-2">
              <Link href={'/productos'} className="bg-indigo-500 text-white px-4 py-2 rounded-md">VER MÁS</Link>
          </div>
        </div>
        </>
    )
}

export default Lista