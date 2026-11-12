/* ##########################################################
   STAR · SISTEMAS DE TRATAMIENTO DE AGUA RESIDUAL
   MÓDULO ADUCCIÓN  (posición 6 en el menú) — aduccion.js
   Cálculo de la conducción por canal y tubería entre la rejilla y el desarenador, accesorios, pérdidas y golpe de ariete.
   Sufijo: las funciones y variables globales de este archivo terminan en _STAR
   (así no chocan con los módulos de STAP, IHS o RS que tengan el mismo nombre).
   ########################################################## */
// Dependencias: PRO.REJ y PRO.Q; tablas de aducción del bloque de referencia compartido; utilidades/campos/revisión/memoria y aduccion_svg.js.
/* ==========================================================
   MODULO 7 — ADUCCIÓN 
   ========================================================== */
function aduK_STAR(nom){for(var g in DP_STAR.T.ACCESORIOS){if(DP_STAR.T.ACCESORIOS[g].hasOwnProperty(nom))return DP_STAR.T.ACCESORIOS[g][nom];}return null;}
function aduAccesorios_STAR(){
  var lista=[],tot=0;
  for(var i=1;i<=5;i++){
    var nom=PRO["acc"+i],cant=Number(PRO["acc"+i+"n"]),k=aduK_STAR(nom);
    if(k===null||!(cant>0)) continue;
    lista.push({nom:nom,n:cant,k:k}); tot+=k*cant;
  }
  return {lista:lista,sumK:tot};}

function aduDteo_STAR(Q,C,S){return Math.pow(Q/(0.2785*C*Math.pow(S,0.54)),1/2.63);}
function aduHf_STAR(Q,L,C,D){return 10.67*L*Math.pow(Q,1.852)/(Math.pow(C,1.852)*Math.pow(D,4.87));}

/* Diámetro exterior real (mm) del catálogo PVC para un nominal en pulgadas; null si no está en la tabla */
function aduDextPvc_STAR(pulg){
  for(var i=0;i<DP_STAR.T.PVC.length;i++){
    var partes=DP_STAR.T.PVC[i][0].split(" "), v=0;
    partes.forEach(function(s){ if(s.indexOf("/")>0){var f=s.split("/");v+=Number(f[0])/Number(f[1]);}else v+=Number(s); });
    if(Math.abs(v-pulg)<1e-9) return DP_STAR.T.PVC[i][1];}
  return null;}

function aduNomIn_STAR(s){var v=0;s.split(" ").forEach(function(q){if(q.indexOf("/")>0){var f=q.split("/");v+=Number(f[0])/Number(f[1]);}else v+=Number(q);});return v;}
function aduDcomSug_STAR(din){for(var i=0;i<DP_STAR.T.PVC.length;i++){var v=aduNomIn_STAR(DP_STAR.T.PVC[i][0]);if(v>=din-1e-9)return v;}return null;}
function aduPos_STAR(v){return v!==""&&v!==null&&!isNaN(Number(v))&&Number(v)>0;}

/* ---------- Automatización de diámetro comercial PVC ---------- */

function aduFilaPvc_STAR(din){ for(var i=0;i<DP_STAR.T.PVC.length;i++){ if(Math.abs(aduNomIn_STAR(DP_STAR.T.PVC[i][0])-din)<1e-9) return DP_STAR.T.PVC[i]; } return null; }

/* Select de diámetro comercial tomado directamente del catálogo (evita digitar diámetros que no existen). */
function selecDiamPVC_STAR(lbl,k){
  if(PRO.tubMat!=="PVC") return campo(lbl,k,"number",'step="0.25"');
  var sk=(k==="tubDin")?"aduDinSel":"aduDnSel", auto=aduSelAuto_STAR(sk), adopt=PRO[k];
  var h='<div class="campo"><label>'+lbl+'</label><select onchange="PRO[\''+sk+'\']=this.value;guardarPro();actualizarEstados();recalcularAduccion_STAR(\''+(k==="tubDin"?"tuberia":"perdidas")+'\');">';
  h+='<option value="Automático"'+(auto?' selected':'')+'>Automático'+(aduPos_STAR(adopt)?' → '+nf(Number(adopt),2)+' in':'')+'</option>';
  h+=DP_STAR.T.PVC.map(function(p){var v=aduNomIn_STAR(p[0]);return '<option value="'+v+'"'+(!auto&&Number(PRO[sk])===v?' selected':'')+'>'+p[0]+'" ('+nf(v,3)+' in · Ø ext '+nf(p[1],1)+' mm)</option>';}).join('');
  h+='</select></div>';
  return h;}

/* Clase PVC: Automático o una de las clases disponibles en el catálogo para el diámetro adoptado. */
function selecClasePVC_STAR(){
  if(PRO.tubE!=="PVC") return '';
  var fp=aduPos_STAR(PRO.tubDnuevo)?aduFilaPvc_STAR(Number(PRO.tubDnuevo)):null, cl=["5","7.5","10","15"], auto=(PRO.aduClSel===undefined||PRO.aduClSel==="Automático"||PRO.aduClSel==="");
  var h='<div class="campo"><label>Clase de la tubería PVC</label><select onchange="PRO.aduClSel=this.value;guardarPro();actualizarEstados();recalcularAduccion_STAR(\'perdidas\');">';
  h+='<option value="Automático"'+(auto?' selected':'')+'>Automático'+(PRO.tubClasePVC?' → Clase '+PRO.tubClasePVC+' ('+DP_STAR.T.PSI_CLASE[PRO.tubClasePVC]+' PSI)':'')+'</option>';
  if(fp&&fp[2]) h+=cl.map(function(c,i){if(fp[2][i]==null) return '';return '<option value="'+c+'"'+(!auto&&String(PRO.aduClSel)===c?' selected':'')+'>Clase '+c+' ('+DP_STAR.T.PSI_CLASE[c]+' PSI)</option>';}).join('');
  h+='</select></div>';
  return h;}

/* Lectura de campos del catálogo (solo se usan con materiales distintos de PVC). */
function campoLecturaPVC_STAR(lbl,k){var v=PRO[k]===''||PRO[k]===null||PRO[k]===undefined?'':PRO[k];return '<div class="campo"><label>'+lbl+'</label><input value="'+(v===''?'Selecciona diámetro y clase':esc(v))+'" readonly aria-readonly="true"></div>';}
function campoExteriorPVC_STAR(){var fp=PRO.tubDnuevo!==''?aduFilaPvc_STAR(Number(PRO.tubDnuevo)):null;var v=fp&&fp[1]!=null?nf(fp[1],1)+' mm':'Selecciona diámetro comercial';return '<div class="campo"><label>Diámetro exterior (catálogo)</label><input value="'+v+'" readonly aria-readonly="true"></div>';}
function aduAutoClase_STAR(){
  if(PRO.tubE!=="PVC"||!aduPos_STAR(PRO.tubDnuevo)||!PRO.tubClasePVC) return;
  var fp=aduFilaPvc_STAR(Number(PRO.tubDnuevo)); if(!fp||!fp[2]) return;
  var claves=["5","7.5","10","15"], idx=claves.indexOf(PRO.tubClasePVC);
  if(idx>=0&&fp[2][idx]!=null){ PRO.tubEsp=fp[2][idx]; PRO.tubPSI=DP_STAR.T.PSI_CLASE[PRO.tubClasePVC]; }}

/* ---------- Selección automática de diámetros y clase (PVC) ----------
   1) D inicial: primer comercial >= D teórico (Hazen-Williams) que deje Δh - Ht > 0.
   2) D nuevo: primer comercial >= D teórico nuevo (con S nueva) que cumpla Ht <= Δh.
   3) Clase: la menor clase del catálogo con P diseño (1,3·Δh) <= P trabajo (PSI·0,703) y P trabajo > P estática. */
