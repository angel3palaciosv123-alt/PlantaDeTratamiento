/* ===============  TARJETAS REGISTRADAS (una por unidad de diseño)  ======================== */
TR.registrarTarjeta({id:"identificacion",orden:1,pintar:trCardIdentificacion});
TR.registrarTarjeta({id:"poblacion",orden:2,pintar:trCardPoblacion});
TR.registrarTarjeta({id:"caudal",orden:3,pintar:trCardCaudal});
TR.registrarTarjeta({id:"rejilla",orden:4,pintar:trCardRejilla});
TR.registrarTarjeta({id:"aduccion",orden:5,pintar:trCardAduccion});
TR.registrarTarjeta({id:"desarenador",orden:6,pintar:trCardDesarenador});
TR.registrarTarjeta({id:"parshall",orden:7,pintar:trCardParshall});

/* =======  VENTANA COMPLETA: ENSAMBLA TODAS LAS TARJETAS REGISTRADAS ======= */
function pintarTerminosReferencia(){
  var h='<div class="titulo"><h1>TÉRMINOS DE REFERENCIA</h1><p>Parámetros generales del proyecto. Se guardan automáticamente y alimentan las ventanas de caudal de diseño y rejilla.</p></div>'+CONV+
    '<div class="tr-acciones"><button type="button" class="btn-limpiar-tr" onclick="limpiarProyectoTR()">Limpiar proyecto</button></div>';
  TR.tarjetas.slice().sort(function(a,b){return a.orden-b.orden;}).forEach(function(t){h+='<div data-tr="'+t.id+'" style="display:contents">'+t.pintar()+'</div>';});
  gid("pane-terminos_referencia").innerHTML=h;}

/* ---------- Limpiar proyecto ---------- */
function limpiarProyectoTR(){
  confirmarModal('Limpiar proyecto','Se borrarán todos los datos de Términos de referencia y toda la memoria de cálculo almacenada. Esta acción no se puede deshacer.\n\nSi quieres conservarlos, primero usa "Guardar mi proyecto" en el inicio.',function(){
    borrarProyectoLocal();},'Limpiar todo',true);}

/* ---------- Completitud (todos los términos obligatorios definidos) ---------- */
function trCompleto(PRO){
  return !!(PRO.diseñador&&PRO.nombrePob&&esPos(PRO.duracion)&&esPos(PRO.anioIni)&&PRO.pobProy&&PRO.areaTotal&&
    PRO.R!==""&&PRO.pUrb!==""&&PRO.pVias!==""&&PRO.pInd!==""&&PRO.pCom!==""&&PRO.pIns!==""&&
    PRO.factorAf!=="-"&&PRO.coefAf!==""&&PRO.coefAf!=="-"&&PRO.tipoInf!=="-"&&PRO.metMay!=="-"&&
    esPos(PRO.rejPct)&&esPos(PRO.nCanales)&&PRO.Vf!==""&&PRO.limpieza&&PRO.limpieza!=="-"&&PRO.inclina&&PRO.anguloManual!==""&&
    PRO.grava!=="-"&&PRO.forma!=="-"&&esPos(PRO.diamIn)&&esPos(PRO.bordeLibre)&&esPos(PRO.Hrh)&&
    esPos(PRO.aduL)&&esPos(PRO.tubL)&&esPos(PRO.aduS)&&esPos(PRO.tubS)&&esPos(PRO.desA)&&esPos(PRO.desVor));}

/* ---------- Advertencias de Términos de referencia (por tarjeta) ----------
   Cada tarjeta avisa solo de sus propios valores. Un campo vacío no genera advertencia. */
function trLleno(k){return !(PRO[k]===""||PRO[k]===null||PRO[k]===undefined);}
function trLlamar(nombre,arg){
  try{return typeof window[nombre]==="function"?(window[nombre](arg)||[]):[];}catch(_){return [];}}

var TR_AVISOS={
  caudal:{titulo:"Parámetros de Caudal de diseño",f:function(){return trLlamar("avisosParametrosCaudal");}},
  rejilla:{titulo:"Parámetros de Rejilla",f:function(){return trLlamar("avisosParametrosRejilla");}},
  aduccion:{titulo:"Parámetros de Aducción",f:function(){return trLlamar("avisosRangoAduccion","general");}},
  desarenador:{titulo:"Parámetros de Desarenador",f:function(){return trLlamar("avisosParametrosDesarenador");}},
  parshall:{titulo:"Parámetros de Canaleta Parshall",f:function(){
    var e=[];
    if(trLleno("parHaW")&&!(Number(PRO.parHaW)>=0.4&&Number(PRO.parHaW)<=0.8))
      e.push("La relación Ha/W = "+nf(Number(PRO.parHaW),2)+" está fuera del rango 0,40 – 0,80.");
    if(trLleno("parBL")&&!(Number(PRO.parBL)>=0))e.push("El borde libre no puede ser negativo.");
    if(trLleno("parT")&&!(Number(PRO.parT)>=0&&Number(PRO.parT)<=100))e.push("La temperatura del agua debe estar entre 0 y 100 °C.");
    return e;}}
};

/* Avisos de una tarjeta (id) o de todas (sin id) */
function avisosTR(id){
  if(id)return TR_AVISOS[id]?TR_AVISOS[id].f():[];
  var e=[];Object.keys(TR_AVISOS).forEach(function(k){e=e.concat(TR_AVISOS[k].f());});return e;}

/* Recuerda en qué tarjeta se editó el último campo */
var _trTarjeta=null;
['input','change'].forEach(function(ev){document.addEventListener(ev,function(e){
  var t=e.target&&e.target.closest?e.target.closest('[data-tr]'):null;
  if(t)_trTarjeta=t.getAttribute('data-tr');},true);});

/* Se ejecuta con cada cambio de campo: redibuja y avisa solo de la tarjeta donde se editó. */
function recalcularTR(){
  var id=_trTarjeta,e=avisosTR(id);
  pintarTerminosReferencia();
  if(e.length)abrirAdvertencia("Advertencia — "+TR_AVISOS[id].titulo,e);}

MODULOS.push({
  id:"terminos_referencia",
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
  completo:trCompleto,
  pintar:pintarTerminosReferencia,
  recalcular:recalcularTR,
  errores:function(){return avisosTR();}
});