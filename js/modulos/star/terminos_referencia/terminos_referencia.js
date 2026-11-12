/* ##########################################################
   STAR · SISTEMAS DE TRATAMIENTO DE AGUA RESIDUAL
   MÓDULO TÉRMINOS DE REFERENCIA  (posición 2 en el menú) — terminos_referencia.js
   Ventana completa, limpieza del proyecto, completitud y advertencias por tarjeta.
   Sufijo: las funciones y variables globales de este archivo terminan en _STAR
   (así no chocan con los módulos de STAP, IHS o RS que tengan el mismo nombre).
   ########################################################## */
/* ===============  TARJETAS REGISTRADAS (una por unidad de diseño)  ======================== */
TR_STAR.registrarTarjeta({id:"identificacion",orden:1,pintar:trCardIdentificacion_STAR});
TR_STAR.registrarTarjeta({id:"poblacion",orden:2,pintar:trCardPoblacion_STAR});
TR_STAR.registrarTarjeta({id:"caudal",orden:3,pintar:trCardCaudal_STAR});
TR_STAR.registrarTarjeta({id:"rejilla",orden:4,pintar:trCardRejilla_STAR});
TR_STAR.registrarTarjeta({id:"aduccion",orden:5,pintar:trCardAduccion_STAR});
TR_STAR.registrarTarjeta({id:"desarenador",orden:6,pintar:trCardDesarenador_STAR});
TR_STAR.registrarTarjeta({id:"parshall",orden:7,pintar:trCardParshall_STAR});

/* =======  VENTANA COMPLETA: ENSAMBLA TODAS LAS TARJETAS REGISTRADAS ======= */
function pintarTerminosReferencia_STAR(){
  var h='<div class="titulo"><h1>TÉRMINOS DE REFERENCIA</h1><p>Parámetros generales del proyecto. Se guardan automáticamente y alimentan las ventanas de caudal de diseño y rejilla.</p></div>'+CONV+
    '<div class="tr-acciones"><button type="button" class="btn-limpiar-tr" onclick="limpiarProyectoTR_STAR()">Limpiar proyecto</button></div>';
  TR_STAR.tarjetas.slice().sort(function(a,b){return a.orden-b.orden;}).forEach(function(t){h+='<div data-tr="'+t.id+'" style="display:contents">'+t.pintar()+'</div>';});
  gid("pane-terminos_referencia_STAR").innerHTML=h;}

/* ---------- Limpiar proyecto ---------- */
function limpiarProyectoTR_STAR(){
  confirmarModal('Limpiar proyecto','Se borrarán todos los datos de Términos de referencia y toda la memoria de cálculo almacenada. Esta acción no se puede deshacer.\n\nSi quieres conservarlos, primero usa "Guardar mi proyecto" en el inicio.',function(){
    borrarProyectoLocal();},'Limpiar todo',true);}

/* ---------- Completitud (todos los términos obligatorios definidos) ---------- */
function trCompleto_STAR(PRO){
  return !!(PRO.diseñador&&PRO.nombrePob&&esPos(PRO.duracion)&&esPos(PRO.anioIni)&&PRO.pobProy&&PRO.areaTotal&&
    PRO.R!==""&&PRO.pUrb!==""&&PRO.pVias!==""&&PRO.pInd!==""&&PRO.pCom!==""&&PRO.pIns!==""&&
    PRO.factorAf!=="-"&&PRO.coefAf!==""&&PRO.coefAf!=="-"&&PRO.tipoInf!=="-"&&PRO.metMay!=="-"&&
    esPos(PRO.rejPct)&&esPos(PRO.nCanales)&&PRO.Vf!==""&&PRO.limpieza&&PRO.limpieza!=="-"&&PRO.inclina&&PRO.anguloManual!==""&&
    PRO.grava!=="-"&&PRO.forma!=="-"&&esPos(PRO.diamIn)&&esPos(PRO.bordeLibre)&&esPos(PRO.Hrh)&&
    esPos(PRO.aduL)&&esPos(PRO.tubL)&&esPos(PRO.aduS)&&esPos(PRO.tubS)&&esPos(PRO.desA)&&esPos(PRO.desVor));}

