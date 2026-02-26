export class TextUtil {
  /**
   * Normaliza un texto: minúsculas, reemplaza 'ñ' por 'ni', elimina acentos y colapsa espacios.
   */
  static normalizar(texto: string | null): string | null {
    if (texto === null || texto === undefined) {
      return null;
    }

    // 1. Lowercase
    let resultado = texto.toLowerCase();

    // 2. Replace 'ñ' with 'ni'
    resultado = resultado.replace(/ñ/g, 'ni');

    // 3. Normalize and remove accents (KEEP DOTS)
    const normalized = resultado
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    return normalized.trim().replace(/\s+/g, ' '); // Replace multiple spaces with one
  }

  /**
   * Normaliza un texto y además elimina los puntos.
   */
  static normalizarSinPuntos(texto: string | null): string | null {
    const res = this.normalizar(texto);
    return res !== null ? res.replace(/\./g, '') : null;
  }
}
