/* ==========================================================
   NÚCLEO — registro_modulos.js
   Registro extensible de módulos. Cada módulo se registra con MODULOS.push({...}).

   Propiedades reconocidas por el núcleo (todas genéricas):
     id            identificador único (también define: #v-<id>, #pane-<id>, #tab-<id>, #st-<id>)
     titulo        título completo (tarjeta de inicio)
     tituloMenu    título corto para el menú lateral (opcional; por defecto titulo)
     descripcion   texto de la tarjeta de inicio
     grupo         id de un grupo de GRUPOS (configuracion.js)
     orden         posición en menú e inicio
     icono         clave del icono;  iconoSvg: contenido SVG del icono (opcional)
     valores       valores por defecto de las variables PRO que posee el módulo
     normalizar    function(PRO)  corrige/rellena las variables propias
     completo      function(PRO)  true si el módulo está calculado/completo
     validar       function(PRO)  opcional: devuelve lista de errores propios
     pintar        function()     dibuja el módulo en #pane-<id> cada vez que se abre
     vista         function()     opcional: HTML interno propio de la vista (reemplaza el #pane-<id> por defecto)
     indicador     true => muestra ●/○ en el menú y cuenta en el avance del inicio
     imprimible    true => agrega el botón IMPRIMIR en el título
     proximamente  true => se muestra como "PRÓXIMAMENTE" (sin cálculo)
     estadoExtra   opcional {guardar,cargar} para estado que no vive en PRO
     api           opcional: funciones que el módulo ofrece a otros (consulta con moduloApi(id))
   ========================================================== */
var MODULOS = window.MODULOS || [];
window.MODULOS = MODULOS;
function registrarModulo(def){ MODULOS.push(def); }

function modulosOrdenados(){
  return MODULOS.slice().sort(function(a,b){return (a.orden||0)-(b.orden||0);});}

function modulo(id){
  for(var i=0;i<MODULOS.length;i++){if(MODULOS[i].id===id)return MODULOS[i];}
  return null;}

function moduloApi(id){var m=modulo(id);return (m&&m.api)||{};}

function moduloListo(id){
  var m=modulo(id);
  return !!(m&&typeof m.completo==="function"&&m.completo(PRO));}

/* Crea PRO a partir de los valores por defecto de cada módulo (sin pisar lo ya existente). */
function inicializarPRO(){
  modulosOrdenados().forEach(function(m){
    var v=m.valores||{};
    Object.keys(v).forEach(function(k){
      if(!(k in PRO))PRO[k]=(v[k]!==null&&typeof v[k]==="object")?JSON.parse(JSON.stringify(v[k])):v[k];});});}

/* Registra los iconos que traen los módulos. */
function registrarIconosModulos(){
  MODULOS.forEach(function(m){if(m.icono&&m.iconoSvg)ICONS[m.icono]=m.iconoSvg;});}

/* Cada módulo normaliza solo sus propias variables. */
function normalizarPro(){
  modulosOrdenados().forEach(function(m){if(typeof m.normalizar==="function")m.normalizar(PRO);});
  guardarPro();}
