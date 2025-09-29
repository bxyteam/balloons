function split(str, delimiter, limit = -1, compareType = 0) {
  if (!str) return [];
  let parts = str.split(delimiter);
  if (limit > 0 && parts.length > limit) {
    parts = parts.slice(0, limit);
  }
  return parts;
}

function xsnrFun(dbm) {
  try {
    return window.xsnr[dbm] || 0;
  } catch (error) {
    console.error("Error in xsnr:", error);
    return 0;
  }
}

function or1Fun(dbm) {
  try {
    return window.or1[dbm];
  } catch (error) {
    console.error("Error in or1:", error);
    return 0;
  }
}

// Date manipulation functions
function dateAdd(interval, number, date) {
  const result = new Date(date);
  switch (interval.toLowerCase()) {
    case "d":
      result.setDate(result.getDate() + number);
      break;
    case "m":
      result.setMonth(result.getMonth() + number);
      break;
    case "y":
      result.setFullYear(result.getFullYear() + number);
      break;
    case "n": // minutes
      result.setMinutes(result.getMinutes() + number);
      break;
    case "h": // hours
      result.setHours(result.getHours() + number);
      break;
    case "d": // days
      result.setDate(result.getDate() + number);
      break;
    case "yyyy": // years
      result.setFullYear(result.getFullYear() + number);
      break;
  }
  return result;
}

function dateDiff(unidad, fecha1, fecha2) {
  const f1 = new Date(fecha1);
  const f2 = new Date(fecha2);
  const msDiff = f2 - f1; // Diferencia en milisegundos

  switch (unidad) {
    case "s":
      return msDiff / 1000; // segundos
    case "n":
      return msDiff / (1000 * 60); // minutos
    case "h":
      return msDiff / (1000 * 60 * 60); // horas
    case "d":
      return msDiff / (1000 * 60 * 60 * 24); // días
    case "m": // meses aproximados
      return (
        (f2.getFullYear() - f1.getFullYear()) * 12 +
        (f2.getMonth() - f1.getMonth())
      );
    case "y": // años
      return f2.getFullYear() - f1.getFullYear();
    default:
      throw new Error("Unidad de diferencia no válida");
  }
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDateTime(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function formatDateTimeFormat(date, format) {
  switch (format) {
    case 4: // Time format HH:MM
      return (
        date.getHours().toString().padStart(2, "0") +
        ":" +
        date.getMinutes().toString().padStart(2, "0")
      );
    case 1: // General date format
      return date.toLocaleString();
    case 2: // Short date format
      return date.toLocaleDateString();
    case 3: // Long date format
      return date.toDateString();
    // Add more formats as needed
    default:
      return date.toString();
  }
}

function dateDiffMinutes(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.floor((d2 - d1) / (1000 * 60)); // Convert milliseconds to minutes
}

function putsun(fecha, locator) {
  const radian = 57.29577951308;
  let sunelevation = "&nbsp;";
  if (locator.length > 3) {
    sunelevation =
      (
        SunCalc.getPosition(
          new Date(fecha + "Z"),
          loc2latlon(locator).loclat,
          loc2latlon(locator).loclon,
        ).altitude * radian
      ).toFixed(1) + "&nbsp;";
  }
  return sunelevation;
}

async function getPageResponse(url) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const text = await response.text();
      return {
        statusCode: response.status,
        content: text,
      };
    }

    return {
      statusCode: response.status,
      message: response.statusText,
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      message: error,
    };
  }
}

