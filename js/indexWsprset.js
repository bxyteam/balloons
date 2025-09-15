var popupwin1 = null;
var nrolinea;
var nuevo = "";
var popupwin = null;
var TimezoneOffset = new Date().getTimezoneOffset() / 60;
imm = [
  imageSrcUrl["picolu1esy"],
  imageSrcUrl["picolu4bmg"],
  imageSrcUrl["lu1esyp"],
  imageSrcUrl["picove3kcl"],
  imageSrcUrl["picove3ocl"],
  imageSrcUrl["w5kub"],
  imageSrcUrl["w5kub1"],
  imageSrcUrl["picowb8elk"],
  imageSrcUrl["g0upl"],
  imageSrcUrl["qrplabs"],
  imageSrcUrl["qrplabsnew"],
  imageSrcUrl["zachtek"],
  imageSrcUrl["zachtekplus"],
  imageSrcUrl["yo3ict"],
  imageSrcUrl["qrplabsold"],
  imageSrcUrl["ta2mun"],
  imageSrcUrl["yo3icttracker"],
  imageSrcUrl["dg4nob"],
  imageSrcUrl["tucutracker"],
  imageSrcUrl["raspilora"],
  imageSrcUrl["dl6ow"],
  imageSrcUrl["traquito"],
  imageSrcUrl["ag6ns"],
  imageSrcUrl["kc3lbr"],
  imageSrcUrl["k9yo"],
  imageSrcUrl["zl1rs"],
  imageSrcUrl["lu7aabuoy"],
  imageSrcUrl["kq6rs"],
  imageSrcUrl["ab5ss"],
  imageSrcUrl["n0mpm"],
  "",
];
function gqs(nombre) {
  //Retrieve Document location and tear off the QueryString values for processing.
  var url = window.parent.window.location.href + "";
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
function clasif(que) {
  agre1 = "";
  agre2 = "";
  agre3 = "";
  if (gqs("more")) {
    agre1 = "&more=1";
  }
  if (gqs("clasi") == 0 || !gqs("clasi")) {
    agre2 = "&clasi=1";
  } else {
    agre2 = "&clasi=0";
  }
  if (gqs("call") && document.getElementById("buscar").value != "") {
    agre3 = "&call=" + document.getElementById("buscar").value;
  }
  url = "wsprset" + agre1 + agre2 + agre3;
  url = url.replace("wsprset&", "wsprset?");
  window.parent.window.location.href = `${HOST_URL}/${url}`;
}
function mas() {
  if (!gqs("more")) {
    window.parent.window.location.href = `${HOST_URL}/wsprset?more=1&call=${document.getElementById("buscar").value}`;
  } else {
    window.parent.window.location.href = `${HOST_URL}/wsprset?call=${document.getElementById("buscar").value}`;
  }
}
function cargarfotos() {
  if (gqs("clasi") == "1") {
    document.getElementById("clasifi").innerHTML = "Sort by DATE";
  } else {
    document.getElementById("clasifi").innerHTML = "Sort by CALL";
  }
  if (gqs("repito")) {
    document.getElementById("repito").style.visibility = "visible";
  }
  if (gqs("more")) {
    document.getElementById("show").innerHTML = "Show active entries";
  }
  if (gqs("call")) {
    document.getElementById("buscar").value = gqs("call");
  }
  document.getElementById("fotos").innerHTML =
    "<table border=0 cellpadding=0 cellspacing=0><tr><td align=center style='white-space:nowrap;'><br style='line-height:2px;'><center>";
  for (i = 0; i < imm.length - 1; i++) {
    document.getElementById("fotos").innerHTML =
      document.getElementById("fotos").innerHTML +
      "<img height=130px width=62px onclick='ver(this.src)' style='cursor:pointer;' title='" +
      imm[i].replace(".jpg", "").replace(".gif", "") +
      "' src=" +
      imm[i] +
      ">&nbsp;";
    if (i == 14) {
      document.getElementById("fotos").innerHTML =
        document.getElementById("fotos").innerHTML +
        "<br style='line-height:1px;'>&nbsp;";
    }
  }
  document.getElementById("fotos").innerHTML =
    document.getElementById("fotos").innerHTML + "</td></tr></table>";
}
function verimagen() {
  try {
    queimagen = document.getElementById("globero").src;
    //qm = queimagen.split("/")
    //queim = qm[qm.length - 1];
    for (i = 0; i < imm.length; i++) {
      if (queimagen == imm[i] && i < imm.length) {
        nuevo = imm[i + 1];
        break;
      }
    }
    if (nuevo == "") {
      nuevo = imm[0];
    }
    document.getElementById("globero").src = nuevo;
  } catch (error) {
    document.getElementById("globero").src = imm[0];
  }
}
function ver(what) {
  if (popupwin) {
    popupwin.close();
  }
  var laimagen = what;
  codata = `</head><body bgcolor="#eeeeee" onclick="self.close();")>
  <center><img style='cursor:pointer;' title='Click to close' src='${laimagen}'><\center></body></html>`;
  var anchopantalla = 200;
  var altopantalla = 382;
  preferences =
    "toolbar=no,width=" +
    anchopantalla +
    "px,height=" +
    altopantalla +
    "px,center,margintop=0,top=80,left=110,status=no,scrollbars=no,resizable=no,dependent=yes,z-lock=yes";
  if (popupwin != null) {
    popupwin.close();
  }
  popupwin = window.open("", "win1", preferences);
  popupwin.document.write(codata);
  popupwin.setTimeout("self.close()", 10000);
}
function show(what) {
  var laimagen = document.getElementById("globero").src;
  codata = `</head><body bgcolor="#eeeeee" onclick="self.close();")>'
    <center><img style='cursor:pointer;' title='Click to close' src='${laimagen}'><center></body></html>`;
  var anchopantalla = 200;
  var altopantalla = 382;
  preferences =
    "toolbar=no,width=" +
    anchopantalla +
    "px,height=" +
    altopantalla +
    "px,center,margintop=0,top=80,left=110,status=no,scrollbars=no,resizable=no,dependent=yes,z-lock=yes";
  if (popupwin != null) {
    popupwin.close();
  }
  popupwin = window.open("", "win1", preferences);
  popupwin.document.write(codata);
  popupwin.setTimeout("self.close()", 10000);
}

function my_onkeydown_handler(event) {
  switch (event.keyCode) {
    case 116: // 'F5'
      event.preventDefault();
      event.keyCode = 0;
      window.status = "F5 disabled";
      break;
  }
}
//document.addEventListener("keydown", my_onkeydown_handler);
var w;
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
async function checkform(ev) {
  ev.preventDefault();
  const inputNames = [
    "other",
    "band",
    "qrp",
    "SSID",
    "tracker",
    "launch",
    "detail",
    "balloonid",
    "timeslot",
    "comments",
    "telen",
    "repito",
    "wide",
  ];
  const _data = {
    who: "",
    form: {},
  };

  if (!f.other.value) {
    alert("Callsign missing");
    f.other.focus();
    return false;
  }

  if (f.other.value.length < 3 || f.other.value.length > 9) {
    alert("Callsign should be 3 to 9 characters");
    f.other.focus();
    return false;
  }
  if (f.other.value.indexOf("-") > -1) {
    alert("Enter Callsign only without SSID");
    f.other.focus();
    return false;
  }

  f.other.value = f.other.value.toLowerCase();

  if (f.balloonid) {
    f.balloonid.value = f.balloonid.value.toLowerCase();
  }
  if (f.balloonid.value != "") {
    if (f.balloonid.value.length != 2) {
      alert("Invalid Balloon-Id");
      f.balloonid.focus();
      return false;
    }
  }
  if (f.balloonid.value != "") {
    if (isNaN(f.balloonid.value.substring(1, 2))) {
      alert("Invalid Balloon-Id");
      f.balloonid.focus();
      return false;
    }
  }
  if (f.balloonid.value != "") {
    c1 = f.balloonid.value.substring(0, 1);
    if (c1 == "0" || c1 == "1" || c1 == "q") {
    } else {
      alert("Invalid Balloon-Id");
      f.balloonid.focus();
      return false;
    }
  }
  if (f.timeslot) {
    d1 = f.timeslot.value.substring(0, 1);
  }
  if (f.timeslot.value != "") {
    if (d1 == "0" || d1 == "2" || d1 == "4" || d1 == "6" || d1 == "8") {
    } else {
      alert("Invalid Timeslot");
      f.timeslot.focus();
      return false;
    }
  }
  if (f.SSID.value == "") {
    alert(
      "SSID (set value from 1 to 999)\nRequired if upload to aprs.fi\nUsually set to 11 for Balloon",
    );
    f.SSID.focus();
    return false;
  }
  if (f.SSID.value != "") {
    if (isNaN(f.SSID.value) || f.SSID.value < 0) {
      alert("SSID should be from 1 to 999\nIf over 99 NO Graphs shown");
      f.SSID.focus();
      return false;
    }
  }
  if (f.SSID.value != "" && f.SSID.value.substring(0, 1) == "0") {
    f.SSID.value = f.SSID.value.slice(-1);
  }
  if (f.detail.value != "") {
    f.detail.value = f.detail.value.toLowerCase();
  }
  if (f.detail.value != "") {
    if (f.detail.value != "on") {
      alert("Enter detail on or omit");
      f.detail.focus();
      return false;
    }
  }
  if (f.launch.value == "") {
    alert("Launch Date/Time missing");
    f.launch.focus();
    return false;
  }
  if (f.launch.value.length != 14 || isNaN(f.launch.value)) {
    alert("Launch Date/Time invalid");
    f.launch.focus();
    return false;
  }
  lanza = f.launch.value;
  if (lanza.substring(0, 4) < "2020" || lanza.substring(0, 4) > "2100") {
    alert("Launch Year invalid");
    f.launch.focus();
    return false;
  }
  if (lanza.substring(4, 6) < "01" || lanza.substring(4, 6) > "12") {
    alert("Launch Month invalid");
    f.launch.focus();
    return false;
  }
  if (lanza.substring(6, 8) < "01" || lanza.substring(6, 8) > "31") {
    alert("Launch Day invalid");
    f.launch.focus();
    return false;
  }
  if (lanza.substring(8, 10) < "00" || lanza.substring(8, 10) > "24") {
    alert("Launch Hour invalid");
    f.launch.focus();
    return false;
  }
  if (lanza.substring(10, 12) < "00" || lanza.substring(10, 12) > "59") {
    alert("Launch Minute invalid");
    f.launch.focus();
    return false;
  }
  if (lanza.substring(12, 14) < "00" || lanza.substring(12, 14) > "59") {
    alert("Launch Second invalid");
    f.launch.focus();
    return false;
  }
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
  if (f.tracker.value != "") {
    f.tracker.value = f.tracker.value.toLowerCase();
  }
  if (f.tracker.value != "" && f.tracker.value == "ict") {
    f.tracker.value = "yo3ict";
  }
  if (f.tracker.value != "" && f.tracker.value == "skytracker") {
    f.tracker.value = "wb8elk";
  }
  if (f.tracker.value != "" && f.tracker.value == "skytrack") {
    f.tracker.value = "wb8elk";
  }
  if (f.tracker.value == "lightaprs") {
    f.tracker.value = "qrplabs";
  }
  if (f.tracker.value == "zachtek") {
    f.tracker.value = "zachtek1";
  }
  if (f.tracker.value == "u4b") {
    f.tracker.value = "qrplabs";
  }
  if (
    (f.tracker.value == "qrplabs" || f.tracker.value == "traquito") &&
    (f.timeslot.value == "" || f.balloonid.value == "")
  ) {
    alert("Balloon-Id or Timeslot ommited. Suggest enter QRP Channel instead");
    f.qrp.focus();
    return false;
  }
  lanzamiento = new Date(laf);
  str1 = new Date();
  var diff = Math.floor(
    (Date.parse(str1) - Date.parse(lanzamiento)) / 86400000,
  );
  //    if (diff > 140) { alert(" Date entered is " + diff + " days old\nShowed results will have less points"); return true; }
  //  Following analyzes qrplabs entry
  band = f.band.value;
  leyend = "";
  if (band.replace(/on /, "") == "160m") {
    ffb = 1838000;
  }
  if (band.replace(/on /, "") == "80m") {
    ffb = 3569000;
  }
  if (band.replace(/on /, "") == "40m") {
    ffb = 7040000;
  }
  if (band.replace(/on /, "") == "30m") {
    ffb = 10140100;
  }
  if (band.replace(/on /, "") == "22m") {
    ffb = 13553300;
  }
  if (band.replace(/on /, "") == "20m") {
    ffb = 14097000;
  }
  if (band.replace(/on /, "") == "17m") {
    ffb = 18106000;
  }
  if (band.replace(/on /, "") == "15m") {
    ffb = 21096000;
  }
  if (band.replace(/on /, "") == "12m") {
    ffb = 24926000;
  }
  if (band.replace(/on /, "") == "10m") {
    ffb = 28126000;
  }
  if (band.replace(/on /, "") == "6m") {
    ffb = 50294000;
  }
  if (band.replace(/on /, "") == "2m") {
    ffb = 144490400;
  }
  if (band.replace(/on /, "") == "all") {
    ffb = 14097000;
  }
  //The transmit slot is first calculated as (channel % 5).
  //Then the start time in minutes past the hour, repeated every 10 minutes, is given by: 2 * ((txSlot + 2 * txBand) % 5);
  //txBand is: 0: 2200m, 1: 630m, 2: 160m, 3: 80m, 4: 60m, 5: 40m, 6: 30m, 7: 20m, 8: 17m, 9: 15m, 10: 12m, 11: 10m. 12: 6m, 13: 4m, 14: 2m
  //alert(getslot())
  if (f.qrp.value) {
    f.balloonid.value = "";
    f.timeslot.value = "";
    qrp = f.qrp.value * 1;
    if (f.balloonid.value != "" || f.timeslot.value != "") {
      alert("Enter BalloonId or QRP-ID, both is invalid...");
      f.balloonid.focus();
      return false;
    }
    if (isNaN(qrp) || qrp > 599) {
      alert("QRP-ID " + qrp + " is not a number below 600");
      f.qrp.focus();
      return false;
    }
    f.balloonid.value = getslot(f.band.value, f.qrp.value).balloonid;
    f.timeslot.value = getslot(f.band.value, f.qrp.value).timeslot;
    if (f.tracker.value == "traquito") {
      f.tracker.value = "traquito";
    } else {
      f.tracker.value = "qrplabs";
    }
    if (band == "All") {
      band = "20m";
    }
    modulo = Math.floor((f.qrp.value % 20) / 5);
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
    if (f.band.value == "All") {
      others = " + All";
    } else {
      others = "";
    }
    leyend =
      "for " +
      band +
      ", transmit frequency ~" +
      ((ffb + fd) / 1000).toFixed(3) +
      " Hz, dial ~ " +
      ((ffb + fd - 1400) / 1000).toFixed(3) +
      others +
      "\n";
    alerta = "";
    if (f.qrp.value) {
      for (m = 0; m < bj.length; m++) {
        if (bj[m][8] * 1 == f.qrp.value * 1) {
          if (bj[m][6] != "") {
            SSI = "-" + bj[m][6];
          } else {
            SSI = "";
          }
          alerta =
            alerta +
            "Warning... Channel " +
            f.qrp.value * 1 +
            " used by " +
            bj[m][0].toUpperCase() +
            SSI +
            " on " +
            bj[m][1] +
            ", Launch: " +
            mes[bj[m][5].substring(4, 6) * 1 - 1] +
            "-" +
            bj[m][5].substring(0, 4) +
            "\n";
        }
      }
      if (alerta.length > 0) {
        alert(alerta);
      }
    }
  }
  for (h = 0; h < bj.length; h++) {
    if (
      bj[h][0] == f.other.value &&
      bj[h][1] == band &&
      bj[h][2] == f.balloonid.value &&
      bj[h][3] == f.timeslot.value &&
      bj[h][5] == f.launch.value &&
      bj[h][7] == f.tracker.value &&
      bj[h][6] * 1 == f.SSID.value * 1 &&
      bj[h][4] == f.detail.value &&
      bj[h][8] == f.qrp.value
    ) {
      if (f.tracker.value == "") {
        trackerid = "undefined";
      } else {
        trackerid = f.tracker.value;
      }
      if (desdechange) {
      } else {
        alert(
          "  =====================\n   Entry for " +
            f.other.value.toUpperCase() +
            " on " +
            f.band.value +
            " band\n   Launch " +
            f.launch.value.substring(4, 6) +
            "/" +
            f.launch.value.substring(6, 8) +
            " " +
            f.launch.value.substring(0, 4) +
            " at " +
            launch.value.substring(8, 10) +
            ":" +
            launch.value.substring(10, 12) +
            ":" +
            launch.value.substring(12, 14) +
            " z " +
            "\n    Balloon using " +
            trackerid +
            " tracker\n  =====================\n   * This entry already included *\n\n If you want to Delete/Hide this entry\n  Click on 'Hide or Restore this entry'\n  Then you may declare a new entry\n\n  If want Update/Change this entry\nClick on your entry call and change\nyour entry data then click to Update\nAlso change launchdate (add 1 sec)",
        );
        return false;
      }
    }
  }
  if (f.band.value == "All") {
    others = " + All";
  } else {
    others = "";
  }
  if (!leyend) {
    leyend =
      "for " +
      band +
      ", transmit frequency ~" +
      ((ffb + 100) / 1000).toFixed(3) +
      " Hz, dial ~ " +
      ((ffb - 1400) / 1000).toFixed(3) +
      others +
      "\n";
  }

  if (desdechange) {
  } else {
    if (
      confirm(
        leyend +
          "OK to save into the presets? ... Click Cancel to check or change ...",
      )
    ) {
      document.getElementById("Send").style.backgroundColor = "green";
      document.getElementById("Send").style.color = "gold";
      document.getElementById("who").value = prompt(
        "Enter call of wspr inventor",
      );

      [...f.querySelectorAll("input")].forEach((i) => {
        if (inputNames.includes(i.name)) {
          _data.form[i.name] = i.value.toString().trim();
        }
      });
      _data.form["comments"] = f.comments.value;
      _data.form["band"] = f.band.value;
      _data.who = document.getElementById("who").value;

      const response = await sendBalloonData(_data);

      return true;
    } else {
      return false;
    }
  }
} // END CHECK Form

async function sendBalloonData(_data) {
  console.log(_data);
  document.getElementById("spinner-overlay").style.display = "flex";
  try {
    const browxyActions = {
      action: "UPLOAD",
      message: {
        executionParam: {
          functionName: "saveBalloon",
        },
        formParams: [
          {
            type: "text",
            value: {
              data: btoa(JSON.stringify(_data)),
              paramName: "jsonBalloon",
            },
          },
        ],
      },
    };
    console.log(browxyActions);
    window.parent.postMessage(browxyActions, HOST_URL);
  } catch (error) {
    console.error("Error sending balloon data:", error);
  } finally {
    //document.getElementById("spinner-overlay").style.display = "none";
  }
}

function showfreq(
  band,
  qrpn,
  estacion,
  SSID,
  comments,
  freq,
  tracker,
  detail,
  balloonid,
  timeslot,
  j,
  qp,
) {
  nrolinea = j;
  document.getElementById("hide").style.visibility = "visible";
  document.getElementById("change").style.visibility = "visible";
  if (SSID != "") {
    document.getElementById("repitospan").style.visibility = "visible";
  }
  helpj =
    '<!DOCTYPE ohtml PUBLIC "-\/\/W3C\/\/DTD HTML 4.01 Transitional\/\/EN">\n';
  helpj = helpj + "<html><head>\n";
  helpj =
    helpj +
    '<meta http-equiv="Content-Type" content="text/html;charset=ISO-8859-1">\n';
  helpj =
    helpj +
    '<title>Freq<\/title><\/head><body style="margin-top:0px;margin-left:0px;margin-right:0;color:#ffffff;font-size:15px;font-family:Tahoma;" bgcolor="#000000">\n';
  ffb = 14097000;
  ffd = 100;
  if (qrpn != "") {
    modulo = Math.floor((qrpn % 20) / 5);
    if (modulo === 0) {
      ffd = 20 * 1;
    }
    if (modulo === 1) {
      ffd = 60 * 1;
    }
    if (modulo === 2) {
      ffd = 140 * 1;
    }
    if (modulo === 3) {
      ffd = 180 * 1;
    }
  } else {
    ffd = 100 * 1;
  }
  if (SSID != "" && SSID.substring(0, 1) == "0") {
    SSID = SSID.slice(-1);
  }
  if (SSID) {
    ley1 = "-" + SSID;
  } else {
    ley1 = "";
  }
  helpj = helpj + "<center><br>For " + estacion + ley1 + " " + band + "<br>";
  if (band.replace(/on /, "") == "160m") {
    ffb = 1838000;
  }
  if (band.replace(/on /, "") == "80m") {
    ffb = 3569000;
  }
  if (band.replace(/on /, "") == "40m") {
    ffb = 7040000;
  }
  if (band.replace(/on /, "") == "30m") {
    ffb = 10140100;
  }
  if (band.replace(/on /, "") == "22m") {
    ffb = 13553300;
  }
  if (band.replace(/on /, "") == "20m") {
    ffb = 14097000;
  }
  if (band.replace(/on /, "") == "17m") {
    ffb = 18106000;
  }
  if (band.replace(/on /, "") == "15m") {
    ffb = 21096000;
  }
  if (band.replace(/on /, "") == "12m") {
    ffb = 24926000;
  }
  if (band.replace(/on /, "") == "10m") {
    ffb = 28126000;
  }
  if (band.replace(/on /, "") == "6m") {
    ffb = 50294000;
  }
  if (band.replace(/on /, "") == "2m") {
    ffb = 144490400;
  }
  if (band.replace(/on /, "") == "All") {
    ffb = 14097000;
  }
  if (f.qrp.value) {
    f.balloonid.value = "";
    f.timeslot.value = "";
    qrp = f.qrp.value * 1;
    if (f.balloonid.value != "" || f.timeslot.value != "") {
      alert("Enter BalloonId or QRP-ID, both is invalid...");
      f.balloonid.focus();
      return false;
    }
    if (isNaN(qrp) || qrp > 599) {
      alert("QRP-ID " + qrp + " is not a number below 600");
      f.qrp.focus();
      return false;
    }
    qrp = ("000" + qrp.toFixed(0)).slice(-3);
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
    } //verify why not using last character between 5 and 9
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
    f.balloonid.value = c1 + c2;
    f.timeslot.value = c3;
    f.tracker.value = "qrplabs";
    if (band == "All") {
      band = "20m";
    }
    modulo = Math.floor((qrpn % 20) / 5);
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
    ffd = fd;
  } else {
    ffd = 100;
  }
  if (qp == "qp=on") {
    f.telen.checked = true;
  } else {
    f.telen.checked = false;
  }
  leyend = "Transmit Frequency<br> ~" + (ffb + ffd) * 1 + " Hz" + "\n";
  helpj = helpj + leyend + "<br><br style='line-height:3px;'>";
  if (ffd == 100) {
    ley = "center";
  } else ley = ffd / 2 + " %";
  helpj =
    helpj +
    "<div id='punto' style='position:relative;width:130px;height:17px;border:1px solid #ffffff;background-color:#555555;font-size:14px;text-align:center;'><center>At " +
    ley +
    " of band<\/center><\/div";
  helpj = helpj + "<br>";
  if (ffd == 100) {
    impri = "&#x25B2;";
  }
  if (ffd == 20) {
    impri = "&#x25B2;" + "&nbsp;".repeat(25);
  }
  if (ffd == 60) {
    impri = "&#x25B2;" + "&nbsp;".repeat(13);
  }
  if (ffd == 140) {
    impri = "&nbsp;".repeat(13) + "&#x25B2;";
  }
  if (ffd == 180) {
    impri = "&nbsp;".repeat(25) + "&#x25B2;";
  }
  helpj = helpj + impri;
  if (comments.length > 20) {
    textos = decodeURIComponent(comments.replace(/comments=/, ""));
    textos = textos.replace(/\+/g, " ");
    textos = textos.replace(/repito=/g, "");
    helpj =
      helpj +
      "<br><br><div id=coment style='width:480px;position:absolute;left:-180px;text-align:left;'>" +
      textos +
      "<\/div>";
  }
  helpj = helpj + "<\/center><\/body><\/html>";
  if (comments.length < 20) {
    var isOpera =
      window.navigator.userAgent.indexOf("OPR") > -1 ||
      window.navigator.userAgent.indexOf("Opera") > -1;
    if (isOpera) {
      preferences =
        "toolbar=no,width=200px,height=206px,center,margintop=0,top=130,left=180,status=no,scrollbars=no,resizable=no,dependent=yes,z-lock=yes";
    } else {
      preferences =
        "toolbar=no,width=200px,height=118px,center,margintop=0,top=130,left=180,status=no,scrollbars=no,resizable=no,dependent=yes,z-lock=yes";
    }
  } else {
    var isOpera =
      window.navigator.userAgent.indexOf("OPR") > -1 ||
      window.navigator.userAgent.indexOf("Opera") > -1;
    if (isOpera) {
      preferences =
        "toolbar=no,width=550px,height=406px,center,margintop=0,top=130,left=180,status=no,scrollbars=no,resizable=no,ddeependent=yes,z-lock=yes";
    } else {
      preferences =
        "toolbar=no,width=550px,height=418px,center,margintop=0,top=130,left=180,status=no,scrollbars=no,resizable=no,dependent=yes,z-lock=yes";
    }
  }

  var height = document.body.scrollHeight - 900;
  window.scroll(0, height);
  if (comments.length > 9) {
    f.comments.value = textos;
  } else {
    f.comments.value = "";
  }
  f.other.value = estacion;
  f.band.value = band.replace(/on /, "");
  f.qrp.value = qrpn;
  f.SSID.value = SSID;
  f.tracker.value = tracker.replace(/tracker=/, "");
  f.launch.value = freq.replace(/launch=/, "");
  f.detail.value = detail.replace(/detail=/, "");
  f.balloonid.value = balloonid.replace(/balloonid=/, "");
  f.timeslot.value = timeslot.replace(/timeslot=/, "");
  if (popupwin1 != null) {
    popupwin1.close();
  }
  popupwin1 = window.open("", "win1", preferences);
  popupwin1.document.write(helpj);
  popupwin1.setTimeout("self.close()", 60000);
  textos = decodeURIComponent(bj[j][9].replace(/\+/g, " "));
  document.getElementById("comments").value = textos;
  f.comments.value = f.comments.value
    .replace(/telen=&/, "")
    .replace(/telen=on&/, "")
    .replace(/wide=on&/, "");
}
function isCallKey(evt) {
  var charCode = evt.which ? evt.which : event.keyCode;
  if (
    (charCode > 46 && charCode < 58) ||
    (charCode > 64 && charCode < 91) ||
    (charCode > 96 && charCode < 123) ||
    charCode == 8
  )
    return true;
  return false;
}
desdechange = false;
var popupwin;
function isEmail(inputText) {
  var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (inputText.value.match(mailformat)) {
    return true;
  } else {
    alert("You have entered an invalid email address!");
    document.search.email.focus();
    return false;
  }
}
var mes = new Array(
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
);

