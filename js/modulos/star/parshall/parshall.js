/* ##########################################################
   STAR · SISTEMAS DE TRATAMIENTO DE AGUA RESIDUAL
   MÓDULO CANALETA PARSHALL  (posición 8 en el menú) — parshall.js
   Cálculo de la canaleta: ancho de garganta, resalto hidráulico, gradiente de velocidad y elevación de la cresta.
   Sufijo: las funciones y variables globales de este archivo terminan en _STAR
   (así no chocan con los módulos de STAP, IHS o RS que tengan el mismo nombre).
   ########################################################## */
// Dependencias: PRO.Q; DP_STAR.T.VISC y tablas de canaleta; dibujos comunes y parshall_svg.js.
/* ==========================================================
   MÓDULO — CANALETA PARSHALL
   ========================================================== */



/* Sumergencia máxima Hb/Ha según el ancho de garganta (id en pulgadas) */
function parSmax_STAR(f){var p=Number(f.id);return p<=9?0.6:0.7;}

/* Clasificación del resalto según Fr */
function parResalto_STAR(Fr){
  if(Fr<1)return "No se forma resalto (flujo subcrítico)";
  if(Fr===1)return "No se forma resalto (flujo crítico)";
  if(Fr<=1.7)return "Resalto Ondulante";
  if(Fr<=2.5)return "Resalto Débil";
  if(Fr<=4.5)return "Resalto Oscilante";
  if(Fr<=9)return "Resalto Estable";
  return "Resalto Fuerte";}
function parFrOk_STAR(Fr){return (Fr>1.7&&Fr<=2.5)||(Fr>4.5&&Fr<=9);}

/* Viscosidad dinámica del agua: interpola la tabla DP_STAR.T.VISC (ν en ×10⁻⁶ m²/s) y multiplica por ρ = 1000 kg/m³ */
function parMu_STAR(T){
  var t=(typeof DP_STAR.T.VISC!=="undefined"&&DP_STAR.T.VISC.length)?DP_STAR.T.VISC:null,nu;
  if(!t){nu=4.34565e-5/(T+23.3);}
  else if(T<=t[0][0]){nu=t[0][1]*1e-6;}
  else if(T>=t[t.length-1][0]){nu=t[t.length-1][1]*1e-6;}
  else{for(var i=1;i<t.length;i++){if(T<=t[i][0]){var a=t[i-1],b=t[i];nu=(a[1]+(b[1]-a[1])*(T-a[0])/(b[0]-a[0]))*1e-6;break;}}}
  return {nu:nu,mu:nu*1000};}

/* ---------- Valores por defecto de los campos de entrada ---------- */
function parDefaults_STAR(){
  var d={parPct:100,parN:1,parW:"auto",parHaW:0.8,parT:25,parBL:0.30};
  for(var k in d){if(PRO[k]===undefined||PRO[k]===null||PRO[k]==="")PRO[k]=d[k];}
  if(PRO.parW!=="auto"&&!DP_STAR.T.PAR.some(function(f){return f.id===PRO.parW;}))PRO.parW="auto";}

/* ---------- Lectura y validación de las entradas ---------- */
function parContexto_STAR(){
  parDefaults_STAR();
  var E=[],pct=Number(PRO.parPct),n=Number(PRO.parN),haW=Number(PRO.parHaW),T=Number(PRO.parT),BL=Number(PRO.parBL);
  if(!PRO.Q||!(PRO.Q.QDm3>0))E.push("Falta el caudal de diseño. Calcula primero la ventana de Caudal de diseño.");
  if(!(pct>0&&pct<=100))E.push("El porcentaje del caudal de diseño debe estar entre 1 y 100 %.");
  if(!(n>=1)||n!==Math.floor(n))E.push("El número de canaletas debe ser un entero mayor o igual a 1.");
  if(!(haW>=0.4&&haW<=0.8))E.push("La relación Ha/W objetivo con dispositivo debe estar entre 0,4 y 0,8.");
  if(!(T>=0&&T<=100))E.push("La temperatura del agua debe estar entre 0 y 100 °C.");
  if(!(BL>=0))E.push("El borde libre no puede ser negativo.");
  if(E.length)return {err:E};
  return {Q:PRO.Q.QDm3*pct/100/n,QD:PRO.Q.QDm3,pct:pct,nU:n,o:{haW:haW,T:T,BL:BL}};}

