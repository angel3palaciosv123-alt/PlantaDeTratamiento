// Dependencias: PRO, nf/rnd, campo/selec, fila/seccion, revision.js, datos compartidos.
function calcularCaudal(){
  var P=Number(PRO.pobProy), At=Number(PRO.areaTotal), R=Number(PRO.R);
  var nivel=DP.nivelComplejidad(P), Dmax=DP.T.DOT[nivel], coef=Number(PRO.coefAf), Dn=Dmax*coef;
  var Au=At*PRO.pUrb, Aind=Au*PRO.pInd, Acom=Au*PRO.pCom, Ains=Au*PRO.pIns;
  var Qd=rnd((R*P*Dn)/86400,2);
  var cInd=DP.T.IND[nivel], Qi=rnd(Aind*cInd,2), Qc=rnd(Acom*0.15,2), Qins=rnd(Ains*0.5,2);
  var Qce=rnd(Au*0.2,2);
  var aInf=DP.T.INF[PRO.tipoInf], Qinf=rnd(At*PRO.pUrb*PRO.pVias*aInf,2);
  var Qmd=rnd(Qd+Qi+Qc+Qins,2);
  var F = PRO.metMay==="Flowers" ? 3.5/Math.pow(P/1000,0.1)
        : PRO.metMay==="Angels"  ? 3.53/Math.pow(Qmd,0.062)
        : 3.114/Math.pow(Qmd,0.062);
  F=rnd(F,2);
  var QMHF = PRO.metMay==="Flowers" ? rnd(F*Qd+Qi+Qc+Qins,0) : rnd(F*Qmd,0);
  var QD=rnd(QMHF+Qce+Qinf,0);
  return {P:P,nivel:nivel,Dmax:Dmax,coef:coef,Dn:Dn,At:At,Au:Au,Aind:Aind,Acom:Acom,Ains:Ains,R:R,
          Qd:Qd,cInd:cInd,Qi:Qi,Qc:Qc,Qins:Qins,Qce:Qce,aInf:aInf,Qinf:Qinf,Qmd:Qmd,F:F,QMHF:QMHF,QD:QD,QDm3:QD/1000};}

function erroresCaudal(){
  var errores=[],af=DP.T.AFEC[PRO.factorAf];
  var coefN=Number(PRO.coefAf);
  if(af&&(coefN<af[1]||coefN>af[2])) errores.push("El coeficiente de afectación ("+nf(coefN,2)+") está fuera del rango admisible para el factor '"+PRO.factorAf+"': "+nf(af[1],1)+" – "+nf(af[2],1)+".");
  if(PRO.coefAf===""||isNaN(coefN)) errores.push("Falta digitar el coeficiente de afectación de la dotación neta.");
  var Rn=Number(PRO.R);
  if(PRO.R===""||isNaN(Rn)) errores.push("Falta el coeficiente de retorno R (se define en Términos de Referencia).");
  else if(Rn<TR.R.R_RANGO[0]||Rn>TR.R.R_RANGO[1]) errores.push("El coeficiente de retorno R = "+nf(Rn,2)+" está fuera del rango recomendado por el RAS ("+nf(TR.R.R_RANGO[0],2)+" – "+nf(TR.R.R_RANGO[1],2)+").");
  if(PRO.pUrb===""||PRO.pVias===""||PRO.pInd===""||PRO.pCom===""||PRO.pIns==="") errores.push("Faltan porcentajes de área por definir en Términos de Referencia.");
  return errores;}

