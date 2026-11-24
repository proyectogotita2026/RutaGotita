# 🏁 Assets para la Pantalla "La Meta"

Esta carpeta almacena las ilustraciones oficiales de la escena final en el Banco de Leche Humana del Hospital Universitario Departamental de Nariño (HUDN).

## Estado de Assets

| Archivo | Rol en Pantalla | Tamaño Recomendado | Formato | Estado Actual |
| :--- | :--- | :--- | :--- | :--- |
| `edificio-banco-leche.png` | Edificio del Banco de Leche (azul claro, cruz, banderín Meta) | 600×600 px | PNG con canal alfa real | ⚠️ Pendiente (Usa escena vectorial / hospital de Canva como fallback) |
| `gotita-celebrando.png` | Gotita feliz con brazos arriba celebrando | 600×800 px | PNG con canal alfa real | ⚠️ Pendiente (Usa gotita base celebrando con animación de saltito) |
| `camino-meta.svg` | Sendero hacia la puerta del hospital | Vectorial SVG | SVG | ✅ Integrado con animación strokeDashoffset |
| `logo-ruta-gotita.png` | Logotipo de La Ruta de la Gotita | 400×200 px | PNG con canal alfa real | ⚠️ Pendiente (Usa tipografía Fredoka con icono de corazón) |

> **Nota técnica:** Todas las imágenes se cargan con `loading="eager"`, `decoding="async"` y `filter: drop-shadow(...)` sin ningún marco ni recuadro cuadrado visible.
