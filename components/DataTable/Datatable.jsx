import formatFecha from '@/utils/convertFecha';
import { Button } from '@nextui-org/button';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/dropdown';
import { Tooltip } from '@nextui-org/tooltip';
import React, { useEffect, useState } from 'react';
import DataTable from "react-data-table-component";
import Swal from 'sweetalert2';
import { Modal, ModalBody, ModalHeader, ModalFooter, useDisclosure, ModalContent } from '@nextui-org/modal';
import { VerticalDotsIcon } from '../VerticalDotsIcon';
import { EditIcon } from '../EditIcon';
import { EyeIcon } from '../EyeIcon';
import { DeleteIcon } from '../DeleteIcon';
import { RedirectIcon } from '../RedirectIcon';

// Hook personalizado para debounce
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpiar el temporizador si el valor cambia antes de que pase el tiempo
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}




const Datatable = () => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState(""); // Estado para la búsqueda
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // Página actual

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = useState(null);


  // Estado con debounce para evitar búsquedas constantes
  const debouncedBusqueda = useDebounce(busqueda, 500); // Retraso de 500 ms

  const fetchProductos = async (page = 1, limit = perPage) => {
    setLoading(true);
    const response = await fetch(`/api/productos?text=${busqueda}&page=${page}&limit=${limit}&admin=true`);
    const data = await response.json();
    setProductos(data.productos);
    setTotalRows(data.totalProductos);
    setLoading(false);
  };

  const handlePageChange = (page) => {
    setPage(page)
    fetchProductos(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
    fetchProductos(page, newPerPage);
  };

  useEffect(() => {
    fetchProductos(page); // Cargar la primera página al montar el componente
  }, [debouncedBusqueda]);

  // Filtrar los productos según el texto ingresado
  const productosFiltrados = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    producto.categoria.toLowerCase().includes(busqueda.toLowerCase()) ||
    (producto.codigoPromo && producto.codigoPromo.toLowerCase().includes(busqueda.toLowerCase())) || // Verifica si existe y es válido
    producto.provincia.toLowerCase().includes(busqueda.toLowerCase())
  );


  const columns = [
    {
      name: "Logo",
      selector: row => (
        <img
          src={row.logo}
          alt=""
          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
        />
      ),
      width: '100px'
    },
    {
      name: "Nombre",
      selector: row => row.nombre,
      width: '150px',
      sortable: true,
    },
    {
      name: "Categoría",
      selector: row => row.categoria,
      width: '150px',
      sortable: true,
    },
    {
      name: "Provincia",
      selector: row => row.provincia,
      width: '150px',
      sortable: true,
    },
    {
      name: "Suscripción",
      selector: row => row.status == "authorized" ? <p className='bg-green-200 text-green-800 px-3 py-1 rounded-lg'>Activada</p> : row.status == "cancelled" ? <p className='bg-red-200 text-red-800 px-3 py-1 rounded-lg'>Cancelada</p> : <p className='bg-blue-200 text-blue-800 px-3 py-1 rounded-lg'>No tiene</p>,
      width: '150px',
      sortable: true,
    },
    {
      name: "Fecha creacion",
      selector: row => formatFecha(row.createdAt),
      width: '150px',
      sortable: true,
    },
    {
      name: "Codigo Promo",
      selector: row => row.codigoPromo ? row.codigoPromo : "No usado",
      width: '150px',
      sortable: true,
    },
    {
      name: "Acciones",
      selector: row => (
        <div className="relative flex items-center gap-2">
          <Tooltip color="danger" content="Ver">
            <a href={`/comercio/${row.slug}`} target='_blank' className="text-2xl text-danger cursor-pointer active:opacity-50">
              <RedirectIcon />
            </a>
          </Tooltip>
          <Tooltip content="Detalles">
            <button onClick={() => {
              setSelectedProduct(row); // Establece el producto seleccionado
              onOpen(); // Abre el modal
            }} className="text-2xl text-default-400 cursor-pointer active:opacity-50">
              <EyeIcon />
            </button>
          </Tooltip>
          <Tooltip content="Editar">
            <a href={`/cuenta/editar/${row._id}`} target='_blank' className="text-2xl text-default-400 cursor-pointer active:opacity-50">
              <EditIcon />
            </a>
          </Tooltip>
          <Tooltip color="danger" content="Eliminar">
            <button onClick={() => handleDelete(row._id)} className="text-2xl text-danger cursor-pointer active:opacity-50">
              <DeleteIcon />
            </button>
          </Tooltip>
        </div>
      ),
      width: '150px',
      sortable: true,
    }

  ];

  const paginationComponentOptions = {
    rowsPerPageText: 'Filas por página',
    rangeSeparatorText: 'de',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos',
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


  useEffect(() => {
    fetchProductos();
  }, []);

  return (
    <div>

      {/* Input de búsqueda */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Buscar por nombre, categoría, codigo promocional o provincia"
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

      {/* <DataTable
        className="mt-4"
        columns={columns}
        data={productosFiltrados} // Pasamos los datos filtrados
        pagination
        paginationComponentOptions={paginationComponentOptions}
        dense
      /> */}
      <DataTable
        title="Productos"
        columns={columns}
        data={productosFiltrados}
        progressPending={loading}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        paginationComponentOptions={paginationComponentOptions}
      />
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className="bg-white rounded-xl shadow-lg">
          {(onClose) => (
            <>
              <ModalHeader className="bg-gray-100 px-6 py-4 rounded-t-xl text-lg font-bold text-gray-800">
                Detalles del Producto
              </ModalHeader>
              <ModalBody className="px-6 py-4 space-y-4 text-gray-700">
                {selectedProduct && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-500">Nombre</p>
                      <p className="text-lg text-gray-800">{selectedProduct.nombre}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500">CUIT</p>
                      <p className="text-lg text-gray-800">{selectedProduct.cuit || 'No disponible'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500">Telefono</p>
                      <p className="text-lg text-gray-800">{selectedProduct.telefono || 'No disponible'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500">Celular</p>
                      <p className="text-lg text-gray-800">{selectedProduct.celular || 'No disponible'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500">Razón Social</p>
                      <p className="text-lg text-gray-800">{selectedProduct.razonSocial || 'No disponible'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500">Dirección Fiscal</p>
                      <p className="text-lg text-gray-800">{selectedProduct.direccionFiscal || 'No disponible'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500">Ultima suscripcion</p>
                      <p className="text-lg text-gray-800">{formatFecha(selectedProduct.dateSuscription) == "31-12-1969" ? "-" : formatFecha(selectedProduct.dateSuscription)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500">Ultima Cancelacion</p>
                      <p className="text-lg text-gray-800">{formatFecha(selectedProduct.dateCancelation) == "31-12-1969" ? "-" : formatFecha(selectedProduct.dateCancelation)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500">Creado por</p>
                      <p className="text-lg text-gray-800">{selectedProduct.usuarioId.nombre +  " " + selectedProduct.usuarioId.apellido}</p>
                      <p className="text-lg text-gray-800">{selectedProduct.usuarioId.email}</p>
                    </div>
                    {/* Agrega más campos si es necesario */}
                  </div>
                )}
              </ModalBody>
              <ModalFooter className="bg-gray-100 px-6 py-4 rounded-b-xl flex justify-end">
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  className="bg-red-100 text-red-600 hover:bg-red-200 px-4 py-2 rounded-md"
                >
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>


    </div>
  );
};

export default Datatable;
