/* ##########################################################
   STAR · SISTEMAS DE TRATAMIENTO DE AGUA RESIDUAL
   MÓDULO DATOS PRELIMINARES  (posición 1 en el menú) — tablas.js
   Tablas del RAS (dotaciones, complejidad, coeficientes, infiltración, PVC, Parshall...) consultadas como DP_STAR.T.<nombre>.
   Sufijo: las funciones y variables globales de este archivo terminan en _STAR
   (así no chocan con los módulos de STAP, IHS o RS que tengan el mismo nombre).
   ########################################################## */
/* ==========================================================
   MÓDULO DATOS PRELIMINARES — tablas.js
   ========================================================== */

/* ==========================================================
   MÓDULO DATOS PRELIMINARES — tablas.js
   Único propietario de las tablas, constantes físicas y propiedades de
   materiales del proyecto. Los demás módulos las consultan por DP_STAR.T.<nombre>
   o DP_STAR.tabla("<nombre>"); ninguno define sus propias tablas.
   ========================================================== */

/* ================= 22. PROYECCION POBLACIONAL ================= */
var DP_STAR={T:{},
  tabla:function(nombre){ return DP_STAR.T[nombre]; },
  /* Nivel de complejidad según población (RAS) */
  nivelComplejidad:function(p){return p<=2500?"Bajo":p<=12500?"Medio":p<=60000?"Medio Alto":"Alto";}};

/* ================= FUNCIONES DE TABLAS ================= */

/* ================= 1. NIVEL DE COMPLEJIDAD ================= */
DP_STAR.T.COMPLEJIDAD=[["Bajo","≤ 2 500"],["Medio","2 501 – 12 500"],["Medio Alto","12 501 – 60 000"],["Alto","> 60 000"]];

function bloqueComplejidad_STAR(){return tablaHTML("Nivel de complejidad del sistema",["Nivel","Población (hab)"],DP_STAR.T.COMPLEJIDAD);}

/* ================= 2. DOTACIÓN NETA ================= */
DP_STAR.T.DOT={"Bajo":110,"Medio":135,"Medio Alto":145,"Alto":155};

function bloqueDotacion_STAR(){return tablaHTML("Dotación neta máxima",["Nivel","Dotación neta (L/hab·d)"],Object.keys(DP_STAR.T.DOT).map(k=>[k,DP_STAR.T.DOT[k]]));}

/* ================= 3. COEFICIENTES DE AFECTACIÓN ================= */
DP_STAR.T.AFEC={"NIVEL SOCIOECONÓMICO":["INCIERTO",0.8,1.2],"TEMPERATURA":["DIRECTO",0.9,1.2],"MICROMEDICIÓN":["INVERSO",0.7,1.1],"PRECIO":["INVERSO",0.7,1.2],"CALIDAD DEL AGUA Y PRESIÓN EN LA RED":["DIRECTO",0.9,1.2],"DESARROLLO INDUSTRIAL":["DIRECTO",1,1.2],"POBLACIÓN FLOTANTE":["DIRECTO",1,1.2]};

function bloqueAfectacion_STAR(){return tablaHTML("Coeficientes de afectación de la dotación neta",["Factor","Sentido","Rango admisible"],Object.keys(DP_STAR.T.AFEC).map(k=>[k,DP_STAR.T.AFEC[k][0],nf(DP_STAR.T.AFEC[k][1],1)+" – "+nf(DP_STAR.T.AFEC[k][2],1)]));}

/* ================= 4. CONTRIBUCIÓN NO DOMÉSTICA ================= */
DP_STAR.T.IND={"Bajo":0.4,"Medio":0.6,"Medio Alto":0.8,"Alto":1};

function bloqueContribucion_STAR(){
  var f=Object.keys(DP_STAR.T.IND).map(k=>["Industrial — Nivel "+k,nf(DP_STAR.T.IND[k],1)+" L/s·Ha"]);
  f.push(["Comercial (todos los niveles)","0,15 L/s·Ha"],["Institucional (todos los niveles)","0,5 L/s·Ha"],["Conexiones erradas","0,2 L/s·Ha de área urbana"]);
  return tablaHTML("Contribución no doméstica y otros aportes",["Concepto","Valor"],f);}

