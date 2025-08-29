var TZDiff = new Date().getTimezoneOffset();
//var GOOGLE_API_KEY = "AIzaSyAACTum6vjLOeCDgGj6EFFnzJMe7r8xOII";
var GOOGLE_API_KEY = "AIzaSyCOya7aI1WJfTmx9e5d7YY7RgueBwVhwrk";
var PI = Math.PI; // 3.141592653589793
var DEG2RAD = PI / 180; // 0.017453292519943295
var RAD2DEG = 180 / PI; // 57.29577951308232
var EARTH_RADIUS = 3440.07;
var llheightCache = ""; // TODO check ASP Application value
var lltimezoneCache = ""; // TODO check ASP Application value
window.Posicion = 1;
var pag,
  help,
  help1,
  vorloc,
  VOR1,
  VOR2,
  VOR1La,
  VOR1Lo,
  VOR2La,
  VOR2Lo,
  Ubicacion,
  Ubicacionm,
  Tiempo,
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
  posits,
  um,
  vorloc1m,
  vorloc2m,
  latciudad,
  lonciudad,
  cityname,
  city,
  chequeo,
  callsign;
var Elapsed = 0;
var timezoneoffset = -TZDiff / 60;
var locations = [];
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
var posis = new Array(80001).fill().map(() => Array(6).fill(0));
var heardnn = new Array(301).fill().map(() => Array(2).fill(0));
var heard = new Array(301).fill().map(() => Array(2).fill(0));
var stations = new Array(150).fill().map(() => Array(5).fill(0));
var out = new Array(3).fill(0);
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

