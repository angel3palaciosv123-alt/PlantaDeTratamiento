// Dependencias: svgDefs/svgDimH/svgDimV, nf y resultados de parAnalizar().
/* ---------- Esquemas: planta y perfil (sin escala exacta) ---------- */
function parEsc(Ltot,Wmax){
  var s=Math.min(470/Ltot,150/Wmax),sx=s,sy=s;
  if(Ltot*sx<330)sx=330/Ltot;
  return {sx:sx,sy:sy};}

function svgPlantaPar(a){
  var f=a.sel.f,r=a.sel.r,Bm=f.B/100,Fm=f.F/100,Gm=f.G/100,Dm=f.D/100,Cm=f.C/100,Wm=f.W;
  var e=parEsc(Bm+Fm+Gm,Math.max(Dm,Cm)),sx=e.sx,sy=e.sy,x0=170,x1=x0+Bm*sx,x2=x1+Fm*sx,x3=x2+Gm*sx,ym=185,hd=Dm*sy/2,hw=Wm*sy/2,hcc=Cm*sy/2;
  var xp=x0+Bm*sx/3,hwa=r.Wa*sy/2,xt=x2+0.4*Gm*sx,hm=Math.max(hd,hcc);
  var up=[[x0-45,ym-hd],[x0,ym-hd],[x1,ym-hw],[x2,ym-hw],[x3,ym-hcc],[x3+45,ym-hcc]],dn=[[x0-45,ym+hd],[x0,ym+hd],[x1,ym+hw],[x2,ym+hw],[x3,ym+hcc],[x3+45,ym+hcc]];
  var pts=function(p){return p.map(function(q){return q[0].toFixed(1)+','+q[1].toFixed(1);}).join(' ');};
  var s='<svg viewBox="0 0 860 370" width="100%" style="max-width:880px">'+svgDefs()+
   '<text x="430" y="20" font-size="13" font-weight="700" text-anchor="middle" fill="#15803D">VISTA EN PLANTA — canaleta Parshall W = '+f.lab+'</text>'+
   '<polygon points="'+pts(up)+' '+pts(dn.slice().reverse())+'" fill="#DBEAFE"/>'+
   '<polyline points="'+pts(up)+'" fill="none" stroke="#15803D" stroke-width="4" stroke-linejoin="round"/>'+
   '<polyline points="'+pts(dn)+'" fill="none" stroke="#15803D" stroke-width="4" stroke-linejoin="round"/>'+
   '<line x1="20" y1="'+ym+'" x2="'+(x0-84)+'" y2="'+ym+'" stroke="#1D4ED8" stroke-width="5" marker-end="url(#fA)"/>'+
   '<line x1="'+(x3+54)+'" y1="'+ym+'" x2="'+(x3+100)+'" y2="'+ym+'" stroke="#1D4ED8" stroke-width="5" marker-end="url(#fA)"/>';
  [[x0,'1'],[x2,'2'],[xt,'3'],[x3,'4']].forEach(function(q){
    s+='<line x1="'+q[0]+'" y1="58" x2="'+q[0]+'" y2="'+(ym+hm+8)+'" stroke="#64748B" stroke-width="1" stroke-dasharray="6 4"/>'+
       '<circle cx="'+q[0]+'" cy="46" r="11" fill="#fff" stroke="#475569" stroke-width="1.5"/><text x="'+q[0]+'" y="50" font-size="11" font-weight="700" text-anchor="middle" fill="#334155">'+q[1]+'</text>';});
  s+='<line x1="'+xp+'" y1="'+(ym-hwa)+'" x2="'+xp+'" y2="'+(ym+hwa)+'" stroke="#EA580C" stroke-width="2" stroke-dasharray="4 3"/>'+
     '<circle cx="'+xp+'" cy="'+(ym-hwa)+'" r="5" fill="#fff" stroke="#EA580C" stroke-width="2.5"/>'+
     '<text x="'+(xp+8)+'" y="'+(ym-hwa-10)+'" font-size="10.5" font-weight="700" fill="#EA580C">Piezómetro (Ha)</text>'+
     '<text x="'+(xp+6)+'" y="'+(ym+4)+'" font-size="10.5" font-weight="700" fill="#EA580C" stroke="#DBEAFE" stroke-width="3" paint-order="stroke">Wa = '+nf(r.Wa,3)+' m</text>'+
     '<text x="'+((x1+x2)/2)+'" y="'+(ym+4)+'" font-size="11" font-weight="700" text-anchor="middle" fill="#1E3A8A" stroke="#DBEAFE" stroke-width="3" paint-order="stroke">W = '+nf(Wm,3)+' m</text>'+
     '<text x="'+((x0+x1)/2)+'" y="'+(ym+hm+20)+'" font-size="10" text-anchor="middle" fill="#64748B">Convergente</text>'+
     '<text x="'+((x1+x2)/2)+'" y="'+(ym+hm+20)+'" font-size="10" text-anchor="middle" fill="#64748B">Garganta</text>'+
     '<text x="'+((x2+x3)/2)+'" y="'+(ym+hm+20)+'" font-size="10" text-anchor="middle" fill="#64748B">Divergente</text>';
  var yb=ym+hm+44;
  s+=svgDimH(x0,x1,yb,'B = '+nf(Bm,3)+' m')+svgDimH(x1,x2,yb,'F = '+nf(Fm,3)+' m')+svgDimH(x2,x3,yb,'G = '+nf(Gm,3)+' m');
  s+='<line x1="'+(x0-62)+'" y1="'+(ym-hd)+'" x2="'+(x0-62)+'" y2="'+(ym+hd)+'" stroke="#475569" stroke-width="1.2" marker-start="url(#dA)" marker-end="url(#dA)"/>'+
     '<text transform="translate('+(x0-68)+','+ym+') rotate(-90)" font-size="11" font-weight="700" text-anchor="middle" fill="#475569">D = '+nf(Dm,3)+' m</text>'+
     svgDimV(x3+112,ym-hcc,ym+hcc,'C = '+nf(Cm,3)+' m');
  s+='<text x="430" y="362" font-size="10.5" text-anchor="middle" fill="#64748B">Ha se mide a A/3 del inicio del convergente · A = '+nf(f.A/100,3)+' m · E = '+nf(f.E/100,3)+' m (profundidad de la canaleta)</text></svg>';
  return s;}

