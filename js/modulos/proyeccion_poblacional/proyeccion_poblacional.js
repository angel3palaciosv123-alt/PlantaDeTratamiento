// Módulo de proyección poblacional. Dependencias: window.DANE_DATA (dane_datos.js), PRO.datos generales y utilidades del núcleo.
/* ============================================================
   MODULO - PROYECCIÓN POBLACIONAL
   ============================================================ */
const DANE = window.DANE_DATA;

function normalizarTexto(texto){
  if(texto===null || texto===undefined) return "";
  let t = String(texto).trim().toLowerCase();
  t = t.normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  t = t.split(/\s+/).join(" ").trim();
  return t;}

function obtenerDepartamentos(){
  return DANE.deps.slice().sort((a,b)=>a.localeCompare(b,'es'));}

function obtenerMunicipios(departamento){
  const depNorm = normalizarTexto(departamento);
  const depIndex = DANE.deps.findIndex(d=>normalizarTexto(d)===depNorm);
  if(depIndex<0) return [];
  return DANE.muns.filter(m=>m.d===depIndex).map(m=>m.n).sort((a,b)=>a.localeCompare(b,'es'));}

function obtenerAnios(){
  return DANE.anios.slice();}

function obtenerPoblacion(departamento, municipio, anios, area){
  const depNorm = normalizarTexto(departamento);
  const depIndex = DANE.deps.findIndex(d=>normalizarTexto(d)===depNorm);
  if(depIndex<0){
    throw new Error("No se encontró el departamento seleccionado.");}
  const munNorm = normalizarTexto(municipio);
  const muniObj = DANE.muns.find(m=>m.d===depIndex && normalizarTexto(m.n)===munNorm);
  if(!muniObj){
    throw new Error("No se encontró el municipio seleccionado.");}
  const areaNorm = normalizarTexto(area);
  let areaIndex;
  if(areaNorm==="total" || areaNorm==="poblacion total"){
    areaIndex = 0;} 
    else if(areaNorm==="cabecera municipal"){
    areaIndex = 1;} 
    else if(areaNorm==="centros poblados y rural disperso" || areaNorm==="centros poblados rural disperso"){
    areaIndex = 2;} 
    else {
    throw new Error("Área geográfica no reconocida: '"+area+"'");}
  const code = String(muniObj.c);
  const registro = (DANE.data[code] && DANE.data[code][String(areaIndex)]) || {};

  const aniosInt = anios.map(a=>parseInt(a,10));
  let resultado = [];
  for(const anio of aniosInt){
    const pob = registro[String(anio)];
    if(pob!==undefined && pob!==null){
      resultado.push({Año:anio, Poblacion:Number(pob)});}
  }
  resultado.sort((a,b)=>a.Año-b.Año);
  return resultado;}

/* ============================================================
   REDONDEO
   ============================================================ */
function pythonRound(value, decimales){
  decimales = decimales||0;
  const factor = Math.pow(10, decimales);
  const x = value*factor;
  let floor = Math.floor(x);
  const diff = x-floor;
  const eps = 1e-9;
  let rounded;
  if(Math.abs(diff-0.5)<eps){
    rounded = (floor%2===0)?floor:floor+1;
  } else {
    rounded = Math.round(x);
  }
  return rounded/factor;}

/* ============================================================
   CALCULOS 
   ============================================================ */
function calcularLineal(anios, poblaciones, aniosProyeccion){
  const x = anios.map(Number), y = poblaciones.map(Number);
  if(x.length<2) throw new Error("Se necesitan mínimo 2 años históricos.");
  if(x.length!==y.length) throw new Error("La cantidad de años y poblaciones debe coincidir.");

  const pendientes=[];
  for(let i=0;i<x.length-1;i++){
    const diferenciaAnios = x[i+1]-x[i];
    if(diferenciaAnios<=0) continue;
    let m = (y[i+1]-y[i])/diferenciaAnios;
    m = pythonRound(m,0);
    pendientes.push(m);
  }
  if(pendientes.length===0) throw new Error("No fue posible calcular la tasa lineal.");

  let mPromedio = pendientes.reduce((a,b)=>a+b,0)/pendientes.length;
  mPromedio = pythonRound(mPromedio,0);

  const anioBase=x[x.length-1], poblacionBase=y[y.length-1];

  const proyecciones = aniosProyeccion.map(anio=>{
    let valor = poblacionBase + mPromedio*(anio-anioBase);
    return pythonRound(valor,0);
  });

  return {proyecciones, mPromedio, pendientes};
}

function calcularGeometrico(anios, poblaciones, aniosProyeccion){
  const x = anios.map(Number), y = poblaciones.map(Number);
  if(x.length<2) throw new Error("Se necesitan mínimo 2 años históricos.");
  if(x.length!==y.length) throw new Error("La cantidad de años y poblaciones debe coincidir.");

  const tasas=[];
  for(let i=0;i<x.length-1;i++){
    if(y[i]<=0 || y[i+1]<=0) continue;
    const diferenciaAnios = x[i+1]-x[i];
    if(diferenciaAnios<=0) continue;
    let tasa = Math.pow(y[i+1]/y[i], 1/diferenciaAnios) - 1;
    tasa = pythonRound(tasa,3);
    tasas.push(tasa);
  }
  if(tasas.length===0) throw new Error("No fue posible calcular la tasa geométrica.");

  let tasaPromedio = tasas.reduce((a,b)=>a+b,0)/tasas.length;
  tasaPromedio = pythonRound(tasaPromedio,3);

  const anioBase=x[x.length-1], poblacionBase=y[y.length-1];

  const proyecciones = aniosProyeccion.map(anio=>{
    let valor = poblacionBase * Math.pow(1+tasaPromedio, anio-anioBase);
    return pythonRound(valor,0);
  });

  return {proyecciones, tasaPromedio, tasas};
}

function calcularExponencial(anios, poblaciones, aniosProyeccion){
  const x = anios.map(Number), y = poblaciones.map(Number);
  if(x.length<2) throw new Error("Se necesitan mínimo 2 años históricos.");
  if(x.length!==y.length) throw new Error("La cantidad de años y poblaciones debe coincidir.");
  if(y.some(v=>v<=0)) throw new Error("La población debe ser mayor que cero.");

  const tasasK=[];
  for(let i=0;i<x.length-1;i++){
    const diferenciaAnios = x[i+1]-x[i];
    if(diferenciaAnios<=0) continue;
    let k = (Math.log(y[i+1]) - Math.log(y[i])) / diferenciaAnios;
    k = pythonRound(k,3);
    tasasK.push(k);
  }
  if(tasasK.length===0) throw new Error("No fue posible calcular la tasa exponencial.");

  let kPromedio = tasasK.reduce((a,b)=>a+b,0)/tasasK.length;
  kPromedio = pythonRound(kPromedio,3);

  const anioBase=x[x.length-1], poblacionBase=y[y.length-1];

  const proyecciones = aniosProyeccion.map(anio=>{
    let valor = poblacionBase * Math.exp(kPromedio*(anio-anioBase));
    return pythonRound(valor,0);
  });

  return {proyecciones, kPromedio, tasasK};
}

