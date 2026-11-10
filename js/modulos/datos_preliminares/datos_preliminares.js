/* ==========================================================
   MÓDULO DATOS PRELIMINARES — registro
   ========================================================== */
/* ================= PINTAR MÓDULO COMPLETO ================= */
function pintarDatosPreliminares(){
  var bloques=[
    bloqueComplejidad(),bloqueDotacion(),bloqueAfectacion(),bloqueContribucion(),
    bloqueInfiltracion(),bloqueMayorizacion(),bloqueGrava(),bloqueForma(),
    bloqueInclinacion(),bloqueManning(),bloqueHazen(),bloquePVC(),
    bloqueClasesPVC(),bloqueAccesorios(),bloqueElasticidad(),bloqueViscosidad(),
    bloqueAT(),bloqueCanal(),bloqueTuberia(),bloqueDesarenador(),
    bloqueDeflectores(),bloquePlataformas(),bloqueParshall()];

  gid("pane-datos_preliminares").innerHTML=
    `<div class="titulo"><h1>DATOS PRELIMINARES</h1><p>Tablas base del RAS utilizadas para el diseño. Son valores de referencia normativa, no editables.</p></div>
`+
    bloques.join("");}

MODULOS.push({
  id:"datos_preliminares",
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
  pintar:pintarDatosPreliminares
});
