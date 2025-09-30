var saveglobo;
var saveestaciones;
var velest;
var Kmrecorridos = 0;
var TZD = new Date().getTimezoneOffset() / 60 / 24;
var txt = "";
var hide = false;
var saveglobo;
var saveestaciones;
var velest;
var meterfeet = 0;
var prevaltutext;
var mapainicio = [];
window.comentfull = "";
window.comentariosballoon = "";

var diaslaunch = Math.floor(
  (new Date() - new Date(window.getLaunchDate())) / (1000 * 60 * 60 * 24),
);

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
  var url = window.parent.document.location + "";
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
function gourl(url) {
  if (location.host == "lu7aa.com.ar") {
    url = url.replace(/.org/, ".com.ar");
  }
  if (location.host == "localhost") {
    //url = url.replace(/wspr./, "wsprx.");
    url = url.replace(/lu7aa.org/, "localhost/lu7aa.org.ar");
  }
  //    if (url.indexOf("qrplabs") > 0 || url.indexOf("traquito") > 0) {url=url+"&qp=on"}
  window.parent.document.location.href = url;
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
      return { loclat: loclat, loclon: loclon, locname: locname };
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

function gradosminutos(deg) {
  if (deg < 0) {
    deg = -deg;
  }
  var d = Math.floor(deg);
  var resto = (deg - d) * 60;
  var resto1 = deg - d - Math.floor(resto / 60);
  return d * 100 + Math.floor(resto) + resto1;
}

var aprs4;
latsave = " ";
lonsave = " ";
Alturasave = " ";

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
  aprs4 = `${aprs4} \ WSPR ${tok3} ${HOST_URL}/wsprx?other=${gqs("other")}`;
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
  //    var xhr = new XMLHttpRequest();
  //    var urlpost = "http://amsat.org.ar/elnet.php?datos=" + aprs4;
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

  if (typeof SSID == "undefined") {
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
            addl = `&nbsp;&nbsp;<a href='${HOST_URL}/dx?por=H&tz=0&be=&multiplecalls=Select&scale=Lin&bs=B&call=x1*&band=14&timelimit=1209600&sel=0&t=m' target='_blank' style='color:navy;line-height:15px;font-size:13px;text-decoration:none;background-color:gold;font-weight:normal;' title='The prefix for telem will be X1 followed by the letters BAA to JJJ.&#13The letters A-J correspond to the digits 0-9, To compute the count,&#13;subtract 100 from the digits corresponding to the three letter code.'>&nbsp;Click for <span style='font-size:14px;'>&beta;/&gamma;</span> Radiation Particle Count&nbsp;</a>`;
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
                " ACTUAL POSITION TO APRS.FI & SONDEHUB&nbsp;&nbsp;</a><span style='text-shadow:0 0;color:#000000;font-size:11px;line-height:9px;font-family:Tahoma,Arial;'>&nbsp;&nbsp;&nbsp;REPEAT APRS.FI & SONDEHUB UPLOADS <input onclick='document.getElementById('enviar').click();' type=checkbox name='repito' id='repito' style='margin:0 0 0 0;'> ON 10' AUTO-UPDATE</span>" +
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
                "<span style='color:#000000;font-weight:normal;'>Wide:<input type='checkbox' id='wide' name='wide' title='Check for wider reception&#13 for your second TLM&#13; use if your emission&#13 is way off frequency' onclick=\"document.getElementById('enviar').click();\">&nbsp;Central QRG: " +
                window.fcentral +
                " Hz          </span>     <a id='repetir' name='repetir' href='#' ondblclick='noupload()'>&nbsp;&nbsp;DOUBLE CLICK HERE TO UPLOAD " +
                licenciaaprs.toUpperCase().replace(/#/g, "") +
                "-" +
                SSID +
                " ACTUAL POSITION TO APRS.FI & SONDEHUB&nbsp;&nbsp;</a><span style='text-shadow:0 0;color:#000000;font-size:11px;line-height:9px;font-family:Tahoma,Arial;'>&nbsp;&nbsp;&nbsp;REPEAT APRS.FI & SONDEHUB UPLOADS <input onclick=\"document.getElementById('enviar').click();\" type=checkbox name='repito' id='repito' style='margin:0 0 0 0;'> ON 10' AUTO-UPDATE</span>" +
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
    '</head><body bgcolor="#172447" color="#ffffff" style="font-size:20px;line-height:18px;font-family:Tahoma,Arial;font-weight:bold;color:cyan;"  onclick="self.close();")>';
  codata =
    codata +
    "<center><br>Not Uploaded to aprs.fi<br><br>Speed seen is too fast or<br><br>the position is same as last<br><br>on " +
    trayecto[0][0] +
    "<br><br>Keep UPLOADS <img src='" +
    immageSrcUrl["mark"] +
    "' border=0> Marked</center>";
  if (gqs("SSID") != "") {
    ademas = gqs("other").toUpperCase() + "-" + gqs("SSID");
  }
  codata =
    codata +
    "<center><br style='line-height:12px;'><a href='http://amsat.org.ar/elnet.php?datos=" +
    aprs4 +
    "' target='_blank' title='Upload' style='font-size:12px;line-height:14px;color:cyan;'>Upload " +
    ademas +
    " anyway to aprs.fi</a></center>";
  codata = codata + "</body></html>";
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
function gohide() {
  licencia = gqs("other").toUpperCase();
  if (gqs("SSID") != "") {
    licencia = licencia + "<br>-" + gqs("SSID");
  }
  if (hide) {
    hide = false;
    document.getElementById("hide").innerText = "HideSpots";
    saveMapState();
    loadMapState();
    ponermapa(locations[0][0], licencia);
    document.getElementById("globo").innerHTML = saveglobo;
    document.getElementById("globo").click();
  } else {
    hide = true;
    document.getElementById("hide").innerText = "ShowSpots";
    saveMapState();
    loadMapState();
    ponermapa(locations[0][0], licencia);
    document.getElementById("globo").innerHTML = saveglobo;
    document.getElementById("globo").click();
  }
}
function gohidet() {
  licencia = gqs("other").toUpperCase();
  if (gqs("SSID") != "") {
    licencia = licencia + "<br>-" + gqs("SSID");
  }
  if (hidet) {
    hidet = false;
    document.getElementById("hidet").innerText = "HideTrack";
    saveMapState();
    loadMapState();
    ponermapa(locations[0][0], licencia);
    document.getElementById("globo").innerHTML = saveglobo;
    document.getElementById("globo").click();
  } else {
    hidet = true;
    document.getElementById("hidet").innerText = "ShowTrack";
    saveMapState();
    loadMapState();
    ponermapa(locations[0][0], licencia);
    document.getElementById("globo").innerHTML = saveglobo;
    document.getElementById("globo").click();
  }
}
function gowinds() {
  token = ",";
  url =
    "https://www.windy.com/en/-Mostrar---a%C3%B1adir-m%C3%A1s-capas/overlays?cloudtop,";
  leyenda = "CLOUD";
  EXTRA = ",5";
  lugarlatlong =
    loctolatlon(locations[0][0]).lat + token + loctolatlon(locations[0][0]).lon;
  irhacia = url + lugarlatlong + EXTRA;
  window.open(irhacia, "_blank");
}
function gowinds1() {
  token = "";
  altuv = 0;
  for (c = 0; c < 5; c++) {
    if (beacon1[c][3] * 1 > 500) {
      altuv = beacon1[c][3] * 1;
    }
  }
  url = "https://www.ventusky.com/?p=";
  leyenda = "12Winds";
  EXTRA1 =
    "&t=" +
    beacon1[0][0].substring(0, 4) +
    beacon1[0][0].substring(5, 7) +
    beacon1[0][0].substring(8, 10) +
    "/" +
    (100 + Math.floor(beacon1[0][0].substring(11, 13) / 3) * 3)
      .toString()
      .slice(-2) +
    "00";
  EXTRA = ";6&l=wind-200hpa" + EXTRA1;
  if (altuv < 10000) {
    EXTRA = ";6&l=wind-300hpa" + EXTRA1;
  }
  if (altuv < 7000) {
    EXTRA = ";6&l=wind-500hpa" + EXTRA1;
  }
  if (altuv < 5000) {
    EXTRA = ";6&l=wind-600hpa" + EXTRA1;
  }
  if (altuv < 1000) {
    EXTRA = ";6&l=wind-900hpa" + EXTRA1;
  }
  if (altuv < 100) {
    EXTRA = ";6&l=wind-10m" + EXTRA1;
  }
  lugarlatlong =
    loctolatlon(locations[0][0]).lat + ";" + loctolatlon(locations[0][0]).lon;
  irhacia = url + lugarlatlong + EXTRA;
  window.open(irhacia, "_blank");
}
function gowinds2({ oldlon, oldlat }) {
  console.log("oldlon:", oldlon, "oldlat:", oldlat);
  token = "";
  url = "https://www.ventusky.com/?p=";
  leyenda = "12Winds";
  EXTRA = ";6&l=wind-200hpa";
  if (beacon1[0][3] * 1 < 10000) {
    EXTRA = ";6&l=wind-300hpa";
  }
  if (beacon1[0][3] * 1 < 7000) {
    EXTRA = ";6&l=wind-500hpa";
  }
  if (beacon1[0][3] * 1 < 5000) {
    EXTRA = ";6&l=wind-600hpa";
  }
  if (beacon1[0][3] * 1 < 1000) {
    EXTRA = ";6&l=wind-900hpa";
  }
  if (beacon1[0][3] * 1 < 100) {
    EXTRA = ";6&l=wind-10m";
  }
  lugarlatlong = oldlat + ";" + oldlon;
  irhacia = url + lugarlatlong + EXTRA;
  window.open(irhacia, "_blank");
}
function goplanes() {
  token = ",";
  url = "https://www.flightradar24.com/";
  leyenda = "PLANES";
  EXTRA = "/6";
  lugarlatlong =
    (loctolatlon(locations[0][0]).lat * 1).toFixed(2) +
    token +
    (loctolatlon(locations[0][0]).lon * 1).toFixed(2);
  irhacia = url + lugarlatlong + EXTRA;
  window.open(irhacia, "_blank");
}
function goships() {
  token = "";
  url =
    "https://www.marinetraffic.com/en/ais/home/" +
    "centerx:" +
    loctolatlon(locations[0][0]).lon +
    "/centery:" +
    loctolatlon(locations[0][0]).lat;
  leyenda = "SHIPS";
  EXTRA = "/zoom:6";
  lugarlatlong = "";
  irhacia = url + lugarlatlong + EXTRA;
  window.open(irhacia, "_blank");
}
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
  console.log("ofset-l", document.getElementById("map_canvas").offsetLeft);
  document.getElementById("chart_div").style.left =
    document.getElementById("map_canvas").offsetLeft;
  //document.getElementById("chart_div").style.top =
  // `${document.getElementById("map_canvas").getBoundingClientRect().top}px`;
  var options = {
    backgroundColor: "#f2f2f2",
    width: window.width,
    bottom: 0,
    smoothLine: true,
    lineWidth: 2,
    chartArea: { width: "85%", height: "85%" },
    legend: "top",
    hAxis: { format: "##,###Km" },
    vAxis: { format: "short", gridlines: { color: "#CBCBDC", count: 19 } },
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

  document.getElementById("chart_div").style.height = `${
    document.getElementById("gmap_chart_container").clientHeight
  }px`;
  document.getElementById("chart_div").style.width = `${
    document.getElementById("gmap_chart_container").clientWidth
  }px`;

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
      vAxis: { format: "short", gridlines: { color: "#CBCBDC", count: 16 } },
      vAxis: { title: "Altitude in meters", titleTextStyle: { fontSize: 22 } },
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
      vAxis: { format: "short", gridlines: { color: "#CBCBDC", count: 16 } },
      vAxis: { title: "Altitude in feet", titleTextStyle: { fontSize: 22 } },
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
      crosshair: { orientation: "vertical", trigger: "focus", color: "gray" },
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
        1: { gridlines: { color: "transparent", count: 16 } },
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
        1: { gridlines: { color: "transparent", count: 16 } },
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
        1: { gridlines: { color: "transparent", count: 16 } },
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
      crosshair: { orientation: "vertical", trigger: "focus", color: "gray" },
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
        1: { gridlines: { color: "transparent", count: 16 } },
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
        1: { gridlines: { color: "transparent", count: 16 } },
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
      crosshair: { orientation: "vertical", trigger: "focus", color: "gray" },
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
        1: { gridlines: { color: "transparent", count: 16 } },
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
        1: { gridlines: { color: "transparent", count: 16 } },
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
function carga() {
  var isIOS = (function () {
    var iosQuirkPresent = function () {
      var audio = new Audio();

      audio.volume = 0.5;
      return audio.volume === 1; // volume cannot be changed from "1" on iOS 12 and below
    };

    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    var isAppleDevice = navigator.userAgent.includes("Macintosh");
    var isTouchScreen = navigator.maxTouchPoints >= 1; // true for iOS 13 (and hopefully beyond)
  })();
  if (!gqs("tracker") && gqs("other")) {
    settracker();
  }
  document.cookie = "pantalla=''";
  document.cookie =
    "pantalla=" + window.screen.width + "x" + window.screen.height;
  if (gqs("launch")) {
    document.getElementById("launched").innerHTML =
      " Launch: " +
      gqs("launch").substring(0, 4) +
      "-" +
      gqs("launch").substring(4, 6) +
      "-" +
      gqs("launch").substring(6, 8) +
      " " +
      gqs("launch").substring(8, 10) +
      ":" +
      gqs("launch").substring(10, 12) +
      ":" +
      gqs("launch").substring(12, 14) +
      "z ";
  }
  if (gqs("limit")) {
    formu.limit.value = gqs("limit");
  }
  var grafico = function () {};
  Function.prototype.make = function () {
    p = 0;
    data3 = Create2DArray(beacon1.length, 15);
    if (gqs("timeslot")) {
      var pts = (gqs("timeslot") * 1 + 8).toString().slice(-1);
    }
    beaconlocsave = " ";
    saveal = 0;
    lowcheck = 1;
    sw = false;
    lastsunelevation = 0;
    var savespeed = 0;
    oldtime = "";
    oldloc = "";
    swok = false;
    savetemp = 0;
    dista1 = transpose(dista);

    for (g = 84; g > 0; g--) {
      //if (dista[1][g] > 0) {
      if (dista[g] > 0) {
        break;
      }
    }
    data5 = Create2DArray(dista1.length, 2);
    for (s = 0; s < g + 2; s++) {
      for (t = 0; t < 2; t++) {
        data5[s][t] = dista1[s][t];
      }
    }
    for (s = beacon1.length - 1; s > 0; s--) {
      alt = beacon1[s - 1][3] * 1;
      if (alt > 9800 && Math.abs(beacon1[s][3] * 1 - alt) / alt > 0.04) {
        saltar = true;
      } else {
        saltar = false;
      } // this checks if actual height is 4 % bigger or lower than previous height then this height omited
      if (
        !saltar &&
        beacon1[s][0] != beacon1[s - 1][0] &&
        beacon1[s][3] * 1 < 16000
      ) {
        swok = true;
        data3[p][0] = new Date(redate(beacon1[s - 1][0]));
        if (gqs("tracker").replace("#", "") != "zachtek1") {
          data3[p][1] = beacon1[s][3] * 1;
          if (data3[p][1] > 0) {
            saveal = data3[p][1];
          }
          data3[p][2] = Math.floor((beacon1[s][3] * 3.28084) / 50) * 50;
          if (data3[p][1] == 0) {
            data3[p][1] = saveal;
            data3[p][2] = Math.floor((saveal * 3.28084) / 50) * 50;
          }
        } else {
          data3[p][1] = 0;
          data3[p][2] = 0;
          if (beacon1[s][3] * 1 > 0) {
            data3[p][1] = beacon1[s][3] * 1;
            saveal = data3[p][1] * 1;
            data3[p][2] = Math.floor((beacon1[s][3] * 3.28084) / 50) * 50;
          }
        }
        if (gqs("tracker").replace("#", "") == "zachtek1" && data3[p][1] == 0) {
          data3[p][1] = saveal;
          data3[p][2] = Math.floor((saveal * 3.28084) / 50) * 50;
        }
        if (gqs("tracker") != "wb8elk") {
          data3[p][3] = 0;
        }
        if (beacon1[s][4] != "? " && beacon1[s][4] * 1 > 2) {
          data3[p][3] = beacon1[s][4] * 1;
        }
        fechao = new Date(
          beacon1[s - 1][0].replace(/ /, "T").replace(/z/, "Z"),
        );
        var result = fechao.setDate(fechao.getDate()); // + 120000;
        data3[p][4] =
          Math.floor(
            ponersun1(
              new Date(result),
              beacon1[s - 1][1],
              beacon1[s - 1][3] * 1,
            ) * 10,
          ) / 10;
        if (gqs("tracker") != "wb8elk") {
          if (beacon1[s][5] * 1 > 0 && sw == false) {
            savespeed = beacon1[s][5] * 1;
            sw = true;
          }
          if (
            beacon1[s][5] * 1 > 0 &&
            savespeed < 240 &&
            (beacon1[s][5] * 1) / savespeed > 0.2 &&
            (beacon1[s][5] * 1) / savespeed < 5
          ) {
            data3[p][5] = beacon1[s][5] * 1;
            savespeed = beacon1[s][5] * 1;
          } else {
            data3[p][5] = savespeed;
          }
        } else {
          distanciaant =
            crsdist(
              loc2latlon(beacon1[s][1]).loclat,
              loc2latlon(beacon1[s][1]).loclon,
              loc2latlon(beacon1[s - 1][1]).loclat,
              loc2latlon(beacon1[s - 1][1]).loclon,
            ).distance * 1.852;
          secondsant =
            (new Date(beacon1[s - 1][0].replace(/ /, "T").replace(/z/, "Z")) -
              new Date(beacon1[s][0].replace(/ /, "T").replace(/z/, "Z"))) /
            1000;
          velocidadant = (distanciaant * 3600) / secondsant;
          if (velocidadant > 1 && sw == false) {
            savespeed = velocidadant;
            sw = true;
          }
          if (
            velocidadant > 0 &&
            velocidadant < 240 &&
            velocidadant / savespeed > 0.2 &&
            velocidadant / savespeed < 5
          ) {
            data3[p][5] = Math.floor(velocidadant);
            savespeed = data3[p][5];
          } else {
            data3[p][5] = savespeed;
          }
        }
        if (gqs("tracker") == "traquito" || gqs("tracker") == "qrplabs") {
          data3[p][5] = (beacon1[s - 1][5] * 1 + beacon1[s][5] * 1) / 2;
        }
        if (gqs("tracker").replace("#", "") == "zachtek1" && s > 1) {
          minutesdiff =
            (new Date(beacon1[s - 2][0].replace(/ /, "T").replace(/z/, "Z")) -
              new Date(beacon1[s - 1][0].replace(/ /, "T").replace(/z/, "Z"))) /
            1000 /
            60;
          if (minutesdiff == 2) {
            pts = beacon1[s - 2][0].substring(15, 16);
          }
        }
        if (
          gqs("tracker").replace("#", "") == "zachtek1" &&
          beacon1[s - 1][0].substring(15, 16) == pts
        ) {
          for (k = s; k < beacon1.length - 1; k++) {
            if (beacon1[k][0].substring(15, 16) == pts) {
              break;
            }
          }
          distanciaant =
            crsdist(
              loc2latlon(beacon1[s - 1][1]).loclat,
              loc2latlon(beacon1[s - 1][1]).loclon,
              loc2latlon(beacon1[k][1]).loclat,
              loc2latlon(beacon1[k][1]).loclon,
            ).distance * 1.852; //* 1.852;
          secondsant =
            (new Date(beacon1[s - 1][0].replace(/ /, "T").replace(/z/, "Z")) -
              new Date(beacon1[k][0].replace(/ /, "T").replace(/z/, "Z"))) /
            1000;
          velocidadant = ((distanciaant * 3600) / secondsant) * 1.852;
          if (velocidadant > 10 && velocidadant < 240 && sw == false) {
            savespeed = velocidadant;
            sw = true;
          }
          if (
            velocidadant > 0 &&
            velocidadant < 240 &&
            velocidadant / savespeed > 0.2 &&
            velocidadant / savespeed < 5
          ) {
            data3[p][5] = Math.floor(velocidadant);
            savespeed = data3[p][5];
          } else {
            data3[p][5] = savespeed;
          }
        }
        if (
          gqs("tracker").replace("#", "") == "zachtek1" &&
          beacon1[s - 1][1] != beacon1[s][1]
        ) {
          oldloc = beacon1[s - 1][1];
          oldtime = beacon1[s - 1][0];
          if (oldtime != "" && beacon1[s][0].substring(15, 16) == pts) {
            distanciaant =
              crsdist(
                loc2latlon(beacon1[s][1]).loclat,
                loc2latlon(beacon1[s][1]).loclon,
                loc2latlon(oldloc).loclat,
                loc2latlon(oldloc).loclon,
              ).distance * 1.852;
            secondsant =
              (new Date(oldtime.replace(/ /, "T").replace(/z/, "Z")) -
                new Date(beacon1[s][0].replace(/ /, "T").replace(/z/, "Z"))) /
              1000;
            velocidadant = (distanciaant * 3600) / secondsant; //alert(velocidadant);
            if (velocidadant > 1 && velocidadant < 240 && sw == false) {
              savespeed = velocidadant;
              sw = true;
            }
            if (
              velocidadant > 0 &&
              velocidadant < 240 &&
              velocidadant / savespeed > 0.3 &&
              velocidadant / savespeed < 2.4
            ) {
              data3[p][5] = Math.floor(velocidadant);
              savespeed = data3[p][5];
            } else {
              data3[p][5] = savespeed;
            }
          }
        }
        minuteselapsed =
          (new Date(beacon1[s - 1][0].replace(/ /, "T").replace(/z/, "Z")) -
            new Date(beacon1[s][0].replace(/ /, "T").replace(/z/, "Z"))) /
          1000;
        metros = beacon1[s - 1][3] * 1 - beacon1[s][3] * 1;
        ascdesc = metros / minuteselapsed;
        if (ascdesc > -5 && ascdesc < 5) {
          data3[p][6] = Math.round(ascdesc * 100) / 100;
        } else {
          data3[p][6] = 0;
        }
        if (!isNaN(beacon1[s][2])) {
          data3[p][7] = beacon1[s][2] * 1;
          savetemp = beacon1[s][2] * 1;
        } else {
          data3[p][7] = savetemp;
        } // temperature centig
        if (!isNaN(beacon1[s][2])) {
          data3[p][13] = Math.floor((beacon1[s][2] * 9) / 5 + 32);
          savetemp = beacon1[s][2];
        } else {
          data3[p][13] = Math.floor((savetemp * 9) / 5 + 32);
        } // temperature fahrenit
        snrm = beacon1[s][6].split(/ /);
        data3[p][8] = snrm[1] * 1;
        data3[p][9] =
          beacon1[s][6].replace(/<br>/, "") +
          " " +
          beacon1[s][0].substring(11, 16);
        data3[p][10] =
          (loc2latlon(beacon1[s - 1][1]).loclat +
            loc2latlon(beacon1[s][1]).loclat) /
          2;
        data3[p][11] =
          (loc2latlon(beacon1[s - 1][1]).loclon +
            loc2latlon(beacon1[s][1]).loclon) /
          2;
        if (beacon1[s][7] != "") {
          data3[p][12] = beacon1[s][7] * 1;
        }
        p = p + 1;
      } else {
        if (beacon1[s][0] != beacon1[s - 1][0] && !swok) {
          data3[p][0] = new Date(redate(beacon1[s][0]));
          SunElevation =
            SunCalc.getPosition(
              new Date(beacon1[s][0].replace(/ /, "T").replace(/z/, "Z")),
              loc2latlon(beacon1[s][1]).loclat,
              loc2latlon(beacon1[s][1]).loclon,
            ).altitude * radian;
          data3[p][4] = Math.round(SunElevation * 10) / 10;
          snrm = beacon1[s][6].split(/ /);
          data3[p][8] = snrm[1] * 1;
          data3[p][9] =
            beacon1[s][6].replace(/<br>/, "") +
            " " +
            beacon1[s][0].substring(11, 16);
          if (beacon1[s][7] != "") {
            data3[p][12] = beacon1[s][7] * 1;
          }
          p = p + 1;
        }
      }
      document.getElementById("chart_div").style.width =
        document.getElementById("map_canvas").clientWidth;
      document.getElementById("chart_div").style.height =
        document.getElementById("map_canvas").clientHeight;
      // document.getElementById("chart_div").style.top =
      // `${document.getElementById("map_canvas").getBoundingClientRect().top}px`;
    }
    if (!isNaN(data3[1][5])) {
      // Horiz velocity
      avg = new Array();
      for (x = 1; x < p; x++) {
        avg[x] = (data3[x][5] + data3[x - 1][5]) / 2;
      }
      for (x = 1; x < p; x++) {
        data3[x][5] = avg[x];
      }
      for (x = 1; x < p; x++) {
        avg[x] = (data3[x][5] + data3[x - 1][5]) / 2;
      }
      for (x = 1; x < p; x++) {
        data3[x][5] = avg[x];
      }
      for (x = 1; x < p; x++) {
        avg[x] = (data3[x][5] + data3[x - 1][5]) / 2;
      }
      for (x = 1; x < p; x++) {
        data3[x][5] = Math.floor(avg[x]);
      }
      for (x = 1; x < p; x++) {
        data3[x][14] = Math.floor(data3[x][5] * 5.39957) / 10;
      }
    }
    if (!isNaN(data3[0][6])) {
      // asc/desc
      avg = new Array();
      for (x = 1; x < p; x++) {
        avg[x] = (data3[x][6] + data3[x - 1][6]) / 2;
      }
      for (x = 1; x < p; x++) {
        data3[x][6] = avg[x];
      }
      for (x = 1; x < p; x++) {
        avg[x] = (data3[x][6] + data3[x - 1][6]) / 2;
      }
      for (x = 1; x < p; x++) {
        data3[x][6] = avg[x];
      }
    }

    if (gqs("tracker").replace("#", "") == "zachtek1") {
      if (!isNaN(data3[0][4])) {
        // sun elev
        avg = new Array();
        for (x = 1; x < p; x++) {
          avg[x] = (data3[x][4] + data3[x - 1][4]) / 2;
        }
        for (x = 1; x < p; x++) {
          data3[x][4] = avg[x];
        }
        for (x = 1; x < p; x++) {
          avg[x] = (data3[x][4] + data3[x - 1][4]) / 2;
        }
        for (x = 1; x < p; x++) {
          data3[x][4] = Math.trunc(avg[x] * 10) / 10;
        }
      }

      if (!isNaN(data3[0][1])) {
        // height m and feet
        avg = new Array();
        for (x = 1; x < p; x++) {
          avg[x] = (data3[x][1] + data3[x - 1][1]) / 2;
        }
        for (x = 1; x < p; x++) {
          data3[x][1] = avg[x];
        }
        for (x = 1; x < p; x++) {
          avg[x] = (data3[x][1] + data3[x - 1][1]) / 2;
        }
        for (x = 1; x < p; x++) {
          data3[x][1] = avg[x];
        }

        avg = new Array();
        for (x = 1; x < p; x++) {
          avg[x] = (data3[x][2] + data3[x - 1][2]) / 2;
        }
        for (x = 1; x < p; x++) {
          data3[x][2] = avg[x];
        }
        for (x = 1; x < p; x++) {
          avg[x] = (data3[x][2] + data3[x - 1][2]) / 2;
        }
        for (x = 1; x < p; x++) {
          data3[x][2] = Math.floor(avg[x] / 50) * 50;
        }
      }
    }
  };
  grafico.make();
  if (beacon1.length == 1) {
    alert(
      "Fewer recent points than required.\n Try [+] selection. Will be slower.",
    );
  }
  /*
  if (document.getElementById("map_canvas").style.height == "0px") {
    document.getElementById("legend").style.visibility = "hidden";
  } else {
    document.getElementById("legend").style.visibility = "visible";
  }
  */
  if (gqs("launch") && gqs("launch") != "") {
    launchc = gqs("launch");
    document.getElementById("launched").innerHTML =
      "&nbsp;Launch: " +
      launchc.substring(0, 4) +
      "-" +
      launchc.substring(4, 6) +
      "-" +
      launchc.substring(6, 8) +
      " " +
      launchc.substring(8, 10) +
      ":" +
      launchc.substring(10, 12) +
      "z&nbsp;";
  } else {
    document.getElementById("launched").innerHTML = "20230701000000";
  }
  if (typeof beacon1 !== "undefined") {
    onerror = handleErr;
  }
  if (getParamSafe("other") != "") {
    document.getElementById("other").value = getParamSafe("other");
  }
  if (getParamSafe("balloonid") != "") {
    document.formu.balloonid.value = getParamSafe("balloonid");
    formu.balloonid.value = getParamSafe("balloonid");
  }
  if (getParamSafe("callsign") != "") {
    document.formu.other.value = getParamSafe("callsign");
  }
  if (getParamSafe("banda") != "") {
    document.formu.banda.value = getParamSafe("banda");
  }
  if (getParamSafe("tracker") != "") {
    document.formu.tracker.value = getParamSafe("tracker");
  }
  if (getParamSafe("detail") != "") {
    document.formu.detail.checked = true;
  }
  if (gqs("SSID") != "" && formu.repito) {
    if (getParamSafe("repito") == "on") {
      document.getElementById("repito").checked = true;
    }
  }
  if (formu.qp) {
    if (gqs("repito") == "on") {
      document.formu.qp.checked = true;
    } else {
      document.formu.qp.checked = false;
    }
  }
  licenciaaprs = gqs("other");
  url =
    "https://amateur.sondehub.org/#!mt=OpenTopoMap&mz=4&qm=7d&mc=" +
    loctolatlon(locations[0][0]).lat +
    "," +
    loctolatlon(locations[0][0]).lon +
    "&f=" +
    licenciaaprs;
  if (getParamSafe("SSID") != "") {
    url = url + "-" + getParamSafe("SSID");
  }
  leyenda = "SONDE";
  document.getElementById("linksonde").innerHTML =
    "<a target=_blank href=" +
    url +
    " style='color:yellow;text-shadow: 1px 1px 0 black, 1px 1px 0 black; border-style:outset;border-color:black;border-width:2px;background-color:red;border-radius: 12px;line-heigth:18px;font-size:13px;font-family:Tahoma;' title='SondeHub track'>&#127880;SH<\/a>";
  if (typeof SSID !== "undefined") {
    EXTRA = "&f=" + licenciaaprs + "-" + SSID;
  }
  if (getParamSafe("launch") != "") {
    launchc = getParamSafe("launch");
    document.getElementById("launched").innerHTML =
      "&nbsp;Launch: " +
      launchc.substring(0, 4) +
      "-" +
      launchc.substring(4, 6) +
      "-" +
      launchc.substring(6, 8) +
      " " +
      launchc.substring(8, 10) +
      ":" +
      launchc.substring(10, 12) +
      "z&nbsp;";
  } else {
    document.getElementById("launched").innerHTML =
      "&nbsp;&nbsp;Click to Enter Launch/Date&nbsp;&nbsp;";
  }
  var banda = getParamSafe("banda");
  if (banda == "") {
    banda = "20";
  }
  cuentay = 0;
  lasty = "";
  if (trayecto.length > 1) {
    for (x = 0; x < trayecto.length; x++) {
      if (trayecto[x][1] != lasty) {
        cuentay = cuentay + 1;
        lasty = trayecto[x][1];
      }
    }
  }
  if (flechas.length > 1 && cuentay > 1) {
    aprsend();
  }
  var viewportOffset = document
    .getElementById("map_canvas")
    .getBoundingClientRect();
  //document.getElementById("legend").style.top =
  //  viewportOffset.bottom - 22 + window.pageYOffset;
  //document.getElementById("legend").style.left = viewportOffset.left + 40;
  //
  rutinaf = window.location.href.toLowerCase();
  rutinaf = rutinaf.replace("https://", "");
  rutinaf = rutinaf.replace(window.location.hostname, "");
  rutinaf = rutinaf.replace("/", "");
  //rutinaf = rutinaf.replace(".asp", "");
  rutinafm = rutinaf.split("?");
  quewspr = rutinafm[0];

  rutina =
    "<a href=# onclick=\"mostrar('" +
    document.getElementById("other").value +
    "','" +
    locations[0][0] +
    "')\" style='color:#ffffff;font-family:Arial Narrow'><span style='font-family:Arial Narrow;font-weight:normal;color:#ffffff;'><u>" +
    gqs("other").toUpperCase();
  +"<\/u><\/a>";
  if (typeof gqs("SSID") != "undefined" && gqs("SSID").length > 0) {
    rutina = rutina + "-" + gqs("SSID");
  }
  if (quewspr == "wspr") {
    rutina = rutina + " Normal";
  }
  if (quewspr == "wsprfull") {
    rutina = rutina + " Full";
  }
  if (quewspr == "wsprfast") {
    rutina = rutina + " Fast";
  }
  rutina = rutina + "</span>";

  window.rutinaElementValue = rutina;
  /*
  document.getElementById("rutina").style.top =
    viewportOffset.top + 50 + window.pageYOffset;
  document.getElementById("rutina").style.left = viewportOffset.left + 4; // alert("other"+document.getElementById("other").value);
  document.getElementById("rutina").innerHTML = rutina;
  if (document.getElementById("other") != "") {
     document.getElementById("rutina").style.visibility = "visible";
  }
  document.getElementById("iconos").style.top =
   viewportOffset.top + 109 + window.pageYOffset;
  document.getElementById("iconos").style.left = viewportOffset.left + 12; // alert("other"+document.getElementById("other").value);
  if (document.getElementById("other") != "") {
     document.getElementById("iconos").style.visibility = "visible";
  }
  document.getElementById("iconos").style.top =
    viewportOffset.top + 109 + window.pageYOffset;
   document.getElementById("iconos").style.left = viewportOffset.left + 12; // alert("other"+document.getElementById("other").value);
  if (document.getElementById("other") != "") {
     document.getElementById("iconos").style.visibility = "visible";
  }
  */

  document.getElementById("launched").innerHTML =
    "&nbsp;Launch: " +
    lanzamiento.getFullYear() +
    "-" +
    ("00" + (lanzamiento.getMonth() + 1)).slice(-2) +
    "-" +
    ("00" + lanzamiento.getDate()).slice(-2) +
    " " +
    ("00" + lanzamiento.getHours()).slice(-2) +
    ":" +
    ("00" + lanzamiento.getMinutes()).slice(-2) +
    "z&nbsp;";
  for (
    var i = 0, j = document.getElementById("banda").options.length;
    i < j;
    ++i
  ) {
    if (document.getElementById("banda").options[i].innerHTML === banda) {
      document.getElementById("banda").selectedIndex = i;
      break;
    }
  }
  if (banda == "") {
    banda = "20m";
    document.getElementById("banda").value = banda;
  } else {
    document.getElementById("banda").value = banda;
  }
  if (locations.length > 21) {
    var limite = 21;
  } else {
    var limite = locations.length;
  }
  stations = "";
  kms = "Distance&nbsp;Km:&nbsp;";
  lvl = "Received&nbsp;at:&nbsp;";
  fecharepo = "Last&nbsp;Date&nbsp;&nbsp;:&nbsp;";
  timerec = "Last&nbsp;Time&nbsp;&nbsp;:&nbsp;";
  onlocator = "On Locator&nbsp;:&nbsp;";
  for (z = 1; z < limite; z++) {
    //locations.length; z++) {
    if (locations[z][1].indexOf("Capture") == -1) {
      licencia = locations[z][1].replace(/EA8\//, "");
      licencia = licencia
        .substring(0, 6)
        .replace(/</, "")
        .replace(/>/, "")
        .replace(/>/, "")
        .replace(/\//, "")
        .replace(/b/, " ")
        .replace(/ /, "")
        .replace(/r/, "")
        .replace(/-/, "");
      if (licencia.length == 3) {
        agregarespacio = "&nbsp;&nbsp;&nbsp;";
      }
      if (licencia.length == 4) {
        agregarespacio = "&nbsp;&nbsp;";
      }
      if (licencia.length == 5) {
        agregarespacio = "&nbsp;";
      }
      if (licencia.length == 6) {
        agregarespacio = "";
      }
      stations =
        stations +
        agregarespacio +
        "<a href=\"javascript:mostrar('" +
        licencia +
        '\')" title="See ' +
        locations[z][1].split("<br>")[0] +
        ' @QRZ" style="background-color:gold;color:#000000;">' +
        "<b><u>" +
        licencia +
        "<\/u><\/b><\/a>&nbsp;";
      //if (locations[z][1].substring(0, 6).replace(/</, "").replace(/>/, "").length == 5) { stations = stations + "&nbsp;" }
      kmm = locations[z][1].split("<br>", 50);
      agregado = ("       " + kmm[2].replace(/ Km/, "")).slice(-6);
      agregado = agregado.replace(/ /g, "&nbsp;") + "&nbsp;";
      kms = kms + agregado;
      onlocator =
        onlocator +
        '<a title="See Location" style="background-color: #e6ff99;" target="_blank" href=\'http:\/\/k7fry.com/grid\/?qth=' +
        locations[z][0].substring(0, 6) +
        "'><u><b>" +
        locations[z][0].substring(0, 6) +
        "<\/b><\/u><\/a>" +
        "&nbsp;";
      fecharepo = fecharepo + kmm[1].substring(0, 6) + "&nbsp;";
      timerec = timerec + kmm[1].substring(7, 12) + "z&nbsp;";
      lvl1 = locations[z][1].slice(-4).replace(/ /g, "").replace(/:/g, "");
      lvl1 = ("       " + lvl1).slice(-6);
      lvl1 = lvl1.replace(/ /g, "&nbsp;") + "&nbsp;";
      lvl =
        lvl.replace(/0Mhz/, "10Mh") +
        lvl1
          .replace(/R-/g, " -")
          .replace(/R+/g, " +")
          .replace(/\+\+/g, "+")
          .replace(/N/g, "")
          .replace(/8Mhz/, "18Mh")
          .replace(/1Mhz/, "21Mh")
          .replace(/\+/g, "");
    }
  }
  timerec = timerec + "<br>";
  cantidad = locations.length - 1;
  espacio = "&nbsp;";
  if (cantidad < 10) {
    dospuntos = cantidad + "&nbsp;&nbsp;Spotters:";
  } else {
    dospuntos = cantidad + "&nbsp;Spotters:";
  }
  if (cantidad > 99) {
    dospuntos = cantidad + "&nbsp;" + "Spotters:";
    espacio = "";
  }
  document.getElementById("estaciones").innerHTML =
    "<hr>" +
    dospuntos +
    espacio +
    stations +
    "<br>" +
    kms +
    "<br>" +
    lvl +
    "<br>" +
    onlocator +
    "<br>" +
    fecharepo +
    "<br>" +
    timerec +
    "<hr>";

  for (y = 21; y < locations.length; y = y + 20) {
    stations = "";
    kms = "Distance&nbsp;Km:&nbsp;";
    lvl = "Received&nbsp;at:&nbsp;";
    fecharepo = "Last&nbsp;Date&nbsp;&nbsp;:&nbsp;";
    timerec = "Last&nbsp;Time&nbsp;&nbsp;:&nbsp;";
    onlocator = "On Locator&nbsp;:&nbsp;";
    if (y + 21 > locations.length) {
      limite = locations.length;
    } else {
      limite = y + 20;
    }
    for (z = y; z < limite; z++) {
      //locations.length; z++) {
      if (locations[z][1].indexOf("Capture") == -1) {
        licencia = locations[z][1]
          .substring(0, 6)
          .replace(/</, "")
          .replace(/>/, "")
          .replace(/>/, "")
          .replace(/\//, "")
          .replace(/b/, " ")
          .replace(/ /, "")
          .replace(/r/, "")
          .replace(/-/, "");
        if (licencia.length == 3) {
          agregarespacio = "&nbsp;&nbsp;&nbsp;";
        }
        if (licencia.length == 5) {
          agregarespacio = "&nbsp;";
        }
        if (licencia.length == 4) {
          agregarespacio = "&nbsp;&nbsp;";
        }
        if (licencia.length == 6) {
          agregarespacio = "";
        }
        stations =
          stations +
          agregarespacio +
          "<a href=\"javascript:mostrar('" +
          licencia +
          '\')" title="See ' +
          locations[z][1].split("<br>")[0] +
          ' @QRZ" style="background-color:gold;color:#000000;">' +
          "<b><u>" +
          licencia +
          "<\/u><\/b><\/a>&nbsp;";
        kmm = locations[z][1].split("<br>", 50);
        agregado = ("       " + kmm[2].replace(/ Km/, "")).slice(-6);
        agregado = agregado.replace(/ /g, "&nbsp;") + "&nbsp;";
        kms = kms + agregado;
        onlocator =
          onlocator +
          '<a title="See Location" style="background-color: #e6ff99;" target="_blank" href=\'http:\/\/k7fry.com/grid\/?qth=' +
          locations[z][0].substring(0, 6) +
          "'><u><b>" +
          locations[z][0].substring(0, 6) +
          "<\/b><\/u><\/a>" +
          "&nbsp;";
        fecharepo = fecharepo + kmm[1].substring(0, 6) + "&nbsp;";
        timerec = timerec + kmm[1].substring(7, 12) + "z&nbsp;";
        lvl1 = locations[z][1].slice(-4).replace(/ /g, "").replace(/:/g, "");
        lvl1 = ("       " + lvl1).slice(-6);
        lvl1 = lvl1.replace(/ /g, "&nbsp;") + "&nbsp;";
        lvl =
          lvl.replace(/0Mhz/, "10Mh") +
          lvl1
            .replace(/R-/g, " -")
            .replace(/R+/g, " +")
            .replace(/\+\+/g, "+")
            .replace(/N/g, "")
            .replace(/8Mhz/, "18Mh")
            .replace(/1Mhz/, "21Mh")
            .replace(/\+/g, "");
      }
    }
    timerec = timerec + "<br>";
    if (y > 121) {
      document.getElementById("estaciones").innerHTML =
        document.getElementById("estaciones").innerHTML +
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
        "&nbsp;" +
        stations +
        "<br>" +
        kms +
        "<br>" +
        lvl +
        "<br>" +
        onlocator +
        "<br>" +
        fecharepo +
        "<br>" +
        timerec +
        "<hr>";
    } else {
      if (y == 21) {
        token = "";
        if (gqs("SSID")) {
          url =
            "http:\/\/aprs.fi?z=09&call=" +
            licenciaaprs +
            "-" +
            SSID +
            "&timerange=604800&tail=604800&mt=hybrid";
        } else {
          url =
            "http:\/\/aprs.fi?z=09&call=" +
            licenciaaprs +
            "&timerange=604800&tail=604800&mt=hybrid";
        }
        leyenda = "APRS ";
        EXTRA = "";
        lugarlatlong = ""; //loctolatlon(locations[0][0]).lat + token + loctolatlon(locations[0][0]).lon;
      }
      //
      if (y == 41) {
        token = ",";
        url =
          "https://amateur.sondehub.org/#!mt=OpenTopoMap&mz=4&qm=7d&mc=" +
          loctolatlon(locations[0][0]).lat +
          "," +
          loctolatlon(locations[0][0]).lon +
          "&f=" +
          licenciaaprs;
        if (getParamSafe("SSID") != "") {
          url = url + "-" + getParamSafe("SSID");
        }
        leyenda = "SONDE";
        document.getElementById("linksonde").innerHTML =
          "<a target=_blank href=" +
          url +
          " style='color:yellow;text-shadow: 1px 1px 0 black, 1px 1px 0 black; border-style:outset;border-color:black;border-width:2px;background-color:red;border-radius: 12px;line-heigth:18px;font-size:13px;font-family:Tahoma;' title='SondeHub track'>&#127880;SH<\/a>";
        if (typeof SSID !== "undefined") {
          EXTRA = "&f=" + licenciaaprs + "-" + SSID;
        }
        lugarlatlong =
          loctolatlon(locations[0][0]).lat +
          token +
          loctolatlon(locations[0][0]).lon;
      }
      //
      if (y == 61) {
        token = "/";
        url = "https://en.windfinder.com/#6/";
        leyenda = "WINDS";
        EXTRA = "";
        lugarlatlong =
          loctolatlon(locations[0][0]).lat +
          token +
          loctolatlon(locations[0][0]).lon;
      }
      if (y == 81) {
        token = ",";
        url =
          "https://www.windy.com/en/-Mostrar---a%C3%B1adir-m%C3%A1s-capas/overlays?cloudtop,";
        leyenda = "CLOUD";
        EXTRA = ",7";
        lugarlatlong =
          loctolatlon(locations[0][0]).lat +
          token +
          loctolatlon(locations[0][0]).lon;
      }
      //           lugarlatlong = loctolatlon(locations[0][0]).lat + token + loctolatlon(locations[0][0]).lon;
      if (y == 101) {
        token = ",";
        url =
          "https://www.windy.com/en/-Mostrar---a%C3%B1adir-m%C3%A1s-capas/overlays?currents,";
        leyenda = "WAVES";
        EXTRA = ",7";
        lugarlatlong =
          loctolatlon(locations[0][0]).lat +
          token +
          loctolatlon(locations[0][0]).lon;
      }
      if (y == 121) {
        token = "";
        url =
          "https://www.marinetraffic.com/en/ais/home/" +
          "centerx:" +
          loctolatlon(locations[0][0]).lon +
          "/centery:" +
          loctolatlon(locations[0][0]).lat;
        leyenda = "SHIPS";
        EXTRA = "/zoom:6";
        lugarlatlong = "";
      }
      document.getElementById("estaciones").innerHTML =
        document.getElementById("estaciones").innerHTML +
        "&nbsp;&nbsp;&nbsp;&nbsp;<a href='" +
        url +
        lugarlatlong +
        EXTRA +
        "' title='VIEW " +
        leyenda +
        "' target='aprs' style='background-color:gold;color:#000000;'><b><u>" +
        leyenda +
        "<\/u><\/b></a>&nbsp;&nbsp;&nbsp;" +
        "&nbsp;" +
        stations +
        "<br>" +
        kms +
        "<br>" +
        lvl +
        "<br>" +
        onlocator +
        "<br>" +
        fecharepo +
        "<br>" +
        timerec +
        "<hr>";
    }
  }
  saveestaciones = document.getElementById("estaciones").innerHTML;
  velociant = velest;
  limitefecha = beacon1.length - 0;
  for (k = 0; k < beacon1.length - 0; k++) {
    if (new Date(redate(beacon1[k][0])) < lanzamiento) {
      // solo traza recorrido posterior a lanzamiento
      limitefecha = k;
      break;
    }
  }
  sumlat = 0;
  distanciatotal = 0;
  for (k = 0; k < limitefecha - 1; k++) {
    distancia =
      crsdist(
        loc2latlon(beacon1[k][1]).loclat,
        loc2latlon(beacon1[k][1]).loclon,
        loc2latlon(beacon1[k + 1][1]).loclat,
        loc2latlon(beacon1[k + 1][1]).loclon,
      ).distance * 1.852;
    distanciatotal = distanciatotal + distancia;
    sumlat = sumlat + loctolatlon(beacon1[k][1].toUpperCase()).lat * 1;
  }
  latavg = sumlat / limitefecha;
  avglattext = "@Avg. Latitude: " + latavg.toFixed(0) + "°";
  tiemporecorridoenhoras =
    (new Date(redate(beacon1[0][0])) -
      new Date(redate(beacon1[beacon1.length - 1][0]))) /
    1000 /
    60 /
    60;
  velocidadpromedio = distanciatotal / tiemporecorridoenhoras;
  for (k = 0; k < limitefecha - 1; k++) {
    distancia =
      crsdist(
        loc2latlon(beacon1[k][1]).loclat,
        loc2latlon(beacon1[k][1]).loclon,
        loc2latlon(beacon1[k + 1][1]).loclat,
        loc2latlon(beacon1[k + 1][1]).loclon,
      ).distance * 1.852;
    var seconds =
      (new Date(redate(beacon1[k][0])) - new Date(redate(beacon1[k + 1][0]))) /
      1000; // alert("Dist:"+distancia.toFixed(0)+" Tiempo;" + seconds)
    //        if (seconds < 3000) {seconds=3000}
    var velocidad = ((distancia * 3600) / seconds).toFixed(1); // + "<br>D:" + distancia.toFixed(0) + "<br>T:" + seconds.toFixed(0) + "<br>" + redate(beacon1[k][0]) + "<br>" + redate(beacon1[k + 1][0]);// alert(redate(beacon1[k][0]) + "," + redate(beacon1[k + 1][0])); //
    if (velocidad > 270) {
      velocidad = velociant;
    }
    var velociant = velocidad;
    rumbo = crsdist(
      loc2latlon(beacon1[k + 1][1]).loclat,
      loc2latlon(beacon1[k + 1][1]).loclon,
      loc2latlon(beacon1[k][1]).loclat,
      loc2latlon(beacon1[k][1]).loclon,
    ).bearing.toFixed(1); //+ "&ordm;";
    if (distancia > 999) {
      distancia = distancia.toFixed(0);
    } else {
      distancia = distancia.toFixed(1);
    }
    if (seconds && seconds > 0) {
      ascent =
        ((beacon1[k][3] - beacon1[k + 1][3]) / seconds).toFixed(2) + "m/s";
    } else {
      ascent = "";
    }
    if (seconds == 0) {
      beacon1[k][7] = "Ascent: " + "0.00 m/s";
    }
    if (ascent != "") {
      beacon1[k][7] = "Ascent: " + ascent;
    } else {
      beacon1[k][7] = "";
    }

    if (k == 0) {
      dura = (new Date(redate(beacon1[k][0])) - lanzamiento) / 1000 / 60;
      durakm = "By: " + distanciatotal.toFixed(0) + " Km"; //109.74
      duradias = Math.floor(dura / 24 / 60);
      durahoras = Math.floor((dura - duradias * 24 * 60) / 60);
      duraminutos = Math.floor(dura - (duradias * 24 * 60 + durahoras * 60));
      //duracion = "";
      Sunelevado = "";
      SunElevationold =
        SunCalc.getPosition(
          new Date(beacon1[0][0].replace(/ /, "T").replace(/z/, "Z")),
          loctolatlon(beacon1[0][1]).lat,
          loctolatlon(beacon1[0][1]).lon,
        ).altitude * radian;
      SunElevationpreviousold =
        SunCalc.getPosition(
          new Date(beacon1[0][0].replace(/ /, "T").replace(/z/, "Z")) - 1000,
          loctolatlon(beacon1[0][1]).lat,
          loctolatlon(beacon1[0][1]).lon,
        ).altitude * radian;
      if (SunElevationold > SunElevationpreviousold) {
        flechita = "&#x25B2;";
      } else {
        flechita = "&#x25BC;";
      }
      if (isNaN(rumbo)) {
        rtxt = "?&deg;";
      } else {
        rtxt = rumbo + "&deg;";
      }
      sunalt =
        "<span style='color:green;font-size:12px;line-height:12px;'>Sun Elev:" +
        (
          SunCalc.getPosition(
            new Date(beacon1[0][0].replace(/ /, "T").replace(/z/, "Z")),
            loctolatlon(beacon1[0][1]).lat,
            loctolatlon(beacon1[0][1]).lon,
          ).altitude * radian
        ).toFixed(1) +
        "&deg;<\/span>";
      Sunelevado =
        "<span style='color:green;font-size:13px;line-height:13px;'>" +
        sunalt +
        flechita +
        "<\/span><br>";
      r = 0;
      do {
        r = r + 1;
        rumbo = crsdist(
          loc2latlon(beacon1[r][1]).loclat,
          loc2latlon(beacon1[r][1]).loclon,
          loc2latlon(beacon1[0][1]).loclat,
          loc2latlon(beacon1[0][1]).loclon,
        ).bearing.toFixed(1);
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
      } while (distancia < 100 && r < beacon1.length - 1);
      velocidad = (distancia * 3600) / seconds;
      distancia = distancia.toFixed(0);
      if (isNaN(rumbo)) {
        rtxt = "?&deg;";
      } else {
        rtxt = rumbo + "&deg;";
      }
      if (seconds && seconds > 0) {
        ascent =
          ((beacon1[1][3] - beacon1[0][3]) / seconds).toFixed(2) * -1 + " m/s";
      } else {
        ascent = "";
      }
      if (seconds == 0) {
        ascent = "0.00 m/s";
      }
      //       if (velocidad > 220) {
      hoursfirst = new Date(redate(beacon1[beacon1.length - 1][0])); //distanciatotal = 0;
      q = -1;
      do {
        q = q + 1;
      } while (beacon1[0][1] == beacon1[q][1] && q < beacon1.length - 1);
      distancia =
        crsdist(
          loc2latlon(beacon1[0][1]).loclat,
          loc2latlon(beacon1[0][1]).loclon,
          loc2latlon(beacon1[q][1]).loclat,
          loc2latlon(beacon1[q][1]).loclon,
        ).distance * 1.852;
      hoursactual =
        (new Date(redate(beacon1[0][0])) - new Date(redate(beacon1[q][0]))) /
        1000 /
        60 /
        60;
      hourstotales =
        (new Date(redate(beacon1[0][0])) - lanzamiento) / 1000 / 60 / 60;
      if (beacon1.length > 0) {
        var hourstotal =
          (new Date(redate(beacon1[0][0])) -
            new Date(redate(beacon1[beacon1.length - 1][0]))) /
          1000 /
          60 /
          60;
      } // tenia lanzamiento en vez de hoursfirst
      durax =
        (new Date(redate(beacon1[0][0])) -
          new Date(redate(beacon1[beacon1.length - 1][0]))) /
        1000 /
        60;
      TotalKm = distanciatotal / hourstotales;
      velocidad = distanciatotal / hourstotales;
      velocidad = distancia / hoursactual / 2;
      Tiempo = (new Date(redate(beacon1[k][0])) - lanzamiento) / 1000 / 3600;
      Kmrecorridos = Tiempo * velocidadpromedio;

      laps = Math.abs(Math.sin(latavg)) * 40000;
      laps = Kmrecorridos / laps;
      laps1 = Math.ceil((duradias / 19) * Math.abs(Math.sin(latavg)));
      laps = (laps + laps1) / 2;
      if (gqs("other").toUpperCase() == "LU8YY") {
        laps = laps / 1;
      }
      if (gqs("other").toUpperCase() == "LU1ESY" && gqs("SSID") * 1 == 46) {
        laps = laps * 1.1;
      }
      duracion = ""; //alert(latavg+" , "+distanciatotal)
      if (duradias > 1 && distanciatotal > 100 && laps > 0) {
        duracion =
          "<i>Estimated " +
          laps.toFixed(1) +
          " laps</i><br>" +
          avglattext +
          "<br>";
      }
      duracion =
        duracion +
        "Travel: " +
        duradias +
        "d " +
        durahoras +
        "h" +
        " " +
        duraminutos +
        "'";

      if (isNaN(Kmrecorridos)) {
        Kmrecorridostext = "?";
      } else {
        Kmrecorridostext = Kmrecorridos.toFixed(0);
      }
      if (ascent != "") {
        ascent = "Ascent: " + ascent + "<br>";
      } else {
        ascent = "";
      }
      if (isNaN(velocidad)) {
        velocidadtext = "?";
      } else {
        velocidadtext = velocidad.toFixed(1);
      }
      if (document.getElementById("globo")) {
        document.getElementById("globo").innerHTML =
          "<br><span style='font-size:16px;'>&#9651;<\/span>d: " +
          distancia.toFixed(1) +
          " Km<br>" +
          ascent +
          "Course: " +
          rtxt +
          "<br>V:&nbsp;" +
          velocidadtext +
          "&nbsp;Km/h<br>" +
          Sunelevado +
          "From " +
          monthNames[lanzamiento.getMonth()] +
          "-" +
          lanzamiento.getDate() +
          " " +
          ("0" + lanzamiento.getHours()).substr(-2) +
          ":" +
          ("0" + lanzamiento.getMinutes()).substr(-2) +
          "z<br>" +
          duracion +
          "<br>";
      }
      locations[0][1] =
        locations[0][1] +
        "<br><span style='font-size:18px;'>&#9651;<\/span>d: " +
        distancia.toFixed(1) +
        " Km<br>" +
        ascent +
        "Course: " +
        rtxt +
        "<br>V:&nbsp;" +
        velocidadtext +
        "&nbsp;Km/h<br>" +
        Sunelevado +
        "From " +
        monthNames[lanzamiento.getMonth()] +
        "-" +
        lanzamiento.getDate() +
        " " +
        ("0" + lanzamiento.getHours()).substr(-2) +
        ":" +
        ("0" + lanzamiento.getMinutes()).substr(-2) +
        "z<br>" +
        duracion +
        "<br>" +
        "&nbsp;&nbsp;&nbsp;For: " +
        Kmrecorridostext +
        " Km. ~<br>";
    }
    //       beacon1[k][6] = "<br><center><span style='font-size:16px;'>&#9651;<\/span>d: " + distancia + " Km<br>Course: " + rumbo + "&deg;<br>V:&nbsp;" + velocidad + "&nbsp;Km/h" + beacon1[k][6] + "</center>";
  }
  if (typeof locations[1] != "undefined") {
    if (
      locations.length > 0 &&
      locations[1][1].substring(0, 7) == "Capture" &&
      beacon1.length > 0
    ) {
      locm = locations[1][1].split("<br>");
      locf = locm[2].replace(/z/, "").replace(/gps/, "") + ":00";
      locf = locf
        .replace(/Feb/, "February")
        .replace(/Ene/, "January")
        .replace(/Mar/, "March")
        .replace(/Abr/, "April")
        .replace(/Jun/, "June")
        .replace(/Jul/, "July")
        .replace(/Aug/, "August")
        .replace(/Sep/, "September")
        .replace(/Oct/, "October")
        .replace(/Nov/, "November")
        .replace(/Dic/, "December");
      locf = locf
        .replace(/ /, " " + beacon1[0][0].substring(0, 4) + " ")
        .replace(/-/, " ");
      loc2 = locations[1][0];
      fecha2 = new Date(locf);
      loc1 = beacon1[0][1];
      fechax = redate(beacon1[0][0]);
      fecha1 = new Date(fechax);
      distancia =
        crsdist(
          loc2latlon(loc1).loclat,
          loc2latlon(loc1).loclon,
          loc2latlon(loc2).loclat,
          loc2latlon(loc2).loclon,
        ).distance * 1.852;
      var seconds = (fecha2 - fecha1) / 1000;
      var velocidad = ((distancia * 3600) / seconds).toFixed(1);
      rumbo = crsdist(
        loc2latlon(loc1).loclat,
        loc2latlon(loc1).loclon,
        loc2latlon(loc2).loclat,
        loc2latlon(loc2).loclon,
      ).bearing.toFixed(1);
      if (isNaN(rumbo)) {
        rtxt = "?&deg;";
      } else {
        rtxt = rumbo + "&deg;";
      }
      if (distancia > 999) {
        distancia = distancia.toFixed(0);
      } else {
        distancia = distancia.toFixed(1);
      }
      altu = Math.floor(beacon1[3][3] / 1000) * 1000;
      for (h = 0; h < locations.length; h++) {
        if (beacon1[h][3] > 1000) {
          altu = Math.floor(beacon1[h][3] / 1000) * 1000;
          break;
        }
      }
      locations[1][1] =
        locations[1][1] +
        "<br>Alt.:~" +
        altu +
        " m.<br><span style='font-size:16px;'>&#9651;<\/span>d: " +
        distancia +
        " Km<br>Course: " +
        rumbo;
      if (isNaN(velocidad) == false) {
        locations[1][1] = locations[1][1] + "<br>V: " + velocidad + " Km/h";
      }
      //        suncoverage();
      // set showcapture = true if beacon1[1][0] higher than locations[0] date
    }
  }
  if (
    !isNaN(savelato) &&
    !isNaN(savelono) &&
    typeof map !== "undefined" &&
    !isNaN(savedMapZoom)
  ) {
    map.setCenter({ lat: savelato, lng: savelono });
  }
  if (beacon1.length > 0) {
    hoursfirst = new Date(redate(beacon1[beacon1.length - 1][0]));
  }
  if (beacon1.length > 0) {
    var hourstotal =
      (new Date(redate(beacon1[0][0])) -
        new Date(redate(beacon1[limitefecha - 1][0]))) /
      1000 /
      60 /
      60;
  } // tenia lanzamiento en vez de hoursfirst
  if (beacon1.length > 0) {
    durax =
      (new Date(redate(beacon1[0][0])) -
        new Date(redate(beacon1[beacon1.length - 1][0]))) /
      1000 /
      60;
  } else {
    durax = 1;
  }
  TotalKm = ((distanciatotal / hourstotal) * durax) / 60;
  if (isNaN(Kmrecorridos)) {
    Kmrecorridostext = "?";
  } else {
    Kmrecorridostext = Kmrecorridos.toFixed(0);
  }
  if (isNaN(velocidadpromedio)) {
    velocidadpromediotext = "?";
  } else {
    velocidadpromediotext = velocidadpromedio.toFixed(1);
  }
  if (document.getElementById("globo")) {
    document.getElementById("globo").innerHTML =
      document.getElementById("globo").innerHTML +
      "&nbsp;&nbsp;&nbsp;For: " +
      Kmrecorridostext +
      " Km. ~<br>By: " +
      distanciatotal.toFixed(0) +
      " Km." +
      "<br><i>On this map</i><br>Avg.V.: " +
      velocidadpromediotext +
      " Km/h";
  }
  if (document.getElementById("globo")) {
    saveglobo = document.getElementById("globo").innerHTML;
  }
  locations[0][1] =
    locations[0][1] +
    "By: " +
    distanciatotal.toFixed(0) +
    " Km" +
    "<br><i>On this map</i><br>Avg.V.: " +
    velocidadpromediotext +
    " Km/h";
  if (document.getElementById("repito")) {
    if (gqs("repito")) {
      document.getElementById("repito").checked = true;
    }
  }
  if (gqs("detail")) {
    document.getElementById("detail").checked = true;
  }
  var now = new Date();
  var trayectodate = new Date(redate(trayecto[0][0]));
  diferencia =
    (new Date(now.getTime() + now.getTimezoneOffset() * 60000) - trayectodate) /
    1000 /
    60 /
    60;
  if (
    document.getElementById("repito") &&
    document.getElementById("repito").checked == true &&
    diferencia < 5
  ) {
    document.getElementById("repetir").click();
  }
  r = 0;
  for (k = 0; k < beacon1.length - 1; k++) {
    if (beacon1[k][1].toUpperCase() != beacon1[k + 1][1].toUpperCase()) {
      rumbo = crsdist(
        loc2latlon(beacon1[k + 1][1]).loclat,
        loc2latlon(beacon1[k + 1][1]).loclon,
        loc2latlon(beacon1[r][1]).loclat,
        loc2latlon(beacon1[r][1]).loclon,
      ).bearing.toFixed(0);
      seconds =
        (new Date(redate(beacon1[k + 1][0])) -
          new Date(redate(beacon1[r][0]))) /
        1000;
      distancia =
        crsdist(
          loc2latlon(beacon1[k + 1][1]).loclat,
          loc2latlon(beacon1[k + 1][1]).loclon,
          loc2latlon(beacon1[r][1]).loclat,
          loc2latlon(beacon1[r][1]).loclon,
        ).distance / 1;
      velocidad = -(((distancia * 3600) / seconds) * 1.852).toFixed(1);
      beacon1[r][6] =
        "<br><center><span style='font-size:16px;'>&#9651;<\/span>d:&nbsp;" +
        distancia.toFixed(1) +
        " Km.<br>Course:&nbsp;" +
        rumbo +
        "&deg;<br>V:&nbsp;" +
        velocidad +
        "&nbsp;Km/h" +
        beacon1[k][6] +
        "</center>";
      r = k;
    }
  }
  if (1 == 1) {
    //document.getElementById("calink").style.left =
    //  document.getElementById("map_canvas").offsetLeft - 70;
    if (isIOS) {
      document.getElementById("calink").style.left = 2;
    }
    // document.getElementById("calink").style.top =
    //   document.getElementById("map_canvas").offsetTop;
    document.getElementById("calink").style.visibility = "visible";
    document.getElementById("chdiv").style.left =
      document.getElementById("map_canvas").offsetWidth +
      document.getElementById("map_canvas").offsetLeft +
      6;
    document.getElementById("chdiv").style.visibility = "visible";
    // document.getElementById("iconos").style.left =
    //   `${document.getElementById("map_canvas").offsetLeft + 6}px`;
    document.getElementById("gMapLoader").style.display = "none";
    document.getElementById("map_canvas").style.visibility = "visible";
  }
}
qrpchange = false;
function borrarother() {
  document.formu.other.value = "";
}
function setid() {
  querystring = `${HOST_URL}${window.parent.window.location.pathname}`;
  querystring =
    querystring +
    "?banda=" +
    formu.banda.value +
    "&other=" +
    formu.other.value +
    "&balloonid=" +
    formu.balloonid.value +
    "&timeslot=" +
    formu.timeslot.value;

  if (querystring.indexOf("tracker") == -1) {
    if (formu.tracker.value != "") {
      querystring + "&tracker=" + formu.tracker.value;
    }
  }
  if (formu.repito) {
    querystring = querystring + "&repito=on";
  } else {
    querystring = querystring + "&repito=";
  }
  if (formu.wide && formu.wide.checked == true) {
    querystring = querystring + "&wide=on";
  } else {
    querystring = querystring + "&wide=";
  }
  if (formu.detail && formu.detail.checked == true) {
    querystring = querystring + "&detail=on";
  } else {
    querystring = querystring + "&detail=";
  }
  if (qrpchange) {
    querystring =
      querystring +
      "&qrpid=" +
      document.getElementById("qrpchn").innerHTML.replace("?", "");
  } else {
    if (gqs("qrpid")) {
      querystring = querystring + "&qrpid=" + gqs("qrpid");
    }
  }
  if (ssidchange) {
    querystring = querystring + "&SSID=" + newssid;
    if (newssid.length > 0 && gqs("repito") != "on") {
      querystring = querystring + "&repito=on";
    }
  } else {
    if (gqs("SSID")) {
      querystring = querystring + "&SSID=" + gqs("SSID");
    }
  }
  if (gqs("launch")) {
    querystring = querystring + "&launch=" + gqs("launch");
  } else {
  }
  if (qrpchange) {
    querystring = querystring + "&tracker=" + "traquito";
  } else {
    if (gqs("tracker")) {
      querystring = querystring + "&tracker=" + gqs("tracker");
    }
  }
  if (gqs("telen") && gqs("telen") == "on") {
    querystring = querystring + "&telen=on";
    formu.telen.checked = true;
  }
  if (gqs("qp") && gqs("qp") == "on") {
    querystring = querystring + "&qp=on";
  }
  if (formu.limit.value != "") {
    querystring = querystring + "&limit=" + formu.limit.value;
  }

  window.parent.window.location.href = querystring;
}
function solarflux() {
  posleft = screen.availWidth / 2 + 6;
  postop = screen.availHeight / 2 - 320;
  if (popupwin != null) {
    popupwin.close();
  }
  codata =
    '<\/head><body style="margin-top:0px;margin-left:0px;margin-right:0;margin-bottom:0;background-color:#f8f8f8;\' color="#ffffff" onclick="self.close();")>';
  codata =
    codata +
    "<center><img src='https://services.swpc.noaa.gov/images/swx-overview-small.gif' height='495px' style='background-color:#ffffff;'>";
  codata = codata + "<\/body><\/html>";
  var anchopantalla = 514;
  var altopantalla = 505;
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
  popupwin.setTimeout("self.close();", 120000);
  for (g = 0; g < 14; g++) {
    document.getElementById(g).style.backgroundColor = "transparent";
  }
  document.getElementById(13).style.backgroundColor = "orange";
}

function getHeightPercentage(x) {
  if (typeof x !== "number" || x < 0) {
    console.error("Input must be a non-negative number");
    return 500;
  }

  const screenHeight = window.innerHeight; // Height of the viewport in pixels
  const result = (x / 100) * screenHeight;
  return result;
}

function getWidthPercentage(x) {
  if (typeof x !== "number" || x < 0) {
    console.error("Input must be a non-negative number");
    return 500;
  }

  const screenWidth = window.innerWidth; // Width of the viewport in pixels
  const result = (x / 100) * screenWidth;
  return result;
}

function ponermapa(locator, licencia) {
  let ifrh = getHeightPercentage(80);
  let ifrw = getWidthPercentage(80);
  document.getElementById("map_canvas").style.height = `${ifrh}px`;
  document.getElementById("map_canvas").style.width = `${ifrw}px`;
  if (isIOS) {
    ifrh = getHeightPercentage(50);
    ifrw = getWidthPercentage(50);
    document.getElementById("map_canvas").style.height = `${ifrh}px`;
    document.getElementById("map_canvas").style.width = `${ifrw}px`;
  }
  document.getElementById("map_canvas").style.align = "center";

  const iframe = document.getElementById("map_canvas");
  const jsonData = {
    locator,
    licencia,
    beacon1: window.beacon1,
    locations: window.locations,
    flechas: window.flechas,
    parentLocation: window.parent.document.location.href,
    bcid: window.bcid,
    lanzamiento: lanzamiento,
    searchParams: window.parent.window.location.search,
    iframeHeight: `${ifrh - 20}px`,
    iframeWidth: `${ifrw - 20}px`,
    addplusElementValue: window.addplusElementValue,
    avgfreqElementValue: window.avgfreqElementValue,
    proxElementValue: window.proxElementValue,
    otherInputValue: document.getElementById("other").value,
    rutinaElementValue: window.rutinaElementValue,
    comentariosballoon: window.comentariosballoon,
    comentfull: window.comentfull,
    otherValues: {
      saveglobo,
      saveestaciones,
      velest,
      hide,
      Kmrecorridos,
      TZD,
      txt,
      saveglobo,
      saveestaciones,
      velest,
      meterfeet,
      prevaltutext,
      diaslaunch,
      lica,
      map,
      distanciatotal,
      rumboest,
      velest,
      sunlon,
      sunlat,
      savelato,
      savelono,
      sunarray,
      balloonarray,
      balloonCoords,
      radian,
      dt,
      launchdate,
    },
  };
  // Enviar JSON al iframe
  iframe.contentWindow.postMessage(
    { action: "SHOW_MAP", props: { jsonData } },
    "https://lu7aa.org",
  );
}

function handleMapMessage(event) {
  const { callbackName, props } = event.data;
  window[callbackName](props);
}

function changesEstacionesHtml(props) {
  document.getElementById("estaciones").innerHTML = props.html;
}

window.addEventListener("message", handleMapMessage);
