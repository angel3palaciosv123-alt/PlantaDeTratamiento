/* ==========================================================
   NÚCLEO — navegacion.js
   Menú lateral, vistas, navegación, indicadores de estado y pantalla de Inicio.
   Todo se genera a partir del registro de módulos (MODULOS); aquí no hay
   condiciones ni datos de ningún módulo en particular.
   ========================================================== */

/* ---------- Generación dinámica del menú y de las vistas ---------- */
function construirMenu(){
  var nav=document.querySelector('.sb-scroll');if(!nav)return;
  var h='';
  GRUPOS.forEach(function(g){
    var ms=modulosOrdenados().filter(function(m){return m.grupo===g.id;});
    if(!ms.length)return;
    h+='<div class="sb-sec">'+g.menu+'</div>';
    ms.forEach(function(m){
      var t=m.tituloMenu||m.titulo;
      h+='<button class="tab-btn" id="tab-'+m.id+'" data-t="'+t+'" title="'+t+'" onclick="irVista(\''+m.id+'\')">'+
         '<span class="ic" data-ic="'+(m.icono||'')+'"></span><span class="lb">'+t+'</span>'+
         (m.indicador?'<span class="st" id="st-'+m.id+'">○</span>':'')+'</button>';});});
  nav.insertAdjacentHTML('beforeend',h);}

function construirVistas(){
  var ref=gid('overlay');
  var mk=function(id,interior){
    var d=document.createElement('div');d.className='vista';d.id='v-'+id;d.innerHTML=interior;
    ref.parentNode.insertBefore(d,ref);};
  mk('inicio','<div class="pane" id="pane-inicio"></div>');
  modulosOrdenados().forEach(function(m){
    mk(m.id,typeof m.vista==='function'?m.vista():'<div class="pane" id="pane-'+m.id+'"></div>');});}

/* ---------- Navegación ---------- */
function irVista(v){
  normalizarPro();
  var ids=['inicio'].concat(modulosOrdenados().map(function(m){return m.id;}));
  ids.forEach(function(x){
    gid("v-"+x).classList.toggle("on",x===v);
    gid("tab-"+x).classList.toggle("active",x===v);});
  if(v==="inicio") pintarInicio();
  else{
    var m=modulo(v);
    if(m){
      if(m.proximamente) pintarProximamente(m);
      else if(typeof m.pintar==="function") m.pintar();}}
  navPostVista(v);}

function actualizarEstados(){
  MODULOS.forEach(function(m){
    if(!m.indicador)return;
    var e=gid("st-"+m.id);
    if(e)e.textContent=moduloListo(m.id)?"●":"○";});
  navMarcarEstados();}

/* ---------- Barra lateral ---------- */
function sbIniciar(){
  document.querySelectorAll('[data-ic]').forEach(function(e){e.innerHTML=ico(e.getAttribute('data-ic'));});
  document.querySelectorAll('[data-logo]').forEach(function(e){e.innerHTML=LOGO;});
  if(window.innerWidth>900&&window.innerWidth<1100)document.body.classList.add('sb-collapsed');
  sbSincronizar();}

function sbSincronizar(){
  var c=document.body.classList.contains('sb-collapsed'),b=gid('sb-collapse');
  if(!b)return;
  b.setAttribute('aria-expanded',String(!c));
  b.setAttribute('aria-label',c?'Expandir menú':'Contraer menú');
  b.title=c?'Expandir menú':'Contraer menú';}

function sbAlternar(){document.body.classList.toggle('sb-collapsed');sbSincronizar();}
function sbAbrirMovil(){document.body.classList.add('sb-open');var b=gid('sb-burger');if(b)b.setAttribute('aria-expanded','true');}
function sbCerrarMovil(){document.body.classList.remove('sb-open');var b=gid('sb-burger');if(b)b.setAttribute('aria-expanded','false');}
function sbPintarUsuario(){
  if(typeof SES==='undefined'||!SES)return;
  var av=gid('sb-av'),s=gid('sb-ses');
  if(av)av.textContent=(String(SES.u||'').slice(0,2).toUpperCase())||'?';
  if(s)s.textContent=SES.edita?'Sesión activa · Edición':'Sesión activa · Solo lectura';
  var vi=gid('v-inicio');if(vi&&vi.classList.contains('on'))pintarInicio();}

function navMarcarEstados(){
  document.querySelectorAll('.sb .st').forEach(function(s){
    var ok=s.textContent==='●';
    s.classList.toggle('ok',ok);
    s.title=ok?'Calculado':'Pendiente';
  });}

