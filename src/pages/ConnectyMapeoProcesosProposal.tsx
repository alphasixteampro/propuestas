import React, { useState, useEffect, useRef } from 'react';
import LogoCarousel from '../components/LogoCarousel';
import PDFButton from '../components/PDFButton';
import {
  CheckCircle, ChevronRight, Clock, FileText, Target, Zap, BarChart3,
  Calendar, Info, MapPin, Wifi, Settings, Users, GitBranch, Layers,
  Bot, Sparkles, ClipboardList, Workflow, Flag, Package, Headphones,
  Megaphone, Briefcase, Cpu, Scale, Ban, Inbox, Boxes, Network,
  ListChecks, HelpCircle, UserCheck, FileCode, Table2, ShieldCheck, TrendingUp, RefreshCw,
} from 'lucide-react';

// ─── DATOS ───────────────────────────────────────────────────────────────────

const META = {
  cliente: 'Conecty',
  tagline: 'Conectando al Viajero',
  fecha: 'Septiembre 2026',
  lugar: 'Colombia',
  duracion: '12 semanas estimadas',
  proponente: 'Sixteam Innovación y Estrategia Digital S.A.S.',
  nit: '901.967.849-4',
  correo: 'alpha@sixteam.pro',
  rl: 'Samuel Armando Burgos Ferrer',
  objetivo: 'Entender cómo opera Conecty hoy, y cómo debe operar, antes de que sus nuevos sistemas lo automaticen.',
};

const CONECTY_BLUE = '#0ea5e9';
const TOTAL_DISPLAY = 'COP 19.700.000';

// ─── TARIFARIO ───────────────────────────────────────────────────────────────

const NIVELES = [
  {
    nombre: 'Complejo', horas: 6, precio: 585000, color: '#f87171',
    desc: 'Responsable no definido entre áreas, alto volumen o riesgo alto.',
    ejemplos: 'F-08 Reconciliación con el sistema contable · S-01 Atención de soporte técnico · C-04 Gestión de cambios y devoluciones',
  },
  {
    nombre: 'Medio', horas: 3, precio: 292500, color: CONECTY_BLUE,
    desc: 'Proceso estándar, con un responsable claro.',
    ejemplos: 'F-05 Facturar una venta · S-08 Programar el turno del equipo · C-05 Elaborar el informe de ventas',
  },
  {
    nombre: 'Básico', horas: 1, precio: 97500, color: '#34d399',
    desc: 'Bajo volumen, no se ejecuta hoy, o es parte de un proceso mayor ya mapeado.',
    ejemplos: 'S-17 y S-18, declarados como no ejecutados · M-02 a M-04, subprocesos de la gestión de validadores',
  },
];

// ─── RECLASIFICACIÓN PROCESO / SUBPROCESO ───────────────────────────────────

const CLUSTERS = [
  {
    raiz: 'M-01 · Atender a un validador', frente: 'A · Mercadeo',
    subprocesos: ['M-02 Entregar un canje', 'M-03 Verificar los canjes del período', 'M-04 Asociar las comisiones'],
    razon: 'Empieza cuando el validador contacta al canal y termina con su canje y su comisión liquidada.',
  },
  {
    raiz: 'S-13 · Activar un plan de forma manual', frente: 'A · Servicio al Cliente',
    subprocesos: ['S-12 Revisar activaciones pendientes', 'S-14 Generar el QR', 'S-15 Solicitar el QR faltante', 'S-16 Cambio de SIM', 'S-17 Auditar una activación', 'S-18 Informe de errores'],
    razon: 'Es una sola etapa del flujo de valor de Conecty, Activation, hoy repartida en siete filas.',
  },
  {
    raiz: 'S-06 · Informe de productividad del área', frente: 'A · Servicio al Cliente',
    subprocesos: ['S-04 Auditar una conversación', 'S-05 Retroalimentar a un asesor', 'S-07 Calcular la bonificación'],
    razon: 'Un solo ciclo de gestión del desempeño del equipo.',
  },
  {
    raiz: 'F-12 · Aprobar el cupo de crédito', frente: 'B · Financiera',
    subprocesos: ['F-10 Cobro de cartera vencida', 'F-13 Bloquear por mora', 'F-14 Castigar cartera incobrable'],
    razon: 'Es el ciclo de riesgo de crédito de un distribuidor, no cuatro procesos independientes.',
  },
  {
    raiz: 'F-05 · Facturar una venta', frente: 'B · Financiera',
    subprocesos: ['F-06 Registrar el recaudo', 'F-07 Conciliar contra el extracto'],
    razon: 'Es el ciclo de la venta al cobro. F-08 se mantiene aparte por ser el proceso más importante del frente.',
  },
];

// ─── ALCANCE POR FRENTE ──────────────────────────────────────────────────────

const FRENTES = [
  {
    id: 'A', nombre: 'Canal unificado', total: 32, color: CONECTY_BLUE,
    areas: [{ area: 'Servicio al Cliente', n: 18 }, { area: 'Mercadeo', n: 7 }, { area: 'Comercial', n: 7 }],
    calendario: 'Antes de su configuración. Entra en operación en noviembre',
    complejo: 9, medio: 9, basico: 1, subprocesos: 12,
    notaEspecial: 'C-01 y C-02 tienen menor costo porque parten de la consultoría de CRM ya entregada.',
  },
  {
    id: 'B', nombre: 'Núcleo administrativo', total: 13, color: '#00bfa5',
    areas: [{ area: 'Financiera', n: 13 }],
    calendario: 'Lo antes posible. Su construcción ya inició',
    complejo: 5, medio: 3, basico: 0, subprocesos: 5,
    notaEspecial: 'De los 18 procesos de la solicitud, se estima que cinco salen del alcance. Si alguno se mantiene, se suma con la tabla de la sección 4.',
  },
];

const FRENTE_C = {
  nombre: 'Qué dispara la activación automática y qué pasa si falla',
  original: 'Contrato de disparo al motor orquestador',
  desc: 'Define qué pone en marcha la activación del plan de un cliente, con qué información y qué ocurre si falla, para que nadie quede pagando sin servicio. Se entrega con el Frente B y ya está incluido en el precio.',
};

// ─── MÉTODO ──────────────────────────────────────────────────────────────────