function aduAutoOn_STAR(){return PRO.tubMat==="PVC";}
function aduSelAuto_STAR(k){return PRO[k]===undefined||PRO[k]==="Automático"||!aduPos_STAR(PRO[k]);}
function aduAutoDiam_STAR(Q,C,St,Lt,acc,op){
  op=op||{};
  var g=9.81,o={msgs:[],clsMsg:"",Din:null,Dnuevo:null,clase:"",Dtin:0,Dtnin:0};
  var cat=DP_STAR.T.PVC.map(function(p){return aduNomIn_STAR(p[0]);}), Dh=St*Lt, i, j;
  function Ht(din){var D=din*0.0254,V=Q/(Math.PI*D*D/4);return aduHf_STAR(Q,Lt,C,D)+acc.sumK*V*V/(2*g);}
  o.Dtin=aduDteo_STAR(Q,C,St)/0.0254;
  if(op.Din) o.Din=op.Din;
  else{
    for(i=0;i<cat.length&&cat[i]<o.Dtin-1e-9;i++){}
    while(i<cat.length&&Dh-Ht(cat[i])<=0) i++;
    if(i>=cat.length){o.msgs.push("Selección automática: ningún diámetro del catálogo PVC (máximo "+nf(cat[cat.length-1],0)+" in) deja desnivel disponible tras las pérdidas (D teórico = "+nf(o.Dtin,2)+" in; Δh = "+nf(Dh,2)+" m). Sugerencia: aumenta el número de tuberías en paralelo, la pendiente o reduce los accesorios.");return o;}
    o.Din=cat[i];}
  var Dhn=Dh-Ht(o.Din);
  if(Dhn<=0){o.Dnuevo=op.Dnuevo||null;return o;}
  o.Dtnin=aduDteo_STAR(Q,C,Dhn/Lt)/0.0254;
  if(op.Dnuevo) o.Dnuevo=op.Dnuevo;
  else{
    for(j=0;j<cat.length&&cat[j]<o.Dtnin-1e-9;j++){}
    while(j<cat.length&&Ht(cat[j])>Dh) j++;
    if(j>=cat.length){o.msgs.push("Selección automática: ningún diámetro del catálogo PVC alcanza el diámetro teórico nuevo ("+nf(o.Dtnin,2)+" in). Sugerencia: aumenta el número de tuberías en paralelo o la pendiente.");return o;}
    o.Dnuevo=cat[j];}
  if(PRO.tubE==="PVC"){
    var fp=aduFilaPvc_STAR(o.Dnuevo), cl=["5","7.5","10","15"], Pest=Dh;
    if(op.clase){
      var ix=cl.indexOf(String(op.clase));
      if(fp&&fp[2]&&ix>=0&&fp[2][ix]!=null) o.clase=cl[ix];
      else o.clsMsg="La clase "+op.clase+" no está disponible en el catálogo PVC para "+nf(o.Dnuevo,2)+" in. Sugerencia: elige otra clase o Automático.";}
    else{
      for(var k=0;fp&&fp[2]&&k<cl.length;k++){
        if(fp[2][k]==null) continue;
        var Pt=DP_STAR.T.PSI_CLASE[cl[k]]*0.703;
        if(Pt>Pest&&1.3*Dh<=Pt){o.clase=cl[k];break;}}
      if(!o.clase) o.clsMsg="Selección automática: ninguna clase del catálogo PVC para "+nf(o.Dnuevo,2)+" in soporta la presión de diseño (1,30 × "+nf(Dh,2)+" = "+nf(1.3*Dh,2)+" m.c.a.). Sugerencia: reduce el desnivel o usa otro material.";}
  }
  return o;}