async function initApp() {
  setParamValues();

  setDocDomValues();

  await vorread();
  let url1 = "http://www.findu.com/cgi-bin/find.cgi?call=" + callsign;
  let body = new URLSearchParams({ url: url1 }).toString();
  let pag = await getURLXform(
    "https://balloons.dev.browxy.com/api/v1/webFetcher",
    body,
  );
  //console.log(pag);
  let chequeo = buscarTag("Sorry, no position known", "<", pag);
  let latlon;
  if (chequeo === "") {
    console.log("Position found");
    window.Posicion = 1;
    Ubicacion = buscarTag("Position of ", " --- Report", pag);
    console.log(">>>> ", Ubicacion);
    const regex = /(\d+(?:\.\d+)?)\s+miles/;
    const match = Ubicacion.match(regex);
    let millas = "0";

    if (match) {
      millas = match[1];
      console.log(millas);
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
    console.log("latlon", latlon);
    window.Posicion = 1;
    Tiempo = buscarTag("received", "ago", pag);
    console.log("Tiempo", Tiempo);
    let url2 = `http://www.findu.com/cgi-bin/vor.cgi?call=${callsign}&vor1=${VOR1}&vor2=${VOR2}&refresh=60`;
    body = new URLSearchParams({ url: url2 }).toString();
    pag = await getURLXform(
      "https://balloons.dev.browxy.com/api/v1/webFetcher",
      body,
    );

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
  pag = await getURLXform(
    "https://balloons.dev.browxy.com/api/v1/webFetcher",
    body,
  );

  if (pag.length > 600) {
    datataken = urlpath + "<br>";
  }
  datospath = "20" + buscarTag("20", "</BODY>", pag);
  datospath = pag1 + datospath;
  pathm = split(datospath, "<br>", 25000, 2).map((item) =>
    item.replaceAll("\n", ""),
  );
  if (pathm[pathm.length - 1] === "") {
    pathm.pop();
  }
  daysave = cuantosDias(pathm[0].split(",")[0]);
  console.log("daysave", daysave);
  let fecha1 = cuantosDias(pathm[pathm.length - 1].split(",")[0]);
  console.log("fecha1", fecha1);
  let tx = 0;
  let ssavelast = pathm.length - 10;
  ssavem[ssavempointer][0] = pathm.length - 1;
  ssavem[ssavempointer][1] = fecha1;
  ssavempointer = ssavempointer + 1;
  let heightvalid = false;
  let heightp = 0;
  let heighpointer = 0;
  let heighp = 0;
  var posdatam0s = "";
  var posdatam1s = "";
  var posdatam2s = "";
  var prevdateformated = "";
  var deltafeetpersecond = 0;
  var saveddeltafeetpersecond = 0;

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

  // console.log(pathm);
  // console.log(ssavem);
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
  //console.log(hmx);
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
  var switcher = false;
  maxlat = 0;
  minlat = 90;
  maxlon = 0;
  minlon = 180;
  avgdof = 0;
  avgdom = 0;
  avgdocount = 0;
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

  if (getParamSafe("flights") !== "") {
    ssave = 0;
  }

  for (let s = comienzo + 1; s <= final; s++) {
    let posdatam = pathm[s].split(",");
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
                //  Delta = "Up/Down at: " & replace(formatnumber(deltafeetpersecond * .3048, 1,,, 0), ",", "", 1, 30, 1) & " m/s / " & replace(formatnumber(deltafeetpersecond * 60, 0), ",", "", 1, 20, 1) & " feet/min"
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
            //"On " & mes(mid(posdatam(0), 6, 2)) & "-" & mid(posdatam(0), 8, 2) & " " & mid(posdatam(0), 2, 4) & "<br> At " & horam & ":" & mid(posdatam(0), 12, 2) & ":" & mid(posdatam(0), 14, 2) & " Local / " & mid(posdatam(0), 10, 2) & ":" & mid(posdatam(0), 12, 2) & ":" & mid(posdatam(0), 14, 2) & " z<br>Altitude: " & replace(FormatNumber(trim(posdatam(5)) * .3048, 0,,, 0), ",", "", 1, 50, 1) & " m. / " & trim(posdatam(5)) & " feet " & alturasobretierra & "<br>RF reach: " & formatnumber(1.00 * 3.8 * sqr(abs((posdatam(5) - feetlaunch)) * .3048), 0) & " Km. Dir: " & wdir & " &ordm;<br>Speed: " & replace(FormatNumber(wspeed, 1,,, 0), ",", "", 1, 50, 1) & " Km/h / " & replace(FormatNumber(wspeed * 0.539956803, 1,,, 0), ",", "", 1, 50, 1) & " knots<br>" & Delta & "',"
            //normalvorloc = normalvorloc & posdatam(1) & "," & posdatam(2) & ",'" & icono & "']," & vbCrLf
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
                " &ordm;<br>Speed: ") &
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
                  " knots<br>Se suelta la carga &uacute;til"),
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
                //vorloc = vorloc & normalvorloc
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
                  " &ordm;<br>Speed: " +
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

              //previousvorlocblast = previousvorlocblast & posdatam(1) & "," & posdatam(2) & ",'" & iconblast & "']," & vbCrLf
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
    posdatam0s = posdatam[0];
  } // EBD for loop

  diflat = maxlat - minlat;
  diflon = maxlon - minlon;
  deltapos = diflat + diflon;
  posis[um][0] = trim(posdatam[1]);
  posis[um][1] = trim(posdatam[2]);
  posis[um][2] = trim(posdatam[0]);
  //if (final === pathm.length - 1) {
  posdataf = pathm[final].split(",");
  // } else {
  // posdataf = pathm[final].split(",");
  //}
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
  console.log("estaciones", estaciones);
  body = new URLSearchParams({ url: estaciones }).toString();
  pag = await getURLXform(
    "https://balloons.dev.browxy.com/api/v1/webFetcher",
    body,
  );
  let stationlast = 0;
  if (pag.length > 600) {
    stations = parseStations(pag);
    console.log("stations", stations);
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
    pag = await getURLXform(
      "https://balloons.dev.browxy.com/api/v1/webFetcher",
      body,
    );
    const result = processNearStations(pag, ucase(callsign));
    console.log(result);
    // TODO ?  ADD VORLOC TO locations matrix
  } // END  if (pag.length > 600)
  Glatlaunchdeg = posdatam1s;
  Glonlaunchdeg = posdatam2s;
  feetlaunch = ""; //getaltura(Glatlaunchdeg,Glonlaunchdeg)*3.28084
  // if feetlaunch*1 < 0 then feetlaunch = 0
  feetdelta = feetlaunch;

  GLatdeg = Glatdegf;
  GLondeg = Glondegf;
  Glatdeg1 = Glatdeg;
  Glondeg1 = Glondeg;
  latdeg = degToDMS(Glatdeg1);
  londeg = degToDMS(Glondeg1);
  altactj = heightsave;
  altactj = altactj - feetlaunch;
  deltaactj = -deltafeetpersecond;
  var deltacj = altactj / deltaactj;
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
      formatNumberV2(AlturaNumber * 0.3048 - feetlaunch * 0.3048, 0),
      ",",
      "",
      1,
      30,
      1,
    ) +
    "m ";
  if (deltafeetpersecond !== 0) {
    laspos1 =
      laspos1 &
      (replace(
        formatNumberV2(deltafeetpersecond * 0.3048, 1),
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
    formatNumber(wdir, 0) +
    "\BA @ " +
    formatNumber(wspeed / 0.539956803, 1) +
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
    optionHtml += "<option value='" + trim(vormatrix[(v, 0)]) + "'";

    if (getParamSafe("VOR1") === "" && vormatrix[v][0] === usevor) {
      optionHtml += " selected";
      VOR1Loc = trim(vormatrix[v][4]);
      VOR1Lat = vormatrix[v][1];
      VOR1Lon = vormatrix[v][2];
      Vor1Mag = vormatrix[v][3];
      VOR1LocCountry = VOR1Loc + " " + trim(vormatrix[v][5]);
    } else {
      if (vormatrix[v][0] === getParamSafe("VOR1")) {
        optionHtml += " selected";
        VOR1Loc = trim(vormatrix[v][4]);
        VOR1Lat = vormatrix[v][1];
        VOR1Lon = vormatrix[v][2];
        Vor1Mag = vormatrix[v][3];
        VOR1LocCountry = VOR1Loc + " " + trim(vormatrix[v][5]);
      }
    }
    optionHtml += ">" + trim(vormatrix[v][0]) + "</option>" + "\n";
  }
  //console.log(optionHtml);
  document.getElementById("VOR1").innerHTML = optionHtml;

  optionHtml = "";
  for (let v = 0; v < lastm; v++) {
    if (left(ucase(callsign), 2) === "CX") {
      usevor = "DUR";
    } else {
      usevor = "MJZ";
    }
    optionHtml += "<option value='" + trim(vormatrix[(v, 0)]) + "'";

    if (getParamSafe("VOR2") === "" && vormatrix[v][0] === usevor) {
      optionHtml += " selected";
      VOR2Loc = trim(vormatrix[v][4]);
      VOR2Lat = vormatrix[v][1];
      VOR2Lon = vormatrix[v][2];
      Vor2Mag = vormatrix[v][3];
      VOR2LocCountry = VOR2Loc + " " + trim(vormatrix[v][5]);
    } else {
      if (vormatrix[v][0] === getParamSafe("VOR2")) {
        optionHtml += " selected";
        VOR2Loc = trim(vormatrix[v][4]);
        VOR2Lat = vormatrix[v][1];
        VOR2Lon = vormatrix[v][2];
        Vor2Mag = vormatrix[v][3];
        VOR2LocCountry = VOR2Loc + " " + trim(vormatrix[v][5]);
      }
    }
    optionHtml += ">" + trim(vormatrix[v][0]) + "</option>" + "\n";
  }

  document.getElementById("VOR2").innerHTML = optionHtml;
  getflights();
}
async function onloadApp() {
  try {
    await initApp();
  } catch (error) {
    console.error("Error initializing app:", error);
    showError(error.message || "An error occurred");
  } finally {
    document.getElementById("loader").style.display = "none";
  }
}

window.addEventListener("load", onloadApp);