const CAPAS = [
  { nombre: 'SIPOC', letra: 'Gobierno', color: CONECTY_BLUE, icon: UserCheck,
    desc: 'Quién entrega qué, a quién y en qué sistema. Deja claro el responsable de cada proceso.' },
  { nombre: 'VSM', letra: 'Eficiencia', color: '#00bfa5', icon: Clock,
    desc: 'Cuánto tiempo es trabajo real, cuánto es espera y cuánto se repite.' },
  { nombre: 'Makigami', letra: 'Fricción', color: '#f59e0b', icon: Scale,
    desc: 'Dónde se pierde tiempo: reprocesos, tareas manuales, datos que se digitan dos veces. Aquí se decide qué automatizar y qué eliminar.' },
];

const MODALIDAD = [
  { rol: Users, nombre: 'Consultor Sixteam', color: '#00bfa5',
    items: ['Conduce las mesas de trabajo con los líderes de área', 'Valida en entrevista lo que dicen las encuestas y la documentación', 'Revisa la calidad de cada entregable'] },
  { rol: Bot, nombre: 'Agente Sixteam asistido por IA', color: '#a78bfa',
    items: ['Apoya al consultor en la ejecución de la encuesta a la medida para cada rol, con la documentación ya recogida', 'Detecta contradicciones entre respuestas y documentos'] },
];

// ─── PLAN DE TRABAJO ─────────────────────────────────────────────────────────

const SEMANAS = 12;

const ETAPAS = [
  { num: '1', nombre: 'Mesas de trabajo con líderes', inicio: 1, fin: 2, color: '#a78bfa', frentes: 'A y B',
    desc: 'Arrancamos con los líderes de cada área para entender la operación, recoger la documentación existente y acordar prioridades. No toma más de 5 horas en total.' },
  { num: '2', nombre: 'Encuestas personalizadas por rol', inicio: 2, fin: 5, color: '#a78bfa', frentes: 'A y B',
    desc: 'Con lo recogido, cada colaborador recibe una encuesta hecha para su rol. Muestra qué hace cada persona dentro de cada proceso y cada flujo, con las actividades tal como ocurren hoy en la práctica.' },
  { num: '3', nombre: 'Entrevistas de validación', inicio: 4, fin: 7, color: '#a78bfa', frentes: 'A y B',
    desc: 'Sesiones virtuales o presenciales con roles específicos para confirmar lo que dicen las encuestas y revisar la documentación que aporte al análisis.' },
  { num: '4A', nombre: 'Entregables del Frente A', inicio: 8, fin: 10, color: CONECTY_BLUE, frentes: 'A',
    desc: 'Diagrama, documento y filas del Excel de cada proceso, en Baseline y Target. Se entrega primero porque el canal unificado entra en operación en noviembre.' },
  { num: '4B', nombre: 'Entregables de los Frentes B y C', inicio: 8, fin: 11, color: '#00bfa5', frentes: 'B y C',
    desc: 'Los procesos del núcleo administrativo y, junto con ellos, la especificación de la activación automática (Frente C).' },
  { num: '5', nombre: 'Validación y cierre', inicio: 12, fin: 12, color: '#34d399', frentes: 'A, B y C',
    desc: 'Revisión final con el responsable de cada frente y entrega del modelo de datos, las interfaces y las iniciativas de diseño.' },
];

const DISPONIBILIDAD = [
  { rol: 'Líderes de área', actividad: 'Mesas de trabajo', a: '3 h en total', b: '2 h en total' },
  { rol: 'Colaboradores', actividad: 'Encuesta personalizada, a su ritmo', a: 'Cerca de 1 h por persona', b: 'Cerca de 1 h por persona' },
  { rol: 'Roles seleccionados', actividad: 'Entrevistas de validación', a: '1 a 2 h por persona · 4 a 6 personas', b: '1 a 2 h por persona · 2 a 4 personas' },
  { rol: 'Responsable del frente', actividad: 'Revisión y aprobación de entregables', a: '1 h por semana', b: '1 h por semana' },
];

const EQUIPO = [
  { nombre: 'Samuel Burgos', cargo: 'Gerente General · Líder de Proyecto', desc: 'Dirige el proyecto y responde por la calidad final de cada entregable.' },
  { nombre: 'Ernesto Hernández', cargo: 'Gerente Comercial · Experto en Diseño de Procesos', desc: 'Conduce las mesas de trabajo y las entrevistas, y diseña los procesos Baseline y Target.' },
];

// ─── INVERSIÓN ───────────────────────────────────────────────────────────────

const DESGLOSE = [
  { concepto: 'Frente A · Canal unificado', detalle: '32 procesos', monto: 9555000 },
  { concepto: 'Frente B · Núcleo administrativo', detalle: '13 procesos, incluye el Frente C', monto: 4290000 },
  { concepto: 'Apoyo transversal', detalle: 'Interfaces, modelo de datos, iniciativas y gestión del proyecto', monto: 5855000 },
];

// ─── ENTREGABLES ─────────────────────────────────────────────────────────────

const ENTREGABLES_PROCESO = [
  { nombre: 'Archivo .bpmn', desc: 'El diagrama en BPMN 2.0, editable, generado desde las mismas filas del Excel para que ambos coincidan.' },
  { nombre: 'Documento en Word', desc: 'Con la estructura del ejemplo del Anexo 2: propósito, alcance, fronteras entre áreas, reglas de negocio, datos y sistemas, excepciones con su frecuencia, medición y hallazgos para la arquitectura.' },
  { nombre: 'Filas en el Excel de mapeo', desc: 'Hojas Procesos, Pasos e Interfaces, con los identificadores de la hoja Referencias. Las columnas en gris quedan para Conecty.' },
];

const ENTREGABLES_FRENTE = [
  { nombre: 'Modelo de datos', desc: 'Qué información maneja el frente y cómo se relaciona. No incluye diseño técnico de base de datos.' },
  { nombre: 'Especificación de interfaces', desc: 'Qué información pasa entre sistemas, quién es su dueño y qué pasa si falla.' },
  { nombre: 'Iniciativas y directrices de diseño', desc: 'Recomendaciones para el equipo de tecnología de Conecty, que las implementa.' },
];