function calcularTasas(anios, poblaciones){
  const x = anios.map(Number), y = poblaciones.map(Number);
  if(x.length<2) throw new Error("Se necesitan mínimo 2 años históricos.");
  if(x.length!==y.length) throw new Error("La cantidad de años y poblaciones debe coincidir.");

  const resultados=[];
  for(let i=0;i<x.length-1;i++){
    const anioI=x[i], anioF=x[i+1], pobI=y[i], pobF=y[i+1];
    const diferencia = anioF-anioI;
    if(diferencia<=0) continue;
    if(pobI<=0 || pobF<=0) continue;

    const crecimiento = pobF-pobI;
    const tasaLineal = pythonRound(crecimiento/diferencia, 0);
    let tasaGeometrica = Math.pow(pobF/pobI, 1/diferencia) - 1;
    tasaGeometrica = pythonRound(tasaGeometrica, 3);
    let tasaExponencial = (Math.log(pobF)-Math.log(pobI))/diferencia;
    tasaExponencial = pythonRound(tasaExponencial, 3);

    resultados.push({
      "Año inicial": Math.trunc(anioI),
      "Año final": Math.trunc(anioF),
      "Población inicial": pobI,
      "Población final": pobF,
      "Crecimiento": crecimiento,
      "Tasa lineal": tasaLineal,
      "Tasa geométrica": tasaGeometrica,
      "Tasa exponencial": tasaExponencial
    });
  }
  return resultados;
}

function generarProyeccion(aniosHistoricos, poblacionesHistoricas, anioFinal, anioInicialProyeccion){
  if(aniosHistoricos.length<2) throw new Error("Debe ingresar mínimo 2 años históricos.");
  if(aniosHistoricos.length!==poblacionesHistoricas.length){
    throw new Error("La cantidad de años históricos debe coincidir con la cantidad de poblaciones.");
  }

  const combinado = aniosHistoricos.map((a,i)=>[a, poblacionesHistoricas[i]]).sort((a,b)=>a[0]-b[0]);
  aniosHistoricos = combinado.map(d=>d[0]);
  poblacionesHistoricas = combinado.map(d=>d[1]);

  if(anioInicialProyeccion===null || anioInicialProyeccion===undefined){
    anioInicialProyeccion = Math.max(...aniosHistoricos) + 1;
  }
  anioInicialProyeccion = parseInt(anioInicialProyeccion,10);
  anioFinal = parseInt(anioFinal,10);

  if(anioFinal < anioInicialProyeccion){
    throw new Error("El año final del proyecto debe ser mayor o igual al año inicial del proyecto.");
  }

  const aniosProyeccion=[];
  for(let a=anioInicialProyeccion; a<=anioFinal; a++) aniosProyeccion.push(a);

  const {proyecciones:lineal, mPromedio:pendiente} = calcularLineal(aniosHistoricos, poblacionesHistoricas, aniosProyeccion);
  const {proyecciones:geometrico, tasaPromedio:tasaGeom} = calcularGeometrico(aniosHistoricos, poblacionesHistoricas, aniosProyeccion);
  const {proyecciones:exponencial, kPromedio:k} = calcularExponencial(aniosHistoricos, poblacionesHistoricas, aniosProyeccion);

  const tabla = aniosProyeccion.map((anio,i)=>({
    "Año": anio,
    "Lineal": pythonRound(lineal[i],0),
    "Geométrico": pythonRound(geometrico[i],0),
    "Exponencial": pythonRound(exponencial[i],0)
  }));

  const parametros = {
    pendiente_lineal: pendiente,
    tasa_geometrica: tasaGeom,
    k_exponencial: k
  };

  return {tabla, parametros};
}

function generarCalculos(datosHistoricos, anioFinal, anioInicioProyeccion){
  if(!datosHistoricos || datosHistoricos.length===0){
    throw new Error("No existen datos históricos.");
  }
  const datos = datosHistoricos
    .map(d=>({Año:Number(d["Año"]), Poblacion:Number(d["Poblacion"])}))
    .filter(d=>!isNaN(d.Año) && !isNaN(d.Poblacion))
    .sort((a,b)=>a.Año-b.Año);

  if(datos.length<2) throw new Error("Se necesitan mínimo 2 años históricos.");

  const aniosHistoricos = datos.map(d=>Math.trunc(d.Año));
  const poblacionesHistoricas = datos.map(d=>d.Poblacion);

  const {tabla:tablaProyeccion, parametros} = generarProyeccion(aniosHistoricos, poblacionesHistoricas, anioFinal, anioInicioProyeccion);
  const tablaTasas = calcularTasas(aniosHistoricos, poblacionesHistoricas);

  return {tablaProyeccion, tablaTasas, parametros};
}

/* ============================================================
   RESULTADOS  (equivalente a resultados.py)
   ============================================================ */
function determinarNivelComplejidad(poblacion){
  poblacion = Number(poblacion);
  if(poblacion<2500) return "Bajo";
  else if(poblacion<=12500) return "Medio";
  else if(poblacion<=60000) return "Medio Alto";
  else return "Alto";
}

const METODOS_RAS = {
  "Aritmético": {"Bajo":true, "Medio":true, "Medio Alto":false, "Alto":false},
  "Geométrico": {"Bajo":true, "Medio":true, "Medio Alto":true,  "Alto":true},
  "Wappus":     {"Bajo":true, "Medio":true, "Medio Alto":true,  "Alto":true},
  "Gráfico":    {"Bajo":true, "Medio":true, "Medio Alto":true,  "Alto":false},
  "Exponencial":{"Bajo":true, "Medio":true, "Medio Alto":true,  "Alto":false}
};

const METODOS_PROGRAMA = {"Lineal":"Aritmético", "Geométrico":"Geométrico", "Exponencial":"Exponencial"};

function metodoAplica(metodo, nivel){
  const metodoRas = METODOS_PROGRAMA[metodo] || metodo;
  if(!(metodoRas in METODOS_RAS)) return false;
  if(!(nivel in METODOS_RAS[metodoRas])) return false;
  return METODOS_RAS[metodoRas][nivel];
}

function analizarResultados(tablaProyeccion, anioFinal){
  if(!tablaProyeccion || tablaProyeccion.length===0) throw new Error("No existe una tabla de proyección.");
  const fila = tablaProyeccion.find(r=>r["Año"]===anioFinal);
  if(!fila) throw new Error("No existe información para el año "+anioFinal+".");

  const resultados=[];
  for(const metodo of ["Lineal","Geométrico","Exponencial"]){
    if(!(metodo in fila)) continue;
    const poblacion = Number(fila[metodo]);
    const nivel = determinarNivelComplejidad(poblacion);
    const aplica = metodoAplica(metodo, nivel);
    resultados.push({Metodo:metodo, Poblacion:poblacion, Nivel:nivel, Aplica: aplica?"SÍ":"NO"});
  }
  return resultados;
}

/* ============================================================
   FORMATO  (equivalente a formatear_* de Ejecutar.py)
   ============================================================ */
function formatearAnio(valor){
  const n = parseInt(valor,10);
  return isNaN(n) ? String(valor) : String(n);
}
function formatearPoblacion(valor){
  const n = Number(valor);
  if(isNaN(n)) return String(valor);
  return Math.round(n).toLocaleString('es-CO').replace(/,/g,'.');
}
function formatearTasa(valor, decimales){
  decimales = decimales===undefined?3:decimales;
  const n = Number(valor);
  return isNaN(n) ? String(valor) : n.toFixed(decimales);
}

/* ============================================================
   ESTADO GLOBAL  (equivalente a las variables globales de Ejecutar.py)
   ============================================================ */