function calcularAduccion_STAR(){
  var QD=PRO.Q.QDm3, pct=Number(PRO.aduPct), nC=Number(PRO.aduNCan), nT=Number(PRO.tubN);
  var R={QD:QD,pct:pct,nC:nC,nT:nT,Qc:0,Qt:0,distErr:[],canal:null,canalErr:[],canalAdv:[],tub:null,tubErr:[],perdAdv:[],gol:null,golErr:[]};
  var g=9.81,Q;
  if(!(pct>0&&pct<=100)) R.distErr.push("El porcentaje del caudal de diseño que trata la aducción debe estar entre 1 y 100 %.");
  if(!(nC>=1)||nC!==Math.floor(nC)) R.distErr.push("El número de canales de aducción debe ser un entero mayor o igual a 1.");
  if(!(nT>=1)||nT!==Math.floor(nT)) R.distErr.push("El número de tuberías de aducción debe ser un entero mayor o igual a 1.");
  if(R.distErr.length) return R;
  R.Qc=QD*pct/100/nC; R.Qt=QD*pct/100/nT;

  /* =============== CANAL =========== */
  Q=R.Qc;
  var falta=[];
  if(!aduPos_STAR(PRO.aduL)) falta.push("longitud L");
  if(!aduPos_STAR(PRO.aduS)) falta.push("pendiente S");
  if(!aduPos_STAR(PRO.aduBL)) falta.push("borde libre BL");
  if(falta.length) R.canalErr.push("Faltan datos del canal: "+falta.join(", ")+".");
  else{
    var S=Number(PRO.aduS),BL=Number(PRO.aduBL);
    if(rnd(S,6)<TR_STAR.R.PEND_ADU[0]||rnd(S,6)>TR_STAR.R.PEND_ADU[1]) R.canalErr.push("La pendiente S = "+nf(S*100,2)+" % está fuera del rango normativo "+nf(TR_STAR.R.PEND_ADU[0]*100,0)+" – "+nf(TR_STAR.R.PEND_ADU[1]*100,0)+" % (evita la sedimentación de arenas en el fondo).");
    if(rnd(BL,6)<TR_STAR.R.BL_ADU[0]||rnd(BL,6)>TR_STAR.R.BL_ADU[1]) R.canalErr.push("El borde libre BL = "+nf(BL,2)+" m está fuera del rango normativo "+nf(TR_STAR.R.BL_ADU[0],2)+" – "+nf(TR_STAR.R.BL_ADU[1],2)+" m.");}
  if(!R.canalErr.length){
    var tp=DP_STAR.T.CANAL[PRO.aduTipo],n=DP_STAR.T.MANNING[PRO.aduMat],L=Number(PRO.aduL);
    var X=Q*n/Math.sqrt(S), h=tp.k*Math.pow(X,3/8), b=tp.fb*h;
    var Am=tp.am(h,b), Pm=tp.pm(h,b), Rh=Am/Pm, Vo=Q/Am, Af=b*L, Va=Q/Af;
    R.canal={Q:Q,tp:tp,tipo:PRO.aduTipo,mat:PRO.aduMat,n:n,L:L,S:S,BL:BL,X:X,dh:S*L,h:h,b:b,Am:Am,Pm:Pm,Rh:Rh,Vo:Vo,Af:Af,Va:Va};
    if(Vo<TR_STAR.R.VO_MIN) R.canalAdv.push("La velocidad horizontal Vo = "+nf(Vo,3)+" m/s es menor que el mínimo de "+nf(TR_STAR.R.VO_MIN,1)+" m/s: puede haber sedimentación (no bloquea el cálculo).");}

  /* =============== TUBERÍA =========== */
  Q=R.Qt;
  falta=[]; R.auto=null; R.autoFail=false;
  if(aduAutoOn_STAR()&&aduPos_STAR(PRO.tubC)&&aduPos_STAR(PRO.tubS)&&aduPos_STAR(PRO.tubL)){
    var rg0=DP_STAR.T.HW[PRO.tubMat],C0=Number(PRO.tubC),S0=Number(PRO.tubS);
    if(C0>=rg0[0]&&C0<=rg0[1]&&rnd(S0,6)>=TR_STAR.R.PEND_ADU[0]&&rnd(S0,6)<=TR_STAR.R.PEND_ADU[1]){
      PRO.tubE="PVC";
      var au=aduAutoDiam_STAR(Q,C0,S0,Number(PRO.tubL),aduAccesorios_STAR(),{
        Din:aduSelAuto_STAR("aduDinSel")?null:Number(PRO.aduDinSel),
        Dnuevo:aduSelAuto_STAR("aduDnSel")?null:Number(PRO.aduDnSel),
        clase:(PRO.aduClSel===undefined||PRO.aduClSel==="Automático"||PRO.aduClSel==="")?null:String(PRO.aduClSel)});
      R.auto=au;
      PRO.tubDin=au.Din===null?"":au.Din; PRO.tubDnuevo=au.Dnuevo===null?"":au.Dnuevo;
      PRO.tubClasePVC=au.clase; PRO.tubEsp=""; PRO.tubPSI=""; aduAutoClase_STAR();
      if(au.msgs.length){R.autoFail=true;au.msgs.forEach(function(m){R.tubErr.push(m);});}}}
  if(!aduPos_STAR(PRO.tubC)) falta.push("coeficiente C");
  if(!aduPos_STAR(PRO.tubS)) falta.push("pendiente S");
  if(!aduPos_STAR(PRO.tubL)) falta.push("longitud L");
  if(!aduPos_STAR(PRO.tubDin)&&!R.autoFail) falta.push("diámetro comercial");
  if(falta.length) R.tubErr.push("Faltan datos de la tubería: "+falta.join(", ")+".");
  else{
    var C=Number(PRO.tubC),St=Number(PRO.tubS),rg=DP_STAR.T.HW[PRO.tubMat];
    if(C<rg[0]||C>rg[1]) R.tubErr.push("El coeficiente C = "+nf(C,0)+" está fuera del rango de Hazen–Williams para "+PRO.tubMat+": "+(rg[0]===rg[1]?nf(rg[0],0):nf(rg[0],0)+" – "+nf(rg[1],0))+".");
    if(rnd(St,6)<TR_STAR.R.PEND_ADU[0]||rnd(St,6)>TR_STAR.R.PEND_ADU[1]) R.tubErr.push("La pendiente de la tubería S = "+nf(St*100,2)+" % está fuera del rango normativo "+nf(TR_STAR.R.PEND_ADU[0]*100,0)+" – "+nf(TR_STAR.R.PEND_ADU[1]*100,0)+" %.");}
  if(!R.tubErr.length){
    var Lt=Number(PRO.tubL),acc=aduAccesorios_STAR();
    var t={Q:Q,C:C,S:St,L:Lt,acc:acc,sumK:acc.sumK,Din:Number(PRO.tubDin)};
    t.D=t.Din*0.0254; t.Dh=St*Lt; t.Dt=aduDteo_STAR(Q,C,St); t.Dtin=t.Dt/0.0254;
    t.A=Math.PI*t.D*t.D/4; t.V=Q/t.A; t.Hf=aduHf_STAR(Q,Lt,C,t.D); t.Ha=acc.sumK*t.V*t.V/(2*g); t.Ht=t.Hf+t.Ha;
    t.Dhn=t.Dh-t.Ht;
    if(t.Dhn>0){
      t.Sn=t.Dhn/Lt; t.Dtn=aduDteo_STAR(Q,C,t.Sn); t.Dtnin=t.Dtn/0.0254;
      if(aduPos_STAR(PRO.tubDnuevo)){
        t.D2in=Number(PRO.tubDnuevo); t.D2=t.D2in*0.0254; t.A2=Math.PI*t.D2*t.D2/4; t.V2=Q/t.A2;
        t.Hf2=aduHf_STAR(Q,Lt,C,t.D2); t.Ha2=acc.sumK*t.V2*t.V2/(2*g); t.Ht2=t.Hf2+t.Ha2; t.ok2=t.Ht2<=t.Dh;
        if(t.D2in<t.Dtnin-1e-9) R.perdAdv.push("El diámetro comercial nuevo ("+nf(t.D2in,2)+" in) es menor que el diámetro teórico nuevo ("+nf(t.Dtnin,2)+" in). Sugerencia: elige un diámetro mayor o igual a "+nf(aduDcomSug_STAR(t.Dtnin)!==null?aduDcomSug_STAR(t.Dtnin):t.Dtnin,2)+" in, o deja el diámetro en Automático.");
        if(!t.ok2) R.perdAdv.push("Con el diámetro nuevo de "+nf(t.D2in,2)+" in las pérdidas totales (Ht = "+nf(t.Ht2,2)+" m) superan el desnivel disponible (Δh = "+nf(t.Dh,2)+" m). Sugerencia: aumenta el diámetro comercial.");
        if(t.V2<0.5) R.perdAdv.push("La velocidad con el diámetro nuevo (V = "+nf(t.V2,3)+" m/s) es menor que 0,5 m/s: riesgo de sedimentación de arena. Sugerencia: reduce el diámetro.");}}else R.tubErr.push("Las pérdidas totales (Ht = "+nf(t.Ht,2)+" m) igualan o superan el desnivel disponible (Δh = "+nf(t.Dh,2)+" m). Aumenta el diámetro comercial para poder recalcular."); R.tub=t;

    /* =============== GOLPE DE ARIETE =========== */
    if(t.D2){
      var e=Number(PRO.tubEsp),psi=Number(PRO.tubPSI),E=DP_STAR.T.ELAST_GPA[PRO.tubE];
      if(R.auto&&R.auto.clsMsg) R.golErr.push(R.auto.clsMsg);
      else if(!aduPos_STAR(PRO.tubEsp)||!aduPos_STAR(PRO.tubPSI)) R.golErr.push(R.auto?"Selección automática: no se encontró espesor ni clase para el diámetro adoptado; cambia a modo Manual.":"Para verificar el golpe de ariete digita el espesor de pared (mm) y la clase de la tubería (PSI).");
      else if((PRO.tubE==="PVC"&&aduDextPvc_STAR(t.D2in)?aduDextPvc_STAR(t.D2in):t.D2*1000)-2*e<=0) R.golErr.push("El espesor de pared es demasiado grande para el diámetro adoptado (D interno ≤ 0).");
      else{
        var De=(PRO.tubE==="PVC"&&aduDextPvc_STAR(t.D2in))?aduDextPvc_STAR(t.D2in):t.D2*1000;
        var q={E:E,e:e,psi:psi,De:De,deCat:(PRO.tubE==="PVC"&&!!aduDextPvc_STAR(t.D2in)),Dint:De-2*e};
        q.K=2.1/E; q.Cc=9900/Math.sqrt(48.3+q.K*q.Dint/e); q.T=2*Lt/q.Cc; q.V=t.V2;
        q.haR=q.Cc*q.V/g; q.Pest=t.Dh; q.Pdis=t.Dh*1.3; q.Ptrab=psi*0.703;
        q.Ptot=q.haR+q.Pest; q.Pdisp=q.Ptrab-q.Pest; q.okDis=q.Pdis<=q.Ptrab;
        if(q.Pdisp>0){
          q.tcalc=2*Lt*q.V/(g*q.Pdisp);
          q.tuso=aduPos_STAR(PRO.tubTman)?Number(PRO.tubTman):q.tcalc;
          q.manual=aduPos_STAR(PRO.tubTman);
          q.rapido=q.tuso<=q.T;
          q.ha=q.rapido?q.haR:2*Lt*q.V/(g*q.tuso);
        }else R.golErr.push("La presión de trabajo de la tubería ("+nf(q.Ptrab,2)+" m.c.a.) no supera la presión estática ("+nf(q.Pest,2)+" m.c.a.): adopta una clase (PSI) mayor.");
        q.ok=q.Ptot<=q.Ptrab;
        if(q.tuso!==undefined){ q.Ptot2=q.ha+q.Pest; q.okMan=q.Ptot2<=q.Ptrab+1e-9; }
        R.gol=q;
      }
    }
  }
  return R;}

