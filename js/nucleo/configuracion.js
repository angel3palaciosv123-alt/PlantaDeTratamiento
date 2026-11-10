/* ==========================================================
   NÚCLEO — configuracion.js
   Configuración global: usuarios, grupos de menú, claves de almacenamiento,
   objeto global PRO, iconos genéricos de interfaz y logo.
   No contiene datos ni reglas de ningún módulo.
   ========================================================== */

var USUARIOS={
  nathalia:{p:"nathalia",rol:"Diseñador",edita:true},
  1:{p:"1",rol:"Diseñador",edita:true},
  angelito:{p:"angelito",rol:"Diseñador",edita:true},
  lauri:{p:"lauri",rol:"Diseñador",edita:true},
  linoto:{p:"linoto",rol:"Diseñador",edita:true},
  revisor:{p:"revisor",rol:"Revisor",edita:false}};
var SES=null;

var CLAVE_ALMACEN="ptarProyecto";
var CLAVE_SESION="ptarSes";

/* Grupos del menú lateral y de la pantalla de inicio. Cada módulo declara su grupo por id. */
var GRUPOS=[
  {id:"proyecto",  menu:"Mi Proyecto",       inicio:"Mi proyecto"},
  {id:"hidraulico",menu:"Diseño Hidráulico", inicio:"Diseño hidráulico"}];

/* Estado global del proyecto. Se llena al arrancar con los valores por defecto
   que declara cada módulo en su propiedad "valores" (ver inicializacion.js). */
var PRO={};

/* ---------- Iconos genéricos y logo (los iconos propios de cada módulo viajan en su registro: iconoSvg) ---------- */
var ICONS={
 inicio:'<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
 salir:'<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 8l-4 4 4 4"/><path d="M6 12h10"/>',
 colapsar:'<path d="m15 6-6 6 6 6"/>',
 menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
 ok:'<circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.8 2.8L16 9.5"/>',
 adv:'<path d="M12 4 2.8 19.5h18.4z"/><path d="M12 10v4.5M12 17.3v.2"/>',
 err:'<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.2"/>',
 x:'<path d="M6 6l12 12M18 6 6 18"/>',
 flecha:'<path d="M5 12h14M13 6l6 6-6 6"/>',
 subir:'<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/>',
 bajar:'<path d="M12 4v12M7 11l5 5 5-5"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/>',
 dane:'<ellipse cx="12" cy="5.5" rx="7" ry="3"/><path d="M5 5.5v6c0 1.66 3.13 3 7 3s7-1.34 7-3v-6M5 11.5v6c0 1.66 3.13 3 7 3s7-1.34 7-3v-6"/>',
 manual:'<path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3z"/><path d="M13.5 8.5l3 3"/>',
 tasa:'<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
 calc:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/>',
 chart:'<path d="M4 19V5M4 19h16M8 15l3-4 3 2 5-6"/>',
 lista:'<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>',
 modulos:'<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
 pend:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.3-5.5 6.5-5.5s5.700 1.9 6.500 5.500"/><path d="M16 4.800a3.400 3.400 0 0 1 0 6.400M18 14.800c1.800.8 3 2.600 3.500 5.200"/>'};

function ico(n,cls){return '<svg class="i'+(cls?' '+cls:'')+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'+(ICONS[n]||'')+'</svg>';}
var LOGO='<img src="img/logo_emblema.png" alt="TREPALACE">';function uiReducido(){try{return window.matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){return false;}}
