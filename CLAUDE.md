# Sistema de Propuestas Comerciales — Sixteam.pro
# Deployment: propuestas.sixteam.pro (VPS + EasyPanel)

Este proyecto es **exclusivamente** para propuestas comerciales internas de Sixteam.pro.
No es la página web pública — es un sistema de documentos interactivos para clientes.

## Herramientas disponibles (MCP)

### 🎨 NanoBanana MCP (`nanobanana`)
Genera imágenes, mockups y referencias visuales con Gemini.
- Úsalo para crear visuales de cabecera de cada propuesta
- Genera dashboards, diagramas de proceso, iconografía de cliente

### 🖌️ Google Stitch MCP (`stitch`)
Genera interfaces HTML/CSS con Gemini 2.5 Pro.
- Úsalo para conceptualizar layouts de nuevas propuestas
- Proyecto Google Cloud: `sixteam-design`

### ⚡ 21st Dev Magic (`21st-magic`)
Librería de componentes React/Tailwind CSS premium.
- Úsalo con `/ui` para obtener componentes listos
- Pricing tables, timeline sections, KPI cards

## Sistema de Diseño — Sixteam.pro

### Colores (paleta exclusiva)
| Token | Hex | Uso |
|-------|-----|-----|
| `--navy` | `#0a2342` | Fondo principal (dark-first) |
| `--blue` | `#1d70a2` | Secundario, gradientes, bordes |
| `--teal` | `#00bfa5` | Acento primario, CTAs, highlights |
| `--gray` | `#e0e0e0` | Texto secundario sobre oscuro |
| `--white` | `#ffffff` | Texto principal |
| `--darkbg` | `#030d1a` | Fondo base propuestas (más oscuro que navy) |

### Tipografía
- **Poppins** — Headings H1–H6 (weight: 700/800/900)
- **Lato** — Body, párrafos, labels (weight: 300/400/500)

### Identidad
- **Nombre:** Sixteam.pro (siempre con punto)
- **NIT:** 901.967.849-4
- **RL:** Samuel Armando Burgos Ferrer
- **Email:** alpha@sixteam.pro
- **Fórmula:** Process + Technology + People = Growth

---

## Estructura del proyecto

```
src/
├── pages/
│   ├── Home.tsx           — Dashboard de propuestas activas
│   └── StunetProposal.tsx — Propuesta Stunet Education Agency
├── components/
│   └── PDFButton.tsx      — Botón de exportación PDF
└── hooks/
    └── usePDF.ts          — Hook html2canvas + jsPDF
```

## Cómo agregar una nueva propuesta

1. Duplica `src/pages/StunetProposal.tsx` → `src/pages/NuevoClienteProposal.tsx`
2. Modifica el objeto `META` con los datos del cliente
3. Actualiza `FASES`, `KPIS`, `HALLAZGOS` con los datos de la propuesta
4. Agrega la ruta en `src/App.tsx`:
   ```tsx
   const NuevoClienteProposal = lazy(() => import('./pages/NuevoClienteProposal'));
   <Route path="/nuevo-cliente" element={<NuevoClienteProposal />} />
   ```
5. Agrega el cliente al array `PROPOSALS` en `src/pages/Home.tsx`
6. Genera visual con NanoBanana y guárdalo en `public/`

## Flujo recomendado para nueva propuesta

1. **Investigar al cliente** — Busca la empresa, su web, redes sociales, sector
2. **Mockup visual** — Usa NanoBanana para generar imagen de cabecera con contexto del cliente
3. **Contenido** — Adapta StunetProposal con los datos reales del nuevo cliente
4. **PDF** — El botón "Exportar PDF" captura la página completa con html2canvas + jsPDF

## Reglas de diseño

**Siempre:**
- Dark-first (fondo `#030d1a` como base)
- Mobile-first responsive
- Usar colores del cliente como acento, no como dominante
- Incluir `class="no-print"` en elementos que no deben aparecer en el PDF
- PDFButton con `elementId="proposal-root"` en cada propuesta

**Nunca:**
- Fondos blancos en propuestas (solo RadarKit usa fondo claro por diseño propio)
- Información confidencial del cliente en el código sin necesidad
- Subir propuestas antiguas sin archivar

## Deployment — EasyPanel + VPS

- **Dominio:** propuestas.sixteam.pro
- **Puerto interno:** 3000 (servido por nginx)
- **Build:** `npm run build` → genera `dist/`
- **Dockerfile:** multi-stage (node:20 build + nginx:alpine serve)
- **Variables de entorno:** No se requieren en frontend (todo hardcoded en src)

Ver `Dockerfile` y `nginx.conf` para configuración de despliegue.