function pintarQ(){
  var h='<div class="titulo"><h1>CAUDAL DE DISEÑO</h1><p>Calculo del caudal de diseño segun el RAS.</p></div>'+CONV;
  h+='<div class="card"><div class="card-title">Método de ingreso del caudal</div><div class="row"><div class="campo"><label>Origen del caudal de diseño</label><select id="modoCaudal" onchange="PRO.modoCaudal=this.value;guardarPro();pintarQ()"><option value="RAS"'+(PRO.modoCaudal!=="Manual"?' selected':'')+'>Calcular según RAS</option><option value="Manual"'+(PRO.modoCaudal==="Manual"?' selected':'')+'>Ingresar caudal manualmente</option></select></div></div>';
  if(PRO.modoCaudal==="Manual"){
    h+='<div class="row">'+campo("Caudal de diseño QD (m³/s)","caudalManualM3","number",'step="0.0001" min="0.000001"')+'</div><div class="acciones"><button class="btn btn-primary" style="width:auto;padding:0 22px" onclick="guardarCaudalManual()">GUARDAR CAUDAL</button></div></div>';
    if(Number(PRO.caudalManualM3)>0){PRO.Q={QD:Number(PRO.caudalManualM3)*1000,QDm3:Number(PRO.caudalManualM3),manual:true};guardarPro();actualizarEstados();h+='<div class="link-ok">Caudal manual adoptado: <b>'+nf(Number(PRO.caudalManualM3),5)+' m³/s</b> ('+nf(Number(PRO.caudalManualM3)*1000,2)+' L/s). No se calcularon componentes poblacionales.</div>';}
    else {PRO.Q=null;h+='<div class="aviso">Ingresa un caudal mayor que cero en m³/s.</div>';}
    gid("pane-caudal").innerHTML=h;return;}
  h+='</div>';

  if(!PRO.pobProy || !PRO.areaTotal){
    h+='<div class="aviso"><b>Faltan insumos.</b> Para calcular el caudal se requiere la <i>población proyectada</i> y el <i>área total de la población</i>, definidas en la ventana de Términos de Referencia.'+
       '<br><button onclick="irVista(\'terminos_referencia\')">Ir a términos de referencia</button></div>';
    gid("pane-caudal").innerHTML=h; return;
  }
  var af=DP.T.AFEC[PRO.factorAf];
  h+='<div class="link-ok">Población proyectada: <b>'+nf(PRO.pobProy,0)+' hab</b> ('+(PRO.metodoPob||"manual")+
     ') · Nivel de complejidad <b>'+DP.nivelComplejidad(Number(PRO.pobProy))+'</b> · Área total <b>'+nf(PRO.areaTotal,0)+' Ha</b> · Coeficiente de retorno <b>'+nf(PRO.R,2)+'</b></div>';
  h+='<div class="card"><div class="card-title">Parámetros de cálculo</div>'+
     '<div class="card-sub">Coeficiente de afectación de la dotación neta, tipo de infiltración y método de mayoración.</div>'+
     '<div class="row">'+campo("Área total población (Ha)","areaTotal")+campo("Coeficiente de retorno R","R","number",'step="0.01"')+
     '<div class="campo"><label>Área urbana (Ha) — calculada</label><input value="'+(PRO.areaTotal&&PRO.pUrb!==""?nf(PRO.areaTotal*PRO.pUrb,2):"")+'" placeholder="—" readonly></div></div>'+
     '<div class="row">'+campoPct("% Área urbana","pUrb")+campoPct("% Área vías","pVias")+
     campoPct("% Área industrial","pInd")+campoPct("% Área comercial","pCom")+
     campoPct("% Área institucional","pIns")+'</div>'+
     '<div class="row">'+selec("Factor de afectación","factorAf",Object.keys(DP.T.AFEC))+
     '<div class="campo"><label>Sentido / rango admisible</label><input value="'+af[0]+'  ('+nf(af[1],1)+' – '+nf(af[2],1)+')" readonly></div>'+
     campo("Coeficiente de afectación","coefAf","number",'step="0.01"')+
     selec("Tipo de infiltración","tipoInf",Object.keys(DP.T.INF))+
     selec("Método de mayoración","metMay",["Flowers","Angels","Gaines"])+'</div>'+
      '<div class="acciones"><button class="btn btn-primary" style="width:auto;padding:0 22px" onclick="recalcularCaudal()">RECALCULAR</button>'+'<button class="btn-revision" onclick="revisionCaudal()">REVISIÓN DE ERRORES</button>'+
        '<button class="btn-sec" onclick="abrirTodo(\'pane-caudal\',true)">VER TODA LA MEMORIA DE CÁLCULO</button>'+
        '<button class="btn-sec" onclick="abrirTodo(\'pane-caudal\',false)">CONTRAER TODO</button>'+'</div></div>';

  var errores=erroresCaudal();
  if(errores.length){
    gid("pane-caudal").innerHTML=h; PRO.Q=null; guardarPro(); actualizarEstados(); return;}

  var avisos=avisosParametrosCaudal();

if(avisos.length){PRO.Q=null;guardarPro(); actualizarEstados(); gid("pane-caudal").innerHTML=h;
 return;}

  var c=calcularCaudal(); PRO.Q=c; guardarPro(); actualizarEstados();
  var fueraRango = c.coef<af[1]||c.coef>af[2];
  var t='<table class="res-table"><thead><tr><th></th><th>VARIABLE</th><th>VALOR</th><th>UNIDAD</th></tr></thead><tbody>';
  t+=seccion("DATOS INSERTADOS Y LEÍDOS");
  t+=filaDato("Área total de la población (At)",Number(PRO.areaTotal),"Ha",2,"Insertado en Términos de referencia.");
  t+=filaDato("Coeficiente de retorno (R)",Number(PRO.R),"",2,"Insertado en Términos de referencia.");
  t+=filaDato("Área urbana (% del área total)",Number(PRO.pUrb)*100,"%",1,"Insertado en Términos de referencia.");
  t+=filaDato("Área de vías (% del área urbana)",Number(PRO.pVias)*100,"%",1,"Insertado en Términos de referencia.");
  t+=filaDato("Área industrial (% del área urbana)",Number(PRO.pInd)*100,"%",1,"Insertado en Términos de referencia.");
  t+=filaDato("Área comercial (% del área urbana)",Number(PRO.pCom)*100,"%",1,"Insertado en Términos de referencia.");
  t+=filaDato("Área institucional (% del área urbana)",Number(PRO.pIns)*100,"%",1,"Insertado en Términos de referencia.");
  t+=filaDato("Tipo de infiltración",PRO.tipoInf,"",0,"Insertado en Términos de referencia.");
  t+=filaDato("Método de mayoración",PRO.metMay,"",0,"Insertado en Términos de referencia.");
  t+=seccion("1. NIVEL DE COMPLEJIDAD Y DOTACIÓN NETA");
  t+=fila("Población proyectada",c.P,"Hab",0,"P<sub>f</sub>","Método "+(PRO.metodoPob||"manual"),"Importada de la ventana de proyección poblacional (Tabla F.1.2 del RAS para la verificación del método).");
  t+=fila("Nivel de complejidad",c.nivel,"",0,"Tabla A.3.1 — según población urbana","P = "+nf(c.P,0)+" hab → "+(c.P<=2500?"< 2500":c.P<=12500?"2501 a 12500":c.P<=60000?"12501 a 60000":"> 60000"),"Valor buscado en la Tabla A.3.1 del RAS.");
  t+=fila("Dotación neta máxima",c.Dmax,"L/hab·d",0,"Tabla — dotación neta máxima por nivel","Nivel "+c.nivel+" → "+c.Dmax,"Valor buscado: 110 (Bajo) · 135 (Medio) · 145 (Medio Alto) · 155 (Alto).");
  t+=fila("Coeficiente de afectación",c.coef,"",2,"Factor: "+PRO.factorAf+" — sentido "+af[0],"Rango admisible "+nf(af[1],1)+" – "+nf(af[2],1),"Dato insertado por el usuario según la tabla de coeficientes de afectación.",fueraRango?"El coeficiente está fuera del rango admisible para el factor seleccionado.":"");
  t+=fila("Dotación neta",c.Dn,"L/hab·d",2,"d<sub>neta</sub> = d<sub>máx</sub> × C<sub>af</sub>",nf(c.Dmax,0)+" × "+nf(c.coef,2),"Dotación neta afectada que se usa en el caudal doméstico.");
  t+=seccion("2. CAUDAL DE AGUAS RESIDUALES DOMÉSTICAS (Qd)");
  t+=fila("Caudal de aguas residuales domésticas",c.Qd,"L/s",2,"Q<sub>d</sub> = (R · P · d<sub>neta</sub>) / 86 400","("+nf(c.R,2)+" × "+nf(c.P,0)+" × "+nf(c.Dn,2)+") / 86 400","R = coeficiente de retorno (Términos de Referencia). 86 400 = segundos en un día.");
  t+=seccion("3. CAUDAL DE AGUAS RESIDUALES NO DOMÉSTICAS");
  t+=fila("Área urbana",c.Au,"Ha",2,"A<sub>u</sub> = A<sub>total</sub> × %A<sub>urbana</sub>",nf(c.At,0)+" × "+nf(PRO.pUrb,3)+" ("+nf(PRO.pUrb*100,1)+"%)","Términos de Referencia.");
  t+=fila("Contribución industrial",c.cInd,"L/s·Ha",2,"Tabla — industrias pequeñas por nivel","Nivel "+c.nivel+" → "+nf(c.cInd,1),"Valor buscado: 0,4 (Bajo) · 0,6 (Medio) · 0,8 (Medio Alto) · 1,0 (Alto).");
  t+=fila("Caudal industrial (Q<sub>ind</sub>)",c.Qi,"L/s",2,"Q<sub>ind</sub> = A<sub>u</sub> × %A<sub>ind</sub> × c<sub>ind</sub>",nf(c.Au,2)+" × "+nf(PRO.pInd,3)+" ("+nf(PRO.pInd*100,1)+"%) × "+nf(c.cInd,1),"Área industrial = "+nf(c.Aind,2)+" Ha.");
  t+=fila("Caudal comercial (Q<sub>com</sub>)",c.Qc,"L/s",2,"Q<sub>com</sub> = A<sub>u</sub> × %A<sub>com</sub> × 0,15",nf(c.Au,2)+" × "+nf(PRO.pCom,3)+" ("+nf(PRO.pCom*100,1)+"%) × 0,15","Contribución comercial típica 0,15 L/s·Ha. Área comercial = "+nf(c.Acom,2)+" Ha.");
  t+=fila("Caudal institucional (Q<sub>ins</sub>)",c.Qins,"L/s",2,"Q<sub>ins</sub> = A<sub>u</sub> × %A<sub>ins</sub> × 0,5",nf(c.Au,2)+" × "+nf(PRO.pIns,3)+" ("+nf(PRO.pIns*100,1)+"%) × 0,5","Contribución institucional típica 0,5 L/s·Ha. Área institucional = "+nf(c.Ains,2)+" Ha.");
  t+=fila("Caudal por conexiones erradas (Q<sub>ce</sub>)",c.Qce,"L/s",2,"Q<sub>ce</sub> = A<sub>u</sub> × 0,2",nf(c.Au,2)+" × 0,2","Aporte máximo por conexiones erradas sin sistema pluvial, 0,2 L/s·Ha.");
  t+=fila("Aporte por infiltración",c.aInf,"L/s·Ha",2,"Tabla — infiltración "+PRO.tipoInf,"→ "+nf(c.aInf,1),"Valor buscado: Alta 0,3 · Media 0,2 · Baja 0,1 L/s·Ha.");
  t+=fila("Caudal por infiltración (Q<sub>inf</sub>)",c.Qinf,"L/s",2,"Q<sub>inf</sub> = A<sub>total</sub> × %A<sub>urb</sub> × %A<sub>vías</sub> × a<sub>inf</sub>",nf(c.At,0)+" × "+nf(PRO.pUrb,3)+" ("+nf(PRO.pUrb*100,1)+"%) × "+nf(PRO.pVias,3)+" ("+nf(PRO.pVias*100,1)+"%) × "+nf(c.aInf,1),"El área de vías es la superficie sobre la que se estima la longitud de red expuesta a infiltración.");
  t+=seccion("4. CAUDAL MEDIO DIARIO DE AGUAS RESIDUALES (Qmd)");
  t+=fila("Caudal medio diario",c.Qmd,"L/s",2,"Q<sub>md</sub> = Q<sub>d</sub> + Q<sub>ind</sub> + Q<sub>com</sub> + Q<sub>ins</sub>",nf(c.Qd,2)+" + "+nf(c.Qi,2)+" + "+nf(c.Qc,2)+" + "+nf(c.Qins,2),"No incluye conexiones erradas ni infiltración: esos aportes se suman al final.");
  t+=seccion("5. FACTOR DE MAYORACIÓN ("+PRO.metMay.toUpperCase()+")");
  var fF = PRO.metMay==="Flowers" ? ["F = 3,5 / (P/1000)<sup>0,1</sup>","3,5 / ("+nf(c.P,0)+"/1000)<sup>0,1</sup>"]
         : PRO.metMay==="Angels"  ? ["F = 3,53 / Q<sub>md</sub><sup>0,062</sup>","3,53 / "+nf(c.Qmd,2)+"<sup>0,062</sup>"]
         : ["F = 3,114 / Q<sub>md</sub><sup>0,062</sup>","3,114 / "+nf(c.Qmd,2)+"<sup>0,062</sup>"];
  t+=fila("Factor de mayoración (F)",c.F,"",2,fF[0],fF[1],"Flowers depende de la población; Angels y Gaines dependen del caudal medio diario.");
  t+=seccion("6. CAUDAL MÁXIMO HORARIO FINAL (QMHF)");
  t+=fila("Caudal máximo horario final",c.QMHF,"L/s",0,
    PRO.metMay==="Flowers"?"QMHF = F · Q<sub>d</sub> + Q<sub>ind</sub> + Q<sub>com</sub> + Q<sub>ins</sub>":"QMHF = F · Q<sub>md</sub>",
    PRO.metMay==="Flowers"?nf(c.F,2)+" × "+nf(c.Qd,2)+" + "+nf(c.Qi,2)+" + "+nf(c.Qc,2)+" + "+nf(c.Qins,2):nf(c.F,2)+" × "+nf(c.Qmd,2),
    "En Flowers la mayoración se aplica solo al componente doméstico; en Angels y Gaines, al caudal medio diario completo.");
  t+=seccion("7. CAUDAL DE DISEÑO (QD)");
  t+=fila("CAUDAL DE DISEÑO",c.QD,"L/s",0,"QD = QMHF + Q<sub>ce</sub> + Q<sub>inf</sub>",nf(c.QMHF,0)+" + "+nf(c.Qce,2)+" + "+nf(c.Qinf,2),"Caudal que alimenta el dimensionamiento de las unidades de tratamiento.","","final");
  t+=fila("CAUDAL DE DISEÑO",c.QDm3,"m³/s",4,"QD<sub>(m³/s)</sub> = QD<sub>(L/s)</sub> / 1000",nf(c.QD,0)+" / 1000","Valor que se transfiere a la ventana de rejilla.","","final");
  t+='</tbody></table>';
  h+='<div class="card"><div class="card-title">Memoria de cálculo</div><div class="card-sub">Haz clic en cualquier fila para ver la fórmula, el reemplazo numérico y el origen del dato.</div>'+t+'</div>';
  gid("pane-caudal").innerHTML=h;}

