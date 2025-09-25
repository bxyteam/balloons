function crsdist(lat1, lon1, lat2, lon2) {
  var EARTH_RADIUS = 3440.07;
  var PI = 3.1415926535897932384626433832795;
  var DEG2RAD = 0.01745329252;
  var RAD2DEG = 57.29577951308;
  var x1 = lon1 * DEG2RAD;
  var y1 = lat1 * DEG2RAD;
  var x2 = lon2 * DEG2RAD;
  var y2 = lat2 * DEG2RAD;

  osphFrom = defSphereCoo(EARTH_RADIUS, y1, x1);
  osphTo = defSphereCoo(EARTH_RADIUS, y2, x2);

  qchordkm = Math.sqrt(
    (osphTo.xp - osphFrom.xp) * (osphTo.xp - osphFrom.xp) +
      (osphTo.yp - osphFrom.yp) * (osphTo.yp - osphFrom.yp) +
      (osphTo.zp - osphFrom.zp) * (osphTo.zp - osphFrom.zp),
  );
  distance = 2 * EARTH_RADIUS * Math.asin(qchordkm / 2 / EARTH_RADIUS);
  // Now get bearing
  a = Math.cos(y2) * Math.sin(x2 - x1);
  b =
    Math.cos(y1) * Math.sin(y2) -
    Math.sin(y1) * Math.cos(y2) * Math.cos(x2 - x1);
  adjust = 0;
  if (a == 0 && b == 0) {
    bearing = 0;
  } else if (b == 0) {
    if (a < 0) bearing = (3 * PI) / 2;
    else bearing = PI / 2;
  } else if (b < 0) adjust = PI;
  else {
    if (a < 0) adjust = 2 * PI;
    else adjust = 0;
  }
  bearing = b !== 0 ? (Math.atan(a / b) + adjust) * RAD2DEG : 0;
  out = new MakeArray(0);
  out.distance = distance;
  out.bearing = bearing;

  return out;
}
function MakeArray(n) {
  this.length = n;
  for (var i = 1; i <= n; i++) {
    this[i] = 0;
  }
  return this;
}
function defSphereCoo(rad, nw, nl) {
  var osph;
  osph = new Object();
  rad_ = rad * Math.cos(nw);
  osph.xp = rad_ * Math.cos(nl);
  osph.yp = rad_ * Math.sin(nl);
  osph.zp = rad * Math.sin(nw);
  return osph;
}
function getlatlon(lat1, lon1, bearing, distance) {
  lata1 = lat1 * DEG2RAD;
  lona1 = lon1 * DEG2RAD;
  bearing2 = bearing * DEG2RAD;
  var lata2 = Math.asin(
    Math.sin(lata1) * Math.cos(distance / EARTH_RADIUS) +
      Math.cos(lata1) * Math.sin(distance / EARTH_RADIUS) * Math.cos(bearing2),
  );
  var lona2 =
    lona1 +
    Math.atan2(
      Math.sin(bearing2) * Math.sin(distance / EARTH_RADIUS) * Math.cos(lata1),
      Math.cos(distance / EARTH_RADIUS) - Math.sin(lata1) * Math.sin(lata2),
    );
  out = new MakeArray(0);
  out.lat2 = lata2 * RAD2DEG;
  out.lon2 = lona2 * RAD2DEG;
  return out;
}

function deg_to_dms(deg) {
  if (deg < 0) {
    deg = -deg;
    var signo = "-";
  } else {
    var signo = "";
  }
  var d = Math.floor(deg);
  var minfloat = (deg - d) * 60;
  var m = Math.floor(minfloat);
  var secfloat = (minfloat - m) * 60;
  var s = Math.round(secfloat);
  // After rounding, the seconds might become 60. These two
  // if-tests are not necessary if no rounding is done.
  if (s == 60) {
    m++;
    s = 0;
  }
  if (m == 60) {
    d++;
    m = 0;
  }
  return signo + d + "º" + ("100" + m).slice(-2) + "'" + ("100" + s).slice(-2);
}
function deg_to_dm(deg) {
  if (deg < 0) {
    deg = -deg;
    var signo = "-";
  } else {
    var signo = "";
  }
  var d = Math.floor(deg);
  var minfloat = (deg - d) * 60;
  var m = minfloat.toFixed(3);
  if (m == 60) {
    d++;
    m = 0;
  }
  return signo + d + "º " + m + "'";
}

