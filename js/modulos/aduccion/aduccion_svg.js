// Dependencias: svgDefs/svgDimH/svgDimV, nf y cálculos de Aducción.
/* ---------- Auxiliares de dibujo (mismo estilo de rejilla y desarenador) ---------- */
var AD_VERDE='#15803D',AD_MURO='#3D5A4C',AD_GRIS='#475569',AD_AZUL='#2563EB',AD_NARANJA='#EA580C';
var HALO=' stroke="#FFFFFF" stroke-width="3" paint-order="stroke"';
function adQ(v){return Math.round(v*100)/100;}
function adFlecha(x,y,dx,dy,c){
  var nx=-dy,ny=dx;
  return '<polygon points="'+adQ(x)+','+adQ(y)+' '+adQ(x-dx*7+nx*3)+','+adQ(y-dy*7+ny*3)+' '+adQ(x-dx*7-nx*3)+','+adQ(y-dy*7-ny*3)+'" fill="'+c+'"/>';}
function adDimV(x,ya,yb,c){
  return '<line x1="'+x+'" y1="'+adQ(ya)+'" x2="'+x+'" y2="'+adQ(yb)+'" stroke="'+c+'" stroke-width="1.4"/>'+
    '<line x1="'+(x-4)+'" y1="'+adQ(ya)+'" x2="'+(x+4)+'" y2="'+adQ(ya)+'" stroke="'+c+'" stroke-width="1.2"/>'+
    '<line x1="'+(x-4)+'" y1="'+adQ(yb)+'" x2="'+(x+4)+'" y2="'+adQ(yb)+'" stroke="'+c+'" stroke-width="1.2"/>'+
    adFlecha(x,ya,0,-1,c)+adFlecha(x,yb,0,1,c);}
function adDimH(xa,xb,y,c){
  return '<line x1="'+adQ(xa)+'" y1="'+y+'" x2="'+adQ(xb)+'" y2="'+y+'" stroke="'+c+'" stroke-width="1.4"/>'+
    '<line x1="'+adQ(xa)+'" y1="'+(y-4)+'" x2="'+adQ(xa)+'" y2="'+(y+4)+'" stroke="'+c+'" stroke-width="1.2"/>'+
    '<line x1="'+adQ(xb)+'" y1="'+(y-4)+'" x2="'+adQ(xb)+'" y2="'+(y+4)+'" stroke="'+c+'" stroke-width="1.2"/>'+
    adFlecha(xa,y,-1,0,c)+adFlecha(xb,y,1,0,c);}
function adOnda(xa,xb,y,amp,lam){
  var d='M'+adQ(xa)+' '+adQ(y),x=xa,sg=1;
  while(x<xb-0.01){
    var xe=Math.min(x+lam/2,xb);
    d+=' Q'+adQ(x+(xe-x)/2)+' '+adQ(y-sg*amp*2)+' '+adQ(xe)+' '+adQ(y);
    x=xe;sg=-sg;}
  return d;}
function adLinea(x1,y1,x2,y2,c,dash){
  return '<line x1="'+adQ(x1)+'" y1="'+adQ(y1)+'" x2="'+adQ(x2)+'" y2="'+adQ(y2)+'" stroke="'+c+'" stroke-width="1"'+(dash?' stroke-dasharray="5 3"':'')+'/>';}

