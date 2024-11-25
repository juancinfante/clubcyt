export default function formatFecha(fecha) {
    const date = new Date(fecha);
    const dia = date.getDate().toString().padStart(2, '0'); // Asegura dos dígitos
    const mes = (date.getMonth() + 1).toString().padStart(2, '0'); // Meses empiezan desde 0
    const anio = date.getFullYear();
    return `${dia}-${mes}-${anio}`;
  }