/* ---------- Cálculo completo para un ancho de garganta (pasos 3 a 18 de la clase) ---------- */
function parCalcular_STAR(f,Q,o){
  var g=9.81,gam=9810,W=f.W,C=f.C/100,D=f.D/100,N=f.N/100,Kd=f.Kd/100,Gd=f.G/100,Qls=Q*1000;
  var haNat=Math.pow(Q/f.K,1/f.n),rNat=haNat/W,disp=!(rNat>=0.4-1e-9&&rNat<=0.8+1e-9);
  var ha=disp?o.haW*W:haNat;
  var Wa=2/3*(D-W)+W,Va=Q/(Wa*ha),E1=Va*Va/(2*g)+ha+N;
  var hc=Math.pow(Q*Q/(g*W*W),1/3);
  if(E1<1.5*hc)return {err:["Con W = "+f.lab+" la energía disponible E1 = "+nf(E1,3)+" m es menor que la energía mínima 1,5·hc = "+nf(1.5*hc,3)+" m: no existe flujo supercrítico en la garganta. Prueba otro ancho de garganta."]};
  var lo=1e-6,hi=hc,i,mid;
  for(i=0;i<200;i++){mid=(lo+hi)/2;if(Q*Q/(2*g*W*W*mid*mid)+mid-E1>0)lo=mid;else hi=mid;}
  var h2=(lo+hi)/2,V2=Q/(W*h2),Fr=V2/Math.sqrt(g*h2);
  var hb=h2-N,S=hb/ha,Smax=parSmax_STAR(f);
  var h3h2=0.5*(Math.sqrt(1+8*Fr*Fr)-1),h3=h3h2*h2,h4=h3-(N-Kd);
  if(!(h4>0))return {err:["Con W = "+f.lab+" la lámina al final de la canaleta h4 = "+nf(h4,3)+" m no es positiva. Prueba otro ancho de garganta."]};
  var V3=Q/(W*h3),V4=Q/(C*h4),Vm=(V3+V4)/2,td=Gd/Vm;
  var dh=E1-V4*V4/(2*g)-h4-N+Kd,vis=parMu_STAR(o.T),Gv=dh>0?Math.sqrt(gam*dh/(vis.mu*td)):NaN;
  var Bs=C,h5=E1,V5=Q/(Bs*h5),X=h5-h4,Xr=1.1*X,L=6*(h3-h2);
  var rango=f.Qmin==null?null:(Qls>=f.Qmin&&Qls<=f.Qmax),haW=ha/W;
  var ok={rango:rango,haW:haW>=0.4-1e-9&&haW<=0.8+1e-9,V2:V2>2,V5:V5>0.75,Fr:parFrOk_STAR(Fr),hc:(h2<hc&&hc<h3),S:S<Smax,td:td<1,G:Gv>=1000&&Gv<=2000,X:X>=0};
  return {f:f,Q:Q,Qls:Qls,W:W,C:C,D:D,N:N,Kd:Kd,Gd:Gd,haNat:haNat,rNat:rNat,disp:disp,ha:ha,haW:haW,Wa:Wa,Va:Va,E1:E1,hc:hc,h2:h2,V2:V2,Fr:Fr,tipo:parResalto_STAR(Fr),
    hb:hb,S:S,Smax:Smax,h3h2:h3h2,h3:h3,h4:h4,V3:V3,V4:V4,Vm:Vm,td:td,dh:dh,mu:vis.mu,nu:vis.nu,T:o.T,Gv:Gv,Bs:Bs,h5:h5,V5:V5,X:X,Xr:Xr,L:L,BL:o.BL,ok:ok};}

/* ---------- Análisis: evalúa todos los anchos y elige W (automático o manual) ---------- */
function parAnalizar_STAR(){
  var c=parContexto_STAR();if(c.err)return c;
  var lista=DP_STAR.T.PAR.map(function(f){
    var r=parCalcular_STAR(f,c.Q,c.o),rango=f.Qmin==null?null:(c.Q*1000>=f.Qmin&&c.Q*1000<=f.Qmax);
    var cumple=!r.err&&rango===true&&r.ok.haW&&r.ok.V2&&r.ok.Fr&&r.ok.hc;
    return {f:f,r:r,rango:rango,cumple:cumple};});
  var auto=PRO.parW==="auto",sel=null,fallback=false;
  if(auto){
    sel=lista.filter(function(x){return x.cumple;})[0]||null;
    if(!sel){sel=lista.filter(function(x){return x.rango===true&&!x.r.err;})[0]||null;fallback=!!sel;}
    if(!sel)return {err:["El caudal por canaleta ("+nf(c.Q*1000,2)+" L/s) no cabe en ningún ancho de garganta de la tabla con solución hidráulica. Revisa el caudal o aumenta el número de canaletas."],c:c,lista:lista};
  }else{sel=lista.filter(function(x){return x.f.id===PRO.parW;})[0];}
  return {c:c,lista:lista,sel:sel,auto:auto,fallback:fallback};}

