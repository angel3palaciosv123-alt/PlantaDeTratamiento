/* ==========================================================
   NÚCLEO — almacenamiento.js
   Guardado en el navegador (localStorage), exportar/importar proyecto (.json)
   y borrado. El estado propio de cada módulo (p. ej. tablas calculadas que no
   viven en PRO) se guarda y recupera mediante la propiedad opcional
   "estadoExtra" {guardar:function(){return {...}}, cargar:function(obj){...}}.
   ========================================================== */

function cargarProLocal(){
  try{var g=localStorage.getItem(CLAVE_ALMACEN);if(g)Object.assign(PRO,JSON.parse(g));}catch(e){}}

function guardarPro(){if(!TIPO_ACTIVO)return;try{localStorage.setItem(CLAVE_ALMACEN,JSON.stringify(PRO));}catch(e){}if(typeof uiGuardado==="function")uiGuardado();}

function borrarProyectoLocal(){
  try{localStorage.removeItem(CLAVE_ALMACEN);}catch(e){}
  location.reload();}

function limpiarTodo(){
  confirmarModal("Borrar proyecto","¿Borrar todos los datos del proyecto actual y empezar en blanco? Esta acción no se puede deshacer.",function(){
    borrarProyectoLocal();},"Borrar todo",true);}

/* ---------- Estado extra de módulos (genérico) ---------- */
function estadoExtraModulos(){
  var o={};
  modulosOrdenados().forEach(function(m){if(m.estadoExtra&&typeof m.estadoExtra.guardar==="function")Object.assign(o,m.estadoExtra.guardar());});
  return o;}

function cargarEstadoExtraModulos(obj){
  modulosOrdenados().forEach(function(m){if(m.estadoExtra&&typeof m.estadoExtra.cargar==="function")m.estadoExtra.cargar(obj);});}

/* ---------- Guardar y cargar proyecto (.json) ---------- */
function guardarProyectoJSON(){
  try{
    var datos={formato:'Trespalacios-PTAR',tipo:TIPO_ACTIVO,version:1,fecha:new Date().toISOString(),PRO:PRO,estado:estadoExtraModulos()};
    var blob=new Blob([JSON.stringify(datos,null,2)],{type:'application/json'});
    var nom=String(PRO.nombrePob||'proyecto').trim().replace(/[^\w\-áéíóúñÁÉÍÓÚÑ]+/g,'_')||'proyecto';
    var a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download='Proyecto_'+TIPO_ACTIVO+'_'+nom+'_'+new Date().toISOString().slice(0,10)+'.json';
    document.body.appendChild(a);a.click();
    setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},400);
  }catch(e){mostrarError('Guardar proyecto','No fue posible exportar el proyecto: '+e.message);}}

function abrirCargarProyecto(){
  var c='<div class="drop-zone" id="dropProyecto" tabindex="0" role="button" aria-label="Arrastra aquí o pega tu archivo de proyecto">'+ico('subir')+
    '<b>Arrastra aquí tu archivo .json o pégalo (Ctrl + V)</b><span>También puedes hacer clic para buscarlo en tu equipo.</span></div>'+
    '<input type="file" id="fileProyecto" accept=".json,application/json" style="display:none">';
  uiRevision('ok','subir','Cargar proyecto','Se reemplazarán los datos del proyecto actual por los del archivo.',c);
  var z=gid('dropProyecto'),f=gid('fileProyecto');
  z.onclick=function(){f.click();};
  z.onkeydown=function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();f.click();}};
  f.onchange=function(){if(f.files&&f.files[0])leerArchivoProyecto(f.files[0]);};
  ['dragenter','dragover'].forEach(function(t){z.addEventListener(t,function(e){e.preventDefault();z.classList.add('drag');});});
  ['dragleave','drop'].forEach(function(t){z.addEventListener(t,function(e){e.preventDefault();z.classList.remove('drag');});});
  z.addEventListener('drop',function(e){var fl=e.dataTransfer&&e.dataTransfer.files;if(fl&&fl[0])leerArchivoProyecto(fl[0]);});}

document.addEventListener('paste',function(e){
  if(!gid('dropProyecto'))return;
  var cd=e.clipboardData;if(!cd)return;
  if(cd.files&&cd.files[0]){e.preventDefault();leerArchivoProyecto(cd.files[0]);return;}
  var t=cd.getData('text');if(t&&t.trim()){e.preventDefault();aplicarProyectoTexto(t);}});

  function leerArchivoProyecto(file){
  var r=new FileReader();
  r.onload=function(){aplicarProyectoTexto(String(r.result));};
  r.onerror=function(){mostrarError('Cargar proyecto','No fue posible leer el archivo.');};
  r.readAsText(file);}

function aplicarProyectoTexto(txt){
  var d;
  try{d=JSON.parse(txt);}catch(e){cerrarRevision();mostrarError('Cargar proyecto','El contenido no es un archivo JSON válido.');return;}
  if(!d||typeof d!=='object'||!d.PRO||typeof d.PRO!=='object'){cerrarRevision();mostrarError('Cargar proyecto','El archivo no corresponde a un proyecto guardado desde esta plataforma.');return;}
  /* Los archivos antiguos (sin "tipo") son de agua residual (STAR). */
  var tipoArchivo=d.tipo||'STAR';
  if(tipoArchivo!==TIPO_ACTIVO){var Ta=tipoProyecto(tipoArchivo);cerrarRevision();mostrarError('Cargar proyecto','Este archivo es de un proyecto de '+(Ta?Ta.corto:tipoArchivo)+'. Ábrelo desde ese tipo de proyecto.');return;}
  Object.keys(d.PRO).forEach(function(k){PRO[k]=d.PRO[k];});
  cargarEstadoExtraModulos(d.estado&&typeof d.estado==='object'?d.estado:{});
  normalizarPro();guardarPro();actualizarEstados();
  cerrarRevision();irVista('inicio');
  mostrarModal('Proyecto cargado','Los datos del proyecto se cargaron correctamente.');}

