var being_dragged = false;
var Vuelo = window.getParamSafe("Vuelo");
var callsign = window.getParamSafe("callsign");
//var GOOGLE_API_KEY = "AIzaSyAACTum6vjLOeCDgGj6EFFnzJMe7r8xOII";
var GOOGLE_API_KEY = "AIzaSyCOya7aI1WJfTmx9e5d7YY7RgueBwVhwrk";
var llheightCache = ""; // TODO check ASP Application value
var lltimezoneCache = ""; // TODO check ASP Application value
// var PI = 3.141592653;
// var DEG2RAD = 0.01745329252;
// var RAD2DEG = 57.29577951308;
var PI = Math.PI; // 3.141592653589793
var DEG2RAD = Math.PI / 180; // 0.017453292519943295
var RAD2DEG = 180 / Math.PI; // 57.29577951308232

// change Height title by search params selected
window.parent.window.document.title = `${callsign} Balloon Height M Chart from EOSS & Findu`;

window.columnsChart = [
  { type: "datetime", value: "Hour-Local" },
  { type: "datetime", value: "Hour-UTC" },
];
window.rowsChart = [];

var x,
  y,
  element,
  posicion,
  pag,
  m,
  lastm,
  help,
  help1,
  vorloc,
  VOR1,
  VOR2,
  VOR1La,
  VOR1Lo,
  VOR2La,
  VOR2Lo,
  GLatdeg,
  GLondeg,
  posits,
  um,
  grafico,
  cityname;

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

var posis = Array(55001)
  .fill()
  .map(() => Array(6).fill(0));

