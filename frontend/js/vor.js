var TZDiff = new Date().getTimezoneOffset();
var WEB_FETCHER_URL = "/api/v1/webFetcher"; // "https://balloons.dev.browxy.com/api/v1/webFetcher"; //"/api/v1/webFetcher";
var PI = Math.PI; // 3.141592653589793
var DEG2RAD = PI / 180; // 0.017453292519943295
var RAD2DEG = 180 / PI; // 57.29577951308232
var EARTH_RADIUS = 3440.07;
var llheightCache = ""; // TODO check ASP Application value
var lltimezoneCache = ""; // TODO check ASP Application value
window.Posicion = 1;

var time = "";
var timel = "";
var timez = "";
var tiempodown = "";

var pag,
  help,
  help1,
  vorloc,
  ajustes,
  VOR1,
  VOR2,
  VOR1La,
  VOR1Lo,
  VOR2La,
  VOR2Lo,
  VOR1LocCountry,
  VOR2LocCountry,
  Vor1Loc,
  Vor2Loc,
  Vor1Mag,
  Vor2Mag,
  Vor1Lon,
  Vor2Lon,
  Vor1Lat,
  Vor2Lat,
  OSADist,
  OSARadial,
  Ubicacion,
  Ubicacionm,
  Course,
  Curso,
  Cursoa,
  Cursom,
  Cursog,
  Speed,
  Fechahora,
  Fechahoralocal,
  DistMillas,
  Altura,
  Alturanumber,
  Vuelo,
  Velociknots,
  Glatlaunchdeg,
  Glonlaunchdeg,
  Delta,
  GLatdeg,
  GLondeg,
  Glatdeg,
  Glondeg,
  Glatdegf,
  Glondegf,
  GLatdegf,
  GLondegf,
  GLatdeg1,
  GLondeg1,
  Gy,
  Gx,
  LYE,
  OSA,
  R,
  lon1,
  lat1,
  latdeg,
  londeg,
  brng,
  posits,
  um,
  vorloc1m,
  vorloc2m,
  latciudad,
  lonciudad,
  cityname,
  city,
  chequeo,
  callsign,
  autoRefParam,
  flightsParam,
  refreshParam;
