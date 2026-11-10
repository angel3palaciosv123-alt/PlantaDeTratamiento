// Esquemas de la rejilla (vista frontal y vista lateral de un barrote).
// Dependencia: solo nf (si no existe, se usa un formateador local con coma decimal).
// Todo lo auxiliar (flechas, cotas, ondas, degradados) vive dentro de cada función.

function svgRejillaFrontal(r){
  var f=(typeof nf==='function')?nf:function(v,d){return Number(v).toFixed(d).replace('.',',');};
  var q=function(v){return Math.round(v*100)/100;};
  var W=700,Hh=310,x0=96,y0=62,bw=430,bh=150,wall=8;
  var VERDE='#15803D',MURO='#3D5A4C',GRIS='#475569',AZUL='#2563EB',AGUA='#60A5FA';
  var frac=(r.BL>0&&r.Htotal>0&&r.BL<r.Htotal)?r.BL/r.Htotal:0.18;
  var yA=y0+bh*frac, yF=y0+bh;

  function flecha(x,y,dx,dy,c){
    var nx=-dy,ny=dx;
    return '<polygon points="'+q(x)+','+q(y)+' '+q(x-dx*7+nx*3)+','+q(y-dy*7+ny*3)+' '+q(x-dx*7-nx*3)+','+q(y-dy*7-ny*3)+'" fill="'+c+'"/>';
  }
  function dimV(x,ya,yb,c){
    return '<line x1="'+x+'" y1="'+q(ya)+'" x2="'+x+'" y2="'+q(yb)+'" stroke="'+c+'" stroke-width="1.4"/>'+
      '<line x1="'+(x-4)+'" y1="'+q(ya)+'" x2="'+(x+4)+'" y2="'+q(ya)+'" stroke="'+c+'" stroke-width="1.2"/>'+
      '<line x1="'+(x-4)+'" y1="'+q(yb)+'" x2="'+(x+4)+'" y2="'+q(yb)+'" stroke="'+c+'" stroke-width="1.2"/>'+
      flecha(x,ya,0,-1,c)+flecha(x,yb,0,1,c);
  }
  function dimH(xa,xb,y,c){
    return '<line x1="'+q(xa)+'" y1="'+y+'" x2="'+q(xb)+'" y2="'+y+'" stroke="'+c+'" stroke-width="1.4"/>'+
      '<line x1="'+q(xa)+'" y1="'+(y-4)+'" x2="'+q(xa)+'" y2="'+(y+4)+'" stroke="'+c+'" stroke-width="1.2"/>'+
      '<line x1="'+q(xb)+'" y1="'+(y-4)+'" x2="'+q(xb)+'" y2="'+(y+4)+'" stroke="'+c+'" stroke-width="1.2"/>'+
      flecha(xa,y,-1,0,c)+flecha(xb,y,1,0,c);
  }
  function onda(xa,xb,y,amp,lam){
    var d='M'+q(xa)+' '+q(y),x=xa,s=1;
    while(x<xb-0.01){
      var xe=Math.min(x+lam/2,xb);
      d+=' Q'+q(x+(xe-x)/2)+' '+q(y-s*amp*2)+' '+q(xe)+' '+q(y);
      x=xe;s=-s;
    }
    return d;
  }

  // Barrotes (máximo 60 dibujados)
  var nb=Math.max(1,Math.min(r.nb,60)), paso=bw/(nb+1), gb='';
  var gro=Math.max(1.6,Math.min(4,paso*0.45));
  for(var i=1;i<=nb;i++){
    var x=x0+paso*i;
    gb+='<rect x="'+q(x-gro/2)+'" y="'+y0+'" width="'+q(gro)+'" height="'+bh+'" rx="'+q(gro/2)+'" fill="'+VERDE+'"/>';
  }

  var rExt=x0+bw+wall+24;      // columna de cotas derecha
  var xIzq=x0-wall-26;         // columna de cota izquierda
  var yB=yF+wall+24;           // cota inferior (B)

  var s='<svg viewBox="0 0 '+W+' '+Hh+'" width="100%" style="max-width:700px" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,Segoe UI,Arial,sans-serif">'+
   '<defs>'+
     '<linearGradient id="rjAguaF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E0F2FE"/><stop offset="1" stop-color="#93C5FD"/></linearGradient>'+
     '<linearGradient id="rjAireF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#F0FDF4"/></linearGradient>'+
   '</defs>'+
   '<text x="'+(x0+bw/2)+'" y="24" font-size="13" font-weight="700" text-anchor="middle" fill="'+VERDE+'">VISTA FRONTAL'+f(r.th,0)+'°</text>'+
   // leyenda de flujo
   '<circle cx="'+(x0+6)+'" cy="43" r="6" fill="#FFFFFF" stroke="'+GRIS+'" stroke-width="1.3"/>'+
   '<circle cx="'+(x0+6)+'" cy="43" r="2" fill="'+GRIS+'"/>'+
   '<text x="'+(x0+18)+'" y="47" font-size="10.5" fill="'+GRIS+'">Flujo hacia el observador</text>'+
   // interior del canal: aire y agua
   '<rect x="'+x0+'" y="'+y0+'" width="'+bw+'" height="'+bh+'" fill="url(#rjAireF)"/>'+
   '<rect x="'+x0+'" y="'+q(yA)+'" width="'+bw+'" height="'+q(yF-yA)+'" fill="url(#rjAguaF)"/>'+
   // barrotes
   gb+
   // superficie del agua
   '<path d="'+onda(x0,x0+bw,yA,1.6,14)+'" fill="none" stroke="'+AZUL+'" stroke-width="1.8"/>'+
   // paredes y fondo del canal
   '<rect x="'+(x0-wall)+'" y="'+y0+'" width="'+wall+'" height="'+(bh+wall)+'" fill="'+MURO+'"/>'+
   '<rect x="'+(x0+bw)+'" y="'+y0+'" width="'+wall+'" height="'+(bh+wall)+'" fill="'+MURO+'"/>'+
   '<rect x="'+(x0-wall)+'" y="'+yF+'" width="'+(bw+2*wall)+'" height="'+wall+'" fill="'+MURO+'"/>'+
   // guías de cota
   '<line x1="'+(x0+bw+wall)+'" y1="'+y0+'" x2="'+(rExt+6)+'" y2="'+y0+'" stroke="#CBD5E1" stroke-width="1"/>'+
   '<line x1="'+(x0+bw+wall)+'" y1="'+yF+'" x2="'+(rExt+6)+'" y2="'+yF+'" stroke="#CBD5E1" stroke-width="1"/>'+
   '<line x1="'+(x0+bw+wall)+'" y1="'+q(yA)+'" x2="'+(rExt+6)+'" y2="'+q(yA)+'" stroke="'+AGUA+'" stroke-width="1.4" stroke-dasharray="5 3"/>'+
   '<line x1="'+(xIzq-6)+'" y1="'+y0+'" x2="'+(x0-wall)+'" y2="'+y0+'" stroke="#CBD5E1" stroke-width="1"/>'+
   '<line x1="'+(xIzq-6)+'" y1="'+(yF+wall)+'" x2="'+(x0-wall)+'" y2="'+(yF+wall)+'" stroke="#CBD5E1" stroke-width="1"/>'+
   // cota izquierda: altura total
   dimV(xIzq,y0,yF+wall,GRIS)+
   '<text x="'+(xIzq-9)+'" y="'+q(y0+(bh+wall)/2)+'" font-size="10.5" fill="'+GRIS+'" text-anchor="middle" transform="rotate(-90 '+(xIzq-9)+' '+q(y0+(bh+wall)/2)+')">Altura total canal = '+f(r.Htotal,2)+' m</text>'+
   // cotas derechas: borde libre y Hrh
   dimV(rExt,y0,yA,AZUL)+
   '<text x="'+(rExt+9)+'" y="'+q((y0+yA)/2+4)+'" font-size="10.5" fill="'+AZUL+'">Borde libre '+f(r.BL,2)+' m</text>'+
   dimV(rExt,yA,yF,VERDE)+
   '<text x="'+(rExt+15)+'" y="'+q((yA+yF)/2)+'" font-size="11" font-weight="600" fill="'+VERDE+'" text-anchor="middle" transform="rotate(-90 '+(rExt+15)+' '+q((yA+yF)/2)+')">Hrh = '+f(r.H,2)+' m</text>'+
   // cota inferior: ancho de rejilla
   dimH(x0,x0+bw,yB,VERDE)+
   '<text x="'+(x0+bw/2)+'" y="'+(yB+18)+'" font-size="12" font-weight="700" text-anchor="middle" fill="'+VERDE+'">Ancho de rejilla B = '+f(r.Br,2)+' m</text>'+
   '<text x="'+(x0+bw/2)+'" y="'+(yB+35)+'" font-size="11.5" text-anchor="middle" fill="'+VERDE+'">'+r.nb+' barrotes  -  Separación z = '+f(r.z,3)+' m</text>'+
   '<text x="'+(x0+bw/2)+'" y="'+(yB+51)+'" font-size="11" text-anchor="middle" fill="#64748B">Altura total de la rejilla = '+f(r.Htotal,2)+' m'+'</text>'+
  '</svg>';
  return s;
}

