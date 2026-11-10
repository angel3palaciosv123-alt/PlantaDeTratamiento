/*
 * PLANTILLA DE MÓDULO DE CÁLCULO — TREPALACE
 * Pasos:
 *  1. Copiar esta carpeta, renombrar archivo e identificadores (id único, p. ej. "mimodulo").
 *  2. Agregar sus <script> en index.html (sección 3) antes de inicializacion.js.
 *  3. Si necesita tablas/constantes físicas -> agregarlas SOLO en js/modulos/datos_preliminares/tablas.js
 *     y consultarlas con DP.T.<NOMBRE>.
 *  4. Si necesita parámetros de entrada, rangos o criterios -> agregar su tarjeta en
 *     js/modulos/terminos_referencia/tarjetas.js (TR.registrarTarjeta) y sus rangos en rangos.js (TR.R).
 *  5. El módulo NO define datosPreliminares ni terminosReferencia: solo cálculo, validaciones,
 *     esquemas SVG y memoria de cálculo. El menú, el inicio, la vista (#pane-<id>), el indicador de
 *     estado, los valores por defecto y la normalización los genera el núcleo desde este registro.
 * Núcleo disponible: PRO, guardarPro(), actualizarEstados(), nf(), rnd(), esPos(), esVacio(), normFix(),
 *   campo(), selec(), fila(), seccion(), registrarMemoria(), abrirAdvertencia(), abrirRevision(),
 *   svgDefs(), svgDimH(), svgDimV(), moduloApi(id).
 * Sin import/export: scripts clásicos, funcionan con file://.
 */

function calcularPlantilla(){
  /* Entradas de PRO + tablas de DP.T + rangos de TR.R. Devolver resultados. */
  return { ok: true };
}

function avisosParametrosPlantilla(){
  var avisos = [];
  // if (!esPos(PRO.parametroPlantilla)) avisos.push("Ingresa un valor válido.");
  return avisos;
}
function revisionPlantilla(){
  var errores = [];
  abrirRevision("Plantilla", errores);
}
function recalcularPlantilla(){
  var avisos = avisosParametrosPlantilla();
  if (avisos.length){ abrirAdvertencia("Advertencia — Plantilla", avisos); return; }
  PRO.resultadoPlantilla = calcularPlantilla();
  guardarPro(); actualizarEstados(); pintarPlantilla();
}

function pintarPlantilla(){
  var h = '<div class="titulo"><h1>DISEÑO DE PLANTILLA</h1><p>Descripción del módulo.</p></div>';
  h += '<div class="card"><div class="card-title">Resultados</div>';
  h += '<div class="acciones"><button class="btn btn-primary" onclick="recalcularPlantilla()">RECALCULAR</button>' +
       '<button class="btn-revision" onclick="revisionPlantilla()">REVISIÓN DE ERRORES</button></div></div>';
  gid("pane-modulo_plantilla").innerHTML = h;
}

MODULOS.push({
  id: "modulo_plantilla",
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
  validar: function(PRO){ return avisosParametrosPlantilla(); },
  pintar: pintarPlantilla
});