const estado = {
  datosHistoricos: [],       // [{Año, Poblacion}]
  tablaProyeccion: [],       // [{Año, Lineal, Geométrico, Exponencial}]
  tablaTasas: [],
  parametros: {},
  fuenteDatosActual: "",
  nombrePoblacion: "",
  tasaBaseUsuario: null,
  anioBaseUsuario: null,
  poblacionBaseUsuario: null,
  anioInicioProyecto: null,
  duracionProyecto: null,
  anioFinalProyecto: null,
  departamentoProyecto: "",
  municipioProyecto: "",
  areaProyecto: "Total"
};

function limpiarProyecto(){
  estado.datosHistoricos = [];
  estado.tablaProyeccion = [];
  estado.tablaTasas = [];
  estado.parametros = {};
  estado.fuenteDatosActual = "";
  estado.nombrePoblacion = "";
  estado.tasaBaseUsuario = null;
  estado.anioBaseUsuario = null;
  estado.poblacionBaseUsuario = null;
  estado.anioInicioProyecto = null;
  estado.duracionProyecto = null;
  estado.anioFinalProyecto = null;
  estado.departamentoProyecto = "";
  estado.municipioProyecto = "";
  estado.areaProyecto = "Total";

  moduloDatos();
  mostrarModal("Datos limpiados","Los datos del proyecto fueron eliminados correctamente.\n\nPuede ingresar una nueva población y comenzar nuevamente.");
}

/* ============================================================
   HELPERS DE INTERFAZ
   ============================================================ */
function actualizarMenu(modulo){
  // 1. Buscamos el contenedor de los botones de submódulo
  const btnDatos = document.getElementById('btn-menu-datos');
  if(btnDatos){
    const menuModulos = btnDatos.parentElement; // Es el contenedor de la barra de botones
    
    // Verificamos si ya existe el encabezado arriba para no duplicarlo
    let header = document.getElementById('encabezado-proyeccion');
    if(!header){
      header = document.createElement('div');
      header.id = 'encabezado-proyeccion';
      // Le agregamos un padding a la izquierda para despegarlo del borde de la pantalla
      header.style.cssText = 'padding: 0 20px; box-sizing: border-box;'; 
      header.innerHTML = '<div class="titulo con-imp"><h1>PROYECCIÓN POBLACIONAL</h1><p>Cálculo de la proyección poblacional según el RAS.</p><div class="print-top"><button type="button" class="btn-sec" onclick="window.print()">🖨️ IMPRIMIR</button></div></div>' + CONV;
      // Inserta el título JUSTO ANTES de la barra de botones
      menuModulos.parentNode.insertBefore(header, menuModulos);
    }
  }

  // 2. Estado activo de los botones
  const botones = {
    datos: document.getElementById('btn-menu-datos'),
    calculos: document.getElementById('btn-menu-calculos'),
    graficos: document.getElementById('btn-menu-graficos'),
    resultados: document.getElementById('btn-menu-resultados')
  };
  Object.keys(botones).forEach(k=>{
    if(botones[k]) botones[k].classList.toggle('active', k===modulo);
  });
}

function contenidoEl(){ return document.getElementById('contenido'); }

function crearTitulo(titulo, descripcion){
  // Solo genera el título interno del submódulo (DATOS POBLACIONALES, CÁLCULOS, etc.)
  return '<div class="sub-head"><h2>' + titulo + '</h2><p>' + descripcion + '</p></div>';
}

function el(html){
  const div = document.createElement('div');
  div.innerHTML = html.trim();
  return div.firstElementChild;
}

/* Construye una tabla HTML respetando el formato de crear_tabla_dataframe */
function crearTablaHTML(columnas, filas, opts){
  opts = opts||{};
  let thead = '<thead><tr>'+columnas.map(c=>'<th>'+c+'</th>').join('')+'</tr></thead>';
  let tbody = '<tbody>';
  filas.forEach(fila=>{
    tbody += '<tr>';
    columnas.forEach(col=>{
      const nombre = col.toLowerCase();
      let valor = fila[col];
      let texto;
      if(nombre.includes('año') || nombre.includes('anio')){
        texto = formatearAnio(valor);
      } else if(nombre.includes('poblacion') || nombre.includes('población') ||
                 ['lineal','geométrico','geometrico','exponencial'].includes(nombre)){
        texto = formatearPoblacion(valor);
      } else {
        const vf = Number(valor);
        if(!isNaN(vf)){
          if(nombre.includes('lineal')) texto = vf.toFixed(0);
          else if(nombre.includes('geom') || nombre.includes('geometr')) texto = vf.toFixed(4);
          else if(nombre.includes('expon')) texto = vf.toFixed(4);
          else texto = vf.toFixed(3);
        } else {
          texto = String(valor);
        }
      }
      tbody += '<td>'+texto+'</td>';
    });
    tbody += '</tr>';
  });
  tbody += '</tbody>';
  const wrapClass = opts.scroll ? 'table-scroll' : '';
  const tableHtml = '<table class="datatable">'+thead+tbody+'</table>';
  return wrapClass ? '<div class="'+wrapClass+'">'+tableHtml+'</div>' : tableHtml;
}

/* ============================================================
   MÓDULO 1: DATOS POBLACIONALES  (menú principal)
   ============================================================ */
function moduloDatos(){
  actualizarMenu('datos');
  let html = crearTitulo('DATOS POBLACIONALES','Seleccione la fuente de información para iniciar el proyecto.');

  html += '<div class="opciones-datos">'+
    '<button class="opcion-btn" onclick="ventanaDane()"><span class="emoji">'+ico('dane')+'</span>CENSO DANE<small>Proyecciones oficiales por municipio</small></button>'+
    '<button class="opcion-btn" onclick="ventanaManual()"><span class="emoji">'+ico('manual')+'</span>CENSO MANUAL<small>Ingresa tus propios censos</small></button>'+
    '<button class="opcion-btn" onclick="ventanaTasa()"><span class="emoji">'+ico('tasa')+'</span>TASA DE CRECIMIENTO<small>Año base y tasa anual</small></button>'+
    '</div>';

  if(estado.fuenteDatosActual !== ""){
    let texto = "Fuente de datos actual: "+estado.fuenteDatosActual;
    if(estado.nombrePoblacion !== "") texto += "\nPoblación: "+estado.nombrePoblacion;
    html += '<div class="info-fuente"><div class="txt">'+texto.replace(/\n/g,'<br>')+'</div>'+
      '<button class="btn btn-danger" onclick="limpiarProyecto()">LIMPIAR Y SALIR</button></div>';
  }

  contenidoEl().innerHTML = html;
}

/* ============================================================
   1.1 VENTANA CENSO DANE
   ============================================================ */