/* ---------- Sección transversal del canal ---------- */
function svgCanalAdu(c){
  var W=700,cx=350,yTop=76,tp=c.tp;
  var wb=tp.wb?c.b:0, z=tp.z, hTot=c.h+c.BL;
  var wTop=wb+2*z*hTot, wAgua=wb+2*z*c.h;
  var s=Math.min(330/wTop,150/hTot);
  var yW=yTop+c.BL*s, yB=yTop+hTot*s;
  var xl=function(w){return cx-w*s/2;}, xr=function(w){return cx+w*s/2;};
  var xIzq=xl(wTop)-46, xDer=xr(wTop)+46, yD=yB+34, H=yD+62;

  var aire='<polygon points="'+adQ(xl(wTop))+','+yTop+' '+adQ(xr(wTop))+','+yTop+' '+adQ(xr(wb))+','+adQ(yB)+' '+adQ(xl(wb))+','+adQ(yB)+'" fill="url(#adAireS)"/>';
  var agua='<polygon points="'+adQ(xl(wAgua))+','+adQ(yW)+' '+adQ(xr(wAgua))+','+adQ(yW)+' '+adQ(xr(wb))+','+adQ(yB)+' '+adQ(xl(wb))+','+adQ(yB)+'" fill="url(#adAguaS)"/>';
  var pared='<polyline points="'+adQ(xl(wTop))+','+yTop+' '+adQ(xl(wb))+','+adQ(yB)+' '+adQ(xr(wb))+','+adQ(yB)+' '+adQ(xr(wTop))+','+yTop+'" fill="none" stroke="'+AD_MURO+'" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"/>';
  var onda=wAgua>0?'<path d="'+adOnda(xl(wAgua),xr(wAgua),yW,1.6,14)+'" fill="none" stroke="'+AD_AZUL+'" stroke-width="1.8"/>':'';

  /* cota inferior: ancho b (en canal triangular es el ancho superficial, con guías desde la lámina de agua) */
  var guiasB=tp.wb?'':adLinea(xl(wAgua),yW,xl(wAgua),yD,'#CBD5E1',true)+adLinea(xr(wAgua),yW,xr(wAgua),yD,'#CBD5E1',true);
  var xb1=tp.wb?xl(wb):xl(wAgua), xb2=tp.wb?xr(wb):xr(wAgua);
  var txtB=tp.wb?'b = ':'Ancho superficial b = ';

  return '<svg viewBox="0 0 '+W+' '+H+'" width="100%" style="max-width:700px" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,Segoe UI,Arial,sans-serif" role="img" aria-label="Sección transversal del canal de aducción">'+
   '<defs>'+
     '<linearGradient id="adAguaS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E0F2FE"/><stop offset="1" stop-color="#93C5FD"/></linearGradient>'+
     '<linearGradient id="adAireS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#F0FDF4"/></linearGradient>'+
   '</defs>'+
   '<text x="'+(W/2)+'" y="24" font-size="13" font-weight="700" text-anchor="middle" fill="'+AD_VERDE+'">CORTE TRANSVERSAL DEL CANAL</text>'+
   '<circle cx="'+(xl(wTop)+6)+'" cy="46" r="6" fill="#FFFFFF" stroke="'+AD_GRIS+'" stroke-width="1.3"/><circle cx="'+(xl(wTop)+6)+'" cy="46" r="2" fill="'+AD_GRIS+'"/>'+
   '<text x="'+(xl(wTop)+18)+'" y="50" font-size="10.5" fill="'+AD_GRIS+'">Flujo hacia el observador</text>'+
   aire+agua+onda+pared+
   /* guías de cota */
   adLinea(xr(wTop),yTop,xDer+6,yTop,'#CBD5E1')+adLinea(xr(wTop),yB,xDer+6,yB,'#CBD5E1')+
   adLinea(xr(wAgua),yW,xDer+6,yW,'#60A5FA',true)+
   adLinea(xIzq-6,yTop,xl(wTop),yTop,'#CBD5E1')+adLinea(xIzq-6,yB,xl(wb),yB,'#CBD5E1')+
   /* cota izquierda: profundidad total */
   adDimV(xIzq,yTop,yB,AD_GRIS)+
   '<text x="'+(xIzq-9)+'" y="'+adQ((yTop+yB)/2)+'" font-size="10.5" fill="'+AD_GRIS+'" text-anchor="middle" transform="rotate(-90 '+(xIzq-9)+' '+adQ((yTop+yB)/2)+')">Profundidad total = '+nf(hTot,2)+' m</text>'+
   /* cotas derechas: BL y h */
   adDimV(xDer,yTop,yW,AD_NARANJA)+
   '<text x="'+(xDer+9)+'" y="'+adQ((yTop+yW)/2+4)+'" font-size="10.5" fill="'+AD_NARANJA+'">Borde libre BL = '+nf(c.BL,2)+' m</text>'+
   adDimV(xDer,yW,yB,AD_VERDE)+
   '<text x="'+(xDer+9)+'" y="'+adQ((yW+yB)/2+4)+'" font-size="11" font-weight="600" fill="'+AD_VERDE+'">h = '+nf(c.h,3)+' m</text>'+
   /* cota inferior */
   guiasB+adDimH(xb1,xb2,yD,AD_VERDE)+
   '<text x="'+cx+'" y="'+(yD+19)+'" font-size="12" font-weight="700" text-anchor="middle" fill="'+AD_VERDE+'">'+txtB+nf(c.b,3)+' m</text>'+
   '<text x="'+cx+'" y="'+(yD+37)+'" font-size="11.5" text-anchor="middle" fill="#64748B">A<tspan font-size="8" dy="3">m</tspan><tspan dy="-3"> = '+nf(c.Am,3)+' m²  ·  V<tspan font-size="8" dy="3">o</tspan><tspan dy="-3"> = '+nf(c.Vo,3)+' m/s</tspan></tspan></text>'+
   '</svg>';}

