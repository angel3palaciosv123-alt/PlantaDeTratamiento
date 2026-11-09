// Dependencias: svgDefs/svgDimH/svgDimV, nf y cálculos de Aducción.
function svgCanalAdu(c){
  var W=460,H=250,cx=230,yTop=34,tp=c.tp;
  var wb=tp.wb?c.b:0, z=tp.z, hTot=c.h+c.BL;
  var wTop=wb+2*z*hTot, wAgua=wb+2*z*c.h;
  var s=Math.min(300/wTop,150/hTot);
  var yW=yTop+c.BL*s, yB=yTop+hTot*s;
  var xl=function(w){return cx-w*s/2;}, xr=function(w){return cx+w*s/2;};
  var agua='<polygon points="'+xl(wb)+','+yB+' '+xr(wb)+','+yB+' '+xr(wAgua)+','+yW+' '+xl(wAgua)+','+yW+'" fill="#BFDBFE" stroke="none"/>';
  var pared='<polyline points="'+xl(wTop)+','+yTop+' '+xl(wb)+','+yB+' '+xr(wb)+','+yB+' '+xr(wTop)+','+yTop+'" fill="none" stroke="#15803D" stroke-width="3" stroke-linejoin="round"/>';
  var xd=xr(wTop)+18;
  return '<svg viewBox="0 0 '+W+' '+H+'" width="100%" style="max-width:480px">'+
   '<text x="'+(W/2)+'" y="18" font-size="12" text-anchor="middle" fill="#64748B">SECCIÓN TRANSVERSAL — canal '+c.tipo.toLowerCase()+'</text>'+
   agua+pared+
   '<line x1="'+xl(wTop)+'" y1="'+yW+'" x2="'+xr(wTop)+'" y2="'+yW+'" stroke="#2563EB" stroke-width="1.5" stroke-dasharray="6 4"/>'+
   '<line x1="'+xd+'" y1="'+yTop+'" x2="'+xd+'" y2="'+yW+'" stroke="#EA580C" stroke-width="1.5"/>'+
   '<text x="'+(xd+6)+'" y="'+((yTop+yW)/2+4)+'" font-size="11" fill="#EA580C">BL = '+nf(c.BL,2)+' m</text>'+
   '<line x1="'+xd+'" y1="'+yW+'" x2="'+xd+'" y2="'+yB+'" stroke="#16A34A" stroke-width="1.5"/>'+
   '<text x="'+(xd+6)+'" y="'+((yW+yB)/2+4)+'" font-size="11" fill="#15803D">h = '+nf(c.h,3)+' m</text>'+
   (tp.wb?'<text x="'+cx+'" y="'+(yB+20)+'" font-size="11.5" text-anchor="middle" fill="#15803D">b = '+nf(c.b,3)+' m</text>':
          '<text x="'+cx+'" y="'+(yB+20)+'" font-size="11.5" text-anchor="middle" fill="#15803D">ancho superficial b = '+nf(c.b,3)+' m</text>')+
   '<text x="'+cx+'" y="'+(yB+38)+'" font-size="11" text-anchor="middle" fill="#64748B">A<tspan font-size="8" dy="3">m</tspan><tspan dy="-3"> = '+nf(c.Am,3)+' m²  ·  Vo = '+nf(c.Vo,3)+' m/s</tspan></text>'+
   '</svg>';}

