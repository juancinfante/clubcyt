"use client"

import { useEffect, useState } from "react";
import 'react-loading-skeleton/dist/skeleton.css';
import CardProducto from "@/components/CardProducto";
import Separador from "@/components/Separador";
import Categorias from "@/components/Categorias";
import Navbar from "@/components/Navbar";

const Page = ({ params }) => {
  const [productos, setProductos] = useState([]);
  const [provincia, setProvincia] = useState("");
  const [loading, setLoading] = useState(false);

  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProductos, setTotalProductos] = useState(0);

  const limit = 10; // Límite de productos por página

  // Fetch products with filters and pagination
  const fetchProductos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/productos?categoria=${params.cat}&provincia=${provincia}&page=${currentPage}&limit=${limit}`);
      const data = await res.json();
      setProductos(data.productos);
      setTotalPages(data.totalPages); // Actualizar el total de páginas
      setTotalProductos(data.totalProductos); // Total de productos
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setLoading(false); // Termina la carga
  };

  useEffect(() => {
    fetchProductos();
  }, [params.cat, provincia, currentPage]); // Trigger fetch when category, province or page change

  // Funciones para cambiar de página
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <Navbar/>
      <Categorias/>
      <Separador texto={"Resultados de: " + params.cat} />
      <div className="container max-w-7xl mx-auto mt-2 mb-9">
        <div className="flex flex-col">
          <div className="grid grid-cols-12 w-100 gap-4 mt-5 p-4">
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
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg ${currentPage === 1 ? 'bg-gray-400' : 'bg-indigo-500 hover:bg-indigo-600'} text-white`}
            >
              ←
            </button>
            {/* <p>Página {currentPage} de {totalPages} (Total: {totalProductos} productos)</p> */}
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg ${currentPage === totalPages ? 'bg-gray-400' : 'bg-indigo-500 hover:bg-indigo-600'} text-white`}
            >
              →
            </button>
          </div>
        </div>

      </div>
    </>
  );
};

export default Page;
