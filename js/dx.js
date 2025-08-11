// Configuración global
window.getParamSafe = (key, defaultValue = "", encode = false) => {
  const params = new URLSearchParams(window.parent.window.location.search);
  const value = params.get(key);
  if (value === null || value.trim() === "") return defaultValue;
  return encode ? encodeURIComponent(value) : value.trim();
};

// 1. Array de meses (índices del 1 al 12)
const mes = [
  null, // Para que mes[1] sea "January"
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
const datos = Array(3000)
  .fill(null)
  .map(() => Array(3).fill(null));
const estaciones = Array(3000)
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
const fechaEjemplo = new Date();
console.log("Fecha formateada:", fechayDia(fechaEjemplo));