/* ---------- Advertencias de Términos de referencia (por tarjeta) ----------
   Cada tarjeta avisa solo de sus propios valores. Un campo vacío no genera advertencia. */
function trLleno_STAR(k){return !(PRO[k]===""||PRO[k]===null||PRO[k]===undefined);}
function trLlamar_STAR(nombre,arg){
  try{return typeof window[nombre]==="function"?(window[nombre](arg)||[]):[];}catch(_){return [];}}

var TR_AVISOS_STAR={
  caudal:{titulo:"Parámetros de Caudal de diseño",f:function(){return trLlamar_STAR("avisosParametrosCaudal_STAR");}},
  rejilla:{titulo:"Parámetros de Rejilla",f:function(){return trLlamar_STAR("avisosParametrosRejilla_STAR");}},
  aduccion:{titulo:"Parámetros de Aducción",f:function(){return trLlamar_STAR("avisosRangoAduccion_STAR","general");}},
  desarenador:{titulo:"Parámetros de Desarenador",f:function(){return trLlamar_STAR("avisosParametrosDesarenador_STAR");}},
  parshall:{titulo:"Parámetros de Canaleta Parshall",f:function(){
    var e=[];
    if(trLleno_STAR("parHaW")&&!(Number(PRO.parHaW)>=0.4&&Number(PRO.parHaW)<=0.8))
      e.push("La relación Ha/W = "+nf(Number(PRO.parHaW),2)+" está fuera del rango 0,40 – 0,80.");
    if(trLleno_STAR("parBL")&&!(Number(PRO.parBL)>=0))e.push("El borde libre no puede ser negativo.");
    if(trLleno_STAR("parT")&&!(Number(PRO.parT)>=0&&Number(PRO.parT)<=100))e.push("La temperatura del agua debe estar entre 0 y 100 °C.");
    return e;}}
};

/* Avisos de una tarjeta (id) o de todas (sin id) */
function avisosTR_STAR(id){
  if(id)return TR_AVISOS_STAR[id]?TR_AVISOS_STAR[id].f():[];
  var e=[];Object.keys(TR_AVISOS_STAR).forEach(function(k){e=e.concat(TR_AVISOS_STAR[k].f());});return e;}

/* Recuerda en qué tarjeta se editó el último campo */
var _trTarjeta_STAR=null;
['input','change'].forEach(function(ev){document.addEventListener(ev,function(e){
  var t=e.target&&e.target.closest?e.target.closest('[data-tr]'):null;
  if(t)_trTarjeta_STAR=t.getAttribute('data-tr');},true);});

/* Se ejecuta con cada cambio de campo: redibuja y avisa solo de la tarjeta donde se editó. */
function recalcularTR_STAR(){
  var id=_trTarjeta_STAR,e=avisosTR_STAR(id);
  pintarTerminosReferencia_STAR();
  if(e.length)abrirAdvertencia("Advertencia — "+TR_AVISOS_STAR[id].titulo,e);}

MODULOS.push({
  id:"terminos_referencia_STAR",
  titulo:"Términos de referencia",
  descripcion:"Datos generales del proyecto: población, áreas, duración y coeficiente de retorno.",
  grupo:"proyecto",
  orden:2,
  icono:"tr",
  iconoSvg:"<rect x=\"6\" y=\"4\" width=\"12\" height=\"17\" rx=\"2\"/><path d=\"M9 4h6v3H9z\"/><path d=\"m9.5 14 2 2 3.5-4\"/>",
  valores:{diseñador:"",nombrePob:"",duracion:"",anioIni:"",pobProy:"",metodoPob:""},
  indicador:true,
  imprimible:true,
  normalizar:function(PRO){},
  completo:trCompleto_STAR,
  pintar:pintarTerminosReferencia_STAR,
  recalcular:recalcularTR_STAR,
  errores:function(){return avisosTR_STAR();}
});