/* ---------- Perfil longitudinal del canal ---------- */
function svgCanalPerfil(c){
  var W=720,x0=70,x1=550,yT0=104,dpx=90;
  var L=Math.max(0,Number(c.L)||0),S=Math.max(0,Number(c.S)||0),dh=L*S;
  var rise=Math.min(36,Math.max(12,dh*6));
  var hTot=(Number(c.h)||0)+(Number(c.BL)||0), hw=hTot>0?dpx*(Number(c.h)||0)/hTot:dpx*0.6;
  var bed0=yT0+dpx, bed1=bed0+rise, w0=bed0-hw, w1=w0+rise, t0=yT0, t1=yT0+rise, suelo=28;
  var yL=yT0-34, xD=x1+46, H=bed1+suelo+84;

  return '<svg viewBox="0 0 '+W+' '+H+'" width="100%" style="max-width:720px" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,Segoe UI,Arial,sans-serif" role="img" aria-label="Vista lateral longitudinal del canal de aducción">'+
   '<defs>'+
     '<linearGradient id="adAguaP" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E0F2FE"/><stop offset="1" stop-color="#93C5FD"/></linearGradient>'+
     '<linearGradient id="adAireP" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#F0FDF4"/></linearGradient>'+
     '<linearGradient id="adSuelo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E7D9C0"/><stop offset="1" stop-color="#CDB48A"/></linearGradient>'+
   '</defs>'+
   '<text x="'+((x0+x1)/2)+'" y="24" font-size="13" font-weight="700" text-anchor="middle" fill="'+AD_VERDE+'">VISTA LONGITUDINAL DEL CANAL</text>'+
   /* leyenda de flujo */
   '<line x1="'+x0+'" y1="46" x2="'+(x0+34)+'" y2="46" stroke="'+AD_GRIS+'" stroke-width="1.6"/>'+adFlecha(x0+34,46,1,0,AD_GRIS)+
   '<text x="'+(x0+44)+'" y="50" font-size="10.5" fill="'+AD_GRIS+'">Sentido del flujo</text>'+
   /* terreno */
   '<polygon points="'+x0+','+bed0+' '+x1+','+bed1+' '+x1+','+(bed1+suelo)+' '+x0+','+(bed0+suelo)+'" fill="url(#adSuelo)" stroke="#B59A6D" stroke-width="1"/>'+
   /* aire y agua dentro del canal */
   '<polygon points="'+x0+','+t0+' '+x1+','+t1+' '+x1+','+adQ(w1)+' '+x0+','+adQ(w0)+'" fill="url(#adAireP)"/>'+
   '<polygon points="'+x0+','+adQ(w0)+' '+x1+','+adQ(w1)+' '+x1+','+bed1+' '+x0+','+bed0+'" fill="url(#adAguaP)"/>'+
   /* borde superior (referencia), lámina de agua y solera */
   '<line x1="'+x0+'" y1="'+t0+'" x2="'+x1+'" y2="'+t1+'" stroke="#94A3B8" stroke-width="1.4" stroke-dasharray="6 4"/>'+
   '<line x1="'+x0+'" y1="'+adQ(w0)+'" x2="'+x1+'" y2="'+adQ(w1)+'" stroke="'+AD_AZUL+'" stroke-width="2.4"/>'+
   '<line x1="'+x0+'" y1="'+bed0+'" x2="'+x1+'" y2="'+bed1+'" stroke="'+AD_MURO+'" stroke-width="6" stroke-linecap="round"/>'+
   /* muros de inicio y final */
   '<line x1="'+x0+'" y1="'+t0+'" x2="'+x0+'" y2="'+bed0+'" stroke="'+AD_MURO+'" stroke-width="3" stroke-dasharray="3 3"/>'+
   '<line x1="'+x1+'" y1="'+t1+'" x2="'+x1+'" y2="'+bed1+'" stroke="'+AD_MURO+'" stroke-width="3" stroke-dasharray="3 3"/>'+
   /* cota L (horizontal) */
   adLinea(x0,yL,x0,t0-4,'#CBD5E1')+adLinea(x1,yL,x1,t1-4,'#CBD5E1')+
   adDimH(x0,x1,yL,AD_GRIS)+
   '<text x="'+((x0+x1)/2)+'" y="'+(yL-8)+'" font-size="12" font-weight="700" text-anchor="middle" fill="'+AD_GRIS+'">Longitud del canal L = '+nf(L,2)+' m</text>'+
   /* cota Δh (vertical) con referencia horizontal */
   adLinea(x1,bed0,xD+6,bed0,AD_NARANJA,true)+adLinea(x1,bed1,xD+6,bed1,'#CBD5E1')+
   adDimV(xD,bed0,bed1,AD_NARANJA)+
   '<text x="'+(xD+10)+'" y="'+adQ((bed0+bed1)/2+4)+'" font-size="11" font-weight="600" fill="'+AD_NARANJA+'">Δh = '+nf(dh,3)+' m</text>'+
   /* referencias de profundidad en el inicio */
   '<text x="'+(x0+10)+'" y="'+adQ((t0+w0)/2+2)+'" font-size="10.5" fill="'+AD_NARANJA+'"'+HALO+'>BL = '+nf(c.BL,2)+' m</text>'+
   '<text x="'+(x0+10)+'" y="'+adQ((w0+bed0)/2+8)+'" font-size="10.5" font-weight="600" fill="'+AD_VERDE+'"'+HALO+'>h = '+nf(c.h,3)+' m</text>'+
   /* inicio / final y pendiente */
   '<text x="'+x0+'" y="'+(bed0+suelo+20)+'" font-size="11" font-weight="600" text-anchor="middle" fill="'+AD_GRIS+'">Inicio</text>'+
   '<text x="'+x1+'" y="'+(bed1+suelo+20)+'" font-size="11" font-weight="600" text-anchor="middle" fill="'+AD_GRIS+'">Final</text>'+
   '<text x="'+((x0+x1)/2)+'" y="'+(bed1+suelo+44)+'" font-size="12" font-weight="700" text-anchor="middle" fill="'+AD_VERDE+'">Pendiente S = '+nf(S*100,2)+' %</text>'+
   '</svg>';}