function cardDistAdu_STAR(R){
  var ok=!R.distErr.length;
  return '<div class="card"><div class="card-title">Distribución del caudal</div>'+
   '<div class="card-sub">Indica qué porcentaje del caudal de diseño trata la aducción y en cuántas unidades en paralelo lo divides (por ejemplo 2 canales o 2 tuberías).</div>'+
   '<div class="row">'+campo("% del caudal de diseño que trata la aducción","aduPct","number",'step="1" min="1" max="100"')+
   campo("Número de canales de aducción","aduNCan","number",'step="1" min="1"')+
   campo("Número de tuberías de aducción","tubN","number",'step="1" min="1"')+'</div>'+
   (ok?'<div class="link-ok" style="margin-top:0">Caudal de diseño total: <b>'+nf(R.QD*1000,0)+' L/s</b> · se trata el <b>'+nf(R.pct,0)+' %</b> = <b>'+nf(R.QD*R.pct*10,1)+' L/s</b>'+
       '<br>Por canal: <b>'+R.nC+' × '+nf(R.Qc*1000,2)+' L/s</b> ('+nf(R.Qc,4)+' m³/s) · Por tubería: <b>'+R.nT+' × '+nf(R.Qt*1000,2)+' L/s</b> ('+nf(R.Qt,4)+' m³/s)</div>':'')+
   '<div class="acciones"><button class="btn btn-primary" style="width:auto;padding:0 22px" onclick="recalcularDistribucion_STAR(\'aduccion\')">RECALCULAR DISTRIBUCIÓN</button></div></div>';}


/* ==========================================================
   ILUSTRACIONES DE ADUCCION ( CANAL Y TUBERIA)
   ========================================================== */
/* ====================   BOTONES DE ADUCCION   ================================ */
function avisosParametrosAduccion_STAR(scope){
  var R=calcularAduccion_STAR();
  var e=[];

  if(scope==='general'||scope==='canal'){
    e=e.concat(R.canalErr||[]);}

  if(scope==='general'||scope==='tuberia'){
    e=e.concat(R.tubErr||[]);}

  if(scope==='general'||scope==='perdidas'){e=e.concat(R.perdAdv||[],R.golErr||[]);}
  return e;}

function recalcularAduccion_STAR(scope){scope=scope||"general";
  var avisos=avisosRangoAduccion_STAR(scope);
  var R=calcularAduccion_STAR();
  if(scope==='general'||scope==='tuberia'||scope==='perdidas'){
    (R.tubErr||[]).forEach(function(m){if(avisos.indexOf(m)<0)avisos.push(m);});}
  if(scope==='general'||scope==='perdidas'){
    (R.perdAdv||[]).concat(R.golErr||[]).forEach(function(m){if(avisos.indexOf(m)<0)avisos.push(m);});}
  pintarAduccion_STAR();
  if(avisos.length){
    abrirAdvertencia("Advertencia — Aducción",avisos);}}

function revisionAduccion_STAR(scope){
  var e=avisosParametrosAduccion_STAR(scope);
  abrirRevision('Aducción',e);}

function avisosRangoAduccion_STAR(scope){
  var e=[];
  var S, BL, St, C, rg;

  function vacio(k){
    return PRO[k]==="" || PRO[k]===null || PRO[k]===undefined;}

  function fuera(k, minimo, maximo, nombre, unidad, sugerencia){
    if(vacio(k)) return;

    var v=Number(PRO[k]);
    /* Las pendientes se guardan como fracción (0,14) pero se muestran en % (14) */
    var esPct=(unidad==="%"), mostrar=function(x){return esPct?nf(x*100,0):nf(x,2);};

    if(!isFinite(v) || rnd(v,6)<minimo-1e-9 || rnd(v,6)>maximo+1e-9){
      e.push(nombre+" está fuera del rango permitido ("+
        mostrar(minimo)+"–"+mostrar(maximo)+" "+unidad+"). "+
        "Sugerencia: "+sugerencia);}}

  if(scope==="general" || scope==="canal"){
    fuera("aduS",0.14,0.16,"Pendiente del canal","%",
      "ingresa una pendiente entre 14 y 16 %.");
    fuera("aduBL",0.30,0.50,"Borde libre del canal","m",
      "ingresa un valor entre 0,30 y 0,50 m.");}

  if(scope==="general" || scope==="tuberia"){
    fuera("tubS",0.14,0.16,"Pendiente de la tubería","%",
      "ingresa una pendiente entre 14 y 16 %.");

    if(!vacio("tubC")){
      rg=DP_STAR.T.HW[PRO.tubMat];
      C=Number(PRO.tubC);

      if(rg && (!isFinite(C) || C<rg[0] || C>rg[1])){
        e.push("El coeficiente C está fuera del rango permitido para "+
          PRO.tubMat+". Sugerencia: ingresa un valor entre "+
          rg[0]+" y "+rg[1]+".");}}}

  return e;}


function aduBotones_STAR(scope,ocultarRevision){
  var rev=scope||'general';
  return '<div class="acciones"><button class="btn btn-primary" style="width:auto;padding:0 22px" onclick="recalcularAduccion_STAR(\''+rev+'\')">RECALCULAR</button>'+
   (ocultarRevision?'':'<button class="btn-revision" onclick="revisionAduccion_STAR(\''+rev+'\')">REVISIÓN DE ERRORES</button>')+
   '<button class="btn-sec" onclick="abrirTodo(\'pane-aduccion_STAR\',true)">VER TODA LA MEMORIA DE CÁLCULO</button>'+
   '<button class="btn-sec" onclick="abrirTodo(\'pane-aduccion_STAR\',false)">CONTRAER TODO</button>'+'</div>';}

/* ====================   MEMORIA DE CALCULO   ================================ */
function aduTabla_STAR(filas){
  return '<table class="res-table"><thead><tr><th></th><th>VARIABLE</th><th>VALOR</th><th>UNIDAD</th></tr></thead><tbody>'+filas+'</tbody></table>';}

function aduMemoCard_STAR(titulo,filas){
  return '<div class="card"><div class="card-title">'+titulo+'</div><div class="card-sub">Haz clic en cualquier fila para ver la fórmula, el reemplazo y el resultado.</div>'+aduTabla_STAR(filas)+'</div>';}

