// Dependencias: PRO.Q (caudal), utilidades/campos/revision/memoria y rejilla_svg.js.
/* ==========================================================
   10. MODULO 5 — REJILLA
   ========================================================== */

function calcularRejilla(){
  var pct=Number(PRO.rejPct), Qt=PRO.Q.QDm3*pct/100, n=Number(PRO.nCanales)||1, Q=Qt/n;
  var Vf=Number(PRO.Vf);
  var th=Number(PRO.anguloManual)||DP.T.INCL[PRO.inclina]; var rad=th*Math.PI/180;
  var z=DP.T.GRAVA[PRO.grava][1], beta=DP.T.FORMA[PRO.forma], s=Number(PRO.diamIn)*0.0254;
  var BL=Number(PRO.bordeLibre), H=Number(PRO.Hrh);
  var Lbs=rnd(H/Math.sin(rad),2), Lbns=rnd(BL/Math.sin(rad),2), Lrt=rnd(Lbs+Lbns,2);
  var Htotal=rnd(H+BL,2);
  var Ac=Q/Vf, Bpre=Ac/H;
  var n1=Math.round(Ac/(H*z)), nb=n1-1;
  var Ar=rnd((nb*s+n1*z)*H,1), Br=Ar/H;
  var Km=beta*Math.pow(s/z,1.33), dh=Km*(Vf*Vf)/(2*9.81);
  return {pct:pct,QDt:PRO.Q.QDm3,Qt:Qt,nCan:n,Q:Q,Vf:Vf,th:th,z:z,beta:beta,s:s,BL:BL,H:H,Lbs:Lbs,Lbns:Lbns,Lrt:Lrt,Htotal:Htotal,
          Ac:Ac,Bpre:Bpre,n1:n1,nb:nb,Ar:Ar,Br:Br,Km:Km,dh:dh};}

function avisosParametrosRejilla(){
  var e=[], vacio=function(k){return PRO[k]===''||PRO[k]===null||PRO[k]===undefined;};
  if(!vacio('Vf')){var vf=Number(PRO.Vf);if(!(vf>TR.R.VF_RANGO[0]&&vf<=TR.R.VF_RANGO[1]))e.push('Velocidad efectiva Vf = '+nf(vf,2)+' m/s fuera del rango '+nf(TR.R.VF_RANGO[0],2)+'–'+nf(TR.R.VF_RANGO[1],2)+' m/s. Sugerencia: adopta un valor entre '+nf(TR.R.VF_RANGO[0],2)+'–'+nf(TR.R.VF_RANGO[1],2)+'');}
  if(!vacio('bordeLibre')){var bl=Number(PRO.bordeLibre);if(bl<0.30||bl>0.50)e.push('Borde libre = '+nf(bl,2)+' m fuera del rango 0,30–0,50 m. Sugerencia: adopta un valor entre 0,30 y 0,50 m.');}
  if(!vacio('Hrh')&&!(Number(PRO.Hrh)>0))e.push('La altura en área húmeda Hrh debe ser mayor que 0 m. Sugerencia: ingresa un valor positivo.');
  if(!vacio('diamIn')&&!(Number(PRO.diamIn)>0))e.push('El diámetro/espesor del barrote debe ser mayor que 0 in. Sugerencia: ingresa un valor positivo.');
 
  if(!vacio('anguloManual')){var an=Number(PRO.anguloManual), RANGO_ANG={"VERTICALES":[75,85],"INCLINADAS":[45,60]}, ra=RANGO_ANG[PRO.inclina];
  if(ra&&(an<ra[0]||an>ra[1])) e.push('Ángulo de inclinación θ = '+nf(an,0)+'° fuera del rango típico de rejillas '+PRO.inclina.toLowerCase()+' ('+ra[0]+'° – '+ra[1]+'°). Sugerencia: adopta un ángulo entre '+ra[0]+'° y '+ra[1]+'°, o cambia el tipo de rejilla.');}

  if(!vacio('rejPct')){var p=Number(PRO.rejPct);if(!(p>0&&p<=100))e.push('El porcentaje del caudal que trata la rejilla ('+nf(p,0)+' %) debe estar entre 1 y 100 %. Sugerencia: corrige el porcentaje.');}
  if(!vacio('nCanales')){var n=Number(PRO.nCanales);if(!(n>=1)||n!==Math.floor(n))e.push('El número de canales debe ser un entero mayor o igual a 1. Sugerencia: corrige el número de canales.');}
  return e;}