/* ---------- Perfil de la tubería de aducción ---------- */
function svgTuberiaAdu(t){
  var W=780,x0=120,x1=560,y0=156,bw=70,bh=64;
  var L=Math.max(0,Number(t.L)||0),S=Math.max(0,Number(t.S)||0),Dh=Number(t.Dh)||L*S;
  var rise=Math.min(80,Math.max(22,Dh*8)), y1=y0+rise, xD=x1+bw+44, yL=y0-bh/2-34;
  var ang=Math.atan2(rise,x1-x0)*180/Math.PI;
  var nAcc='Accesorios: '+(t.acc.lista.map(function(a){return a.n+'× '+a.nom;}).join(' · ')||'sin accesorios');
  var lin=[],cur='';
  nAcc.split(' ').forEach(function(w){if((cur+' '+w).trim().length>86){lin.push(cur);cur=w;}else cur=(cur+' '+w).trim();});
  if(cur)lin.push(cur);
  var yAcc=y1+bh/2+78, H=yAcc+lin.length*15+14;
  var txtAcc=lin.map(function(l,i){return '<text x="'+(W/2)+'" y="'+(yAcc+i*15)+'" font-size="11" text-anchor="middle" fill="#64748B">'+l+'</text>';}).join('');
  var xm=(x0+x1)/2, ym=(y0+y1)/2;

  return '<svg viewBox="0 0 '+W+' '+H+'" width="100%" style="max-width:780px" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,Segoe UI,Arial,sans-serif" role="img" aria-label="Perfil de la tubería de aducción">'+
   '<defs><linearGradient id="adEstruc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F0FDF4"/><stop offset="1" stop-color="#BBF7D0"/></linearGradient></defs>'+
   '<text x="'+(W/2)+'" y="24" font-size="13" font-weight="700" text-anchor="middle" fill="'+AD_VERDE+'">PERFIL DE LA TUBERÍA DE ADUCCIÓN — rejilla → desarenador</text>'+
   '<line x1="'+x0+'" y1="46" x2="'+(x0+34)+'" y2="46" stroke="'+AD_GRIS+'" stroke-width="1.6"/>'+adFlecha(x0+34,46,1,0,AD_GRIS)+
   '<text x="'+(x0+44)+'" y="50" font-size="10.5" fill="'+AD_GRIS+'">Sentido del flujo</text>'+
   /* estructuras */
   '<rect x="'+(x0-bw)+'" y="'+(y0-bh/2)+'" width="'+bw+'" height="'+bh+'" rx="3" fill="url(#adEstruc)" stroke="'+AD_MURO+'" stroke-width="3"/>'+
   '<text x="'+(x0-bw/2)+'" y="'+(y0+4)+'" font-size="11.5" font-weight="700" text-anchor="middle" fill="'+AD_VERDE+'">Rejilla</text>'+
   '<rect x="'+x1+'" y="'+(y1-bh/2)+'" width="'+(bw+20)+'" height="'+bh+'" rx="3" fill="url(#adEstruc)" stroke="'+AD_MURO+'" stroke-width="3"/>'+
   '<text x="'+(x1+(bw+20)/2)+'" y="'+(y1+4)+'" font-size="11.5" font-weight="700" text-anchor="middle" fill="'+AD_VERDE+'">Desarenador</text>'+
   /* tubería: pared + agua */
   '<line x1="'+x0+'" y1="'+y0+'" x2="'+x1+'" y2="'+y1+'" stroke="'+AD_MURO+'" stroke-width="13" stroke-linecap="butt"/>'+
   '<line x1="'+x0+'" y1="'+y0+'" x2="'+x1+'" y2="'+y1+'" stroke="#93C5FD" stroke-width="7" stroke-linecap="butt"/>'+
   '<line x1="'+x0+'" y1="'+y0+'" x2="'+x1+'" y2="'+y1+'" stroke="'+AD_AZUL+'" stroke-width="1.6" stroke-dasharray="8 6"/>'+
   /* cota L horizontal */
   adLinea(x0,yL,x0,y0-bh/2-2,'#CBD5E1')+adLinea(x1,yL,x1,y1-bh/2-2,'#CBD5E1')+
   adDimH(x0,x1,yL,AD_GRIS)+
   '<text x="'+xm+'" y="'+(yL-8)+'" font-size="12" font-weight="700" text-anchor="middle" fill="'+AD_GRIS+'">Longitud de la tubería L = '+nf(t.L,1)+' m  ·  S = '+nf(t.S*100,1)+' %</text>'+
   /* cota Δh vertical */
   adLinea(x1,y0,xD+6,y0,AD_NARANJA,true)+adLinea(x1+bw+20,y1,xD+6,y1,'#CBD5E1')+
   adDimV(xD,y0,y1,AD_NARANJA)+
   '<text x="'+(xD+10)+'" y="'+adQ(ym+4)+'" font-size="11" font-weight="600" fill="'+AD_NARANJA+'">Δh = '+nf(t.Dh,2)+' m</text>'+
   /* diámetro */
   '<text x="'+xm+'" y="'+adQ(ym+34)+'" font-size="12" font-weight="700" text-anchor="middle" fill="'+AD_AZUL+'"'+HALO+'>Ø comercial = '+nf(t.Din,2)+' in</text>'+
   '<text x="'+xm+'" y="'+adQ(ym+50)+'" font-size="10.5" text-anchor="middle" fill="#64748B"'+HALO+'>Inclinación exagerada para que se aprecie</text>'+
   '<line x1="'+(W/2-200)+'" y1="'+(yAcc-18)+'" x2="'+(W/2+200)+'" y2="'+(yAcc-18)+'" stroke="#E2E8F0"/>'+
   txtAcc+'</svg>';}

