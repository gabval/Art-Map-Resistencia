'use client';

// ============================================
// COMPONENTE CATÁLOGO - ArtMap Resistencia
// Vista de grilla con filtros para obras
// Equipo JGJ - Modelo COPROMAR
// ============================================

import { useState, useMemo } from 'react';
import { Search, Filter, Grid3X3, Map, X, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { TarjetaObra } from './tarjeta-obra';
import type { Obra, FiltrosCatalogo, CategoriaObra, MaterialObra } from '@/lib/tipos';
import dynamic from 'next/dynamic';

const MapaCatalogo = dynamic(() => import('./mapa-catalogo'), { ssr: false });
import { 
  obrasDemostracion, 
  autoresUnicos, 
  etiquetasCategorias, 
  etiquetasMateriales 
} from '@/lib/datos-demo';

interface CatalogoProps {
  obras?: Obra[];
  alSeleccionarObra?: (obra: Obra) => void;
}

const CATEGORIAS: (CategoriaObra | 'todos')[] = ['todos', 'escultura', 'mural', 'monumento', 'instalacion', 'relieve'];
const MATERIALES: (MaterialObra | 'todos')[] = ['todos', 'bronce', 'piedra', 'cemento', 'metal', 'madera', 'mixto'];

export function Catalogo({ obras = obrasDemostracion, alSeleccionarObra }: CatalogoProps) {
  const [filtros, setFiltros] = useState<FiltrosCatalogo>({
    autor: 'todos',
    material: 'todos',
    categoria: 'todos',
    busqueda: '',
  });
  const [vistaActiva, setVistaActiva] = useState<'grilla' | 'mapa'>('grilla');
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);

  // Filtrar obras según criterios
  const obrasFiltradas = useMemo(() => {
    return obras.filter(obra => {
      const coincideBusqueda = filtros.busqueda === '' || 
        obra.titulo.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
        obra.autor.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
        obra.direccion.toLowerCase().includes(filtros.busqueda.toLowerCase());
      
      const coincideAutor = filtros.autor === 'todos' || obra.autor === filtros.autor;
      const coincideMaterial = filtros.material === 'todos' || obra.material === filtros.material;
      const coincideCategoria = filtros.categoria === 'todos' || obra.categoria === filtros.categoria;
      
      return coincideBusqueda && coincideAutor && coincideMaterial && coincideCategoria;
    });
  }, [obras, filtros]);

  // Contar filtros activos
  const filtrosActivos = useMemo(() => {
    let count = 0;
    if (filtros.autor !== 'todos') count++;
    if (filtros.material !== 'todos') count++;
    if (filtros.categoria !== 'todos') count++;
    return count;
  }, [filtros]);

  // Limpiar todos los filtros
  const limpiarFiltros = () => {
    setFiltros({
      autor: 'todos',
      material: 'todos',
      categoria: 'todos',
      busqueda: '',
    });
  };

  // Componente de filtros (reutilizado en mobile y desktop)
  const FiltrosContenido = () => (
    <div className="space-y-4">
      {/* Filtro por Autor */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Autor</label>
        <Select
          value={filtros.autor}
          onValueChange={(valor) => setFiltros(f => ({ ...f, autor: valor }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar autor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los autores</SelectItem>
            {autoresUnicos.map(autor => (
              <SelectItem key={autor} value={autor}>{autor}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filtro por Material */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Material</label>
        <Select
          value={filtros.material}
          onValueChange={(valor) => setFiltros(f => ({ ...f, material: valor as MaterialObra | 'todos' }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar material" />
          </SelectTrigger>
          <SelectContent>
            {MATERIALES.map(material => (
              <SelectItem key={material} value={material}>
                {etiquetasMateriales[material]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filtro por Categoría */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Categoría</label>
        <Select
          value={filtros.categoria}
          onValueChange={(valor) => setFiltros(f => ({ ...f, categoria: valor as CategoriaObra | 'todos' }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar categoría" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIAS.map(categoria => (
              <SelectItem key={categoria} value={categoria}>
                {etiquetasCategorias[categoria]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Botón limpiar filtros */}
      {filtrosActivos > 0 && (
        <Button 
          variant="outline" 
          onClick={limpiarFiltros}
          className="w-full"
        >
          <X className="mr-2 h-4 w-4" />
          Limpiar filtros ({filtrosActivos})
        </Button>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Encabezado */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Catálogo de Obras
        </h2>
        <p className="text-muted-foreground">
          Explorá las {obras.length} obras de arte urbano de Resistencia
        </p>
      </div>

      {/* Barra de búsqueda y controles */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm pb-4 space-y-3">
        {/* Búsqueda */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por título, autor o ubicación..."
            value={filtros.busqueda}
            onChange={(e) => setFiltros(f => ({ ...f, busqueda: e.target.value }))}
            className="pl-10 text-base"
          />
        </div>

        {/* Controles: Filtros + Vista */}
        <div className="flex items-center justify-between gap-3">
          {/* Botón de filtros (Mobile) */}
          <Sheet open={filtrosAbiertos} onOpenChange={setFiltrosAbiertos}>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filtros
                {filtrosActivos > 0 && (
                  <Badge className="ml-2 bg-secondary text-secondary-foreground">
                    {filtrosActivos}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[70vh]">
              <SheetHeader>
                <SheetTitle>Filtrar obras</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FiltrosContenido />
              </div>
            </SheetContent>
          </Sheet>

          {/* Contador de resultados */}
          <span className="text-sm text-muted-foreground">
            {obrasFiltradas.length} {obrasFiltradas.length === 1 ? 'obra encontrada' : 'obras encontradas'}
          </span>

          {/* Toggle de vista */}
          <div className="flex items-center rounded-lg border border-border p-1">
            <Button
              variant={vistaActiva === 'grilla' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setVistaActiva('grilla')}
              className="h-8 px-3"
            >
              <Grid3X3 className="h-4 w-4" />
              <span className="sr-only">Vista grilla</span>
            </Button>
            <Button
              variant={vistaActiva === 'mapa' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setVistaActiva('mapa')}
              className="h-8 px-3"
            >
              <Map className="h-4 w-4" />
              <span className="sr-only">Vista mapa</span>
            </Button>
          </div>
        </div>

        {/* Filtros activos (badges) */}
        {filtrosActivos > 0 && (
          <div className="flex flex-wrap gap-2">
            {filtros.autor !== 'todos' && (
              <Badge variant="secondary" className="gap-1">
                Autor: {filtros.autor}
                <button 
                  onClick={() => setFiltros(f => ({ ...f, autor: 'todos' }))}
                  className="ml-1 hover:text-foreground"
                  aria-label="Quitar filtro de autor"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filtros.material !== 'todos' && (
              <Badge variant="secondary" className="gap-1">
                Material: {etiquetasMateriales[filtros.material]}
                <button 
                  onClick={() => setFiltros(f => ({ ...f, material: 'todos' }))}
                  className="ml-1 hover:text-foreground"
                  aria-label="Quitar filtro de material"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filtros.categoria !== 'todos' && (
              <Badge variant="secondary" className="gap-1">
                Categoría: {etiquetasCategorias[filtros.categoria]}
                <button 
                  onClick={() => setFiltros(f => ({ ...f, categoria: 'todos' }))}
                  className="ml-1 hover:text-foreground"
                  aria-label="Quitar filtro de categoría"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Layout principal */}
      <div className="flex gap-6">
        {/* Panel de filtros (Desktop) */}
        <aside className="hidden lg:block w-64 shrink-0">
          <Card className="sticky top-24">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-4 w-4 text-secondary" />
                <h3 className="font-semibold text-foreground">Filtros</h3>
              </div>
              <FiltrosContenido />
            </CardContent>
          </Card>
        </aside>

        {/* Contenido principal */}
        <div className="flex-1 min-w-0">
          {vistaActiva === 'grilla' ? (
            <>
              {obrasFiltradas.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {obrasFiltradas.map(obra => (
                    <TarjetaObra 
                      key={obra.id} 
                      obra={obra} 
                      alSeleccionar={alSeleccionarObra}
                    />
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <div className="text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No se encontraron obras</h3>
                    <p className="mb-4">Probá ajustando los filtros de búsqueda</p>
                    <Button variant="outline" onClick={limpiarFiltros}>
                      Limpiar filtros
                    </Button>
                  </div>
                </Card>
              )}
            </>
          ) : (
            <div className="h-[600px] w-full">
              <MapaCatalogo obras={obrasFiltradas} alSeleccionarObra={alSeleccionarObra} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
