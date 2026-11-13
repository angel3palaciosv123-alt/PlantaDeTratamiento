/* ##########################################################
   STAR · SISTEMAS DE TRATAMIENTO DE AGUA RESIDUAL
   MÓDULO DESARENADOR  (posición 7 en el menú) — desarenador_svg.js
   Dibujos del desarenador: vista en planta y perfil.
   Sufijo: las funciones y variables globales de este archivo terminan en _STAR
   (así no chocan con los módulos de STAP, IHS o RS que tengan el mismo nombre).
   ########################################################## */
// Dependencias: svgDefs/svgDimH/svgDimV y nf.
/* ==========================================================
   VISTA EN PLANTA Y PERFIL DEL DESARENADOR
   ========================================================== */

function svgPlantaDes_STAR(r){
function dsnDefs(){
  return '<defs>'+
   '<linearGradient id="dsnAgua" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E0F2FE"/><stop offset="1" stop-color="#93C5FD"/></linearGradient>'+
   '<linearGradient id="dsnLodo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DDB06C"/><stop offset="1" stop-color="#A16207"/></linearGradient>'+
   '<marker id="dsnFlecha" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="9" orient="auto">'+
     '<path d="M0,1 L10,5 L0,9 z" fill="#2563EB"/></marker>'+
   '<marker id="dsnFlechaM" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="8" markerHeight="8" orient="auto">'+
     '<path d="M0,1 L10,5 L0,9 z" fill="#92400E"/></marker>'+
   '</defs>';
}

/* Línea de superficie con ondas suaves */
function dsnOnda(xa,xb,y,a,l){
  var d='M'+xa+','+y,x=xa,up=true;
  while(x<xb){
    var xn=Math.min(x+l,xb);
    d+=' Q'+((x+xn)/2)+','+(y+(up?-a:a))+' '+xn+','+y;
    x=xn; up=!up;
  }
  return '<path d="'+d+'" fill="none" stroke="#2563EB" stroke-width="1.8" stroke-linecap="round"/>';
}

/* Tubería horizontal sencilla (rectángulo gris) */
function dsnTubo(x,y,w,h){
  return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="2" fill="#E2E8F0" stroke="#64748B" stroke-width="1.5"/>';
}

/* Flecha de flujo fina */
function dsnFl(x1,y1,x2,y2){
  return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="#2563EB" stroke-width="2" stroke-linecap="round" marker-end="url(#dsnFlecha)"/>';
}

/* Símbolo de válvula de compuerta (dos triángulos) sobre tubería vertical */
function dsnValvula(x,y){
  return '<polygon points="'+(x-8)+','+(y-7)+' '+(x+8)+','+(y-7)+' '+x+','+y+'" fill="#92400E"/>'+
         '<polygon points="'+(x-8)+','+(y+7)+' '+(x+8)+','+(y+7)+' '+x+','+y+'" fill="#92400E"/>'+
         '<line x1="'+x+'" y1="'+y+'" x2="'+(x+13)+'" y2="'+y+'" stroke="#92400E" stroke-width="1.6"/>'+
         '<line x1="'+(x+13)+'" y1="'+(y-4)+'" x2="'+(x+13)+'" y2="'+(y+4)+'" stroke="#92400E" stroke-width="2.4" stroke-linecap="round"/>';
}

var DSN_MURO='#3F5F4E';
/* Cota horizontal: si el tramo es corto, el texto se escribe al lado */
function dsnCota(xa,xb,y,txt,lado){
  if(xb-xa>=90) return svgDimH(xa,xb,y,txt,'#2563EB');
  var c='#2563EB';
  return svgDimH(xa,xb,y,'',c)+'<text x="'+(lado==='der'?xb+6:xa-6)+'" y="'+(y+4)+'" font-size="11" font-weight="700" text-anchor="'+(lado==='der'?'start':'end')+'" fill="'+c+'">'+txt+'</text>';
}
  var W=760,H=330,x0=130,Lp=380,x1=x0+Lp,y0=76,Bp=Lp/4,y1=y0+Bp,ym=(y0+y1)/2,xl=x0+Lp/3;
  /* Deflectores en la posición calculada: entrada a L/4, salida a 15·hv del vertedero */
  var esc=Lp/r.L, xe=x0+Lp/4, xs=Math.max(xe+24,x1-Math.max(r.Lds*esc,14));
  var s='<svg viewBox="0 0 '+W+' '+H+'" width="100%" style="max-width:700px">'+svgDefs()+dsnDefs()+
   '<text x="'+(W/2)+'" y="20" font-size="13" font-weight="700" text-anchor="middle" fill="#15803D">VISTA EN PLANTA</text>'+
   /* tubería de aducción y de salida */
   dsnTubo(8,ym-9,(x0-72)-8,18)+
   dsnFl(14,ym,x0-78,ym)+
   '<text x="'+((8+x0-72)/2)+'" y="'+(ym-16)+'" font-size="10" text-anchor="middle" fill="#475569">Aducción</text>'+
   dsnTubo(x1+72,ym-9,40,18)+
   dsnFl(x1+76,ym,x1+108,ym)+
   '<text x="'+(x1+92)+'" y="'+(ym-16)+'" font-size="10" text-anchor="middle" fill="#475569">Salida</text>'+
   /* tanque */
   '<rect x="'+x0+'" y="'+y0+'" width="'+Lp+'" height="'+Bp+'" rx="2" fill="url(#dsnAgua)" stroke="'+DSN_MURO+'" stroke-width="5"/>'+
   /* plataformas */
   '<rect x="'+(x0-72)+'" y="'+y0+'" width="68" height="'+Bp+'" rx="2" fill="#F0FDF4" stroke="'+DSN_MURO+'" stroke-width="3"/>'+
   '<text x="'+(x0-38)+'" y="'+(y0-24)+'" font-size="10" text-anchor="middle" fill="#15803D">Plataforma entrada</text>'+
   '<text x="'+(x0-38)+'" y="'+(ym+4)+'" font-size="9" text-anchor="middle" fill="#334155">b = '+nf(r.bp,2)+' m</text>'+
   '<rect x="'+(x1+4)+'" y="'+y0+'" width="68" height="'+Bp+'" rx="2" fill="#F0FDF4" stroke="'+DSN_MURO+'" stroke-width="3"/>'+
   '<text x="'+(x1+38)+'" y="'+(y0-24)+'" font-size="10" text-anchor="middle" fill="#15803D">Plataforma salida</text>'+
   '<text x="'+(x1+38)+'" y="'+(ym+20)+'" font-size="9" text-anchor="middle" fill="#334155">HL = '+nf(r.HL,3)+' m</text>'+
   /* vertedero */
   '<line x1="'+x1+'" y1="'+(y0+3)+'" x2="'+x1+'" y2="'+(y1-3)+'" stroke="#92400E" stroke-width="4"/>'+
   '<text x="'+x1+'" y="'+(y1+16)+'" font-size="10" text-anchor="middle" fill="#92400E">Vertedero B = '+nf(r.B,2)+' m</text>'+
   /* líneas de flujo dentro del tanque */
   dsnFl(x0+14,ym-16,xe-16,ym-16)+dsnFl(x0+14,ym+16,xe-16,ym+16)+
   dsnFl(xe+16,ym-16,xs-16,ym-16)+dsnFl(xe+16,ym+16,xs-16,ym+16)+
   (x1-xs>40?dsnFl(xs+12,ym-16,x1-10,ym-16)+dsnFl(xs+12,ym+16,x1-10,ym+16):'');
  [xe-x0,xs-x0].forEach(function(dx,k){
    var x=x0+dx; s+='<line x1="'+x+'" y1="'+y0+'" x2="'+x+'" y2="'+y1+'" stroke="#EA580C" stroke-width="5"/>';
    var nn=Math.max(1,Math.min(r.n,14));
    for(var i=1;i<=nn;i++) s+='<circle cx="'+x+'" cy="'+(y0+i*Bp/(nn+1))+'" r="1.8" fill="#fff"/>';
    s+='<text x="'+x+'" y="'+(y0-8)+'" font-size="10" text-anchor="middle" fill="#EA580C">Deflector '+(k+1)+'</text>';});
  /* descarga de lodos vista desde arriba */
  s+='<circle cx="'+xl+'" cy="'+ym+'" r="11" fill="none" stroke="#92400E" stroke-width="1.2" stroke-dasharray="3 2"/>'+
   '<circle cx="'+xl+'" cy="'+ym+'" r="7" fill="url(#arena)" stroke="#92400E" stroke-width="2"/>'+
   '<line x1="'+xl+'" y1="'+(ym+12)+'" x2="'+xl+'" y2="'+(y1+3)+'" stroke="#92400E" stroke-width="1" stroke-dasharray="2 2"/>'+
   '<text x="'+xl+'" y="'+(y1+16)+'" font-size="10" text-anchor="middle" fill="#92400E">Descarga de lodos (L/3)</text>'+
   dsnCota(x0,xe,y1+38,'L/4 = '+nf(r.Lde,2)+' m','der')+dsnCota(xs,x1,y1+38,'15hv = '+nf(r.Lds,2)+' m','izq')+
   svgDimH(x0,x1,y1+66,'L = '+nf(r.L,2)+' m','#2563EB')+svgDimV(x1+126,y0,y1,'B = '+nf(r.B,2)+' m','#2563EB')+
   '<text x="'+(W/2)+'" y="'+(H-8)+'" font-size="10.5" text-anchor="middle" fill="#64748B">Deflectores: '+r.n+' columnas × '+r.m+' filas de orificios Ø '+nf(r.d*1000,1)+' mm · Z = '+nf(r.Z,3)+' m</text></svg>';
  return s;}

