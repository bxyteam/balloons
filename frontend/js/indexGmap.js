var saveglobo;
var saveestaciones;
var velest;
var hide = false;
var Kmrecorridos = 0;
var TZD = new Date().getTimezoneOffset() / 60 / 24;
var txt = "";
var hide = false;
var saveglobo;
var saveestaciones;
var velest;
var meterfeet = 0;
var prevaltutext;
window.comentfull = "";
window.comentariosballoon = "";

window.getParamSafe = (key, defaultValue = "", encode = false) => {
  const params = new URLSearchParams(window.searchParams);
  const value = params.get(key);
  if (value === null || value.trim() === "") return defaultValue;
  return encode ? encodeURIComponent(value) : value.trim();
};

window.getLaunchDate = () => {
  if (getParamSafe("launch").length > 0) {
    const launchd = getParamSafe("launch");
    return `${launchd.substring(0, 4)}-${launchd.substring(4, 6)}-${launchd.substring(6, 8)} ${launchd.substring(8, 10)}:${launchd.substring(10, 12)}:${launchd.substring(12, 14)}`;
  }
  const now = new Date();
  const fe = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
  const pad = (n) => String(n).padStart(2, "0");
  return `${fe.getFullYear()}-${pad(fe.getMonth() + 1)}-${pad(fe.getDate())} 00:00:00`;
};

// var diaslaunch = Math.floor(
//   (new Date() - new Date(window.getLaunchDate())) / (1000 * 60 * 60 * 24),
// );

function handleErr(msg, url, l) {
  txt = "There was an error on this page.\n\n";
  txt += "Error: " + msg + "\n";
  txt += "URL: " + url + "\n";
  txt += "Line: " + l + "\n\n";
  txt += "Click OK to continue.\n\n"; //;alert(txt)
  if (
    url.substring(0, 12) == "https://maps" ||
    msg.substring(11, 20) == "document." ||
    txt.indexOf("properties of null") > -1
  ) {
    alert(txt);
  } else {
    //  document.location.reload();
    alert(txt);
  }
  return true;
}
function checkdate() {
  fechaingresada = formu.limit.value;
  fecha = new Date(
    fechaingresada.substring(0, 4) +
      "/" +
      fechaingresada.substring(4, 6) +
      "/" +
      fechaingresada.substring(6, 8),
  );
  if (isNaN(fecha)) {
    alert("Entered date " + fechaingresada + " is invalid, cleared");
    formu.limit.value = "";
  }
}
function getslot(banda, qrp) {
  //The transmit slot is first calculated as (channel % 5).
  //Then the start time in minutes past the hour, repeated every 10 minutes, is given by: 2 * ((txSlot + 2 * txBand) % 5);
  //txBand is: 0: 2200m, 1: 630m, 2: 160m, 3: 80m, 4: 60m, 5: 40m, 6: 30m, 7: 20m, 8: 17m, 9: 15m, 10: 12m, 11: 10m. 12: 6m, 13: 4m, 14: 2m
  br = banda.replace(/on /, "");
  if (br == "2200m") {
    w = 0;
  }
  if (br == "630m") {
    w = 1;
  }
  if (br == "160m") {
    w = 2;
  }
  if (br == "80m") {
    w = 3;
  }
  if (br == "60m") {
    w = 4;
  }
  if (br == "40m") {
    w = 5;
  }
  if (br == "30m") {
    w = 6;
  }
  if (br == "20m") {
    w = 7;
  }
  if (br == "17m") {
    w = 8;
  }
  if (br == "15m") {
    w = 9;
  }
  if (br == "12m") {
    w = 10;
  }
  if (br == "10m") {
    w = 11;
  }
  if (br == "6m") {
    w = 12;
  }
  if (br == "4m") {
    w = 13;
  }
  if (br == "2m") {
    w = 14;
  }
  if (br == "All") {
    w = 7;
  }
  if (br == "All") {
    w = 7;
  }
  qrpv = qrp * 1;
  if (qrpv > 199 && qrpv < 400);
  {
    first = "1";
  }
  if (qrpv > 399 && qrpv < 600) {
    first = "Q";
  }
  if (qrpv < 200) {
    first = "0";
  }
  third = Math.floor((qrpv % 200) / 20);
  chan = first.toString() + third.toString();
  txSlot = Math.floor(qrpv % 5);
  startime = 2 * ((txSlot + 2 * w) % 5);
  startime = startime + 2;
  if (startime == 10) {
    startime = 0;
  }
  return { balloonid: chan, timeslot: startime };
}
function getqrp(qrp) {
  fcc = 14097000;
  if (typeof qrp != "undefined") {
    qrporig = qrp;
    if (qrp.length < 4) {
      if (formu.banda.value == "160m") {
        fcc = 1838000;
      }
      if (formu.banda.value == "80m") {
        fcc = 3569000;
      }
      if (formu.banda.value == "40m") {
        fcc = 7040000;
      }
      if (formu.banda.value == "30m") {
        fcc = 10140100;
      }
      if (formu.banda.value == "17m") {
        fcc = 18106000;
      }
      if (formu.banda.value == "15m") {
        fcc = 21096000;
      }
      if (formu.banda.value == "12m") {
        fcc = 24926000;
      }
      if (formu.banda.value == "10m") {
        fcc = 28126000;
      }
      if (formu.banda.value == "6m") {
        fcc = 50294000;
      }
      if (formu.banda.value == "2m") {
        fcc = 144490400;
      }
    }
  }
  var qrp;
  var fd;
  function getchannel(id, ts, fr) {
    for (chanx = 0; chanx < 600; chanx++) {
      chanx = (chanx + " ").replace(/ /, "");
      balloonid = getslot(formu.banda.value, chanx).balloonid;
      timeslot = getslot(formu.banda.value, chanx).timeslot;
      getchan(chanx);
      if (id == balloonid && ts == timeslot && fd == fr) {
        alert(
          "For Id = " +
            id +
            ", Timeslot = " +
            ts +
            " and DeltaFrec = " +
            fr +
            ", U4B Channel = " +
            chanx +
            " " +
            formu.banda.value,
        );
        break;
      }
    }
  }
  function getchan(qrp) {
    if (qrp > -1 && qrp < 600) {
    } else {
      alert(qrporig + " is not a Number from 0 to 599... Reenter...");
      return;
    }
    if (qrp < 200) {
      c1 = "0";
    }
    if (qrp > 199 && qrp < 400) {
      c1 = "1";
    }
    if (qrp > 399) {
      c1 = "Q";
    }
    resto = qrp.slice(-2) * 1;
    c2 = Math.floor(resto / 20)
      .toFixed(0)
      .slice(-1);
    if (qrp < 200 && qrp > 99) {
      c2 = c2 * 1 + 5;
    }
    if (qrp > 199 && qrp < 400 && qrp > 299) {
      c2 = c2 * 1 + 5;
    }
    if (qrp > 400 && qrp > 499) {
      c2 = c2 * 1 + 5;
    }
    r1 = qrp.slice(-1) * 1;
    if (r1 == 1 || r1 == 6) {
      c3 = "2";
    }
    if (r1 == 0 || r1 == 5) {
      c3 = "0";
    }
    if (r1 == 4 || r1 == 9) {
      c3 = "8";
    }
    if (r1 == 3 || r1 == 8) {
      c3 = "6";
    }
    if (r1 == 2 || r1 == 7) {
      c3 = "4";
    }
    if (formu.banda.value == "10m") {
      c3 = c3 - 4;
      if (c3 < 0) {
        c3 = c3 + 10;
      }
    }
    if (formu.banda.value == "12m") {
      c3 = c3 - 8;
      if (c3 < 0) {
        c3 = c3 + 10;
      }
    }
    if (formu.banda.value == "15m") {
      c3 = c3 - 2;
      if (c3 < 0) {
        c3 = c3 + 10;
      }
    }
    if (formu.banda.value == "17m") {
      c3 = c3 - 6;
      if (c3 < 0) {
        c3 = c3 + 10;
      }
    }
    if (formu.banda.value == "30m") {
      c3 = c3 - 4;
      if (c3 < 0) {
        c3 = c3 + 10;
      }
    }
    if (formu.banda.value == "40m") {
      c3 = c3 - 8;
      if (c3 < 0) {
        c3 = c3 + 10;
      }
    }
    if (formu.banda.value == "80m") {
      c3 = c3 - 2;
      if (c3 < 0) {
        c3 = c3 + 10;
      }
    }
    modulo = Math.floor((qrp % 20) / 5);
    if (modulo == 0) {
      fd = 20;
    }
    if (modulo == 1) {
      fd = 60;
    }
    if (modulo == 2) {
      fd = 140;
    }
    if (modulo == 3) {
      fd = 180;
    }
  }
  if (typeof qrp != "undefined") {
    if (qrp.indexOf(",") != -1) {
      qrpm = qrp.split(/,/);
    } else {
      qrpm = " ";
    }
    if (qrpm.length == 1) {
      if (isNaN(qrp)) {
        alert(qrporig + " is not a Number from 0 to 599... Reenter...");
        return;
      }
      if (qrp > -1 && qrp < 600) {
      } else {
        alert(qrp + " is not a Number from 0 to 599... Reenter...");
        return;
      }
      getchan(qrp);
      loque = window.confirm(
        "U4B Channel:" +
          qrporig +
          "  Id:" +
          c1 +
          c2 +
          " , Timeslot:" +
          c3 +
          ", Central Frec:" +
          (fcc * 1 + fd * 1) +
          " Hz +/-20Hz\n\n  Do you want to set or change and use these values on current run ?",
      );
      if (loque) {
        formu.balloonid.value = c1 + c2;
        formu.timeslot.value = c3;
        document.getElementById("qrpchn").innerHTML = qrporig + "?";
        qrpchange = true;
        setid();
      } else {
        alert("       VALUES NOT CHANGED !");
      }
    } else {
      if (qrpm.length == 3) {
        ch = qrpm[0].toUpperCase();
        ts = qrpm[1];
        fr = qrpm[2];
        sd = ch.substring(1, 2);
        if (
          ch.substring(0, 1) == "0" ||
          ch.substring(0, 1) == "1" ||
          (ch.substring(0, 1) == "Q" &&
            sd <= "9" &&
            (ts == "0" || ts == "2" || ts == "4" || ts == "6" || ts == "8") &&
            (fr == "20" || fr == "60" || fr == "140" || fr == "180"))
        ) {
          getchannel(ch, ts, fr);
        } else {
          alert(
            "Channel " +
              qrpm[0] +
              " or tslot " +
              ts +
              " or deltafrec " +
              fr +
              " invalid.. reenter..",
          );
        }
      }
    }
  } else {
    if (gqs("banda")) {
      bandacalc = gqs("banda");
    } else {
      bandacalc = "20m";
    }
    canal = prompt(
      " ~ Following " +
        bandacalc +
        " calculations valid for QRPLABs and Traquito only ~\n\nChan-ID: 1st+3rd character of 2nd transmission 00~09, 10~19, Q0~Q9\n      Timeslot (one digit) is even start minute of second transmission\n\n  Enter Channel (000-599) gives Channel-ID, Timeslot and frequency" +
        "\n    Or enter ID, Timeslot, DeltaFrec 20,60,140,180 to get Channel-Id\n\n",
    );
    if (canal != null) {
      getqrp(canal);
    } else {
    }
  }
}
var popupwin;
function showtelen() {
  posleft = screen.availWidth / 2 - 203;
  postop = screen.availHeight / 2 - 180;
  if (popupwin != null) {
    popupwin.close();
  }
  codata =
    '<\/head><body bgcolor="#172447" color="#ffffff" style="font-size:12px;font-family:Tahoma,Arial;font-weight:bold;color:#ffffff;"  onclick="self.close();")>';
  if (gqs("SSID") != "") {
    mas = "-" + gqs("SSID");
  }
  codata =
    codata +
    "<center><span style='font-size:16px;line-height:18px;'>" +
    gqs("other").toUpperCase() +
    mas +
    " comment and TELENs Coding<\/span><br><br><\/center>";
  codata = codata + decodeURIComponent(window.comentfull);
  codata = codata + "</br>";
  codata = codata + "<\/body><\/html>";
  var anchopantalla = 588;
  var altopantalla = 230;
  preferences =
    "toolbar=no,width=" +
    anchopantalla +
    "px,height=" +
    altopantalla +
    "px,center,margintop=0,top=" +
    postop +
    ",left=" +
    posleft +
    ",status=no,scrollbars=no,resizable=no,dependent=yes,z-lock=yes";
  if (popupwin != null) {
    popupwin.close();
  }
  popupwin = window.open("", "win1", preferences);
  popupwin.document.write(codata);
  popupwin.setTimeout("self.close()", 120000);
}
function setlaunch() {
  launchdatetime = gqs("launch");
  newdatetime = prompt(
    " Enter/change Launch Date/Time, actual: YYYYMMDDHHMMSS (z)",
    launchdatetime,
  );
  if (newdatetime == "") {
    alert("Launch Date/Time missing");
    setlaunch();
  }
  if (newdatetime.length != 14 || isNaN(newdatetime)) {
    alert("Launch Date/Time invalid");
    setlaunch();
  }
  if (
    newdatetime.substring(0, 4) < "2010" ||
    newdatetime.substring(0, 4) > "2100"
  ) {
    alert("Launch Year invalid");
    setlaunch();
  }
  if (
    newdatetime.substring(4, 6) < "01" ||
    newdatetime.substring(4, 6) > "12"
  ) {
    alert("Launch Month invalid");
    setlaunch();
  }
  if (
    newdatetime.substring(6, 8) < "01" ||
    newdatetime.substring(6, 8) > "31"
  ) {
    alert("Launch Day invalid");
    setlaunch();
  }
  if (
    newdatetime.substring(8, 10) < "00" ||
    newdatetime.substring(8, 10) > "24"
  ) {
    alert("Launch Hour invalid");
    setlaunch();
  }
  if (
    newdatetime.substring(10, 12) < "00" ||
    newdatetime.substring(10, 12) > "59"
  ) {
    alert("Launch Minute invalid");
    setlaunch();
  }
  if (
    newdatetime.substring(12, 14) < "00" ||
    newdatetime.substring(12, 14) > "59"
  ) {
    alert("Launch Second invalid");
    setlaunch();
  }
  querystring = "http://" + window.location.hostname + window.location.pathname;
  if (gqs("banda")) {
    querystring = querystring + "?banda=" + gqs("banda");
  } else {
    querystring = querystring + "?banda=20m";
  }
  if (gqs("other")) {
    querystring = querystring + "&other=" + gqs("other");
  } else {
    querystring = querystring + "&other=";
  }
  if (gqs("balloonid")) {
    querystring = querystring + "&balloonid=" + gqs("balloonid");
  } else {
    querystring = querystring + "&balloonid=";
  }
  if (gqs("timeslot")) {
    querystring = querystring + "&timeslot=" + gqs("timeslot");
  } else {
    querystring = querystring + "&timeslot" + "";
  }
  if (gqs("repito") == "on") {
    querystring = querystring + "&repito=on";
  }
  if (gqs("wide") == "on") {
    querystring = querystring + "&wide=on";
  }
  if (gqs("qp") == "on") {
    querystring = querystring + "&qp=on";
  }
  if (gqs("detail") == "on") {
    querystring = querystring + "&detail=on";
  }
  if (gqs("qrpid")) {
    querystring = querystring + "&qrpid=" + gqs("qrpid");
  }
  if (gqs("SSID")) {
    querystring = querystring + "&SSID=" + gqs("SSID");
  } else {
    querystring = querystring + "&SSID=";
  }
  querystring = querystring + "&launch=" + newdatetime;
  if (gqs("tracker")) {
    querystring = querystring + "&tracker=" + gqs("tracker");
  } else {
    querystring = querystring + "&tracker=";
  }

  // FIXME: this doesn't work
  //document.location.url = querystring; document.location.href = querystring;
}
function settracker() {
  if (gqs("tracker")) {
    oldtracker = gqs("tracker");
  } else {
    oldtracker = "";
  }
  if (gqs("tracker")) {
    seltracker = "Selected Tracker: " + gqs("tracker") + "\n";
  } else {
    seltracker = "";
  }
  newtracker = prompt(
    seltracker +
      "Trackers: wb8elk, qrplabs, traquito, lightaprs, zachtek1, yo3ict, orion, dl6ow, ab5ss, oshpark, bss99, 6locators\nEnter/change Tracker ",
    oldtracker,
  );
  if (!newtracker) {
    return;
  }
  if (!newtracker && gqs("tracker")) {
    newtracker = gqs("tracker");
  }
  if (newtracker == "lightaprs") {
    newtracker = "qrplabs";
  }
  querystring = "http://" + window.location.hostname + window.location.pathname;
  if (gqs("banda")) {
    querystring = querystring + "?banda=" + gqs("banda");
  } else {
    querystring = querystring + "?banda=20m";
  }
  if (gqs("other")) {
    querystring = querystring + "&other=" + gqs("other");
  } else {
    querystring = querystring + "&other=" + "";
  }
  if (gqs("balloonid")) {
    querystring = querystring + "&balloonid=" + gqs("balloonid");
  } else {
    querystring = querystring + "&balloonid=";
  }
  if (gqs("timeslot")) {
    querystring = querystring + "&timeslot=" + gqs("timeslot");
  } else {
    querystring = querystring + "&timeslot=" + "";
  }
  if (newtracker.toLowerCase() == "zachtek") {
    newtracker = "zachtek1";
  }
  if (gqs("repito") == "on") {
    querystring = querystring + "&repito=on";
  }
  if (gqs("wide") == "on") {
    querystring = querystring + "&wide=on";
  }
  if (gqs("qp") == "on") {
    querystring = querystring + "&qp=on";
  }
  if (gqs("detail") == "on") {
    querystring = querystring + "&detail=on";
  }
  if (gqs("SSID")) {
    querystring = querystring + "&SSID=" + gqs("SSID");
  } else {
    querystring = querystring + "&SSID=";
  }
  if (gqs("launch")) {
    querystring = querystring + "&launch=" + gqs("launch");
  } else {
    querystring = querystring + "&launch=";
  }
  querystring = querystring + "&tracker=" + newtracker;

  // FIXME: this doesn't work
  //document.location.url = querystring; document.location.href = querystring;
}
ssidchange = false;
var newssid;
function setssid() {
  savessid = formu.SSID.value;
  newssid = prompt(
    "Actual SSID is " +
      formu.SSID.value +
      " ~ Enter new SSID ~ Or Cancel to keep " +
      formu.SSID.value,
  );
  if (newssid == null) {
    return;
  }
  if (isNaN(newssid)) {
    alert("SSID should be from 1 to 999");
    return;
  } else {
    if (newssid * 1 < 0 || newssid > 999) {
      alert("SSID should be from 1 to 999");
      return;
    }
  }
  formu.SSID.value = newssid;
  ssidchange = true;
  if (newssid != null) {
    setid();
  } else {
    formu.SSID.value = savessid;
  }
}
function gqs(nombre) {
  //Retrieve Document location and tear off the QueryString values for processing.
  var url = window.parentLocation + "";
  q = url.split("?");
  if (q[1]) {
    //Get all Name/Value pairs from the QueryString
    var pairs = q[1].split("&");
    for (i = 0; i < pairs.length; i++) {
      //Get the Name from given Name/Value pair
      var keyval = pairs[i].split("=");
      if (keyval[0] == nombre) {
        //Get the Value from given Name/Value pair and set to the return ID
        var valor = keyval[1];
      }
    }
  }
  return valor;
}

