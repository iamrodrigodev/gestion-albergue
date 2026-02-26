export interface ApiResponse<T = any> {
  estado: number;
  codigoEstado: string;
  mensaje: string;
  fecha: string;
  hora: string;
  ruta: string;
  datos?: T | null;
}
