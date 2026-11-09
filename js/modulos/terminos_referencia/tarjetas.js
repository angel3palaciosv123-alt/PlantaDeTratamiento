/* ==========================================================
   MÓDULO TÉRMINOS DE REFERENCIA — tarjetas
   Tarjetas de parámetros del proyecto (identificación, población, caudal y cada unidad de diseño).
   Los valores guardados viven en PRO (cada módulo declara sus valores por defecto);
   aquí solo se recogen, se muestran y se validan contra los rangos de rangos.js.
   ========================================================== */
/* ---------- Enlaces con otros módulos mediante su API pública (sin acoplarse a su código) ---------- */
function trPoblaciones(){
  var f=moduloApi("proyeccion_poblacional").poblaciones;
  return typeof f==="function"?f():[];}

function trSelectorAnchoParshall(){
  var f=moduloApi("parshall").selectorAncho;
  return typeof f==="function"?f():"";}

/* ===============    1. TARJETA: IDENTIFICACIÓN DEL PROYECTO   ======================== */
function trCardIdentificacion(){
  var af=PRO.anioIni&&PRO.duracion?Number(PRO.anioIni)+Number(PRO.duracion):"";
  var h='<div class="card"><div class="card-title">Identificación del proyecto</div>'+
    '<div class="card-sub">La población proyectada se importa desde la ventana de proyección poblacional.</div>'+
    '<div class="row">'+campo("Diseñador","diseñador","text")+campo("Nombre de la población","nombrePob","text")+'</div>'+
    '<div class="row">'+campo("Duración del proyecto (años)","duracion")+campo("Año inicial del proyecto","anioIni")+
    '<div class="campo"><label>Año final del proyecto (calculado)</label><input value="'+af+'" placeholder="—" readonly></div></div></div>';
  return h;}

/* ===============  2. TARJETA: POBLACIONES DISPONIBLES Y POBLACIÓN DE DISEÑO   ======================== */


function tomarPob(valor,metodo){
  PRO.pobProy=valor;
  PRO.metodoPob=metodo;
  guardarPro();
  pintarTerminosReferencia();}

function trCardPoblacion(){
  var h='';
  var disp=trPoblaciones();
  if(disp.length){
    h+='<div class="card"><div class="card-title">Población de diseño</div>'+
       '<div class="card-sub">Resultados disponibles en el módulo de proyección para el año '+disp[0].anio+'.</div><div class="row">';
    disp.forEach(function(d){
      h+='<div class="campo" style="cursor:pointer" onclick="tomarPob('+d.valor+',\''+d.metodo+'\')"><label>'+d.metodo.toUpperCase()+' · '+(d.aplica?'APLICA (RAS)':'NO APLICA')+'</label>'+
         '<div style="font-size:17px;font-weight:700;color:'+(d.aplica?'var(--verde-oscuro)':'#B45309')+'">'+nf(d.valor,0)+' hab</div>'+
         '<div style="font-size:10.5px;color:var(--gris)">Nivel '+DP.nivelComplejidad(d.valor)+' — clic para adoptar</div></div>';
    });
    h+='</div></div>';
  }else{
    h+='<div class="aviso"><b>Aún no hay proyección generada.</b> Ve a la ventana <i>Proyección poblacional</i>, carga los datos del municipio y ejecuta los cálculos; luego vuelve aquí para adoptar la población de diseño. También puedes digitarla manualmente abajo.'+
       '<br><button onclick="irVista(\'proyeccion_poblacional\')">Ir a proyección poblacional</button></div>';
  }
  h+='<div class="card"><div class="row">'+campo("Población proyectada (hab)","pobProy")+
     '<div class="campo"><label>Método adoptado</label><input value="'+(PRO.metodoPob||"")+'" placeholder="Manual" readonly></div>'+
     '<div class="campo"><label>Nivel de complejidad (RAS)</label><input value="'+(PRO.pobProy?DP.nivelComplejidad(Number(PRO.pobProy)):"")+'" placeholder="—" readonly></div></div></div>';
  return h;}

