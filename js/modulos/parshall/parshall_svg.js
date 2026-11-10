// Esquemas de la canaleta Parshall (planta y perfil), sin escala exacta.
// Dependencias: nf y resultados de parAnalizar(). Todo lo auxiliar vive aquí (prefijo ps).
var PS_V='#15803D',PS_M='#3D5A4C',PS_G='#475569',PS_A='#2563EB',PS_N='#EA580C',PS_P='#B45309',
    PS_H=' stroke="#FFFFFF" stroke-width="3" paint-order="stroke"',
    PS_F='font-family="system-ui,Segoe UI,Arial,sans-serif"';
function psQ(v){return Math.round(v*100)/100;}
function psFlecha(x,y,dx,dy,c){
  var nx=-dy,ny=dx;
  return '<polygon points="'+psQ(x)+','+psQ(y)+' '+psQ(x-dx*7+nx*3)+','+psQ(y-dy*7+ny*3)+' '+psQ(x-dx*7-nx*3)+','+psQ(y-dy*7-ny*3)+'" fill="'+c+'"/>';}
function psDimV(x,ya,yb,c){
  return '<line x1="'+x+'" y1="'+psQ(ya)+'" x2="'+x+'" y2="'+psQ(yb)+'" stroke="'+c+'" stroke-width="1.4"/>'+
    '<line x1="'+(x-4)+'" y1="'+psQ(ya)+'" x2="'+(x+4)+'" y2="'+psQ(ya)+'" stroke="'+c+'" stroke-width="1.2"/>'+
    '<line x1="'+(x-4)+'" y1="'+psQ(yb)+'" x2="'+(x+4)+'" y2="'+psQ(yb)+'" stroke="'+c+'" stroke-width="1.2"/>'+
    psFlecha(x,ya,0,-1,c)+psFlecha(x,yb,0,1,c);}
function psDimH(xa,xb,y,c){
  return '<line x1="'+psQ(xa)+'" y1="'+y+'" x2="'+psQ(xb)+'" y2="'+y+'" stroke="'+c+'" stroke-width="1.4"/>'+
    '<line x1="'+psQ(xa)+'" y1="'+(y-4)+'" x2="'+psQ(xa)+'" y2="'+(y+4)+'" stroke="'+c+'" stroke-width="1.2"/>'+
    '<line x1="'+psQ(xb)+'" y1="'+(y-4)+'" x2="'+psQ(xb)+'" y2="'+(y+4)+'" stroke="'+c+'" stroke-width="1.2"/>'+
    psFlecha(xa,y,-1,0,c)+psFlecha(xb,y,1,0,c);}
function psLinea(x1,y1,x2,y2,c,dash,w){
  return '<line x1="'+psQ(x1)+'" y1="'+psQ(y1)+'" x2="'+psQ(x2)+'" y2="'+psQ(y2)+'" stroke="'+c+'" stroke-width="'+(w||1)+'"'+(dash?' stroke-dasharray="'+dash+'"':'')+'/>';}
function psTxt(x,y,txt,c,tam,peso,ancla,extra){
  return '<text x="'+psQ(x)+'" y="'+psQ(y)+'" font-size="'+(tam||10.5)+'"'+(peso?' font-weight="'+peso+'"':'')+' text-anchor="'+(ancla||'start')+'" fill="'+c+'"'+(extra||'')+'>'+txt+'</text>';}
function psPastilla(x,y,txt){
  var w=txt.length*5.7+16;
  return '<rect x="'+psQ(x-w/2)+'" y="'+(y-11)+'" width="'+psQ(w)+'" height="17" rx="8.5" fill="#F1F5F9" stroke="#E2E8F0"/>'+psTxt(x,y+1,txt,'#64748B',10,'600','middle');}
function psEstacion(x,y,n){
  return '<circle cx="'+psQ(x)+'" cy="'+y+'" r="11" fill="#FFFFFF" stroke="'+PS_V+'" stroke-width="1.8"/>'+psTxt(x,y+4,n,PS_V,11,'700','middle');}
function psFlujo(x1,x2,y,rot){
  return psLinea(x1,y,x2-6,y,'#1D4ED8',null,4)+psFlecha(x2,y,1,0,'#1D4ED8').replace('fill="#1D4ED8"','fill="#1D4ED8" transform="translate('+(-3)+',0) scale(1)"')+psTxt((x1+x2)/2,y-10,rot,'#1D4ED8',10.5,'600','middle');}