function svgPerfilPar(a){
  var f=a.sel.f,r=a.sel.r,Bm=f.B/100,Fm=f.F/100,Gm=f.G/100,N=r.N,K=r.Kd,X=r.X,ha=r.ha,h2=r.h2,h3=r.h3,E1=r.E1,BL=r.BL;
  var e=parEsc(Bm+Fm+Gm,1),sx=e.sx,xa=170,xb=xa+Bm*sx,xc=xb+Fm*sx,xd=xc+Gm*sx,xL=60,xR=xd+130;
  var hTop=Math.max(E1,ha+N,h3+BL),fEx=N-K-X,hMin=Math.min(0,fEx),yT=84,sv=Math.min(210/(hTop-hMin),420);
  var Y=function(h){return yT+(hTop-h)*sv;},yBot=Y(hMin)+40;
  var xj1=xc+0.15*Gm*sx,xj2=xc+0.45*Gm*sx,xs=xa+(xb-xa)*0.5;
  var fl=[[xL,Y(N)],[xb,Y(N)],[xc,Y(0)],[xd,Y(N-K)],[xd,Y(fEx)],[xR,Y(fEx)]];
  var su=[[xL,Y(ha+N)],[xs,Y(ha+N)]],t,k;
  for(k=1;k<=10;k++){t=k/10;su.push([xs+(xc-xs)*t,Y((ha+N)+(h2-(ha+N))*(t*t*(3-2*t)))]);}
  su.push([xj1,Y(h2)]);
  for(k=1;k<=8;k++){t=k/8;su.push([xj1+(xj2-xj1)*t,Y(h2+(h3-h2)*t)+((k%2)?-3:3)*(1-t)]);}
  su.push([xR,Y(h3)]);
  var pts=function(p){return p.map(function(q){return q[0].toFixed(1)+','+q[1].toFixed(1);}).join(' ');};
  var s='<svg viewBox="0 0 900 '+(yBot+96)+'" width="100%" style="max-width:920px">'+svgDefs()+
   '<text x="450" y="20" font-size="13" font-weight="700" text-anchor="middle" fill="#15803D">VISTA DE PERFIL — canaleta Parshall W = '+f.lab+'</text>'+
   '<polygon points="'+pts(su)+' '+pts(fl.slice().reverse())+'" fill="#BFDBFE"/>'+
   '<polygon points="'+pts(fl)+' '+xR+','+yBot+' '+xL+','+yBot+'" fill="#E7ECE9"/>'+
   '<polyline points="'+pts(su)+'" fill="none" stroke="#2563EB" stroke-width="2"/>'+
   '<polyline points="'+pts(fl)+'" fill="none" stroke="#15803D" stroke-width="5" stroke-linejoin="round"/>'+
   '<line x1="40" y1="'+Y(0)+'" x2="'+(xR)+'" y2="'+Y(0)+'" stroke="#64748B" stroke-width="1" stroke-dasharray="6 4"/>'+
   '<text x="46" y="'+(Y(0)+14)+'" font-size="10" fill="#64748B">Nivel de referencia (fondo de la garganta)</text>'+
   '<line x1="'+xb+'" y1="'+Y(N)+'" x2="'+(xd+60)+'" y2="'+Y(N)+'" stroke="#64748B" stroke-width="1" stroke-dasharray="6 4"/>'+
   '<line x1="'+xd+'" y1="'+Y(h3+BL)+'" x2="'+xR+'" y2="'+Y(h3+BL)+'" stroke="#64748B" stroke-width="1" stroke-dasharray="6 4"/>'+
   '<line x1="'+xL+'" y1="'+Y(E1)+'" x2="'+xc+'" y2="'+Y(E1)+'" stroke="#EA580C" stroke-width="1.4" stroke-dasharray="3 4"/>'+
   '<text x="'+(xL+4)+'" y="'+(Y(E1)-5)+'" font-size="10.5" font-weight="700" fill="#EA580C">Línea de energía E1</text>'+
   '<line x1="20" y1="'+Y(ha+N)+'" x2="'+(xL-6)+'" y2="'+Y(ha+N)+'" stroke="#1D4ED8" stroke-width="5" marker-end="url(#fA)"/>';
  [[xa,'1'],[xc,'2'],[xj2+8,'3'],[xd,'4']].forEach(function(q){
    s+='<line x1="'+q[0]+'" y1="'+(yT-14)+'" x2="'+q[0]+'" y2="'+(yBot-4)+'" stroke="#94A3B8" stroke-width="1" stroke-dasharray="6 4"/>'+
       '<circle cx="'+q[0]+'" cy="'+(yBot+16)+'" r="11" fill="#fff" stroke="#475569" stroke-width="1.5"/><text x="'+q[0]+'" y="'+(yBot+20)+'" font-size="11" font-weight="700" text-anchor="middle" fill="#334155">'+q[1]+'</text>';});
  var dv=function(x,h1,h2_,txt,c){return svgDimV(x,Y(h1),Y(h2_),txt,c);};
  s+=dv(140,N,N+ha,'ha','#1D4ED8')+dv(40,0,N,'N','#475569')+
     '<line x1="'+(xc-30)+'" y1="'+Y(0)+'" x2="'+(xc-30)+'" y2="'+Y(h2)+'" stroke="#EA580C" stroke-width="1.2" marker-start="url(#dA)" marker-end="url(#dA)"/><text x="'+(xc-30)+'" y="'+(Y(h2)-7)+'" font-size="11" font-weight="700" text-anchor="middle" fill="#EA580C">h2</text>'+
     dv(xj2+22,0,h3,'h3','#EA580C')+
     dv(xd-16,N-K,h3,'h4','#EA580C')+
     dv(xd+26,N,N-K,'K','#475569')+dv(xd+26,N-K,fEx,'X','#92400E')+
     dv(xd+64,fEx,h3,'h5','#1D4ED8')+
     dv(xd+100,h3,h3+BL,'BL','#475569');
  var xm=(xj1+xj2)/2;
  s+='<line x1="'+xm+'" y1="'+(Y(E1)-6)+'" x2="'+xm+'" y2="'+(Y(h2)-4)+'" stroke="#B45309" stroke-width="1" stroke-dasharray="2 3"/>'+
     '<text x="'+xm+'" y="'+(Y(E1)-30)+'" font-size="10.5" font-weight="700" text-anchor="middle" fill="#B45309">Resalto hidráulico</text>'+
     '<text x="'+xm+'" y="'+(Y(E1)-18)+'" font-size="10" text-anchor="middle" fill="#B45309">('+r.tipo.replace("Resalto ","resalto ")+', Fr = '+nf(r.Fr,2)+')</text>'+
     '<text x="'+((xa+xb)/2)+'" y="'+(yBot-12)+'" font-size="10" text-anchor="middle" fill="#64748B">Convergente</text>'+
     '<text x="'+((xb+xc)/2)+'" y="'+(yBot-12)+'" font-size="10" text-anchor="middle" fill="#64748B">Garganta</text>'+
     '<text x="'+((xc+xd)/2)+'" y="'+(yBot-12)+'" font-size="10" text-anchor="middle" fill="#64748B">Divergente</text>'+
     '<text x="'+((xd+xR)/2+20)+'" y="'+(yBot-12)+'" font-size="10" text-anchor="middle" fill="#64748B">Canal de salida</text>'+
     '<text x="450" y="'+(yBot+52)+'" font-size="11" text-anchor="middle" fill="#334155">ha = '+nf(ha,3)+' · N = '+nf(N,3)+' · h2 = '+nf(h2,3)+' · h3 = '+nf(h3,3)+' · h4 = '+nf(r.h4,3)+' · h5 = '+nf(r.h5,3)+' · K = '+nf(K,3)+' · X = '+nf(X,3)+' · BL = '+nf(BL,2)+' (m)</text>'+
     '<text x="450" y="'+(yBot+70)+'" font-size="10.5" text-anchor="middle" fill="#64748B">Alturas h2, h3 y E1 medidas desde el nivel de referencia (fondo de la garganta); h4 = h3 − (N − K); h5 = E1 = h4 + X.</text></svg>';
  return s;}

