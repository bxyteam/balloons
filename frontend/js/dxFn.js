var slowerParam = getParamSafe("slower") === "true";
var mapsize = 2160;
var fromDate = new Date("2021-01-01 00:00:00");

var DATA_SIZE = slowerParam ? 10001 : 3001;

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

  return { lat, lon, lx, ly };
}

// Función para obtener zona horaria
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

  const fechaObj = typeof fecha === "string" ? new Date(fecha) : fecha;

  const year = fechaObj.getFullYear();
  const month = String(fechaObj.getMonth() + 1).padStart(2, "0");
  const day = String(fechaObj.getDate()).padStart(2, "0");
  const hour = String(fechaObj.getHours()).padStart(2, "0");
  const minute = String(fechaObj.getMinutes()).padStart(2, "0");

  return `${year}/${month}/${day} ${hour}:${minute}`;
}

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

function validateCall(callsign) {
  const forbiddenChars = [".", "=", "[", "]", "(", ")", "'"];

  for (let z = 0; z < callsign.length; z++) {
    const char = callsign.charAt(z);
    if (forbiddenChars.includes(char)) {
      return { ok: false, error: `Illegal character found: ${char}` };
    }
  }
  return { ok: true };
}

function validateCallsign(call) {
  if (call.length > 12) {
    return { valid: false, error: "Callsign exceeds 12 characters." };
  }

  // Check for characters greater than "z" (like {, |, ~)
  for (let i = 0; i < call.length - 1; i++) {
    if (call.charAt(i) > "z") {
      return {
        valid: false,
        error: `Invalid character '${call.charAt(i)}' in callsign.`,
      };
    }
  }

  return { valid: true };
}

//const isNumeric = (n) => !isNaN(parseFloat(n)) && isFinite(n);

function padLeft(str, length, padChar = "0") {
  return String(str).padStart(length, padChar);
}

function replaceAll(cadena, buscar, reemplazar) {
  if (!cadena) return "";
  return cadena.replace(
    new RegExp(buscar.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"),
    reemplazar,
  );
}

function formatDateTime4() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  return hours + ":" + minutes;
}

function splitASP(cadena, delimitador, limite = -1, modo = 0) {
  try {
    if (!cadena) return [];

    let partes = cadena.split(delimitador);

    if (limite > 0 && partes.length > limite) {
      // En ASP, cuando se especifica un límite, los elementos extra se juntan en el último
      const extras = partes.slice(limite - 1).join(delimitador);
      partes = partes.slice(0, limite - 1);
      partes.push(extras);
    }

    return partes;
  } catch (error) {
    console.error("Error al dividir la cadena:", error);
    return [];
  }
}

function initializeBandArrays() {
  const bandArrays = {
    ba: new Array(33).fill(0),
    b0: new Array(33).fill(0),
    b1: new Array(33).fill(0),
    b3: new Array(33).fill(0),
    b5: new Array(33).fill(0),
    b7: new Array(33).fill(0),
    b10: new Array(33).fill(0),
    b13: new Array(33).fill(0),
    b14: new Array(33).fill(0),
    b18: new Array(33).fill(0),
    b21: new Array(33).fill(0),
    b24: new Array(33).fill(0),
    b28: new Array(33).fill(0),
    b40: new Array(33).fill(0),
    b50: new Array(33).fill(0),
    b70: new Array(33).fill(0),
    b144: new Array(33).fill(0),
    b432: new Array(33).fill(0),
    b1296: new Array(33).fill(0),
  };

  return bandArrays;
}

function fillBandArrays(bandArrays, bana) {
  for (let i = 0; i < 32; i++) {
    bandArrays.ba[i] = bana[1][i];
    bandArrays.b0[i] = bana[2][i];
    bandArrays.b1[i] = bana[3][i];
    bandArrays.b3[i] = bana[4][i];
    bandArrays.b5[i] = bana[5][i];
    bandArrays.b7[i] = bana[6][i];
    bandArrays.b10[i] = bana[7][i];
    bandArrays.b13[i] = bana[8][i];
    bandArrays.b14[i] = bana[9][i];
    bandArrays.b18[i] = bana[10][i];
    bandArrays.b21[i] = bana[11][i];
    bandArrays.b24[i] = bana[12][i];
    bandArrays.b28[i] = bana[13][i];
    bandArrays.b40[i] = bana[14][i];
    bandArrays.b50[i] = bana[15][i];
    bandArrays.b70[i] = bana[16][i];
    bandArrays.b144[i] = bana[17][i];
    bandArrays.b432[i] = bana[18][i];
    bandArrays.b1296[i] = bana[19][i];
  }

  return bandArrays;
}

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
function fillBandCounters(bana) {
  return {
    bac: bana[1][32],
    b0c: bana[2][32],
    b1c: bana[3][32],
    b3c: bana[4][32],
    b5c: bana[5][32],
    b7c: bana[6][32],
    b10c: bana[7][32],
    b13c: bana[8][32],
    b14c: bana[9][32],
    b18c: bana[10][32],
    b21c: bana[11][32],
    b24c: bana[12][32],
    b28c: bana[13][32],
    b40c: bana[14][32],
    b50c: bana[15][32],
    b70c: bana[16][32],
    b144c: bana[17][32],
    b432c: bana[18][32],
    b1296c: bana[19][32],
  };
}