async function getReportersTelemetry2(getURLreporters1, balloonid) {
  let pag1 = "";
  if (balloonid !== "") {
    let response = await getPageResponse(getURLreporters1);
    if (response.statusCode === 200) {
      pag1 = response.content;
    } else {
      alert("Error: " + response.message);
      pag1 = "";
    }
  }

  // Retry logic for balloon data
  if ((pag1.length < 20 || pag1 === "") && balloonid !== "") {
    let response = await getPageResponse(getURLreporters1);
    if (response.statusCode === 200) {
      pag1 = response.content;
      if ((pag1.length < 20 || pag1 === "") && other !== "") {
        response = await getPageResponse(getURLreporters1);
        if (response.statusCode === 200) {
          pag1 = response.content;
        } else {
          alert("Error: " + response.message);
          pag1 = "";
        }
      }
    } else {
      alert("Error: " + response.message);
      pag1 = "";
    }
  }

  return pag1;
}

// Main WSPR query processing function
async function processWSPRQuery() {
  let output = "";
  let timeLimit = "1209600"; // 1209600 604800 CHECK THIS
  const launchdate = window.getLaunchDate();
  const balloonid = getParamSafe("balloonid");
  const callsign = getParamSafe("other").toUpperCase();

  // Check for special cases
  let other = getParamSafe("other");
  if (ucase(other) === "LU1KCQ" || ucase(other) === "G7PMO") {
    // CHECK THIS IS NEEDED
    timeLimit = "604800";
  }

  let banda = "14";
  let bandasearch = "All";

  // Process band selection
  for (let g = 0; g <= ubound(window.tbanda); g++) {
    if (ucase(getParamSafe("banda")) === ucase(window.tbanda[g].label)) {
      bandasearch = window.tbanda[g].band;
    }
  }

  let cuenta = CUENTA_SIZE_TELE_1;
  let count = COUNT_SIZE_TELE_1;
  timeLimit = "604800";

  if (getParamSafe("detail") !== "") {
    cuenta = CUENTA_SIZE_TELE_1;
  }

  if (bandasearch !== "All") {
    bandasearch = " band = " + bandasearch + " and ";
  } else {
    bandasearch = "";
  }

  let callsignm;
  if (callsign === "") {
    callsignm = "XYZ123";
  } else {
    callsignm = ucase(other);
  }

  // Calculate dates
  let finicio = dateAdd("d", -7, new Date());
  let fim = [finicio.getMonth() + 1, finicio.getDate(), finicio.getFullYear()];
  let filive =
    fim[2] + "-" + right("00" + fim[0], 2) + "-" + right("00" + fim[1], 2);

  if (launchdate !== "") {
    filive = left(trim(launchdate), 19);
  }

  let filive2 = filive;

  try {
    let finicio2d = dateAdd("d", -3, new Date(left(trim(launchdate), 19)));
    filive2 =
      finicio2d.getFullYear() +
      "-" +
      right("00" + (finicio2d.getMonth() + 1), 2) +
      "-" +
      right("00" + finicio2d.getDate(), 2) +
      " 00:00:00";
  } catch (error) {
    // Error handling
    console.warn("Date processing error:", error);
  }

  let now = new Date();
  let futureDate = dateAdd("d", 2, now);
  let filast =
    futureDate.getFullYear() +
    "-" +
    right("00" + (futureDate.getMonth() + 1), 2) +
    "-" +
    right("00" + futureDate.getDate(), 2);

  let limit = getParamSafe("limit");
  if (limit !== "") {
    filast = left(limit, 4) + "-" + mid(limit, 5, 2) + "-" + mid(limit, 7, 2);
  }

  // Frequency search logic
  let frecsearch = "";
  let tracker = getParamSafe("tracker");
  let wide = getParamSafe("wide");

  if (tracker === "qrplabs" || tracker === "traquito") {
    if (wide !== "on") {
      frecsearch =
        " and frequency > " +
        (window.fcentral - 25) +
        " and frequency < " +
        (window.fcentral + 25) +
        " ";
    } else {
      frecsearch =
        " and frequency > " +
        Math.floor(window.fcentral / 1000) * 1000 +
        " and frequency < " +
        (Math.floor(window.fcentral / 1000) * 1000 + 200) +
        " ";
    }

    if (wide !== "") {
      frecsearch =
        " and frequency > " +
        (Math.floor(window.fcentral / 1000) * 1000 - 25) +
        " and frequency < " +
        (Math.floor(window.fcentral / 1000) * 1000 + 225) +
        " ";
    }
  }

  // Build URL queries
  let getURLreporters;
  let detail = getParamSafe("detail");

  if (detail === "on") {
    getURLreporters =
      "https://db1.wspr.live/?query=select time,tx_sign,frequency,snr,drift,tx_loc,power,rx_sign,rx_loc,distance,azimuth,code from rx where " +
      bandasearch +
      " time >= '" +
      filive +
      "' and time <= '" +
      filast +
      " 23:59:59' and ( ( tx_sign = '" +
      callsignm +
      "' ) ) order by time desc LIMIT " +
      LIMIT_URL_1;
  } else {
    getURLreporters =
      "https://db1.wspr.live/?query=select time,any(tx_sign),cast(avg(frequency) AS DECIMAL(8,0)),max(snr),any(drift),any(tx_loc),any(power),any(rx_sign),max(rx_loc),max(distance),max(azimuth),any(code) from rx where " +
      bandasearch +
      " time >= '" +
      filive +
      "' and time <= '" +
      filast +
      " 23:59:59' and ( ( tx_sign = '" +
      callsignm +
      "' ) ) group by time order by time desc LIMIT " +
      LIMIT_URL_1;
  }

  let pag = "";

  if (other !== "") {
    let response = await getPageResponse(getURLreporters);
    if (response.statusCode === 200) {
      pag = response.content;
    } else {
      window.parent.window.alert("Error: " + response.message);
      pag = "";
    }
  }

  // Handle no data case
  if (pag.length < 10 && other !== "") {
    return {
      error: true,
      output: `</table><center><br><a href='${HOST_URL}/wsprx' title='Go Back' target='self' style='background-color:lightblue;'><b><i><u>&nbsp;There are no WSPR reports for ${ucase(other)}&nbsp;starting on ${launchdate}z&nbsp;<u></i></b></a><br><br></center>`,
    };
  }

  // Retry logic for failed requests
  if ((pag.length < 20 || pag === "") && other !== "") {
    // Retry attempts would go here

    let response = await getPageResponse(getURLreporters);
    if (response.statusCode === 200) {
      pag = response.content;
      if ((pag.length < 20 || pag === "") && other !== "") {
        response = await getPageResponse(getURLreporters);
        if (response.statusCode === 200) {
          pag = response.content;
        } else {
          window.parent.window.alert("Error: " + response.message);
          pag = "";
        }
      }
    } else {
      window.parent.window.alert("Error: " + response.message);
      pag = "";
    }
  }

  let getURLreporters1;
  // Balloon ID processing
  if (balloonid !== "") {
    let balid = left(balloonid, 1) + "_" + right(balloonid, 1) + "*";
    let balloonidParam = getParamSafe("balloonid");

    if (balloonidParam !== "" && detail === "on") {
      getURLreporters1 =
        "https://db1.wspr.live/?query=select time,tx_sign,frequency,snr,drift,tx_loc,power,rx_sign,rx_loc,distance,azimuth,code from rx where" +
        bandasearch +
        " time > '" +
        filive2 +
        "' and time <= '" +
        filast +
        " 23:59:59' and ( ( SUBSTRING(tx_sign, 1, 1)  = '" +
        ucase(left(balloonid, 1)) +
        "' and SUBSTRING(tx_sign, 3, 1) = '" +
        right(balloonid, 1) +
        "'  ) ) " +
        frecsearch +
        " order by time desc LIMIT " +
        LIMIT_URL_2;
    } else {
      getURLreporters1 =
        "https://db1.wspr.live/?query=select time,any(tx_sign),cast(avg(frequency) AS DECIMAL(8,0)),max(snr),min(drift),any(tx_loc),min(power),any(rx_sign),max(rx_loc),max(distance),max(azimuth),any(code) from rx where" +
        bandasearch +
        " time > '" +
        filive2 +
        "' and time <= '" +
        filast +
        " 23:59:59' and ( ( SUBSTRING(tx_sign, 1, 1)  = '" +
        ucase(left(balloonid, 1)) +
        "' and SUBSTRING(tx_sign, 3, 1) = '" +
        right(balloonid, 1) +
        "'  ) ) " +
        frecsearch +
        " group by time order by time desc LIMIT " +
        LIMIT_URL_2;
    }
  }

  if (pag.length < 20) {
    return {
      error: true,
      output: "</table>",
    };
  }

  return {
    error: false,
    pag: pag.trim(),
    getURLreporters1: balloonid !== "" ? getURLreporters1 : "",
    cuenta,
  };
}