function svgCanalPerfil(c){
  var W=560,H=190,x0=55,x1=500,y0=55;
  var L=Math.max(0,Number(c.L)||0),S=Math.max(0,Number(c.S)||0),dh=L*S;
  var rise=Math.min(70,Math.max(12,dh*10)),y1=y0+rise; H=y1+75;
  return '<svg viewBox="0 0 '+W+' '+H+'" width="100%" style="max-width:620px" role="img" aria-label="Vista lateral longitudinal del canal de aducción">'+
    '<text x="'+(W/2)+'" y="18" font-size="12" text-anchor="middle" fill="#64748B">VISTA LATERAL — PERFIL LONGITUDINAL DEL CANAL</text>'+
    '<path d="M '+x0+' '+y0+' L '+x1+' '+y1+' L '+x1+' '+(y1+35)+' L '+x0+' '+(y0+35)+' Z" fill="#D1FAE5" stroke="#15803D" stroke-width="2"/>'+
    '<line x1="'+x0+'" y1="'+(y0+10)+'" x2="'+x1+'" y2="'+(y1+10)+'" stroke="#2563EB" stroke-width="3"/>'+
    '<line x1="'+x0+'" y1="'+(y0-15)+'" x2="'+x1+'" y2="'+(y0-15)+'" stroke="#94A3B8" stroke-dasharray="5 4"/>'+
    '<text x="'+((x0+x1)/2)+'" y="'+(y0-22)+'" text-anchor="middle" font-size="11" fill="#475569">L = '+nf(L,2)+' m</text>'+
    '<text x="'+((x0+x1)/2)+'" y="'+(y1+58)+'" text-anchor="middle" font-size="11" fill="#15803D">S = '+nf(S*100,2)+' % · Δh = '+nf(dh,3)+' m</text>'+
    '<text x="'+x0+'" y="'+(y0+50)+'" font-size="10" fill="#64748B">Inicio</text><text x="'+x1+'" y="'+(y1+50)+'" font-size="10" text-anchor="end" fill="#64748B">Final</text></svg>';}

function svgTuberiaAdu(t){
  var W=560,H=230,x0=50,y0=50,x1=500,y1=150;
  var nAcc='Accesorios: '+(t.acc.lista.map(function(a){return a.n+'× '+a.nom;}).join(' · ')||'sin accesorios');
  var lin=[],cur=''; nAcc.split(' ').forEach(function(w){ if((cur+' '+w).trim().length>74){lin.push(cur);cur=w;}else cur=(cur+' '+w).trim(); }); if(cur) lin.push(cur);
  H=216+lin.length*14;
  var txtAcc=lin.map(function(l,i){return '<text x="'+(W/2)+'" y="'+(206+i*14)+'" font-size="10.5" text-anchor="middle" fill="#64748B">'+l+'</text>';}).join('');
  return '<svg viewBox="0 0 '+W+' '+H+'" width="100%" style="max-width:600px">'+
   '<text x="'+(W/2)+'" y="18" font-size="12" text-anchor="middle" fill="#64748B">PERFIL DE LA TUBERÍA DE ADUCCIÓN — rejilla → desarenador</text>'+
   '<rect x="'+(x0-30)+'" y="'+(y0-14)+'" width="30" height="28" fill="#F0FDF4" stroke="#15803D" stroke-width="2"/>'+
   '<text x="'+(x0-15)+'" y="'+(y0-20)+'" font-size="10" text-anchor="middle" fill="#15803D">Rejilla</text>'+
   '<rect x="'+x1+'" y="'+(y1-14)+'" width="40" height="28" fill="#F0FDF4" stroke="#15803D" stroke-width="2"/>'+
   '<text x="'+(x1+20)+'" y="'+(y1+30)+'" font-size="10" text-anchor="middle" fill="#15803D">Desarenador</text>'+
   '<line x1="'+x0+'" y1="'+y0+'" x2="'+x1+'" y2="'+y1+'" stroke="#2563EB" stroke-width="5" stroke-linecap="round"/>'+
   '<line x1="'+x0+'" y1="'+y0+'" x2="'+x1+'" y2="'+y0+'" stroke="#94A3B8" stroke-width="1.2" stroke-dasharray="5 4"/>'+
   '<line x1="'+x1+'" y1="'+y0+'" x2="'+x1+'" y2="'+y1+'" stroke="#EA580C" stroke-width="1.5"/>'+
   '<text x="'+(x1-6)+'" y="'+((y0+y1)/2)+'" font-size="11" text-anchor="end" fill="#EA580C">Δh = '+nf(t.Dh,2)+' m</text>'+
   '<text x="'+((x0+x1)/2)+'" y="'+(y0-8)+'" font-size="11" text-anchor="middle" fill="#475569">L = '+nf(t.L,1)+' m  ·  S = '+nf(t.S*100,1)+' %</text>'+
   '<text x="'+((x0+x1)/2-30)+'" y="'+((y0+y1)/2+34)+'" font-size="11" text-anchor="middle" fill="#2563EB">Ø comercial = '+nf(t.Din,2)+' in</text>'+
   txtAcc+'</svg>';}

