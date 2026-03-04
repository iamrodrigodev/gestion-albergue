export interface ApiResponse<T> {
  estado: number;
  codigoEstado: string;
  mensaje: string;
  fecha: string;
  hora: string;
  ruta: string;
  datos?: T | null;
}