function recalcularRejilla(){var e=avisosParametrosRejilla();pintarRej();if(e.length)abrirAdvertencia('Advertencia — rejilla',e);}
function revisionRejilla(){var e=[],r=null;try{if(PRO.Q)r=calcularRejilla();}catch(_){r=null;}if(r){if(!(r.Vf>0)||!isFinite(r.Vf))e.push('Velocidad efectiva calculada inválida. Sugerencia: revisa caudal y área de paso.');if(!(r.nb>=1)||!isFinite(r.nb))e.push('Número calculado de barrotes no válido. Sugerencia: revisa velocidad, altura húmeda y separación.');}abrirRevision('Rejilla',e);}

function tarjetaDistribucionRej(r){
  var pct=Number(PRO.rejPct), n=Number(PRO.nCanales), valido=pct>0&&pct<=100&&n>=1&&n===Math.floor(n)&&PRO.Q&&PRO.Q.QDm3>0;
  var resumen=valido?'<div class="link-ok" style="margin-top:0">Caudal total: <b>'+nf(PRO.Q.QD,0)+' L/s</b> · la rejilla trata el <b>'+nf(pct,0)+' %</b> = <b>'+nf(PRO.Q.QDm3*pct/100*1000,2)+' L/s</b><br>Distribuido en <b>'+n+' canal(es)</b>: <b>'+nf(PRO.Q.QDm3*pct/100/n*1000,2)+' L/s</b> ('+nf(PRO.Q.QDm3*pct/100/n,4)+' m³/s) por canal</div>':'<div class="aviso">Verifica el porcentaje (1–100 %) y el número entero de canales (mínimo 1) para distribuir el caudal.</div>';
  return '<div class="card"><div class="card-title">Distribución del caudal</div><div class="card-sub">Define qué porcentaje del caudal total trata la rejilla y cómo se reparte entre canales en paralelo. Estos datos se configuran aquí, separados de los parámetros hidráulicos.</div><div class="row">'+campo("% del caudal de diseño que trata la rejilla","rejPct","number",'step="1" min="1" max="100"')+campo("Número de canales (unidades en paralelo)","nCanales","number",'step="1" min="1"')+'</div>'+resumen+'<div class="acciones"><button class="btn btn-primary" style="width:auto;padding:0 22px" onclick="recalcularDistribucion(\'rejilla\')">RECALCULAR DISTRIBUCIÓN</button></div></div>';
}
function tarjetaDistribucionDes(r){
  var pct=Number(PRO.desPct), n=Number(PRO.desN), valido=pct>0&&pct<=100&&n>=1&&n===Math.floor(n)&&PRO.Q&&PRO.Q.QDm3>0;
  var resumen=valido?'<div class="link-ok" style="margin-top:0">Caudal total: <b>'+nf(PRO.Q.QD,0)+' L/s</b> · el desarenador trata el <b>'+nf(pct,0)+' %</b> = <b>'+nf(PRO.Q.QDm3*pct/100*1000,2)+' L/s</b><br>Distribuido en <b>'+n+' desarenador(es)</b>: <b>'+nf(PRO.Q.QDm3*pct/100/n*1000,2)+' L/s</b> ('+nf(PRO.Q.QDm3*pct/100/n,4)+' m³/s) por unidad</div>':'<div class="aviso">Verifica el porcentaje (1–100 %) y el número entero de desarenadores (mínimo 1) para distribuir el caudal.</div>';
  return '<div class="card"><div class="card-title">Distribución del caudal</div><div class="card-sub">Define qué porcentaje del caudal total trata el desarenador y cómo se reparte entre unidades en paralelo. Estos datos se configuran aquí, separados de los parámetros hidráulicos.</div><div class="row">'+campo("% del caudal de diseño que trata el desarenador","desPct","number",'step="1" min="1" max="100"')+campo("Número de desarenadores","desN","number",'step="1" min="1"')+'</div>'+resumen+'<div class="acciones"><button class="btn btn-primary" style="width:auto;padding:0 22px" onclick="recalcularDistribucion(\'desarenador\')">RECALCULAR DISTRIBUCIÓN</button></div></div>';
}
function recalcularDistribucion(modulo){
  var pct,n,etiqueta;
  if(modulo==='aduccion'){pct=Number(PRO.aduPct);n=Number(PRO.aduNCan);etiqueta='Aducción';if(!(pct>0&&pct<=100)||!(n>=1)||n!==Math.floor(n)||!(Number(PRO.tubN)>=1)||Number(PRO.tubN)!==Math.floor(Number(PRO.tubN))){abrirRevision('Distribución del caudal — Aducción',['El porcentaje debe estar entre 1 y 100 %, y los números de canales y tuberías deben ser enteros mayores o iguales a 1.']);return;}guardarPro();pintarAduccion();return;}
  if(modulo==='rejilla'){pct=Number(PRO.rejPct);n=Number(PRO.nCanales);etiqueta='Rejilla';if(!(pct>0&&pct<=100)||!(n>=1)||n!==Math.floor(n)){abrirRevision('Distribución del caudal — Rejilla',['El porcentaje debe estar entre 1 y 100 % y el número de canales debe ser un entero mayor o igual a 1.']);return;}guardarPro();pintarRej();return;}
  if(modulo==='desarenador'){pct=Number(PRO.desPct);n=Number(PRO.desN);etiqueta='Desarenador';if(!(pct>0&&pct<=100)||!(n>=1)||n!==Math.floor(n)){abrirRevision('Distribución del caudal — Desarenador',['El porcentaje debe estar entre 1 y 100 % y el número de desarenadores debe ser un entero mayor o igual a 1.']);return;}guardarPro();pintarDesarenador();return;}
}

