'use client';

// ============================================
// COMPONENTE RELEVAMIENTO - ArtMap Resistencia
// Formulario de captura de datos de obras
// Equipo JGJ - Modelo COPROMAR
// ============================================

import { useState, useCallback } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import {
  MapPin,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  Save,
  RotateCcw,
  Loader2,
  User,
  Calendar,
  Layers,
  Palette,
  Camera,
  Search,
  UploadCloud,
  X
} from 'lucide-react';

const MapaRelevamiento = dynamic(() => import('./mapa-relevamiento'), { ssr: false });
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Coordenadas, EstadoObra, DatosRelevamiento, MaterialObra, CategoriaObra } from '@/lib/tipos';
import { etiquetasCategorias, etiquetasMateriales } from '@/lib/datos-demo';

interface RelevamientoProps {
  alGuardar?: (datos: DatosRelevamiento) => void;
}

const CATEGORIAS: CategoriaObra[] = ['escultura', 'mural', 'monumento', 'instalacion', 'relieve'];
const MATERIALES: MaterialObra[] = ['bronce', 'piedra', 'cemento', 'metal', 'madera', 'mixto'];

export function Relevamiento({ alGuardar }: RelevamientoProps) {
  // Estados del formulario
  const [coordenadas, setCoordenadas] = useState<Coordenadas>({ latitud: 0, longitud: 0 });
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [anio, setAnio] = useState<number>(new Date().getFullYear());
  const [material, setMaterial] = useState<MaterialObra | ''>('');
  const [categoria, setCategoria] = useState<CategoriaObra | ''>('');
  const [estado, setEstado] = useState<EstadoObra | null>(null);
  const [observaciones, setObservaciones] = useState('');
  const [capturandoGPS, setCapturandoGPS] = useState(false);
  const [gpsCapturado, setGpsCapturado] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);

  const [imagenUrl, setImagenUrl] = useState<string | null>(null);

  /**
   * Captura coordenadas GPS reales usando la API del navegador
   */
  const capturarCoordenadas = useCallback(() => {
    setCapturandoGPS(true);
    setGpsCapturado(false);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordenadas({
            latitud: position.coords.latitude,
            longitud: position.coords.longitude,
          });
          setCapturandoGPS(false);
          setGpsCapturado(true);
        },
        () => {
          // Fallback: coordenadas simuladas de Resistencia si no hay permiso
          const latBase = -27.4513;
          const lonBase = -58.9867;
          const variacion = 0.01;

          setCoordenadas({
            latitud: latBase + (Math.random() - 0.5) * variacion,
            longitud: lonBase + (Math.random() - 0.5) * variacion,
          });
          setCapturandoGPS(false);
          setGpsCapturado(true);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      // Fallback para navegadores sin geolocation
      const latBase = -27.4513;
      const lonBase = -58.9867;
      const variacion = 0.01;

      setCoordenadas({
        latitud: latBase + (Math.random() - 0.5) * variacion,
        longitud: lonBase + (Math.random() - 0.5) * variacion,
      });
      setCapturandoGPS(false);
      setGpsCapturado(true);
    }
  }, []);


  /**
   * Maneja la selección de imagen
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setImagenUrl(url);
    }
  };

  /**
   * Maneja el envío del formulario
   */
  const manejarEnvio = useCallback(async () => {
    if (!titulo || !autor || !material || !categoria || !estado || !gpsCapturado) return;

    setGuardando(true);

    // Simulación de guardado
    await new Promise(resolve => setTimeout(resolve, 1000));

    const datos: DatosRelevamiento = {
      coordenadas,
      titulo,
      autor,
      anio,
      material: material as MaterialObra,
      categoria: categoria as CategoriaObra,
      estado,
      observaciones,
      fechaRelevamiento: new Date(),
      imagenUrl: imagenUrl || undefined,
    };

    alGuardar?.(datos);
    setGuardadoExitoso(true);
    setGuardando(false);

    // Reset después de mostrar éxito
    setTimeout(() => {
      setGuardadoExitoso(false);
    }, 3000);
  }, [coordenadas, titulo, autor, anio, material, categoria, estado, observaciones, gpsCapturado, alGuardar]);

  /**
   * Reinicia el formulario
   */
  const reiniciarFormulario = useCallback(() => {
    setCoordenadas({ latitud: 0, longitud: 0 });
    setTitulo('');
    setAutor('');
    setAnio(new Date().getFullYear());
    setMaterial('');
    setCategoria('');
    setEstado(null);
    setObservaciones('');
    setGpsCapturado(false);
    setGuardadoExitoso(false);
    setImagenUrl(null);
  }, []);

  const formularioValido = titulo.trim() !== '' && autor.trim() !== '' && material !== '' && categoria !== '' && estado !== null && gpsCapturado && !!imagenUrl;

  // URL del mapa estático de OpenStreetMap - ya no es necesario
  // const mapaUrl = ...

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg border-border/50">
      <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="h-5 w-5" />
          Relevamiento de Obra
        </CardTitle>
        <CardDescription className="text-primary-foreground/80">
          Capture los datos de la obra de arte urbano
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 space-y-5">
        {/* Sección GPS con Mapa */}
        <div className="space-y-3">
          <FieldLabel className="text-sm font-medium text-foreground">
            Ubicación GPS
          </FieldLabel>

          <div className="flex gap-2">
            <Button
              onClick={capturarCoordenadas}
              disabled={capturandoGPS}
              variant={gpsCapturado ? 'outline' : 'default'}
              className="flex-1"
            >
              {capturandoGPS ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Capturando...
                </>
              ) : gpsCapturado ? (
                <>
                  <MapPin className="mr-2 h-4 w-4" />
                  Actualizar GPS
                </>
              ) : (
                <>
                  <Navigation className="mr-2 h-4 w-4" />
                  Usar Mi Ubicación
                </>
              )}
            </Button>
          </div>

          {gpsCapturado && (
            <div className="space-y-3 mt-3">
              {/* Mapa embebido de Leaflet */}
              <div className="w-full h-[300px]">
                <MapaRelevamiento
                  coordenadas={coordenadas}
                  alCambiarCoordenadas={(nuevasCoordenadas) => setCoordenadas(nuevasCoordenadas)}
                />
              </div>

              {/* Coordenadas */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-muted rounded-lg">
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">Latitud</span>
                  <code className="text-sm font-mono text-foreground">
                    {coordenadas.latitud.toFixed(6)}
                  </code>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">Longitud</span>
                  <code className="text-sm font-mono text-foreground">
                    {coordenadas.longitud.toFixed(6)}
                  </code>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Carga de Imagen */}
        <div className="space-y-3 pt-2">
          <FieldLabel className="text-sm font-medium text-foreground">
            Fotografía de la Obra
          </FieldLabel>

          {imagenUrl ? (
            <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-border bg-muted">
              <Image
                src={imagenUrl}
                alt="Vista previa"
                fill
                className="object-cover"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                onClick={() => setImagenUrl(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="relative border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer bg-muted/20">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <UploadCloud className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm font-medium text-foreground mb-1">
                Toca para subir una imagen
              </p>
              <p className="text-xs text-muted-foreground">
                JPG, PNG o WEBP (máx. 5MB)
              </p>
            </div>
          )}
        </div>

        {/* Título de la obra */}
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="titulo-obra">Título de la Obra</FieldLabel>
            <Input
              id="titulo-obra"
              type="text"
              placeholder="Ej: El Pensador del Chaco"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="text-base"
            />
          </Field>
        </FieldGroup>

        {/* Autor */}
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="autor-obra" className="flex items-center gap-2">
              <User className="h-4 w-4 text-secondary" />
              Autor
            </FieldLabel>
            <Input
              id="autor-obra"
              type="text"
              placeholder="Nombre del artista o escultor"
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
              className="text-base"
            />
          </Field>
        </FieldGroup>

        {/* Año */}
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="anio-obra" className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-secondary" />
              Año de Creación
            </FieldLabel>
            <Input
              id="anio-obra"
              type="number"
              min={1900}
              max={new Date().getFullYear()}
              placeholder="Ej: 2020"
              value={anio}
              onChange={(e) => setAnio(parseInt(e.target.value) || new Date().getFullYear())}
              className="text-base"
            />
          </Field>
        </FieldGroup>

        {/* Material */}
        <FieldGroup>
          <Field>
            <FieldLabel className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-secondary" />
              Material
            </FieldLabel>
            <Select
              value={material}
              onValueChange={(valor) => setMaterial(valor as MaterialObra)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar material" />
              </SelectTrigger>
              <SelectContent>
                {MATERIALES.map(mat => (
                  <SelectItem key={mat} value={mat}>
                    {etiquetasMateriales[mat]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>

        {/* Categoría */}
        <FieldGroup>
          <Field>
            <FieldLabel className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-secondary" />
              Categoría
            </FieldLabel>
            <Select
              value={categoria}
              onValueChange={(valor) => setCategoria(valor as CategoriaObra)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIAS.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {etiquetasCategorias[cat]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>

        {/* Estado de la obra */}
        <div className="space-y-3">
          <FieldLabel className="text-sm font-medium text-foreground">
            Estado de Conservación
          </FieldLabel>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant={estado === 'optimo' ? 'default' : 'outline'}
              onClick={() => setEstado('optimo')}
              className={`h-auto py-4 flex-col gap-2 transition-all ${estado === 'optimo'
                  ? 'bg-[oklch(0.6_0.18_145)] text-[oklch(0.98_0.005_230)] hover:bg-[oklch(0.55_0.18_145)] border-[oklch(0.6_0.18_145)]'
                  : 'hover:border-[oklch(0.6_0.18_145)]/50'
                }`}
            >
              <CheckCircle2 className={`h-6 w-6 ${estado === 'optimo' ? 'text-[oklch(0.98_0.005_230)]' : 'text-[oklch(0.6_0.18_145)]'}`} />
              <span className="font-medium">Óptimo</span>
            </Button>

            <Button
              type="button"
              variant={estado === 'deteriorado' ? 'default' : 'outline'}
              onClick={() => setEstado('deteriorado')}
              className={`h-auto py-4 flex-col gap-2 transition-all ${estado === 'deteriorado'
                  ? 'bg-[oklch(0.75_0.15_80)] text-[oklch(0.18_0.04_250)] hover:bg-[oklch(0.7_0.15_80)] border-[oklch(0.75_0.15_80)]'
                  : 'hover:border-[oklch(0.75_0.15_80)]/50'
                }`}
            >
              <AlertTriangle className={`h-6 w-6 ${estado === 'deteriorado' ? 'text-[oklch(0.18_0.04_250)]' : 'text-[oklch(0.75_0.15_80)]'}`} />
              <span className="font-medium">Deteriorado</span>
            </Button>
          </div>

          {estado && (
            <Badge
              variant="outline"
              className={`w-fit ${estado === 'optimo'
                  ? 'border-[oklch(0.6_0.18_145)] text-[oklch(0.6_0.18_145)]'
                  : 'border-[oklch(0.75_0.15_80)] text-[oklch(0.75_0.15_80)]'
                }`}
            >
              Estado seleccionado: {estado === 'optimo' ? 'Óptimo' : 'Deteriorado'}
            </Badge>
          )}
        </div>

        {/* Observaciones */}
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="observaciones">Observaciones</FieldLabel>
            <Textarea
              id="observaciones"
              placeholder="Describa detalles adicionales sobre la obra, daños visibles, entorno, etc."
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={4}
              className="resize-none text-base"
            />
          </Field>
        </FieldGroup>

        {/* Mensaje de éxito */}
        {guardadoExitoso && (
          <div className="p-3 bg-[oklch(0.6_0.18_145)]/10 border border-[oklch(0.6_0.18_145)]/30 rounded-lg flex items-center gap-2 text-[oklch(0.6_0.18_145)]">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">Relevamiento guardado correctamente</span>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            onClick={reiniciarFormulario}
            className="flex-1"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Limpiar
          </Button>

          <Button
            onClick={manejarEnvio}
            disabled={!formularioValido || guardando}
            className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            {guardando ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
