// ============================================
// TIPOS Y INTERFACES - ArtMap Resistencia
// Equipo JGJ - Modelo COPROMAR
// ============================================

/**
 * Estado de conservación de una obra
 */
export type EstadoObra = 'optimo' | 'deteriorado';

/**
 * Categorías de obras de arte urbano
 */
export type CategoriaObra = 
  | 'escultura' 
  | 'mural' 
  | 'monumento' 
  | 'instalacion' 
  | 'relieve';

/**
 * Materiales utilizados en las obras
 */
export type MaterialObra = 
  | 'bronce' 
  | 'piedra' 
  | 'cemento' 
  | 'metal' 
  | 'madera' 
  | 'mixto';

/**
 * Coordenadas GPS
 */
export interface Coordenadas {
  latitud: number;
  longitud: number;
}

/**
 * Datos de relevamiento de una obra
 */
export interface DatosRelevamiento {
  coordenadas: Coordenadas;
  titulo: string;
  autor: string;
  anio: number;
  material: MaterialObra;
  categoria: CategoriaObra;
  estado: EstadoObra;
  observaciones: string;
  fechaRelevamiento: Date;
  imagenUrl?: string;
}

/**
 * Obra de arte completa
 */
export interface Obra {
  id: string;
  titulo: string;
  autor: string;
  anio: number;
  descripcion: string;
  categoria: CategoriaObra;
  material: MaterialObra;
  coordenadas: Coordenadas;
  direccion: string;
  imagenUrl: string;
  estado: EstadoObra;
  cantidadVotos: number;
}

/**
 * Filtros para el catálogo
 */
export interface FiltrosCatalogo {
  autor: string;
  material: MaterialObra | 'todos';
  categoria: CategoriaObra | 'todos';
  busqueda: string;
}

/**
 * Datos de validación para votación
 */
export interface DatosValidacionVoto {
  dni: string;
  telefono: string;
}

/**
 * Estado del voto
 */
export type EstadoVoto = 'pendiente' | 'procesando' | 'exitoso' | 'error';

/**
 * Datos de un votante para el leaderboard
 */
export interface Votante {
  dni: string;
  nombre?: string;
  cantidadVotos: number;
}