/* ================= 5. INFILTRACIÓN ================= */
DP_STAR.T.INF={"Alta":0.3,"Media":0.2,"Baja":0.1};
function bloqueInfiltracion_STAR(){return tablaHTML("Aporte por infiltración",["Tipo","Aporte"],Object.keys(DP_STAR.T.INF).map(k=>[k,nf(DP_STAR.T.INF[k],1)+" L/s·Ha"]));}

/* ================= 6. MAYORACIÓN DEL CAUDAL ================= */
function bloqueMayorizacion_STAR(){return tablaHTML("Métodos de mayoración del caudal medio diario",["Método","Fórmula"],[["Flowers","F = 3,5 / (P/1000)^0,1"],["Angels","F = 3,53 / Qmd^0,062"],["Gaines","F = 3,114 / Qmd^0,062"]]);}

/* ================= 7. SEPARACIÓN DE BARROTES ================= */
DP_STAR.T.GRAVA={"FINAS":[0.02,0.04],"MEDIAS":[0.04,0.075],"GRUESAS":[0.075,0.15]};
function bloqueGrava_STAR(){return tablaHTML("Separación entre barrotes según tipo de grava",["Tipo de grava","Rango (m)"],Object.keys(DP_STAR.T.GRAVA).map(k=>[k,nf(DP_STAR.T.GRAVA[k][0],3)+" – "+nf(DP_STAR.T.GRAVA[k][1],3)]),nota("En el módulo de rejilla se adopta el límite superior del rango."));}

/* ================= 8. COEFICIENTE DE FORMA ================= */
DP_STAR.T.FORMA={"C1":2.42,"C2":1.83,"C3":1.67,"C4":1.035,"C5":0.92,"C6":0.76,"C7":1.79};
function bloqueForma_STAR(){return tablaHTML("Coeficiente de forma del barrote (Kirschmer)",["Forma","β"],Object.keys(DP_STAR.T.FORMA).map(k=>[k,nf(DP_STAR.T.FORMA[k],3)]),nota("C1 rectangular · C2 rect. bordes redondeados · C3 circular · C4–C6 perfiles hidrodinámicos · C7 circular con nariz."));}

/* ================= 9. INCLINACIÓN DE REJILLA ================= */
DP_STAR.T.INCL={"VERTICALES":80,"INCLINADAS":60};
function bloqueInclinacion_STAR(){return tablaHTML("Inclinación típica de la rejilla",["Tipo","Rango típico"],[["Verticales","75° – 85°"],["Inclinadas","45° – 60°"]],nota("En el módulo de rejilla el ángulo es editable y admite cualquier valor deseado."));}

/* ================= 10. MANNING ================= */
DP_STAR.T.MANNING={"Metal liso":0.009,"Hormigón":0.013,"Terreno natural en roca lisa":0.035,"Terreno natural en tierra con poca vegetación":0.027,"Terreno natural en tierra con vegetación abundante":0.08,"Cemento mortero":0.013,"Cemento pulido":0.011,"Cemento áspero":0.016,"Concreto liso":0.012,"Mampostería":0.015,"Piedra":0.025,"Piedra sobre mortero":0.035};
function bloqueManning_STAR(){return tablaHTML("Coeficiente de rugosidad de Manning (n)",["Material","n"],Object.keys(DP_STAR.T.MANNING).map(k=>[k,nf(DP_STAR.T.MANNING[k],3)]));}

/* ================= 11. HAZEN-WILLIAMS ================= */
DP_STAR.T.HW={"ACERO":[90,90],"HIERRO FUNDIDO":[80,100],"PVC":[80,140],"FIBRA CEMENTO":[128,128],"POLIETILENO":[150,150],"CONCRETO":[100,140],"COBRE":[130,140]};
function bloqueHazen_STAR(){return tablaHTML("Coeficiente de Hazen–Williams (C)",["Material","C"],Object.keys(DP_STAR.T.HW).map(k=>{var r=DP_STAR.T.HW[k];return [k,r[0]===r[1]?nf(r[0],0):nf(r[0],0)+" – "+nf(r[1],0)];}));}

