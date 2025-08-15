// Configuración global
// https://lu7aa.org/balloonGmap.html
window.getParamSafe = (key, defaultValue = "", encode = false) => {
  const params = new URLSearchParams(window.parent.window.location.search);
  const value = params.get(key);
  if (value === null || value.trim() === "") return defaultValue;
  return encode ? encodeURIComponent(value) : value.trim();
};
window.homeloc = "";
window.et = [];
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
const mapsize = 2160; // ancho del mapa, alto del mapa = pxx/2
const bana = [];

// Fecha de referencia
const fromDate = new Date("2021-01-01 00:00:00");

// Variables de configuración
let callsign, band, limit, calli;

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
// let datos = Array(3001)
//   .fill()
//   .map(() => Array(4).fill(""));
// let estaciones = Array(3001)
//   .fill()
//   .map(() => Array(8).fill(""));
const estacion = Array(3001).fill("");
// Inicializar array bidimensional estac (equivalente a Dim estac(20,20))
const estac = Array(21)
  .fill()
  .map(() => Array(21).fill(""));

// Inicializar array bande
const bande = Array(21).fill("");
let lastz = -1;
let n = 0;
let o = 0;

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

// ### FUNCTIONS ###

// Función de delay (usando Promise para ser no-bloqueante)
function delayEnSegundos(segundos) {
  return new Promise((resolve) => setTimeout(resolve, segundos * 1000));
}

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

// Funciones auxiliares para compatibilidad con ASP
function padLeft(str, length, padChar = "0") {
  return String(str).padStart(length, padChar);
}

function right(str, length) {
  return String(str).slice(-length);
}

function left(str, length) {
  return str.substring(0, length);
}

// Función para obtener el contenido desde la URL remota
async function fetchReporters(params) {
  //const baseUrl = "/api/v1/wsprNetwork";
  const baseUrl = "https://balloons.dev.browxy.com/api/v1/wsprNetwork";

  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const pag = await response.text();
    return pag;
  } catch (error) {
    console.error("Error al obtener datos:", error);
    return "";
  }
}

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

  return { estacion, o };
}

function procesarEstaciones(estacion, o) {
  if (!estacion.length) {
    return { estaselect: "", o };
  }
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
    const bs = window.getParamSafe("bs");
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
    const call = window.getParamSafe("call");
    let addaster = "";
    if (call.length > 0 && call.charAt(call.length - 1) === "*") {
      addaster = " " + call.toUpperCase();
    }

    // Completar el select
    estaselect += `</select><br>Recent ${o + 1}${addaster}<br>${tipob} Calls</b></i>\n`;

    return { estaselect, o };
  }

  return { estaselect: "", o };
}

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

// Migración ASP a JavaScript - Parte 3