async function startApp() {
  document.getElementById("callsign").value = callsign;
  if (callsign === "") {
    callsign = "AE0SS-11";
  }
  let grafico = getParamSafe("grafico");
  if (grafico === "") {
    grafico = "height f";
  }

  let estaciones = "http://www.findu.com/cgi-bin/map-near.cgi?call=" + callsign;
  //console.log(estaciones);
  // estaciones proximas escuchadas la ultima hora hasta 550 millas = "http://www.findu.com/cgi-bin/near.cgi?call=lu7aa-11&last=1&n=300&distance=550"
  let body = new URLSearchParams({ url: estaciones }).toString();
  pag = await getURLXform(
    "https://balloons.dev.browxy.com/api/v1/webFetcher",
    body,
  );

  let stations = parseStations(pag);
  let stationlast = 10;

  for (let z = 10; z >= 0; z--) {
    if (stations[z][0] === "") {
      stationlast = z;
      break;
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
  console.log("stations", stations);
  let pag1 = "";
  let temperaturas = [];
  if (
    callsign.toLowerCase() === "lu7aa-11" ||
    callsign.toLowerCase() === "lu7aa-12"
  ) {
    pag1 = await getURL(
      `https://balloons.dev.browxy.com/api/v1/getAsset?file=share/assets/140308posit.txt`,
    ); //getShareResource("140308posit.txt");
    pag = await getURL(
      `https://balloons.dev.browxy.com/api/v1/getAsset?file=share/assets/130308raw.txt`,
    ); //getShareResource("130308raw.txt"); // ADD <br> for each line

    pag = pag.replace(/\r\n|\n\r|\n|\r/g, function (match) {
      return "<br>";
    });
    const urlaprsfi = "151003raworig.txt";
    const rawdata = await getURL(
      `https://balloons.dev.browxy.com/api/v1/getAsset?file=share/assets/${urlaprsfi}`,
    ); //getShareResource(urlaprsfi);

    window.Posicion = 1;
    temperaturas = processAprsData(rawdata, pag);
    console.log("temperaturas", temperaturas);
  }
  pag = "";
  window.Posicion = 1;

  let validdata = true;
  let urlpath = `http://www.findu.com/cgi-bin/posit.cgi?call=${callsign}&comma=1&start=${spanhours}&time=1`;

  body = new URLSearchParams({ url: urlpath }).toString();
  pag = await getURLXform(
    "https://balloons.dev.browxy.com/api/v1/webFetcher",
    body,
  );
  pag = await getURLXform(urlpath);

  if (pag.length < 500) {
    urlpath = `http://www1.findu.com/cgi-bin/posit.cgi?call=${callsign}&comma=1&start=${spanhours}&time=1`;
    body = new URLSearchParams({ url: urlpath }).toString();
    pag = await getURLXform(
      "https://balloons.dev.browxy.com/api/v1/webFetcher",
      body,
    );
  }
  const pagHmResult = procesarPagHm(pag, pag1);
  let pathm = pagHmResult.pathm;
  console.log("pagHmResult", pagHmResult);

  let daysave = cuantosDias(pathm[0].split(",")[0]);
  let fecha1 = cuantosDias(pathm[pathm.length - 2].split(",")[0]);
  console.log("fecha1", fecha1);
  console.log("daysave", daysave);

  let tx = 0;
  // let ssavem = Array(131)
  //   .fill()
  //   .map(() => Array(2).fill(""));
  let ssavem = Array(pathm.length - 2)
    .fill()
    .map(() => Array(2).fill(""));
  let ssavempointer = 0;
  ssavem[ssavempointer][0] = pathm.length - 2;
  ssavem[ssavempointer][1] = cuantosDias(pathm[pathm.length - 2].split(",")[0]);
  ssavempointer = ssavempointer + 1;
  let heightvalid = false;
  let heightp = 0;
  let hmx = Array(3001)
    .fill()
    .map(() => Array(2).fill(""));
  let heighpointer = 0;
  let heighp = 0;
  for (let s = pathm.length - 2; s >= 1; s--) {
    if (pathm[s].split(",")[0] !== "") {
      let fecha2 = cuantosDias(pathm[s].split(",")[0]);
      const diferenciaEnDias =
        Math.abs(fecha1 - fecha2) / (1000 * 60 * 60 * 24);

      if (diferenciaEnDias < 0.4) {
        daysave = cuantosDias(pathm[s].split(",")[0]);
        if (!heightvalid && isNumeric(right(pathm[s], 1))) {
          heightvalid = true;
        }
      } else {
        ssavem[ssavempointer][0] = s;
        ssavem[ssavempointer][1] = cuantosDias(pathm[s + 1].split(",")[0]);
        ssavempointer = ssavempointer + 1;
      }
      fecha1 = fecha2;
    }
  }
  ssavempointer = ssavempointer - 1;
  console.log("ssavem", ssavem, ssavempointer);
  ssavem[ssavempointer][0] = 0;
  ssavem[ssavempointer][1] = cuantosDias(pathm[1].split(",")[0]);

  let comienzo = 0;
  let final = 0;
  if (Vuelo === "") {
    comienzo = ssavem[1][0];
    final = ssavem[0][0] - 1;
    //let checkm = split(pathm[s], ",", 10, 1);
    console.log(">>>>>>>>>> ", pathm[0].split(","));
    let checkm = pathm[0].split(",")[3];
    console.log("checkm", checkm, pathm[0]);
    if (checkm[4] == "0.0") {
      final = final - 1;
    }
  } else {
    if (Vuelo * 1 < ssavempointer + 1) {
      comienzo = ssavem[Vuelo * 1][0];
      final = ssavem[Vuelo * 1 - 1][0] - 1;
    } else {
      comienzo = ssavem[1][0];
      final = ssavem(0, 0) - 1;
    }
  }

  let heightpointer = 0;
  if (!heightvalid) {
    let heighturl = `http://www.findu.com/cgi-bin/rawposit.cgi?time=1&call=${callsign}&start=120&length=124`;
    body = new URLSearchParams({ url: heighturl }).toString();
    let heightdata = await getURLXform(
      "https://balloons.dev.browxy.com/api/v1/webFetcher",
      body,
    );
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
    final = pathm.length - 2;
  }
  let ssave = 0;
  if (left(callsign, 5).toLowerCase() === "k6rpt") {
    ssave = 9;
  }

  //  Fin de determinar cuantos vuelos hay y sus fechas horas de comienzo
  window.Posicion = 1;
  if (
    left(callsign, 5).toLowerCase() === "lu7aa" &&
    left(pathm[0], 5) === "20140"
  ) {
    insertar();
  }
  um = 0;
  icono = "point";
  iconblast = "blast";
  iconblast1 = "blast1";
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
  timezone = await getTimezoneOffsetFromGeoTimeZone(posdatad[1], posdatad[2]);
  console.log("timezone", timezone, pathm[comienzo + 1]);
  Glatlaunchdeg = posdatad[1];
  Glonlaunchdeg = posdatad[2];
  feetlaunch = (await getAltura(Glatlaunchdeg, Glonlaunchdeg)) * 3.28084;
  if (feetlaunch * 1 < 0) {
    feetlaunch = 100;
  }
  feetdelta = feetlaunch;
  console.log("feetdelta", feetdelta);

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
  console.log("comienzo " + comienzo + " final " + final);

  for (let s = comienzo + 1; s < final; s++) {
    let posdatam = pathm[s].split(",");
    //let timeinicial = "";
    //let diainicial = "";

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
      wspeed = "0";
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
      wdir = 0;
      wspeed = 1;
      if (previouslat === "") {
        previouslat = posdatam[1];
        previouslon = posdatam[2];
      }
      if (previousdatespeed === "") {
        previousdatespeed = cDate(cuantosDias(pathm[s].split(",")[0]));
      }
    } //end if (s === comienzo)

    if (wdir === "" || wdir === " " || wspeed == "0.0" || wspeed == "") {
      /*
      wdir = bearing1(
        previouslat,
        posdatam[1] * DEG2RAD,
        previouslon,
        posdatam[2] * DEG2RAD,
      );
      */
      wdir = bearing1(previouslat, posdatam[1], previouslon, posdatam[2]);
      actualdatespeed = cDate(cuantosDias(pathm[s].split(",")[0]));
      distanciarecorrida = distancia(
        previouslat,
        previouslon,
        posdatam[1] * DEG2RAD,
        posdatam[2] * DEG2RAD,
      );
      tiemposegundos = (actualdatespeed - previousdatespeed) * 86400;
      Velociknots = (distanciarecorrida * 3600) / tiemposegundos / 1.852;
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
      console.log("posdatam[0]:", posdatam);
      if (posdatam[0].length === 14) {
        posdatam[0] = " " + posdatam[0];
      }
      lati1 = posdatam[1];
      loni1 = posdatam[2];
      latii1 = posdatam[1];
      lonii1 = posdatam[2];
      timeinicial = cDate(
        right("00" + mid(posdatam[0], 6, 2), 2) +
          "/" +
          right("00" + mid(posdatam[0], 8, 2), 2) +
          "/" +
          right("00" + mid(posdatam[0], 2, 4), 4) +
          " " +
          right("00" + mid(posdatam[0], 10, 2), 2) +
          ":" +
          right("00" + mid(posdatam[0], 12, 2), 2) +
          ":" +
          right("00" + mid(posdatam[0], 14, 2), 2),
      );
      diainicial = right("00" + mid(posdatam[0], 8, 2), 2);
      console.log("diainicial:", diainicial);
      console.log("timeinicial:", timeinicial);
    } // end s === comienzo + 1

    if (!isDate(timeinicial)) {
      if (s === comienzo + 1) {
        lati1 = posdatam[1];
        loni1 = posdatam[2];
        if (posdatam[0].lenght === 14) {
          posdatam[0] = " " + posdatam[0];
        }
        timeinitial = cDate(
          right("00" + mid(posdatam[0], 6, 2), 2) +
            "/" +
            right("00" + mid(posdatam[0], 8, 2), 2) +
            "/" +
            right("00" + mid(posdatam[0], 2, 4), 4) +
            " " +
            right("00" + mid(posdatam[0], 10, 2), 2) +
            ":" +
            right("00" + mid(posdatam[0], 12, 2), 2) +
            ":" +
            right("00" + mid(posdatam[0], 14, 2), 2),
        );
        console.log("timeinicial 2:", timeinicial);
      }
    } // end (isDate(timeinitial))

    if (s === final) {
      lati2 = posdatam[1];
      loni2 = posdatam[2];
      if (posdatam[0].length === 14) {
        posdatam[0] = " " + posdatam[0];
      }
      timefinal = cDate(
        right("00" + mid(posdatam[0], 6, 2), 2) +
          "/" +
          right("00" + mid(posdatam[0], 8, 2), 2) +
          "/" +
          right("00" + mid(posdatam[0], 2, 4), 4) +
          " " +
          right("00" + mid(posdatam[0], 10, 2), 2) +
          ":" +
          right("00" + mid(posdatam[0], 12, 2), 2) +
          ":" +
          right("00" + mid(posdatam[0], 14, 2), 2),
      );
      diafinal = right("00" + mid(posdatam[0], 8, 2), 2);
      if (actualdateformated === "") {
        actualdateformated =
          mid(posdatam[0], 6, 2) +
          "/" +
          mid(posdatam[0], 8, 2) +
          "/" +
          mid(posdatam[0], 2, 4) +
          " " +
          mid(posdatam[0], 10, 2) +
          ":" +
          mid(posdatam[0], 12, 2) +
          ":" +
          mid(posdatam[0], 14, 2);
        actualdate = cDate(actualdateformated) - timezone / 24;
      }
      if (launch === "") {
        if (right(callsign, 2) === "11" || right(callsign, 2) === "12") {
          launch = " - Launched ";
        } else {
          launch = " from ";
        }
        launch = launch + mes[mid(pathm[s], 6, 2)] + "-";
        launch = launch + mid(pathm[s], 8, 2) + " at ";
        hourlocaldetail = mid(pathm[s], 10, 2) * 1 + timezone;
        if (hourlocaldetail < 0) {
          hourlocaldetail = hourlocaldetail + 24;
        }
        launch = launch + right("0" + hourlocaldetail, 2) + ":";
        launchdate = mid(pathm[s], 6, 2) + "/" + mid(pathm[s], 8, 2);
        launchtime =
          right("0" + hourlocaldetail, 2) +
          ":" +
          mid(pathm[s], 12, 2) +
          ":" +
          mid(pathm[s], 14, 2);
        launch = launch + mid(pathm[s], 12, 2) + ":";
        launch = launch + mid(pathm[s], 14, 2) + " local = (";
        launch = launch + right("0" + mid(pathm[s], 10, 2) * 1, 2) + ":";
        launch = launch + mid(pathm[s], 12, 2) + ":";
        launch = launch + mid(pathm[s], 14, 2) + " Z)";
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

    if (wdir.length > 1) {
      wdir = wdir;
    } else {
      wdir = "0";
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
    if (wspeed.length > 0) {
      wspeed = wspeed;
    } else {
      wspeed = "0";
    }
  } // END FOR
}

window.addEventListener("load", startApp);

/*

🔗 URL de ejemplo:
https://api.opentopodata.org/v1/srtm90m?locations=29.89833,-55.966

📥 Respuesta de ejemplo (JSON):
{
  "results": [
    {
      "location": {
        "lat": -29.89833,
        "lng": -55.966
      },
      "elevation": 121.0,  // en metros
      "dataset": "srtm90m"
    }
  ],
  "status": "OK"
}

📐 Convertir a pies

Para convertir de metros a pies, puedes usar esta fórmula:

pies = metros × 3.28084


Ejemplo:

121.0 metros × 3.28084 = ~45.68 pies

🔧 API info técnica

Endpoint base: https://api.opentopodata.org/v1/

Dataset común: srtm90m (buena precisión global)

Parámetro: locations=lat,long


https://api.opentopodata.org/v1/srtm90m?locations=LAT1,LON1|LAT2,LON2

*/
