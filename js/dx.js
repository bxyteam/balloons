// Configuración global
// https://lu7aa.org/balloonGmap.html
window.getParamSafe = (key, defaultValue = "", encode = false) => {
  const params = new URLSearchParams(window.parent.window.location.search);
  const value = params.get(key);
  if (value === null || value.trim() === "") return defaultValue;
  return encode ? encodeURIComponent(value) : value.trim();
};

// 1. Array de meses (índices del 1 al 12)
const mes = [
  "", // Para que mes[1] sea "January"
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// 2. Array bidimensional bana[20][33] inicializado en 0
const bana = [];

// Llenar con ceros: bana[0][0] hasta bana[19][32]
for (let j = 0; j <= 19; j++) {
  bana[j] = [];
  for (let k = 0; k <= 32; k++) {
    bana[j][k] = 0;
  }
}

const mapsize = 2160; // ancho del mapa, alto del mapa = pxx/2

// Función para convertir ubicación a coordenadas XY
function loc2xy(loc) {
  loc = loc.toUpperCase();
  if (loc === "") loc = "LL55";
  if (loc.length === 4) loc = loc + "LL";

  const lat =
    (loc.charCodeAt(1) - 65) * 10 +
    parseInt(loc.charAt(3)) * 1 +
    (loc.charCodeAt(5) - 97) / 24 -
    88.5;
  const lon =
    (loc.charCodeAt(0) - 65) * 20 +
    parseInt(loc.charAt(2)) * 2 +
    (loc.charCodeAt(4) - 97) / 12 -
    177;
  const ly = ((90 - lat) / 720) * mapsize;
  const lx = ((180 + lon) / 360) * mapsize;

  // console.log(`Lat:${lat} Lon:${lon}  lx:${lx}  ly:${ly}`);

  return { lat, lon, lx, ly };
}

// Función para obtener zona horaria (versión 1)
function loc2tz1(loc) {
  loc = loc.toUpperCase();
  if (loc === "") loc = "LL55";
  if (loc.length === 4) loc = loc + "LL";

  let valortz = (loc.charCodeAt(0) - 65) * 24 + parseInt(loc.charAt(2));
  valortz = Math.floor(valortz / 18 + 1.3) - 12;

  if (valortz < -12) valortz = -12;
  if (valortz > 12) valortz = 12;

  return valortz;
}

// Función para obtener zona horaria con formato
function loc2tz(loc) {
  loc = loc.toUpperCase();
  if (loc === "") loc = "LL55";
  if (loc.length === 4) loc = loc + "LL";

  let valortz = (loc.charCodeAt(0) - 65) * 24 + parseInt(loc.charAt(2));
  valortz = Math.floor(valortz / 18 + 1.3) - 12;

  if (valortz < -12) valortz = -12;
  if (valortz > 12) valortz = 12;

  const tzString = valortz > 0 ? `+${valortz}` : valortz.toString();
  return `Time-Zone~${tzString}`;
}

// Función de delay (usando Promise para ser no-bloqueante)
function delayEnSegundos(segundos) {
  return new Promise((resolve) => setTimeout(resolve, segundos * 1000));
}

// Función de delay síncrona (bloqueante, similar al original)
function delayEnSegundosSync(segundos) {
  const inicio = Date.now();
  const fin = inicio + segundos * 1000;
  while (Date.now() < fin) {
    // Bucle de espera activa
  }
}

// Fecha de referencia
const fromDate = new Date("2021-01-01 00:00:00");

// Función para calcular diferencia en horas
function fh(fechahora) {
  try {
    // Formato esperado: "2021-10-30 18:32"
    const year = fechahora.substring(0, 4);
    const month = fechahora.substring(5, 7);
    const day = fechahora.substring(8, 10);
    const hour = fechahora.substring(11, 13);

    const toDate = new Date(`${year}-${month}-${day} ${hour}:00:00`);
    const diffMs = toDate.getTime() - fromDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    return diffHours;
  } catch (error) {
    console.error("Error en fh:", error);
    return 0;
  }
}

// Función para calcular diferencia en días
function fd(fechahora) {
  try {
    // Formato esperado: "2021-10-30 18:32"
    const year = fechahora.substring(0, 4);
    const month = fechahora.substring(5, 7);
    const day = fechahora.substring(8, 10);

    const toDate = new Date(`${year}-${month}-${day} 00:00:00`);
    const diffMs = toDate.getTime() - fromDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    return diffDays;
  } catch (error) {
    console.error("Error en fd:", error);
    return 0;
  }
}

// Función para buscar contenido entre tags
/*
function buscarTag(tagInicio, tagFin, texto, posicion = { value: 0 }) {
  let tagFinalEncontrado = false;
  let k = posicion.value;
  let resultado = "";

  while (!tagFinalEncontrado && k < texto.length) {
    if (texto.substring(k, k + tagInicio.length) === tagInicio) {
      let j = k + tagInicio.length;
      let tagFinalLocalEncontrado = false;

      while (!tagFinalLocalEncontrado && j < texto.length) {
        if (texto.substring(j, j + tagFin.length) === tagFin) {
          resultado = texto.substring(k + tagInicio.length, j);
          tagFinalLocalEncontrado = true;
          tagFinalEncontrado = true;
          posicion.value = j + tagFin.length;
        } else {
          j++;
        }
      }

      if (!tagFinalLocalEncontrado) {
        k++;
      }
    } else {
      k++;
    }
  }

  if (k >= texto.length) {
    posicion.value = texto.length;
  }

  return resultado;
}
*/

function buscarTag(tagInicio, tagFin, texto, posicion = 0) {
  let tagFinalEncontrado = false;
  let k = posicion;
  let resultado = "";

  while (!tagFinalEncontrado && k < texto.length) {
    if (texto.substring(k, k + tagInicio.length) === tagInicio) {
      let j = k + tagInicio.length;
      let tagFinalLocalEncontrado = false;

      while (!tagFinalLocalEncontrado && j < texto.length) {
        if (texto.substring(j, j + tagFin.length) === tagFin) {
          resultado = texto.substring(k + tagInicio.length, j);
          tagFinalLocalEncontrado = true;
          tagFinalEncontrado = true;
          posicion = j + tagFin.length;
        } else {
          j++;
        }
      }

      if (!tagFinalLocalEncontrado) {
        k++;
      }
    } else {
      k++;
    }
  }

  if (k >= texto.length) {
    posicion = texto.length;
  }

  return resultado;
}

// Función para formatear fecha y día
function fechayDia(fecha) {
  const meses = [
    "",
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Setiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const dias = [
    "",
    "Domingo",
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
  ];

  // Convertir a objeto Date si es string
  const fechaObj = typeof fecha === "string" ? new Date(fecha) : fecha;

  const year = fechaObj.getFullYear();
  const month = String(fechaObj.getMonth() + 1).padStart(2, "0");
  const day = String(fechaObj.getDate()).padStart(2, "0");
  const hour = String(fechaObj.getHours()).padStart(2, "0");
  const minute = String(fechaObj.getMinutes()).padStart(2, "0");

  return `${year}/${month}/${day} ${hour}:${minute}`;
}

// Variables de configuración
let callsign, band, limit, calli;

// Inicialización de variables usando getParamSafe
if (getParamSafe("call") === "" || !getParamSafe("call")) {
  callsign = "*";
} else {
  // Reemplazar espacios y tomar máximo 12 caracteres
  const callTemp = getParamSafe("call").trim().toUpperCase().replace(/ /g, "");
  callsign = callTemp.substring(0, 12);
}

// Configuración de índices de tabla
const tdate = 1;
const tbanda = 3;
const tcall = 8;
const tloc = 9;
const tsnr = 4;
const thome = 6;
const tkm = 10;
const ocall = 2;
const oloc = 7;
const tpwr = 7;

// Inicialización de arrays
datos = Array(3000)
  .fill(null)
  .map(() => Array(3).fill(null));
let estaciones = Array(3000)
  .fill(null)
  .map(() => Array(7).fill(null));
let n = 0;
const estacion = Array(3000).fill(null);
let o = 0;

// Configuración de banda
if (getParamSafe("band") === "" || !getParamSafe("band")) {
  band = "All";
} else {
  band = getParamSafe("band").trim();
}

// Configuración de límite de tiempo
if (getParamSafe("timelimit") === "" || !getParamSafe("timelimit")) {
  limit = "604800";
} else {
  limit = getParamSafe("timelimit").trim();
}

// Si call es "*", establecer límite por defecto
if (getParamSafe("call") === "*") {
  limit = "604800";
}

// Variables de control
let founda = false;
calli = getParamSafe("call").toUpperCase().trim().substring(0, 12);

// Validación de caracteres peligrosos
function validateCall(callsign) {
  const forbiddenChars = [".", "=", "[", "]", "(", ")", "'"];

  for (let z = 0; z < callsign.length; z++) {
    const char = callsign.charAt(z);
    if (forbiddenChars.includes(char)) {
      throw new Error(`Carácter no permitido encontrado: ${char}`);
    }
  }
  return true;
}

// Validar el callsign
try {
  validateCall(calli);
} catch (error) {
  console.error("Error de validación:", error.message);
  // En navegador no podemos hacer Response.End, así que lanzamos error o retornamos
  throw error;
}

// Funciones auxiliares para compatibilidad con ASP
function padLeft(str, length, padChar = "0") {
  return String(str).padStart(length, padChar);
}

function right(str, length) {
  return String(str).slice(-length);
}

// Ejemplo de uso y testing
console.log("Variables inicializadas:");
console.log("Callsign:", callsign);
console.log("Band:", band);
console.log("Limit:", limit);
console.log("Calli:", calli);

// Ejemplo de fechayDia
//const fechaEjemplo = new Date();
//console.log("Fecha formateada:", fechayDia(fechaEjemplo));

// Obtener el parámetro "call" de la URL
const call = window.getParamSafe("call", "");

// Inicializar callsearch
let callsearch = "";

// Si termina en "*", convertir a mayúsculas
if (call.endsWith("*")) {
  callsearch = call.toUpperCase();
}

// Si tiene más de 12 caracteres, detener ejecución
if (call.length > 12) {
  console.warn("Parámetro 'call' demasiado largo.");
  throw new Error("Fin del procesamiento por longitud.");
}

// Si no está vacío, revisar los caracteres
if (call !== "") {
  for (let i = 0; i < call.length - 1; i++) {
    const char = call.charAt(i);
    if (char > "z") {
      console.warn("Carácter inválido en 'call':", char);
      throw new Error("Fin del procesamiento por carácter inválido.");
    }
  }
}

// callsearch está listo para usarse
console.log("callsearch:", callsearch);

// Función para obtener el contenido desde la URL remota
async function fetchReporters(callsearch, band) {
  const bs = window.getParamSafe("bs", "");
  const baseUrl = "/api/v1/wsprNetwork";
  let callParam = "";
  let reporterParam = "";

  if (bs === "A" || bs === "") {
    callParam = callsearch;
    reporterParam = callsearch;
  } else if (bs === "B") {
    callParam = callsearch.toUpperCase();
    reporterParam = "";
  } else {
    callParam = "";
    reporterParam = callsearch.toUpperCase();
  }

  const params = new URLSearchParams({
    band: band,
    count: "300",
    call: callParam,
    reporter: reporterParam,
    timeLimit: "604800",
    sortBy: "date",
    sortRev: "1",
    unique: "0",
    excludespecial: "0",
    mode: "All",
  });

  const fullUrl = `${baseUrl}?${params.toString()}`;

  try {
    const response = await fetch(fullUrl);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const pag = await response.text();
    return pag;
  } catch (error) {
    console.error("Error al obtener datos:", error);
    return null;
  }
}

/*
fetchReporters(callsearch, band).then((pag) => {
  if (pag) {
    console.log("Contenido recibido:", pag);

  }
});
*/

// Función auxiliar para buscar contenido entre tags
// function buscarTag(tagInicio, tagFin, contenido, posicion = 0) {
//     const inicio = contenido.indexOf(tagInicio, posicion);
//     if (inicio === -1) return "";

//     const finTag = contenido.indexOf(tagFin, inicio + tagInicio.length);
//     if (finTag === -1) return "";

//     return contenido.substring(inicio, finTag + tagFin.length);
// }

// Función auxiliar para simular split de ASP con límite y modo
function splitASP(cadena, delimitador, limite = -1, modo = 0) {
  if (!cadena) return [];

  let partes = cadena.split(delimitador);

  if (limite > 0 && partes.length > limite) {
    // En ASP, cuando se especifica un límite, los elementos extra se juntan en el último
    const extras = partes.slice(limite - 1).join(delimitador);
    partes = partes.slice(0, limite - 1);
    partes.push(extras);
  }

  return partes;
}

// Función auxiliar para reemplazar texto (similar a replace de ASP)
function replaceAll(cadena, buscar, reemplazar) {
  if (!cadena) return "";
  return cadena.replace(
    new RegExp(buscar.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"),
    reemplazar,
  );
}

// Función principal migrada
function procesarTabla(pag, ocall, tcall) {
  let posicion = 1;
  let estacion = [];
  let o = 0;

  // Buscar la tabla
  const tabla = buscarTag("<table>", "</table>", pag, posicion);
  if (!tabla) {
    console.log("No se encontró tabla");
    return estacion;
  }

  // Dividir la tabla por filas
  const tablam = splitASP(tabla, "<tr>", 3000, 1);

  // Procesar cada fila (empezando desde índice 2 como en el código original)
  for (let i = 2; i < tablam.length; i++) {
    try {
      // Limpiar la fila de atributos de alineación y &nbsp;
      tablam[i] = replaceAll(tablam[i], " align='right'", "");
      tablam[i] = replaceAll(tablam[i], " align='left'", "");
      tablam[i] = replaceAll(tablam[i], "&nbsp;", "");

      // Remover tags de fila
      let datosmod = replaceAll(tablam[i], "<tr>", "");
      datosmod = replaceAll(datosmod, "</tr>", "");
      datosmod = replaceAll(datosmod, "</td>", "");

      // Dividir por celdas
      const datos1 = splitASP(datosmod, "<td>", 13, 1);

      // Obtener parámetro bs usando tu función
      const bs = window.getParamSafe("bs", "");

      // Procesar estaciones según el parámetro bs
      if (bs === "B" || bs === "" || bs === "A") {
        let noesta = true;

        // Verificar si la estación ya existe
        for (let r = 0; r < o; r++) {
          const station = datos1[ocall] || "";
          if (estacion[r] === station) {
            noesta = false;
            break;
          }
        }

        // Si no existe, agregarla
        if (noesta && datos1[ocall]) {
          estacion[o] = datos1[ocall];
          o++;
        }
      }

      if (bs === "S" || bs === "" || bs === "A") {
        let noesta = true;

        // Verificar si la estación ya existe
        for (let r = 0; r < o; r++) {
          const station = datos1[tcall] || "";
          if (estacion[r] === station) {
            noesta = false;
            break;
          }
        }

        // Si no existe, agregarla
        if (noesta && datos1[tcall]) {
          estacion[o] = datos1[tcall];
          o++;
        }
      }
    } catch (error) {
      // Equivalente a "on error resume next" en ASP
      console.warn("Error procesando fila", i, ":", error);
      continue;
    }
  }

  return estacion;
}

estaciones = procesarTabla(contenidoHTML, indiceOcall, indiceTcall);

function procesarEstaciones(estacion, o) {
  // Decrementar o como en el código original
  o = o - 1;

  if (o > -1) {
    // Obtener parámetro de banda
    let bandi = window.getParamSafe("band", "");

    // Mapear valores de banda
    switch (bandi) {
      case "0":
        bandi = ".475";
        break;
      case "-1":
        bandi = ".136";
        break;
      case "3":
        bandi = "3.5";
        break;
      case "1":
        bandi = "1.8";
        break;
      case "":
        bandi = "All";
        break;
    }

    // Crear inicio del select
    let estaselect = `<i><b>On ${bandi} MHz<br><br style='line-height:1px;'><select id='multiplecalls' name='multiplecalls' style='width: 80px !important;max-width:80px important!;text-align:center;font-weight:bold;font-size:12px;line-height:10px;' onchange="javascript:enviando();document.getElementById('call').value=document.getElementById('multiplecalls').value; document.getElementById('enviar').submit();">\n`;

    // Ordenamiento burbuja de las estaciones (como en el código original)
    for (let d = 0; d < o; d++) {
      for (let e = d + 1; e <= o; e++) {
        if (estacion[d] > estacion[e]) {
          let estacionsave = estacion[e];
          estacion[e] = estacion[d];
          estacion[d] = estacionsave;
        }
      }
    }

    // Agregar opción por defecto
    estaselect += "<option>Select</option>\n";

    // Agregar todas las estaciones al select
    for (let p = 0; p <= o; p++) {
      estaselect += `<option value='${estacion[p]}'>${estacion[p]}</option>\n`;
    }

    // Determinar tipo de estación
    const bs = window.getParamSafe("bs", "");
    let tipob;
    if (bs === "B" || bs === "") {
      tipob = "Beacon";
    } else {
      tipob = "Spotter";
    }
    if (bs === "A" || bs === "") {
      tipob = "Beac/Spott";
    }

    // Verificar asterisco en el call
    const call = window.getParamSafe("call", "");
    let addaster = "";
    if (call.length > 0 && call.charAt(call.length - 1) === "*") {
      addaster = " " + call.toUpperCase();
    }

    // Completar el select
    estaselect += `</select><br>Recent ${o + 1}${addaster}<br>${tipob} Calls</b></i>\n`;

    return estaselect;
  }

  return "";
}

// Diccionarios para mapeo de frecuencias
const dic = new Map([
  ["0.00", 1],
  ["0.13", 1],
  ["0.47", 2],
  ["630.", 2],
  ["0.70", 2],
  ["1.83", 3],
  ["1.84", 3],
  ["1.99", 3],
  ["3.50", 4],
  ["3.51", 4],
  ["3.52", 4],
  ["3.53", 4],
  ["3.54", 4],
  ["3.55", 4],
  ["3.56", 4],
  ["3.57", 4],
  ["3.58", 4],
  ["3.59", 4],
  ["3.86", 4],
  ["3.96", 4],
  ["5.28", 5],
  ["5.35", 5],
  ["5.36", 5],
  ["7.00", 6],
  ["7.03", 6],
  ["7.04", 6],
  ["7.10", 6],
  ["7.14", 6],
  ["7.16", 6],
  ["10.0", 7],
  ["10.1", 7],
  ["13.5", 8],
  ["14.0", 9],
  ["14.1", 9],
  ["18.1", 10],
  ["21.0", 11],
  ["24.9", 12],
  ["28.1", 13],
  ["28.2", 13],
  ["28.3", 13],
  ["28.4", 13],
  ["28.8", 13],
  ["40.6", 14],
  ["40.0", 14],
  ["50.0", 15],
  ["50.1", 15],
  ["50.2", 15],
  ["70.0", 16],
  ["70.1", 16],
  ["144.", 17],
  ["145.", 17],
  ["432.", 18],
  ["1296", 19],
]);

// Diccionario inverso (índice a frecuencia)
const did = new Map([
  [1, "0.13"],
  [2, "0.47"],
  [3, "1.8"],
  [4, "3.5"],
  [5, "5"],
  [6, "7"],
  [7, "10"],
  [8, "13"],
  [9, "14"],
  [10, "18"],
  [11, "21"],
  [12, "24"],
  [13, "28"],
  [14, "40"],
  [15, "50"],
  [16, "70"],
  [17, "144"],
  [18, "432"],
  [19, "1296"],
]);

// Inicializar array bidimensional estac (equivalente a Dim estac(20,20))
const estac = Array(21)
  .fill()
  .map(() => Array(21).fill(0));

// Inicializar array bande
const bande = Array(21).fill(0);
let lastz = -1;

// Procesar parámetros de llamada
function procesarCallsign() {
  let callsign = window.getParamSafe("call", "").trim().toUpperCase();
  let callsign1 = window.getParamSafe("call", "").trim().toUpperCase();

  // Verificar parámetro omit
  const omit = window.getParamSafe("omit", "") !== "" ? "1" : "0";

  // Verificar si el segundo carácter es "_"
  const callParam = window.getParamSafe("call", "");
  if (callParam.length > 1 && callParam.charAt(1) === "_") {
    callsign1 = "";
  }

  // Validar longitud máxima
  if (callParam.length > 12) {
    console.error("Call sign demasiado largo");
    return { error: "Call sign demasiado largo" };
  }

  // Validar caracteres
  if (callParam !== "") {
    for (let i = 0; i < callParam.length - 1; i++) {
      if (callParam.charCodeAt(i) > 122) {
        // 'z' = 122
        console.error("Carácter inválido en call sign");
        return { error: "Carácter inválido en call sign" };
      }
    }
  }

  return {
    callsign: callsign,
    callsign1: callsign1,
    omit: omit,
    error: null,
  };
}

// Función auxiliar para obtener índice de frecuencia
function getFreqIndex(freq) {
  return dic.get(freq) || -1;
}

// Función auxiliar para obtener frecuencia por índice
function getFreqByIndex(index) {
  return did.get(index) || "";
}

// Ejemplo de uso completo:
function inicializarProcesamiento() {
  // Procesar callsign
  const resultCall = procesarCallsign();
  if (resultCall.error) {
    console.error(resultCall.error);
    return;
  }

  console.log("Callsign procesado:", resultCall.callsign);
  console.log("Omit:", resultCall.omit);

  // Ejemplo de cómo usar los diccionarios
  console.log("Índice para 14.0 MHz:", getFreqIndex("14.0"));
  console.log("Frecuencia para índice 9:", getFreqByIndex(9));
}

// Migración ASP a JavaScript - Parte 3

// Función para construir URL de reportes
function buildReportersURL(band, callsign, callsign1, limit, omit) {
  const bs = window.getParamSafe("bs", "");
  let getURLreporters = "";

  if (bs === "A" || bs === "") {
    getURLreporters = `http://wsprnetwork.browxy.com/?band=${band}&count=3000&call=${callsign}&reporter=${callsign1}&timeLimit=${limit}&sortBy=date&sortRev=1&unique=0&mode=All&excludespecial=${omit}`;
  } else if (bs === "B") {
    getURLreporters = `http://wsprnetwork.browxy.com/?band=${band}&count=3000&call=${callsign}&reporter=&timeLimit=${limit}&sortBy=date&sortRev=1&unique=0&mode=All&excludespecial=${omit}`;
  } else {
    getURLreporters = `http://wsprnetwork.browxy.com/?band=${band}&count=3000&reporter=${callsign}&call=&timeLimit=${limit}&sortBy=date&sortRev=1&unique=0&mode=All&excludespecial=${omit}`;
  }

  return getURLreporters;
}

// Inicializar arrays de bandas
function initializeBandArrays() {
  const bandArrays = {
    ba: new Array(34).fill(0),
    b0: new Array(34).fill(0),
    b1: new Array(34).fill(0),
    b3: new Array(34).fill(0),
    b5: new Array(34).fill(0),
    b7: new Array(34).fill(0),
    b10: new Array(34).fill(0),
    b13: new Array(34).fill(0),
    b14: new Array(34).fill(0),
    b18: new Array(34).fill(0),
    b21: new Array(34).fill(0),
    b24: new Array(34).fill(0),
    b28: new Array(34).fill(0),
    b40: new Array(34).fill(0),
    b50: new Array(34).fill(0),
    b70: new Array(34).fill(0),
    b144: new Array(34).fill(0),
    b432: new Array(34).fill(0),
    b1296: new Array(34).fill(0),
  };

  return bandArrays;
}

// Inicializar contadores de bandas
function initializeBandCounters() {
  return {
    bac: 0,
    b0c: 0,
    b1c: 0,
    b3c: 0,
    b5c: 0,
    b7c: 0,
    b10c: 0,
    b13c: 0,
    b14c: 0,
    b18c: 0,
    b21c: 0,
    b24c: 0,
    b28c: 0,
    b40c: 0,
    b50c: 0,
    b70c: 0,
    b144c: 0,
    b432c: 0,
    b1296c: 0,
  };
}

// Función para simular delay (equivalente a DelayEnSegundos)
function delay(segundos) {
  return new Promise((resolve) => setTimeout(resolve, segundos * 1000));
}

// Función para realizar petición HTTP (equivalente a getURL)
async function getURL(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    return text;
  } catch (error) {
    console.error("Error fetching URL:", error);
    return "";
  }
}

// Función para manejar errores y redirecciones (equivalente a borrar)
function handleCallNotFound(callsign) {
  // En un entorno de navegador, podrías guardar en localStorage o hacer una llamada a API
  console.warn(`Call ${callsign} not found, removing from cache`);
  // Aquí implementarías la lógica de "borrar" según tu sistema
}

// Función principal para procesar reportes
async function processReporters(band, callsign, callsign1, limit, omit) {
  // Inicializar arrays y contadores
  const bandArrays = initializeBandArrays();
  const bandCounters = initializeBandCounters();
  const bandas = new Array(20).fill(0);
  let bp = 0;

  // Construir URL
  let getURLreporters = buildReportersURL(
    band,
    callsign,
    callsign1,
    limit,
    omit,
  );

  // Verificar si es callsign especial X1
  if (callsign.toLowerCase().startsWith("x1")) {
    getURLreporters += "&reporter=";
  }

  // Obtener página
  let posicion = 1;
  let pag = await getURL(getURLreporters);

  // Verificar longitud y realizar reintentos si es necesario
  if (pag.length < 17150) {
    console.log("Primera petición insuficiente, reintentando...");
    pag = await getURL(getURLreporters);
  }

  // Verificar si hay mantenimiento
  if (pag.length < 500) {
    handleCallNotFound(callsign.trim().toUpperCase());
    await delay(1);

    // En lugar de Response.Write y Response.End, retornamos un objeto de error
    return {
      error: true,
      message: "Sorry.... On Maintenance.... Will return soon...",
      redirect: "dx.asp",
    };
  }

  // Segunda verificación de longitud
  if (pag.length < 17150) {
    handleCallNotFound(callsign.trim().toUpperCase());
    await delay(1);
    handleCallNotFound(callsign.trim().toUpperCase());

    // En lugar de Response.redirect, retornamos información de redirección
    return {
      error: true,
      redirect: `dx?nocall=${callsign.trim().toUpperCase()}`,
    };
  }

  // Si todo está bien, retornar los datos
  return {
    error: false,
    pag: pag,
    bandArrays: bandArrays,
    bandCounters: bandCounters,
    bandas: bandas,
    bp: bp,
    posicion: posicion,
    url: getURLreporters,
  };
}

// Función auxiliar para mostrar mensaje de mantenimiento
function showMaintenanceMessage() {
  const message = `
        <br><br><br><br>
        <center>
            <i><b>Sorry.... On Maintenance.... Will return soon...</b></i><br><br>
            <a href="dx.asp" target="_self">
                <i><b>Or try a fresh start</b></i>
            </a>
        </center>
    `;

  // En lugar de escribir directamente al DOM, retornas el HTML
  return message;
}
/*
// Ejemplo de uso
async function ejemploDeUso() {
    const band = window.getParamSafe("band", "");
    const callsign = window.getParamSafe("call", "").trim().toUpperCase();
    const callsign1 = window.getParamSafe("call", "").trim().toUpperCase();
    const limit = window.getParamSafe("timeLimit", "24");
    const omit = window.getParamSafe("omit", "") !== "" ? "1" : "0";

    try {
        const result = await processReporters(band, callsign, callsign1, limit, omit);

        if (result.error) {
            if (result.message) {
                // Mostrar mensaje de mantenimiento
                document.body.innerHTML = result.message;
            } else if (result.redirect) {
                // Realizar redirección
                window.location.href = result.redirect;
            }
        } else {
            // Procesar datos exitosamente
            console.log("Datos obtenidos exitosamente");
            console.log("Longitud de página:", result.pag.length);
            console.log("URL utilizada:", result.url);
            // Continuar con el procesamiento...
        }
    } catch (error) {
        console.error("Error en el procesamiento:", error);
    }
}
*/