function showMaintenanceMessage() {
  return `
        <br><br><br><br>
        <center>
            <i><b>Sorry.... On Maintenance.... Will return soon...</b></i><br><br>
            <a href="${HOST_URL}/dx" target="_self">
                <i><b>Or try a fresh start</b></i>
            </a>
        </center>
    `;
}

function agregarBanda(banda, k, nombre) {
  window.columns += `data.addColumn('number', '${nombre}');\n`;
  window.columns += `data.addColumn({type: 'string', role: 'tooltip'});\n`;
  window.bandas[window.bp] = banda;
  window.bp = window.bp + 1;
  if (nombre === "LF") nombre = "LF 0.137 MHz";
  if (nombre === "MF") nombre = "MF 0.475 MHz";
  window.colsChart += `["${nombre}", ${k}],`;
}

function generarMinutos({ datos, last, delta, fracciondia, bandArrays }) {
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

    for (let j = 0; j < window.bp; j++) {
      const nv = i - desde;
      let valor;

      if (por === "" || por.toUpperCase() === "H") {
        const matriz = bandArrays[window.bandas[j]];
        valor = matriz[nv] || 0;
      } else {
        const fech = new Date(datos[last][0]);
        fech.setDate(fech.getDate() + nv);
        valor =
          bandArrays[window.bandas[j]][
            String(fech.getDate()).padStart(2, "0")
          ] || 0;
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

      let bandasb = window.bandas[j].replace("b", "");
      if (bandasb == "1") bandasb = "1.8";
      if (bandasb == "3") bandasb = "3.5";
      if (bandasb == "0") bandasb = "0.475";
      if (bandasb == "a") bandasb = "0.137";

      resulta += `'For ${bandasb} MHz\\nAt ${hr}: ${dh}\\n${valor} Reports', `;
    }

    resulta = resulta.substring(0, resulta.length - 2) + "],\n";
    datas += resulta;
  }

  return datas;
}