function svgPerfilDes_STAR(r){
function dsnDefs(){
  return '<defs>'+
   '<linearGradient id="dsnAgua" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E0F2FE"/><stop offset="1" stop-color="#93C5FD"/></linearGradient>'+
   '<linearGradient id="dsnLodo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DDB06C"/><stop offset="1" stop-color="#A16207"/></linearGradient>'+
   '<marker id="dsnFlecha" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="9" orient="auto">'+
     '<path d="M0,1 L10,5 L0,9 z" fill="#2563EB"/></marker>'+
   '<marker id="dsnFlechaM" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="8" markerHeight="8" orient="auto">'+
     '<path d="M0,1 L10,5 L0,9 z" fill="#92400E"/></marker>'+
   '</defs>';
}

/* Línea de superficie con ondas suaves */
function dsnOnda(xa,xb,y,a,l){
  var d='M'+xa+','+y,x=xa,up=true;
  while(x<xb){
    var xn=Math.min(x+l,xb);
    d+=' Q'+((x+xn)/2)+','+(y+(up?-a:a))+' '+xn+','+y;
    x=xn; up=!up;
  }
  return '<path d="'+d+'" fill="none" stroke="#2563EB" stroke-width="1.8" stroke-linecap="round"/>';
}

/* Tubería horizontal sencilla (rectángulo gris) */
function dsnTubo(x,y,w,h){
  return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="2" fill="#E2E8F0" stroke="#64748B" stroke-width="1.5"/>';
}

/* Flecha de flujo fina */
function dsnFl(x1,y1,x2,y2){
  return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="#2563EB" stroke-width="2" stroke-linecap="round" marker-end="url(#dsnFlecha)"/>';
}

/* Símbolo de válvula de compuerta (dos triángulos) sobre tubería vertical */
function dsnValvula(x,y){
  return '<polygon points="'+(x-8)+','+(y-7)+' '+(x+8)+','+(y-7)+' '+x+','+y+'" fill="#92400E"/>'+
         '<polygon points="'+(x-8)+','+(y+7)+' '+(x+8)+','+(y+7)+' '+x+','+y+'" fill="#92400E"/>'+
         '<line x1="'+x+'" y1="'+y+'" x2="'+(x+13)+'" y2="'+y+'" stroke="#92400E" stroke-width="1.6"/>'+
         '<line x1="'+(x+13)+'" y1="'+(y-4)+'" x2="'+(x+13)+'" y2="'+(y+4)+'" stroke="#92400E" stroke-width="2.4" stroke-linecap="round"/>';
}

var DSN_MURO='#3F5F4E';
/* Cota horizontal: si el tramo es corto, el texto se escribe al lado */
function dsnCota(xa,xb,y,txt,lado){
  if(xb-xa>=90) return svgDimH(xa,xb,y,txt,'#2563EB');
  var c='#2563EB';
  return svgDimH(xa,xb,y,'',c)+'<text x="'+(lado==='der'?xb+6:xa-6)+'" y="'+(y+4)+'" font-size="11" font-weight="700" text-anchor="'+(lado==='der'?'start':'end')+'" fill="'+c+'">'+txt+'</text>';
}
  /* Escala: L ocupa Lp px; la altura H se dibuja con 100 px y ho con 56 px (esquema, no a escala vertical) */
  var W=780,H=420,x0=130,Lp=380,x1=x0+Lp,yT=110,Hp=100,yB=yT+Hp,hoP=56,yL=yB+hoP,xl=x0+Lp/3,esc=Lp/r.L;
  var blP=Math.max(10,Hp*r.BL/r.H), yC=yT-blP;                  /* corona de muros */
  var xe=x0+Lp/4, xs=Math.max(xe+24,x1-Math.max(r.Lds*esc,14));  /* deflectores */
  var hdP=Math.min(Hp,Hp*(r.hd/r.H)),nm=Math.max(1,Math.min(r.m,7));
  var y3=yT+Hp/3;                                               /* fondo de la plataforma de entrada (esquema) */
  var hvP=Math.max(8,Math.min(26,Hp*r.hv/r.H));                 /* lámina sobre el vertedero */
  var ys=yT+hvP;                                                /* nivel aguas abajo del vertedero */
  var s='<svg viewBox="0 0 '+W+' '+H+'" width="100%" style="max-width:700px">'+svgDefs()+dsnDefs()+
   '<text x="'+(W/2)+'" y="20" font-size="13" font-weight="700" text-anchor="middle" fill="#15803D">CORTE LONGITUDINAL</text>'+
   /* agua en la zona efectiva */
   '<polygon points="'+x0+','+yT+' '+x1+','+yT+' '+x1+','+yB+' '+x0+','+yB+'" fill="url(#dsnAgua)"/>'+
   /* tolva de lodos: punto más bajo a L/3 */
   '<polygon points="'+x0+','+yB+' '+xl+','+yL+' '+x1+','+yB+'" fill="url(#dsnLodo)"/>'+
   '<polygon points="'+x0+','+yB+' '+xl+','+yL+' '+x1+','+yB+'" fill="url(#arena)" opacity="0.28"/>'+
   '<line x1="'+x0+'" y1="'+yB+'" x2="'+x1+'" y2="'+yB+'" stroke="#92400E" stroke-width="1" stroke-dasharray="5 4"/>';
  [0.10,0.30,0.52,0.72].forEach(function(f){
    var xa=x0+Lp*f, ya=yT+14;
    s+='<line x1="'+xa+'" y1="'+ya+'" x2="'+(xa+58)+'" y2="'+(yB-6)+'" stroke="#92400E" stroke-width="1" stroke-dasharray="3 4" opacity="0.38"/>'+
       '<circle cx="'+xa+'" cy="'+ya+'" r="2" fill="#92400E" opacity="0.55"/>'+
       '<circle cx="'+(xa+29)+'" cy="'+((ya+yB-6)/2)+'" r="1.7" fill="#92400E" opacity="0.5"/>';
  });
  /* muros: entrada (corona), fondo en tolva, muro de salida hasta la cresta del vertedero */
  s+='<polyline points="'+x0+','+yC+' '+x0+','+yB+' '+xl+','+yL+' '+x1+','+yB+' '+x1+','+yT+'" fill="none" stroke="'+DSN_MURO+'" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>'+
   dsnOnda(x0+3,x1-3,yT,1.8,14)+
   /* plataforma de entrada: cresta al nivel del agua, fondo a Hp bajo la cresta */
   dsnTubo(8,yT+2,(x0-76)-8,16)+dsnFl(14,yT+10,x0-82,yT+10)+
   '<rect x="'+(x0-76)+'" y="'+(yT-6)+'" width="'+(76-3)+'" height="'+(y3-yT+6)+'" fill="url(#dsnAgua)"/>'+
   dsnOnda(x0-74,x0-6,yT-6,1.2,11)+
   '<polyline points="'+(x0-78)+','+yC+' '+(x0-78)+','+y3+' '+x0+','+y3+'" fill="none" stroke="'+DSN_MURO+'" stroke-width="5" stroke-linejoin="round"/>'+
   '<text x="'+(x0-40)+'" y="'+(yC-8)+'" font-size="10" text-anchor="middle" fill="#15803D">Plataforma entrada</text>'+
   '<text x="'+(x0-40)+'" y="'+(y3+16)+'" font-size="9.5" text-anchor="middle" fill="#334155">b = '+nf(r.bp,2)+' m</text>'+
   svgDimV(x0+12,yT,y3,'Hp','#2563EB')+
   '<text x="'+(x0-40)+'" y="'+(yT+14)+'" font-size="9.5" text-anchor="middle" fill="#2563EB">HL = '+nf(r.HL,3)+' m</text>'+
   /* plataforma de salida: vertedero con cresta en la lámina, caída hv */
   '<rect x="'+(x1+3)+'" y="'+ys+'" width="74" height="'+(y3-ys)+'" fill="url(#dsnAgua)"/>'+
   '<path d="M'+x1+','+yT+' Q'+(x1+10)+','+yT+' '+(x1+18)+','+ys+'" fill="none" stroke="#2563EB" stroke-width="1.8"/>'+
   dsnOnda(x1+18,x1+76,ys,1.1,11)+
   '<polyline points="'+x1+','+y3+' '+(x1+80)+','+y3+' '+(x1+80)+','+yC+'" fill="none" stroke="'+DSN_MURO+'" stroke-width="5" stroke-linejoin="round"/>'+
   dsnTubo(x1+82,y3-20,20,14)+dsnFl(x1+85,y3-13,x1+100,y3-13)+
   '<text x="'+(x1+40)+'" y="'+(yC-8)+'" font-size="10" text-anchor="middle" fill="#15803D">Plataforma salida</text>'+
   '<text x="'+(x1+42)+'" y="'+(ys+16)+'" font-size="9.5" text-anchor="middle" fill="#2563EB">hv = '+nf(r.hv,3)+' m</text>';
  /* deflectores en la posición calculada */
  [xe,xs].forEach(function(x,k){
    s+='<rect x="'+(x-3)+'" y="'+(yT-8)+'" width="6" height="'+(hdP+8)+'" rx="1" fill="#EA580C"/>';
    for(var i=1;i<=nm;i++) s+='<circle cx="'+x+'" cy="'+(yT+i*hdP/(nm+1))+'" r="1.8" fill="#fff"/>';
    s+='<text x="'+x+'" y="'+(yT+hdP+14)+'" font-size="9.5" text-anchor="middle" fill="#EA580C">Deflector '+(k+1)+' (H/'+PRO.desDef+' = '+nf(r.hd,2)+' m)</text>';});
  /* evacuación de lodos */
  s+='<rect x="'+(xl-6)+'" y="'+yL+'" width="12" height="34" fill="#E2E8F0" stroke="#64748B" stroke-width="1.5"/>'+
   dsnValvula(xl,yL+17)+
   '<line x1="'+xl+'" y1="'+(yL+34)+'" x2="'+xl+'" y2="'+(yL+47)+'" stroke="#92400E" stroke-width="2" stroke-linecap="round" marker-end="url(#dsnFlechaM)"/>'+
   '<text x="'+(xl+24)+'" y="'+(yL+21)+'" font-size="10.5" font-weight="700" fill="#92400E" stroke="#F8FAFC" stroke-width="2" paint-order="stroke">Evacuación de lodos</text>'+
   '<text x="'+(xl+70)+'" y="'+(yB+20)+'" font-size="11" font-weight="700" text-anchor="middle" fill="#78350F" stroke="#FDE7C2" stroke-width="2.5" paint-order="stroke">Zona de lodos</text>'+
   '<text x="'+((xe+xs)/2)+'" y="'+(yT+Hp/2+4)+'" font-size="11" text-anchor="middle" fill="#1E40AF">Zona de sedimentación</text>'+
   /* cotas */
   dsnCota(x0,xe,yC-30,'L/4 = '+nf(r.Lde,2)+' m','der')+dsnCota(xs,x1,yC-30,'15hv = '+nf(r.Lds,2)+' m','izq')+
   svgDimV(x1+126,yC,yT,'BL = '+nf(r.BL,2)+' m','#2563EB')+
   svgDimV(x1+126,yT,yB,'H = '+nf(r.H,2)+' m','#2563EB')+svgDimV(x1+126,yB,yL,'H2 = ho = '+nf(r.ho,2)+' m','#2563EB')+
   svgDimH(x0,xl,yL+56,'L/3 = '+nf(r.xL3,2)+' m','#2563EB')+svgDimH(xl,x1,yL+56,'2L/3 = '+nf(r.xL23,2)+' m','#2563EB')+
   svgDimH(x0,x1,yL+84,'L = '+nf(r.L,2)+' m','#2563EB')+
   '<text x="'+(x0+Lp/6-8)+'" y="'+(yB+(yL-yB)/2+18)+'" font-size="10" font-weight="700" text-anchor="end" fill="#78350F">S = '+nf(r.S1,1)+' %</text>'+
   '<text x="'+(xl+Lp/3+8)+'" y="'+(yB+(yL-yB)/2+18)+'" font-size="10" font-weight="700" text-anchor="start" fill="#78350F">S = '+nf(r.S2,1)+' %</text></svg>';
  return s;}

