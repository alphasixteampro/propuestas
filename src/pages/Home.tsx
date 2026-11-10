import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ExternalLink, Calendar, Building2, Tag, Plane, Lock, GraduationCap, RefreshCw, ChevronLeft, ChevronRight, List, LayoutList } from 'lucide-react';

const PASSWORD = 'sixteam2026';
const SESSION_KEY = 'st_proposals_auth';

interface Proposal {
  slug: string;
  cliente: string;
  sector: string;
  fecha: string;
  creada: string;      // YYYY-MM-DD, define el orden (más reciente primero)
  actualizada: string; // YYYY-MM-DD, último cambio de la propuesta
  monto: string;
  estado: 'activa' | 'enviada' | 'cerrada' | 'borrador';
  path: string;
}

const PROPOSALS: Proposal[] = [
  {
    slug: 'stunet',
    cliente: 'Stunet Education Agency',
    sector: 'Agencia de educación internacional',
    fecha: 'Marzo 2026',
    creada: '2026-03-24',
    actualizada: '2026-04-06',
    monto: 'COP 11.200.000',
    estado: 'activa',
    path: '/stunet',
  },
  {
    slug: 'conecty',
    cliente: 'Conecty',
    sector: 'Telecomunicaciones · SIM & eSIM para viajeros',
    fecha: 'Abril 2026',
    creada: '2026-04-06',
    actualizada: '2026-04-08',
    monto: 'COP 17.988.000',
    estado: 'borrador',
    path: '/conecty',
  },
  {
    slug: 'conecty-v2',
    cliente: 'Conecty V2',
    sector: 'Telecomunicaciones · SIM & eSIM para viajeros',
    fecha: 'Mayo 2026',
    creada: '2026-05-13',
    actualizada: '2026-05-13',
    monto: 'COP 15.488.000',
    estado: 'activa',
    path: '/conecty-v2',
  },
  {
    slug: 'depaseo',
    cliente: 'De Paseo por Colombia SAS',
    sector: 'Turismo receptivo · Agencia de viajes · Alojamiento',
    fecha: 'Abril 2026',
    creada: '2026-04-15',
    actualizada: '2026-04-15',
    monto: 'COP 1.821.465 + COP 728.586/mes',
    estado: 'borrador',
    path: '/depaseo',
  },
  {
    slug: 'hotel-casa-rueda',
    cliente: 'Hotel Casa Rueda',
    sector: 'Hotelería · Alojamiento',
    fecha: 'Abril 2026',
    creada: '2026-04-15',
    actualizada: '2026-04-16',
    monto: 'COP 1.700.000 / semestre',
    estado: 'borrador',
    path: '/hotel-casa-rueda',
  },
  {
    slug: 'mizar',
    cliente: 'Mizar Diseño y Construcciones',
    sector: 'Inmobiliaria · Lotes urbanos y rurales',
    fecha: 'Abril 2026',
    creada: '2026-04-17',
    actualizada: '2026-04-17',
    monto: 'COP 800.000 + 10% / mes',
    estado: 'borrador',
    path: '/mizar',
  },
  {
    slug: 'anato',
    cliente: 'ANATO Seccional Central',
    sector: 'Turismo · Asociación gremial de agencias de viaje',
    fecha: 'Abril 2026',
    creada: '2026-04-29',
    actualizada: '2026-05-08',
    monto: 'Alianza · 25% dcto. afiliados',
    estado: 'borrador',
    path: '/anato',
  },
  {
    slug: 'visitantioquia',
    cliente: 'Visit Antioquia',
    sector: 'Turismo receptivo · Agencia de viajes · B2C',
    fecha: 'Abril 2026',
    creada: '2026-04-21',
    actualizada: '2026-04-21',
    monto: 'COP 7.734.000 + COP 728.586/mes',
    estado: 'borrador',
    path: '/visitantioquia',
  },
  {
    slug: 'grupo-mimi',
    cliente: 'Grupo Mimi',
    sector: 'Restaurantes · Gastronomía · Barranquilla',
    fecha: 'Abril 2026',
    creada: '2026-04-29',
    actualizada: '2026-04-29',
    monto: 'COP 1.000.000 + COP 500.000/mes',
    estado: 'borrador',
    path: '/grupo-mimi',
  },
  {
    slug: 'procurement-pro',
    cliente: 'Procurement Pro',
    sector: 'Consultoría · Formación corporativa · B2B',
    fecha: 'Mayo 2026',
    creada: '2026-05-05',
    actualizada: '2026-05-06',
    monto: 'COP 2.000.000 + COP 1.800.000/mes',
    estado: 'borrador',
    path: '/procurement-pro',
  },
  {
    slug: 'viajes-capital',
    cliente: 'Viajes Capital',
    sector: 'Agencia de Viajes · Hotelería · Turismo · Cali',
    fecha: 'Mayo 2026',
    creada: '2026-05-05',
    actualizada: '2026-05-12',
    monto: 'COP 2.800.000 + COP 2.890.000/mes',
    estado: 'borrador',
    path: '/viajes-capital',
  },
  {
    slug: 'travel-sol-playa',
    cliente: 'Travel Sol y Playa SAS',
    sector: 'Agencia de Viajes · Turismo · Barranquilla',
    fecha: 'Mayo 2026',
    creada: '2026-05-08',
    actualizada: '2026-05-08',
    monto: 'COP 2.500.000 + COP 850.000/mes',
    estado: 'borrador',
    path: '/travel-sol-playa',
  },
  {
    slug: 'mpm',
    cliente: 'Stunet Education Agency — Mi Primer Millón',
    sector: 'EdTech · Educación Financiera · Niños y Adolescentes',
    fecha: 'Mayo 2026',
    creada: '2026-05-08',
    actualizada: '2026-05-27',
    monto: 'COP 5.800.000 – COP 9.000.000',
    estado: 'borrador',
    path: '/mpm',
  },
  {
    slug: 'travel-sol-playa-v2',
    cliente: 'Travel Sol y Playa SAS — V2',
    sector: 'Agencia de Viajes · Turismo · Barranquilla',
    fecha: 'Mayo 2026',
    creada: '2026-05-11',
    actualizada: '2026-05-11',
    monto: 'COP 2.500.000 + COP 850.000/mes',
    estado: 'borrador',
    path: '/travel-sol-playa-v2',
  },
  {
    slug: 'tuvivi',
    cliente: 'TuVivi',
    sector: 'Asesorías Financieras · Créditos · HubSpot',
    fecha: 'Mayo 2026',
    creada: '2026-05-15',
    actualizada: '2026-05-15',
    monto: 'COP 600.000 – 2.000.000 + IVA',
    estado: 'borrador',
    path: '/tuvivi',
  },
  {
    slug: 'vuela-a-la-vida',
    cliente: 'Vuela a la Vida',
    sector: 'Agencia de Viajes · CRM + IA · WhatsApp-first',
    fecha: 'Mayo 2026',
    creada: '2026-05-15',
    actualizada: '2026-05-15',
    monto: 'COP 2.800.000 + COP 1.296.000/mes',
    estado: 'borrador',
    path: '/vuela-a-la-vida',
  },
  {
    slug: 'metropolitan-touring',
    cliente: 'Metropolitan Touring Colombia',
    sector: 'Agencia de Viajes · Turismo de Lujo · HubSpot CRM',
    fecha: 'Mayo 2026',
    creada: '2026-05-25',
    actualizada: '2026-05-25',
    monto: 'COP 3.500.000 + USD $2.000',
    estado: 'borrador',
    path: '/metropolitan-touring',
  },
  {
    slug: 'nutsport',
    cliente: 'Nutsport',
    sector: 'Nutrición Deportiva · Salud · Chile',
    fecha: 'Mayo 2026',
    creada: '2026-05-28',
    actualizada: '2026-05-29',
    monto: 'USD 1.100 impl. + USD 240/mes',
    estado: 'borrador',
    path: '/nutsport',
  },
  {
    slug: 'vertical-services',
    cliente: 'Vertical Services',
    sector: 'Tecnología · Drones · Propiedad Horizontal · Bogotá',
    fecha: 'Mayo 2026',
    creada: '2026-05-30',
    actualizada: '2026-05-30',
    monto: 'COP 400.000 único + COP 1.050.000/mes',
    estado: 'borrador',
    path: '/vertical-services',
  },
  {
    slug: 'clinica-magnetica',
    cliente: 'Clínica Magnética',
    sector: 'Medicina Estética · Clínica · Chile',
    fecha: 'Junio 2026',
    creada: '2026-06-04',
    actualizada: '2026-06-04',
    monto: 'USD 1.200 impl. + USD 240/mes',
    estado: 'borrador',
    path: '/clinica-magnetica',
  },
  {
    slug: 'motion-minds',
    cliente: 'Motion Minds',
    sector: 'Academia de Baile · Entretenimiento · Guatemala',
    fecha: 'Junio 2026',
    creada: '2026-06-10',
    actualizada: '2026-06-10',
    monto: 'USD 400 impl. + USD 180/mes + IA',
    estado: 'activa',
    path: '/motion-minds',
  },
  {
    slug: 'venture-sport',
    cliente: 'Venture Sport USA',
    sector: 'Becas Deportivas · Instagram · IA · Chile',
    fecha: 'Junio 2026',
    creada: '2026-06-18',
    actualizada: '2026-06-19',
    monto: 'USD 1.000 impl. + créditos S&O',
    estado: 'borrador',
    path: '/venture-sport',
  },
  {
    slug: 'siar',
    cliente: 'SIAR S.A.S.',
    sector: 'Gestión Documental · Custodia · Digitalización · Colombia',
    fecha: 'Junio 2026',
    creada: '2026-06-19',
    actualizada: '2026-06-22',
    monto: 'COP 12M impl. + COP 3.990.000/mes (Op. 1)',
    estado: 'activa',
    path: '/siar',
  },
  {
    slug: 'siar-v2',
    cliente: 'SIAR S.A.S. · V2 · Ecosistema Zoho',
    sector: 'Gestión Documental · Solución Financiera · Zoho · Colombia',
    fecha: 'Junio 2026',
    creada: '2026-06-30',
    actualizada: '2026-06-30',
    monto: 'COP 6.500.000 impl. único',
    estado: 'activa',
    path: '/siar-v2',
  },
  {
    slug: 'galcomex',
    cliente: 'Galcomex',
    sector: 'Logística · Agencia Aduanera · Importaciones · Barranquilla',
    fecha: 'Junio 2026',
    creada: '2026-06-30',
    actualizada: '2026-06-30',
    monto: 'COP 4.000.000 impl. + COP 450.000/mes',
    estado: 'activa',
    path: '/galcomex',
  },
  {
    slug: 'dv-clinic-lab',
    cliente: 'D.V. Clinic Lab',
    sector: 'Laboratorio Clínico · IPS · Colombia',
    fecha: 'Julio 2026',
    creada: '2026-07-09',
    actualizada: '2026-07-09',
    monto: 'USD 200 impl. + USD 199/mes',
    estado: 'activa',
    path: '/dv-clinic-lab',
  },
  {
    slug: 'calas-nibec',
    cliente: 'Calas · Nibec',
    sector: 'Mobiliario y Equipamiento Industrial · Sixteam Ops · Chile',
    fecha: 'Agosto 2026',
    creada: '2026-08-12',
    actualizada: '2026-10-14',
    monto: 'USD 499/mes · 160 créditos',
    estado: 'activa',
    path: '/calas-nibec',
  },
  {
    slug: 'nibec',
    cliente: 'Nibec',
    sector: 'Equipamiento industrial · Sixteam Ops · Chile',
    fecha: 'Septiembre 2026',
    creada: '2026-09-07',
    actualizada: '2026-10-14',
    monto: 'USD 299/mes · 60 créditos',
    estado: 'activa',
    path: '/nibec',
  },
  {
    slug: 'nibec-despachos',
    cliente: 'Nibec · Tablero de Despachos',
    sector: 'Puente Bsale → Beetrack · Pago único · Chile',
    fecha: 'Octubre 2026',
    creada: '2026-10-09',
    actualizada: '2026-10-09',
    monto: 'USD 1.200 · pago único',
    estado: 'activa',
    path: '/nibec-despachos',
  },
  {
    slug: 'gabrica',
    cliente: 'Gabrica',
    sector: 'Industria Pet · Dynamics 365 + HubSpot · Sixteam Ops · Colombia',
    fecha: 'Agosto 2026',
    creada: '2026-08-12',
    actualizada: '2026-08-12',
    monto: 'COP 1.740.000/mes + IVA · 160 créditos',
    estado: 'activa',
    path: '/gabrica',
  },
  {
    slug: 'mizar-plataforma-comparativo',
    cliente: 'Mizar Diseño y Construcción · Ictinos · Comparativa',
    sector: 'Construcción · Requisiciones y pagos de obra · Básico frente a Completo',
    fecha: 'Agosto 2026',
    creada: '2026-08-19',
    actualizada: '2026-08-19',
    monto: 'COP 3.500.000 o 5.000.000 impl. + 250.000 o 350.000/mes',
    estado: 'activa',
    path: '/mizar-plataforma',
  },
  {
    slug: 'mizar-plataforma-v1',
    cliente: 'Mizar Diseño y Construcción · Ictinos · V1 Básico',
    sector: 'Construcción · Requisiciones y pagos de obra · 6 módulos · 6 semanas',
    fecha: 'Agosto 2026',
    creada: '2026-08-19',
    actualizada: '2026-08-19',
    monto: 'COP 3.500.000 impl. + COP 250.000/mes',
    estado: 'activa',
    path: '/mizar-plataforma-v1',
  },
  {
    slug: 'mizar-plataforma',
    cliente: 'Mizar Diseño y Construcción · Ictinos · V2 Completo',
    sector: 'Construcción · Requisiciones, WhatsApp y OC por proveedor · 9 módulos · 8 semanas',
    fecha: 'Agosto 2026',
    creada: '2026-08-18',
    actualizada: '2026-08-19',
    monto: 'COP 5.000.000 impl. + COP 350.000/mes',
    estado: 'activa',
    path: '/mizar-plataforma-v2',
  },
  {
    slug: 'mizar-plataforma-cartera',
    cliente: 'Mizar Diseño y Construcción · Mi Lote · Cartera',
    sector: 'Construcción · Sistema financiero de ingresos · 2 empresas · 3 etapas · 9 módulos · 18 semanas · con demo',
    fecha: 'Octubre 2026',
    creada: '2026-09-23',
    actualizada: '2026-10-07',
    monto: 'COP 15.000.000 a 18.000.000 por módulos + COP 150.000/mes (por confirmar)',
    estado: 'borrador',
    path: '/mizar-cartera',
  },
  {
    slug: 'mizar-plataforma-cartera-mvp',
    cliente: 'Mizar · Cartera esencial (MVP)',
    sector: 'Construcción · Versión 2 de la propuesta de cartera · 6 módulos · 8 semanas · con demo',
    fecha: 'Octubre 2026',
    creada: '2026-10-08',
    actualizada: '2026-10-08',
    monto: 'COP 9.000.000 + COP 150.000/mes (por confirmar)',
    estado: 'borrador',
    path: '/mizar-cartera-mvp',
  },
  {
    slug: 'magaly-rosero',
    cliente: 'Magaly Rosero',
    sector: 'Formación empresarial · Empleado IA · Propulsor Compensar · Colombia',
    fecha: 'Agosto 2026',
    creada: '2026-08-19',
    actualizada: '2026-08-19',
    monto: 'COP 1.750.905 impl. + COP 650.000/mes',
    estado: 'activa',
    path: '/magaly-rosero',
  },
  {
    slug: 'vr-turbolub',
    cliente: 'VR Turbolub',
    sector: 'Comercio · Aceites y lubricantes · Bucaramanga',
    fecha: 'Agosto 2026',
    creada: '2026-08-24',
    actualizada: '2026-08-24',
    monto: 'COP 2.000.000 impl. + COP 700.000/mes',
    estado: 'activa',
    path: '/vr-turbolub',
  },
  {
    slug: 'demiles-group',
    cliente: 'Demiles Group',
    sector: 'Inmobiliaria · Cartagena, Barranquilla y Vía al Mar',
    fecha: 'Agosto 2026',
    creada: '2026-08-25',
    actualizada: '2026-08-25',
    monto: 'COP 2.000.000 impl. + desde COP 850.000/mes',
    estado: 'activa',
    path: '/demiles-group',
  },
  {
    slug: 'global-realty',
    cliente: 'Global Realty',
    sector: 'Inmobiliaria · Panamá',
    fecha: 'Agosto 2026',
    creada: '2026-08-27',
    actualizada: '2026-08-27',
    monto: 'USD 250 o 350/mes · impl. USD 700 (gratis 3 meses)',
    estado: 'activa',
    path: '/global-realty',
  },
  {
    slug: 'stunet-ops',
    cliente: 'Stunet Education Agency · Sixteam Ops',
    sector: 'Educación internacional · Programas digitales · Empalme post-implementación',
    fecha: 'Agosto 2026',
    creada: '2026-08-31',
    actualizada: '2026-08-31',
    monto: 'COP 960.000/mes · 60 créditos',
    estado: 'activa',
    path: '/stunet-ops',
  },
  {
    slug: 'sensorial-park',
    cliente: 'Sensorial Park',
    sector: 'Parque sensorial infantil · Purranque, Chile',
    fecha: 'Septiembre 2026',
    creada: '2026-09-07',
    actualizada: '2026-09-07',
    monto: 'USD 499 impl. + USD 299/mes (CRM incluido)',
    estado: 'activa',
    path: '/sensorial-park',
  },
  {
    slug: 'conecty-transformacion',
    cliente: 'Conecty · Transformación',
    sector: 'Consultoría en transformación digital · Mapeo de procesos con IA',
    fecha: 'Septiembre 2026',
    creada: '2026-09-18',
    actualizada: '2026-09-18',
    monto: 'COP 14.900.000 · 4 olas',
    estado: 'borrador',
    path: '/conecty-transformacion',
  },
  {
    slug: 'conecty-mapeo-procesos',
    cliente: 'Conecty · Mapeo de Procesos',
    sector: 'Respuesta formal a solicitud de mapeo · 45 procesos, 2 frentes',
    fecha: 'Septiembre 2026',
    creada: '2026-09-18',
    actualizada: '2026-09-21',
    monto: 'COP 19.700.000 · Frente A y B por separado',
    estado: 'activa',
    path: '/conecty-mapeo-procesos',
  },
  {
    slug: 'rosania-held',
    cliente: 'Asesoría Rosanía Held S.A.S.',
    sector: 'Alquiler de equipos para trabajo en altura · Diagnóstico de procesos · Colombia',
    fecha: 'Octubre 2026',
    creada: '2026-10-02',
    actualizada: '2026-10-02',
    monto: 'COP 8.500.000 + IVA · 9 procesos · 18 cargos',
    estado: 'activa',
    path: '/rosania-held',
  },
  {
    slug: 'ln-equipos',
    cliente: 'LN Equipos S.A.S.',
    sector: 'Alquiler y venta de maquinaria pesada · Mapeo de procesos para IA · Colombia',
    fecha: 'Octubre 2026',
    creada: '2026-10-06',
    actualizada: '2026-10-14',
    monto: 'COP 4.800.000 + IVA · Mapeo de procesos · 5 puestos',
    estado: 'activa',
    path: '/ln-equipos',
  },
  {
    slug: 'jc-proyectos',
    cliente: 'JC Proyectos',
    sector: 'Construcción · Materiales, nómina y programa de obra con IA · México · demo',
    fecha: 'Octubre 2026',
    creada: '2026-10-08',
    actualizada: '2026-10-08',
    monto: 'Por definir · demo para la reunión del 9 de octubre',
    estado: 'borrador',
    path: '/jc-proyectos/demo',
  },
  {
    slug: 'jc-proyectos-ia',
    cliente: 'JC Proyectos · Acompañamiento en IA',
    sector: 'Construcción · Aprender a construir con IA la gestión de materiales y personal · México',
    fecha: 'Octubre 2026',
    creada: '2026-10-15',
    actualizada: '2026-10-15',
    monto: 'USD 599 (10 h · 1 mes) · USD 999 (20 h · 6 semanas) · 5 % dto. pago anticipado',
    estado: 'activa',
    path: '/jc-proyectos',
  },
  {
    slug: 'meetrico',
    cliente: 'Constructora Meetrico',
    sector: 'Construcción · Vivienda de interés social · Sistema comercial · Caicedonia, Valle',
    fecha: 'Octubre 2026',
    creada: '2026-10-15',
    actualizada: '2026-10-16',
    monto: 'COP 5.990.000 + IVA · 6 semanas · 5 % dto. anticipado · luego licencia COP 400.000/mes o Plan Integral 1 SMMLV',
    estado: 'activa',
    path: '/meetrico',
  },
  {
    slug: 'vertical-services-pauta',
    cliente: 'Vertical Services · Email y Meta Ads',
    sector: 'Drones · Propiedad Horizontal · Último envío de correo y pauta digital',
    fecha: 'Octubre 2026',
    creada: '2026-10-14',
    actualizada: '2026-10-14',
    monto: 'COP 1.500.000/mes + IVA · 5 % dto. pago único',
    estado: 'activa',
    path: '/vertical-services-pauta',
  },
  {
    slug: 'daniel-alfonso',
    cliente: 'Daniel Alfonso',
    sector: 'Construcción · Financiación de proyectos inmobiliarios · Viabilidad con IA y control de obras',
    fecha: 'Octubre 2026',
    creada: '2026-10-26',
    actualizada: '2026-10-26',
    monto: 'Viabilidad: COP 2.900.000 (asistente) o 9.000.000 (plataforma + agente) · Control de obras por módulos · Plan Integral 1 SMMLV + IVA',
    estado: 'activa',
    path: '/daniel-alfonso',
  },
  {
    slug: 'master-viajes',
    cliente: 'Máster Viajes · Dreams 15 y Origen',
    sector: 'Turismo · Agencia de viajes · Dashboard de pauta y asistente IA',
    fecha: 'Noviembre 2026',
    creada: '2026-11-06',
    actualizada: '2026-11-06',
    monto: 'Plan Integral Sixteam Ops: COP 1.100.000 + IVA · 10 horas en 3 meses · hora adicional COP 120.000 + IVA',
    estado: 'activa',
    path: '/master-viajes',
  },
  {
    slug: 'syl-roofing',
    cliente: 'SYL Roofing',
    sector: 'Roofing · Full stack development y soporte por horas · NetSuite, HubSpot, Make, n8n y WhatsApp',
    fecha: 'Noviembre 2026',
    creada: '2026-11-10',
    actualizada: '2026-11-10',
    monto: 'USD 49/h por uso (al cierre del mes) · paquete desde 10 h a USD 39/h (anticipado, vence a los 3 meses)',
    estado: 'activa',
    path: '/syl-roofing',
  },
];