/* ================= 12. CATÁLOGO PVC ================= */
DP_STAR.T.PVC=[
    ["1/2",21.0,[null,null,1.8,1.8]],
    ["3/4",26.5,[null,null,1.8,1.8]],
    ["1",33.0,[null,null,1.8,2.3]],
    ["1 1/4",42.0,[null,1.8,2.0,2.9]],
    ["1 1/2",48.0,[null,1.8,2.3,3.3]],
    ["2",60.0,[1.8,2.2,2.9,4.2]],
    ["2 1/2",73.0,[1.8,2.6,3.5,5.1]],
    ["3",88.5,[2.2,3.2,4.2,6.2]],
    ["4",114.0,[2.8,4.1,5.4,8.0]],
    ["6",168.0,[4.1,6.1,8.0,11.7]],
    ["8",219.0,[5.3,7.9,10.4,15.3]],
    ["10",273.0,[6.7,9.9,13.0,19.0]],
    ["12",323.0,[7.9,11.7,15.4,22.5]]];

function bloquePVC_STAR(){
  var f=DP_STAR.T.PVC.map(p=>[p[0]+'"',nf(p[1],1),...[0,1,2,3].map(i=>(p[2]&&p[2][i]!=null)?nf(p[2][i],1)+" / "+nf(p[1]-2*p[2][i],1):"—")]);
  return tablaHTML("Catálogo comercial de tubería PVC (Tabla 10)",["Nominal","Ø ext (mm)","Clase 5 · 75 psi","Clase 7,5 · 105 psi","Clase 10 · 150 psi","Clase 15 · 200 psi"],f,nota("Cada celda: espesor e / diámetro interior (mm)."));}

/* ================= 13. CLASES PVC Y PRESIÓN ================= */
function bloqueClasesPVC_STAR(){
  return tablaHTML("Clases de tubería PVC y presión de trabajo",["Clase","Presión (psi)","Presión (bar)","Presión de trabajo (m.c.a.)"],["5","7.5","10","15"].map(c=>["Clase "+nf(Number(c),c==="7.5"?1:0),DP_STAR.T.PSI_CLASE[c],nf(Number(c),c==="7.5"?1:0),nf(DP_STAR.T.PSI_CLASE[c]*0.703,2)]),nota("P<sub>trab</sub> = psi × 0,703. La presión total sobre la válvula (estática + sobrepresión) debe ser menor o igual a la presión de trabajo."));}

/* ================= 14. ACCESORIOS ================= */
DP_STAR.T.ACCESORIOS={"Codos":{"Codo radio corto 90° con bridas":0.3,"Codo radio corto 90° roscado":1.5,"Codo radio largo 90° con bridas":0.2,"Codo radio largo 90° roscado":0.7,"Codo radio largo 45° con bridas":0.2,"Codo radio corto 45° roscado":0.4},"Curvas":{"Curva 180° con bridas":0.2,"Curva 180° roscada":1.5},"Tees":{"Tee paso directo roscado":0.9,"Tee paso directo con bridas":0.2,"Tee salida de lado con bridas":1.0,"Tee salida de lado roscada":2.0},"Unión":{"Unión con extremos roscados":0.08},"Válvulas":{"Válvula de globo abierta":10,"Válvula de ángulo abierta":2,"Válvula de compuerta abierta":0.15,"Válvula de compuerta 1/4 cerrada":0.26,"Válvula de compuerta 1/2 cerrada":2.1,"Válvula de compuerta 3/4 cerrada":17,"Válvula de cheque":2,"Válvula de bola totalmente abierta":0.05,"Válvula de bola 1/3 cerrada":5.5,"Válvula de bola 2/3 cerrada":210}};
function bloqueAccesorios_STAR(){
  var f=[];
  Object.keys(DP_STAR.T.ACCESORIOS).forEach(g=>Object.keys(DP_STAR.T.ACCESORIOS[g]).forEach(k=>f.push([g,k,nf(DP_STAR.T.ACCESORIOS[g][k],2)])));
  return tablaHTML("Coeficientes K de accesorios",["Categoría","Accesorio","K"],f);}