// Función para construir Parámetros de reportes
function buildReporterParameters({ band, callsign, callsign1, limit, omit }) {
  const bs = window.getParamSafe("bs", "");

  if (bs === "A" || bs === "") {
    //getURLreporters = `http://wsprnetwork.browxy.com/?band=${band}&count=3000&call=${callsign}&reporter=${callsign1}&timeLimit=${limit}&sortBy=date&sortRev=1&unique=0&mode=All&excludespecial=${omit}`;
    return {
      band,
      count: "3000",
      call: callsign,
      reporter: callsign1,
      timeLimit: `${limit}`,
      sortBy: "date",
      sortRev: "1",
      unique: "0",
      mode: "All",
      excludespecial: `${omit}`,
    };
  } else if (bs === "B") {
    //getURLreporters = `http://wsprnetwork.browxy.com/?band=${band}&count=3000&call=${callsign}&reporter=&timeLimit=${limit}&sortBy=date&sortRev=1&unique=0&mode=All&excludespecial=${omit}`;
    return {
      band,
      count: "3000",
      call: callsign,
      reporter: "",
      timeLimit: `${limit}`,
      sortBy: "date",
      sortRev: "1",
      unique: "0",
      mode: "All",
      excludespecial: `${omit}`,
    };
  } else {
    // getURLreporters = `http://wsprnetwork.browxy.com/?band=${band}&count=3000&reporter=${callsign}&call=&timeLimit=${limit}&sortBy=date&sortRev=1&unique=0&mode=All&excludespecial=${omit}`;
    return {
      band,
      count: "3000",
      call: "",
      reporter: callsign,
      timeLimit: `${limit}`,
      sortBy: "date",
      sortRev: "1",
      unique: "0",
      mode: "All",
      excludespecial: `${omit}`,
    };
  }
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

// Función para manejar errores y redirecciones (equivalente a borrar)
function handleCallNotFound(callsign) {
  // En un entorno de navegador, podrías guardar en localStorage o hacer una llamada a API
  console.warn(`Call ${callsign} not found, removing from cache`);
  // Aquí implementarías la lógica de "borrar" según tu sistema
}

// Función principal para procesar reportes
async function processReporters({ band, callsign, callsign1, limit, omit }) {
  // Inicializar arrays y contadores
  const bandArrays = initializeBandArrays();
  const bandCounters = initializeBandCounters();
  const bandas = new Array(20).fill(0);
  let bp = 0;

  // Construir URL
  let paramsReporters = buildReporterParameters({
    band,
    callsign,
    callsign1,
    limit,
    omit,
  });
  console.log("params>>> ", paramsReporters);
  // Verificar si es callsign especial X1
  if (callsign.toLowerCase().startsWith("x1")) {
    paramsReporters["reporter"] = "";
  }

  // Obtener página
  let posicion = 1;
  let pag = await fetchReporters(paramsReporters);

  // Verificar longitud y realizar reintentos si es necesario
  if (pag.length < 17150) {
    console.log("Primera petición insuficiente, reintentando...");
    pag = await fetchReporters(paramsReporters);
  }

  // Verificar si hay mantenimiento
  if (pag.length < 500) {
    handleCallNotFound(callsign.trim().toUpperCase());
    // await delay(1);

    // En lugar de Response.Write y Response.End, retornamos un objeto de error
    return {
      error: true,
      message: "Sorry.... On Maintenance.... Will return soon...",
      redirect: `${HOST_URL}/dx`,
      pag: "",
      bandArrays: bandArrays,
      bandCounters: bandCounters,
      bandas: bandas,
      bp: bp,
      posicion: posicion,
      paramsReporters: paramsReporters,
    };
  }

  // Segunda verificación de longitud
  if (pag.length < 17150) {
    handleCallNotFound(callsign.trim().toUpperCase());
    // await delay(1);
    //handleCallNotFound(callsign.trim().toUpperCase());

    // En lugar de Response.redirect, retornamos información de redirección
    return {
      error: true,
      redirect: `${HOST_URL}/dx?nocall=${callsign.trim().toUpperCase()}`,
      pag: "",
      bandArrays: bandArrays,
      bandCounters: bandCounters,
      bandas: bandas,
      bp: bp,
      posicion: posicion,
      paramsReporters: paramsReporters,
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
    paramsReporters: paramsReporters,
  };
}

// Función auxiliar para mostrar mensaje de mantenimiento
function showMaintenanceMessage() {
  const message = `
        <br><br><br><br>
        <center>
            <i><b>Sorry.... On Maintenance.... Will return soon...</b></i><br><br>
            <a href="${HOST_URL}/dx" target="_self">
                <i><b>Or try a fresh start</b></i>
            </a>
        </center>
    `;

  // En lugar de escribir directamente al DOM, se retorna el HTML
  return message;
}

// Función principal para procesar tabla de datos
//function procesarTablaDatos(pag, posicion, ocall, tcall, tdate, tbanda, tloc, thome, tsnr, tkm, tpwr, dic, estac, bande, bana) {
function procesarTablaDatos(pag, posicion) {
  // Buscar tabla
  const tabla = buscarTag("<table>", "</table>", pag, posicion);
  if (!tabla) {
    console.error("No se encontró tabla");
    return null;
  }

  // Dividir tabla por filas
  const tablam = splitASP(tabla, "<tr>", 3000, 1);

  // Obtener horas inicial y final
  const horainicial = tablam[tablam.length - 1]
    ? tablam[tablam.length - 1].substring(24, 40)
    : "";
  const horafinal = tablam[2] ? tablam[2].substring(24, 40) : "";

  // Inicializar variables
  let j = 1,
    n = 0;
  let posi = 13,
    dmin = 0,
    dmax = 23;

  // Verificar parámetro "por"
  const por = window.getParamSafe("por", "");
  if (por !== "" && por.toUpperCase() === "D") {
    posi = 10;
  }

  const calli = window.getParamSafe("call", "").trim().toUpperCase();

  // Inicializar arrays
  const datos = Array(tablam.length)
    .fill()
    .map(() => Array(4).fill(0));
  const estaciones = Array(tablam.length)
    .fill()
    .map(() => Array(7).fill(""));

  let ultimo = "";
  let home = "";
  let lichome = "";
  let pwr = "";
  let iib = 0,
    iis = 0;
  let pwro = "";
  let lastz = -1; // Asumiendo que lastz viene del código anterior

  // Procesar cada fila
  for (let i = 2; i < tablam.length; i++) {
    // Limpiar fila
    tablam[i] = replaceAll(tablam[i], " align='right'", "");
    tablam[i] = replaceAll(tablam[i], " align='left'", "");
    tablam[i] = replaceAll(tablam[i], "&nbsp;", "");

    // Procesar datos de la fila
    let datosmod = replaceAll(tablam[i], "<tr>", "");
    datosmod = replaceAll(datosmod, "</tr>", "");
    datosmod = replaceAll(datosmod, "</td>", "");

    const datos1 = splitASP(datosmod, "<td>", 13, 1);

    // Procesar primera fila de datos (i=2)
    if (i === 2) {
      let ok = false;

      // Verificar si call está vacío
      const callParam = window.getParamSafe("call", "");
      if (callParam === "") {
        ok = true;
      } else {
        // Verificar si coincide con ocall o tcall
        if (datos1[ocall] === callParam || datos1[tcall] === callParam) {
          ok = true;
        }
      }

      // Si no está ok, manejar redirección
      if (!ok) {
        const serverName = window.parent.window.location.hostname;
        const scriptName = window.parent.window.location.pathname;
        const queryString = window.parent.window.location.search.substring(1);
        const reloadUrl = `https://${serverName}${scriptName}?${queryString}`;

        return {
          error: true,
          message: `Reload... or Press F5...    ${reloadUrl}`,
          redirect: reloadUrl,
        };
      }

      // Establecer valores iniciales
      ultimo = datos1[tdate] || "";
      if (calli === datos1[ocall]) {
        home = datos1[thome] || "";
        lichome = datos1[ocall] || "";
      } else {
        home = datos1[tloc] || "";
        lichome = datos1[tcall] || "";
      }
      pwr = datos1[7] || "";
    }

    // Verificar si ya existe la combinación fecha/banda
    const fechaCorta = (datos1[tdate] || "").substring(0, posi);
    const bandaCorta = datos1[tbanda] || "";

    if (
      j > 1 &&
      datos[j - 2][0] === fechaCorta &&
      datos[j - 2][1] === bandaCorta
    ) {
      // Incrementar contador existente
      if (calli === datos1[ocall]) {
        datos[j - 2][ocall] = (datos[j - 2][ocall] || 0) + 1;
      } else {
        datos[j - 2][tcall] = (datos[j - 2][tcall] || 0) + 1;
      }
    } else {
      // Crear nueva entrada
      datos[j - 1][0] = fechaCorta;
      datos[j - 1][1] = (datos1[tbanda] || "").substring(0, 4);
      datos[j - 1][2] = (datos[j - 1][2] || 0) + 1;
      datos[j - 1][3] = datos1[tcall] || "";

      // Determinar licencia
      let licen1 = "";
      if (calli === datos1[ocall]) {
        licen1 = datos1[tcall] || "";
      } else {
        licen1 = datos1[ocall] || "";
      }

      // Verificar si la estación ya existe
      let noesta = true;
      for (let k = 0; k < n; k++) {
        if (estaciones[k][2] === licen1) {
          noesta = false;
          break;
        }
      }

      // Si es nueva estación, agregarla
      if (noesta) {
        const fechaStr = datos1[tdate] || "";
        const mesNum = fechaStr.substring(5, 7);
        const mesNombre = getMes(mesNum);
        const fechaFormateada =
          mesNombre + "-" + fechaStr.substring(fechaStr.length - 8);

        if (calli === datos1[ocall]) {
          estaciones[n][0] = fechaFormateada;
          estaciones[n][1] = (datos1[tbanda] || "").substring(0, 4);
          estaciones[n][2] = datos1[tcall] || "";
          estaciones[n][3] = datos1[tloc] || "";
          estaciones[n][4] = datos1[tsnr] || "";
          estaciones[n][5] = datos1[tkm] || "";
          estaciones[n][6] = datos1[tpwr] || "";
        } else {
          estaciones[n][0] = fechaFormateada;
          estaciones[n][1] = (datos1[tbanda] || "").substring(0, 4);
          estaciones[n][2] = datos1[ocall] || "";
          estaciones[n][3] = datos1[thome] || "";
          estaciones[n][4] = datos1[tsnr] || "";
          estaciones[n][5] = datos1[tkm] || "";
          estaciones[n][6] = datos1[tpwr] || "";
        }
        n = n + 1;
      }

      // Actualizar contador de estación existente
      for (let p = n - 1; p >= 0; p--) {
        if (estaciones[p][2] === licen1) {
          estaciones[p][7] = (parseInt(estaciones[p][7]) || 0) + 1;
          break;
        }
      }

      // Procesar banda
      const banx = dic.get(datos[j - 1][1]);
      if (banx !== undefined && banx !== "") {
        const pp = Math.floor(parseInt(datos1[tkm] || "0") / 1000);
        estac[pp][banx] = (estac[pp][banx] || 0) + 1;

        let found = false;
        let z = 0;
        for (z = 0; z <= lastz; z++) {
          if (parseInt(banx) === parseInt(bande[z])) {
            found = true;
            break;
          }
        }

        if (!found) {
          bande[z] = banx;
          lastz = lastz + 1;

          const s1 = parseInt(
            datos[j - 1][0].substring(datos[j - 1][0].length - 2),
          );
          const s2 = datos[j - 1][2];

          if (!bana[banx]) bana[banx] = {};
          bana[banx][s1] = (bana[banx][s1] || 0) + s2;
          bana[banx][32] = (bana[banx][32] || 0) + s2;
        }
      }

      j = j + 1;
    }

    // Actualizar contadores finales
    if (datos1[ocall] === calli) {
      iib = iib + 1;
      pwro = datos1[tpwr] || "";
    }
    if (datos1[tcall] === calli) {
      iis = iis + 1;
    }
  }

  return {
    error: false,
    horainicial: horainicial,
    horafinal: horafinal,
    datos: datos,
    estaciones: estaciones,
    ultimo: ultimo,
    home: home,
    lichome: lichome,
    pwr: pwr,
    iib: iib,
    iis: iis,
    pwro: pwro,
    n: n,
    j: j,
    tabla: tabla,
    tablam: tablam,
  };
}

// Migración ASP a JavaScript - Parte 5

// Función para calcular horas activo (equivalente a horasactivo)
function horasactivo(toDate, fromDate) {
  // Convertir fechas de formato "2021-10-30 18:32" a Date objects
  const toDateObj = new Date(toDate.replace(/-/g, "/"));
  const fromDateObj = new Date(fromDate.replace(/-/g, "/"));

  // Calcular diferencia en horas
  const diffMs = fromDateObj.getTime() - toDateObj.getTime();
  const hs = Math.floor(diffMs / (1000 * 60 * 60));

  if (hs > 0) {
    if (hs > 48) {
      return Math.floor((hs + 12) / 24) + "d";
    } else {
      return hs + "h";
    }
  } else if (hs < 1) {
    // Calcular diferencia en minutos
    const mins = Math.floor(diffMs / (1000 * 60));
    return Math.floor(mins) + "'";
  }
  return "";
}

function fh(fechaStr) {
  // Retorna la hora de la cadena si es válida, o 0 si no lo es
  if (typeof fechaStr !== "string") return 0;
  const hora = parseInt(fechaStr.substring(11, 13));
  return isNaN(hora) ? 0 : hora;
}

function fd(fechaStr) {
  // Retorna el día de la cadena si es válida, o 0 si no lo es
  if (typeof fechaStr !== "string") return 0;
  const dia = parseInt(fechaStr.substring(8, 10));
  return isNaN(dia) ? 0 : dia;
}
// Función para obtener nombres de meses (equivalente a mes() de ASP)
// function getMes(numeroMes) {
//   const meses = [
//     "",
//     "Jan",
//     "Feb",
//     "Mar",
//     "Apr",
//     "May",
//     "Jun",
//     "Jul",
//     "Aug",
//     "Sep",
//     "Oct",
//     "Nov",
//     "Dec",
//   ];
//   const num = parseInt(numeroMes, 10);
//   return meses[num] || "";
// }

function getMes(numeroMes) {
  const meses = [
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
  return meses[numeroMes - 1] || "";
}

// Función getMes completa con nombres largos también (opcional)
function getMesCompleto(numeroMes, formato = "corto") {
  const mesesCortos = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const mesesLargos = [
    "",
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

  const num = parseInt(numeroMes, 10);

  if (formato === "largo") {
    return mesesLargos[num] || "";
  } else {
    return mesesCortos[num] || "";
  }
}

// Función principal de procesamiento
function procesarReportesDeDatos(
  horainicial,
  horafinal,
  iib,
  iis,
  bana,
  estac,
  bande,
  lastz,
  did,
  datos,
  j,
  ultimo,
  home,
  estaciones,
  n,
) {
  // Calcular horas activo
  const hactivo = horasactivo(horainicial, horafinal);

  // Calcular porcentajes de Beacon/Spotter
  let rf = "";
  if (iis === 0 && iib === 0) {
    rf = " ";
  } else {
    const totals = iib + iis;
    if (iib > 0) {
      rf = Math.round((iib / totals) * 100) + "% as Beacon";
      if (iis > 0) rf += "<br>";
    }
    if (iis > 0) {
      rf += Math.round((iis / totals) * 100) + "% as Spotter";
    }
  }

  // Asignar contadores de bandas (equivalente a bac=bana(1,32), etc.)
  const bandCounters = {
    bac: (bana[1] && bana[1][32]) || 0,
    b0c: (bana[2] && bana[2][32]) || 0,
    b1c: (bana[3] && bana[3][32]) || 0,
    b3c: (bana[4] && bana[4][32]) || 0,
    b5c: (bana[5] && bana[5][32]) || 0,
    b7c: (bana[6] && bana[6][32]) || 0,
    b10c: (bana[7] && bana[7][32]) || 0,
    b13c: (bana[8] && bana[8][32]) || 0,
    b14c: (bana[9] && bana[9][32]) || 0,
    b18c: (bana[10] && bana[10][32]) || 0,
    b21c: (bana[11] && bana[11][32]) || 0,
    b24c: (bana[12] && bana[12][32]) || 0,
    b28c: (bana[13] && bana[13][32]) || 0,
    b40c: (bana[14] && bana[14][32]) || 0,
    b50c: (bana[15] && bana[15][32]) || 0,
    b70c: (bana[16] && bana[16][32]) || 0,
    b144c: (bana[17] && bana[17][32]) || 0,
    b432c: (bana[18] && bana[18][32]) || 0,
    b1296c: (bana[19] && bana[19][32]) || 0,
  };

  // Crear arrays de bandas
  const bandArrays = {
    ba: new Array(32),
    b0: new Array(32),
    b1: new Array(32),
    b3: new Array(32),
    b5: new Array(32),
    b7: new Array(32),
    b10: new Array(32),
    b13: new Array(32),
    b14: new Array(32),
    b18: new Array(32),
    b21: new Array(32),
    b24: new Array(32),
    b28: new Array(32),
    b40: new Array(32),
    b50: new Array(32),
    b70: new Array(32),
    b144: new Array(32),
    b432: new Array(32),
    b1296: new Array(32),
  };

  // Llenar arrays de bandas
  for (let p = 0; p < 32; p++) {
    bandArrays.ba[p] = (bana[1] && bana[1][p]) || 0;
    bandArrays.b0[p] = (bana[2] && bana[2][p]) || 0;
    bandArrays.b1[p] = (bana[3] && bana[3][p]) || 0;
    bandArrays.b3[p] = (bana[4] && bana[4][p]) || 0;
    bandArrays.b5[p] = (bana[5] && bana[5][p]) || 0;
    bandArrays.b7[p] = (bana[6] && bana[6][p]) || 0;
    bandArrays.b10[p] = (bana[7] && bana[7][p]) || 0;
    bandArrays.b13[p] = (bana[8] && bana[8][p]) || 0;
    bandArrays.b14[p] = (bana[9] && bana[9][p]) || 0;
    bandArrays.b18[p] = (bana[10] && bana[10][p]) || 0;
    bandArrays.b21[p] = (bana[11] && bana[11][p]) || 0;
    bandArrays.b24[p] = (bana[12] && bana[12][p]) || 0;
    bandArrays.b28[p] = (bana[13] && bana[13][p]) || 0;
    bandArrays.b40[p] = (bana[14] && bana[14][p]) || 0;
    bandArrays.b50[p] = (bana[15] && bana[15][p]) || 0;
    bandArrays.b70[p] = (bana[16] && bana[16][p]) || 0;
    bandArrays.b144[p] = (bana[17] && bana[17][p]) || 0;
    bandArrays.b432[p] = (bana[18] && bana[18][p]) || 0;
    bandArrays.b1296[p] = (bana[19] && bana[19][p]) || 0;
  }

  // Ordenar bandas (bubble sort)
  for (let v = 0; v < lastz - 1; v++) {
    for (let w = v + 1; w <= lastz; w++) {
      if (bande[w] < bande[v]) {
        const savev = bande[v];
        bande[v] = bande[w];
        bande[w] = savev;
      }
    }
  }

  // Generar datos para gráfico de distancia (dxkm)
  let smax = 0;
  let dxkm = "\n";
  const feh = new Date();
  const fed = `[new Date(${feh.getFullYear()}, ${String(feh.getMonth() + 1).padStart(2, "0")}, ${String(feh.getDate()).padStart(2, "0")}, `;

  for (let s = 0; s < 20; s++) {
    dxkm += `\t[${Math.floor(s * 1000)}, `;
    const ini = lastz > 5 ? 1 : 0;

    for (let k = 0; k <= lastz; k++) {
      if (estac[s][bande[k]] !== 0) {
        dxkm += `${estac[s][bande[k]]}, 'At ${s * 1000} Km.\\n${estac[s][bande[k]]} Reports\\n On ${did.get(bande[k])} MHz', `;
        if (s > smax) smax = s;
      } else {
        dxkm += `0, 'At ${s * 1000} Km.\\n${estac[s][bande[k]]} Reports\\n On ${did.get(bande[k])} MHz', `;
      }
    }
    dxkm = dxkm.substring(0, dxkm.length - 2) + "],\n";
  }
  dxkm = dxkm.substring(0, dxkm.length - 2) + "\n";
  const dxkm1 = dxkm.replace(/\n/g, "").replace(/\t/g, "");

  // Preparar datos de estaciones
  n = n - 1;
  const fracciondia =
    (parseInt(ultimo.substring(11, 13)) +
      parseInt(ultimo.substring(14, 16)) / 60) /
    24;

  // Generar matriz et (estaciones)
  /*
  let et = `var homeloc="${home}"; var et=[\n`;
  for (let w = 0; w <= n; w++) {
    et += "[";
    for (let u = 0; u < 8; u++) {
      et += `"${estaciones[w][u] || ""}"${u < 7 ? "," : ""}`;
    }
    et += `]${w < n ? "," : ""}\n`;
  }
  et += "]";
*/
  //let et = `var homeloc="${home}"; var et=[\n`;
  window.homeloc = home;

  for (let w = 0; w <= n; w++) {
    // window.et[w] = []; //et += "[";
    window.et.push([]);
    for (let u = 0; u < 8; u++) {
      window.et[w].push(estaciones[w][u] || "");
    }
    //et += `]${w < n ? "," : ""}\n`;
  }
  //et += "]";
  const last = j - 1;

  // Determinar rango de fechas/horas
  const por = window.getParamSafe("por", "");
  let dmax, dmin;
  if (por === "" || por.toUpperCase() === "H") {
    dmax = fh(datos[3][0]);
    dmin = fh(datos[last][0]);
  }

  return {
    hactivo,
    rf,
    bandCounters,
    bandArrays,
    dxkm1,
    dxkm,
    et,
    fracciondia,
    smax,
    last,
    dmax,
    dmin,
    n,
  };
}

// Función agregar (equivalente a la función ASP)
function agregarBanda(banda, k, nombre, columns, cols, bandas, bp) {
  const result = {
    columns: columns + `\tdata.addColumn('number', '${nombre}');\n`,
    cols: cols,
    bandas: [...bandas],
    bp: bp,
  };

  result.columns += `\tdata.addColumn({type: 'string', role: 'tooltip'});\n`;
  result.bandas[bp] = banda;
  result.bp = bp + 1;

  if (nombre === "LF") nombre = "LF 0.137 MHz";
  if (nombre === "MF") nombre = "MF 0.475 MHz";

  result.cols += `\t\t\t['${nombre}',${k}],\n`;

  return result;
}

// Función para generar minutos (equivalente a función minutos ASP)
function generarMinutos(
  banda,
  bandas,
  bp,
  datos,
  last,
  delta,
  fracciondia,
  bandArrays,
) {
  const por = window.getParamSafe("por", "");
  let desde, hasta;
  let datas = "";

  if (por === "" || por.toUpperCase() === "H") {
    desde = 0;
    hasta = 23;
  } else {
    desde = fd(datos[last][0]);
    hasta = fd(datos[3][0]);
  }

  for (let i = desde; i <= hasta; i++) {
    let resulta = "";

    if (por === "" || por.toUpperCase() === "H") {
      let nv = i + delta;
      if (nv > 23) nv = nv - 24;
      if (nv < 0) nv = nv + 24;
      const anio = new Date(datos[last][0].substring(0, 10)).getFullYear();
      resulta = `\t[new Date(${anio}, 12, 31, ${String(nv).padStart(2, "0")}, 00, 00), `;
    } else {
      const nv = i - desde;
      const fech = new Date(datos[last][0]);
      fech.setDate(fech.getDate() + nv);
      const nuevafech = `${fech.getFullYear()}, ${String(fech.getMonth()).padStart(2, "0")}, ${String(fech.getDate()).padStart(2, "0")}, ${String(fech.getHours()).padStart(2, "0")}, 00, 00`;
      resulta = `\t[new Date(${nuevafech}), `;
    }

    for (let j = 0; j < bp; j++) {
      const nv = i - desde;
      let valor;

      if (por === "" || por.toUpperCase() === "H") {
        const matriz = bandArrays[bandas[j]];
        valor = matriz[nv] || 0;
      } else {
        const fech = new Date(datos[last][0]);
        fech.setDate(fech.getDate() + nv);
        valor =
          bandArrays[bandas[j]][String(fech.getDate()).padStart(2, "0")] || 0;
        if (fracciondia < 0.95 && fracciondia > 0.05 && i === hasta) {
          valor = Math.floor(valor / fracciondia);
        }
      }

      resulta += valor + ", ";

      const hr = por.toUpperCase() === "D" ? "Day" : "Hour";
      let dh;

      if (por.toUpperCase() === "D") {
        const fech = new Date(datos[last][0]);
        fech.setDate(fech.getDate() + nv);
        dh = String(fech.getDate()).padStart(2, "0");
      } else {
        let t = i + delta;
        if (t > 23) t = t - 24;
        if (t < 0) t = t + 24;
        dh = String(t).padStart(2, "0");
      }

      let bandasb = bandas[j].replace("b", "");
      if (bandasb === "1") bandasb = "1.8";
      if (bandasb === "3") bandasb = "3.5";
      if (bandasb === "0") bandasb = "0.475";
      if (bandasb === "a") bandasb = "0.137";

      resulta += `'For ${bandasb} MHz\\nAt ${hr}: ${dh}\\n${valor} Reports', `;
    }

    resulta = resulta.substring(0, resulta.length - 2) + "],\n";
    datas += resulta;
  }

  return datas;
}

// Función principal para configurar gráficos
function configurarGraficos(bandCounters, bandArrays, datos, j) {
  const mesNum1 = parseInt(datos[1][0].substring(5, 7));
  const mesNum2 = parseInt(datos[j - 1][0].substring(5, 7));

  let mesdereporte = getMes(mesNum1);

  if (mesNum2 !== mesNum1) {
    mesdereporte = getMes(mesNum2) + " / " + getMes(mesNum1);
  }
  mesdereporte = mesdereporte + " " + datos[1][0].substring(0, 4);

  let columns = "";
  let datas = "";
  let cols = "";
  let bandas = [];
  let bp = 0;

  // Agregar bandas que tienen datos
  const bandasConfig = [
    { key: "bac", name: "ba", label: "LF" },
    { key: "b0c", name: "b0", label: "MF" },
    { key: "b1c", name: "b1", label: "1.8 MHz" },
    { key: "b3c", name: "b3", label: "3.5 MHz" },
    { key: "b5c", name: "b5", label: "5 MHz" },
    { key: "b7c", name: "b7", label: "7 MHz" },
    { key: "b10c", name: "b10", label: "10 MHz" },
    { key: "b13c", name: "b13", label: "13 MHz" },
    { key: "b14c", name: "b14", label: "14 MHz" },
    { key: "b18c", name: "b18", label: "18 MHz" },
    { key: "b21c", name: "b21", label: "21 MHz" },
    { key: "b24c", name: "b24", label: "24 MHz" },
    { key: "b28c", name: "b28", label: "28 MHz" },
    { key: "b40c", name: "b40", label: "40 MHz" },
    { key: "b50c", name: "b50", label: "50 MHz" },
    { key: "b70c", name: "b70", label: "70 MHz" },
    { key: "b144c", name: "b144", label: "144 MHz" },
    { key: "b432c", name: "b432", label: "432 MHz" },
    { key: "b1296c", name: "b1296", label: "1296 MHz" },
  ];

  for (const banda of bandasConfig) {
    if (bandCounters[banda.key] > 0) {
      const result = agregarBanda(
        banda.name,
        bandCounters[banda.key],
        banda.label,
        columns,
        cols,
        bandas,
        bp,
      );
      columns = result.columns;
      cols = result.cols;
      bandas = result.bandas;
      bp = result.bp;
    }
  }

  const delta = parseInt(window.getParamSafe("tz", "0")) || 0;
  const fracciondia = 0;
  datas = generarMinutos(
    " ",
    bandas,
    bp,
    datos,
    0,
    delta,
    fracciondia,
    bandArrays,
  );

  // Generar texto de emisión
  let bemit = "On ";
  for (let bb = 0; bb < bp; bb++) {
    let bbb = bandas[bb].replace("b", "");
    if (bbb === "3") bbb = "3.5";
    if (bbb === "1") bbb = "1.8";
    if (bbb === "0") bbb = "0.475";
    if (bbb === "a") bbb = "0.136";

    if (bbb !== "") bemit += bbb;
    if (bb === bp - 2) {
      bemit += " and ";
    } else if (bb < bp - 1) {
      bemit += ", ";
    }
  }
  bemit = bemit.substring(0, bemit.length - 2) + " MHz";

  return {
    mesdereporte,
    columns,
    datas,
    cols,
    bemit,
    bandas,
    bp,
  };
}

async function obtenerBeaconCsvDatos() {
  let texto = "";
  texto = await getURL(
    "https://raw.githubusercontent.com/HB9VQQ/WSPRBeacon/main/Beacon%20List.csv",
  );

  if (!texto.startsWith("ID,Call")) {
    texto = await getShareResource("ibp.txt");
  }

  const lineas = texto.split(/\r?\n/); // Maneja \r\n o \n

  return lineas;
}

async function readShareAsset({ assetOutputType, assetUrl }) {
  try {
    return await window.parent.window.readAssetFile({
      assetOutputType,
      assetUrl,
    });
  } catch (error) {
    return { statusCode: 400, data: null, error: "Something went wrong." };
  }
}

async function getShareResource(file) {
  try {
    window.HOST_URL = `${new URL(window.parent.window.location.href).origin}`;
    const assetUrl = `/api/v1/getAsset?file=${encodeURIComponent(`share/assets/${file}`)}`;
    let serverResponse;
    const response = await readAsset({
      assetOutputType: "txt",
      assetUrl,
    });
    serverResponse = response.data;

    return serverResponse;
  } catch (error) {
    console.error(error);
    return "";
  }
}

function procesarWsprBeacon(bm) {
  // Inicializar array bidimensional esta (450,5)
  const esta = Array(450)
    .fill()
    .map(() => Array(6).fill(""));
  let estacuenta = 0;

  // Array de estaciones inactivas
  const inactive = [
    "5T5PA",
    "BX6AP",
    "D4Z",
    "VE8PAT",
    "ZS1WAC",
    "YB3PET",
    "VK3AGB",
    "PY7ZC",
    "GT0SP",
    "4Z4SI",
    "PR7DEE",
    "CALL",
  ];

  // Procesar cada elemento del array bm (empezando desde índice 1 como en ASP)
  for (let i = 1; i < bm.length; i++) {
    // Dividir la línea por comas (equivalente a split(bm(i),",",100,1))
    const bl = splitASP(bm[i], ",", 100, 1);

    // Verificar si la estación está activa
    let activo = true;
    for (let k = 0; k < inactive.length; k++) {
      if (inactive[k] === bl[1]) {
        activo = false;
        break;
      }
    }

    // Si está activa, procesarla
    if (activo && bl.length > 9) {
      // esta(estacuenta,0) = bl(1)
      esta[estacuenta][0] = bl[1] || "";

      // esta(estacuenta,1) = replace(replace(replace(bl(9),chr(34),""),"vertical","vert."),"inverted","inv.")
      let antenna = bl[9] || "";
      antenna = replaceAll(antenna, '"', ""); // chr(34) = comillas dobles
      antenna = replaceAll(antenna, "vertical", "vert.");
      antenna = replaceAll(antenna, "inverted", "inv.");
      esta[estacuenta][1] = antenna;

      // esta(estacuenta,2) = replace(bl(8),chr(34),"")
      esta[estacuenta][2] = replaceAll(bl[8] || "", '"', "");

      // esta(estacuenta,3) = replace(bl(5),chr(34),"")
      esta[estacuenta][3] = replaceAll(bl[5] || "", '"', "");

      // esta(estacuenta,4) = replace(bl(2),chr(34),"")
      esta[estacuenta][4] = replaceAll(bl[2] || "", '"', "");

      estacuenta++;
    }
  }

  // Línea comentada en el original (por si la necesitas):
  // esta[estacuenta][0] = "LU1ESY";
  // esta[estacuenta][1] = "Long Wire";
  // esta[estacuenta][2] = "0 dBi";
  // esta[estacuenta][3] = "6";
  // esta[estacuenta][4] = "GF05QI";

  const estalast = estacuenta;

  // Ordenamiento burbuja (bubble sort)
  for (let i = 0; i < estalast - 1; i++) {
    for (let j = i + 1; j < estalast; j++) {
      if (esta[i][0] > esta[j][0]) {
        // Intercambiar todas las columnas
        const estasave = [
          esta[i][0],
          esta[i][1],
          esta[i][2],
          esta[i][3],
          esta[i][4],
        ];

        esta[i][0] = esta[j][0];
        esta[i][1] = esta[j][1];
        esta[i][2] = esta[j][2];
        esta[i][3] = esta[j][3];
        esta[i][4] = esta[j][4];

        esta[j][0] = estasave[0];
        esta[j][1] = estasave[1];
        esta[j][2] = estasave[2];
        esta[j][3] = estasave[3];
        esta[j][4] = estasave[4];
      }
    }
  }

  return {
    esta: esta,
    estacuenta: estacuenta,
    estalast: estalast,
  };
}

// Función auxiliar para replaceAll (si no la tienes ya)
// function replaceAll(cadena, buscar, reemplazar) {
//     if (!cadena) return "";
//     return cadena.split(buscar).join(reemplazar);
// }

// Función auxiliar para splitASP (si no la tienes ya)
// function splitASP(cadena, delimitador, limite = -1, modo = 0) {
//     if (!cadena) return [];

//     let partes = cadena.split(delimitador);

//     if (limite > 0 && partes.length > limite) {
//         const extras = partes.slice(limite - 1).join(delimitador);
//         partes = partes.slice(0, limite - 1);
//         partes.push(extras);
//     }

//     return partes;
// }

// Función para verificar si una estación está inactiva
function isInactiveStation(callSign) {
  const inactive = [
    "5T5PA",
    "BX6AP",
    "D4Z",
    "VE8PAT",
    "ZS1WAC",
    "YB3PET",
    "VK3AGB",
    "PY7ZC",
    "GT0SP",
    "4Z4SI",
    "PR7DEE",
    "CALL",
  ];
  return inactive.includes(callSign);
}

// Función para obtener información de una estación específica
function getStationInfo(esta, callSign, estacuenta) {
  for (let i = 0; i < estacuenta; i++) {
    if (esta[i][0] === callSign) {
      return {
        found: true,
        call: esta[i][0],
        antenna: esta[i][1],
        gain: esta[i][2],
        power: esta[i][3],
        locator: esta[i][4],
      };
    }
  }
  return { found: false };
}

// Función para obtener todas las estaciones como array simple
function getStationsArray(esta, estacuenta) {
  const stations = [];
  for (let i = 0; i < estacuenta; i++) {
    stations.push({
      call: esta[i][0],
      antenna: esta[i][1],
      gain: esta[i][2],
      power: esta[i][3],
      locator: esta[i][4],
    });
  }
  return stations;
}

function generarComboHTML(
  esta,
  estalast,
  datos1,
  ocall,
  tcall,
  n,
  rf,
  bemit,
  last,
  pwro,
  iib,
  estaselect,
) {
  // Inicializar combo con div principal
  let combo = `<div id='beac' style='position:absolute;top:0px;left:2px;z-index:999;width:122px;line-height:12px;'>
    <center><i><div id='espacios'><br style='line-height:63px;'></div><b><span title='Graph by Hours' style='cursor:pointer;'>
    &nbsp;By Hours<input type='radio' id='por' name='por' value='H' checked onchange="enviando();document.getElementById('enviar').submit();"></span><br><span title='Graph by Days' style='cursor:pointer;'>&nbsp;&nbsp;&nbsp;By Days<input type='radio' id='por' name='por' value='D' onchange="enviando();document.getElementById('enviar').submit();"></span><br>
    <br style='line-height:3px;'>TZone:<input type='text' id='tz' name='tz' onclick="this.value=''" title='Enter here your Hours TimeZone difference, will show in your local Time' style='cursor:pointer;font-weight:bold;' size='1' value='0' maxlength='3'><br><div id='intn' style='white-space:nowrap;'><i><b>28 Intn. WSPR<br>Beacon Project</b></i></div>
    <select id='be' name='be' style='width:84px;text-align:center;font-weight:bold;font-size:12px;line-height:12px;' onchange="javascript:enviando();document.getElementById('call').value=document.getElementById('be').value; document.getElementById('bs').value=0; setSelectedIndex(document.getElementById('bs'), '0'); document.getElementById('bs').value='B';document.getElementById('enviar').submit();">`;

  // Agregar "Select" como primera opción
  esta[0][0] = "Select";

  // Agregar opciones del select
  for (let i = 0; i <= estalast; i++) {
    if (i === 0) {
      combo += `<option value='${esta[i][1] || ""}'>${esta[i][0]}</option>\n`;
    } else {
      combo += `<option value='${esta[i][0] || ""}'>${esta[i][0]}</option>\n`;
    }
  }
  combo += "</select>\n";

  // Obtener parámetros
  const selParam = window.getParamSafe("sel", "0");
  let selx = selParam === "" ? "0" : selParam;
  if (parseInt(selx) < 0) selx = "0";

  const selxNum = parseInt(selx);

  // Obtener datos de la estación seleccionada
  const cual = esta[selxNum] ? esta[selxNum][1] || "" : "";
  const cual1 = esta[selxNum] ? esta[selxNum][2] || "" : "";
  const cual2 = esta[selxNum] ? esta[selxNum][3] || "" : "";
  const cual3 = esta[selxNum] ? esta[selxNum][4] || "" : "";

  // Determinar cantidad de reportes
  const canti = last === 9998 ? "+10K" : last.toString();

  const licencia = window.getParamSafe("call", "").trim();
  const beParam = window.getParamSafe("be", "");

  combo += "<div id='ant'><center>";

  // Mostrar información de antena si corresponde
  if (licencia.trim() === beParam && selxNum > 0) {
    const locatorFormatted =
      cual3.length >= 6
        ? cual3.substring(0, 4) + cual3.substring(4, 6).toLowerCase()
        : cual3;

    combo += `<i><b>Antena used:<br>${cual}<br>Gain: ${cual1}<br>Height: ${cual2}m.<br>Pwr: 200mW<br>Loc: <a href='http://k7fry.com/grid/?qth=${cual3}' target='_blank' title='See Location'>${locatorFormatted}</a></i>`;
  }

  // Determinar banda
  const bandParam = window.getParamSafe("band", "");
  let bandai;
  if (bandParam !== "All" && bandParam !== "") {
    if (bandParam === "3") {
      bandai = "3.5 MHz";
    } else if (bandParam === "1") {
      bandai = "1.8 MHz";
    } else if (bandParam === "0") {
      bandai = "MF";
    } else if (bandParam === "-1") {
      bandai = "LF";
    } else {
      bandai = bandParam + " MHz";
    }
  } else {
    bandai = bandParam === "" ? "All" : bandParam;
  }

  // Determinar tipo de estación
  const bsParam = window.getParamSafe("bs", "");
  let ley;
  if (bsParam === "B" || bsParam === "") {
    ley = "Spotters";
  } else if (bsParam === "A") {
    ley = "Stations";
  } else {
    ley = "Beacons";
  }

  // Información principal
  combo += `<hr style='margin-top:5px;margin-bottom:0px;'><span style='font-weight:bold'><i>For ${licencia.toUpperCase()}<br>${n + 1} ${ley}<br><a href='#' onclick='goto10()' title=' # of Reports Read&#13Click for 10K reports&#13...Will be slower....&#13But shows all data' style='text-decoration:none;'>${canti} Reports</a>`;

  // Agregar información de RF si existe
  if (rf && rf.length > 1) {
    combo += `<br><span style='color:#00000;font-size:15px;line-height:13px;font-weight:bold;'>${rf}</span>`;
  }

  // Procesar bandas
  const bandq = bemit.replace(/On\s*/i, "").trim();
  const bandqm = splitASP(bandq, " ", 20, 1);
  const bandsh = bandqm.length === 2 ? `${bandqm[0]} ${bandqm[1]}` : "All";

  combo += `<br>Band: ${bandsh}`;

  // Determinar localizador según tipo de estación
  let locati = "";
  if (
    bsParam === "B" &&
    licencia.trim().toUpperCase() === (datos1[ocall] || "")
  ) {
    locati = datos1[6] || "";
  }
  if (
    bsParam === "S" &&
    licencia.trim().toUpperCase() === (datos1[tcall] || "")
  ) {
    locati = datos1[9] || "";
  }
  if (
    (bsParam === "A" || bsParam === "") &&
    licencia.trim().toUpperCase() === (datos1[ocall] || "")
  ) {
    locati = datos1[6] || "";
  }
  if (
    (bsParam === "A" || bsParam === "") &&
    licencia.trim().toUpperCase() === (datos1[tcall] || "")
  ) {
    locati = datos1[9] || "";
  }

  // Información de potencia
  const pwri = iib > 0 ? `<br>Pwr: ${pwro} Watts` : "";

  // Agregar información de ubicación si no es beacon
  if (licencia.trim() !== beParam) {
    combo += `${pwri}<br>Loc: <a target='_blank' title='See Location' href='http://k7fry.com/grid/?qth=${locati}'>${locati}</a></i></span>\n`;
  }

  // Separador
  combo += `<hr style='margin-top:3px;margin-bottom:2px;'>\n`;

  // Botones de navegación
  const buttonStyle = `onmouseover="javascript:this.style.border='inset';" onmouseout="this.style.border='outset';" style='height:25px;width:80px;font-size:16px;line-height:11px;border:outset;border-width:4px;background-color:#4e7330;color:white;border-radius: 22px;border-color:white;cursor:pointer;text-shadow: 2px 2px 0 black, 4px 3px 0 gray;'`;
  const buttonStyle2 = `onmouseover="javascript:this.style.border='inset';" onmouseout="this.style.border='outset';" style='height:24px;width:80px;font-size:15px;line-height:11px;border:outset;border-width:4px;background-color:#4e7330;color:white;border-radius: 22px;border-color:white;cursor:pointer;text-shadow: 2px 2px 0 black, 4px 3px 0 gray;'`;
  const buttonStyle3 = `onmouseover="javascript:this.style.border='inset';" onmouseout="this.style.border='outset';" style='height:24px;width:80px;font-size:15px;line-height:11px;border:outset;border-width:3px;background-color:#4e7330;color:white;border-radius: 22px;border-color:white;cursor:pointer;text-shadow: 2px 2px 0 black, 4px 3px 0 gray;'`;

  combo = `${combo} <input type='button' name='mapa' id='mapa' title='See Map' ${buttonStyle} value='MAP' onclick='vermapa()'>
     <br style='line-height:2px;'><input type='button' name='chart' id='chart' title='See Bands Chart' ${buttonStyle2} value='CHART' onclick='verchart()'>
     <br style='line-height:2px;'><input type='button' id='km' name='km' value='DX-Km' title='See Km Chart' ${buttonStyle3} onclick='drawdxkm()'>
     <br style='line-height:2px;'><input type='button' id='pie' name='pie' value='Bands-%' title='See Pie Chart' ${buttonStyle3} onclick='verpiechart()'>
     <br style='line-height:2px;'><input type='button' id='li' name='li' value='CALLS' title='See Callsigns' ${buttonStyle3} onclick='ponercallsign()'>
     <hr style='margin-top:2px;margin-bottom:1px;'>`;

  // Agregar estaselect si existe
  if (estaselect && estaselect.length > 0) {
    combo += estaselect;
  }

  combo = `${combo} <br style='line-height:2px;'>&nbsp;&nbsp;<a href='#' target='_blank'><img title='Comment' alt='Comment' src='${imageSrcUrl["contact"]}' width='35px' height='19px' style='width:35px;height:19px;'></a>&nbsp;&nbsp;
      <a href="dxx.asp" title='Refresh User List' target=_blank style='font-size:16px;cursor:pointer;line-height:13px;vertical-align: super;text-decoration:none;font-weight:normal;'>&#x29C7;</a>
    <br><br style='line-height:1px;'><span style='font-size:16px;font-weight:bold;line-height:17px;'>
    <a href='http://wspr.rocks/topbeacons/' target='_phil'><i>Top Beacons</i></a>
    <br><a href='http://wspr.rocks/topspotters/' target='_phil'><i>Top Spotters</i></a></span>
    <span style='font-size:11px;line-height:13px;'><i><br>Courtesy of </i><a href='http://wspr.rocks/' target='_phil'><i>Phil VK7JJ</i></a></span>
    </center></div>
    </div>`;

  return combo;
}

// Función auxiliar para splitASP (si no la tienes ya definida)
// function splitASP(cadena, delimitador, limite = -1, modo = 0) {
//     if (!cadena) return [];

//     let partes = cadena.split(delimitador);

//     if (limite > 0 && partes.length > limite) {
//         const extras = partes.slice(limite - 1).join(delimitador);
//         partes = partes.slice(0, limite - 1);
//         partes.push(extras);
//     }

//     return partes;
//}

// Función para actualizar el combo en el DOM
function actualizarComboUI(
  esta,
  estalast,
  datos1,
  ocall,
  tcall,
  n,
  rf,
  bemit,
  last,
  pwro,
  iib,
  estaselect,
) {
  const comboHTML = generarComboHTML(
    esta,
    estalast,
    datos1,
    ocall,
    tcall,
    n,
    rf,
    bemit,
    last,
    pwro,
    iib,
    estaselect,
  );

  // Buscar el elemento contenedor y actualizar
  const contenedor = document.getElementById("beac");
  if (contenedor) {
    contenedor.outerHTML = comboHTML;
  } else {
    // Si no existe, agregarlo al body
    document.body.insertAdjacentHTML("beforeend", comboHTML);
  }

  return comboHTML;
}

// Función para configurar los radio buttons según parámetros URL
function configurarRadioButtons() {
  const porParam = window.getParamSafe("por", "H");
  const tzParam = window.getParamSafe("tz", "0");

  // Configurar radio button seleccionado
  const radioH = document.getElementById("por");
  const radioD = document.querySelector('input[name="por"][value="D"]');

  if (porParam === "D" && radioD) {
    radioD.checked = true;
    if (radioH) radioH.checked = false;
  } else if (radioH) {
    radioH.checked = true;
    if (radioD) radioD.checked = false;
  }

  // Configurar timezone
  const tzInput = document.getElementById("tz");
  if (tzInput) {
    tzInput.value = tzParam;
  }
}

function agregarTablaAlDOM(tabla, tablam) {
  let tablal;
  if (tabla.length > 50000) {
    tablal = 700000;
  } else {
    tablal = tabla.length;
  }

  if (tabla.length > 170) {
    let i;
    for (i = tablal; i >= 1; i--) {
      if (tabla.substring(i - 1, i + 4) === "</tr>") {
        break;
      }
    }

    let agregadot;
    if (tabla.length > 1387500) {
      let maxlen;
      if (tablam.length === 3000) {
        maxlen = "over 3000";
      } else {
        maxlen = tablam.length;
      }
      agregadot =
        "<i style='font-weight:bold;color:#333;'>Listing too large.... " +
        maxlen +
        " Reports...  Listing first 1500 Reports ...</i>";
    } else {
      let reportes;
      if (tablam.length - 1 < 1500) {
        reportes = tablam.length - 1;
      } else {
        reportes = 1500;
      }
      agregadot =
        "<i>Total Reports " +
        (tablam.length - 1) +
        "... Listing first " +
        reportes +
        " Reports....</i>";
    }

    const htmlContent =
      "<div id='lista' style='position:absolute;top:632px;left:128px;width:1079px;z-index:1;'><center><table style='line-height:10px;'>" +
      tabla.substring(0, i + 4) +
      "</table>" +
      agregadot +
      "</center></div>";

    document.getElementById("tablaContainer").innerHTML = htmlContent;
  }
}

function formatDateTime4() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  return hours + ":" + minutes;
}

async function initApp() {
  // Llenar con ceros: bana[0][0] hasta bana[19][32]
  for (let j = 0; j <= 19; j++) {
    bana[j] = [];
    for (let k = 0; k <= 32; k++) {
      bana[j][k] = 0;
    }
  }

  // Inicialización de variables usando getParamSafe
  if (getParamSafe("call") === "" || !getParamSafe("call")) {
    callsign = "*";
  } else {
    // Reemplazar espacios y tomar máximo 12 caracteres
    const callTemp = getParamSafe("call")
      .trim()
      .toUpperCase()
      .replace(/ /g, "");
    callsign = callTemp.substring(0, 12);
  }

  window.parent.document.title =
    callsign === "*" ? "DX Report" : `${callsign} DX Report`;
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

  // Validar el callsign
  try {
    validateCall(calli);
  } catch (error) {
    console.error("Error de validación:", error.message);
    // En navegador no podemos hacer Response.End, así que lanzamos error o retornamos
    window.parent.window.alert(`Carácter no permitido encontrado: ${char}`);
    throw error;
  }

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
    window.parent.window.alert(
      "Parámetro 'call' demasiado largo. Fin del procesamiento por longitud.",
    );
    throw new Error("Fin del procesamiento por longitud.");
  }

  // Si no está vacío, revisar los caracteres
  if (call !== "") {
    for (let i = 0; i < call.length - 1; i++) {
      const char = call.charAt(i);
      if (char > "z") {
        console.warn("Carácter inválido en 'call':", char);
        window.parent.window.alert(
          "Carácter inválido en 'call': " +
            char +
            ". Fin del procesamiento por carácter inválido.",
        );
        throw new Error("Fin del procesamiento por carácter inválido.");
      }
    }
  }
  const omit = window.getParamSafe("omit", "") !== "" ? "1" : "0";

  const processReports1 = await processReporters({
    band,
    callsign,
    callsign1: callsearch,
    limit,
    omit,
  });

  // NO EVALUAR ERROR PARA LA PRIMERA LLAMADA
  // if (processReports1.error) {
  //   window.parent.window.location.href = processReports1.redirect;
  //   return;
  // }

  const procesarTabla1 = procesarTabla(processReports1.pag, ocall, tcall);
  console.log("procesarTabla1", procesarTabla1);
  let procesarEstaciones1 = procesarEstaciones(
    procesarTabla1.estacion,
    procesarTabla1.o,
  );

  const callSignProcesado = procesarCallsign();
  console.log("estaciones procesadas 1", procesarEstaciones1);

  if (callSignProcesado.error) {
    window.parent.window.alert(callSignProcesado.error);
    return;
  }

  const processReports2 = await processReporters({
    band,
    callsign: callSignProcesado.callsign,
    callsign1: callSignProcesado.callsign,
    limit,
    omit: callSignProcesado.omit,
  });

  if (processReports2.error) {
    window.parent.window.location.href = processReports2.redirect;
    return;
  }

  const resultadoProcesadoDeDatos = procesarTablaDatos(
    processReports2.pag,
    processReports2.posicion,
  );

  if (resultadoProcesadoDeDatos.error) {
    console.error("Error:", resultadoProcesadoDeDatos.message);
    if (resultadoProcesadoDeDatos.redirect) {
      window.location.href = resultadoProcesadoDeDatos.redirect;
    }
  }
  console.log("resultadoProcesadoDeDatos", resultadoProcesadoDeDatos);
  const reporteDeDatosProcessor = procesarReportesDeDatos(
    resultadoProcesadoDeDatos.horainicial,
    resultadoProcesadoDeDatos.horafinal,
    resultadoProcesadoDeDatos.iib,
    resultadoProcesadoDeDatos.iis,
    bana,
    estac,
    bande,
    lastz,
    did,
    resultadoProcesadoDeDatos.datos,
    resultadoProcesadoDeDatos.j,
    resultadoProcesadoDeDatos.ultimo,
    resultadoProcesadoDeDatos.home,
    resultadoProcesadoDeDatos.estaciones,
    resultadoProcesadoDeDatos.n,
  );

  window.dxkm1 = reporteDeDatosProcessor.dxkm1;
  window.dxkm = reporteDeDatosProcessor.dxkm;

  let procesarEstaciones2 = procesarEstaciones(
    resultadoProcesadoDeDatos.estaciones,
    procesarTabla1.o,
  );
  //estaselect = procesarEstaciones(resultadoProcesadoDeDatos.estaciones, o);
  console.log("reporteDeDatosProcessor", reporteDeDatosProcessor);
  const graficosConfigurados = configurarGraficos(
    reporteDeDatosProcessor.bandCounters,
    reporteDeDatosProcessor.bandArrays,
    resultadoProcesadoDeDatos.datos,
    reporteDeDatosProcessor.last,
  );
  console.log("graficosConfigurados", graficosConfigurados);

  document.getElementById("mesDeReporte").innerText =
    graficosConfigurados.mesdereporte;
  window.columns = graficosConfigurados.columns;
  window.datas = graficosConfigurados.datas;

  const bm = await obtenerBeaconCsvDatos();
  const resultadoProcesadoWsprBeacon = procesarWsprBeacon(bm);

  console.log(
    "Estaciones procesadas:",
    resultadoProcesadoWsprBeacon.estacuenta,
  );
  console.log("Array de estaciones:", resultadoProcesadoWsprBeacon.esta);

  // Buscar una estación específica
  // const stationInfo = getStationInfo(
  //   resultadoProcesadoWsprBeacon.esta,
  //   "LU1ESY",
  //   resultadoProcesadoWsprBeacon.estacuenta,
  // );
  // if (stationInfo.found) {
  //   console.log("Estación encontrada:", stationInfo);
  // }

  // Obtener todas las estaciones como array de objetos
  // const allStations = getStationsArray(
  //   resultadoProcesadoWsprBeacon.esta,
  //   resultadoProcesadoWsprBeacon.estacuenta,
  // );
  // console.log("Todas las estaciones:", allStations);

  const comboHtml = generarComboHTML(
    resultadoProcesadoWsprBeacon.esta,
    resultadoProcesadoWsprBeacon.estalast,
    resultadoProcesadoDeDatos.datos,
    ocall,
    tcall,
    //resultadoProcesadoDeDatos.n,
    reporteDeDatosProcessor.n,
    procesarReportesDeDatos.rf,
    graficosConfigurados.bemit,
    reporteDeDatosProcessor.last,
    resultadoProcesadoDeDatos.pwro,
    resultadoProcesadoDeDatos.iib,
    //procesarEstaciones2.estaselect,
    procesarEstaciones1.estaselect,
  );

  window.n = reporteDeDatosProcessor.n;
  window.bemit = graficosConfigurados.bemit;
  document.getElementById("comboHtmlTemplate").innerHTML = comboHtml;

  window.ultimoreport = window.et[window.et.length - 1][0] + "z to ";
  if (
    window.et[window.et.length - 1][0].substring(0, 6) ==
    window.et[0][0].substring(0, 6)
  ) {
    window.ultimoreport = window.ultimoreport + window.et[0][0].slice(-5) + "z";
  } else {
    window.ultimoreport = window.ultimoreport + window.et[0][0] + "z";
  }
  window.max = 0;
  for (i = 0; i < window.et.length; i++) {
    if (window.et[i][7] * 1 > window.max) {
      window.max = window.et[i][7] * 1;
    }
  }
  window.avg = window.max * 0.666;

  agregarTablaAlDOM(
    resultadoProcesadoDeDatos.tabla,
    resultadoProcesadoDeDatos.tablam,
  );
  carga();
}
window.addEventListener("load", initApp);
