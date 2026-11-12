/* ==========================================================
   RS — Diseño de relleno sanitario
   MÓDULOS PRÓXIMAMENTE (marcadores). Se muestran en el menú y en el Inicio de RS
   con la etiqueta "PRÓXIMAMENTE", sin cálculo.
   Para convertir uno en módulo real: copia js/modulos/plantilla/ en
   js/modulos/rs/<nombre_modulo>/, usa el sufijo _RS en su id y en sus
   variables, agrega sus <script> en index.html y borra aquí su entrada.
   ========================================================== */

/* Módulo 1 · Datos preliminares — Localización, nivel de complejidad y horizonte de diseño. */
MODULOS.push({
  id:"datos_preliminares_RS", titulo:"Datos preliminares", descripcion:"Localización, nivel de complejidad y horizonte de diseño.",
  grupo:"proyecto", orden:1, icono:"db_RS", iconoSvg:"<ellipse cx=\"12\" cy=\"5.5\" rx=\"7\" ry=\"3\"/><path d=\"M5 5.5v6c0 1.66 3.13 3 7 3s7-1.34 7-3v-6M5 11.5v6c0 1.66 3.13 3 7 3s7-1.34 7-3v-6\"/>", valores:{}, proximamente:true});

/* Módulo 2 · Proyección poblacional — Población servida durante la vida útil del relleno. */
MODULOS.push({
  id:"proyeccion_poblacional_RS", titulo:"Proyección poblacional", descripcion:"Población servida durante la vida útil del relleno.",
  grupo:"proyecto", orden:2, icono:"proy_RS", iconoSvg:"<path d=\"M3 17l6-6 4 4 8-8\"/><path d=\"M15 7h6v6\"/>", valores:{}, proximamente:true});

/* Módulo 3 · Generación de residuos — Producción per cápita y cantidad de residuos por año. */
MODULOS.push({
  id:"generacion_RS", titulo:"Generación de residuos", descripcion:"Producción per cápita y cantidad de residuos por año.",
  grupo:"proyecto", orden:3, icono:"res_RS", iconoSvg:"<path d=\"M5 7h14l-1.5 13h-11z\"/><path d=\"M9 7V4h6v3M10 11v5M14 11v5\"/>", valores:{}, proximamente:true});

/* Módulo 4 · Volumen y área — Volumen de residuos compactados, material de cobertura y área requerida. */
MODULOS.push({
  id:"volumen_area_RS", titulo:"Volumen y área", descripcion:"Volumen de residuos compactados, material de cobertura y área requerida.",
  grupo:"relleno", orden:4, icono:"vol_RS", iconoSvg:"<path d=\"M12 3 3 8v8l9 5 9-5V8z\"/><path d=\"M3 8l9 5 9-5M12 13v8\"/>", valores:{}, proximamente:true});

/* Módulo 5 · Celda diaria — Dimensiones de la celda y frente de trabajo. */
MODULOS.push({
  id:"celda_diaria_RS", titulo:"Celda diaria", descripcion:"Dimensiones de la celda y frente de trabajo.",
  grupo:"relleno", orden:5, icono:"cel_RS", iconoSvg:"<rect x=\"3\" y=\"10\" width=\"18\" height=\"10\" rx=\"1\"/><path d=\"M3 15h18M9 10v10M15 10v10M6 10l3-5h6l3 5\"/>", valores:{}, proximamente:true});

/* Módulo 6 · Lixiviados — Balance hídrico, drenaje y tratamiento de lixiviados. */
MODULOS.push({
  id:"lixiviados_RS", titulo:"Lixiviados", descripcion:"Balance hídrico, drenaje y tratamiento de lixiviados.",
  grupo:"relleno", orden:6, icono:"lix_RS", iconoSvg:"<path d=\"M12 3s5 5.5 5 9a5 5 0 0 1-10 0c0-3.5 5-9 5-9z\"/><path d=\"M4 21h16\"/>", valores:{}, proximamente:true});

/* Módulo 7 · Gases — Generación de biogás y chimeneas de evacuación. */
MODULOS.push({
  id:"gases_RS", titulo:"Gases", descripcion:"Generación de biogás y chimeneas de evacuación.",
  grupo:"relleno", orden:7, icono:"gas_RS", iconoSvg:"<path d=\"M8 20c-2-2-2-5 0-7s2-5 0-7M14 20c-2-2-2-5 0-7s2-5 0-7M20 20c-2-2-2-5 0-7\"/>", valores:{}, proximamente:true});

/* Módulo 8 · Vida útil — Capacidad del sitio y cronograma de llenado. */
MODULOS.push({
  id:"vida_util_RS", titulo:"Vida útil", descripcion:"Capacidad del sitio y cronograma de llenado.",
  grupo:"relleno", orden:8, icono:"vida_RS", iconoSvg:"<rect x=\"4\" y=\"5\" width=\"16\" height=\"16\" rx=\"2\"/><path d=\"M4 10h16M9 3v4M15 3v4M8 14h3v3H8z\"/>", valores:{}, proximamente:true});