function psDefs(){
  return '<defs>'+
   '<linearGradient id="psAgua" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E0F2FE"/><stop offset="1" stop-color="#93C5FD"/></linearGradient>'+
   '<linearGradient id="psAguaPl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BFDBFE"/><stop offset="0.5" stop-color="#E0F2FE"/><stop offset="1" stop-color="#BFDBFE"/></linearGradient>'+
   '<pattern id="psConcreto" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="#EEF2EF"/><line x1="0" y1="0" x2="0" y2="8" stroke="#CBD5D0" stroke-width="1.4"/></pattern>'+
   '</defs>';}

function parEsc(Ltot,Wmax){
  var s=Math.min(470/Ltot,150/Wmax),sx=s,sy=s;
  if(Ltot*sx<330)sx=330/Ltot;
  return {sx:sx,sy:sy};}

/* ===================== VISTA EN PLANTA ===================== */
function svgPlantaPar(a){
  var f=a.sel.f,r=a.sel.r,Bm=f.B/100,Fm=f.F/100,Gm=f.G/100,Dm=f.D/100,Cm=f.C/100,Wm=f.W;
  var e=parEsc(Bm+Fm+Gm,Math.max(Dm,Cm)),sx=e.sx,sy=e.sy,x0=170,x1=x0+Bm*sx,x2=x1+Fm*sx,x3=x2+Gm*sx,ym=190,hd=Dm*sy/2,hw=Wm*sy/2,hcc=Cm*sy/2;
  var xp=x0+Bm*sx/3,hwa=r.Wa*sy/2,xt=x2+0.4*Gm*sx,hm=Math.max(hd,hcc);
  var up=[[x0-45,ym-hd],[x0,ym-hd],[x1,ym-hw],[x2,ym-hw],[x3,ym-hcc],[x3+45,ym-hcc]],dn=[[x0-45,ym+hd],[x0,ym+hd],[x1,ym+hw],[x2,ym+hw],[x3,ym+hcc],[x3+45,ym+hcc]];
  var pts=function(p){return p.map(function(q){return q[0].toFixed(1)+','+q[1].toFixed(1);}).join(' ');};
  var yZ=ym+hm+24, yb=ym+hm+58, H=yb+66;

  var s='<svg viewBox="0 0 860 '+H+'" width="100%" style="max-width:880px" xmlns="http://www.w3.org/2000/svg" '+PS_F+' role="img" aria-label="Vista en planta de la canaleta Parshall">'+psDefs()+
   psTxt(430,24,'VISTA EN PLANTA con  W = '+f.lab,PS_V,13,'700','middle')+
   /* agua y muros */
   '<polygon points="'+pts(up)+' '+pts(dn.slice().reverse())+'" fill="url(#psAguaPl)"/>'+
   '<polyline points="'+pts(up)+'" fill="none" stroke="'+PS_M+'" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>'+
   '<polyline points="'+pts(dn)+'" fill="none" stroke="'+PS_M+'" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>'+
   /* flujo de entrada y salida */
   psFlujo(24,x0-82,ym,'Entrada')+psFlujo(x3+54,x3+100,ym,'Salida');
  /* secciones 1-4 */
  [[x0,'1'],[x2,'2'],[xt,'3'],[x3,'4']].forEach(function(q){
    s+=psLinea(q[0],60,q[0],ym+hm+10,'#94A3B8','6 4')+psEstacion(q[0],46,q[1]);});
  /* piezómetro Ha y anchos */
  s+=psLinea(xp,ym-hwa,xp,ym+hwa,PS_N,'4 3',2)+
     '<circle cx="'+psQ(xp)+'" cy="'+psQ(ym-hwa)+'" r="5" fill="#FFFFFF" stroke="'+PS_N+'" stroke-width="2.5"/>'+
     psTxt(xp+9,ym-hwa-9,'Piezómetro (Ha)',PS_N,10.5,'700')+
     psTxt(xp+6,ym+4,'Wa = '+nf(r.Wa,3)+' m',PS_N,10.5,'700','start',PS_H)+
     psTxt((x1+x2)/2,ym+4,'W = '+nf(Wm,3)+' m','#1E3A8A',11,'700','middle',PS_H)+
     /* zonas */
     psPastilla((x0+x1)/2,yZ,'Convergente')+psPastilla((x1+x2)/2,yZ,'Garganta')+psPastilla((x2+x3)/2,yZ,'Divergente');
  /* cotas longitudinales */
  s+=psLinea(x0,ym+hd+4,x0,yb+6,'#CBD5E1')+psLinea(x1,ym+hw+4,x1,yb+6,'#CBD5E1')+psLinea(x2,ym+hw+4,x2,yb+6,'#CBD5E1')+psLinea(x3,ym+hcc+4,x3,yb+6,'#CBD5E1')+
     psDimH(x0,x1,yb,PS_G)+psDimH(x1,x2,yb,PS_G)+psDimH(x2,x3,yb,PS_G)+
     psTxt((x0+x1)/2,yb+17,'B = '+nf(Bm,3)+' m',PS_G,11,'700','middle')+
     psTxt((x1+x2)/2,yb+17,'F = '+nf(Fm,3)+' m',PS_G,11,'700','middle')+
     psTxt((x2+x3)/2,yb+17,'G = '+nf(Gm,3)+' m',PS_G,11,'700','middle');
  /* cotas transversales D y C */
  var xDD=x0-62, xCC=x3+112;
  s+=psLinea(xDD-6,ym-hd,x0,ym-hd,'#CBD5E1')+psLinea(xDD-6,ym+hd,x0,ym+hd,'#CBD5E1')+
     psDimV(xDD,ym-hd,ym+hd,PS_G)+
     '<text transform="translate('+(xDD-8)+','+ym+') rotate(-90)" font-size="11" font-weight="700" text-anchor="middle" fill="'+PS_G+'">D = '+nf(Dm,3)+' m</text>'+
     psLinea(x3,ym-hcc,xCC+6,ym-hcc,'#CBD5E1')+psLinea(x3,ym+hcc,xCC+6,ym+hcc,'#CBD5E1')+
     psDimV(xCC,ym-hcc,ym+hcc,PS_G)+
     psTxt(xCC+10,ym+4,'C = '+nf(Cm,3)+' m',PS_G,11,'700');
  s+=psTxt(430,yb+46,'Ha se mide a A/3 del inicio del convergente  ·  A = '+nf(f.A/100,3)+' m  ·  E = '+nf(f.E/100,3)+' m (profundidad de la canaleta)','#64748B',10.5,'','middle')+'</svg>';
  return s;}