/* ================= 15. MÓDULOS DE ELASTICIDAD ================= */
DP_STAR.T.ELAST_GPA={"Acero":206.8,"Aluminio":72.4,"Asbesto cemento":23.4,"Bronce":103.4,"Cobre":110.3,"Concreto":3.9,"Fibra de vidrio reforzada":8.96,"Hierro dúctil":165.5,"Polietileno (corto plazo)":0.9,"Polietileno (largo plazo)":0.2,"PVC":2.75};
function bloqueElasticidad_STAR(){return tablaHTML("Módulos de elasticidad (RAS Título B.6.36)",["Material","E (GPa)"],Object.keys(DP_STAR.T.ELAST_GPA).map(k=>[k,nf(DP_STAR.T.ELAST_GPA[k],2)]),nota("Módulo de elasticidad del agua: 2,1 GPa."));}

/* ================= 16. VISCOSIDAD CINEMÁTICA ================= */
function bloqueViscosidad_STAR(){return tablaHTML("Viscosidad cinemática del agua",["Temperatura (°C)","ν (×10<sup>-6</sup> m²/s)"],DP_STAR.T.VISC.map(v=>[v[0],nf(v[1],3)]));}

/* ================= 17. VALORES a/t DESARENADORES ================= */
function bloqueAT_STAR(){return tablaHTML("Valores de a/t (Desarenadores)",["Condiciones","Remoción 50 %","Remoción 75 %","Remoción 87,5 %"],Object.keys(DP_STAR.T.AT).map(k=>[k,...DP_STAR.T.AT[k].map(v=>nf(v,3))]),nota("Fuente: Corcho y Duque, 1ª ed., p. 198."));}

/* ================= 18. ADUCCIÓN: CANAL ABIERTO ================= */

DP_STAR.T.CANAL={"Rectangular":{k:0.92,kt:"0,92",wb:1,z:0,fb:2,bt:"b = 2h",am:function(h,b){return b*h;},amt:"A<sub>m</sub> = b · h",pm:function(h,b){return b+2*h;},pmt:"P<sub>m</sub> = b + 2h"},"Trapezoidal":{k:0.91,kt:"0,91",wb:1,z:1,fb:1,bt:"b = h",am:function(h,b){return 2*h*h;},amt:"A<sub>m</sub> = 2h²",pm:function(h,b){return 3.82*b;},pmt:"P<sub>m</sub> = 3,82 · b"},"Triangular":{k:1.90,kt:"1,90",wb:0,z:0.5,fb:1,bt:"b = h",am:function(h,b){return 0.5*h*h;},amt:"A<sub>m</sub> = 0,5h²",pm:function(h,b){return 2.24*b;},pmt:"P<sub>m</sub> = 2,24 · b"}};
function bloqueCanal_STAR(){return tablaHTML("Aducción — Canal abierto",["Parámetro","Mínimo","Máximo","Unidad"],[["Pendiente S","14","16","%"],["Borde libre BL","0,30","0,50","m"],["Velocidad horizontal Vo","0,5","—","m/s"],["Relación base / altura","Rectangular b = 2h · Trapezoidal y triangular b = h","",""]],nota("Sección rectangular, trapezoidal o triangular."));}

/* ================= 19. ADUCCIÓN: TUBERÍA ================= */
function bloqueTuberia_STAR(){return tablaHTML("Aducción — Tubería y golpe de ariete",["Parámetro","Mínimo","Máximo","Unidad"],[["Pendiente S","14","16","%"],["Velocidad Vo","0,5","—","m/s"],["Presión de diseño","—","Presión estática × 1,30 ≤ presión de trabajo","m.c.a."],["Presión total sobre la válvula","—","≤ presión de trabajo","m.c.a."],["Cierre rápido / lento","t ≤ 2L/C: rápido","t > 2L/C: lento (Michaud)","s"],["Presión de trabajo","1 psi = 0,703 m.c.a.","",""]],nota("Hazen–Williams y verificación de presiones."));}

/* ================= 20. DESARENADOR: DIMENSIONAMIENTO ================= */
function bloqueDesarenador_STAR(){return tablaHTML("Desarenador — Dimensionamiento",["Parámetro","Mínimo","Máximo","Unidad"],[["Diámetro de la partícula de diseño","0,1","—","mm"],["Peso específico de la partícula","2,65","2,65","g/cm³"],["Número de Reynolds (Stokes)","—","< 1","—"],["Velocidad horizontal Vo","—","< 0,25","m/s"],["Relación Vo / Vs","—","< 20","—"],["Tiempo de retención a","20","—","min"],["Altura efectiva H","0,75","1,5","m"],["Relación largo / ancho","4","—","—"],["Velocidad ascensional VA","—","< Vs","m/s"],["Eficiencia E = Vs/VA","75","—","%"],["Profundidad de lodos ho (L/ho = 10)","0,75","1,5","m"],["Volumen de lodos / volumen total","10","20","%"]],nota("Res. 330 de 2017."));}

