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

/* ==========================================================
   TIPOS DE PROYECTO (pantalla principal, riel lateral y guardado)
   ----------------------------------------------------------
   Cada tipo tiene su carpeta en js/modulos/<carpeta>/ y sus módulos llevan
   el sufijo del tipo al final del id y de sus variables:
     STAR = Sistemas de tratamiento de agua residual   (js/modulos/star/)
     STAP = Sistemas de tratamiento de agua potable    (js/modulos/stap/)
     IHS  = Redes e instalaciones hidrosanitarias      (js/modulos/ihs/)
     RS   = Diseño de relleno sanitario                (js/modulos/rs/)
   PARA EDITAR A MANO:
     estado : texto de la etiqueta en la pantalla principal
              ("DISPONIBLE", "PRÓXIMAMENTE" o "EN CONSTRUCCIÓN").
     desc   : descripción de la tarjeta del proyecto.
     imagen : foto del banner de inicio del tipo (reemplaza el archivo en img/proyectos/).
     clave  : nombre con el que se guarda el proyecto en el navegador.
   ========================================================== */
var TIPOS=[
 {id:"STAP",carpeta:"stap",estado:"PRÓXIMAMENTE",
  titulo:"Sistemas de tratamiento de agua potable",corto:"Agua potable",sub:"Planta de tratamiento (PTAP)",sigla:"PTAP",icono:"tipoSTAP",
  imagen:"img/proyectos/STAP.jpg",clave:"trepalace_STAP",
  desc:"Diseña las unidades que convierten el agua cruda en agua apta para consumo humano: mezcla rápida, floculación, sedimentación, filtración y desinfección, conforme a la Resolución 0330 de 2017 (RAS), el Título C y la calidad exigida por la Resolución 2115 de 2007."},
 {id:"STAR",carpeta:"star",estado:"EN CONSTRUCCIÓN",
  titulo:"Sistemas de tratamiento de agua residual",corto:"Agua residual",sub:"Planta de tratamiento (PTAR)",sigla:"PTAR",icono:"tipoSTAR",
  imagen:"img/proyectos/STAR.jpg",clave:"ptarProyecto",
  desc:"Diseña el tratamiento de las aguas residuales domésticas, desde el pretratamiento hasta la desinfección, para entregar un vertimiento que cumpla la Resolución 0631 de 2015, siguiendo la Resolución 0330 de 2017 (RAS) y el Título E."},
 {id:"IHS",carpeta:"ihs",estado:"PRÓXIMAMENTE",
  titulo:"Redes e instalaciones hidrosanitarias",corto:"Redes hidrosanitarias",sub:"Instalaciones y redes",sigla:"IHS",icono:"tipoIHS",
  imagen:"img/proyectos/IHS.jpg",clave:"trepalace_IHS",
  desc:"Diseña las redes de agua fría y caliente, desagües, ventilación y aguas lluvias de las edificaciones según la NTC 1500 (Código Colombiano de Instalaciones Hidráulicas y Sanitarias), y las redes externas de acueducto y alcantarillado según el RAS."},
 {id:"RS",carpeta:"rs",estado:"PRÓXIMAMENTE",
  titulo:"Diseño de relleno sanitario",corto:"Relleno sanitario",sub:"Diseño de rellenos",sigla:"RS",icono:"tipoRS",
  imagen:"img/proyectos/RS.jpg",clave:"trepalace_RS",
  desc:"Diseña la disposición final de residuos sólidos con la tecnología de relleno sanitario: generación de residuos, celdas, cobertura, lixiviados, gases y vida útil, de acuerdo con el Decreto 1077 de 2015 (que compila el Decreto 838 de 2005) y la Resolución 0938 de 2019."}];

/* Tipo de proyecto abierto en este momento (null = pantalla principal de proyectos). */
var TIPO_ACTIVO=null;
var CLAVE_TIPO="trepalaceTipo", CLAVE_ULTIMO="trepalaceUltimo";

/* Grupos del menú lateral y de la pantalla de inicio. Cada módulo declara su grupo por id.
   Un grupo solo aparece si el tipo de proyecto abierto tiene módulos en él. */
var GRUPOS=[
  {id:"proyecto",       menu:"Mi Proyecto",            inicio:"Mi proyecto"},
  {id:"hidraulico",     menu:"Diseño Hidráulico",      inicio:"Diseño hidráulico"},
  {id:"tratamiento",    menu:"Tratamiento",            inicio:"Tratamiento"},
  {id:"internas",       menu:"Instalaciones internas", inicio:"Instalaciones internas"},
  {id:"externas",       menu:"Redes externas",         inicio:"Redes externas"},
  {id:"relleno",        menu:"Diseño del relleno",     inicio:"Diseño del relleno"}];

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
 grid:'<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
 atras:'<path d="M19 12H5M11 18l-6-6 6-6"/>',
 capas:'<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
 tipoSTAP:'<path d="M12 3s6.5 6.8 6.5 11.3A6.5 6.5 0 0 1 5.5 14.3C5.5 9.8 12 3 12 3z"/><path d="M9.3 14.6a2.8 2.8 0 0 0 2.7 2.7"/>',
 tipoSTAR:'<path d="M3 9c2.5-2 4.5-2 7 0s4.5 2 7 0 3-1.5 4-1"/><path d="M3 15c2.5-2 4.5-2 7 0s4.5 2 7 0 3-1.5 4-1"/>',
 tipoIHS:'<path d="M2 12h5M17 12h5"/><rect x="7" y="8" width="10" height="8" rx="1.5"/><path d="M12 8V4M9.5 4h5"/>',
 tipoRS:'<path d="M2 19 8.5 9l4 6 3-4L22 19z"/><path d="M2 19h20"/>',
 users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.3-5.5 6.5-5.5s5.700 1.9 6.500 5.500"/><path d="M16 4.800a3.400 3.400 0 0 1 0 6.400M18 14.800c1.800.8 3 2.600 3.500 5.200"/>'};

function ico(n,cls){return '<svg class="i'+(cls?' '+cls:'')+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'+(ICONS[n]||'')+'</svg>';}
var LOGO='<img src="img/logo_emblema.png" alt="TREPALACE">';function uiReducido(){try{return window.matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){return false;}}