function pintarRej(){
  var h='<div class="titulo"><h1>DISEÑO DE REJILLA</h1><p>Calculo de dimensiones pertinentes a la rejilla.</p></div>'+CONV;
  if(!PRO.Q){
    h+='<div class="aviso"><b>Falta el caudal de diseño.</b> Calcula primero la ventana de <i>Caudal de diseño</i> para poder dimensionar la rejilla.'+
       '<br><button onclick="irVista(\'caudal\')">Ir a caudal de diseño</button></div>';
    gid("pane-rejilla").innerHTML=h; return;
  }
  var r=calcularRejilla(); PRO.REJ=r; guardarPro(); actualizarEstados();
  h+=tarjetaDistribucionRej(r);
  h+='<div class="card"><div class="card-title">Parámetros de la rejilla</div>'+
     '<div class="card-sub">La separación entre barrotes toma el límite superior del rango del tipo de grava seleccionado.</div>'+
     '<div class="row">'+campo("Velocidad efectiva del flujo Vf (m/s)","Vf","number",'step="0.01"')+
     selec("Limpieza de la rejilla","limpieza",["Manual","Mecánica"])+
     '<div class="campo"><label>Tipo (preestablece el ángulo)</label><select onchange="PRO.inclina=this.value;PRO.anguloManual=DP.T.INCL[this.value];guardarPro();pintarRej();">'+
     Object.keys(DP.T.INCL).map(function(o){return '<option value="'+o+'"'+(PRO.inclina===o?' selected':'')+'>'+o+'</option>';}).join('')+'</select></div>'+
     campo("Ángulo de inclinación θ (°)","anguloManual","number",'step="1"')+'</div>'+
     '<div class="row">'+selec("Tipo de grava (separación z)","grava",Object.keys(DP.T.GRAVA))+
     selec("Forma del barrote","forma",Object.keys(DP.T.FORMA))+campo("Diámetro/espesor del barrote (in)","diamIn","number",'step="0.25"')+
     campo("Borde libre (m)","bordeLibre","number",'step="0.05"')+campo("Altura en área húmeda Hrh (m)","Hrh","number",'step="0.1"')+'</div>'+
     '<div class="acciones"><button class="btn btn-primary" style="width:auto;padding:0 22px" onclick="recalcularRejilla()">RECALCULAR</button>'+
      '<button class="btn-revision" onclick="revisionRejilla()">REVISIÓN DE ERRORES</button>'+
     '<button class="btn-sec" onclick="abrirTodo(\'pane-rejilla\',true)">VER TODA LA MEMORIA DE CÁLCULO</button>'+
     '<button class="btn-sec" onclick="abrirTodo(\'pane-rejilla\',false)">CONTRAER TODO</button>'+'</div></div>';

  var erroresRej=[];
  var faltaR=[]; if(!(Number(PRO.diamIn)>0)) faltaR.push("diámetro/espesor del barrote"); if(!(Number(PRO.bordeLibre)>0)) faltaR.push("borde libre"); if(PRO.bordeLibre!==""&&(Number(PRO.bordeLibre)<0.30||Number(PRO.bordeLibre)>0.50)) erroresRej.push("Borde libre de rejilla = "+nf(Number(PRO.bordeLibre),2)+" m, fuera del intervalo 0,30–0,50 m. Corrige el valor antes de consultar resultados."); if(!(Number(PRO.Hrh)>0)) faltaR.push("altura Hrh"); if(!(Number(PRO.Vf)>0)) faltaR.push("velocidad Vf");
  if(faltaR.length) erroresRej.push("Faltan datos de la rejilla: "+faltaR.join(", ")+".");
  if(!(r.pct>0&&r.pct<=100)) erroresRej.push("El porcentaje del caudal de diseño que trata la rejilla debe estar entre 1 y 100 %.");
  if(!(Number(PRO.nCanales)>=1)||Number(PRO.nCanales)!==Math.floor(Number(PRO.nCanales))) erroresRej.push("El número de canales debe ser un entero mayor o igual a 1.");
  if(r.Vf<TR.R.VF_RANGO[0]||r.Vf>TR.R.VF_RANGO[1]) erroresRej.push("La velocidad efectiva de flujo Vf = "+nf(r.Vf,2)+" m/s está fuera del rango exigido por el RAS para rejillas de limpieza manual: "+nf(TR.R.VF_RANGO[0],2)+" – "+nf(TR.R.VF_RANGO[1],2)+" m/s.");
  if(!(r.nb>=1)) erroresRej.push("El número de barrotes calculado no es válido; revisa el caudal, la velocidad Vf y la altura Hrh.");
  if(!erroresRej.length)h+='<div class="card"><div class="card-title">Esquemas de la rejilla</div>'+
'<div class="svg-wrap" style="text-align:center">'+svgRejillaFrontal(r)+'</div>'+
'<div class="svg-wrap" style="text-align:center">'+svgRejillaLateral(r)+'</div></div>';


  var t='<table class="res-table"><thead><tr><th></th><th>VARIABLE</th><th>VALOR</th><th>UNIDAD</th></tr></thead><tbody>';
  t+=seccion("1. DATOS DE PARTIDA");
  t+=fila("Caudal de diseño por unidad",r.Q,"m³/s",4,"Q<sub>u</sub> = QD · (%/100) / n<sub>canales</sub>",nf(r.QDt,4)+" × "+nf(r.pct,0)+" % / "+r.nCan,"Porcentaje del caudal de diseño que trata la rejilla (QD de la ventana anterior), repartido entre los canales en paralelo.");
  t+=filaDato("Velocidad de flujo en la rejilla (Vf)",r.Vf,"m/s",2,"Insertado en Términos de referencia.");
  t+=filaDato("Altura de la lámina de agua (Hrh)",r.H,"m",2,"Insertado en Términos de referencia.");
  t+=filaDato("Borde libre (BL)",r.BL,"m",2,"Insertado en Términos de referencia.");
  t+=filaDato("Diámetro del barrote (Ø)",Number(PRO.diamIn),"in",3,"Insertado en Términos de referencia.");
  t+=fila("Inclinación de las rejillas (θ)",r.th,"°",0,"Dato insertado por el usuario","θ = "+nf(r.th,0)+"°","Rango típico de referencia: verticales 75–85°, inclinadas 45–60° (tipo preseleccionado: "+PRO.inclina.toLowerCase()+"). El campo es editable y admite cualquier ángulo deseado.");
  t+=fila("Separación entre barrotes (z)",r.z,"m",3,"Tabla — tipo de grava","Grava "+PRO.grava.toLowerCase()+" → rango "+nf(DP.T.GRAVA[PRO.grava][0],3)+" – "+nf(DP.T.GRAVA[PRO.grava][1],3),"Se adopta el límite superior del rango, que es el caso más desfavorable en número de barrotes.");
  t+=fila("Coeficiente de forma del barrote (β)",r.beta,"",3,"Tabla de Kirschmer — forma "+PRO.forma,"→ "+nf(r.beta,3),"C1 2,42 · C2 1,83 · C3 1,67 · C4 1,035 · C5 0,92 · C6 0,76 · C7 1,79.");
  t+=fila("Espesor del barrote (s)",r.s,"m",4,"s = Ø<sub>(in)</sub> × 0,0254",nf(PRO.diamIn,2)+" × 0,0254","Conversión de pulgadas a metros.");
  t+=seccion("2. LONGITUD DE LOS BARROTES");
  t+=fila("Longitud sumergida (Lbs)",r.Lbs,"m",2,"L<sub>bs</sub> = H<sub>rh</sub> / sen θ",nf(r.H,2)+" / sen "+r.th+"°","Altura de la rejilla en el área húmeda proyectada sobre la inclinación.");
  t+=fila("Longitud no sumergida (Lbns)",r.Lbns,"m",2,"L<sub>bns</sub> = BL / sen θ",nf(r.BL,2)+" / sen "+r.th+"°","Borde libre proyectado sobre la inclinación.");
  t+=fila("Longitud total del barrote (Lrt)",r.Lrt,"m",2,"L<sub>rt</sub> = L<sub>bs</sub> + L<sub>bns</sub>",nf(r.Lbs,2)+" + "+nf(r.Lbns,2),"Longitud de fabricación de cada barrote (medida sobre la inclinación).");
  t+=fila("Altura total del canal y de la rejilla (vertical)",r.Htotal,"m",2,"H<sub>total</sub> = H<sub>rh</sub> + BL",nf(r.H,2)+" + "+nf(r.BL,2),"Altura vertical desde el fondo del canal hasta el borde superior de la rejilla; es la que se usa para fabricar el marco de la rejilla.");
  t+=seccion("3. GEOMETRÍA DEL CANAL Y DE LA REJILLA");
  t+=fila("Área de captación (Ac)",r.Ac,"m²",4,"A<sub>c</sub> = Q<sub>u</sub> / V<sub>f</sub>",nf(r.Q,4)+" / "+nf(r.Vf,2),"Área de paso requerida para la velocidad efectiva de flujo adoptada.",(r.Vf<0||r.Vf>0.15)?"La velocidad de paso habitual en rejillas de limpieza manual está entre 0 y 0,15 m/s; valores menores favorecen la sedimentación de arenas.":"");
  t+=fila("Ancho preliminar del canal",r.Bpre,"m",3,"B<sub>prel</sub> = A<sub>c</sub> / H<sub>rh</sub>",nf(r.Ac,4)+" / "+nf(r.H,2),"Ancho antes de descontar el espesor ocupado por los barrotes.");
  t+=fila("Número de espacios entre barrotes (n+1)",r.n1,"",0,"n+1 = A<sub>c</sub> / (H<sub>rh</sub> · z)",nf(r.Ac,4)+" / ("+nf(r.H,2)+" × "+nf(r.z,3)+")","Se redondea al entero más próximo.");
  t+=fila("Número de barrotes (n)",r.nb,"",0,"n = (n+1) − 1",r.n1+" − 1","Siempre hay un espacio más que barrotes.");
  t+=fila("Área de la rejilla (Ar)",r.Ar,"m²",1,"A<sub>r</sub> = (n·s + (n+1)·z) · H<sub>rh</sub>","("+r.nb+"×"+nf(r.s,4)+" + "+r.n1+"×"+nf(r.z,3)+") × "+nf(r.H,2),"Área total incluyendo el espesor ocupado por los barrotes.");
  t+=fila("Ancho de la rejilla (Br)",r.Br,"m",2,"B<sub>r</sub> = A<sub>r</sub> / H<sub>rh</sub>",nf(r.Ar,1)+" / "+nf(r.H,2),"Ancho definitivo del canal de cribado.","","final");
  t+=seccion("4. PÉRDIDAS DE CARGA (KIRSCHMER)");
  t+=fila("Coeficiente de pérdidas menores (Km)",r.Km,"",4,"K<sub>m</sub> = β · (s/z)<sup>1,33</sup>",nf(r.beta,3)+" × ("+nf(r.s,4)+"/"+nf(r.z,3)+")<sup>1,33</sup>","Depende únicamente de la forma del barrote y de la relación espesor/separación.");
  t+=fila("Pérdida menor en la rejilla (Δh)",r.dh,"m",4,"Δh = K<sub>m</sub> · V<sub>f</sub>² / (2g)",nf(r.Km,4)+" × "+nf(r.Vf,2)+"² / (2 × 9,81),","Pérdida con rejilla limpia. Equivale a "+nf(r.dh*100,2)+" cm; con colmatación del 50 % se cuadruplica aproximadamente.","","final");
  t+='</tbody></table>';
  h+='<div class="card"><div class="card-title">Memoria de cálculo</div><div class="card-sub">Haz clic en cualquier fila para ver la fórmula, la operación y el origen del dato.</div>'+t+'</div>';
  gid("pane-rejilla").innerHTML=h;}

