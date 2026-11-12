/* ==========================================================
   NÚCLEO — inicializacion.js
   Arranque de la aplicación. Va al final: necesita que núcleo y módulos ya estén cargados.
   ========================================================== */
registrarIconosModulos();

/* Al abrir: se crean las vistas de todos los módulos; luego, con sesión abierta, se muestra
   la pantalla principal de proyectos o el último tipo abierto (ver proyectos.js). */
document.addEventListener("DOMContentLoaded",function(){
  construirVistas();
  sbIniciar();
  activarImpresion();
  restaurarSesion();});