/* ---------- Sección transversal de la tubería ---------- */
function svgSeccionTub(t,q){
  var W=720,H=335,cx=170,cy=160,R=104,Dnom=t.D2in||t.Din;
  var V=(q&&t.D2)?t.V2:t.V, vBaja=V<0.5;
  var s='<svg viewBox="0 0 '+W+' '+H+'" width="100%" style="max-width:720px" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,Segoe UI,Arial,sans-serif" role="img" aria-label="Sección transversal de la tubería de aducción">'+
   '<defs><linearGradient id="adAguaT" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E0F2FE"/><stop offset="1" stop-color="#93C5FD"/></linearGradient></defs>'+
   '<text x="'+(W/2)+'" y="24" font-size="13" font-weight="700" text-anchor="middle" fill="'+AD_VERDE+'">CORTE TRANSVERSAL DE LA TUBERÍA </text>'+
   '<circle cx="'+(cx-R+6)+'" cy="46" r="6" fill="#FFFFFF" stroke="'+AD_GRIS+'" stroke-width="1.3"/><circle cx="'+(cx-R+6)+'" cy="46" r="2" fill="'+AD_GRIS+'"/>'+
   '<text x="'+(cx-R+18)+'" y="50" font-size="10.5" fill="'+AD_GRIS+'">Flujo hacia el observador</text>';
  var yD=cy+R+26;
  if(q){
    var rin=R*q.Dint/q.De, rm=(R+rin)/2, px=cx+rm*0.7071, py=cy-rm*0.7071;
    s+='<circle cx="'+cx+'" cy="'+cy+'" r="'+R+'" fill="#CBD5E1" stroke="'+AD_MURO+'" stroke-width="3"/>'+
     '<circle cx="'+cx+'" cy="'+cy+'" r="'+adQ(rin)+'" fill="url(#adAguaT)" stroke="'+AD_AZUL+'" stroke-width="2"/>'+
     '<line x1="'+adQ(px)+'" y1="'+adQ(py)+'" x2="'+(cx+R+34)+'" y2="'+(cy-R+10)+'" stroke="'+AD_NARANJA+'" stroke-width="1.3"/>'+
     '<circle cx="'+adQ(px)+'" cy="'+adQ(py)+'" r="2.5" fill="'+AD_NARANJA+'"/>'+
     '<text x="'+(cx+R+38)+'" y="'+(cy-R+14)+'" font-size="11" font-weight="600" fill="'+AD_NARANJA+'">e = '+nf(q.e,1)+' mm</text>'+
     adDimH(cx-rin,cx+rin,cy,AD_AZUL)+
     '<text x="'+cx+'" y="'+(cy-9)+'" font-size="12" font-weight="700" text-anchor="middle" fill="#1D4ED8"'+HALO+'>Ø int = '+nf(q.Dint,1)+' mm</text>'+
     adLinea(cx-R,cy+R*0.2,cx-R,yD,'#CBD5E1')+adLinea(cx+R,cy+R*0.2,cx+R,yD,'#CBD5E1')+
     adDimH(cx-R,cx+R,yD,AD_GRIS)+
     '<text x="'+cx+'" y="'+(yD+18)+'" font-size="11.5" font-weight="700" text-anchor="middle" fill="'+AD_GRIS+'">Ø exterior = '+nf(q.De,1)+' mm</text>';
  }else{
    s+='<circle cx="'+cx+'" cy="'+cy+'" r="'+R+'" fill="url(#adAguaT)" stroke="'+AD_MURO+'" stroke-width="6"/>'+
     adDimH(cx-R,cx+R,cy,AD_AZUL)+
     '<text x="'+cx+'" y="'+(cy-9)+'" font-size="12" font-weight="700" text-anchor="middle" fill="#1D4ED8"'+HALO+'>Ø = '+nf(Dnom,2)+' in</text>';
  }
  /* tabla de datos a la derecha */
  var F=[['Material',PRO.tubMat],['Ø nominal / comercial',nf(Dnom,2)+' in ('+nf(Dnom*25.4,1)+' mm)']];
  if(q) F.push(['Ø exterior',nf(q.De,1)+' mm'],['Espesor e',nf(q.e,1)+' mm'],['Ø interior',nf(q.Dint,1)+' mm'],['Clase',nf(q.psi,0)+' psi'],['Presión de trabajo',nf(q.Ptrab,1)+' m.c.a.']);
  else F.push(['Clase','Sin clase (se elige en el paso 3)']);
  F.push(['Caudal por tubería',nf(t.Q*1000,2)+' L/s'],['Velocidad',nf(V,3)+' m/s'+(vBaja?'  (menor a 0,5)':'')]);
  var xt=390, y0=78, dy=26;
  s+='<rect x="'+(xt-14)+'" y="'+(y0-24)+'" width="'+(W-xt-6)+'" height="'+(F.length*dy+34)+'" rx="10" fill="#F8FAFC" stroke="#E2E8F0"/>'+
     '<text x="'+xt+'" y="'+(y0-4)+'" font-size="12" font-weight="700" fill="'+AD_VERDE+'">Datos de la tubería</text>';
  F.forEach(function(r,i){
    var y=y0+16+i*dy, alerta=(r[0]==='Velocidad'&&vBaja);
    s+='<text x="'+xt+'" y="'+y+'" font-size="10.5" fill="#64748B">'+r[0]+'</text>'+
       '<text x="'+(xt+122)+'" y="'+y+'" font-size="11.5" font-weight="600" fill="'+(alerta?AD_NARANJA:'#334155')+'">'+r[1]+'</text>'+
       (i<F.length-1?'<line x1="'+xt+'" y1="'+(y+9)+'" x2="'+(W-26)+'" y2="'+(y+9)+'" stroke="#E2E8F0"/>':'');});
  return s+'</svg>';}