MODULOS.push({
  id:"rejilla",
  titulo:"Diseño de rejilla", tituloMenu:"Rejilla",
  descripcion:"Cribado de partículas, dimensiones de rejilla, cantidad barrotes y pérdidas de carga.",
  grupo:"hidraulico", orden:5, icono:"rej", iconoSvg:"<rect x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"2\"/><path d=\"M9 4v16M15 4v16M4 9h16M4 15h16\"/>",
  valores:{"nCanales": 1, "Vf": 0.15, "limpieza": "-", "inclina": "", "anguloManual": "", "grava": "", "forma": "C7", "diamIn": "", "bordeLibre": "", "Hrh": "", "modoCaudal": "RAS", "caudalManualM3": "", "REJ": null, "rejPct": 100},
  indicador:true, imprimible:true,
  normalizar:function(PRO){
    normFix("limpieza",["Manual","Mecánica"],"Manual"); normFix("inclina",Object.keys(DP.T.INCL),"INCLINADAS");
    normFix("grava",Object.keys(DP.T.GRAVA)); normFix("forma",Object.keys(DP.T.FORMA),"C7");
    if(esVacio(PRO.anguloManual)) PRO.anguloManual=DP.T.INCL[PRO.inclina];
    if(PRO.rejPct===""||PRO.rejPct===undefined) PRO.rejPct=100;
  },
  completo:function(PRO){return !!PRO.REJ;},
  pintar:pintarRej
});
