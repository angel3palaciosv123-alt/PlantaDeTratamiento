/* ==========================================================
   NÚCLEO — campos.js
   Componentes de formulario y tablas compartidos por todos los módulos.
   ========================================================== */

function setPro(k,el,num){PRO[k]= num? (el.value===""?"":Number(el.value)) : el.value; guardarPro(); actualizarEstados();}

var CONV='<div class="conv"><span><i class="dot d-bus"></i>Dato insertado</span><span><i class="dot d-cal"></i>Dato calculado</span></div>';

function validarCampoRango(k){autoRecalcular();}

function campo(lbl,k,tipo,extra){
  var v=PRO[k]===""||PRO[k]===null||PRO[k]===undefined?"":PRO[k];
  return '<div class="campo"><label>'+lbl+'</label><input type="'+(tipo||"number")+'" placeholder="Ingrese un valor" value="'+v+'" oninput="setPro(\''+k+'\',this,'+(tipo==="text"?"false":"true")+')" onchange="autoRecalcular()" onkeydown="if(event.key===\'Enter\'){event.preventDefault();validarCampoRango(\''+k+'\')}" '+(extra||"")+'></div>';}

function campoPct(lbl,k,extra){
  var v=PRO[k]===""||PRO[k]===null||PRO[k]===undefined?"":rnd(PRO[k]*100,3);
  return '<div class="campo"><label>'+lbl+' (%)</label><input type="number" placeholder="-" value="'+v+'" oninput="setProPct(\''+k+'\',this)" onchange="autoRecalcular()" '+(extra||"")+'></div>';}

function setProPct(k,el){PRO[k]= el.value===""?"":Number(el.value)/100; guardarPro(); actualizarEstados();}

function selec(lbl,k,ops){
  return '<div class="campo"><label>'+lbl+'</label><select onchange="setPro(\''+k+'\',this,false);autoRecalcular()">'+
    ops.map(function(o){return '<option value="'+o+'"'+(PRO[k]===o?' selected':'')+'>'+o+'</option>';}).join('')+'</select></div>';}

/* ---------- Tablas HTML genéricas ---------- */
function tablaHTML(titulo,encabezados,filas,extra=""){
  return `<div class="card"><div class="card-title">${titulo}</div><table class="ref-table"><tr>${encabezados.map(x=>`<th>${x}</th>`).join("")}</tr>${filas.map(f=>`<tr>${f.map(v=>`<td>${v}</td>`).join("")}</tr>`).join("")}</table>${extra}</div>`;}

function nota(txt){return `<div class="card-sub" style="padding-top:10px">${txt}</div>`;}
