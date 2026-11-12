/*
 * PLANTILLA DE MÓDULO DE CÁLCULO — TREPALACE
 * Esta plantilla viene con el sufijo de ejemplo _TIPO. Al copiarla, reemplaza "_TIPO" por el
 * sufijo del tipo de proyecto (Buscar y reemplazar en VS Code):
 *     _STAR = agua residual (js/modulos/star/)      _STAP = agua potable (js/modulos/stap/)
 *     _IHS  = redes hidrosanitarias (js/modulos/ihs/) _RS   = relleno sanitario (js/modulos/rs/)
 * Pasos:
 *  1. Copiar esta carpeta dentro de la carpeta del tipo: js/modulos/<tipo>/<nombre_modulo>/.
 *  2. Reemplazar _TIPO por el sufijo del tipo. Todo nombre global del módulo (funciones, variables
 *     y el id) termina en ese sufijo, p. ej. id "floculador_STAP", calcularFloculador_STAP().
 *     El núcleo reconoce el tipo del módulo por ese sufijo del id.
 *  3. Agregar sus <script> en index.html, dentro del bloque de su tipo de proyecto.
 *  4. Si el módulo reemplaza un marcador "PRÓXIMAMENTE", borrar su entrada en
 *     js/modulos/<tipo>/proximos/proximos_<TIPO>.js.
 *  5. Tablas y constantes -> en datos_preliminares/tablas.js de su tipo (p. ej. DP_STAR.T.<NOMBRE>).
 *     Parámetros y rangos -> en terminos_referencia/ de su tipo (p. ej. TR_STAR.registrarTarjeta y TR_STAR.R).
 *  6. El módulo NO define datosPreliminares ni terminosReferencia: solo cálculo, validaciones,
 *     esquemas SVG y memoria de cálculo. El menú, el inicio, la vista (#pane-<id>), el indicador de
 *     estado, los valores por defecto y la normalización los genera el núcleo desde este registro.
 *  7. Grupos del menú disponibles (configuracion.js): proyecto, hidraulico, tratamiento, internas,
 *     externas, relleno.
 * Núcleo disponible: PRO, guardarPro(), actualizarEstados(), nf(), rnd(), esPos(), esVacio(), normFix(),
 *   campo(), selec(), fila(), seccion(), registrarMemoria(), abrirAdvertencia(), abrirRevision(),
 *   svgDefs(), svgDimH(), svgDimV(), moduloApi(id).
 * Sin import/export: scripts clásicos, funcionan con file://.
 */

function calcularPlantilla_TIPO(){
  /* Entradas de PRO + tablas de DP_TIPO.T + rangos de TR_TIPO.R. Devolver resultados. */
  return { ok: true };
}

function avisosParametrosPlantilla_TIPO(){
  var avisos = [];
  // if (!esPos(PRO.parametroPlantilla)) avisos.push("Ingresa un valor válido.");
  return avisos;
}
function revisionPlantilla_TIPO(){
  var errores = [];
  abrirRevision("Plantilla", errores);
}
function recalcularPlantilla_TIPO(){
  var avisos = avisosParametrosPlantilla_TIPO();
  if (avisos.length){ abrirAdvertencia("Advertencia — Plantilla", avisos); return; }
  PRO.resultadoPlantilla = calcularPlantilla_TIPO();
  guardarPro(); actualizarEstados(); pintarPlantilla_TIPO();
}

function pintarPlantilla_TIPO(){
  var h = '<div class="titulo"><h1>DISEÑO DE PLANTILLA</h1><p>Descripción del módulo.</p></div>';
  h += '<div class="card"><div class="card-title">Resultados</div>';
  h += '<div class="acciones"><button class="btn btn-primary" onclick="recalcularPlantilla_TIPO()">RECALCULAR</button>' +
       '<button class="btn-revision" onclick="revisionPlantilla_TIPO()">REVISIÓN DE ERRORES</button></div></div>';
  gid("pane-modulo_plantilla_TIPO").innerHTML = h;
}

MODULOS.push({
  id: "modulo_plantilla_TIPO",
  titulo: "Nombre del módulo",
  descripcion: "Descripción para la tarjeta de inicio.",
  grupo: "hidraulico",
  orden: 99,
  icono: "m4",
  iconoSvg: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
  valores: { resultadoPlantilla: null },
  indicador: true,
  imprimible: true,
  normalizar: function(PRO){ /* normalizar solo variables propias */ },
  completo: function(PRO){ return !!PRO.resultadoPlantilla; },
  validar: function(PRO){ return avisosParametrosPlantilla_TIPO(); },
  pintar: pintarPlantilla_TIPO
});
