import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react'
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import Swal from 'sweetalert2';
import OptimizedImage from './OptimizedImage';

const CardProducto = ({ producto, loading }) => {
  const router = useRouter()
  const pathName = usePathname();

  if (loading) {
    // Mostrar skeletons cuando loading sea true
    return (
      <div className={pathName != "/" ? "col-span-12 sm:col-span-6 md:col-span-4 rounded-xl overflow-hidden shadow-md" : "col-span-12 sm:col-span-6 md:col-span-3 rounded-xl overflow-hidden shadow-md"}>
        <Skeleton height={200} />
        <Skeleton height={20} style={{ marginTop: 10 }} />
        <Skeleton height={20} style={{ marginTop: 5 }} />
      </div>
    );
  }
  const suscribirse = async () => {
    try {
      const response = await fetch("/api/suscribirse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, producto }), // Enviamos al backend
      });

      if (!response.ok) {
        throw new Error("Error al crear la suscripción");
      }

      const data = await response.json();
      // Redirigimos al usuario a Mercado Pago
      window.location.href = data.url;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Eliminar producto?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`/api/productos/${id}`, {
            method: 'DELETE',
          });

          if (res.ok) {
            Swal.fire({
              title: "Tu producto fue eliminado.",
              icon: "success"
            });
            // router.refresh(); // Refrescar la página o lista de productos
            setTimeout(() => {
              // Código que quieres retardar
              window.location.href = window.location.href
            }, 1500);
          } else {
            const data = await res.json();
            console.error('Error al eliminar el producto:', data.error);
            alert('Error al eliminar el producto');
          }
        } catch (error) {
          console.error('Error en la petición:', error);
          alert('Hubo un error al eliminar el producto');
        }
      }
    });
  };

  const handleComercio = async (producto) => {
    Swal.fire({
      title: `Deseas activar ${producto.nombre} ? `,
      showDenyButton: true,
      confirmButtonText: "SI",
      denyButtonText: `Cancelar`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        let timerInterval;
        Swal.fire({
          html: "Redirigiendo...",
          timer: 1500,
          timerProgressBar: true,
          didOpen: () => {
            localStorage.setItem("id_producto", producto._id);
            Swal.showLoading();
            const timer = Swal.getPopup().querySelector("b");
            timerInterval = setInterval(() => {
              // timer.textContent = `${Swal.getTimerLeft()}`;
              // router.push("https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c93808473dd91620173de7e3e8803d6")
              suscribirse()
            }, 1000);
          },
          willClose: () => {
            clearInterval(timerInterval);
          }
        }).then((result) => {
          /* Read more about handling dismissals below */
          if (result.dismiss === Swal.DismissReason.timer) {
            console.log("I was closed by the timer");
          }
        });
      }

    });
  }

  return (
    <div className={pathName.startsWith("/cuenta") ? "col-span-12 sm:col-span-6 md:col-span-4 rounded-xl overflow-hidden" : "col-span-12 md:col-span-4 rounded-xl overflow-hidden"}>
      <Link href={`/comercio/${producto.slug}`}>
        <OptimizedImage
          url={producto.logo}
          alt={producto.nombre}
          width={300}
          height={210}
          crop="fill"
          className="h-full w-full object-cover"
        />
        <div className=" pt-3">
          <div className="flex gap-4 pb-2">
            {
              producto.descuento != "Ninguno" ?
                <span className='text-green-700 bg-green-100 px-2 py-1 text-sm font-semibold rounded-md'>{producto.descuento}</span>
                :
                ""
            }
            <span className='bg-gray-200 text-gray-500 px-2 py-1 text-sm font-semibold rounded-md'>{producto.categoria}</span>
            {pathName.startsWith("/cuenta") ?
              <span className={producto.activado ? "bg-green-100 text-green-700 px-2 py-1 text-sm font-semibold rounded-full" : "bg-red-200 text-red-500 px-2 py-1 text-sm font-semibold rounded-full"}>{producto.activado ? "Activo" : "Inactivo"}</span>
              : ""
            }
          </div>
          <h1 className='font-semibold'>
            {producto.nombre}
          </h1>
        </div>
      </Link>
      {
        pathName.startsWith("/cuenta") ?
          <div className={producto.activado ? "flex gap-4 justify-end mt-3 p-3" : "flex gap-4 justify-between mt-3 p-3"}>
            {!producto.activado ?
              <button onClick={() => handleComercio(producto)} className='border-b-1 border-black'>Activar comercio</button>
              :
              ""}
            <div className='flex justify-center items-center gap-3'>
              <Image onClick={() => handleDelete(producto._id)} className='hover:cursor-pointer'
                src="https://raw.githubusercontent.com/adrianhajdin/event_platform/fa7a715be4612ad8e17049a8b2ef2ac20ecbf88b/public/assets/icons/delete.svg" alt="edit" width={25} height={25} />
              <Link href={`/cuenta/editar/${producto._id}`}>
                <Image src="https://raw.githubusercontent.com/adrianhajdin/event_platform/fa7a715be4612ad8e17049a8b2ef2ac20ecbf88b/public/assets/icons/edit.svg" alt="edit" width={25} height={25} />
              </Link>
            </div>
          </div> :
          ""
      }

    </div>
  )
}

export default CardProducto