function aduFilasCanal_STAR(c){
  var t=seccion("1. DATOS DE PARTIDA");
  t+=fila("Caudal por canal de aducción",c.Q,"m³/s",4,"Q<sub>c</sub> = QD · (%/100) / n<sub>canales</sub>",nf(PRO.Q.QDm3,4)+" × "+nf(PRO.aduPct,0)+" % / "+PRO.aduNCan,"Porcentaje del caudal de diseño que trata la aducción, repartido entre los canales en paralelo.");
  t+=fila("Tipo de canal",c.tipo,"",0,"<i>Dato de entrada</i>","—","Seleccionado por el usuario.");
  t+=fila("Material",c.mat,"",0,"<i>Dato de entrada</i>","—","Seleccionado por el usuario.");
  t+=fila("Coeficiente de rugosidad de Manning (n)",c.n,"",3,"Tabla de Manning — material","n("+c.mat+") = "+nf(c.n,3),"Valor buscado en la tabla de Manning (Datos preliminares).");
  t+=filaDato("Longitud del canal (L)",c.L,"m",2);
  t+=filaDato("Pendiente (S)",c.S*100,"%",2,"Rango normativo "+nf(TR_STAR.R.PEND_ADU[0]*100,0)+" – "+nf(TR_STAR.R.PEND_ADU[1]*100,0)+" %.");
  t+=filaDato("Borde libre (BL)",c.BL,"m",2,"Rango normativo "+nf(TR_STAR.R.BL_ADU[0],2)+" – "+nf(TR_STAR.R.BL_ADU[1],2)+" m.");
  t+=seccion("2. GEOMETRÍA DEL CANAL (MANNING)");
  t+=fila("Desnivel (Δh)",c.dh,"m",3,"Δh = S · L",nf(c.S,4)+" × "+nf(c.L,2),"Diferencia de cota disponible entre la rejilla y el desarenador.");
  t+=fila("Q·n/√S",c.X,"",5,"Q·n/√S = A · R<sub>h</sub><sup>2/3</sup>",nf(c.Q,4)+" × "+nf(c.n,3)+" / √"+nf(c.S,4),"Término de Manning que despeja la profundidad.");
  t+=fila("Altura de la lámina de agua (h)",c.h,"m",3,"h = "+c.tp.kt+" · (Q·n/√S)<sup>3/8</sup>",nf(c.tp.k,2)+" × "+nf(c.X,5)+"<sup>3/8</sup>","Despeje de Manning para canal "+c.tipo.toLowerCase()+" ("+c.tp.bt+").");
  t+=fila("Base del canal (b)",c.b,"m",3,c.tp.bt,c.tp.fb===2?"2 × "+nf(c.h,3):"b = "+nf(c.h,3),"Relación geométrica propia del tipo de canal.");
  t+=fila("Área mojada (Am)",c.Am,"m²",3,c.tp.amt,"Am = "+nf(c.Am,3),"Área de la sección transversal ocupada por el agua.");
  t+=fila("Perímetro mojado (Pm)",c.Pm,"m",3,c.tp.pmt,"Pm = "+nf(c.Pm,3),"Longitud de contacto del agua con las paredes.");
  t+=fila("Radio hidráulico (Rh)",c.Rh,"m",3,"R<sub>h</sub> = A<sub>m</sub> / P<sub>m</sub>",nf(c.Am,3)+" / "+nf(c.Pm,3),"Relación entre área y perímetro mojados.");
  t+=seccion("3. VELOCIDADES");
  t+=fila("Velocidad horizontal (Vo)",c.Vo,"m/s",3,"V<sub>o</sub> = Q / A<sub>m</sub>",nf(c.Q,4)+" / "+nf(c.Am,3),"Debe ser mayor o igual a "+nf(TR_STAR.R.VO_MIN,1)+" m/s.",c.Vo<TR_STAR.R.VO_MIN?"Vo es menor que "+nf(TR_STAR.R.VO_MIN,1)+" m/s; hay riesgo de sedimentación.":"","final");
  t+=fila("Área del fondo del canal",c.Af,"m²",3,"A<sub>fondo</sub> = b · L",nf(c.b,3)+" × "+nf(c.L,2),"Superficie en planta sobre la que se calcula la velocidad ascensional.");
  t+=fila("Velocidad ascensional (Va)",c.Va,"m/s",5,"V<sub>a</sub> = Q / (b · L)",nf(c.Q,4)+" / ("+nf(c.b,3)+" × "+nf(c.L,2)+")","Velocidad vertical del flujo sobre el área de fondo.","","final");
  return t;}

function aduListaK_STAR(t){
  if(!t.acc.lista.length) return "ΣKm = 0 (sin accesorios)";
  return t.acc.lista.map(function(a){return nf(a.k,2)+" × "+a.n;}).join(" + ")+" = "+nf(t.sumK,2);}

function aduFilasTub_STAR(t){
  var Q=t.Q, rg=DP_STAR.T.HW[PRO.tubMat];
  var x=seccion("1. DATOS Y DIÁMETRO TEÓRICO (HAZEN–WILLIAMS)");
  x+=fila("Caudal por tubería de aducción",Q,"m³/s",4,"Q<sub>t</sub> = QD · (%/100) / n<sub>tuberías</sub>",nf(PRO.Q.QDm3,4)+" × "+nf(PRO.aduPct,0)+" % / "+PRO.tubN,"Porcentaje del caudal de diseño que trata la aducción, repartido entre las tuberías en paralelo.");
  x+=fila("Coeficiente de Hazen–Williams (C)",t.C,"",0,"<i>Dato de entrada</i> — "+PRO.tubMat,"C = "+nf(t.C,0),"Rango de la tabla para "+PRO.tubMat+": "+(rg[0]===rg[1]?nf(rg[0],0):nf(rg[0],0)+" – "+nf(rg[1],0))+".");
  x+=filaDato("Pendiente (S)",t.S*100,"%",2,"Rango normativo "+nf(TR_STAR.R.PEND_ADU[0]*100,0)+" – "+nf(TR_STAR.R.PEND_ADU[1]*100,0)+" %.");
  x+=filaDato("Longitud de la tubería (L)",t.L,"m",2);
  x+=fila("Desnivel hallado (Δh)",t.Dh,"m",3,"Δh = S · L",nf(t.S,4)+" × "+nf(t.L,2),"Desnivel disponible antes de descontar pérdidas.");
  x+=fila("Diámetro teórico (D)",t.Dtin,"in",3,"D = (Q / (0,2785 · C · S<sup>0,54</sup>))<sup>1/2,63</sup>","("+nf(Q,4)+" / (0,2785 × "+nf(t.C,0)+" × "+nf(t.S,4)+"<sup>0,54</sup>))<sup>1/2,63</sup> = "+nf(t.Dt,4)+" m","Despeje de Hazen–Williams; 1 in = 0,0254 m.");
  if(aduDcomSug_STAR(t.Dtin)!==null) x+=fila("Diámetro comercial sugerido (catálogo PVC)",aduDcomSug_STAR(t.Dtin),"in",2,"Primer diámetro nominal ≥ D teórico","D teórico = "+nf(t.Dtin,3)+" in","Tabla de tubería PVC (Datos preliminares). Digítalo abajo como diámetro comercial.");
  x+=seccion("2. PÉRDIDAS CON EL DIÁMETRO COMERCIAL");
  x+=filaDato("Diámetro comercial adoptado",t.Din,"in",2,aduAutoOn_STAR()?(aduSelAuto_STAR("aduDinSel")?"Adoptado automáticamente: primer diámetro del catálogo PVC ≥ D teórico que deja desnivel disponible tras las pérdidas.":"Seleccionado por el usuario del catálogo PVC."):"Digitado por el usuario (no hay catálogo obligatorio).");
  x+=fila("Diámetro comercial (D)",t.D,"m",4,"D = Ø<sub>(in)</sub> × 0,0254",nf(t.Din,2)+" × 0,0254","Conversión de pulgadas a metros.");
  x+=fila("Área de la sección (A)",t.A,"m²",5,"A = π · D² / 4","π × "+nf(t.D,4)+"² / 4","Sección interior supuesta igual al diámetro comercial.");
  x+=fila("Velocidad (Vo)",t.V,"m/s",3,"V<sub>o</sub> = Q / A",nf(Q,4)+" / "+nf(t.A,5),"Velocidad media en la tubería (mínimo 0,5 m/s).",t.V<0.5?"Vo menor a 0,5 m/s: riesgo de sedimentación de arena (clase No. 3).":"");
  x+=fila("Pérdida por fricción (Hf)",t.Hf,"m",3,"H<sub>f</sub> = 10,67 · L · Q<sup>1,852</sup> / (C<sup>1,852</sup> · D<sup>4,87</sup>)","10,67 × "+nf(t.L,2)+" × "+nf(Q,4)+"<sup>1,852</sup> / ("+nf(t.C,0)+"<sup>1,852</sup> × "+nf(t.D,4)+"<sup>4,87</sup>)","Ecuación de Hazen–Williams en forma de pérdida.");
  x+=fila("Suma de coeficientes de accesorios (ΣKm)",t.sumK,"",2,"ΣKm = Σ (K · cantidad)",aduListaK_STAR(t),"Coeficientes K de la tabla de accesorios (Datos preliminares).");
  x+=fila("Pérdida por accesorios (Ha)",t.Ha,"m",3,"H<sub>a</sub> = ΣKm · V<sub>o</sub>² / (2g)",nf(t.sumK,2)+" × "+nf(t.V,3)+"² / (2 × 9,81)","g = 9,81 m/s².");
  x+=fila("Pérdida total (Ht)",t.Ht,"m",3,"H<sub>t</sub> = H<sub>f</sub> + H<sub>a</sub>",nf(t.Hf,3)+" + "+nf(t.Ha,3),"Pérdida total con el diámetro comercial inicial.","","final");
  return x;}