function clearentries() {
  document.getElementById("hide").style.visibility = "hidden";
  document.getElementById("change").style.visibility = "hidden";
  f.comments.value = "";
  f.other.value = "";
  f.band.selectedIndex = 6;
  f.qrp.value = "";
  f.SSID.value = "";
  f.tracker.value = "";
  f.launch.value = "";
  f.detail.value = "";
  f.balloonid.value = "";
  f.timeslot.value = "";
  f.telen.checked = false;
  f.wide.checked = false;
  document.getElementById("repitospan").style.visibility = "hidden";
}
function U4B() {
  preferences =
    "toolbar=no,width=920px,height=570px,center,margintop=0,top=50,left=10,status=no,scrollbars=yes,resizable=no,dependent=yes,z-lock=yes";
  if (popupwin != null) {
    popupwin.close();
  }
  popupwin = window.open("", "win", preferences);
  helpi = `<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
  <html><head>
  <meta http-equiv="Content-Type" content="text/html;charset=ISO-8859-1">
  <title>U4B Table</title></head><body style="margin-top:0px;margin-left:0px;margin-right:0;color:#ffffff;font-size:15px;font-family:Tahoma;" bgcolor="#000000">
  <center><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href='https://www.qrp-labs.com/tracking.html' style='color:cyan;cursor:pointer' title='Go to QRP-LABs tracking page' target='_blank'>QRP-LABS</a> U4B 20m Frequency Table according to QRP-ID entered, also defines Channel-ID and TimeSlot<br><br>
  <img src='${imageSrcUrl["qrptable"]}' style='-webkit-filter:invert(100%);filter:progid:DXImageTransform.Microsoft.BasicImage(invert='1');'>
  </body></html>`;
  popupwin.document.write(helpi);
  popupwin.setTimeout("self.close()", 120000);
}