/* ==========================================================
   DETALLES AMPLIADOS: PLATAFORMA DE ENTRADA Y DE SALIDA (corte longitudinal)
   Mismo estilo de ilustración que la canaleta Parshall. Los símbolos van sobre el
   dibujo y los valores en el cuadro "Medidas" de abajo.
   Niveles usados para que el dibujo sea coherente:
   · Entrada: cresta al nivel del agua del desarenador; agua de la plataforma = +he; fondo = he − Hp.
   · Salida : cresta = −hv; fondo = −hv − Hp; agua de la plataforma = fondo + HL (descarga libre).
   ========================================================== */
var DSD_V_STAR='#15803D',DSD_M_STAR='#3D5A4C',DSD_G_STAR='#475569',DSD_A_STAR='#2563EB',DSD_N_STAR='#EA580C',
    DSD_H_STAR=' stroke="#FFFFFF" stroke-width="3" paint-order="stroke"',
    DSD_F_STAR='font-family="system-ui,Segoe UI,Arial,sans-serif"';
function dsdQ_STAR(v){return Math.round(v*100)/100;}
function dsdFlecha_STAR(x,y,dx,dy,c){var nx=-dy,ny=dx;
  return '<polygon points="'+dsdQ_STAR(x)+','+dsdQ_STAR(y)+' '+dsdQ_STAR(x-dx*7+nx*3)+','+dsdQ_STAR(y-dy*7+ny*3)+' '+dsdQ_STAR(x-dx*7-nx*3)+','+dsdQ_STAR(y-dy*7-ny*3)+'" fill="'+c+'"/>';}
