/* ==========================================================
   STAP — Sistemas de tratamiento de agua potable (PTAP)
   MÓDULOS PRÓXIMAMENTE (marcadores). Se muestran en el menú y en el Inicio de STAP
   con la etiqueta "PRÓXIMAMENTE", sin cálculo.
   Para convertir uno en módulo real: copia js/modulos/plantilla/ en
   js/modulos/stap/<nombre_modulo>/, usa el sufijo _STAP en su id y en sus
   variables, agrega sus <script> en index.html y borra aquí su entrada.
   ========================================================== */

/* Módulo 1 · Datos preliminares — Tablas base del RAS: dotaciones, niveles de complejidad y coeficientes. */
MODULOS.push({
  id:"datos_preliminares_STAP", titulo:"Datos preliminares", descripcion:"Tablas base del RAS: dotaciones, niveles de complejidad y coeficientes.",
  grupo:"proyecto", orden:1, icono:"db_STAP", iconoSvg:"<ellipse cx=\"12\" cy=\"5.5\" rx=\"7\" ry=\"3\"/><path d=\"M5 5.5v6c0 1.66 3.13 3 7 3s7-1.34 7-3v-6M5 11.5v6c0 1.66 3.13 3 7 3s7-1.34 7-3v-6\"/>", valores:{}, proximamente:true});

/* Módulo 2 · Proyección poblacional — Métodos lineal, geométrico y exponencial a partir de censos DANE. */
MODULOS.push({
  id:"proyeccion_poblacional_STAP", titulo:"Proyección poblacional", descripcion:"Métodos lineal, geométrico y exponencial a partir de censos DANE.",
  grupo:"proyecto", orden:2, icono:"proy_STAP", iconoSvg:"<path d=\"M3 17l6-6 4 4 8-8\"/><path d=\"M15 7h6v6\"/>", valores:{}, proximamente:true});

/* Módulo 3 · Caudal de diseño — Caudal medio diario, máximo diario y máximo horario. */
MODULOS.push({
  id:"caudal_STAP", titulo:"Caudal de diseño", descripcion:"Caudal medio diario, máximo diario y máximo horario.",
  grupo:"proyecto", orden:3, icono:"q_STAP", iconoSvg:"<path d=\"M12 3s6 6.2 6 10.5A6 6 0 0 1 6 13.5C6 9.2 12 3 12 3z\"/><path d=\"M9.5 14a2.6 2.6 0 0 0 2.5 2.5\"/>", valores:{}, proximamente:true});

/* Módulo 4 · Mezcla rápida — Canaleta Parshall o resalto hidráulico para la dosificación del coagulante. */
MODULOS.push({
  id:"mezcla_rapida_STAP", titulo:"Mezcla rápida", descripcion:"Canaleta Parshall o resalto hidráulico para la dosificación del coagulante.",
  grupo:"tratamiento", orden:4, icono:"par_STAP", iconoSvg:"<path d=\"M3 6h5l2 6h4l2-6h5\"/><path d=\"M3 18h18\"/>", valores:{}, proximamente:true});

/* Módulo 5 · Floculador — Floculador hidráulico de flujo horizontal o vertical. */
MODULOS.push({
  id:"floculador_STAP", titulo:"Floculador", descripcion:"Floculador hidráulico de flujo horizontal o vertical.",
  grupo:"tratamiento", orden:5, icono:"flo_STAP", iconoSvg:"<path d=\"M12 12c0-3 2-5 5-5\"/><path d=\"M12 12c0 3-2 5-5 5\"/><circle cx=\"12\" cy=\"12\" r=\"9\"/>", valores:{}, proximamente:true});

/* Módulo 6 · Sedimentador — Sedimentador convencional o de alta tasa. */
MODULOS.push({
  id:"sedimentador_STAP", titulo:"Sedimentador", descripcion:"Sedimentador convencional o de alta tasa.",
  grupo:"tratamiento", orden:6, icono:"sed_STAP", iconoSvg:"<path d=\"m12 3 9 5-9 5-9-5z\"/><path d=\"m3 13 9 5 9-5\"/>", valores:{}, proximamente:true});

/* Módulo 7 · Filtración — Filtros rápidos: lecho, lavado y pérdidas. */
MODULOS.push({
  id:"filtracion_STAP", titulo:"Filtración", descripcion:"Filtros rápidos: lecho, lavado y pérdidas.",
  grupo:"tratamiento", orden:7, icono:"fil_STAP", iconoSvg:"<rect x=\"5\" y=\"3\" width=\"14\" height=\"18\" rx=\"2\"/><path d=\"M5 9h14M5 13h14M8 17h.01M12 17h.01M16 17h.01\"/>", valores:{}, proximamente:true});

/* Módulo 8 · Desinfección — Tanque de contacto y dosificación de cloro. */
MODULOS.push({
  id:"desinfeccion_STAP", titulo:"Desinfección", descripcion:"Tanque de contacto y dosificación de cloro.",
  grupo:"tratamiento", orden:8, icono:"sol_STAP", iconoSvg:"<circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4\"/>", valores:{}, proximamente:true});

/* Módulo 9 · Almacenamiento — Volumen del tanque de compensación. */
MODULOS.push({
  id:"almacenamiento_STAP", titulo:"Almacenamiento", descripcion:"Volumen del tanque de compensación.",
  grupo:"tratamiento", orden:9, icono:"tan_STAP", iconoSvg:"<path d=\"M5 6c0-1.7 3.1-3 7-3s7 1.3 7 3v12c0 1.7-3.1 3-7 3s-7-1.3-7-3z\"/><path d=\"M5 6c0 1.7 3.1 3 7 3s7-1.3 7-3M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3\"/>", valores:{}, proximamente:true});