function gohide() {
  // Crear el overlay si no existe
  let overlay = document.getElementById("wspr-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "wspr-overlay";
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      font-family: Tahoma, Arial, sans-serif;
      font-size: 12px;
    `;
    document.body.appendChild(overlay);
  }

  // Procesar los datos
  const datas = encodeURIComponent(bj[nrolinea]);
  const datam = datas.split("%2C");

  let callInfo = datam[0].toUpperCase();
  if (datam[6] != "") {
    callInfo += ` - ${datam[6]}`;
  }

  const colaunch = `Launch ${mes[datam[5].substring(4, 6) * 1 - 1]}-${datam[5].substring(6, 8)}-${datam[5].substring(0, 4)} ${datam[5].substring(8, 10)}:${datam[5].substring(10, 12)}z ${datam[7]}`;

  // Crear el contenido del formulario
  overlay.innerHTML = `
    <div style="
      background-color: #172447;
      color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      width: 420px;
      max-width: 90vw;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
      position: relative;
    ">
      <button id="close-overlay" style="
        position: absolute;
        top: 10px;
        right: 15px;
        background: none;
        border: none;
        color: #ffffff;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        width: 25px;
        height: 25px;
      ">&times;</button>
    <input type="hidden" id="executionState" name="executionState" value="STOPPED">
    <div id="wspr-overlay-content">
      <div style="font-size: 16px; line-height: 18px; margin-bottom: 20px;">
        You are about to Hide or Restore entry for<br><br>
        ${callInfo} ${colaunch}
      </div>

      <form id="wspr-form">
        <div style="margin: 20px 0;">
          <label for="whoInventor" style="display: block; margin-bottom: 10px;">
            Enter Call of WSPR inventor:
          </label>
          <input
            id="whoInventor"
            name="whoInventor"
            size="12"
            maxlength="10"
            type="text"
            style="
              text-transform: uppercase;
              padding: 5px;
              border: 1px solid #ccc;
              border-radius: 3px;
              font-size: 12px;
            "
            onCopy="return false"
            onDrag="return false"
            onDrop="return false"
            onPaste="return false"
            value=""
            required
          >
        </div>

        <input type="hidden" id="datos" name="datos" value="${bj[nrolinea]}">
        <input type="hidden" id="comenta" name="comenta" value="${encodeURIComponent(document.getElementById("comments").value)}">

        <div style="margin: 20px 0;">
          <button class="goHide-control-btn" type="submit" style="
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin-right: 10px;
            font-weight: bold;
          ">Enviar</button>

          <button class="goHide-control-btn"  type="button" id="cancel-btn" style="
            background-color: #f44336;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
          ">Cancelar</button>
        </div>

        <div style="font-style: italic; font-size: 11px; margin-top: 15px;">
          Anti spam check and confirmation of intention<br>
          <span style="line-height: 6px;"><br></span>
          After submit, wait 30 seconds for confirmation
        </div>
      </form>
      </div>
    </div>
  `;

  // Mostrar el overlay
  overlay.style.display = "flex";

  // Event listeners
  document.getElementById("close-overlay").onclick = closeOverlay;
  document.getElementById("cancel-btn").onclick = closeOverlay;

  // Cerrar overlay al hacer clic fuera del formulario
  overlay.onclick = function (e) {
    if (!document.getElementById("wspr-overlay")) return;

    if (document.getElementById("executionState").value === "RUNNING") return;

    if (e.target === overlay) {
      closeOverlay();
    }
  };

  // Manejar envío del formulario
  document.getElementById("wspr-form").onsubmit = function (e) {
    e.preventDefault();
    /*
<input id="who" name="who" size="12" maxlength="10" type="text" style="text-transform: uppercase;" oncopy="return false" ondrag="return false" ondrop="return false" onpaste="return false" value="">
    <input type="hidden" id="datos" name="datos" value="ab9lm,20m,17,2,,20240206000000,11,qrplabs,346,">
    <input type="hidden" id="comenta" name="comenta" value="">

*/
    if (document.getElementById("whoInventor").value.trim() === "") {
      alert("Por favor ingrese el call del inventor WSPR");
      document.getElementById("whoInventor").focus();
      return false;
    }
    document.getElementById("executionState").value = "RUNNING";
    const _formData = {
      who: document.getElementById("whoInventor").value.trim(),
      datos: document.getElementById("datos").value.trim(),
      comenta: document.getElementById("comenta").value.trim(),
    };
    document.querySelectorAll(".goHide-control-btn").forEach((el) => {
      el.style.pointerEvents = "none";
      el.style.cursor = "not-allowed";
    });

    try {
      const browxyActions = {
        action: "UPLOAD",
        message: {
          executionParam: {
            functionName: "hideRestoreBalloon",
          },
          formParams: [
            {
              type: "text",
              value: {
                data: btoa(JSON.stringify(_formData)),
                paramName: "jsonBalloon",
              },
            },
          ],
        },
      };
      console.log(browxyActions);
      window.parent.postMessage(browxyActions, HOST_URL);
    } catch (error) {
      console.error("Error hidden/restore balloon data:", error);
      if (!document.getElementById("wspr-overlay")) return;
      document.querySelectorAll(".goHide-control-btn").forEach((el) => {
        el.style.pointerEvents = "auto";
        el.style.cursor = "cursor";
      });
      document.getElementById("executionState").value = "STOPPED";
    }
  };

  function closeOverlay() {
    if (document.getElementById("executionState").value === "RELOADING") {
      window.parent.window.location.reload();
    } else {
      document.getElementById("wspr-overlay").remove();
    }
  }

  // Enfocar el campo de entrada
  setTimeout(() => {
    document.getElementById("whoInventor").focus();
  }, 100);
}

function getqrp(qrp) {
  fcc = 14097000;
  if (typeof qrp != "undefined") {
    qrporig = qrp;
    if (qrp.length < 4) {
      if (f.band.value == "160m") {
        fcc = 1838000;
      }
      if (f.band.value == "80m") {
        fcc = 3569000;
      }
      if (f.band.value == "40m") {
        fcc = 7040000;
      }
      if (f.band.value == "30m") {
        fcc = 10140100;
      }
      if (f.band.value == "17m") {
        fcc = 18106000;
      }
      if (f.band.value == "15m") {
        fcc = 21096000;
      }
      if (f.band.value == "12m") {
        fcc = 24926000;
      }
      if (f.band.value == "10m") {
        fcc = 28126000;
      }
      if (f.band.value == "6m") {
        fcc = 50294000;
      }
      if (f.band.value == "2m") {
        fcc = 144490400;
      }
    }
  }
  var qrp;
  var fd;
  function getchannel(id, ts, fr) {
    for (chanx = 0; chanx < 600; chanx++) {
      chanx = (chanx + " ").replace(/ /, "");
      balloonid = getslot(f.band.value, chanx).balloonid;
      timeslot = getslot(f.band.value, chanx).timeslot;
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
            f.band.value,
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
    if (qrp < 200 && qrp > -1) {
      c2 = c2 * 1;
    }
    if (qrp > 199 && qrp < 400 && qrp > 299) {
      c2 = c2 * 1;
    }
    if (qrp > 400 && qrp > 499) {
      c2 = c2 * 1;
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
      balloonid = getslot(f.band.value, qrp).balloonid;
      timeslot = getslot(f.band.value, qrp).timeslot;
      getchan(qrp);
      alert(
        "U4B Channel:" +
          qrp +
          "  Id:" +
          balloonid +
          " , Timeslot:" +
          timeslot +
          ", Central Frec:" +
          (fcc * 1 + fd * 1) +
          " Hz +/-20Hz",
      );
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
    canal = prompt(
      "Following " +
        f.band.value +
        " calcs valid for QRPLABs, Traquito and KC3LBR trackers\n                   (May change band by selecting different band)\n\nChan-ID: 1st+3rd character of 2nd transmission 00~09, 10~19, Q0~Q9\n      Timeslot (one digit) is even start minute of second transmission\n\n  Enter Channel (000-599) gives Channel-ID, Timeslot and frequency" +
        "\n    Or enter ID, Timeslot, DeltaFrec 20,60,140,180 to get Channel-Id\n\n",
    );
    if (canal != null) {
      getqrp(canal);
    } else {
    }
  }
}