function dsdTxt_STAR(x,y,t,c,tam,peso,ancla,extra){
  return '<text x="'+dsdQ_STAR(x)+'" y="'+dsdQ_STAR(y)+'" font-size="'+(tam||10.5)+'"'+(peso?' font-weight="'+peso+'"':'')+' text-anchor="'+(ancla||'start')+'" fill="'+c+'"'+(extra||'')+'>'+t+'</text>';}
function dsdLinea_STAR(x1,y1,x2,y2,c,dash,w){
  return '<line x1="'+dsdQ_STAR(x1)+'" y1="'+dsdQ_STAR(y1)+'" x2="'+dsdQ_STAR(x2)+'" y2="'+dsdQ_STAR(y2)+'" stroke="'+c+'" stroke-width="'+(w||1)+'"'+(dash?' stroke-dasharray="'+dash+'"':'')+'/>';}
/* cota vertical con flechas; el texto es solo el símbolo */
function dsdDimV_STAR(x,ya,yb,txt,c,lado){
  var h=dsdLinea_STAR(x,ya,x,yb,c,null,1.4)+dsdLinea_STAR(x-4,ya,x+4,ya,c,null,1.2)+dsdLinea_STAR(x-4,yb,x+4,yb,c,null,1.2);
  if(Math.abs(yb-ya)>=18) h+=dsdFlecha_STAR(x,ya,0,-1,c)+dsdFlecha_STAR(x,yb,0,1,c);
  else h+=dsdFlecha_STAR(x,ya,0,1,c)+dsdFlecha_STAR(x,yb,0,-1,c)+dsdLinea_STAR(x,ya-10,x,ya,c,null,1.4)+dsdLinea_STAR(x,yb,x,yb+10,c,null,1.4);
  return h+dsdTxt_STAR(lado==='l'?x-8:x+9,(ya+yb)/2+4,txt,c,11,'700',lado==='l'?'end':'start',DSD_H_STAR);}