/* ===============    3. TARJETA: PARÁMETROS DE CAUDAL DE DISEÑO   ======================== */
function trCardCaudal(){
  var h='', errores=[];
  var afQ=DP.T.AFEC[PRO.factorAf]||["—",0,0];
  var sumaPct=(Number(PRO.pUrb)||0)+(Number(PRO.pVias)||0)+(Number(PRO.pInd)||0)+(Number(PRO.pCom)||0)+(Number(PRO.pIns)||0);

  if(sumaPct>1.001) errores.push("La suma de los porcentajes de área ("+nf(sumaPct*100,1)+"%) supera el 100 % del área total.");
  if(PRO.R!==""&&(Number(PRO.R)<TR.R.R_RANGO[0]||Number(PRO.R)>TR.R.R_RANGO[1])) errores.push("El coeficiente de retorno R = "+nf(Number(PRO.R),2)+" está fuera del rango recomendado por el RAS ("+nf(TR.R.R_RANGO[0],2)+" – "+nf(TR.R.R_RANGO[1],2)+").");

  h+='<div class="card"><div class="card-title">Parámetros de Caudal de diseño</div>'+
    '<div class="card-sub">Inserte los valores solicitados para calcular el caudal de diseño.</div>'+
    (errores.length?tarjetaErrores("Revisa estos valores:",errores):'')+
    '<div class="row">'+
      campo("Área total población (Ha)","areaTotal")+
      campo("Coeficiente de retorno R","R","number",'step="0.01"')+
      '<div class="campo"><label>Área urbana (Ha) — calculada</label><input value="'+(PRO.areaTotal&&PRO.pUrb!==""?nf(PRO.areaTotal*PRO.pUrb,2):"")+'" placeholder="—" readonly></div>'+
    '</div>'+
    '<div class="row">'+
      campoPct("% Área urbana","pUrb")+
      campoPct("% Área vías","pVias")+
      campoPct("% Área industrial","pInd")+
      campoPct("% Área comercial","pCom")+
      campoPct("% Área institucional","pIns")+
    '</div>'+
    '<div class="row">'+
      selec("Factor de afectación","factorAf",Object.keys(DP.T.AFEC))+
      '<div class="campo"><label>Sentido / rango admisible</label><input value="'+afQ[0]+'  ('+nf(afQ[1],1)+' – '+nf(afQ[2],1)+')" readonly></div>'+
      campo("Coeficiente de afectación","coefAf","number",'step="0.01"')+
      selec("Tipo de infiltración","tipoInf",Object.keys(DP.T.INF))+
      selec("Método de mayoración","metMay",["Flowers","Angels","Gaines"])+
    '</div>'+
  '</div>';
  return h;}

/* ===============    4. TARJETA: PARÁMETROS DE REJILLA   ======================== */
function trCardRejilla(){
  var h='';
  h+='<div class="card"><div class="card-title">Parámetros de Rejilla</div>'+
    '<div class="card-sub">Inserte los valores solicitados para el diseño de la rejilla.</div>'+
    '<div class="row">'+campo("Velocidad efectiva del flujo Vf (m/s)","Vf","number",'step="0.01"')+
    selec("Limpieza de la rejilla","limpieza",["Manual","Mecánica"])+
    '<div class="campo"><label>Tipo (preestablece el ángulo)</label><select onchange="PRO.inclina=this.value;PRO.anguloManual=DP.T.INCL[this.value];guardarPro();pintarTerminosReferencia();">'+
    Object.keys(DP.T.INCL).map(function(o){return '<option value="'+o+'"'+(PRO.inclina===o?' selected':'')+'>'+o+'</option>';}).join('')+'</select></div>'+
    campo("Ángulo de inclinación θ (°)","anguloManual","number",'step="1"')+'</div>'+
    '<div class="row">'+selec("Tipo de grava (separación z)","grava",Object.keys(DP.T.GRAVA))+
    selec("Forma del barrote","forma",Object.keys(DP.T.FORMA))+campo("Diámetro/espesor del barrote (in)","diamIn","number",'step="0.25"')+
    campo("Borde libre (m; 0,30–0,50)","bordeLibre","number",'step="0.05" min="0.3" max="0.5"')+campo("Altura en área húmeda Hrh (m)","Hrh","number",'step="0.1"')+'</div></div>';
  return h;}

