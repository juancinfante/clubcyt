"use client";
import { useState } from "react";
import Datatable from "@/components/DataTable/Datatable";
import Navbar from "@/components/Navbar";
import DatatablePromociones from "@/components/DataTable/DatatablePromociones";
import DatatableUsuarios from "@/components/DataTable/DatatableUsuarios";
import DatatableCodigos from "@/components/DataTable/DatatableCodigos";

const Page = () => {
    const [activeTable, setActiveTable] = useState("productos"); // Estado para la tabla activa

    const handleTableChange = (table) => {
        setActiveTable(table); // Cambiar la tabla activa
    };

    return (
        <>
            <Navbar />
            <div className="container max-w-6xl mx-auto pt-36">
                {/* Botones o elementos para cambiar entre tablas */}
                <div className="flex justify-around mb-4">
                    <button
                        onClick={() => handleTableChange("productos")}
                        className={`px-4 py-2 rounded-lg ${
                            activeTable === "productos" ? "bg-blue-500 text-white" : "bg-gray-200"
                        }`}
                    >
                        Productos
                    </button>
                    <button
                        onClick={() => handleTableChange("promociones")}
                        className={`px-4 py-2 rounded-lg ${
                            activeTable === "promociones" ? "bg-blue-500 text-white" : "bg-gray-200"
                        }`}
                    >
                        Promociones
                    </button>
                    <button
                        onClick={() => handleTableChange("usuarios")}
                        className={`px-4 py-2 rounded-lg ${
                            activeTable === "usuarios" ? "bg-blue-500 text-white" : "bg-gray-200"
                        }`}
                    >
                        Usuarios
                    </button>
                    <button
                        onClick={() => handleTableChange("codigos")}
                        className={`px-4 py-2 rounded-lg ${
                            activeTable === "codigos" ? "bg-blue-500 text-white" : "bg-gray-200"
                        }`}
                    >
                        Codigos
                    </button>
                </div>

                {/* Renderizar la tabla correspondiente */}
                {activeTable === "productos" && <Datatable />}
                {activeTable === "promociones" && <DatatablePromociones/>}
                {activeTable === "usuarios" && <DatatableUsuarios />}
                {activeTable === "codigos" && <DatatableCodigos />}
            </div>
        </>
    );
};

export default Page;
