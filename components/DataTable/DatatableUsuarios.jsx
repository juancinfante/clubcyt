import formatFecha from '@/utils/convertFecha';
import { Tooltip } from '@nextui-org/tooltip';
import React, { useEffect, useState } from 'react';
import DataTable from "react-data-table-component";
import Swal from 'sweetalert2';
import { RedirectIcon } from '../RedirectIcon';
import { EditIcon } from '../EditIcon';
import { DeleteIcon } from '../DeleteIcon';
import { EyeIcon } from '../EyeIcon';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/modal';
import { Button } from '@nextui-org/button';

const DatatableUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [page, setPage] = useState(1); // Página actual
    const [totalPages, setTotalPages] = useState(1); // Total de páginas
    const [loading, setLoading] = useState(false); // Indicador de carga

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Obtener usuarios con paginación y filtros
    const fetchUsuarios = async (currentPage = 1) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/usuarios?page=${currentPage}&text=${busqueda}`);
            if (!response.ok) throw new Error("Error al obtener los datos");
            const data = await response.json();
            setUsuarios(data.usuarios);
            console.log("busqueda")
            setTotalPages(data.totalPages); // Actualizar total de páginas
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: error.message || "No se pudieron cargar los usuarios.",
                icon: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    // Eliminar usuario
    const handleDelete = async (id) => {
        Swal.fire({
            title: "¿Eliminar usuario?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Eliminar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await fetch(`/api/usuarios`, {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id }),
                    });

                    if (res.ok) {
                        setUsuarios((prev) => prev.filter((usuario) => usuario._id !== id)); // Actualizar el estado directamente
                        Swal.fire({
                            title: "Usuario eliminado correctamente.",
                            icon: "success",
                        });
                    } else {
                        const data = await res.json();
                        Swal.fire({
                            title: "Error",
                            text: data.error || "No se pudo eliminar el usuario.",
                            icon: "error",
                        });
                    }
                } catch (error) {
                    Swal.fire({
                        title: "Error",
                        text: "Hubo un error al procesar la solicitud.",
                        icon: "error",
                    });
                }
            }
        });
    };

    // Editar usuario
    const handleEdit = async (usuario) => {
        const { value: formValues } = await Swal.fire({
            title: 'Editar Usuario',
            html: `
            <input id="nombre" class="swal2-input" placeholder="Nombre" value="${usuario.nombre}" />
            <input id="apellido" class="swal2-input" placeholder="Apellido" value="${usuario.apellido}" />
            <input id="dni" class="swal2-input" placeholder="DNI" value="${usuario.dni}" />
            <input id="email" class="swal2-input" placeholder="Email" value="${usuario.email}" />
            <input id="rol" class="swal2-input" placeholder="Rol" value="${usuario.role}" />
        `,
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => {
                const nombre = document.getElementById('nombre').value;
                const apellido = document.getElementById('apellido').value;
                const dni = document.getElementById('dni').value;
                const email = document.getElementById('email').value;
                const role = document.getElementById('rol').value;

                // Validaciones
                if (!nombre || !apellido || !dni || !email || !role) {
                    Swal.showValidationMessage('Todos los campos son obligatorios');
                    return false;
                }

                // Validar formato del DNI (opcional)
                if (!/^\d+$/.test(dni)) {
                    Swal.showValidationMessage('El DNI debe contener solo números');
                    return false;
                }

                return { nombre, apellido, dni, email, role };
            },
        });

        if (formValues) {
            try {
                const res = await fetch(`/api/usuarios`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: usuario._id, ...formValues }),
                });

                if (res.ok) {
                    const data = await res.json();
                    setUsuarios((prev) =>
                        prev.map((u) => (u._id === usuario._id ? data.usuario : u))
                    ); // Actualizar directamente en el estado
                    Swal.fire({
                        title: "Usuario actualizado correctamente.",
                        icon: "success",
                    });
                } else {
                    const data = await res.json();
                    Swal.fire({
                        title: "Error",
                        text: data.error || "No se pudo actualizar el usuario.",
                        icon: "error",
                    });
                }
            } catch (error) {
                Swal.fire({
                    title: "Error",
                    text: "Hubo un error al procesar la solicitud.",
                    icon: "error",
                });
            }
        }
    };

    // Columnas de la tabla
    const columns = [
        {
            name: "Nombre y Apellido",
            selector: (row) => <p>{row.nombre} {row.apellido}</p>,
            width: '200px',
        },
        {
            name: "Email",
            selector: (row) => row.email,
            width: '250px',
            sortable: true,
        },
        {
            name: "DNI",
            selector: (row) => row.dni,
            width: '100px',
        },
        {
            name: "Ingreso",
            selector: (row) => formatFecha(row.createdAt),
            width: '110px',
        },
        {
            name: "Rol",
            selector: (row) => row.role == "admin" ? (
                <p className='bg-green-200 text-green-800 px-3 py-1 rounded-lg'>Admin</p>
            ) : row.role == "user" ? (
                <p className='bg-blue-200 text-blue-800 px-3 py-1 rounded-lg'>Miembro</p>
            ) : "",
            width: '110px',
            sortable: true,
        },
        {
            name: <div className='flex flex-col'>
                <p>Estado</p>
                <p>Suscripción</p>
            </div>,
            selector: (row) => row.status == "authorized" ? (
                <p className='bg-green-200 text-green-800 px-3 py-1 rounded-lg'>Activada</p>
            ) : row.status == "cancelled" ? (
                <p className='bg-red-200 text-red-800 px-3 py-1 rounded-lg'>Cancelada</p>
            ) : <p className='bg-blue-200 text-blue-800 px-3 py-1 rounded-lg'>No tiene</p>,
            width: '130px',
            sortable: true,
        },
        // {
        //     name: "Acciones",
        //     cell: (row) => (
        //         <div className='flex gap-3'>
        //             <a
        //                 onClick={() => handleEdit(row)}
        //                 className='bg-gray-300 px-2 py-1 rounded-lg hover:bg-gray-400 transition duration-200 ease-in-out cursor-pointer'>
        //                 EDITAR
        //             </a>
        //             <a
        //                 onClick={() => handleDelete(row._id)}
        //                 className='bg-gray-300 px-2 py-1 rounded-lg hover:bg-gray-400 transition duration-200 ease-in-out cursor-pointer'>
        //                 BORRAR
        //             </a>
        //         </div>
        //     ),
        //     width: '300px',
        // },
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
                        <button onClick={() => handleEdit(row)} className="text-2xl text-default-400 cursor-pointer active:opacity-50">
                            <EditIcon />
                        </button>
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

    // Manejar cambios en la página
    const handlePageChange = (newPage) => {
        setPage(newPage);
        fetchUsuarios(newPage);
    };

    useEffect(() => {
        fetchUsuarios(page);
    }, [busqueda, page]); // Ahora escucha los cambios en `busqueda` y `page`

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
                    placeholder="Buscar por nombre, categoría o provincia"
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
                data={usuarios}
                pagination
                paginationServer
                paginationTotalRows={totalPages * 10} // Total de filas aproximadas
                paginationPerPage={10} // Filas por página
                onChangePage={handlePageChange}
                paginationComponentOptions={paginationComponentOptions}
                progressPending={loading}
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
                                            <p className="text-lg text-gray-800">{selectedProduct.dni || 'No disponible'}</p>
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
                                            <p className="text-sm font-semibold text-gray-500">Rol</p>
                                            <p className="text-lg text-gray-800">{selectedProduct.role || 'No disponible'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-500">Estado Suscripcion</p>
                                            <p className="text-lg text-gray-800">{selectedProduct.status == "authorized" ? "Activada" : selectedProduct.status == "cancelled" ? "Cancelada" : 'No tiene' }</p>
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

export default DatatableUsuarios;
