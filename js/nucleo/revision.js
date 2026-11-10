/* ==========================================================
   4. REVISIÓN DE ERRORES (COMPARTIDO)
   VENTANA MODAL DE REVISIÓN DE ERRORES, TARJETAS DE ADVERTENCIA Y FUNCIONES PARA MOSTRAR ERRORES EN CADA MÓDULO.
   ========================================================== */

function tarjetaErrores(titulo,errores){
  /* Los errores ya no se muestran como tarjeta en la hoja: solo por advertencias y Revisión de errores. */
  return '';}

/* ==========================================================
   4.1 AVISOS BREVES (TOAST)
   ========================================================== */
/* ---------- Avisos breves: guardado y recálculo ---------- */
var _uiInt=false,_tG=null;
['pointerdown','keydown'].forEach(function(ev){document.addEventListener(ev,function(){_uiInt=true;},true);});
function uiToast(txt,tipo){
  var t=gid('ui-toast');if(!t)return;
  t.innerHTML=ico(tipo||'ok')+'<span></span>';t.lastChild.textContent=txt;
  t.classList.add('show');clearTimeout(t._h);
  t._h=setTimeout(function(){t.classList.remove('show');},1900);}

function uiGuardado(){
  if(!_uiInt)return;
  clearTimeout(_tG);
  _tG=setTimeout(function(){if(Date.now()<(window._uiQuieto||0))return;uiToast('Cambios guardados');},350);}
document.addEventListener('click',function(ev){
  var b=ev.target.closest&&ev.target.closest('button');if(!b)return;
  var oc=b.getAttribute('onclick')||'';
  if(!/recalcular/i.test(oc))return;
  requestAnimationFrame(function(){
    document.querySelectorAll('.vista.on .res-table,.vista.on .resultados-row,.vista.on .svg-wrap').forEach(function(e){
      e.classList.remove('flash-calc');void e.offsetWidth;e.classList.add('flash-calc');});
    uiToast('Cálculo actualizado');});});

/* ==========================================================
   4.2 VENTANAS INFORMATIVAS Y DE CONFIRMACIÓN
   mostrarModal / mostrarError / confirmarModal / cerrarModal
   ========================================================== */
/* ---------- Ventanas informativas (mostrarModal / mostrarError) ---------- */
var _modalOk=null,_modalFoco=null;
function uiAbrirModal(titulo,mensaje,variante,confirma,txtOk,peligro){
  var box=gid('modal-box');
  box.className='modal-box '+variante+(confirma?' confirma':'');
  gid('modal-ico').innerHTML=ico(variante==='err'?'err':variante==='adv'?'adv':variante==='info'?'info':'ok');
  gid('modal-title').textContent=titulo;
  gid('modal-msg').textContent=mensaje;
  var ok=gid('modal-ok');ok.textContent=txtOk||'Aceptar';ok.classList.toggle('peligro',!!peligro);
  var o=gid('overlay');o.classList.remove('closing');o.classList.add('show');
  _modalFoco=document.activeElement;
  setTimeout(function(){(confirma?box.querySelector('.btn-cancel'):ok).focus();},30);}

function mostrarModal(titulo,mensaje,esError){
  var v=esError===true?'err':(typeof esError==='string'?esError:'ok');
  _modalOk=null;uiAbrirModal(titulo,mensaje,v,false);}

function mostrarError(titulo,mensaje){ mostrarModal(titulo,mensaje,true); }
function confirmarModal(titulo,mensaje,onOk,txtOk,peligro){
  _modalOk=onOk;uiAbrirModal(titulo,mensaje,'adv',true,txtOk,peligro);}

function modalAceptar(){var f=_modalOk;_modalOk=null;cerrarModal();if(f)f();}
function cerrarModal(){
  _modalOk=null;
  var o=gid('overlay');if(!o.classList.contains('show'))return;
  var fin=function(){o.classList.remove('show','closing');
    if(_modalFoco&&_modalFoco.focus){try{_modalFoco.focus();}catch(e){}}_modalFoco=null;};
  if(uiReducido()){fin();return;}
  o.classList.add('closing');setTimeout(fin,160);}

/* ==========================================================
   4.3 VENTANAS DE REVISIÓN DE ERRORES Y ADVERTENCIA
   ========================================================== */
/* ---------- Ventanas de revisión y advertencia ---------- */
function uiRevision(clase,icono,titulo,sub,cuerpo){
  var h='<div class="revision-modal-backdrop" id="revisionBackdrop" onclick="if(event.target===this)cerrarRevision()">'+
    '<div class="revision-modal '+clase+'" role="dialog" aria-modal="true" aria-labelledby="rev-title">'+
    '<div class="rev-head"><span class="rev-ico">'+ico(icono)+'</span><div><h2 id="rev-title">'+titulo+'</h2><p>'+sub+'</p></div>'+
    '<button class="rev-x" onclick="cerrarRevision()" aria-label="Cerrar">'+ico('x')+'</button></div>'+
    '<div class="rev-body">'+cuerpo+'</div>'+
    '<div class="rev-foot"><button class="revision-close" onclick="cerrarRevision()">Cerrar</button></div></div></div>';
  var old=gid('revisionBackdrop');if(old)old.remove();
  document.body.insertAdjacentHTML('beforeend',h);
  var b=document.querySelector('#revisionBackdrop .revision-close');if(b)b.focus();}

  function cerrarRevision(){
  var el=gid('revisionBackdrop');if(!el)return;
  if(uiReducido()){el.remove();return;}
  el.removeAttribute('id');el.classList.add('closing');setTimeout(function(){el.remove();},160);}

document.addEventListener('keydown',function(e){
  if(e.key!=='Escape')return;
  if(gid('revisionBackdrop')){cerrarRevision();return;}
  var o=gid('overlay');if(o&&o.classList.contains('show')){cerrarModal();return;}
  if(document.body.classList.contains('sb-open'))sbCerrarMovil();});

/* Revisión de errores / advertencias (misma firma y mismos mensajes; solo cambia la presentación) */
function abrirRevision(titulo,errores){
  var c='';
  if(!errores.length)c='<div class="rev-ok">Sin incumplimientos detectados.</div>';
  else errores.forEach(function(e){c+='<div class="rev-item">'+e+'</div>';});
  uiRevision(errores.length?'':'ok',errores.length?'err':'ok','Revisión de errores — '+titulo,'Se muestran únicamente las comprobaciones de este submódulo. Las sugerencias no modifican los datos de entrada.',c);}

  function abrirAdvertencia(titulo,items){
  var c='';items.forEach(function(e){c+='<div class="rev-item">'+e+'</div>';});
  uiRevision('adv','adv',titulo,'Estos valores no cumplen un rango o requisito. El cálculo se hizo con los datos ingresados; ajusta lo necesario y vuelve a recalcular.',c);}






/* ==========================================================
   5. MEMORIA DE CÁLCULO (COMPARTIDO)
   ========================================================== */

var MEMO=0;