const ESTADO_STYLE: Record<Proposal['estado'], { label: string; bg: string; color: string }> = {
  activa:  { label: 'Activa',   bg: 'rgba(0,191,165,.12)',  color: '#00bfa5' },
  enviada: { label: 'Enviada',  bg: 'rgba(29,112,162,.15)', color: '#60b4f0' },
  cerrada: { label: 'Cerrada',  bg: 'rgba(255,255,255,.06)', color: '#888' },
  borrador:{ label: 'Borrador', bg: 'rgba(251,191,36,.1)',   color: '#fbbf24' },
};

const PAGE_SIZE = 10;

// Más recientes primero; si se crearon el mismo día, gana la que se agregó después al array
const SORTED = PROPOSALS
  .map((p, i) => ({ p, i }))
  .sort((a, b) => b.p.creada.localeCompare(a.p.creada) || b.i - a.i)
  .map(({ p }) => p);

const ULTIMA_ACTUALIZACION = PROPOSALS.reduce((max, p) => (p.actualizada > max ? p.actualizada : max), '');

function formatFecha(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
}

const PAGER_BTN: React.CSSProperties = {
  minWidth: 36, height: 36, padding: '0 12px', borderRadius: 8,
  border: '1px solid rgba(29,112,162,.3)', background: 'rgba(29,112,162,.07)',
  color: 'rgba(255,255,255,.7)', fontFamily: 'Lato, sans-serif', fontSize: 13,
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4,
  cursor: 'pointer', transition: 'all .2s',
};

