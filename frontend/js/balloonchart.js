var being_dragged = false;
var Vuelo = window.getParamSafe("Vuelo");
var callsign = window.getParamSafe("callsign");
var GOOGLE_API_KEY = "AIzaSyAACTum6vjLOeCDgGj6EFFnzJMe7r8xOII";
var WEB_FETCHER_URL = "/api/v1/webFetcher";
var llheightCache = "";
var lltimezoneCache = "";
var PI = Math.PI; // 3.141592653589793
var DEG2RAD = Math.PI / 180; // 0.017453292519943295
var RAD2DEG = 180 / Math.PI; // 57.29577951308232

var options = {
  width: window.innerWidth,
  bottom: 0,
  vAxis: {
    gridlines: {
      color: "#DCDCDC",
      count: 16,
    },
  },
  hAxis: {
    gridlines: {
      color: "#DCDCDC",
      count: 32,
    },
  },
  smoothLine: true,
  chartArea: {
    width: "82%",
    height: "80%",
  },
  legend: "top",
};

window.parent.window.document.title = `${callsign} Balloon ${mayusculaPrimeras(getParamSafe("grafico"))} Chart from EOSS & Findu`;
window.columnsChart = [
  { type: "datetime", value: "Hour-Local" },
  { type: "datetime", value: "Hour-UTC" },
];
window.rowsChart = [];

var x,
  y,
  element,
  pag,
  m,
  lastm,
  help,
  help1,
  VOR1,
  VOR2,
  VOR1La,
  VOR1Lo,
  VOR2La,
  VOR2Lo,
  GLatdeg,
  GLondeg,
  posits,
  cityname;
