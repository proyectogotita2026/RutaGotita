/**
 * CONFIGURACIÓN OFICIAL DE LA PANTALLA "LA META"
 * Todos los textos, enlaces y contactos son editables directamente aquí.
 */

// Teléfono o WhatsApp de contacto oficial del Banco de Leche Humana (HUDN)
// Formato internacional: código de país + número (ej. "573100000000")
export const CONTACTO_BANCO = '573100000000';

// Mensaje predeterminado para el enlace de WhatsApp
export const MENSAJE_WHATSAPP =
  '¡Hola! Completé La Ruta de la Gotita y me gustaría recibir más información sobre el Banco de Leche Humana.';

// Texto para compartir en redes o mensajería (Web Share API)
export const TEXTO_COMPARTIR =
  'Hice la Ruta de la Gotita 💧 Aprendí que la leche humana puede ayudar a bebés que lo necesitan.';

// Mensajes rotativos de gratitud e inspiración (1-2 líneas, tono cálido y sin juzgar)
export const FRASES_FINALES: string[] = [
  'Cada gotita de leche humana puede ser una gran ayuda para un bebé.',
  'Informarte ya es un acto de amor. ¡Gracias por llegar hasta aquí!',
  'Donar, apoyar o compartir lo aprendido: todas las formas suman.',
];

// Estaciones recorridas para los badges de "Lo que te llevas"
export interface StationBadgeItem {
  id: string;
  name: string;
  shortTitle: string;
  color: string;
  bgLight: string;
  borderColor: string;
  emoji: string;
}

export const ESTACIONES_RECORRIDAS: StationBadgeItem[] = [
  {
    id: 'estacion-1',
    name: '1. Curiosa',
    shortTitle: 'Calostro y Defensas',
    color: '#0284C7',
    bgLight: '#E0F2FE',
    borderColor: '#38BDF8',
    emoji: '🔍',
  },
  {
    id: 'estacion-2',
    name: '2. Viajera',
    shortTitle: 'Cadena de Frío',
    color: '#0284C7',
    bgLight: '#EAF4FF',
    borderColor: '#7EC1FF',
    emoji: '❄️',
  },
  {
    id: 'estacion-3',
    name: '3. Valiente',
    shortTitle: 'Pasteurización',
    color: '#E08A00',
    bgLight: '#FFF3CC',
    borderColor: '#FFC857',
    emoji: '🧩',
  },
  {
    id: 'estacion-4',
    name: '4. Generosa',
    shortTitle: 'Amor Solidario',
    color: '#D9609A',
    bgLight: '#FFE3F0',
    borderColor: '#F6A6C9',
    emoji: '💖',
  },
];