function dsdDimH_STAR(xa,xb,y,txt,c){
  return dsdLinea_STAR(xa,y,xb,y,c,null,1.4)+dsdLinea_STAR(xa,y-4,xa,y+4,c,null,1.2)+dsdLinea_STAR(xb,y-4,xb,y+4,c,null,1.2)+
    dsdFlecha_STAR(xa,y,-1,0,c)+dsdFlecha_STAR(xb,y,1,0,c)+dsdTxt_STAR((xa+xb)/2,y-7,txt,c,11,'700','middle',DSD_H_STAR);}
function dsdPastilla_STAR(x,y,t){var w=t.length*5.7+16;
  return '<rect x="'+dsdQ_STAR(x-w/2)+'" y="'+(y-11)+'" width="'+dsdQ_STAR(w)+'" height="17" rx="8.5" fill="#F1F5F9" stroke="#E2E8F0"/>'+dsdTxt_STAR(x,y+1,t,'#64748B',10,'600','middle');}
function dsdFlujo_STAR(x1,x2,y){
  return dsdLinea_STAR(x1,y,x2-6,y,'#1D4ED8',null,4)+dsdFlecha_STAR(x2,y,1,0,'#1D4ED8')+dsdTxt_STAR((x1+x2)/2,y-10,'Flujo','#1D4ED8',10.5,'600','middle');}
function dsdOnda_STAR(xa,xb,y){var d='M'+dsdQ_STAR(xa)+','+dsdQ_STAR(y),x=xa,up=true;
  while(x<xb-1){var xn=Math.min(x+14,xb);d+=' Q'+dsdQ_STAR((x+xn)/2)+','+dsdQ_STAR(y+(up?-1.4:1.4))+' '+dsdQ_STAR(xn)+','+dsdQ_STAR(y);x=xn;up=!up;}
  return '<path d="'+d+'" fill="none" stroke="'+DSD_A_STAR+'" stroke-width="2.2" stroke-linecap="round"/>';}
