/* ==========================================================
   NÚCLEO — proyectos.js
   Pantalla principal de proyectos (los 4 tipos), riel lateral para cambiar de
   tipo y carga del proyecto guardado de cada tipo.
   Los datos de cada tipo vienen de TIPOS (configuracion.js) y de los módulos
   registrados en MODULOS; aquí no hay datos de ningún módulo en particular.
   ========================================================== */

/* ---------- Consultas ---------- */
function tipoProyecto(id){for(var i=0;i<TIPOS.length;i++)if(TIPOS[i].id===id)return TIPOS[i];return null;}
function tipoActivo(){return tipoProyecto(TIPO_ACTIVO);}
function ss(k,v){try{if(v===undefined)return sessionStorage.getItem(k);if(v===null)sessionStorage.removeItem(k);else sessionStorage.setItem(k,v);}catch(e){}return null;}

/* Deja PRO solo con los datos del tipo indicado: valores por defecto de sus módulos + lo guardado en el navegador. */
function cargarProTipo(id){
  Object.keys(PRO).forEach(function(k){delete PRO[k];});
  var T=tipoProyecto(id);
  CLAVE_ALMACEN=T?T.clave:CLAVE_ALMACEN;
  inicializarPRO(id);
  cargarProLocal();}

/* Avance de un tipo (módulos con indicador ● completos). Carga temporalmente sus datos guardados. */
function avanceTipo(id){
  var seg=modulosOrdenados(id).filter(function(m){return m.indicador;});
  var listos=0;
  if(seg.length){
    cargarProTipo(id);
    seg.forEach(function(m){try{if(m.completo(PRO))listos++;}catch(e){}});}
  return {listos:listos,total:seg.length};}

/* ==========================================================
   PANTALLA PRINCIPAL DE PROYECTOS
   ========================================================== */
function mostrarProyectos(){
  if(TIPO_ACTIVO&&typeof guardarPro==="function")guardarPro();
  TIPO_ACTIVO=null;ss(CLAVE_TIPO,null);
  document.body.classList.add("modo-hub");
  if(typeof sbCerrarMovil==="function")sbCerrarMovil();
  var usr=String((SES&&SES.u)||"").trim(),ult=ss(CLAVE_ULTIMO);
  gid("hub-saludo").textContent="Bienvenido"+(usr?", "+usr:"")+" 👋";
  var nom=gid("hub-nom");if(nom&&SES)nom.textContent=String(SES.u).toUpperCase()+" · "+SES.rol;
  var av=gid("hub-av");if(av&&SES)av.textContent=(String(SES.u).slice(0,2).toUpperCase())||"?";
  var disp=MODULOS.filter(function(m){return !m.proximamente&&tipoDeModulo(m);}).length;
  var cons=MODULOS.filter(function(m){return m.proximamente&&tipoDeModulo(m);}).length;
  gid("hub-resumen").innerHTML=
    hubKpi("modulos","Tipos de proyecto",TIPOS.length,"disponibles")+
    hubKpi("capas","Módulos disponibles",disp,"módulos")+
    hubKpi("pend","En construcción",cons,"módulos");
  var h="";
  TIPOS.forEach(function(T){
    var ms=modulosOrdenados(T.id),av=avanceTipo(T.id);
    var total=av.total||ms.length,pct=total?Math.round(av.listos*100/total):0;
    var chips=ms.slice(0,4).map(function(m){return '<span>'+(m.tituloMenu||m.titulo)+'</span>';}).join("")+(ms.length>4?'<span class="mas">+'+(ms.length-4)+' más</span>':'');
    h+='<button type="button" class="tipo-card" onclick="abrirTipo(\''+T.id+'\')">'+
      (ult===T.id?'<span class="tc-ult"><i></i>Último abierto</span>':'')+
      '<div class="tc-head"><div class="tc-ico">'+ico(T.icono)+'</div><div class="tc-tt"><span class="tc-sig">'+T.sigla+'</span><h3>'+T.titulo+'</h3></div></div>'+
      '<p class="tc-desc">'+T.desc+'</p>'+
      '<div class="tc-chips">'+chips+'</div>'+
      '<div class="tc-foot"><div class="tc-prog"><div class="l"><span>'+av.listos+' de '+total+' módulos</span>'+
        '<span class="badge-est">'+T.estado+'</span></div>'+
        '<div class="bar"><i style="--w:'+pct+'%"></i></div></div>'+
        '<span class="tc-go">Entrar'+ico("flecha")+'</span></div>'+
      '</button>';});
  gid("tipo-grid").innerHTML=h;
  Object.keys(PRO).forEach(function(k){delete PRO[k];});
  window.scrollTo(0,0);}

function hubKpi(ic,tit,val,uni){
  return '<div class="kpi"><div class="k-top"><span class="k-ic">'+ico(ic)+'</span>'+tit+'</div><div class="k-val">'+val+'<small>'+uni+'</small></div></div>';}

/* ==========================================================
   ABRIR UN TIPO DE PROYECTO
   ========================================================== */
function abrirTipo(id){
  var T=tipoProyecto(id);if(!T)return;
  if(TIPO_ACTIVO&&typeof guardarPro==="function")guardarPro();
  TIPO_ACTIVO=id;ss(CLAVE_TIPO,id);ss(CLAVE_ULTIMO,id);
  cargarProTipo(id);
  normalizarPro();
  document.body.classList.remove("modo-hub");
  pintarRiel();
  construirMenu();
  actualizarEstados();
  irVista("inicio");}

/* ---------- Riel lateral (tipos de proyecto) y encabezado del menú ---------- */
function pintarRiel(){
  var T=tipoActivo();if(!T)return;
  gid("rail-tipos").innerHTML=TIPOS.map(function(x){
    return '<button class="rail-btn'+(x.id===T.id?' on':'')+'" data-tip="'+x.corto+'" aria-label="'+x.corto+'" onclick="abrirTipo(\''+x.id+'\')">'+ico(x.icono)+'</button>';}).join("");
  gid("sb-marca").innerHTML='<div class="sb-tipo-ico">'+ico(T.icono)+'</div><div class="sb-brand"><strong>'+T.corto+'</strong><span>'+T.sub+'</span></div>';}

/* Se llama al iniciar sesión o al recargar la página con sesión abierta. */
function iniciarProyectos(){
  var t=ss(CLAVE_TIPO);
  if(t&&tipoProyecto(t))abrirTipo(t);else mostrarProyectos();}
