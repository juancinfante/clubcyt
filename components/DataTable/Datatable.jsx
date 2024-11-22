import { Button } from '@nextui-org/button';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/dropdown';
import { Tooltip } from '@nextui-org/tooltip';
import React, { useEffect, useState } from 'react';
import DataTable from "react-data-table-component";
import Swal from 'sweetalert2';

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
      name: "Estado",
      selector: row => row.status == "authorized" || row.codigoPromo ?
          <p className='bg-green-100 px-3 py-1 rounded-lg' > Activado </p>
        : row.status == "cancelled" ? <p className='bg-red-100 px-3 py-1 rounded-lg'> Cancelado </p> : <p className='bg-yellow-100 px-3 py-1 rounded-lg'> Pendiente </p>,
      width: '120px',
      sortable: true,
    },
    {
      name: "Codigo Promo",
      selector: row => row.codigoPromo ? row.codigoPromo : "No usado",
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
      name: "Acciones",
      selector: row => 
        <>
          <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  :
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem href={`/comercio/${row.slug}`} target='_blank'>VER</DropdownItem>
                <DropdownItem href={`/cuenta/editar/${row._id}`} target='_blank'>EDITAR</DropdownItem>
                <DropdownItem onClick={() => handleDelete(row._id)}>ELIMINAR</DropdownItem>
              </DropdownMenu>
            </Dropdown>
        </>,
      width: '150px',
      sortable: true,
    },
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

  function formatFecha(fecha) {
    const date = new Date(fecha);
    const dia = date.getDate().toString().padStart(2, '0'); // Asegura dos dígitos
    const mes = (date.getMonth() + 1).toString().padStart(2, '0'); // Meses empiezan desde 0
    const anio = date.getFullYear();
    return `${dia}-${mes}-${anio}`;
  }

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
    </div>
  );
};

export default Datatable;