function dsdMuro_STAR(x,y,w,h){
  return '<rect x="'+dsdQ_STAR(x)+'" y="'+dsdQ_STAR(y)+'" width="'+dsdQ_STAR(w)+'" height="'+dsdQ_STAR(h)+'" fill="url(#dsdConcreto)" stroke="'+DSD_M_STAR+'" stroke-width="2.5" stroke-linejoin="round"/>';}
function dsdDefs_STAR(){
  return '<defs>'+
   '<linearGradient id="dsdAgua" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E0F2FE"/><stop offset="1" stop-color="#93C5FD"/></linearGradient>'+
   '<pattern id="dsdConcreto" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="#EEF2EF"/><line x1="0" y1="0" x2="0" y2="8" stroke="#CBD5D0" stroke-width="1.4"/></pattern>'+
   '</defs>';}
/* cuadro de valores como el de la canaleta */
function dsdCuadro_STAR(V,yG,W){
  var cols=4,ancho=(W-84)/cols-10,s=dsdTxt_STAR(W/2,yG-14,'Medidas',DSD_V_STAR,11,'700','middle');
  V.forEach(function(v,i){
    var cx=42+(i%cols)*(ancho+10), cy=yG+Math.floor(i/cols)*34;
    s+='<rect x="'+dsdQ_STAR(cx)+'" y="'+cy+'" width="'+dsdQ_STAR(ancho)+'" height="26" rx="8" fill="#F8FAFC" stroke="#E2E8F0"/>'+
       dsdTxt_STAR(cx+12,cy+17,v[0],DSD_G_STAR,11,'700')+dsdTxt_STAR(cx+ancho-12,cy+17,nf(v[1],v[2])+' '+v[3],'#334155',11.5,'600','end');});
  return s;}
/* escala común (px/m) para que las dos plataformas se vean iguales */
function dsdEsc_STAR(r){return Math.min(260/r.bp,150/(r.hv+r.Hp),2400);}