function decoqrp(diahora, lcall, lloc, ldbm) {
  try {
    // --- Process lloc (HK52 -> E7,F7,G7,H7) ---
    let E7_val = lloc.charAt(0);
    let F7_val = lloc.charAt(1);
    let G7_val = lloc.charAt(2);
    let H7_val = lloc.charAt(3);
    let E7 = E7_val.charCodeAt(0) - 65;
    let F7 = F7_val.charCodeAt(0) - 65;
    let G7 = parseInt(G7_val, 10);
    if (isNaN(G7)) G7 = 0;
    let H7 = parseInt(H7_val, 10);
    if (isNaN(H7)) H7 = 0;

    // --- Process lcall (030QRY -> F5A,H5A,I5A,J5A -> F5,H5,I5,J5) ---
    let F5A = lcall.charAt(1);
    let H5A = lcall.charAt(3);
    let I5A = lcall.charAt(4);
    let J5A = lcall.charAt(5);
    let F5 = isNaN(parseInt(F5A, 10))
      ? F5A.toUpperCase().charCodeAt(0) - 55
      : parseInt(F5A, 10);
    let H5 = isNaN(parseInt(H5A, 10))
      ? H5A.toUpperCase().charCodeAt(0) - 65
      : parseInt(H5A, 10);
    let I5 = isNaN(parseInt(I5A, 10))
      ? I5A.toUpperCase().charCodeAt(0) - 65
      : parseInt(I5A, 10);
    let J5 = isNaN(parseInt(J5A, 10))
      ? J5A.toUpperCase().charCodeAt(0) - 65
      : parseInt(J5A, 10);

    // --- Calculate the two parts of the result ---
    let part1_num = (F5 * 26 * 26 * 26 + H5 * 26 * 26 + I5 * 26 + J5) % 632736;
    let part1_str = part1_num.toString().padStart(6, "0");

    let ldbm_key = ldbm * 1;
    let dic_value = window.dic[ldbm_key] || 0;
    let part2_num_raw =
      E7 * 18 * 10 * 10 * 19 +
      F7 * 10 * 10 * 19 +
      G7 * 10 * 19 +
      H7 * 19 +
      dic_value;
    let part2_num = Math.floor(part2_num_raw / 4) % 158184;
    let part2_str = part2_num.toString().padStart(6, "0");
    return part1_str + " " + part2_str;
  } catch (e) {
    console.error("Error in decoqrp:", e);
    return "";
  }
}