function split(str, delimiter, limit = -1, compareType = 0) {
  if (!str) return [];
  let parts = str.split(delimiter);
  if (limit > 0 && parts.length > limit) {
    parts = parts.slice(0, limit);
  }
  return parts;
}

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

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

function setParamValues() {
  if (getParamSafe("callsign") === "") {
    callsign = "LU7AA-11";
  } else {
    callsign = ucase(getParamSafe("callsign"));
  }

  if (getParamSafe("VOR1") === "") {
    VOR1 = "SRC";
    if (left(ucase(getParamSafe("callsign")), 2) === "CX") {
      VOR1 = "DUR";
    }
  } else {
    VOR1 = getParamSafe("VOR1");
    if (left(ucase(getParamSafe("callsign")), 2) === "CX") {
      VOR1 = "DUR";
    }
  }
  if (getParamSafe("VOR2") === "") {
    VOR2 = "MJZ";
    if (left(ucase(getParamSafe("callsign")), 2) === "CX") {
      VOR2 = "MHZ";
    }
  } else {
    VOR2 = getParamSafe("VOR2");
    if (left(ucase(getParamSafe("callsign")), 2) === "CX") {
      VOR2 = "MJZ";
    }
  }
  Vuelo = window.getParamSafe("Vuelo");
  autoRefParam = window.getParamSafe("AutoRef");
  flightsParam = window.getParamSafe("flights");
  refreshParam = window.getParamSafe("Refresh");
}