function svgPlatEntradaDes_STAR(r){
  /* Niveles (m) respecto al agua del desarenador: cresta del vertedero de entrada = 0,
     fondo de la plataforma = −Hp, agua sobre la plataforma = +HL. */
  var W=860, e=dsdEsc_STAR(r), tw=16;
  var zW=r.HL, zF=-r.Hp;
  var yC=78, y0=yC+Math.max(64,zW*e+44);
  function Y(z){return y0-z*e;}
  var xa=230, xb=xa+r.bp*e, xd=xb+tw, xr=W-150;
  var yW=Y(zW), yF=Y(zF), yBot=Math.max(yF+70,y0+120), xn=xd+Math.max(18,(y0-yW)*1.4);
  var pH=Math.min(30,Math.max(16,(yF-yW)*0.7));
  var yG=yBot+46, H=yG+2*34+16;
  var s='<svg viewBox="0 0 '+W+' '+H+'" width="100%" style="max-width:880px" xmlns="http://www.w3.org/2000/svg" '+DSD_F_STAR+' role="img" aria-label="Detalle de la plataforma de entrada">'+dsdDefs_STAR()+
   dsdTxt_STAR(W/2,24,'DETALLE PLATAFORMA DE ENTRADA — CORTE LONGITUDINAL',DSD_V_STAR,13,'700','middle')+
   /* agua: plataforma (Hp + HL), lámina vertiente y desarenador */
   '<rect x="'+xa+'" y="'+dsdQ_STAR(yW)+'" width="'+dsdQ_STAR(xb-xa)+'" height="'+dsdQ_STAR(yF-yW)+'" fill="url(#dsdAgua)"/>'+
   '<rect x="'+xd+'" y="'+dsdQ_STAR(y0)+'" width="'+dsdQ_STAR(xr-xd)+'" height="'+dsdQ_STAR(yBot-y0)+'" fill="url(#dsdAgua)"/>'+
   '<path d="M'+dsdQ_STAR(xb-40)+','+dsdQ_STAR(yW)+' Q'+dsdQ_STAR(xb+2)+','+dsdQ_STAR(yW)+' '+dsdQ_STAR(xd)+','+dsdQ_STAR(y0-(y0-yW)*0.35)+' Q'+dsdQ_STAR(xd+8)+','+dsdQ_STAR(y0)+' '+dsdQ_STAR(xn)+','+dsdQ_STAR(y0)+' L'+xb+','+dsdQ_STAR(y0)+' L'+xb+','+dsdQ_STAR(yW)+' z" fill="url(#dsdAgua)"/>'+
   '<path d="M'+dsdQ_STAR(xb-40)+','+dsdQ_STAR(yW)+' Q'+dsdQ_STAR(xb+2)+','+dsdQ_STAR(yW)+' '+dsdQ_STAR(xd)+','+dsdQ_STAR(y0-(y0-yW)*0.35)+' Q'+dsdQ_STAR(xd+8)+','+dsdQ_STAR(y0)+' '+dsdQ_STAR(xn)+','+dsdQ_STAR(y0)+'" fill="none" stroke="'+DSD_A_STAR+'" stroke-width="2.2"/>'+
   dsdOnda_STAR(xa+2,xb-40,yW)+dsdOnda_STAR(xn,xr,y0)+
   /* estructura: muro de llegada, losa de la plataforma y muro-vertedero (cresta al nivel del agua) */
   dsdMuro_STAR(xa-tw,yC,tw,yF-yC+tw)+dsdMuro_STAR(xa-tw,yF,xb-xa+tw*2,tw)+dsdMuro_STAR(xb,y0,tw,yBot-y0)+
   dsdLinea_STAR(xd,yBot,xr,yBot,'#94A3B8','6 4')+dsdLinea_STAR(xr,y0,xr,yBot,'#94A3B8','6 4')+
   /* tubería / canal de llegada */
   '<rect x="60" y="'+dsdQ_STAR(yF-pH)+'" width="'+(xa-tw-60)+'" height="'+dsdQ_STAR(pH)+'" rx="2" fill="#E2E8F0" stroke="#64748B" stroke-width="1.5"/>'+
   '<rect x="'+(xa-tw)+'" y="'+dsdQ_STAR(yF-pH)+'" width="'+tw+'" height="'+dsdQ_STAR(pH)+'" fill="url(#dsdAgua)"/>'+
   dsdFlujo_STAR(20,xa-tw-8,yF-pH-22)+
   dsdTxt_STAR((60+xa-tw)/2,yF+18,'Llegada (aducción)',DSD_G_STAR,10.5,'600','middle')+
   /* referencias */
   dsdLinea_STAR(xa-tw,yC,xr+40,yC,'#94A3B8','6 4')+dsdTxt_STAR(xr+40,yC-6,'Corona de muros','#64748B',10,'','end')+
   dsdLinea_STAR(xa,y0,xr+40,y0,'#64748B','6 4')+dsdTxt_STAR(xr-4,y0+16,'Cresta = nivel del agua del desarenador','#64748B',10,'','end',DSD_H_STAR)+
   dsdTxt_STAR(xb+tw/2,y0+(yBot-y0)/2,'Vertedero de entrada',DSD_M_STAR,10,'700','middle',' transform="rotate(-90 '+dsdQ_STAR(xb+tw/2)+' '+dsdQ_STAR(y0+(yBot-y0)/2)+')"')+
   /* cotas (símbolos) */
   dsdDimV_STAR(xa+18,y0,yF,'Hp',DSD_A_STAR)+
   dsdDimV_STAR(xa+18,yW,y0,'HL',DSD_N_STAR)+
   dsdDimV_STAR(xr+22,yC,y0,'BL',DSD_G_STAR)+
   dsdLinea_STAR(xa,yF+tw+4,xa,yF+tw+40,'#CBD5E1')+dsdLinea_STAR(xb,yF+tw+4,xb,yF+tw+40,'#CBD5E1')+
   dsdDimH_STAR(xa,xb,yF+tw+34,'b',DSD_G_STAR)+
   /* zonas */
   dsdPastilla_STAR((xd+xr)/2+20,yBot-14,'Desarenador')+dsdPastilla_STAR((xa+xb)/2,yC+22,'Plataforma de entrada');
  s+=dsdCuadro_STAR([['Base b',r.bp,3,'m'],['Largo = B',r.B,3,'m'],['Hp',r.Hp,3,'m'],['HL',r.HL,3,'m'],
                     ['t (iterado)',r.tp,1,'s'],['BL',r.BL,3,'m'],['Q por unidad',r.Q*1000,2,'L/s'],['Hp + HL',r.Hp+r.HL,3,'m']],yG,W)+'</svg>';
  return s;}