function parRevision_STAR(){
  var e=[],a=null;
  try{a=parAnalizar_STAR();}catch(err){e.push("No fue posible completar el cálculo de la canaleta Parshall. Revisa los datos ingresados.");}
  if(a&&a.err){a.err.forEach(function(m){e.push(m);});}
  else if(a){
    var s=a.sel,f=s.f,r=s.r;
    if(r.err){r.err.forEach(function(m){e.push(m);});}
    else{
      if(r.ok.rango===false)e.push("El caudal por canaleta ("+nf(r.Qls,2)+" L/s) está fuera del rango de W = "+f.lab+" ("+nf(f.Qmin,2)+" – "+nf(f.Qmax,2)+" L/s). Sugerencia: elige otro ancho o cambia el número de canaletas.");
      if(r.disp)e.push("Ha/W = "+nf(r.rNat,2)+" (fuera de 0,4–0,8). Se adoptó Ha = "+nf(PRO.parHaW,2)+"·W = "+nf(r.ha,3)+" m, lo que exige colocar un dispositivo en el canal convergente que fije esa lámina.");
      if(!r.ok.V2)e.push("V2 = "+nf(r.V2,2)+" m/s no cumple V2 > 2 m/s (RAS). Sugerencia: prueba un ancho de garganta menor.");
      if(!r.ok.V5)e.push("V5 = "+nf(r.V5,2)+" m/s no cumple V5 > 0,75 m/s. Sugerencia: prueba otro ancho de garganta (V5 = Q/(C·h5), con C y h5 = E1 definidos por la canaleta).");
      if(!r.ok.Fr)e.push("Fr = "+nf(r.Fr,2)+" ("+r.tipo.toLowerCase()+"). Debe estar entre 1,7–2,5 (débil) ó 4,5–9,0 (estable) y fuera de 2,5–4,5. Sugerencia: prueba otro ancho de garganta (ver tabla de comparación).");
      if(!r.ok.hc)e.push("No se cumple h2 < hc < h3 ("+nf(r.h2,3)+" / "+nf(r.hc,3)+" / "+nf(r.h3,3)+" m).");
      if(!r.ok.S)e.push("Sumergencia S = "+nf(r.S,2)+" ≥ "+nf(r.Smax,1)+": la canaleta no funciona como aforador de descarga libre.");
      if(!r.ok.td)e.push("El tiempo medio de mezcla td = "+nf(r.td,2)+" s debe ser menor de 1 s.");
      if(!r.ok.G)e.push("El gradiente de velocidad G = "+nf(r.Gv,0)+" s⁻¹ está fuera de 1000–2000 s⁻¹ (mezclador hidráulico). Depende de la temperatura del agua (viscosidad) y del ancho de garganta.");
      if(!r.ok.X)e.push("X = "+nf(r.X,3)+" m es negativo: h5 = E1 ("+nf(r.h5,3)+" m) es menor que h4 ("+nf(r.h4,3)+" m). Prueba otro ancho de garganta.");
    }
    if(a.fallback)e.push("Ningún ancho de la tabla cumple todos los criterios de mezcla con este caudal; se muestra el menor ancho con solución dentro de su rango de caudal.");
  }
  abrirRevision("Canaleta Parshall",e);}

function recalcularParshall_STAR(){
  var c=parContexto_STAR();
  if(c.err){abrirAdvertencia("Advertencia — Canaleta Parshall",c.err);return;}
  pintarParshall_STAR();}

/* ---------- Distribución del caudal (mismo esquema que rejilla y desarenador) ---------- */
function tarjetaDistribucionPar_STAR(){
  parDefaults_STAR();
  var pct=Number(PRO.parPct),n=Number(PRO.parN),valido=pct>0&&pct<=100&&n>=1&&n===Math.floor(n)&&PRO.Q&&PRO.Q.QDm3>0;
  var resumen=valido?'<div class="link-ok" style="margin-top:0">Caudal total: <b>'+nf(PRO.Q.QD,0)+' L/s</b> · la canaleta trata el <b>'+nf(pct,0)+' %</b> = <b>'+nf(PRO.Q.QDm3*pct/100*1000,2)+' L/s</b><br>Distribuido en <b>'+n+' canaleta(s)</b>: <b>'+nf(PRO.Q.QDm3*pct/100/n*1000,2)+' L/s</b> ('+nf(PRO.Q.QDm3*pct/100/n,4)+' m³/s) por unidad</div>':'<div class="aviso">Verifica el porcentaje (1–100 %) y el número entero de canaletas (mínimo 1) para distribuir el caudal.</div>';
  return '<div class="card"><div class="card-title">Distribución del caudal</div><div class="card-sub">Define qué porcentaje del caudal total pasa por la canaleta Parshall y cómo se reparte entre unidades en paralelo.</div><div class="row">'+campo("% del caudal de diseño que trata la canaleta","parPct","number",'step="1" min="1" max="100"')+campo("Número de canaletas","parN","number",'step="1" min="1"')+'</div>'+resumen+'<div class="acciones"><button class="btn btn-primary" style="width:auto;padding:0 22px" onclick="recalcularParshall_STAR()">RECALCULAR DISTRIBUCIÓN</button></div></div>';}

function parSelW_STAR(){
  var o='<option value="auto"'+(PRO.parW==="auto"?' selected':'')+'>Automático</option>'+
    DP_STAR.T.PAR.map(function(f){return '<option value="'+f.id+'"'+(PRO.parW===f.id?' selected':'')+'>'+f.lab+' ('+nf(f.W,3)+' m)</option>';}).join('');
  return '<div class="campo"><label>Ancho de la garganta W</label><select onchange="setPro(\'parW\',this,false)">'+o+'</select></div>';}

