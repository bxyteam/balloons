const dateToNewDateString = (date) =>
  `new Date(${date.getFullYear()},${date.getMonth()},${date.getDate()},${date.getHours()},${date.getMinutes()},${date.getSeconds()})`;

function vorlocArrayToString(array) {
  return `[${array
    .map((item) =>
      item instanceof Date
        ? dateToNewDateString(item)
        : item
          ? item.toString()
          : "",
    )
    .join(",")}]`;
}

function dateFormatter(fechaHoraStr, full = false) {
  // Validar que la cadena tenga 14 dígitos
  if (!/^\d{14}$/.test(fechaHoraStr.trim())) {
    console.error(
      "La cadena debe tener 14 dígitos en formato 'yyyymmddHHMMSS'",
    );
    return "";
  }

  const year = fechaHoraStr.trim().substring(0, 4);
  const month = fechaHoraStr.trim().substring(4, 6);
  const day = fechaHoraStr.trim().substring(6, 8);
  const hour = fechaHoraStr.trim().substring(8, 10);
  const minute = fechaHoraStr.trim().substring(10, 12);
  const second = fechaHoraStr.trim().substring(12, 14);

  return full
    ? `${year}/${month}/${day} ${hour}:${minute}:${second}`
    : `${year}/${month}/${day} ${hour}:${minute}`;
}

function dateDiff(interval, date1, date2) {
  const ms1 =
    date1 instanceof Date ? date1.getTime() : new Date(date1).getTime();
  const ms2 =
    date2 instanceof Date ? date2.getTime() : new Date(date2).getTime();
  let diff = 0;

  switch (interval) {
    case "s": // segundos
      diff = (ms2 - ms1) / 1000;
      break;
    case "n": // minutos
      diff = (ms2 - ms1) / (1000 * 60);
      break;
    case "h": // horas
      diff = (ms2 - ms1) / (1000 * 60 * 60);
      break;
    case "d": // días
      diff = (ms2 - ms1) / (1000 * 60 * 60 * 24);
      break;
    case "m": // meses
      diff =
        (date2.getFullYear() - date1.getFullYear()) * 12 +
        (date2.getMonth() - date1.getMonth());
      break;
    case "yyyy": // años
      diff = date2.getFullYear() - date1.getFullYear();
      break;
    default:
      throw new Error("Intervalo no soportado");
  }

  return Math.floor(diff);
}

function mouser(event) {
  if (event.offsetX || event.offsetY) {
    x = event.clientX - 90;
    y = event.clientY - 50;
  } else {
    x = event.pageX;
    y = event.pageY;
  }
  if (being_dragged == true) {
    document.getElementById(element).style.left = x + "px";
    document.getElementById(element).style.top = y + "px";
  }
}
function mouse_down(ele_name) {
  being_dragged = true;
  element = ele_name;
  document.getElementById(element).style.cursor = "move";
}
function mouse_up() {
  being_dragged = false;
  document.getElementById(element).style.top = y + "px";
  document.getElementById(element).style.left = x + "px";
  document.getElementById(element).style.cursor = "auto";
}
function letsgo(wheretogo) {
  var flights = "";
  if (document.showgraph.flights.checked) {
    var flights = "&flights=1";
  }
  var nowgo =
    "balloonchart?callsign=" +
    callsign +
    "&grafico=" +
    wheretogo +
    flights +
    "&Vuelo=" +
    Vuelo;
  window.parent.window.location.href = nowgo;
}

function map(wheretogo) {
  var flights = "";
  if (document.showgraph.flights.checked) {
    var flights = "&flights=1";
  }
  var nowgo = "vor?callsign=" + wheretogo + flights + "&Vuelo=" + Vuelo;
  window.parent.window.location.href = `${HOST_URL}/${nowgo}`;
}
function loadPageVar(sVar) {
  return unescape(
    window.parent.window.location.search.replace(
      new RegExp(
        "^(?:.*[&\\?]" +
          escape(sVar).replace(/[\.\+\*]/g, "\\$&") +
          "(?:\\=([^&]*))?)?.*$",
        "i",
      ),
      "$1",
    ),
  );
}
function markbutton() {
  if (loadPageVar("grafico") != "") {
    var grafico = loadPageVar("grafico");
  } else {
    var grafico = "Height f";
  }
  for (t = 0; t < 8; t++) {
    if (document.showgraph[t].value.toUpperCase() == grafico.toUpperCase()) {
      document.showgraph[t].style.textDecoration = "underline";
      document.showgraph[t].style.fontWeight = "bold";
    }
  }
}

function mayusculaPrimeras(cadena) {
  // Verificar si la cadena tiene más de 1 carácter
  if (cadena.length > 1) {
    // Convertir a minúsculas y dividir por espacios
    const palabraMatriz = cadena.toLowerCase().split(" ");

    // Array de palabras que deben permanecer en minúsculas
    const palabrasMinusculas = ["de", "del", "y", "o", "a", "al", "m.náuticas"];

    let palabraMayuscula = "";

    // Iterar sobre cada palabra
    for (let n = 0; n < palabraMatriz.length; n++) {
      const palabra = palabraMatriz[n];

      // Si la palabra está en la lista de excepciones
      if (palabrasMinusculas.includes(palabra)) {
        palabraMayuscula += palabra + " ";
      } else {
        // Si la palabra tiene contenido, capitalizar primera letra
        if (palabra.length > 0) {
          palabraMayuscula +=
            palabra.charAt(0).toUpperCase() + palabra.slice(1) + " ";
        }
      }
    }

    // Remover el último espacio
    return palabraMayuscula.trim();
  } else {
    // Si la cadena tiene 1 carácter o menos, devolverla tal como está
    return cadena;
  }
}