function aduFilasRec_STAR(t){
  var Q=t.Q;
  var x=seccion("1. DESNIVEL Y PENDIENTE NUEVOS");
  x+=fila("Desnivel nuevo (Δh nuevo)",t.Dhn,"m",3,"Δh<sub>nuevo</sub> = Δh<sub>hallado</sub> − H<sub>t</sub>",nf(t.Dh,3)+" − "+nf(t.Ht,3),"Desnivel que queda disponible para la tubería tras descontar las pérdidas.");
  x+=fila("Pendiente nueva (S nueva)",t.Sn*100,"%",3,"S<sub>nueva</sub> = Δh<sub>nuevo</sub> / L",nf(t.Dhn,3)+" / "+nf(t.L,2)+" = "+nf(t.Sn,5),"Se expresa como fracción en el cálculo y se muestra en %.");
  x+=fila("Diámetro teórico nuevo",t.Dtnin,"in",3,"D = (Q / (0,2785 · C · S<sub>nueva</sub><sup>0,54</sup>))<sup>1/2,63</sup>","("+nf(Q,4)+" / (0,2785 × "+nf(t.C,0)+" × "+nf(t.Sn,5)+"<sup>0,54</sup>))<sup>1/2,63</sup> = "+nf(t.Dtn,4)+" m","Redondea a un diámetro comercial y digítalo en la tarjeta anterior.");
  if(aduDcomSug_STAR(t.Dtnin)!==null) x+=fila("Diámetro comercial sugerido (catálogo PVC)",aduDcomSug_STAR(t.Dtnin),"in",2,"Primer diámetro nominal ≥ D teórico nuevo","D teórico nuevo = "+nf(t.Dtnin,3)+" in","Digítalo como diámetro comercial nuevo y revisa que cumpla la comprobación.");
  if(t.D2){
    x+=seccion("2. COMPROBACIÓN CON EL DIÁMETRO COMERCIAL NUEVO");
    x+=filaDato("Diámetro comercial nuevo",t.D2in,"in",2,aduAutoOn_STAR()?(aduSelAuto_STAR("aduDnSel")?"Adoptado automáticamente: primer diámetro del catálogo PVC ≥ D teórico nuevo que cumple Ht ≤ Δh.":"Seleccionado por el usuario del catálogo PVC."):"Digitado por el usuario.");
    x+=fila("Diámetro comercial nuevo (D)",t.D2,"m",4,"D = Ø<sub>(in)</sub> × 0,0254",nf(t.D2in,2)+" × 0,0254","Conversión de pulgadas a metros.");
    x+=fila("Área de la sección (A)",t.A2,"m²",5,"A = π · D² / 4","π × "+nf(t.D2,4)+"² / 4","");
    x+=fila("Velocidad (Vo)",t.V2,"m/s",3,"V<sub>o</sub> = Q / A",nf(Q,4)+" / "+nf(t.A2,5),"Velocidad que se usa en el golpe de ariete (mínimo 0,5 m/s).",t.V2<0.5?"Vo menor a 0,5 m/s: riesgo de sedimentación de arena (clase No. 3).":"");
    x+=fila("Pérdida por fricción (Hf)",t.Hf2,"m",3,"H<sub>f</sub> = 10,67 · L · Q<sup>1,852</sup> / (C<sup>1,852</sup> · D<sup>4,87</sup>)","10,67 × "+nf(t.L,2)+" × "+nf(Q,4)+"<sup>1,852</sup> / ("+nf(t.C,0)+"<sup>1,852</sup> × "+nf(t.D2,4)+"<sup>4,87</sup>)","");
    x+=fila("Pérdida por accesorios (Ha)",t.Ha2,"m",3,"H<sub>a</sub> = ΣKm · V<sub>o</sub>² / (2g)",nf(t.sumK,2)+" × "+nf(t.V2,3)+"² / (2 × 9,81)","");
    x+=fila("Pérdida total (Ht)",t.Ht2,"m",3,"H<sub>t</sub> = H<sub>f</sub> + H<sub>a</sub>",nf(t.Hf2,3)+" + "+nf(t.Ha2,3),"Pérdida total con el diámetro comercial nuevo.","","final");
    x+=fila("Verificación: Ht ≤ Δh hallado",t.ok2?"CUMPLE":"NO CUMPLE","",0,"H<sub>t</sub> ≤ Δh<sub>hallado</sub>",nf(t.Ht2,3)+(t.ok2?" ≤ ":" > ")+nf(t.Dh,3),"Las pérdidas con el diámetro nuevo deben poder cubrirse con el desnivel disponible.",t.ok2?"":"Las pérdidas superan el desnivel disponible; aumenta el diámetro.")}
  return x;}

