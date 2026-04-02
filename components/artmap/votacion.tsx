'use client';

// ============================================
// COMPONENTE VOTACIÓN - ArtMap Resistencia
// Vista de detalle con sistema de votación
// Equipo JGJ - Modelo COPROMAR
// ============================================

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { 
  MapPin, 
  User, 
  Calendar, 
  Heart, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Phone,
  CreditCard,
  X,
  Share2,
  Navigation
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field';
import type { Obra, DatosValidacionVoto, EstadoVoto } from '@/lib/tipos';
import { etiquetasCategorias, etiquetasMateriales } from '@/lib/datos-demo';

interface VotacionProps {
  obra: Obra;
  alVolver?: () => void;
  alVotar?: (obra: Obra, datosValidacion: DatosValidacionVoto) => void;
  yaVotada?: boolean;
}

export function Votacion({ obra, alVolver, alVotar, yaVotada = false }: VotacionProps) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [datosValidacion, setDatosValidacion] = useState<DatosValidacionVoto>({
    dni: '',
    telefono: '',
  });
  const [estadoVoto, setEstadoVoto] = useState<EstadoVoto>('pendiente');
  const [errores, setErrores] = useState<{ dni?: string; telefono?: string }>({});

  /**
   * Valida el formato del DNI argentino
   */
  const validarDNI = (dni: string): boolean => {
    const dniLimpio = dni.replace(/\D/g, '');
    return dniLimpio.length >= 7 && dniLimpio.length <= 8;
  };

  /**
   * Valida el formato del teléfono argentino
   */
  const validarTelefono = (telefono: string): boolean => {
    const telefonoLimpio = telefono.replace(/\D/g, '');
    return telefonoLimpio.length >= 10 && telefonoLimpio.length <= 13;
  };

  /**
   * Formatea el DNI mientras se escribe
   */
  const formatearDNI = (valor: string): string => {
    const numeros = valor.replace(/\D/g, '');
    if (numeros.length <= 2) return numeros;
    if (numeros.length <= 5) return `${numeros.slice(0, 2)}.${numeros.slice(2)}`;
    return `${numeros.slice(0, 2)}.${numeros.slice(2, 5)}.${numeros.slice(5, 8)}`;
  };

  /**
   * Procesa el voto
   */
  const procesarVoto = useCallback(async () => {
    // Validar campos
    const nuevosErrores: { dni?: string; telefono?: string } = {};
    
    if (!validarDNI(datosValidacion.dni)) {
      nuevosErrores.dni = 'Ingresá un DNI válido (7-8 dígitos)';
    }
    
    if (!validarTelefono(datosValidacion.telefono)) {
      nuevosErrores.telefono = 'Ingresá un teléfono válido (10-13 dígitos)';
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setErrores({});
    setEstadoVoto('procesando');

    // Simular procesamiento
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simular éxito (90% probabilidad)
    if (Math.random() > 0.1) {
      setEstadoVoto('exitoso');
      alVotar?.(obra, datosValidacion);
    } else {
      setEstadoVoto('error');
    }
  }, [datosValidacion, obra, alVotar]);

  /**
   * Reinicia el estado del modal
   */
  const cerrarModal = useCallback(() => {
    setModalAbierto(false);
    setTimeout(() => {
      if (estadoVoto !== 'exitoso') {
        setEstadoVoto('pendiente');
        setDatosValidacion({ dni: '', telefono: '' });
        setErrores({});
      }
    }, 300);
  }, [estadoVoto]);

  /**
   * Abre Google Maps con las coordenadas
   */
  const abrirEnMapa = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${obra.coordenadas.latitud},${obra.coordenadas.longitud}`;
    window.open(url, '_blank');
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Botón volver */}
      <Button
        variant="ghost"
        onClick={alVolver}
        className="mb-4 -ml-2"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver al catálogo
      </Button>

      {/* Card principal */}
      <Card className="overflow-hidden shadow-lg border-border/50">
        {/* Imagen de la obra */}
        <div className="relative aspect-[16/10] bg-muted">
          <Image
            src={obra.imagenUrl}
            alt={obra.titulo}
            fill
            className="object-cover"
            priority
          />
          
          {/* Badges superiores */}
          <div className="absolute top-3 left-3 right-3 flex justify-between">
            <Badge 
              className="bg-primary/90 text-primary-foreground"
            >
              {etiquetasCategorias[obra.categoria]}
            </Badge>
            <Badge 
              className={
                obra.estado === 'optimo' 
                  ? 'bg-success text-success-foreground' 
                  : 'bg-warning text-warning-foreground'
              }
            >
              {obra.estado === 'optimo' ? 'Óptimo' : 'Deteriorado'}
            </Badge>
          </div>

          {/* Contador de votos */}
          <div className="absolute bottom-3 right-3 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5">
            <Heart className="h-4 w-4 text-secondary fill-secondary" />
            <span className="font-semibold text-foreground">{obra.cantidadVotos}</span>
          </div>
        </div>

        <CardContent className="p-5 space-y-5">
          {/* Título y descripción */}
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {obra.titulo}
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              {obra.descripcion}
            </p>
          </div>

          {/* Información del autor */}
          <div className="flex items-center gap-4 py-3 border-y border-border/50">
            <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center">
              <User className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="font-medium text-foreground">{obra.autor}</p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>Año {obra.anio}</span>
              </div>
            </div>
          </div>

          {/* Detalles técnicos */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-muted rounded-lg">
              <span className="text-xs text-muted-foreground block mb-1">Material</span>
              <span className="font-medium text-foreground">
                {etiquetasMateriales[obra.material]}
              </span>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <span className="text-xs text-muted-foreground block mb-1">Categoría</span>
              <span className="font-medium text-foreground">
                {etiquetasCategorias[obra.categoria]}
              </span>
            </div>
          </div>

          {/* Ubicación */}
          <div 
            className="p-4 bg-secondary/10 rounded-lg cursor-pointer hover:bg-secondary/15 transition-colors"
            onClick={abrirEnMapa}
          >
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-foreground">{obra.direccion}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {obra.coordenadas.latitud.toFixed(6)}, {obra.coordenadas.longitud.toFixed(6)}
                </p>
              </div>
              <Navigation className="h-5 w-5 text-secondary shrink-0" />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={async () => {
                if (navigator.share) {
                  try {
                    await navigator.share({
                      title: obra.titulo,
                      text: `Mirá esta obra de arte en Resistencia: ${obra.titulo} por ${obra.autor}`,
                      url: window.location.href,
                    });
                  } catch (error) {
                    // El usuario canceló o el navegador no permite compartir
                    if ((error as Error).name !== 'AbortError') {
                      // Fallback: copiar al portapapeles
                      await navigator.clipboard.writeText(window.location.href);
                    }
                  }
                } else {
                  // Fallback para navegadores sin Web Share API
                  await navigator.clipboard.writeText(window.location.href);
                }
              }}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Compartir
            </Button>
            
            <Button
              className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90"
              size="lg"
              onClick={() => setModalAbierto(true)}
              disabled={estadoVoto === 'exitoso' || yaVotada}
            >
              {estadoVoto === 'exitoso' || yaVotada ? (
                <>
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  {yaVotada ? 'Ya votaste esta obra' : '¡Voto registrado!'}
                </>
              ) : (
                <>
                  <Heart className="mr-2 h-5 w-5" />
                  Confirmar Voto
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal de validación */}
      <Dialog open={modalAbierto} onOpenChange={cerrarModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {estadoVoto === 'exitoso' ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  ¡Voto registrado!
                </>
              ) : estadoVoto === 'error' ? (
                <>
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  Error al votar
                </>
              ) : (
                <>
                  <Heart className="h-5 w-5 text-secondary" />
                  Validar identidad
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {estadoVoto === 'exitoso' 
                ? `Tu voto por "${obra.titulo}" fue registrado correctamente. ¡Gracias por participar!`
                : estadoVoto === 'error'
                ? 'Ocurrió un error al procesar tu voto. Por favor, intentá nuevamente.'
                : 'Para votar necesitamos validar tu identidad. Tus datos son confidenciales.'
              }
            </DialogDescription>
          </DialogHeader>

          {estadoVoto === 'pendiente' || estadoVoto === 'procesando' ? (
            <div className="space-y-4 py-2">
              {/* DNI */}
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="dni" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    DNI
                  </FieldLabel>
                  <Input
                    id="dni"
                    type="text"
                    placeholder="12.345.678"
                    value={datosValidacion.dni}
                    onChange={(e) => {
                      const formateado = formatearDNI(e.target.value);
                      setDatosValidacion(d => ({ ...d, dni: formateado }));
                      if (errores.dni) setErrores(e => ({ ...e, dni: undefined }));
                    }}
                    maxLength={10}
                    disabled={estadoVoto === 'procesando'}
                    className={errores.dni ? 'border-destructive' : ''}
                  />
                  {errores.dni && (
                    <p className="text-sm text-destructive mt-1">{errores.dni}</p>
                  )}
                </Field>
              </FieldGroup>

              {/* Teléfono */}
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="telefono" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Teléfono
                  </FieldLabel>
                  <Input
                    id="telefono"
                    type="tel"
                    placeholder="3624 123456"
                    value={datosValidacion.telefono}
                    onChange={(e) => {
                      setDatosValidacion(d => ({ ...d, telefono: e.target.value }));
                      if (errores.telefono) setErrores(e => ({ ...e, telefono: undefined }));
                    }}
                    disabled={estadoVoto === 'procesando'}
                    className={errores.telefono ? 'border-destructive' : ''}
                  />
                  {errores.telefono && (
                    <p className="text-sm text-destructive mt-1">{errores.telefono}</p>
                  )}
                </Field>
              </FieldGroup>

              {/* Botón confirmar */}
              <Button
                className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                onClick={procesarVoto}
                disabled={estadoVoto === 'procesando'}
              >
                {estadoVoto === 'procesando' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando voto...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Confirmar Voto
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Al votar aceptás los términos y condiciones del programa COPROMAR
              </p>
            </div>
          ) : estadoVoto === 'exitoso' ? (
            <div className="py-4 text-center">
              <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
              <Button onClick={cerrarModal} className="w-full">
                Cerrar
              </Button>
            </div>
          ) : (
            <div className="py-4 text-center">
              <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={cerrarModal} className="flex-1">
                  Cancelar
                </Button>
                <Button 
                  onClick={() => setEstadoVoto('pendiente')} 
                  className="flex-1"
                >
                  Reintentar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