/* ===============    5. TARJETA: PARÁMETROS DE ADUCCIÓN   ======================== */
function trCardAduccion(){
  var h='', e=[];
  var lstAcc=["-"].concat(Object.keys(DP.T.ACCESORIOS).reduce(function(a,g){return a.concat(Object.keys(DP.T.ACCESORIOS[g]));},[]));
  var S=Number(PRO.aduS),BL=Number(PRO.aduBL),St=Number(PRO.tubS),C=Number(PRO.tubC),rg=DP.T.HW[PRO.tubMat]||[0,999];

  if(PRO.aduS!==""&&(S<TR.R.PEND_ADU[0]-1e-9||S>TR.R.PEND_ADU[1]+1e-9)) e.push("Pendiente del canal fuera de "+nf(TR.R.PEND_ADU[0]*100,0)+" – "+nf(TR.R.PEND_ADU[1]*100,0)+" %.");
  if(PRO.aduBL!==""&&(BL<TR.R.BL_ADU[0]-1e-9||BL>TR.R.BL_ADU[1]+1e-9)) e.push("Borde libre fuera de "+nf(TR.R.BL_ADU[0],2)+" – "+nf(TR.R.BL_ADU[1],2)+" m.");
  if(PRO.tubS!==""&&(St<TR.R.PEND_ADU[0]-1e-9||St>TR.R.PEND_ADU[1]+1e-9)) e.push("Pendiente de la tubería fuera de "+nf(TR.R.PEND_ADU[0]*100,0)+" – "+nf(TR.R.PEND_ADU[1]*100,0)+" %.");
  if(PRO.tubC!==""&&(C<rg[0]||C>rg[1])) e.push("El coeficiente C está fuera del rango de Hazen–Williams para "+PRO.tubMat+".");
  if(!(Number(PRO.aduPct)>0&&Number(PRO.aduPct)<=100)) e.push("El % del caudal tratado por la aducción debe estar entre 1 y 100.");

  h+='<div class="card"><div class="card-title">Parámetros de Aducción</div>'+
    '<div class="card-sub">Canal y tubería entre rejilla y desarenador. El diámetro comercial y la clase de tubería se eligen en el módulo, porque dependen de los resultados.</div>'+
    (e.length?tarjetaErrores("Revisa estos valores:",e):'')+
    '<div class="card-title" style="padding-top:14px">1. Parámetros de canal de aducción</div>'+
    '<div class="row">'+selec("Tipo de canal","aduTipo",Object.keys(DP.T.CANAL))+selec("Material del canal (define n)","aduMat",Object.keys(DP.T.MANNING))+campo("Longitud del canal L (m)","aduL","number",'step="0.1"')+campoPct("Pendiente del canal S","aduS",'step="0.1"')+campo("Borde libre BL (m)","aduBL","number",'step="0.05"')+'</div>'+
    '<div class="card-title" style="padding-top:14px">2. Parámetros de tubería de aducción</div>'+
    '<div class="row">'+selec("Material de la tubería","tubMat",Object.keys(DP.T.HW))+campo("Coeficiente C","tubC","number",'step="1"')+campo("Longitud de la tubería L (m)","tubL","number",'step="0.1"')+campoPct("Pendiente de la tubería S","tubS",'step="0.1"')+'</div>';

  for(var i=1;i<=4;i++) h+='<div class="row">'+selec("Accesorio "+i,"acc"+i,lstAcc)+campo("Cantidad","acc"+i+"n","number",'step="1" min="0"')+'</div>';

  h+='</div>';
  return h;}