/* ---------- Tarjetas de resultados ---------- */
/* Estilos propios de la tabla de selección (se inyectan una sola vez) */
function parCSS_STAR(){
  if(gid("par-css"))return;
  var st=document.createElement("style");st.id="par-css";
  st.textContent=".par-wrap{padding:0 20px 14px;overflow-x:auto}"+
   ".par-tab{width:100%;border-collapse:separate;border-spacing:0;font-size:12.5px}"+
   ".par-tab th{background:var(--verde-oscuro);color:#fff;font-size:11px;font-weight:700;padding:9px 12px;text-align:right;white-space:nowrap}"+
   ".par-tab th:first-child{border-radius:8px 0 0 0;text-align:left}.par-tab th:last-child{border-radius:0 8px 0 0}"+
   ".par-tab th.l,.par-tab td.l{text-align:left}"+
   ".par-tab td{padding:10px 12px;text-align:right;white-space:nowrap;border-bottom:1px solid var(--borde)}"+
   ".par-tab td.w{text-align:left;font-weight:700}"+
   ".par-tab td.est{white-space:normal;min-width:190px;line-height:1.4}"+
   ".par-tab tr.sel td{background:var(--verde-claro)}"+
   ".par-tab tr.off td{color:#94A3B8}"+
   ".par-tab td.bad{color:#B45309;font-weight:700}"+
   ".par-chip{display:inline-block;padding:2px 10px;border-radius:20px;font-size:11px;font-weight:700}"+
   ".par-chip.ok{background:var(--verde-claro);color:var(--verde-oscuro)}"+
   ".par-chip.no{background:#FEF3C7;color:#92400E}"+
   ".par-chip.na{background:#F1F5F4;color:var(--gris)}"+
   ".par-mot{display:block;margin-top:3px;font-size:11px;color:#92400E;font-weight:600}"+
   ".par-usar{border:1px solid var(--verde);background:#fff;color:var(--verde-oscuro);border-radius:7px;height:28px;padding:0 12px;font-family:inherit;font-size:11.5px;font-weight:700;cursor:pointer}"+
   ".par-usar:hover{background:var(--verde-claro)}"+
   ".par-leyenda{display:flex;flex-wrap:wrap;gap:6px 18px;padding:0 20px 14px;font-size:11px;color:var(--gris)}";
  document.head.appendChild(st);}

function parUsarW_STAR(id){PRO.parW=id;guardarPro();pintarParshall_STAR();}

/* ---------- Tabla de selección del ancho de garganta ---------- */
function parTablaComparacion_STAR(a){
  parCSS_STAR();
  var Qls=a.c.Q*1000,nOk=a.lista.filter(function(x){return x.cumple;}).length;
  var filas=a.lista.filter(function(x){return x.f.Qmin!=null;}).map(function(x){
    var f=x.f,r=x.r,sel=(f.id===a.sel.f.id),rango=(x.rango===true);
    var rangoTxt=nf(f.Qmin,2)+' – '+nf(f.Qmax,2);
    var cls=sel?'sel':(rango?'':'off'),td,est,acc='';
    if(!rango){
      td='<td>—</td><td>—</td><td>—</td><td>—</td><td>—</td><td class="l">—</td>';
      est='<span class="par-chip na">Q fuera de rango</span>';
    }else if(r.err){
      td='<td>—</td><td>—</td><td>—</td><td>—</td><td>—</td><td class="l">—</td>';
      est='<span class="par-chip no"> Sin solución</span><span class="par-mot">E1 &lt; 1,5·hc: no hay flujo supercrítico</span>';
    }else{
      var mot=[];
      if(!r.ok.V2)mot.push('V2 ≤ 2 m/s');
      if(!r.ok.Fr)mot.push('Fr fuera de rango ('+r.tipo.replace('Resalto ','resalto ')+')');
      if(!r.ok.hc)mot.push('hc fuera de h2–h3');
      td='<td>'+nf(r.haNat,3)+'</td><td>'+nf(r.rNat,2)+'</td><td>'+nf(r.ha,3)+(r.disp?'':'')+'</td><td'+(r.ok.V2?'':' class="bad"')+'>'+nf(r.V2,2)+'</td><td'+(r.ok.Fr?'':' class="bad"')+'>'+nf(r.Fr,2)+'</td><td class="l'+(r.ok.Fr?'':' bad')+'">'+r.tipo.replace('Resalto ','')+'</td>';
      est=x.cumple?'<span class="par-chip ok"> Cumple</span>':'<span class="par-chip no"> No cumple</span>';}

    if(rango&&!r.err)acc=sel?'<span class="par-chip ok">En uso</span>':'<button class="par-usar" onclick="parUsarW_STAR(\''+f.id+'\')">Usar</button>';
    return '<tr class="'+cls+'"><td class="w">'+f.lab+' <span style="font-weight:400;color:var(--gris)">('+nf(f.W,3)+' m)</span></td><td>'+rangoTxt+'</td>'+td+'<td class="l est">'+est+'</td><td>'+acc+'</td></tr>';}).join('');
  var msg=a.auto?(a.fallback?'Ningún ancho cumple todos los criterios de mezcla con este caudal; se tomó el menor con solución dentro de su rango. Prueba dividir el caudal en más canaletas o revisa Ha/W objetivo.':'Selección automática: <b>W = '+a.sel.f.lab+' ('+nf(a.sel.f.W,3)+' m)</b>.'+(nOk>1?' Hay '+nOk+' anchos que cumplen; puedes elegir otro con el botón "Usar".':'')):'Ancho elegido manualmente: <b>W = '+a.sel.f.lab+' ('+nf(a.sel.f.W,3)+' m)</b>. '+(a.sel.cumple?'Cumple los criterios de mezcla.':'No cumple los criterios de mezcla; revisa la columna Estado.')+' <button class="par-usar" onclick="parUsarW_STAR(\'auto\')">Volver a automático</button>';
  return '<div class="card"><div class="card-title">Selección del ancho de garganta (W)</div>'+
    '<div class="card-sub">No todos los anchos sirven para un mismo caudal: la elección de W es una decisión de diseño. Se evalúan los anchos de la tabla para Q = '+nf(Qls,2)+' L/s por canaleta, con Ha = '+nf(a.c.o.haW,2)+'·W cuando Ha/W queda fuera de 0,4–0,8.</div>'+
    '<div class="par-wrap"><table class="par-tab"><tr><th>Ancho W</th><th>Rango de Q (L/s)</th><th>Ha calculado (m)</th><th>Ha/W</th><th>Ha usado (m)</th><th>V2 (m/s)</th><th>Fr</th><th class="l">Resalto</th><th class="l">Estado</th><th></th></tr>'+filas+'</table></div>'+
    '<div class="par-leyenda"><span></span><span>Criterios: V2 &gt; 2 m/s · Fr 1,7–2,5 ó 4,5–9,0 · h2 &lt; hc &lt; h3</span></div>'+
    '<div class="link-ok">'+msg+'</div></div>';}


