/* ==========================================================
   NÚCLEO — navegacion.js
   Menú lateral, vistas, navegación, indicadores de estado y pantalla de Inicio
   de cada tipo de proyecto. Todo se genera a partir del registro de módulos
   (MODULOS) y de TIPOS (configuracion.js); aquí no hay condiciones ni datos de
   ningún módulo en particular. El menú muestra solo los módulos del tipo abierto.
   ========================================================== */

/* ---------- Generación dinámica del menú y de las vistas ---------- */
function construirMenu(){
  var nav=document.querySelector('.sb-scroll');if(!nav)return;
  var h='<button class="tab-btn" id="tab-inicio" data-t="Inicio" title="Inicio" onclick="irVista(\'inicio\')"><span class="ic">'+ico('inicio')+'</span><span class="lb">Inicio</span></button>';
  GRUPOS.forEach(function(g){
    var ms=modulosOrdenados().filter(function(m){return m.grupo===g.id;});
    if(!ms.length)return;
    h+='<div class="sb-sec">'+g.menu+'</div>';
    ms.forEach(function(m){
      var t=m.tituloMenu||m.titulo;
      h+='<button class="tab-btn" id="tab-'+m.id+'" data-t="'+t+'" title="'+t+'" onclick="irVista(\''+m.id+'\')">'+
         '<span class="ic" data-ic="'+(m.icono||'')+'"></span><span class="lb">'+t+'</span>'+
         (m.indicador?'<span class="st" id="st-'+m.id+'">○</span>':'')+'</button>';});});
  nav.innerHTML=h;
  nav.querySelectorAll('[data-ic]').forEach(function(e){e.innerHTML=ico(e.getAttribute('data-ic'));});}

function construirVistas(){
  var ref=gid('overlay');
  var mk=function(id,interior){
    var d=document.createElement('div');d.className='vista';d.id='v-'+id;d.innerHTML=interior;
    ref.parentNode.insertBefore(d,ref);};
  mk('inicio','<div class="pane" id="pane-inicio"></div>');
  modulosTodos().forEach(function(m){
    mk(m.id,typeof m.vista==='function'?m.vista():'<div class="pane" id="pane-'+m.id+'"></div>');});}

/* ---------- Navegación ---------- */
function irVista(v){
  normalizarPro();
  document.querySelectorAll('.vista').forEach(function(e){e.classList.toggle("on",e.id==="v-"+v);});
  document.querySelectorAll('.sb .tab-btn').forEach(function(b){b.classList.toggle("active",b.id==="tab-"+v);});
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
  if(s)s.textContent=SES.edita?'Sesión activa':'Sesión activa · Solo lectura';
  var ra=gid('rail-av');if(ra){ra.textContent=(String(SES.u||'').slice(0,2).toUpperCase())||'?';ra.title=String(SES.u||'');}
  var vi=gid('v-inicio');if(TIPO_ACTIVO&&vi&&vi.classList.contains('on'))pintarInicio();}

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
  if(typeof autoBotones==='function')autoBotones(v);}

/* ==========================================================
   DASHBOARD DE INICIO
   ========================================================== */
function pintarInicio(){
  var usr=String((SES&&SES.u)||PRO.diseñador||'').trim();
  var T=tipoActivo();
  var SEG=modulosOrdenados().filter(function(m){return m.indicador;});
  var listos=SEG.filter(function(m){return moduloListo(m.id);}).length;
  /* Si el tipo aún no tiene módulos con cálculo, el avance se cuenta sobre todos sus módulos. */
  if(!SEG.length)SEG=modulosOrdenados();
  var pct=SEG.length?Math.round(listos*100/SEG.length):0;
  var enCons=modulosOrdenados().filter(function(m){return m.proximamente;}).length;
  var h='<div class="dash">';
  h+='<div class="migas"><button onclick="mostrarProyectos()">'+ico('atras')+'Todos los proyectos</button><span>/</span><span>'+(T?T.corto:'')+'</span></div>';
  h+='<section class="dash-hero"><div>'+
     (T?'<div class="hero-tipo">'+ico(T.icono)+T.sigla+'</div><h1>'+T.titulo+'</h1>':'<h1>TREPALACE</h1>')+
     '<p>Bienvenido'+(usr?' '+esc(usr):'')+'. Aquí podrás diseñar todas las unidades que hacen parte de este tipo de proyecto. El avance y el archivo .json se guardan por separado para cada tipo.</p>'+
     '<div class="hero-acts">'+
     '<button class="hero-btn pri" onclick="guardarProyectoJSON()">'+ico('bajar')+'Guardar mi proyecto</button>'+
     '<button class="hero-btn" onclick="abrirCargarProyecto()">'+ico('subir')+'Cargar proyecto (.json)</button>'+
     '</div></div><div class="hero-foto" aria-hidden="true"'+(T&&T.imagen?' style="background-image:url(\''+T.imagen+'\')"':'')+'></div></section>';
  h+='<div class="kpis">'+
   '<div class="kpi"><div class="k-top"><span class="k-ic">'+ico('modulos')+'</span>Avance del diseño</div><div class="k-val">'+listos+'<small>de '+SEG.length+' módulos</small></div>'+
     '<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+pct+'"><i style="--w:'+pct+'%"></i></div><div class="k-hint">'+pct+' % completo.</div></div>'+
   '<div class="kpi"><div class="k-top"><span class="k-ic">'+ico('pend')+'</span>Módulos pendientes</div><div class="k-val">'+(SEG.length-listos)+'<small>módulos</small></div>'+
     (enCons?'<div class="k-hint">'+enCons+' en construcción.</div>':'')+'</div>'+
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
   '<p style="color:var(--gris);font-size:13px;line-height:1.6">Este módulo está en construcción y se habilitará en una próxima entrega, '+(TIPO_ACTIVO==="STAR"?'continuando la secuencia de diseño de la PTAR a partir del caudal y la rejilla ya calculados.':'dentro de '+(tipoActivo()?tipoActivo().corto:'este proyecto')+'.')+'</p></div>';
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