function decowspr(
  diahora,
  lcall,
  lloc,
  ldbm,
  reporter,
  rgrid,
  km,
  az,
  options = {},
) {
  // --- Input Validation ---
  if (!diahora || !lcall || !lloc || ldbm === undefined || ldbm === null) {
    console.error("decowspr: Missing required parameters");
    return "<tr><td colspan='14'>Error: Missing data for decoding.</td></tr>";
  }

  try {
    // --- Initialize variables ---
    let E5, F5, G5, H5, I5, J5, E7, F7, G7, H7, D5;
    let multi = 0,
      V28 = "",
      deltaaltura;
    let I7,
      J7,
      J8,
      J9,
      J10,
      L5,
      I6,
      resul,
      K5,
      J6,
      L6,
      L7,
      M6,
      K6,
      N6,
      M7,
      M8,
      wb,
      O6,
      P6;
    let O7,
      P7,
      Q7,
      R7,
      S7,
      T7,
      wgps = "",
      //wsats,
      walt1;
    let agregado = "",
      retorno = "";
    let decoqr = options.decoqr || "";
    let decoqr1 = options.decoqr1 || "";
    let decoqrf = options.decoqrf || "";
    let buscohora, actualdate, fechahora;
    let wchan;
    //wbat, wspeed, wtemp, walt;

    window.wtemp = 0;
    window.wbat = "";
    window.wspeed = 0;
    window.wsats = "";
    window.walt = "";

    // --- Assign input values ---
    E5 = lcall.charAt(0);
    F5 = lcall.charAt(1);
    G5 = lcall.charAt(2);
    H5 = lcall.charAt(3);
    I5 = lcall.charAt(4);
    J5 = lcall.charAt(5);
    E7 = lloc.charAt(0);
    F7 = lloc.charAt(1);
    G7 = lloc.charAt(2);
    H7 = lloc.charAt(3);
    D5 = ldbm * 1;

    // --- Determine Multiplier and Channel ---
    if (E5 === "0") multi = 0;
    if (E5 === "1") multi = 10;
    if (E5 === "Q") multi = 20;

    try {
      window.wchan = multi + (parseInt(G5, 10) || 0);
    } catch (e) {
      wchan = multi;
    }

    if (wchan < 10) wchan = "0" + wchan;

    // --- Check Tracker Type ---
    const tracker = (getParamSafe("tracker") || "").toUpperCase();
    const isQRPLABS = tracker === "QRPLABS";
    const isTRAQUITO = tracker === "TRAQUITO";

    const F5_code = F5.charCodeAt(0);

    if (!isQRPLABS && !isTRAQUITO) {
      // --- Standard Tracker Decoding ---
      try {
        // --- Battery and Speed ---
        const trackerLC = (getParamSafe("tracker") || "").toLowerCase();
        const isAB5SS = trackerLC === "ab5ss";
        const isWB8ELK = trackerLC === "wb8elk";
        const H5_code = H5.charCodeAt(0);
        const A_code = "A".charCodeAt(0);

        if (!isAB5SS) {
          window.wbat = ((H5_code - A_code + 32) / 10).toFixed(1) + "V";
          window.wspeed = Math.round(((H5_code - A_code) / 1) * 5 * 1.852);
        }
        if (isAB5SS) {
          window.wspeed = Math.round(((H5_code - A_code) / 1) * 5 * 1.852);
          window.wbat = ((H5_code - A_code + 32) / 10).toFixed(1) + "V";
        }
        if (isAB5SS || isWB8ELK) {
          window.wbat = (H5_code - A_code + 32) / 10;
        }

        // --- Satellite Status ---
        const zero_code = "0".charCodeAt(0);

        if (F5_code - zero_code > 9) {
          V28 = String.fromCharCode(((F5_code - 7) % 3) + zero_code);
        } else {
          V28 = String.fromCharCode((F5_code % 3) + zero_code);
        }

        if (V28 === "0") window.wsats = "NoF";
        if (V28 === "1") window.wsats = "4-8";
        if (V28 === "2") window.wsats = "> 8";

        // --- Temperature ---
        if (F5_code - zero_code > 9) {
          window.wtemp =
            Math.floor((F5_code - V28.charCodeAt(0) - 7) / 3) * 5 - 30;
        } else {
          window.wtemp = String.fromCharCode((F5_code % 3) + zero_code);
        }

        window.wtemp = parseInt(window.wtemp, 10);
        if (isNaN(window.wtemp)) window.wtemp = 0;

        // --- Delta Altitude ---
        deltaaltura = Math.floor(Math.round((D5 * 18.1132) / 10)) * 10;

        // Lookup en tablahoras (simulado)
        if (window.tablahoras) {
          for (let u = 0; u < 300; u++) {
            if (window.tablahoras[u] && window.tablahoras[u][0] === diahora) {
              deltaaltura = deltaaltura * 1 + window.tablahoras[u][1] * 1;
              break;
            }
          }
        }

        actualdate = diahora.substring(0, 15);
        window.newloc = "";

        // Lookup en tele1 para obtener newloc (simulado)
        if (options.tele1) {
          for (let k = 3; k < options.tele1.length; k++) {
            if (actualdate === options.tele1[k][thora].substring(0, 15)) {
              window.newloc = options.tele1[k + 1][tgrid];
              try {
                deltaaltura = deltaaltura + options.tele1[k][taltura];
              } catch (e) {
                // ignore error
              }
            }
            if (window.newloc !== "") break;
          }
        }

        window.walt = deltaaltura;
        K6 = I5;
        N6 = J5;

        // --- Prepare agregado ---
        if (
          lloc.length > 3 &&
          (window.wsats === "4-8" || window.wsats === "> 8")
        ) {
          agregado = `${putsun(`${diahora}`, `${lloc}${I5}${J5}`)}`;
        } else {
          agregado = "&nbsp;";
        }

        window.K6_SAVE = K6;
        window.N6_SAVE = N6;

        // --- Format output values ---
        const wtempStr = window.wtemp
          .toString()
          .padStart(4, " ")
          .replaceAll(" ", "&nbsp;");
        const wspeedStr = window.wspeed
          .toString()
          .padStart(5, " ")
          .replaceAll(" ", "&nbsp;")
          .substring(0, 3);

        // --- Prepare Output for Standard Tracker ---
        retorno = `<tr style="line-height:11px;"><td colspan="1">${diahora}</td><td>${lcall}&nbsp;${lloc}&nbsp;${ldbm.toString().padStart(2, " ").slice(-2)}</td><td>${lloc}${I5}${J5}</td><td>${wtempStr}&#176;C&nbsp;&nbsp;</td><td>${wbat}</td><td>${wspeedStr}</td><td>${wgps}&nbsp;${wsats}&nbsp;</td><td>${reporter}</td><td>${rgrid}</td><td>${km}</td><td>${az}</td><td>${deltaaltura}</td><td align="right">${agregado}</td></tr>`;
      } catch (e) {
        console.error("Error in standard tracker decoding section:", e);
        retorno = `<tr><td colspan="14">Error decoding standard tracker data.</td></tr>`;
      }
    } else {
      // --- QRPLABS or TRAQUITO Tracker Decoding ---
      try {
        // --- Temperature (QRPLABS/TRAQUITO specific) ---
        const E7_code = E7.charCodeAt(0);
        const F7_code = F7.charCodeAt(0);
        const A_code_qrp = "A".charCodeAt(0);
        const G7_val = parseInt(G7, 10) || 0;
        const H7_val = parseInt(H7, 10) || 0;

        I7 =
          (E7_code - A_code_qrp) * 18 * 10 * 10 * 19 +
          (F7_code - A_code_qrp) * 10 * 10 * 19 +
          G7_val * 10 * 19 +
          H7_val * 19 +
          (window.dic && window.dic[D5] ? window.dic[D5] : 0);

        J7 = Math.floor(I7 / (40 * 42 * 2 * 2));
        J8 = J7 * 2 + 457;
        J9 = (5 * J8) / 1024;
        if (J9 > 3) J9 = J9 - 0.85;
        J10 = 100 * (J9 - 2) - 73;
        if (J10 < -45) J10 = -28 - J10;
        window.wtemp = Math.round(J10 + 2); // formatnumber(int(J10+2),0)

        // --- Channel/Location Calculation ---
        const F5_val = parseInt(F5, 10);
        const isF5Numeric = !isNaN(F5_val);

        if (isF5Numeric) {
          L5 =
            26 * 26 * 26 * (F5_code - "0".charCodeAt(0)) +
            26 * 26 * (H5.charCodeAt(0) - A_code_qrp) +
            26 * (I5.charCodeAt(0) - A_code_qrp) +
            (J5.charCodeAt(0) - A_code_qrp);
        } else {
          L5 =
            26 * 26 * 26 * (10 + F5.charCodeAt(0) - A_code_qrp) +
            26 * 26 * (H5.charCodeAt(0) - A_code_qrp) +
            26 * (I5.charCodeAt(0) - A_code_qrp) +
            (J5.charCodeAt(0) - A_code_qrp);
        }

        I6 = L5;
        resul = E5 === "Q" ? 10 : 0;
        K5 = G5.charCodeAt(0) + resul;
        J6 = Math.floor(I6 / (24 * 1068));
        L6 = I6 - J6 * (24 * 1068);
        L7 = I7 - J7 * (40 * 42 * 2 * 2);
        M6 = Math.floor(L6 / 1068);
        K6 = String.fromCharCode(J6 + A_code_qrp);
        N6 = String.fromCharCode(M6 + A_code_qrp);
        M7 = Math.floor(L7 / (42 * 2 * 2));
        M8 = M7 * 10 + 614;

        // --- Battery Voltage ---
        wb = 3.0 + Math.floor((M7 + 20) % 40) * 0.05;
        window.wbat = wb.toFixed(2);

        M6 = Math.floor(L6 / 1068); // Recalculated as in ASP
        O6 = L6 - M6 * 1068;
        P6 = O6 * 20;
        window.walt = P6;

        // --- Speed Calculation (Fixed to match ASP code) ---
        O7 = L7 - M7 * 42 * 2 * 2;
        P7 = Math.floor(O7 / (2 * 2));
        Q7 = P7 * 2;
        R7 = O7 - P7 * 2 * 2;

        window.wspeed = Q7;
        // Apply the original ASP conversion formula
        window.wspeed = Math.floor((window.wspeed * 60 * 60) / 1000 / 1.852);
        // Apply the offset if speed is below threshold
        if (window.wspeed < 84) window.wspeed = window.wspeed + 84;

        // --- GPS Status ---
        S7 = Math.floor(R7 / 2);
        wgps = S7;
        T7 = R7 % 2;
        S7 = 1;
        T7 = 1; // AGREGADO PARA HACER VALIDO GPS

        if (S7 === 1 && T7 === 0) {
          wgps = 0;
          window.wsats = "NOF";
          walt1 = " ";
        } else {
          wgps = 1;
          wsats = "4-8";
          // FIXED: Use walt instead of walt1 for altitude display
          walt1 = window.walt;
        }

        if (wchan < 10) wchan = "0" + wchan;

        // --- Determine Reporting Time (buscohora logic) ---
        fechahora = diahora;
        if ((getParamSafe("timeslot") || "").trim() !== "") {
          buscohora = fechahora;
          //.substring(0, 15);
        } else {
          // Simplified date math (approximates DateAdd("n",-1,...))
          const dateObj = new Date(fechahora);
          if (!isNaN(dateObj)) {
            dateObj.setMinutes(dateObj.getMinutes() - 1);
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, "0");
            const day = String(dateObj.getDate()).padStart(2, "0");
            const hours = String(dateObj.getHours()).padStart(2, "0");
            const minutes = String(dateObj.getMinutes()).padStart(2, "0");
            buscohora = `${year}-${month}-${day} ${hours}:${minutes}`;
          } else {
            buscohora = fechahora;
            //.substring(0, 15);
          }
        }

        actualdate = buscohora.substring(0, 15);
        window.newloc = "";

        // Lookup en tele1 para obtener newloc
        if (options.tele1) {
          for (let k = 3; k < options.tele1.length; k++) {
            if (actualdate === options.tele1[k][thora].substring(0, 15)) {
              window.newloc = options.tele1[k][tgrid];
            }
            if (window.newloc !== "") break;
          }
        }

        // --- Prepare agregado ---
        if (window.newloc.length > 3) {
          agregado = `${putsun(`${diahora}`, `${window.newloc}${K6}${N6}`)}`;
        } else {
          agregado = "&nbsp;";
        }

        // --- Deco QR Handling ---
        if (getParamSafe("qp") === "on") {
          const dig2 = diahora.charAt(14);
          let colori, colorf;
          if (["1", "3", "5", "7", "9"].includes(dig2)) {
            colori = "<span class='narrow' style='color:gray;'>";
            colorf = "</span>";
            if (decoqr1 !== "" && decoqr1.length > 7 && decoqr1.length < 20) {
              decoqr1 = decoqr1 + "<br>" + decoqr;
            }
          } else {
            colori = "<span class='narrow' style='color:black;'>";
            colorf = "</span>";
            if (decoqr1 === "" && decoqr1.length > 7 && decoqr1.length < 20) {
              decoqr1 = decoqr;
            }
          }
          decoqr = colori + decoqr + colorf;
        } else {
          decoqr = "";
        }

        // --- Format output values ---
        const wtempStr_qrp = window.wtemp
          .toString()
          .padStart(4, " ")
          .replaceAll(" ", "&nbsp;");
        window.wtemp = wtempStr_qrp;

        // Fix speed formatting - don't truncate with substring
        const wspeedStr_qrp = window.wspeed
          .toString()
          .padStart(3, " ")
          .replaceAll(" ", "&nbsp;");
        window.speed = wspeedStr_qrp;

        // FIXED: Properly format altitude - use walt1 as number, not string
        const waltStr_qrp =
          walt1 && walt1 !== " " && walt1 !== 0
            ? walt1.toString().padStart(5, " ").replaceAll(" ", "&nbsp;")
            : "&nbsp;";
        window.walt = waltStr_qrp;

        // --- KEY FIX: Use newloc.substring(0,4) + K6 + N6 for the locator column ---
        const finalLocator =
          window.newloc.length > 3
            ? window.newloc.substring(0, 4) + K6 + N6
            : lloc + K6 + N6;

        window.K6_SAVE = K6;
        window.N6_SAVE = N6;

        // --- Prepare Output for QRPLABS/TRAQUITO ---
        retorno = `<tr style="line-height:11px;"><td colspan="1">${diahora}</td><td>${lcall}&nbsp;${lloc}&nbsp;${ldbm.toString().padStart(2, " ").slice(-2)}</td><td>${finalLocator}</td><td>${wtempStr_qrp}&#176;C</td><td>${wbat}V</td><td>${wspeedStr_qrp}</td><td>${wgps}&nbsp;${wsats}</td><td>${reporter}</td><td>${rgrid}</td><td>${km}</td><td>${az}</td><td>${waltStr_qrp}</td><td align="right">${agregado}</td><td style='font-family:Arial Narrow;text-align:left;'>${decoqr}</td></tr>`;

        // --- Deco QRF Handling ---
        if (
          getParamSafe("qp") === "on" &&
          decoqrf === "" &&
          decoqr.length > 61
        ) {
          decoqrf = "T# " + decoqr.replace(/<[^>]*>/g, "").replace(/\r?/g, "");
        }
      } catch (e) {
        console.error("Error in QRPLABS/TRAQUITO decoding section:", e);
        retorno = `<tr><td colspan="14">Error decoding QRPLABS/TRAQUITO data.</td></tr>`;
      }
    }

    return retorno;
  } catch (e) {
    console.error("General error in decowspr:", e);
    return `<tr><td colspan="14">An unexpected error occurred during decoding.</td></tr>`;
  }
}