Date.prototype.addHours = function (h) {
  this.setHours(this.getHours() + h);
  return this;
};
function logactivity(urlused) {
  var losMeses = "EneFebMarAbrMayJunJulAgoSetOctNovDic";
  husohoras = new Date().getTimezoneOffset() / 60;
  var ahora = new Date().addHours(husohoras);
  var ahora = ahora.addHours(-3);
  DiayMes =
    losMeses.substring(ahora.getMonth() * 3, ahora.getMonth() * 3 + 3) +
    "-" +
    ("0" + ahora.getDate()).slice(-2) +
    " ";
  if (ahora.getHours() < 10) {
    hora = "0" + ahora.getHours();
  } else {
    hora = ahora.getHours();
  }
  if (ahora.getMinutes() < 10) {
    min = "0" + ahora.getMinutes();
  } else {
    min = ahora.getMinutes();
  }
  horainicio = DiayMes + hora + ":" + min;
  huso = (husohoras * -1).toString();
  if (huso.substring(0, 1) != "-") {
    huso = "%2B" + huso;
  }
  var xhr = new XMLHttpRequest();
  var urlpost =
    "http://lu7aa.org/satlog.asp?datos=" +
    encodeURIComponent(urlused) +
    "&hi=" +
    encodeURIComponent(horainicio) +
    "&TZ=" +
    "TZ:" +
    huso;
  var params =
    "datos=" +
    encodeURIComponent(urlused) +
    "&hi=" +
    encodeURIComponent(horainicio) +
    "&TZ=" +
    "TZ:" +
    huso;
  //xhr.open("GET", urlpost, true);
  //xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  //xhr.setRequestHeader("Content-length", params.length);
  //xhr.send(params);
}
function ponersun(fecha, locator) {
  if (locator.length > 3) {
    Sunelevation =
      (
        SunCalc.getPosition(
          new Date(fecha + "Z"),
          loc2latlon(locator).loclat,
          loc2latlon(locator).loclon,
        ).altitude * radian
      ).toFixed(1) + "&nbsp;";
  } else {
    Sunelevation = "&nbsp;";
  }
  document.write(Sunelevation);
}
function yellowlines() {
  if (document.getElementById("yellow").style.color == "yellow") {
    document.getElementById("yellow").style.color = "#777777";
  } else {
    document.getElementById("yellow").style.color = "yellow";
  }
}
function LatLng2Loc(y, x, num) {
  if (x < -180) {
    x = x + 360;
  }
  if (x > 180) {
    x = x - 360;
  }
  var yqth, yi, yk, ydiv, yres, ylp, y;
  var ycalc = new Array(0, 0, 0);
  var yn = new Array(0, 0, 0, 0, 0, 0, 0);

  var ydiv_arr = new Array(10, 1, 1 / 24, 1 / 240, 1 / 240 / 24);
  ycalc[0] = (x + 180) / 2;
  ycalc[1] = y + 90;

  for (yi = 0; yi < 2; yi++) {
    for (yk = 0; yk < 5; yk++) {
      ydiv = ydiv_arr[yk];
      yres = ycalc[yi] / ydiv;
      ycalc[yi] = yres;
      if (ycalc[yi] > 0) ylp = Math.floor(yres);
      else ylp = Math.ceil(yres);
      ycalc[yi] = (ycalc[yi] - ylp) * ydiv;
      yn[2 * yk + yi] = ylp;
    }
  }

  var qthloc = "";
  if (num >= 2)
    qthloc +=
      String.fromCharCode(yn[0] + 0x41) + String.fromCharCode(yn[1] + 0x41);
  if (num >= 4)
    qthloc +=
      String.fromCharCode(yn[2] + 0x30) + String.fromCharCode(yn[3] + 0x30);
  if (num >= 6)
    qthloc +=
      String.fromCharCode(yn[4] + 0x41) + String.fromCharCode(yn[5] + 0x41);
  if (num >= 8)
    qthloc +=
      String.fromCharCode(yn[6] + 0x30) + String.fromCharCode(yn[7] + 0x30);
  if (num >= 10)
    qthloc +=
      String.fromCharCode(yn[8] + 0x61) + String.fromCharCode(yn[9] + 0x61);
  return qthloc;
}

//alert(LatLng2Loc(-34.567093, -58.500768, 8))

var lica;
var map;
var distanciatotal = 0;
var rumboest = 100;
var velest = 101.5;
var sunlon;
var sunlat;
var savelato;
var savelono;
var sunarray = Create2DArray(371, 2);
var balloonarray = Create2DArray(371, 2);
var balloonCoords = new Array();
var radian = 57.29577951308;

var launchdate;
if (getParamSafe("launch").length > 0) {
  const launchd = getParamSafe("launch");
  launchdate = `${launchd.substring(0, 4)}-${launchd.substring(4, 6)}-${launchd.substring(6, 8)} ${launchd.substring(8, 10)}:${launchd.substring(10, 12)}:${launchd.substring(12, 14)}`;
} else {
  const now = new Date();
  const fe = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
  const pad = (n) => String(n).padStart(2, "0");
  launchdate = `${fe.getFullYear()}-${pad(fe.getMonth() + 1)}-${pad(fe.getDate())} 00:00:00`;
}

//var SSID = "11";
var dt = new Date();
dt.setDate(dt.getDate() - 7); //setear fecha lanzamiento 7 dias antes de fecha actual
var lanzamiento = new Date(
  dt.getFullYear() +
    "-" +
    ("00" + (dt.getMonth() * 1 + 1)).slice(-2) +
    "-" +
    ("00" + dt.getDate()).slice(-2) +
    "T" +
    ("00" + dt.getHours()).slice(-2) +
    ":" +
    ("00" + dt.getMinutes()).slice(-2) +
    ":" +
    ("00" + dt.getSeconds()).slice(-2) +
    "Z",
); // Entrar fecha/hora en GMT pero sin la Z
if (gqs("launch")) {
  lanza = gqs("launch");
  laf =
    lanza.substring(0, 4) +
    "-" +
    lanza.substring(4, 6) +
    "-" +
    lanza.substring(6, 8) +
    "T" +
    lanza.substring(8, 10) +
    ":" +
    lanza.substring(10, 12) +
    ":" +
    lanza.substring(12, 14);
  lanzamiento = new Date(laf);
}
if (gqs("SSID")) {
  SSID = gqs("SSID");
}
var Jrise;
var monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Set",
  "Oct",
  "Nov",
  "Dec",
];
if (window.addEventListener) {
  if (document.getElementById("legend")) {
    window.addEventListener("beforeunload", function (event) {
      document.getElementById("legend").innerHTML =
        "<span style='color:yellow;font-size:16px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;...UPDATING...  PLEASE WAIT...</span>";
      document.getElementById("wdown").style.visibility = "visible";
      saveMapState();
    });
  }
} else {
  if (document.getElementById("legend")) {
    window.onbeforeunload = function () {
      document.getElementById("legend").innerHTML =
        "<span style='color:yellow;font-size:16px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;...UPDATING...  PLEASE WAIT...</span>";
      document.getElementById("wdown").style.visibility = "visible";
      saveMapState();
    };
  }
}
var popupwin;
function mostrar(licencia, loc) {
  licencia = licencia.replace(/-/, "").replace(/:/, "");
  preferences =
    "toolbar=no,width=480px,height=40px,center,margintop=0,top=100,left=120,status=no,scrollbars=no,resizable=no,dependent=yes,z-lock=yes";
  if (popupwin != null) {
    popupwin.close();
  }
  if (loc) {
    popupwin = window.open(
      "http://lu7aa.org.ar/hc2.asp?licencia=" + licencia + "&loc=" + loc,
      "win",
      preferences,
    );
  } else {
    popupwin = window.open(
      "http://lu7aa.org.ar/hc2.asp?licencia=" + licencia,
      "win",
      preferences,
    );
  }
  popupwin.setTimeout("self.close()", 120000);
}
// you could use the event listener to load the state at a certain point
// functions below
function saveMapState() {
  if (map) {
    var mapZoom = map.getZoom();
    var mapCentre = map.getCenter();
    var mapLat = mapCentre.lat();
    var mapLng = mapCentre.lng();
    var cookiestring = mapLat + "_" + mapLng + "_" + mapZoom;
    setCookie("myMapCookie", cookiestring, 30);
  }
}
//
getsunpos();
//
function latlon2loc(lat, lon) {
  base = "ABCDEFGHIJKLMNOPQRSTUVWX";
  c1 = base.charAt(Math.floor(lat / 10) + 9);
  lat -= Math.floor(lat / 10) * 10;
  c3 = Math.floor(lat);
  lat -= Math.floor(lat);
  c5 = base.charAt(Math.floor(lat * 24));
  c0 = base.charAt(Math.floor(lon / 20) + 9);
  lon -= Math.floor(lon / 20) * 20;
  c2 = Math.floor(lon / 2);
  lon -= Math.floor(lon / 2) * 2;
  c4 = base.charAt(Math.floor(lon * 12));
  locresult = c0 + c1 + c2 + c3 + c4 + c5;
  return locresult;
}
//
function Create2DArray(rows, columns) {
  var x = new Array(rows);
  for (var i = 0; i < rows; i++) {
    x[i] = new Array(columns);
  }
  return x;
}
//
function getsunpos() {
  date = new Date();
  var rad = 0.017453292519943295;
  // based on NOAA solar calculations
  var mins_past_midnight =
    (date.getUTCHours() * 60 + date.getUTCMinutes()) / 1440;
  var jc = (date.getTime() / 86400000.0 + 2440587.5 - 2451545) / 36525;
  var mean_long_sun = (280.46646 + jc * (36000.76983 + jc * 0.0003032)) % 360;
  var mean_anom_sun = 357.52911 + jc * (35999.05029 - 0.0001537 * jc);
  var sun_eq =
    Math.sin(rad * mean_anom_sun) *
      (1.914602 - jc * (0.004817 + 0.000014 * jc)) +
    Math.sin(rad * 2 * mean_anom_sun) * (0.019993 - 0.000101 * jc) +
    Math.sin(rad * 3 * mean_anom_sun) * 0.000289;
  var sun_true_long = mean_long_sun + sun_eq;
  var sun_app_long =
    sun_true_long - 0.00569 - 0.00478 * Math.sin(rad * 125.04 - 1934.136 * jc);
  var mean_obliq_ecliptic =
    23 +
    (26 + (21.448 - jc * (46.815 + jc * (0.00059 - jc * 0.001813))) / 60) / 60;
  var obliq_corr =
    mean_obliq_ecliptic + 0.00256 * Math.cos(rad * 125.04 - 1934.136 * jc);
  var lat =
    Math.asin(Math.sin(rad * obliq_corr) * Math.sin(rad * sun_app_long)) / rad;
  var eccent = 0.016708634 - jc * (0.000042037 + 0.0000001267 * jc);
  var y = Math.tan(rad * (obliq_corr / 2)) * Math.tan(rad * (obliq_corr / 2));
  var rq_of_time =
    4 *
    ((y * Math.sin(2 * rad * mean_long_sun) -
      2 * eccent * Math.sin(rad * mean_anom_sun) +
      4 *
        eccent *
        y *
        Math.sin(rad * mean_anom_sun) *
        Math.cos(2 * rad * mean_long_sun) -
      0.5 * y * y * Math.sin(4 * rad * mean_long_sun) -
      1.25 * eccent * eccent * Math.sin(2 * rad * mean_anom_sun)) /
      rad);
  var true_solar_time = (mins_past_midnight * 1440 + rq_of_time) % 1440;
  var lng = -(true_solar_time / 4 < 0
    ? true_solar_time / 4 + 180
    : true_solar_time / 4 - 180);
  sunlon = lng;
  sunlat = lat;
}

function deg2dms(dd, isLng) {
  var dir = dd < 0 ? (isLng ? " W" : " S") : isLng ? " E" : " N";

  var absDd = Math.abs(dd);
  var deg = absDd | 0;
  var frac = absDd - deg;
  var min = (frac * 60) | 0;
  var sec = frac * 3600 - min * 60;
  // Round it to 2 decimal points.
  sec = Math.round(sec);
  return deg + "°" + min + "'" + sec + '"' + dir;
}

// calculates sun times for a given date and latitude/longitude
function convertToHHMM(info) {
  var hrs = parseInt(info);
  var min = Math.round((info - hrs) * 60);
  if (hrs > 23) {
    hrs = hrs - 24;
  }
  return ("0" + hrs).slice(-2) + ":" + ("0" + min).slice(-2);
}
function redate(valor) {
  final = valor.replace(/z/, "").replace(/gps/, "").replace(/-/g, "/") + ":00";
  final =
    final.substring(5, 10) +
    "/" +
    final.substring(0, 4) +
    final.substring(10, 19);
  return final;
}
//
function loadMapState() {
  var gotCookieString = getCookie("myMapCookie");
  console.log("gotCookieString:", gotCookieString);
  var splitStr = gotCookieString.split("_");
  var savedMapLat = parseFloat(splitStr[0]);
  var savedMapLng = parseFloat(splitStr[1]);
  var savedMapZoom = parseFloat(splitStr[2]);
}
//
//radianfactor = 57.29577951308; earthradius = 6378137; coverageradiusKm = Math.sqrt(Math.pow(13080 + earthradius, 2) - Math.pow(earthradius, 2)) / 1000; deltasunelev = Math.asin(coverageradiusKm / 6378.137) * radianfactor;
function getCookie(c_name) {
  var i,
    x,
    y,
    ARRcookies = document.cookie.split(";");
  for (i = 0; i < ARRcookies.length; i++) {
    x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
    y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
    x = x.replace(/^\s+|\s+$/g, "");
    if (x == c_name) {
      return unescape(y);
    }
  }
  return "";
}
var gotCookieString = getCookie("myMapCookie");
var splitStr = gotCookieString.split("_");
var savedMapLat = parseFloat(splitStr[0]);
var savedMapLng = parseFloat(splitStr[1]);
var savedMapZoom = parseFloat(splitStr[2]);
//
function degconvert(coordinate) {
  var absolute = Math.abs(coordinate);
  var degrees = Math.floor(absolute);
  var minutesNotTruncated = (absolute - degrees) * 60;
  var minutes = Math.floor(minutesNotTruncated);
  var seconds = Math.floor((minutesNotTruncated - minutes) * 60);
  var longitudeCardinal = coordinate >= 0 ? "" : "-";
  return longitudeCardinal + degrees + "&deg;" + minutes + "'" + seconds + "''";
}
var popup;
function showprop() {
  preferences =
    "toolbar=no,width=640px,height=479px,center,margintop=0,top=100,left=100,status=no,scrollbars=no,resizable=no,dependent=yes,z-lock=yes";
  if (popup != null) {
    popup.close();
  }
  popupwi = window.open(
    "https://www.sws.bom.gov.au/Images/HF%20Systems/Global%20HF/Ionospheric%20Map/West/fof2_maps.png",
    "win1",
    preferences,
  );
  popupwi.setTimeout("self.close()", 120000);
}

