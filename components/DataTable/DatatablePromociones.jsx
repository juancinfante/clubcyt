import React, { useEffect, useState } from 'react';
import DataTable from "react-data-table-component";
import Swal from 'sweetalert2';
import { Spinner } from '@nextui-org/spinner';

const DatatablePromociones = () => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState(""); // Estado para la búsqueda

  const [isModalOpenPromocion, setIsModalOpenPromocion] = useState(false); // Estado para manejar el modal
  const handleOpenModalPromocion = () => setIsModalOpenPromocion(true);  // Función para abrir el modal
  const handleCloseModalPromocion = () => setIsModalOpenPromocion(false);

  const [productoId, setProductoId] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [promocionP, setPromocionP] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const [loadingForm, setLoadingForm] = useState(false);

  const fetchProductos = async () => {
    const response = await fetch("api/promociones");
    const data = await response.json();
    setProductos(data);
    console.log(data);
  };

  
// Función para subir la imagen a Cloudinary
const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "albums"); // Configurado en Cloudinary

  const response = await fetch(`https://api.cloudinary.com/v1_1/dwjhbrsmf/image/upload`, {
      method: "POST",
      body: formData
  });

  const data = await response.json();
  return data.secure_url; // Retorna el URL seguro de la imagen
};

  const handleForm = async () => {
    setLoadingForm(true)
    try {
        const uploadImageUrl = selectedImage ? await uploadImage(selectedImage) : imagePreview;

        const formData = {
            imagen: uploadImageUrl,
            descripcion: descripcion,
            promocion: promocionP,
            desde: fechaInicio,
            hasta: fechaFin
        }

        // Realizar el fetch POST a la API
        const response = await fetch(`/api/promociones/${productoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData), // Convertir los datos a JSON
        });
        if (response.ok) {
            setLoadingForm(false)
            Swal.fire({
                icon: "success",
                text: "Promocion actualizada.",
            });
            setTimeout(function () {
                window.location.reload(true);
            }, 1500);
            setIsModalOpenPromocion(false)
        } else {
            setLoadingForm(false)
            Swal.fire({
                icon: "warning",
                text: "Hubo un error al crear la promocion.",
            });
        }

    } catch (error) {
        console.log(error)
    }
}


  // Filtrar los productos según el texto ingresado
  const productosFiltrados = productos.filter(producto =>
    producto.productoId.nombre.toLowerCase().includes(busqueda.toLowerCase())
    // producto.categoria.toLowerCase().includes(busqueda.toLowerCase()) ||
    // producto.provincia.toLowerCase().includes(busqueda.toLowerCase())
  );

  function convertirFecha(fechaISO) {
    const [año, mes, día] = fechaISO.split('-');
    return `${día}-${mes}-${año}`;
  }

  const columns = [
    {
      name: "Imagen",
      selector: row => (
        <img
          src={row.imagen}
          alt=""
          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
        />
      ),
      width: '100px'
    },
    {
      name: "Producto/Comercio",
      selector: row => row.productoId.nombre,
      width: '200px',
      sortable: true,
    },
    {
      name: "Promocion",
      selector: row => row.promocion,
      width: '120px',
      sortable: true,
    },
    {
      name: "Desde",
      selector: row => convertirFecha(row.desde),
      width: '120px',
      sortable: true,
    },
    {
      name: "Hasta",
      selector: row => convertirFecha(row.hasta),
      width: '120px',
      sortable: true,
    },
    {
      name: "Creado",
      selector: row => formatFecha(row.createdAt),
      width: '200px',
      sortable: true,
    },

    {
      name: "Acciones",
      cell: row =>
        <div className='flex gap-3'>
          <a onClick={() => {
            handleOpenModalPromocion()
            setImagePreview(row.imagen)
            setDescripcion(row.descripcion)
            setFechaInicio(row.desde)
            setFechaFin(row.hasta)
            setPromocionP(row.promocion)
            setProductoId(row._id)
          }
          } className='bg-gray-100 px-2 py-1 rounded-lg hover:bg-gray-300 transition duration-200 ease-in-out cursor-pointer'>EDITAR</a>
          <a onClick={() => handleDelete(row._id)} className='bg-gray-100 px-2 py-1 rounded-lg hover:bg-gray-300 transition duration-200 ease-in-out cursor-pointer'>BORRAR</a>
        </div>,
      width: '200px',
    },
  ];

  function formatFecha(fecha) {
    const date = new Date(fecha);
    const dia = date.getDate().toString().padStart(2, '0'); // Asegura dos dígitos
    const mes = (date.getMonth() + 1).toString().padStart(2, '0'); // Meses empiezan desde 0
    const anio = date.getFullYear();
    return `${dia}-${mes}-${anio}`;
}
  const paginationComponentOptions = {
    rowsPerPageText: 'Filas por página',
    rangeSeparatorText: 'de',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos',
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
        title: "Eliminar promo?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Eliminar"
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const res = await fetch(`/api/promociones/${id}`, {
                    method: 'DELETE',
                });

                if (res.ok) {
                    Swal.fire({
                        title: "Tu promocion fue eliminada.",
                        icon: "success"
                    });
                    // router.refresh(); // Refrescar la página o lista de productos
                    setTimeout(() => {
                        // Código que quieres retardar
                        window.location.href = window.location.href
                    }, 1500);
                } else {
                    const data = await res.json();
                    console.error('Error al eliminar la promocion:', data.error);
                    alert('Error al eliminar la promocion');
                }
            } catch (error) {
                console.error('Error en la petición:', error);
                alert('Hubo un error al eliminar la promocion');
            }
        }
    });
};
  useEffect(() => {
    fetchProductos();
  }, []);

  return (
    <div>
      {/* Input de búsqueda */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
      </div>

      <DataTable
        className="mt-4"
        columns={columns}
        data={productosFiltrados} // Pasamos los datos filtrados
        pagination
        paginationComponentOptions={paginationComponentOptions}
        dense
      />
      {isModalOpenPromocion && (
        <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 max-h-[500px] overflow-y-auto ">
                  <div className="sm:flex sm:items-start">
                    <div className="container mx-auto flex justify-center mt-10">
                      <div className="max-w-xl mx-auto bg-white rounded-lg">
                        <h1 className="text-2xl font-bold mb-4">Editar Promocion</h1>

                        {/* Subir Imagen */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700" htmlFor="image">
                            Subir Imagen
                          </label>
                          <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                          />

                          {/* Previsualización de la imagen */}
                          {imagePreview && (
                            <div className="mt-4">
                              <img
                                src={imagePreview}
                                alt="Previsualización"
                                className="w-full h-48 object-cover rounded-md border border-gray-300"
                              />
                            </div>
                          )}
                        </div>

                        {/* Descripción */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700" htmlFor="description">
                            Breve descripción
                          </label>
                          <textarea
                            id="description"
                            rows="3"
                            className="mt-2 block w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Descripción de la promocion..."
                            onChange={(e) => setDescripcion(e.target.value)}
                            value={descripcion}
                          ></textarea>
                        </div>

                        {/* Seleccionar Promoción */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700" htmlFor="promotion">
                            Promoción
                          </label>
                          <select
                            id="promotion"
                            value={promocionP}
                            className="mt-2 block w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            onChange={(e) => setPromocionP(e.target.value)}
                          >
                            <option value="">Selecciona una promoción</option>
                            <option value="2x1">2x1</option>
                            <option value="3x1">3x1</option>
                            <option value="50% off">50% off</option>
                          </select>
                        </div>

                        {/* Fecha de inicio */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700" htmlFor="start-date">
                            Valido desde:
                          </label>
                          <input
                            type="date"
                            value={fechaInicio}
                            id="start-date"
                            className="mt-2 block w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            onChange={(e) => setFechaInicio(e.target.value)}
                          // min={today}
                          />
                        </div>

                        {/* Fecha de fin */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700" htmlFor="end-date">
                            Hasta
                          </label>
                          <input
                            type="date"
                            value={fechaFin}
                            id="end-date"
                            className="mt-2 block w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            onChange={(e) => setFechaFin(e.target.value)}
                          />
                        </div>
                        {/* Botón Enviar */}
                        <div className="mt-6">
                          <button
                            type="submit"
                            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          onClick={handleForm}
                          >
                            {
                              loadingForm ?
                                <Spinner color='default' size='sm' /> : "Crear"
                            }
                          </button>
                        </div>

                      </div>
                    </div>
                  </div>

                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={handleCloseModalPromocion} // Cierra el modal
                  >
                    cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      )}
    </div>
  );
};

export default DatatablePromociones;
