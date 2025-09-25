var map;
var ARRcookies = "";
var refreshParam = "";
var autoRefParam = "";
var GLatdeg = 0;
var GLondeg = 0;
var GLatdegf = 0;
var GLondegf = 0;
var touchdown = "";
var callsign = "";
var heightsave = "";
var feetlaunchfinal = "";
var saveddeltafeetpersecond = "";

var horalocal = "";
var timezoneoffset = "";

var deltafeetpersecond = "";

var wdir = "";
var wspeed = "";
var VOR1La = "";
var VOR1Lo = "";
var VOR2La = "";
var VOR2Lo = "";
var AlturaNumber = "";
var Delta = "";
var posis = [];
var time = "";
var timel = "";
var timez = "";
var tiempodown = "";
var locations = [];
var fechadescmesdia = "";
var deltapos = 0;
var iconomapa = "";
var latciudad = "";
var lonciudad = "";
var actualdate = "";
var posdatam = "";
var feetlaunch = "";
var um = 0;

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

function crsdist(lat1, lon1, lat2, lon2) {
  var EARTH_RADIUS = 3440.07;
  var PI = 3.1415926535897932384626433832795;
  var DEG2RAD = 0.01745329252;
  var RAD2DEG = 57.29577951308;
  var x1 = lon1 * DEG2RAD;
  var y1 = lat1 * DEG2RAD;
  var x2 = lon2 * DEG2RAD;
  var y2 = lat2 * DEG2RAD;

  osphFrom = defSphereCoo(EARTH_RADIUS, y1, x1);
  osphTo = defSphereCoo(EARTH_RADIUS, y2, x2);

  qchordkm = Math.sqrt(
    (osphTo.xp - osphFrom.xp) * (osphTo.xp - osphFrom.xp) +
      (osphTo.yp - osphFrom.yp) * (osphTo.yp - osphFrom.yp) +
      (osphTo.zp - osphFrom.zp) * (osphTo.zp - osphFrom.zp),
  );
  distance = 2 * EARTH_RADIUS * Math.asin(qchordkm / 2 / EARTH_RADIUS);
  // Now get bearing
  a = Math.cos(y2) * Math.sin(x2 - x1);
  b =
    Math.cos(y1) * Math.sin(y2) -
    Math.sin(y1) * Math.cos(y2) * Math.cos(x2 - x1);
  adjust = 0;
  if (a == 0 && b == 0) {
    bearing = 0;
  } else if (b == 0) {
    if (a < 0) bearing = (3 * PI) / 2;
    else bearing = PI / 2;
  } else if (b < 0) adjust = PI;
  else {
    if (a < 0) adjust = 2 * PI;
    else adjust = 0;
  }
  bearing = (Math.atan(a / b) + adjust) * RAD2DEG;
  out = new MakeArray(0);
  out.distance = distance;
  out.bearing = bearing;
  return out;
}
function MakeArray(n) {
  this.length = n;
  for (var i = 1; i <= n; i++) {
    this[i] = 0;
  }
  return this;
}
function defSphereCoo(rad, nw, nl) {
  var osph;
  osph = new Object();
  rad_ = rad * Math.cos(nw);
  osph.xp = rad_ * Math.cos(nl);
  osph.yp = rad_ * Math.sin(nl);
  osph.zp = rad * Math.sin(nw);
  return osph;
}
function getlatlon(lat1, lon1, bearing, distance) {
  var EARTH_RADIUS = 3440.07; //distance in nMiles
  var PI = 3.1415926535897932384626433832795;
  var DEG2RAD = 0.01745329252;
  var RAD2DEG = 57.29577951308;
  lata1 = lat1 * DEG2RAD;
  lona1 = lon1 * DEG2RAD;
  bearing2 = bearing * DEG2RAD;
  var lata2 = Math.asin(
    Math.sin(lata1) * Math.cos(distance / EARTH_RADIUS) +
      Math.cos(lata1) * Math.sin(distance / EARTH_RADIUS) * Math.cos(bearing2),
  );
  var lona2 =
    lona1 +
    Math.atan2(
      Math.sin(bearing2) * Math.sin(distance / EARTH_RADIUS) * Math.cos(lata1),
      Math.cos(distance / EARTH_RADIUS) - Math.sin(lata1) * Math.sin(lata2),
    );
  out = new MakeArray(0);
  out.lat2 = lata2 * RAD2DEG;
  out.lon2 = lona2 * RAD2DEG;
  return out;
}
function deg_to_dms(deg) {
  if (deg < 0) {
    deg = -deg;
    var signo = "-";
  } else {
    var signo = "";
  }
  var d = Math.floor(deg);
  var minfloat = (deg - d) * 60;
  var m = Math.floor(minfloat);
  var secfloat = (minfloat - m) * 60;
  var s = Math.round(secfloat);
  // After rounding, the seconds might become 60. These two
  // if-tests are not necessary if no rounding is done.
  if (s == 60) {
    m++;
    s = 0;
  }
  if (m == 60) {
    d++;
    m = 0;
  }
  return signo + d + "º" + ("100" + m).slice(-2) + "'" + ("100" + s).slice(-2);
}
function deg_to_dm(deg) {
  if (deg < 0) {
    deg = -deg;
    var signo = "-";
  } else {
    var signo = "";
  }
  var d = Math.floor(deg);
  var minfloat = (deg - d) * 60;
  var m = minfloat.toFixed(3);

  if (m == 60) {
    d++;
    m = 0;
  }
  return signo + d + "º " + m + "'";
}