const FUERA_DE_ALCANCE = [
  'CRM del canal B2B, ya entregado',
  'Ciclo de producto e inventario, que mapea el equipo de Conecty',
  'Procesos internos de personas, tecnología y compras',
  'Estudio formal de tiempos y movimientos',
  'Acompañar o verificar la construcción de interfaces (disponible como bolsa de horas)',
];

const SECCIONES = [
  { id: 'resumen', label: 'Resumen' },
  { id: 'plan', label: 'Plan de trabajo' },
  { id: 'metodo', label: 'Método' },
  { id: 'tarifario', label: 'Tarifario' },
  { id: 'inversion', label: 'Inversión' },
  { id: 'entregables', label: 'Entregables' },
  { id: 'vigencia', label: 'Vigencia' },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function useVisible(threshold = 0.12) {
  const ref = useRef<HTMLElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, [threshold]);
  return { ref, v };
}

const fmtCOP = (n: number) => `COP ${n.toLocaleString('es-CO')}`;

const TagLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="font-lato text-[#00bfa5] text-[13px] uppercase tracking-[0.22em] font-medium">{children}</span>
);
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-poppins font-extrabold text-white mt-2 mb-2 leading-tight"
    style={{ fontSize: 'clamp(1.8125rem, 4.375vw, 2.625rem)' }}>
    {children}
  </h2>
);
const Rule = () => (
  <div className="w-10 h-0.5 mb-7 mt-1" style={{ background: 'linear-gradient(90deg,#1d70a2,#00bfa5)' }} />
);

// ─── COMPONENTE ──────────────────────────────────────────────────────────────