function svgRejillaLateral(r){
  var f=(typeof nf==='function')?nf:function(v,d){return Number(v).toFixed(d).replace('.',',');};
  var q=function(v){return Math.round(v*100)/100;};
  var W=440,Hh=300,xBed=110,yBed=250,xIni=24;
  var VERDE='#15803D',GRIS='#475569',AZUL='#2563EB',NARANJA='#EA580C',AGUA='#60A5FA';
  var rad=r.th*Math.PI/180;
  var dx=Math.cos(rad),dy=Math.sin(rad),Ltot=Math.max(r.Lbs+r.Lbns,0.01);
  var pxPorM=Math.min(400,150/Math.max(Ltot*dy,0.01),150/Math.max(Ltot*dx,0.01));
  var Lbs=r.Lbs*pxPorM, Lbns=r.Lbns*pxPorM;
  var xAgua=xBed+dx*Lbs, yAgua=yBed-dy*Lbs;
  var xTop=xAgua+dx*Lbns, yTop=yAgua-dy*Lbns;
  var xFondo=xBed+270, xDim=xBed+292;
  var arcoR=42, halo=' stroke="#FFFFFF" stroke-width="3" paint-order="stroke"';
  var hAgua=yBed-yAgua;

  function flecha(x,y,ddx,ddy,c){
    var nx=-ddy,ny=ddx;
    return '<polygon points="'+q(x)+','+q(y)+' '+q(x-ddx*7+nx*3)+','+q(y-ddy*7+ny*3)+' '+q(x-ddx*7-nx*3)+','+q(y-ddy*7-ny*3)+'" fill="'+c+'"/>';
  }
  function onda(xa,xb,y,amp,lam){
    var d='M'+q(xa)+' '+q(y),x=xa,s=1;
    while(x<xb-0.01){
      var xe=Math.min(x+lam/2,xb);
      d+=' Q'+q(x+(xe-x)/2)+' '+q(y-s*amp*2)+' '+q(xe)+' '+q(y);
      x=xe;s=-s;
    }
    return d;
  }
  function flujo(y,xa,xb){
    return '<line x1="'+q(xa)+'" y1="'+q(y)+'" x2="'+q(xb-6)+'" y2="'+q(y)+'" stroke="'+AZUL+'" stroke-width="1.8" opacity=".55"/>'+
      '<g opacity=".55">'+flecha(xb,y,1,0,AZUL)+'</g>';
  }

  var s='<svg viewBox="0 0 '+W+' '+Hh+'" width="100%" style="max-width:440px" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,Segoe UI,Arial,sans-serif">'+
   '<defs>'+
     '<linearGradient id="rjAguaL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E0F2FE"/><stop offset="1" stop-color="#93C5FD"/></linearGradient>'+
     '<pattern id="rjSuelo" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="#D6B48F"/><line x1="0" y1="0" x2="0" y2="8" stroke="#8B5E3C" stroke-width="2"/></pattern>'+
   '</defs>'+
   '<text x="'+(W/2)+'" y="22" font-size="13" font-weight="700" text-anchor="middle" fill="'+VERDE+'">CORTE TRANSVERSAL</text>'+
   // agua y suelo
   '<rect x="'+xIni+'" y="'+q(yAgua)+'" width="'+(xFondo-xIni)+'" height="'+q(hAgua)+'" fill="url(#rjAguaL)"/>'+
   '<rect x="'+xIni+'" y="'+yBed+'" width="'+(xFondo-xIni)+'" height="16" fill="url(#rjSuelo)"/>'+
   '<line x1="'+xIni+'" y1="'+yBed+'" x2="'+xFondo+'" y2="'+yBed+'" stroke="#8B5E3C" stroke-width="3"/>'+
   // flechas de flujo (solo si hay profundidad suficiente)
   (hAgua>70?flujo(yAgua+hAgua*0.35,xIni+10,xBed-32)+flujo(yAgua+hAgua*0.72,xIni+10,xBed-32)+
     flujo(yAgua+hAgua*0.35,xAgua+28,xAgua+86):'')+
   // superficie del agua y línea de nivel
   '<path d="'+onda(xIni,xFondo,yAgua,1.6,14)+'" fill="none" stroke="'+AZUL+'" stroke-width="1.8"/>'+
   '<line x1="'+xFondo+'" y1="'+q(yAgua)+'" x2="'+(xDim+6)+'" y2="'+q(yAgua)+'" stroke="'+AGUA+'" stroke-width="1.4" stroke-dasharray="5 3"/>'+
   '<line x1="'+xFondo+'" y1="'+yBed+'" x2="'+(xDim+6)+'" y2="'+yBed+'" stroke="#CBD5E1" stroke-width="1"/>'+
   '<text x="'+(xIni+4)+'" y="'+q(yAgua-7)+'" font-size="10.5" fill="'+AZUL+'">Nivel de agua</text>'+
   // sector del ángulo
   '<path d="M '+xBed+' '+yBed+' L '+(xBed+arcoR)+' '+yBed+' A '+arcoR+' '+arcoR+' 0 0 0 '+q(xBed+arcoR*dx)+' '+q(yBed-arcoR*dy)+' Z" fill="'+VERDE+'" opacity=".12"/>'+
   // barrote: contorno oscuro + cuerpo claro
   '<line x1="'+xBed+'" y1="'+yBed+'" x2="'+q(xAgua)+'" y2="'+q(yAgua)+'" stroke="#1E3A8A" stroke-width="9" stroke-linecap="round"/>'+
   (r.Lbns>0.005?'<line x1="'+q(xAgua)+'" y1="'+q(yAgua)+'" x2="'+q(xTop)+'" y2="'+q(yTop)+'" stroke="#9A3412" stroke-width="9" stroke-linecap="round"/>':'')+
   '<line x1="'+xBed+'" y1="'+yBed+'" x2="'+q(xAgua)+'" y2="'+q(yAgua)+'" stroke="'+AZUL+'" stroke-width="5.5" stroke-linecap="round"/>'+
   (r.Lbns>0.005?'<line x1="'+q(xAgua)+'" y1="'+q(yAgua)+'" x2="'+q(xTop)+'" y2="'+q(yTop)+'" stroke="'+NARANJA+'" stroke-width="5.5" stroke-linecap="round"/>':'')+
   '<circle cx="'+xBed+'" cy="'+yBed+'" r="3" fill="#DBEAFE"/>'+
   // arco y valor de θ
   '<path d="M '+(xBed+arcoR)+' '+yBed+' A '+arcoR+' '+arcoR+' 0 0 0 '+q(xBed+arcoR*dx)+' '+q(yBed-arcoR*dy)+'" fill="none" stroke="'+VERDE+'" stroke-width="1.6"/>'+
   '<text x="'+(xBed+arcoR+8)+'" y="'+(yBed-9)+'" font-size="12" font-weight="700" fill="'+VERDE+'">θ = '+f(r.th,0)+'°</text>'+
   // longitudes
   '<text x="'+q((xBed+xAgua)/2-14)+'" y="'+q((yBed+yAgua)/2+4)+'" text-anchor="end" font-size="11" font-weight="600" fill="'+AZUL+'"'+halo+'>L sumerg. = '+f(r.Lbs,2)+' m</text>'+
   (r.Lbns>0.005?'<text x="'+q((xAgua+xTop)/2+14)+'" y="'+q((yAgua+yTop)/2+4)+'" font-size="11" font-weight="600" fill="'+NARANJA+'"'+halo+'>L no sumerg. = '+f(r.Lbns,2)+' m</text>':'')+
   // cota Hrh
   '<line x1="'+xDim+'" y1="'+q(yAgua)+'" x2="'+xDim+'" y2="'+yBed+'" stroke="'+GRIS+'" stroke-width="1.4"/>'+
   '<line x1="'+(xDim-4)+'" y1="'+q(yAgua)+'" x2="'+(xDim+4)+'" y2="'+q(yAgua)+'" stroke="'+GRIS+'" stroke-width="1.2"/>'+
   '<line x1="'+(xDim-4)+'" y1="'+yBed+'" x2="'+(xDim+4)+'" y2="'+yBed+'" stroke="'+GRIS+'" stroke-width="1.2"/>'+
   flecha(xDim,yAgua,0,-1,GRIS)+flecha(xDim,yBed,0,1,GRIS)+
   '<text x="'+(xDim+16)+'" y="'+q((yBed+yAgua)/2)+'" font-size="11" font-weight="700" fill="'+GRIS+'" transform="rotate(-90 '+(xDim+16)+' '+q((yBed+yAgua)/2)+')" text-anchor="middle">Hrh = '+f(r.H,2)+' m</text>'+
  '</svg>';
  return s;
}

// Las dos vistas apiladas (una debajo de la otra), cada una en su tarjeta.
// Uso: en vez de poner svgRejillaFrontal(r) y svgRejillaLateral(r) por separado,
// inserta svgRejillaEsquemas(r) en el contenedor de "Esquemas".
function svgRejillaEsquemas(r){
  var tarjeta='background:#fff;border:1px solid #E2E8F0;border-radius:14px;padding:12px 16px;text-align:center;';
  return '<div style="display:flex;flex-direction:column;gap:16px;width:100%;grid-column:1/-1">'+
    '<div style="'+tarjeta+'">'+svgRejillaFrontal(r)+'</div>'+
    '<div style="'+tarjeta+'">'+svgRejillaLateral(r)+'</div>'+
  '</div>';
}