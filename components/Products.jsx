"use client"
import { useEffect, useState } from "react";
import CardProducto from "./CardProducto";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import Categorias from "./Categorias";

const Products = () => {

  const pathname = usePathname();
  const [productos, setProductos] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [categoria, setCategoria] = useState("");
  const [provincia, setProvincia] = useState("");
  const [loading, setLoading] = useState(false);

  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProductos, setTotalProductos] = useState(0);

  const limit = 8; // Límite de productos por página

  // Fetch products with filters and pagination
  const fetchProductos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/productos?text=${searchText}&categoria=${categoria}&provincia=${provincia}&page=${currentPage}&limit=${limit}`);
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
  }, [searchText, categoria, provincia, currentPage]); // Trigger fetch when filters or page change

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

  const categorias = ["Hotel", "Gastronomia", "Area Comercial", "Atraccion Turistica","Eventos", "Turismo", "Museos", "Promociones"]
  const provincias = ["Santiago del Estero", "Tucuman", "Catamarca", "Salta", "Jujuy", "Cordoba", "Buenos Aires"]

  return (
    <div className="container max-w-6xl mx-auto px-3">
      <Categorias setCategoria={setCategoria} />

      <div className="flex flex-col mb-5">
        <div className="grid grid-cols-12 w-100 gap-4">
          <Input
            type="text"
            className='col-span-12 md:col-span-4'
            label="Que estas buscando?"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Select
            label="Categoría"
            className="col-span-12 md:col-span-4"
            onChange={(e) => setCategoria(e.target.value)}
            defaultSelectedKeys={categoria}
          >
            {categorias.map((cat) => (
              <SelectItem key={cat}>
                {cat}
              </SelectItem>
            ))}
          </Select>
          <Select
            label="Provincia"
            className="col-span-12 md:col-span-4"
            onChange={(e) => setProvincia(e.target.value)}
          >
            {provincias.map((prov) => (
              <SelectItem key={prov}>
                {prov}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-12 w-100 gap-9 mt-5">
          {loading ? (
            Array(12)
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
          {/* {
              pathname != '/' ?  */}
          <>
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg ${currentPage === 1 ? 'bg-gray-400' : 'bg-indigo-500 hover:bg-indigo-600'} text-white`}
            >
              ←
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg ${currentPage === totalPages ? 'bg-gray-400' : 'bg-indigo-500 hover:bg-indigo-600'} text-white`}
            >
              →
            </button>
          </>
        </div>
      </div>
    </div>
  );
};

export default Products;
