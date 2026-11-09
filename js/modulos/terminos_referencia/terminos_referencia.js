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
  TR.tarjetas.slice().sort(function(a,b){return a.orden-b.orden;}).forEach(function(t){h+=t.pintar();});
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
    esPos(PRO.aduL)&&esPos(PRO.tubL)&&esPos(PRO.aduS)&&esPos(PRO.tubS)&&esPos(PRO.desA)&&esPos(PRO.desH)&&esPos(PRO.desVor));}

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
  pintar:pintarTerminosReferencia
});
