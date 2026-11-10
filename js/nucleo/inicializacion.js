/* ==========================================================
   NÚCLEO — inicializacion.js
   Arranque de la aplicación. Va al final: necesita que núcleo y módulos ya estén cargados.
   ========================================================== */
registrarIconosModulos();
inicializarPRO();
cargarProLocal();

document.addEventListener("DOMContentLoaded",function(){
  construirMenu();
  construirVistas();
  sbIniciar();
  activarImpresion();
  restaurarSesion();
  actualizarEstados();
  irVista("inicio");});
