/* ##########################################################
   STAR · SISTEMAS DE TRATAMIENTO DE AGUA RESIDUAL
   MÓDULO DESARENADOR  (posición 7 en el menú) — desarenador.js
   Cálculo del desarenador: sedimentación de arena fina, dimensiones, deflectores y plataformas.
   Sufijo: las funciones y variables globales de este archivo terminan en _STAR
   (así no chocan con los módulos de STAP, IHS o RS que tengan el mismo nombre).
   ########################################################## */
// Dependencias: PRO.Q y PRO.ADU/PRO.REJ según distribución; tablas DP_STAR.T.AT/DP_STAR.T.VISC y dibujos comunes.
/* ==========================================================
   VENTANA 6 — DESARENADOR 
   ========================================================== */

function calcularDesarenador_STAR(){
  var g=9.81,QD=PRO.Q.QDm3,pct=Number(PRO.desPct),nU=Number(PRO.desN),E=[],A=[];
  if(!(pct>0&&pct<=100)) E.push("El porcentaje del caudal de diseño debe estar entre 1 y 100 %.");
  if(!(nU>=1)||nU!==Math.floor(nU)) E.push("El número de desarenadores debe ser un entero mayor o igual a 1.");
  var req=[["desT","temperatura"],["desDp","diámetro de partícula"],["desRho","peso específico de la partícula"],["desA","tiempo de retención a"],["desAL","área de salida de lodos AL"],["desVor","velocidad en orificios Vor"],["desDor","diámetro del orificio"],["desBL","borde libre"]],f=[];
  req.forEach(function(r){ if(!aduPos_STAR(PRO[r[0]])) f.push(r[1]); });
  if(f.length) E.push("Faltan datos: "+f.join(", ")+".");
  if(E.length) return {err:E};
  var Q=QD*pct/100/nU,T=Number(PRO.desT),dp=Number(PRO.desDp)/1000,rp=Number(PRO.desRho),rf=1000;
  var nu=4.34565e-5/(T+23.3), mu=nu*rf, Vs=g/18*(rp-rf)/mu*dp*dp, Re=Vs*dp/nu;
  var at=DP_STAR.T.AT[PRO.desCond][DP_STAR.T.REM.indexOf(String(PRO.desRem))], a=Number(PRO.desA)*60, Ts=a/at;
  var Hc=Ts*Vs, H=Hc;
  var Vd=a*Q, As=Vd/H, VA=Q/As, B=Math.sqrt(As/4), L=4*B, Vo=Q/(B*H);
  var Ef=Vs/VA*100, hoc=L/10, ho=Math.min(1.5,Math.max(0.75,hoc)), AL=Number(PRO.desAL), VL=ho/3*(As+AL+Math.sqrt(As*AL)), rVL=VL/Vd*100;
  var Aor_t=Q/Number(PRO.desVor), d=Number(PRO.desDor)*0.0254, Aor=Math.PI*d*d/4, N=Aor_t/Aor;
  var n=Math.ceil(Math.sqrt(N*B/H)), m=Math.ceil(N/n), Z=(B-n*d)/(n+1), hd=H/Number(PRO.desDef), W=(hd-m*d)/(m+1);
  var Vad=(PRO.ADU&&PRO.ADU.canal&&PRO.ADU.canal.Vo)||null, b1=Vad?Q/(B*Vad):null, b2=Q/(B*0.5), bp=Math.max(0.30,b1||0,b2), HL=Math.pow(Q/(1.84*B),1/1.5);
  /* Altura de la plataforma: el tiempo t NO lo digita el usuario; se itera automáticamente
     desde 0,5 s en pasos de 0,5 s hasta que la plataforma contenga la lámina del vertedero (Hp ≥ HL). */
  var t0=0.5, paso=0.5, tIt=t0, it=[], Hp=Q*tIt/(B*bp);
  it.push({t:tIt,Hp:Hp});
  while(Hp<HL&&it.length<400){ tIt=Math.round((tIt+paso)*10)/10; Hp=Q*tIt/(B*bp); it.push({t:tIt,Hp:Hp}); }
  var tp=tIt;
  /* Vertedero de salida (Francis, longitud = B y Q = QD): la lámina hv es la misma HL */
  var hv=HL;
  /* Ubicación de deflectores (figura de la clase No. 4) */
  var Lde=L/4, Lds=15*hv, Lz=L-Lde-Lds;
  /* Tolva de lodos: punto más bajo (H2 = ho) a L/3 de la entrada, 2L/3 hacia la salida */
  var H2=ho, xL3=L/3, xL23=2*L/3, S1=ho/xL3*100, S2=ho/xL23*100;
  /* Cámara de entrada a H/3 bajo la lámina de agua y borde libre (10–20 % de H) */
  var He3=H/3, pBL=Number(PRO.desBL), BL=H*pBL/100, Ht=H+BL, Hmax=BL+H+ho;
  return {QD:QD,pct:pct,nU:nU,Q:Q,T:T,dp:dp,rp:rp,nu:nu,mu:mu,Vs:Vs,Re:Re,at:at,a:a,Ts:Ts,Hc:Hc,H:H,Vd:Vd,As:As,VA:VA,B:B,L:L,Vo:Vo,Ef:Ef,ho:ho,AL:AL,VL:VL,rVL:rVL,Aor_t:Aor_t,d:d,Aor:Aor,N:N,n:n,m:m,Z:Z,hd:hd,W:W,b1:b1,Vad:Vad,b2:b2,bp:bp,Hp:Hp,HL:HL,
    hoc:hoc,t0:t0,tp:tp,it:it,hv:hv,Lde:Lde,Lds:Lds,Lz:Lz,H2:H2,xL3:xL3,xL23:xL23,S1:S1,S2:S2,He3:He3,pBL:pBL,BL:BL,Ht:Ht,Hmax:Hmax};}

