'use client'
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";


export default async function page() {

    const limit = 8; // Límite de productos por página
    const currentPage = 1;
    
    const pathname = usePathname();
    const searchParams = useSearchParams()
    const { replace } = useRouter();
    
    const handleSearch = (value) => {
        const params = new URLSearchParams(searchParams)
        if (value) {
            params.set('search', value);
        } else {
            params.delete('search')
        }
        replace(`${pathname}?${params.toString()}`)
    }



    return (
        <>
            <div className="container max-w-7xl mx-auto mt-5 p-3">
                <div className="flex flex-col mb-5">
                    <div className="grid grid-cols-12 w-100 gap-4">
                        <input
                            type="text"
                            className="col-span-12 md:col-span-4 bg-slate-200 h-11 rounded-lg placeholder-black px-3 mb-3 outline-none"
                            placeholder="¿Qué estás buscando?"
                            onChange={(e) => handleSearch(e.target.value)}
                            defaultValue={searchParams.get('search')?.toString()}
                        />
                        <select className="col-span-12 md:col-span-4 bg-slate-200 h-11 rounded-lg placeholder-black px-3 mb-3 outline-none" onChange={(e) => setCategoria(e.target.value)}>
                            <option value="">Categoría</option>
                            <option value="Gastronomia">Gastronomia</option>
                            <option value="Hotel">Hoteleria</option>
                            <option value="Area Comercial">Area Comercial</option>
                            <option value="Atraccion Turistica">Atraccion Turistica</option>
                        </select>
                        <select className="col-span-12 md:col-span-4 bg-slate-200 h-11 rounded-lg placeholder-black px-3 mb-3 outline-none" onChange={(e) => setProvincia(e.target.value)}>
                            <option value="">Provincia</option>
                            <option value="Santiago del Estero">Santiago del Estero</option>
                            <option value="Salta">Salta</option>
                            <option value="Jujuy">Jujuy</option>
                            <option value="Tucuman">Tucuman</option>
                        </select>
                    </div>

                    {/* <div className="grid grid-cols-12 w-100 gap-9 mt-5">
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
        </div> */}

                    {/* Paginación */}
                    <div className="flex justify-center items-center mt-5 gap-2">
                        {/* {
              pathname != '/' ?  */}
                        <>
                            {/* <button
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
            </button> */}
                        </>
                        {/* :
              <Link href={'/productos'} className="bg-indigo-500 text-white px-4 py-2 rounded-full">VER MÁS</Link>
            } */}
                    </div>
                </div>
            </div>
        </>
    )
}