const ConnectyMapeoProcesosProposal = () => {
  const [activeSection, setActiveSection] = useState('resumen');
  const [clusterActivo, setClusterActivo] = useState<number | null>(0);
  const [terminoActivo, setTerminoActivo] = useState<number | null>(null);

  useEffect(() => {
    const handler = () => {
      for (const s of SECCIONES) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 140 && rect.bottom > 140) { setActiveSection(s.id); break; }
      }
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const s1 = useVisible(); const s2 = useVisible(); const s3 = useVisible(); const s4 = useVisible();
  const s5 = useVisible(); const s6 = useVisible(); const s7 = useVisible();


  return (
    <div id="proposal-root" className="min-h-screen overflow-x-hidden" style={{ background: '#030d1a', fontFamily: 'Lato, sans-serif' }}>

      {/* ── NAV LATERAL ── */}
      <nav className="hidden lg:flex fixed right-5 top-1/2 -translate-y-1/2 z-50 flex-col gap-3 no-print">
        {SECCIONES.map(s => (
          <button key={s.id} onClick={() => scrollTo(s.id)}
            className={`group flex items-center gap-2.5 transition-all duration-300 ${activeSection === s.id ? 'opacity-100' : 'opacity-25 hover:opacity-60'}`}>
            <span className={`font-lato text-[14px] text-white whitespace-nowrap transition-all duration-300 ${activeSection === s.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`}>
              {s.label}
            </span>
            <div className={`rounded-full flex-shrink-0 transition-all duration-300 ${activeSection === s.id ? 'w-2 h-2 bg-[#00bfa5] shadow-[0_0_6px_rgba(0,191,165,.7)]' : 'w-1.5 h-1.5 bg-white/50'}`} />
          </button>
        ))}
      </nav>

      <div className="fixed bottom-5 right-5 z-50 no-print">
        <PDFButton filename="conecty-mapeo-procesos-sixteam.pdf" elementId="proposal-root" />
      </div>

      {/* ══════════ PORTADA */}
      <header className="relative min-h-screen flex flex-col overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #010408 0%, #020810 55%, #030d1a 100%)' }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(14,165,233,.06) 0%, transparent 65%)' }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(29,112,162,.05) 0%, transparent 70%)', transform: 'translate(-20%,20%)' }} />
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)', backgroundSize: '56px 56px' }} />
        </div>

        <div className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 border-b" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center bg-white">
                <img src="/sixteam-logo.png" alt="Sixteam.pro" className="w-full h-full object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
              <div className="hidden sm:block">
                <span className="font-poppins font-black text-white text-xl tracking-tight">Sixteam<span className="text-[#00bfa5]">.</span>pro</span>
                <p className="font-lato text-white/35 text-[13px] leading-none mt-0.5">Innovación y Estrategia Digital</p>
              </div>
            </div>
            <div className="w-px h-8 bg-white/10 hidden sm:block" />
            <div className="w-auto h-12 flex items-center justify-center">
              <img src="/logo-webp_180x_2x-removebg-preview.png" alt="Conecty" className="h-full w-auto object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
          </div>
          <span className="font-lato text-[#00bfa5]/80 text-[13px] uppercase tracking-[0.2em] border border-[#00bfa5]/20 rounded-full px-3 py-1.5">Confidencial</span>
        </div>

        <div className="relative z-10 flex-1 flex items-center justify-center py-12" style={{ paddingLeft: '10%', paddingRight: '10%' }}>
          <div className="w-full grid grid-cols-1 lg:grid-cols-[55%_45%] gap-10 lg:gap-12 items-center">

            <div className="flex flex-col justify-center">
              <TagLabel>Respuesta a solicitud formal · Cotización</TagLabel>
              <div className="mt-4 mb-3 flex flex-wrap items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${CONECTY_BLUE}, #1d70a2)` }}>
                  <Wifi className="w-3 h-3 text-white" />
                </div>
                <span className="font-lato text-white/45 text-[15px]">Para:</span>
                <span className="font-poppins font-bold text-white/85 text-[18px]">{META.cliente}</span>
                <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: 'rgba(14,165,233,.10)', border: '1px solid rgba(14,165,233,.25)', color: CONECTY_BLUE }}>
                  {META.tagline}
                </span>
              </div>
              <h1 className="font-poppins font-black text-white leading-[1.0] mb-4"
                style={{ fontSize: 'clamp(2.4rem, 4.4vw, 4.2rem)' }}>
                Mapeo de<br />
                <span style={{ background: 'linear-gradient(90deg,#1d70a2,#00bfa5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Procesos
                </span>
              </h1>
              <p className="font-lato text-white/55 text-xl leading-relaxed mb-5">{META.objetivo}</p>
              <div className="inline-flex flex-wrap items-center gap-1.5 px-4 py-2 rounded-xl mb-6 self-start"
                style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.09)' }}>
                <span className="font-poppins font-bold text-white/80 text-[15px] sm:text-[18px]">Process</span>
                <span className="font-poppins font-bold text-[#1d70a2] text-[15px] sm:text-[18px]">+</span>
                <span className="font-poppins font-bold text-[#1d70a2] text-[15px] sm:text-[18px]">Technology</span>
                <span className="font-poppins font-bold text-[#00bfa5] text-[15px] sm:text-[18px]">+</span>
                <span className="font-poppins font-bold text-[#00bfa5] text-[15px] sm:text-[18px]">People</span>
                <span className="font-poppins font-bold text-white/50 text-[15px] sm:text-[18px]">=</span>
                <span className="font-poppins font-black text-[#00bfa5] text-[15px] sm:text-[18px]">Growth</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-8">
                {[
                  { icon: Calendar, text: META.fecha },
                  { icon: MapPin, text: META.lugar },
                  { icon: Boxes, text: '45 procesos · 2 frentes' },
                ].map((chip, i) => {
                  const Icon = chip.icon;
                  return (
                    <div key={i} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[15px] text-white/60"
                      style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)' }}>
                      <Icon className="w-3.5 h-3.5 text-[#00bfa5]" /> {chip.text}
                    </div>
                  );
                })}
              </div>
              <div className="border-t pt-5" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-widest mb-3">Contenido</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                  {['1. Resumen ejecutivo','2. Plan de trabajo','3. Método','4. Tarifario por complejidad','5. Inversión','6. Entregables','7. Vigencia'].map((item, i) => (
                    <button key={i} onClick={() => scrollTo(SECCIONES[i]?.id)}
                      className="font-lato text-white/45 text-[15px] hover:text-[#00bfa5] transition-colors duration-200 text-left flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-[#00bfa5]/40 flex-shrink-0" />
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center relative min-h-[380px]">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="absolute w-80 h-80 rounded-full"
                  style={{ background: 'radial-gradient(circle, rgba(14,165,233,.10) 0%, rgba(29,112,162,.05) 50%, transparent 70%)' }} />
                <div className="absolute w-96 h-96 rounded-full" style={{ border: '1px solid rgba(14,165,233,.12)' }} />
                <div className="absolute w-64 h-64 rounded-full" style={{ border: '1px dashed rgba(29,112,162,.15)' }} />
              </div>
              <div className="relative z-10 flex flex-col items-center gap-6 w-full px-6">
                <div className="flex flex-col items-center gap-1">
                  <img src="/sixteam-logo.png" alt="Sixteam.pro" className="h-20 w-auto object-contain"
                    style={{ filter: 'drop-shadow(0 4px 20px rgba(0,191,165,.45))' }} />
                  <span className="font-poppins font-black text-white/30 text-[11px] uppercase tracking-[0.2em]">Sixteam.pro</span>
                </div>
                <div className="flex items-center gap-3 w-full">
                  <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.08))' }} />
                  <div className="flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)' }}>
                    <span className="font-poppins font-black text-white/40 text-[20px] leading-none">×</span>
                  </div>
                  <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,.08), transparent)' }} />
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-64 h-32 flex items-center justify-center p-3">
                    <img src="/logo-webp_180x_2x-removebg-preview.png" alt="Conecty" className="w-full h-full object-contain"
                      style={{ filter: 'drop-shadow(0 2px 20px rgba(14,165,233,.5))' }} />
                  </div>
                  <div className="text-center">
                    <span className="font-poppins font-black text-white text-[28px] tracking-tight">Conecty</span>
                    <p className="font-lato text-[13px] uppercase tracking-[0.2em] mt-1" style={{ color: CONECTY_BLUE }}>Solicitud de Mapeo de Procesos</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-2 pb-10 opacity-30 no-print">
          <p className="font-lato text-white text-[13px] uppercase tracking-widest">Desplazar</p>
          <div className="w-px h-10 bg-gradient-to-b from-white/60 to-transparent" />
        </div>
      </header>

      {/* ══════════ CONTENIDO */}
      <main className="max-w-4xl mx-auto px-5 sm:px-8 md:px-10 py-20 space-y-24">

        {/* ─ 01 RESUMEN ─ */}
        <section id="resumen" ref={s1.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s1.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>01 — Resumen ejecutivo</TagLabel>
          <SectionTitle>Mapear antes de construir</SectionTitle>
          <Rule />
          <div className="space-y-4 text-white/65 text-[19px] leading-relaxed mb-8">
            <p>
              Conecty está en su etapa de transformación digital más ambiciosa: en los próximos doce meses pone en marcha un canal unificado de atención, un CRM y un nuevo núcleo administrativo. Cada uno de esos sistemas va a ejecutar, de forma automática, la manera en que Conecty trabaja hoy. Si esa forma de trabajar tiene reprocesos, esperas o responsables poco claros, el sistema nuevo los hereda y los repite más rápido.
            </p>
            <p>
              Por eso el mapeo va primero. Esta propuesta documenta los <strong className="text-white/90 font-semibold">45 procesos</strong> del canal unificado y del núcleo administrativo antes de que se configuren, para que Conecty decida qué automatizar, qué simplificar y qué eliminar con información en la mano, no sobre la marcha.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { icon: ShieldCheck, titulo: 'Transformación con menos riesgo', desc: 'Cada equipo de implementación recibe el proceso ya acordado, con dueño, reglas y excepciones. Menos retrabajo al configurar y menos sorpresas al salir a producción.' },
              { icon: TrendingUp, titulo: 'Una línea base para medir', desc: 'Tiempos, esperas y retrabajo quedan registrados antes del cambio. Es la referencia para demostrar con números cuánto mejoró cada proceso.' },
              { icon: RefreshCw, titulo: 'Mejora continua como hábito', desc: 'Los procesos quedan en un formato estándar y editable. Conecty puede actualizarlos, auditarlos y seguir optimizándolos sin depender de un proveedor.' },
            ].map((p, i) => {
              const Icon = p.icon;
              return (
                <div key={i} className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
                  <Icon className="w-5 h-5 text-[#00bfa5] mb-3" />
                  <p className="font-poppins font-bold text-white/85 text-[17px] mb-2 leading-snug">{p.titulo}</p>
                  <p className="font-lato text-white/55 text-[15px] leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-3 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#00bfa5]" /> Lo que ya ganamos al revisar su inventario
            </p>
            <p className="font-lato text-white/60 text-[17px] leading-relaxed">
              Varios de los procesos del inventario son en realidad partes de un proceso más grande. Agruparlos evita documentar dos veces lo mismo y reduce el costo. Además, la consultoría de CRM que Sixteam entregó en mayo se reutiliza donde aplica, y eso también se refleja en el precio. El detalle está en la sección 4.
            </p>
          </div>
        </section>

        {/* ─ 02 PLAN DE TRABAJO ─ */}
        <section id="plan" ref={s2.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s2.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>02 — Plan de trabajo</TagLabel>
          <SectionTitle>Qué vamos a hacer, y cuándo</SectionTitle>
          <Rule />
          <p className="font-lato text-white/55 text-[18px] leading-relaxed mb-6">
            El levantamiento es uno solo para los dos frentes: primero entendemos la operación con los líderes, luego escuchamos a cada rol y después validamos. Con eso, los entregables salen por frente, en el orden en que Conecty los necesita.
          </p>

          {/* Frentes */}
          <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-4 flex items-center gap-2"><Layers className="w-4 h-4 text-[#00bfa5]" /> Alcance por frente</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {FRENTES.map((f, i) => (
              <div key={i} className="rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(255,255,255,.03)', border: `1px solid ${f.color}44` }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-poppins font-black text-white text-[20px]">Frente {f.id} · {f.nombre}</span>
                  <span className="font-poppins font-black text-[22px]" style={{ color: f.color }}>{f.total}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {f.areas.map((a, j) => (
                    <span key={j} className="font-lato text-[13px] px-2.5 py-1 rounded-full text-white/70"
                      style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.09)' }}>
                      {a.area} · {a.n}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-[14px] text-white/45 mb-2">
                  <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: f.color }} />
                  {f.calendario}
                </div>
                {f.notaEspecial && (
                  <p className="font-lato text-white/40 text-[13px] mt-3 pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,.06)' }}>{f.notaEspecial}</p>
                )}
              </div>
            ))}
          </div>

          <div className="rounded-xl p-4 sm:p-5 mb-4 flex gap-3" style={{ background: 'rgba(167,139,250,.06)', border: '1px solid rgba(167,139,250,.2)' }}>
            <Network className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#a78bfa]" />
            <div>
              <p className="font-poppins font-semibold text-white/80 text-[17px] mb-1">Frente C · {FRENTE_C.nombre}</p>
              <p className="font-lato text-white/35 text-[13px] mb-2">En la solicitud de Conecty: «{FRENTE_C.original}»</p>
              <p className="font-lato text-white/50 text-[15px] leading-relaxed">{FRENTE_C.desc}</p>
            </div>
          </div>

          <div className="rounded-xl p-4 sm:p-5 mb-10 flex gap-3" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)' }}>
            <GitBranch className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#00bfa5]" />
            <div>
              <p className="font-poppins font-semibold text-white/80 text-[17px] mb-1">Integraciones: hasta dónde llegamos</p>
              <p className="font-lato text-white/50 text-[15px] leading-relaxed">
                Especificamos cada interfaz: quién es dueño del dato, qué información viaja, con qué llave se concilian los dos sistemas y qué pasa si falla. Con eso, el equipo de tecnología de Conecty construye sin ambigüedades. Si Conecty quiere que además acompañemos la construcción o verifiquemos que quedó conforme a la especificación, lo ofrecemos como bolsa de horas adicional.
              </p>
            </div>
          </div>

          {/* Cronograma */}
          <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-[#00bfa5]" /> Etapas · {META.duracion}</p>
          <div className="rounded-2xl p-4 sm:p-6 mb-4" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <div className="hidden sm:grid grid-cols-[minmax(0,15rem)_1fr] gap-4 mb-3">
              <span />
              <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${SEMANAS}, minmax(0, 1fr))` }}>
                {Array.from({ length: SEMANAS }, (_, i) => (
                  <span key={i} className="font-lato text-white/30 text-[12px] text-center">S{i + 1}</span>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {ETAPAS.map((e, i) => (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-[minmax(0,15rem)_1fr] gap-1.5 sm:gap-4 items-center">
                  <div className="flex items-baseline gap-2 min-w-0">
                    <span className="font-poppins font-black text-[13px] flex-shrink-0" style={{ color: e.color }}>{e.num}</span>
                    <span className="font-poppins font-semibold text-white/80 text-[14px] leading-snug">{e.nombre}</span>
                    <span className="sm:hidden font-lato text-white/35 text-[12px] ml-auto flex-shrink-0">
                      {e.inicio === e.fin ? `Semana ${e.inicio}` : `Semanas ${e.inicio}–${e.fin}`}
                    </span>
                  </div>
                  <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${SEMANAS}, minmax(0, 1fr))` }}>
                    {Array.from({ length: SEMANAS }, (_, w) => {
                      const on = w + 1 >= e.inicio && w + 1 <= e.fin;
                      return <div key={w} className="h-2.5 rounded-full" style={{ background: on ? e.color : 'rgba(255,255,255,.05)', opacity: on ? 0.85 : 1 }} />;
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            {ETAPAS.map((e, i) => (
              <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.06)' }}>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <p className="font-poppins font-bold text-white/85 text-[15px]"><span style={{ color: e.color }}>{e.num} · </span>{e.nombre}</p>
                  <span className="font-lato text-[11px] px-2 py-0.5 rounded-full text-white/50 flex-shrink-0 whitespace-nowrap" style={{ border: '1px solid rgba(255,255,255,.1)' }}>Frente {e.frentes}</span>
                </div>
                <p className="font-lato text-white/50 text-[14px] leading-relaxed">{e.desc}</p>
              </div>
            ))}
          </div>
          <p className="font-lato text-white/35 text-[13px] leading-relaxed mb-10">
            Las semanas son una estimación y se ajustan con Conecty al arrancar, según la disponibilidad de su equipo.
          </p>

          {/* Disponibilidad */}
          <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-[#00bfa5]" /> Lo que necesitamos del equipo de Conecty</p>
          <div className="rounded-2xl overflow-hidden mb-3" style={{ border: '1px solid rgba(255,255,255,.08)' }}>
            <div className="hidden sm:grid grid-cols-[1.3fr_1fr_1fr] gap-4 px-5 py-3" style={{ background: 'rgba(255,255,255,.04)' }}>
              <span className="font-poppins font-semibold text-white/50 text-[12px] uppercase tracking-wider">Rol</span>
              <span className="font-poppins font-semibold text-[12px] uppercase tracking-wider" style={{ color: CONECTY_BLUE }}>Frente A</span>
              <span className="font-poppins font-semibold text-[12px] uppercase tracking-wider text-[#00bfa5]">Frente B</span>
            </div>
            {DISPONIBILIDAD.map((d, i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-[1.3fr_1fr_1fr] gap-1 sm:gap-4 px-5 py-3.5 border-t" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
                <div>
                  <p className="font-poppins font-semibold text-white/85 text-[15px]">{d.rol}</p>
                  <p className="font-lato text-white/40 text-[13px]">{d.actividad}</p>
                </div>
                <p className="font-lato text-white/65 text-[14px]"><span className="sm:hidden font-semibold" style={{ color: CONECTY_BLUE }}>Frente A: </span>{d.a}</p>
                <p className="font-lato text-white/65 text-[14px]"><span className="sm:hidden font-semibold text-[#00bfa5]">Frente B: </span>{d.b}</p>
              </div>
            ))}
          </div>
          <p className="font-lato text-white/35 text-[13px] leading-relaxed mb-10">
            La mayor parte del levantamiento ocurre por encuesta, al ritmo de cada persona y sin agendar reuniones. El número final de entrevistas se define al cerrar las encuestas.
          </p>

          {/* Equipo */}
          <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-4 flex items-center gap-2"><UserCheck className="w-4 h-4 text-[#00bfa5]" /> Quién lo ejecuta</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
            {EQUIPO.map((p, i) => (
              <div key={i} className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(0,191,165,.2)' }}>
                <p className="font-poppins font-bold text-white text-[17px]">{p.nombre}</p>
                <p className="font-lato text-[#00bfa5] text-[13px] mb-2">{p.cargo}</p>
                <p className="font-lato text-white/50 text-[14px] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
          <p className="font-lato text-white/45 text-[15px] leading-relaxed mb-10">
            El trabajo lo ejecutan los profesionales de Sixteam Innovación y Estrategia Digital S.A.S., bajo el liderazgo de Samuel y Ernesto. Si el ritmo del proyecto lo pide, se suma personal de apoyo al equipo.
          </p>

          <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)' }}>
            <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-3 flex items-center gap-2"><Ban className="w-4 h-4" /> Fuera de este alcance</p>
            <ul className="space-y-2">
              {FUERA_DE_ALCANCE.map((t, i) => (
                <li key={i} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2 bg-white/30" />
                  <span className="font-lato text-white/55 text-[15px] leading-snug">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ─ 03 MÉTODO ─ */}
        <section id="metodo" ref={s3.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s3.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>03 — Método</TagLabel>
          <SectionTitle>Cómo trabajamos</SectionTitle>
          <Rule />
          <p className="font-lato text-white/55 text-[18px] leading-relaxed mb-6">
            Cada proceso se analiza desde tres ángulos, con marcos reconocidos de mejora de procesos.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
            {CAPAS.map((c, i) => {
              const Icon = c.icon;
              return (
                <div key={i} className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,.03)', border: `1px solid ${c.color}33` }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: `${c.color}1f` }}>
                    <Icon className="w-4 h-4" style={{ color: c.color }} />
                  </div>
                  <p className="font-poppins font-bold text-white text-[17px] mb-0.5">{c.nombre}</p>
                  <p className="font-lato text-[12px] uppercase tracking-widest mb-2" style={{ color: c.color }}>{c.letra}</p>
                  <p className="font-lato text-white/55 text-[14px] leading-relaxed">{c.desc}</p>
                </div>
              );
            })}
          </div>

          <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#a78bfa]" /> Método híbrido asistido por IA</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MODALIDAD.map((m, i) => {
              const Icon = m.rol;
              return (
                <div key={i} className="rounded-xl p-4" style={{ background: `${m.color}0d`, border: `1px solid ${m.color}33` }}>
                  <p className="font-poppins font-bold text-[15px] mb-2 flex items-center gap-2" style={{ color: m.color }}><Icon className="w-4 h-4" /> {m.nombre}</p>
                  <ul className="space-y-1.5">
                    {m.items.map((it, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2" style={{ background: m.color }} />
                        <span className="font-lato text-white/60 text-[14px] leading-snug">{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <p className="font-lato text-white/40 text-[14px] leading-relaxed mt-4">
            La IA acelera el levantamiento; las decisiones y la validación siempre las toma un consultor.
          </p>
        </section>

        {/* ─ 04 TARIFARIO ─ */}
        <section id="tarifario" ref={s4.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s4.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>04 — Tarifario por complejidad</TagLabel>
          <SectionTitle>Un precio según la complejidad</SectionTitle>
          <Rule />
          <p className="font-lato text-white/55 text-[18px] leading-relaxed mb-6">
            Cada proceso se clasifica en uno de tres niveles, según lo que muestra la revisión de su inventario. Lo que es parte de un proceso mayor se cobra como Básico. Esta misma tabla sirve para ajustar el alcance si el número de procesos cambia.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {NIVELES.map((n, i) => (
              <div key={i} className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,.03)', border: `1px solid ${n.color}44` }}>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="font-poppins font-black text-white text-[19px]">{n.nombre}</span>
                </div>
                <p className="font-poppins font-black text-[24px] leading-none mb-3" style={{ color: n.color }}>{fmtCOP(n.precio)}</p>
                <p className="font-lato text-white/55 text-[14px] leading-relaxed mb-3">{n.desc}</p>
                <p className="font-lato text-white/30 text-[12px] leading-relaxed border-t pt-3" style={{ borderColor: 'rgba(255,255,255,.06)' }}>{n.ejemplos}</p>
              </div>
            ))}
          </div>
          <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mt-10 mb-4">Procesos que agrupan a otros</p>
          <div className="space-y-2">
            {CLUSTERS.map((c, i) => {
              const open = clusterActivo === i;
              return (
                <div key={i} className="rounded-xl overflow-hidden transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,.03)', border: open ? '1px solid rgba(0,191,165,.4)' : '1px solid rgba(255,255,255,.07)' }}>
                  <button onClick={() => setClusterActivo(open ? null : i)} className="w-full flex items-center gap-3 p-4 text-left">
                    <Workflow className="w-4 h-4 flex-shrink-0" style={{ color: open ? '#00bfa5' : 'rgba(255,255,255,.35)' }} />
                    <div className="flex-1 min-w-0">
                      <span className={`font-poppins font-bold text-[15px] ${open ? 'text-white' : 'text-white/70'}`}>{c.raiz}</span>
                      <span className="font-lato text-white/30 text-[13px] ml-2">{c.frente} · {c.subprocesos.length} subprocesos</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform duration-300 flex-shrink-0 ${open ? 'rotate-90' : ''}`} style={{ color: open ? '#00bfa5' : 'rgba(255,255,255,.3)' }} />
                  </button>
                  {open && (
                    <div className="px-4 pb-4 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                      <p className="font-lato text-white/50 text-[14px] leading-relaxed pt-3 mb-3">{c.razon}</p>
                      <div className="flex flex-wrap gap-2">
                        {c.subprocesos.map((s, j) => (
                          <span key={j} className="font-lato text-[13px] px-2.5 py-1 rounded-full text-white/60" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)' }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <p className="font-lato text-white/35 text-[13px] mt-3 leading-relaxed">
            Agrupación preliminar; se confirma durante el levantamiento.
          </p>
        </section>

        {/* ─ 05 INVERSIÓN ─ */}
        <section id="inversion" ref={s5.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s5.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>05 — Propuesta de inversión</TagLabel>
          <SectionTitle>Inversión</SectionTitle>
          <Rule />

          <div className="rounded-2xl p-7 sm:p-9 relative overflow-hidden mb-8"
            style={{ background: 'linear-gradient(135deg, rgba(0,191,165,.08) 0%, rgba(29,112,162,.08) 100%)', border: '1px solid rgba(0,191,165,.3)' }}>
            <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(0,191,165,.06), transparent 70%)', transform: 'translate(20%,-20%)' }} />
            <div className="relative z-10">
              <p className="font-lato text-white/40 text-[15px] uppercase tracking-widest mb-2">Inversión total · Mapeo de los 45 procesos</p>
              <p className="font-poppins font-black text-white leading-none mb-3" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>{TOTAL_DISPLAY}</p>
              <p className="font-lato text-white/40 text-[15px] mb-6">+ IVA</p>
              <div className="flex flex-wrap gap-2">
                {['✓ Los 45 procesos en Baseline y Target', '✓ BPMN, Word y filas de Excel por proceso', '✓ Modelo de datos e interfaces por frente', '✓ Método híbrido asistido por IA'].map((item, i) => (
                  <span key={i} className="font-lato text-[14px] px-3 py-1.5 rounded-full text-white/70" style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.09)' }}>{item}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden mb-3" style={{ border: '1px solid rgba(255,255,255,.08)' }}>
            {DESGLOSE.map((d, i) => (
              <div key={i} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 px-5 py-4 ${i > 0 ? 'border-t' : ''}`} style={{ borderColor: 'rgba(255,255,255,.06)', background: 'rgba(255,255,255,.02)' }}>
                <div>
                  <p className="font-poppins font-semibold text-white/85 text-[16px]">{d.concepto}</p>
                  <p className="font-lato text-white/40 text-[13px]">{d.detalle}</p>
                </div>
                <p className="font-poppins font-bold text-white/80 text-[17px] whitespace-nowrap">{fmtCOP(d.monto)}</p>
              </div>
            ))}
          </div>
          <p className="font-lato text-white/35 text-[13px] leading-relaxed mb-8">
            Cada frente puede contratarse por separado: su valor es el de sus procesos más la parte proporcional del apoyo transversal.
          </p>

          <div className="rounded-xl p-4 sm:p-5 mb-4 flex gap-3" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)' }}>
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#00bfa5]" />
            <div>
              <p className="font-poppins font-semibold text-white/80 text-[17px] mb-1">En qué se apoya esta inversión</p>
              <p className="font-lato text-white/50 text-[15px] leading-relaxed">
                Se calcula sobre 45 procesos y toma como nivel de referencia el ejemplo del Anexo 2. Supone que los tiempos se levantan por proceso completo y en rangos, que las columnas que asigna Conecty quedan a su cargo, y que el estado Target parte de las decisiones de arquitectura ya tomadas. Solo la cambiarían dos cosas: un estándar STD-PRO-001 que exija más detalle que el Anexo 2, en cuyo caso se revisa antes de empezar y no durante, o un cambio en el número de procesos, que se resuelve con la regla de ajuste.
              </p>
            </div>
          </div>

          <div className="rounded-xl p-4 sm:p-5 mb-8 flex gap-3" style={{ background: 'rgba(52,211,153,.06)', border: '1px solid rgba(52,211,153,.2)' }}>
            <ListChecks className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#34d399]" />
            <div>
              <p className="font-poppins font-semibold text-white/80 text-[17px] mb-1">Regla de ajuste</p>
              <p className="font-lato text-white/50 text-[15px] leading-relaxed">
                Si el número de procesos sube o baja durante el levantamiento, el precio se ajusta con el tarifario de la sección 4, sin renegociar. Un proceso nuevo se suma según su nivel, y uno que sale del alcance se descuenta según el suyo. Si dos resultan ser el mismo, se cobra uno. Sixteam propone el nivel de cada proceso nuevo con los criterios del tarifario, y Conecty lo aprueba antes de mapearlo.
              </p>
              <p className="font-lato text-white/50 text-[15px] leading-relaxed mt-2">
                Lo mismo aplica a las excepciones que resulten ser un proceso propio, como la activación manual cuando falla la automática. Se identifican y se registran sin costo dentro del proceso donde aparecen. Mapearlas completas se cobra como proceso nuevo, y solo si Conecty lo decide.
              </p>
            </div>
          </div>
        </section>

        {/* ─ 06 ENTREGABLES ─ */}
        <section id="entregables" ref={s6.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s6.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>06 — Entregables</TagLabel>
          <SectionTitle>Por proceso, y por frente</SectionTitle>
          <Rule />
          <p className="font-lato text-white/55 text-[18px] leading-relaxed mb-6">
            Todo se entrega bajo el estándar de mapeo de Conecty, en el formato del Anexo 2 y con los tres entregables que pide su solicitud, para cada proceso en Baseline y en Target.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)' }}>
              <p className="font-poppins font-semibold text-white/70 text-[13px] uppercase tracking-wider mb-4 flex items-center gap-2"><FileCode className="w-4 h-4 text-[#00bfa5]" /> Por cada proceso</p>
              <div className="space-y-3">
                {ENTREGABLES_PROCESO.map((e, i) => (
                  <div key={i}>
                    <p className="font-poppins font-semibold text-white/85 text-[15px]">{e.nombre}</p>
                    <p className="font-lato text-white/45 text-[14px] leading-relaxed">{e.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)' }}>
              <p className="font-poppins font-semibold text-white/70 text-[13px] uppercase tracking-wider mb-4 flex items-center gap-2"><Table2 className="w-4 h-4 text-[#00bfa5]" /> Por cada frente, una vez</p>
              <div className="space-y-3">
                {ENTREGABLES_FRENTE.map((e, i) => (
                  <div key={i}>
                    <p className="font-poppins font-semibold text-white/85 text-[15px]">{e.nombre}</p>
                    <p className="font-lato text-white/45 text-[14px] leading-relaxed">{e.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl p-4 flex gap-3" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <HelpCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#00bfa5]" />
            <p className="font-lato text-white/50 text-[15px] leading-relaxed">
              El diagrama y el Excel siempre coinciden paso a paso. Cada paso queda clasificado como agrega valor, necesario o desperdicio: esa clasificación es la que convierte el mapeo en un caso de inversión. Si un tiempo no se puede estimar, se reporta como hallazgo, no como celda vacía.
            </p>
          </div>

          <div className="rounded-xl p-4 mt-3 flex gap-3" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#00bfa5]" />
            <p className="font-lato text-white/50 text-[15px] leading-relaxed">
              Una observación sobre el formato, para resolver antes del arranque: los procesos de Inventarios usan los códigos I-01 a I-15, y la hoja Interfaces usa el mismo prefijo (I-01, I-02…). Sugerimos diferenciar uno de los dos para que los cruces entre hojas no se confundan.
            </p>
          </div>
        </section>

        {/* ── LOGOS DE CLIENTES ── */}
        <div className="mt-16">
          <LogoCarousel />
        </div>

        {/* ─ 07 VIGENCIA ─ */}
        <section id="vigencia" ref={s7.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s7.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>07 — Vigencia y términos</TagLabel>
          <SectionTitle>Vigencia y Términos de la Propuesta</SectionTitle>
          <Rule />

          <div className="space-y-3">
            {[
              { titulo: 'Aprobación', desc: 'Basta una confirmación por WhatsApp, correo o verbal para preparar el contrato y agendar el arranque.', icon: CheckCircle },
              { titulo: 'Términos de pago', desc: 'Dos pagos: 50% al iniciar y 50% al finalizar, una vez entregados y aprobados los entregables. Por transferencia o la plataforma acordada.', icon: FileText },
              { titulo: 'Contratación por frente', desc: 'Si Conecty prefiere contratar un solo frente, lo cotizamos aparte.', icon: Briefcase },
              { titulo: 'Estándar de mapeo', desc: 'Trabajamos bajo el estándar de Conecty, con el ejemplo del Anexo 2 como nivel de referencia. Si el documento STD-PRO-001 pide más detalle que ese ejemplo, el precio se revisa antes de empezar, no durante.', icon: FileCode },
              { titulo: 'Diseño del estado Target', desc: 'El Target se diseña sobre las decisiones de arquitectura que Conecty ya tenga tomadas. Si una sigue abierta, como la del maestro de producto, se declara pendiente y se explica su impacto, para que Conecty decida con el dato en la mano.', icon: Target },
              { titulo: 'Disponibilidad de Conecty', desc: 'El cronograma depende de la disponibilidad de los líderes de área. Si se reduce, las fechas se corren sin costo adicional.', icon: Users },
              { titulo: 'Modificaciones al alcance', desc: 'Lo que no esté en esta propuesta se cotiza aparte, con la misma tabla de precios.', icon: Zap },
              { titulo: 'Vigencia de la propuesta', desc: '30 días calendario desde su emisión.', icon: Clock },
            ].map((item, i) => {
              const Icon = item.icon;
              const open = terminoActivo === i;
              return (
                <div key={i} className="rounded-xl overflow-hidden transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,.03)', border: open ? '1px solid rgba(0,191,165,.4)' : '1px solid rgba(255,255,255,.07)' }}>
                  <button onClick={() => setTerminoActivo(open ? null : i)} className="w-full flex items-center gap-4 p-4 sm:p-5 text-left">
                    <Icon className="w-4 h-4 text-[#00bfa5] flex-shrink-0" />
                    <span className={`font-poppins font-semibold text-[18px] flex-1 ${open ? 'text-white' : 'text-white/80'}`}>{item.titulo}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform duration-300 flex-shrink-0 ${open ? 'rotate-90' : ''}`} style={{ color: open ? '#00bfa5' : 'rgba(255,255,255,.3)' }} />
                  </button>
                  {open && (
                    <div className="px-4 sm:px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                      <p className="font-lato text-white/55 text-[17px] leading-relaxed pt-4 pl-8">{item.desc}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-12 rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.07)' }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(circle at 50% 100%, rgba(0,191,165,.05), transparent 70%)' }} />
            <div className="relative z-10">
              <img src="/sixteam-logo.png" alt="Sixteam.pro" className="h-10 w-auto object-contain mx-auto mb-3"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <p className="font-poppins font-black text-white text-[20px] tracking-tight mb-1">Sixteam<span className="text-[#00bfa5]">.</span>pro</p>
              <p className="font-lato text-white/35 text-[14px] mb-4">Innovación y Estrategia Digital S.A.S.</p>
              <div className="flex flex-wrap justify-center gap-4 text-[14px] text-white/35 font-lato">
                <span>NIT {META.nit}</span>
                <span>·</span>
                <span>{META.correo}</span>
                <span>·</span>
                <span>RL: {META.rl}</span>
              </div>
              <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
                <p className="font-lato text-white/20 text-[13px]">
                  Process + Technology + People = Growth · Propuesta elaborada en {META.fecha} · Uso confidencial
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default ConnectyMapeoProcesosProposal;