function revisionDesarenador_STAR(){
  var e=[],r=null;
  try{
    r=calcularDesarenador_STAR();
  }catch(err){
    e.push("No fue posible completar el cálculo del desarenador. Revisa los datos ingresados.");  }
  if(r&&!r.err){
    if(r.Re>=1)
      e.push("Re ≥ 1: la ley de Stokes no es válida. Revisa el diámetro de partícula y las propiedades del agua.");
    if(r.a/60<20)
      e.push("El tiempo de retención debe ser igual o mayor a 20 min.");
    if(r.H<0.75||r.H>1.5)
      e.push("La altura H calculada (H = Ts · Vs) está fuera del rango de 0,75–1,5 m.");
    if(r.VA>=r.Vs)
      e.push("No cumple la condición VA < Vs. Revisa las dimensiones del desarenador.");
    if(r.Vo>=0.25)
      e.push("La velocidad horizontal Vo debe ser menor de 0,25 m/s.");
    if(r.Vo/r.Vs>=20)
      e.push("La relación Vo/Vs debe ser menor de 20.");
    if(r.Ef<75)
      e.push("La eficiencia es menor al 75 %.");
    if(r.rVL<10||r.rVL>20)
      e.push("La relación entre el volumen de lodos y el volumen del desarenador debe estar entre 10 y 20 %.");
    if(r.Z<0)
      e.push("La separación entre columnas (Z) es negativa. Aumenta B o reduce el diámetro del orificio.");
    if(r.W<0||r.W>r.H)
      e.push("La separación entre filas (W) no cumple el criterio de diseño.");
    if(r.bp>0.50)
      e.push("La base adoptada de la plataforma supera 0,50 m. Revisa las dimensiones de entrada.");
    if(r.Hp<r.HL)
      e.push("La iteración del tiempo no alcanzó Hp ≥ HL: la plataforma se desborda.");
    if(r.Lz<=0)
      e.push("Los deflectores se cruzan: L/4 + 15·hv ("+nf(r.Lde+r.Lds,2)+" m) es mayor o igual que L ("+nf(r.L,2)+" m).");
    if(r.pBL<10||r.pBL>20)
      e.push("El borde libre debe estar entre el 10 y el 20 % de la altura H.");  }
  abrirRevision("Desarenador",e);}