function ventanaDane(){
  actualizarMenu('datos');

  const departamentos = obtenerDepartamentos();
  const depGuardado = estado.departamentoProyecto || "";
  const munGuardado = estado.municipioProyecto || "";
  const areaGuardada = estado.areaProyecto || "Total";
  const inicioGuardado = estado.anioInicioProyecto;
  const duracionGuardada = estado.duracionProyecto;

  let html = crearTitulo('Censo Poblacional DANE','Seleccione el municipio, defina el tiempo del proyecto y elija los años históricos del DANE para su proyección.');

  html += '<div class="card">'+
    '<div class="card-title">Ubicación del proyecto</div>'+
    '<div class="field-block">'+
      '<label>Departamento</label>'+
      '<input list="lista-departamentos" class="big-input" id="in-departamento" value="'+depGuardado+'" placeholder="Escriba o seleccione un departamento">'+
      '<datalist id="lista-departamentos">'+departamentos.map(d=>'<option value="'+d+'">').join('')+'</datalist>'+
      '<label>Municipio</label>'+
      '<input list="lista-municipios" class="big-input" id="in-municipio" value="'+munGuardado+'" placeholder="Escriba o seleccione un municipio">'+
      '<datalist id="lista-municipios"></datalist>'+
      '<label>Tipo de población</label>'+
      '<select class="big-select" id="in-area">'+
        ['Total','Cabecera Municipal','Centros Poblados y Rural Disperso'].map(a=>'<option value="'+a+'" '+(a===areaGuardada?'selected':'')+'>'+a+'</option>').join('')+
      '</select>'+
    '</div>'+
  '</div>';

  html += '<div class="card">'+
    '<div class="card-title">Tiempo del proyecto</div>'+
    '<div class="row">'+
      '<div class="campo"><label>Año de inicio del proyecto</label><input type="number" id="in-actual" value="'+(inicioGuardado!==null&&inicioGuardado!==undefined?inicioGuardado:'')+'"></div>'+
      '<div class="campo"><label>Duración del proyecto</label><input type="number" id="in-duracion" value="'+(duracionGuardada!==null&&duracionGuardada!==undefined?duracionGuardada:'25')+'"></div>'+
      '<div class="campo"><label>Año final del proyecto</label><input type="text" id="in-final" readonly></div>'+
    '</div>'+
  '</div>';

  html += '<div class="card">'+
    '<div class="card-title">Años históricos del DANE</div>'+
    '<div class="card-sub">Marque los años históricos que desea utilizar para la proyección. (Mínimo 2 años)</div>'+
    '<div class="anios-box" id="anios-box"></div>'+
  '</div>';

  html += '<button class="btn btn-primary" onclick="cargarDane()">CARGAR DATOS</button>';

  contenidoEl().innerHTML = html;

  const inDep = document.getElementById('in-departamento');
  const inMun = document.getElementById('in-municipio');
  const inActual = document.getElementById('in-actual');
  const inDuracion = document.getElementById('in-duracion');
  const inFinal = document.getElementById('in-final');
  const aniosBox = document.getElementById('anios-box');

  function refrescarMunicipios(){
    const municipios = obtenerMunicipios(inDep.value.trim());
    document.getElementById('lista-municipios').innerHTML = municipios.map(m=>'<option value="'+m+'">').join('');
  }
  if(depGuardado) refrescarMunicipios();
  inDep.addEventListener('input', refrescarMunicipios);

  function actualizarListaAnios(anioActual){
    aniosBox.innerHTML = '';
    anioActual = parseInt(anioActual,10);
    if(isNaN(anioActual)) return;

    const aniosGuardados = new Set(estado.datosHistoricos.map(d=>Math.trunc(Number(d.Año))));

    obtenerAnios().forEach(anio=>{
      const anioInt = parseInt(anio,10);
      if(anioInt >= anioActual) return;
      const checked = aniosGuardados.has(anioInt);
      const label = document.createElement('label');
      label.innerHTML = '<input type="checkbox" value="'+anioInt+'" '+(checked?'checked':'')+'> '+anioInt;
      aniosBox.appendChild(label);
    });
  }

  function actualizarAnioFinal(){
    const actual = parseInt(inActual.value,10);
    const duracion = parseInt(inDuracion.value,10);
    if(isNaN(actual) || isNaN(duracion)){ inFinal.value=''; return; }
    const final = actual+duracion;
    inFinal.value = final;
    actualizarListaAnios(actual);
  }

  inActual.addEventListener('input', actualizarAnioFinal);
  inDuracion.addEventListener('input', actualizarAnioFinal);
  actualizarAnioFinal();

  window.__cargarDaneCtx = {inDep,inMun,inActual,inDuracion,inFinal,aniosBox};
}

function cargarDane(){
  const ctx = window.__cargarDaneCtx;
  const departamento = ctx.inDep.value.trim();
  const municipio = ctx.inMun.value.trim();
  const area = document.getElementById('in-area').value.trim();

  if(!departamento){ mostrarError('Ubicación','Seleccione un departamento.'); return; }
  if(!municipio){ mostrarError('Ubicación','Seleccione un municipio.'); return; }
  if(!area){ mostrarError('Tipo de población','Seleccione el tipo de población.'); return; }

  const actual = parseInt(ctx.inActual.value,10);
  const duracion = parseInt(ctx.inDuracion.value,10);
  if(isNaN(actual) || isNaN(duracion)){ mostrarError('Error','Año de inicio y duración deben ser números.'); return; }
  if(duracion<1){ mostrarError('Duración','La duración debe ser mayor que cero.'); return; }

  const anioFinal = actual+duracion;

  const anios = Array.from(ctx.aniosBox.querySelectorAll('input[type=checkbox]:checked')).map(c=>parseInt(c.value,10));
  if(anios.length<2){ mostrarError('Años históricos','Seleccione al menos dos años históricos.'); return; }

  let datosHistoricos;
  try{
    datosHistoricos = obtenerPoblacion(departamento, municipio, anios, area);
  }catch(err){
    mostrarError('Error', err.message);
    return;
  }

  if(datosHistoricos.length===0){
    mostrarError('Sin información','No se encontraron datos para la selección.');
    return;
  }

  datosHistoricos.sort((a,b)=>a.Año-b.Año);

  estado.datosHistoricos = datosHistoricos;
  estado.fuenteDatosActual = "Censo poblacional DANE — "+municipio+", "+departamento+" — "+area;
  estado.nombrePoblacion = municipio;
  estado.departamentoProyecto = departamento;
  estado.municipioProyecto = municipio;
  estado.areaProyecto = area;
  estado.tasaBaseUsuario = null;
  estado.anioInicioProyecto = actual;
  estado.duracionProyecto = duracion;
  estado.anioFinalProyecto = anioFinal;

  try{
    const {tablaProyeccion, tablaTasas, parametros} = generarCalculos(estado.datosHistoricos, anioFinal, actual);
    estado.tablaProyeccion = tablaProyeccion;
    estado.tablaTasas = tablaTasas;
    estado.parametros = parametros;
  }catch(err){
    mostrarError('Error de cálculo', err.message);
    return;
  }

  mostrarModal('Datos guardados',
    'Los datos de '+municipio+' fueron cargados correctamente.\n\n'+
    'Tipo de población: '+area+'\n'+
    'Año de inicio: '+actual+'\n'+
    'Duración: '+duracion+' años\n'+
    'Año final: '+anioFinal+'\n'+
    'Se seleccionaron '+anios.length+' años históricos.\n\n'+
    'La proyección fue generada hasta el año '+anioFinal+'.'
  );
}

/* ============================================================
   1.2 VENTANA CENSO MANUAL
   ============================================================ */