function formatNumber(number, decimals) {
  return parseFloat(number).toFixed(decimals);
}

function formatNumberV2(
  number,
  decimals = 0,
  includeLeadingDigit = true,
  useParensForNegative = false,
  groupDigits = false,
) {
  if (isNaN(number)) return "0";

  let result = parseFloat(number).toFixed(decimals);

  if (groupDigits) {
    // Agregar comas como separadores de miles
    result = result.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  if (useParensForNegative && number < 0) {
    result = "(" + result.substring(1) + ")";
  }

  return result;
}

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

async function showvormap() {
  if (GLatdeg != 0) {
    map = new google.maps.Map(document.getElementById("map"), {
      mapId: "DEMO_MAP_ID",
      zoom: deltapos > 1 ? 8 : 10,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
      },
      center: new google.maps.LatLng(GLatdeg, GLondeg),
      scaleControl: true,
      scaleControlOptions: {
        position: google.maps.ControlPosition.BOTTOM_LEFT,
        style: google.maps.ScaleControlStyle.STANDARD,
      },
      streetViewControl: true,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.LEFT_TOP,
      },
      streetViewControl: true,
      overviewMapControl: true,
      rotateControl: true,
      mapTypeId: google.maps.MapTypeId.HYBRID,
    });
    var infowindow = new google.maps.InfoWindow({ maxWidth: 220 });
    var image = imageSrcUrl["balloon"];
    if (iconomapa) {
      var image = {
        url: iconomapa,
        scaledSize: new google.maps.Size(32, 32),
      };
    }
    marker1 = new google.maps.Marker({
      position: new google.maps.LatLng(GLatdegf, GLondegf),
      Title:
        GLondegf * 1 > -61 &&
        GLondegf * 1 < -56 &&
        GLatdegf * 1 > -36 &&
        GLatdegf * 1 < -31 &&
        ucase(callsign) === "LU7AA-11"
          ? "Avion\nHeight\n" +
            replace(
              formatNumberV2((heightsave - feetlaunchfinal) * 0.3048, 0),
              ",",
              "",
              1,
              10,
            ) +
            " m."
          : "Balloon\nHeight\n" +
            replace(
              formatNumberV2((heightsave - feetlaunchfinal) * 0.3048, 0),
              ",",
              "",
              1,
              10,
            ) +
            " m.",
      map: map,
      icon:
        GLondegf * 1 > -61 &&
        GLondegf * 1 < -56 &&
        GLatdegf * 1 > -36 &&
        GLatdegf * 1 < -31 &&
        ucase(callsign) === "LU7AA-11"
          ? {
              path: "M 0,0 1,1 1,2 5,3 5,5 1,5 1,8 3,9 3,10 -3,10 -3,9 -1,8 -1,5 -5,5 -5,3 -1,2 -1,1 z",
              strokeColor: "#FFFF00",
              strokeWeight: 2,
              fillColor: "#CC6666",
              fillOpacity: 0.6,
              scale: 3,
              rotation: wdir,
            }
          : image,
    });
    var image = new google.maps.MarkerImage(
      imageSrcUrl["pin"],
      null,
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 30),
    );
    marker7 = new google.maps.Marker({
      position: new google.maps.LatLng(latciudad, lonciudad),
      Title: "Balloon reference City",
      map: map,
      icon: image,
    });
    var altact = heightsave;
    altact = altact - feetlaunchfinal;
    var deltaact = -saveddeltafeetpersecond;
    var deltac = parseInt(altact / deltaact);
    if (deltac < 0) {
      deltac = deltac * -1;
    }

    var hours = Math.floor(deltac / 3600);
    var minutes = Math.floor((deltac - hours * 3600) / 60);
    var seconds = deltac - hours * 3600 - minutes * 60;
    var spandias = 0;
    if (hours > 24) {
      spandias = Math.floor(hours / 24);
      hours = hours - Math.floor(hours / 24) * 24;
    }
    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    var time = hours + ":" + minutes + ":" + seconds;
    if (spandias > 0) {
      time = spandias + "d + " + time;
    }
    //       if (deltac<0){time="00:00:00";}
    if (altact < 120000 && !isNaN(hours)) {
      var touchdown = `<br>Terrain at ${formatNumber(feetlaunchfinal * 0.3048, 0)} m. above sea level<br>Estimated land in  ${time}`;
    } else {
      var touchdown = `<br>Terrain at ${formatNumber(feetlaunchfinal * 0.3048, 0)} m. above sea level`;
    }
    //    var lastpos = "<%=callsign & " " & right("0"&horalocal,2) & ":" & right("0" & minute(actualdate),2) & " " & FormatNumber(AlturaNumber*.3048-feetlaunch*.3048,0,,,0) & "m." & " " & formatnumber(deltafeetpersecond*.3048,1,,,0) & " m/s hacia " & FormatNumber(wdir,0,,,0) & "\BA a " & FormatNumber(wspeed/0.539956803,1,,,0) & " Km/h en " & latdeg & " " & londeg & " " & Delta%>"+touchdown;
    //     alert (lastpos);
    horam = horalocal * 1 + timezoneoffset * 1;
    if (horam > 23) {
      horam = horam - 24;
    }
    if (horam < 0) {
      horam = horam + 24;
    }
    horam = right("00" + horam, 2);
    var iw = new google.maps.InfoWindow({
      maxWidth: 249,
      content: `<div style='line-height:1.2;overflow:hidden;white-space:nowrap;'>${callsign} ${horam} : ${right("0" + actualdate.getMinutes(), 2)} : ${right("0" + actualdate.getSeconds(), 2)} / ${right("0" + actualdate.getHours(), 2)} : ${right("0" + actualdate.getMinutes(), 2)} : ${right("0" + actualdate.getSeconds(), 2)} z<br>On ${mes[actualdate.getMonth() + 1]} - ${actualdate.getDate()} of  ${actualdate.getFullYear()} <br>Lat: ${formatNumber(GLatdeg, 6)} Lon: ${formatNumber(GLondeg, 6)} <br>Altitude: ${formatNumberV2(AlturaNumber * 0.3048, 0)} m. / ${AlturaNumber} feet<br>RF reach radio: ${formatNumberV2(1.0 * 3.87 * Math.sqrt(Math.abs(posdatam[5] - feetlaunch) * 0.3048), 0)} Km. (Coverage)<br>Toward ${wdir} ordm; @ ${formatNumber(wspeed / 0.539956803, 1)} Km/h /  ${wspeed} knots<br> ${Delta} ${touchdown}</div>`,
    });
    google.maps.event.addListener(marker1, "click", function (e) {
      iw.open(map, this);
    });
    google.maps.event.addListener(marker7, "click", function () {
      //create a new InfoWindow instance

      crsdist(latciudad, lonciudad, latsearch, lonsearch);
      var infowindow = new google.maps.InfoWindow({
        maxWidth: 220,
        content:
          "<div style='line-height:1.2;overflow:hidden;white-space:nowrap;'>" +
          cityname +
          "<br>Lat: " +
          deg_to_dms(latciudad) +
          "<br>Lon " +
          deg_to_dms(lonciudad) +
          "<br>" +
          (out.distance * 1.852).toFixed(1) +
          " Km > " +
          out.bearing.toFixed(0) +
          "º</div>",
      });
      infowindow.open(map, marker7);
    });

    google.maps.event.addListener(map, "rightclick", function (event) {
      marker.setMap(null);
    });

    google.maps.event.addListener(map, "rightclick", function (event) {
      var lat = event.latLng.lat();
      var lng = event.latLng.lng();

      crsdist(lat, lng, latsearch, lonsearch);
      var distaldesc = out.distance;
      var azimaldesc = out.bearing;

      crsdist(lat, lng, GLatdegf, GLondegf);
      distalglobo = out.distance;
      azimalglobo = out.bearing;
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        map: map,
        Title:
          "     Lat " +
          deg_to_dms(event.latLng.lat()) +
          '"\n     Lon ' +
          deg_to_dms(event.latLng.lng()) +
          '"\nDistDesc  ' +
          (distaldesc * 1.852).toFixed(2) +
          " Km\nAzimDesc " +
          azimaldesc.toFixed(0) +
          "º\n   --------------------\nDistGlobo  " +
          (distalglobo * 1.852).toFixed(2) +
          " Km\nAzimGlobo " +
          azimalglobo.toFixed(0) +
          "º",
        icon: imageSrcUrl["green_arrow"],
      });
    });
    altact1 = heightsave;
    altact1 = altact1 - feetlaunchfinal;
    deltaact1 = -deltafeetpersecond;
    deltac1 = altact1 / deltaact1;
    if (deltac1 < 0) {
      deltac1 = deltac1 * -1;
    }
    getlatlon(GLatdeg, GLondegf, wdir, (wspeed / 3600) * deltac1);

    var cityballoon = [
      deltafeetpersecond < 0
        ? new google.maps.LatLng(out.lat2, out.lon2)
        : new google.maps.LatLng(GLatdegf, GLondegf),

      new google.maps.LatLng(latciudad, lonciudad),
    ];
    var cityPath = new google.maps.Polyline({
      path: cityballoon,
      strokeColor: "#00FF00",
      strokeOpacity: 0.6,
      strokeWeight: 2,
    });
    cityPath.setMap(map);

    crsdist(VOR1La, VOR1Lo, GLatdegf, GLondegf);
    var d1 = out.distance;

    crsdist(VOR2La, VOR2Lo, GLatdegf, GLondegf);
    var d2 = out.distance;
    if (d1 < 800 && d2 < 800) {
      var flightPlanCoordinates = [
        new google.maps.LatLng(VOR1La, VOR1Lo),
        new google.maps.LatLng(GLatdeg, GLondeg),
        new google.maps.LatLng(VOR2La, VOR2Lo),
      ];
      var flightPath = new google.maps.Polyline({
        path: flightPlanCoordinates,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2,
      });
      flightPath.setMap(map);
    }
    if (um > 1) {
      altact1 = heightsave;
      altact1 = altact1 - feetlaunchfinal;
      deltaact1 = -deltafeetpersecond;
      deltac1 = altact1 / deltaact1;
      if (deltac1 < 0) {
        deltac1 = deltac1 * -1;
      }
      //    getlatlon (<%=GLatdeg%>,<%=Glondeg%>,<%=wdir%>,<%=(wspeed/3600)%>*deltac1)
      // ojo cambio
      getlatlon(GLatdeg, GLondeg, 0, 0);
      var tempCoordsArr = [];
      let h = 0;
      for (h = 0; h < um; h++) {
        tempCoordsArr.push(new google.maps.LatLng(posis[h][0], posis[h][1]));
      }
      var positionCoordinates = [
        ...tempCoordsArr,
        new google.maps.LatLng(posis[h - 1][0], posis[h - 1][1]),
      ];
      var positionPath = new google.maps.Polyline({
        path: positionCoordinates,
        strokeColor: "#FFFF00",
        strokeOpacity: 1.0,
        strokeWeight: 2,
      });
      positionPath.setMap(map);

      var lineSymbol = {
        path: "M 0,3 0,-3",
        strokeOpacity: 1,
        scale: 2,
      };

      var lastpositionCoordinates = [
        new google.maps.LatLng(GLatdeg, GLondeg),
        new google.maps.LatLng(out.lat2, out.lon2),
      ];

      var flightLand = new google.maps.Polyline({
        path: lastpositionCoordinates,
        strokeColor: "#FFFF00",
        strokeOpacity: 0,
        icons: [
          {
            icon: lineSymbol,
            offset: "0",
            repeat: "18px",
          },
        ],
        strokeWeight: 1,
      });
      flightLand.setMap(map);

      var widePath = new google.maps.Polyline({
        path: lastpositionCoordinates,
        strokeColor: "#FFFF00",
        strokeOpacity: 0.01,
        strokeWeight: 21,
      });
      widePath.setMap(map);

      crsdist(GLatdeg, GLondeg, out.lat2, out.lon2);
      google.maps.event.addListener(widePath, "click", function (event) {
        marker2 = new google.maps.Marker({
          position: new google.maps.LatLng(
            event.latLng.lat(),
            event.latLng.lng(),
          ),
        });
        idesc.open(map, marker2);
      });
      marker2 = new google.maps.Marker({
        position: new google.maps.LatLng(GLatdegf, GLondegf),
      });
      var distkm = out.distance * 1.85;
      if (distkm > 1) {
        var tiempodown = distkm.toFixed(2) + " Km.";
      } else {
        tiempodown = (distkm * 1000).toFixed(0) + " m.";
      }

      var idesc = new google.maps.InfoWindow({
        content:
          "<div style='line-height:1.2;overflow:hidden;white-space:nowrap;'>Aterrizaje estimado en<br>" +
          time +
          " " +
          timel +
          " local a los <br>" +
          tiempodown +
          " de &uacute;ltima posici&oacute;n<br> Toward direcci&oacute;n " +
          out.bearing.toFixed(1) +
          " º</div>",
      });
    }
    var marker, i;

    for (i = 0; i < locations.length - 1; i++) {
      if (i == 0) {
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(locations[i][1], locations[i][2]),
          map: map,
          icon: locations[i][3],
          Title:
            "   Aterrizaje estimado " +
            fechadescmesdia +
            "\nA las " +
            timel +
            " local / " +
            timez +
            " z",
        });
      }

      if (i > 0) {
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(locations[i][1], locations[i][2]),
          map: map,
          icon: locations[i][3],
        });
      }
      var circulo;
      google.maps.event.addListener(
        marker,
        "click",
        (function (marker, i) {
          return function () {
            var radio = 0;
            if (locations[i][0].search("lcance") > 0) {
              var datauno = locations[i][0].split("lcance");
              datados = datauno[1].split(" ");
              radio = datados[1] * 1000;
            }
            var CoverageOptions = {
              strokeColor: "#00FFFF",
              strokeOpacity: 0.5,
              strokeWeight: 1,
              fillColor: "#00FFFF",
              fillOpacity: 0.08,
              map: map,
              center: new google.maps.LatLng(locations[i][1], locations[i][2]),
              radius: radio,
            };
            if (circulo == null) {
              circulo = new google.maps.Circle(CoverageOptions);
              latsc = locations[i][1];
              lonsc = locations[i][2];
            } else {
              circulo.setMap(null);
              circulo = new google.maps.Circle(CoverageOptions);
            }

            if (i == vorloc1m) {
              locations[i][0] = locations[i][0].replace(
                "xQpZ1",
                parseInt(r1) + " º",
              );
              locations[i][0] = locations[i][0].replace("ZpQx1", parseInt(d1));
            }
            if (i == vorloc2m) {
              locations[i][0] = locations[i][0].replace(
                "xQpZ2",
                parseInt(r2) + " º",
              );
              locations[i][0] = locations[i][0].replace("ZpQx2", parseInt(d2));
            }
            infowindow.setContent(
              "<div style='line-height:1.2;overflow:hidden;white-space:nowrap;'>" +
                locations[i][0],
            ) + "</div>";
            infowindow.open(map, marker);
          };
        })(marker, i),
      );
    }
    if (refreshParam === "Refresh") {
      getMapState();
    }

    google.maps.event.addListener(map, "tilesloaded", tilesLoaded);
    function tilesLoaded() {
      console.log("Tiles loaded");
      google.maps.event.clearListeners(map, "tilesloaded");
      google.maps.event.addListener(map, "zoom_changed", saveMapState);
      google.maps.event.addListener(map, "dragend", saveMapState);
    }
    function saveMapState() {
      var mapCenter = map.getCenter();
      const mapState = {
        zoom: map.getZoom(),
        lat: mapCenter.lat(),
        lng: mapCenter.lng(),
      };
      window.parent.postMessage(
        {
          callbackName: "saveMapState",
          props: { mapState },
        },
        PARENT_URL,
      );
    }
    function getMapState() {
      window.parent.postMessage(
        {
          callbackName: "loadMapState",
          props: {},
        },
        PARENT_URL,
      );
    }

    if (autoRefParam == 1) {
      google.maps.event.addListenerOnce(map, "idle", function () {
        google.maps.event.trigger(marker1, "click");
      });
    }
  } else {
    document.getElementById("map").innerHTML =
      "Invalid Balloon Location Detected, can't show VOR's map";
  }
}

