/* ##########################################################
   STAR · SISTEMAS DE TRATAMIENTO DE AGUA RESIDUAL
   MÓDULO PRÓXIMAMENTE  (posición 9 y 10 en el menú) — proximos.js
   Marcadores del Módulo 7 (clarificación) y Módulo 8 (desinfección), aún sin cálculo.
   Sufijo: las funciones y variables globales de este archivo terminan en _STAR
   (así no chocan con los módulos de STAP, IHS o RS que tengan el mismo nombre).
   ########################################################## */
/* ==========================================================
   MÓDULOS FUTUROS (marcadores de posición). Se muestran como "PRÓXIMAMENTE".
   Para convertir uno en módulo real, cree su carpeta a partir de plantilla/ y elimine su entrada aquí.
   ========================================================== */
MODULOS.push({
  id:"modulo_7_STAR", titulo:"Módulo 7", descripcion:"Clarificación final del efluente biológico.",
  grupo:"hidraulico", orden:9, icono:"m4", iconoSvg:"<path d=\"m12 3 9 5-9 5-9-5z\"/><path d=\"m3 13 9 5 9-5\"/>", valores:{}, proximamente:true});
MODULOS.push({
  id:"modulo_8_STAR", titulo:"Módulo 8", descripcion:"Eliminación de organismos patógenos antes del vertimiento.",
  grupo:"hidraulico", orden:10, icono:"m5", iconoSvg:"<circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4\"/>", valores:{}, proximamente:true});