function guardarCaudalManual(){var q=Number(PRO.caudalManualM3);if(!(q>0)){abrirRevision("Caudal de diseño",["Ingresa un caudal mayor que cero en m³/s."]);return;}PRO.Q={QD:q*1000,QDm3:q,manual:true};guardarPro();actualizarEstados();pintarQ();}

function revisionCaudal(){var e=[];if(PRO.modoCaudal==='Manual'){var q=Number(PRO.caudalManualM3);if(!(q>0))e.push('Ingresa un caudal manual mayor que cero, expresado en m³/s.');}else{if(!PRO.pobProy||!PRO.areaTotal)e.push('Faltan población proyectada o área total en Términos de Referencia.');if(PRO.R!==''&&(Number(PRO.R)<TR.R.R_RANGO[0]||Number(PRO.R)>TR.R.R_RANGO[1]))e.push('El coeficiente de retorno está fuera del rango 0,70–0,90. Revisa el dato en Términos de Referencia.');}if(PRO.modoCaudal!=='Manual')e=e.concat(erroresCaudal());abrirRevision('Caudal de diseño',e);}


function avisosParametrosCaudal(){
  var e=[],vacio=function(k){
    return PRO[k]===''||PRO[k]===null||PRO[k]===undefined;};

  var af=DP.T.AFEC[PRO.factorAf];
  if(!vacio('coefAf')&&af){
    var c=Number(PRO.coefAf);
    if(!isFinite(c)||c<af[1]||c>af[2]){
      e.push('El coeficiente de afectación = '+nf(c,2)+
      ' está fuera del rango admisible '+nf(af[1],1)+'–'+nf(af[2],1)+
      '. Sugerencia: adopta un valor dentro del rango permitido.');}}

  if(!vacio('R')){
    var r=Number(PRO.R);
    if(!isFinite(r)||r<TR.R.R_RANGO[0]||r>TR.R.R_RANGO[1]){
      e.push('El coeficiente de retorno R = '+nf(r,2)+
      ' está fuera del rango recomendado por el RAS ('+
      nf(TR.R.R_RANGO[0],2)+'–'+nf(TR.R.R_RANGO[1],2)+'). Sugerencia: adopta un valor entre 0,70 y 0,90.');}}

  var areas=['pUrb','pVias','pInd','pCom','pIns'];
  if(areas.every(function(k){return !vacio(k)&&isFinite(Number(PRO[k]));})){
    var s=areas.reduce(function(total,k){
      return total+Number(PRO[k]);},0);
    if(s>1.001){
      e.push('La suma de los porcentajes de área ('+
      nf(s*100,1)+' %) supera el 100 % del área total. '+
      'Sugerencia: ajusta los porcentajes para que la suma no supere el 100 %.');}}
  return e;}

