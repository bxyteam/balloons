async function initApp() {
  resizeAndScale();
  window.et = [];
  window.n = 0;
  window.smax = 0;
  window.max = 0;
  window.hactivo = "";
  window.bemit = "";
  window.ultimoreport = "";
  window.estalast = "";
  window.dxkm = [];
  window.dxkm1 = [];
  window.columns = "";
  window.colsChart = "";
  window.datas = "";
  window.avg = 0;
  window.lichome = "";
  window.home = "";
  window.homeloc = "";
  window.pwr = "";
  window.iis = 0;
  window.iib = 0;
  window.mesdereporte = "";
  window.locati = "";
  window.totals = 0;

  const mes = [
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

  // Inicialización de arrays
  let datos = [];
  let estaciones = [];
  let estacion = Array(DATA_SIZE).fill("");
  let estac = Array(21)
    .fill()
    .map(() => Array(21).fill(0));
  let bande = Array(21).fill(0);
  let bana = Array(20)
    .fill()
    .map(() => Array(33).fill(0));

  // Configuración de índices de tabl
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

  let lastz = -1;
  let o = 0;

  let calli;

  let callParam = window.getParamSafe("call", "*");
  let callsign =
    callParam === "*"
      ? "*"
      : callParam.toUpperCase().trim().replace(/ /g, "").slice(0, 12);

  let band = window.getParamSafe("band", "All");
  let limit = window.getParamSafe("timelimit", "604800");

  if (callParam === "*") {
    limit = "604800";
  }

  window.parent.document.title =
    callsign === "*" ? "DX Report" : `${callsign} DX Report`;

  let founda = false;
  calli = getParamSafe("call").toUpperCase().trim().substring(0, 12);

  // Validar el callsign
  const validCall = validateCall(calli);
  if (!validCall.ok) {
    document.getElementById("errorMessage").innerHTML =
      `<h3>Validation callsign error. ${validCall.error}</h3>`;
    document.getElementById("waiti").style.display = "none";
    return;
  }

  let callRaw = window.getParamSafe("call", "").trim();
  let callsearch = "";

  // Check if call ends with '*'
  if (callRaw.endsWith("*")) {
    callsearch = callRaw.toUpperCase();
  }

  let validCallsign = validateCallsign(callRaw);

  if (!validCallsign.valid) {
    document.getElementById("errorMessage").innerHTML =
      `<h3>Validation callsign error. ${validCallsign.error}</h3>`;
    document.getElementById("waiti").style.display = "none";
    return;
  }

  let callsign1 = callsearch;
  const omit = window.getParamSafe("omit", "") !== "" ? "1" : "0";

  let bandArrays = initializeBandArrays();
  let bandCounters = initializeBandCounters();
  window.bandas = new Array(20).fill(0);
  window.bp = 0;

  // const processReports1 = await processReporters(
  //   {
  //     band,
  //     callsign,
  //     callsign1,
  //     limit,
  //     omit,
  //   },
  //   false,
  // );

  const processReports2 = await processReporters(
    {
      band,
      callsign,
      callsign1,
      limit,
      omit,
    },
    true,
  );

  if (processReports2.error) {
    window.parent.window.location.href = processReports2.redirect;
    return;
  }

  window.Posicion = 1;
  let tabla = buscarTag("<table>", "</table>", processReports2.pag);
  //let tablam = splitASP(tabla, "<tr>", 3000, 1);
  let tablam = splitASP(tabla, "<tr>", DATA_SIZE, 1);

  agregarTablaAlDOM(tabla, tablam);

  const horainicial = tablam[tablam.length - 1]
    ? tablam[tablam.length - 1].substring(24, 40)
    : "";
  const horafinal = tablam[2] ? tablam[2].substring(24, 40) : "";

  datos = Array(tablam.length)
    .fill()
    .map(() => Array(4).fill(0));
  estaciones = Array(tablam.length)
    .fill()
    .map(() => Array(7).fill(0));

  let datosmod = "";
  for (let i = 2; i < tablam.length; i++) {
    try {
      tablam[i] = replaceAll(tablam[i], " align='right'", "");
      tablam[i] = replaceAll(tablam[i], " align='left'", "");
      tablam[i] = replaceAll(tablam[i], "&nbsp;", "");

      datosmod = replaceAll(tablam[i], "<tr>", "");
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

  let estaselect = "";
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

    estaselect = `<i><b>On ${bandi} MHz<br><br style='line-height:1px;'><select id='multiplecalls' name='multiplecalls' style='width: 80px !important;max-width:80px important!;text-align:center;font-weight:bold;font-size:12px;line-height:10px;' onchange="javascript:enviando();document.getElementById('call').value=document.getElementById('multiplecalls').value; fireSubmitFormEvent();">\n<option>Select</option>\n`;

    if (estacion.length > 0) {
      for (let d = 0; d < o; d++) {
        for (let e = d + 1; e <= o; e++) {
          if (estacion[d] > estacion[e]) {
            let estacionsave = estacion[e];
            estacion[e] = estacion[d];
            estacion[d] = estacionsave;
          }
        }
      }

      for (let p = 0; p <= o; p++) {
        estaselect += `<option value='${estacion[p]}'>${estacion[p]}</option>\n`;
      }
    }
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
  }

  // If the second character is an underscore, clear callsign1
  if (callRaw.length >= 2 && callRaw.charAt(1) === "_") {
    callsign1 = "";
  }

  let j = 1;
  window.n = 0;
  let posi = 13;
  let dmin = 0;
  let dmax = 23;

  let por = window.getParamSafe("por", "");
  if (por !== "" && por.toUpperCase() === "D") {
    posi = 10;
  }

  // tabla = buscarTag("<table>", "</table>", processReports2.pag, posicion);
  //tablam = splitASP(tabla, "<tr>", 3000, 1);

  // agregarTablaAlDOM(tabla, tablam);

  // const horainicial = tablam[tablam.length - 1]
  //   ? tablam[tablam.length - 1].substring(24, 40)
  //   : "";
  // const horafinal = tablam[2] ? tablam[2].substring(24, 40) : "";

  calli = window.getParamSafe("call", "").trim().toUpperCase();
  document.getElementById("call").value = calli;
  document.getElementById("t").value = window.getParamSafe("t", "").trim();
  document.getElementById("vl").value = window.getParamSafe("vl", "").trim();
  //if (callsign !== "*") {
  document.getElementById("showCallsignButton").innerHTML =
    `<button  onclick="event.preventDefault();mostrar('${callsign}');"
      title="See ${callsign} Data at HamCall" style="all: unset; font-family: monospace">
     <b>${callsign}</b></button>`;
  //}

  datos = Array(tablam.length)
    .fill()
    .map(() => Array(4).fill(0));
  estaciones = Array(tablam.length)
    .fill()
    .map(() => Array(7).fill(0));

  let ultimo = "";
  window.home = "";
  window.lichome = "";
  window.pwr = "";
  window.pwro = "";
  datosmod = "";
  for (let i = 2; i < tablam.length; i++) {
    // Limpiar fila
    tablam[i] = replaceAll(tablam[i], " align='right'", "");
    tablam[i] = replaceAll(tablam[i], " align='left'", "");
    tablam[i] = replaceAll(tablam[i], "&nbsp;", "");

    // Procesar datos de la fila
    datosmod = replaceAll(tablam[i], "<tr>", "");
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
        if (
          lcase(datos1[ocall]) === lcase(callParam) ||
          lcase(datos1[tcall]) === lcase(callParam)
        ) {
          ok = true;
        }
      }

      // Si no está ok, manejar redirección
      if (!ok) {
        const serverName = window.parent.window.location.hostname;
        const scriptName = window.parent.window.location.pathname;
        const queryString = window.parent.window.location.search.substring(1);

        const reloadUrl = `https://${serverName}${scriptName}?${queryString}`;

        const message = `Reload... or Press F5...    <a href="${reloadUrl}">${reloadUrl}</a>`;
        document.getElementById("errorMessage").innerHTML =
          `<h3>${message}</h3>`;
        document.getElementById("waiti").style.display = "none";
        throw new Error(message);
      }

      // Establecer valores iniciales
      ultimo = datos1[tdate] || "";
      if (calli === datos1[ocall]) {
        window.home = datos1[thome] || "";
        window.lichome = datos1[ocall] || "";
      } else {
        window.home = datos1[tloc] || "";
        window.lichome = datos1[tcall] || "";
      }
      window.pwr = datos1[7] || "";
    }

    // Verificar si ya existe la combinación fecha/banda
    const fechaCorta = (datos1[tdate] || "").substring(0, posi);
    const bandaCorta = datos1[tbanda] || "";

    if (
      j > 1 &&
      datos[j - 2][0] == fechaCorta &&
      datos[j - 2][1] == bandaCorta
    ) {
      // Incrementar contador existente
      if (calli == datos1[ocall]) {
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
      if (calli == datos1[ocall]) {
        licen1 = datos1[tcall] || "";
      } else {
        licen1 = datos1[ocall] || "";
      }

      // Verificar si la estación ya existe
      let noesta = true;
      for (let k = 0; k < n; k++) {
        if (estaciones[k][2] == licen1) {
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

        if (calli == datos1[ocall]) {
          estaciones[window.n][0] = fechaFormateada;
          estaciones[window.n][1] = (datos1[tbanda] || "").substring(0, 4);
          estaciones[window.n][2] = datos1[tcall] || "";
          estaciones[window.n][3] = datos1[tloc] || "";
          estaciones[window.n][4] = datos1[tsnr] || "";
          estaciones[window.n][5] = datos1[tkm] || "";
          estaciones[window.n][6] = datos1[tpwr] || "";
        } else {
          estaciones[window.n][0] = fechaFormateada;
          estaciones[window.n][1] = (datos1[tbanda] || "").substring(0, 4);
          estaciones[window.n][2] = datos1[ocall] || "";
          estaciones[window.n][3] = datos1[thome] || "";
          estaciones[window.n][4] = datos1[tsnr] || "";
          estaciones[window.n][5] = datos1[tkm] || "";
          estaciones[window.n][6] = datos1[tpwr] || "";
        }
        window.n = window.n + 1;
      }

      // Actualizar contador de estación existente
      for (let p = window.n - 1; p >= 0; p--) {
        if (estaciones[p][2] == licen1) {
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
          if (Math.abs(parseInt(banx)) === Math.abs(parseInt(bande[z]))) {
            found = true;
            break;
          }
        }

        if (!found) {
          bande[z] = banx;
          lastz = lastz + 1;
        }
        const s1 = parseInt(
          datos[j - 1][0].substring(datos[j - 1][0].length - 2),
        );
        let s2 = datos[j - 1][2];
        s2 = isNaN(s2) ? 0 : parseFloat(s2);
        if (!bana[banx]) bana[banx] = [];
        bana[banx][s1] = bana[banx][s1] + s2;
        bana[banx][32] = bana[banx][32] + s2;
      }

      j = j + 1;
    }

    // Actualizar contadores finales
    if (datos1[ocall] == calli) {
      window.iib = window.iib + 1;
      window.pwro = datos1[tpwr] || "";
    }
    if (datos1[tcall] == calli) {
      window.iis = window.iis + 1;
    }
  }

  window.hactivo = horasactivo(horainicial, horafinal);

  let rf = "";
  if (window.iis === 0 && window.iib === 0) {
    rf = " ";
  } else {
    window.totals = window.iib + window.iis;
    rf = "";
    if (window.iib > 0) {
      rf = Math.round((window.iib / totals) * 100, 0) + "% as Beacon";
      if (window.iis > 0) rf = rf + "<br>";
    }
    if (window.iis > 0) {
      rf = rf + Math.round((window.iis / totals) * 100, 0) + "% as Spotter";
    }
  }
  bandCounters = fillBandCounters(bana);
  bandArrays = fillBandArrays(bandArrays, bana);

  for (let v = 0; v < lastz - 1; v++) {
    for (let w = v + 1; w <= lastz; w++) {
      if (bande[w] < bande[v]) {
        const savev = bande[v];
        bande[v] = bande[w];
        bande[w] = savev;
      }
    }
  }

  for (let s = 0; s < 20; s++) {
    const row = [s * 1000]; // Inicia cada fila con la distancia

    const ini = lastz > 5 ? 1 : 0;
    for (let k = 0; k <= lastz; k++) {
      const value = estac[s][bande[k]] || 0;
      const tooltipText = `At ${s * 1000} Km.\n${value} Reports\n On ${did.get(bande[k])} MHz`;

      if (value !== 0) {
        row.push(value, tooltipText);
        if (s > window.smax) window.smax = s;
      } else {
        row.push(0, tooltipText);
      }
    }

    window.dxkm.push(row);
  }

  window.dxkm1 = window.dxkm.flat();
  window.homeloc = window.home;
  window.n = window.n - 1;
  const fracciondia =
    (parseInt(ultimo.substring(11, 13)) +
      parseInt(ultimo.substring(14, 16)) / 60) /
    24;

  for (let w = 0; w <= n; w++) {
    window.et.push([]);
    for (let u = 0; u < 8; u++) {
      window.et[w].push(estaciones[w][u] || "");
    }
  }

  const last = j - 2;

  // Determinar rango de fechas/horas
  por = window.getParamSafe("por", "");
  if (por === "" || por.toUpperCase() === "H") {
    dmax = fh(datos[3][0]);
    dmin = fh(datos[last][0]);
  }

  const tzParam = window.getParamSafe("tz");

  // Initialize delta
  let delta = 0;

  // Logic to set delta based on tz and por
  if (tzParam !== "" && isNumeric(tzParam)) {
    delta = parseInt(tzParam, 10);
  }

  if (por.toUpperCase() === "D") {
    delta = 0;
  }

  const mesNum1 = parseInt(datos[1][0].substring(5, 7));
  const mesNum2 = parseInt(datos[j - 2][0].substring(5, 7));

  window.mesdereporte = getMes(mesNum1);

  if (mesNum2 !== mesNum1) {
    window.mesdereporte = getMes(mesNum2) + " / " + getMes(mesNum1);
  }
  window.mesdereporte = window.mesdereporte + " " + datos[1][0].substring(0, 4);
  //agregarBanda(banda, k, nombre, columns, cols, bandas, bp)
  if (bandCounters.bac > 0) agregarBanda("ba", bandCounters.bac, "LF");
  if (bandCounters.b0c > 0) agregarBanda("b0", bandCounters.b0c, "MF");
  if (bandCounters.b1c > 0) agregarBanda("b1", bandCounters.b1c, "1.8 MHz");
  if (bandCounters.b3c > 0) agregarBanda("b3", bandCounters.b3c, "3.5 MHz");
  if (bandCounters.b5c > 0) agregarBanda("b5", bandCounters.b5c, "5 MHz");
  if (bandCounters.b7c > 0) agregarBanda("b7", bandCounters.b7c, "7 MHz");
  if (bandCounters.b10c > 0) agregarBanda("b10", bandCounters.b10c, "10 MHz");
  if (bandCounters.b13c > 0) agregarBanda("b13", bandCounters.b13c, "13 MHz");
  if (bandCounters.b14c > 0) agregarBanda("b14", bandCounters.b14c, "14 MHz");
  if (bandCounters.b18c > 0) agregarBanda("b18", bandCounters.b18c, "18 MHz");
  if (bandCounters.b21c > 0) agregarBanda("b21", bandCounters.b21c, "21 MHz");
  if (bandCounters.b24c > 0) agregarBanda("b24", bandCounters.b24c, "24 MHz");
  if (bandCounters.b28c > 0) agregarBanda("b28", bandCounters.b28c, "28 MHz");
  if (bandCounters.b40c > 0) agregarBanda("b40", bandCounters.b40c, "40 MHz");
  if (bandCounters.b50c > 0) agregarBanda("b50", bandCounters.b50c, "50 MHz");
  if (bandCounters.b70c > 0) agregarBanda("b70", bandCounters.b70c, "70 MHz");
  if (bandCounters.b144c > 0)
    agregarBanda("b144", bandCounters.b144c, "144 MHz");
  if (bandCounters.b432c > 0)
    agregarBanda("b432", bandCounters.b432c, "432 MHz");
  if (bandCounters.b1296c > 0)
    agregarBanda("b1296", bandCounters.b1296c, "1296 MHz");
  window.datas = generarMinutos({
    datos,
    last,
    delta,
    fracciondia,
    bandArrays,
  });
  window.bemit = "On ";
  for (let bb = 0; bb < window.bp; bb++) {
    let bbb = window.bandas[bb].replace("b", "");
    if (bbb === "3") bbb = "3.5";
    if (bbb === "1") bbb = "1.8";
    if (bbb === "0") bbb = "0.475";
    if (bbb === "a") bbb = "0.136";

    if (bbb !== "") window.bemit += bbb;
    if (bb === window.bp - 2) {
      window.bemit += " and ";
    } else if (bb < window.bp - 1) {
      window.bemit += ", ";
    }
  }
  window.bemit = window.bemit.substring(0, window.bemit.length - 2) + " MHz";
  const bm = await obtenerBeaconCsvDatos();
  const esta = Array(450)
    .fill()
    .map(() => Array(6).fill(""));
  let estacuenta = 0;
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
  window.estalast = estacuenta;
  for (let i = 0; i < window.estalast - 1; i++) {
    for (let j = i + 1; j < window.estalast; j++) {
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
  const combobox = generarComboHTML({
    esta,
    estaselect,
    datos,
    ocall,
    tcall,
    rf,
    last,
  });
  document.getElementById("comboHtmlTemplate").innerHTML = combobox;
  document.getElementById("mesDeReporte").innerText = window.mesdereporte;
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

  if (gqs("bs") == "A" || !gqs("bs")) {
    document.getElementById("resumen").innerHTML = `<center>
      <table class='transparent' style='width:110px;color:#ffffff;font-family:Tahoma,Arial;font-size:12px;text-shadow: 2px 2px 0 black;'>
      <tr class='none'><td align=center onclick='mostrar(${window.lichome})' title='See ${window.lichome}&#13; at HamCall' onmouseout="this.style.backgroundColor='';" onmouseover="this.style.backgroundColor='#335c6e';">
      <span style='font-size:20px;font-weight'>
      <u>${window.lichome}</u>
      </span>
      <br>Sent / Received<br>${window.n + 1} Callsigns<br>${window.bemit
        .split(",")
        .reduce((acc, val, idx) => {
          if (idx !== 0 && idx % 3 === 2) {
            return `${acc} ${val},<br>`;
          }
          return `${acc} ${val},`;
        }, "")
        .slice(0, -5)}</td></tr></table></center>`;
  } else {
    if (gqs("bs") == "B" || !gqs("bs")) {
      document.getElementById("resumen").innerHTML =
        `<center><table class='transparent' style='width:110px;color:#ffffff;font-family:Tahoma,Arial;font-size:12px;text-shadow: 2px 2px 0 black;'><tr class='none'><td align=center onclick='mostrar(${window.lichome})' title='See ${window.lichome}&#13; at HamCall' onmouseout="this.style.backgroundColor='transparent';" onmouseover="this.style.backgroundColor='#012d52';"><span style='font-size:20px;font-weight'><u>${window.lichome}</u></span><br>Pwr ${window.pwr} Watt<br>${window.bemit
          .split(",")
          .reduce((acc, val, idx) => {
            if (idx !== 0 && idx % 3 === 2) {
              return `${acc} ${val},<br>`;
            }
            return `${acc} ${val},`;
          }, "")
          .slice(
            0,
            -5,
          )}<br>${window.n + 1} Spotters</td></tr></table></center>`;
    } else {
      document.getElementById("resumen").innerHTML =
        `<center><table class='transparent' style='width:110px;color:#ffffff;font-family:Tahoma,Arial;font-size:12px;text-shadow: 2px 2px 0 black;'><tr class='none'><td align=center onclick='mostrar(${window.lichome})' title='See ${window.lichome}&#13; at HamCall' onmouseout="this.style.backgroundColor='';" onmouseover="this.style.backgroundColor='#335c6e';"><span style='font-size:20px;font-weight'>${window.lichome}</span><br>Spots Received<br>${window.bemit
          .split(",")
          .reduce((acc, val, idx) => {
            if (idx !== 0 && idx % 3 === 2) {
              return `${acc} ${val},<br>`;
            }
            return `${acc} ${val},`;
          }, "")
          .slice(0, -5)}<br>${window.n + 1} Beacons</td></tr></table></center>`;
    }
  }

  sunla = sunlat;
  sunlo = sunlon;
  sunlat = 602 - (270 + sunlat * 3);
  sunlon = 1080 - (540 - sunlon * 3) + 126;
  if (z == 1) {
    sunlon = sunlon + 540 - homexy(window.homeloc).x;
    if (sunlon > 1080) {
      sunlon = sunlon - 1080;
    }
    if (sunlon < 0) {
      sunlon = sunlon + 1080;
    }
    if (sunlon < 125) {
      sunlon = sunlon + 1080;
    }
  }

  carga();
}

function submitForm(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const params = new URLSearchParams(formData).toString();
  window.parent.window.location.href = `${HOST_URL}/dx?${params}`;
}

function fireSubmitFormEvent() {
  const form = document.getElementById("enviar");
  const event = new Event("submit", { bubbles: true, cancelable: true });
  form.dispatchEvent(event);
}

window.addEventListener("load", initApp);
window.addEventListener("resize", resizeAndScale);