async function getAltura(lat, lon) {
  const url = `https://api.opentopodata.org/v1/srtm30m?locations=${lat},${lon}`;
  const body = new URLSearchParams({ url }).toString();
  const res = await getURLXform(WEB_FETCHER_URL, body);
  console.log(res);
  try {
    const data = JSON.parse(res);
    const { results, status } = data;
    if (status === "OK") {
      const elevation = results[0].elevation;
      return elevation;
    }
    return 0;
  } catch (error) {
    console.error(error);
    return 0;
  }
}

async function getTerrain(lat, lon) {
  // Get terrain height above sea level in meters given lat lon
  let accion = "pedirterrain";

  // Verificar en caché primero
  const latlonentry = llheightCache;

  if (latlonentry) {
    const latlonentrym = latlonentry.split(";");

    for (let i = 0; i < latlonentrym.length - 1; i++) {
      const latlonm = latlonentrym[i].split(",");

      // Comparar primeros 6 caracteres de lat y lon
      if (
        latlonm[0] === lat.toString().substring(0, 6) &&
        latlonm[1] === lon.toString().substring(0, 6)
      ) {
        return parseFloat(latlonm[2]);
      }
    }
  }

  // Si no está en caché, hacer petición a la API
  if (accion === "pedirterrain") {
    const geturl1 = `https://maps.googleapis.com/maps/api/elevation/xml?sensor=true&locations=${lat},${lon}&key=${GOOGLE_API_KEY}`;

    try {
      const pag = await getURL(geturl1);
      window.Posicion = 1;
      let terrain = buscarTag("<elevation>", "</elevation>", pag);

      if (terrain === "" || terrain === null || terrain === undefined) {
        terrain = "90";
      }

      // Agregar al caché
      llheightCache += `${lat.toString().substring(0, 6)},${lon.toString().substring(0, 6)},${terrain};`;

      return parseFloat(terrain);
    } catch (error) {
      console.error("Error obteniendo elevación:", error);
      return 90; // Valor por defecto en caso de error
    }
  }
}

async function getTimezone(lat, lon, timezoneDate) {
  // Get timezone hours given lat lon
  let accion = "pedirtimezone";

  // Verificar en caché primero
  const latlonentry = lltimezoneCache;

  if (latlonentry) {
    const latlonentrym = latlonentry.split(";");

    for (let i = 0; i < latlonentrym.length - 1; i++) {
      const latlonm = latlonentrym[i].split(",");

      // Comparar primeros 6 caracteres de lat y lon
      if (
        latlonm[0] === lat.toString().substring(0, 6) &&
        latlonm[1] === lon.toString().substring(0, 6)
      ) {
        let timezone = latlonm[2];
        if (timezone === "" || timezone === undefined) {
          timezone = 0;
        }
        return parseFloat(timezone);
      }
    }
  }

  // Si no está en caché, hacer petición a la API
  if (accion === "pedirtimezone") {
    try {
      // Calcular timestamp desde epoch (1/1/1970)
      const time1970 = new Date("1970-01-01T12:00:00Z");
      const targetDate = new Date(timezoneDate);
      const seconds1970 = Math.floor(
        (targetDate.getTime() - time1970.getTime()) / 1000,
      );

      const timezoneUrl = `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lon}&timestamp=${seconds1970}&sensor=true&key=${GOOGLE_API_KEY}`;

      const pag2 = await getURL(timezoneUrl);

      // Parsear la respuesta JSON
      let jsonResponse;
      try {
        jsonResponse = JSON.parse(pag2);
      } catch (error) {
        // Si no es JSON válido, usar las funciones buscarTag originales
        window.Posicion = 1;
        const dstOffset =
          parseFloat(buscarTag('"dstOffset" : ', ",", pag2).trim()) / 3600;
        const rawOffset =
          parseFloat(buscarTag('"rawOffset" : ', ",", pag2).trim()) / 3600;

        let gettimezone = rawOffset + dstOffset;

        if (isNaN(gettimezone) || gettimezone === "") {
          gettimezone = 0;
        }

        // Agregar al caché
        lltimezoneCache += `${lat.toString().substring(0, 6)},${lon.toString().substring(0, 6)},${gettimezone};`;

        return gettimezone;
      }

      // Procesar respuesta JSON
      const dstOffset = (jsonResponse.dstOffset || 0) / 3600;
      const rawOffset = (jsonResponse.rawOffset || 0) / 3600;

      let gettimezone = rawOffset + dstOffset;

      if (isNaN(gettimezone) || gettimezone === "") {
        gettimezone = 0;
      }

      // Agregar al caché
      lltimezoneCache += `${lat.toString().substring(0, 6)},${lon.toString().substring(0, 6)},${gettimezone};`;

      return gettimezone;
    } catch (error) {
      console.error("Error obteniendo timezone:", error);
      return 0; // Valor por defecto en caso de error
    }
  } else {
    return 0;
  }
}

async function getTimezoneOffsetFromGeoTimeZone(lat, lon) {
  try {
    const url = `https://api.geotimezone.com/public/timezone?latitude=${lat}&longitude=${lon}`;
    const response = await fetch(url);
    const data = await response.json();

    console.log("Timezone data:", data);

    // Get offset in hours
    const offsetSeconds = data.offset.total_seconds || 0;
    const offsetHours = offsetSeconds / 3600;

    // Add to cache (simulate what you're doing)
    const cacheKey = `${lat.toString().substring(0, 6)},${lon.toString().substring(0, 6)},${offsetHours};`;
    lltimezoneCache += cacheKey;

    return offsetHours;
  } catch (error) {
    console.error("Error fetching timezone from GeoTimeZone:", error);
    return 0;
  }
}