function buildReporterParameters({ band, callsign, callsign1, limit, omit }) {
  const bs = window.getParamSafe("bs", "");

  if (bs === "A" || bs === "") {
    //getURLreporters = `http://wsprnetwork.browxy.com/?band=${band}&count=3000&call=${callsign}&reporter=${callsign1}&timeLimit=${limit}&sortBy=date&sortRev=1&unique=0&mode=All&excludespecial=${omit}`;
    return {
      band,
      count: `${DATA_SIZE - 1}`,
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
      count: `${DATA_SIZE - 1}`,
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
      count: `${DATA_SIZE - 1}`,
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

async function fetchReporters(params) {
  //const baseUrl = "https://balloons.dev.browxy.com/api/v1/wsprNetwork";
  const baseUrl = "/api/v1/wsprNetwork";

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

async function processReporters(
  { band, callsign, callsign1, limit, omit },
  tryAgain = false,
) {
  let paramsReporters = buildReporterParameters({
    band,
    callsign,
    callsign1,
    limit,
    omit,
  });

  if (callsign.toLowerCase().startsWith("x1")) {
    paramsReporters["reporter"] = "";
  }

  let pag = await fetchReporters(paramsReporters);

  if (!tryAgain) {
    return {
      error: false,
      pag: pag,
      paramsReporters: paramsReporters,
    };
  }
  // Verificar longitud y realizar reintentos si es necesario
  if (pag.length < 17150) {
    pag = await fetchReporters(paramsReporters);
  }

  // Verificar si hay mantenimiento
  if (pag.length < 500) {
    // En lugar de Response.Write y Response.End, retornamos un objeto de error
    return {
      error: true,
      message: "Sorry.... On Maintenance.... Will return soon...",
      redirect: `${HOST_URL}/dx?slower=${slowerParam}`,
      pag: "",
      paramsReporters: paramsReporters,
    };
  }

  // Segunda verificación de longitud
  if (pag.length < 17150) {
    // En lugar de Response.redirect, retornamos información de redirección
    return {
      error: true,
      redirect: `${HOST_URL}/dx?nocall=${callsign.trim().toUpperCase()}&slower=${slowerParam}`,
      pag: "",
      paramsReporters: paramsReporters,
    };
  }

  // Si todo está bien, retornar los datos
  return {
    error: false,
    pag: pag,
    paramsReporters: paramsReporters,
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

function generarComboHTML({ esta, estaselect, datos, ocall, tcall, rf, last }) {
  // Inicializar combo con div principal
  let combo = `<div id='beac' style='position:absolute;top:0px;left:2px;z-index:999;width:122px;line-height:12px;'>
    <center><i><div id='espacios'><br style='line-height:63px;'></div><b><span title='Graph by Hours' style='cursor:pointer;'>
    &nbsp;By Hours<input type='radio' id='por' name='por' value='H' checked onchange="enviando();document.getElementById('enviar').submit();"></span><br><span title='Graph by Days' style='cursor:pointer;'>&nbsp;&nbsp;&nbsp;By Days<input type='radio' id='por' name='por' value='D' onchange="enviando();document.getElementById('enviar').submit();"></span><br>
    <br style='line-height:3px;'>TZone:<input type='text' id='tz' name='tz' onclick="this.value=''" title='Enter here your Hours TimeZone difference, will show in your local Time' style='cursor:pointer;font-weight:bold;' size='1' value='0' maxlength='3'><br><div id='intn' style='white-space:nowrap;'><i><b>28 Intn. WSPR<br>Beacon Project</b></i></div>
    <select id='be' name='be' style='width:84px;text-align:center;font-weight:bold;font-size:12px;line-height:12px;' onchange="javascript:enviando();document.getElementById('call').value=document.getElementById('be').value; document.getElementById('bs').value=0; setSelectedIndex(document.getElementById('bs'), '0'); document.getElementById('bs').value='B';document.getElementById('enviar').submit();">`;

  // Agregar "Select" como primera opción
  esta[0][0] = "Select";

  // Agregar opciones del select
  for (let i = 0; i <= window.estalast; i++) {
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
  combo += `<hr style='margin-top:5px;margin-bottom:0px;'><span style='font-weight:bold'><i>For ${licencia.toUpperCase()}<br>${window.n + 1} ${ley}<br><a href='#' onclick='goto10()' title=' # of Reports Read&#13Click for 10K reports&#13...Will be slower....&#13But shows all data' style='text-decoration:none;'>${canti} Reports</a>`;

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
  window.locati = "";
  if (
    bsParam === "B" &&
    licencia.trim().toUpperCase() === (datos[ocall] || "")
  ) {
    window.locati = datos[6] || "";
  }
  if (
    bsParam === "S" &&
    licencia.trim().toUpperCase() === (datos[tcall] || "")
  ) {
    window.locati = datos[9] || "";
  }
  if (
    (bsParam === "A" || bsParam === "") &&
    licencia.trim().toUpperCase() === (datos[ocall] || "")
  ) {
    window.locati = datos[6] || "";
  }
  if (
    (bsParam === "A" || bsParam === "") &&
    licencia.trim().toUpperCase() === (datos[tcall] || "")
  ) {
    window.locati = datos[9] || "";
  }

  // Información de potencia
  const pwri = window.iib > 0 ? `<br>Pwr: ${window.pwro} Watts` : "";

  // Agregar información de ubicación si no es beacon
  if (licencia.trim() !== beParam) {
    combo += `${pwri}<br>Loc: <a target='_blank' title='See Location' href='http://k7fry.com/grid/?qth=${window.locati}'>${window.locati}</a></i></span>\n`;
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

  // <a href="${HOST_URL}/dx" title='Refresh User List' target=_blank style='font-size:16px;cursor:pointer;line-height:13px;vertical-align: super;text-decoration:none;font-weight:normal;'>&#x29C7;</a>
  combo = `${combo} <br style='line-height:2px;'>&nbsp;&nbsp;<a href='#' target='_blank'><img title='Comment' alt='Comment' src='${imageSrcUrl["contact"]}' width='35px' height='19px' style='width:35px;height:19px;'></a>&nbsp;&nbsp;

    <br><br style='line-height:1px;'><span style='font-size:16px;font-weight:bold;line-height:17px;'>
    <a href='http://wspr.rocks/topbeacons/' target='_phil'><i>Top Beacons</i></a>
    <br><a href='http://wspr.rocks/topspotters/' target='_phil'><i>Top Spotters</i></a></span>
    <span style='font-size:11px;line-height:13px;'><i><br>Courtesy of </i><a href='http://wspr.rocks/' target='_phil'><i>Phil VK7JJ</i></a></span>
    </center></div>
    </div>`;

  return combo;
}

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
      if (tablam.length === 3001 || tablam.length === 3000) {
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
