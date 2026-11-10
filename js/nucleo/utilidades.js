/* ==========================================================
   NÚCLEO — utilidades.js
   Funciones generales: formato de números, redondeo, escape y ayudas de normalización.
   ========================================================== */
function nf(v,d){if(v===null||v===undefined||isNaN(v))return "—";return Number(v).toLocaleString('es-CO',{minimumFractionDigits:d,maximumFractionDigits:d});}

function rnd(v,d){var f=Math.pow(10,d);return Math.round(v*f)/f;}

function gid(i){return document.getElementById(i);}

function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;");}

/* ---------- Ayudas de normalización (las usan los módulos en su propiedad "normalizar") ---------- */
function esVacio(v){return v===""||v==="-"||v===null||v===undefined;}

function esPos(v){return v!==""&&v!==null&&v!==undefined&&!isNaN(Number(v))&&Number(v)>0;}

/* Si PRO[k] no está entre las opciones, lo reemplaza por def (si es válida) o por la primera opción. */
function normFix(k,ops,def){
  if(ops.indexOf(PRO[k])<0) PRO[k]=(def!==undefined&&ops.indexOf(def)>=0)?def:ops[0];}