function ventanaManual(){
  actualizarMenu('datos');

  let html = crearTitulo('Censo Poblacional MANUAL','Ingrese la identificación, tiempo del proyecto y datos históricos.');

  html += '<div class="card">'+
    '<div class="card-title">Ubicación del proyecto</div>'+
    '<div class="card-sub">Nombre de la población o municipio.</div>'+
    '<div class="field-block"><input class="big-input" id="man-nombre" placeholder="Ejemplo: Santa Marta" value="'+(estado.nombrePoblacion||'')+'"></div>'+
  '</div>';

  html += '<div class="card">'+
    '<div class="card-title">Tiempo del proyecto</div>'+
    '<div class="row">'+
      '<div class="campo"><label>Año de inicio del proyecto</label><input type="number" id="man-inicio" value="'+(estado.anioInicioProyecto!==null&&estado.anioInicioProyecto!==undefined?estado.anioInicioProyecto:'')+'"></div>'+
      '<div class="campo"><label>Duración del proyecto (Años)</label><input type="number" id="man-duracion" value="'+(estado.duracionProyecto!==null&&estado.duracionProyecto!==undefined?estado.duracionProyecto:'25')+'"></div>'+
      '<div class="campo"><label>Año final del proyecto</label><input type="text" id="man-final" readonly></div>'+
    '</div>'+
  '</div>';

  html += '<div class="card">'+
    '<div class="card-title">Datos históricos / Censo Poblacional</div>'+
    '<div class="card-sub">Ingrese cinco registros de censos históricos de población.</div>'+
    '<table class="manual-table"><thead><tr><th>Año</th><th>Población (Hab)</th></tr></thead><tbody>';

  for(let i=0;i<5;i++){
    const guardado = estado.datosHistoricos[i];
    const anioVal = guardado ? Math.trunc(Number(guardado.Año)) : '';
    const popVal = guardado ? Math.trunc(Number(guardado.Poblacion)) : '';
    html += '<tr><td><input type="number" class="man-anio" placeholder="Año" value="'+anioVal+'"></td>'+
            '<td><input type="number" class="man-pob" placeholder="Habitantes" value="'+popVal+'"></td></tr>';
  }
  html += '</tbody></table></div>';

  html += '<button class="btn btn-primary" onclick="cargarManual()">CARGAR DATOS</button>';

  contenidoEl().innerHTML = html;

  const inInicio = document.getElementById('man-inicio');
  const inDuracion = document.getElementById('man-duracion');
  const inFinal = document.getElementById('man-final');

  function actualizarFinal(){
    const inicio = parseInt(inInicio.value,10);
    const duracion = parseInt(inDuracion.value,10);
    if(isNaN(inicio) || isNaN(duracion) || duracion<1){ inFinal.value=''; return; }
    inFinal.value = inicio+duracion;
  }
  inInicio.addEventListener('input', actualizarFinal);
  inDuracion.addEventListener('input', actualizarFinal);
  actualizarFinal();
}

function cargarManual(){
  const nombre = document.getElementById('man-nombre').value.trim();
  if(!nombre){ mostrarError('Identificación','Ingrese el nombre de la población.'); return; }

  const filasAnio = Array.from(document.querySelectorAll('.man-anio'));
  const filasPob = Array.from(document.querySelectorAll('.man-pob'));

  const resultados = [];
  for(let i=0;i<5;i++){
    const anioTexto = filasAnio[i].value.trim();
    const pobTexto = filasPob[i].value.trim();
    if(!anioTexto || !pobTexto){
      mostrarError('Datos históricos','Ingrese correctamente los 5 años y las 5 poblaciones.');
      return;
    }
    const anio = parseInt(anioTexto,10);
    const poblacion = parseFloat(pobTexto);
    if(isNaN(anio) || isNaN(poblacion) || anio<=0 || poblacion<=0){
      mostrarError('Datos históricos','Ingrese correctamente los 5 años y las 5 poblaciones.');
      return;
    }
    resultados.push({Año:anio, Poblacion:poblacion});
  }

  const aniosVistos = new Set();
  for(const r of resultados){
    if(aniosVistos.has(r.Año)){
      mostrarError('Años históricos','No puede ingresar años históricos repetidos.');
      return;
    }
    aniosVistos.add(r.Año);
  }

  resultados.sort((a,b)=>a.Año-b.Año);
  const ultimoAnioHistorico = resultados[resultados.length-1].Año;

  const anioInicio = parseInt(document.getElementById('man-inicio').value,10);
  const duracion = parseInt(document.getElementById('man-duracion').value,10);

  if(isNaN(anioInicio) || isNaN(duracion)){
    mostrarError('Tiempo del proyecto','Ingrese un año de inicio y una duración válidos.');
    return;
  }
  if(duracion<1){ mostrarError('Duración','La duración debe ser mayor que cero.'); return; }
  if(anioInicio<=ultimoAnioHistorico){
    mostrarError('Año de inicio','El año de inicio debe ser posterior al último año histórico ('+ultimoAnioHistorico+').');
    return;
  }

  const anioFinal = anioInicio+duracion;

  estado.datosHistoricos = resultados;
  estado.nombrePoblacion = nombre;
  estado.fuenteDatosActual = "Datos manuales";
  estado.tasaBaseUsuario = null;
  estado.anioInicioProyecto = anioInicio;
  estado.duracionProyecto = duracion;
  estado.anioFinalProyecto = anioFinal;

  try{
    const {tablaProyeccion, tablaTasas, parametros} = generarCalculos(estado.datosHistoricos, anioFinal, anioInicio);
    estado.tablaProyeccion = tablaProyeccion;
    estado.tablaTasas = tablaTasas;
    estado.parametros = parametros;
  }catch(err){
    mostrarError('Error de cálculo', err.message);
    return;
  }

  mostrarModal('Datos guardados',
    'Los datos de '+nombre+' fueron cargados correctamente.\n\n'+
    'Último año histórico: '+ultimoAnioHistorico+'\n'+
    'Año de inicio: '+anioInicio+'\n'+
    'Duración: '+duracion+' años\n'+
    'Año final: '+anioFinal+'\n\n'+
    'La proyección fue generada correctamente.'
  );
}

/* ============================================================
   1.3 VENTANA AÑO BASE + TASA DE CRECIMIENTO
   ============================================================ */
function ventanaTasa(){
  actualizarMenu('datos');

  let html = crearTitulo('Año base + Tasa de crecimiento','Genere una proyección utilizando una población base y una tasa de crecimiento.');

  html += '<div class="card">'+
    '<div class="card-title">Identificación de la población</div>'+
    '<div class="card-sub">Ingrese el nombre de la población que desea proyectar.</div>'+
    '<div class="field-block"><input class="big-input" id="tasa-nombre" placeholder="Ejemplo: Santa Marta"></div>'+
  '</div>';

  html += '<div class="card">'+
    '<div class="card-title">Datos preliminares</div>'+
    '<div class="row">'+
      '<div class="campo"><label>Año base</label><input type="number" id="tasa-anio-base"></div>'+
      '<div class="campo"><label>Población base</label><input type="number" id="tasa-pob-base"></div>'+
      '<div class="campo"><label>Tasa anual (%)</label><input type="number" step="any" id="tasa-tasa"></div>'+
    '</div>'+
  '</div>';

  html += '<div class="card">'+
    '<div class="card-title">Duración del proyecto</div>'+
    '<div class="row">'+
      '<div class="campo"><label>Año de inicio del proyecto</label><input type="number" id="tasa-inicio"></div>'+
      '<div class="campo"><label>Duración del proyecto (Años)</label><input type="number" id="tasa-duracion"></div>'+
      '<div class="campo"><label>Año final del proyecto</label><input type="text" id="tasa-final" readonly></div>'+
    '</div>'+
    '<div style="padding:0 20px 20px;"><button class="btn btn-primary" onclick="calcularTasaBase()">CARGAR DATOS</button></div>'+
  '</div>';

  contenidoEl().innerHTML = html;

  const inInicio = document.getElementById('tasa-inicio');
  const inDuracion = document.getElementById('tasa-duracion');
  const inFinal = document.getElementById('tasa-final');

  function actualizarFinal(){
    const inicio = parseInt(inInicio.value,10);
    const duracion = parseInt(inDuracion.value,10);
    if(isNaN(inicio) || isNaN(duracion) || duracion<1){ inFinal.value=''; return; }
    inFinal.value = inicio+duracion;
  }
  inInicio.addEventListener('input', actualizarFinal);
  inDuracion.addEventListener('input', actualizarFinal);
}