function latlonTra(latlon) {
  // Dividir la cadena por "/"
  const latlons = latlon.split("/");

  // Verificar que tengamos exactamente 2 elementos (índices 0 y 1)
  if (latlons.length === 2) {
    const lat = latlons[0];
    const lon = latlons[1];

    // Verificar si termina con direcciones cardinales
    const latLastChar = lat.slice(-1);
    const lonLastChar = lon.slice(-1);

    if (
      (latLastChar === "S" || latLastChar === "N") &&
      (lonLastChar === "W" || lonLastChar === "E")
    ) {
      let latdata = "";
      let londata = "";

      // Determinar el signo según la dirección
      if (latLastChar === "S") latdata = "-";
      if (lonLastChar === "W") londata = "-";

      // Procesar latitud: formato DDMMSS
      // Grados: primeros 2 caracteres
      // Minutos: caracteres 3-4 (posición 2-3)
      // Segundos: caracteres 6-7 (posición 5-6) multiplicados por 0.6
      const latGrados = lat.substring(0, 2);
      const latMinutos = lat.substring(2, 4);
      const latSegundosRaw = lat.substring(5, 7);
      const latSegundos = Math.floor(parseInt(latSegundosRaw) * 0.6);
      const latSegundosFormatted = latSegundos.toString().padStart(2, "0");

      latdata += `${latGrados}&ordm; ${latMinutos}' ${latSegundosFormatted}"`;

      // Procesar longitud: formato DDDMMSS
      // Grados: primeros 3 caracteres
      // Minutos: caracteres 4-5 (posición 3-4)
      // Segundos: caracteres 7-8 (posición 6-7) multiplicados por 0.6
      const lonGrados = parseInt(lon.substring(0, 3)); // Convertir a número para quitar ceros
      const lonMinutos = lon.substring(3, 5);
      const lonSegundosRaw = lon.substring(6, 8);
      const lonSegundos = Math.floor(parseInt(lonSegundosRaw) * 0.6);
      const lonSegundosFormatted = lonSegundos.toString().padStart(2, "0");

      londata += `${lonGrados}&ordm; ${lonMinutos}' ${lonSegundosFormatted}"`;

      // Verificar que ambas cadenas tengan más de 8 caracteres
      if (latdata.length > 8 && londata.length > 8) {
        return `Latitud: ${latdata}&nbsp;&nbsp;&nbsp;Longitud: ${londata}`;
      }
    }
  }

  // Si no cumple las condiciones, retornar undefined o cadena vacía
  return "";
}

function cuantosDias(fecha) {
  // Extraer componentes de la fecha en formato YYYYMMDDHHMMSS
  // Año: caracteres 1-4 (posición 0-3)
  // Mes: caracteres 5-6 (posición 4-5)
  // Día: caracteres 7-8 (posición 6-7)
  // Hora: caracteres 9-10 (posición 8-9)
  // Minuto: caracteres 11-12 (posición 10-11)
  // Segundo: caracteres 13-14 (posición 12-13)

  const year = fecha.substring(0, 4);
  const month = fecha.substring(4, 6);
  const day = fecha.substring(6, 8);
  const hour = fecha.substring(8, 10);
  const minute = fecha.substring(10, 12);
  const second = fecha.substring(12, 14);

  // Crear y retornar objeto Date
  // Nota: Los meses en JavaScript van de 0-11, por eso restamos 1
  return new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day),
    parseInt(hour),
    parseInt(minute),
    parseInt(second),
  );
}

// Función para convertir radianes a grados
function degrees(valor) {
  return (valor * 180) / Math.PI;
}

// Función para convertir grados a radianes
function radians(valor) {
  return (valor * Math.PI) / 180;
}

function distancia(lat1, lon1, lat2, lon2) {
  // Convertir grados a radianes
  const lat1Rad = lat1 * DEG2RAD;
  const lat2Rad = lat2 * DEG2RAD;
  const lon1Rad = lon1 * DEG2RAD;
  const lon2Rad = lon2 * DEG2RAD;

  // Calcular distancia usando la fórmula del gran círculo
  let dist =
    Math.acos(
      Math.sin(lat1Rad) * Math.sin(lat2Rad) +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.cos(lon2Rad - lon1Rad),
    ) * 6371; // Radio de la Tierra en km

  // Asegurar que la distancia sea positiva
  if (dist < 0) {
    dist = dist * -1;
  }

  return dist;
}

// Función para calcular el rumbo (bearing) entre dos puntos
function bearing1(lat1, lat2, lon1, lon2) {
  // Convertir a radianes
  const lat1Rad = lat1 * DEG2RAD;
  const lon1Rad = lon1 * DEG2RAD;
  const lat2Rad = lat2 * DEG2RAD;
  const lon2Rad = lon2 * DEG2RAD;

  let adjust = 0;
  const a = Math.cos(lat2Rad) * Math.sin(lon2Rad - lon1Rad);
  const b =
    Math.cos(lat1Rad) * Math.sin(lat2Rad) -
    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(lon2Rad - lon1Rad);

  let bearing = 0;

  if (a === 0 && b === 0) {
    bearing = 0;
  } else if (b === 0) {
    if (a < 0) {
      bearing = (3 * PI) / 2;
    } else {
      bearing = PI / 2;
    }
  } else {
    if (b < 0) {
      adjust = PI;
    } else {
      if (a < 0) {
        adjust = 2 * PI;
      } else {
        adjust = 0;
      }
    }
    bearing = Math.atan(a / b) + adjust;
  }

  // Convertir a grados
  bearing = bearing * RAD2DEG;

  // Normalizar a 0-360 grados
  const multip = Math.floor(bearing / 360);
  bearing = bearing - multip * 360;

  // Asegurar que esté en el rango 0-360
  if (bearing < 0) {
    bearing += 360;
  }

  return bearing;
}

