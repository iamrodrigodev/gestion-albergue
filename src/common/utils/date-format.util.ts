export const obtenerFechaYHoraActual = () => {
  const ahora = new Date();
  const fecha = ahora.toISOString().split('T')[0];
  const hora = ahora.toTimeString().split(' ')[0];

  return { fecha, hora };
};