function calcularTasaBase(){
  const nombre = document.getElementById('tasa-nombre').value.trim();
  if(!nombre){ mostrarError('Ubicación del proyecto','Ingrese el nombre de la población.'); return; }

  const anioBase = parseInt(document.getElementById('tasa-anio-base').value,10);
  const poblacionBase = parseFloat(document.getElementById('tasa-pob-base').value);
  const tasaPorcentaje = parseFloat(document.getElementById('tasa-tasa').value);
  const anioInicio = parseInt(document.getElementById('tasa-inicio').value,10);
  const duracion = parseInt(document.getElementById('tasa-duracion').value,10);

  if([anioBase,poblacionBase,tasaPorcentaje,anioInicio,duracion].some(v=>isNaN(v))){
    mostrarError('Datos inválidos','Revise el año base, población, tasa, año de inicio y duración.');
    return;
  }
  if(poblacionBase<=0){ mostrarError('Población','La población base debe ser mayor que cero.'); return; }
  if(duracion<1){ mostrarError('Duración','La duración del proyecto debe ser mayor que cero.'); return; }
  if(anioInicio<anioBase){ mostrarError('Año de inicio','El año de inicio del proyecto debe ser igual o posterior al año base.'); return; }

  const tasaDecimal = tasaPorcentaje/100;
  const anioFinal = anioInicio+duracion;

  estado.nombrePoblacion = nombre;
  estado.fuenteDatosActual = "Año base + tasa";
  estado.tasaBaseUsuario = tasaPorcentaje;
  estado.anioBaseUsuario = anioBase;
  estado.poblacionBaseUsuario = poblacionBase;
  estado.anioInicioProyecto = anioInicio;
  estado.duracionProyecto = duracion;
  estado.anioFinalProyecto = anioFinal;
  estado.datosHistoricos = [];
  estado.tablaTasas = [];

  const aniosProyeccion = [];
  for(let a=anioInicio;a<=anioFinal;a++) aniosProyeccion.push(a);

  const tabla = aniosProyeccion.map(anio=>{
    const tiempo = anio-anioBase;
    const poblacionLineal = pythonRound(poblacionBase + poblacionBase*tasaDecimal*tiempo, 0);
    const poblacionGeometrica = pythonRound(poblacionBase * Math.pow(1+tasaDecimal, tiempo), 0);
    const poblacionExponencial = pythonRound(poblacionBase * Math.exp(tasaDecimal*tiempo), 0);
    return {"Año":anio, "Lineal":poblacionLineal, "Geométrico":poblacionGeometrica, "Exponencial":poblacionExponencial};
  });

  estado.tablaProyeccion = tabla;
  estado.parametros = {
    pendiente_lineal: poblacionBase*tasaDecimal,
    tasa_geometrica: tasaDecimal,
    k_exponencial: tasaDecimal
  };

  moduloCalculos();

  mostrarModal('Datos guardados',
    "Los datos de la población '"+nombre+"' fueron guardados correctamente.\n\n"+
    'Año base: '+anioBase+'\n'+
    'Población base: '+formatearPoblacion(poblacionBase)+' habitantes\n'+
    'Tasa anual: '+tasaPorcentaje.toFixed(4)+'%\n'+
    'Año de inicio: '+anioInicio+'\n'+
    'Duración: '+duracion+' años\n'+
    'Año final: '+anioFinal+'\n\n'+
    'La proyección fue generada correctamente.'
  );
}

/* ============================================================
   MÓDULO 2: CÁLCULOS
   ============================================================ */
function moduloCalculos(){
  actualizarMenu('calculos');

  let html = crearTitulo('CALCULOS Y PROYECCIONES','Datos históricos, tasas de crecimiento y proyecciones poblacionales.');

  if(estado.fuenteDatosActual === "Año base + tasa"){
    html += '<div class="info-fuente"><div class="txt">Población: '+estado.nombrePoblacion+'</div></div>';

    html += '<div class="card"><div class="card-title">Datos preliminares</div>'+
      '<div class="card-sub">Información utilizada para la proyección</div>'+
      '<div class="param-grid">'+
        '<div class="param-col"><div class="lbl">Año base</div><div class="val">'+formatearAnio(estado.anioBaseUsuario)+'</div></div>'+
        '<div class="param-col"><div class="lbl">Población base</div><div class="val">'+formatearPoblacion(estado.poblacionBaseUsuario)+' Hab</div></div>'+
        '<div class="param-col"><div class="lbl">Tasa de crecimiento anual</div><div class="val">'+Number(estado.tasaBaseUsuario).toFixed(4)+'%</div></div>'+
      '</div>'+
    '</div>';

    html += '<div class="card"><div class="card-title">Tabla de proyección</div>'+
      crearTablaHTML(['Año','Lineal','Geométrico','Exponencial'], estado.tablaProyeccion, {scroll:true})+
    '</div>';

    contenidoEl().innerHTML = html;
    return;
  }

  if(estado.datosHistoricos.length===0){
    html += '<div class="mensaje-vacio">Primero cargue los datos poblacionales.</div>';
    contenidoEl().innerHTML = html;
    return;
  }

  // Datos históricos utilizados
  const historicoFilas = estado.datosHistoricos.map(d=>({"Año":d.Año, "Poblacion (Hab)":d.Poblacion}));
  html += '<div class="card"><div class="card-title">Datos históricos utilizados</div>'+
    crearTablaHTML(['Año','Poblacion (Hab)'], historicoFilas, {scroll:true})+
  '</div>';

  // Tasas por periodo (colapsable)
  const columnasTasas = ['Año inicial','Año final','Población inicial','Población final','Tasa lineal','Tasa geométrica','Tasa exponencial'];
  html += '<div class="card">'+
    '<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 20px 5px;">'+
      '<div class="card-title" style="padding:0;">Tasa de crecimiento por periodo</div>'+
      '<button class="btn btn-toggle" id="btn-toggle-tasas" onclick="toggleTasas()">MOSTRAR ▼</button>'+
    '</div>'+
    '<div id="contenido-tasas" style="display:none;">'+
      (estado.tablaTasas.length ? crearTablaHTML(columnasTasas, estado.tablaTasas, {scroll:true}) : '<div class="mensaje-vacio" style="padding:20px;">Sin datos de tasas.</div>')+
    '</div>'+
  '</div>';

  // Parámetros calculados
  const pendiente = Number(estado.parametros.pendiente_lineal||0);
  const tasaGeom = Number(estado.parametros.tasa_geometrica||0);
  const kExp = Number(estado.parametros.k_exponencial||0);
  html += '<div class="card"><div class="card-title">Parámetros calculados</div>'+
    '<div class="param-grid">'+
      '<div class="param-col"><div class="lbl">Tasa de crecimiento\nlineal</div><div class="val">'+pendiente.toFixed(0)+'</div></div>'+
      '<div class="param-col"><div class="lbl">Tasa de crecimiento\ngeométrica</div><div class="val">'+tasaGeom.toFixed(4)+'</div></div>'+
      '<div class="param-col"><div class="lbl">Tasa de crecimiento\nexponencial</div><div class="val">'+kExp.toFixed(4)+'</div></div>'+
    '</div>'+
  '</div>';

  // Tabla de proyección
  html += '<div class="card"><div class="card-title">Tabla de proyección</div>'+
    crearTablaHTML(['Año','Lineal','Geométrico','Exponencial'], estado.tablaProyeccion, {scroll:true})+
  '</div>';

  contenidoEl().innerHTML = html;
}

