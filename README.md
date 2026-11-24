# 💧 La Ruta de la Gotita
### Banco de Leche Humana • Hospital Universitario Departamental de Nariño (HUDN)

[![React](https://img.shields.io/badge/React-19.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-14.14-FF0055?logo=framer&logoColor=white)](https://www.framer-motion.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

---

## 🌟 Descripción del Proyecto

**La Ruta de la Gotita** es una aplicación web interactiva, pedagógica y gamificada desarrollada para el **Banco de Leche Humana del Hospital Universitario Departamental de Nariño (HUDN E.S.E.)**.

Su propósito es guiar a madres donantes, familias gestantes y lactantes, facilitadoras comunitarias y personal asistencial a través del maravilloso viaje que recorre la leche materna donada: desde el amor y la extracción en el hogar nariñense, pasando por los rigurosos procesos de bioseguridad, cadena de frío y pasteurización, hasta nutrir y salvar las vidas de recién nacidos prematuros y de bajo peso hospitalizados en la Unidad Neonatal del HUDN.

---

## ✨ Características Principales

### 🎬 1. Video de Bienvenida y Sensibilización
- Pantalla inicial con reproducción optimizada de alta calidad que introduce la misión de vida del Banco de Leche Humana.
- Control fluido con opción de omitir o continuar al mapa interactivo.

### 🗺️ 2. Mapa Ilustrado Interactivo & Caminata Fluida
- **Sendero Ilustrado 16:9:** Adaptado al 100% de la pantalla sin scroll vertical ni recortes.
- **Gotita Animada con Trayectoria Real (Waypoints):** La mascota no se teletransporta; camina y trota a lo largo de las curvas del camino morado con brinquitos rítmicos (`Framer Motion`), chispas doradas y diálogos contextuales.
- **Escalado Responsivo con Container Queries (`cqh`):** Diseñado tanto para pantallas pequeñas en modo apaisado (evitando solapamientos con la barra superior) como para pantallas de computadores, televisores y proyectores comunitarios.
- **Trajes Temáticos Sin Fondo:** Gotita Principal, Curiosa, Viajera, Valiente y Generosa procesadas con canal alfa transparente.

### 📚 3. Estaciones Pedagógicas de la Ruta
1. **Punto de Partida (El Árbol Protector):** Presentación del personaje y motivación de la aventura.
2. **Estación 1 • La Gotita Curiosa:** Preguntas y respuestas interactivas sobre qué es un Banco de Leche, sus objetivos, quiénes pueden donar y quiénes son los bebés beneficiarios.
3. **Estación 2 • La Gotita Viajera (Cuento Sincronizado en Pantalla Completa):**
   - Reproducción de audio y narración continua.
   - Sincronización automática de láminas ilustradas según los tiempos de la historia.
   - Controles de pausa/reanudación mediante toque en pantalla, botón flotante o tecla `Escape` / `Espacio`.
4. **Estación 3 • La Gotita Valiente (Dinámica de Rompecabezas en Equipo):**
   - Instrucciones pedagógicas para conformar 3 equipos de trabajo colaborativo.
   - Temporizador regresivo dinámico de 5 minutos con alertas visuales de tiempo.
5. **Estación 4 • La Gotita Generosa:** Reconocimiento al amor solidario y voluntario de las madres donantes de Nariño.
6. **Meta Triunfal • Banco de Leche Humana HUDN:** Llegada de la Gotita Generosa al Hospital, entrega de insignias de honor y mensaje de agradecimiento.

### 📱 4. Experiencia Móvil Horizontal (`OrientationGuard`)
- Bloqueo visual inteligente que invita al usuario a girar su celular o tablet a formato horizontal para garantizar la apreciación de todo el arte ilustrado.

---

## 🛠️ Tecnologías Utilizadas

| Categoría | Tecnología |
| :--- | :--- |
| **Framework Base** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) (Strict Mode) |
| **Herramienta de Construcción** | [Vite 8](https://vitejs.dev/) |
| **Estilos & Diseño** | [Tailwind CSS 3.4](https://tailwindcss.com/) + Tokens de Acuarela Pastel + Glassmorphism |
| **Tipografías** | *Fredoka* (Títulos y énfasis lúdicos) y *Nunito* (Textos de lectura clara) |
| **Animaciones & Fx** | [Framer Motion 14](https://www.framer-motion.dev/) + Canvas Particles |
| **Iconografía** | [Lucide React](https://lucide.dev/) |
| **Control de Calidad** | ESLint + TypeScript Typecheck + Prettier |

---

## 📁 Estructura del Código

```text
banco_leche/
├── public/                     # Favicon y recursos estáticos raíz
├── src/
│   ├── assets/
│   │   ├── images/             # Fondos ilustrados, láminas del cuento y gotitas PNG
│   │   └── videos/             # Video de inicio y audio narrado del cuento
│   ├── components/
│   │   ├── cover/              # Pantalla de bienvenida / portada
│   │   ├── intro/              # Reproductor de video de introducción
│   │   ├── map/                # Mapa interactivo, hotspots, calibrador y Gotita animada
│   │   ├── modals/             # Diálogos educativos y modales de estación
│   │   ├── stations/           # Vistas especializadas (Preguntas, Cuento, Rompecabezas)
│   │   ├── meta/               # Pantalla de llegada al Hospital e insignias
│   │   └── ui/                 # Botones reutilizables, guards de orientación y contenedores
│   ├── config/
│   │   ├── routeData.ts        # Fuente única de verdad (coordenadas, textos, preguntas)
│   │   └── scenesData.ts       # Cronograma de sincronización de láminas del cuento
│   ├── hooks/
│   │   └── useRouteProgress.ts # Control del estado del viaje, desbloqueo y progreso
│   ├── types/
│   │   └── route.types.ts      # Definiciones TypeScript de estaciones y coordenadas
│   ├── App.tsx                 # Orquestador principal de pantallas y estados
│   ├── index.css               # Reglas globales, fuentes y paleta de colores HUDN
│   └── main.tsx                # Entrada de la aplicación React
├── index.html                  # HTML5 base y metadatos del proyecto
├── package.json                # Dependencias y scripts de ejecución
├── tailwind.config.js          # Configuración de colores temáticos y animaciones
├── tsconfig.json               # Configuración de compilador TypeScript
└── vite.config.ts              # Configuración de empaquetado Vite
```

---

## 🚀 Instalación y Puesta en Marcha

### Prerrequisitos
- [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
- [pnpm](https://pnpm.io/) (o `npm` / `yarn`)

### 1. Clonar el repositorio
```bash
git clone https://github.com/proyectogotita2026/RutaGotita.git
cd RutaGotita
```

### 2. Instalar dependencias
```bash
pnpm install
# o con npm:
npm install
```

### 3. Iniciar entorno de desarrollo local
```bash
pnpm dev
# o con npm:
npm run dev
```
Abre en tu navegador la dirección indicada en la terminal (por defecto: `http://localhost:5173`).

### 4. Compilar para producción
```bash
pnpm build
# o con npm:
npm run build
```
Los archivos optimizados y listos para despliegue (en Vercel, Netlify o cualquier servidor web) se generarán en la carpeta `dist/`.

---

## 🏥 Créditos Institucionales

- **Entidad:** [Hospital Universitario Departamental de Nariño (HUDN E.S.E.)](https://www.hosdenar.gov.co/)
- **Programa:** Banco de Leche Humana de Nariño
- **Proyecto:** *La Ruta de la Gotita* (2026)
- **Misión:** Promoción, protección y apoyo de la lactancia materna y la donación voluntaria para salvar vidas de recién nacidos.

---
*Hecho con amor y dedicación para los bebés y madres de Nariño.* 💖💧
