/* ==========================================================
   NÚCLEO — autocalculo.js
   Recalcula solo cuando el usuario termina de editar un campo (evento "change":
   al pasar a otro campo, Tab o Enter). Ya no hace falta el botón RECALCULAR.

   Cada módulo declara en su MODULOS.push({...}):
     recalcular:function()   la función que redibuja/recalcula el módulo
     errores:function()      (opcional) lista de DATOS INGRESADOS que están mal o fuera de los valores
                             establecidos. Vacía = los datos ingresados están bien.

   Botones (se ajustan solos, sin tocar el HTML de cada módulo):
     - RECALCULAR ................ siempre oculto
     - Datos ingresados con error:  solo REVISIÓN DE ERRORES (muestra esos datos); la memoria de cálculo
                                    y sus botones (VER TODA / CONTRAER TODO) se bloquean.
     - Datos ingresados correctos:  se muestra todo (memoria, VER TODA, CONTRAER TODO y REVISIÓN DE ERRORES).
                                    Que un resultado calculado salga del rango NO bloquea nada: eso se ve
                                    en REVISIÓN DE ERRORES y en las alertas de la memoria.
   ========================================================== */
var _tAuto=null,_ptrAbajo=false;
document.addEventListener('pointerdown',function(){_ptrAbajo=true;},true);
document.addEventListener('pointerup',function(){_ptrAbajo=false;},true);
document.addEventListener('pointercancel',function(){_ptrAbajo=false;},true);

/* Se llama desde los campos. Espera a que el clic termine para no perder el botón que el usuario presionó. */
function autoRecalcular(){
  clearTimeout(_tAuto);
  _tAuto=setTimeout(function esperar(){
    if(_ptrAbajo){_tAuto=setTimeout(esperar,60);return;}
    autoEjecutar();},0);}

function autoEjecutar(){
  var id=window._vistaActual,m=modulo(id),pane=gid('pane-'+id);
  if(!m||!pane||typeof m.recalcular!=='function')return;
  /* recordar foco, filas de memoria abiertas y desplazamiento, porque el módulo se vuelve a dibujar */
  var antes=[].slice.call(pane.querySelectorAll('input,select,textarea'));
  var iFoco=antes.indexOf(document.activeElement);
  var abiertas=[].map.call(pane.querySelectorAll('.memo'),function(e){return e.classList.contains('open');});
  var yPane=pane.scrollTop,yWin=window.scrollY;
  m.recalcular();
  var memos=pane.querySelectorAll('.memo');
  if(memos.length===abiertas.length)abiertas.forEach(function(a,i){if(a)memos[i].classList.add('open');});
  var ahora=pane.querySelectorAll('input,select,textarea');
  if(iFoco>=0&&ahora.length===antes.length&&!gid('revisionBackdrop'))ahora[iFoco].focus();
  pane.scrollTop=yPane;window.scrollTo(0,yWin);
  autoBotones(id);}

/* Muestra u oculta botones y memoria según los datos ingresados. También se llama al abrir un módulo. */
function autoBotones(id){
  var m=modulo(id),pane=gid('pane-'+id);
  if(!m||!pane||typeof m.recalcular!=='function')return;
  var err=[];
  if(typeof m.errores==='function'){try{err=m.errores()||[];}catch(_){err=[];}}
  var bloqueado=err.length>0;
  [].forEach.call(pane.querySelectorAll('button'),function(b){
    var oc=b.getAttribute('onclick')||'';
    if(/recalcular/i.test(oc)){b.style.display='none';}
    else if(b.classList.contains('btn-revision')){
      if(!b._orig)b._orig=b.onclick;
      b.style.display='';
      b.onclick=bloqueado?function(){abrirRevision(m.tituloMenu||m.titulo,err);}:b._orig;}
    else if(/abrirTodo/.test(oc)){b.style.display=bloqueado?'none':'';}});
  [].forEach.call(pane.querySelectorAll('.res-table'),function(t){
    var c=t.closest('.card')||t;c.style.display=bloqueado?'none':'';});}