/* ---------- Memoria de cálculo (numeración de las diapositivas) ---------- */
function parFilas_STAR(a){
  var s=a.sel,f=s.f,r=s.r,c=a.c,x;
  x=seccion("1. ANCHO DE LA GARGANTA (W)");
  x+=fila("Caudal por canaleta (Q)",c.Q,"m³/s",4,"Q = Q<sub>D</sub> · (%/100) / n",nf(c.QD,4)+" × "+nf(c.pct,0)+" % / "+c.nU,"Porcentaje del caudal de diseño que trata cada canaleta.");
  x+=fila("Caudal por canaleta (L/s)",r.Qls,"L/s",2,"Q<sub>(L/s)</sub> = Q<sub>(m³/s)</sub> · 1000",nf(c.Q,4)+" × 1000","Se pasa a L/s para entrar a la tabla de límites de caudal.");
  x+=fila("Ancho de la garganta (W)",f.W,"m",3,"W de la tabla de límites de caudal ("+(a.auto?"selección automática":"selección manual")+")",f.lab+" · rango "+(f.Qmin==null?"sin límites en la tabla":nf(f.Qmin,2)+" – "+nf(f.Qmax,2)+" L/s"),"","","final");
  x+=fila("Caudal dentro del rango de W",r.ok.rango===null?"SIN LÍMITES":(r.ok.rango?"CUMPLE":"NO CUMPLE"),"",0,"Q<sub>mín</sub> ≤ Q ≤ Q<sub>máx</sub>",f.Qmin==null?"La tabla de la clase no trae límites para este ancho":nf(f.Qmin,2)+" ≤ "+nf(r.Qls,2)+" ≤ "+nf(f.Qmax,2),"");
  x+=seccion("2. DIMENSIONES DE LA CANALETA");
  x+=filaDato("Coeficiente de la canaleta (K)",f.K,"",3,"Tabla de coeficientes K y n.");
  x+=filaDato("Exponente (n)",f.n,"",3,"Tabla de coeficientes K y n.");
  [["Longitud de la pared convergente (A)",f.A],["Longitud axial del convergente (B)",f.B],["Ancho de la salida (C)",f.C],["Ancho de la entrada (D)",f.D],["Profundidad de la canaleta (E)",f.E],["Longitud de la garganta (F)",f.F],["Longitud del divergente (G)",f.G],["Altura final del divergente (K)",f.Kd],["Caída del fondo en la garganta (N)",f.N]].forEach(function(p){
    x+=filaDato(p[0],p[1]/100,"m",3,"Tabla de dimensiones típicas (cm → m).");});
  x+=seccion("3. LÁMINA DE AGUA (ha)");
  x+=fila("Altura calculada (ha)",r.haNat,"m",3,"h<sub>a</sub> = (Q / K)<sup>1/n</sup>","("+nf(c.Q,4)+" / "+nf(f.K,3)+")<sup>1/"+nf(f.n,3)+"</sup>","De Q = K · h<sub>a</sub><sup>n</sup>.");
  x+=fila("Relación Ha/W",r.rNat,"",2,"H<sub>a</sub> / W (debe estar entre 0,4 y 0,8)",nf(r.haNat,3)+" / "+nf(r.W,3),"Primera premisa para que funcione como mezclador (H<sub>a</sub> = h<sub>a</sub>).");
  x+=fila("Dispositivo en el convergente",r.disp?"SÍ — Ha = "+nf(a.c.o.haW,2)+" · W":"NO","",0,"Si H<sub>a</sub>/W queda fuera de 0,4–0,8: H<sub>a</sub> = "+nf(a.c.o.haW,2)+" · W",r.disp?nf(r.rNat,2)+" fuera de 0,4–0,8":"Ha/W natural cumple","Se coloca un dispositivo que obligue la lámina adecuada.");
  x+=fila("Altura adoptada (ha)",r.ha,"m",3,r.disp?"h<sub>a</sub> = "+nf(a.c.o.haW,2)+" · W":"h<sub>a</sub> = (Q / K)<sup>1/n</sup>",r.disp?nf(a.c.o.haW,2)+" × "+nf(r.W,3):"Se mantiene la lámina natural","");
  x+=seccion("4. SECCIÓN MEDIA (Wa)");
  x+=fila("Sección media (Wa)",r.Wa,"m",3,"W<sub>a</sub> = 2/3 · (D − W) + W","2/3 × ("+nf(r.D,3)+" − "+nf(r.W,3)+") + "+nf(r.W,3),"");
  x+=seccion("5. VELOCIDAD EN LA SECCIÓN MEDIA (Va)");
  x+=fila("Velocidad en la sección media (Va)",r.Va,"m/s",3,"V<sub>a</sub> = Q / (W<sub>a</sub> · h<sub>a</sub>)",nf(c.Q,4)+" / ("+nf(r.Wa,3)+" × "+nf(r.ha,3)+")","");
  x+=seccion("6. ENERGÍA TOTAL DISPONIBLE (E1)");
  x+=fila("Energía total disponible (E1)",r.E1,"m",3,"E<sub>1</sub> = V<sub>a</sub>² / (2g) + h<sub>a</sub> + N",nf(r.Va,3)+"² / (2 × 9,81) + "+nf(r.ha,3)+" + "+nf(r.N,3),"Bernoulli en la sección 1–1, con el fondo del resalto como nivel de referencia.");
  x+=seccion("7. VELOCIDAD ANTES DEL RESALTO (V2)");
  x+=fila("Lámina antes del resalto (h2)",r.h2,"m",3,"E<sub>1</sub> = E<sub>2</sub> = Q² / (2g · W² · h<sub>2</sub>²) + h<sub>2</sub>  (raíz supercrítica)",nf(r.E1,3)+" = "+nf(r.Q*r.Q/(2*9.81*r.W*r.W),6)+" / h<sub>2</sub>² + h<sub>2</sub>  →  h<sub>2</sub> = "+nf(r.h2,3),"Se igualan E1 y E2 (sin pérdidas por fricción entre 1 y 2) y se resuelve h2 por bisección en el tramo supercrítico (h2 &lt; hc).");
  x+=fila("Velocidad antes del resalto (V2)",r.V2,"m/s",2,"V<sub>2</sub> = Q / (W · h<sub>2</sub>)",nf(c.Q,4)+" / ("+nf(r.W,3)+" × "+nf(r.h2,3)+")","RAS: V2 &gt; 2 m/s.",r.ok.V2?"":"V2 ≤ 2 m/s.");
  x+=fila("Verificación V2 > 2 m/s",r.ok.V2?"CUMPLE":"NO CUMPLE","",0,"V<sub>2</sub> &gt; 2",nf(r.V2,2)+(r.ok.V2?" > 2":" ≤ 2"),"");
  x+=seccion("8. LÁMINA DE AGUA EN EL RESALTO (hb)");
  x+=fila("Lámina en el resalto (hb)",r.hb,"m",3,"h<sub>b</sub> = h<sub>2</sub> − N",nf(r.h2,3)+" − "+nf(r.N,3),"Si es negativo, la lámina en el resalto queda por debajo del fondo del canal convergente.");
  x+=seccion("9. GRADO DE SUMERGENCIA (S)");
  x+=fila("Sumergencia (S)",r.S,"",2,"S = h<sub>b</sub> / h<sub>a</sub>",nf(r.hb,3)+" / "+nf(r.ha,3),"Verifica la condición de aforador (descarga libre).");
  x+=fila("Verificación de sumergencia",r.ok.S?"CUMPLE (descarga libre)":"NO CUMPLE","",0,"S &lt; S<sub>máx</sub> ("+nf(r.Smax,1)+" para W = "+f.lab+")",nf(r.S,2)+(r.ok.S?" < ":" ≥ ")+nf(r.Smax,1),"");
  x+=seccion("10–12. NÚMERO DE FROUDE Y CLASIFICACIÓN DEL RESALTO");
  x+=fila("Número de Froude (Fr)",r.Fr,"",2,"Fr = V<sub>2</sub> / (g · h<sub>2</sub>)<sup>1/2</sup>",nf(r.V2,2)+" / (9,81 × "+nf(r.h2,3)+")<sup>1/2</sup>","");
  x+=fila("Clasificación del resalto",r.tipo,"",0,"Según Fr (diapositiva 12)","Fr = "+nf(r.Fr,2),"Fr NO debe estar entre 2,5 y 4,5; SÍ entre 1,7–2,5 (débil) ó 4,5–9,0 (estable).");
  x+=fila("Verificación del resalto",r.ok.Fr?"CUMPLE":"NO CUMPLE","",0,"1,7 &lt; Fr ≤ 2,5  ó  4,5 &lt; Fr ≤ 9,0",nf(r.Fr,2),"");
  x+=seccion("13. LÁMINA DE AGUA EN EL TRAMO DIVERGENTE (h3)");
  x+=fila("Altura crítica (hc)",r.hc,"m",3,"h<sub>c</sub> = (Q² / (g · W²))<sup>1/3</sup>","("+nf(c.Q,4)+"² / (9,81 × "+nf(r.W,3)+"²))<sup>1/3</sup>","Se usa el ancho W de la garganta (la diapositiva escribe h2 en el denominador; es una errata, ver memoria de cálculo).");
  x+=fila("Relación h3 / h2",r.h3h2,"",3,"h<sub>3</sub> / h<sub>2</sub> = ½ · [(1 + 8·Fr²)<sup>1/2</sup> − 1]","½ × [(1 + 8 × "+nf(r.Fr,2)+"²)<sup>1/2</sup> − 1]","Ecuación del resalto hidráulico.");
  x+=fila("Lámina en el divergente (h3)",r.h3,"m",3,"h<sub>3</sub> = (h<sub>3</sub>/h<sub>2</sub>) · h<sub>2</sub>",nf(r.h3h2,3)+" × "+nf(r.h2,3),"");
  x+=fila("Verificación h2 < hc < h3",r.ok.hc?"CUMPLE":"NO CUMPLE","",0,"h<sub>2</sub> &lt; h<sub>c</sub> &lt; h<sub>3</sub>",nf(r.h2,3)+" < "+nf(r.hc,3)+" < "+nf(r.h3,3),"");
  x+=seccion("14. LÁMINA DE AGUA AL FINAL DE LA CANALETA (h4)");
  x+=fila("Lámina al final (h4)",r.h4,"m",3,"h<sub>4</sub> = h<sub>3</sub> − (N − K)",nf(r.h3,3)+" − ("+nf(r.N,3)+" − "+nf(r.Kd,3)+")","");
  x+=seccion("15. TIEMPO MEDIO DE LA MEZCLA (td)");
  x+=fila("Velocidad en la sección 3 (V3)",r.V3,"m/s",2,"V<sub>3</sub> = Q / (W · h<sub>3</sub>)",nf(c.Q,4)+" / ("+nf(r.W,3)+" × "+nf(r.h3,3)+")","");
  x+=fila("Velocidad en la sección 4 (V4)",r.V4,"m/s",2,"V<sub>4</sub> = Q / (C · h<sub>4</sub>)",nf(c.Q,4)+" / ("+nf(r.C,3)+" × "+nf(r.h4,3)+")","");
  x+=fila("Velocidad media (Vm)",r.Vm,"m/s",3,"V<sub>m</sub> = (V<sub>3</sub> + V<sub>4</sub>) / 2","("+nf(r.V3,2)+" + "+nf(r.V4,2)+") / 2","");
  x+=fila("Tiempo medio de mezcla (td)",r.td,"s",2,"t<sub>d</sub> = G / V<sub>m</sub>",nf(r.Gd,3)+" / "+nf(r.Vm,3),"G = longitud del divergente (tabla de dimensiones). Para mezclador hidráulico: td &lt; 1 s.",r.ok.td?"":"td ≥ 1 s.");
  x+=seccion("16. GRADIENTE DE VELOCIDAD (G)");
  x+=filaDato("Temperatura del agua (T)",r.T,"°C",1,"Insertado en Términos de referencia.");
  x+=fila("Viscosidad dinámica (μ)",r.mu,"kg/(m·s)",6,"μ = ν · ρ  (ν interpolada de la tabla de viscosidad cinemática)",nf(r.nu,9)+" × 1000  (T = "+nf(r.T,1)+" °C)","");
  x+=fila("Pérdida de carga en la canaleta (Δh)",r.dh,"m",4,"Δh = E<sub>1</sub> − V<sub>4</sub>² / (2g) − h<sub>4</sub> − N + K",nf(r.E1,3)+" − "+nf(r.V4,2)+"² / (2 × 9,81) − "+nf(r.h4,3)+" − "+nf(r.N,3)+" + "+nf(r.Kd,3),"");
  x+=fila("Gradiente de velocidad (G)",r.Gv,"s⁻¹",0,"G = (γ · Δh / (μ · t<sub>d</sub>))<sup>1/2</sup>","(9810 × "+nf(r.dh,4)+" / ("+nf(r.mu,6)+" × "+nf(r.td,2)+"))<sup>1/2</sup>","Mezclador hidráulico: 1000 – 2000 s⁻¹ y tiempo de mezcla &lt; 1 s.",r.ok.G?"":"G fuera de 1000–2000 s⁻¹.","final");
  x+=seccion("17. CRESTA SOBRE EL FONDO DEL CANAL DE SALIDA (X)");
  x+=fila("Profundidad en el canal de salida (h5)",r.h5,"m",3,"h<sub>5</sub> = E<sub>1</sub>  (energía total disponible, paso 6)","h<sub>5</sub> = "+nf(r.E1,3),"h5 no se ingresa: es igual a la energía total disponible E1.");
  x+=filaDato("Ancho del canal de salida (C)",r.Bs,"m",3,"Leído de la tabla de dimensiones de la canaleta (C).");
  x+=fila("Velocidad en el canal de salida (V5)",r.V5,"m/s",2,"V<sub>5</sub> = Q / (C · h<sub>5</sub>)",nf(c.Q,4)+" / ("+nf(r.Bs,3)+" × "+nf(r.h5,3)+")","V5 debe ser mayor a 0,75 m/s.",r.ok.V5?"":"V5 ≤ 0,75 m/s.");
  x+=fila("Elevación de la cresta (X)",r.X,"m",3,"h<sub>5</sub> = E<sub>1</sub> = h<sub>4</sub> + X  →  X = h<sub>5</sub> − h<sub>4</sub>",nf(r.h5,3)+" − "+nf(r.h4,3),"");
  x+=fila("Elevación de la cresta recomendada (Xrec)",r.Xr,"m",3,"X<sub>rec</sub> = 1,1 · X","1,1 × "+nf(r.X,3),"Factor de seguridad del 10 %.","","final");
  x+=seccion("18. LONGITUD DE DESARROLLO DEL RESALTO (L)");
  x+=fila("Longitud del resalto (L)",r.L,"m",2,"L = 6 · (h<sub>3</sub> − h<sub>2</sub>)","6 × ("+nf(r.h3,3)+" − "+nf(r.h2,3)+")","");
  x+=seccion("19. BORDE LIBRE");
  x+=filaDato("Borde libre",r.BL,"m",2,"Criterio del ingeniero diseñador.");
  return x;}