function toggleTasas(){
  const div = document.getElementById('contenido-tasas');
  const btn = document.getElementById('btn-toggle-tasas');
  const visible = div.style.display !== 'none';
  div.style.display = visible ? 'none' : 'block';
  btn.textContent = visible ? 'MOSTRAR ▼' : 'OCULTAR ▲';
}

/* ============================================================
   MÓDULO 3: GRÁFICOS
   ============================================================ */
function moduloGraficos(){
  actualizarMenu('graficos');

  let html = crearTitulo('GRAFICAS DE PROYECCIÓN','Compare los métodos de proyección y consulte un año específico.');

  if(estado.tablaProyeccion.length===0){
    html += '<div class="mensaje-vacio">Primero debe cargar los datos y generar una proyección.</div>';
    contenidoEl().innerHTML = html;
    return;
  }

  html += '<div class="card"><div class="controles-card">'+
    '<b style="font-size:13px;">Métodos:</b>'+
    '<div class="metodos-wrap">'+
      ['Lineal','Geométrico','Exponencial'].map(m=>'<label class="chk"><input type="checkbox" class="chk-metodo" value="'+m+'" checked> '+m+'</label>').join('')+
    '</div>'+
    '<div class="spacer"></div>'+
    '<span style="color:var(--gris);font-size:13px;">Año:</span>'+
    '<select id="sel-anio-grafico">'+estado.tablaProyeccion.map(r=>'<option value="'+r["Año"]+'">'+formatearAnio(r["Año"])+'</option>').join('')+'</select>'+
    '<button class="btn btn-show" onclick="mostrarGrafico()">MOSTRAR</button>'+
  '</div></div>';

  html += '<div class="grafico-card"><canvas id="canvas-grafico" style="width:100%;height:360px;"></canvas><div id="valores-panel"></div></div>';

  contenidoEl().innerHTML = html;

  document.getElementById('sel-anio-grafico').value = estado.tablaProyeccion[estado.tablaProyeccion.length-1]["Año"];

  mostrarGrafico();
}

const COLORES_METODO = {"Lineal":"#16A34A","Geométrico":"#2563EB","Exponencial":"#D97706"};

function mostrarGrafico(){
  const metodos = Array.from(document.querySelectorAll('.chk-metodo:checked')).map(c=>c.value);
  if(metodos.length===0){
    mostrarError('Métodos','Seleccione al menos un método.');
    return;
  }
  const anio = parseInt(document.getElementById('sel-anio-grafico').value,10);

  dibujarGrafico(document.getElementById('canvas-grafico'), estado.tablaProyeccion, metodos, anio);

  const fila = estado.tablaProyeccion.find(r=>r["Año"]===anio);
  const panel = document.getElementById('valores-panel');
  if(fila){
    let itemsHtml = metodos.map(m=>{
      if(!(m in fila)) return '';
      return '<div class="valor-item">'+m+'\n'+formatearPoblacion(fila[m])+' habitantes</div>';
    }).join('');
    panel.innerHTML = '<div class="valores-panel"><h4>PROYECCIÓN PARA EL AÑO '+anio+'</h4><div class="valores-row">'+itemsHtml+'</div></div>';
  } else {
    panel.innerHTML = '';
  }
}

/* Gráfico dibujado en canvas nativo (sin dependencias externas),
   equivalente visual a graficos.py (matplotlib) */
function dibujarGrafico(canvas, tabla, metodos, anioConsulta){
  const dpr = window.devicePixelRatio || 1;
  const cssWidth = canvas.clientWidth || 800;
  const cssHeight = 360;
  canvas.width = cssWidth*dpr;
  canvas.height = cssHeight*dpr;
  canvas.style.height = cssHeight+'px';
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.clearRect(0,0,cssWidth,cssHeight);

  const margenIzq=75, margenDer=25, margenTop=45, margenAbajo=45;
  const anchoPlot = cssWidth-margenIzq-margenDer;
  const altoPlot = cssHeight-margenTop-margenAbajo;

  const anios = tabla.map(r=>r["Año"]);
  const xMin = Math.min(...anios), xMax = Math.max(...anios);

  let valoresVisibles = [];
  metodos.forEach(m=>{ tabla.forEach(r=>{ if(m in r) valoresVisibles.push(r[m]); }); });
  let yMin = Math.min(...valoresVisibles), yMax = Math.max(...valoresVisibles);
  if(yMin===yMax){ yMin -= 1; yMax += 1; }
  const padY = (yMax-yMin)*0.08;
  yMin -= padY; yMax += padY;
  if(yMin>0) yMin = yMin*0.0 + Math.min(yMin, yMin); // keep as is (no forcing to zero, mimic matplotlib autoscale)

  function xPix(anio){ return margenIzq + (xMax===xMin?0.5:((anio-xMin)/(xMax-xMin))) * anchoPlot; }
  function yPix(valor){ return margenTop + (1-((valor-yMin)/(yMax-yMin))) * altoPlot; }

  // Fondo
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0,0,cssWidth,cssHeight);

  // Grid horizontal
  ctx.strokeStyle = 'rgba(100,116,139,0.2)';
  ctx.lineWidth = 1;
  ctx.font = '11px Segoe UI, Arial, sans-serif';
  ctx.fillStyle = '#64748B';
  const pasosY = 5;
  for(let i=0;i<=pasosY;i++){
    const valor = yMin + (yMax-yMin)*i/pasosY;
    const y = yPix(valor);
    ctx.beginPath();
    ctx.moveTo(margenIzq, y);
    ctx.lineTo(cssWidth-margenDer, y);
    ctx.stroke();
    ctx.textAlign = 'right';
    ctx.fillText(formatearPoblacion(valor), margenIzq-8, y+4);
  }

  // Eje X (años, máximo ~8 etiquetas)
  const nEtiquetas = Math.min(8, anios.length);
  ctx.textAlign = 'center';
  for(let i=0;i<nEtiquetas;i++){
    const idx = Math.round(i*(anios.length-1)/Math.max(1,nEtiquetas-1));
    const anio = anios[idx];
    const x = xPix(anio);
    ctx.fillText(formatearAnio(anio), x, cssHeight-margenAbajo+18);
  }

  // Títulos ejes
  ctx.fillStyle = '#17221B';
  ctx.font = '12px Segoe UI, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Año', margenIzq+anchoPlot/2, cssHeight-8);
  ctx.save();
  ctx.translate(16, margenTop+altoPlot/2);
  ctx.rotate(-Math.PI/2);
  ctx.fillText('Población', 0, 0);
  ctx.restore();

  // Título
  ctx.font = 'bold 16px Segoe UI, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Proyección Poblacional', margenIzq+anchoPlot/2, 24);

  // Líneas por método
  metodos.forEach(metodo=>{
    ctx.strokeStyle = COLORES_METODO[metodo]||'#000';
    ctx.fillStyle = COLORES_METODO[metodo]||'#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    tabla.forEach((r,i)=>{
      if(!(metodo in r)) return;
      const x = xPix(r["Año"]), y = yPix(r[metodo]);
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    });
    ctx.stroke();
    tabla.forEach(r=>{
      if(!(metodo in r)) return;
      const x = xPix(r["Año"]), y = yPix(r[metodo]);
      ctx.beginPath();
      ctx.arc(x,y,2.6,0,Math.PI*2);
      ctx.fill();
    });
  });

  // Línea vertical del año consultado + punto promedio
  if(anioConsulta!==undefined && anioConsulta!==null && !isNaN(anioConsulta)){
    const fila = tabla.find(r=>r["Año"]===anioConsulta);
    if(fila){
      const x = xPix(anioConsulta);
      ctx.save();
      ctx.strokeStyle = '#17221B';
      ctx.lineWidth = 1;
      ctx.setLineDash([5,4]);
      ctx.beginPath();
      ctx.moveTo(x, margenTop);
      ctx.lineTo(x, cssHeight-margenAbajo);
      ctx.stroke();
      ctx.restore();

      const valores = metodos.filter(m=>m in fila).map(m=>fila[m]);
      if(valores.length){
        const promedio = valores.reduce((a,b)=>a+b,0)/valores.length;
        const y = yPix(promedio);
        ctx.fillStyle = '#17221B';
        ctx.beginPath();
        ctx.arc(x,y,5,0,Math.PI*2);
        ctx.fill();
      }
    }
  }

  // Leyenda
  ctx.font = '12px Segoe UI, Arial, sans-serif';
  let lx = margenIzq;
  const ly = margenTop-22;
  metodos.forEach(metodo=>{
    ctx.fillStyle = COLORES_METODO[metodo]||'#000';
    ctx.fillRect(lx, ly-8, 12, 12);
    ctx.fillStyle = '#17221B';
    ctx.textAlign = 'left';
    const etiqueta = 'Método '+metodo.toLowerCase();
    ctx.fillText(etiqueta, lx+16, ly+2);
    lx += 16 + ctx.measureText(etiqueta).width + 20;
  });
}