/* ================= 21. DESARENADOR: DEFLECTORES ================= */
function bloqueDeflectores_STAR(){return tablaHTML("Desarenador — Deflectores",["Parámetro","Mínimo","Máximo","Unidad"],[["Velocidad en los orificios Vor","—","< 0,1","m/s"],["Altura del deflector","H/3","H/2","m"],["Separación entre filas W","0","H","m"]]);}

/* ================= 22. DESARENADOR: PLATAFORMAS ================= */
function bloquePlataformas_STAR(){return tablaHTML("Desarenador — Plataformas de entrada y salida",["Parámetro","Mínimo","Máximo","Unidad"],[["Base de la plataforma","0,30","0,50","m"],["Velocidad de referencia","0,5","—","m/s"],["Lámina de agua (Francis)","Q = 1,84 · L · H<sup>1,5</sup>","",""]]);}


/* ================= 22. ADUDCCION ================= */
DP_STAR.T.PSI_CLASE={"5":75,"7.5":105,"10":150,"15":200};


/* ================= 22. DESARENADOR:  ================= */
DP_STAR.T.AT={"Máximo teórico":[0.5,0.75,0.875],"Depósitos con muy buenos deflectores":[0.73,1.52,2.37],"Depósitos con buenos deflectores":[0.76,1.66,2.75],"Depósitos con deficientes deflectores o sin ellos":[1,3,7]};
DP_STAR.T.VISC=[[0,1.785],[5,1.519],[10,1.306],[15,1.141],[18,1.060],[20,1.003],[25,0.893],[30,0.800],[40,0.658],[50,0.553],[60,0.474],[70,0.413],[80,0.364],[90,0.326],[100,0.294]];
DP_STAR.T.REM=["50","75","87.5"];


/* ================= 24. CANALETA ================= */
DP_STAR.T.PAR=[
 {id:"3", lab:'3"',  W:0.076,K:0.176,n:1.547,Qmin:0.85, Qmax:28.31,  A:46.6, B:45.7, C:17.8, D:25.9, E:38.1,F:15.2,G:30.5,Kd:2.5,N:5.7},
 {id:"6", lab:'6"',  W:0.152,K:0.381,n:1.580,Qmin:1.42, Qmax:110.44, A:62.1, B:61.0, C:39.4, D:40.3, E:45.7,F:30.5,G:61.0,Kd:7.6,N:11.4},
 {id:"9", lab:'9"',  W:0.229,K:0.535,n:1.530,Qmin:2.58, Qmax:252.00, A:88.0, B:86.0, C:38.0, D:57.5, E:61.0,F:61.0,G:45.7,Kd:7.6,N:22.9},
 {id:"12",lab:"1'",  W:0.305,K:0.690,n:1.522,Qmin:3.11, Qmax:455.90, A:137.2,B:134.4,C:61.0, D:84.5, E:91.5,F:61.0,G:91.5,Kd:7.6,N:22.9},
 {id:"18",lab:"1 ½'",W:0.457,K:1.054,n:1.538,Qmin:4.24, Qmax:696.50, A:144.9,B:142.0,C:76.2, D:102.6,E:91.5,F:61.0,G:91.5,Kd:7.6,N:22.9},
 {id:"24",lab:"2'",  W:0.610,K:1.426,n:1.550,Qmin:11.90,Qmax:937.30, A:152.5,B:149.6,C:91.5, D:120.7,E:91.5,F:61.0,G:91.5,Kd:7.6,N:22.9},
 {id:"36",lab:"3'",  W:0.915,K:2.182,n:1.566,Qmin:17.27,Qmax:1427.20,A:167.7,B:164.5,C:122.0,D:157.2,E:91.5,F:61.0,G:91.5,Kd:7.6,N:22.9},
 {id:"48",lab:"4'",  W:1.220,K:2.935,n:1.578,Qmin:36.81,Qmax:1922.70,A:183.0,B:179.5,C:152.2,D:193.8,E:91.5,F:61.0,G:91.5,Kd:7.6,N:22.9},
 {id:"60",lab:"5'",  W:1.525,K:3.728,n:1.587,Qmin:45.31,Qmax:2424.00,A:198.3,B:194.1,C:183.0,D:230.3,E:91.5,F:61.0,G:91.5,Kd:7.6,N:22.9},
 {id:"72",lab:"6'",  W:1.830,K:4.515,n:1.595,Qmin:73.62,Qmax:2931.00,A:213.5,B:209.0,C:213.5,D:266.7,E:91.5,F:61.0,G:91.5,Kd:7.6,N:22.9},
 {id:"84",lab:"7'",  W:2.135,K:5.306,n:1.601,Qmin:null, Qmax:null,   A:228.8,B:224.0,C:244.0,D:303.0,E:91.5,F:61.0,G:91.5,Kd:7.6,N:22.9},
 {id:"96",lab:"8'",  W:2.440,K:6.101,n:1.606,Qmin:null, Qmax:null,   A:244.0,B:239.2,C:274.5,D:340.0,E:91.5,F:61.0,G:91.5,Kd:7.6,N:22.9}];

 DP_STAR.T.PAR_KING={"3":0.992,"6":2.06,"9":3.07,"12":4.00,"18":6.00,"24":8.00,"36":12.00,"48":16.00,"60":20.00,"72":24.00,"84":28.00,"96":32.00};