function svgPlatSalidaDes_STAR(r){
  var W=860, e=dsdEsc_STAR(r), tw=16;
  /* cresta = −hv (hv = HL); fondo de la plataforma = cresta − Hp; agua en la plataforma = fondo + HL (descarga libre) */
  var zCr=-r.hv, zF=-r.hv-r.Hp, zW=zF+r.HL;
  var yC=78, y0=yC+64;
  function Y(z){return y0-z*e;}
  var xl=60, xw=440, xa=xw+tw, xb=xa+r.bp*e;
  var yCr=Y(zCr), yF=Y(zF), yW=Y(zW), yBot=Math.max(yF+90,y0+120), xn=xa+Math.max(16,(yW-yCr)*0.8);
  var dpx=r.Lds*e, xdf=Math.max(xl+40,xw-dpx), yDef=Math.min(yBot-6,y0+Math.max(40,r.hd*e));
  var pH=Math.min(30,Math.max(16,(yF-yW)*1.3));
  var yG=yBot+46, H=yG+2*34+16;
  var s='<svg viewBox="0 0 '+W+' '+H+'" width="100%" style="max-width:880px" xmlns="http://www.w3.org/2000/svg" '+DSD_F_STAR+' role="img" aria-label="Detalle de la plataforma de salida">'+dsdDefs_STAR()+
   dsdTxt_STAR(W/2,24,'DETALLE PLATAFORMA DE SALIDA — CORTE LONGITUDINAL',DSD_V_STAR,13,'700','middle')+
   /* agua */
   '<rect x="'+xl+'" y="'+dsdQ_STAR(y0)+'" width="'+(xw-xl)+'" height="'+dsdQ_STAR(yBot-y0)+'" fill="url(#dsdAgua)"/>'+
   '<rect x="'+xa+'" y="'+dsdQ_STAR(yW)+'" width="'+dsdQ_STAR(xb-xa)+'" height="'+dsdQ_STAR(yF-yW)+'" fill="url(#dsdAgua)"/>'+
   '<path d="M'+(xw-36)+','+dsdQ_STAR(y0)+' Q'+(xw-4)+','+dsdQ_STAR(y0+1)+' '+(xw+tw)+','+dsdQ_STAR(yCr)+' Q'+dsdQ_STAR(xa+8)+','+dsdQ_STAR((yCr+yW)/2)+' '+dsdQ_STAR(xn)+','+dsdQ_STAR(yW)+' L'+xa+','+dsdQ_STAR(yW)+' L'+xa+','+dsdQ_STAR(yCr)+' L'+xw+','+dsdQ_STAR(yCr)+' L'+xw+','+dsdQ_STAR(y0)+' z" fill="url(#dsdAgua)"/>'+
   '<path d="M'+(xw-36)+','+dsdQ_STAR(y0)+' Q'+(xw-4)+','+dsdQ_STAR(y0+1)+' '+(xw+tw)+','+dsdQ_STAR(yCr)+' Q'+dsdQ_STAR(xa+8)+','+dsdQ_STAR((yCr+yW)/2)+' '+dsdQ_STAR(xn)+','+dsdQ_STAR(yW)+'" fill="none" stroke="'+DSD_A_STAR+'" stroke-width="2.2"/>'+
   dsdOnda_STAR(xl+4,xw-36,y0)+dsdOnda_STAR(xn,xb,yW)+
   /* estructura */
   dsdMuro_STAR(xw,yCr,tw,yBot-yCr)+dsdMuro_STAR(xa-tw,yF,xb-xa+tw*2,tw)+dsdMuro_STAR(xb,yC,tw,yF-yC+tw)+
   dsdLinea_STAR(xl,yBot,xw,yBot,'#94A3B8','6 4')+dsdLinea_STAR(xl,y0,xl,yBot,'#94A3B8','6 4')+
   /* deflector de salida */
   '<rect x="'+dsdQ_STAR(xdf-4)+'" y="'+dsdQ_STAR(y0-12)+'" width="8" height="'+dsdQ_STAR(yDef-y0+12)+'" rx="1" fill="'+DSD_N_STAR+'"/>'+
   dsdTxt_STAR(xdf+10,y0+46,'Deflector de salida',DSD_N_STAR,10.5,'700','start',DSD_H_STAR)+
   /* tubería de salida */
   '<rect x="'+dsdQ_STAR(xb+tw)+'" y="'+dsdQ_STAR(yF-pH)+'" width="'+dsdQ_STAR(W-60-xb-tw)+'" height="'+dsdQ_STAR(pH)+'" rx="2" fill="#E2E8F0" stroke="#64748B" stroke-width="1.5"/>'+
   '<rect x="'+dsdQ_STAR(xb)+'" y="'+dsdQ_STAR(yF-pH)+'" width="'+tw+'" height="'+dsdQ_STAR(pH)+'" fill="url(#dsdAgua)"/>'+
   dsdFlujo_STAR(xb+tw+14,W-24,yF-pH-22)+
   dsdTxt_STAR((xb+tw+W-60)/2,yF+18,'Salida',DSD_G_STAR,10.5,'600','middle')+
   /* referencias */
   dsdLinea_STAR(xl,yC,xb+tw,yC,'#94A3B8','6 4')+dsdTxt_STAR(xl+4,yC-6,'Corona de muros','#64748B',10)+
   dsdLinea_STAR(xl,y0,xw-36,y0,'#64748B','6 4')+dsdTxt_STAR(xl+50,y0+16,'Nivel del agua del desarenador','#64748B',10,'','start',DSD_H_STAR)+
   dsdLinea_STAR(xw-120,yCr,xw,yCr,DSD_M_STAR,'3 3')+dsdTxt_STAR(xw-124,yCr+4,'Cresta del vertedero',DSD_M_STAR,10,'700','end',DSD_H_STAR)+
   /* cotas */
   dsdLinea_STAR(xdf,y0-16,xdf,yC-26,'#CBD5E1')+dsdLinea_STAR(xw,yCr-4,xw,yC-26,'#CBD5E1')+
   dsdDimH_STAR(xdf,xw,yC-20,'15·hv',DSD_N_STAR)+
   dsdDimV_STAR(xb-16,y0,yCr,'hv',DSD_N_STAR,'l')+
   dsdLinea_STAR(xw-30,y0,xb-12,y0,'#CBD5E1')+
   dsdDimV_STAR(xb-16,yCr,yF,'Hp',DSD_A_STAR,'l')+
   dsdDimV_STAR(xl+22,yC,y0,'BL',DSD_G_STAR)+
   dsdLinea_STAR(xa,yF+tw+4,xa,yF+tw+40,'#CBD5E1')+dsdLinea_STAR(xb,yF+tw+4,xb,yF+tw+40,'#CBD5E1')+
   dsdDimH_STAR(xa,xb,yF+tw+34,'b',DSD_G_STAR)+
   /* zonas */
   dsdPastilla_STAR((xl+xw)/2,yBot-14,'Desarenador')+dsdPastilla_STAR((xa+xb)/2,yC+24,'Plataforma de salida');
  s+=dsdCuadro_STAR([['Base b (= entrada)',r.bp,3,'m'],['Vertedero = B',r.B,3,'m'],['Hp (= entrada)',r.Hp,3,'m'],['hv (= HL)',r.hv,3,'m'],
                     ['15·hv',r.Lds,3,'m'],['BL',r.BL,3,'m'],['h deflector',r.hd,3,'m'],['Caída Hp − HL',r.Hp-r.HL,3,'m']],yG,W)+'</svg>';
  return s;}