/* =========  6. TARJETA: PARÁMETROS DE DESARENADOR   ================ */
function trCardDesarenador(){
  var h='', e=[];
  var H=Number(PRO.desH),Vor=Number(PRO.desVor),a=Number(PRO.desA);

  if(PRO.desH!==""&&(H<0.75||H>1.5)) e.push("La altura adoptada H debe estar entre 0,75 y 1,5 m.");
  if(PRO.desVor!==""&&Vor>0.1) e.push("La velocidad en los orificios Vor debe ser menor o igual a 0,1 m/s.");
  if(PRO.desA!==""&&a<20) e.push("El tiempo de retención a debe ser mayor o igual a 20 min.");
  if(!(Number(PRO.desPct)>0&&Number(PRO.desPct)<=100)) e.push("El % del caudal tratado por el desarenador debe estar entre 1 y 100.");

  h+='<div class="card"><div class="card-title">Parámetros de Desarenador</div>'+
    '<div class="card-sub">Remoción de arena fina (0,1 mm), deflectores y plataformas </div>'+
    (e.length?tarjetaErrores("Revisa estos valores:",e):'')+
    '<div class="row">'+campo("Temperatura del agua (°C)","desT","number",'step="0.5"')+campo("Diámetro de la partícula (mm)","desDp","number",'step="0.01"')+campo("Peso específico de la partícula (kg/m³)","desRho","number",'step="10"')+selec("Condiciones de los deflectores","desCond",Object.keys(DP.T.AT))+'</div>'+
    '<div class="row">'+selec("% de remoción","desRem",DP.T.REM)+campo("Tiempo de retención a (min)","desA","number",'step="1"')+campo("Altura adoptada H (m)","desH","number",'step="0.05"')+campo("Área de salida de lodos AL (m²)","desAL","number",'step="0.05"')+'</div>'+
    '<div class="row">'+campo("Velocidad en orificios Vor (m/s)","desVor","number",'step="0.01"')+campo("Diámetro del orificio (in)","desDor","number",'step="0.25"')+selec("Altura del deflector (H/…)","desDef",["2","3"])+campo("Tiempo t de la plataforma (s)","desTp","number",'step="0.5"')+'</div></div>';
  return h;}

/* ========= 7. TARJETA: PARÁMETROS DE CANALETA PARSHALL ================ */
function trCardParshall(){
  var vHaW=PRO.parHaW===undefined||PRO.parHaW===null?"":PRO.parHaW;
  var vBL=PRO.parBL===undefined||PRO.parBL===null?"":PRO.parBL;

  var h='<div class="card">'+
    '<div class="card-title">Parámetros de Canaleta Parshall</div>'+
    '<div class="card-sub">Aforador y mezclador rápido. Define el ancho de garganta, la relación de carga y el borde libre.</div>'+
    '<div class="row" style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">'+

    // Selector original de ancho de garganta
    trSelectorAnchoParshall()+
    // Relación Ha/W vinculada al módulo Parshall
    '<div class="campo">'+
      '<label>Relación Ha/W</label>'+
      '<input id="trParHaW" type="number" placeholder="Ingrese un valor" value="'+vHaW+'" step="0.05" min="0.4" max="0.8" oninput="setPro(\'parHaW\',this,true)">'+
    '</div>'+
    // Borde libre vinculado al módulo Parshall
    '<div class="campo">'+
      '<label>Borde libre BL (m)</label>'+
      '<input id="trParBL" type="number" placeholder="Ingrese un valor" value="'+vBL+'" step="0.05" min="0" oninput="setPro(\'parBL\',this,true)">'+
    '</div>'+
    '</div>'+
    '</div>';

  return h;}

/* =======  8. VENTANA COMPLETA: ENSAMBLA TODAS LAS TARJETAS ======= */