function svgSeccionTub(t,q){
  var W=640,H=280,cx=140,cy=140,R=104,Dnom=t.D2in||t.Din;
  var V=(q&&t.D2)?t.V2:t.V, s='<svg viewBox="0 0 '+W+' '+H+'" width="100%" style="max-width:600px">'+svgDefs()+
   '<text x="'+(W/2)+'" y="20" font-size="13" font-weight="700" text-anchor="middle" fill="#15803D">SECCIÓN TRANSVERSAL DE LA TUBERÍA — DIÁMETRO</text>';
  if(q){
    var rin=R*q.Dint/q.De;
    s+='<circle cx="'+cx+'" cy="'+cy+'" r="'+R+'" fill="#CBD5E1" stroke="#475569" stroke-width="2"/><circle cx="'+cx+'" cy="'+cy+'" r="'+rin+'" fill="#BFDBFE" stroke="#2563EB" stroke-width="2"/>'+
     '<line x1="'+(cx-rin)+'" y1="'+cy+'" x2="'+(cx+rin)+'" y2="'+cy+'" stroke="#1D4ED8" stroke-width="1.5" marker-start="url(#dA)" marker-end="url(#dA)"/>'+
     '<text x="'+cx+'" y="'+(cy-8)+'" font-size="12" font-weight="700" text-anchor="middle" fill="#1D4ED8">Ø int = '+nf(q.Dint,1)+' mm</text>'+
     '<line x1="'+(cx+rin)+'" y1="'+(cy-30)+'" x2="'+(cx+R+30)+'" y2="'+(cy-30)+'" stroke="#EA580C" stroke-width="1.3"/><text x="'+(cx+R+34)+'" y="'+(cy-26)+'" font-size="11" fill="#EA580C">e = '+nf(q.e,1)+' mm</text>';
  }else{
    s+='<circle cx="'+cx+'" cy="'+cy+'" r="'+R+'" fill="#BFDBFE" stroke="#2563EB" stroke-width="5"/>'+
     '<line x1="'+(cx-R)+'" y1="'+cy+'" x2="'+(cx+R)+'" y2="'+cy+'" stroke="#1D4ED8" stroke-width="1.5" marker-start="url(#dA)" marker-end="url(#dA)"/>'+
     '<text x="'+cx+'" y="'+(cy-8)+'" font-size="12" font-weight="700" text-anchor="middle" fill="#1D4ED8">Ø = '+nf(Dnom,2)+' in</text>';
  }
  var L=['Material: '+PRO.tubMat,'Ø nominal / comercial: '+nf(Dnom,2)+' in ('+nf(Dnom*25.4,1)+' mm)'];
  if(q) L.push('Ø exterior: '+nf(q.De,1)+' mm','Espesor e: '+nf(q.e,1)+' mm','Ø interior: '+nf(q.Dint,1)+' mm','Clase: '+nf(q.psi,0)+' psi · P trabajo = '+nf(q.Ptrab,1)+' m.c.a.');
  else L.push('Sin clase elegida: el espesor se define en el paso 3.');
  L.push('Caudal por tubería: '+nf(t.Q*1000,2)+' L/s','Velocidad: '+nf(V,3)+' m/s'+(V<0.5?'  (menor a 0,5)':''));
  L.forEach(function(x,i){s+='<text x="350" y="'+(70+i*22)+'" font-size="12" fill="#334155">'+x+'</text>';});
  return s+'</svg>';}

