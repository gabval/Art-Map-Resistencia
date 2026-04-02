// ============================================
// DATOS DE DEMOSTRACIÓN - ArtMap Resistencia
// Equipo JGJ - Modelo COPROMAR
// ============================================

import type { Obra } from './tipos';

/**
 * Obras de arte de demostración para el catálogo
 * Basadas en obras reales de Resistencia, la Ciudad de las Esculturas
 */
export const obrasDemostracion: Obra[] = [
  {
    id: '1',
    titulo: 'El Pensador del Chaco',
    autor: 'Carlos Schenone',
    anio: 1988,
    descripcion: 'Escultura en bronce que representa la reflexión sobre la identidad chaqueña. Ubicada en la Plaza 25 de Mayo.',
    categoria: 'escultura',
    material: 'bronce',
    coordenadas: { latitud: -27.4513, longitud: -58.9867 },
    direccion: 'Plaza 25 de Mayo, Centro',
    imagenUrl: '/obras/pensador-chaco.jpg',
    estado: 'optimo',
    cantidadVotos: 234,
  },
  {
    id: '2',
    titulo: 'Mujer de la Tierra',
    autor: 'María Esther Gómez',
    anio: 1992,
    descripcion: 'Homenaje a la mujer chaqueña trabajadora. Representa la fuerza y dignidad de la mujer del interior.',
    categoria: 'escultura',
    material: 'piedra',
    coordenadas: { latitud: -27.4525, longitud: -58.9834 },
    direccion: 'Av. 9 de Julio 500',
    imagenUrl: '/obras/mujer-tierra.jpg',
    estado: 'optimo',
    cantidadVotos: 189,
  },
  {
    id: '3',
    titulo: 'El Quebracho Colorado',
    autor: 'Roberto Fernández',
    anio: 2005,
    descripcion: 'Monumento al árbol símbolo del Chaco. Representa la resistencia y fortaleza del monte chaqueño.',
    categoria: 'monumento',
    material: 'metal',
    coordenadas: { latitud: -27.4489, longitud: -58.9912 },
    direccion: 'Parque 2 de Febrero',
    imagenUrl: '/obras/quebracho-colorado.jpg',
    estado: 'deteriorado',
    cantidadVotos: 156,
  },
  {
    id: '4',
    titulo: 'Memoria Originaria',
    autor: 'Luis Niveiro',
    anio: 2010,
    descripcion: 'Mural que honra a los pueblos originarios del Gran Chaco. Técnica mixta sobre cemento.',
    categoria: 'mural',
    material: 'cemento',
    coordenadas: { latitud: -27.4567, longitud: -58.9789 },
    direccion: 'Calle Arturo Illia 750',
    imagenUrl: '/obras/memoria-originaria.jpg',
    estado: 'optimo',
    cantidadVotos: 298,
  },
  {
    id: '5',
    titulo: 'El Algodonero',
    autor: 'Carlos Schenone',
    anio: 1995,
    descripcion: 'Escultura que representa al trabajador algodonero, símbolo de la economía chaqueña histórica.',
    categoria: 'escultura',
    material: 'bronce',
    coordenadas: { latitud: -27.4445, longitud: -58.9945 },
    direccion: 'Av. Sarmiento 1200',
    imagenUrl: '/obras/algodonero.jpg',
    estado: 'optimo',
    cantidadVotos: 167,
  },
  {
    id: '6',
    titulo: 'Encuentro de Culturas',
    autor: 'Ana María Rodríguez',
    anio: 2015,
    descripcion: 'Instalación artística que simboliza la diversidad cultural del Chaco contemporáneo.',
    categoria: 'instalacion',
    material: 'mixto',
    coordenadas: { latitud: -27.4598, longitud: -58.9823 },
    direccion: 'Centro Cultural Leopoldo Marechal',
    imagenUrl: '/obras/encuentro-culturas.jpg',
    estado: 'optimo',
    cantidadVotos: 145,
  },
  {
    id: '7',
    titulo: 'Raíces del Monte',
    autor: 'María Esther Gómez',
    anio: 2008,
    descripcion: 'Relieve en madera nativa que representa la flora autóctona del Impenetrable chaqueño.',
    categoria: 'relieve',
    material: 'madera',
    coordenadas: { latitud: -27.4478, longitud: -58.9878 },
    direccion: 'Biblioteca Popular Juan B. Alberdi',
    imagenUrl: '/obras/raices-monte.jpg',
    estado: 'deteriorado',
    cantidadVotos: 112,
  },
  {
    id: '8',
    titulo: 'El Payé',
    autor: 'Roberto Fernández',
    anio: 2001,
    descripcion: 'Escultura mística inspirada en las leyendas guaraníes del nordeste argentino.',
    categoria: 'escultura',
    material: 'piedra',
    coordenadas: { latitud: -27.4534, longitud: -58.9901 },
    direccion: 'Plaza España',
    imagenUrl: '/obras/paye.jpg',
    estado: 'optimo',
    cantidadVotos: 203,
  },
];

/**
 * Lista de autores únicos para filtros
 */
export const autoresUnicos = [...new Set(obrasDemostracion.map(obra => obra.autor))];

/**
 * Etiquetas legibles para categorías
 */
export const etiquetasCategorias: Record<string, string> = {
  escultura: 'Escultura',
  mural: 'Mural',
  monumento: 'Monumento',
  instalacion: 'Instalación',
  relieve: 'Relieve',
  todos: 'Todas',
};

/**
 * Etiquetas legibles para materiales
 */
export const etiquetasMateriales: Record<string, string> = {
  bronce: 'Bronce',
  piedra: 'Piedra',
  cemento: 'Cemento',
  metal: 'Metal',
  madera: 'Madera',
  mixto: 'Mixto',
  todos: 'Todos',
};
