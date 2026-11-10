/* ==========================================================
   NÚCLEO — login_decor.js
   Decoración animada del login (hojas, viento) y botón ver/ocultar contraseña.
   ========================================================== */
(function(){
  var NS="http://www.w3.org/2000/svg",$=function(i){return document.getElementById(i)},R=function(a,b){return a+Math.random()*(b-a)};
  var red=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches,vis=document.querySelector(".lg-visual"),an=[];
  var HOJA='<path d="M3 29C3 14 13 4 30 2c0 17-8 27-23 27z" fill="COLOR"/><path d="M3 29C10 18 17 11 24 7" fill="none" stroke="rgba(255,255,255,.6)" stroke-width="1.6" stroke-linecap="round"/>';
  var RIZO='<path d="M2 22H170C188 22 192 4 178 4C168 4 165 15 173 18" fill="none" stroke="COLOR" stroke-width="3" stroke-linecap="round"/>';
  var CH=["#4ade80","#22c55e","#16a34a","#86efac"],CV=["#86efac","#4ade80","#7dd3fc"];
  var IC=['<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>','<path d="M12 21v-9M12 12c0-4 3-6 7-6 0 4-3 6-7 6zM12 14c0-3-2-5-6-5 0 3 2 5 6 5z"/>','<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/>','<path d="M3 8c3-3 6 3 9 0s6 3 9 0M3 14c3-3 6 3 9 0s6 3 9 0M3 20c3-3 6 3 9 0s6 3 9 0"/>','<path d="M5 6h14v13H5zM5 12c3-2 5 2 7 0s4 2 7 0"/>','<path d="M5 19C5 10 10 5 20 4c0 10-4 15-13 15zM5 19c3-5 6-8 10-10"/>'];
  function decorar(){
    an.forEach(function(a){a.cancel()});an=[];["lg-hojas","lg-viento","lg-burb"].forEach(function(i){$(i).innerHTML=""});
    var H=vis.clientHeight||700,W=vis.clientWidth||800,i,s;
    for(i=0;i<13;i++){
      var t=R(18,34),dx=R(-60,60),rot=R(180,520)*(Math.random()<.5?-1:1);
      s=document.createElementNS(NS,"svg");s.setAttribute("class","lg-hoja");s.setAttribute("viewBox","0 0 32 32");
      s.style.cssText="width:"+t+"px;height:"+t+"px;left:"+R(2,92)+"%;opacity:"+R(.55,.95);s.innerHTML=HOJA.replace("COLOR",CH[i%4]);$("lg-hojas").appendChild(s);
      if(red){s.style.top=R(5,70)+"%";continue}
      an.push(s.animate([{transform:"translate(0,0) rotate(0)"},{transform:"translate("+dx*.6+"px,"+H*.35+"px) rotate("+rot*.4+"deg)",offset:.35},{transform:"translate("+(-dx*.5)+"px,"+H*.7+"px) rotate("+rot*.75+"deg)",offset:.7},{transform:"translate("+dx+"px,"+(H+90)+"px) rotate("+rot+"deg)"}],{duration:R(11000,19000),delay:-R(0,17000),iterations:Infinity,easing:"ease-in-out"}));
    }
    [[18,.55,0,5200],[36,.42,1800,6600],[56,.5,3100,5900]].forEach(function(c,k){
      s=document.createElementNS(NS,"svg");s.setAttribute("class","lg-viento");s.setAttribute("viewBox","0 0 200 26");
      s.style.cssText="top:"+c[0]+"%;width:190px;height:25px";s.innerHTML=RIZO.replace("COLOR",CV[k]);$("lg-viento").appendChild(s);
      if(red){s.style.opacity=.4;s.style.left=(10+c[0])+"%";return}
      an.push(s.animate([{transform:"translateX(0)",opacity:0},{opacity:c[1],offset:.2},{opacity:c[1],offset:.8},{transform:"translateX("+(W+300)+"px)",opacity:0}],{duration:c[3]+2000,delay:c[2]-4000,iterations:Infinity,easing:"linear"}));
    });
  }
  decorar();
  var rz;window.addEventListener("resize",function(){clearTimeout(rz);rz=setTimeout(decorar,250)});
  $("lg-ojo").onclick=function(){var p=$("lg-p");p.type=p.type==="password"?"text":"password"};
})();