function aduFilasGolpe_STAR(q,t){
  var x=seccion("GOLPE DE ARIETE");
  if(aduAutoOn_STAR()&&PRO.tubClasePVC) x+=fila("Clase de tubería adoptada","Clase "+PRO.tubClasePVC+" ("+DP_STAR.T.PSI_CLASE[PRO.tubClasePVC]+" PSI)","",0,"Menor clase con P<sub>dis</sub> ≤ P<sub>trab</sub> y P<sub>trab</sub> &gt; P<sub>est</sub>","1,30 × "+nf(t.Dh,2)+" = "+nf(t.Dh*1.3,2)+" ≤ "+nf(DP_STAR.T.PSI_CLASE[PRO.tubClasePVC]*0.703,2),(PRO.aduClSel==="Automático"||PRO.aduClSel===undefined?"Adoptada automáticamente del catálogo PVC.":"Seleccionada por el usuario del catálogo PVC.")+" El espesor y la presión nominal salen de la tabla de tubería PVC.");
  x+=fila("Espesor de pared (e) y presión nominal",q.e,"mm",1,"Catálogo PVC — Tabla 10","e = "+nf(q.e,1)+" mm · "+nf(q.psi,0)+" PSI · Ø ext = "+nf(q.De,1)+" mm","Valores leídos del catálogo para el diámetro y la clase adoptados.");
  x+=fila("Módulo de elasticidad del material (E)",q.E,"GPa",2,"Tabla RAS Título B.6.36 — "+PRO.tubE,"E = "+nf(q.E,2),"E del agua = 2,1 GPa.");
  x+=fila("Relación de módulos (K)",q.K,"",3,"K = E<sub>agua</sub> / E<sub>material</sub>","2,1 / "+nf(q.E,2),"");
  x+=fila("Diámetro interno (D<sub>int</sub>)",q.Dint,"mm",1,"D<sub>int</sub> = D<sub>ext</sub> − 2e",nf(q.De,1)+" − 2 × "+nf(q.e,1),q.deCat?"D<sub>ext</sub> real del catálogo de tubería PVC (Tabla 10 de la clase); coincide con el diámetro interior del catálogo.":"D<sub>ext</sub> = diámetro comercial digitado convertido a mm.");
  x+=fila("Celeridad de la onda (C)",q.Cc,"m/s",1,"C = 9900 / √(48,3 + K · D<sub>int</sub> / e)","9900 / √(48,3 + "+nf(q.K,3)+" × "+nf(q.Dint,1)+" / "+nf(q.e,1)+")","Velocidad de propagación de la onda de presión.");
  x+=fila("Tiempo crítico (T)",q.T,"s",3,"T = 2L / C","2 × "+nf(t.L,2)+" / "+nf(q.Cc,1),"Tiempo que tarda la onda en ir y volver.");
  x+=fila("Sobrepresión por cierre rápido (ha)",q.haR,"m.c.a.",2,"h<sub>a</sub> = C · V / g",nf(q.Cc,1)+" × "+nf(q.V,3)+" / 9,81","Aplica si el tiempo de maniobra es menor o igual a T.");
  if(q.tuso!==undefined){
    x+=fila("Tiempo de maniobra considerado",q.tuso,"s",3,q.manual?"<i>Dato de entrada</i>":"t = 2·L·V / (g · presión disponible)",q.manual?"t = "+nf(q.tuso,3):"Calculado en la verificación de presiones","Si no digitas un tiempo de maniobra, se usa el calculado.");
    x+=fila("Tipo de cierre",q.rapido?"Cierre rápido":"Cierre lento (Michaud)","",0,"t ≤ T → rápido; t &gt; T → lento",nf(q.tuso,3)+(q.rapido?" ≤ ":" > ")+nf(q.T,3),"Criterio de comparación con el tiempo crítico.");
    x+=fila("Sobrepresión adoptada (ha)",q.ha,"m.c.a.",2,q.rapido?"h<sub>a</sub> = C · V / g":"h<sub>a</sub> = 2 · L · V / (g · t)",q.rapido?nf(q.Cc,1)+" × "+nf(q.V,3)+" / 9,81":"2 × "+nf(t.L,2)+" × "+nf(q.V,3)+" / (9,81 × "+nf(q.tuso,3)+")","Fórmula de Michaud para cierre lento.");}
  x+=seccion("VERIFICACIÓN DE PRESIONES");
  x+=fila("Presión estática",q.Pest,"m.c.a.",2,"P<sub>est</sub> = Δh<sub>hallado</sub>","P = "+nf(q.Pest,2),"Desnivel del tramo antes de recalcular.");
  x+=fila("Presión de diseño",q.Pdis,"m.c.a.",2,"P<sub>dis</sub> = Δh<sub>hallado</sub> × 1,30",nf(q.Pest,2)+" × 1,30","Incluye un 30 % de sobrepresión. Debe ser menor o igual a la presión de trabajo.",q.okDis?"":"La presión de diseño supera la presión de trabajo: adopta una clase de mayor PSI.");
  x+=fila("Presión de trabajo de la tubería",q.Ptrab,"m.c.a.",2,"P<sub>trab</sub> = PSI<sub>clase</sub> × 0,703",nf(q.psi,0)+" × 0,703","Clase de la tubería digitada por el usuario.");
  x+=fila("Presión total sobre la válvula",q.Ptot,"m.c.a.",2,"P<sub>tot</sub> = h<sub>a</sub>(cierre rápido) + P<sub>est</sub>",nf(q.haR,2)+" + "+nf(q.Pest,2),"Debe ser menor o igual a la presión de trabajo.",q.ok?"":"La presión total supera la presión de trabajo: hay que recalcular el tiempo de maniobra de la válvula.");
  if(q.manual) x+=fila("Presión total con el tiempo de maniobra adoptado",q.Ptot2,"m.c.a.",2,"P<sub>tot</sub> = h<sub>a</sub>(adoptada) + P<sub>est</sub>",nf(q.ha,2)+" + "+nf(q.Pest,2),"Presión real sobre la válvula con el tiempo de cierre que digitaste.",q.okMan?"":"El tiempo adoptado es menor que el mínimo necesario.");
  x+=fila("Presión disponible para el golpe",q.Pdisp,"m.c.a.",2,"P<sub>disp</sub> = P<sub>trab</sub> − P<sub>est</sub>",nf(q.Ptrab,2)+" − "+nf(q.Pest,2),"");
  if(q.tcalc!==undefined) x+=fila("Tiempo de maniobra de la válvula (t)",q.tcalc,"s",3,"t = 2 · L · V / (g · P<sub>disp</sub>)","2 × "+nf(t.L,2)+" × "+nf(q.V,3)+" / (9,81 × "+nf(q.Pdisp,2)+")","Tiempo mínimo de cierre para no superar la presión de trabajo.","","final");
  return x;}


/* ==========================================================
   VISUALIZACION DEL MODULO ADUCCION
   ========================================================== */