/* ===================== VISTA DE PERFIL ===================== */
function svgPerfilPar(a){
  var f=a.sel.f,r=a.sel.r,Bm=f.B/100,Fm=f.F/100,Gm=f.G/100,N=r.N,K=r.Kd,X=r.X,ha=r.ha,h2=r.h2,h3=r.h3,E1=r.E1,BL=r.BL;
  var e=parEsc(Bm+Fm+Gm,1),sx=e.sx,xa=170,xb=xa+Bm*sx,xc=xb+Fm*sx,xd=xc+Gm*sx,xL=60,xR=xd+130;
  var hTop=Math.max(E1,ha+N,h3+BL),fEx=N-K-X,hMin=Math.min(0,fEx),yT=96,sv=Math.min(210/(hTop-hMin),420);
  var Y=function(h){return yT+(hTop-h)*sv;},yBot=Y(hMin)+40;
  var xj1=xc+0.15*Gm*sx,xj2=xc+0.45*Gm*sx,xs=xa+(xb-xa)*0.5;
  var fl=[[xL,Y(N)],[xb,Y(N)],[xc,Y(0)],[xd,Y(N-K)],[xd,Y(fEx)],[xR,Y(fEx)]];
  var su=[[xL,Y(ha+N)],[xs,Y(ha+N)]],t,k;
  for(k=1;k<=10;k++){t=k/10;su.push([xs+(xc-xs)*t,Y((ha+N)+(h2-(ha+N))*(t*t*(3-2*t)))]);}
  su.push([xj1,Y(h2)]);
  for(k=1;k<=8;k++){t=k/8;su.push([xj1+(xj2-xj1)*t,Y(h2+(h3-h2)*t)+((k%2)?-3:3)*(1-t)]);}
  su.push([xR,Y(h3)]);
  var pts=function(p){return p.map(function(q){return q[0].toFixed(1)+','+q[1].toFixed(1);}).join(' ');};
  var yG=yBot+70, H=yG+2*34+34;

  var s='<svg viewBox="0 0 900 '+H+'" width="100%" style="max-width:920px" xmlns="http://www.w3.org/2000/svg" '+PS_F+' role="img" aria-label="Vista de perfil de la canaleta Parshall">'+psDefs()+
   psTxt(450,24,'CORTE LONGITUDINAL CANALETA W = '+f.lab,PS_V,13,'700','middle')+
   /* terreno y agua */
   '<polygon points="'+pts(fl)+' '+xR+','+yBot+' '+xL+','+yBot+'" fill="url(#psConcreto)"/>'+
   '<polygon points="'+pts(su)+' '+pts(fl.slice().reverse())+'" fill="url(#psAgua)"/>'+
   '<polyline points="'+pts(su)+'" fill="none" stroke="'+PS_A+'" stroke-width="2.2" stroke-linejoin="round"/>'+
   '<polyline points="'+pts(fl)+'" fill="none" stroke="'+PS_M+'" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>'+
   /* referencias horizontales */
   psLinea(40,Y(0),xR,Y(0),'#64748B','6 4')+
   psTxt(xL+4,Y(0)+15,'Nivel de referencia (fondo de la garganta)','#64748B',10,'','start',PS_H)+
   psLinea(xb,Y(N),xd+60,Y(N),'#94A3B8','6 4')+
   psLinea(xd,Y(h3+BL),xR,Y(h3+BL),'#94A3B8','6 4')+
   psLinea(xL,Y(E1),xc,Y(E1),PS_N,'3 4',1.5)+
   psTxt(xL+4,Y(E1)-6,'Línea de energía E1',PS_N,10.5,'700')+
   /* flujo de entrada */
   psLinea(20,Y(ha+N),xL-8,Y(ha+N),'#1D4ED8',null,4)+psFlecha(xL-2,Y(ha+N),1,0,'#1D4ED8')+
   psTxt(34,Y(ha+N)-10,'Flujo','#1D4ED8',10.5,'600','middle');
  /* secciones 1-4 */
  [[xa,'1'],[xc,'2'],[xj2+8,'3'],[xd,'4']].forEach(function(q){
    s+=psLinea(q[0],yT-14,q[0],yBot-4,'#94A3B8','6 4')+psEstacion(q[0],yBot+18,q[1]);});
  /* cotas verticales (solo símbolo; los valores van en el cuadro inferior) */
  var dv=function(x,h1,h2_,txt,c,lado){
    var ya=Y(h1),yb2=Y(h2_);
    return psDimV(x,ya,yb2,c)+psTxt(lado==='l'?x-8:x+9,(ya+yb2)/2+4,txt,c,11,'700',lado==='l'?'end':'start',PS_H);};
  s+=dv(140,N,N+ha,'ha',PS_A)+dv(40,0,N,'N',PS_G)+
     psDimV(xc-30,Y(0),Y(h2),PS_N)+psTxt(xc-30,Y(h2)-8,'h2',PS_N,11,'700','middle',PS_H)+
     dv(xj2+22,0,h3,'h3',PS_N,'l')+
     dv(xd-14,N-K,h3,'h4',PS_N)+
     dv(xd+34,N,N-K,'K',PS_G)+dv(xd+34,N-K,fEx,'X','#92400E')+
     dv(xd+72,fEx,h3,'h5',PS_A)+
     dv(xd+108,h3,h3+BL,'BL',PS_G);
  /* resalto hidráulico y zonas */
  var xm=(xj1+xj2)/2;
  s+=psLinea(xm,Y(E1)-6,xm,Y(h2)-4,PS_P,'2 3')+
     psTxt(xm,Y(E1)-32,'Resalto hidráulico',PS_P,10.5,'700','middle')+
     psTxt(xm,Y(E1)-19,'('+r.tipo.replace("Resalto ","Resalto ")+', Fr = '+nf(r.Fr,2)+')',PS_P,10,'','middle')+
     psPastilla((xa+xb)/2,yBot-14,'Convergente')+psPastilla((xb+xc)/2,yBot-14,'Garganta')+
     psPastilla((xc+xd)/2,yBot-14,'Divergente')+psPastilla((xd+xR)/2+20,yBot-14,'Canal de salida');
  /* cuadro de valores */
  var V=[['ha',ha],['N',N],['h2',h2],['h3',h3],['h4',r.h4],['h5',r.h5],['K',K],['X',X],['BL',BL],['E1',E1]];
  s+=psTxt(450,yG-14,'Medidas (m)',PS_V,11,'700','middle');
  V.forEach(function(v,i){
    var cx=42+(i%5)*168, cy=yG+Math.floor(i/5)*34;
    s+='<rect x="'+cx+'" y="'+cy+'" width="158" height="26" rx="8" fill="#F8FAFC" stroke="#E2E8F0"/>'+
       psTxt(cx+12,cy+17,v[0],PS_G,11,'700')+psTxt(cx+146,cy+17,nf(v[1],v[0]==='BL'?2:3)+' m','#334155',11.5,'600','end');});
  s+=psTxt(450,yG+2*34+14,'','#64748B',10.5,'','middle')+'</svg>';
  return s;}