function avisosParametrosDesarenador_STAR(){
  var e=[];
  var Vor=Number(PRO.desVor),a=Number(PRO.desA);
  if(PRO.desDp!==""&&Number(PRO.desDp)>0.1)
    e.push("El diámetro de la partícula debe ser menor o igual a 0,1 mm (diámetro mínimo a remover según la Res. 330 de 2017).");
  if(PRO.desVor!==""&&Vor>0.1)
    e.push("La velocidad en los orificios Vor debe ser menor o igual a 0,1 m/s.");
  if(PRO.desA!==""&&a<20)
    e.push("El tiempo de retención a debe ser mayor o igual a 20 min.");
  if(PRO.desBL!==""&&(Number(PRO.desBL)<10||Number(PRO.desBL)>20))
    e.push("El borde libre debe estar entre el 10 y el 20 % de la altura H (Clase No. 4).");
  if(!(Number(PRO.desPct)>0&&Number(PRO.desPct)<=100))
    e.push("El % del caudal tratado por el desarenador debe estar entre 1 y 100.");
  if(!(Number(PRO.desN)>=1)||Number(PRO.desN)!==Math.floor(Number(PRO.desN)))
    e.push("El número de desarenadores debe ser un entero mayor o igual a 1.");
  return e;}

function recalcularDesarenador_STAR(){
  var e=avisosParametrosDesarenador_STAR();
  if(e.length){abrirAdvertencia("Advertencia — Desarenador",e);return;}
  var r=calcularDesarenador_STAR();
  if(r.err){abrirAdvertencia("Advertencia — Desarenador",r.err);return;}
  pintarDesarenador_STAR();}

