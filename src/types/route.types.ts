/**
 * Tipos e interfaces estrictas para "La Ruta de la Gotita"
 * Banco de Leche Humana - Hospital Universitario Departamental de Nariño (HUDN)
 */

export type ScreenView = 'cover' | 'intro-video' | 'map' | 'meta';

export type StationType = 'start' | 'station' | 'goal';

export interface WaypointCoordinates {
  x: number; // Porcentaje horizontal (0 - 100%)
  y: number; // Porcentaje vertical (0 - 100%)
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
}

export interface QuizItem {
  id: string;
  question: string;
  options: QuizOption[];
  explanation: string;
}

export interface RiddleItem {
  riddleText: string;
  hint?: string;
  answerText: string;
  funFact: string;
}

export interface StationQuestionItem {
  id: number;
  question: string;
  answer: string;
  themeColor: string; // Color principal (ej: #38BDF8)
  bgColor: string; // Color de fondo pastel (ej: #E0F2FE)
  badgeLabel?: string;
}

export interface PuzzleItem {
  id: number;
  title: string;
  subtitle?: string;
}

export interface PuzzleActivityConfig {
  instruction: string;
  defaultDurationSeconds: number; // 300 segundos = 5 minutos
  puzzles: PuzzleItem[];
}

export interface StationData {
  id: string;
  index: number;
  numberLabel?: string; // Ej. "Estación 1", "Meta"
  name: string;
  subtitle: string;
  shortDescription: string;
  educationalContent: string;
  type: StationType;
  coordinates: WaypointCoordinates;
  themeColor: 'pink' | 'sky' | 'mint' | 'lavender' | 'cream' | 'hudn';
  iconName: string; // Identificador para renderizar icono de Lucide
  quiz?: QuizItem;
  riddle?: RiddleItem;
  dialogQuestions?: StationQuestionItem[]; // Preguntas secuenciales interactivas
  puzzleActivity?: PuzzleActivityConfig; // Actividad de rompecabezas con cronómetro
  badgeReward?: {
    title: string;
    description: string;
    emoji: string;
  };
}

export interface GameState {
  currentStationIndex: number;
  highestUnlockedIndex: number;
  completedStationIds: string[];
  isTraveling: boolean;
  isModalOpen: boolean;
  selectedStationId: string | null;
  debugMode: boolean;
  soundEnabled: boolean;
}
