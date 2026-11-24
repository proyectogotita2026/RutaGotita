import type { RiddleItem } from '../types/riddle.types';

/**
 * DATOS OFICIALES DE ADIVINANZAS - ESTACIÓN 4: LA GOTITA GENEROSA
 * Rutas de ilustraciones mapeadas a /assets/estacion4/
 */
export const RIDDLES_DATA: RiddleItem[] = [
  {
    id: 1,
    texto:
      'Soy pequeño y necesito cuidado, nací antes de lo esperado, la leche de otra mamá me puede ayudar.',
    pregunta: '¿Quién soy?',
    respuesta: 'Un bebé, especialmente un bebé prematuro o con bajo peso.',
    imagen: 'bebe-prematuro.png',
    emojiFallback: '👶',
    altText: 'Bebé prematuro en una cobija',
  },
  {
    id: 2,
    texto:
      'Antes de extraer la leche me debes limpiar muy bien. Con agua y jabón me limpias mejor.',
    pregunta: '¿Sabes quién soy?',
    respuesta: 'Las manos.',
    imagen: 'manos-lavado.png',
    emojiFallback: '🫧',
    altText: 'Lavado higiénico de manos con agua y jabón',
  },
  {
    id: 3,
    texto:
      'Si quieres donar leche y necesitas información, hay un lugar al que puedes contactar para recibir orientación.',
    pregunta: '¿Qué lugar es?',
    respuesta: 'El Banco de Leche Humana del HUDN.',
    imagen: 'banco-leche.png',
    emojiFallback: '🏥',
    altText: 'Banco de Leche Humana Hospital Universitario Departamental de Nariño',
  },
  {
    id: 4,
    texto:
      'Si tengo leche de más y quiero compartir, estoy saludable y cumplo los requisitos.',
    pregunta: '¿Qué puedo hacer para ayudar?',
    respuesta: 'Ser donante de leche humana.',
    imagen: 'mama-donante.png',
    emojiFallback: '🦸‍♀️',
    altText: 'Mamá donante solidaria de leche humana',
  },
  {
    id: 5,
    texto:
      'No soy comida ni bebida, pero puedo tener mucho olor. Para extraer leche de forma limpia no me debes usar, por favor.',
    pregunta: '¿Quién soy?',
    respuesta: 'Perfumes y cremas.',
    imagen: 'perfume.png',
    emojiFallback: '🌸',
    altText: 'Frasco de perfume con aroma fuerte',
  },
  {
    id: 6,
    texto:
      'Tengo cuatro patas, puedo ser muy juguetón, pero mientras extraes la leche debo estar lejos de la habitación.',
    pregunta: '¿Quién soy?',
    respuesta: 'Las mascotas.',
    imagen: 'mascotas.png',
    emojiFallback: '🐾',
    altText: 'Mascota juguetona alejada del área de extracción',
  },
];