// Función arcocoseno (JavaScript tiene Math.acos nativo, pero mantengo compatibilidad)
function acos(x) {
  // Validar rango de entrada
  if (x < -1 || x > 1) {
    return NaN;
  }
  return Math.acos(x);
}

// Función atan2 (JavaScript tiene Math.atan2 nativo, pero implemento la lógica original)
function atan2(x, y) {
  if (y > 0) {
    return Math.atan(x / y);
  }
  if (x >= 0 && y < 0) {
    return Math.atan(x / y) + PI;
  }
  if (x < 0 && y < 0) {
    return Math.atan(x / y) - PI;
  }
  if (x > 0 && y === 0) {
    return PI / 2;
  }
  if (x < 0 && y === 0) {
    return -1 * (PI / 2);
  }
  if (x === 0 && y === 0) {
    return 0;
  }

  // Fallback usando la función nativa de JavaScript
  return Math.atan2(x, y);
}

// Función atan (JavaScript tiene Math.atan nativo)
function atan(x) {
  return Math.atan(x);
}

// Función arcoseno (JavaScript tiene Math.asin nativo, pero mantengo compatibilidad)
function asin(x) {
  // Validar rango de entrada
  if (x < -1 || x > 1) {
    return NaN;
  }
  return Math.asin(x);
}

// Funciones auxiliares para formateo (equivalentes a formatnumber de ASP)
function formatNumber(number, decimals) {
  return parseFloat(number).toFixed(decimals);
}