function ponermapa(locator, licencia) {
  //        if (locator.length < 3) { document.location.reload(); }
  callcheck = locations[0][1].substring(0, 4).toUpperCase();
  if (callcheck != gqs("other").substring(0, 4).toUpperCase()) {
    alert("Invalid call sign");
    throw new Error("Invalid call sign");
    //   document.location.reload();
  }
  lon = loc2latlon(locator).loclon;
  lat = loc2latlon(locator).loclat;
  savelono = savedMapLng;
  savelato = savedMapLat;
  document.getElementById("map_canvas").style.height = window.iframeHeight;
  document.getElementById("map_canvas").style.width = window.iframeWidth;

  document.getElementById("map_canvas").style.align = "center";

  var myLatlng = new google.maps.LatLng(lat, lon);
  var myOptions = {
    zoom: 4,
    backgroundColor: "#213468",
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
    },
    center: myLatlng,
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
    exitControl: true,
    zoomControl: true,
    rotateControl: true,
    fullscreenControl: true,
    mapTypeId: google.maps.MapTypeId.HYBRID,
  };
  var icono = imageSrcUrl["balloon"];
  licenciam = licencia.split("<br>", 2);
  lica = licenciam[0];
  //if (lica == "LU7AA" || lica == "LU1ESY" || lica == "LU1ES" || lica == "VE3KCL" || lica == "VE3OCL" || lica == "WB8ELK" || lica == "LU4KC" || lica == "DL6OW" || lica == "SA6BSS" || lica == "VK3YT" || lica == "KO4BVG" || lica == "W5KUB" || lica == "PU2JNP" || lica == "N6CVO" || lica == "LU7ABF" || lica == "KO6FE" || lica == "WB6TOU" || lica == "VK3ZWI" || lica == "AB5SS" || lica == "K9YO" || lica == "IZ7VHF" || lica == "WB8MSJ" || lica == "LY1BWB" || lica == "PC4L" || lica == "N0PPP" || lica == "K6STS" || lica == "NC4ES" || lica == "YO3ICT" || lica == "W6SF" || lica == "K9WIS" || lica == "UB4FDH" || lica == "K9APX") { icono = "balloon.png"; }
  for (z = 0; z < bcid.length + 1; z++) {
    if (bcid[z] == lica) {
      icono = imageSrcUrl["balloon"];
    }
  }
  if (lica == "N3AYW") {
    icono = imageSrcUrl["autod"];
  }
  if (beacon1.length > 0) {
    beacolocator = beacon1[0][1];
    var equal = true;
  }
  for (r = 0; r < beacon1.length; r++) {
    if (beacon1[r][1] != beacolocator) {
      var equal = false;
    }
  }
  {
    if (equal == false) {
      //               document.getElementById("aprsfi").innerHTML = "<a id='repetir' name='repetir' href='http://amsat.org.ar/elnet.php?datos=" + aprs4 + "' target='_blank'>&nbsp;&nbsp;CLICK HERE TO UPLOAD " + gqs('other').toUpperCase().replace(/#/g, "") + "-11 ACTUAL POSITION TO APRS.FI & HABHUB&nbsp;&nbsp;<\/a><span style='text-shadow:0 0;color:#000000;font-size:11px;line-height:9px;font-family:Tahoma,Arial;'>&nbsp;&nbsp;&nbsp;REPEAT APRS & HABHUB UPLOADS <input onclick=\"document.getElementById('enviar').click();\" type=checkbox name='repito' id='repito' style='margin:0 0 0 0;'> ON AUTO-REFRESH<\/span>";
    } else {
      icono = imageSrcUrl["green_arrow"];
    }
  }
  if (lica.slice(-2) == "/B" && lica.substring(0, 2) == "LU") {
    icono = imageSrcUrl["buoy"];
  }
  if (lica == "KQ6RS") {
    icono = imageSrcUrl["buoy2"];
  }
  var map = new google.maps.Map(
    document.getElementById("map_canvas"),
    myOptions,
  );
  if (!isNaN(savelato) && !isNaN(savelono) && !isNaN(savedMapZoom)) {
    map.setCenter({ lat: savelato, lng: savelono });
    map.setZoom(savedMapZoom);
  }
  savelat = parseFloat(lat).toFixed(4);
  savelon = parseFloat(lon).toFixed(4);

  function saveMapState() {
    var mapZoom = map.getZoom();
    var mapCentre = map.getCenter();
    var mapLat = mapCentre.lat();
    var mapLng = mapCentre.lng();
    var cookiestring = mapLat + "_" + mapLng + "_" + mapZoom;
    setCookie("myMapCookie", cookiestring, 30);
  }

  function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value =
      escape(value) +
      (exdays == null ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
  }
  // as a suggestion you could use the event listener to save the state when zoom changes or drag ends
  google.maps.event.addListener(map, "tilesloaded", tilesLoaded);
  function tilesLoaded() {
    google.maps.event.clearListeners(map, "tilesloaded");
    google.maps.event.addListener(map, "zoom_changed", saveMapState);
    google.maps.event.addListener(map, "dragend", saveMapState);
  }
  //
  var infowindow = new google.maps.InfoWindow({ maxWidth: 130 });
  marker1 = new google.maps.Marker({
    position: new google.maps.LatLng(lat, lon),
    icon: icono,
    title: "Emisor WSPR",
    optimized: false,
    map: map,
  });
  infowindow.setContent(
    '<div style="color: #3333ff;line-height:9px;font-size:11px;overflow:hidden;font-weight:bold;white-space:nowrap;"><center>' +
      licencia +
      "</center></div>",
  );
  infowindow.open(map, marker1);
  //var hide = false;
  if (gqs("hide") || hide) {
    hide = true;
  } else {
    hide = false;
  }
  var marker, i;
  showcapture = true;
  for (i = 0; i < locations.length; i++) {
    if (
      (loc2latlon(locations[i][0]).loclat != "" &&
        loc2latlon(locations[i][0]).loclon != "" &&
        locations[i][0].length != 4) ||
      showcapture
    ) {
      // cambiar aqui a < 3 si no hubo 2da telemetria para ver pointer amarillo descomentar
      if (i < 6 && locations.length > 5) {
        if (hide) {
          icono1 = imageSrcUrl["none"];
          window.parent.postMessage(
            {
              callbackName: "changesEstacionesHtml",
              props: { html: "" },
            },
            window.PARENT_URL,
          );
        } else {
          icono1 = imageSrcUrl["yellow-dot"];
          window.parent.postMessage(
            {
              callbackName: "changesEstacionesHtml",
              props: { html: saveestaciones },
            },
            window.PARENT_URL,
          );
        }
        ulti = " Last";
      } else {
        if (hide) {
          icono1 = imageSrcUrl["none"];
          window.parent.postMessage(
            {
              callbackName: "changesEstacionesHtml",
              props: { html: "" },
            },
            window.PARENT_URL,
          );
        } else {
          icono1 = imageSrcUrl["red-dot"];
          window.parent.postMessage(
            {
              callbackName: "changesEstacionesHtml",
              props: { html: saveestaciones },
            },
            window.PARENT_URL,
          );
        }
        ulti = "";
      }
      if (locator != locations[i][0]) {
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(
            loc2latlon(locations[i][0]).loclat,
            loc2latlon(locations[i][0]).loclon,
          ),
          icon: icono1,
          optimized: false,
          opacity: 0.8,
          //title: ulti + 'Receptor WSPR de ' + locations[i][1].slice(14, 20).replace(/</, ""),
          title:
            locations[i][1]
              .substring(0, 7)
              .replace(/</, "")
              .replace(/b/, "")
              .replace(/r/, "") +
            ulti +
            " Reporter",
          map: map,
        });
        google.maps.event.addListener(
          marker,
          "click",
          (function (marker, i) {
            return function () {
              infowindow.setContent(
                '<div style="color: #4444ff; line-height:11px;overflow:hidden;font-weight:bold;white-space:nowrap;"><center>' +
                  locations[i][1] +
                  "<\/center><\/div>",
              );
              infowindow.open(map, marker);
            };
          })(marker, i),
        );
      } else {
        if (locations[i][0] && locations[i][0].length > 3) {
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(
              loc2latlon(locations[i][0]).loclat,
              loc2latlon(locations[i][0]).loclon,
            ),
            icon: icono,
            zIndex: 9999999,
            optimized: false,
            title:
              locations[i][1]
                .substring(0, 9)
                .replace(/</, "")
                .replace(/b/, "")
                .replace(/r/, "")
                .replace(/>/, "") +
              " WSPR Emiter " +
              "\n Lat:" +
              loc2latlon(locations[i][0]).loclat.toFixed(2) +
              "  Lon:" +
              loc2latlon(locations[i][0]).loclon.toFixed(2) +
              window.comentariosballoon,
            map: map,
          });
          google.maps.event.addListener(
            marker,
            "click",
            (function (marker, i) {
              return function () {
                infowindow.setContent(
                  '<div style="color: #4444ff;line-height:9px;font-size:11px;overflow:hidden;font-weight:bold;white-space:nowrap;"><center>' +
                    locations[i][1] +
                    "<\/center><\/div>",
                );
                infowindow.open(map, marker);
              };
            })(marker, i),
          );
        }
      }
    }
  }
  // Poner flechas
  for (i = 0; i < flechas.length; i++) {
    locact = flechas[i];
    if (
      savelat == loctolatlon(locact).lat &&
      savelon == loctolatlon(locact).lon
    ) {
      //            alert("iguales: "+"i:" + i + "  Locator:" + flechas[i] + "  " + savelat + "=" + loctolatlon(locact).lat + " - " + savelon + "=" + loctolatlon(locact).lon );
    } else {
      //            alert("i:" + i + "  Locator:" + flechas[i] + "  " + savelat + "=" + loctolatlon(locact).lat + " - " + savelon + "=" + loctolatlon(locact).lon );
      if (hide) {
        opa = 0;
      } else {
        opa = 0.25;
      }
      if (flechas[i].length != 4 || showcapture) {
        var coordinates = new Array();
        coordinates[0] = new google.maps.LatLng(savelat, savelon);
        coordinates[1] = new google.maps.LatLng(
          loctolatlon(locact).lat,
          loctolatlon(locact).lon,
        );
        var flightPath = new google.maps.Polyline({
          path: coordinates,
          strokeColor: "#F4FA58",
          strokeOpacity: opa,
          zIndex: 66666,
          geodesic: true,
          icons: [
            {
              icon: {
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              },
              offset: "100%",
            },
          ],
          strokeWeight: 2,
        });
        flightPath.setMap(map);
      }
    }
  }
  var positionCoordinates = new Array();
  for (i = 0; i < beacon1.length - 1; i++) {
    if (new Date(redate(beacon1[i][0])) > lanzamiento) {
      // solo traza recorrido posterior a lanzamiento
      latip = loctolatlon(beacon1[i][1]).lat;
      lonip = loctolatlon(beacon1[i][1]).lon;
      if (isNaN(latip) || isNaN(lonip)) {
      } else {
        positionCoordinates.push(new google.maps.LatLng(latip, lonip));
      }
    }
  }
  var positionPath = new google.maps.Polyline({
    path: positionCoordinates,
    strokeColor: "#FF6000",
    zIndex: 8888888,
    strokeOpacity: 1.0,
    geodesic: false,
    strokeWeight: 3,
  });
  positionPath.setMap(map);
  if (!hidet) {
  } else {
    positionPath.strokeWeight = 0;
  }
  //
  // posicion del sol
  var iconImage = {
    url: imageSrcUrl["sun"],
    // This marker is 20 pixels wide by 32 pixels high.
    size: new google.maps.Size(40, 40),
    // The origin for this image is (0, 0).
    origin: new google.maps.Point(0, 0),
    // The anchor for this image is the base of the flagpole at (0, 32).
    anchor: new google.maps.Point(20, 20),
  };
  markerSol = new google.maps.Marker({
    position: new google.maps.LatLng(sunlat, sunlon),
    icon: iconImage,
    zIndex: 88,
    optimized: false,
    title: "Sun Lat:" + sunlat.toFixed(1) + ", Lon:" + sunlon.toFixed(1),
    map: map,
  });
  //      Armar rectangulo de la grilla
  grid = beacon1[0][1].substring(0, 4); //grid = flechas[1].substring(0, 4);
  g1 = grid + "AA";
  g2 = grid + "AW";
  g3 = grid + "WA";
  g4 = grid + "WW";
  lat1 = loc2latlon(g1).loclat;
  lon1 = loc2latlon(g1).loclon;
  lat2 = loc2latlon(g2).loclat;
  lon2 = loc2latlon(g2).loclon;
  lat3 = loc2latlon(g3).loclat;
  lon3 = loc2latlon(g3).loclon;
  lat4 = loc2latlon(g4).loclat;
  lon4 = loc2latlon(g4).loclon;
  latdf = (lat2 + 0.04 - (lat1 - 0.04)) / 5;
  londf = (lon3 + 0.08 - (lon1 - 0.08)) / 5;
  var flightPlanCoordinates = [
    { lat: lat1 - 0.04, lng: lon1 - 0.08 },
    { lat: lat1 - 0.04, lng: lon3 + 0.08 },
    { lat: lat2 + 0.04, lng: lon3 + 0.08 },
    { lat: lat2 + 0.04, lng: lon1 - 0.08 },
    { lat: lat1 - 0.04, lng: lon1 - 0.08 },
  ];
  var gridlocator = new google.maps.Polyline({
    path: flightPlanCoordinates,
    geodesic: true,
    strokeColor: "#F0F0F0",
    strokeOpacity: 0.7,
    strokeWeight: 3,
  });
  var infopos;
  function cerrarpos() {
    infopos.close();
  }
  google.maps.event.addListener(map, "click", function (event) {
    if (typeof infopos == "object") {
      infopos.close();
    }
    var lat = event.latLng.lat();
    var lng = event.latLng.lng();
    //      For old elevation
    //ponersun('"&tele1(i,1)&"', '"&tele1(i,6)&"')
    oldlon = lng;
    oldlat = lat;
    SunElevationold1 =
      SunCalc.getPosition(new Date(), oldlat, oldlon).altitude * radian;
    SunElevationpreviousold1 =
      SunCalc.getPosition(new Date() - 0.1, oldlat, oldlon).altitude * radian;
    if (SunElevationold1 > SunElevationpreviousold1) {
      flechita = String.fromCharCode(9650);
    } else {
      flechita = String.fromCharCode(9660);
    }
    var Sunelold1 =
      latlon2loc(lat, lng).substring(0, 4) +
      latlon2loc(lat, lng).substring(4, 6).toLowerCase() +
      "<br>Sun: ";
    if (SunElevationold1 > 0) {
      Sunelold1 =
        Sunelold1 +
        "<span style='color:#267326;'>" +
        (SunElevationold1 - 0.0).toFixed(1) +
        "&deg; " +
        flechita +
        "<\/span>";
    } else {
      Sunelold1 =
        Sunelold1 +
        "<span style='color:#ff0000;'>" +
        (SunElevationold1 - 0.0).toFixed(1) +
        "&deg; " +
        flechita +
        "<\/span>";
    }
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat, lng),
      map: map,
      icon: imageSrcUrl["null-png"],
    });
    azglobo = crsdist(
      event.latLng.lat(),
      event.latLng.lng(),
      loc2latlon(beacon1[0][1]).loclat,
      loc2latlon(beacon1[0][1]).loclon,
    ).bearing.toFixed(0);
    distglobo = (
      crsdist(
        loc2latlon(beacon1[0][1]).loclat,
        loc2latlon(beacon1[0][1]).loclon,
        event.latLng.lat(),
        event.latLng.lng(),
      ).distance * 1.852
    ).toFixed(1);
    infopos = new google.maps.InfoWindow();
    infopos.setContent(
      `<div onclick="${gowinds2(oldlon, oldlat)}" style='color: #3333ff;line-height:13px;overflow:hidden;font-weight:bold;white-space:nowrap;cursor:pointer;'><center>Here: ` +
        Sunelold1 +
        "<br>Lat: " +
        deg2dms(event.latLng.lat(), false) +
        "<br>Lon: " +
        deg2dms(event.latLng.lng(), true) +
        "<br>Balloon Az: " +
        azglobo +
        "&deg;<br>Dist.: " +
        distglobo +
        " Km.<br><u>Click for Winds<u></center></div>",
    );
    infopos.open(map, marker);
    setTimeout(cerrarpos, 10000);
  });
  sleep(100);
  gridlocator.setMap(map);
  dhoriz = (crsdist(lat1, lon1, lat, lon3).distance / 1.852).toFixed(0);
  dvert = (crsdist(lat1, lon3, lat2, lon3).distance * 1.852).toFixed(0);
  tamanio = dhoriz + " Km. x " + dvert + " Km.";
  promcuadro = Math.floor(dhoriz / 2 + dvert / 2);
  ddias = Math.floor(promcuadro / 24);
  dhoras = promcuadro - Math.floor(ddias * 24);
  estima =
    "<br>Tr&aacute;nsito Grid: " +
    ddias +
    "d " +
    dhoras +
    "h" +
    "<br>&nbsp;<a href='" +
    imageSrcUrl["locator1"] +
    "' target='_blank'><u>Use SNR +precision</u></a>";
  tamanio = tamanio + estima;
  var estimado = new Date(redate(beacon1[1][0]));
  estimado.setSeconds(estimado.getMinutes() + 60 * 60 * promcuadro);
  if (estimado.getMonth()) {
    tamanio =
      tamanio +
      "<br>Change " +
      monthNames[estimado.getMonth()] +
      "-" +
      estimado.getDate() +
      " " +
      ("00" + estimado.getHours()).slice(-2) +
      ":" +
      ("00" + estimado.getMinutes()).slice(-2);
  }
  var gridlocator1 = new google.maps.InfoWindow();
  // Open the InfoWindow on mouseover:
  google.maps.event.addListener(gridlocator, "click", function (e) {
    disthoriz =
      crsdist(
        lat2.toFixed(0),
        lon1.toFixed(0),
        lat2.toFixed(0),
        lon3.toFixed(0),
      ).distance * 1.852;
    distvert =
      crsdist(
        lat1.toFixed(0),
        lon1.toFixed(0),
        lat2.toFixed(0),
        lon1.toFixed(0),
      ).distance * 1.852;
    disthoriz1 = disthoriz / 18;
    distvert1 = distvert / 18;
    newlat1 = loctolatlon(beacon1[0][1]).lat;
    newlon1 = loctolatlon(beacon1[0][1]).lon;
    leye =
      "Lat " + degconvert(newlat1) + "&nbsp;&nbsp;Lon " + degconvert(newlon1);
    gridlocator1.setPosition(e.latLng);
    gridlocator1.setContent(
      '<div style="color: #3333ff;line-height:13px;overflow:hidden;font-weight:bold;white-space:nowrap;"><center>Grid Locator ' +
        beacon1[0][1].substring(0, 4) +
        "<br>" +
        lat2.toFixed(0) +
        "&deg;," +
        lon1.toFixed(0) +
        "&deg;&nbsp;to&nbsp;" +
        lat1.toFixed(0) +
        "&deg;," +
        lon3.toFixed(0) +
        "&deg;<br>Top,Left&nbsp;&nbsp;Bottom,Right<br>" +
        disthoriz.toFixed(0) +
        " Km. by " +
        distvert.toFixed(0) +
        " Km.<hr style='color:#9999ff;width:97%;'>Sub Square " +
        beacon1[0][1].substring(0, 6) +
        " Center<br>" +
        leye +
        "<br>Span " +
        disthoriz1.toFixed(1) +
        " Km. by " +
        distvert1.toFixed(1) +
        " Km.</center></div>",
    );
    gridlocator1.open(map);
  });
  // Draw suncoverage line
  radio = 149600000;
  for (bearing = 0; bearing < 365; bearing++) {
    getlatlon(sunlat, sunlon, bearing, radio);
    sunarray[bearing][0] = out.lat2;
    sunarray[bearing][1] = out.lon2;
  }
  var positionCoords = new Array();
  for (w = 0; w < 365; w++) {
    positionCoords.push(new google.maps.LatLng(sunarray[w][0], sunarray[w][1]));
  }
  var positionP = new google.maps.Polyline({
    path: positionCoords,
    strokeColor: "#FFA000",
    strokeOpacity: 0.4,
    geodesic: true,
    fillOpacity: 0.3,
    zIndex: 88,
    strokeWeight: 4,
  });
  // positionP.setOptions({strokeWeight: 15.0, fillColor: '#FFA000', fillOpacity: 0.35});
  positionP.setMap(map);
  google.maps.event.addListener(positionP, "mouseover", function (event) {
    positionP.setOptions({
      strokeWeight: 10.0,
      strokeColor: "#FFA000",
      strokeOpacity: 1,
    });
    markerSol.setOpacity(1);
    document.getElementById("lineadianoche").style.top =
      30 + document.body.scrollTop;
    document.getElementById("lineadianoche").style.left =
      screen.availWidth / 2 - 70;
    document.getElementById("lineadianoche").style.visibility = "visible";
  });
  google.maps.event.addListener(positionP, "mouseout", function (event) {
    positionP.setOptions({
      strokeWeight: 4.0,
      strokeColor: "#FFA000",
      strokeOpacity: 0.4,
    });
    markerSol.setOpacity(0.6);
    document.getElementById("lineadianoche").style.visibility = "hidden";
  });
  google.maps.event.addListener(markerSol, "mouseover", function (event) {
    positionP.setOptions({
      strokeWeight: 10.0,
      strokeColor: "#FFA000",
      strokeOpacity: 1,
    });
    markerSol.setOpacity(1);
  });
  google.maps.event.addListener(markerSol, "mouseout", function (event) {
    positionP.setOptions({
      strokeWeight: 4.0,
      strokeColor: "#FFA000",
      strokeOpacity: 0.4,
    });
    markerSol.setOpacity(0.6);
  });
  //      Armar rectangulo de la grilla chica
  grid11 = beacon1[0][1].substring(0, 6); //grid = flechas[1].substring(0, 4);
  g11 = grid11;
  g21 = grid11;
  g31 = grid11;
  g41 = grid11;
  lat11 = loc2latlon(g11).loclat - 0.04;
  lon11 = loc2latlon(g11).loclon - 0.08;
  lat21 = loc2latlon(g21).loclat - 0.04;
  lon21 = loc2latlon(g21).loclon + 0.08;
  lat31 = loc2latlon(g31).loclat + 0.04;
  lon31 = loc2latlon(g31).loclon + 0.08;
  lat41 = loc2latlon(g41).loclat + 0.04;
  lon41 = loc2latlon(g41).loclon - 0.08;
  //latdf = ((lat2 + .04) - (lat1 - .04)) / 5; londf = ((lon3 + .08) - (lon1 - .08)) / 5
  var flightPlanCoordinates2 = [
    { lat: lat11, lng: lon11 },
    { lat: lat21, lng: lon21 },
    { lat: lat31, lng: lon31 },
    { lat: lat41, lng: lon41 },
    { lat: lat11, lng: lon11 },
  ];
  var gridlocator2 = new google.maps.Polyline({
    path: flightPlanCoordinates2,
    geodesic: true,
    strokeColor: "#F0F0F0",
    strokeOpacity: 0.7,
    strokeWeight: 3,
  });
  gridlocator2.setMap(map);
  dhoriz = (crsdist(lat1, lon1, lat, lon3).distance / 1.852).toFixed(0);
  dvert = (crsdist(lat1, lon3, lat2, lon3).distance * 1.852).toFixed(0);
  tamanio = dhoriz + " Km. x " + dvert + " Km.";
  promcuadro = Math.floor(dhoriz / 2 + dvert / 2);
  ddias = Math.floor(promcuadro / 24);
  dhoras = promcuadro - Math.floor(ddias * 24);
  estima =
    "<br>Tr&aacute;nsito Grid: " +
    ddias +
    "d " +
    dhoras +
    "h" +
    "<br>&nbsp;<a href='" +
    imageSrcUrl["locator1"] +
    "' target='_blank'><u>Use SNR +precision</u></a>";
  tamanio = tamanio + estima;
  var estimado = new Date(redate(beacon1[1][0]));
  estimado.setSeconds(estimado.getMinutes() + 60 * 60 * promcuadro);
  if (estimado.getMonth()) {
    tamanio =
      tamanio +
      "<br>Change " +
      monthNames[estimado.getMonth()] +
      "-" +
      estimado.getDate() +
      " " +
      ("00" + estimado.getHours()).slice(-2) +
      ":" +
      ("00" + estimado.getMinutes()).slice(-2);
  }
  var gridlocator3 = new google.maps.InfoWindow();
  // Open the InfoWindow on mouseover:
  google.maps.event.addListener(gridlocator2, "click", function (e) {
    disthoriz =
      crsdist(
        lat2.toFixed(0),
        lon1.toFixed(0),
        lat2.toFixed(0),
        lon3.toFixed(0),
      ).distance * 1.852;
    distvert =
      crsdist(
        lat1.toFixed(0),
        lon1.toFixed(0),
        lat2.toFixed(0),
        lon1.toFixed(0),
      ).distance * 1.852;
    disthoriz1 = disthoriz / 18;
    distvert1 = distvert / 18;
    newlat1 = loctolatlon(beacon1[0][1]).lat;
    newlon1 = loctolatlon(beacon1[0][1]).lon;
    leye =
      "Lat " + degconvert(newlat1) + "&nbsp;&nbsp;Lon " + degconvert(newlon1);
    gridlocator3.setPosition(e.latLng);
    gridlocator3.setContent(
      '<div style="color: #3333ff;line-height:13px;overflow:hidden;font-weight:bold;white-space:nowrap;"><center>Sub Square ' +
        beacon1[0][1].substring(0, 6) +
        " Center<br>" +
        leye +
        "<br>Span " +
        disthoriz1.toFixed(1) +
        " Km. by " +
        distvert1.toFixed(1) +
        " Km.</center></div>",
    );
    gridlocator3.open(map);
  });
  // Draw ballooncoverage line , height in Km.loc2latlon(locations[i][0]).loclat, loc2latlon(locations[i][0]).loclon
  balloonlat = loc2latlon(locations[0][0]).loclat;
  balloonlon = loc2latlon(locations[0][0]).loclon;
  altu = Math.sqrt(beacon1[i][3]) * 3.6;
  radio =
    (Math.sqrt(Math.pow(beacon1[0][3] * 1 + 6378137, 2) - 40680631590769) /
      1000) *
    0.997;
  covradius = (Math.sqrt(beacon1[1][3]) * 3.85 * 1).toFixed(0);
  covradius = radio.toFixed(0); /// 2;
  if (radio == 0 && beacon1.length > 0) {
    radio =
      (Math.sqrt(Math.pow(beacon1[1][3] * 1 + 6378137, 2) - 40680631590769) /
        1000) *
      0.997;
    covradius = (Math.sqrt(beacon1[1][3]) * 3.85 * 1).toFixed(0);
    covradius = radio.toFixed(0);
  }
  if (radio == 0 && beacon1.length > 1) {
    radio =
      (Math.sqrt(Math.pow(beacon1[2][3] * 1 + 6378137, 2) - 40680631590769) /
        1000) *
      0.997;
    covradius = (Math.sqrt(beacon1[2][3]) * 3.85 * 1).toFixed(0);
    covradius = radio.toFixed(0);
  }
  if (radio == 0 && beacon1.length > 2) {
    radio =
      (Math.sqrt(Math.pow(beacon1[3][3] * 1 + 6378137, 2) - 40680631590769) /
        1000) *
      0.997;
    covradius = (Math.sqrt(beacon1[3][3]) * 3.85 * 1).toFixed(0);
    covradius = radio.toFixed(0);
  }
  if (radio == 0 && beacon1.length > 3) {
    radio =
      (Math.sqrt(Math.pow(beacon1[4][3] * 1 + 6378137, 2) - 40680631590769) /
        1000) *
      0.997;
    covradius = (Math.sqrt(beacon1[4][3]) * 3.85 * 1).toFixed(0);
    covradius = radio.toFixed(0);
  }
  if (radio == 0 && beacon1.length > 4) {
    radio =
      (Math.sqrt(Math.pow(beacon1[5][3] * 1 + 6378137, 2) - 40680631590769) /
        1000) *
      0.997;
    covradius = (Math.sqrt(beacon1[5][3]) * 3.85 * 1).toFixed(0);
    covradius = radio.toFixed(0);
  }
  for (bearing = 0; bearing < 365; bearing++) {
    getlatlon(balloonlat, balloonlon, bearing, radio * 0.54);
    balloonarray[bearing][0] = out.lat2;
    balloonarray[bearing][1] = out.lon2;
  }
  for (w = 0; w < 365; w++) {
    balloonCoords.push(
      new google.maps.LatLng(balloonarray[w][0], balloonarray[w][1]),
    );
  }
  var positionB = new google.maps.Polyline({
    path: balloonCoords,
    strokeColor: "#F0F0F0",
    strokeOpacity: 0.6,
    geodesic: true,
    fillOpacity: 0.3,
    zIndex: 88,
    strokeWeight: 2,
  });
  //    positionP.setOptions({strokeWeight: 15.0, fillColor: '#FFA000', fillOpacity: 0.35});
  positionB.setMap(map);
  var mylin = new google.maps.InfoWindow();
  // Open the InfoWindow on mouseover:
  google.maps.event.addListener(positionB, "mouseover", function (e) {
    mylin.setPosition(e.latLng);
    mylin.setContent(
      '<div style="color: #3333ff;line-height:15px;overflow:hidden;font-weight:bold;white-space:nowrap;"><center>Coverage Circle&nbsp;<br>Radius: ' +
        covradius +
        " Km.</center></div>",
    );
    mylin.open(map);
  });
  // Close the InfoWindow on mouseout:
  google.maps.event.addListener(positionB, "mouseout", function () {
    mylin.close();
  });
  // Calcular posicion estimada segun latitud/longitud del globo y velocidad por tiempo si transcurrieron mas de 1 hora del ultimo
  var deltatiempo =
    (new Date() - new Date(redate(beacon1[0][0]))) / 1000 +
    date.getTimezoneOffset() * 60; //tiempo transcurrido en segundos
  pasadominutos = deltatiempo / 60;
  if (deltatiempo < 1440) {
    // si menos de un dia
    pasadoh = Math.floor(pasadominutos / 60);
    pasadom = Math.floor(pasadominutos - pasadoh * 60);
    var pasado = "Elapsed " + pasadoh + "h " + pasadom + "'";
  } else {
    pasadodias = Math.floor(pasadominutos / 60 / 24);
    pasadohoras = Math.floor((pasadominutos - pasadodias * 60 * 24) / 60);
    pasadomin = Math.floor(
      pasadominutos - pasadodias * 60 * 24 - pasadohoras * 60,
    );
    var pasado = "Elapsed: ";
    if (pasadodias > 0) {
      pasado = pasado + pasadodias + "d ";
    }
    pasado = pasado + pasadohoras + "h " + pasadomin + "'";
  }
  q = -1;
  do {
    q = q + 1;
    distanciaant =
      crsdist(
        loc2latlon(beacon1[q][1]).loclat,
        loc2latlon(beacon1[q][1]).loclon,
        loc2latlon(beacon1[q + 1][1]).loclat,
        loc2latlon(beacon1[q + 1][1]).loclon,
      ).distance * 1.852;
    secondsant =
      (new Date(redate(beacon1[q][0])) - new Date(redate(beacon1[q + 1][0]))) /
      1000;
    velocidadant = (distanciaant * 3600) / secondsant;
    distanciaact = (velocidadant / 3600) * deltatiempo;
    rumboant = crsdist(
      loc2latlon(beacon1[q + 1][1]).loclat,
      loc2latlon(beacon1[q + 1][1]).loclon,
      loc2latlon(beacon1[q][1]).loclat,
      loc2latlon(beacon1[q][1]).loclon,
    ).bearing;
  } while (
    (isNaN(velocidadant) || velocidadant == 0) &&
    q < beacon1.length - 2
  );
  if ((gqs("other").toLowerCase = "w6xxx")) {
    hasta = 10;
  } else {
    hasta = 100;
  }
  r = 0;
  do {
    r = r + 1;
    rumbo = crsdist(
      loc2latlon(beacon1[r][1]).loclat,
      loc2latlon(beacon1[r][1]).loclon,
      loc2latlon(beacon1[0][1]).loclat,
      loc2latlon(beacon1[0][1]).loclon,
    ).bearing.toFixed(0);
    seconds =
      (new Date(redate(beacon1[0][0])) - new Date(redate(beacon1[r][0]))) /
      1000;
    distancia =
      crsdist(
        loc2latlon(beacon1[0][1]).loclat,
        loc2latlon(beacon1[0][1]).loclon,
        loc2latlon(beacon1[r][1]).loclat,
        loc2latlon(beacon1[r][1]).loclon,
      ).distance * 1.852;
  } while (distancia < hasta && r < beacon1.length - 1); // cambio tenia < 10
  velocidadant = (distancia * 3600) / seconds;
  rumboant1 = rumboant;
  rumboant2 = rumboant;
  rumboant3 = rumboant;
  rumboant4 = rumboant;
  rumboant5 = rumboant;
  rumboant6 = rumboant;
  if (beacon1.length > 2 && beacon1[2][1] != beacon1[1][1]) {
    rumboant1 = crsdist(
      loc2latlon(beacon1[2][1]).loclat,
      loc2latlon(beacon1[2][1]).loclon,
      loc2latlon(beacon1[1][1]).loclat,
      loc2latlon(beacon1[1][1]).loclon,
    ).bearing;
  }
  if (beacon1.length > 3 && beacon1[3][1] != beacon1[2][1]) {
    rumboant2 = crsdist(
      loc2latlon(beacon1[3][1]).loclat,
      loc2latlon(beacon1[3][1]).loclon,
      loc2latlon(beacon1[2][1]).loclat,
      loc2latlon(beacon1[2][1]).loclon,
    ).bearing;
  }
  if (beacon1.length > 4 && beacon1[4][1] != beacon1[3][1]) {
    rumboant3 = crsdist(
      loc2latlon(beacon1[4][1]).loclat,
      loc2latlon(beacon1[4][1]).loclon,
      loc2latlon(beacon1[3][1]).loclat,
      loc2latlon(beacon1[3][1]).loclon,
    ).bearing;
  }
  if (beacon1.length > 5 && beacon1[5][1] != beacon1[4][1]) {
    rumboant4 = crsdist(
      loc2latlon(beacon1[5][1]).loclat,
      loc2latlon(beacon1[5][1]).loclon,
      loc2latlon(beacon1[4][1]).loclat,
      loc2latlon(beacon1[4][1]).loclon,
    ).bearing;
  }
  if (beacon1.length > 6 && beacon1[6][1] != beacon1[5][1]) {
    rumboant5 = crsdist(
      loc2latlon(beacon1[6][1]).loclat,
      loc2latlon(beacon1[6][1]).loclon,
      loc2latlon(beacon1[5][1]).loclat,
      loc2latlon(beacon1[5][1]).loclon,
    ).bearing;
  }
  if (beacon1.length > 7 && beacon1[7][1] != beacon1[6][1]) {
    rumboant6 = crsdist(
      loc2latlon(beacon1[7][1]).loclat,
      loc2latlon(beacon1[7][1]).loclon,
      loc2latlon(beacon1[6][1]).loclat,
      loc2latlon(beacon1[6][1]).loclon,
    ).bearing;
  }
  rumboest1 =
    (rumboant +
      rumboant1 +
      rumboant2 +
      rumboant3 +
      rumboant4 +
      rumboant5 +
      rumboant6) /
    7;
  // For old elevation
  oldlon = loc2latlon(beacon1[0][1]).loclon;
  oldlat = loc2latlon(beacon1[0][1]).loclat;
  SunElevationold =
    SunCalc.getPosition(new Date(), oldlat, oldlon).altitude * radian;
  SunElevationpreviousold =
    SunCalc.getPosition(new Date() - 10, oldlat, oldlon).altitude * radian;
  if (SunElevationold > SunElevationpreviousold) {
    flechita = "&#x25B2;";
  } else {
    flechita = "&#x25BC;";
  }
  var Sunelold = "Sun Elev.: ";
  if (SunElevationold > 0) {
    Sunelold =
      Sunelold +
      '<span style="color:#117711;white-space:nowrap;">' +
      SunElevationold.toFixed(1) +
      "&deg;" +
      flechita +
      "<\/span>";
  } else {
    Sunelold =
      Sunelold +
      '<span style="color:#ff0000;;white-space:nowrap;">' +
      SunElevationold.toFixed(1) +
      "&deg;" +
      flechita +
      "<\/span>";
  }
  // End old elevation Se sumo +45 a rumbo y se multiplico velocidadant x .85 sacar estos valores
  getlatlon(
    loc2latlon(beacon1[0][1]).loclat,
    loc2latlon(beacon1[0][1]).loclon,
    rumboant,
    (velocidadant / 3600) * deltatiempo * 1.852 * 0.85,
  );
  var horaglobo = 12 - Math.floor(sunlon / 15 - out.lon2 / 15);
  if (horaglobo > 24) {
    horaglobo = horaglobo - 24;
  }
  if (horaglobo < 0) {
    horaglobo = horaglobo + 24;
  }
  var xd = new Date();
  var minutos = xd.getMinutes() / 60;
  horaglobo = horaglobo + minutos;

  SunElevation =
    SunCalc.getPosition(new Date(), out.lat2, out.lon2).altitude * radian;
  SunElevationprevious =
    SunCalc.getPosition(new Date() - 10, out.lat2, out.lon2).altitude * radian;
  if (SunElevation > SunElevationprevious) {
    flechita = "&#x25B2;";
  } else {
    flechita = "&#x25BC;";
  }
  var Sunel = "Sun Elev.: ";
  if (SunElevation > 0) {
    Sunel =
      Sunel +
      '<span style="color:#117711;white-space:nowrap;">' +
      SunElevation.toFixed(1) +
      "&deg;" +
      flechita +
      "<\/span>";
  } else {
    Sunel =
      Sunel +
      '<span style="color:#ff0000;">' +
      SunElevation.toFixed(1) +
      "&deg;" +
      flechita +
      "<\/span>";
  }
  horaminutos = "Time here: " + convertToHHMM(horaglobo);
  if (deltatiempo > 3600) {
    // 1 hora = 3600
    // Now Draw line from last position to estimated position
    distanciatotal = 0;
    seconds = 0;
    if (beacon1.length > 20) {
      limitek = 20;
    } else {
      limitek = beacon1.length - 1;
    }

    for (k = 0; k < limitek; k++) {
      distancia =
        crsdist(
          loc2latlon(beacon1[k][1]).loclat,
          loc2latlon(beacon1[k][1]).loclon,
          loc2latlon(beacon1[k + 1][1]).loclat,
          loc2latlon(beacon1[k + 1][1]).loclon,
        ).distance / 1.852;
      distanciatotal = distanciatotal + distancia;
      seconds =
        seconds +
        (new Date(redate(beacon1[k][0])) -
          new Date(redate(beacon1[k + 1][0]))) /
          1000; // alert("Dist:"+distancia.toFixed(0)+" Tiempo;" + seconds)
    }
    velocidad = (distanciatotal * 3600) / seconds;
    var coordi = new Array(50);
    if (deltatiempo > 10800) {
      rumboant = rumboest1;
      velocidadant = velocidad;
    }

    coordi[0] = new google.maps.LatLng(
      loc2latlon(beacon1[0][1]).loclat,
      loc2latlon(beacon1[0][1]).loclon,
    );
    getlatlon(
      loc2latlon(beacon1[0][1]).loclat,
      loc2latlon(beacon1[0][1]).loclon,
      rumboant,
      ((velocidadant / 3600) * deltatiempo * 1.852) / 20,
    );

    for (s = 1; s < 50; s++) {
      coordi[s] = new google.maps.LatLng(out.lat2, out.lon2);
      getlatlon(
        out.lat2,
        out.lon2,
        rumboant,
        ((velocidadant / 3600) * deltatiempo) / 51,
      );
    }

    coordi[50] = new google.maps.LatLng(out.lat2, out.lon2);

    if (out.lon2 > 180) {
      lonestima = out.lon2 - 360;
    } else {
      lonestima = out.lon2;
    }
    var locestima = latlon2loc(out.lat2, lonestima);
    var horaglobo = 12 - Math.floor(sunlon / 15 - out.lon2 / 15);
    if (horaglobo > 24) {
      horaglobo = horaglobo - 24;
    }
    if (horaglobo < 0) {
      horaglobo = horaglobo + 24;
    }
    var xd = new Date();
    var minutos = xd.getMinutes() / 60;
    horaglobo = horaglobo + minutos;
    SunElevation =
      SunCalc.getPosition(new Date(), out.lat2, out.lon2).altitude * radian;
    SunElevationprevious =
      SunCalc.getPosition(new Date() - 10, out.lat2, out.lon2).altitude *
      radian;
    // SunElevation = elevation(sunlon,out.lat2-sunlat,out.lon2+0.0)
    // SunElevationprevious = elevation(sunlon-.001,out.lat2-sunlat,out.lon2+0.0)
    if (SunElevation > SunElevationprevious) {
      flechita = "&#x25B2;";
    } else {
      flechita = "&#x25BC;";
    }
    var Sunel = "Sun Elev.: ";
    if (SunElevation > 0) {
      Sunel =
        Sunel +
        '<span style="color:#117711;white-space:nowrap;">' +
        SunElevation.toFixed(1) +
        "&deg;" +
        flechita +
        "<\/span>";
    } else {
      Sunel =
        Sunel +
        '<span style="color:#ff0000;">' +
        SunElevation.toFixed(1) +
        "&deg;" +
        flechita +
        "<\/span>";
    }
    horaminutos = "Time here: " + convertToHHMM(horaglobo);
    dura1 =
      (new Date(redate(beacon1[0][0])) - lanzamiento + deltatiempo * 1000) /
      1000 /
      60;
    durax = (new Date(redate(beacon1[0][0])) - lanzamiento) / 1000 / 60;
    duradias1 = Math.floor(dura1 / 24 / 60);
    durahoras1 = Math.floor((dura1 - duradias1 * 24 * 60) / 60);
    duraminutos1 = Math.floor(dura1 - (duradias1 * 24 * 60 + durahoras1 * 60));
    duracion1 =
      "Travel: " +
      duradias1 +
      "d " +
      durahoras1 +
      "h" +
      " " +
      duraminutos1 +
      "'";
    var flightPath = new google.maps.Polyline({
      path: coordi,
      strokeColor: "#A4FA58",
      zIndex: 8888,
      strokeOpacity: 0.75,
      // geodesic: true,
      icons: [
        {
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          },
          offset: "100%",
        },
      ],
      strokeWeight: 2,
    });
    flightPath.setMap(map);
    if (out.lon2 > 180) {
      loncorr = out.lon2 - 360;
    } else {
      loncorr = out.lon2;
    }
    savelatn = out.lat2;
    savelonn = loncorr;
    if (SunElevation < 0) {
      sol = SunCalc.getTimes(new Date(), out.lat2, out.lon2).sunriseEnd;
      flechasol = "&#x25B2;";
      sol20c = "";
    } else {
      sol = SunCalc.getTimes(new Date(), out.lat2, out.lon2).sunsetStart;
      flechasol = "&#x25BC;";
      noon = SunCalc.getTimes(new Date(), out.lat2, out.lon2).solarNoon;
    }
    markerestima = new google.maps.Marker({
      position: new google.maps.LatLng(out.lat2, out.lon2),
      icon: icono,
      zIndex: 8888,
      optimized: false,
      title:
        " Estimated Position" +
        "\n" +
        "Lat:" +
        out.lat2.toFixed(2) +
        " Lon:" +
        loncorr.toFixed(2),
      map: map,
    });
    mes = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Set",
      "Oct",
      "Nov",
      "Dec",
    ];
    var d = new Date();
    var horaact =
      "@" +
      mes[d.getUTCMonth()] +
      "-" +
      ("00" + d.getUTCDate()).slice(-2) +
      " " +
      ("00" + d.getUTCHours()).slice(-2) +
      ":" +
      ("00" + d.getUTCMinutes()).slice(-2) +
      "z";
    var horalocal =
      "@" +
      mes[d.getMonth()] +
      "-" +
      ("00" + d.getDate()).slice(-2) +
      " " +
      ("00" + d.getHours()).slice(-2) +
      ":" +
      ("00" + d.getMinutes()).slice(-2) +
      " local";
    markerestima.setOpacity(0.6);
    if (isNaN(rumboant)) {
      rumbotext = "?";
    } else {
      rumbotext = rumboant.toFixed(1);
    }
    if (isNaN(velocidadant)) {
      velocidadtext = "?";
    } else {
      velocidadtext = (velocidadant * 1.852).toFixed(1);
    }
    Contenido =
      '<div style="color: #3333ff;line-height:11px;overflow:hidden;font-weight:bold;white-space:nowrap;"><center>' +
      locations[0][1].substring(0, 6).replace(/</, " ") +
      "<br>Estimated Posit." +
      "<br>" +
      horaact +
      "<br>" +
      horalocal +
      "<br>" +
      horaminutos +
      "<br>Locator: " +
      locestima.substring(0, 4) +
      locestima.slice(-2).toLowerCase() +
      "<br>" +
      pasado +
      "<br><span style='font-size:16px;'>&#9651;<\/span>d: " +
      (distanciaact / 1.852).toFixed(0) +
      " Km<br>Course: " +
      rumbotext +
      "&deg;<br>V: " +
      velocidadtext +
      " Km/h<br>" +
      duracion1 +
      "<br>" +
      "By: " +
      (distanciatotal + distanciaact).toFixed(0) +
      " Km" +
      "<br><i>On this map</i><br>" +
      Sunel +
      "<br>Sun" +
      flechasol +
      ":" +
      ("0" + sol.getUTCHours()).slice(-2) +
      ":" +
      ("0" + sol.getUTCMinutes()).slice(-2) +
      " z";
    if (Contenido.indexOf("&#9651;") > -1 && SunElevation < 0) {
      Contenido = "";
      Extra = Contenido + "<br>@ 20&deg;: ";
      sol20 = new Date(sol.getTime() + 105 * 60 * 1000);
      Extra =
        Extra +
        ("0" + sol20.getUTCHours()).slice(-2) +
        ":" +
        ("0" + sol20.getUTCMinutes()).slice(-2) +
        " z";
    } else {
      solsale = SunCalc.getTimes(new Date(), out.lat2, out.lon2).sunriseEnd;
      Extra =
        "<br>Sun^^: " +
        ("0" + noon.getUTCHours()).slice(-2) +
        ":" +
        ("0" + noon.getUTCMinutes()).slice(-2) +
        " z<br>Sun&#x25B2;: " +
        ("0" + solsale.getUTCHours()).slice(-2) +
        ":" +
        ("0" + solsale.getUTCMinutes()).slice(-2) +
        " z";
      Contenido = "";
    }

    google.maps.event.addListener(
      markerestima,
      "click",
      (function (markerestima) {
        return function () {
          if (gqs("SSID")) {
            addssid = "-" + gqs("SSID");
          } else {
            addssid = "";
          }
          infowindow.setContent(
            '<div style="color: #3333ff;line-height:11px;font-size:12px;overflow:hidden;font-weight:bold;white-space:nowrap;"><center>' +
              locations[0][1]
                .substring(0, 6)
                .replace(/</, " ")
                .replace(/b/, " ") +
              addssid +
              "<br>Estimated Posit." +
              "<br>" +
              horaact +
              "<br>" +
              horalocal +
              "<br>" +
              horaminutos +
              "<br>Locator: " +
              locestima.substring(0, 4) +
              locestima.slice(-2).toLowerCase() +
              "<br>" +
              pasado +
              '<br><span style="font-size:16px;">&#9651;</span>d: ' +
              (distanciaact / 1.852).toFixed(0) +
              " Km<br>Course: " +
              rumbotext +
              "&deg;<br>V: " +
              velocidadtext +
              " Km/h<br>" +
              duracion1 +
              "<br>" +
              "By: " +
              (distanciatotal + distanciaact).toFixed(0) +
              " Km" +
              "<br><i>On this map</i><br>" +
              Sunel +
              "<br>Sun" +
              flechasol +
              ": " +
              ("0" + sol.getUTCHours()).slice(-2) +
              ":" +
              ("0" + sol.getUTCMinutes()).slice(-2) +
              " z" +
              Extra +
              `<br><a href=# onclick ="${gowinds2(savelonn, savelatn)}" style='color: #3333ff;line-height:13px;overflow:hidden;font-weight:bold;white-space:nowrap;cursor:pointer;'><u>Click for Winds</u></a>` +
              "</center></div>",
          );
          infowindow.open(map, markerestima);
        };
      })(markerestima),
    );
  }
  var TZD = new Date().getTimezoneOffset() / 60;
  for (var i = 0; i < positionCoordinates.length; i++) {
    new google.maps.Marker({
      map: map,
      position: positionCoordinates[i],
      icon: imageSrcUrl["S29"],
      Title:
        "" +
        beacon1[i][0] +
        "\nLocator: " +
        beacon1[i][1] +
        "\nAlt.: " +
        beacon1[i][3] +
        " m." +
        beacon1[i][6].replace(/<br>/g, "\n"),
    });
    marker3 = new google.maps.Marker({
      position: positionCoordinates[i],
      icon: imageSrcUrl["S29"],
      optimized: false,
      Title:
        "" +
        beacon1[i][0] +
        "\nLocator: " +
        beacon1[i][1] +
        "\nAlt.: " +
        beacon1[i][3] +
        " m." +
        beacon1[i][6].replace(/<br>/g, "\n"),
      map: map,
    });
    google.maps.event.addListener(
      marker3,
      "click",
      (function (marker3, i) {
        return function () {
          if (beacon1[i][0].substr(17, 19) == "gps") {
            colo = "#4444ff";
          } else {
            colo = "#4444ff";
          }
          //if (beacon1[i][3] == "3000") { beacon1[i][3] = "12000" }
          horax = beacon1[i][0].substring(11, 13) * 1 - TZD;
          if (horax > 23) {
            horax = horax - 24;
          }
          if (horax < 0) {
            horax = horax + 24;
          }
          horalocal =
            "Local: " +
            ("0" + horax).slice(-2) +
            beacon1[i][0].substring(13, 16);
          SunElevationold =
            SunCalc.getPosition(
              new Date(beacon1[i][0].replace(/ /, "T").replace(/z/, "Z")),
              loctolatlon(beacon1[i][1]).lat,
              loctolatlon(beacon1[i][1]).lon,
            ).altitude * radian;
          SunElevationpreviousold =
            SunCalc.getPosition(
              new Date(beacon1[i][0].replace(/ /, "T").replace(/z/, "Z")) -
                1000,
              loctolatlon(beacon1[i][1]).lat,
              loctolatlon(beacon1[i][1]).lon,
            ).altitude * radian;
          if (SunElevationold > SunElevationpreviousold) {
            flechita = "&#x25B2;";
          } else {
            flechita = "&#x25BC;";
          }
          sunalt =
            "<span style='color:green;font-size:12px;line-height:12px;'>Sun Elev:" +
            (
              SunCalc.getPosition(
                new Date(beacon1[i][0].replace(/ /, "T").replace(/z/, "Z")),
                loctolatlon(beacon1[i][1]).lat,
                loctolatlon(beacon1[i][1]).lon,
              ).altitude * radian
            ).toFixed(1) +
            "&deg;" +
            flechita +
            "<\/span>";
          if (typeof beacon1[i][7] == "undefined") {
            ascent = "";
          } else {
            ascent = beacon1[i][7] + "<br>";
          }
          altutext = "";
          if (beacon1[i][3].length > 2) {
            altutext = "<br>Alt.: " + beacon1[i][3] + " m.";
          } else {
            if (prevaltutext) {
              altutext = prevaltutext;
            }
          }
          prevaltutext = altutext;
          if (beacon1[i][2].length > 0 && beacon1[i][2] != "? ") {
            temptext = "<br>Temp. : " + beacon1[i][2] + " &deg;C";
          } else {
            temptext = "";
          }
          if (beacon1[i][4].length > 2) {
            batetext = "<br>Bat/Sol: " + beacon1[i][4].replace("V", "") + " V";
          } else {
            batetext = "";
          }
          licglobom = locations[0][1].split("<br>");
          if (gqs("SSID") && gqs("SSID") != "%20") {
            addssid = "-" + gqs("SSID");
          } else {
            addssid = "";
          }
          licglobo =
            "<span style='font-size:14px;line-height:16px;'>" +
            licglobom[0] +
            addssid +
            "</span><br>";
          infowindow.setContent(
            '<div style="color: ' +
              colo +
              ';line-height:9px;height:auto !important;width:auto !important;max-width:110px;display:block;overflow:hidden !important;adding-right:0px;padding-left:0px;white-space:nowrap;font-size:11px;font-weight:bold;"><center>' +
              licglobo +
              monthNames[beacon1[i][0].substr(5, 2) - 1] +
              beacon1[i][0].substr(7, 9) +
              "z<br>" +
              horalocal +
              "<br>Loc: " +
              beacon1[i][1] +
              altutext +
              temptext +
              batetext +
              "<br></center>" +
              ascent +
              sunalt +
              beacon1[i][6].replace(/ /g, "") +
              "</div>",
          );
          infowindow.open(map, marker3);
        };
      })(marker3, i),
    );
  }
}

