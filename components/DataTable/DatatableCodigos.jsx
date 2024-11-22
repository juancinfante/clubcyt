import React, { useEffect, useState } from 'react';
import DataTable from "react-data-table-component";
import Swal from 'sweetalert2';

const DatatableCodigos = () => {
    const [codigos, setCodigos] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [page, setPage] = useState(1); // Página actual
    const [totalPages, setTotalPages] = useState(1); // Total de páginas
    const [loading, setLoading] = useState(false); // Indicador de carga
    const [showModal, setShowModal] = useState(false); // Controlar visibilidad del modal
    const [selectedCodigo, setSelectedCodigo] = useState(null); // Código seleccionado para editar
    const [codigo, setCodigo] = useState('');
    const [cantidad, setCantidad] = useState('');

    // Agregar un nuevo código
    const handleAddCodigo = async () => {
        if (!codigo || !cantidad) {
            Swal.fire({
                title: 'Error',
                text: 'Por favor, complete todos los campos.',
                icon: 'error'
            });
            return;
        }

        try {
            const response = await fetch(`/api/codigos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ codigo, cantidad })
            });

            const data = await response.json();
            if (response.ok) {
                Swal.fire({
                    title: 'Código agregado',
                    icon: 'success'
                });
                fetchCodigos(page); // Recargar los códigos después de agregar
                setCodigo(''); // Limpiar el campo de código
                setCantidad(''); // Limpiar el campo de cantidad
            } else {
                Swal.fire({
                    title: 'Error',
                    text: data.error || 'Hubo un error al agregar el código',
                    icon: 'error'
                });
            }
        } catch (error) {
            console.error('Error al agregar el código:', error);
            Swal.fire({
                title: 'Error',
                text: 'Hubo un error al procesar la solicitud.',
                icon: 'error'
            });
        }
    };

    // Obtener codigos con paginación y filtros
    const fetchCodigos = async (search = '', page = 1, limit = 10) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/codigos?search=${search}&page=${page}&limit=${limit}`);
            const data = await response.json();
            setCodigos(data.codigos);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Error al obtener los códigos:", error);
        } finally {
            setLoading(false);
        }
    };

    // Editar código
    const handleEdit = (codigo) => {
        setSelectedCodigo(codigo);
        setCodigo(codigo.codigo);
        setCantidad(codigo.cantidad);
        setShowModal(true);
    };

    // Guardar los cambios de la edición
    const handleSave = async () => {
        try {
            const response = await fetch(`/api/codigos`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: selectedCodigo._id,
                    codigo,
                    cantidad
                })
            });

            const data = await response.json();
            if (response.ok) {
                Swal.fire({
                    title: 'Código actualizado',
                    icon: 'success'
                });
                fetchCodigos(page); // Recargar los códigos después de editar
                setShowModal(false); // Cerrar modal
            } else {
                Swal.fire({
                    title: 'Error',
                    text: data.error || 'Hubo un error al actualizar el código',
                    icon: 'error'
                });
            }
        } catch (error) {
            console.error('Error al guardar los cambios:', error);
            Swal.fire({
                title: 'Error',
                text: 'Hubo un error al procesar la solicitud.',
                icon: 'error'
            });
        }
    };

    // Eliminar código
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });
    
        if (result.isConfirmed) {
            try {
                const response = await fetch(`/api/codigos`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id }), // Enviar el id en el cuerpo de la solicitud
                });
    
                // Asegúrate de que la respuesta tenga un cuerpo JSON
                const data = response.ok ? await response.json() : {};
    
                if (response.ok) {
                    Swal.fire({
                        title: 'Código eliminado',
                        icon: 'success'
                    });
                    fetchCodigos(page); // Recargar los códigos después de eliminar
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: data.error || 'Hubo un error al eliminar el código',
                        icon: 'error'
                    });
                }
            } catch (error) {
                console.error('Error al eliminar el código:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un error al procesar la solicitud.',
                    icon: 'error'
                });
            }
        }
    };
    // Columnas de la tabla
    const columns = [
        {
            name: "Nombre",
            selector: row => row.codigo,
            width: '200px',
        },
        {
            name: "Cantidad",
            selector: row => row.cantidad,
            width: '100px',
        },
        {
            name: "Acciones",
            cell: row => (
                <div className="flex gap-3">
                    <a
                        onClick={() => handleEdit(row)}
                        className="bg-blue-100 px-2 py-1 rounded-lg hover:bg-blue-300 cursor-pointer">
                        Editar
                    </a>
                    <a
                        onClick={() => handleDelete(row._id)}
                        className="bg-red-100 px-2 py-1 rounded-lg hover:bg-red-300 cursor-pointer">
                        Eliminar
                    </a>
                </div>
            ),
            width: '200px',
        },
    ];
    

    // Manejar cambios en la página
    const handlePageChange = (newPage) => {
        setPage(newPage);
        fetchCodigos(busqueda, newPage);
    };

    useEffect(() => {
        fetchCodigos(busqueda, page);
    }, [busqueda]);

    const paginationComponentOptions = {
        rowsPerPageText: 'Filas por página',
        rangeSeparatorText: 'de',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'Todos',
    };

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

            {/* Formulario para agregar código */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Agregar Código</h3>
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)}
                        placeholder="Código"
                        className="border px-3 py-2 w-full rounded-lg"
                    />
                    <input
                        type="number"
                        value={cantidad}
                        onChange={(e) => setCantidad(e.target.value)}
                        placeholder="Cantidad"
                        className="border px-3 py-2 w-full rounded-lg"
                    />
                    <button
                        onClick={handleAddCodigo}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg"
                    >
                        Agregar
                    </button>
                </div>
            </div>

            {/* Tabla */}
            <DataTable
                className="mt-4"
                columns={columns}
                data={codigos} // Pasamos los datos obtenidos
                pagination
                paginationServer
                paginationTotalRows={totalPages * 10} // Total de filas aproximadas
                paginationPerPage={10} // Filas por página
                onChangePage={handlePageChange}
                paginationComponentOptions={paginationComponentOptions}
                progressPending={loading} // Indicador de carga
            />

            {/* Modal de edición */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg w-1/3">
                        <h2 className="text-xl mb-4">Editar Código</h2>
                        <div className="mb-4">
                            <label htmlFor="nombre" className="block">Codigo</label>
                            <input
                                type="text"
                                id="nombre"
                                value={codigo}
                                onChange={(e) => setCodigo(e.target.value)}
                                className="border px-3 py-2 w-full rounded-lg"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="cantidad" className="block">Cantidad</label>
                            <input
                                type="number"
                                id="cantidad"
                                value={cantidad}
                                onChange={(e) => setCantidad(e.target.value)}
                                className="border px-3 py-2 w-full rounded-lg"
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DatatableCodigos;
