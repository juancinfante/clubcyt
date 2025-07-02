"use client";
import { useEffect, useState } from "react";
import CardProducto from "./CardProducto";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import Categorias from "./Categorias";

const Products = () => {
  const [productos, setProductos] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [categoria, setCategoria] = useState("");
  const [provincia, setProvincia] = useState("");
  const [loading, setLoading] = useState(true); // ✅ inicializar en true

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProductos, setTotalProductos] = useState(0);

  const limit = 12;

  const categorias = ["Hotel", "Gastronomia", "Area Comercial", "At. Turistica", "Eventos", "Turismo", "Museos", "Promociones"];
  const provincias = ["Santiago del Estero", "Tucuman", "Catamarca", "Salta", "Jujuy", "La Rioja"];

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/productos?text=${searchText}&categoria=${categoria}&provincia=${provincia}&page=${currentPage}&limit=${limit}&admin=false`);
      const data = await res.json();
      setProductos(data.productos);
      setTotalPages(data.totalPages);
      setTotalProductos(data.totalProductos);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, [searchText, categoria, provincia, currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="container max-w-7xl mx-auto px-3 lg:p-0">
      <Categorias setCategoria={setCategoria} />

      <div className="flex flex-col mb-5">
        <div className="grid grid-cols-12 w-100 gap-4">
          <Input
            type="text"
            className='col-span-12 md:col-span-4'
            label="¿Qué estás buscando?"
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
              <SelectItem key={cat}>{cat}</SelectItem>
            ))}
          </Select>
          <Select
            label="Provincia"
            className="col-span-12 md:col-span-4"
            onChange={(e) => setProvincia(e.target.value)}
          >
            {provincias.map((prov) => (
              <SelectItem key={prov}>{prov}</SelectItem>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-12 w-100 gap-7 md:gap-9 mt-5">
          {loading ? (
            // 🩵 Mejor skeleton: cards con imagen y texto
            Array(limit).fill().map((_, i) => (
              <div key={i} className="col-span-12 md:col-span-4 lg:col-span-3">
                <div className="rounded-xl overflow-hidden shadow-md">
                  <Skeleton height={180} /> {/* Imagen */}
                  <div className="p-3">
                    <Skeleton height={20} width={`80%`} className="mb-2" />
                    <Skeleton height={15} width={`60%`} />
                  </div>
                </div>
              </div>
            ))
          ) : productos.length === 0 ? (
            <h3 className="col-span-12 text-center font-semibold">No se encontraron productos para tu búsqueda.</h3>
          ) : (
            productos.map((producto, index) => (
              <div className="col-span-12 md:col-span-4 lg:col-span-3" key={producto._id || index}>
                {/* Publicidad en la posición 4 */}
                {index === 4 && (
                  <div className="block md:hidden mb-6">
                    <a href="">
                      <img
                        className="w-full h-56 rounded-xl"
                        src="https://res.cloudinary.com/dwjhbrsmf/image/upload/v1720559811/terraviva/b7cabc3k1nucsgaibs01.gif"
                        alt="Publicidad"
                      />
                    </a>
                    <p className="text-xs py-2 ps-1 text-gray-500">Publicidad</p>
                  </div>
                )}
                <CardProducto producto={producto} loading={false} />
              </div>
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
  );
};

export default Products;