function loadMapState(mapState) {
  if (map && mapState) {
    map.setCenter(new google.maps.LatLng(mapState.lat, mapState.lng));
    map.setZoom(mapState.zoom);
  }
}

function processJsonData(jsonData) {
  callsign = jsonData.callsign;
  heightsave = jsonData.heightsave;
  feetlaunchfinal = jsonData.feetlaunchfinal;
  saveddeltafeetpersecond = jsonData.saveddeltafeetpersecond;
  horalocal = jsonData.horalocal;
  deltafeetpersecond = jsonData.deltafeetpersecond;
  timezoneoffset = jsonData.timezoneoffset;
  wdir = jsonData.wdir;
  wspeed = jsonData.wspeed;
  VOR1La = jsonData.VOR1La;
  VOR1Lo = jsonData.VOR1Lo;
  VOR2La = jsonData.VOR2La;
  VOR2Lo = jsonData.VOR2Lo;
  GLatdeg = jsonData.GLatdeg;
  GLondeg = jsonData.GLondeg;
  GLatdegf = jsonData.GLatdegf;
  GLondegf = jsonData.GLondegf;
  posis = jsonData.posis;
  locations = jsonData.locations;
  fechadescmesdia = jsonData.fechadescmesdia;
  refreshParam = jsonData.refreshParam;
  autoRefParam = jsonData.autoRefParam;
  deltapos = jsonData.deltapos;
  iconomapa = jsonData.iconomapa;
  latciudad = jsonData.latciudad;
  lonciudad = jsonData.lonciudad;
  actualdate = new Date(jsonData.actualdate);
  AlturaNumber = jsonData.AlturaNumber;
  posdatam = jsonData.posdatam;
  feetlaunch = jsonData.feetlaunch;
  Delta = jsonData.Delta;
  um = jsonData.um;
  showvormap();
}

function showMap() {
  document.getElementById("gMapLoader").style.display = "none";
  document.getElementById("map").style.visibility = "visible";
}

function displayError(msg) {
  document.getElementById("map").innerHTML = `<div style="border: 3px solid red;
      padding: 10px;
      border-radius: 5px;
      width: 300px;
      margin: 0 auto;
      box-shadow: 4px 10px 22px -17px;">
  <h3 style="font-size: 18px;">Error initializing map:</h3>
  <p style="font-size: 16px;">${msg}</p>
  </div>`;
}
