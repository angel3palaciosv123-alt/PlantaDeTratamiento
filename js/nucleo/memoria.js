/* Configuración genérica de la memoria de cálculo. Los módulos agregan sus entradas con
   registrarMemoria({ins:[nombres de filas que son datos de entrada], sim:{nombre:"símbolo"}}). */
var MEMORIA_CFG={ins:[],sim:{}};
function registrarMemoria(cfg){
  (cfg.ins||[]).forEach(function(n){if(MEMORIA_CFG.ins.indexOf(n)<0)MEMORIA_CFG.ins.push(n);});
  Object.keys(cfg.sim||{}).forEach(function(k){MEMORIA_CFG.sim[k]=cfg.sim[k];});}

/* fila de resultado con memoria de cálculo desplegable */
function fila(nombre,valor,unidad,dec,formula,reemplazo,origen,alerta,tipo){
  var id="mm"+(MEMO++),nm=String(nombre),fm=String(formula==null?"":formula),rp=String(reemplazo==null?"":reemplazo);
  var INS=MEMORIA_CFG.ins, SIM=MEMORIA_CFG.sim;
  var ins=tipo==="ins"||INS.indexOf(nm)>=0||/dato (de entrada|insertado)/i.test(fm)||/^dato insertado/i.test(String(origen||""));
  var v=typeof valor==="number"?nf(valor,dec):esc(valor), u=unidad?" "+unidad:"";
  var mm=nm.match(/\(([^()]*)\)\s*$/);
  var lhs=fm.match(/^\s*((?:[^=<]|<sub>[^<]*<\/sub>|<sup>[^<]*<\/sup>){1,40}?)\s=\s/);
  var tieneEq=!!lhs&&lhs[1].replace(/<[^>]*>/g,"").length<=14;
  var sim=mm?mm[1]:SIM[nm]?SIM[nm]:tieneEq?lhs[1]:nm.split(" (")[0];
  if(tieneEq&&rp&&rp.indexOf("=")<0) rp=lhs[1]+" = "+rp.replace(/^→\s*/,"");
  var okTxt=function(t){return t&&String(t).trim()&&String(t).trim()!=="—";};
  var h='<tr class="'+(tipo==="final"?"final":"fila")+(ins?" ins":"")+'" onclick="toggleMemo(\''+id+'\')"><td class="cr">▸</td><td>'+nm+'</td><td class="val">'+v+'</td><td class="uni">'+(unidad||"")+'</td></tr>';
  h+='<tr class="memo'+(ins?" ins":"")+'" id="'+id+'"><td colspan="4">'+
     (!ins&&okTxt(fm)?'<div class="fx">'+fm+'</div>':'')+(!ins&&okTxt(rp)?'<div class="fx num">'+rp+'</div>':'')+
     '<div class="fx fin">'+sim+' = '+v+u+'</div></td></tr>';
  return h;}

function filaDato(nombre,valor,unidad,dec,origen){
  return fila(nombre,valor,unidad,dec,'<i>Dato de entrada</i>','—',origen||'Valor insertado por el diseñador.');}

function seccion(t){return '<tr class="seccion"><td colspan="4">'+t+'</td></tr>';}

function toggleMemo(id){var e=gid(id);if(e)e.classList.toggle("open");}

function abrirTodo(cont,ab){var t=gid(cont).querySelectorAll(".memo");for(var i=0;i<t.length;i++){t[i].classList.toggle("open",ab);}}