export default function Home() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1');
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [showAll, setShowAll] = useState(false);

  const totalPages = Math.ceil(SORTED.length / PAGE_SIZE);
  const visible = showAll ? SORTED : SORTED.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const desde = (page - 1) * PAGE_SIZE + 1;
  const hasta = Math.min(page * PAGE_SIZE, SORTED.length);

  function goTo(n: number) {
    setPage(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (input === PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, '1');
      setAuthed(true);
    } else {
      setError(true);
      setInput('');
    }
  }

  if (!authed) return (
    <div style={{
      minHeight: '100vh', background: '#030d1a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Lato, sans-serif',
    }}>
      <div style={{
        width: '100%', maxWidth: 360,
        background: 'rgba(29,112,162,.07)',
        border: '1px solid rgba(29,112,162,.25)',
        borderRadius: 16, padding: '2.5rem 2rem',
        textAlign: 'center',
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14, margin: '0 auto 1.25rem',
          background: 'linear-gradient(135deg, #1d70a2, #00bfa5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Lock size={22} color="#fff" />
        </div>
        <h1 style={{
          fontFamily: 'Poppins, sans-serif', fontWeight: 800,
          fontSize: '1.25rem', color: '#fff', margin: '0 0 .35rem',
        }}>
          Sixteam<span style={{ color: '#00bfa5' }}>.pro</span>
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', marginBottom: '1.75rem' }}>
          Propuestas comerciales · Acceso restringido
        </p>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="password"
            placeholder="Contraseña"
            value={input}
            autoFocus
            onChange={e => { setInput(e.target.value); setError(false); }}
            style={{
              background: 'rgba(255,255,255,.06)',
              border: `1px solid ${error ? '#f87171' : 'rgba(29,112,162,.35)'}`,
              borderRadius: 8, padding: '10px 14px',
              color: '#fff', fontSize: 14, outline: 'none',
              fontFamily: 'Lato, sans-serif',
            }}
          />
          {error && (
            <p style={{ fontSize: 12, color: '#f87171', margin: 0 }}>Contraseña incorrecta</p>
          )}
          <button type="submit" style={{
            background: 'linear-gradient(135deg, #1d70a2, #00bfa5)',
            border: 'none', borderRadius: 8, padding: '11px',
            color: '#fff', fontFamily: 'Poppins, sans-serif',
            fontWeight: 700, fontSize: 14, cursor: 'pointer',
          }}>
            Entrar
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#030d1a', fontFamily: 'Lato, sans-serif' }}>

      {/* Header */}
      <header style={{
        borderBottom: '1px solid rgba(29,112,162,.2)',
        padding: '0 2rem',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(3,13,26,.9)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #1d70a2, #00bfa5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FileText size={16} color="#fff" />
          </div>
          <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 16, color: '#fff' }}>
            Sixteam<span style={{ color: '#00bfa5' }}>.pro</span>
          </span>
          <span style={{
            fontSize: 11, color: 'rgba(255,255,255,.4)', marginLeft: 4,
            borderLeft: '1px solid rgba(255,255,255,.1)', paddingLeft: 10,
          }}>Propuestas</span>
        </div>

        <a
          href="https://sixteam.pro"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 12, color: 'rgba(255,255,255,.5)',
            textDecoration: 'none', transition: 'color .2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#00bfa5')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,.5)')}
        >
          <ExternalLink size={12} />
          sixteam.pro
        </a>
      </header>

      {/* Main */}
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '3rem 1.5rem' }}>

        {/* Title */}
        <div style={{ marginBottom: '2.5rem' }}>
          <p style={{ fontSize: 11, color: '#00bfa5', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>
            Sistema de propuestas comerciales
          </p>
          <h1 style={{
            fontFamily: 'Poppins, sans-serif', fontWeight: 800,
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', color: '#fff', margin: 0,
          }}>
            Propuestas activas
          </h1>
          <p style={{ color: 'rgba(255,255,255,.5)', marginTop: 8, fontSize: 14 }}>
            {PROPOSALS.length} propuesta{PROPOSALS.length !== 1 ? 's' : ''} · uso interno Sixteam.pro
          </p>
          {ULTIMA_ACTUALIZACION && (
            <p style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,.4)', marginTop: 6, fontSize: 12 }}>
              <RefreshCw size={12} /> Última actualización: {formatFecha(ULTIMA_ACTUALIZACION)}
            </p>
          )}
        </div>

        {/* Toolbar */}
        {SORTED.length > PAGE_SIZE && (
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 16, fontSize: 12, color: 'rgba(255,255,255,.45)',
          }}>
            <span>
              {showAll
                ? `Mostrando las ${SORTED.length} propuestas`
                : `Mostrando ${desde}–${hasta} de ${SORTED.length} · más recientes primero`}
            </span>
            <button
              type="button"
              onClick={() => { setShowAll(v => !v); setPage(1); }}
              style={{ ...PAGER_BTN, color: '#00bfa5', borderColor: 'rgba(0,191,165,.35)' }}
            >
              {showAll ? <><LayoutList size={13} /> Ver de a {PAGE_SIZE}</> : <><List size={13} /> Ver todas</>}
            </button>
          </div>
        )}

        {/* Proposals list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {visible.map((p) => {
            const est = ESTADO_STYLE[p.estado];
            return (
              <Link
                key={p.slug}
                to={p.path}
                style={{
                  display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16,
                  background: 'rgba(29,112,162,.07)',
                  border: '1px solid rgba(29,112,162,.2)',
                  position: 'relative', borderRadius: 12, padding: '18px 44px 18px 20px',
                  textDecoration: 'none', transition: 'all .2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(29,112,162,.12)';
                  e.currentTarget.style.borderColor = 'rgba(0,191,165,.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(29,112,162,.07)';
                  e.currentTarget.style.borderColor = 'rgba(29,112,162,.2)';
                }}
              >
                <div style={{
                  width: 64, height: 64, borderRadius: 12,
                  background: p.slug === 'conecty' || p.slug === 'conecty-transformacion' || p.slug === 'conecty-mapeo-procesos' ? 'transparent' : p.slug === 'grupo-mimi' || p.slug === 'procurement-pro' || p.slug === 'vuela-a-la-vida' || p.slug === 'clinica-magnetica' || p.slug === 'dv-clinic-lab' || p.slug === 'nibec' || p.slug.startsWith('jc-proyectos') || p.slug === 'nibec-despachos' ? '#fff' : p.slug === 'metropolitan-touring' ? 'rgba(245,158,11,.12)' : 'rgba(29,112,162,.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  overflow: 'hidden'
                }}>
                  {p.slug === 'conecty' || p.slug === 'conecty-transformacion' || p.slug === 'conecty-mapeo-procesos' ? (
                    <img src="/logo-webp_180x_2x-removebg-preview.png" alt="Conecty" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : p.slug === 'stunet' ? (
                    <img src="/stunet-logo.png" alt="Stunet" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : p.slug === 'mizar' ? (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(201,164,67,.1)', borderRadius: 12 }}>
                      <Building2 size={24} color="#c9a443" />
                    </div>
                  ) : p.slug.startsWith('mizar-plataforma') ? (
                    <img src="/mizar-logo.png" alt="Mizar" style={{ width: '90%', height: '90%', objectFit: 'contain', padding: '4px' }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
                  ) : p.slug === 'anato' ? (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(232,84,10,.1)', borderRadius: 12 }}>
                      <Plane size={24} color="#e8540a" />
                    </div>
                  ) : p.slug === 'visitantioquia' ? (
                    <img src="/visitantioquia-logo.png" alt="Visit Antioquia" style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
                  ) : p.slug === 'grupo-mimi' ? (
                    <img src="https://assets.cdn.filesafe.space/dMX4yw4WB0RZFivUhgyG/media/69f29bc3e84e52bef4d5cb90.png" alt="Grupo Mimi" style={{ width: '90%', height: '90%', objectFit: 'contain', padding: '4px' }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
                  ) : p.slug === 'procurement-pro' ? (
                    <img src="https://assets.cdn.filesafe.space/dMX4yw4WB0RZFivUhgyG/media/69fa7c8d76fece50438982a9.png" alt="Procurement Pro" style={{ width: '90%', height: '90%', objectFit: 'contain', padding: '4px' }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
                  ) : p.slug === 'vuela-a-la-vida' ? (
                    <img src="/vuela-a-la-vida-logo.webp" alt="Vuela a la Vida" style={{ width: '90%', height: '90%', objectFit: 'contain', padding: '4px' }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
                  ) : p.slug === 'metropolitan-touring' ? (
                    <img src="/logo-mt.svg" alt="Metropolitan Touring" style={{ width: '85%', height: '85%', objectFit: 'contain', padding: '4px' }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
                  ) : p.slug === 'clinica-magnetica' ? (
                    <img src="/logo-clinica-magnetica.jpg" alt="Clínica Magnética" style={{ width: '90%', height: '90%', objectFit: 'contain', borderRadius: 6, padding: '2px' }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
                  ) : p.slug === 'dv-clinic-lab' ? (
                    <img src="/logo-dv-clinic-lab.webp" alt="D.V. Clinic Lab" style={{ width: '90%', height: '90%', objectFit: 'contain', borderRadius: 6, padding: '2px' }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
                  ) : p.slug === 'magaly-rosero' ? (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(155,126,245,.12)', borderRadius: 12 }}>
                      <GraduationCap size={24} color="#9b7ef5" />
                    </div>
                  ) : (p.slug === 'nibec' || p.slug === 'nibec-despachos') ? (
                    <img src="/Logo nibec.png" alt="Nibec" style={{ width: '90%', height: '90%', objectFit: 'contain', padding: '4px' }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
                  ) : p.slug.startsWith('jc-proyectos') ? (
                    <img src="/jc-proyectos-logo.png" alt="JC Proyectos" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
                  ) : p.slug === 'meetrico' ? (
                    <img src="/meetrico-logo.svg" alt="Constructora Meetrico" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px' }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
                  ) : p.slug === 'syl-roofing' ? (
                    <img src="/Logo roofing.png" alt="SYL Roofing" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
                  ) : p.slug === 'global-realty' ? (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(224,151,60,.12)', borderRadius: 12 }}>
                      <Building2 size={24} color="#e0973c" />
                    </div>
                  ) : (
                    <Building2 size={20} color="#1d70a2" />
                  )}
                </div>

                <div style={{ flex: '1 1 180px', minWidth: 0 }}>
                  <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 15, lineHeight: 1.35, color: '#fff', marginBottom: 6 }}>
                    {p.cliente}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 13, lineHeight: 1.5, color: 'rgba(255,255,255,.62)', marginBottom: 6 }}>
                    <Tag size={12} style={{ flexShrink: 0, marginTop: 4 }} /> {p.sector}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 14px', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'rgba(255,255,255,.4)' }}>
                      <Calendar size={11} /> {p.fecha}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'rgba(255,255,255,.4)' }}>
                      <RefreshCw size={11} /> Actualizada {formatFecha(p.actualizada)}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right', flex: '0 1 260px', minWidth: 0, marginLeft: 'auto' }}>
                  <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 14, lineHeight: 1.4, color: '#00bfa5', marginBottom: 8 }}>
                    {p.monto}
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 999,
                    background: est.bg, color: est.color,
                  }}>
                    {est.label}
                  </span>
                </div>

                <ExternalLink size={15} color="rgba(255,255,255,.25)" style={{ position: 'absolute', top: '50%', right: 18, transform: 'translateY(-50%)' }} />
              </Link>
            );
          })}
        </div>

        {/* Pagination */}
        {!showAll && totalPages > 1 && (
          <nav style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', alignItems: 'center', marginTop: 28 }}>
            <button
              type="button"
              onClick={() => goTo(page - 1)}
              disabled={page === 1}
              style={{ ...PAGER_BTN, opacity: page === 1 ? 0.35 : 1, cursor: page === 1 ? 'default' : 'pointer' }}
            >
              <ChevronLeft size={14} /> Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                type="button"
                onClick={() => goTo(n)}
                aria-current={n === page ? 'page' : undefined}
                style={n === page
                  ? { ...PAGER_BTN, background: 'linear-gradient(135deg, #1d70a2, #00bfa5)', border: 'none', color: '#fff', fontWeight: 700 }
                  : PAGER_BTN}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              onClick={() => goTo(page + 1)}
              disabled={page === totalPages}
              style={{ ...PAGER_BTN, opacity: page === totalPages ? 0.35 : 1, cursor: page === totalPages ? 'default' : 'pointer' }}
            >
              Siguiente <ChevronRight size={14} />
            </button>
          </nav>
        )}

        {/* Empty state (hidden when proposals exist) */}
        {PROPOSALS.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '4rem 2rem',
            color: 'rgba(255,255,255,.3)', fontSize: 14,
          }}>
            <FileText size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
            <p>Aún no hay propuestas. Agrega la primera en src/pages/Home.tsx</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center', padding: '2rem',
        fontSize: 12, color: 'rgba(255,255,255,.2)',
        borderTop: '1px solid rgba(29,112,162,.1)',
      }}>
        Sixteam.pro · NIT 901.967.849-4 · alpha@sixteam.pro · Uso interno — no indexado
      </footer>
    </div>
  );
}