function loctolatlon(loc) {
  loc = loc.toUpperCase().trim().replace(/"/g, "");
  if (loc.length == 4) {
    loc = loc + "LL";
  }
  c0 = loc.charAt(0);
  c1 = loc.charAt(1);
  c2 = loc.charAt(2);
  c3 = loc.charAt(3);
  c4 = loc.charAt(4);
  c5 = loc.charAt(5);
  lat = (
    (parseInt(c1, 28) - 19) * 10 +
    parseInt(c3, 10) +
    (parseInt(c5, 34) - 9.5) / 24
  ).toFixed(4);
  lon = (
    (parseInt(c0, 28) - 19) * 20 +
    parseInt(c2, 10) * 2 +
    (parseInt(c4, 34) - 9.5) / 12
  ).toFixed(4);
  //loctolatlon.lat = lat;
  //loctolatlon.lon = lon;

  //return loctolatlon;
  return { lat: lat, lon: lon };
}

function loc2latlon(loc, locname) {
  // enter gridlocator 4 or 6 characters & location name
  if (!locname) {
    locname = "MyPlace";
  }
  if (!loc) {
    loc = "GF05";
  }
  loc = loc.toUpperCase();
  if (loc.length == 4) {
    loc = loc + "LL";
    loc = loc;
  }
  if (loc.length > 0) {
    err = 0;
    if (loc.length != 6) err = 1;
    else {
      c0 = loc.charAt(0);
      c1 = loc.charAt(1);
      c2 = loc.charAt(2);
      c3 = loc.charAt(3);
      c4 = loc.charAt(4);
      c5 = loc.charAt(5);
      if (
        c0 < "A" ||
        c0 > "R" ||
        c1 < "A" ||
        c1 > "R" ||
        (c2 < "0") | (c2 > "9") ||
        c3 < "0" ||
        c3 > "9" ||
        c4 < "A" ||
        c4 > "X" ||
        c5 < "A" ||
        c5 > "X"
      )
        err = 1;
    }
    if (err) {
      return { loclat: "", loclon: "", locname: "" };
    } //return {loclat: "", loclon: "", locname: ""}
    else {
      loclat =
        (parseInt(c1, 28) - 19) * 10 +
        parseInt(c3, 10) +
        (parseInt(c5, 34) - 9.5) / 24;
      loclon =
        (parseInt(c0, 28) - 19) * 20 +
        parseInt(c2, 10) * 2 +
        (parseInt(c4, 34) - 9.5) / 12;
      return {
        loclat: loclat,
        loclon: loclon,
        locname: locname,
      };
    }
  }
} // Returns loclat, loclon, locname

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
function suncoverage() {
  radio = 149600000;
  prevlon = 0;
  for (bearing = 0; bearing < 365; bearing++) {
    getlatlon(sunlat, sunlon, bearing, radio);
    sunarray[bearing][0] = out.lat2;
    sunarray[bearing][1] = out.lon2;
  }
}
function getlatlon(lat1, lon1, bearing, distance) {
  //alert("lat1:"+lat1+" lon1:"+lon1+" bearing:"+bearing+" distance:"+distance);
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
  //   var secfloat = (minfloat-m)*60;
  //   var s = Math.round(secfloat);
  // After rounding, the seconds might become 60. These two
  // if-tests are not necessary if no rounding is done.
  //   if (s==60) {m++;s=0;}
  if (m == 60) {
    d++;
    m = 0;
  }
  return signo + d + "º " + m + "'";
}
/*
    function gradosminutos(deg)
    {
        if (deg < 0) { deg = -deg; var signo = "-" } else { var signo = ""; }
        var d = Math.floor(deg);
        var minfloat = (deg - d) * 60;
        var m = minfloat;
        //   var secfloat = (minfloat-m)*60;
        //   var s = Math.round(secfloat);
        // After rounding, the seconds might become 60. These two
        // if-tests are not necessary if no rounding is done.
        //   if (s==60) {m++;s=0;}
        if (m == 60) { d++; m = 0; }
        return (d*100+m)
    }
    */
function gradosminutos(deg) {
  if (deg < 0) {
    deg = -deg;
  }
  var d = Math.floor(deg);
  var resto = (deg - d) * 60;
  var resto1 = deg - d - Math.floor(resto / 60);
  return d * 100 + Math.floor(resto) + resto1;
}
//alert(gradosminutos(1.503244))
var aprs4;
latsave = " ";
lonsave = " ";
Alturasave = " ";
//
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if (new Date().getTime() - start > milliseconds) {
      break;
    }
  }
}
//
function aprsend() {
  // funcion para alimentar a aprs.fi haciendo telnet desde amsat.org.ar
  ubicacion = locations[0][0].substring(0, 6);
  var Alturareportadametros = locations[0][1].match(
    /(?<=Alt.: \s*).*?(?=\s*&nbsp;)/gs,
  );
  Alturareportadapies = (Alturareportadametros * 3.28084).toFixed(0);
  latboya = loc2latlon(ubicacion).loclat;
  lonboya = loc2latlon(ubicacion).loclon;
  if (latboya < 0) {
    latpos = "S";
    latboya = latboya * -1;
  } else {
    latpos = "N";
  }
  if (lonboya < 0) {
    lonpos = "W";
    lonboya = lonboya * -1;
  } else {
    lonpos = "E";
  }
  //lata = lata.replace(/\./, ""); lona = lona.replace(/\./, "");
  lata = gradosminutos(latboya) + "000";
  lona = gradosminutos(lonboya) + "000";
  lata = (lata * 1).toFixed(2).toString();
  lona = (lona * 1).toFixed(2).toString();
  lata = ("000" + lata).slice(-7);
  lona = ("000" + lona).slice(-8);
  let toDate = new Date(beacon1[0][0].slice(0, beacon1[0][0].length - 1));
  horaspot = `${right("00" + toDate.getHours(), 2)}${right("00" + toDate.getMinutes(), 2)}${right("00" + toDate.getSeconds(), 2)}z`;
  var zd = new Date();
  var horautc =
    ("00" + zd.getUTCHours()).slice(-2) +
    ("00" + zd.getUTCMinutes()).slice(-2) +
    ("00" + zd.getUTCSeconds()).slice(-2) +
    "h";
  if (gqs("other")) {
    licenciaaprs = gqs("other").toUpperCase();
  } else {
    licenciaaprs = "LU1ESY";
  }
  licenciaaprsm = licenciaaprs.split("/");
  licenciaaprs = licenciaaprsm[0];
  if (
    gqs("other").toUpperCase().slice(-2) == "/B" &&
    gqs("other").toUpperCase().substring(0, 2) == "LU"
  ) {
    tok1 = "\\";
    tok2 = "N";
    tok3 = "Buoy";
  } else {
    tok1 = "/";
    tok2 = "O";
    tok3 = "PicoBalloon";
  }
  if (typeof SSID !== "undefined") {
    aprs4 =
      licenciaaprs +
      "-" +
      SSID +
      ">APRS,TCPIP*,qAR,LU7AA:/" +
      horaspot +
      lata +
      latpos +
      tok1 +
      lona +
      lonpos +
      tok2 +
      "000/000/A=" +
      ("000000" + Alturareportadapies).slice(-6) +
      " " +
      locations[0][0];
  }
  if (beacon1.length > 1) {
    if (beacon1[0][2] != "" && beacon1[0][2] != "? ") {
      aprs4 = aprs4 + " " + (beacon1[0][2] * 1).toFixed(0) + "C";
    }
    if (beacon1[0][4] != "" && beacon1[0][4] != "? ") {
      aprs4 =
        aprs4 + " " + (beacon1[0][4].replace(/V/, "") * 1).toFixed(1) + "V";
    }
    r = 0;
    do {
      r = r + 1;
      rumbo = crsdist(
        loc2latlon(beacon1[r][1]).loclat,
        loc2latlon(beacon1[r][1]).loclon,
        loc2latlon(beacon1[0][1]).loclat,
        loc2latlon(beacon1[0][1]).loclon,
      ).bearing.toFixed(0);
      seconds =
        (new Date(redate(beacon1[0][0])) - new Date(redate(beacon1[r][0]))) /
        1000;
      distancia =
        crsdist(
          loc2latlon(beacon1[0][1]).loclat,
          loc2latlon(beacon1[0][1]).loclon,
          loc2latlon(beacon1[r][1]).loclat,
          loc2latlon(beacon1[r][1]).loclon,
        ).distance * 1.852;
    } while (distancia < 100 && r < beacon1.length - 1); // cambio tenia < 10
    velocidad = ((distancia * 3600) / seconds).toFixed(0);
    distancia = distancia.toFixed(0);
    if (isNaN(rumbo)) {
      rtxt = "?";
    } else {
      rtxt = rumbo + "";
    }
    rumboact = rtxt;
    velocidadact = velocidad;
    secondsact = seconds;
    distanciact = distancia;

    if (rumboact != "" && rumboact != "?") {
      aprs4 = aprs4 + " To:" + rumboact;
    }
    if (seconds) {
      ascent = ((beacon1[0][3] - beacon1[r][3]) / seconds).toFixed(2) + "m/s";
    } else {
      ascent = "";
    }
    if (ascent == "0.00m/s") {
      ascent = "0m/s";
    }
    if (ascent != "") {
    } else {
      ascent = "";
    }
    if (ascent && ascent != "") {
      aprs4 = aprs4 + " Up:" + ascent;
    }

    hoursfirst = new Date(redate(beacon1[beacon1.length - 1][0])); //distanciatotal = 0;
    distancia =
      crsdist(
        loc2latlon(beacon1[0][1]).loclat,
        loc2latlon(beacon1[0][1]).loclon,
        loc2latlon(beacon1[1][1]).loclat,
        loc2latlon(beacon1[1][1]).loclon,
      ).distance * 1.852;
    hoursactual =
      (new Date(redate(beacon1[0][0])) - new Date(redate(beacon1[1][0]))) /
      1000 /
      60 /
      60;
    if (beacon1.length > 0) {
      var hourstotal =
        (new Date(redate(beacon1[0][0])) -
          new Date(redate(beacon1[beacon1.length - 1][0]))) /
        1000 /
        60 /
        60;
    } // tenia lanzamiento en vez de hoursfirst
    durax = (new Date(redate(beacon1[0][0])) - lanzamiento) / 1000 / 60;
    TotalKm = distanciatotal / hourstotal / 60;
    velocidad = distanciatotal / hourstotal;
    //        velocidadact = velocidad;
    if (velocidadact != "" && !isNaN(velocidadact)) {
      aprs4 = aprs4 + " V:" + (velocidadact / 1.852).toFixed(0) + "Km/h";
    }
    Sunelevadosave = (
      SunCalc.getPosition(
        new Date(beacon1[0][0].replace(/ /, "T").replace(/z/, "Z")),
        loctolatlon(beacon1[0][1]).lat,
        loctolatlon(beacon1[0][1]).lon,
      ).altitude * radian
    ).toFixed(0);
    if (Sunelevadosave != "") {
      aprs4 = aprs4 + " Sun:" + Sunelevadosave.toString() + "";
    }
  }
  aprs4 =
    aprs4 +
    "\ WSPR " +
    tok3 +
    " " +
    window.PARENT_URL +
    "/wsprx?other=" +
    gqs("other");
  if (gqs("launch")) {
    aprs4 = aprs4 + "&launch=" + gqs("launch");
  }
  if (gqs("detail")) {
    aprs4 = aprs4 + "&detail=" + gqs("detail");
  }
  if (gqs("SSID")) {
    aprs4 = aprs4 + "&SSID=" + gqs("SSID");
  }
  if (gqs("banda")) {
    aprs4 = aprs4 + "&banda=" + gqs("banda");
  }
  if (gqs("balloonid")) {
    aprs4 = aprs4 + "&balloonid=" + gqs("balloonid");
  }
  aprs4 = aprs4 + "&timeslot=" + gqs("timeslot");
  if (gqs("tracker")) {
    aprs4 = aprs4 + "&tracker=" + gqs("tracker");
  }
  aprs4 = aprs4.replace(/#/g, "");
  //    alert(aprs4)
  var xhr = new XMLHttpRequest();
  var urlpost = "http://amsat.org.ar/elnet.php?datos=" + aprs4;
  //    xhr.open("POST", urlpost, true);
  //    xhr.send(params);
  estacion = gqs("other").toUpperCase();

  var fd = 0;
  if (
    getParamSafe("tracker") === "qrplabs" ||
    getParamSafe("tracker") === "traquito"
  ) {
    var modulo = Math.floor(((getParamSafe("qrpid") * 1) % 20) / 5);
    if (modulo === 0) fd = -80;
    if (modulo === 1) fd = -40;
    if (modulo === 2) fd = +40;
    if (modulo === 3) fd = +80;
  }
  // for g = 0 to ubound(tbanda)
  //     if ucase(Request("banda")) = ucase(tbanda(g, 1)) then frecu = tbanda(g, 2)
  // next
  let frecu = 0;

  if (getParamSafe("banda").length > 0) {
    const requestedBanda = getParamSafe("banda").toUpperCase();
    const match = tbanda.find(
      (entry) => entry.label.toUpperCase() === requestedBanda.toUpperCase(),
    );
    if (match) {
      frecu = match.frequency;
    }
  }

  window.fcentral = frecu + fd;

  if (typeof SSID === "undefined") {
  } else {
    if (beacon1.length > 0) beacolocator = beacon1[0][1];
    var equal = true;
    for (r = 0; r < beacon1.length; r++) {
      if (beacon1[r][1] != beacolocator) {
        var equal = false;
      }
    }
    {
      if (equal == false) {
        callcheck = locations[0][1].substring(0, 4).toUpperCase();
        if (callcheck == gqs("other").substring(0, 4).toUpperCase()) {
          trayectodate = new Date(redate(trayecto[0][0]));
          // next three lines avoid uploading if more than half our on the last wspr report
          var now = new Date();
          if (
            gqs("other") == "nu7b" &&
            (gqs("SSID") == "22" || gqs("SSID")) == "23"
          ) {
            addl =
              "&nbsp;&nbsp;<a href='" +
              window.PARENT_URL +
              "/dx?por=H&tz=0&be=&multiplecalls=Select&scale=Lin&bs=B&call=x1*&band=14&timelimit=1209600&sel=0&t=m' target='_blank' style='color:navy;line-height:15px;font-size:13px;text-decoration:none;background-color:gold;font-weight:normal;' title='The prefix for telem will be X1 followed by the letters BAA to JJJ.&#13The letters A-J correspond to the digits 0-9, To compute the count,&#13subtract 100 from the digits corresponding to the three letter code.'>&nbsp;Click for <span style='font-size:14px;'>&beta;\/&gamma;<\/span> Radiation Particle Count&nbsp;<\/a>";
          } else {
            addl = "";
          }
          diferencia =
            (new Date(now.getTime() + now.getTimezoneOffset() * 60000) -
              trayectodate) /
            1000 /
            60 /
            60;
          if (diferencia < 0.5 && velocidadact < 301) {
            if (SSID && SSID.length > 0 && estacion != "W5KUB") {
              document.getElementById("aprsfi").innerHTML =
                "<span style='color:#000000;font-weight:normal;'>Wide:<input type='checkbox' id='wide' name='wide' title='Check for wider reception&#13 for your second TLM&#13 use if your emission&#13 is way off frequency' onclick=\"document.getElementById('enviar').click();\">&nbsp;Central QRG: " +
                window.fcentral +
                " Hz         <\/span>     <a id='repetir' name='repetir' href='http://amsat.org.ar/elnet.php?datos=" +
                aprs4 +
                "' target='_blank'>&nbsp;&nbsp;CLICK HERE TO UPLOAD " +
                licenciaaprs.toUpperCase().replace(/#/g, "") +
                "-" +
                SSID +
                " ACTUAL POSITION TO APRS.FI & SONDEHUB&nbsp;&nbsp;<\/a><span style='text-shadow:0 0;color:#000000;font-size:11px;line-height:9px;font-family:Tahoma,Arial;'>&nbsp;&nbsp;&nbsp;REPEAT APRS.FI & SONDEHUB UPLOADS <input onclick=\"document.getElementById('enviar').click();\" type=checkbox name='repito' id='repito' style='margin:0 0 0 0;'> ON 10' AUTO-UPDATE<\/span>" +
                addl +
                "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
            }
            if (gqs("SSID") != "" && formu.repito) {
              if (getParamSafe("repito") == "on") {
                document.getElementById("repito").checked = true;
              }
            }
            if (gqs("SSID") != "" && formu.wide) {
              if (getParamSafe("wide") == "on") {
                document.getElementById("wide").checked = true;
              }
            }
          } else {
            if (SSID && SSID.length > 0 && estacion != "W5KUB") {
              document.getElementById("aprsfi").innerHTML =
                "<span style='color:#000000;font-weight:normal;'>Wide:<input type='checkbox' id='wide' name='wide' title='Check for wider reception&#13 for your second TLM&#13 use if your emission&#13 is way off frequency' onclick=\"document.getElementById('enviar').click();\">&nbsp;Central QRG: " +
                window.fcentral +
                " Hz          <\/span>     <a id='repetir' name='repetir' href='#' ondblclick=\"noupload()\">&nbsp;&nbsp;DOUBLE CLICK HERE TO UPLOAD " +
                licenciaaprs.toUpperCase().replace(/#/g, "") +
                "-" +
                SSID +
                " ACTUAL POSITION TO APRS.FI & SONDEHUB&nbsp;&nbsp;<\/a><span style='text-shadow:0 0;color:#000000;font-size:11px;line-height:9px;font-family:Tahoma,Arial;'>&nbsp;&nbsp;&nbsp;REPEAT APRS.FI & SONDEHUB UPLOADS <input onclick=\"document.getElementById('enviar').click();\" type=checkbox name='repito' id='repito' style='margin:0 0 0 0;'> ON 10' AUTO-UPDATE<\/span>" +
                addl +
                "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
            }
            if (gqs("SSID") != "" && formu.repito) {
              if (getParamSafe("repito") == "on") {
                document.getElementById("repito").checked = true;
              }
            }
            if (gqs("SSID") != "" && formu.wide) {
              if (getParamSafe("wide") == "on") {
                document.getElementById("wide").checked = true;
              }
            }
          }
        }
      } else {
        icono = imageSrcUrl["green_arrow"];
      }
    }
  }
}
var popupwin;
function noupload() {
  posleft = screen.availWidth / 2 - 203;
  postop = screen.availHeight / 2 - 180;
  if (popupwin != null) {
    popupwin.close();
  }
  codata =
    '<\/head><body bgcolor="#172447" color="#ffffff" style="font-size:20px;line-height:18px;font-family:Tahoma,Arial;font-weight:bold;color:cyan;"  onclick="self.close();")>';
  codata =
    codata +
    "<center><br>Not Uploaded to aprs.fi<br><br>Speed seen is too fast or<br><br>the position is same as last<br><br>on " +
    trayecto[0][0] +
    "<br><br>Keep UPLOADS <img src='" +
    immageSrcUrl["mark"] +
    "' border=0> Marked<\/center>";
  if (gqs("SSID") != "") {
    ademas = gqs("other").toUpperCase() + "-" + gqs("SSID");
  }
  codata =
    codata +
    "<center><br style='line-height:12px;'><a href='http:\/\/amsat.org.ar\/elnet.php?datos=" +
    aprs4 +
    "' target='_blank' title='Upload' style='font-size:12px;line-height:14px;color:cyan;'>Upload " +
    ademas +
    " anyway to aprs.fi<\/a><\/center>";
  codata = codata + "<\/body><\/html>";
  var anchopantalla = 374;
  var altopantalla = 340;
  preferences =
    "toolbar=no,width=" +
    anchopantalla +
    "px,height=" +
    altopantalla +
    "px,center,margintop=0,top=" +
    postop +
    ",left=" +
    posleft +
    ",status=no,scrollbars=no,resizable=no,dependent=yes,z-lock=yes";
  if (popupwin != null) {
    popupwin.close();
  }
  popupwin = window.open("", "win1", preferences);
  if (!popupwin || popupwin.closed || typeof popupwin.closed == "undefined") {
    //Worked For IE and Firefox
    alert(
      "Popup Blocker is enabled! Please add this site to your exception list.",
    );
  }
  popupwin.document.write(codata);
  popupwin.setTimeout("self.close()", 15000);
}
hide = false;
function drawKm() {
  for (g = 0; g < 14; g++) {
    document.getElementById(g).style.backgroundColor = "transparent";
  }
  document.getElementById(12).style.backgroundColor = "orange";
  var data6 = new google.visualization.DataTable();
  data6.addColumn("number", "Dist.Km.");
  data6.addColumn("number", "Reports Count");
  data6.addRows(data5);
  var now = new Date();
  lastseenhours =
    (new Date(now.getTime() + now.getTimezoneOffset() * 60000) -
      new Date(redate(trayecto[0][0]))) /
    1000 /
    60 /
    60;
  lastseen = "";
  if (lastseenhours > 0 && lastseenhours < 24) {
    lastseen = ", " + Math.floor(lastseenhours) + " hours ago. ";
  }
  if (lastseenhours > -1 && lastseenhours < 1) {
    lastseen = ", just now. ";
  }
  if (lastseenhours > 24) {
    lastseen = ", " + Math.floor(lastseenhours / 24) + " days ago. ";
  }
  document.getElementById("chart_div").style.left =
    document.getElementById("map_canvas").offsetLeft + 74;
  document.getElementById("chart_div").style.top =
    document.getElementById("map_canvas").offsetTop;
  var options = {
    backgroundColor: "#f2f2f2",
    width: window.width,
    bottom: 0,
    smoothLine: true,
    lineWidth: 2,
    chartArea: { width: "85%", height: "85%" },
    legend: "top",
    hAxis: { format: "##,###Km" },
    vAxis: {
      format: "short",
      gridlines: { color: "#CBCBDC", count: 19 },
    },
    vAxis: {
      title: "Reports Count",
      titleTextStyle: { fontSize: 22 },
      viewWindow: { min: 0 },
      viewWindowMode: "explicit",
    },
    explorer: {
      actions: ["dragToZoom", "rightClickToReset"],
      axis: "horizontal",
      keepInBounds: true,
    },
    title:
      gqs("other").toUpperCase() +
      "-" +
      gqs("SSID") +
      " Pico Distance Km. Chart. " +
      document
        .getElementById("launched")
        .innerHTML.replace(/&nbsp;/g, "")
        .replace(/z/, "") +
      " UTC, " +
      diaslaunch +
      " days ago. Last received on: " +
      beacon1[0][0].replace(/z/, " ").substring(0, 16) +
      "z" +
      lastseen +
      "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0+? \u2a39 [+]",
  };
  var view = new google.visualization.DataView(data6);
  view.setColumns([0, 1]);
  var table = new google.visualization.LineChart(
    document.getElementById("chart_div"),
  );
  table.draw(view, options);
  document.getElementById("chart_div").style.visibility = "visible";
}
if (gqs("tracker") == "traquito" || gqs("tracker") == "qrplabs") {
  var lofreq = window.fcentral * 1 - 20;
  var hifreq = window.fcentral * 1 + 20;
} else {
  var lofreq = window.fcentral * 1 - 100;
  var hifreq = window.fcentral * 1 + 100;
}
if (gqs("wide") == "on") {
  var lofreq = window.fcentral * 1 - 100;
  var hifreq = window.fcentral * 1 + 100;
}
function drawChart(meterfeet) {
  for (g = 0; g < 16; g++) {
    document.getElementById(g).style.backgroundColor = "#f2f2f2";
  }
  if (meterfeet < 14 && meterfeet != 12) {
    document.getElementById(meterfeet).style.backgroundColor = "orange";
  }
  if (meterfeet == 12) {
    document.getElementById("15").style.backgroundColor = "orange";
  }
  //   if (gqs("detail") == "on") { window.location.href = (window.location.href).replace(/detail=on/, "detail=") }
  var data4 = new google.visualization.DataTable();
  data4.addColumn("datetime", "Hour-UTC");
  data4.addColumn("number", "Height meters");
  data4.addColumn("number", "Height feet");
  data4.addColumn("number", "Solar volts");
  data4.addColumn("number", "Solar elevation °");
  data4.addColumn("number", "Speed Km/h");
  data4.addColumn("number", "Asc/Desc m/s");
  data4.addColumn("number", "Temp °C");
  data4.addColumn("number", "SNR dB (Propagation)");
  data4.addColumn({ type: "string", role: "tooltip" });
  data4.addColumn("number", "Latitude °");
  data4.addColumn("number", "Longitude °");
  data4.addColumn("number", "Frequency Hz");
  data4.addColumn("number", "Temp °F");
  data4.addColumn("number", "Speed Knots");
  data4.addRows(data3);
  var now = new Date();
  lastseenhours =
    (new Date(now.getTime() + now.getTimezoneOffset() * 60000) -
      new Date(redate(trayecto[0][0]))) /
    1000 /
    60 /
    60;
  lastseen = "";
  if (lastseenhours > 0 && lastseenhours < 24) {
    lastseen = ", " + Math.floor(lastseenhours) + " hours ago. ";
  }
  if (lastseenhours > -1 && lastseenhours < 1) {
    lastseen = ", just now. ";
  }
  if (lastseenhours > 24) {
    lastseen = ", " + Math.floor(lastseenhours / 24) + " days ago. ";
  }
  var formatter = new google.visualization.DateFormat({
    pattern: "MMM-dd HH:mm",
  });
  formatter.format(data4, 0);
  let mapCanvas = document.getElementById("map_canvas").getBoundingClientRect();
  document.getElementById("chart_div").style.left = `${mapCanvas.left}px`;
  document.getElementById("chart_div").style.top = `0px`;
  document.getElementById("chart_div").style.height = `${mapCanvas.height}px`;
  document.getElementById("chart_div").style.width = `${mapCanvas.width}px`;

  if (meterfeet == 0) {
    var options = {
      explorer: {
        actions: ["dragToZoom", "rightClickToReset"],
        axis: "horizontal",
        keepInBounds: true,
        maxZoomIn: 0.03,
        maxZoomOut: 4,
      },
      backgroundColor: "#f2f2f2",
      width: window.width,
      height: window.height,
      bottom: 0,
      smoothLine: true,
      lineWidth: 2,
      chartArea: { width: "85%", height: "85%" },
      legend: "top",
      hAxis: { format: "HH:mm\nMMM-dd" },
      vAxis: {
        format: "short",
        gridlines: { color: "#CBCBDC", count: 16 },
      },
      vAxis: {
        title: "Altitude in meters",
        titleTextStyle: { fontSize: 22 },
      },
      title:
        gqs("other").toUpperCase() +
        "-" +
        gqs("SSID") +
        " Pico Height meters Chart. " +
        document
          .getElementById("launched")
          .innerHTML.replace(/&nbsp;/g, "")
          .replace(/z/, "") +
        " UTC, " +
        diaslaunch +
        " days ago. Last received on: " +
        beacon1[0][0].replace(/z/, " ").substring(0, 16) +
        "z" +
        lastseen +
        "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0+? \u2a39 [+]",
    };
  }
  if (meterfeet == 1) {
    var options = {
      explorer: {
        actions: ["dragToZoom", "rightClickToReset"],
        axis: "horizontal",
        keepInBounds: true,
        maxZoomIn: 0.03,
        maxZoomOut: 4,
      },
      backgroundColor: "#f2f2f2",
      width: window.width,
      bottom: 0,
      smoothLine: true,
      lineWidth: 2,
      chartArea: { width: "85%", height: "85%" },
      legend: "top",
      hAxis: { format: "HH:mm\nMMM-dd" },
      vAxis: {
        format: "short",
        gridlines: { color: "#CBCBDC", count: 16 },
      },
      vAxis: {
        title: "Altitude in feet",
        titleTextStyle: { fontSize: 22 },
      },
      title:
        gqs("other").toUpperCase() +
        "-" +
        gqs("SSID") +
        " Pico Height feet Chart. " +
        document
          .getElementById("launched")
          .innerHTML.replace(/&nbsp;/g, "")
          .replace(/z/, "") +
        " UTC, " +
        diaslaunch +
        " days ago. Last received on: " +
        beacon1[0][0].replace(/z/, " ").substring(0, 16) +
        "z" +
        lastseen +
        "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0+? \u2a39 [+]",
    };
  }
  if (meterfeet == 2) {
    var options = {
      explorer: {
        actions: ["dragToZoom", "rightClickToReset"],
        axis: "horizontal",
        keepInBounds: true,
        maxZoomIn: 0.03,
        maxZoomOut: 4,
      },
      crosshair: {
        orientation: "vertical",
        trigger: "focus",
        color: "gray",
      },
      backgroundColor: "#f2f2f2",
      width: window.width,
      bottom: 0,
      smoothLine: true,
      lineWidth: 2,
      legend: "top",
      hAxis: { format: "HH:mm\nMMM-dd" },
      vAxis: {
        format: "short",
        0: {
          gridlines: { color: "#CBCBDC", count: 16 },
          title: "Solar Volts ",
          titleTextStyle: { fontSize: 20 },
        },
        1: {
          gridlines: { color: "transparent", count: 16 },
        },
      },
      series: {
        0: { targetAxisIndex: 0 },
        1: { targetAxisIndex: 1 },
      },
      colors: ["lightblue", "#3366cc"],
      chartArea: { width: "85%", height: "85%", left: "5%" },
      title:
        gqs("other").toUpperCase() +
        "-" +
        gqs("SSID") +
        " Pico Solar volts Chart. " +
        document
          .getElementById("launched")
          .innerHTML.replace(/&nbsp;/g, "")
          .replace(/z/, "") +
        " UTC, " +
        diaslaunch +
        " days ago. Last received on: " +
        beacon1[0][0].replace(/z/, " ").substring(0, 16) +
        "z" +
        lastseen +
        "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0+? \u2a39 [+]",
    };
  }
  if (meterfeet == 3) {
    minelev = 90;
    for (g = 0; g < data3.length; g++) {
      if (data3[g][4] < minelev) {
        minelev = Math.floor(data3[g][4]);
      }
    }
    var options = {
      backgroundColor: "#f2f2f2",
      width: window.width,
      bottom: 0,
      smoothLine: true,
      lineWidth: 2,
      chartArea: { width: "85%", height: "85%" },
      legend: "top",
      hAxis: { format: "HH:mm\nMMM-dd" },
      vAxis: { gridlines: { color: "#CBCBDC", count: 16 } },
      vAxis: {
        viewWindowMode: "explicit",
        viewWindow: { min: minelev },
        title: "Solar elevation °",
        titleTextStyle: { fontSize: 22 },
        format: "#0°",
      },
      explorer: {
        actions: ["dragToZoom", "rightClickToReset"],
        axis: "horizontal",
        keepInBounds: true,
        maxZoomIn: 0.03,
        maxZoomOut: 4,
      },
      title:
        gqs("other").toUpperCase() +
        "-" +
        gqs("SSID") +
        " Pico Solar elevation ° Chart. " +
        document
          .getElementById("launched")
          .innerHTML.replace(/&nbsp;/g, "")
          .replace(/z/, "") +
        " UTC, " +
        diaslaunch +
        " days ago. Last received on: " +
        beacon1[0][0].replace(/z/, " ").substring(0, 16) +
        "z" +
        lastseen +
        "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0+? \u2a39 [+]",
    };
  }
  if (meterfeet == 4) {
    var options = {
      backgroundColor: "#f2f2f2",
      width: window.width,
      bottom: 0,
      smoothLine: true,
      lineWidth: 2,
      chartArea: { width: "85%", height: "85%" },
      legend: "top",
      hAxis: { format: "HH:mm\nMMM-dd" },
      vAxis: { gridlines: { color: "#CBCBDC", count: 16 } },
      vAxis: {
        title: "Solar elevation °",
        titleTextStyle: { fontSize: 22 },
        format: "#0°",
      },
      explorer: {
        actions: ["dragToZoom", "rightClickToReset"],
        axis: "horizontal",
        keepInBounds: true,
        maxZoomIn: 0.03,
        maxZoomOut: 4,
      },
      title:
        gqs("other").toUpperCase() +
        "-" +
        gqs("SSID") +
        " Pico Horizontal Speed Km/h Chart. " +
        document
          .getElementById("launched")
          .innerHTML.replace(/&nbsp;/g, "")
          .replace(/z/, "") +
        " UTC, " +
        diaslaunch +
        " days ago. Last received on: " +
        beacon1[0][0].replace(/z/, " ").substring(0, 16) +
        "z" +
        lastseen +
        "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0+? \u2a39 [+]",
    };

    var options = {
      backgroundColor: "#f2f2f2",
      width: window.width,
      bottom: 0,
      smoothLine: true,
      lineWidth: 2,
      legend: "top",
      hAxis: { format: "HH:mm\nMMM-dd" },
      vAxis: {
        format: "short",
        0: {
          gridlines: { color: "#CBCBDC", count: 16 },
          title: "Horizontal Speed Km/h Chart. ",
          titleTextStyle: { fontSize: 20 },
        },
        1: {
          gridlines: { color: "transparent", count: 16 },
        },
      },
      series: {
        0: { targetAxisIndex: 0 },
        1: { targetAxisIndex: 1 },
      },
      colors: ["lightblue", "#3366cc"],
      chartArea: { width: "85%", height: "85%", left: "5%" },
      explorer: {
        actions: ["dragToZoom", "rightClickToReset"],
        axis: "horizontal",
        keepInBounds: true,
        maxZoomIn: 0.03,
        maxZoomOut: 4,
      },
      title:
        gqs("other").toUpperCase() +
        "-" +
        gqs("SSID") +
        " Horizontal Speed Km/h Chart. " +
        document
          .getElementById("launched")
          .innerHTML.replace(/&nbsp;/g, "")
          .replace(/z/, "") +
        " UTC, " +
        diaslaunch +
        " days ago. Last received on: " +
        beacon1[0][0].replace(/z/, " ").substring(0, 16) +
        "z" +
        lastseen +
        "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0+? \u2a39 [+]",
    };
  }

  if (meterfeet == 12) {
    var options = {
      backgroundColor: "#f2f2f2",
      width: window.width,
      bottom: 0,
      smoothLine: true,
      lineWidth: 2,
      chartArea: { width: "85%", height: "85%" },
      legend: "top",
      hAxis: { format: "HH:mm\nMMM-dd" },
      vAxis: { gridlines: { color: "#CBCBDC", count: 16 } },
      vAxis: {
        title: "Solar elevation °",
        titleTextStyle: { fontSize: 22 },
        format: "#0°",
      },
      title:
        gqs("other").toUpperCase() +
        "-" +
        gqs("SSID") +
        " Pico Horizontal Speed Knots Chart. " +
        document
          .getElementById("launched")
          .innerHTML.replace(/&nbsp;/g, "")
          .replace(/z/, "") +
        " UTC, " +
        diaslaunch +
        " days ago. Last received on: " +
        beacon1[0][0].replace(/z/, " ").substring(0, 16) +
        "z" +
        lastseen +
        "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0+? \u2a39 [+]",
    };

    var options = {
      explorer: {
        actions: ["dragToZoom", "rightClickToReset"],
        axis: "horizontal",
        keepInBounds: true,
        maxZoomIn: 0.03,
        maxZoomOut: 4,
      },
      backgroundColor: "#f2f2f2",
      width: window.width,
      bottom: 0,
      smoothLine: true,
      lineWidth: 2,
      legend: "top",
      hAxis: { format: "HH:mm\nMMM-dd" },
      vAxis: {
        format: "short",
        0: {
          gridlines: { color: "#CBCBDC", count: 16 },
          title: "Horizontal Speed Knots Chart. ",
          titleTextStyle: { fontSize: 20 },
        },
        1: {
          gridlines: { color: "transparent", count: 16 },
        },
      },
      series: {
        0: { targetAxisIndex: 0 },
        1: { targetAxisIndex: 1 },
      },
      colors: ["lightblue", "#3366cc"],
      chartArea: { width: "85%", height: "85%", left: "5%" },
      title:
        gqs("other").toUpperCase() +
        "-" +
        gqs("SSID") +
        " Horizontal Speed Knots Chart. " +
        document
          .getElementById("launched")
          .innerHTML.replace(/&nbsp;/g, "")
          .replace(/z/, "") +
        " UTC, " +
        diaslaunch +
        " days ago. Last received on: " +
        beacon1[0][0].replace(/z/, " ").substring(0, 16) +
        "z" +
        lastseen +
        "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0+? \u2a39 [+]",
    };
  }

  if (meterfeet == 5) {
    var options = {
      crosshair: {
        orientation: "vertical",
        trigger: "focus",
        color: "gray",
      },
      backgroundColor: "#f2f2f2",
      width: window.width,
      bottom: 0,
      smoothLine: true,
      lineWidth: 2,
      legend: "top",
      hAxis: { format: "HH:mm\nMMM-dd" },
      vAxis: {
        format: "short",
        0: {
          gridlines: { color: "#CBCBDC", count: 16 },
          title: "Ascent/Descent m/s",
          titleTextStyle: { fontSize: 20 },
        },
        1: {
          gridlines: { color: "transparent", count: 16 },
        },
      },
      series: {
        0: { targetAxisIndex: 0 },
        1: { targetAxisIndex: 1 },
      },
      colors: ["lightblue", "#3366cc"],
      chartArea: { width: "85%", height: "85%", left: "5%" },
      explorer: {
        actions: ["dragToZoom", "rightClickToReset"],
        axis: "horizontal",
        keepInBounds: true,
        maxZoomIn: 0.03,
        maxZoomOut: 4,
      },
      title:
        gqs("other").toUpperCase() +
        "-" +
        gqs("SSID") +
        " Pico Asc/Desc m/s Chart. " +
        document
          .getElementById("launched")
          .innerHTML.replace(/&nbsp;/g, "")
          .replace(/z/, "") +
        " UTC, " +
        diaslaunch +
        " days ago. Last received on: " +
        beacon1[0][0].replace(/z/, " ").substring(0, 16) +
        "z" +
        lastseen +
        "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0+? \u2a39 [+]",
    };
  }
  if (meterfeet == 6) {
    var options = {
      backgroundColor: "#f2f2f2",
      width: window.width,
      bottom: 0,
      smoothLine: true,
      lineWidth: 2,
      legend: "top",
      hAxis: { format: "HH:mm\nMMM-dd" },
      vAxis: {
        format: "short",
        0: {
          gridlines: { color: "#CBCBDC", count: 16 },
          title: "Temperature °C",
          titleTextStyle: { fontSize: 20 },
          pattern: "##C",
        },
        1: {
          gridlines: { color: "transparent", count: 16 },
        },
      },
      series: {
        0: { targetAxisIndex: 0 },
        1: { targetAxisIndex: 1 },
      },
      colors: ["lightblue", "#3366cc"],
      chartArea: { width: "85%", height: "85%", left: "5%" },
      explorer: {
        actions: ["dragToZoom", "rightClickToReset"],
        axis: "horizontal",
        keepInBounds: true,
        maxZoomIn: 0.03,
        maxZoomOut: 4,
      },
      title:
        gqs("other").toUpperCase() +
        "-" +
        gqs("SSID") +
        " Pico Temp °C Chart. " +
        document
          .getElementById("launched")
          .innerHTML.replace(/&nbsp;/g, "")
          .replace(/z/, "") +
        " UTC, " +
        diaslaunch +
        " days ago. Last received on: " +
        beacon1[0][0].replace(/z/, " ").substring(0, 16) +
        "z" +
        lastseen +
        "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0+? \u2a39 [+]",
    };
  }
  if (meterfeet == 7) {
    var options = {
      legend: "none",
      backgroundColor: "#f2f2f2",
      width: window.width,
      bottom: 0,
      smoothLine: true,
      lineWidth: 2,
      chartArea: { width: "85%", height: "85%" },
      legend: "top",
      hAxis: { format: "HH:mm\nMMM-dd" },
      vAxis: { gridlines: { color: "#CBCBDC", count: 16 } },
      vAxis: {
        title: "SNR dB (Propagation)",
        titleTextStyle: { fontSize: 22 },
      },
      explorer: {
        actions: ["dragToZoom", "rightClickToReset"],
        axis: "horizontal",
        keepInBounds: true,
        maxZoomIn: 0.03,
        maxZoomOut: 4,
      },
      title:
        gqs("other").toUpperCase() +
        "-" +
        gqs("SSID") +
        " Pico SNR Chart. " +
        document
          .getElementById("launched")
          .innerHTML.replace(/&nbsp;/g, "")
          .replace(/z/, "") +
        " UTC, " +
        diaslaunch +
        " days ago. Last received on: " +
        beacon1[0][0].replace(/z/, " ").substring(0, 16) +
        "z (click DX)" +
        lastseen +
        "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0+? \u2a39 [+]",
    };
  }
  if (meterfeet == 8) {
    var options = {
      explorer: {
        actions: ["dragToZoom", "rightClickToReset"],
        axis: "horizontal",
        keepInBounds: true,
        maxZoomIn: 0.03,
        maxZoomOut: 4,
      },
      crosshair: {
        orientation: "vertical",
        trigger: "focus",
        color: "gray",
      },
      selectionMode: "multiple",
      tooltip: { trigger: "selection" },
      aggregationTarget: "series",
      backgroundColor: "#f2f2f2",
      width: window.width,
      bottom: 0,
      smoothLine: true,
      lineWidth: 2,
      legend: "top",
      hAxis: { format: "HH:mm\nMMM-dd" },
      vAxis: {
        format: "short",
        0: {
          gridlines: { color: "#CBCBDC", count: 16 },
          title: " Latitude ° ",
          titleTextStyle: { fontSize: 20 },
        },
        1: {
          gridlines: { color: "transparent", count: 16 },
        },
      },
      series: {
        0: { targetAxisIndex: 0, lineWidth: 4 },
        1: { targetAxisIndex: 1, lineWidth: 2 },
        2: { targetAxisIndex: 1, lineWidth: 2 },
      },
      colors: ["orange", "#3366cc", "red", "brown", "green", "#9977bb"],
      chartArea: { width: "85%", height: "85%", left: "5%" },
      explorer: {
        actions: ["dragToZoom", "rightClickToReset"],
        axis: "horizontal",
        keepInBounds: true,
        maxZoomIn: 0.03,
        maxZoomOut: 4,
      },
      title:
        gqs("other").toUpperCase() +
        "-" +
        gqs("SSID") +
        " Pico  Multiple Chart. " +
        document
          .getElementById("launched")
          .innerHTML.replace(/&nbsp;/g, "")
          .replace(/z/, "") +
        " UTC, " +
        diaslaunch +
        " days ago. Last received on: " +
        beacon1[0][0].replace(/z/, " ").substring(0, 16) +
        "z" +
        lastseen +
        "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0+? \u2a39 [+]",
    };
  }
  if (meterfeet == 9) {
    var options = {
      legend: "none",
      explorer: {
        actions: ["dragToZoom", "rightClickToReset"],
        axis: "horizontal",
        keepInBounds: true,
        maxZoomIn: 0.03,
        maxZoomOut: 4,
      },
      backgroundColor: "#f2f2f2",
      width: window.width,
      bottom: 0,
      smoothLine: true,
      lineWidth: 2,
      chartArea: { width: "85%", height: "85%" },
      legend: "top",
      hAxis: { format: "HH:mm\nMMM-dd" },
      vAxis: { gridlines: { color: "#CBCBDC", count: 16 } },
      vAxis: {
        title:
          "\u25C1\u00A0West\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0Longitude °\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0East\u00A0\u25B7",
        titleTextStyle: { fontSize: 22, italic: false },
        format: "##0°",
      },
      title:
        gqs("other").toUpperCase() +
        "-" +
        gqs("SSID") +
        " Longitude ° " +
        document
          .getElementById("launched")
          .innerHTML.replace(/&nbsp;/g, "")
          .replace(/z/, "") +
        " UTC, " +
        diaslaunch +
        " days ago. Last received on: " +
        beacon1[0][0].replace(/z/, " ").substring(0, 16) +
        "z" +
        lastseen +
        "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0+? \u2a39 [+]",
    };
  }
  delta = addplusm.replace(" \u25B3", "").replace("Hz. ", "") * 1;
  if (gqs("wide") && gqs("wide") == "on") {
    freqbaja = Math.round(lofreq / 1000) * 1000;
    freqalta = freqbaja + 200;
  } else {
    freqbaja = lofreq;
    freqalta = hifreq;
  }
  if (meterfeet == 10) {
    var options = {
      legend: "none",
      explorer: {
        actions: ["dragToZoom", "rightClickToReset"],
        axis: "horizontal",
        keepInBounds: true,
        maxZoomIn: 0.03,
        maxZoomOut: 4,
      },
      backgroundColor: "#f2f2f2",
      width: window.width,
      bottom: 0,
      smoothLine: true,
      lineWidth: 2,
      chartArea: { width: "85%", height: "85%" },
      legend: "top",
      hAxis: { format: "HH:mm\nMMM-dd" },
      vAxis: {
        gridlineColor: "#ff0000",
        title: "Frequency Hz ",
        titleTextStyle: { fontSize: 17, italic: true },
        format: "######",
        ticks: [freqbaja, (lofreq + hifreq) / 2 + delta, freqalta],
      },
      title:
        gqs("other").toUpperCase() +
        "-" +
        gqs("SSID") +
        " Spotters Frequency Hz. " +
        addplusm +
        document
          .getElementById("launched")
          .innerHTML.replace(/&nbsp;/g, "")
          .replace(/z/, "") +
        " UTC, " +
        diaslaunch +
        " days ago. Last received on: " +
        beacon1[0][0].replace(/z/, " ").substring(0, 16) +
        "z" +
        lastseen +
        "\u00A0+? \u2a39 [+]",
    };
  }
  if (meterfeet == 11) {
    var options = {
      backgroundColor: "#f2f2f2",
      width: window.width,
      bottom: 0,
      smoothLine: true,
      lineWidth: 2,
      legend: "top",
      hAxis: { format: "HH:mm\nMMM-dd" },
      vAxis: {
        format: "short",
        0: {
          gridlines: { color: "#CBCBDC", count: 16 },
          title: "Temperature °F",
          titleTextStyle: { fontSize: 20 },
          pattern: "##F",
        },
        1: {
          gridlines: { color: "transparent", count: 16 },
        },
      },
      series: {
        0: { targetAxisIndex: 0 },
        1: { targetAxisIndex: 1 },
      },
      colors: ["lightblue", "#3366cc"],
      chartArea: { width: "85%", height: "85%", left: "5%" },
      explorer: {
        actions: ["dragToZoom", "rightClickToReset"],
        axis: "horizontal",
        keepInBounds: true,
        maxZoomIn: 0.03,
        maxZoomOut: 4,
      },
      title:
        gqs("other").toUpperCase() +
        "-" +
        gqs("SSID") +
        " Pico Temp °F Chart. " +
        document
          .getElementById("launched")
          .innerHTML.replace(/&nbsp;/g, "")
          .replace(/z/, "") +
        " UTC, " +
        diaslaunch +
        " days ago. Last received on: " +
        beacon1[0][0].replace(/z/, " ").substring(0, 16) +
        "z" +
        lastseen +
        "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0+? \u2a39 [+]",
    };
  }
  var view = new google.visualization.DataView(data4);
  if (meterfeet < 6 && meterfeet != 2) {
    view.setColumns([0, meterfeet + 1]);
  }
  if (meterfeet == 6) {
    view.setColumns([0, 1, 7]);
  }
  if (meterfeet == 11) {
    view.setColumns([0, 3, 13]);
  } //Fahrenit
  if (meterfeet == 2) {
    view.setColumns([0, 1, 3]);
  }
  if (meterfeet == 7) {
    view.setColumns([0, 8, 9]);
  }
  if (meterfeet == 4) {
    view.setColumns([0, 1, 5]);
  } //Km/h
  if (meterfeet == 12) {
    view.setColumns([0, 1, 14]);
  } //Knots
  if (meterfeet == 8) {
    view.setColumns([
      0,
      4,
      10,
      13,
      7,
      {
        calc: function (dt, row) {
          var value = dt.getValue(row, 3);
          if (value !== null) {
            return { v: value * 10 };
          }
        },
        label: "Solar Volts x 10",
        type: "number",
      },
      {
        calc: function (dt, row) {
          var value = dt.getValue(row, 2);
          if (value !== null) {
            return { v: value / 1000 };
          }
        },
        label: "Height Kfeet",
        type: "number",
        format: "$##,###",
      },
    ]);
  }
  if (meterfeet == 10) {
    view.setColumns([0, 12]);
  }
  if (meterfeet == 9) {
    view.setColumns([0, 11]);
  }
  if (meterfeet == 5) {
    view.setColumns([0, 1, 6]);
  }
  var table = new google.visualization.LineChart(
    document.getElementById("chart_div"),
  );
  table.draw(view, options);
  document.getElementById("chart_div").style.visibility = "visible";
  meterfeet = meterfeet + 1;
  if (meterfeet > 13) {
    document.getElementById("chart_div").style.visibility = "hidden";
    meterfeet = 0;
    return;
  }
}
function transpose(matrix) {
  let res = Array(matrix[0].length)
    .fill()
    .map(() => []);
  for (let i = 0; i < res.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      res[i][j] = matrix[j][i];
    }
  }
  return res;
}
function ponersun1(fecha, locator, alturam) {
  if (!alturam) {
    alturam = 0;
  }
  if (locator.length > 3) {
    Sunelevation =
      SunCalc.getPosition(
        fecha,
        loc2latlon(locator).loclat,
        loc2latlon(locator).loclon,
        alturam,
      ).altitude * radian;
  } else {
    Sunelevation = "&nbsp;";
  }
  return Sunelevation;
}
var hidet = false;
var isIOS = false;
qrpchange = false;
// function borrarother() {
//   document.formu.other.value = "";
// }

function setid() {
  window.parent.postMessage({ callbackName: "setid" }, window.PARENT_URL);
}

function gohidet() {
  window.parent.postMessage({ callbackName: "gohidet" }, window.PARENT_URL);
}

function gohide() {
  window.parent.postMessage({ callbackName: "gohide" }, window.PARENT_URL);
}

function gowinds() {
  window.parent.postMessage({ callbackName: "gowinds" }, window.PARENT_URL);
}

function gowinds1() {
  window.parent.postMessage({ callbackName: "gowinds1" }, window.PARENT_URL);
}

function gowinds2(oldlon, oldlat) {
  window.parent.postMessage(
    { callbackName: "gowinds2", props: { oldlon, oldlat } },
    window.PARENT_URL,
  );
}

function goplanes() {
  window.parent.postMessage({ callbackName: "goplanes" }, window.PARENT_URL);
}

function goships() {
  window.parent.postMessage({ callbackName: "goships" }, window.PARENT_URL);
}

function showprop() {
  window.parent.postMessage({ callbackName: "showprop" }, window.PARENT_URL);
}

function right(str, length) {
  return str.toString().slice(-length);
}