function desFilas_STAR(r){
  var x=seccion("1. VELOCIDAD DE SEDIMENTACIÓN (STOKES)");
  x+=filaDato("Caudal de diseño (QD)",r.QD,"m³/s",4,"Leído de la ventana Caudal de diseño.");
  x+=filaDato("Porcentaje del caudal tratado (%)",r.pct,"%",0,"Insertado en Términos de referencia.");
  x+=filaDato("Número de desarenadores (n)",r.nU,"",0,"Insertado en Términos de referencia.");
  x+=filaDato("Temperatura del agua (T)",r.T,"°C",1,"Insertado en Términos de referencia.");
  x+=filaDato("Diámetro de la partícula (dp)",Number(PRO.desDp),"mm",3,"Insertado en Términos de referencia.");
  x+=filaDato("Peso específico de la partícula (ρp)",r.rp,"kg/m³",0,"Insertado en Términos de referencia.");
  x+=fila("Caudal por desarenador",r.Q,"m³/s",4,"Q<sub>D</sub> = QD · (%/100) / n",nf(r.QD,4)+" × "+nf(r.pct,0)+" % / "+r.nU,"Porcentaje del caudal de diseño que trata el módulo, repartido entre los desarenadores.");
  x+=fila("Viscosidad cinemática del agua (ν)",r.nu,"m²/s",9,"ν = 4,34565×10<sup>-5</sup> / (T + 23,3)","4,34565e-5 / ("+nf(r.T,1)+" + 23,3)","Fórmula de la clase No. 4.");
  x+=fila("Viscosidad dinámica (μ)",r.mu,"kg/(m·s)",6,"μ = ν · ρ<sub>f</sub>",nf(r.nu,9)+" × 1000","ρ del agua = 1000 kg/m³.");
  x+=fila("Velocidad de sedimentación (Vs)",r.Vs,"m/s",5,"V<sub>s</sub> = g/18 · (ρ<sub>p</sub> − ρ<sub>f</sub>)/μ · d<sub>p</sub>²","9,81/18 × ("+nf(r.rp,0)+" − 1000)/"+nf(r.mu,6)+" × "+nf(r.dp,5)+"²","Ley de Stokes (Res. 330 de 2017: partícula de 0,1 mm y 2,65 g/cm³).");
  x+=fila("Número de Reynolds (Re)",r.Re,"",4,"Re = V<sub>s</sub> · d<sub>p</sub> / ν","Re = "+nf(r.Re,4),"Stokes es válido si Re < 1.",r.Re<1?"":"Re ≥ 1: la ley de Stokes no es válida.");
  x+=seccion("2. TIEMPO, ALTURA Y VOLUMEN");
  x+=filaDato("Condiciones de los deflectores",PRO.desCond,"",0,"Insertado en Términos de referencia.");
  x+=filaDato("Porcentaje de remoción",PRO.desRem,"%",0,"Insertado en Términos de referencia.");
  x+=fila("Relación a/t",r.at,"",3,"Tabla a/t — "+PRO.desCond+", remoción "+PRO.desRem+" %","a/t = "+nf(r.at,3),"Corcho y Duque, 1ª ed., p. 198.");
  x+=fila("Tiempo de retención (a)",r.a/60,"min",1,"<i>Dato de entrada</i> (RAS: ≥ 20 min)","a = "+nf(r.a/60,1),"Digitado por el usuario.",r.a/60<20?"El RAS exige a ≥ 20 min.":"");
  x+=fila("Tiempo de sedimentación (Ts)",r.Ts,"s",1,"T<sub>s</sub> = a / (a/t)",nf(r.a,0)+" / "+nf(r.at,3),"Se despeja Ts de a/t.");
  x+=fila("Altura del desarenador (H)",r.H,"m",3,"H = T<sub>s</sub> · V<sub>s</sub>",nf(r.Ts,1)+" × "+nf(r.Vs,5),"Se calcula (no se ingresa). El RAS recomienda 0,75–1,5 m para la zona efectiva.",(r.H<0.75||r.H>1.5)?"Fuera de 0,75–1,5 m.":"");
  x+=filaDato("Borde libre (% de H)",r.pBL,"%",0,"Clase No. 4: entre 10 y 20 % de H.");
  x+=fila("Borde libre (BL)",r.BL,"m",3,"BL = H · (%BL/100)",nf(r.H,3)+" × "+nf(r.pBL,0)+" / 100","Se deja sobre la altura efectiva H.",(r.pBL<10||r.pBL>20)?"Fuera de 10–20 %.":"");
  x+=fila("Altura total de muros (Ht)",r.Ht,"m",3,"H<sub>t</sub> = H + BL",nf(r.H,3)+" + "+nf(r.BL,3),"Altura de las paredes laterales sobre el fondo de la zona efectiva.");
  x+=fila("Volumen del desarenador (∀d)",r.Vd,"m³",2,"∀<sub>d</sub> = a · Q<sub>D</sub>",nf(r.a,0)+" × "+nf(r.Q,4),"");
  x+=seccion("3. DIMENSIONES Y VELOCIDADES");
  x+=fila("Superficie (As)",r.As,"m²",2,"A<sub>s</sub> = ∀<sub>d</sub> / H",nf(r.Vd,2)+" / "+nf(r.H,3),"");
  x+=fila("Ancho (B)",r.B,"m",3,"B = (A<sub>s</sub> / 4)<sup>1/2</sup>","("+nf(r.As,2)+" / 4)<sup>1/2</sup>","Relación largo/ancho mínima de 4.");
  x+=fila("Largo (L)",r.L,"m",3,"L = 4B","4 × "+nf(r.B,3),"Valores sin paredes de la estructura.");
  x+=fila("Velocidad ascensional (VA)",r.VA,"m/s",6,"V<sub>A</sub> = Q<sub>D</sub> / A<sub>s</sub>",nf(r.Q,4)+" / "+nf(r.As,2),"Carga superficial real.",r.VA<r.Vs?"":"Debe cumplirse VA < Vs.");
  x+=fila("Velocidad horizontal (Vo)",r.Vo,"m/s",4,"V<sub>o</sub> = Q<sub>D</sub> / (B · H)",nf(r.Q,4)+" / ("+nf(r.B,3)+" × "+nf(r.H,3)+")","Debe ser menor de 0,25 m/s.",r.Vo<0.25?"":"Vo ≥ 0,25 m/s.");
  x+=fila("Relación Vo / Vs",r.Vo/r.Vs,"",2,"V<sub>o</sub> / V<sub>s</sub> &lt; 20",nf(r.Vo,4)+" / "+nf(r.Vs,5),"Res. 330 de 2017.",r.Vo/r.Vs<20?"":"Vo/Vs ≥ 20.");
  x+=fila("Retención de partículas",r.Vs>r.VA?"CUMPLE (Vs > VA)":"NO CUMPLE","",0,"V<sub>s</sub> &gt; V<sub>A</sub>",nf(r.Vs,5)+(r.Vs>r.VA?" > ":" ≤ ")+nf(r.VA,6),"Si Vs > VA se retiene el 100 % o más.");
  x+=fila("Eficiencia (E)",r.Ef,"%",1,"E = (V<sub>s</sub> / V<sub>A</sub>) · 100",nf(r.Vs,5)+" / "+nf(r.VA,6)+" × 100","La clase pide una relación mayor a 75 %; se interpreta como eficiencia.",r.Ef>=75?"":"E menor a 75 %.","final");
  x+=seccion("4. ZONA DE LODOS");
  x+=fila("Profundidad para lodos calculada",r.hoc,"m",3,"L / h<sub>o</sub> = 10 / 1 → h<sub>o</sub> = L / 10",nf(r.L,3)+" / 10","Relación 10 a 1 del RAS.");
  x+=fila("Profundidad para lodos adoptada (ho)",r.ho,"m",3,"h<sub>o</sub> entre 0,75 y 1,5 m",r.hoc<0.75?"L/10 = "+nf(r.hoc,3)+" < 0,75 → h<sub>o</sub> = 0,75":r.hoc>1.5?"L/10 = "+nf(r.hoc,3)+" > 1,5 → h<sub>o</sub> = 1,50":"L/10 = "+nf(r.hoc,3)+" está en el rango → h<sub>o</sub> = "+nf(r.ho,3),"RAS: si da menor de 0,75 m se toma 0,75 m; si da mayor de 1,5 m se toma 1,5 m.","","final");
  x+=filaDato("Área de salida de lodos (AL)",r.AL,"m²",3);
  x+=fila("Volumen de lodos (∀L)",r.VL,"m³",2,"∀<sub>L</sub> = (h<sub>o</sub>/3) · (A<sub>s</sub> + A<sub>L</sub> + (A<sub>s</sub>·A<sub>L</sub>)<sup>1/2</sup>)","("+nf(r.ho,3)+"/3) × ("+nf(r.As,2)+" + "+nf(r.AL,3)+" + √("+nf(r.As,2)+"×"+nf(r.AL,3)+"))","Tronco de pirámide.");
  x+=fila("∀L / ∀d",r.rVL,"%",1,"(∀<sub>L</sub> / ∀<sub>d</sub>) · 100",nf(r.VL,2)+" / "+nf(r.Vd,2)+" × 100","Debe estar entre 10 y 20 %.",(r.rVL>=10&&r.rVL<=20)?"":"Fuera de 10–20 %.");
  x+=fila("Profundidad de la tolva (H2)",r.H2,"m",3,"H<sub>2</sub> = h<sub>o</sub>","H2 = "+nf(r.ho,3),"Punto más bajo de la tolva (figura de la clase).");
  x+=fila("Ubicación del punto más bajo",r.xL3,"m",3,"x = L / 3",nf(r.L,3)+" / 3","Medido desde el muro de entrada; ahí va la descarga de lodos.");
  x+=fila("Tramo hacia la salida",r.xL23,"m",3,"x = 2L / 3","2 × "+nf(r.L,3)+" / 3","Desde el punto más bajo hasta el vertedero de salida.");
  x+=fila("Pendiente del fondo hacia la entrada",r.S1,"%",1,"S<sub>1</sub> = h<sub>o</sub> / (L/3) · 100",nf(r.ho,3)+" / "+nf(r.xL3,3)+" × 100","Pendiente del tramo corto de la tolva.");
  x+=fila("Pendiente del fondo hacia la salida",r.S2,"%",1,"S<sub>2</sub> = h<sub>o</sub> / (2L/3) · 100",nf(r.ho,3)+" / "+nf(r.xL23,3)+" × 100","Pendiente del tramo largo de la tolva.");
  x+=fila("Profundidad total máxima",r.Hmax,"m",3,"H<sub>máx</sub> = BL + H + h<sub>o</sub>",nf(r.BL,3)+" + "+nf(r.H,3)+" + "+nf(r.ho,3),"Desde la corona del muro hasta el punto más bajo de la tolva.","","final");
  x+=seccion("5. DEFLECTORES");
  x+=filaDato("Velocidad en los orificios (Vor)",Number(PRO.desVor),"m/s",3,"Insertado en Términos de referencia.");
  x+=filaDato("Diámetro del orificio (Ør)",Number(PRO.desDor),"in",2,"Insertado en Términos de referencia.");
  x+=filaDato("Altura del deflector (H/n)","H/"+PRO.desDef,"",0,"Insertado en Términos de referencia.");
  x+=fila("Área total de orificios",r.Aor_t,"m²",4,"A<sub>orificios</sub> = Q<sub>D</sub> / V<sub>or</sub>",nf(r.Q,4)+" / "+nf(PRO.desVor,3),"Vor debe ser menor a 0,1 m/s.",Number(PRO.desVor)<=0.1?"":"Vor mayor a 0,1 m/s.");
  x+=fila("Área de un orificio (Aor)",r.Aor,"m²",5,"A<sub>or</sub> = π · Ø<sub>or</sub>² / 4","π × "+nf(r.d,4)+"² / 4","Ø en pulgadas × 0,0254.");
  x+=fila("Número de orificios",r.N,"",1,"N = A<sub>orificios</sub> / A<sub>or</sub>",nf(r.Aor_t,4)+" / "+nf(r.Aor,5),"");
  x+=fila("Columnas (n)",r.n,"",0,"n = (N · B / H)<sup>1/2</sup>, redondeado hacia arriba","√("+nf(r.N,1)+" × "+nf(r.B,3)+" / "+nf(r.H,3)+")","De m/n = H/B.");
  x+=fila("Filas (m)",r.m,"",0,"m = N / n, redondeado hacia arriba",nf(r.N,1)+" / "+r.n,"");
  x+=fila("Separación entre columnas (Z)",r.Z,"m",3,"Z = (B − n·Ø<sub>or</sub>) / (n + 1)","("+nf(r.B,3)+" − "+r.n+" × "+nf(r.d,4)+") / "+(r.n+1),"El ancho del desarenador es la longitud del deflector.",r.Z>=0?"":"Z negativo: aumenta B o reduce el diámetro.");
  x+=fila("Altura del deflector",r.hd,"m",3,"H/"+PRO.desDef,nf(r.H,3)+" / "+PRO.desDef,"H/2 o H/3 según elijas.");
  x+=fila("Separación entre filas (W)",r.W,"m",3,"W = (h<sub>def</sub> − m·Ø<sub>or</sub>) / (m + 1)","("+nf(r.hd,3)+" − "+r.m+" × "+nf(r.d,4)+") / "+(r.m+1),"Si es negativo hay que aumentar la altura del deflector; máximo H.",(r.W<0||r.W>r.H)?"Separación entre filas (W) no cumple el criterio de diseño. Sugerencia: modifica la altura del deflector o el número de filas para mantener W entre 0 y H.":"");
  x+=fila("Lámina sobre el vertedero de salida (hv)",r.hv,"m",3,"h<sub>v</sub> = H<sub>L</sub> = (Q<sub>D</sub> / (1,84 · B))<sup>1/1,5</sup>","("+nf(r.Q,4)+" / (1,84 × "+nf(r.B,3)+"))<sup>1/1,5</sup>","Se necesita aquí para ubicar el deflector de salida (ver sección 7).");
  x+=fila("Ubicación del deflector de entrada",r.Lde,"m",3,"L<sub>e</sub> = L / 4",nf(r.L,3)+" / 4","Medido desde el muro de entrada (figura de la clase).");
  x+=fila("Ubicación del deflector de salida",r.Lds,"m",3,"L<sub>s</sub> = 15 · h<sub>v</sub>","15 × "+nf(r.hv,3),"Medido aguas arriba del vertedero de salida.");
  x+=fila("Separación entre deflectores",r.Lz,"m",3,"L<sub>z</sub> = L − L/4 − 15·h<sub>v</sub>",nf(r.L,3)+" − "+nf(r.Lde,3)+" − "+nf(r.Lds,3),"Zona de sedimentación entre deflectores; debe ser positiva.",r.Lz>0?"":"Los deflectores se cruzan.","final");
  x+=seccion("6. PLATAFORMA DE ENTRADA AL DESARENADOR");
  x+=fila("Base de plataforma 1 (Vo hallado)",r.b1===null?"—":r.b1,r.b1===null?"":"m",3,"b<sub>1</sub> = Q<sub>D</sub> / (B · V<sub>o</sub>)",r.b1===null?"Sin canal de aducción calculado":nf(r.Q,4)+" / ("+nf(r.B,3)+" × "+nf(r.Vad,3)+")","Vo hallado = velocidad del canal de aducción (ventana Aducción).");
  x+=fila("Base de plataforma 2 (Vo = 0,5 m/s)",r.b2,"m",3,"b<sub>2</sub> = Q<sub>D</sub> / (B · 0,5)",nf(r.Q,4)+" / ("+nf(r.B,3)+" × 0,5)","Velocidad mínima del RAS.");
  x+=fila("Base de la plataforma (adoptada)",r.bp,"m",3,"máx(0,30; b<sub>1</sub>; b<sub>2</sub>)","máx(0,30; "+(r.b1===null?"—":nf(r.b1,3))+"; "+nf(r.b2,3)+")","Entre 0,30 y 0,50 m por limpieza y maniobra; si es menor se toma 0,30 m y si es mayor se deja el valor mayor.",r.bp>0.5?"Mayor de 0,50 m.":"","final");
  x+=fila("Largo de la plataforma",r.B,"m",3,"Largo = B",nf(r.B,3),"La plataforma ocupa todo el ancho del desarenador.");
  x+=fila("Lámina de agua (HL)",r.HL,"m",3,"H<sub>L</sub> = (Q<sub>D</sub> / (1,84 · B))<sup>1/1,5</sup>","("+nf(r.Q,4)+" / (1,84 × "+nf(r.B,3)+"))<sup>1/1,5</sup>","Vertedero rectangular de Francis: Q = 1,84 · L · H<sup>1,5</sup>, con L = B, H = HL y Q = QD.");
  var lst=r.it, mostrar=lst.length<=12?lst:lst.slice(0,5).concat([null]).concat(lst.slice(-5));
  var tabla=mostrar.map(function(o){return o?"t = "+nf(o.t,1)+" s → Hp = "+nf(o.Hp,3)+" m "+(o.Hp>=r.HL?"≥":"<")+" HL = "+nf(r.HL,3)+" m"+(o.Hp>=r.HL?" ✔":""):"…";}).join("<br>");
  x+=fila("Iteración del tiempo (t)",r.tp,"s",1,"Caudal = ∀ / t, con ∀ = base · B · Hp → H<sub>p</sub> = (Q<sub>D</sub> · t) / (B · base); t inicia en 0,5 s y sube 0,5 s hasta H<sub>p</sub> ≥ H<sub>L</sub>",tabla,lst.length+" iteraciones (no se digita).",r.Hp>=r.HL?"":"No converge.");
  x+=fila("Altura de la plataforma de entrada (Hp)",r.Hp,"m",3,"H<sub>p</sub> = (Q<sub>D</sub> · t) / (B · base)",nf(r.Q,4)+" × "+nf(r.tp,1)+" / ("+nf(r.B,3)+" × "+nf(r.bp,3)+")","Con el t de la iteración; la plataforma contiene la lámina HL y no se desborda.","","final");
  x+=seccion("7. PLATAFORMA DE SALIDA DEL DESARENADOR");
  x+=fila("Base de la plataforma de salida",r.bp,"m",3,"base salida = base entrada","base = "+nf(r.bp,3),"Clase No. 4.");
  x+=fila("Longitud del vertedero de salida",r.B,"m",3,"L = B",nf(r.B,3),"Longitud del vertedero = ancho del desarenador.");
  x+=fila("Altura de la plataforma de salida",r.Hp,"m",3,"altura salida = altura entrada (Hp)","Hp = "+nf(r.Hp,3),"Clase No. 4.");
  x+=fila("Lámina sobre el vertedero de salida (hv)",r.hv,"m",3,"h<sub>v</sub> = (Q<sub>D</sub> / (1,84 · B))<sup>1/1,5</sup>","("+nf(r.Q,4)+" / (1,84 × "+nf(r.B,3)+"))<sup>1/1,5</sup>","Mismo vertedero de Francis (L = B), por eso hv = HL.","","final");
  return x;}

