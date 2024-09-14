import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react'
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

const CardProducto = ({ producto, loading }) => {
  const router = useRouter()
  const pathName = usePathname();

  if (loading) {
    // Mostrar skeletons cuando loading sea true
    return (
      <div className={pathName != "/" ? "col-span-4 rounded-xl overflow-hidden shadow-md" : "col-span-3 rounded-xl overflow-hidden shadow-md"}>
        <Skeleton height={200} width={300} />
        <Skeleton height={20} width={300} style={{ marginTop: 10 }} />
        <Skeleton height={20} width={300} style={{ marginTop: 5 }} />
      </div>
    );
  }

  const handleDelete = async (id) => {
    const confirmDelete = confirm('¿Estás seguro de que quieres eliminar este producto?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/productos/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Producto eliminado con éxito');
        // router.refresh(); // Refrescar la página o lista de productos
        window.location.href = window.location.href
      } else {
        const data = await res.json();
        console.error('Error al eliminar el producto:', data.error);
        alert('Error al eliminar el producto');
      }
    } catch (error) {
      console.error('Error en la petición:', error);
      alert('Hubo un error al eliminar el producto');
    }
  };
  return (
    <div className={pathName.startsWith("/cuenta/") ? "col-span-12 sm:col-span-6 md:col-span-4 rounded-xl overflow-hidden shadow-md" : "col-span-12 md:col-span-4 lg:col-span-3 rounded-xl overflow-hidden shadow-md"}>
      <Link href={`/producto/${producto._id}`}>
        <img src={producto.logo} alt="" className='h-40 w-full object-cover' />
        <div className="p-3">
          <div className="flex gap-4 pb-3">
            <span className='text-green-700 bg-green-100 px-2 py-1 text-sm font-semibold rounded-full'>{producto.descuento}</span>
            <span className='bg-gray-200 text-gray-500 px-2 py-1 text-sm font-semibold rounded-full'>{producto.categoria}</span>
          </div>
          <h1 className='font-semibold'>
            {producto.nombre}
          </h1>
          <p className='text-sm text-gray-800 font-light line-clamp-2'>
            {producto.descripcion}
          </p>
        </div>
      </Link>
      {
        pathName.startsWith("/cuenta/") ?
          <div className="flex gap-4 justify-end mt-3 p-3">
            <Image onClick={() => handleDelete(producto._id)} className='hover:cursor-pointer'
              src="https://raw.githubusercontent.com/adrianhajdin/event_platform/fa7a715be4612ad8e17049a8b2ef2ac20ecbf88b/public/assets/icons/delete.svg" alt="edit" width={20} height={20} />
            <Link href={`/cuenta/editar/${producto._id}`}>
              <Image src="https://raw.githubusercontent.com/adrianhajdin/event_platform/fa7a715be4612ad8e17049a8b2ef2ac20ecbf88b/public/assets/icons/edit.svg" alt="edit" width={20} height={20} />
            </Link>
          </div> :
          ""
      }

    </div>
  )
}

export default CardProducto