/* ================= TABLAS EXCLUSIVAS DE ANTIGUOS MÓDULOS ================= */
function bloqueParshall_STAR(){
  var lim=tablaHTML("Canaleta Parshall — Límites de caudal y coeficientes",["Ancho W","W (m)","Q mín (L/s)","Q máx (L/s)","K","n"],DP_STAR.T.PAR.map(function(f){return [f.lab,nf(f.W,3),f.Qmin==null?"—":nf(f.Qmin,2),f.Qmax==null?"—":nf(f.Qmax,2),nf(f.K,3),nf(f.n,3)];}),nota("Q = K · Ha<sup>n</sup> (Q en m³/s, Ha en m)."));
  var kn=tablaHTML("Canaleta Parshall — Coeficientes K y n (cálculo de Ha)",["W (pulg / pies)","W (m)","K (unidades métricas)","K (unidades inglesas)","n (exponente)"],DP_STAR.T.PAR.map(function(f){return [f.lab,nf(f.W,3),nf(f.K,3),nf(DP_STAR.T.PAR_KING[f.id],2),nf(f.n,3)];}),nota("Q = K · Ha<sup>n</sup>  →  Ha = (Q / K)<sup>1/n</sup>. K métrico: Q en m³/s y Ha en m. K inglés: Q en pies³/s y Ha en pies."));
  var dim=tablaHTML("Canaleta Parshall — Dimensiones típicas (cm)",["W","A","B","C","D","E","F","G","K","N"],DP_STAR.T.PAR.map(function(f){return [f.lab,nf(f.A,1),nf(f.B,1),nf(f.C,1),nf(f.D,1),nf(f.E,1),nf(f.F,1),nf(f.G,1),nf(f.Kd,1),nf(f.N,1)];}));
  var cri=tablaHTML("Canaleta Parshall — Criterios de diseño como mezclador",["Parámetro","Mínimo","Máximo","Unidad"],[["Relación Ha / W","0,4","0,8","—"],["Velocidad antes del resalto V2","> 2","—","m/s"],["Velocidad en el canal de salida V5","> 0,75","—","m/s"],["Número de Froude Fr","1,7 (débil) - 4,5 (estable)","4,5 - 9,0 — No debe estar entre 2,5 y 4,5","—"],["Sumergencia máx. Hb/Ha (W de 3\" a 9\")","—","0,6","—"],["Sumergencia máx. Hb/Ha (W de 1' a 8')","—","0,7","—"],["Sumergencia máx. Hb/Ha (W de 10' a 50')","—","0,8","—"],["Gradiente de velocidad G (mezclador hidráulico)","1000","2000","s⁻¹"],["Tiempo de mezcla td (mezclador hidráulico)","—","< 1","s"],["Elevación de la cresta","X<sub>rec</sub> = 1,1 · X","",""]]);
  return lim+kn+dim+cri;}