/* ============================================================
   VENTANA 4: RESULTADOS
   ============================================================ */
function moduloResultados(){
  actualizarMenu('resultados');

  let html = crearTitulo('RESULTADOS','Análisis de la proyección poblacional y aplicación de los métodos según RAS.');

  if(!estado.tablaProyeccion || estado.tablaProyeccion.length===0){
    html += '<div class="mensaje-vacio">Primero debe cargar los datos y generar una proyección.</div>';
    contenidoEl().innerHTML = html;
    return;
  }

  const anioFinal = estado.tablaProyeccion[estado.tablaProyeccion.length-1]["Año"];

  let resultadosArr;
  try{
    resultadosArr = analizarResultados(estado.tablaProyeccion, anioFinal);
  }catch(err){
    mostrarError('Error de resultados', err.message);
    contenidoEl().innerHTML = html;
    return;
  }

  // Card 1: proyección al año final
  html += '<div class="card"><div class="card-title">PROYECCIÓN AL AÑO '+anioFinal+'</div>'+
    '<div class="card-sub">Población proyectada por cada método</div>'+
    '<div class="resultados-row">'+
      resultadosArr.map(r=>'<div class="res-col verde"><div class="titulo-met">'+r.Metodo+'</div><div class="valor-met">'+formatearPoblacion(r.Poblacion)+' habitantes</div></div>').join('')+
    '</div>'+
  '</div>';

  // Card 2: nivel de complejidad
  html += '<div class="card"><div class="card-title">NIVEL DE COMPLEJIDAD DEL SISTEMA</div>'+
    '<div class="card-sub">Clasificación según la población proyectada para cada método</div>'+
    '<div class="resultados-row">'+
      resultadosArr.map(r=>'<div class="res-col blanco"><div class="titulo-met">'+r.Metodo+'</div><div class="nivel-met">'+r.Nivel+'</div></div>').join('')+
    '</div>'+
  '</div>';

  // Card 3: métodos permitidos RAS
  html += '<div class="card"><div class="card-title">MÉTODOS PERMITIDOS SEGÚN RAS</div>'+
    '<div class="card-sub">Verificación de aplicabilidad según el nivel de complejidad</div>'+
    '<div class="resultados-row">'+
      resultadosArr.map(r=>'<div class="res-col blanco"><div class="titulo-met">'+r.Metodo+'</div><div class="'+(r.Aplica==='SÍ'?'aplica-si':'aplica-no')+'">'+(r.Aplica==='SÍ'?'SÍ APLICA':'NO APLICA')+'</div></div>').join('')+
    '</div>'+
  '</div>';

  contenidoEl().innerHTML = html;
}

/* ============================================================
   INICIO
   La vista se dibuja al abrir el módulo por primera vez (pintarProyeccionPoblacional);
   no se puede llamar aquí porque #contenido todavía no existe cuando carga este script.
   ============================================================ */

/* ---------- API pública del módulo (la consumen otros módulos, p. ej. Términos de referencia) ---------- */
function poblacionesDisponibles(){
  if(typeof estado==="undefined"||!estado.tablaProyeccion||!estado.tablaProyeccion.length) return [];
  var tabla=estado.tablaProyeccion;
  var anio=tabla[tabla.length-1]["Año"];
  try{
    return analizarResultados(tabla,anio).map(function(r){
      return {anio:anio,metodo:r.Metodo,valor:Math.round(r.Poblacion),aplica:r.Aplica==="SÍ"};
    });
  }catch(e){ return []; }}

/* La vista se inicializa solo la primera vez que se abre (igual que la versión original). */
function pintarProyeccionPoblacional(){
  if(!window._proyIniciado){ window._proyIniciado=true; moduloDatos(); }}

MODULOS.push({
  id:"proyeccion_poblacional",
  titulo:"Proyección poblacional",
  descripcion:"Métodos lineal, geométrico y exponencial a partir de censos DANE.",
  grupo:"proyecto", orden:3, icono:"proy", iconoSvg:"<path d=\"M3 17l6-6 4 4 8-8\"/><path d=\"M15 7h6v6\"/>",
  valores:{},
  indicador:true,
  normalizar:function(PRO){},
  completo:function(PRO){return !!(estado && estado.tablaProyeccion && estado.tablaProyeccion.length);},
  vista:function(){return `  <div class="subbar">
    <button class="subtab-btn active" id="btn-menu-datos" onclick="moduloDatos()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="5.5" rx="7" ry="3"/><path d="M5 5.5v6c0 1.66 3.13 3 7 3s7-1.34 7-3v-6M5 11.5v6c0 1.66 3.13 3 7 3s7-1.34 7-3v-6"/></svg>DATOS POBLACIONALES</button>
    <button class="subtab-btn" id="btn-menu-calculos" onclick="moduloCalculos()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/></svg>CÁLCULOS</button>
    <button class="subtab-btn" id="btn-menu-graficos" onclick="moduloGraficos()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19V5M4 19h16M8 15l3-4 3 2 5-6"/></svg>GRÁFICOS</button>
    <button class="subtab-btn" id="btn-menu-resultados" onclick="moduloResultados()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/></svg>RESULTADOS</button>
  </div>
  <div class="content content-full" id="contenido"></div>`;},
  pintar:pintarProyeccionPoblacional,
  estadoExtra:{
    guardar:function(){return estado;},
    cargar:function(obj){Object.keys(obj).forEach(function(k){if(k in estado)estado[k]=obj[k];});window._proyIniciado=false;}
  },
  api:{poblaciones:poblacionesDisponibles}
});
