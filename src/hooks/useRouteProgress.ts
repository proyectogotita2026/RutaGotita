import { useState, useCallback, useMemo } from 'react';
import { ROUTE_STATIONS } from '../config/routeData';
import type { StationData } from '../types/route.types';

const STORAGE_KEY = 'la_ruta_gotita_progress_v1';

export interface RouteProgressReturn {
  currentStationIndex: number;
  currentStation: StationData;
  highestUnlockedIndex: number;
  completedStationIds: string[];
  isTraveling: boolean;
  isModalOpen: boolean;
  selectedStation: StationData | null;
  debugMode: boolean;
  totalStations: number;
  isCompleted: boolean;
  // Acciones
  moveToStation: (index: number) => void;
  advanceToNextStation: () => void;
  openStationModal: (station?: StationData) => void;
  closeModal: () => void;
  markStationCompleted: (stationId: string) => void;
  resetRoute: () => void;
  toggleDebugMode: () => void;
  setDebugMode: (enabled: boolean) => void;
  finishTraveling: () => void;
}

export function useRouteProgress(): RouteProgressReturn {
  const [currentStationIndex, setCurrentStationIndex] = useState<number>(0);
  const [highestUnlockedIndex, setHighestUnlockedIndex] = useState<number>(0);
  const [completedStationIds, setCompletedStationIds] = useState<string[]>([]);
  const [isTraveling, setIsTraveling] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedStation, setSelectedStation] = useState<StationData | null>(null);
  const [debugMode, setDebugMode] = useState<boolean>(false);

  const totalStations = ROUTE_STATIONS.length;
  const currentStation = useMemo(
    () => ROUTE_STATIONS[currentStationIndex] || ROUTE_STATIONS[0],
    [currentStationIndex]
  );

  const isCompleted =
    currentStationIndex === totalStations - 1 &&
    completedStationIds.includes(ROUTE_STATIONS[totalStations - 1].id);

  // Moverse a una estación específica (siempre que esté desbloqueada o en modo debug)
  const moveToStation = useCallback(
    (targetIndex: number) => {
      if (targetIndex < 0 || targetIndex >= ROUTE_STATIONS.length) return;
      if (targetIndex === currentStationIndex) {
        // Si ya está allí, abre directamente el modal
        setSelectedStation(ROUTE_STATIONS[targetIndex]);
        setIsModalOpen(true);
        return;
      }

      setIsTraveling(true);
      setCurrentStationIndex(targetIndex);

      // Desbloquear si el índice es mayor al alcanzado
      setHighestUnlockedIndex((prev) => Math.max(prev, targetIndex));
    },
    [currentStationIndex]
  );

  // Callback cuando la Gotita termina la animación de desplazamiento
  const finishTraveling = useCallback(() => {
    setIsTraveling(false);
    const station = ROUTE_STATIONS[currentStationIndex];
    setSelectedStation(station);
    setIsModalOpen(true);
  }, [currentStationIndex]);

  // Avanzar a la siguiente estación habilitada
  const advanceToNextStation = useCallback(() => {
    const nextIndex = currentStationIndex + 1;
    if (nextIndex < ROUTE_STATIONS.length) {
      moveToStation(nextIndex);
    }
  }, [currentStationIndex, moveToStation]);

  const openStationModal = useCallback(
    (station?: StationData) => {
      const target = station || currentStation;
      setSelectedStation(target);
      setIsModalOpen(true);
    },
    [currentStation]
  );

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const markStationCompleted = useCallback((stationId: string) => {
    setCompletedStationIds((prev) => {
      if (prev.includes(stationId)) return prev;
      return [...prev, stationId];
    });
  }, []);

  const resetRoute = useCallback(() => {
    setCurrentStationIndex(0);
    setHighestUnlockedIndex(0);
    setCompletedStationIds([]);
    setIsTraveling(false);
    setIsModalOpen(false);
    setSelectedStation(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignorar errores en entornos privados
    }
  }, []);

  const toggleDebugMode = useCallback(() => {
    setDebugMode((prev) => !prev);
  }, []);

  return {
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
    setDebugMode,
    finishTraveling,
  };
}