function navPostVista(v){
  var act=document.querySelector('.sb .tab-btn.active');
  document.querySelectorAll('.sb .tab-btn').forEach(function(b){
    if(b===act)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
  var cambio=window._vistaActual!==v;window._vistaActual=v;
  window._uiQuieto=Date.now()+800;
  var vv=gid('v-'+v);
  if(vv&&cambio){
    vv.classList.add('entering');clearTimeout(vv._t);
    vv._t=setTimeout(function(){vv.classList.remove('entering');},900);
    var sc=vv.querySelector('.pane,.content-full');if(sc)sc.scrollTop=0;
  }
  sbCerrarMovil();
  if(act&&act.scrollIntoView)act.scrollIntoView({block:'nearest'});
  var mt=gid('m-title');if(mt)mt.textContent=act?(act.getAttribute('data-t')||''):'';
  if(typeof autoBotones==='function')autoBotones(v);}

/* ==========================================================
   DASHBOARD DE INICIO
   ========================================================== */
function pintarInicio(){
  var usr=String((SES&&SES.u)||PRO.diseñador||'').trim();
  var SEG=modulosOrdenados().filter(function(m){return m.indicador;});
  var listos=SEG.filter(function(m){return moduloListo(m.id);}).length;
  var pct=Math.round(listos*100/SEG.length);
  var h='<div class="dash">';
  h+='<section class="dash-hero"><div class="hero-logo">'+LOGO+'</div><div><h1>TREPALACE</h1>'+
     '<div class="sub">SOLUCIONES AMBIENTALES PARA TUS PROYECTOS<br>BASADAS EN TUS NECESIDADES</div>'+
     '<p>Bienvenido'+(usr?' '+esc(usr):'')+' a la plataforma de diseño de plantas de tratamiento de agua residual. Aquí podrás diseñartodas las unidades que hacen parte de un Sistema de Tratamiento de Agua Residual.</p>'+
     '<div class="hero-acts">'+
     '<button class="hero-btn pri" onclick="guardarProyectoJSON()">'+ico('bajar')+'Guardar mi proyecto</button>'+
     '<button class="hero-btn" onclick="abrirCargarProyecto()">'+ico('subir')+'Cargar proyecto (.json)</button>'+
     '</div></div><div class="hero-foto" aria-hidden="true"></div></section>';
  h+='<div class="kpis">'+
   '<div class="kpi"><div class="k-top"><span class="k-ic">'+ico('modulos')+'</span>Avance del diseño</div><div class="k-val">'+listos+'<small>de '+SEG.length+' módulos</small></div>'+
     '<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+pct+'"><i style="--w:'+pct+'%"></i></div><div class="k-hint">'+pct+' % completo.</div></div>'+
   '<div class="kpi"><div class="k-top"><span class="k-ic">'+ico('pend')+'</span>Módulos pendientes</div><div class="k-val">'+(SEG.length-listos)+'<small>módulos</small></div></div>'+
   '</div>';
  GRUPOS.forEach(function(gr){
    var ms=modulosOrdenados().filter(function(m){return m.grupo===gr.id;});
    if(!ms.length)return;
    var g='<div class="dash-h"><h2>'+gr.inicio+'</h2></div><div class="mod-grid mg2">';
    ms.forEach(function(m){
      var soon=!!m.proximamente,ok=!soon&&moduloListo(m.id);
      g+='<button type="button" class="mod-card" onclick="irVista(\''+m.id+'\')"><div class="ico">'+ico(m.icono)+'</div><div class="t">'+m.titulo+'</div><div class="d">'+(m.descripcion||'')+'</div>'+
         '<div class="foot"><span class="badge2 '+(soon?'soon':ok?'ok':'no')+'">'+(soon?'PRÓXIMAMENTE':ok?'COMPLETO':'PENDIENTE')+'</span>'+ico('flecha','go')+'</div></button>';});
    h+=g+'</div>';});
  h+='</div>';
  gid('pane-inicio').innerHTML=h;}

/* ==========================================================
   MÓDULOS FUTUROS (genérico, para módulos con proximamente:true)
   ========================================================== */
function pintarProximamente(m){
  var h='<div class="proximamente"><div class="ico">'+ico(m.icono)+'</div><h2>'+(m.tituloMenu||m.titulo||"Módulo")+'</h2>'+
   '<p style="color:var(--gris);font-size:13px;line-height:1.6">Este módulo está en construcción y se habilitará en una próxima entrega, continuando la secuencia de diseño de la PTAR a partir del caudal y la rejilla ya calculados.</p></div>';
  gid("pane-"+m.id).innerHTML=h;}

/* ==========================================================
   BOTÓN IMPRIMIR en la línea del título de los módulos con imprimible:true
   ========================================================== */
function activarImpresion(){
  var BTN='<div class="print-top"><button type="button" class="btn-sec" onclick="window.print()">🖨️ IMPRIMIR</button></div>';
  function poner(el){
    var t=el.querySelector('.titulo');
    if(!t||t.querySelector('.print-top'))return;
    t.classList.add('con-imp');
    t.insertAdjacentHTML('beforeend',BTN);}
  MODULOS.forEach(function(m){
    if(!m.imprimible)return;
    var el=document.getElementById('pane-'+m.id);if(!el)return;
    new MutationObserver(function(){poner(el);}).observe(el,{childList:true});
    poner(el);});}
