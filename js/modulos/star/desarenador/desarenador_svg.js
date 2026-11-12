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
  var W=720,H=290,x0=130,Lp=380,x1=x0+Lp,y0=76,Bp=Lp/4,y1=y0+Bp,ym=(y0+y1)/2,xl=x0+Lp/3;
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
   '<text x="'+(x0-38)+'" y="'+(y0-8)+'" font-size="10" text-anchor="middle" fill="#15803D">Plataforma entrada</text>'+
   '<text x="'+(x0-38)+'" y="'+(ym+4)+'" font-size="9" text-anchor="middle" fill="#334155">b = '+nf(r.bp,2)+' m</text>'+
   '<rect x="'+(x1+4)+'" y="'+y0+'" width="68" height="'+Bp+'" rx="2" fill="#F0FDF4" stroke="'+DSN_MURO+'" stroke-width="3"/>'+
   '<text x="'+(x1+38)+'" y="'+(y0-8)+'" font-size="10" text-anchor="middle" fill="#15803D">Plataforma salida</text>'+
   '<text x="'+(x1+38)+'" y="'+(ym+20)+'" font-size="9" text-anchor="middle" fill="#334155">HL = '+nf(r.HL,3)+' m</text>'+
   /* vertedero */
   '<line x1="'+x1+'" y1="'+(y0+3)+'" x2="'+x1+'" y2="'+(y1-3)+'" stroke="#92400E" stroke-width="4"/>'+
   '<text x="'+x1+'" y="'+(y1+16)+'" font-size="10" text-anchor="middle" fill="#92400E">Vertedero B = '+nf(r.B,2)+' m</text>'+
   /* líneas de flujo dentro del tanque */
   dsnFl(x0+14,ym-16,x0+Lp/4-16,ym-16)+dsnFl(x0+14,ym+16,x0+Lp/4-16,ym+16)+
   dsnFl(x0+Lp/4+16,ym-16,x0+Lp*3/4-16,ym-16)+dsnFl(x0+Lp/4+16,ym+16,x0+Lp*3/4-16,ym+16)+
   dsnFl(x0+Lp*3/4+16,ym-16,x1-14,ym-16)+dsnFl(x0+Lp*3/4+16,ym+16,x1-14,ym+16);
  [Lp/4,Lp*3/4].forEach(function(dx,k){
    var x=x0+dx; s+='<line x1="'+x+'" y1="'+y0+'" x2="'+x+'" y2="'+y1+'" stroke="#EA580C" stroke-width="5"/>';
    var nn=Math.max(1,Math.min(r.n,14));
    for(var i=1;i<=nn;i++) s+='<circle cx="'+x+'" cy="'+(y0+i*Bp/(nn+1))+'" r="1.8" fill="#fff"/>';
    s+='<text x="'+x+'" y="'+(y0-8)+'" font-size="10" text-anchor="middle" fill="#EA580C">Deflector '+(k+1)+'</text>';});
  /* descarga de lodos vista desde arriba */
  s+='<circle cx="'+xl+'" cy="'+ym+'" r="11" fill="none" stroke="#92400E" stroke-width="1.2" stroke-dasharray="3 2"/>'+
   '<circle cx="'+xl+'" cy="'+ym+'" r="7" fill="url(#arena)" stroke="#92400E" stroke-width="2"/>'+
   '<line x1="'+xl+'" y1="'+(ym+12)+'" x2="'+xl+'" y2="'+(y1+3)+'" stroke="#92400E" stroke-width="1" stroke-dasharray="2 2"/>'+
   '<text x="'+xl+'" y="'+(y1+16)+'" font-size="10" text-anchor="middle" fill="#92400E">Descarga de lodos (L/3)</text>'+
   svgDimH(x0,x1,y1+46,'L = '+nf(r.L,2)+' m')+svgDimV(x1+126,y0,y1,'B = '+nf(r.B,2)+' m')+
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
  var W=720,H=360,x0=130,Lp=380,x1=x0+Lp,yT=96,Hp=100,yB=yT+Hp,hoP=56,yL=yB+hoP,xl=x0+Lp/3;
  var hdP=Math.min(Hp,Hp*(r.hd/r.H)),nm=Math.max(1,Math.min(r.m,7));
  var s='<svg viewBox="0 0 '+W+' '+H+'" width="100%" style="max-width:700px">'+svgDefs()+dsnDefs()+
   '<text x="'+(W/2)+'" y="20" font-size="13" font-weight="700" text-anchor="middle" fill="#15803D">CORTE TRASNVERSAL</text>'+
   /* agua */
   '<polygon points="'+x0+','+yT+' '+x1+','+yT+' '+x1+','+yB+' '+x0+','+yB+'" fill="url(#dsnAgua)"/>'+
   /* zona de lodos */
   '<polygon points="'+x0+','+yB+' '+xl+','+yL+' '+x1+','+yB+'" fill="url(#dsnLodo)"/>'+
   '<polygon points="'+x0+','+yB+' '+xl+','+yL+' '+x1+','+yB+'" fill="url(#arena)" opacity="0.28"/>';
  /* trayectorias y partículas sedimentando hacia la tolva */
  [0.10,0.30,0.52,0.72].forEach(function(f){
    var xa=x0+Lp*f, ya=yT+14;
    s+='<line x1="'+xa+'" y1="'+ya+'" x2="'+(xa+58)+'" y2="'+(yB-6)+'" stroke="#92400E" stroke-width="1" stroke-dasharray="3 4" opacity="0.38"/>'+
       '<circle cx="'+xa+'" cy="'+ya+'" r="2" fill="#92400E" opacity="0.55"/>'+
       '<circle cx="'+(xa+29)+'" cy="'+((ya+yB-6)/2)+'" r="1.7" fill="#92400E" opacity="0.5"/>';
  });
  s+='<polyline points="'+x0+','+(yT-16)+' '+x0+','+yB+' '+xl+','+yL+' '+x1+','+yB+' '+x1+','+(yT-16)+'" fill="none" stroke="'+DSN_MURO+'" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>'+
   /* superficie libre */
   dsnOnda(x0+3,x1-3,yT,1.8,14)+
   /* plataforma de entrada + tubería */
   dsnTubo(8,yT+10,(x0-76)-8,16)+dsnFl(14,yT+18,x0-82,yT+18)+
   '<rect x="'+(x0-76)+'" y="'+(yT-16)+'" width="70" height="52" rx="2" fill="#F0FDF4" stroke="'+DSN_MURO+'" stroke-width="3"/>'+
   '<rect x="'+(x0-74)+'" y="'+yT+'" width="66" height="34" fill="url(#dsnAgua)"/>'+
   dsnOnda(x0-74,x0-8,yT,1.4,11)+
   '<text x="'+(x0-41)+'" y="'+(yT-24)+'" font-size="10" text-anchor="middle" fill="#15803D">Plataforma entrada</text>'+
   '<text x="'+(x0-41)+'" y="'+(yT+52)+'" font-size="10" text-anchor="middle" fill="#334155">Hp = '+nf(r.Hp,2)+' m</text>'+
   /* plataforma de salida + tubería */
   '<rect x="'+(x1+6)+'" y="'+(yT+10)+'" width="74" height="40" rx="2" fill="#F0FDF4" stroke="'+DSN_MURO+'" stroke-width="3"/>'+
   '<rect x="'+(x1+8)+'" y="'+(yT+28)+'" width="70" height="20" fill="url(#dsnAgua)"/>'+
   dsnOnda(x1+8,x1+78,yT+28,1.2,12)+
   dsnTubo(x1+80,yT+30,20,14)+dsnFl(x1+83,yT+37,x1+98,yT+37)+
   '<text x="'+(x1+43)+'" y="'+(yT+64)+'" font-size="10" text-anchor="middle" fill="#15803D">Plataforma salida</text>'+
   '<text x="'+(x1+43)+'" y="'+(yT+78)+'" font-size="10" text-anchor="middle" fill="#334155">HL = '+nf(r.HL,3)+' m</text>';
  /* deflectores */
  [Lp/4,Lp*3/4].forEach(function(dx,k){
    var x=x0+dx; s+='<rect x="'+(x-3)+'" y="'+yT+'" width="6" height="'+hdP+'" rx="1" fill="#EA580C"/>';
    for(var i=1;i<=nm;i++) s+='<circle cx="'+x+'" cy="'+(yT+i*hdP/(nm+1))+'" r="1.8" fill="#fff"/>';
    s+='<text x="'+x+'" y="'+(yT+hdP+14)+'" font-size="9.5" text-anchor="middle" fill="#EA580C">Deflector '+(k+1)+' (H/'+PRO.desDef+')</text>';});
  /* evacuación de lodos: tubería con válvula (sin flechas grandes) */
  s+='<rect x="'+(xl-6)+'" y="'+yL+'" width="12" height="34" fill="#E2E8F0" stroke="#64748B" stroke-width="1.5"/>'+
   dsnValvula(xl,yL+17)+
   '<line x1="'+xl+'" y1="'+(yL+34)+'" x2="'+xl+'" y2="'+(yL+47)+'" stroke="#92400E" stroke-width="2" stroke-linecap="round" marker-end="url(#dsnFlechaM)"/>'+
   '<text x="'+(xl+24)+'" y="'+(yL+21)+'" font-size="10.5" font-weight="700" fill="#92400E" stroke="#F8FAFC" stroke-width="2" paint-order="stroke">Evacuación de lodos</text>'+
   '<text x="'+xl+'" y="'+(yB+22)+'" font-size="11" font-weight="700" text-anchor="middle" fill="#78350F" stroke="#FDE7C2" stroke-width="2.5" paint-order="stroke">Zona de lodos</text>'+
   '<text x="'+(x0+Lp/2)+'" y="'+(yT+Hp/2+4)+'" font-size="11" text-anchor="middle" fill="#1E40AF">Zona de sedimentación</text>'+
   svgDimV(x1+126,yT,yB,'H = '+nf(r.H,2)+' m','#EA580C')+svgDimV(x1+126,yB,yL,'ho = '+nf(r.ho,2)+' m','#92400E')+
   svgDimH(x0,x1,yL+52,'L = '+nf(r.L,2)+' m')+
   '<text x="'+(x0+Lp/6)+'" y="'+(yL+46)+'" font-size="9.5" text-anchor="middle" fill="#64748B">L/3</text><text x="'+(x0+Lp*2/3)+'" y="'+(yL+46)+'" font-size="9.5" text-anchor="middle" fill="#64748B">2L/3</text></svg>';
  return s;}