function pintarDesarenador_STAR(){
  var h='<div class="titulo"><h1>DISEÑO DE DESARENADORES</h1><p>Remoción de partículas de arena de 0,1 mm (Res. 330 de 2017) y diseño de deflectores y plataformas.</p></div>'+CONV;
  if(!PRO.Q){
    h+='<div class="aviso"><b>Falta el caudal de diseño.</b> Calcula primero la ventana de <i>Caudal de diseño</i>.<br><button onclick="irVista(\'caudal_STAR\')">Ir a caudal de diseño</button></div>';
    gid("pane-desarenador_STAR").innerHTML=h; return;}
  var r=calcularDesarenador_STAR(), bt='<div class="acciones"><button class="btn btn-primary" style="width:auto;padding:0 22px" onclick="recalcularDesarenador_STAR()">RECALCULAR</button><button class="btn-revision" onclick="revisionDesarenador_STAR()">REVISIÓN DE ERRORES</button><button class="btn-sec" onclick="abrirTodo(\'pane-desarenador_STAR\',true)">VER TODA LA MEMORIA DE CÁLCULO</button><button class="btn-sec" onclick="abrirTodo(\'pane-desarenador_STAR\',false)">CONTRAER TODO</button></div>';
  h+=tarjetaDistribucionDes_STAR(r);
  h+='<div class="card"><div class="card-title">Parámetros del desarenador</div><div class="card-sub">Los parámetros de esta tarjeta corresponden únicamente al dimensionamiento hidráulico y de sedimentación.</div>'+
   '<div class="row">'+campo("Temperatura del agua (°C)","desT","number",'step="0.5"')+'</div>'+
   '<div class="row">'+campo("Diámetro de la partícula (mm)","desDp","number",'step="0.01"')+campo("Peso específico de la partícula (kg/m³)","desRho","number",'step="10"')+selec("Condiciones de los deflectores","desCond",Object.keys(DP_STAR.T.AT))+selec("% de remoción","desRem",DP_STAR.T.REM)+'</div>'+
   '<div class="row">'+campo("Tiempo de retención a (min)","desA","number",'step="1"')+campo("Área de salida de lodos AL (m²)","desAL","number",'step="0.05"')+'</div>'+
   '<div class="row">'+campo("Velocidad en orificios Vor (m/s, ≤ 0,1)","desVor","number",'step="0.01"')+campo("Diámetro del orificio (in)","desDor","number",'step="0.25"')+selec("Altura del deflector (H/…)","desDef",["2","3"])+campo("Borde libre (% de H, 10–20)","desBL","number",'step="1"')+'</div>'+bt+'</div>';
 if(!r.err){PRO.DES={Q:r.Q,B:r.B,L:r.L,H:r.H,Ht:r.Ht,ho:r.ho,hv:r.hv,Hp:r.Hp,bp:r.bp};}else{PRO.DES=null;}
if(!r.err)h+='<div class="card"><div class="card-title">Esquemas del desarenador</div><div class="svg-wrap">'+svgPlantaDes_STAR(r)+'</div><div class="svg-wrap">'+svgPerfilDes_STAR(r)+'</div><div class="svg-wrap">'+svgPlatEntradaDes_STAR(r)+'</div><div class="svg-wrap">'+svgPlatSalidaDes_STAR(r)+'</div></div>';
if(!r.err)h+=aduMemoCard_STAR("Memoria de cálculo — desarenador",desFilas_STAR(r));
/* Sin tarjeta de error: el detalle sale en la advertencia o en Revisión de errores. */
  guardarPro(); actualizarEstados();
  gid("pane-desarenador_STAR").innerHTML=h;}

MODULOS.push({
  id:"desarenador_STAR",
  titulo:"Desarenador",
  descripcion:"Remoción de arena fina (0,1 mm) por sedimentación, con deflectores y plataformas.",
  grupo:"hidraulico", orden:7, icono:"m2", iconoSvg:"<path d=\"M4 5h16l-6 8v6l-4-2v-4z\"/>",
  valores:{"DES": null, "desPct": 100, "desN": 2, "desT": 20, "desDp": 0.1, "desRho": 2650, "desCond": "", "desRem": "", "desA": 20, "desAL": 0.25, "desVor": 0.1, "desDor": 2, "desDef": "2", "desBL": 15},
  indicador:true, imprimible:true,
  normalizar:function(PRO){
    normFix("desCond",Object.keys(DP_STAR.T.AT)); normFix("desRem",DP_STAR.T.REM); normFix("desDef",["2","3"]);
  },
  completo:function(PRO){return !!PRO.DES;},
  pintar:pintarDesarenador_STAR,
  recalcular:recalcularDesarenador_STAR,
  errores:function(){var e=avisosParametrosDesarenador_STAR();if(!e.length){try{var r=calcularDesarenador_STAR();if(r&&r.err)e=[].concat(r.err);}catch(_){}}return e;}
});