var Tiempo = "";
var Elapsed = 0;
var LYEDist = "";
var LYERadial = "";
var LyeDist = "";
var LyeRadial = "";
var OSADist = 0;
var OsaDist = "";
var OsaRadial = 0;
var timezoneoffset = -TZDiff / 60;
var locations = [];
var actualseconds = 0;
var mes = [
  "",
  "Janauary",
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
var abrev = "";
var abrevi = "";
var abrevim = new Array(401).fill().map(() => Array(2).fill(0));
var posis = new Array(80001).fill().map(() => Array(6).fill(0));
var heardnn = new Array(301).fill().map(() => Array(2).fill(0));
var heard = new Array(301).fill().map(() => Array(2).fill(0));
var stations = new Array(150).fill().map(() => Array(5).fill(0));
var outAsp = new Array(3).fill(0);
var datataken = "";
var alturacount = 0;
var vormatrix = new Array(301).fill().map(() => Array(7).fill(0));
var m = 0;
var lastm = 0;
var spanhours = 900;
var datospath = "";
var pathm = [];
var ssavem = new Array(131).fill().map(() => Array(2).fill(0));
var ssavempointer = 0;
var hmx = new Array(3001).fill().map(() => Array(2).fill(0));
var ssave = 0;
var maxlat = 0;
var minlat = 90;
var maxlon = 0;
var minlon = 180;
var avgdof = 0;
var avgdom = 0;
var avgdocount = 0;
var wdir = "0.0";
var wspeed = "0.0";
var previouslat = "";
var previouslon = "";
var previousdatespeed = 0;
var actualdatespeed = "";
var previousvorlocblast = [];
var normalvorloc = [];
var blastvorloc = [];
var vorloc = "";
var heightvalid = false;
var heightp = 0;
var heighpointer = 0;
var heighp = 0;
var posdatam0s = "";
var posdatam1s = "";
var posdatam2s = "";
var posdatam3s = "";
var posdatam4s = "";
var posdatam5s = "";
var prevdateformated = "";
var deltafeetpersecond = 0;
var saveddeltafeetpersecond = 0;
var switcher = false;
var savewdir = "0";
var savewspeed = "0";
var saveheight = "0";
var deltaheight = "0";
var posdatad = "";
var posdata;
var feetdelta;
var feetlaunch;
var timefinal = "";
var diafinal = "";
var deltaMetersPerSecond = 0;
var alturasobretierra = "";
var heightsave = "";
var diflat = 0;
var diflon = 0;
var deltapos = 0;
var posdatam = [];
var iconomapa = "";
var altactj, deltaactj, altact1, deltaact1, deltacj, deltac1, d1, d2, r1, r2;
var feetlaunchfinal = "";
var distanciaminima = 10000;
var savepos = 1;
var instates = false;
var latsearch = "";
var lonsearch = "";
var actualseconds = "";
var deltal = 0;
var latciudad = "";
var lonciudad = "";
var cityname = "";
var names = "";
var asl = 0;
var asz = 0;
var laspos1 = "";
var fechadescmesdia = "";

var latslo,
  lonslo,
  latshi,
  lonshi = "";

async function initApp() {
  setParamValues();
  setDocDomValues();
  await vorread();

  let url1 = "http://www.findu.com/cgi-bin/find.cgi?call=" + callsign;
  let body = new URLSearchParams({ url: url1 }).toString();
  let pag = await getURLXform(WEB_FETCHER_URL, body);

  let chequeo = buscarTag("Sorry, no position known", "<", pag);
  let latlon = "";
  if (chequeo === "") {
    window.Posicion = 1;
    Ubicacion = buscarTag("Position of ", " --- Report", pag);

    const regex = /(\d+(?:\.\d+)?)\s+miles/;
    const match = Ubicacion.match(regex);
    let millas = "0";

    if (match) {
      millas = match[1];
    }

    Ubicacion = replace(Ubicacion, ", ARGENTINA", "", 1, 100, 1);
    Ubicacion = replace(Ubicacion, "miles", "m.náuticas al", 1, 100, 1);
    Ubicacion = replace(Ubicacion, " ---", "", 1, 100, 1);
    Ubicacion = replace(Ubicacion, " of", " de", 1, 100, 1);
    Ubicacion = replace(Ubicacion, "LU7AA-11 ", "", 1, 100, 1);
    Ubicacion = replace(Ubicacion, "north", "nor", 1, 100, 1);
    Ubicacion = replace(Ubicacion, "south", "sud", 1, 100, 1);
    Ubicacion = replace(Ubicacion, "east", "este", 1, 100, 1);
    Ubicacion = replace(Ubicacion, "west", "oeste", 1, 100, 1);
    Ubicacion = lcase(Ubicacion);
    Ubicacionm = split(Ubicacion, " ", 20, 1);
    DistMillas = parseInt(millas) * 0.86897624 + 0.5;

    Ubicacion = "";
    for (let k = 1; k <= Ubicacionm.length; k++) {
      Ubicacion = Ubicacion + Ubicacionm[k] + " ";
    }
    Ubicacion = DistMillas + " " + mayusculaPrimeras(Ubicacion);
    latlon = buscarTag("C=", "&A", pag);
    latlon = replace(latlon, "%2c", "/", 1, 100, 1);

    window.Posicion = 1;
    Tiempo = buscarTag("received", "ago", pag);

    let url2 = `http://www.findu.com/cgi-bin/vor.cgi?call=${callsign}&vor1=${VOR1}&vor2=${VOR2}&refresh=60`;
    body = new URLSearchParams({ url: url2 }).toString();
    pag = await getURLXform(WEB_FETCHER_URL, body);

    window.Posicion = 1;

    Altura = buscarTag("Altitude: ", "<br>", pag);
    Alturanumber = replace(Altura, "feet", "", 1, 30, 1);
    if (Altura.length > 3) {
      Cursoa = "Alt: " + replace(Altura, "feet", "feet", 1, 100, 1) + " ";
    } else {
      Cursoa = "Alt: 0 pies";
    }
    window.Posicion = 1;
    Fechahora = buscarTag("Page generated at ", "<br>", pag);
    Curso = trim(buscarTag("<p>", "<br>", pag));
    Cursom = split(Curso, " ", 4, 1);
    if (Cursom.length === 3) {
      Cursog = replace(Cursom[3], "Speed: ", "", 1, 10, 1);
      Curso =
        Cursoa +
        Cursom[0] +
        " " +
        trim(parseInt(Cursom[1])) +
        " " +
        Cursom[2] +
        " Speed: " +
        parseInt(Cursog) * 0.86897624;
    }
    Course = trim(parseInt(Cursom[1]));
    Course = replace(Course, "Speed: ", "", 1, 100, 1);
    Speed = trim(parseInt(Cursog) * 0.86897624);
    Speed = replace(Speed, " ", "", 1, 100, 1);
    Speed = replace(Speed, " ", "", 1, 100, 1);
    Speed = replace(Speed, "\t", "", 1, 100, 1);
    Curso = trim(replace(Curso, "Course", "Curso", 1, 50, 1));
    Curso = replace(Curso, "Speed: ", "&ordm;&nbsp;&nbsp;Veloc: ", 1, 50, 1);
    Curso = trim(Curso) + " Knots";

    Fechahoralocal = cDate(trim(left(Fechahora, 19)));
    Fechahoralocal = Fechahoralocal - 3 / 24;

    Tiempo = replace(Tiempo, " days", "d ", 1, 1, 1);
    Tiempo = replace(Tiempo, " hours", "h ", 1, 1, 1);
    Tiempo = replace(Tiempo, " minutes", "' ", 1, 1, 1);
    Tiempo = replace(Tiempo, " seconds", '"', 1, 1, 1);
  }

  let pag1 = "";
  if (lcase(callsign) === "lu7aa-15") {
    //poner lu7aa-11 para Read stored data from last flight
    pag1 = await getShareResource("140308posit.txt");
  }

  window.Posicion = 1;

  let urlpath = `http://www.findu.com/cgi-bin/posit.cgi?call=${callsign}&comma=1&start=${spanhours}&time=1`;
  body = new URLSearchParams({ url: urlpath }).toString();
  pag = await getURLXform(WEB_FETCHER_URL, body);

  if (pag.length > 600) {
    datataken = urlpath;
  }

  datospath = "20" + buscarTag("20", "</BODY>", pag);
  datospath = pag1 + datospath;

  pathm = split(datospath, "<br>", 25000, 2).map((item) =>
    item.replaceAll("\n", ""),
  );

  if (pathm.length < 20) {
    throw new Error("Sorry, no positions found for " + callsign);
  }

  if (pathm[pathm.length - 1] === "") {
    pathm.pop();
  }
  daysave = cuantosDias(pathm[0].split(",")[0]);

  let fecha1 = cuantosDias(pathm[pathm.length - 1].split(",")[0]);

  let tx = 0;
  let ssavelast = pathm.length - 10;
  ssavem[ssavempointer][0] = pathm.length - 1;
  ssavem[ssavempointer][1] = fecha1;
  ssavempointer = ssavempointer + 1;

  for (let s = pathm.length - 1; s >= 0; s--) {
    // Verificar si la subcadena desde la posición 1 con longitud 13 no está vacía
    // mid(pathm(s), 2, 13) en VB equivale a substring(1, 14) en JS
    if (pathm[s].substring(1, 14) !== "") {
      // Extraer fecha (14 caracteres desde la posición 1)
      let fecha2 = cuantosDias(pathm[s].split(",")[0]);

      // Calcular diferencia en días
      const diferenciaDias =
        Math.abs(fecha1.getTime() - fecha2.getTime()) / (1000 * 60 * 60 * 24);

      if (diferenciaDias < 0.097) {
        // less than 2.3 horas
        daysave = cuantosDias(pathm[s].split(",")[0]);

        // Verificar el último carácter si es numérico
        const ultimoCaracter = pathm[s].slice(-1);
        if (!heightvalid && isNumeric(ultimoCaracter)) {
          heightvalid = true;
        }
      } else {
        // Guardar en ssavem
        if (s < ssavelast - 10) {
          ssavem[ssavempointer] = [s, fecha1];
          ssavempointer++;
          ssavelast = s;
        }
      }

      fecha1 = fecha2;
    }
  }

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
    comienzo = 0;
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
  if (lcase(left(callsign, 5)) === "k6rpt") {
    ssave = 9;
  }

  window.Posicion = 1;
  um = 0;
  icono = imageSrcUrl["point"];
  iconblast = imageSrcUrl["blast"];
  iconblast1 = imageSrcUrl["blast1"];
  maxlat = 0;
  minlat = 90;
  maxlon = 0;
  minlon = 180;
  avgdof = 0;
  avgdom = 0;
  avgdocount = 0;

  if (getParamSafe("flights") !== "") {
    ssave = 0;
  }
  var posdatam = [];
  for (let s = comienzo + 1; s <= final; s++) {
    posdatam = pathm[s].split(",");
    let value = trim(posdatam[0]);
    value = value.replace(/\n/g, ""); // chr(10)
    value = value.replace(/\r/g, ""); // chr(13)
    value = value.replace(/\t/g, ""); // chr(9)
    posdata = value;

    wdir = trim(posdatam[3]);

    value = trim(posdatam[5]);
    value = value.replace(/\n/g, "");
    value = value.replace(/\r/g, "");
    value = value.replace(/\t/g, "");
    wspeed = posdatam[4];

    if (s === comienzo) {
      previouslat = posdatam[1];
      previouslon = posdatam[2];
      previousdatespeed = cuantosDias(pathm[s].split(",")[0]);
    }

    if (wdir === "" || wdir === " " || wspeed === "0.0") {
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

      posdatam[3] = wdir;
      posdatam[4] = wspeed;
    } // END  if (wdir === "" || wdir === " " || wspeed === "0.0")

    previouslat = posdatam[1];
    previouslon = posdatam[2];
    previousdatespeed = cuantosDias(pathm[s].split(",")[0]);
    if (Number(wspeed) > 300) {
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

    if (s > comienzo + 1) {
      if (posdatam[3] != "") {
        if (posdatam[3] * 1 != 0) {
          if (posdatam[3] !== "&nbsp;") {
            if (wdir === "") {
              wdir = trim(posdatam[3]);
            }
            if (isNumeric(Number(wdir))) {
              savewdir = wdir;
            }
          }
        }
      }
      if (posdatam[4] != "") {
        if (posdatam[4] * 1 !== 0) {
          if (posdatam[4] != "&nbsp;") {
            if (wspeed !== "") {
              let value = posdatam[4].trim();
              value = value.replace(/\n/g, ""); // chr(10)
              value = value.replace(/\r/g, ""); // chr(13)
              value = value.replace(/\t/g, ""); // chr(9)
              wspeed = value;
            }
            if (isNumeric(Number(wspeed))) {
              savewspeed = wspeed;
            }
          }
        }
      }
    } // END if (s > comienzo + 1)

    if (isNumeric(posdatam[5])) {
      saveheight = posdatam[5];
    } else {
      posdatam[5] = saveheight;
      saveheight = `${Number(saveheight) + Number(deltaheight)};`;
    }
    if (!isNumeric(posdatam[3])) {
      posdatam[3] = savewdir;
      wdir = posdatam[3];
    }
    if (!isNumeric(posdatam[4])) {
      posdatam[4] = savewspeed;
      wspeed = posdatam[4];
    }

    if (s < comienzo + 3 || s > final - 3) {
      if (s < comienzo + 6) {
        posdatad = pathm[s].split(",");
      }
      if (s > final - 6) {
        posdatad = pathm[s].split(",");
      }
      timezone = ""; // getTimezone(
      // posdatad[1],
      // posdatad[2],
      // cuantosDias(posdatad[0]),
      //);

      Glatlaunchdeg = posdatad[1];
      Glonlaunchdeg = posdatad[2];
      feetlaunch = ""; // getAltura(Glatlaunchdeg, Glonlaunchdeg) * 3.28084;
      if (feetlaunch * 1 < 0) {
        feetlaunch = 100;
      }
      feetdelta = feetlaunch;
    } // END (s < comienzo + 3 || s > final - 3)

    if (s === final) {
      lati2 = posdatam[1];
      loni2 = posdatam[2];
      if (posdatam[0].length === 14) {
        posdatam[0] = " " + posdatam[0];
      }
      const fullDate = cuantosDias(posdatam[0]);
      timefinal = cDate(
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
      diafinal = right("00" + fullDate.getDate(), 2);
    } // END (s === final)

    if (`${wdir}`.length > 0) {
      wdir = wdir;
    } else {
      wdir = "0";
    }
    if (`${wspeed}`.length > 0) {
      wspeed = wspeed;
    } else {
      wspeed = "0";
    }
    if (posdatam1s === "") {
      posdatam1s = Number(posdatam[1]) - 0.05;
    }
    if (posdatam2s === "") {
      posdatam2s = Number(posdatam[2]) - 0.05;
    }
    latdelta = Number(posdatam[1]) - Number(posdatam1s);
    londelta = Number(posdatam[2]) - Number(posdatam2s);
    if (latdelta < 0) {
      latdelta = -latdelta;
    }
    if (londelta < 0) {
      londelta = -londelta;
    }
    if (latdelta == "") {
      latdelta = 0.05;
    }
    if (londelta == "") {
      londelta = 0.05;
    }

    if (posdatam[1] != posdatam1s || posdatam[2] != posdatam2s) {
      if (
        Number(latdelta) < 9.82 &&
        Number(londelta) < 9.82 &&
        Number(latdelta) >= 0 &&
        Number(londelta) >= 0 &&
        Number(wspeed) < 600
      ) {
        posis[um][0] = trim(posdatam[1]);
        posis[um][1] = trim(posdatam[2]);
        posis[um][2] = trim(posdatam[0]);

        if (trim(posdatam[5]) != "" && posdatam0s != posdatam[0]) {
          if (trim(posdatam[5]) != "&nbsp;") {
            // actualdateformated = mid(posdatam(0), 6, 2) & "/" & mid(posdatam(0), 8, 2) & "/" & mid(posdatam(0), 2, 4) & " " & mid(posdatam(0), 10, 2) & ":" & mid(posdatam(0), 12, 2) & ":" & mid(posdatam(0), 14, 2)
            const tempDate = cuantosDias(posdatam[0]);
            actualdateformated =
              right("00" + (tempDate.getMonth() + 1), 2) +
              "/" +
              right("00" + tempDate.getDate(), 2) +
              "/" +
              right("00" + tempDate.getFullYear(), 4) +
              " " +
              right("00" + tempDate.getHours(), 2) +
              ":" +
              right("00" + tempDate.getMinutes(), 2) +
              ":" +
              right("00" + tempDate.getSeconds(), 2);
            actualdate = cDate(actualdateformated);
            if (isDate(new Date(actualdateformated))) {
              if (isDate(new Date(prevdateformated))) {
                actualheight = posdatam[5];
                deltaheight = Number(actualheight) - Number(previousheight);
                actualdate = cDate(actualdateformated);
                //Elapsed = (actualdate - previousdate) * 1440 * 60
                Elapsed =
                  (actualdate.getTime() - previousdate.getTime()) / 1000;

                if (Elapsed > 200) {
                  switcher = false;
                }
                if (Math.abs(Number(posdatam[1])) > maxlat) {
                  maxlat = Math.abs(Number(posdatam[1]));
                }
                if (Math.abs(Number(posdatam[1])) < minlat) {
                  minlat = Math.abs(Number(posdatam[1]));
                }
                if (Math.abs(Number(posdatam[2])) > maxlon) {
                  maxlon = Math.abs(Number(posdatam[2]));
                }
                if (Math.abs(Number(posdatam[2])) < minlon) {
                  minlon = Math.abs(Number(posdatam[2]));
                }
                deltafeetpersecond = deltaheight / Elapsed;
                if (deltafeetpersecond < 0) {
                  avgdof = avgdof + deltafeetpersecond;
                  avgdom = avgdom + deltafeetpersecond * 0.3048;
                  avgdocount = avgdocount + 1;
                }
                saveddeltafeetpersecond = deltafeetpersecond;
                deltaMetersPerSecond = deltafeetpersecond * 0.3048;

                let formattedMeters = replace(
                  formatNumberV2(deltaMetersPerSecond, 1, true, false, false),
                  ",",
                  "",
                  0,
                  30,
                );

                // Formatear pies por segundo con 1 decimal
                let formattedFeet = replace(
                  formatNumberV2(deltafeetpersecond * 60, 1),
                  ",",
                  "",
                  0,
                  50,
                );

                Delta =
                  "Up/Down at: " +
                  formattedMeters +
                  " m/s / " +
                  formattedFeet +
                  " feet/min";
              }
            }

            horalocal = mid(posdatam[0], 10, 2) * 1 + timezone;
            if (horalocal < 0) {
              horalocal = horalocal + 24;
            }

            if (Number(posdatam[5]) - feetlaunch < 0) {
              feetlaunch = ""; //getAltura(posdatam[1], posdatam[2]);
            }
            if (s === comienzo) {
              feetlaunch = ""; //"etAltura(posdatam[1], posdatam[2]);
            }
            if (s === final - 3) {
              feetlaunchfinal = ""; //getAltura(posdatam[1], posdatam[2]);
            }
            alturasobretierra = "";
            if (s < comienzo + 3) {
              alturasobretierra =
                "<br>Terrain height: " +
                replace(
                  formatNumberV2(feetlaunch * 0.3048, 1, true, false, false),
                  ",",
                  "",
                  0,
                  30,
                ) +
                " m. / " +
                replace(formatNumberV2(feetlaunch, 1), ",", "", 0, 50) +
                " feet";
            }
            if (s > final - 3) {
              alturasobretierra =
                "<br>Terrain height: " +
                replace(
                  formatNumberV2(
                    feetlaunchfinal * 0.3048,
                    1,
                    true,
                    false,
                    false,
                  ),
                  ",",
                  "",
                  0,
                  30,
                ) +
                " m. / " +
                replace(formatNumberV2(feetlaunch, 1), ",", "", 0, 50) +
                " feet";
            }

            horam = horalocal * 1 + timezoneoffset * 1;
            if (horam > 23) {
              horam = horam - 24;
            }
            if (horam < 0) {
              horam = horam + 24;
            }
            horam = right("00" + horam, 2);
            const vorlocDate = cuantosDias(posdatam[0]);
            normalvorloc = [
              "On " +
                mes[vorlocDate.getMonth() + 1] +
                "-" +
                vorlocDate.getDate() +
                " " +
                vorlocDate.getFullYear() +
                "<br> At " +
                horam +
                ":" +
                vorlocDate.getMinutes() +
                ":" +
                vorlocDate.getSeconds() +
                " Local / " +
                vorlocDate.getHours() +
                ":" +
                vorlocDate.getMinutes() +
                ":" +
                vorlocDate.getSeconds() +
                " z<br>Altitude: " +
                replace(
                  formatNumberV2(Number(trim(posdatam[5])) * 0.3048, 0),
                  ",",
                  "",
                  1,
                  50,
                  1,
                ) +
                " m. / " +
                trim(posdatam[5]) +
                " feet " +
                alturasobretierra +
                "<br>RF reach: " +
                formatNumber(
                  1.0 *
                    3.8 *
                    Math.sqrt(
                      Math.abs(Number(posdatam[5]) - feetlaunch) * 0.3048,
                    ),
                  0,
                ) +
                " Km. Dir: " +
                wdir +
                " &ordm;<br>Speed: " +
                replace(formatNumberV2(wspeed, 1), ",", "", 1, 50, 1) +
                " Km/h / " +
                replace(
                  formatNumberV2(wspeed * 0.539956803, 1),
                  ",",
                  "",
                  1,
                  50,
                  1,
                ) +
                " knots<br>" +
                Delta,
              posdatam[1],
              posdatam[2],
              icono,
            ];

            horam = horalocal * 1 + timezoneoffset * 1;
            if (horam > 23) {
              horam = horam - 24;
            }
            if (horam < 0) {
              horam = horam + 24;
            }
            horam = right("00" + horam, 2);
            blastvorloc = [
              ('<img src="' +
                iconblast1 +
                '">Balloon blast or descent at:<br>' +
                horam +
                ":" +
                vorlocDate.getMinutes() +
                ":" +
                vorlocDate.getSeconds() +
                " Local / " +
                vorlocDate.getHours() +
                ":" +
                vorlocDate.getMinutes() +
                ":" +
                vorlocDate.getSeconds() +
                " z<br>Altura: " +
                replace(
                  formatNumberV2(Number(trim(posdatam[5])) * 0.3048, 0),
                  ",",
                  "",
                  1,
                  50,
                  1,
                ) +
                " m. / " +
                trim(posdatam[5]) +
                " feet RF reach: " +
                formatNumber(
                  1.0 *
                    3.87 *
                    Math.sqrt(
                      Math.abs(Number(posdatam[5]) - feetlaunch) * 0.3048,
                    ),
                  0,
                ) +
                " Km. <br>Dir: " +
                wdir +
                " º<br>Speed: ") &
                (replace(formatNumberV2(wspeed, 1), ",", "", 1, 50, 1) +
                  " Km/h / " +
                  replace(
                    formatNumberV2(wspeed * 0.539956803, 1),
                    ",",
                    "",
                    1,
                    50,
                    1,
                  ) +
                  " knots<br>Se suelta la carga útil"),
              posdatam[1],
              posdatam[2],
              iconblast,
            ];
            AlturaNumber = trim(Number(posdatam[5]));
            //     if trim(posdatam(5)) * 1 < heightsave - 500 and switch= false and s > comienzo then
            if (AlturaNumber < heightsave - 500 && !switcher && s > comienzo) {
              vorloc = vorloc & previousvorlocblast;
              vorloc = vorloc & normalvorloc;
              previousvorlocblast = "";
              normalvorloc = "";
              switcher = true;
            } else {
              if (normalvorloc.length > 0) {
                locations = [...locations, normalvorloc];
                normalvorloc = [];
              } else {
              }
            }
            prevdateformated =
              vorlocDate.getMonth() +
              1 +
              "/" +
              vorlocDate.getDate() +
              "/" +
              vorlocDate.getFullYear() +
              " " +
              vorlocDate.getHours() +
              ":" +
              vorlocDate.getMinutes() +
              ":" +
              vorlocDate.getSeconds();
            if (isDate(new Date(prevdateformated))) {
              previousdate = cDate(prevdateformated);
              previousheight = Number(posdatam[5]);
            }
            if (Number(posdatam[5]) - feetlaunch < 0) {
              feetlaunch = ""; // getAltura(posdatam[1], posdatam[2]) * 3.28084;
            }
            if (posdatam[5] != "51688" && posdatam[5] != "43933") {
              horam = horalocal * 1 + timezoneoffset * 1;
              if (horam > 23) {
                horam = horam - 24;
              }
              if (horam < 0) {
                horam = horam + 24;
                horam = right("00" + horam, 2);
              }
              previousvorlocblast = [
                '<img src="' +
                  iconblast1 +
                  '">Balloon blast or descent at<br>' +
                  horam +
                  ":" +
                  vorlocDate.getMinutes() +
                  ":" +
                  vorlocDate.getSeconds() +
                  " Local / " +
                  vorlocDate.getHours() +
                  ":" +
                  vorlocDate.getMinutes() +
                  ":" +
                  vorlocDate.getSeconds() +
                  " z<br>Altitude: " +
                  replace(
                    formatNumberV2(Number(trim(posdatam[5])) * 0.3048, 0),
                    ",",
                    "",
                    1,
                    50,
                    1,
                  ) +
                  " m. / " +
                  trim(posdatam[5]) +
                  " feet<br>RF reach: " +
                  formatNumber(
                    1.0 *
                      3.87 *
                      Math.sqrt(
                        Math.abs(Number(posdatam[5]) - feetlaunch) * 0.3048,
                      ),
                    0,
                  ) +
                  " Km. Dir: " +
                  wdir +
                  " º<br>Speed: " +
                  replace(formatNumberV2(wspeed, 1), ",", "", 1, 30, 1) +
                  " Km/h / " +
                  replace(
                    formatNumberV2(wspeed * 0.539956803, 1),
                    ",",
                    "",
                    1,
                    30,
                    1,
                  ) +
                  " knots<br>Payload probably released...",
                posdatam[1],
                posdatam[2],
                iconblast,
              ];
            }
          } // END if (trim(posdatam[5]) != "&nbsp;")
          posdatam0s = posdatam[0];
          heightsave = trim(posdatam[5]) * 1;
        } // END if (trim(posdatam[5]) != "" && posdatam0s != posdatam[0])
        um = um + 1;
        posdatam0s = posdatam[0];
      } // END  if(Number(latdelta) < 9.82 && Number(londelta) < 9.82 && Number(latdelta) >= 0 && Number(londelta) >= 0 && Number(wspeed) < 600)
      posdatam0s = posdatam[0];
    } // END (posdatam[1]!= posdatam1s || posdatam[2] != posdatam2s)
    posdatam1s = posdatam[1];
    posdatam2s = posdatam[2];
    posdatam3s = posdatam[3];
    posdatam4s = posdatam[4];
    posdatam0s = posdatam[0];
  } // EBD for loop

  diflat = maxlat - minlat;
  diflon = maxlon - minlon;
  deltapos = diflat + diflon;
  posis[um][0] = trim(posdatam[1]);
  posis[um][1] = trim(posdatam[2]);
  posis[um][2] = trim(posdatam[0]);

  posdataf = pathm[final].split(",");

  if (saveddeltafeetpersecond > -6) {
    saveddeltafeetpersecond = avgdof / avgdocount; //average down in meters/se
    deltafeetpersecond = saveddeltafeetpersecond;
  }

  Delta =
    "Up/Down at: " +
    replace(formatNumberV2(deltafeetpersecond * 0.3048, 1), ",", "", 1, 30, 1) +
    " m/s / " +
    replace(formatNumberV2(deltafeetpersecond * 60, 0), ",", "", 1, 20, 1) +
    " feet/min";
  wdir = posdataf[3];
  wspeed = posdataf[4];
  Glatdegf = posdataf[1];
  Glondegf = posdataf[2];
  heightsave = trim(posdatam[5]) * 1;
  feetlaunchfinal = ""; //getaltura(Glatdegf,Glondegf)
  let estaciones = `http://www.findu.com/cgi-bin/map-near.cgi?lat=${Glatdegf}&lon=${Glondegf}&cnt=150`;

  body = new URLSearchParams({ url: estaciones }).toString();
  pag = await getURLXform(WEB_FETCHER_URL, body);
  let stationlast = 0;
  if (pag.length > 600) {
    stations = parseStations(pag);
    stationlast = 99;
    for (let z = 99; z >= 0; z--) {
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
    let proximas = `http://www.findu.com/cgi-bin/map-near.cgi?lat=${posdatam1s}&lon=${posdatam2s}&last=500&n=500&distance=550`;
    body = new URLSearchParams({ url: proximas }).toString();
    // pag = await getURLXform(
    //   WEB_FETCHER_URL,
    //   body,
    // );
    // const result = processNearStations(pag, ucase(callsign));
    // iconomapa = result.iconomapa;
    // TODO ?  ADD VORLOC TO locations matrix
    //locations = [...locations, ...result.vorloc];
  } // END  if (pag.length > 600)

  Glatlaunchdeg = posdatam1s;
  Glonlaunchdeg = posdatam2s;
  feetlaunch = ""; //getaltura(Glatlaunchdeg,Glonlaunchdeg)*3.28084
  // if feetlaunch*1 < 0 then feetlaunch = 0
  feetdelta = feetlaunch;

  GLatdegf = Glatdegf;
  GLondegf = Glondegf;

  GLatdeg = Glatdegf;
  GLondeg = Glondegf;
  GLatdeg1 = GLatdeg;
  GLondeg1 = GLondeg;
  latdeg = degToDMS(GLatdeg1);
  londeg = degToDMS(GLondeg1);
  altactj = heightsave;
  altactj = altactj - feetlaunch;
  deltaactj = -deltafeetpersecond;
  deltacj = altactj / deltaactj;
  const milisegundosASumar = (deltacj + timezone * 3600) * 1000;
  const horadescenso = new Date(actualdate.getTime() + milisegundosASumar);
  horadesc =
    horadescenso.getHours() +
    ":" +
    right("0" + horadescenso.getMinutes(), 2) +
    ":" +
    right("0" + horadescenso.getSeconds(), 2);
  laspos1 =
    callsign +
    " " +
    (actualdate.getMonth() + 1) +
    "/" +
    actualdate.getDate() +
    " " +
    (Number(right("0" + horalocal, 2)) % 24) +
    ":" +
    right("0" + actualdate.getMinutes(), 2) +
    ":" +
    right("0" + actualdate.getSeconds(), 2) +
    " " +
    replace(
      formatNumber(AlturaNumber * 0.3048 - feetlaunch * 0.3048, 0),
      ",",
      "",
      1,
      30,
      1,
    ) +
    "m ";
  if (deltafeetpersecond !== 0) {
    laspos1 =
      laspos1 +
      (replace(
        formatNumber(deltafeetpersecond * 0.3048, 1),
        ",",
        "",
        1,
        30,
        1,
      ) +
        " m/s ");
  }

  laspos1 =
    laspos1 +
    "to " +
    formatNumber(Number(wdir), 0) +
    "º @ " +
    formatNumber(Number(wspeed) / 0.539956803, 1) +
    " Km/h in " +
    latdeg +
    " " +
    londeg;

  if (deltacj > 10) {
    laspos1 = laspos1 + " Land " + horadesc;
  }
  var usevor;
  let optionHtml = "";
  for (let v = 0; v < lastm; v++) {
    if (left(ucase(callsign), 2) === "CX") {
      usevor = "MJZ";
    } else {
      usevor = "SRC";
    }
    optionHtml += "<option value='" + trim(vormatrix[v][0]) + "'";

    if (getParamSafe("VOR1") === "" && vormatrix[v][0] === usevor) {
      optionHtml += " selected";
      Vor1Loc = trim(vormatrix[v][4]);
      Vor1Lat = vormatrix[v][1];
      Vor1Lon = vormatrix[v][2];
      Vor1Mag = vormatrix[v][3];
      VOR1LocCountry = Vor1Loc + " " + trim(vormatrix[v][5]);
    } else {
      if (vormatrix[v][0] === getParamSafe("VOR1")) {
        optionHtml += " selected";
        Vor1Loc = trim(vormatrix[v][4]);
        Vor1Lat = vormatrix[v][1];
        Vor1Lon = vormatrix[v][2];
        Vor1Mag = vormatrix[v][3];
        Vor1LocCountry = Vor1Loc + " " + trim(vormatrix[v][5]);
      }
    }
    optionHtml += ">" + trim(vormatrix[v][0]) + "</option>" + "\n";
  }

  document.getElementById("VOR1").innerHTML = optionHtml;

  optionHtml = "";
  for (let v = 0; v < lastm; v++) {
    if (left(ucase(callsign), 2) === "CX") {
      usevor = "DUR";
    } else {
      usevor = "MJZ";
    }
    optionHtml += "<option value='" + trim(vormatrix[v][0]) + "'";

    if (getParamSafe("VOR2") === "" && vormatrix[v][0] === usevor) {
      optionHtml += " selected";
      Vor2Loc = trim(vormatrix[v][4]);
      Vor2Lat = vormatrix[v][1];
      Vor2Lon = vormatrix[v][2];
      Vor2Mag = vormatrix[v][3];
      VOR2LocCountry = Vor2Loc + " " + trim(vormatrix[v][5]);
    } else {
      if (
        getParamSafe("VOR2") !== "" &&
        vormatrix[v][0] === getParamSafe("VOR2")
      ) {
        optionHtml += " selected";
        Vor2Loc = trim(vormatrix[v][4]);
        Vor2Lat = vormatrix[v][1];
        Vor2Lon = vormatrix[v][2];
        Vor2Mag = vormatrix[v][3];
        VOR2LocCountry = Vor2Loc + " " + trim(vormatrix[v][5]);
      }
    }
    optionHtml += ">" + trim(vormatrix[v][0]) + "</option>" + "\n";
  }
  document.getElementById("VOR2").innerHTML = optionHtml;
  // getflights();

  let tableHtml = `<table border=0 cellspacing=2 cellpadding=0 width="90%" style="width:90%;">
     <tr>
       <td align=center>
         <a href="http://www.amsat.org.ar" target=_blank>
           <img src="${imageSrcUrl["amsatblue"]}" width=100px border=0 title="Ir a Amsat-LU" ALT="Ir a Amsat-LU">
         </a>
       </td>
       <td align=center>
         <table border=0 cellpadding=4 cellspacing=4 bgcolor="#eeeeee" style="border:none;font-size:16px;font-family:Tahoma;line-height:17px;">
         <tr>
         <td align=center>`;

  if (Tiempo.length !== 2) {
    const fhl = new Date(Fechahoralocal);
    const text = `${mes[fhl.getMonth() + 1]}-${fhl.getDate()} ${fhl.getHours()}:${right(100 + fhl.getMinutes(), 2)} (z) - Updated ${trim(Tiempo)}`;
    tableHtml = `${tableHtml}  <div id="actualizado" name="actualizado">Al ${text} ago<br>`;
    if (latlon.length > 15) {
      tableHtml = `${tableHtml} ${trim(latlonTra(trim(latlon)))}<br></div>`;
    }
    var getURL3 = `http://www.findu.com/cgi-bin/vor.cgi?call=${callsign}&vor1=${VOR1}&vor2=${VOR2}&refresh=60`;
    body = new URLSearchParams({ url: getURL3 }).toString();
    pag = await getURLXform(WEB_FETCHER_URL, body);
    window.Posicion = 1;
    LYERadial = buscarTag(
      "<tr><td>" + VOR1 + "</td><td>" + Vor1Loc + " </td><td>",
      "</td>",
      pag,
    );
    if (LYERadial === "") {
      window.Posicion = 1;
      LYERadial = buscarTag(
        "<tr><td>" + VOR1 + "</td><td>" + VOR1LocCountry + "</td><td>",
        "</td>",
        pag,
      );
    }
    if (LYERadial === "") {
      LYERadial = "Map";
    }
    LYE = "VOR " + Vor1Loc + ": radial=" + LYERadial;
    window.Posicion = window.Posicion - 2;
    LYEDist = buscarTag("<td>", "</td>", pag);
    if (LYEDist !== "") {
      LYE = LYE + " " + " dist=" + LYEDist + " m.náuticas";
    } else {
      LYE = LYE + " dist=Map";
    }

    OSARadial = buscarTag(
      "<tr><td>" + VOR2 + "</td><td>" + Vor2Loc + " </td><td>",
      "</td>",
      pag,
    );
    if (OSARadial === "") {
      window.Posicion = 1;
      OSARadial = buscarTag(
        "<tr><td>" + VOR2 + "</td><td>" + VOR2LocCountry + "</td><td>",
        "</td>",
        pag,
      );
    }
    if (OSARadial === "") {
      OSARadial = "Map";
    }
    OSA = "VOR " + Vor2Loc + ": radial=" + OSARadial;
    window.Posicion = window.Posicion - 2;
    OSADist = buscarTag("<td>", "</td>", pag);
    if (OSADist !== "") {
      OSA = OSA + " " + " dist=" + OSADist + " m.náuticas";
    } else {
      OSA = OSA + " dist=Map";
    }

    if (left(ucase(callsign), 2) !== "CX") {
      tableHtml = `${tableHtml} </td></tr></table></td>
         <td align=center><a href='http://www.anac.gob.ar/' target=_blank><img src="${imageSrcUrl["vor"]}" border=0 width=100px ALT="Ir a la ANAC" title="Ir a la ANAC"></a>
         </td></tr></table>`;
    } else {
      tableHtml = `${tableHtml} </td></tr></table></td>
         <td align=center>
         <a href='https://dinacia.gub.uy//' target=_blank><img src="${imageSrcUrl["rcu"]}" border=0 width=100px ALT="Ir a DINACIA" title="Ir a DINACIA"></a>
         </td></tr></table>`;
    }
    /*
      SMSmsg = LYERadial + " " + VOR1 + " " + LYEDist + " / " + OSARadial + " " + VOR2 + " " + OSADist + " / "
    if (`${Altura}`.length > 2) {
      Alt = trim(replace(Altura, "feet", "", 1, 100, 1));
      Alt = "FL" + parseInt(Alt / 100) + " / "
      SMSmsg = SMSmsg + Alt
    } else {
      SMSmsg = SMSmsg + "FL0 / "
    }
    if (Course.length > 0) {
      CD = parseInt(Cursom(1))
      if (CD > 359) {
        CD = parseInt(CD / 10);
      }
      SMSmsg = SMSmsg + " CD" + CD + " / "
    }
    if (`${Speed}`.length > 0) {
      SMSmsg = SMSmsg + " GS" + Speed + " / "
    }
    SMSmsg = SMSmsg + day(Fechahoralocal)&"-"&mes(month(Fechahoralocal))&" " & right(100+hour(Fechahoralocal),2) & ":" & right(100+minute(FechaHoraLocal),2) & " hace " & Tiempo & " "
    if (OSADist.length > 0 && OSADist.length < 3 && LYEDist.length > 0 && LYEDist.length < 3) {
      //Response.Write "<img src=""images/celulari.gif"" ALT=""Celular"" border=0>" & "SMS = " & SMSmsg & "<br>"
    }
    */
  } else {
    tableHtml = `${tableHtml} No hay datos actualizados disponibles para ${callsign}<br>Los datos para cálculos de VORs se toman de findu.com<br><br>Posiblemente el vuelo ocurrió hace mas de 10 dias<br>o el 'CALL' no corresponde a la licencia buscada<br><br>Puede haber gráficos disponibles dar click
       click <button class='btn-link' onclick='event.preventDefault();window.parent.window.location.href="${HOST_URL}/balloonchart?callsign=${callsign}"'><u>Aquí</u></button>
     </td></tr></table></td><td align=center><a href='http://www.anac.gob.ar/spanish/' target=_blank><img src="${imageSrcUrl["vor"]}" border=0 width=90px alt='Ir a la ANAC' title='Ir a la ANAC'></a></td></tr></table>`;
  }

  document.getElementById("tables_content").innerHTML = tableHtml;

  let otherHtml = "";

  if (`${Tiempo}`.length < 2) {
    Tiempo = "0d 0h 0' 0''";
  }

  if (Tiempo.length > 2) {
    if (datataken.length > 10) {
      urlaprsfi = "http://www.aprs.fi?call=" + callsign;
      otherHtml = `${otherHtml} <a href='${datataken}' target=_blank><font size=-2 style=""vertical-align:text-top;""><u>DATA</u></font></a>
      <a href='${urlaprsfi}' target=_blank><font size=-2 style=""vertical-align:text-top;""><u>APRSFI</u></font></a>
      <a href='http://www.flightradar24.com/${formatNumber(GLatdeg, 2)},${formatNumber(GLondeg, 2)}/7' target=_blank><font size=-2 style=""vertical-align:text-top;""><u>RADAR</u></font></a>`;
    }

    otherHtml = `${otherHtml} <input type='button' name='seechart' value="Chart" style="cursor:hand;width:41px;height:20px;line-height:12px;" onclick="event.preventDefault();window.parent.window.location.href='${HOST_URL}/balloonchart?callsign=${callsign}&flights=${flightsParam}&Vuelo=${Vuelo}'">`;
    /*
    if (left(callsign, 1) === "L") {
      if (LYEDist !== "" && OSADist !== "" && LYEDist < 800 && OSADist < 800) {
        otherHtml = `${otherHtml} <input type='submit' name='Validar' value="Validar Celulares" style="cursor:hand;width:108px;height:20px;line-height:12px;">
         <input type='submit' name='Enviar' value="Enviar SMSs" style="cursor:hand;width:82px;height:20px;line-height:12px;">`;
      }
    }
    */
    otherHtml = `${otherHtml} <input type='button' name='vermapa' value="Findu Map" style="cursor:hand;width:78px;height:20px;line-height:12px;" onclick="event.preventDefault();window.parent.window.location.href='http://www.findu.com/cgi-bin/find.cgi?call=${callsign}'">
     <input type='button' name='verfindu' value="Findu Page" style="cursor:hand;width:76px;height:20px;line-height:12px;" onclick="event.preventDefault();window.parent.window.location.href='http://www.findu.com/cgi-bin/vor.cgi?call=${callsign}&vor1=${VOR1}&vor2=${VOR2}&refresh=60'">`;
  }
  otherHtml = `${otherHtml} <input type='submit' onclick="event.preventDefault();saveMapState();" name='Refresh value="Refresh" style="cursor:pointer;width:66px;height:20px;line-height:12px;">
    <font style="font-weight:normal;font-size:14px;vertical-align:inherit;">Auto-Refr:</font>
    <input type='checkbox' name="AutoRef" value="" style="vertical-align:inherit;" ${autoRefParam == 1 ? "checked" : ""} onclick="event.preventDefault();saveMapState();fireSubmitFormEvent();">
   <font style="font-family:Tahoma;font-weight:normal;font-size:14px;vertical-align:inherit;">All:</font>
   <input type=checkbox name="flights" value="0" onclick="fireSubmitFormEvent();" style="vertical-align:inherit;"${flightsParam == 1 || flightsParam != "" ? "checked" : ""}>`;

  if (ssavempointer > 1) {
    otherHtml = `${otherHtml} <font style='font-size:14px;line-height:14px;font-weight:normal;vertical-align:inherit;'>+Flights:</font>`;
    for (let m = 1; m <= ssavempointer; m++) {
      const fecha = cDate(ssavem[m][1]);
      nombrefecha = fecha.getMonth() + 1 + "/" + fecha.getDate();
      fvloc =
        "Vuelo-" +
        m +
        "  " +
        fecha.getDate() +
        "-" +
        (fecha.getMonth() + 1) +
        "-" +
        fecha.getFullYear() +
        " " +
        right("00" + fecha.getHours(), 2) +
        ":" +
        right("00" + fecha.getMinutes(), 2) +
        "z";
      otherHtml = `${otherHtml} <input type='button' name='vuelos' value='${nombrefecha}' Title='${fvloc}' style='cursor:hand; width:34px;height:20px;font-size:10px;line-height:11px;vertical-align:inherit;' onclick='event.preventDefault();ira("${m}")'>`;
    }
  }

  if (Tiempo.length > 2) {
    crsdist(Vor1Lat, Vor1Lon, GLatdeg, GLondeg);
    d1 = LyeDist;
    r1 = LyeRadial;
    if (!d1) {
      d1 = out.distance;
    }
    if (!r1) {
      r1 = out.bearing;
    }

    crsdist(Vor2Lat, Vor2Lon, GLatdeg, GLondeg);

    d2 = OsaDist;
    r2 = OsaRadial;
    if (!d2) {
      d2 = out.distance;
    }
    if (!r2) {
      r2 = out.bearing;
    }

    Gx = GLatdeg * 1;
    Gy = GLondeg * 1;
    x1 = Gx - (Math.sin((r1 * Math.PI) / 180) * d1 * 360) / 20000;
    y1 = Gy + (Math.cos((r1 * Math.PI) / 180) * d1 * 360) / 10000;
    x2 = Gx - (Math.sin((r2 * Math.PI) / 180) * d2 * 360) / 20000;
    y2 = Gy + (Math.cos((r2 * Math.PI) / 180) * d2 * 360) / 10000;
    var minx = Math.min(x1, x2, Gx);
    var miny = Math.min(y1, y2, Gy);
    var maxx = Math.max(x1, x2, Gx);
    var maxy = Math.max(y1, y2, Gy);
    var deltax = maxx - minx;
    var deltay = maxy - miny;
    var factorx = 65 / deltax;
    var factory = 100 / deltay;
    x1 = (x1 - minx) * factorx + 30;
    x2 = (x2 - minx) * factorx + 30;
    Gx = (Gx - minx) * factorx + 30;
    y1 = (y1 - miny) * factory + 10;
    y2 = (y2 - miny) * factory + 10;
    Gy = (Gy - miny) * factory + 10;
    if (LYEDist !== "" && OSADist !== "" && LYEDist < 800 && OSADist < 800) {
      plot(`${VOR1}`, x1, y1, `${VOR2}`, x2, y2, `${callsign}`, Gx, Gy);
    }
  }

  locations = locations.map((obj) => {
    let vloc = obj.infoWindow;
    if (!vloc) {
      return obj;
    }
    if (LYERadial !== "") {
      vloc = vloc.replace("xQpZ1", `${LYERadial}º Mágn.`);
    }
    if (OSARadial !== "") {
      vloc = vloc.replace("xQpZ2", `${OSARadial}º Mágn.`);
    }
    if (LYEDist !== "") {
      vloc = vloc.replace("ZpQx1", LYEDist);
    }
    if (OSADist !== "") {
      vloc = vloc.replace("ZpQx2", OSADist);
    }

    return {
      ...obj,
      infoWindow: vloc,
    };
  });

  actualseconds =
    actualdate.getHours() * 3600 +
    actualdate.getMinutes() * 60 +
    actualdate.getSeconds();

  lon1 = Glondegf;
  lat1 = Glatdegf;
  brng = wdir;

  d = (Number(wspeed) / 0.439956803 / 3600) * deltacj;
  R = 8971.3;

  abrev = `Buenos Aires/BA,Córdoba/CBA,San Luis/S.Luis,Argentina/Arg,United States of America/US,
   Avenue/Ave,Drive/Drv,Road/Rd,Street/St,Colorado/CO,Alabama/AL,
   Indiana/IN,Minnesota/MN,Montana/MT,Virginia/VA,Arkansas/AR,
   New Mexico/NM,Michigan/MI,California/CA,Kansas/KS,Illinois/IL,
   Arizona/AZ,New York/NY,New Jersey/NJ,Florida/FL,Texas/TX,
   Wisconsin/WI,Connecticut/CT,Iowa/IA,Ohio/OH,Nebraska/NE,Pennsylvania/PA,Departamento/Dep.,South America/SA`;
  abrevi = split(abrev, ",", 400, 1);
  for (let x = 0; x < abrevi.length; x++) {
    let entrm = split(abrevi[x], "/", 2, 1);
    abrevim[x][0] = entrm[0];
    abrevim[x][1] = entrm[1];
  }

  altact1 = heightsave;
  altact1 = altact1 - feetlaunchfinal;
  deltaact1 = -deltafeetpersecond;
  deltac1 = altact1 / deltaact1;

  if (deltac1 < 0) {
    deltac1 = deltac1 * -1;
  }

  outAsp = getLatLonAsp(lati2, loni2, wdir, (wspeed / 3600) * deltac1);

  if (deltafeetpersecond < 0) {
    latsearch = outAsp[0];
    lonsearch = outAsp[1];
  } else {
    latsearch = Glatdegf;
    lonsearch = Glondegf;
  }

  ajustes = 0.3;
  latslo = latsearch - ajustes;
  latshi = latsearch + ajustes;
  lonslo = lonsearch - ajustes;
  lonshi = lonsearch + ajustes;
  if (lonshi > 180) {
    lonshi = lonshi - 360;
  }
  pag = "";
  let getURLcity = `http://overpass-api.de/api/interpreter?data=[out:json];node["place"](${latslo},${lonslo},${latshi},${lonshi});out;`;

  body = new URLSearchParams({ url: getURLcity }).toString();
  pag = await getURLXform(WEB_FETCHER_URL, body);
  if (pag.length < 300) {
    ajustes = 0.8;
    latslo = latsearch - ajustes;
    latshi = latsearch + ajustes;
    lonslo = lonsearch - ajustes;
    lonshi = lonsearch + ajustes;
    if (lonshi > 180) {
      lonshi = lonshi - 360;
    }
    getURLcity = `http://overpass-api.de/api/interpreter?data=[out:json];node["place"](${latslo},${lonslo},${latshi},${lonshi});out;`;

    body = new URLSearchParams({ url: getURLcity }).toString();
    pag = await getURLXform(WEB_FETCHER_URL, body);
  }
  if (pag.length < 300) {
    ajustes = 1.8;
    latslo = latsearch - ajustes;
    latshi = latsearch + ajustes;
    lonslo = lonsearch - ajustes;
    lonshi = lonsearch + ajustes;
    if (lonshi > 180) {
      lonshi = lonshi - 360;
    }
    getURLcity = `http://overpass-api.de/api/interpreter?data=[out:json];node["place"](${latslo},${lonslo},${latshi},${lonshi});out;`;

    body = new URLSearchParams({ url: getURLcity }).toString();
    pag = await getURLXform(WEB_FETCHER_URL, body);
  }
  if (pag.length < 500) {
    ajustes = 4;
    latslo = latsearch - ajustes;
    latshi = latsearch + ajustes;
    lonslo = lonsearch - ajustes;
    lonshi = lonsearch + ajustes;
    if (lonshi > 180) {
      lonshi = lonshi - 360;
    }
    getURLcity = `http://overpass-api.de/api/interpreter?data=[out:json];node["place"](${latslo},${lonslo},${latshi},${lonshi});out;`;

    body = new URLSearchParams({ url: getURLcity }).toString();
    pag = await getURLXform(WEB_FETCHER_URL, body);
  }
  if (pag.length < 500) {
    ajustes = 8;
    latslo = latsearch - ajustes;
    latshi = latsearch + ajustes;
    lonslo = lonsearch - ajustes;
    lonshi = lonsearch + ajustes;
    if (lonshi > 180) {
      lonshi = lonshi - 360;
    }
    getURLcity = `http://overpass-api.de/api/interpreter?data=[out:json];node["place"](${latslo},${lonslo},${latshi},${lonshi});out;`;

    body = new URLSearchParams({ url: getURLcity }).toString();
    pag = await getURLXform(WEB_FETCHER_URL, body);
  }

  window.Posicion = 1;
  distanciaminima = 10000;
  savepos = 1;
  instates = "";

  let elements = [];
  try {
    elements = JSON.parse(pag).elements;
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }

  var instate = "";

  for (const element of elements) {
    const {
      lat,
      lon,
      tags: { name },
    } = element;
    cityname = name;
    if (lat && lat != "" && lon && lon != "") {
      distanciaactual = distancia(lat, lon, latsearch, lonsearch);
      if (distanciaactual < distanciaminima) {
        latciudad = lat;
        lonciudad = lon;
        names = name;
        instate = instates;
        cityname = name;
        distanciaminima = distanciaactual;
      }
    }
  }

  if (latciudad == 0 || lonciudad == 0 || latciudad == "" || lonciudad == "") {
    latciudad = "-35.692191";
    lonciudad = "-63.762359";
    names = "G.Pico";
    cityname = "G.Pico";
  }

  names = fixCityName(names);
  cityname = fixCityName(cityname);
  city = cityname;
  bearn = bearing1(latciudad, latsearch, lonciudad, lonsearch);
  distanciaciudad =
    " @ " +
    formatNumber(
      distancia(latciudad, lonciudad, latsearch, lonsearch) * 1.852,
      1,
    ) +
    " Km =>" +
    parseInt(bearn + 0.5) +
    "º de ";
  distanciaciudad1 =
    formatNumber(
      distancia(latciudad, lonciudad, latsearch, lonsearch) * 1.852,
      1,
    ) +
    " Km at " +
    aziLetras(parseInt(bearn + 0.5)) +
    " of " +
    cityname;
  city = cityname + ", " + instate;

  for (let x = 0; x < abrevim.length; x++) {
    city = replace(city, abrevim[x][0], abrevim[x][1], 1, 100, 1);
  }

  let now = new Date();
  const diffMs = now - actualdate;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  var deltatiempo = diffDays + 3 / 24;
  var tiempoa = "",
    hourd = "",
    minutod = "",
    segundod = "";

  if (parseInt(deltatiempo) > 0) {
    tiempoa = `${parseInt(deltatiempo)}d `;
  }

  hourd = new Date(deltatiempo).getHours();

  if (hourd > 0) {
    tiempoa = tiempoa + hourd + "h ";
  }
  minutod = new Date(deltatiempo).getMinutes();

  if (minutod > 0) {
    tiempoa = tiempoa + minutod + "'";
  }
  segundod = new Date(deltatiempo).getSeconds();

  if (segundod > 0) {
    tiempoa = tiempoa + segundod + "''";
  }
  lineauno =
    "At " +
    mes[actualdate.getMonth() + 1] +
    "-" +
    actualdate.getDate() +
    " " +
    (right("0" + horalocal, 2) % 24) +
    ":" +
    right("0" + actualdate.getHours(), 2) +
    "(z) Updated " +
    tiempoa +
    " ago<br>";

  lineados =
    "Latitude: " +
    replace(
      replace(degToDMS(GLatdeg), "º", "º ", 1, 10, 1),
      "'",
      "' ",
      1,
      10,
      1,
    ) +
    " " +
    "&nbsp;&nbsp;Longitude: " +
    replace(
      replace(degToDMS(GLondeg), "º", "º ", 1, 10, 1),
      "'",
      "' ",
      1,
      10,
      1,
    ) +
    "<br>";
  lineatres =
    "Alt: " +
    heightsave +
    " feet<span id=flecha>&nbsp;</span>Course: " +
    formatNumberV2(wdir, 0) +
    "º&nbsp;&nbsp;Speed: " +
    posdatam4s +
    " Knots<br>";
  lineacuatro = "Landing at " + distanciaciudad1 + "<br>";

  crsdist(Vor1Lat, Vor1Lon, GLatdegf, GLondegf);
  var vor1dist = out.distance;
  var vor1bear = out.bearing + Number(Vor1Mag);

  crsdist(Vor2Lat, Vor2Lon, GLatdegf, GLondegf);
  var vor2dist = out.distance;
  var vor2bear = out.bearing + Number(Vor2Mag) * 1;

  if (vor1dist < 800 && vor2dist < 800) {
    var lineacinco =
      "VOR " +
      Vor1Loc +
      ": radial=" +
      Math.round(vor1bear) +
      " dist=" +
      Math.round(vor1dist) +
      " m.náuticas<br>";
    var lineaseis =
      "VOR " +
      Vor2Loc +
      ": radial=" +
      Math.round(vor2bear) +
      " dist=" +
      Math.round(vor2dist) +
      " m.náuticas<br>";
  } else {
    var lineacinco = "";
    var lineaseis = "";
  }

  document.getElementById("actualizado").innerHTML =
    lineauno + lineados + lineatres + lineacuatro + lineacinco + lineaseis;

  altact1 = heightsave;
  altact1 = altact1 - feetlaunchfinal;
  deltaact1 = -saveddeltafeetpersecond;
  deltac1 = altact1 / deltaact1;
  if (deltac1 < 0) {
    deltac1 = deltac1 * -1;
  }
  outAsp = getLatLonAsp(
    GLatdeg,
    GLondeg,
    wdir,
    (Number(wdir) / 3600) * deltac1,
  );

  if (deltac1 < 0) {
    deltac1 = deltac1 * -1;
  }
  asl = parseInt(actualseconds * 1 + deltac1 * 1 + deltal * 1);
  asz = parseInt(actualseconds * 1 + deltac1);
  if (asl < 0) {
    asl = asl + 3600 * 24;
  }
  if (asz < 0) {
    asz = asz + 3600 * 24;
  }
  var asldays = 0;
  var aszdays = 0;
  var asldays = Math.floor(asl / 86400);
  var aszdays = Math.floor(asz / 86400);
  asl = asl - asldays * 86400;
  asz = asz - aszdays * 86400;
  var hours = Math.floor(asl / 3600);
  var hoursz = Math.floor(asz / 3600);
  var minutes = Math.floor((asl - hours * 3600) / 60);
  var seconds = asl - hours * 3600 - minutes * 60;
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (hoursz < 10) {
    hoursz = "0" + hoursz;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  var timel = hours + ":" + minutes + ":" + seconds;
  var timez = hoursz + ":" + minutes + ":" + seconds;
  if (deltac1 < 0) {
    deltac1 = deltac1 * -1;
  }
  var myDate = actualdate;
  myDate.setDate(myDate.getDate() + asldays);
  fechadescmesdia = myDate.getDate() + "-" + mes[myDate.getMonth() + 1];
  getlatlon(GLatdegf, GLondegf, wdir, (Number(wspeed) / 3600) * deltac1);

  locations[0][0] = `${callsign} landing<br>estimated on ${fechadescmesdia}<br>At ${timel} local / ${timez} z<br>Lat: ${out.lat2.toFixed(6)}, Lon: ${out.lon2.toFixed(6)}<br>Lat: ${deg_to_dms(out.lat2)}", Lon: ${deg_to_dms(out.lon2)}"<br>Lat: ${deg_to_dm(out.lat2)}, Lon: ${deg_to_dm(out.lon2)}`;
  locations[0][1] = out.lat2;
  locations[0][2] = out.lon2;
  locations[0][3] = imageSrcUrl["yellow-dot"];
  const bodyClientRect = document.body.getBoundingClientRect();

  document.getElementById("map_canvas_container").style.width =
    `${bodyClientRect.width}px`;
  document.getElementById("map_canvas_container").style.height =
    `${bodyClientRect.height - 180}px`;
  document.getElementById("map_canvas").style.width =
    `${bodyClientRect.width}px`;
  document.getElementById("map_canvas").style.height =
    `${bodyClientRect.height - 175}px`;
  var sms1p =
    "<font style='font-size:12px;font-family:Arial Narrow;line-height:12px;white-space:nowrap;'>SMS1 = " +
    laspos1;
  var sms1sms = laspos1;

  if (deg_to_dms(out.lat2) > 0) {
    sms1p = sms1p + " " + deg_to_dms(out.lat2) + " " + deg_to_dms(out.lon2);
  }

  sms1p = sms1p + distanciaciudad + fixCityName(city) + "</font>";
  sms1sms = sms1sms + distanciaciudad + fixCityName(city);

  document.getElementById("sms1").innerHTML = sms1p;
  if (deltaact1 != "") {
    if (deltaact1 < 0) {
      document.getElementById("flecha").innerHTML =
        `<img src='${imageSrcUrl["up"]}' border=0 title='${(deltaact1 * -60).toFixed(1)} feet/min\n ${(deltaact1 * 0.3048 * -1).toFixed(1)} m/seg'>`;
    } else {
      document.getElementById("flecha").innerHTML =
        `<img src='${imageSrcUrl["down"]}' border=0 title='${(deltaact1 * -60).toFixed(1)} feet/min\n ${(deltaact1 * 0.3048 * -1).toFixed(1)} m/seg'>`;
    }
  }

  document.getElementById("other_content").innerHTML = otherHtml;
  loadGMap();
}

async function onloadApp() {
  try {
    resizeAndScale();
    await initApp();
  } catch (error) {
    console.error("Error initializing app:", error);
    document.getElementById("map_canvas_container").remove();
    showError(error.message || "An error occurred");
  } finally {
    document.getElementById("loader").style.display = "none";
  }
}

window.addEventListener("load", onloadApp);

window.addEventListener("resize", resizeAndScale);
