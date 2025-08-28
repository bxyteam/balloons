window.getParamSafe = (key, defaultValue = "", encode = false) => {
  const params = new URLSearchParams(window.parent.window.location.search);
  const value = params.get(key);
  if (value === null || value.trim() === "") return defaultValue;
  return encode ? encodeURIComponent(value) : value.trim();
};

function ucase(str) {
  return str ? str.toString().toUpperCase() : "";
}

function lcase(str) {
  return str ? str.toString().toLowerCase() : "";
}

function trim(str) {
  return str ? str.toString().trim() : "";
}

function mid(str, start, length) {
  return str.toString().substr(start - 1, length);
}

function left(str, length) {
  return str.toString().substring(0, length);
}

function right(str, length) {
  return str.toString().slice(-length);
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
}

async function getURLXform(url, body = null, headers = {}) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        ...headers,
      },
      body: body,
    });

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

async function getURL(url, responseType = "text") {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result =
      responseType === "text" ? await response.text() : await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching URL:", error);
    return "";
  }
}

async function getURLXform(url, body = null, headers = {}) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        ...headers,
      },
      body: body,
    });

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
    //const assetUrl = `/api/v1/getAsset?file=${encodeURIComponent(`share/assets/${file}`)}`;
    const assetUrl = `https://balloons.dev.browxy.com/api/v1/getAsset?file=${encodeURIComponent(`share/assets/${file}`)}`;
    let serverResponse;
    // const response = await readShareAsset({
    //   assetOutputType: "txt",
    //   assetUrl,
    // });
    // serverResponse = response.data;

    const response = await fetch(assetUrl);
    serverResponse = await response.text();

    return serverResponse;
  } catch (error) {
    console.error(error);
    return "";
  }
}

async function vorread() {
  try {
    const fileContent = await getShareResource("argvor.txt");
    const lines = fileContent.split("\n");

    let vormatrix = [];
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

    // TODO - REMOVE  todos los datos procesados
    const obj = {
      locations: locations,
      vormatrix: vormatrix,
      help: help,
      lastm: lastm,
      vorloc1m: vorloc1m,
      vorloc2m: vorloc2m,
      VOR1La: VOR1La,
      VOR1Lo: VOR1Lo,
      VOR2La: VOR2La,
      VOR2Lo: VOR2Lo,
    };
    console.log(obj);
  } catch (error) {
    console.error("Error en vorread():", error);
    throw error;
  }
}

function buscarTag(tagInicio, tagFin, texto) {
  let tagFinalEncontrado = false;
  let k = window.Posicion;
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
          window.Posicion = j + tagFin.length;
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
    window.Posicion = texto.length;
  }

  return resultado;
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

function replace(
  text,
  searchValue,
  replaceValue,
  start = 0,
  count = -1,
  compareMode = 0,
) {
  if (text === undefined || text === null || text === "") return "";
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

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function cDate(dateString) {
  try {
    return new Date(dateString);
  } catch (error) {
    return new Date(); // Return current date on error
  }
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
