import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, RotateCcw, Compass, ArrowRight, Copy, Check, Award, Maximize2, Minimize2 } from 'lucide-react';
import { ROUTE_STATIONS } from '../../config/routeData';
import { useRouteProgress } from '../../hooks/useRouteProgress';
import { useFullscreen } from '../../hooks/useFullscreen';
import { mapBg } from '../../assets/images';
import { GotitaCharacter } from './GotitaCharacter';
import { StationHotspot } from './StationHotspot';
import { StationModal } from './StationModal';
import { StationOneView } from '../stations/StationOneView';
import { StationTwoStoryView } from '../stations/StationTwoStoryView';
import { StationThreePuzzleTimerView } from '../stations/StationThreePuzzleTimerView';
import { StationFourRiddleView } from '../stations/StationFourRiddleView';
import { ProgressBadge } from '../ui/ProgressBadge';
import { ActionButton } from '../ui/ActionButton';

interface InteractiveMapProps {
  onBackToCover: () => void;
  onGoToMeta?: () => void;
}

interface DebugPin {
  x: number;
  y: number;
  timestamp: number;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ onBackToCover, onGoToMeta }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapImageError, setMapImageError] = useState(false);
  const [debugPin, setDebugPin] = useState<DebugPin | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const {
    currentStationIndex,
    currentStation,
    highestUnlockedIndex,
    completedStationIds,
    isTraveling,
    isModalOpen,
    selectedStation,
    debugMode,
    totalStations,
    isCompleted,
    moveToStation,
    advanceToNextStation,
    openStationModal,
    closeModal,
    markStationCompleted,
    resetRoute,
    toggleDebugMode,
    finishTraveling,
  } = useRouteProgress();

  const mapBgUrl = mapBg;
  const { isFullscreen, toggleFullscreen, enterFullscreen } = useFullscreen();

  // Entrar automáticamente en pantalla completa al montar en el mapa
  useEffect(() => {
    enterFullscreen();
  }, [enterFullscreen]);

  // Atajos de teclado para Charlas / Modo Presentador
  useEffect(() => {
    const handlePresenterKey = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      // Pantalla completa con 'F'
      if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }

      // Avanzar estación con Flecha Derecha o Barra Espaciadora
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        if (isModalOpen) {
          closeModal();
          advanceToNextStation();
        } else if (currentStationIndex < totalStations - 1) {
          advanceToNextStation();
        } else if (onGoToMeta) {
          onGoToMeta();
        }
      }

      // Retroceder estación con Flecha Izquierda
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentStationIndex > 0) {
          if (isModalOpen) closeModal();
          moveToStation(currentStationIndex - 1);
        }
      }

      // Abrir modal con Enter
      if (e.key === 'Enter') {
        e.preventDefault();
        if (!isModalOpen) {
          openStationModal(currentStation);
        }
      }
    };

    window.addEventListener('keydown', handlePresenterKey);
    return () => window.removeEventListener('keydown', handlePresenterKey);
  }, [
    isModalOpen,
    currentStationIndex,
    totalStations,
    currentStation,
    advanceToNextStation,
    moveToStation,
    openStationModal,
    closeModal,
    onGoToMeta,
    toggleFullscreen,
  ]);

  // Toggle de Debug Mode con tecla 'D'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'd' || e.key === 'D') {
        if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
        toggleDebugMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleDebugMode]);

  // Manejo de clic en el mapa para calibración en modo debug
  const handleMapClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!debugMode || !mapContainerRef.current) return;

      const rect = mapContainerRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const xPercent = Number(((clickX / rect.width) * 100).toFixed(1));
      const yPercent = Number(((clickY / rect.height) * 100).toFixed(1));

      const clampedX = Math.max(0, Math.min(100, xPercent));
      const clampedY = Math.max(0, Math.min(100, yPercent));

      setDebugPin({ x: clampedX, y: clampedY, timestamp: Date.now() });

      const codeToCopy = `coordinates: { x: ${clampedX}, y: ${clampedY} },`;
      navigator.clipboard?.writeText(codeToCopy).then(() => {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      });
    },
    [debugMode]
  );

  // Si se abre la estación Meta y existe onGoToMeta, transicionar directamente a la pantalla Meta
  useEffect(() => {
    if (isModalOpen && selectedStation?.id === 'meta-hudn' && onGoToMeta) {
      closeModal();
      onGoToMeta();
    }
  }, [isModalOpen, selectedStation, onGoToMeta, closeModal]);

  return (
    <div className="relative w-screen h-dvh flex items-center justify-center bg-[#cbe8f5] overflow-hidden select-none">
      {/* Contenedor dinámico 16:9 ajustado al 100% de la pantalla sin cortes */}
      <div
        ref={mapContainerRef}
        onClick={handleMapClick}
        className={`relative overflow-hidden select-none @container ${
          debugMode ? 'cursor-crosshair ring-4 ring-emerald-400' : ''
        }`}
        style={{
          containerType: 'size',
          width: 'min(100vw, calc(100dvh * (16 / 9)))',
          height: 'min(100dvh, calc(100vw * (9 / 16)))',
          aspectRatio: '16 / 9',
        }}
      >
        {/* Imagen del mapa original (sendero y rótulos ya ilustrados en Canva) */}
        {!mapImageError ? (
          <img
            src={mapBgUrl}
            alt="Mapa de la Ruta de la Gotita"
            className="w-full h-full object-fill pointer-events-none block"
            onError={() => setMapImageError(true)}
          />
        ) : (
          <PlaceholderMapGraphic />
        )}

        {/* Hotspots interactivos limpios y sutiles sobre cada estación */}
        {ROUTE_STATIONS.map((station) => {
          const isCurrent = station.index === currentStationIndex;
          const isUnlocked = station.index <= highestUnlockedIndex;
          const isDone = completedStationIds.includes(station.id);

          return (
            <StationHotspot
              key={station.id}
              station={station}
              isCurrent={isCurrent}
              isUnlocked={isUnlocked}
              isCompleted={isDone}
              debugMode={debugMode}
              onClick={() => {
                if (station.id === 'meta-hudn' && (isDone || isUnlocked || debugMode)) {
                  if (onGoToMeta) {
                    onGoToMeta();
                    return;
                  }
                }
                if (station.index === currentStationIndex) {
                  openStationModal(station);
                } else if (isUnlocked || debugMode) {
                  moveToStation(station.index);
                }
              }}
            />
          );
        })}

        {/* Personaje Gotita animado desplazándose por las coordenadas */}
        <GotitaCharacter
          coordinates={currentStation.coordinates}
          isTraveling={isTraveling}
          onArrive={finishTraveling}
          stationName={currentStation.numberLabel || currentStation.name}
          stationIndex={currentStationIndex}
        />

        {/* Pin de Calibración temporal al hacer clic en Modo Debug */}
        {debugMode && debugPin && (
          <div
            className="absolute z-40 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center"
            style={{ left: `${debugPin.x}%`, top: `${debugPin.y}%` }}
          >
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-lg animate-ping" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 border border-white -mt-3" />
            <div className="mt-1 bg-slate-900/95 text-emerald-300 font-mono text-[9px] sm:text-[10px] px-2 py-0.5 rounded shadow border border-emerald-400/60 flex items-center gap-1">
              <span>
                x: {debugPin.x}%, y: {debugPin.y}%
              </span>
              {copiedCode && <Check size={11} className="text-emerald-400" />}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* BARRA SUPERIOR ULTRA-COMPACTA Y LIMPIA EN UNA SOLA LÍNEA */}
        {/* ======================================================== */}
        <div className="absolute top-1 sm:top-2 left-2 sm:left-4 right-2 sm:right-4 z-40 flex items-center justify-between pointer-events-none flex-nowrap whitespace-nowrap">
          {/* Lado izquierdo: Volver a portada compacto */}
          <div className="flex items-center pointer-events-auto">
            <ActionButton
              size="sm"
              variant="secondary"
              onClick={onBackToCover}
              icon={<Home size={14} />}
              aria-label="Volver al inicio"
              className="min-h-[34px] sm:min-h-[38px] px-2.5 py-1 text-xs font-bold bg-white/95 backdrop-blur-md shadow-sm border border-white rounded-full"
            >
              <span>Inicio</span>
            </ActionButton>
          </div>

          {/* Centro: Indicador de Progreso Dinámico y Delgado */}
          <div className="pointer-events-auto flex items-center">
            <ProgressBadge
              current={currentStationIndex}
              total={totalStations}
              isCompleted={isCompleted}
            />
          </div>

          {/* Lado derecho: Solo botón Avanzar integrado y reinicio pequeño */}
          <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
            {currentStationIndex < totalStations - 1 ? (
              <ActionButton
                size="sm"
                variant="primary"
                onClick={advanceToNextStation}
                iconRight={<ArrowRight size={14} />}
                className="min-h-[34px] sm:min-h-[38px] px-3 sm:px-4 py-1 text-xs sm:text-sm font-black shadow-sm rounded-full"
              >
                <span>Avanzar</span>
              </ActionButton>
            ) : (
              <ActionButton
                size="sm"
                variant="mint"
                onClick={() => {
                  if (onGoToMeta) {
                    onGoToMeta();
                  } else {
                    openStationModal(currentStation);
                  }
                }}
                icon={<Award size={14} />}
                className="min-h-[34px] sm:min-h-[38px] px-3 py-1 text-xs font-black shadow-sm rounded-full"
              >
                <span>¡Meta!</span>
              </ActionButton>
            )}

            {/* Botón de Pantalla Completa / Modo Proyector */}
            <ActionButton
              size="sm"
              variant="ghost"
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Salir de pantalla completa (F)' : 'Pantalla completa / Modo proyector (F)'}
              aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa / Modo proyector'}
              className="min-h-[34px] min-w-[34px] w-8 h-8 sm:w-9 sm:h-9 p-1 rounded-full bg-white/85 hover:bg-white shadow-sm text-slate-700 flex items-center justify-center"
            >
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </ActionButton>

            {/* Reiniciar Ruta pequeño */}
            <ActionButton
              size="sm"
              variant="ghost"
              onClick={resetRoute}
              title="Reiniciar ruta"
              aria-label="Reiniciar ruta"
              className="min-h-[34px] min-w-[34px] w-8 h-8 sm:w-9 sm:h-9 p-1 rounded-full bg-white/85 hover:bg-white shadow-sm text-slate-600 flex items-center justify-center"
            >
              <RotateCcw size={14} />
            </ActionButton>
          </div>
        </div>

        {/* Notificación flotante de Debug activo en la parte inferior */}
        <AnimatePresence>
          {debugMode && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 text-white px-3.5 py-1.5 rounded-2xl shadow-xl border border-emerald-400/60 backdrop-blur-md flex items-center gap-2.5 text-xs pointer-events-auto"
            >
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Compass size={14} className="animate-spin text-emerald-400" />
                <span>Calibración:</span>
              </div>
              <span className="text-slate-300 hidden sm:inline">
                Haz clic en el mapa para copiar las coordenadas.
              </span>
              {copiedCode && (
                <span className="bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                  <Copy size={10} /> ¡Copiado!
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Vista interactiva específica para Estación 1: La Gotita Curiosa */}
        <AnimatePresence>
          {isModalOpen && selectedStation?.id === 'estacion-1' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-[#FFF5F7]"
            >
              <StationOneView
                onBackToMap={closeModal}
                onCompleteAndAdvance={() => {
                  markStationCompleted('estacion-1');
                  closeModal();
                  // Avanza automáticamente hacia la Estación 2
                  advanceToNextStation();
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Vista interactiva específica para Estación 2: La Gotita Viajera (Cuento Narrado) */}
        <AnimatePresence>
          {isModalOpen && selectedStation?.id === 'estacion-2' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-[#F0F9FF]"
            >
              <StationTwoStoryView
                onBackToMap={closeModal}
                onCompleteAndAdvance={() => {
                  markStationCompleted('estacion-2');
                  closeModal();
                  // Avanza automáticamente hacia la Estación 3 (La Gotita Valiente)
                  advanceToNextStation();
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Vista interactiva específica para Estación 3: La Gotita Valiente (Rompecabezas + Timer 5 min) */}
        <AnimatePresence>
          {isModalOpen && selectedStation?.id === 'estacion-3' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-[#F0FDF7]"
            >
              <StationThreePuzzleTimerView
                onBackToMap={closeModal}
                onCompleteAndAdvance={() => {
                  markStationCompleted('estacion-3');
                  closeModal();
                  // Avanza automáticamente hacia la Estación 4 (Adivinanzas)
                  advanceToNextStation();
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Vista interactiva específica para Estación 4: La Gotita Generosa (Adivinanzas) */}
        <AnimatePresence>
          {isModalOpen && selectedStation?.id === 'estacion-4' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-[#FFF5F8]"
            >
              <StationFourRiddleView
                onBackToMap={closeModal}
                onCompleteAndAdvance={() => {
                  markStationCompleted('estacion-4');
                  closeModal();
                  if (onGoToMeta) {
                    onGoToMeta();
                  } else {
                    // Avanza automáticamente hacia la Meta final (Banco de Leche Humana)
                    advanceToNextStation();
                  }
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Educativo para otras estaciones */}
        {selectedStation?.id !== 'estacion-1' &&
          selectedStation?.id !== 'estacion-2' &&
          selectedStation?.id !== 'estacion-3' &&
          selectedStation?.id !== 'estacion-4' &&
          selectedStation?.id !== 'meta-hudn' && (
          <StationModal
            key={selectedStation?.id || 'none'}
            isOpen={isModalOpen}
            onClose={closeModal}
            station={selectedStation}
            onCompleteStation={markStationCompleted}
            onAdvanceNext={advanceToNextStation}
            hasNextStation={currentStationIndex < totalStations - 1}
          />
        )}
      </div>
    </div>
  );
};

/**
 * Placeholder cartográfico simple si no se encontrara map-bg
 */
const PlaceholderMapGraphic: React.FC = () => {
  return (
    <div className="w-full h-full bg-gradient-to-b from-[#e0f2fe] via-[#dcfce7] to-[#fef3c7] flex items-center justify-center">
      <span className="text-slate-500 font-bold text-sm">Cargando mapa interactivo...</span>
    </div>
  );
};
