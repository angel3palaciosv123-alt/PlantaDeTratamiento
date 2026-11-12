/* ##########################################################
   STAR · SISTEMAS DE TRATAMIENTO DE AGUA RESIDUAL
   MÓDULO DATOS PRELIMINARES 
   ########################################################## */
/* ==========================================================
   MÓDULO DATOS PRELIMINARES — registro
   ========================================================== */
/* ================= PINTAR MÓDULO COMPLETO ================= */
function pintarDatosPreliminares_STAR(){
  var bloques=[
    bloqueComplejidad_STAR(),bloqueDotacion_STAR(),bloqueAfectacion_STAR(),bloqueContribucion_STAR(),
    bloqueInfiltracion_STAR(),bloqueMayorizacion_STAR(),bloqueGrava_STAR(),bloqueForma_STAR(),
    bloqueInclinacion_STAR(),bloqueManning_STAR(),bloqueHazen_STAR(),bloquePVC_STAR(),
    bloqueClasesPVC_STAR(),bloqueAccesorios_STAR(),bloqueElasticidad_STAR(),bloqueViscosidad_STAR(),
    bloqueAT_STAR(),bloqueCanal_STAR(),bloqueTuberia_STAR(),bloqueDesarenador_STAR(),
    bloqueDeflectores_STAR(),bloquePlataformas_STAR(),bloqueParshall_STAR()];

  gid("pane-datos_preliminares_STAR").innerHTML=
    `<div class="titulo"><h1>DATOS PRELIMINARES</h1><p>Tablas base del RAS utilizadas para el diseño. Son valores de referencia normativa, no editables.</p></div>
`+
    bloques.join("");}

MODULOS.push({
  id:"datos_preliminares_STAR",
  titulo:"Datos preliminares",
  descripcion:"Tablas base del RAS: dotaciones, niveles de complejidad, coeficientes e infiltración.",
  grupo:"proyecto",
  orden:1,
  icono:"datos",
  iconoSvg:"<ellipse cx=\"12\" cy=\"5\" rx=\"8\" ry=\"3\"/><path d=\"M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5\"/><path d=\"M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6\"/>",
  valores:{},
  imprimible:true,
  normalizar:function(PRO){},
  completo:function(PRO){return true;},
  pintar:pintarDatosPreliminares_STAR
});
