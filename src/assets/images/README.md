# Directorio de Assets Gráficos

Las imágenes del proyecto se gestionan en este directorio e incluyen soporte nativo para formatos **JPEG** (`.jpeg`, `.jpg`) y **PNG** (`.png`):

1. **`cover-bg.jpeg`** (o `cover-bg.jpg` / `cover-bg.png`):
   - Imagen de fondo para la Pantalla de Inicio (Slice 1).
   - Proporción recomendada: 1920x1080 (16:9).

2. **`map-bg.jpeg`** (o `map-bg.jpg` / `map-bg.png`):
   - Imagen de fondo para el Mapa Interactivo (Slice 2).
   - Proporción recomendada: 1920x1080 (16:9).

3. **`gotita.jpg`** (o `gotita.png`):
   - Ilustración de la mascota Gotita de Leche para el mapa.

4. **`gotita-curiosa.png`** (o `gotita-curiosa.jpg`):
   - Ilustración de la Gotita detective con gafas y lupa para la Estación 1.

Las imágenes se importan centralizadamente desde `src/assets/images/index.ts` vía Vite, garantizando máxima velocidad, resolución automática y compatibilidad en entornos locales y de producción.