var Elapsed = 0;
var Discarddata = "";
var mes = [
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
var dates = [];
var vorloc = [];
var normalvorloc = [];
var blastvorloc = [];
var previousvorlocblast = [];

var posis = Array(55001)
  .fill()
  .map(() => Array(6).fill(0));

async function startApp() {
  document.getElementById("callsign").value = callsign;
  if (callsign === "") {
    callsign = "AE0SS-11";
  }
  grafico = getParamSafe("grafico");
  if (grafico === "") {
    grafico = "height f";
  }

  let estaciones = "http://www.findu.com/cgi-bin/map-near.cgi?call=" + callsign;

  // estaciones proximas escuchadas la ultima hora hasta 550 millas = "http://www.findu.com/cgi-bin/near.cgi?call=lu7aa-11&last=1&n=300&distance=550"
  let body = new URLSearchParams({ url: estaciones }).toString();
  pag = await getURLXform(WEB_FETCHER_URL, body);

  let stations = parseStations(pag);
  let stationlast = 10;

  for (let z = 10; z >= 0; z--) {
    if (stations[z][0] === "") {
      stationlast = z;
      // break;
    }
  }
  for (let z = 0; z <= stationlast; z++) {
    if (ucase(stations[z][0]) === ucase(callsign)) {
      GLatdeg = stations[z][1];
      GLondeg = stations[z][2];
    }
  }
  // Now get latest points to draw path
  let spanhours = 900;
  let pag1 = "";
  let temperaturas = [];
  if (
    callsign.toLowerCase() === "lu7aa-11" ||
    callsign.toLowerCase() === "lu7aa-12"
  ) {
    pag1 = await getShareResource("140308posit.txt");
    pag = await getShareResource("130308raw.txt"); // ADD <br> for each line

    pag = pag.replace(/\r\n|\n\r|\n|\r/g, function (match) {
      return "<br>";
    });
    const urlaprsfi = "151003raworig.txt";
    const rawdata = await getShareResource(urlaprsfi);

    window.Posicion = 1;
    temperaturas = processAprsData(rawdata, pag);
  }

  pag = "";
  window.Posicion = 1;

  //let validdata = true;
  let urlpath = `http://www.findu.com/cgi-bin/posit.cgi?call=${callsign}&comma=1&start=${spanhours}&time=1`;

  body = new URLSearchParams({ url: urlpath }).toString();
  pag = await getURLXform(WEB_FETCHER_URL, body);

  if (pag.length < 500) {
    urlpath = `http://www1.findu.com/cgi-bin/posit.cgi?call=${callsign}&comma=1&start=${spanhours}&time=1`;
    body = new URLSearchParams({ url: urlpath }).toString();
    pag = await getURLXform(WEB_FETCHER_URL, body);
  }
  const pagHmResult = procesarPagHm(pag, pag1);
  let pathm = pagHmResult.pathm;

  if (pathm.length > 0) {
    pathm.pop();
  }

  if (!pagHmResult.limite || pathm.length < 2) {
    throw new Error("Sorry, no positions found for: " + callsign);
  }

  let daysave = cuantosDias(pathm[0].split(",")[0]);
  let fecha1 = cuantosDias(pathm[pagHmResult.limite].split(",")[0]);

  let tx = 0;
  let ssavem = Array(pagHmResult.limite)
    .fill()
    .map(() => Array(2).fill(""));
  var ssavempointer = 0;
  ssavem[ssavempointer][0] = pagHmResult.limite;
  ssavem[ssavempointer][1] = cuantosDias(
    pathm[pagHmResult.limite].split(",")[0],
  );
  ssavempointer = ssavempointer + 1;
  let heightvalid = false;
  let heightp = 0;
  let hmx = Array(3001)
    .fill()
    .map(() => Array(2).fill(""));
  let heighpointer = 0;
  let heighp = 0;
  let fecha2 = "";
  for (let s = pagHmResult.limite; s > 0; s--) {
    // Verificar si la subcadena desde la posición 1 con longitud 13 no está vacía
    // mid(pathm(s), 2, 13) en VB equivale a substring(1, 14) en JS
    if (pathm[s].substring(1, 14) !== "") {
      // Extraer fecha (14 caracteres desde la posición 1)
      fecha2 = cuantosDias(pathm[s].split(",")[0]);

      // Calcular diferencia en días
      const diferenciaDias =
        Math.abs(fecha1.getTime() - fecha2.getTime()) / (1000 * 60 * 60 * 24);

      if (diferenciaDias < 0.4) {
        // less than 0.4 day
        daysave = cuantosDias(pathm[s].split(",")[0]);

        // Verificar el último carácter si es numérico
        const ultimoCaracter = pathm[s].slice(-1);
        if (!heightvalid && isNumeric(ultimoCaracter)) {
          heightvalid = true;
        }
      } else {
        // Guardar en ssavem
        ssavem[ssavempointer] = [s, fecha1]; // [s, cuantosDias(pathm[s + 1].split(",")[0])];
        ssavempointer++;
      }

      fecha1 = fecha2;
    }
  }

  // ssavempointer = ssavempointer - 1;
  ssavem[ssavempointer][0] = 0;
  ssavem[ssavempointer][1] = cuantosDias(pathm[1].split(",")[0]);

  let comienzo = 0;
  let final = 0;
  if (Vuelo === "") {
    comienzo = ssavem[1][0];
    final = ssavem[0][0] - 1;
    let checkm = pathm[0].split(",")[3];
    if (checkm[4] == "0.0") {
      final = final - 1;
    }
    // comienzo=0 //Ojo agregado para que tome desde el comienzo
  } else {
    if (Vuelo * 1 < ssavempointer + 1) {
      comienzo = ssavem[Vuelo * 1][0];
      final = ssavem[Vuelo * 1 - 1][0] - 1;
    } else {
      comienzo = ssavem[1][0];
      final = ssavem[0][0] - 1;
    }
  }

  let heightpointer = 0;

  if (!heightvalid) {
    let heighturl = `http://www.findu.com/cgi-bin/rawposit.cgi?time=1&call=${callsign}&start=120&length=124`;
    body = new URLSearchParams({ url: heighturl }).toString();
    let heightdata = await getURLXform(WEB_FETCHER_URL, body);
    let heightm = heightdata.split("<br>", 4000, 1);
    for (h = 0; h <= heightm.length - 1; h++) {
      if (
        trim(left(heightm[h], 15)) >= trim(left(pathm[comienzo], 15)) &&
        trim(left(heightm[h], 15)) <= trim(left(pathm[final], 15))
      ) {
        hmx[heightpointer][0] = trim(left(heightm[h], 15));
        let hmxm = heightm[h].split("/A=", 100, 1);
        hmx[heightpointer][1] = left(hmxm[1], 6);
        heightpointer = heightpointer + 1;
      }
    }
  }

  let heightpointermax = heightpointer - 1;

  if (getParamSafe("flights") !== "") {
    comienzo = 0;
    final = pathm.length - 1;
  }
  let ssave = 0;
  if (left(callsign, 5).toLowerCase() === "k6rpt") {
    ssave = 9;
  }

  //  Fin de determinar cuantos vuelos hay y sus fechas horas de comienzo
  window.Posicion = 1;
  /*
  if (
    left(callsign, 5).toLowerCase() === "lu7aa" &&
    left(pathm[0], 5) === "20140"
  ) {
    insertar();
  }
  */
  um = 0;
  icono = imageSrcUrl["point"];
  iconblast = imageSrcUrl["blast"];
  iconblast1 = imageSrcUrl["blast1"];
  Delta = "0,0";
  switcher = false;
  wdir = " ";
  wspeed = "";
  firstdata = false;
  if (getParamSafe("flights") !== "") {
    ssave = 0;
  }
  posdatad = pathm[comienzo + 1].split(",");

  // timezone = await getTimezone(
  //   posdatad[1],
  //   posdatad[2],
  //   new Date(cuantosDias(posdatad[0].split(",")[0])),
  // );
  timezone = ""; //await getTimezoneOffsetFromGeoTimeZone(posdatad[1], posdatad[2]);
  Glatlaunchdeg = posdatad[1];
  Glonlaunchdeg = posdatad[2];
  feetlaunch = ""; //(await getAltura(Glatlaunchdeg, Glonlaunchdeg)) * 3.28084;
  if (feetlaunch * 1 < 0) {
    feetlaunch = 100;
  }
  feetdelta = feetlaunch;

  if (
    callsign.toLowerCase() === "lu7aa-11" ||
    callsign.toLowerCase() === "lu7aa-12"
  ) {
    window.columnsChart.push({
      type: "number",
      value: "Height meters (above sea level)",
    });
    window.columnsChart.push({
      type: "number",
      value: "Height feet (above terrain)",
    });
    window.columnsChart.push({ type: "number", value: "Direction degrees" });
    window.columnsChart.push({ type: "number", value: "Speed Km/h" });
    window.columnsChart.push({
      type: "number",
      value: "Speed knots (nautical miles/hour)",
    });
    window.columnsChart.push({ type: "number", value: "Up/Down m/sec" });
    window.columnsChart.push({ type: "number", value: "Up/Down feet/sec" });
    window.columnsChart.push({ type: "number", value: "Latitude" });
    window.columnsChart.push({ type: "number", value: "Longitude" });
    window.columnsChart.push({ type: "string", value: "icon" });
    window.columnsChart.push({ type: "number", value: "Temp.Exterior" });
    window.columnsChart.push({ type: "number", value: "Temp.Interior" });
    window.columnsChart.push({ type: "number", value: "Voltaje" });
  } else {
    window.columnsChart.push({
      type: "number",
      value: "Height meters (above sea level)",
    });
    window.columnsChart.push({
      type: "number",
      value: "Height feet (above terrain)",
    });
    window.columnsChart.push({ type: "number", value: "Direction degrees" });
    window.columnsChart.push({ type: "number", value: "Speed Km/h" });
    window.columnsChart.push({
      type: "number",
      value: "Speed knots (nautical miles/hour)",
    });
    window.columnsChart.push({ type: "number", value: "Up/Down m/sec" });
    window.columnsChart.push({ type: "number", value: "Up/Down feet/sec" });
    window.columnsChart.push({ type: "number", value: "Latitude" });
    window.columnsChart.push({ type: "number", value: "Longitude" });
    window.columnsChart.push({ type: "string", value: "icon" });
  }

  var deltaaltura = 0;
  var previousheight = 0;
  tx = 0;
  var ty = 0;

  if (
    callsign.toLowerCase() === "lu7aa-11" ||
    callsign.toLowerCase() === "lu7aa-12"
  ) {
    for (let s = comienzo; s <= final; s++) {
      ff = left(pathm[s], 14);
      fechaf = cDate(
        left(ff, 4) +
          "-" +
          mid(ff, 5, 2) +
          "-" +
          mid(ff, 7, 2) +
          " " +
          mid(ff, 9, 2) +
          ":" +
          mid(ff, 11, 2) +
          ":" +
          mid(ff, 13, 2),
      );
      for (let h = tx; h < temperaturas.length; h++) {
        if (
          temperaturas[tx].fecha >= fechaf &&
          temperaturas[tx].valores !== ""
        ) {
          pathm[s] = pathm[s] + "," + trim(temperaturas[tx].valores);
          break;
        } else {
          tx = tx + 1;
        }
      }
    }
  }
  var maxheight = 0;
  var avgupf = 0;
  var avgupm = 0;
  var avgupcount = 0;
  var avgdof = 0;
  var avgdom = 0;
  var avgdocount = 0;
  var avgwsf = 0;
  var avgwsm = 0;
  var avgwscount = 0;
  var avgdir = 0;
  let previouslat = 0;
  let previouslon = 0;
  let previousdatespeed = 0;
  let posdatam1s = 0;
  let posdatam2s = 0;
  let posdatam0s = 0;
  let actualdateformated = "";
  let prevdateformated = "";
  let previousdate = "";
  let heightsave = 0;
  let diafinal = "";
  let launch = "";
  let launchdate = "";
  let launchtime = "";
  let deltaupdown = 0;
  let deltafeetpersecond = 0;
  let deltaMetersPerSecond = 0;
  let timeinitial = "";
  let diainicial = "";
  let lati1 = "";
  let loni1 = "";
  let latii1 = "";
  let lonii1 = "";
  let lati2 = "";
  let loni2 = "";
  let timefinal = "";
  let hightime = "";

  for (let s = comienzo + 1; s <= final; s++) {
    let posdatam = pathm[s].split(",");
    if (s > comienzo) {
      wdir = trim(posdatam[3]);
    } else {
      wdir = "";
    }

    if (s > comienzo) {
      let value = posdatam[4].trim();
      value = value.replace(/\n/g, ""); // chr(10)
      value = value.replace(/\r/g, ""); // chr(13)
      value = value.replace(/\t/g, ""); // chr(9)
      wspeed = value;
    } else {
      wspeed = "0.0";
    }

    if (parseFloat(wspeed) > 300) {
      wspeed = "0.0";
    }
    if (wdir === "") {
      wdir = "0";
    }
    if (wdir === "&nbsp;") {
      wdir = "0";
    }
    if (wdir === " ") {
      wdir = "0";
    }

    if (s === comienzo) {
      wdir = "0.0";
      wspeed = "1";
      if (previouslat === "") {
        previouslat = posdatam[1];
        previouslon = posdatam[2];
      }
      if (previousdatespeed === "") {
        previousdatespeed = cuantosDias(pathm[s].split(",")[0]); // cDate(cuantosDias(pathm[s].split(",")[0]));
      }
    } //end if (s === comienzo)

    if (wdir === "" || wdir === " " || wspeed == "0.0" || wspeed == "") {
      wdir = bearing1(previouslat, posdatam[1], previouslon, posdatam[2]);
      actualdatespeed = cuantosDias(pathm[s].split(",")[0]);
      let prevDateSpeed = previousdatespeed == "0" ? 0 : previousdatespeed;
      distanciarecorrida = distancia(
        previouslat,
        previouslon,
        posdatam[1],
        posdatam[2],
      );
      tiemposegundos =
        (new Date(actualdatespeed) - new Date(prevDateSpeed)) / 1000;

      Velociknots =
        tiemposegundos !== 0
          ? ((distanciarecorrida / tiemposegundos) * 3600) / 1.852
          : 0;
      wspeed = formatNumber(Velociknots, 2);
      wspeed = replace(wspeed, ",", "", 1, 30, 1);
      wdir = formatNumber(wdir, 1);
      previouslat = posdatam[1];
      previouslon = posdatam[2];
      previousdatespeed = actualdatespeed;

      if (!isNumeric(posdatam[5])) {
        posdatam[5] = hmx[heightp][1];

        if (heightp < heightpointermax && posdatam[0] > hmx[height][0]) {
          heightp = heightp + 1;
        }
        pathm[s] =
          posdatam[0] +
          "," +
          posdatam[1] +
          "," +
          posdatam[2] +
          "," +
          wdir +
          "," +
          wspeed +
          "," +
          posdatam[5];
        if (
          callsign.toLowerCase() === "lu7aa-11" ||
          callsign.toLowerCase() === "lu7aa-12"
        ) {
          pathm[s] =
            pathm[s] +
            "," +
            posdatam[7] +
            "," +
            posdatam[8] +
            "," +
            posdatam[9];
        }
      }
      posdatam[3] = wdir;
      posdatam[4] = wspeed;
    } // END if (wdir === "" || wdir === " " || wspeed == "0.0" || wspeed == "")

    if (s === comienzo + 1) {
      if (posdatam[0].length === 14) {
        posdatam[0] = " " + posdatam[0];
      }
      lati1 = posdatam[1];
      loni1 = posdatam[2];
      latii1 = posdatam[1];
      lonii1 = posdatam[2];
      const fullDate = cuantosDias(pathm[s].split(",")[0]);
      timeinitial = cDate(
        right("00" + (fullDate.getMonth() + 1), 2) +
          "/" +
          right("00" + fullDate.getDate(), 2) +
          "/" +
          right("00" + fullDate.getFullYear(), 4) +
          " " +
          right("00" + fullDate.getHours(), 2) +
          ":" +
          right("00" + fullDate.getMinutes(), 2) +
          ":" +
          right("00" + fullDate.getSeconds(), 2),
      );
      diainicial = right("00" + fullDate.getDate(), 2);
    } // end s === comienzo + 1

    if (!isDate(timeinitial)) {
      if (s === comienzo + 1) {
        lati1 = posdatam[1];
        loni1 = posdatam[2];
        if (posdatam[0].length === 14) {
          posdatam[0] = " " + posdatam[0];
        }
        const fullDate = cuantosDias(pathm[s].split(",")[0]);
        timeinitial = cDate(
          right("00" + (fullDate.getMonth() + 1), 2) +
            "/" +
            right("00" + fullDate.getDate(), 2) +
            "/" +
            right("00" + fullDate.getFullYear(), 4) +
            " " +
            right("00" + fullDate.getHours(), 2) +
            ":" +
            right("00" + fullDate.getMinutes(), 2) +
            ":" +
            right("00" + fullDate.getSeconds(), 2),
        );
      }
    } // end (isDate(timeinitial))

    if (s === final) {
      lati2 = posdatam[1];
      loni2 = posdatam[2];
      if (posdatam[0].length === 14) {
        posdatam[0] = " " + posdatam[0];
      }
      const launchFullDate = cuantosDias(pathm[s].split(",")[0]);
      timefinal = cDate(
        right("00" + (launchFullDate.getMonth() + 1), 2) +
          "/" +
          right("00" + launchFullDate.getDate(), 2) +
          "/" +
          right("00" + launchFullDate.getFullYear(), 4) +
          " " +
          right("00" + launchFullDate.getHours(), 2) +
          ":" +
          right("00" + launchFullDate.getMinutes(), 2) +
          ":" +
          right("00" + launchFullDate.getSeconds(), 2),
      );
      diafinal = right("00" + launchFullDate.getDate(), 2);
      if (actualdateformated === "") {
        actualdateformated = dateFormatter(posdatam[0]);
        actualdate = new Date(actualdateformated);
        actualdate.setTime(actualdate.getTime() + timezone * 60 * 60 * 1000);
      }
      if (launch === "") {
        if (right(callsign, 2) === "11" || right(callsign, 2) === "12") {
          launch = " - Launched ";
        } else {
          launch = " from ";
        }
        launch = launch + mes[launchFullDate.getMonth() + 1] + "-";
        launch =
          launch +
          right("0" + launchFullDate.getDate(), 2) +
          "-" +
          launchFullDate.getFullYear() +
          " at ";
        hourlocaldetail = launchFullDate.getHours(); //(mid(pathm[s], 10, 2) * 1 + timezone) % 24;
        if (hourlocaldetail < 0) {
          hourlocaldetail = hourlocaldetail + 24;
        }
        launch = launch + right("0" + hourlocaldetail, 2) + ":";
        launchdate =
          launchFullDate.getMonth() + 1 + "/" + launchFullDate.getDate();
        launchtime =
          right("0" + hourlocaldetail, 2) +
          ":" +
          right("0" + launchFullDate.getMinutes(), 2) +
          ":" +
          right("0" + launchFullDate.getSeconds(), 2);
        launch =
          launch +
          right("0" + launchFullDate.getMinutes(), 2) +
          ":" +
          right("0" + launchFullDate.getSeconds(), 2) +
          " local = (";
        launch = launch + right("0" + launchFullDate.getHours(), 2) + ":";
        launch = launch + right("0" + launchFullDate.getMinutes(), 2) + ":";
        launch = launch + right("0" + launchFullDate.getSeconds(), 2) + " Z)";
      }
    } // end (s === final)

    if (s > comienzo) {
      if (posdatam[3] != "") {
        if (posdatam[3] * 1 != 0) {
          if (posdatam[3] !== "&nbsp;") {
            wdir = trim(posdatam[3]);
          }
        }
      }
      if (posdatam[4] != "") {
        if (posdatam[4] * 1 !== 0) {
          if (posdatam[4] != "&nbsp;") {
            let value = posdatam[4].trim();
            value = value.replace(/\n/g, ""); // chr(10)
            value = value.replace(/\r/g, ""); // chr(13)
            value = value.replace(/\t/g, ""); // chr(9)
            wspeed = value;
          }
        }
      }
    } // end (s > comienzo)

    if (`${wdir}`.length > 1) {
      wdir = wdir;
    } else {
      wdir = "0.0";
    }
    if (posdatam1s === "") {
      posdatam1s = posdatam[1] - 0.05;
    }
    if (posdatam2s === "") {
      posdatam2s = posdatam[2] - 0.05;
    }
    latdelta = posdatam[1] - posdatam1s;
    londelta = posdatam[2] - posdatam2s;
    if (latdelta < 0) {
      latdelta = -latdelta;
    }
    if (londelta < 0) {
      londelta = -londelta;
    }
    if (latdelta === "" || latdelta === "") {
      latdelta = 0.05;
      londelta = 0.05;
    }
    if (
      callsign.toLowerCase() === "lu7aa-11" ||
      callsign.toLowerCase() === "lu7aa-12"
    ) {
      T1 = posdatam[posdatam.length - 2];
      T2 = posdatam[posdatam.length - 1];
      T3 = posdatam[posdatam.length - 0];
    }

    if (`${wspeed}`.length > 0) {
      wspeed = wspeed;
    } else {
      wspeed = "0.0";
    }

    if (
      posdatam[0] != posdatam0s &&
      (posdatam[1] != posdatam1s || posdatam[2] != posdatam2s) &&
      posdatam[5] * 1 > 350 &&
      posdatam[5] != "4199" &&
      posdatam[5] != "48753" &&
      posdatam[5] != "57021" &&
      posdatam[5] != "53740" &&
      posdatam[5] * 1 > 36000
    ) {
      posis[um][0] = trim(posdatam[1]);
      posis[um][1] = trim(posdatam[2]);
      posis[um][2] = trim(posdatam[0]);
      if (trim(posdatam[5]) != "" && posdatam0s != posdatam[0]) {
        deltaaltura = previousheight * 1 - posdatam[5] * 1;
        if (deltaaltura < 0) {
          deltaaltura = deltaaltura * -1;
        }

        if (trim(posdatam[5]) != "&nbsp;") {
          actualdateformated = dateFormatter(posdatam[0]);
          if (isDate(new Date(actualdateformated))) {
            if (!firstdata) {
              if (right(callsign, 2) == "11" || right(callsign, 2) == "12") {
                launch = " - Launched ";
              } else {
                launch = " from ";
              }
              const launchFullDate = cuantosDias(pathm[s].split(",")[0]);
              launch = launch + mes[launchFullDate.getMonth() + 1] + "-";
              launch =
                launch +
                right("0" + launchFullDate.getDate(), 2) +
                "-" +
                launchFullDate.getFullYear() +
                " at ";
              hourlocaldetail = launchFullDate.getHours(); //(mid(pathm[s], 10, 2) * 1 + timezone) % 24;
              if (hourlocaldetail < 0) {
                hourlocaldetail = hourlocaldetail + 24;
              }
              launch = launch + right("0" + hourlocaldetail, 2) + ":";
              launchdate =
                launchFullDate.getMonth() + 1 + "/" + launchFullDate.getDate();
              launchtime =
                right("0" + hourlocaldetail, 2) +
                ":" +
                right("0" + launchFullDate.getMinutes(), 2) +
                ":" +
                right("0" + launchFullDate.getSeconds(), 2);

              launch =
                launch +
                right("0" + launchFullDate.getMinutes(), 2) +
                ":" +
                right("0" + launchFullDate.getSeconds(), 2) +
                " local = (";
              launch = launch + right("0" + launchFullDate.getHours(), 2) + ":";
              launch =
                launch + right("0" + launchFullDate.getMinutes(), 2) + ":";
              launch =
                launch + right("0" + launchFullDate.getSeconds(), 2) + " Z)";
              firstdata = true;
            } // end if(!firsdata)

            if (isDate(new Date(prevdateformated))) {
              actualheight = parseFloat(posdatam[5]); // Índice 5 en JavaScript (era 5 en ASP)

              deltaheight = actualheight - previousheight;

              // Fecha actual (equivalente a cDate)
              actualdate = new Date(actualdateformated);

              // Tiempo transcurrido en segundos
              // En ASP: (actualdate - previousdate)*1440*60
              // 1440 = minutos en un día, 60 = segundos en un minuto
              // En JavaScript: diferencia en milisegundos / 1000 para convertir a segundos
              Elapsed = (actualdate.getTime() - previousdate.getTime()) / 1000;

              // Delta en pies por segundo
              deltafeetpersecond = deltaheight / Elapsed;

              // Formatear y construir string Delta
              // Convertir pies a metros (*0.3048) y formatear con 1 decimal
              deltaMetersPerSecond = deltafeetpersecond * 0.3048;
              let formattedMeters = replaceText(
                formatNumberV2(deltaMetersPerSecond, 1, true, false, false),
                ",",
                "",
                0,
                30,
              );

              // Formatear pies por segundo con 1 decimal
              let formattedFeet = replaceText(
                formatNumberV2(deltafeetpersecond, 1),
                ",",
                "",
                0,
                50,
              );

              Delta = formattedMeters + "," + formattedFeet;
              if (actualheight * 1 > maxheight) {
                if (actualheight * 1 > 10) {
                  maxheight = actualheight * 1;
                }
                if (posdatam[0].length > 12) {
                  hightime = posdatam[0];
                }
              }

              if (deltafeetpersecond > 0) {
                avgupf = avgupf + deltafeetpersecond;
                avgupm = avgupm + deltafeetpersecond * 0.3048;
                avgupcount = avgupcount + 1;
              } else {
                avgdof = avgdof + deltafeetpersecond;
                avgdom = avgdom + deltafeetpersecond * 0.3048;
                avgdocount = avgdocount + 1;
              }
              avgdir = avgdir + Number(wdir);
              avgwsf = avgwsf + Number(wspeed);
              avgwsm = avgwsm + Number(wspeed) / 0.539956803;
              avgwscount = avgwscount + 1;
            } //end if(isDate(prevdateformated))
          } // end if (isDate(actualdateformated))

          if (trim(posdatam[5]) * 1 - feetdelta < 0) {
            feetdelta =
              feetdelta +
              trim(posdatam[5]) * 1 -
              feetdelta -
              parseInt(heightsave / 10);
          }

          horalocal = mid(posdatam[0], 10, 2) * 1 + timezone;
          if (horalocal < 0) {
            horalocal = horalocal + 24;
          }

          datezulu = new Date(actualdateformated);
          datelocal = new Date(actualdateformated);
          datelocal.setTime(datelocal.getTime() + timezone * 60 * 60 * 1000);

          dates = [
            new Date(
              datelocal.getFullYear(),
              datelocal.getMonth(), // JavaScript ya usa 0-11 para meses
              datelocal.getDate(),
              datelocal.getHours(),
              datelocal.getMinutes(),
              datelocal.getSeconds(),
            ),
            new Date(
              datezulu.getFullYear(),
              datezulu.getMonth(), // JavaScript ya usa 0-11 para meses
              datezulu.getDate(),
              datezulu.getHours(),
              datezulu.getMinutes(),
              datezulu.getSeconds(),
            ),
          ];

          let pos5InMeters = parseFloat(posdatam[5].toString().trim()) * 0.3048;
          let pos5DeltaInMeters =
            parseFloat(posdatam[5].toString().trim()) - feetdelta;

          // Formatear números y limpiar comas
          let formattedPos5 = Number(
            replaceText(formatNumberV2(pos5InMeters, 0), ",", "", 0, 40),
          );
          let formattedPos5Delta = Number(
            replaceText(formatNumberV2(pos5DeltaInMeters, 0), ",", "", 0, 40),
          );

          let formattedWspeedConverted = Number(
            formatNumberV2(wspeed / 0.539956803, 1),
          );

          const [delta1, delta2] = [...Delta.split(",").map((n) => Number(n))];

          // Crear normalvorloc
          normalvorloc = [
            ...dates,
            formattedPos5,
            formattedPos5Delta,
            Number(wdir),
            formattedWspeedConverted,
            Number(wspeed),
            delta1,
            delta2,
          ];
          if (
            callsign.toLowerCase() === "lu7aa-11" ||
            callsign.toLowerCase() === "lu7aa-12"
          ) {
            normalvorloc.push(Number(posdatam[1]));
            normalvorloc.push(Number(posdatam[2]));
            normalvorloc.push(icono);
            normalvorloc.push(Number(NumberT1));
            normalvorloc.push(Number(T2));
            normalvorloc.push(T3);
          } else {
            normalvorloc.push(Number(posdatam[1]));
            normalvorloc.push(Number(posdatam[2]));
            normalvorloc.push(icono);
          }

          blastvorloc = dates.map((d) => d);
          blastvorloc.push(formattedPos5);
          blastvorloc.push(formattedPos5Delta);
          blastvorloc.push(Number(wdir));
          blastvorloc.push(formattedWspeedConverted);
          blastvorloc.push(Number(wspeed));

          if (
            callsign.toLowerCase() === "lu7aa-11" ||
            callsign.toLowerCase() === "lu7aa-12"
          ) {
            blastvorloc.push(Number(wspeed));
            blastvorloc.push(delta1);
            blastvorloc.push(delta2);
            blastvorloc.push(Number(posdatam[1]));
            blastvorloc.push(Number(posdatam[2]));
            blastvorloc.push(iconblast);
            blastvorloc.push(Number(T1));
            blastvorloc.push(Number(T2));
            blastvorloc.push(Number(T3));
          } else {
            blastvorloc.push(Number(wspeed));
            blastvorloc.push(delta1);
            blastvorloc.push(delta2);
            blastvorloc.push(Number(posdatam[1]));
            blastvorloc.push(Number(posdatam[2]));
            blastvorloc.push(iconblast);
          }

          let vlocPrevStr = vorlocArrayToString(previousvorlocblast);
          let vlocNormalStr = vorlocArrayToString(normalvorloc);

          if (trim(posdatam[5]) * 1 < heightsave && !switcher && s > 0) {
            deltaupdown = deltafeetpersecond;

            if (deltaupdown < 0) {
              deltaupdown = deltaupdown * -1;
            }

            if (
              (splitText(vlocPrevStr, ",", 220, 1).length === 25 ||
                splitText(vlocPrevStr, ",", 220, 1).length === 22) &&
              deltaupdown < 500 &&
              Elapsed != 0 &&
              Elapsed > 5
            ) {
              vorloc = [...vorloc, previousvorlocblast];
              previousvorlocblast = [];
            } else {
              if (s > comienzo) {
                Discarddata = Discarddata + s + ":" + vlocPrevStr + "<br>";
              }
            }

            if (
              (splitText(vlocNormalStr, ",", 220, 1).length === 25 ||
                splitText(vlocNormalStr, ",", 220, 1).length === 22) &&
              deltaupdown < 500 &&
              Elapsed > 5
            ) {
              vorloc = [...vorloc, normalvorloc];
              normalvorloc = [];
            } else {
              if (s > comienzo) {
                Discarddata = Discarddata + s + ":" + vlocNormalStr + "<br>";
              }
              normalvorloc = [];
            }
            switcher = true;
          } else {
            if (
              (splitText(vlocNormalStr, ",", 220, 1).length === 25 ||
                splitText(vlocNormalStr, ",", 220, 1).length === 22) &&
              deltaupdown < 500 &&
              Elapsed > 5
            ) {
              vorloc = [...vorloc, normalvorloc];
              normalvorloc = [];
            } else {
              if (s > comienzo) {
                Discarddata = Discarddata + s + ":" + vlocNormalStr + "<br>";
              }
              normalvorloc = [];
            }
          } // end if (trim(posdatam[5]) * 1 < heightsave && !switcher && s > 0)
          prevdateformated = dateFormatter(posdatam[0], true);
          if (isDate(new Date(prevdateformated))) {
            previousdate = new Date(prevdateformated);
            previousheight = posdatam[5];
          }
          previousvorlocblast = [...dates.map((d) => d)];
          previousvorlocblast.push(formattedPos5);
          previousvorlocblast.push(formattedPos5Delta);
          previousvorlocblast.push(Number(wdir));
          previousvorlocblast.push(formattedWspeedConverted);
          previousvorlocblast.push(Number(wspeed));
          if (
            callsign.toLowerCase() === "lu7aa-11" ||
            callsign.toLowerCase() === "lu7aa-12"
          ) {
            previousvorlocblast = [...previousvorlocblast.map((d) => d)];
            previousvorlocblast.push(delta1);
            previousvorlocblast.push(delta2);
            previousvorlocblast.push(Number(posdatam[1]));
            previousvorlocblast.push(Number(posdatam[2]));
            previousvorlocblast.push(iconblast);
            previousvorlocblast.push(Number(NT1));
            previousvorlocblast.push(Number(T2));
            previousvorlocblast.push(Number(T3));
          } else {
            previousvorlocblast = [...previousvorlocblast.map((d) => d)];
            previousvorlocblast.push(delta1);
            previousvorlocblast.push(delta2);
            previousvorlocblast.push(Number(posdatam[1]));
            previousvorlocblast.push(Number(posdatam[2]));
            previousvorlocblast.push(iconblast);
          }
          posdatam0s = posdatam[0];
        } // end if (trim(posdatam[5]) != "&nbsp;")

        posdatam0s = posdatam[0];
        heightsave = trim(posdatam[5]) * 1;
        um = um + 1;
      } // end  if(trim(posdatam[5]) != "" && posdatam0s != posdatam[0])
      posdatam0s = posdatam[0];
    } // end if ....  posdatam[5] != "48753" && posdatam[5] != "57021" ....

    posdatam0s = posdatam[0];
    posdatam1s = posdatam[1];
    posdatam2s = posdatam[2];
  } // END FOR

  switch (grafico) {
    case "height f":
      options.vAxis.title = "Altitude in feet";
      break;
    case "height m":
      options.vAxis.title = "Altitude in meters";
      break;
    case "speed n":
      options.colors = ["blue", "orange"];
      options.vAxis = {
        gridlines: {
          color: "#DCDCDC",
          count: 16,
        },
        title: "Horizontal Speed in knots (nautical miles per hour)",
      };
      break;
    case "ascent":
      options.vAxis.title = "Ascent / Descent rate in feet per second";
      break;
    case "asc/h":
      options.vAxis.title = "Ascent/Descent rate feet/min @ height in feet";
      break;
    case "sp/hght":
      options.vAxis.title =
        "Horizontal speed in Km/h @ different height in meters";
      break;
    case "speed k":
      options.vAxis = {
        gridlines: {
          color: "#DCDCDC",
          count: 13,
        },
        title: "Horizontal speed in Km/h & wind direction in degrees",
        viewWindow: {},
      };
      break;
    case "direction":
      options.colors = ["blue", "orange"];
      options.vAxis = {
        titleTextStyle: { fontSize: 18 },
        gridlines: {
          color: "#DCDCDC",
          count: 13,
        },
        title: "Wind To 0=North 90=East 180=South 270=West",
        viewWindow: {},
      };
      break;
  }

  // Condición para el formato del eje horizontal
  if (grafico !== "sp/hght" && grafico !== "asc/h") {
    if (parseFloat(diafinal) - parseFloat(diainicial) > 0) {
      options.hAxis.format = "HH:mm\nMMM-dd";
    } else {
      options.hAxis.format = "MMM-dd\nHH:mm";
    }
  }

  // Determinar si es Balloon o Station
  const suffix = callsign.slice(-2);
  const queestacion =
    suffix === "11" || suffix === "12" ? "Balloon" : "Station";

  // Crear título dinámico
  let titulo = `${callsign.toUpperCase()} ${queestacion} `;

  // Reemplazar palabras clave en grafico para construir el título
  const replacements = {
    " M": " meters",
    " F": " feet",
    " K": " Km/h",
    " N": " Knots",
    ASCENT: "Ascent/Descent",
  };

  let tituloGrafico = grafico;
  for (let key in replacements) {
    tituloGrafico = tituloGrafico.replace(
      key.toLocaleLowerCase(),
      replacements[key.toUpperCase()],
    );
  }

  options.title = `${titulo}${capitalizeFirstLetter(tituloGrafico)} Chart ${launch}`;

  bearn = bearing1(lati1, lati2, loni1, loni2);
  bearn = formatNumber(bearn, 1);
  recorrido = distancia(lati1, loni1, lati2, loni2);

  DuracionTotal = dateDiff("n", timeinitial, timefinal);
  duracionhms = seconds2hms(DuracionTotal * 60);
  Velocidad = avgwsm / avgwscount;
  diraverage = avgdir / avgwscount;
  horadellugar = right("00" + (mid(hightime, 10, 2) * 1 + timezone), 2);
  if (horadellugar < 0) {
    horadellugar = horadellugar + 24;
  }
  if (horadellugar > 24) {
    horadellugar = horadellugar - 24;
  }
  maxtimehms =
    horadellugar + ":" + mid(hightime, 12, 2) + ":" + mid(hightime, 14, 2);
  coverage = formatNumber(1.0 * 3.87 * Math.sqrt(maxheight * 0.3048), 1);
  avgupf = formatNumber(avgupf / avgupcount, 2); //average up in feet/sec
  avgupm = formatNumber(avgupm / avgupcount, 2); //average up in meters/sec
  avgdof = formatNumber((avgdof / avgdocount) * -1, 2); //average down in feet/sec
  avgdom = formatNumber((avgdom / avgdocount) * -1, 2); //average down in meters/sec
  avgwsf = formatNumber(avgwsf / avgwscount, 1); //average window speed in nM/hour
  avgwsm = formatNumber(avgwsm / avgwscount, 1); //average window speed in Km/hour

  renderChartData({
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
  });

  const formClientRects = document
    .querySelector("form")
    .getBoundingClientRect();
  document.getElementById("chart_div").style.width =
    `${formClientRects.width - 30}px`;
  document.getElementById("chart_div").style.height =
    `${formClientRects.height - 65}px`;
  document.getElementById("chartdata").style.left =
    `${formClientRects.width - 202}px`;
  if (formClientRects.width > 800) {
    document.getElementById("chartdata").style.fontSize = "14px";
    document.getElementById("chartdata").style.lineHeight = "15px";
    document.getElementById("chartdata").style.left =
      `${formClientRects.width - 302}px`;
    document.getElementById("chartdata").style.width = `300px`;
  }

  if (vorloc.length > 0) {
    loadGoogleChart();
  } else {
    document.getElementById("chart_table").display = "none";
  }

  if (getParamSafe("flights") !== "") {
    document.getElementById("flights").setAttribute("checked", "checked");
  }
  if (ssavempointer > 1) {
    let html =
      "<font style='font-size:14px;line-height:14px;font-weight:normal;vertical-align:inherit;'>+Flights:</font>";
    for (let m = 1; m <= ssavempointer; m++) {
      const fecha = ssavem[m][1];
      const nombrefecha = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear().toString().slice(-2)}`;
      const fvloc = `Flight-${m}  ${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear().toString().slice(-2)} ${fecha.getHours().toString().padStart(2, "0")}:${fecha.getMinutes().toString().padStart(2, "0")}z`;
      html += `<input type=button name=vuelos value='${nombrefecha}' Title='${fvloc}' style='cursor:hand; width:44px;height:20px;font-size:10px;line-height:11px;vertical-align:inherit;padding:0 0 0 0;margin-left:4px;' onclick='ira(${m})'>`;
    }
    document.getElementById("flightInfo").innerHTML = html;
  }

  if (Discarddata.length > 20) {
    document.getElementById("discardData").innerHTML = Discarddata;
  }
  if (
    callsign.toLowerCase() === "lu7aa-11" ||
    callsign.toLowerCase() === "lu7aa-12"
  ) {
    document.getElementById("chart_temp_voltage").style.display = "block";
  }
  markbutton();
}

async function onloadApp() {
  try {
    resizeAndScale();
    await startApp();
  } catch (error) {
    console.error(error);
    showError(error.message || "An error occurred");
  } finally {
    document.getElementById("loader").style.display = "none";
  }
}

window.addEventListener("load", onloadApp);

window.addEventListener("resize", resizeAndScale);
