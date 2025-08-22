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
    "https://balloons.dev.browxy.com/api/v1/finduFetcher",
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
    const temperaturas = processAprsData(rawdata, pag);
    console.log("temperaturas", temperaturas);
  }
  pag = "";
  window.Posicion = 1;

  let validdata = true;
  let urlpath = `http://www.findu.com/cgi-bin/posit.cgi?call=${callsign}&comma=1&start=${spanhours}&time=1`;

  body = new URLSearchParams({ url: urlpath }).toString();
  pag = await getURLXform(
    "https://balloons.dev.browxy.com/api/v1/finduFetcher",
    body,
  );
  pag = await getURLXform(urlpath);

  if (pag.length < 500) {
    urlpath = `http://www1.findu.com/cgi-bin/posit.cgi?call=${callsign}&comma=1&start=${spanhours}&time=1`;
    body = new URLSearchParams({ url: urlpath }).toString();
    pag = await getURLXform(
      "https://balloons.dev.browxy.com/api/v1/finduFetcher",
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
      if (fecha1 - fecha2 < 0.4) {
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
    let checkm = pathm[0].split(",")[0];
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
      "https://balloons.dev.browxy.com/api/v1/finduFetcher",
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
  posdatad = pathm[comienzo + 1].split(",", 1000, 1);

  timezone = getTimezone(
    posdatad[1],
    posdatad[2],
    new Date(cuantosDias(posdatad[0].split(",")[0])),
  );

  Glatlaunchdeg = posdatad[1];
  Glonlaunchdeg = posdatad[2];
  feetlaunch = (await getAltura(Glatlaunchdeg, Glonlaunchdeg)) * 3.28084;
  if (feetlaunch * 1 < 0) {
    feetlaunch = 100;
  }
  feetdelta = feetlaunch;
  console.log("feetdelta", feetdelta);
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