/* ---------- Ventana principal del módulo ---------- */
function pintarParshall_STAR(){
  parDefaults_STAR();
  var h='<div class="titulo"><h1>DISEÑO DE CANALETA PARSHALL</h1><p>Aforador y mezclador rápido: ancho de garganta, resalto hidráulico, gradiente de velocidad y elevación de la cresta. </p></div>'+CONV;
  if(!PRO.Q){
    h+='<div class="aviso"><b>Falta el caudal de diseño.</b> Calcula primero la ventana de <i>Caudal de diseño</i>.<br><button onclick="irVista(\'caudal_STAR\')">Ir a caudal de diseño</button></div>';
    PRO.PAR=null;guardarPro();actualizarEstados();gid("pane-parshall_STAR").innerHTML=h;return;}
  var bt='<div class="acciones"><button class="btn btn-primary" style="width:auto;padding:0 22px" onclick="recalcularParshall_STAR()">RECALCULAR</button><button class="btn-revision" onclick="parRevision_STAR()">REVISIÓN DE ERRORES</button><button class="btn-sec" onclick="abrirTodo(\'pane-parshall_STAR\',true)">VER TODA LA MEMORIA DE CÁLCULO</button><button class="btn-sec" onclick="abrirTodo(\'pane-parshall_STAR\',false)">CONTRAER TODO</button></div>';
  h+=tarjetaDistribucionPar_STAR();
  h+='<div class="card"><div class="card-title">Parámetros de la canaleta</div><div class="card-sub">Si eliges "Automático", se toma el menor ancho de garganta que cumple los criterios de mezcla. Presiona RECALCULAR después de cambiar un dato. h5 (= E1, energía total disponible) y el ancho del canal de salida (C) se calculan o se leen de la tabla, no se ingresan.</div>'+
   '<div class="row">'+parSelW_STAR()+campo("Ha/W objetivo con dispositivo (0,4 – 0,8)","parHaW","number",'step="0.05" min="0.4" max="0.8"')+'</div>'+
   '<div class="row">'+campo("Borde libre (m)","parBL","number",'step="0.05"')+campo("Temperatura del agua (°C)","parT","number",'step="0.5"')+'</div>'+bt+'</div>';
  
   var a=parAnalizar_STAR();
if(a.err || a.sel.r.err){
  PRO.PAR=null;
  guardarPro();
  actualizarEstados();
  gid("pane-parshall_STAR").innerHTML=h;
  return;}
  var r=a.sel.r;
  h+=parTablaComparacion_STAR(a);
  h+='<div class="card"><div class="card-title">Esquemas de la canaleta</div><div class="svg-wrap">'+svgPlantaPar_STAR(a)+'</div><div class="svg-wrap">'+svgPerfilPar_STAR(a)+'</div></div>';
  h+=aduMemoCard_STAR("Memoria de cálculo — Canaleta Parshall",parFilas_STAR(a));
  PRO.PAR={Q:r.Q,W:r.W,Wlab:a.sel.f.lab,ha:r.ha,h2:r.h2,h3:r.h3,h4:r.h4,V2:r.V2,Fr:r.Fr,td:r.td,G:r.Gv,X:r.X,Xrec:r.Xr,L:r.L,hdisp:r.disp};
  guardarPro();actualizarEstados();
  gid("pane-parshall_STAR").innerHTML=h;}

MODULOS.push({
  id:"parshall_STAR",
  titulo:"Canaleta Parshall",
  descripcion:"Aforador y mezclador rápido: ancho de garganta, resalto hidráulico, gradiente de velocidad y cresta.",
  grupo:"hidraulico", orden:8, icono:"m3", iconoSvg:"<path d=\"M3 6h5l2 6h4l2-6h5\"/><path d=\"M3 18h18\"/>",
  valores:{PAR:null},
  indicador:true, imprimible:true,
  normalizar:function(PRO){},
  completo:function(PRO){return !!PRO.PAR;},
  pintar:pintarParshall_STAR,
  recalcular:recalcularParshall_STAR,
  errores:function(){var c=parContexto_STAR();return c.err||[];},
  api:{selectorAncho:parSelW_STAR}
});