async function getAltura(lat, lon) {
  const url = `https://api.opentopodata.org/v1/srtm30m?locations=${lat},${lon}`;

  const body = new URLSearchParams({ url }).toString();
  const res = await getURLXform(WEB_FETCHER_URL, body);

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
  // Dividir la cadena por "/" y limitar a 2 elementos
  let latlons = latlon.split("/");

  // Verificar que tengamos exactamente 2 elementos (equivalente a ubound=1 en ASP)
  if (latlons.length === 2) {
    let lat = latlons[0];
    let lon = latlons[1];

    // Construir la cadena resultado (asumiendo que degtodms existe)
    let result =
      "Latitude: " +
      degToDMS(lat) +
      "&nbsp;&nbsp;&nbsp;Longitude: " +
      degToDMS(lon);

    // Realizar los reemplazos
    result = result.replace(/\\BA/g, "\\BA "); // Reemplazar todas las ocurrencias
    result = result.replace(/'/g, "' "); // Reemplazar todas las ocurrencias

    return result;
  }

  // Si no se cumple la condición, retornar undefined (equivalente a no asignar valor en ASP)
  return undefined;
}

function decompress(tipo, datos) {
  if (tipo === "lat") {
    const y1 = datos.charCodeAt(0);
    const y2 = datos.charCodeAt(1);
    const y3 = datos.charCodeAt(2);
    const y4 = datos.charCodeAt(3);

    let lat =
      90 -
      ((y1 - 33) * Math.pow(91, 3) +
        (y2 - 33) * Math.pow(91, 2) +
        (y3 - 33) * 91 +
        y4 -
        33) /
        380926;
    let signo = 1;

    if (lat < 0) {
      lat = lat * -1;
      signo = -1;
    }

    let grados = Math.floor(lat);
    let minutos = Math.floor((lat - grados) * 60);
    let segundos = Math.floor((lat - grados - minutos / 60) * 3600);

    if (signo < 0) {
      grados = grados * -1;
    }

    minutos = String(100 + minutos).slice(-2);
    segundos = String(100 + segundos).slice(-2);

    return grados + "&ordm;" + minutos + "'" + segundos + '"';
  }

  if (tipo === "lon") {
    const x1 = datos.charCodeAt(0);
    const x2 = datos.charCodeAt(1);
    const x3 = datos.charCodeAt(2);
    const x4 = datos.charCodeAt(3);

    let lon =
      -180 +
      ((x1 - 33) * Math.pow(91, 3) +
        (x2 - 33) * Math.pow(91, 2) +
        (x3 - 33) * 91 +
        x4 -
        33) /
        190463;
    let signo = 1;

    if (lon < 0) {
      lon = lon * -1;
      signo = -1;
    }

    let grados = Math.floor(lon);
    let minutos = Math.floor((lon - grados) * 60);
    let segundos = Math.floor((lon - grados - minutos / 60) * 3600);

    if (signo < 0) {
      grados = grados * -1;
    }

    minutos = String(100 + minutos).slice(-2);
    segundos = String(100 + segundos).slice(-2);

    return grados + "&ordm;" + minutos + "'" + segundos + '"';
  }
}

// Función para convertir radianes a grados
function degrees(valor) {
  return (valor * 180) / PI;
}

// Función para convertir grados a radianes
function radians(valor) {
  return (valor * PI) / 180;
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

function getLatLonAsp(lat1, lon1, brng, distance) {
  // Return new lat/lon from bearing and distance in nautical miles

  const R = 3440.07; // Earth radius in nautical miles

  const lata1 = lat1 * DEG2RAD;
  const lona1 = lon1 * DEG2RAD;
  const brnga = brng * DEG2RAD;
  const d = distance;

  const lata2 = Math.asin(
    Math.sin(lata1) * Math.cos(d / R) +
      Math.cos(lata1) * Math.sin(d / R) * Math.cos(brnga),
  );
  const lona2 =
    lona1 +
    Math.atan2(
      Math.sin(brnga) * Math.sin(d / R) * Math.cos(lata1),
      Math.cos(d / R) - Math.sin(lata1) * Math.sin(lata2),
    );

  return [lata2 * RAD2DEG, lona2 * RAD2DEG];
}

function degToDMS(degr) {
  degr = degr * 1; // Convert to number
  let signo = "";

  if (degr < 0) {
    signo = "-";
    degr = -degr;
  }

  const grados = Math.floor(degr);
  const minutos = Math.floor((degr - grados) * 60);
  const resto = degr - grados - minutos / 60;
  const segundos = Math.floor((degr - grados - minutos / 60) * 3600);

  const minutosFormat = String("00" + minutos).slice(-2);
  const segundosFormat = String("00" + segundos).slice(-2);

  return signo + grados + "°" + minutosFormat + "'" + segundosFormat + '"';
}

function aziLetras(grados) {
  const valor = Math.floor(grados / 22.5 + 0.5);
  const direcciones = [
    "North",
    "NorthNorthEast",
    "NorthEast",
    "EastNorthEast",
    "East",
    "EastSouthEast",
    "SouthEast",
    "SouthSouthEast",
    "South",
    "SouthSouthWest",
    "SouthWest",
    "WestSouthWest",
    "West",
    "WestNorthWest",
    "NorthWest",
    "NorthNorthWest",
  ];

  return direcciones[valor % 16];
}

function fixCityName(cnme) {
  // Crear una copia del string para trabajar
  let result = cnme;

  // Aplicar todas las sustituciones
  const replacements = [
    ["General", "Gral."],
    ["Teniente", "Tte."],
    ["Argentina", "Arg."],
    ["South America", "SA"],
    ["Rio Grande", "RG"],
    ["country", ""],
    ["continent", ""],
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

  // Aplicar cada reemplazo usando una expresión regular global case-insensitive
  replacements.forEach(([search, replace]) => {
    const regex = new RegExp(search, "gi");
    result = result.replace(regex, replace);
  });

  return result;
}

async function vorread() {
  try {
    const fileContent = await getShareResource("argvor.txt");
    const lines = fileContent.split("\n");

    //let vormatrix = [];
    help = "";
    vorloc1m = 0;
    vorloc2m = 0;

    const icono = imageSrcUrl["red-dot"];
    const iconopin = imageSrcUrl["pin"];

    // Saltar las primeras 3 líneas
    const dataLines = lines.slice(3);

    for (let line of dataLines) {
      if (!line.trim()) continue; // Saltar líneas vacías

      // Limpiar espacios y tabs múltiples
      let archivo = line;
      archivo = archivo.replace(/  +/g, " "); // Reemplazar múltiples espacios
      archivo = archivo.replace(/\t+/g, "\t"); // Reemplazar múltiples tabs

      // Dividir por tabs (asumiendo que el archivo está separado por tabs)
      const archivom = archivo.split("\t").map((field) => field.trim());

      // Determinar sender
      const sender =
        archivom[0].startsWith("C19") || archivom[0].startsWith("C07")
          ? "Uruguay"
          : "Amsat-LU";

      // Crear objeto location
      let locationObj = {
        id: archivom[0],
        lat: parseFloat(archivom[1]),
        lng: parseFloat(archivom[2]),
        magDec: parseFloat(archivom[3]),
        location: archivom[4],
        country: archivom[5],
        countryFull: archivom[6] || "",
        sender: sender,
        icon: "",
        infoWindow: "",
        m: m,
      };

      // Determinar si es launch site o VOR
      const isLaunchSite = /^C[0-4]/.test(archivom[0]);

      // Construir info window
      let infoContent = "";
      if (isLaunchSite) {
        infoContent = `Location: ${archivom[0]} ${archivom[4]}<br>`;
        infoContent += `${sender} Launch Site<br>`;
        infoContent += `<img src="icon/${archivom[0].substring(0, 3)}.png">`;
        locationObj.icon = iconopin;
      } else {
        infoContent = `VOR: ${archivom[0]} en ${archivom[4]}`;
        locationObj.icon = icono;
      }

      infoContent += `<br>Latitude:&nbsp;&nbsp;&nbsp;&nbsp;${archivom[1]}`;
      infoContent += `<br>Longitude: ${archivom[2]}`;
      infoContent += `<br>Decl.Mágn.: ${Math.abs(archivom[3])}`;
      infoContent += parseFloat(archivom[3]) < 0 ? "E&nbsp;" : "W&nbsp;";

      // Verificar VOR1 y VOR2 (estas variables deben estar definidas previamente)
      if (typeof VOR1 !== "undefined" && archivom[0] === VOR1) {
        infoContent += `<br>Radial a ${callsign}: xQpZ1`;
        infoContent += `<br>Distancia a ${callsign}: ZpQx1 Nm`;
        vorloc1m = m;
        VOR1La = archivom[1];
        VOR1Lo = archivom[2];
      }

      if (typeof VOR2 !== "undefined" && archivom[0] === VOR2) {
        infoContent += `<br>Radial a ${callsign}: xQpZ2`;
        infoContent += `<br>Distancia a ${callsign}: ZpQx2 Nm`;
        vorloc2m = m;
        VOR2La = archivom[1];
        VOR2Lo = archivom[2];
      }

      locationObj.infoWindow = infoContent;

      // Agregar al array de locations
      locations.push(locationObj);

      // Construir help string
      if (archivom[5] && archivom[5].trim() === "AG") {
        help += `${archivom[0]}  ${archivom[4]}${" ".repeat(Math.max(0, 20 - archivom[4].length))}\t`;
      } else {
        const countryName = archivom[5] ? capitalize(archivom[5]) : "";
        help += `${archivom[0]}  ${archivom[4]}, ${countryName}${" ".repeat(Math.max(0, 20 - archivom[4].length))}\t`;
      }

      if (m % 2 !== 0) help += "\n";

      // Llenar vormatrix
      vormatrix[m] = [];
      for (let n = 0; n < 7; n++) {
        vormatrix[m][n] = archivom[n]
          ? archivom[n].replace(/\t/g, "").trim()
          : "";
      }

      m++;
    }

    lastm = m - 1;
  } catch (error) {
    console.error("Error en vorread():", error);
    throw error;
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

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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

function parseStations(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString.toLowerCase(), "text/html");

  const tableRows = doc.querySelectorAll("table tr");

  const stations = Array(150)
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

function processNearStations(htmlContent, callsign) {
  // Crear parser DOM
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");

  // Variables de salida
  let vorloc = [];
  let iconomapa = "";
  let m = 0; // contador
  let proxcallsave = "";
  let proxlatsave = "";

  // Buscar todas las filas de tabla que contienen datos APRS (saltar encabezado)
  const rows = doc.querySelectorAll("table tr");

  for (let z = 1; z < Math.min(251, rows.length); z++) {
    // Empezar en 1 para saltar header
    const row = rows[z];
    const cells = row.querySelectorAll("td");

    // Verificar que la fila tenga las 7 celdas esperadas
    if (cells.length < 7) continue;

    // Estructura según tu HTML:
    // 0: Call (con enlace find.cgi)
    // 1: msg
    // 2: wx
    // 3: lat
    // 4: lon
    // 5: distance
    // 6: Last Position

    // Extraer el call sign del enlace find.cgi
    let proxcall = "";
    const callLink = cells[0].querySelector('a[href*="find.cgi?"]');
    if (callLink) {
      const href = callLink.getAttribute("href");
      // El formato es find.cgi?CALLSIGN (sin "call=")
      const match = href.match(/find\.cgi\?([^&"]+)/);
      if (match) {
        proxcall = match[1].toUpperCase().trim();
      }
    }

    // Por ahora no hay iconos en el HTML, usar uno por defecto
    // En el código original se buscaba en la página, aquí puedes implementar lógica
    // para asignar iconos según el tipo de estación
    //let proximage = "icon/none.png";
    let proximage = imageSrcUrl["pin"];

    // Extraer latitud, longitud, distancia de las celdas correspondientes
    const proxlat = cells[3].textContent.trim();
    const proxlon = cells[4].textContent.trim();
    const proxdist = cells[5].textContent.trim();

    // En este HTML no hay dirección, usar vacío o calcular
    let proxdir = "";

    // Extraer tiempo de "Last Position" (formato: DD:HH:MM:SS)
    const proxtime = cells[6].textContent.trim();

    // Procesar tiempo (formato: DD:HH:MM:SS)
    let proxtimet = "Seen ";
    if (proxtime.length >= 11) {
      const parts = proxtime.split(":");
      if (parts.length === 4) {
        const proxtimed = parts[0];
        const proxtimeh = parts[1];
        const proxtimem = parts[2];
        const proxtimes = parts[3];

        if (proxtimed !== "00") proxtimet += parseInt(proxtimed, 10) + "d ";
        if (proxtimeh !== "00") proxtimet += parseInt(proxtimeh, 10) + "h ";
        if (proxtimem !== "00") proxtimet += parseInt(proxtimem, 10) + "m ";
        if (proxtimes !== "00") proxtimet += parseInt(proxtimes, 10) + "s";
      }
    }
    proxtimet += " ago";

    // Procesar datos si el call sign existe
    if (proxcall !== "") {
      // Verificar si es el mismo callsign para el icono del mapa
      if (
        proxcall.toLowerCase() === callsign.toLowerCase() &&
        !callsign.toLowerCase().endsWith("11")
      ) {
        iconomapa = proximage;
      }

      // Condiciones para agregar a vorloc (siguiendo lógica original)
      const callChanged =
        proxcallsave.substring(0, 8).toUpperCase() !==
        proxcall.substring(0, 8).toUpperCase();
      const latChanged = proxlatsave !== proxlat;
      const validIcon =
        proximage !== "icon/P64.png" && proximage !== "icon/P69.png";

      if (callChanged && latChanged && validIcon) {
        // Limpiar comillas del call sign
        const cleanCall = proxcall.toUpperCase().replace(/'/g, " ");

        // Formatear distancia (remover espacios y convertir)
        const distFormatted = Math.round(
          parseFloat(proxdist.replace(/[^\d.-]/g, "")) || 0,
        );

        // Construir entrada para vorloc
        const imageName = getFileName(proximage);
        const infoWindow =
          `<img src='${imageSrcUrl[imageName]}'>&nbsp;&nbsp;${cleanCall} APRS Igate<br>` +
          `${proxtimet}<br>Latitude: ${proxlat}<br>Longitude: ${proxlon}<br>` +
          `De ${callsign} @ ${distFormatted} Km. at ${proxdir}`;

        vorloc.push([
          infoWindow,
          parseFloat(proxlat),
          parseFloat(proxlon),
          imageSrcUrl[imageName],
          m,
        ]);
        m++;
      }
    }

    // Guardar valores para próxima iteración
    proxcallsave = proxcall;
    proxlatsave = proxlat;
  }

  return {
    vorloc: vorloc,
    iconomapa: iconomapa,
    count: m,
  };
}

function getFileName(ruta) {
  if (!ruta || typeof ruta !== "string") return "";
  const partes = ruta.split("/");
  const nombreConExtension = partes[partes.length - 1];
  const ultimoPunto = nombreConExtension.lastIndexOf(".");
  if (ultimoPunto === -1) return nombreConExtension;
  return nombreConExtension.substring(0, ultimoPunto);
}

function setDocDomValues() {
  window.parent.window.document.title = `${callsign} Balloon`;
  document.getElementById("font_title").innerHTML =
    `${callsign} Balloon Position`;
  document.getElementById("callsign").value = callsign;
}

function showError(msg) {
  //document.querySelector("form").style.height = "75dvh";
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

function plot(V1n, V1x, V1y, V2n, V2x, V2y, Gn, Bx, By) {
  var gr = new jxGraphics(document.getElementById("graphics"));
  //Define pens to draw outline of the shapes
  var penRed = new jxPen(new jxColor("red"), "2px");
  var penGreen = new jxPen(new jxColor("green"), "1px");
  var penWhite = new jxPen(new jxColor("white"), "2px");
  var penBlack = new jxPen(new jxColor("black"), "1px");
  //Define brushes to fill the shapes
  var brushYellow = new jxBrush(new jxColor("yellow"));
  brushYellow.fillType = "linear-gradient";
  var brushBlue = new jxBrush(new jxColor("blue"));
  brushBlue.fillType = "linear-gradient";
  var brushRed = new jxBrush(new jxColor("red"));
  brushRed.fillType = "linear-gradient";
  var brushBlack = new jxBrush(new jxColor("black"));
  var brushWhite = new jxBrush(new jxColor("white"));
  //Define font to draw the text
  var font = new jxFont("tahoma");
  font.size = "14px";
  //Draw the color filled text string at specified point and angle
  var text = new jxText(
    new jxPoint(5, 130),
    `Radiales VORs a ${callsign}`,
    font,
    penBlack,
    brushWhite,
    0,
  );
  text.draw(gr);
  //Modify font object properties
  font.size = "10px";
  font.family = "arial";
  font.style = "italic";
  //Draw first VOR circle
  var VOR1 = new jxCircle(new jxPoint(V1x, V1y), 7, penRed, brushYellow);
  VOR1.draw(gr);
  //Draw text strings at specified points with changed font
  var text1 = new jxText(new jxPoint(V1x + 10, V1y + 5), V1n, font, penBlack);
  text1.draw(gr);
  //Draw 2nd VOR circle
  var VOR2 = new jxCircle(new jxPoint(V2x, V2y), 7, penRed, brushYellow);
  VOR2.draw(gr);
  //Draw text strings at specified points with changed font
  var text1 = new jxText(new jxPoint(V2x + 10, V2y + 5), V2n, font, penBlack);
  text1.draw(gr);
  //Draw balloon circle
  var B = new jxCircle(new jxPoint(Bx, By), 7, penGreen, brushRed);
  B.draw(gr);
  var text1 = new jxText(new jxPoint(Bx + 10, By + 5), Gn, font, penBlack);
  text1.draw(gr);
  //Draw Vor Radials
  var V1R = new jxLine(new jxPoint(V1x, V1y), new jxPoint(Bx, By), penRed);
  V1R.draw(gr);
  var V2R = new jxLine(new jxPoint(V2x, V2y), new jxPoint(Bx, By), penRed);
  V2R.draw(gr);
}

function show(display) {
  alert(help);
}

function ira(donde) {
  var vor1a = getParamSafe("VOR1");
  var vor2a = getParamSafe("VOR2");
  var nowgo = `${HOST_URL}/vor?callsign=${callsign}&Vuelo=${donde}&VOR1=${vor1a}&VOR2=${vor2a}`;
  window.parent.window.location.href = nowgo;
}

function loadGMap() {
  const iframe = document.getElementById("map_canvas");
  const jsonData = {
    callsign,
    heightsave,
    feetlaunchfinal,
    saveddeltafeetpersecond,
    horalocal,
    deltafeetpersecond,
    timezoneoffset,
    wdir,
    wspeed,
    VOR1La,
    VOR1Lo,
    VOR2La,
    VOR2Lo,
    GLatdeg,
    GLondeg,
    GLatdegf,
    GLondegf,
    posis,
    locations,
    fechadescmesdia,
    refreshParam,
    autoRefParam,
    deltapos,
    iconomapa,
    latciudad,
    lonciudad,
    actualdate,
    AlturaNumber,
    posdatam,
    Delta,
    um,
  };

  iframe.contentWindow.postMessage(
    { action: "SHOW_MAP", props: { jsonData } },
    "https://lu7aa.org",
  );
}

function handleMapMessage(event) {
  const { callbackName, props } = event.data;
  window[callbackName](props);
}

function saveMapState({ mapState }) {
  window.parent.window.localStorage.setItem(
    "myMapState",
    JSON.stringify(mapState),
  );
}

function loadMapState() {
  const mapStateStr = window.parent.window.localStorage.getItem("myMapState");
  let mapState = null;
  try {
    if (mapStateStr) {
      mapState = JSON.parse(mapStateStr);
    }
  } catch (e) {
    console.error("Error parsing saved map state:", e);
  } finally {
    iframe.contentWindow.postMessage(
      { action: "LOAD_MAP_STATE", props: { mapState } },
      "https://lu7aa.org",
    );
  }
}

function submitForm(event) {
  event.preventDefault();
  const form = document.getElementById("Resend");
  const formData = new FormData(form);
  const params = new URLSearchParams(formData).toString();
  window.parent.window.location.href = `${HOST_URL}/vor?${params}`;
}

function fireSubmitFormEvent() {
  const form = document.getElementById("Resend");
  const event = new Event("submit", { bubbles: true, cancelable: true });
  form.dispatchEvent(event);
}

window.addEventListener("message", handleMapMessage);