function formatNumberV2(
  number,
  decimals = 0,
  includeLeadingDigit = true,
  useParensForNegative = false,
  groupDigits = false,
) {
  if (isNaN(number)) return "0";

  let result = parseFloat(number).toFixed(decimals);

  if (groupDigits) {
    // Agregar comas como separadores de miles
    result = result.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  if (useParensForNegative && number < 0) {
    result = "(" + result.substring(1) + ")";
  }

  return result;
}

// Función mejorada de distancia con más precisión usando Haversine
function distanciaHaversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radio de la Tierra en kilómetros

  const lat1Rad = radians(lat1);
  const lon1Rad = radians(lon1);
  const lat2Rad = radians(lat2);
  const lon2Rad = radians(lon2);

  const dLat = lat2Rad - lat1Rad;
  const dLon = lon2Rad - lon1Rad;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Función para convertir segundos a formato días, horas, minutos, segundos
function seconds2hms(seconds) {
  let dias = 0;
  let horas = 0;
  let minutos = 0;
  let segundos = 0;

  // Calcular días si hay más de 86400 segundos (24 horas)
  if (seconds >= 86400) {
    dias = Math.floor(seconds / 86400);
    seconds = seconds - dias * 86400;
    seconds = seconds % 86400;
  }

  // Calcular horas
  if (seconds >= 3600) {
    horas = Math.floor(seconds / 3600);
    seconds = seconds % 3600;
  }

  // Calcular minutos
  if (seconds >= 60) {
    minutos = Math.floor(seconds / 60);
    segundos = seconds % 60;
  } else {
    segundos = seconds;
  }

  // Formatear resultado
  let resultado = "";
  if (dias > 0) {
    resultado = dias + "d ";
  }

  // Formatear con ceros a la izquierda
  resultado +=
    String(horas).padStart(2, "0") +
    ":" +
    String(minutos).padStart(2, "0") +
    ":" +
    String(Math.floor(segundos)).padStart(2, "0");

  return resultado;
}

// Función asíncrona para obtener ciudad más cercana usando API de Overpass
async function getCiudad(lat2, lon2) {
  let ajustes = 0;
  const latsearch = lat2;
  const lonsearch = lon2;

  // Array de ajustes para intentar con diferentes radios de búsqueda
  const ajustesArray = [0.3, 0.8, 1.8, 4, 8];

  let pag = "";
  let getURLcity = "";

  // Intentar con diferentes radios hasta encontrar resultados
  for (let i = 0; i < ajustesArray.length; i++) {
    ajustes = ajustesArray[i];

    const latslo = latsearch - ajustes;
    const latshi = latsearch + ajustes;
    const lonslo = lonsearch - ajustes;
    let lonshi = lonsearch + ajustes;

    // Ajustar longitud si excede 180 grados
    if (lonshi > 180) {
      lonshi = lonshi - 360;
    }

    try {
      getURLcity = `https://overpass-api.de/api/interpreter?data=[out:json];node["place"](${latslo},${lonslo},${latshi},${lonshi});out;`;
      console.log(getURLcity);
      pag = await getURL(getURLcity);

      // Si obtenemos suficientes datos, salir del bucle
      if (pag.length >= 500) {
        break;
      }
    } catch (error) {
      console.error("Error en petición Overpass:", error);
      continue;
    }
  }

  // Si no obtuvimos datos suficientes, retornar vacío
  if (pag.length < 500) {
    return "";
  }

  let posicion = 1;
  let distanciaminima = 10000;
  let instates = "";
  let cityname = "";
  let countrycode = "";
  let instate = "";

  // Procesar la respuesta JSON
  try {
    // Si la respuesta es JSON válido, procesarla directamente
    const jsonResponse = JSON.parse(pag);

    if (jsonResponse.elements && jsonResponse.elements.length > 0) {
      for (const element of jsonResponse.elements) {
        const latciudads = element.lat;
        const lonciudads = element.lon;

        if (element.tags) {
          // Obtener información del estado/provincia si no la tenemos
          if (instates === "" && element.tags.is_in) {
            instates = element.tags.is_in
              .replace(/"/g, "")
              .replace(/:/g, "")
              .trim();
          }

          const names = element.tags.name || "";

          if (latciudads !== undefined && lonciudads !== undefined) {
            const distanciaactual = distancia(
              latciudads,
              lonciudads,
              latsearch,
              lonsearch,
            );

            if (distanciaactual < distanciaminima) {
              cityname = names;
              instate = instates;
              // countrycode se podría obtener de element.tags["ISO3166-1"] o similar
              distanciaminima = distanciaactual;
            }
          }
        }
      }
    }
  } catch (jsonError) {
    // Fallback: usar las funciones buscarTag originales
    while (window.Posicion < pag.length - 30) {
      const latciudads = buscarTag('"lat": "', '",', pag);
      const lonciudads = buscarTag('"lon": "', '",', pag);

      if (instates === "") {
        instates = buscarTag('"is_in"', '"', pag)
          .replace(/"/g, "")
          .replace(/:/g, "")
          .trim();
      }

      const names = buscarTag('"name": "', '",', pag).replace(/"/g, "").trim();

      if (latciudads !== "" && lonciudads !== "") {
        const distanciaactual = distancia(
          parseFloat(latciudads),
          parseFloat(lonciudads),
          latsearch,
          lonsearch,
        );

        if (distanciaactual < distanciaminima) {
          cityname = names;
          instate = instates;
          distanciaminima = distanciaactual;
        }
      }

      window.Posicion++;
    }
  }

  // Construir el resultado
  let resultado = cityname;
  if (instate) {
    resultado += ", " + instate;
  }
  if (countrycode) {
    resultado += ", " + countrycode;
  }

  // Aplicar las abreviaciones y limpiezas
  const replacements = [
    ["General", "Gral."],
    ["Teniente", "Tte."],
    ["Argentina", "Arg."],
    ["South America", "SA"],
    ["country", ""],
    ["continent", ""],
    ["Rio Grande", "RG"],
    ["state", ""],
    ["gmina", ""],
    ["powiat", ""],
    ["province", ""],
    ["town", ""],
    ["village", ""],
    ["Region", ""],
    ["county", ""],
    ["city", ""],
    ["_code", ""],
    [":", ""],
  ];

  // Aplicar todos los reemplazos
  for (const [search, replace] of replacements) {
    const regex = new RegExp(search, "gi");
    resultado = resultado.replace(regex, replace);
  }

  // Limpiar espacios extra y comas duplicadas
  resultado = resultado
    .replace(/\s+/g, " ")
    .replace(/,\s*,/g, ",")
    .replace(/,\s*$/, "")
    .trim();

  return resultado;
}

function parseStations(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString.toLowerCase(), "text/html");

  const tableRows = doc.querySelectorAll("table tr");

  const stations = Array(11)
    .fill()
    .map(() => Array(5).fill(""));

  for (let i = 0; i < tableRows.length && i <= 10; i++) {
    const row = tableRows[i + 1]; // i + 1 to skip headers
    const cells = row.querySelectorAll("td");

    if (cells.length >= 7) {
      const stationNameLink = cells[0].querySelector("a");
      const stationName = stationNameLink
        ? stationNameLink.textContent.trim().toUpperCase()
        : "";

      const latitude = cells[3].textContent.trim();
      const longitude = cells[4].textContent.trim();
      const distance = cells[5].textContent.trim();
      const heardSince = cells[6].textContent.trim();

      stations[i] = [stationName, latitude, longitude, distance, heardSince];
    }
  }

  return stations;
}

// Función para procesar datos APRS
function processAprsData(rawdata, pag) {
  // Extraer datos del div específico
  rawdata = buscarTag("<div class='browselist_data'>", "</div>", rawdata);

  // Limpiar las etiquetas HTML
  rawdata = rawdata.replace(/<span class='raw_line'>/g, "");
  rawdata = rawdata.replace(/<span class='raw_line_err'>/g, "");
  rawdata = rawdata.replace(/<\/span><br \/>/g, "<br>");

  // Construir el token dinámicamente usando el callsign
  const callsign = window.getParamSafe("callsign", "").toUpperCase();
  const token = `<b><a href='?c=raw&amp;limit=&amp;call=${callsign}'>`;

  // Reemplazar el token y cerrar la etiqueta
  rawdata = rawdata.replace(new RegExp(token, "g"), " ");
  rawdata = rawdata.replace(/<\/a><\/b>&gt;/g, " ");

  // Combinar con pag
  rawdata = pag + rawdata;

  // Dividir por <br> para obtener líneas individuales
  const dataaprsfim = rawdata.split("<br>");

  // Array para almacenar temperaturas [fecha, valores]
  const temperaturas = [];

  // Procesar cada línea de datos
  for (let n = 1; n < dataaprsfim.length - 1; n++) {
    const linea = dataaprsfim[n].trim();

    if (linea.length < 22) continue; // Saltar líneas muy cortas

    try {
      // Extraer y procesar la fecha (primeros 22 caracteres)
      const fechaStr = linea.substring(0, 23).trim();
      let fechaaprs = parseAprsDate(fechaStr);

      // Verificar si la fecha es válida
      if (!fechaaprs || isNaN(fechaaprs.getTime())) {
        console.error(`Fecha inválida en línea ${n}: "${fechaStr}"`);
        continue;
      }

      // Agregar 3 horas (3/24 del día)
      fechaaprs = new Date(fechaaprs.getTime() + 3 * 60 * 60 * 1000);

      // Formatear fecha como YYYYMMDDHHMMSS
      const year = fechaaprs.getFullYear();
      const month = String(fechaaprs.getMonth() + 1).padStart(2, "0");
      const day = String(fechaaprs.getDate()).padStart(2, "0");
      const hour = String(fechaaprs.getHours()).padStart(2, "0");
      const minute = String(fechaaprs.getMinutes()).padStart(2, "0");
      const second = String(fechaaprs.getSeconds()).padStart(2, "0");

      const fechaaprsc = year + month + day + hour + minute + second;

      // Procesar telemetría dividiendo por "}"
      const telemetriam = linea.split("}");

      if (telemetriam.length > 1) {
        // Dividir la segunda parte por "="
        const telem = telemetriam[1].split("=");

        let T1 = "",
          T2 = "",
          T3 = "";

        // Extraer T1 (temperatura interna)
        if (telem.length > 1) {
          T1 = telem[1].replace(/Ti/g, "").trim();
        }

        // Extraer T2 (temperatura externa)
        if (telem.length > 2) {
          T2 = telem[2].replace(/Te/g, "").replace(/V/g, "").trim();
        }

        // Extraer T3 (voltaje)
        if (telem.length > 3) {
          const T3m = telem[3].split(" ");
          if (T3m.length > 0) {
            T3 = T3m[0].substring(0, 4).replace(/V/g, "");
          }
        }

        // Determinar el orden de temperaturas según la fecha
        let valoresTemperatura;
        const fechaComparacion = `${month}/${day}/${year}`;

        if (fechaComparacion !== "03/24/2018") {
          // Orden normal: T1, T2, T3
          valoresTemperatura = `${parseFloat(T1) || 0},${parseFloat(T2) || 0},${parseFloat(T3) || 0}`;
        } else {
          // Orden especial para 24/03/2018: T2, T1, T3
          valoresTemperatura = `${parseFloat(T2) || 0},${parseFloat(T1) || 0},${parseFloat(T3) || 0}`;
        }

        // Agregar al array de temperaturas
        temperaturas.push({
          fecha: fechaaprs,
          fechaFormateada: fechaaprsc,
          valores: valoresTemperatura,
          T1: parseFloat(T1) || 0,
          T2: parseFloat(T2) || 0,
          T3: parseFloat(T3) || 0,
        });
      }
    } catch (error) {
      console.error(`Error procesando línea ${n}:`, error);
      continue;
    }
  }

  return temperaturas;
}

// Función auxiliar para parsear fechas APRS con diferentes formatos
function parseAprsDate(fechaStr) {
  // Limpiar la cadena
  fechaStr = fechaStr.trim();

  // Formato: "2014-03-07 16:53:41 ART"
  if (fechaStr.includes(" ART")) {
    const fechaSinTimezone = fechaStr.replace(" ART", "");
    return new Date(fechaSinTimezone);
  }

  // Formato: "2014-03-07 16:53:41"
  if (fechaStr.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
    return new Date(fechaStr);
  }

  // Formato ISO: "2014-03-07T16:53:41"
  if (fechaStr.includes("T")) {
    return new Date(fechaStr);
  }

  // Otros formatos comunes
  try {
    return new Date(fechaStr);
  } catch (error) {
    console.error(`Error parsing fecha: "${fechaStr}"`);
    return null;
  }
}

// Función auxiliar para formatear fecha como en ASP
function formatDateAsAsp(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  const second = String(date.getSeconds()).padStart(2, "0");

  return year + month + day + hour + minute + second;
}

// Función para procesar una sola línea de telemetría (versión modular)
function processTelemetryLine(linea) {
  if (linea.length < 22) return null;

  try {
    const fechaStr = linea.substring(0, 22).trim();
    let fechaaprs = parseAprsDate(fechaStr);

    // Verificar si la fecha es válida
    if (!fechaaprs || isNaN(fechaaprs.getTime())) {
      console.error(`Fecha inválida: "${fechaStr}"`);
      return null;
    }

    // Agregar 3 horas
    fechaaprs = new Date(fechaaprs.getTime() + 3 * 60 * 60 * 1000);

    const telemetriam = linea.split("}");
    if (telemetriam.length <= 1) return null;

    const telem = telemetriam[1].split("=");

    const T1 = (telem[1] || "").replace(/Ti/g, "").trim();
    const T2 = (telem[2] || "").replace(/Te/g, "").replace(/V/g, "").trim();

    let T3 = "";
    if (telem[3]) {
      const T3m = telem[3].split(" ");
      T3 = T3m[0].substring(0, 4).replace(/V/g, "");
    }

    const month = String(fechaaprs.getMonth() + 1).padStart(2, "0");
    const day = String(fechaaprs.getDate()).padStart(2, "0");
    const year = fechaaprs.getFullYear();
    const fechaComparacion = `${month}/${day}/${year}`;

    let valores;
    if (fechaComparacion !== "03/24/2018") {
      valores = `${parseFloat(T1) || 0},${parseFloat(T2) || 0},${parseFloat(T3) || 0}`;
    } else {
      valores = `${parseFloat(T2) || 0},${parseFloat(T1) || 0},${parseFloat(T3) || 0}`;
    }

    return {
      fecha: fechaaprs,
      fechaFormateada: formatDateAsAsp(fechaaprs),
      valores: valores,
      T1: parseFloat(T1) || 0,
      T2: parseFloat(T2) || 0,
      T3: parseFloat(T3) || 0,
      linea: linea,
    };
  } catch (error) {
    console.error("Error procesando línea de telemetría:", error);
    return null;
  }
}

// Función simplificada para casos específicos
function extractTemperatureData(htmlData, pagData) {
  const cleanedData = cleanAprsHtml(htmlData, pagData);
  const lines = cleanedData.split("<br>");

  return lines
    .map((line, index) => {
      if (index === 0) return null; // Saltar primera línea
      return processTelemetryLine(line.trim());
    })
    .filter((item) => item !== null);
}

// Función para limpiar HTML de datos APRS
function cleanAprsHtml(rawdata, pag) {
  window.Posicion = 1;
  let cleanData = buscarTag(
    "<div class='browselist_data'>",
    "</div>",
    rawdata,
    posicion,
  );

  // Aplicar todas las limpiezas
  const replacements = [
    [/<span class='raw_line'>/g, ""],
    [/<span class='raw_line_err'>/g, ""],
    [/<\/span><br \/>/g, "<br>"],
  ];

  for (const [regex, replacement] of replacements) {
    cleanData = cleanData.replace(regex, replacement);
  }

  // Limpiar enlaces con callsign
  const callsign = window.getParamSafe("callsign", "").toUpperCase();
  if (callsign) {
    const token = `<b><a href='?c=raw&amp;limit=&amp;call=${callsign}'>`;
    cleanData = cleanData.replace(new RegExp(token, "g"), " ");
    cleanData = cleanData.replace(/<\/a><\/b>&gt;/g, " ");
  }

  return pag + cleanData;
}

// Función auxiliar para reemplazar texto (equivalente al replace de ASP)
function replaceText(
  text,
  searchValue,
  replaceValue,
  start = 0,
  count = -1,
  compareMode = 0,
) {
  if (count === -1) {
    // Reemplazar todas las ocurrencias
    return text.replace(
      new RegExp(escapeRegExp(searchValue), "g"),
      replaceValue,
    );
  } else {
    // Reemplazar un número específico de ocurrencias
    let result = text;
    let replacements = 0;
    let index = start;

    while (replacements < count && index !== -1) {
      index = result.indexOf(searchValue, index);
      if (index !== -1) {
        result =
          result.substring(0, index) +
          replaceValue +
          result.substring(index + searchValue.length);
        index += replaceValue.length;
        replacements++;
      }
    }
    return result;
  }
}

// Función para escapar caracteres especiales en regex
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Función split personalizada (JavaScript ya tiene split nativo, pero mantengo consistencia)
function splitText(text, delimiter, limit = -1) {
  if (limit === -1) {
    return text.split(delimiter);
  } else {
    return text.split(delimiter, limit);
  }
}

function procesarPagHm(pag, pag1) {
  // Reemplazar el texto específico
  pag = replaceText(
    pag,
    "20180326000333,-36.20850,-65.41633,328.0,2.0,439<br>",
    "",
    0,
    20,
    1,
  );

  window.Posicion = 1;

  // Buscar y extraer datospath (asumiendo que tienes la función buscarTag)
  let datospath = "20" + buscarTag("20", "</BODY>", pag);
  datospath = pag1 + "\r\n" + datospath; // \r\n es el equivalente a vbCr

  // Split de datospath
  let pathx = splitText(datospath, "<br>", 2500);

  // Buscar límite
  let limitefound = false;
  let limite;
  let px = "";
  for (let b = pathx.length - 1; b > 0; b--) {
    // ubound(pathx)-1 to 1 step -1
    if (!limitefound) {
      // Obtener los últimos 31 caracteres de cada elemento
      let currentRight = pathx[b].slice(-31);
      let previousRight = pathx[b - 1].slice(-31);
      if (currentRight === previousRight) {
        limite = b + 1;
      } else {
        if (currentRight.trim() !== "") {
          limitefound = true;
        }
      }
    }
  }

  // Reemplazos específicos
  datospath = replaceText(
    datospath,
    "20151003175427,-35.66650,-60.80083,68.0,62.0,20765",
    "20151003175427,-35.66650,-60.80083,68.0,62.0,18873",
    0,
    10000,
    1,
  );

  datospath = replaceText(
    datospath,
    "20151003175739,-35.63717,-60.72300,59.0,47.0,15084",
    "20151003175739,-35.63717,-60.72300,59.0,47.0,15115",
    0,
    10000,
    1,
  );

  // Split final
  let pathm = splitText(
    datospath.replace(/\r\n|\n\r|\n|\r/g, function (match) {
      return "";
    }),
    "<br>",
    10000,
  );

  // Retornar los resultados (ajusta según lo que necesites)
  return {
    pag: pag,
    datospath: datospath,
    pathx: pathx,
    pathm: pathm,
    limite: limite,
  };
}

function loadGoogleChart() {
  google.load("visualization", "1", { packages: ["corechart"] });
  google.setOnLoadCallback(drawChart);
}

function drawChart() {
  var data = new google.visualization.DataTable();
  //data.addColumn("datetime", "Hour-Local");
  //data.addColumn("datetime", "Hour-UTC");
  window.columnsChart.forEach((column) => {
    data.addColumn(column.type, column.value);
  });

  // Agrega los datos aquí si no vienen ya cargados
  data.addRows([...vorloc]);

  // Crea la vista
  const view = new google.visualization.DataView(data);

  // Selección dinámica de columnas para la vista
  view.setColumns(getViewColumns(grafico, callsign));

  // Dibuja el gráfico
  const chart = new google.visualization.LineChart(
    document.getElementById("chart_div"),
  );
  chart.draw(view, options);
}

function getViewColumns(grafico, callsign) {
  const columna = 0;
  //let diraverage = 0; // Definir si lo necesitas
  let speedaverage = 0;
  let speedaveragek = 0;

  switch (grafico) {
    case "height f":
    case "":
      return [columna, 3];
    case "height m":
      return [columna, 2];
    case "direction":
      return [
        columna,
        4,
        {
          type: "number",
          label: "Average direction in degrees for this flight",
          calc: function (dt, row) {
            return diraverage * 1;
          },
        },
      ];
    case "speed n":
      return [
        columna,
        6,
        {
          type: "number",
          label: "Average speed in knots for this flight",
          calc: function (dt, row) {
            return speedaverage * 1;
          },
        },
      ];
    case "ascent":
      return [columna, 8];
    case "lon":
      return [columna, 10];
    case "lat":
      return [columna, 9];
    case "speed k":
      return [columna, 5, 4];
    case "sp/hght":
      return [
        2,
        {
          type: "number",
          label: "Speed/height up",
          calc: function (dt, row) {
            return dt.getValue(row, 5);
          },
        },
        {
          type: "number",
          label: "Speed/height down",
          calc: function (dt, row) {
            if (dt.getValue(row, 8) <= 0) {
              return dt.getValue(row, 5);
            }
            return null;
          },
        },
        {
          type: "number",
          label: "Speed average",
          calc: function (dt, row) {
            return speedaveragek * 1;
          },
        },
      ];
    case "asc/h":
      return [
        3,
        {
          type: "number",
          label: "Asc/desc feet/min. vs height",
          calc: function (dt, row) {
            return dt.getValue(row, 8) * 60;
          },
        },
      ];
    case "temp":
      if (
        callsign.toLowerCase() === "lu7aa-11" ||
        callsign.toLowerCase() === "lu7aa-12"
      ) {
        return [columna, 12, 13, 14];
      }
      break;
    case "reach":
      return [
        columna,
        {
          type: "number",
          label: "Reach in Km. (coverage radius)",
          calc: function (dt, row) {
            return Math.floor(1.0 * 3.87 * Math.sqrt(dt.getValue(row, 2)));
          },
        },
      ];
  }

  return [columna, 3];
}

function renderChartData({
  callsign,
  launchdate,
  launchtime,
  maxtimehms,
  duracionhms,
  maxheight,
  feetdelta,
  coverage,
  avgupm,
  avgupf,
  avgdom,
  avgwsm,
  avgwsf,
  avgdof,
  recorrido,
  diraverage,
  latii1,
  lonii1,
  lati2,
  loni2,
}) {
  // const city1 = await getCiudad(latii1, lonii1);
  // const city2 = await getCiudad(lati2, loni2);
  /// console.log(city1, city2);
  document.getElementById("chartdata").innerHTML =
    `<b>${callsign.toUpperCase()} ${launchdate} Flight Synopsis</b>
  <br />From: ${launchtime} Duration: ${duracionhms}
  <br />MaxHeight: ${formatNumber(maxheight * 0.3048, 0)} m. /
  ${formatNumber(maxheight - feetdelta, 0)} feet <br />At: ${maxtimehms} Horizont: ${coverage} Km. <br />Average
  up:${avgupm} m/s / ${avgupf} feet/s <br />Avg. down:${avgdom}
  m/s / ${avgdof} feet/s<br />Wind speed: ${avgwsm} Km/h /
  ${avgwsf} knots <br />Land at: ${formatNumber(recorrido, 0)} Km /
  ${formatNumber(recorrido * 0.53996, 0)} nMiles <br />Launch to Land
  azimuth: ${formatNumber(diraverage, 2)}&#176; <br />
  <i>(This legend could be moved)</i>`;

  /*
  document.getElementById("chartdata").innerHTML =
    ` <b>${callsign.toUpperCase()} ${launchdate} Flight Synopsis</b>
  <br />From: ${launchtime} Duration: ${duracionhms}
  <br />MaxHeight: ${formatNumber(maxheight * 0.3048, 0)} m. /
  ${formatNumber(maxheight - feetdelta, 0)} feet <br />At:
  ${maxtimehms} Horizont: ${coverage} Km. <br />Average
  up: ${avgupm} m/s / ${avgupf} feet/s <br />Avg. down: ${avgdom}
  m/s / ${avgdo} feet/s<br />Wind speed: ${avgwsm} Km/h /
  ${avgws} knots <br />Land at: ${formatNumber(recorrido, 0)} Km /
  ${formatNumber(recorrido * 0.53996, 0)} nMiles <br />Launch to Land
  azimuth: ${formatNumber(diraverage, 2)} &#176; <br />From:
  ${left(city1, 27)} <br />To:
  ${left(city2, 30)}<br />&nbsp;&nbsp;&nbsp;
  <i>(This legend could be moved)</i>`;
  */
}

function showError(msg) {
  document.querySelector("form").style.height = "75dvh";
  document.getElementById("load_error").innerHTML =
    `<div style="border: 3px solid red;
        padding: 10px;
        border-radius: 5px;
        width: 300px;
        margin-top: 40px;
        box-shadow: 4px 10px 22px -17px;">
    <h3>Error initializing app:</h3>
    <p>${msg}</p>
    </div>`;
}

function ira(donde) {
  const grafico = window.getParamSafe("Grafico");
  const nowgo = `${HOST_URL}/balloonchart?callsign=${callsign}&Vuelo=${donde}&Grafico=${grafico}`;
  window.parent.window.location.href = nowgo;
}
