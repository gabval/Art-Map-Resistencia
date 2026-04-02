'use client';

// ============================================
// COMPONENTE RELEVAMIENTO - ArtMap Resistencia
// Formulario de captura de datos de obras
// Equipo JGJ - Modelo COPROMAR
// ============================================

import { useState, useCallback } from 'react';
import { 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  AlertTriangle,
  Save,
  RotateCcw,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field';
import type { Coordenadas, EstadoObra, DatosRelevamiento } from '@/lib/tipos';

interface RelevamientoProps {
  alGuardar?: (datos: DatosRelevamiento) => void;
}

export function Relevamiento({ alGuardar }: RelevamientoProps) {
  // Estados del formulario
  const [coordenadas, setCoordenadas] = useState<Coordenadas>({ latitud: 0, longitud: 0 });
  const [titulo, setTitulo] = useState('');
  const [estado, setEstado] = useState<EstadoObra | null>(null);
  const [observaciones, setObservaciones] = useState('');
  const [capturandoGPS, setCapturandoGPS] = useState(false);
  const [gpsCapturado, setGpsCapturado] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);

  /**
   * Simula la captura de coordenadas GPS
   * En producción usaría navigator.geolocation
   */
  const capturarCoordenadas = useCallback(() => {
    setCapturandoGPS(true);
    setGpsCapturado(false);

    // Simulación de captura GPS (coordenadas de Resistencia)
    setTimeout(() => {
      const latBase = -27.4513;
      const lonBase = -58.9867;
      const variacion = 0.01;
      
      setCoordenadas({
        latitud: latBase + (Math.random() - 0.5) * variacion,
        longitud: lonBase + (Math.random() - 0.5) * variacion,
      });
      setCapturandoGPS(false);
      setGpsCapturado(true);
    }, 1500);
  }, []);

  /**
   * Maneja el envío del formulario
   */
  const manejarEnvio = useCallback(async () => {
    if (!titulo || !estado || !gpsCapturado) return;

    setGuardando(true);
    
    // Simulación de guardado
    await new Promise(resolve => setTimeout(resolve, 1000));

    const datos: DatosRelevamiento = {
      coordenadas,
      titulo,
      estado,
      observaciones,
      fechaRelevamiento: new Date(),
    };

    alGuardar?.(datos);
    setGuardadoExitoso(true);
    setGuardando(false);

    // Reset después de mostrar éxito
    setTimeout(() => {
      setGuardadoExitoso(false);
    }, 3000);
  }, [coordenadas, titulo, estado, observaciones, gpsCapturado, alGuardar]);

  /**
   * Reinicia el formulario
   */
  const reiniciarFormulario = useCallback(() => {
    setCoordenadas({ latitud: 0, longitud: 0 });
    setTitulo('');
    setEstado(null);
    setObservaciones('');
    setGpsCapturado(false);
    setGuardadoExitoso(false);
  }, []);

  const formularioValido = titulo.trim() !== '' && estado !== null && gpsCapturado;

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
        {/* Sección GPS */}
        <div className="space-y-3">
          <FieldLabel className="text-sm font-medium text-foreground">
            Ubicación GPS
          </FieldLabel>
          
          <div className="flex gap-2">
            <Button
              onClick={capturarCoordenadas}
              disabled={capturandoGPS}
              variant={gpsCapturado ? 'secondary' : 'default'}
              className="flex-1"
            >
              {capturandoGPS ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Capturando...
                </>
              ) : gpsCapturado ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4 text-success" />
                  GPS Capturado
                </>
              ) : (
                <>
                  <Navigation className="mr-2 h-4 w-4" />
                  Capturar Ubicación
                </>
              )}
            </Button>
          </div>

          {gpsCapturado && (
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
              className={`h-auto py-4 flex-col gap-2 transition-all ${
                estado === 'optimo' 
                  ? 'bg-success text-success-foreground hover:bg-success/90 border-success' 
                  : 'hover:border-success/50'
              }`}
            >
              <CheckCircle2 className={`h-6 w-6 ${estado === 'optimo' ? 'text-success-foreground' : 'text-success'}`} />
              <span className="font-medium">Óptimo</span>
            </Button>

            <Button
              type="button"
              variant={estado === 'deteriorado' ? 'default' : 'outline'}
              onClick={() => setEstado('deteriorado')}
              className={`h-auto py-4 flex-col gap-2 transition-all ${
                estado === 'deteriorado' 
                  ? 'bg-warning text-warning-foreground hover:bg-warning/90 border-warning' 
                  : 'hover:border-warning/50'
              }`}
            >
              <AlertTriangle className={`h-6 w-6 ${estado === 'deteriorado' ? 'text-warning-foreground' : 'text-warning'}`} />
              <span className="font-medium">Deteriorado</span>
            </Button>
          </div>

          {estado && (
            <Badge 
              variant="outline" 
              className={`w-fit ${
                estado === 'optimo' 
                  ? 'border-success text-success' 
                  : 'border-warning text-warning'
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
          <div className="p-3 bg-success/10 border border-success/30 rounded-lg flex items-center gap-2 text-success">
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
