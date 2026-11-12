/* ==========================================================
   IHS — Redes e instalaciones hidrosanitarias
   MÓDULOS PRÓXIMAMENTE (marcadores). Se muestran en el menú y en el Inicio de IHS
   con la etiqueta "PRÓXIMAMENTE", sin cálculo.
   Para convertir uno en módulo real: copia js/modulos/plantilla/ en
   js/modulos/ihs/<nombre_modulo>/, usa el sufijo _IHS en su id y en sus
   variables, agrega sus <script> en index.html y borra aquí su entrada.
   ========================================================== */

/* Módulo 1 · Datos del proyecto — Tipo de edificación, número de pisos, usuarios y normativa aplicable. */
MODULOS.push({
  id:"datos_proyecto_IHS", titulo:"Datos del proyecto", descripcion:"Tipo de edificación, número de pisos, usuarios y normativa aplicable.",
  grupo:"proyecto", orden:1, icono:"tr_IHS", iconoSvg:"<rect x=\"5\" y=\"4\" width=\"14\" height=\"17\" rx=\"2\"/><path d=\"M9 4V3h6v1M9 11l2 2 4-4M9 17h6\"/>", valores:{}, proximamente:true});

/* Módulo 2 · Aparatos sanitarios — Inventario de aparatos y unidades de consumo y de descarga. */
MODULOS.push({
  id:"aparatos_IHS", titulo:"Aparatos sanitarios", descripcion:"Inventario de aparatos y unidades de consumo y de descarga.",
  grupo:"proyecto", orden:2, icono:"apar_IHS", iconoSvg:"<path d=\"M5 10h14v2a7 7 0 0 1-14 0z\"/><path d=\"M9 21h6M12 19v2M7 10V5a2 2 0 0 1 4 0\"/>", valores:{}, proximamente:true});

/* Módulo 3 · Agua fría — Caudales probables, diámetros y presiones en la red interna. */
MODULOS.push({
  id:"agua_fria_IHS", titulo:"Agua fría", descripcion:"Caudales probables, diámetros y presiones en la red interna.",
  grupo:"internas", orden:3, icono:"fria_IHS", iconoSvg:"<path d=\"M12 3v18M5 7l14 10M19 7 5 17\"/>", valores:{}, proximamente:true});

/* Módulo 4 · Agua caliente — Demanda, calentadores y red de distribución. */
MODULOS.push({
  id:"agua_caliente_IHS", titulo:"Agua caliente", descripcion:"Demanda, calentadores y red de distribución.",
  grupo:"internas", orden:4, icono:"cal_IHS", iconoSvg:"<path d=\"M12 21a5 5 0 0 0 5-5c0-3-2-4-3-7-1 2-3 2-3 5-1-1-1.5-2-1.5-3C7 13 7 14.5 7 16a5 5 0 0 0 5 5z\"/>", valores:{}, proximamente:true});

/* Módulo 5 · Desagües y ventilación — Ramales, bajantes, colectores y ventilación. */
MODULOS.push({
  id:"desagues_IHS", titulo:"Desagües y ventilación", descripcion:"Ramales, bajantes, colectores y ventilación.",
  grupo:"internas", orden:5, icono:"ven_IHS", iconoSvg:"<path d=\"M8 3v10a4 4 0 0 0 8 0V3\"/><path d=\"M12 17v4\"/>", valores:{}, proximamente:true});

/* Módulo 6 · Aguas lluvias — Canales, bajantes y colectores pluviales. */
MODULOS.push({
  id:"aguas_lluvias_IHS", titulo:"Aguas lluvias", descripcion:"Canales, bajantes y colectores pluviales.",
  grupo:"internas", orden:6, icono:"lluv_IHS", iconoSvg:"<path d=\"M6 14a4 4 0 0 1 .5-8A5.5 5.5 0 0 1 17 7a3.5 3.5 0 0 1 1 7z\"/><path d=\"M8 18l-1 2M12 18l-1 2M16 18l-1 2\"/>", valores:{}, proximamente:true});

/* Módulo 7 · Red de acueducto — Red de distribución por mallas o ramales. */
MODULOS.push({
  id:"red_acueducto_IHS", titulo:"Red de acueducto", descripcion:"Red de distribución por mallas o ramales.",
  grupo:"externas", orden:7, icono:"red_IHS", iconoSvg:"<circle cx=\"5\" cy=\"6\" r=\"2\"/><circle cx=\"19\" cy=\"6\" r=\"2\"/><circle cx=\"12\" cy=\"18\" r=\"2\"/><path d=\"M7 6h10M6 8l5 8.3M18 8l-5 8.3\"/>", valores:{}, proximamente:true});

/* Módulo 8 · Alcantarillado sanitario — Tramos, pendientes, velocidades y pozos de inspección. */
MODULOS.push({
  id:"alc_sanitario_IHS", titulo:"Alcantarillado sanitario", descripcion:"Tramos, pendientes, velocidades y pozos de inspección.",
  grupo:"externas", orden:8, icono:"alc_IHS", iconoSvg:"<path d=\"M3 7h18M3 7v10h18V7\"/><path d=\"M7 17v3M17 17v3M8 12h8\"/>", valores:{}, proximamente:true});

/* Módulo 9 · Alcantarillado pluvial — Método racional, tiempos de concentración y colectores. */
MODULOS.push({
  id:"alc_pluvial_IHS", titulo:"Alcantarillado pluvial", descripcion:"Método racional, tiempos de concentración y colectores.",
  grupo:"externas", orden:9, icono:"lluv_IHS", iconoSvg:"<path d=\"M6 14a4 4 0 0 1 .5-8A5.5 5.5 0 0 1 17 7a3.5 3.5 0 0 1 1 7z\"/><path d=\"M8 18l-1 2M12 18l-1 2M16 18l-1 2\"/>", valores:{}, proximamente:true});
