/**
 * DATOS Y CONFIGURACIÓN DEL CUENTO ILUSTRADO
 * Estación 2: La Gotita Viajera
 * Banco de Leche Humana - Hospital Universitario Departamental de Nariño (HUDN)
 */

import cuento1 from '../assets/images/escenasCuentoAudio/Cuento1.jpeg';
import cuento2 from '../assets/images/escenasCuentoAudio/Cuento2.jpeg';
import cuento3 from '../assets/images/escenasCuentoAudio/Cuento3.jpeg';
import cuento4 from '../assets/images/escenasCuentoAudio/Cuento4.jpeg';
import cuento5 from '../assets/images/escenasCuentoAudio/Cuento5.jpeg';
import cuento6 from '../assets/images/escenasCuentoAudio/Cuento6.jpeg';
import cuento7 from '../assets/images/escenasCuentoAudio/Cuento7.jpeg';
import cuento8 from '../assets/images/escenasCuentoAudio/Cuento8.jpeg';
import cuento9 from '../assets/images/escenasCuentoAudio/Cuento9.jpeg';
import cuento10 from '../assets/images/escenasCuentoAudio/Cuento10.jpeg';
import cuento11 from '../assets/images/escenasCuentoAudio/Cuento11.jpeg';
import cuento12 from '../assets/images/escenasCuentoAudio/Cuento12.jpeg';
import cuentoAudioUrl from '../assets/images/escenasCuentoAudio/CuentoNarrado.mp4';

export { cuentoAudioUrl };

export interface CuentoScene {
  id: number;
  sceneNumber: number; // 1 a 12
  title: string;
  subtitle: string;
  image: string;
  startTime: number; // en segundos
  endTime: number; // en segundos
  timeRangeLabel: string;
  isCover?: boolean;
}

export const CUENTO_SCENES: CuentoScene[] = [
  {
    id: 1,
    sceneNumber: 1,
    title: 'La Aventura de la Gotita',
    subtitle: 'Una gran historia de amor, solidaridad y vida',
    image: cuento1,
    startTime: 0,
    endTime: 0,
    timeRangeLabel: 'Portada',
    isCover: true,
  },
  {
    id: 2,
    sceneNumber: 2,
    title: 'Gotita Viajera',
    subtitle: 'En busca de ayuda en la hermosa ciudad de Pasto',
    image: cuento2,
    startTime: 0,
    endTime: 9,
    timeRangeLabel: '00:00 - 00:09',
  },
  {
    id: 3,
    sceneNumber: 3,
    title: 'El Encuentro',
    subtitle: 'Descubriendo el Banco de Leche Humana',
    image: cuento3,
    startTime: 9,
    endTime: 27,
    timeRangeLabel: '00:09 - 00:27',
  },
  {
    id: 4,
    sceneNumber: 4,
    title: 'Héroes de la Salud',
    subtitle: 'El equipo médico y las mamás donantes de Nariño',
    image: cuento4,
    startTime: 27,
    endTime: 51,
    timeRangeLabel: '00:27 - 00:51',
  },
  {
    id: 5,
    sceneNumber: 5,
    title: 'Higiene y Esterilización',
    subtitle: 'Frascos limpios de vidrio para proteger cada gota',
    image: cuento5,
    startTime: 51,
    endTime: 74,
    timeRangeLabel: '00:51 - 01:14',
  },
  {
    id: 6,
    sceneNumber: 6,
    title: 'La Cadena de Frío',
    subtitle: 'La temperatura perfecta para viajar seguras',
    image: cuento6,
    startTime: 74,
    endTime: 95,
    timeRangeLabel: '01:14 - 01:35',
  },
  {
    id: 7,
    sceneNumber: 7,
    title: 'El Viaje Seguro',
    subtitle: 'Hieleras especiales que cuidan la leche materna',
    image: cuento7,
    startTime: 95,
    endTime: 110,
    timeRangeLabel: '01:35 - 01:50',
  },
  {
    id: 8,
    sceneNumber: 8,
    title: 'Llegada al Hospital',
    subtitle: 'Bienvenida en el Hospital Universitario de Nariño',
    image: cuento8,
    startTime: 110,
    endTime: 129,
    timeRangeLabel: '01:50 - 02:09',
  },
  {
    id: 9,
    sceneNumber: 9,
    title: 'Control y Calidad',
    subtitle: 'Cuidado profesional para garantizar máxima pureza',
    image: cuento9,
    startTime: 129,
    endTime: 147,
    timeRangeLabel: '02:09 - 02:27',
  },
  {
    id: 10,
    sceneNumber: 10,
    title: 'Pasteurización',
    subtitle: 'El proceso que elimina bacterias y conserva nutrientes',
    image: cuento10,
    startTime: 147,
    endTime: 179,
    timeRangeLabel: '02:27 - 02:59',
  },
  {
    id: 11,
    sceneNumber: 11,
    title: 'Amor para los Bebitos',
    subtitle: 'Nutrición que salva vidas en la UCI Neonatal',
    image: cuento11,
    startTime: 179,
    endTime: 197,
    timeRangeLabel: '02:59 - 03:17',
  },
  {
    id: 12,
    sceneNumber: 12,
    title: '¡Misión Cumplida!',
    subtitle: 'La magia de dar vida y compartir esperanza',
    image: cuento12,
    startTime: 197,
    endTime: 218,
    timeRangeLabel: '03:17 - 03:38',
  },
];

