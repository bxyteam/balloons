var TZDiff = new Date().getTimezoneOffset();
//var GOOGLE_API_KEY = "AIzaSyAACTum6vjLOeCDgGj6EFFnzJMe7r8xOII";
var GOOGLE_API_KEY = "AIzaSyCOya7aI1WJfTmx9e5d7YY7RgueBwVhwrk";
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
  let ssavelast = pathm.length - 1 - 10;
  ssavem[ssavempointer][0] = pathm.length - 1;
  ssavem[ssavempointer][1] = fecha1;
  ssavempointer = ssavempointer + 1;
  let heightvalid = false;
  let heightp = 0;
  let heighpointer = 0;
  let heighp = 0;
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