function pintarAduccion_STAR(){
  var h='<div class="titulo"><h1>DISEÑO DE ADUCCIÓN</h1><p>Conducción entre la rejilla y el desarenador: canal abierto y tubería a presión con verificación de golpe de ariete.</p></div>'+CONV;
  if(!PRO.REJ){
    h+='<div class="aviso"><b>Falta el diseño de la rejilla.</b> La aducción continúa la secuencia a partir de la ventana de <i>Rejilla</i>.'+
       '<br><button onclick="irVista(\'rejilla_STAR\')">Ir a rejilla</button></div>';
    gid("pane-aduccion_STAR").innerHTML=h; return;
  }
  if(!PRO.Q){
    h+='<div class="aviso"><b>Falta el caudal de diseño.</b> Calcula primero la ventana de <i>Caudal de diseño</i>.'+
       '<br><button onclick="irVista(\'caudal_STAR\')">Ir a caudal de diseño</button></div>';
    gid("pane-aduccion_STAR").innerHTML=h; return;
  }
  var R=calcularAduccion_STAR();
  PRO.ADU=(R.canal||R.tub)?{Q:R.Qc,
    canal:R.canal?{tipo:R.canal.tipo,h:R.canal.h,b:R.canal.b,Vo:R.canal.Vo}:null,
    tub:R.tub?{Din:R.tub.Din,Dt:R.tub.Dtin,Ht:R.tub.Ht}:null}:null;
  guardarPro(); actualizarEstados();
  h+=cardDistAdu_STAR(R);
  if(R.distErr.length){ gid("pane-aduccion_STAR").innerHTML=h; return; }

  /* ---- 1. CANAL ---- */
  h+='<div class="card"><div class="card-title">1. Canal de aducción</div>'+
     '<div class="card-sub">Canal abierto dimensionado con Manning. La pendiente se digita en % y debe estar entre 14 y 16 %.</div>'+
     '<div class="card-subtitle" style="font-weight:700;color:#166534;margin:14px 0 8px">1. Parámetros de canal de aducción</div>'+ '<div class="row">'+selec("Tipo de canal","aduTipo",Object.keys(DP_STAR.T.CANAL))+campo("Longitud L (m)","aduL","number",'step="0.1"')+
     campoPct("Pendiente S","aduS",'step="0.1"')+selec("Material (define n)","aduMat",Object.keys(DP_STAR.T.MANNING))+
     campo("Borde libre BL (m)","aduBL","number",'step="0.05"')+'</div>'+aduBotones_STAR('canal')+'</div>';
  if(!R.canalErr.length){
    h+='<div class="card"><div class="card-title">Esquemas del canal de aducción</div><div class="card-sub">Sección transversal y perfil lateral longitudinal, con dimensiones derivadas de los parámetros calculados.</div><div class="svg-wrap" style="text-align:center">'+svgCanalAdu_STAR(R.canal)+'</div><div class="svg-wrap" style="text-align:center">'+svgCanalPerfil_STAR(R.canal)+'</div></div>';
    h+=aduMemoCard_STAR("Memoria de cálculo — canal",aduFilasCanal_STAR(R.canal)); }

  /* ---- 2. TUBERÍA ---- */
  var rg=DP_STAR.T.HW[PRO.tubMat], lstAcc=["-"].concat(Object.keys(DP_STAR.T.ACCESORIOS).reduce(function(a,g){return a.concat(Object.keys(DP_STAR.T.ACCESORIOS[g]));},[]));
  var filasAcc='';
  for(var i=1;i<=5;i++) filasAcc+='<div class="row">'+selec("Accesorio "+i,"acc"+i,lstAcc)+campo("Cantidad","acc"+i+"n","number",'step="1" min="0"')+'</div>';
  h+='<div class="card"><div class="card-title">2. Tubería de aducción</div>'+
     '<div class="card-sub">Tubería a presión con Hazen–Williams. Con PVC, el diámetro comercial se elige del catálogo en Automático o a mano; con otros materiales lo digitas. Accesorios por defecto: tee + 2 codos de 90° + válvula de bola.</div>'+
     '<div class="card-subtitle" style="font-weight:700;color:#166534;margin:14px 0 8px">2. Parámetros de tubería de aducción</div>'+ '<div class="row">'+selec("Material de la tubería","tubMat",Object.keys(DP_STAR.T.HW))+
     campo("Coeficiente C (rango "+(rg[0]===rg[1]?nf(rg[0],0):nf(rg[0],0)+" – "+nf(rg[1],0))+")","tubC","number",'step="1"')+
     campoPct("Pendiente S","tubS",'step="0.1"')+campo("Longitud L (m)","tubL","number",'step="0.1"')+
     selecDiamPVC_STAR("Diámetro comercial (in)","tubDin")+'</div>'+filasAcc+aduBotones_STAR('tuberia')+'</div>';
  if(!R.tubErr.length||R.tub){
    h+='<div class="card"><div class="card-title">Esquema de la tubería</div><div class="svg-wrap">'+svgTuberiaAdu_STAR(R.tub)+'</div><div class="svg-wrap">'+svgSeccionTub_STAR(R.tub,R.gol)+'</div></div>';
    h+=aduMemoCard_STAR("Memoria de cálculo — tubería",aduFilasTub_STAR(R.tub));

  /* ---- 3. RECALCULAMOS CON LAS PÉRDIDAS ---- */
    h+='<div class="card"><div class="card-title">3. Recalculamos con las pérdidas</div>'+
       '<div class="card-sub">Se descuentan las pérdidas del desnivel disponible y se obtiene el diámetro teórico nuevo. Elige el diámetro y la clase en Automático o fija el que quieras. El diámetro exterior, el espesor, la presión nominal y demás valores se leen del catálogo y se muestran en la memoria de cálculo.</div>'+
       '<div class="row">'+selecDiamPVC_STAR("Diámetro comercial nuevo (in)","tubDnuevo")+
       (PRO.tubMat==="PVC"?selecClasePVC_STAR():
        campoExteriorPVC_STAR()+selec("Material (módulo de elasticidad)","tubE",Object.keys(DP_STAR.T.ELAST_GPA))+
        campoLecturaPVC_STAR("Espesor de pared e (mm)","tubEsp")+campoLecturaPVC_STAR("Presión nominal (PSI)","tubPSI")+
        campo("Tiempo de maniobra adoptado (s) — opcional","tubTman","number",'step="0.1"'))+'</div>'+aduBotones_STAR('perdidas')+'</div>';
        if(!R.tubErr.length){
      if(R.auto&&R.auto.Dnuevo!==null) h+='<div class="link-ok">Adoptado: diámetro inicial <b>'+nf(R.auto.Din,2)+' in</b> (teórico '+nf(R.auto.Dtin,2)+' in) → diámetro adoptado <b>'+nf(R.auto.Dnuevo,2)+' in</b> (teórico nuevo '+nf(R.auto.Dtnin,2)+' in)'+(R.auto.clase?' · clase <b>'+R.auto.clase+' ('+DP_STAR.T.PSI_CLASE[R.auto.clase]+' PSI)</b>':'')+'.</div>';
      h+=aduMemoCard_STAR("Memoria de cálculo — comprobación final",aduFilasRec_STAR(R.tub));
      if(!R.tub.D2) h+='<div class="aviso">Digita el <b>diámetro comercial nuevo</b> para completar la comprobación y verificar el golpe de ariete.</div>';
      else if(R.golErr.length) { /* Detalles disponibles en Revisión de errores. */ }
      else if(R.gol){
        var g0=R.gol;
        if(!g0.okDis) { /* Detalle disponible en Revisión de errores. */ }
        if(g0.ok) h+='<div class="link-ok">Verificación de presiones: la presión total sobre la válvula (<b>'+nf(g0.Ptot,2)+' m.c.a.</b>) es menor o igual a la presión de trabajo (<b>'+nf(g0.Ptrab,2)+' m.c.a.</b>).</div>';
        else if(g0.manual&&g0.okMan) h+='<div class="link-ok">Con el tiempo de maniobra adoptado (<b>t = '+nf(g0.tuso,3)+' s</b>, mínimo '+nf(g0.tcalc,3)+' s) el cierre es '+(g0.rapido?'rápido':'lento')+', la sobrepresión se limita a <b>'+nf(g0.ha,2)+' m.c.a.</b> y la presión total (<b>'+nf(g0.Ptot2,2)+' m.c.a.</b>) es menor o igual a la presión de trabajo (<b>'+nf(g0.Ptrab,2)+' m.c.a.</b>).</div>';
        else if(g0.manual) { /* Detalle disponible en Revisión de errores. */ }
        else { /* Detalle disponible en Revisión de errores. */ }
        h+=aduMemoCard_STAR("Memoria de cálculo — golpe de ariete",aduFilasGolpe_STAR(R.gol,R.tub));
      }
    }
  }
  gid("pane-aduccion_STAR").innerHTML=h;}

registrarMemoria({ins:["Tipo de canal","Material","Tipo de cierre"]});

MODULOS.push({
  id:"aduccion_STAR",
  titulo:"Aducción",
  descripcion:"Conducción por canal y tubería entre la rejilla y el desarenador, con verificación de golpe de ariete.",
  grupo:"hidraulico", orden:6, icono:"m1", iconoSvg:"<path d=\"M3 9h14l-3-3\"/><path d=\"M21 15H7l3 3\"/>",
  valores:{"aduPct": 100, "aduNCan": 1, "tubN": 1, "aduTipo": "Rectangular", "aduL": "", "aduS": "", "aduMat": "Concreto liso", "aduBL": "", "tubMat": "PVC", "tubC": "", "tubS": "", "tubL": "", "tubDin": "", "acc1": "Tee paso directo roscado", "acc1n": 1, "acc2": "Codo radio corto 90° con bridas", "acc2n": 2, "acc3": "Válvula de bola totalmente abierta", "acc3n": 1, "acc4": "-", "acc4n": "", "acc5": "-", "acc5n": "", "tubDnuevo": "", "tubE": "PVC", "tubEsp": "", "tubPSI": "", "tubTman": "", "tubClasePVC": "", "aduDinSel": "Automático", "aduDnSel": "Automático", "aduClSel": "Automático", "ADU": null},
  indicador:true, imprimible:true,
  normalizar:function(PRO){
    if(esVacio(PRO.aduS)) PRO.aduS=0.15; if(esVacio(PRO.aduBL)) PRO.aduBL=0.4;
    if(esVacio(PRO.tubS)) PRO.tubS=0.15; if(esVacio(PRO.tubC)) PRO.tubC=140;
  },
  completo:function(PRO){return !!PRO.ADU;},
  pintar:pintarAduccion_STAR,
  recalcular:function(){recalcularAduccion_STAR("general");},
  errores:function(){return avisosRangoAduccion_STAR("general");}
});