function recalcularCaudal(){
  var e=(PRO.modoCaudal==="Manual")?[]:erroresCaudal();
  if(!e.length)e=avisosParametrosCaudal();
  pintarQ();
  if(e.length){
    abrirAdvertencia('Advertencia — caudal de diseño',e);}}

registrarMemoria({ins:["Población proyectada"],sim:{"Nivel de complejidad":"Nivel","Dotación neta máxima":"d<sub>máx</sub>","Contribución industrial":"c<sub>ind</sub>","Aporte por infiltración":"a<sub>inf</sub>"}});

MODULOS.push({
  id:"caudal",
  titulo:"Caudal de diseño",
  descripcion:"Caudales doméstico, no doméstico, infiltración y conexiones erradas.",
  grupo:"proyecto", orden:4, icono:"q", iconoSvg:"<path d=\"M12 3s6 6.2 6 10.5A6 6 0 0 1 6 13.5C6 9.2 12 3 12 3z\"/><path d=\"M9.5 14a2.6 2.6 0 0 0 2.5 2.5\"/>",
  valores:{"Q": null, "areaTotal": "", "R": "", "pUrb": "", "pVias": "", "pInd": "", "pCom": "", "pIns": "", "factorAf": "", "coefAf": "-", "tipoInf": "-", "metMay": ""},
  indicador:true, imprimible:true,
  normalizar:function(PRO){
    normFix("factorAf",Object.keys(DP.T.AFEC)); normFix("tipoInf",Object.keys(DP.T.INF)); normFix("metMay",["Flowers","Angels","Gaines"]);
    if(esVacio(PRO.R)) PRO.R=0.85;
    if(esVacio(PRO.coefAf)) PRO.coefAf=1.2;
  },
  completo:function(PRO){return !!PRO.Q;},
  pintar:pintarQ
});
