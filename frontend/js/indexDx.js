Image0 = new Image(310, 28);
Image0.src = imageSrcUrl["loading"];
Image1 = new Image(60, 60);
Image1.src = imageSrcUrl["amsatb"];
Image2 = new Image(35, 38);
Image2.src = imageSrcUrl["contact"];
Image3 = new Image(2160, 1080);
Image3.src = imageSrcUrl["world2"];
Image4 = new Image(4320, 2160);
Image4.src = imageSrcUrl["p"];
Image5 = new Image(13, 12);
Image5.src = imageSrcUrl["c"];
Image6 = new Image(16, 16);
Image6.src = imageSrcUrl["sun1"];
Image7 = new Image(43, 43);
Image7.src = imageSrcUrl["balloon"];
Image8 = new Image(38, 46);
Image8.src = imageSrcUrl["parabola"];
Image9 = new Image(38, 15);
Image9.src = imageSrcUrl["OQ"];

function escapeUnicode(str) {
  return [...str]
    .map((c) =>
      /^[\x00-\x7F]$/.test(c)
        ? c
        : c
            .split("")
            .map((a) => "\\u" + a.charCodeAt().toString(16).padStart(4, "0"))
            .join(""),
    )
    .join("");
}
function ira(donde) {
  enviar.call.value = donde.toUpperCase();
  window.parent.window.location.href =
    window.parent.window.location.origin +
    "/dx?call=" +
    donde.toUpperCase().trim() +
    "&timelimit=1209600";
}
function drawChart1() {
  if (gqs("call") != "") {
    calla = decodeURIComponent(gqs("call")).toUpperCase();
  } else {
    calla = "Random Call";
  }
  google.charts.setOnLoadCallback(drawChart1);
  function drawChart1() {
    var data = google.visualization.arrayToDataTable([
      ["Task", "Hours per Day"],
      ...JSON.parse(
        `[${mid(window.colsChart, 1, window.colsChart.length - 1)
          .replaceAll("\t", "")
          .replaceAll("\n", "")}]`,
      ),
    ]);

    var options = {
      chartArea: { left: 320, top: 95, width: "100%", height: "100%" },
      title: calla + " Reports %, Percent by Band, for " + window.hactivo + ".",
      titleTextStyle: {
        color: "black",
        fontSize: 28,
        bold: false,
        italic: true,
      },
      legendTextStyle: {
        color: "black",
        fontSize: 19,
        bold: false,
        italic: true,
      },
      is3D: true,
      sliceVisibilityThreshold: 0.0001,
    };
    var chart = new google.visualization.PieChart(
      document.getElementById("container"),
    );
    chart.draw(data, options);
  }
}
function poneroriginal() {
  document.getElementById("top").innerHTML =
    "<center><table title='See GMT/UTC Calendar' cellpadding=0 cellspacing=0 style='height:100%;line-height:19px;background-color:lightyellow;width:107px;text-shadow: 1px 1px 0 #777777, 1px 2px 0 #777777;'><tr><td><center><b><i><span style='line-height:9px;font-size:12px;'>WSPR</span><br style='line-height:1px;'><span style='font-size:22px;color:#ADD8E6;line-height:19px;text-shadow: 1px 1px 0 #777777, 1px 2px 0 #777777;'>QRP DX<\/span><br><span style='line-height:12px;'><br style='line-height: 5px;'>" +
    window.mesdereporte +
    "</span></i></b></center></td></tr></table></center>";
  swit = false;
}
function changeyear() {
  newyear = prompt("Change mini Calendar Year to:", year);
  if (newyear != null) {
    year = newyear;
  }
}
function diamasuno() {
  today.setDate(today.getDate() + 1);
  hoyes = today.getUTCDate();
  month = today.getUTCMonth() + 1;
  year = today.getUTCFullYear();
  mon = month - 1;
}
function diamenosuno() {
  today.setDate(today.getDate() - 1);
  hoyes = today.getUTCDate();
  month = today.getUTCMonth() + 1;
  year = today.getUTCFullYear();
  mon = month - 1;
}
var swit = false;
var direccion = 0;
today = new Date();
var hoyes = today.getUTCDate();
month = today.getUTCMonth() + 1;
year = today.getUTCFullYear();
let mon = month - 1; // months in JS are 0..11, not 1..12
function getEaster(year) {
  var f = Math.floor,
    G = year % 19,
    C = f(year / 100),
    H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30,
    I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11)),
    J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7,
    L = I - J,
    month = 3 + f((L + 40) / 44),
    day = L + 28 - 31 * f(month / 4);
  return [month, day];
}
function createCalendar() {
  if (swit == true) {
    poneroriginal();
    document.getElementById("espacios").innerHTML =
      "<br style='line-height:63px;'>";
    return;
  }
  //if (document.getElementById("top").innerHTML.length > 500) { poneroriginal(); return;}
  var mes = new Array(
    "January",
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
  );
  if (direccion == 0) {
  } else {
    mon = mon + direccion * 1;
    direccion = 0;
  }
  if (mon == 12) {
    mon = mon % 12;
    year = year * 1 + 1;
  }
  if (mon < 0) {
    mon = 12 - Math.abs(mon % 12);
    year = year * 1 - 1;
  }
  let d = new Date(year, mon);
  cuentalineas = 1;
  let cal =
    "<center><table title='GMT calendar view&#13Click on SA=day+1&#13Click on SU=day-1&#13< > change Month&#13Click Month for year&#13 or click to see Logo' border=1 cellspacing=0 cellpadding=0 bordercolor='#f0f0f0' style='position:absolute;left:-2px;top:-2px;font-size: 11px;line-height:8px;font-weight:bold;text-align:center;background-color:lightyellow;font-family:Arial Narrow;border-style:outset;border-width:2px;border-radius: 8px;width:111px;'><tr style='height:13px;'><td onclick=\"direccion=direccion-1;createCalendar();\" style='background-color:#4e7330;color:white;border-right-width:0px;vertical-align:top;' title='Previous Month'><</td><td title='Change Year' onclick='changeyear();createCalendar();' colspan=5 style='font-size:11px;font-weight:bold;height:11px;border-top-width:0px;line-height:10px;background-color:#4e7330;color:white;border-right-width:0px;border-left-width:0px;'>" +
    mes[mon] +
    " " +
    year +
    "</td><td title='Next Month' onclick=\"direccion=direccion+1;createCalendar();\" style='border-left-width:0px;background-color:#4e7330;color:white;vertical-align:top;'>></td></tr><tr><th title='day-1' onclick='diamenosuno();createCalendar();' style='color:#9e0000;'>SU</th><th>MO</th><th>TU</th><th>WE</th><th>TH</th><th>FR</th><th title='day+1' onclick='diamasuno();createCalendar();'>SA</th></tr><tr>";
  // spaces for the first row
  // from Monday till the first day of the month
  // * * * 1  2  3  4
  if (getDay(d) != 7) {
    for (let i = 0; i < getDay(d); i++) {
      cal += "<td></td>";
    }
  }
  // <td> with actual dates
  pm = getEaster(year * 1)[0];
  p1 = getEaster(year * 1)[1] - 1;
  p2 = getEaster(year * 1)[1] - 2;
  p3 = getEaster(year * 1)[1] - 3;
  while (d.getMonth() == mon) {
    if (
      d.getDate() == hoyes &&
      mon == today.getUTCMonth() &&
      year == today.getUTCFullYear()
    ) {
      cal +=
        "<td title='Selected Day' style='background-color:#2e5310;color:white;font-weight:bold;border-width:0;font-family:Tahoma;color:yellow;font-size:10px;text-vertical-align:top;'>" +
        d.getDate() +
        "</td>";
    } else {
      if (
        (pm == mon + 1 &&
          (p1 == d.getDate() || p2 == d.getDate() || p3 == d.getDate())) ||
        getDay(d) % 7 == 0 ||
        (d.getDate() == 31 && mon == 11) ||
        (d.getDate() == 25 && mon == 11) ||
        (d.getDate() == 1 && mon == 0) ||
        (d.getDate() == 1 && mon == 4) ||
        (d.getDate() == 12 && mon == 9)
      ) {
        cal += "<td style='color:#9e0000;'>" + d.getDate() + "</td>";
      } else {
        cal += "<td>" + d.getDate() + "</td>";
      }
    }
    if (getDay(d) % 7 == 6) {
      // sunday, last day of week - newline
      cal += "</tr><tr>";
      cuentalineas = cuentalineas + 1;
    }
    d.setDate(d.getDate() + 1);
  }
  // add spaces after last days of month for the last row
  // 29 30 31 * * * *
  k = 0;
  if (getDay(d) != 0) {
    for (let i = getDay(d); i < 7; i++) {
      k = i;
      cal += "<td></td>";
    }
  }
  if (k == 0) {
    cuentalineas = cuentalineas - 1;
  }
  // close the table
  cal += "</tr></table></center>";
  swit = true;
  document.getElementById("top").innerHTML = cal;
  document.getElementById("espacios").innerHTML =
    "<br style='line-height:76px;'>";
  if (cuentalineas == 5) {
    document.getElementById("espacios").innerHTML =
      "<br style='line-height:76px;'>";
  }
  if (cuentalineas == 6) {
    document.getElementById("espacios").innerHTML =
      "<br style='line-height:86px;'>";
  }
  if (cuentalineas == 4) {
    document.getElementById("espacios").innerHTML =
      "<br style='line-height:66px;'>";
  }
}
function getDay(date) {
  // get day number from 0 (monday) to 6 (sunday)
  let day = date.getDay();
  if (day == 0) day = 7; // make Sunday (0) the last day
  return day;
}
function goto10() {
  titilar();
  window.parent.window.location.href = `${window.parent.window.location.href
    //.replace(/dx/, "dx")
    .replace(/#/g, "")}&slower=true`;
}

function help() {
  alert(
    "This function takes data from wsprnet.org\nand shows for a specified callsign graphics\nwith amount of reports that received this\ncallsign for the specified period and band.\nAllowing see condx for every hour & band\n from the place where emiting Callsign is.\n\nTry select any of the Intl. WSPR Beacons\n from your area to see local conditions.",
  );
}
z = 1;
dkm = "";
var fromto = "";
var zoomm = ["1", "2", "4", "8"];
function bz(que) {
  nolinea();
  if (que == "+") {
    if (z == 1) {
      z = 2;
      hx = homexy(homeloc).x - 3;
      hy = homexy(homeloc).y;
      creadiv();
      vermapa();
      return;
    }
    if (z == 2) {
      z = 4;
      hx = homexy(homeloc).x - 2;
      hy = homexy(homeloc).y;
      creadiv();
      vermapa();
      return;
    }
    if (z == 4) {
      z = 8;
      hx = homexy(homeloc).x;
      hy = homexy(homeloc).y;
      creadiv();
      vermapa();
      return;
    }
  } else {
    if (z == 8) {
      z = 4;
      hx = homexy(homeloc).x - 2;
      hy = homexy(homeloc).y;
      creadiv();
      vermapa();
      return;
    }
    if (z == 4) {
      z = 2;
      hx = homexy(homeloc).x - 3;
      hy = homexy(homeloc).y;
      creadiv();
      vermapa();
      return;
    }
    if (z == 2) {
      z = 1;
      hx = homexy(homeloc).x - 3;
      hy = homexy(homeloc).y;
      creadiv();
      vermapa();
      return;
    }
  }
}
function cambiartz(leyenda, tz1) {
  if (
    window.confirm(
      leyenda +
        "\n\nTo graph using this Time-Zone click Accept, else click Cancel",
    )
  ) {
    document.getElementById("tz").value = tz1;
    enviando();
    document.getElementById("enviar").submit();
  }
}
function see(que, lq) {
  ci = et[lq][2];
  if (
    window.confirm(
      que + "\n\nTo show " + ci + " activity click Accept, else click Cancel",
    )
  ) {
    document.getElementById("call").value = ci;
    enviando();
    document.getElementById("enviar").submit();
  }
}
function creadivi() {
  body = document.body;
  for (d = 0; d < et.length; d++) {
    var div = document.createElement("div");
    div.id = d;
    div.setAttribute("onmouseover", "linea(et[id][3])");
    div.setAttribute("onmouseout", "nolinea()");
    div.style.top = lll(et[d][3]).lat + "px";
    div.style.zIndex = 999;
    leftpos = lll(et[d][3]).lon;
    if (z == 1) {
      leftpos = leftpos + 540 - homexy(homeloc).x;
    }
    if (z == 1 && leftpos < 120) {
      leftpos = leftpos + 1080;
    }
    if (z == 1 && leftpos > 1200) {
      leftpos = leftpos - 1080;
    }
    //        document.write (leftpos+", ")
    div.style.left = leftpos + "px";
    div.className = "dv";
    if (et[d][1] > 4) {
      ban = parseInt(et[d][1]);
    } else {
      ban = et[d][1];
    }

    if (gqs("bs") == "B" || gqs("bs") == "") {
      div.innerHTML =
        "<img src='" +
        imageSrcUrl["p"] +
        "' title=' " +
        et[d][2] +
        "&nbsp;@" +
        ban +
        "MHz&#13Rcvd " +
        et[d][7] +
        " times @" +
        et[d][4] +
        "&#13Last: " +
        et[d][0] +
        " z&#13 Distance " +
        et[d][5] +
        " Km.' onclick='see(this.title," +
        d +
        ")'>";
    } else {
      div.innerHTML =
        "<img src='" +
        imageSrcUrl["p"] +
        "' title=' " +
        et[d][2] +
        "&nbsp;" +
        et[d][6] +
        "w&nbsp;" +
        ban +
        "MHz&#13Rcvd " +
        et[d][7] +
        " times @" +
        et[d][4] +
        "&#13Last: " +
        et[d][0] +
        " z&#13 Distance " +
        et[d][5] +
        " Km.' onclick='see(this.title," +
        d +
        ")'>";
    }
    body.appendChild(div);
  }
  var div = document.createElement("div");
  div.id = window.et.length;
  div.setAttribute("onmouseover", "lineam()");
  div.setAttribute("onmouseout", "nolinea()");
  div.setAttribute("class", "dv");
  positop = lll(window.homeloc).lat - 6 + "px";
  posileft = lll(window.homeloc).lon;
  if (z == 1) {
    posileft = posileft + 540 - homexy(window.homeloc).x;
  }
  if (posileft < 0) {
    posileft = posileft + 1080;
  }
  if (posileft > 1200) {
    posileft = posileft - 1080;
  }
  posileft = posileft + "px";
  if (gqs("bs") == "B" || !gqs("bs")) {
    div.style.cssText =
      "position:absolute;top:" +
      positop +
      ";left:" +
      posileft +
      ";z-index:1000;opacity:0.85;visibility:visible;width:12px;height:12px;";
    div.innerHTML = `<img title='${window.lichome} Beacon @${window.loc2tz(window.home)}&#13;Xmit Pwr $window.pwr%} Watt&#13;${window.bemit}' src='${imageSrcUrl["c"]}' onclick='cambiartz(this.title,${window.loc2tz1(window.home)})'>`;
    body.appendChild(div);
  } else {
    div.style.cssText =
      "position:absolute;top:" +
      positop +
      ";left:" +
      posileft +
      ";z-index:1000;opacity:0.85;visibility:visible;width:12px;height:12px;";
    body.appendChild(div);
    div.innerHTML = `<img title='${window.lichome} Spotter @${loc2tz(window.home)}&#13;${window.bemit}' src='${imageSrcUrl["c"]}' onclick='cambiartz(this.title,${loc2tz1(window.home)})'>`;
  }
  var div = document.createElement("div");
  div.id = et.length + 1;
  div.setAttribute("class", "dv");
  div.style.cssText =
    "visibility:hidden;position:absolute;z-index:0;cursor:pointer;top:" +
    sunlat +
    "px;left:" +
    (sunlon * 1 - 5) +
    "px;";
  div.innerHTML =
    "<img title='Sun Click for&#13 Day / Night&#13 Lat: " +
    sunla.toFixed(2) +
    "º&#13;Lon: " +
    sunlo.toFixed(2) +
    "º' src='" +
    imageSrcUrl["sun1"] +
    "' onclick='graficarsuncoverage()'>";
  body.appendChild(div);
}
function creadiv() {
  if (z != 1) {
    document.getElementById(et.length + 0).style.top = 303 + "px";
    document.getElementById(et.length + 0).style.left = 675 + "px";
    getsunpos();
    if (z == 2) {
      lat = 850 - sunlat * 3 * z - hy * z;
      lon = 1748 + sunlon * 3 * z - hx * z;
    }
    if (z == 4) {
      lat = 1390 - sunlat * 3 * z - hy * z;
      lon = 2825 + sunlon * 3 * z - hx * z;
    }
    if (z == 8) {
      lat = 2470 - sunlat * 3 * z - hy * z;
      lon = 4993 + sunlon * 3 * z - hx * z;
    }
    document.getElementById(et.length + 1).style.top = lat + "px";
    document.getElementById(et.length + 1).style.left = lon + "px";
  } else {
    document.getElementById(et.length + 0).style.top =
      homexy(homeloc).y + 59 + "px";
    document.getElementById(et.length + 0).style.left =
      homexy(homeloc).x + 124 + 540 - homexy(homeloc).x + "px";
    getsunpos();
    lat = 602 - (270 + sunlat * 3);
    lon = 1080 - (540 - sunlon * 3) + 126;
    document.getElementById(et.length + 1).style.top = lat + "px";
    leftpos = lon - 5 + 540 - homexy(homeloc).x;
    if (z == 1 && leftpos < 120) {
      leftpos = leftpos + 1080;
    }
    if (z == 1 && leftpos > 1200) {
      leftpos = leftpos - 1080;
    }
    document.getElementById(et.length + 1).style.left = leftpos + "px";
  }
  for (d = 0; d < et.length; d++) {
    var div = document.getElementById(d);
    div.id = d;
    locn = et[d][3];
    div.setAttribute("onmouseover", "linea(et[id][3])");
    div.setAttribute("onmouseout", "nolinea()");
    tp = lll(et[d][3]).lat;
    lf = lll(et[d][3]).lon;
    if (z == 1) {
      lf = lf + 540 - homexy(homeloc).x;
    }
    if (z == 1 && lf < 120) {
      lf = lf + 1080;
    }
    if (z == 1 && lf > 1200) {
      lf = lf - 1080;
    }
    if (tp < 68 || tp > 596 || lf < 126 || lf > 1205) {
      div.hidden = true;
    } else {
      div.hidden = false;
    }
    document.getElementById(d).style.top = tp + "px";
    document.getElementById(d).style.left = lf + "px";
    if (et[d][1] > 4) {
      ban = parseInt(et[d][1]);
    } else {
      ban = et[d][1];
    }
    if (ban == "3.57") {
      ban = "3.5";
    }
    if (gqs("bs") == "B" || gqs("bs") == "") {
      div.innerHTML =
        "<img src='" +
        imageSrcUrl["p"] +
        "' title=' " +
        et[d][2] +
        "&nbsp;@" +
        ban +
        "MHz&#13Rcvd " +
        et[d][7] +
        " times @" +
        et[d][4] +
        "&#13Last: " +
        et[d][0] +
        " z&#13 Distance " +
        et[d][5] +
        " Km.'" +
        " onclick='see(this.title," +
        d +
        ")'>";
    } else {
      div.innerHTML =
        "<img src='" +
        imageSrcUrl["p"] +
        "' title=' " +
        et[d][2] +
        "&nbsp;" +
        et[d][6] +
        "w&nbsp;" +
        ban +
        "MHz&#13Rcvd " +
        et[d][7] +
        " times @" +
        et[d][4] +
        "&#13Last: " +
        et[d][0] +
        " z&#13 Distance " +
        et[d][5] +
        " Km.'" +
        " onclick='see(this.title," +
        d +
        ")'>";
    }
  }
}
function gqs(e) {
  const location = window.parent.window.location.href;
  let c = "";
  if ((q = location.split("?"))[1]) {
    var a = q[1].split("&");
    for (i = 0; i < a.length; i++) {
      var l = a[i].split("=");
      if (l[0] == e) c = l[1];
    }
  }
  return c;
}

var s;
function setSelectedIndex(s, v) {
  for (var i = 0; i < s.options.length; i++) {
    if (s.options[i].value == v) {
      s.options[i].defaultSelected = i;
    }
  }
}
function setSelectedIndexa(s, v) {
  for (var i = 0; i < s.options.length; i++) {
    if (s.options[i].value == v) {
      s.selectedIndex = i;
      break;
    }
  }
}
function getdate() {
  hoy = new Date().toUTCString();
  return hoy;
}

function titilar() {
  document.getElementById("waiti").style.visibility = "visible";
}

function enviando() {
  enviar.call.value = enviar.call.value.replace(/\t/g, "");
  enviar.call.value = enviar.call.value.replace(/\n/g, "");
  enviar.call.value = enviar.call.value.replace(/\r/g, "");

  if (enviar.call.value.indexOf("=") > -1) {
    alert("Invalid characters in call .. Reenter");
    enviar.call.focus();
    return false;
  }
  if (enviar.call.value.indexOf("+") > -1) {
    alert("Invalid characters in call .. Reenter");
    enviar.call.focus();
    return false;
  }
  if (enviar.call.value.indexOf("'") > -1) {
    alert("Invalid characters in call .. Reenter");
    enviar.call.focus();
    return false;
  }
  if (enviar.call.value.indexOf("(") > -1) {
    alert("Invalid characters in call .. Reenter");
    enviar.call.focus();
    return false;
  }
  if (enviar.call.value.indexOf(")") > -1) {
    alert("Invalid characters in call .. Reenter");
    enviar.call.focus();
    return false;
  }
  if (enviar.call.value.indexOf("#") > -1) {
    alert("Invalid characters in call .. Reenter");
    enviar.call.focus();
    return false;
  }
  if (enviar.call.value.indexOf("]") > -1) {
    alert("Invalid characters in call .. Reenter");
    enviar.call.focus();
    return false;
  }
  if (enviar.call.value.indexOf("\\") > -1) {
    alert("Invalid characters in call .. Reenter");
    enviar.call.focus();
    return false;
  }
  if (enviar.call.value.indexOf("+") > -1) {
    alert("Invalid characters in call .. Reenter");
    enviar.call.focus();
    return false;
  }
  if (enviar.call.value.indexOf("ç") > -1) {
    alert("Invalid characters in call .. Reenter");
    enviar.call.focus();
    return false;
  }
  if (
    enviar.call.value.substring(0, 2).toUpperCase() == "DP" &&
    enviar.call.value.slice(-3).toUpperCase() == "GVN"
  ) {
    enviar.call.value = "DP0GVN";
  }
  if (enviar.call.value != "*") {
  } else {
    document.getElementById("entercall").style.visibility = "hidden";
  }
  if (enviar.call.value == "") {
    document.getElementById("entercall").style.visibility = "visible";
    if (enviar.call == "") {
      alert("enter call or * or select beacon or spotter");
      return false;
    }
  }
  document.getElementById("waiti").style.visibility = "visible";
  document.getElementById("sel").value =
    document.getElementById("be").selectedIndex;
}
function carga() {
  if (gqs("call") && document.enviar.call) {
    document.enviar.call.value = gqs("call").toUpperCase().replace(/%09/, "");
    document.enviar.call.value = escapeUnicode(document.enviar.call.value);
  }
  document.getElementById("waiti").style.visibility = "hidden";
  if (gqs("nocall")) {
    alert(
      "No recent reports for " +
        gqs("nocall") +
        " at wsprnet\nPlease enter callsign with actual reports.\n\n ...Showing a random active callsign...\n\n....Click to continue....",
    );
  }
  armarec();
  creadivi();
  if (gqs("band") != "") {
    setSelectedIndex(document.getElementById("edit-band"), gqs("band"));
  }
  if (!gqs("be")) {
    document.getElementById("be").value = "*";
    document.getElementById("call").value = "*";
  }
  if (gqs("be") != "") {
    setSelectedIndex(document.getElementById("be"), gqs("be"));
  }
  if (gqs("multiplecalls") != "") {
    setSelectedIndex(
      document.getElementById("multiplecalls"),
      gqs("multiplecalls"),
    );
  }
  var offset = (new Date().getTimezoneOffset() / 60) * -1;
  document.getElementById("beac").innerHTML =
    document.getElementById("beac").innerHTML +
    "<br style='line-height:6px;'><center><i><b>My TZone:" +
    "<input type=button style='font-weight:bold;' title='Show with my TimeZone' onclick=\"settimezone('" +
    offset +
    "')\" value='" +
    offset +
    "'><br><br style='line-height:6px;'><span style='font-size:14px;line-height:12px;'>" +
    getdate() +
    "<br>Local time: " +
    formatDateTime4() +
    "</span>";
  document.getElementById("beac").innerHTML =
    document.getElementById("beac").innerHTML +
    "<center><br style='line-height:1px;'><a href='https://rfzero.net/documentation/tools/wsprnet-locator-update/' style='line-height:13px;font-size:14px;' target=_blank><u><i>Fix locator</i></u></a><br style='line-height:3px;'><a href='https://www.paypal.me/AMSATARGENTINA/' title=' Please help keep site active, if possible&#13&#xbb; Donate to Amsat Argentina, Thanks! &#xab;' target='_blank' style='text-decoration:none;'><span style='height:32px;width:80px;font-size:16px;line-height:18px;border:outset;border-width:3px;background-color:#4e7330;color:white;border-radius: 22px;border-color:white;cursor:pointer;text-shadow: 1px 1px 0 black, 2px 2px 0 black ;text-decoration:none;'><i>&nbsp;&nbsp;&nbsp;Donate&nbsp;<span style='color:red;font-size:13px;'>&#10084;</span>&nbsp;&nbsp;<\/i><\/span><\/a><\/center>";
  document.getElementById("tz").value = decodeURIComponent(
    document.getElementById("tz").value,
  );
  if (gqs("tz") != "" && typeof gqs("tz") != "undefined") {
    document.getElementById("tz").value = decodeURIComponent(gqs("tz"));
    document.getElementById("tz").value = document
      .getElementById("tz")
      .value.replace(/\+/, "");
  }
  if (gqs("por") == "D" || gqs("por") == "d") {
    document.enviar.por[1].checked = true;
  } else {
    document.enviar.por[0].checked = true;
  }
  if (gqs("scale") == "Lin" || !gqs("scale")) {
    document.enviar.scale[1].checked = true;
    boton = "Lin";
    drawChart();
  } else {
    document.enviar.scale[0].checked = true;
    boton = "Log";
    drawChart();
  }
  document.getElementById("call").focus();
  document.getElementById("waiti").visibility = "hidden";
  if (gqs("call") && gqs("call") != "") {
    document.getElementById("call").value = gqs("call")
      .replace(/ /g, "")
      .trim();
  } else {
    document.getElementById("call").value = "";
  }
  document.getElementById(et.length).style.visibility = "hidden";
  if (gqs("t") == "m" || !gqs("t")) {
    vermapa();
  }
  document.getElementById("call").value = decodeURIComponent(
    document.getElementById("call").value,
  );
  if (
    gqs("call") == "*" ||
    document.getElementById("call").value == "*" ||
    enviar.call.value == ""
  ) {
    document.getElementById("call").visibility = "visible";
  } else {
    document.getElementById("entercall").style.visibility = "hidden";
  }
  if (gqs("vl") && gqs("vl") == "y") {
    ponercallsign();
  }
  if (gqs("omit")) {
    document.getElementById("omit").checked = true;
  }
  if (gqs("timelimit") != "") {
    setSelectedIndexa(document.getElementById("timelimit"), gqs("timelimit"));
  } else {
    setSelectedIndexa(document.getElementById("timelimit"), 604800);
  }
  if (gqs("bs") && gqs("bs") != "") {
    setSelectedIndex(document.getElementById("bs"), gqs("bs"));
  } else {
    setSelectedIndex(document.getElementById("bs"), "A");
  }
  if (gqs("bs") == "B") {
    document.getElementById("bs").selectedIndex = 0;
  }
  if (gqs("bs") == "S") {
    document.getElementById("bs").selectedIndex = 1;
  }
  if (gqs("bs") == "A") {
    document.getElementById("bs").selectedIndex = 2;
  }
  if (!gqs("t") || gqs("t") == "m") {
    vermapa();
  }
  if (gqs("vl") == "y") {
    ponercallsign();
  }
  if (gqs("call")) {
    document.getElementById("rayas").style.opacity = "0.75";
    graficarsuncoverage();
    lineam(window.homeloc);
  }
  if (gqs("vl") && gqs("vl") == "y") {
    document.getElementById("daynight").innerHTML = "";
    ponercallsign();
  }
  if (gqs("t") && gqs("t") == "c") {
    document.getElementById("daynight").innerHTML = "";
    verchart();
  }
  //    if (gqs("t") && gqs("t") == "p") { document.getElementById("daynight").innerHTML = ""; verpiechart(); }
  document.getElementById("intn").innerHTML =
    window.estalast + " Intn. WSPR<br>Beacon Project";
  graficarsuncoverage();
  document.getElementById("daynight").style.visibility = "visible";
  if (gqs("t") && gqs("t") == "c") {
    document.getElementById("daynight").style.visibility = "hidden";
  }
}
function settimezone(tzval) {
  document.getElementById("tz").value = tzval;
  enviando();
  document.getElementById("enviar").submit();
}
function borro() {
  document.getElementById("call").value = "";
}
var popupwin;
function mostrar(licencia) {
  licencia = licencia
    .replace(/F\//, "")
    .replace(/DL\//, "")
    .replace(/TA\//, "")
    .replace(/HA\//, "")
    .replace(/TA4\//, "")
    .replace(/EA7\//, "")
    .replace(/I3\//, "")
    .replace(/LU\//, "")
    .replace(/EA8\//, "")
    .replace(/-/, " ")
    .replace(/:/, " ")
    .replace(/LA\//, "")
    .replace(/5N\//, "")
    .replace(/\//, " ");
  licenciam = licencia.split(" ");
  licencia = licenciam[0];
  preferences =
    "toolbar=no,width=530px,height=180px,center,margintop=0,top=120,left=120,status=no,scrollbars=no,resizable=no,dependent=yes,z-lock=yes";
  if (popupwin != null) {
    popupwin.close();
  }
  popupwin = window.open(
    "http://lu7aa.org/hc2.asp?licencia=" + licencia + "&loc=" + window.locati,
    "win",
    preferences,
  );
  popupwin.setTimeout("self.close()", 120000);
}
function vermapa() {
  if (et.length > 800) {
    document.getElementById("solar").src = "http://www.hamqsl.com/solarvhf.php";
  }
  nolinea();
  document.getElementById("pie").style.color = "white";
  document.getElementById("mapa").style.color = "orange";
  document.getElementById("chart").style.color = "white";
  document.getElementById("li").style.color = "white";
  document.getElementById("km").style.color = "white";
  if (document.getElementById("mapa").value == "MAP") {
    document.getElementById("st").style.visibility = "hidden";
    document.getElementById("t").value = "m";
    document
      .querySelectorAll(".dv")
      .forEach((el) => (el.style.visibility = "visible"));
    document.getElementById("mapa").value = "MAP";
    document.getElementById("container").style.top = "70px";
  }
  document.getElementById("daynight").style.visibility = "hidden";
  pixsol = document.getElementById(window.n + 2).style.left.replace(/px/, "");
  if (pixsol > 1400) {
    document.getElementById(window.n + 2).style.left = "20px";
    document.getElementById(window.n + 2).style.top = "20px";
  }
  document.getElementById("resumen").style.visibility = "visible";
  document.getElementById("vl").value = "";
  document.getElementById("container").innerHTML = "";
  document.getElementById("rayas").style.visibility = "visible";
  document.getElementById("container").style.backgroundImage =
    `url(${imageSrcUrl["world2"]})`;
  document.getElementById("container").style.backgroundPositionX =
    548 - hx * z + "px";
  document.getElementById("container").style.backgroundPositionY =
    243 - hy * z + "px";
  if (z == 1) {
    document.getElementById("container").style.backgroundSize = "1080px 540px";
    document.getElementById("container").style.backgroundPositionX =
      540 - homexy(homeloc).x + "px";
    document.getElementById("container").style.backgroundPositionY = 0 + "px";
  }
  if (z == 2) {
    document.getElementById("container").style.backgroundSize = "2160px 1080px";
    document.getElementById("daynight").style.visibility = "hidden";
  }
  if (z == 4) {
    document.getElementById("container").style.backgroundSize = "4320px 2160px";
    document.getElementById("daynight").style.visibility = "hidden";
  }
  if (z == 8) {
    document.getElementById("container").style.backgroundSize = "8640px 4320px";
    document.getElementById("daynight").style.visibility = "hidden";
  }
  document.getElementById("arribatext").innerHTML =
    "<center><span style='font-size:16px;font-weight:bold;'><i>Map shows " +
    decodeURIComponent(gqs("call")).toUpperCase() +
    " " +
    "<img onclick='nolinea()' onmouseover='lineam(window.homeloc)' title='Home Location' src='" +
    imageSrcUrl["c"] +
    "' height=14px style='height:14px;'>" +
    " and his " +
    (window.n + 1) +
    " spoters " +
    "<img title='Spots' src='" +
    imageSrcUrl["p"] +
    "' height=10px style='height:10px;'> " +
    window.bemit.replace(/On/, "on") +
    ". From " +
    fromto +
    "." +
    "</i></span></center>";
  document.getElementById("arribatext").style.visibility = "visible";
  document
    .querySelectorAll(".dv")
    .forEach((el) => (el.style.visibility = "visible"));
  lineam(window.homeloc);
  if (document.getElementById("daynight")) {
    graficarsuncoverage();
    document.getElementById("daynight").style.visibility = "visible";
  }
}
function verpiechart() {
  nolinea();
  document.getElementById("mapa").style.color = "white";
  document.getElementById("chart").style.color = "white";
  document.getElementById("pie").style.color = "orange";
  document.getElementById("li").style.color = "white";
  document.getElementById("km").style.color = "white";
  document.getElementById("st").style.visibility = "visible";
  document.getElementById("t").value = "c";
  document.getElementById("daynight").innerHTML = "";
  document.getElementById("daynight").style.zIndex = "-1";
  document
    .querySelectorAll(".dv")
    .forEach((el) => (el.style.visibility = "hidden"));
  document.getElementById("mapa").value = "MAP";
  document.getElementById("container").style.top = "20px";
  document.getElementById("container").style.left = "127px";
  google.charts.setOnLoadCallback(drawChart1);
  document.getElementById("vl").value = "";
  document.getElementById("entercall").style.visibility = "hidden";
  if (gqs("bs") && gqs("bs") != "") {
    setSelectedIndex(document.getElementById("bs"), gqs("bs"));
  } else {
    setSelectedIndex(document.getElementById("bs"), "A");
  }
  if (gqs("bs") == "B") {
    document.getElementById("bs").selectedIndex = 0;
  }
  if (gqs("bs") == "S") {
    document.getElementById("bs").selectedIndex = 1;
  }
  if (gqs("bs") == "A") {
    document.getElementById("bs").selectedIndex = 2;
  }
  document.getElementById("arribatext").style.visibility = "hidden";
  document.getElementById("resumen").style.visibility = "visible";
  document.getElementById("st").style.visibility = "hidden";
  document.getElementById("daynight").style.visibility = "hidden";
}
function verchart() {
  if (et.length > 800) {
    document.getElementById("solar").src = "http://www.hamqsl.com/solarvhf.php";
  }
  nolinea();
  document.getElementById("pie").style.color = "white";
  document.getElementById("mapa").style.color = "white";
  document.getElementById("chart").style.color = "orange";
  document.getElementById("li").style.color = "white";
  document.getElementById("km").style.color = "white";
  document.getElementById("st").style.visibility = "visible";
  document.getElementById("t").value = "c";
  document.getElementById("daynight").innerHTML = "";
  document.getElementById("daynight").style.zIndex = "-1";
  document
    .querySelectorAll(".dv")
    .forEach((el) => (el.style.visibility = "hidden"));
  document.getElementById("mapa").value = "MAP";
  document.getElementById("container").style.top = "-70px";
  document.getElementById("container").style.left = "127px";
  google.charts.setOnLoadCallback(drawChart);
  document.getElementById("vl").value = "";
  document.getElementById("entercall").style.visibility = "hidden";
  if (gqs("bs") && gqs("bs") != "") {
    setSelectedIndex(document.getElementById("bs"), gqs("bs"));
  } else {
    setSelectedIndex(document.getElementById("bs"), "A");
  }
  if (gqs("bs") == "B") {
    document.getElementById("bs").selectedIndex = 0;
  }
  if (gqs("bs") == "S") {
    document.getElementById("bs").selectedIndex = 1;
  }
  if (gqs("bs") == "A") {
    document.getElementById("bs").selectedIndex = 2;
  }
  document.getElementById("arribatext").style.visibility = "hidden";
  document.getElementById("daynight").style.visibility = "hidden";
}
function ponercallsign() {
  if (window.et.length > 800) {
    document.getElementById("solar").src = imageSrcUrl["null"];
  }
  nolinea();
  document.getElementById("pie").style.color = "white";
  document.getElementById("daynight").style.visibility = "hidden";
  document.getElementById("km").style.color = "white";
  document.getElementById("chart").style.color = "white";
  document.getElementById("mapa").style.color = "white";
  document.getElementById("chart").style.color = "white";
  document.getElementById("li").style.color = "orange";
  document.getElementById("resumen").style.visibility = "hidden";
  document.getElementById("st").style.visibility = "hidden";
  document
    .querySelectorAll(".dv")
    .forEach((el) => (el.style.visibility = "hidden"));
  document.getElementById("container").style.backgroundImage =
    `url(${imageSrcUrl["none"]})`;
  document.getElementById("container").style.top = "-105px"; //"-70px";
  document.getElementById("container").style.left = "127px";
  if (window.et.length > 0) {
    estacio =
      "<u><span onclick='ir(this)'>" +
      window.et[0][2] +
      " " +
      window.et[0][7] +
      "</span></u><br><br><br>";
  }
  if (ed.length < 80) {
    ed =
      "<center><br><br><br><br><br><br><br><br><br><br><center><b><i>" +
      estacio +
      "Not enough data to show more..<br><br>See Map and table below</i></b></center>";
  }
  document.getElementById("container").innerHTML = "";
  document.getElementById("container").innerHTML = ed;
  document.getElementById("vl").value = "y";
  document.getElementById("entercall").style.visibility = "hidden";
  document.getElementById("st").style.visibility = "hidden";
  if (gqs("bs") && gqs("bs") != "") {
    setSelectedIndex(document.getElementById("bs"), gqs("bs"));
  } else {
    setSelectedIndex(document.getElementById("bs"), "A");
  }
  if (gqs("bs") == "B") {
    document.getElementById("bs").selectedIndex = 0;
  }
  if (gqs("bs") == "S") {
    document.getElementById("bs").selectedIndex = 1;
  }
  if (gqs("bs") == "A") {
    document.getElementById("bs").selectedIndex = 2;
  }
  document.getElementById("arribatext").style.visibility = "hidden";
}
var aumento = 1;
function screensize() {
  if (aumento == 1) {
    aumento = (screen.availWidth - screen.availWidth / 14) / 8 / 100;
    document.getElementById("sz").innerHTML = "&#9661;";
  } else {
    aumento = 1;
    document.getElementById("sz").innerHTML = "&#9651;";
  }
  if (navigator.userAgent.indexOf("Firefox") > 0) {
    document.body.style.MozTransform = "scale(" + aumento + ")";
    document.body.style.MozTransformOrigin = "0 0";
  } else {
    document.body.style.zoom = aumento * 100 + "%";
  }
}
function homexy(loc) {
  //x e y para mapa de 1080x540
  loc = loc.toUpperCase();
  if (!loc) {
    loc = "LL55";
  }
  if (loc.length == 4) {
    loc = loc + "LL";
  }
  c0 = loc.charAt(0);
  c1 = loc.charAt(1);
  c2 = loc.charAt(2);
  c3 = loc.charAt(3);
  c4 = loc.charAt(4);
  c5 = loc.charAt(5);
  lat =
    (parseInt(c1, 28) - 19) * 10 +
    parseInt(c3, 10) +
    (parseInt(c5, 34) - 9.5) / 24;
  lon =
    (parseInt(c0, 28) - 19) * 20 +
    parseInt(c2, 10) * 2 +
    (parseInt(c4, 34) - 9.5) / 12;
  homexy.y = 270 - lat * 3;
  homexy.x = 540 + lon * 3;
  return homexy;
}
var z = 1;
hy = 259;
hx = 540;
function lll(loc) {
  loc = loc.toUpperCase();
  if (!loc) {
    loc = "LL55";
  }
  if (loc.length == 4) {
    loc = loc + "LL";
  }
  c0 = loc.charAt(0);
  c1 = loc.charAt(1);
  c2 = loc.charAt(2);
  c3 = loc.charAt(3);
  c4 = loc.charAt(4);
  c5 = loc.charAt(5);
  lat =
    (parseInt(c1, 28) - 19) * 10 +
    parseInt(c3, 10) +
    (parseInt(c5, 34) - 9.5) / 24;
  lon =
    (parseInt(c0, 28) - 19) * 20 +
    parseInt(c2, 10) * 2 +
    (parseInt(c4, 34) - 9.5) / 12;
  if (z == 1) {
    lat = 596 - lat * 3 * z - 259;
    lon = 1204 + lon * 3 * z - 540;
  }
  if (z == 2) {
    lat = 850 - lat * 3 * z - hy * z;
    lon = 1748 + lon * 3 * z - hx * z;
  }
  if (z == 4) {
    lat = 1390 - lat * 3 * z - hy * z;
    lon = 2825 + lon * 3 * z - hx * z;
  }
  if (z == 8) {
    lat = 2470 - lat * 3 * z - hy * z;
    lon = 4993 + lon * 3 * z - hx * z;
  }
  lll.lat = lat;
  lll.lon = lon;
  return lll;
}
function getlatlon(lat1, lon1, bearing, distance) {
  //alert("lat1:"+lat1+" lon1:"+lon1+" bearing:"+bearing+" distance:"+distance);
  var EARTH_RADIUS = 3440.07; //distance in nMiles
  var PI = Math.PI; // 3.1415926535897932384626433832795 ;
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
function MakeArray(n) {
  this.length = n;
  for (var i = 1; i <= n; i++) {
    this[i] = 0;
  }
  return this;
}
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
function getxy(lat, lon, zoom) {
  delta.x = parseInt(lon * zoom, 10);
  delta.y = parseInt(lat * zoom + 270, 10);
}
var delta = new MakeArray(0);
function graficarsuncoverage() {
  if (document.getElementById("daynight").style.visibility == "visible") {
    document.getElementById("daynight").style.visibility = "hidden";
    return;
  }
  if (z > 1) {
    return;
  }
  changecov = 0;
  cov1 = "[";
  zoom = 3;
  radio = 133e6;
  getsunpos();
  if (z == 1) {
    sunlon = sunlon + 540 - homexy(homeloc).x / 3;
  }
  document.getElementById("daynight").innerHTML = "";
  for (bearing = 14400; bearing > -60; bearing--) {
    getlatlon(sunlat, sunlon, bearing / 40, radio);
    getxy(out.lat2, out.lon2, zoom);
    pixlon = delta.x;
    pixlat = delta.y;
    parar = false;
    if (pixlon > 1080) {
      pixlon = pixlon - 1080;
    }
    if (pixlon > 1080) {
      pixlon = pixlon - 1080;
    }
    if (pixlon < 0) {
      pixlon = pixlon + 1080;
    }
    if (pixlat < 6) {
      pixlat = 6;
    }
    if (pixlat > 522) {
      pixlat = 522;
    }
    if (sunlat > 0 && pixlon > 1072) {
      cov1 = cov1 + "new jxPoint(1079,530), new jxPoint(0,530),  ";
      parar = true;
    }
    if (
      sunlat < 0 &&
      (pixlon > 1077 || pixlon < 1 || pixlat < 5 || pixlat > 536)
    ) {
      cov1 = cov1 + "new jxPoint(0,540), new jxPoint(1079,540), ";
      parar = true;
    }
    if (!parar) {
      cov1 = cov1 + "new jxPoint(" + pixlon + ", " + pixlat + "), ";
    }
  }
  cov1 = cov1.substring(0, cov1.length - 2) + "]";
  var sunpix = new jxGraphics(document.getElementById("daynight"));
  var penOrange = new jxPen(new jxColor("#ffffff"), "5px");
  var brushOrange = new jxBrush(new jxColor("#000000"));
  if (cov1.length > 38) {
    var curvePoints = eval(cov1);
    var curve = new jxPolyline(curvePoints, penOrange, brushOrange);
    curve.draw(sunpix);
  }
  document.getElementById("daynight").style.visibility = "visible";
  document.getElementById("daynight").style.zIndex = "0";
}
function drawdxkm() {
  if (et.length > 800) {
    document.getElementById("solar").src = "http://www.hamqsl.com/solarvhf.php";
  }
  nolinea();
  document.getElementById("arribatext").style.visibility = "hidden";
  dkm = "k";
  document.getElementById("pie").style.color = "white";
  document.getElementById("mapa").style.color = "white";
  document.getElementById("km").style.color = "orange";
  document.getElementById("chart").style.color = "white";
  document.getElementById("li").style.color = "white";
  document.getElementById("st").style.visibility = "visible";
  document.getElementById("t").value = "c";
  document.getElementById("daynight").innerHTML = "";
  document.getElementById("daynight").style.zIndex = "-1";
  // for (i = 0; i < window.n + 3; i++) {
  //   document.getElementById(i).style.visibility = "hidden";
  // }
  document
    .querySelectorAll(".dv")
    .forEach((el) => (el.style.visibility = "hidden"));
  document.getElementById("mapa").value = "MAP";
  document.getElementById("container").style.top = "-70px";
  document.getElementById("container").style.left = "127px";
  document.getElementById("vl").value = "";
  // Define the chart to be drawn.
  leyend = `   (Using last <%if ${window.totals === 2998 || window.totals === 9998 ? window.totals + 2 : window.totals} reports. From ${fromto})`;
  var data = new google.visualization.DataTable();
  data.addColumn("number", "Distance in Km.");
  const columnasLimpias = left(columns, columns.length - 2);
  eval(columnasLimpias);

  data.addRows(window.dxkm);
  var tipohora = "GMT";
  // Set chart options
  var options = {
    chartArea: {
      right: 125, // set this to adjust the legend width
      left: 70, // set this eventually, to adjust the left margin
      top: 120,
      bottom: 60,
    },
    vAxis: {
      title: "Number   of   WSPR   Reports",
      titleTextStyle: { fontSize: 22 },
      textStyle: { fontSize: 16 },
      scaleType: "log",
      format: "short",
      direction: 1,
      minValue: 0,
      viewWindowMode: "explicit",
      viewWindow: { min: 0 },
      format: 0,
    },
    hAxis: {
      titleTextStyle: { fontSize: 22 },
      textStyle: { fontSize: 15, fontName: "Times New Roman", bold: true },
      title: `Distance in Km. Using Last ${window.totals === 2998 || window.totals === 9998 ? window.totals + 2 : window.totals} Reports, from ${window.n + 1} Stations.`,
      format: "#####",
      gridlines: { count: 19 },
      viewWindowMode: "explicit",
      viewWindow: { max: (window.smax + 1) * 1000 },
    },
    height: 700,
    curveType: "function",
    pointsVisible: false,
    lineWidth: 3,
  };
  // Instantiate and draw the chart.
  var chart = new google.visualization.LineChart(
    document.getElementById("container"),
  );
  if (gqs("por") == "D") {
    options.hAxis.gridlines.count = data.getNumberOfRows();
  }
  if (gqs("tz") == "" || gqs("tz") == "0" || typeof gqs("tz") == "undefined") {
  } else {
    if (gqs("tz") * 1 > 0) {
      ponermas = "+";
    } else {
      ponermas = "";
    }
    options.hAxis.title =
      "Hour (GMT " +
      ponermas +
      decodeURIComponent(gqs("tz")) +
      ")" +
      " (Using last 3000 reports)";
  }
  var tickMarks = [];
  for (var s = 0; s < data.getNumberOfRows(); s++) {
    tickMarks.push(data.getValue(s, 0));
  }
  options.hAxis.ticks = tickMarks;
  if (boton == "Log") {
    options.vAxis.scaleType = "log";
  }
  if (boton == "Lin") {
    options.vAxis.scaleType = "";
  }
  if (gqs("scale") && boton == "Lin") {
    if (
      gqs("scale") == "Lin" &&
      boton == "Lin" &&
      document.enviar.scale[1].checked == true
    ) {
      options.vAxis.scaleType = "";
      document.getElementById("st").style.visibility = "visible";
    }
  }
  if (gqs("scale") && boton == "Log") {
    if (
      gqs("scale") == "Log" &&
      boton == "Log" &&
      document.enviar.scale[0].checked == true
    ) {
      options.vAxis.scaleType = "log";
      document.getElementById("st").style.visibility = "visible";
    }
  }
  data.sort({ column: 0, asc: true });
  chart.draw(data, options);
  document.getElementById("resumen").style.visibility = "hidden";
}
function drawChart() {
  dkm = "";
  // Define the chart to be drawn.
  leyend = `\t \t (Using last ${window.totals === 2998 || window.totals === 9998 ? window.totals + 2 : window.totals} reports. From: ${fromto})`;
  var data = new google.visualization.DataTable();
  data.addColumn("date", "Hour");

  const columnasLimpias = left(columns, columns.length - 2);
  eval(columnasLimpias);
  const datosLimpios = left(datas, datas.length - 2);
  const filasArray = eval(`[${datosLimpios}]`);
  data.addRows(filasArray);

  var tipohora = "GMT";
  // Set chart options
  var options = {
    chartArea: {
      right: 125, // set this to adjust the legend width
      left: 70, // set this eventually, to adjust the left margin
      top: 120,
      bottom: 60,
    },

    hAxis: {
      titleTextStyle: { fontSize: 20 },
      textStyle: { fontSize: 17 },
      title: "Hour (GMT)" + leyend,
      format: "HH",
      gridlines: { count: 24 },
    },
    vAxis: {
      title: "Number   of   WSPR   Reports",
      titleTextStyle: { fontSize: 22 },
      textStyle: { fontSize: 16 },
      scaleType: "log",
      format: "short",
      direction: 1,
      minValue: 0,
      viewWindowMode: "explicit",
      viewWindow: { min: 0 },
      format: 0,
    },
    height: 700,
    curveType: "function",
    pointsVisible: false,
    lineWidth: 3,
  };
  // Instantiate and draw the chart.
  var chart = new google.visualization.LineChart(
    document.getElementById("container"),
  );
  if (gqs("por") == "D") {
    options.hAxis.gridlines.count = data.getNumberOfRows();
  }
  if (gqs("tz") == "" || gqs("tz") == "0" || typeof gqs("tz") == "undefined") {
  } else {
    if (gqs("tz") * 1 > 0) {
      ponermas = "+";
    } else {
      ponermas = "";
    }
    options.hAxis.title =
      "Hour (GMT " +
      ponermas +
      decodeURIComponent(gqs("tz")) +
      ")" +
      " (Using last 3000 reports. From: " +
      fromto +
      ")";
  }
  if (gqs("por") == "D" || gqs("por") == "d") {
    options.hAxis.title = "";
    options.hAxis.format = "MMM-dd";
    options.hAxis.title = "From: " + fromto;
  }
  var tickMarks = [];
  for (var s = 0; s < data.getNumberOfRows(); s++) {
    tickMarks.push(data.getValue(s, 0));
  }
  options.hAxis.ticks = tickMarks;
  if (boton == "Log") {
    options.vAxis.scaleType = "log";
  }
  if (boton == "Lin") {
    options.vAxis.scaleType = "";
  }
  if (gqs("scale") && boton == "Lin") {
    if (
      gqs("scale") == "Lin" &&
      boton == "Lin" &&
      document.enviar.scale[1].checked == true
    ) {
      options.vAxis.scaleType = "";
      document.getElementById("st").style.visibility = "visible";
    }
  }
  if (gqs("scale") && boton == "Log") {
    if (
      gqs("scale") == "Log" &&
      boton == "Log" &&
      document.enviar.scale[0].checked == true
    ) {
      options.vAxis.scaleType = "log";
      document.getElementById("st").style.visibility = "visible";
    }
  }
  data.sort({ column: 0, asc: true });
  chart.draw(data, options);
  document.getElementById("resumen").style.visibility = "hidden";
}
var boton = "Log";

function lineam() {
  var area = new jxGraphics(document.getElementById("rayas"));
  var col = new jxColor("yellow");
  var pen = new jxPen(col, "2px");
  px = lll(window.homeloc).lon - 119;
  if (z == 1) {
    px = px + 540 - homexy(window.homeloc).x;
  }
  if (z == 1 && px < 120) {
    px = px + 1080;
  }
  if (z == 1 && px > 1200) {
    px = px - 1080;
  }
  py = lll(window.homeloc).lat - 69;
  for (k = 0; k < window.et.length; k++) {
    var pen = new jxPen(col, "1px");
    var pt1 = new jxPoint(px, py);
    pxlo = lll(window.et[k][3]).lon;
    pxla = lll(window.et[k][3]).lat;
    if (z == 1) {
      pxlo = lll(window.et[k][3]).lon + 540 - homexy(window.homeloc).x;
    } else {
      pxlo = lll(window.et[k][3]).lon;
    }
    if (z == 1 && pxlo < 120) {
      pxlo = pxlo + 1080;
    }
    if (z == 1 && pxlo > 1200) {
      pxlo = pxlo - 1080;
    }
    var pt2 = new jxPoint(pxlo - 123, pxla - 67);
    var line = new jxLine(pt1, pt2, pen);
    line.draw(area);
  }
  document.getElementById("rayas").style.zIndex = "0";
}
function linea(locator) {
  var area = new jxGraphics(document.getElementById("rayas"));
  var col = new jxColor("yellow");
  var pen = new jxPen(col, "2px");
  px = lll(locator).lon - 124;
  if (z == 1) {
    px = lll(locator).lon - 124 + 540 - homexy(homeloc).x;
  } else {
    px = lll(locator).lon - 124;
  }
  if (z == 1 && px < 120) {
    px = px + 1080;
  }
  if (z == 1 && px > 1080) {
    px = px - 1080;
  }
  py = lll(locator).lat - 67;
  var pt1 = new jxPoint(px, py);
  if (z == 1) {
    var pt2 = new jxPoint(
      lll(homeloc).lon - 120 + 540 - homexy(homeloc).x,
      lll(homeloc).lat - 69,
    );
  } else {
    var pt2 = new jxPoint(lll(homeloc).lon - 120, lll(homeloc).lat - 69);
  }
  var line = new jxLine(pt1, pt2, pen);
  line.draw(area);
  document.getElementById("rayas").style.zIndex = "0";
}
function nolinea() {
  document.getElementById("rayas").innerHTML = "";
  document.getElementById("rayas").style.zIndex = "-1";
}
function ir(lice) {
  licen = lice.innerHTML.split(" ");
  mostrar(licen[0]);
}
function armarec() {
  fromto = et[et.length - 1][0] + "z to ";
  if (et[et.length - 1][0].substring(0, 6) == et[0][0].substring(0, 6)) {
    fromto = fromto + et[0][0].slice(-5) + "z";
  } else {
    fromto = fromto + et[0][0] + "z";
  }
  fromto = fromto + " " + window.hactivo;
  et.sort(sortFunction);
  function sortFunction(a, b) {
    if (a[2] === b[2]) {
      return 0;
    } else {
      return a[2] < b[2] ? -1 : 1;
    }
  }
  cantidad = et.length - 1;
  ed = "<br><center>Not enough Data to show Stations Received</center>";
  ley = "<br><center>Not enough Data to show Stations Received</center>";
  if (cantidad > 0) {
    if (decodeURIComponent(gqs("call")).toUpperCase() == "UNDEFINED") {
      stat = "*";
    } else {
      stat = decodeURIComponent(gqs("call")).toUpperCase();
    }
    if (gqs("bs") == "B" || !gqs("bs")) {
      ley =
        " Stations received " +
        stat +
        " for # times " +
        window.bemit.replace(/On/, "on") +
        " ~ " +
        window.ultimoreport +
        " " +
        window.hactivo +
        ".";
    } else {
      ley =
        " Stations were received by " +
        stat +
        " for # times " +
        window.bemit.replace(/On/, "on") +
        " ~ " +
        window.ultimoreport +
        " " +
        window.hactivo +
        ".";
    }
    if (gqs("bs") == "A" && window.iis == 0) {
      ley =
        " Stations received " +
        stat +
        " for # times " +
        window.bemit.replace(/On/, "on") +
        " ~ " +
        window.ultimoreport +
        " " +
        window.hactivo +
        ".";
    }
    if (gqs("bs") == "A" && window.iib == 0) {
      ley =
        " Stations spotted by " +
        stat +
        " for # times " +
        window.bemit.replace(/On/, "on") +
        " ~ " +
        window.ultimoreport +
        " " +
        window.hactivo +
        ".";
    }
    if (gqs("bs") == "A" && window.iib > 0 && window.iis > 0) {
      ley =
        " Stations Received / Spotted by " +
        stat +
        " for # times " +
        window.bemit.replace(/On/, "on") +
        " ~ " +
        window.ultimoreport +
        " " +
        window.hactivo +
        ".";
    }
    ed =
      "<center><span style='line-height:15px;'><br><br><br><br><br><br><br><br style='line-height:3px;'><b><i> " +
      (cantidad * 1 + 1 * 1) +
      ley +
      "&nbsp;&nbsp;</i></b><br></span></center>";
    cols = cantidad / 49;
    if (cantidad < 600) {
      ed =
        ed +
        "<center><table width='18%' cellspacing=0 cellpadding=0 style='width:18%;min-height:350px;min-width:620px;font-size:13px;line-height:11px;'><tr>";
    } else {
      ed =
        ed +
        "<center><table width='18%' cellspacing=0 cellpadding=0 style='width:18%;min-height:350px;min-width:620px;font-size:10px;line-height:11px;'><tr>";
    }
    if (cantidad > 850) {
      ed =
        "<center><span style='line-height:15px;'><br><br><br><br><br><br><br><br style='line-height:3px;'><b><i> " +
        (cantidad * 1 + 1 * 1) +
        ley +
        "&nbsp;&nbsp;</i></b><br></span></center>";
      ed =
        ed +
        "<center><table width='18%' cellspacing=0 cellpadding=0 style='width:18%;min-height:350px;min-width:620px;font-size:9px;line-height:11px;font-family:Arial Narrow;'><tr>";
    }
    for (i = 0; i < Math.floor(cantidad / 50) + 1; i++) {
      ed =
        ed +
        "<td style='line-height:16px;'><b><i>Callsign&nbsp;&nbsp;&nbsp;#</i></b><\/td>";
    }
    for (i = 0; i < Math.floor(et.length / cols + 1); i++) {
      ed = ed + "<\/tr><tr>";
      for (j = i; j < et.length; j = j + Math.floor(et.length / cols + 1)) {
        if (et[j][7] > avg) {
          highlight = "font-weight:bold;";
        } else {
          highlight = "";
        }
        if (et[j][7] == 1) {
          highlight = "color:#555555;";
        }
        ed =
          ed +
          "<td valign=top style='white-space:nowrap;" +
          highlight +
          "' onclick='ir(this)'>" +
          et[j][2] +
          " " +
          et[j][7] +
          "&nbsp;</td>";
      }
    }
    ed = ed + "</tr></table><hr width=98% style='color:#DDDDDD;'></center>";
  }
}
var sunlon;
var sunlat;
//google.charts.setOnLoadCallback(drawChart);
if (gqs("bs") == "B" || !gqs("bs")) {
  tipo = "Beacon";
} else {
  tipo = "Spotter";
}
getsunpos();
// sunla = sunlat;
// sunlo = sunlon;
// sunlat = 602 - (270 + sunlat * 3);
// sunlon = 1080 - (540 - sunlon * 3) + 126;
// if (z == 1) {
//   sunlon = sunlon + 540 - homexy(homeloc).x;
//   if (sunlon > 1080) {
//     sunlon = sunlon - 1080;
//   }
//   if (sunlon < 0) {
//     sunlon = sunlon + 1080;
//   }
//   if (sunlon < 125) {
//     sunlon = sunlon + 1080;
//   }
// }
ec = "";

// if (gqs("bs") == "A" || !gqs("bs")) {
//   document.getElementById("resumen").innerHTML =
//     `<center><table class='transparent' style='width:110px;color:#ffffff;font-family:Tahoma,Arial;font-size:12px;text-shadow: 2px 2px 0 black;'><tr class='none'><td align=center onclick='mostrar(${window.lichome})' title='See ${window.lichome}&#13; at HamCall' onmouseout="this.style.backgroundColor='';" onmouseover="this.style.backgroundColor='#335c6e';"><span style='font-size:20px;font-weight'><u>${window.lichome}</u></span><br>Sent / Received<br>${window.n + 1} Callsigns<br>${window.bemit}</center></td></tr></table>`;
// } else {
//   if (gqs("bs") == "B" || !gqs("bs")) {
//     document.getElementById("resumen").innerHTML =
//       `<center><table class='transparent' style='width:110px;color:#ffffff;font-family:Tahoma,Arial;font-size:12px;text-shadow: 2px 2px 0 black;'><tr class='none'><td align=center onclick='mostrar(${window.lichome})' title='See ${window.lichome}&#13; at HamCall' onmouseout="this.style.backgroundColor='transparent';" onmouseover="this.style.backgroundColor='#012d52';"><span style='font-size:20px;font-weight'><u>${window.lichome}</u></span><br>Pwr ${window.pwr} Watt<br>${window.bemit}<br>${window.n + 1} Spotters</center></td></tr></table>`;
//   } else {
//     document.getElementById("resumen").innerHTML =
//       `<center><table class='transparent' style='width:110px;color:#ffffff;font-family:Tahoma,Arial;font-size:12px;text-shadow: 2px 2px 0 black;'><tr class='none'><td align=center onclick='mostrar(${window.lichome})' title='See ${window.lichome}&#13; at HamCall' onmouseout="this.style.backgroundColor='';" onmouseover="this.style.backgroundColor='#335c6e';"><span style='font-size:20px;font-weight'>${window.lichome}</span><br>Spots Received<br>${window.bemit}<br>${window.n + 1} Beacons</center></td></tr></table>`;
//   }
// }
function jsDraw2DX() {}
jsDraw2DX._RefID = 0;
jsDraw2DX._isVML = false;
jsDraw2DX.checkIE = function () {
  if (navigator.appName == "Microsoft Internet Explorer") {
    var a = 9;
    if (navigator.appVersion.indexOf("MSIE") != -1) {
      a = parseFloat(navigator.appVersion.split("MSIE")[1]);
    }
    if (a < 9) {
      jsDraw2DX._isVML = true;
    }
  }
};
jsDraw2DX.fact = function (c) {
  var b = 1;
  for (var a = 1; a <= c; a++) {
    b = b * a;
  }
  return b;
};
jsDraw2DX.init = function () {
  jsDraw2DX.checkIE();
  if (jsDraw2DX._isVML) {
    document.namespaces.add(
      "v",
      "urn:schemas-microsoft-com:vml",
      "#default#VML",
    );
    var c = ["fill", "stroke", "path", "textpath"];
    for (var b = 0, a = c.length; b < a; b++) {
      document
        .createStyleSheet()
        .addRule("v\\:" + c[b], "behavior: url(#default#VML);");
    }
  }
};
jsDraw2DX.init();
function jxGraphics(r) {
  this.origin = new jxPoint(0, 0);
  this.scale = 1;
  this.coordinateSystem = "default";
  var a = new Array();
  var m, p, e, n;
  if (r) {
    m = r;
    m.style.overflow = "hidden";
  } else {
    m = document.body;
  }
  if (!jsDraw2DX._isVML) {
    p = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    m.appendChild(p);
    n = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    p.appendChild(n);
    p.style.position = "absolute";
    p.style.top = "0px";
    p.style.left = "0px";
    p.style.width = m.style.width;
    p.style.height = m.style.height;
  } else {
    e = document.createElement("v:group");
    e.style.position = "absolute";
    e.style.top = "0px";
    e.style.left = "0px";
    m.appendChild(e);
  }
  this.getDefs = l;
  function l() {
    return n;
  }
  this.addShape = b;
  function b(v) {
    var w = this.indexOfShape(v);
    if (w < 0) {
      a.push(v);
    }
  }
  this.removeShape = d;
  function d(v) {
    var w = this.indexOfShape(v);
    if (w >= 0) {
      a.splice(w, 1);
    }
  }
  this.getType = o;
  function o() {
    return "jxGraphics";
  }
  this.getDiv = c;
  function c() {
    return m;
  }
  this.getSVG = s;
  function s() {
    return p;
  }
  this.getVML = g;
  function g() {
    return e;
  }
  this.logicalToPhysicalPoint = j;
  function j(v) {
    if (this.coordinateSystem.toLowerCase() == "cartecian") {
      return new jxPoint(
        Math.round(v.x * this.scale + this.origin.x),
        Math.round(this.origin.y - v.y * this.scale),
      );
    } else {
      return new jxPoint(
        Math.round(v.x * this.scale + this.origin.x),
        Math.round(v.y * this.scale + this.origin.y),
      );
    }
  }
  this.draw = h;
  function h(v) {
    return v.draw(this);
  }
  this.remove = u;
  function u(v) {
    return v.remove(this);
  }
  this.redrawAll = q;
  function q() {
    for (ind in a) {
      a[ind].draw(this);
    }
  }
  this.getShapesCount = t;
  function t() {
    return a.length;
  }
  this.getShape = k;
  function k(v) {
    return a[v];
  }
  this.indexOfShape = f;
  function f(v) {
    var A = -1,
      z = a.length;
    for (var w = 0; w < z; w++) {
      if (v == a[w]) {
        A = w;
      }
    }
    return A;
  }
}
function jxColor() {
  var e = "#000000";
  switch (arguments.length) {
    case 1:
      e = arguments[0];
      break;
    case 3:
      var d = arguments[0];
      var c = arguments[1];
      var a = arguments[2];
      e = jxColor.rgbToHex(d, c, a);
      break;
  }
  this.getType = f;
  function f() {
    return "jxColor";
  }
  this.getValue = b;
  function b() {
    return e;
  }
}
jxColor.rgbToHex = function (a, c, b) {
  if (a < 0 || a > 255 || c < 0 || c > 255 || b < 0 || b > 255) {
    return false;
  }
  var d = Math.round(b) + 256 * Math.round(c) + 65536 * Math.round(a);
  return "#" + e(d.toString(16), 6);
  function e(h, f) {
    var g = h + "";
    while (g.length < f) {
      g = "0" + g;
    }
    return g;
  }
};
jxColor.hexToRgb = function (d) {
  var a, c, b;
  if (d.charAt(0) == "#") {
    d = d.substring(1, 7);
  }
  a = parseInt(d.substring(0, 2), 16);
  c = parseInt(d.substring(2, 4), 16);
  b = parseInt(d.substring(4, 6), 16);
  if (a < 0 || a > 255 || c < 0 || c > 255 || b < 0 || b > 255) {
    return false;
  }
  return new Array(a, c, b);
};
function jxFont(e, b, d, g, a) {
  this.family = null;
  this.size = null;
  this.style = null;
  this.weight = null;
  if (e) {
    this.family = e;
  }
  if (g) {
    this.weight = g;
  }
  if (b) {
    this.size = b;
  }
  if (d) {
    this.style = d;
  }
  this.updateSVG = f;
  function f(j) {
    if (this.family) {
      j.setAttribute("font-family", this.family);
    } else {
      j.setAttribute("font-family", "");
    }
    if (this.weight) {
      j.setAttribute("fontWeight", this.weight);
    } else {
      j.setAttribute("fontWeight", "");
    }
    if (this.size) {
      j.setAttribute("fontSize", this.size);
    } else {
      j.setAttribute("fontSize", "");
    }
    if (this.style) {
      j.setAttribute("fontStyle", this.style);
    } else {
      j.setAttribute("fontStyle", "");
    }
  }
  this.updateVML = c;
  function c(j) {
    if (this.family) {
    } else {
      j.style.fontFamily = "";
    }
    if (this.weight) {
      j.style.fontWeight = this.weight;
    } else {
      j.style.fontWeight = "";
    }
    if (this.size) {
      j.style.fontSize = this.size;
    } else {
      j.style.fontSize = "";
    }
    if (this.style) {
      j.style.fontStyle = this.style;
    } else {
      j.style.fontStyle = "";
    }
  }
  this.getType = h;
  function h() {
    return "jxFont";
  }
}
jxFont.updateSVG = function (a) {
  a.setAttribute("font-family", "");
  a.setAttribute("fontWeight", "");
  a.setAttribute("fontSize", "");
  a.setAttribute("fontStyle", "");
};
jxFont.updateVML = function (a) {
  a.style.fontFamily = "";
  a.style.fontWeight = "";
  a.style.fontSize = "";
  a.style.fontStyle = "";
};
function jxPen(a, c, e) {
  this.color = null;
  this.width = null;
  this.dashStyle = null;
  if (a) {
    this.color = a;
  } else {
    this.color = new jxColor("#000000");
  }
  if (c) {
    this.width = c;
  } else {
    this.width = "1px";
  }
  if (e) {
    this.dashStyle = e;
  }
  this.updateSVG = d;
  function d(h) {
    h.setAttribute("stroke", this.color.getValue());
    h.setAttribute("stroke-width", this.width);
    if (this.dashStyle) {
      var g = parseInt(this.width);
      switch (this.dashStyle.toLowerCase()) {
        case "shortdash":
          h.setAttribute("stroke-dasharray", g * 3 + " " + g);
          break;
        case "shortdot":
          h.setAttribute("stroke-dasharray", g + " " + g);
          break;
        case "shortdashdot":
          h.setAttribute(
            "stroke-dasharray",
            g * 3 + " " + g + " " + g + " " + g,
          );
          break;
        case "shortdashdotdot":
          h.setAttribute(
            "stroke-dasharray",
            g * 3 + " " + g + " " + g + " " + g + " " + g + " " + g,
          );
          break;
        case "dot":
          h.setAttribute("stroke-dasharray", g + " " + g * 3);
          break;
        case "dash":
          h.setAttribute("stroke-dasharray", g * 4 + " " + g * 3);
          break;
        case "longdash":
          h.setAttribute("stroke-dasharray", g * 8 + " " + g * 3);
          break;
        case "dashdot":
          h.setAttribute(
            "stroke-dasharray",
            g * 4 + " " + g * 3 + " " + g + " " + g * 3,
          );
          break;
        case "longdashdot":
          h.setAttribute(
            "stroke-dasharray",
            g * 8 + " " + g * 3 + " " + g + " " + g * 3,
          );
          break;
        case "longdashdotdot":
          h.setAttribute(
            "stroke-dasharray",
            g * 8 + " " + g * 3 + " " + g + " " + g * 3 + " " + g + " " + g * 3,
          );
          break;
        default:
          h.setAttribute("stroke-dasharray", this.dashStyle);
          break;
      }
    }
  }
  this.updateVML = b;
  function b(g) {
    g.Stroke.JoinStyle = "miter";
    g.Stroke.MiterLimit = "5";
    g.StrokeColor = this.color.getValue();
    g.StrokeWeight = this.width;
    if (this.dashStyle) {
      g.Stroke.DashStyle = this.dashStyle;
    }
    if (parseInt(this.width) == 0) {
      g.Stroked = "False";
    }
  }
  this.getType = f;
  function f() {
    return "jxPen";
  }
}
function jxBrush(a, e) {
  this.color = null;
  this.fillType = null;
  this.color2 = null;
  this.angle = null;
  if (a) {
    this.color = a;
  } else {
    this.color = new jxColor("#000000");
  }
  if (e) {
    this.fillType = e;
  } else {
    this.fillType = "solid";
  }
  this.color2 = new jxColor("#FFFFFF");
  this.updateSVG = c;
  function c(h, f) {
    var m = null,
      l;
    m = h.getAttribute("fill");
    if (m) {
      if (m.substr(0, 5) == "url(#") {
        m = m.substr(5, m.length - 6);
        l = document.getElementById(m);
      } else {
        m = null;
      }
    }
    if (this.fillType == "linear-gradient" || this.fillType == "lin-grad") {
      var g = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "linearGradient",
      );
      if (m) {
        f.replaceChild(g, l);
      } else {
        f.appendChild(g);
      }
      var k = document.createElementNS("http://www.w3.org/2000/svg", "stop");
      g.appendChild(k);
      var j = document.createElementNS("http://www.w3.org/2000/svg", "stop");
      g.appendChild(j);
      jsDraw2DX._RefID++;
      g.setAttribute("id", "jsDraw2DX_RefID_" + jsDraw2DX._RefID);
      if (this.angle != null) {
        g.setAttribute(
          "gradientTransform",
          "rotate(" + this.angle + " 0.5 0.5)",
        );
      } else {
        g.setAttribute("gradientTransform", "rotate(0 0.5 0.5)");
      }
      k.setAttribute("offset", "0%");
      k.setAttribute(
        "style",
        "stop-color:" + this.color.getValue() + ";stop-opacity:1",
      );
      j.setAttribute("offset", "100%");
      j.setAttribute(
        "style",
        "stop-color:" + this.color2.getValue() + ";stop-opacity:1",
      );
      g.appendChild(k);
      g.appendChild(j);
      h.setAttribute("fill", "url(#jsDraw2DX_RefID_" + jsDraw2DX._RefID + ")");
    } else {
      h.setAttribute("fill", this.color.getValue());
    }
  }
  this.updateVML = b;
  function b(f) {
    f.On = "true";
    if (this.fillType == "solid") {
      f.Type = "solid";
      f.Color = this.color.getValue();
      f.Color2 = "";
      f.Angle = 270;
    } else {
      f.Type = "gradient";
      if (this.angle != null) {
        f.Angle = 270 - this.angle;
      } else {
        f.Angle = 270;
      }
      f.Color = this.color.getValue();
      f.Color2 = this.color2.getValue();
    }
  }
  this.getType = d;
  function d() {
    return "jxBrush";
  }
}
function jxPoint(a, c) {
  this.x = a;
  this.y = c;
  this.getType = b;
  function b() {
    return "jxPoint";
  }
}
function jxLine(a, h, d) {
  this.fromPoint = a;
  this.toPoint = h;
  this.pen = null;
  var f,
    g = true;
  var m;
  if (d) {
    this.pen = d;
  }
  if (!jsDraw2DX._isVML) {
    f = document.createElementNS("http://www.w3.org/2000/svg", "line");
  } else {
    f = document.createElement("v:line");
  }
  this.getType = j;
  function j() {
    return "jxLine";
  }
  this.addEventListener = b;
  function b(o, p) {
    if (f.addEventListener) {
      f.addEventListener(o, q, false);
    } else {
      if (f.attachEvent) {
        f.attachEvent("on" + o, q);
      }
    }
    var n = this;
    function q(r) {
      p(r, n);
    }
  }
  this.draw = k;
  function k(z) {
    var o, v;
    o = z.logicalToPhysicalPoint(this.fromPoint);
    v = z.logicalToPhysicalPoint(this.toPoint);
    var q,
      t,
      s = false;
    q = this.pen.color.getValue();
    t = this.pen.width;
    var r, A, p, w;
    r = o.x;
    A = o.y;
    p = v.x;
    w = v.y;
    f.style.display = "none";
    if (!jsDraw2DX._isVML) {
      var u = z.getSVG();
      if (g) {
        u.appendChild(f);
        g = false;
      }
      if (!this.pen) {
        f.setAttribute("stroke", "none");
      } else {
        this.pen.updateSVG(f);
      }
      f.setAttribute("x1", r);
      f.setAttribute("y1", A);
      f.setAttribute("x2", p);
      f.setAttribute("y2", w);
    } else {
      var n = z.getVML();
      if (g) {
        n.appendChild(f);
        g = false;
      }
      if (!this.pen) {
        f.Stroked = "False";
      } else {
        this.pen.updateVML(f);
      }
      f.style.position = "absolute";
      f.From = r + "," + A;
      f.To = p + "," + w;
    }
    f.style.display = "";
    if (m && z != m) {
      m.removeShape(this);
    }
    m = z;
    m.addShape(this);
  }
  this.remove = c;
  function c() {
    if (m) {
      if (!jsDraw2DX._isVML) {
        var o = m.getSVG();
        o.removeChild(f);
      } else {
        var n = m.getVML();
        n.removeChild(f);
      }
      m.removeShape(this);
      m = null;
      g = true;
    }
  }
  this.show = l;
  function l() {
    f.style.display = "";
  }
  this.hide = e;
  function e() {
    f.style.display = "none";
  }
}
function jxRect(n, a, o, d, h) {
  this.point = n;
  this.width = a;
  this.height = o;
  this.pen = null;
  this.brush = null;
  var f,
    g = true;
  var m;
  if (d) {
    this.pen = d;
  }
  if (h) {
    this.brush = h;
  }
  if (!jsDraw2DX._isVML) {
    f = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  } else {
    f = document.createElement("v:rect");
  }
  this.getType = j;
  function j() {
    return "jxRect";
  }
  this.addEventListener = b;
  function b(q, r) {
    if (f.addEventListener) {
      f.addEventListener(q, s, false);
    } else {
      if (f.attachEvent) {
        f.attachEvent("on" + q, s);
      }
    }
    var p = this;
    function s(t) {
      r(t, p);
    }
  }
  this.draw = k;
  function k(t) {
    var r, w;
    r = t.logicalToPhysicalPoint(this.point);
    w = t.scale;
    var u, v;
    u = r.x;
    v = r.y;
    f.style.display = "none";
    if (!jsDraw2DX._isVML) {
      var s = t.getSVG();
      if (g) {
        s.appendChild(f);
        g = false;
      }
      if (!this.pen) {
        f.setAttribute("stroke", "none");
      } else {
        this.pen.updateSVG(f);
      }
      if (!this.brush) {
        f.setAttribute("fill", "none");
      } else {
        this.brush.updateSVG(f, t.getDefs());
      }
      f.setAttribute("x", u);
      f.setAttribute("y", v);
      f.setAttribute("width", w * this.width);
      f.setAttribute("height", w * this.height);
      f.style.position = "absolute";
    } else {
      var q = t.getVML(),
        p;
      if (g) {
        q.appendChild(f);
        g = false;
      }
      if (!this.pen) {
        f.Stroked = "False";
      } else {
        this.pen.updateVML(f);
      }
      p = f.fill;
      if (!this.brush) {
        p.On = "false";
      } else {
        this.brush.updateVML(p);
      }
      f.style.width = w * this.width;
      f.style.height = w * this.height;
      f.style.position = "absolute";
      f.style.top = v;
      f.style.left = u;
    }
    f.style.display = "";
    if (m && t != m) {
      m.removeShape(this);
    }
    m = t;
    m.addShape(this);
  }
  this.remove = c;
  function c() {
    if (m) {
      if (!jsDraw2DX._isVML) {
        var q = m.getSVG();
        q.removeChild(f);
      } else {
        var p = m.getVML();
        p.removeChild(f);
      }
      m.removeShape(this);
      m = null;
      g = true;
    }
  }
  this.show = l;
  function l() {
    f.style.display = "";
  }
  this.hide = e;
  function e() {
    f.style.display = "none";
  }
}
function jxPolyline(m, c, g) {
  this.points = m;
  this.pen = null;
  this.brush = null;
  var e,
    f = true;
  var l;
  if (c) {
    this.pen = c;
  }
  if (g) {
    this.brush = g;
  }
  if (!jsDraw2DX._isVML) {
    e = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  } else {
    e = document.createElement("v:polyline");
  }
  this.getType = h;
  function h() {
    return "jxPolyline";
  }
  this.addEventListener = a;
  function a(o, p) {
    if (e.addEventListener) {
      e.addEventListener(o, q, false);
    } else {
      if (e.attachEvent) {
        e.attachEvent("on" + o, q);
      }
    }
    var n = this;
    function q(r) {
      p(r, n);
    }
  }
  this.draw = j;
  function j(q) {
    var r = new Array(),
      s = "";
    for (ind in this.points) {
      r[ind] = q.logicalToPhysicalPoint(this.points[ind]);
    }
    for (ind in r) {
      s = s + r[ind].x + "," + r[ind].y + " ";
    }
    e.style.display = "none";
    if (!jsDraw2DX._isVML) {
      var p = q.getSVG();
      if (f) {
        p.appendChild(e);
        f = false;
      }
      if (!this.pen) {
        e.setAttribute("stroke", "none");
      } else {
        this.pen.updateSVG(e);
      }
      if (!this.brush) {
        e.setAttribute("fill", "none");
      } else {
        this.brush.updateSVG(e, q.getDefs());
      }
      e.style.position = "absolute";
      e.setAttribute("points", s);
    } else {
      var o = q.getVML(),
        n;
      if (f) {
        o.appendChild(e);
        f = false;
      }
      if (!this.pen) {
        e.Stroked = "False";
      } else {
        this.pen.updateVML(e);
      }
      n = e.fill;
      if (!this.brush) {
        n.On = "false";
      } else {
        this.brush.updateVML(n);
      }
      e.style.position = "absolute";
      e.Points.Value = s;
    }
    e.style.display = "";
    if (l && q != l) {
      l.removeShape(this);
    }
    l = q;
    l.addShape(this);
  }
  this.remove = b;
  function b() {
    if (l) {
      if (!jsDraw2DX._isVML) {
        var o = l.getSVG();
        o.removeChild(e);
      } else {
        var n = l.getVML();
        n.removeChild(e);
      }
      l.removeShape(this);
      l = null;
      f = true;
    }
  }
  this.show = k;
  function k() {
    e.style.display = "";
  }
  this.hide = d;
  function d() {
    e.style.display = "none";
  }
}
function jxPolygon(m, c, g) {
  this.points = m;
  this.pen = null;
  this.brush = null;
  var e,
    f = true;
  var l;
  if (c) {
    this.pen = c;
  }
  if (g) {
    this.brush = g;
  }
  if (!jsDraw2DX._isVML) {
    e = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  } else {
    e = document.createElement("v:polyline");
  }
  this.getType = h;
  function h() {
    return "jxPolygon";
  }
  this.addEventListener = a;
  function a(o, p) {
    if (e.addEventListener) {
      e.addEventListener(o, q, false);
    } else {
      if (e.attachEvent) {
        e.attachEvent("on" + o, q);
      }
    }
    var n = this;
    function q(r) {
      p(r, n);
    }
  }
  this.draw = j;
  function j(q) {
    var r = new Array(),
      s = "";
    for (ind in this.points) {
      r[ind] = q.logicalToPhysicalPoint(this.points[ind]);
    }
    for (ind in r) {
      s = s + r[ind].x + "," + r[ind].y + " ";
    }
    e.style.display = "none";
    if (!jsDraw2DX._isVML) {
      var p = q.getSVG();
      if (f) {
        p.appendChild(e);
        f = false;
      }
      if (!this.pen) {
        e.setAttribute("stroke", "none");
      } else {
        this.pen.updateSVG(e);
      }
      if (!this.brush) {
        e.setAttribute("fill", "none");
      } else {
        this.brush.updateSVG(e, q.getDefs());
      }
      e.style.position = "absolute";
      e.setAttribute("points", s);
    } else {
      s = s + r[0].x + "," + r[0].y;
      var o = q.getVML(),
        n;
      if (f) {
        o.appendChild(e);
        f = false;
      }
      if (!this.pen) {
        e.Stroked = "False";
      } else {
        this.pen.updateVML(e);
      }
      n = e.fill;
      if (!this.brush) {
        n.On = "false";
      } else {
        this.brush.updateVML(n);
      }
      e.style.position = "absolute";
      e.Points.Value = s;
    }
    e.style.display = "";
    if (l && q != l) {
      l.removeShape(this);
    }
    l = q;
    l.addShape(this);
  }
  this.remove = b;
  function b() {
    if (l) {
      if (!jsDraw2DX._isVML) {
        var o = l.getSVG();
        o.removeChild(e);
      } else {
        var n = l.getVML();
        n.removeChild(e);
      }
      l.removeShape(this);
      l = null;
      f = true;
    }
  }
  this.show = k;
  function k() {
    e.style.display = "";
  }
  this.hide = d;
  function d() {
    e.style.display = "none";
  }
}
function jxCircle(a, h, d, j) {
  this.center = a;
  this.radius = h;
  this.pen = null;
  this.brush = null;
  var f,
    g = true;
  var n;
  if (d) {
    this.pen = d;
  }
  if (j) {
    this.brush = j;
  }
  if (!jsDraw2DX._isVML) {
    f = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  } else {
    f = document.createElement("v:oval");
  }
  this.getType = k;
  function k() {
    return "jxCircle";
  }
  this.addEventListener = b;
  function b(p, q) {
    if (f.addEventListener) {
      f.addEventListener(p, r, false);
    } else {
      if (f.attachEvent) {
        f.attachEvent("on" + p, r);
      }
    }
    var o = this;
    function r(s) {
      q(s, o);
    }
  }
  this.draw = l;
  function l(t) {
    var r, u;
    r = t.logicalToPhysicalPoint(this.center);
    u = t.scale;
    var q, v;
    q = r.x;
    v = r.y;
    f.style.display = "none";
    if (!jsDraw2DX._isVML) {
      var s = t.getSVG();
      if (g) {
        s.appendChild(f);
        g = false;
      }
      if (!this.pen) {
        f.setAttribute("stroke", "none");
      } else {
        this.pen.updateSVG(f);
      }
      if (!this.brush) {
        f.setAttribute("fill", "none");
      } else {
        this.brush.updateSVG(f, t.getDefs());
      }
      f.setAttribute("cx", q);
      f.setAttribute("cy", v);
      f.setAttribute("r", u * this.radius);
      f.style.position = "absolute";
    } else {
      var p = t.getVML(),
        o;
      if (g) {
        p.appendChild(f);
        g = false;
      }
      if (!this.pen) {
        f.Stroked = "False";
      } else {
        this.pen.updateVML(f);
      }
      o = f.fill;
      if (!this.brush) {
        o.On = "false";
      } else {
        this.brush.updateVML(o);
      }
      f.style.width = u * this.radius * 2;
      f.style.height = u * this.radius * 2;
      f.style.position = "absolute";
      f.style.top = v - u * this.radius;
      f.style.left = q - u * this.radius;
    }
    f.style.display = "";
    if (n && t != n) {
      n.removeShape(this);
    }
    n = t;
    n.addShape(this);
  }
  this.remove = c;
  function c() {
    if (n) {
      if (!jsDraw2DX._isVML) {
        var p = n.getSVG();
        p.removeChild(f);
      } else {
        var o = n.getVML();
        o.removeChild(f);
      }
      n.removeShape(this);
      n = null;
      g = true;
    }
  }
  this.show = m;
  function m() {
    f.style.display = "";
  }
  this.hide = e;
  function e() {
    f.style.display = "none";
  }
}
function jxEllipse(a, b, o, e, j) {
  this.center = a;
  this.width = b;
  this.height = o;
  this.pen = null;
  this.brush = null;
  var g,
    h = true;
  var n;
  if (e) {
    this.pen = e;
  }
  if (j) {
    this.brush = j;
  }
  if (!jsDraw2DX._isVML) {
    g = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
  } else {
    g = document.createElement("v:oval");
  }
  this.getType = k;
  function k() {
    return "jxEllipse";
  }
  this.addEventListener = c;
  function c(q, r) {
    if (g.addEventListener) {
      g.addEventListener(q, s, false);
    } else {
      if (g.attachEvent) {
        g.attachEvent("on" + q, s);
      }
    }
    var p = this;
    function s(t) {
      r(t, p);
    }
  }
  this.draw = l;
  function l(u) {
    var s, v;
    s = u.logicalToPhysicalPoint(this.center);
    v = u.scale;
    var r, w;
    r = s.x;
    w = s.y;
    g.style.display = "none";
    if (!jsDraw2DX._isVML) {
      var t = u.getSVG();
      if (h) {
        t.appendChild(g);
        h = false;
      }
      if (!this.pen) {
        g.setAttribute("stroke", "none");
      } else {
        this.pen.updateSVG(g);
      }
      if (!this.brush) {
        g.setAttribute("fill", "none");
      } else {
        this.brush.updateSVG(g, u.getDefs());
      }
      g.setAttribute("cx", r);
      g.setAttribute("cy", w);
      g.setAttribute("rx", (v * this.width) / 2);
      g.setAttribute("ry", (v * this.height) / 2);
      g.style.position = "absolute";
    } else {
      var q = u.getVML(),
        p;
      if (h) {
        q.appendChild(g);
        h = false;
      }
      if (!this.pen) {
        g.Stroked = "False";
      } else {
        this.pen.updateVML(g);
      }
      p = g.fill;
      if (!this.brush) {
        p.On = "false";
      } else {
        this.brush.updateVML(p);
      }
      g.style.width = v * this.width;
      g.style.height = v * this.height;
      g.style.position = "absolute";
      g.style.top = w - (v * this.height) / 2;
      g.style.left = r - (v * this.width) / 2;
    }
    g.style.display = "";
    if (n && u != n) {
      n.removeShape(this);
    }
    n = u;
    n.addShape(this);
  }
  this.remove = d;
  function d() {
    if (n) {
      if (!jsDraw2DX._isVML) {
        var q = n.getSVG();
        q.removeChild(g);
      } else {
        var p = n.getVML();
        p.removeChild(g);
      }
      n.removeShape(this);
      n = null;
      h = true;
    }
  }
  this.show = m;
  function m() {
    g.style.display = "";
  }
  this.hide = f;
  function f() {
    g.style.display = "none";
  }
}
function jxArc(a, b, p, j, q, e, k) {
  this.center = a;
  this.width = b;
  this.height = p;
  this.startAngle = j;
  this.arcAngle = q;
  this.pen = null;
  this.brush = null;
  var g,
    h = true;
  var o;
  if (e) {
    this.pen = e;
  }
  if (k) {
    this.brush = k;
  }
  if (!jsDraw2DX._isVML) {
    g = document.createElementNS("http://www.w3.org/2000/svg", "path");
  } else {
    g = document.createElement("v:arc");
  }
  this.getType = l;
  function l() {
    return "jxArc";
  }
  this.addEventListener = c;
  function c(s, t) {
    if (g.addEventListener) {
      g.addEventListener(s, u, false);
    } else {
      if (g.attachEvent) {
        g.attachEvent("on" + s, u);
      }
    }
    var r = this;
    function u(v) {
      t(v, r);
    }
  }
  this.draw = m;
  function m(I) {
    var L, N;
    L = I.logicalToPhysicalPoint(I);
    N = I.scale;
    var w, u;
    w = this.center.x;
    u = this.center.y;
    g.style.display = "none";
    if (!jsDraw2DX._isVML) {
      var M, K, F, E, H, G, v, t, r, A;
      M = (N * this.width) / 2;
      K = (N * this.height) / 2;
      r = (this.startAngle * Math.PI) / 180;
      F =
        (M * K) /
        Math.sqrt(
          K * K * Math.cos(r) * Math.cos(r) + M * M * Math.sin(r) * Math.sin(r),
        );
      H = F * Math.cos(r);
      v = F * Math.sin(r);
      H = w + H;
      v = u + v;
      A = ((j + q) * Math.PI) / 180;
      E =
        (M * K) /
        Math.sqrt(
          K * K * Math.cos(A) * Math.cos(A) + M * M * Math.sin(A) * Math.sin(A),
        );
      G = E * Math.cos(A);
      t = E * Math.sin(A);
      G = w + G;
      t = u + t;
      var C = I.getSVG();
      if (h) {
        C.appendChild(g);
        h = false;
      }
      if (!this.pen) {
        g.setAttribute("stroke", "none");
      } else {
        this.pen.updateSVG(g);
      }
      if (!this.brush) {
        g.setAttribute("fill", "none");
      } else {
        this.brush.updateSVG(g, I.getDefs());
      }
      if (q > 180) {
        g.setAttribute(
          "d",
          "M" + H + " " + v + " A" + M + " " + K + " 0 1 1 " + G + " " + t,
        );
      } else {
        g.setAttribute(
          "d",
          "M" + H + " " + v + " A" + M + " " + K + " 0 0 1 " + G + " " + t,
        );
      }
    } else {
      var s = I.getVML(),
        J;
      if (h) {
        s.appendChild(g);
        h = false;
      }
      var M, K, F, E, r, A, z, B, D;
      D = this.startAngle + this.arcAngle;
      j = this.startAngle % 360;
      D = D % 360;
      M = (N * this.width) / 2;
      K = (N * this.height) / 2;
      r = (this.startAngle * Math.PI) / 180;
      F =
        (M * K) /
        Math.sqrt(
          K * K * Math.cos(r) * Math.cos(r) + M * M * Math.sin(r) * Math.sin(r),
        );
      z = (Math.asin((F * Math.sin(r)) / K) * 180) / Math.PI;
      if (this.startAngle > 270) {
        z = 360 + z;
      } else {
        if (this.startAngle > 90) {
          z = 180 - z;
        }
      }
      A = (D * Math.PI) / 180;
      E =
        (M * K) /
        Math.sqrt(
          K * K * Math.cos(A) * Math.cos(A) + M * M * Math.sin(A) * Math.sin(A),
        );
      B = (Math.asin((E * Math.sin(A)) / K) * 180) / Math.PI;
      if (D > 270) {
        B = 360 + B;
      } else {
        if (D > 90) {
          B = 180 - B;
        }
      }
      if (!this.pen) {
        g.Stroked = "False";
      } else {
        this.pen.updateVML(g);
      }
      J = g.fill;
      if (!this.brush) {
        J.On = "false";
      } else {
        this.brush.updateVML(J);
      }
      g.style.position = "absolute";
      g.style.width = N * this.width;
      g.style.height = N * this.height;
      g.style.position = "absolute";
      g.style.left = w - (N * this.width) / 2;
      g.style.top = u - (N * this.height) / 2;
      z = z + 90;
      if (z > 360) {
        g.StartAngle = z % 360;
      } else {
        g.StartAngle = z;
      }
      B = B + 90;
      if (B > 360) {
        if (z <= 360) {
          g.StartAngle = z - 360;
        }
        g.EndAngle = B % 360;
      } else {
        g.EndAngle = B;
      }
    }
    g.style.display = "";
    if (o && I != o) {
      o.removeShape(this);
    }
    o = I;
    o.addShape(this);
  }
  this.remove = d;
  function d() {
    if (o) {
      if (!jsDraw2DX._isVML) {
        var s = o.getSVG();
        s.removeChild(g);
      } else {
        var r = o.getVML();
        r.removeChild(g);
      }
      o.removeShape(this);
      o = null;
      h = true;
    }
  }
  this.show = n;
  function n() {
    g.style.display = "";
  }
  this.hide = f;
  function f() {
    g.style.display = "none";
  }
}
function jxArcSector(a, b, p, j, q, e, k) {
  this.center = a;
  this.width = b;
  this.height = p;
  this.startAngle = j;
  this.arcAngle = q;
  this.pen = null;
  this.brush = null;
  var g,
    h = true;
  var o;
  if (e) {
    this.pen = e;
  }
  if (k) {
    this.brush = k;
  }
  if (!jsDraw2DX._isVML) {
    g = document.createElementNS("http://www.w3.org/2000/svg", "path");
  } else {
    g = document.createElement("v:shape");
  }
  this.getType = l;
  function l() {
    return "jxArcSector";
  }
  this.addEventListener = c;
  function c(s, t) {
    if (g.addEventListener) {
      g.addEventListener(s, u, false);
    } else {
      if (g.attachEvent) {
        g.attachEvent("on" + s, u);
      }
    }
    var r = this;
    function u(v) {
      t(v, r);
    }
  }
  this.draw = m;
  function m(L) {
    var O, Q;
    O = L.logicalToPhysicalPoint(this.center);
    Q = L.scale;
    var A, v;
    A = O.x;
    v = O.y;
    var P, N, H, G, K, J, z, u, r, B;
    P = (Q * this.width) / 2;
    N = (Q * this.height) / 2;
    r = (this.startAngle * Math.PI) / 180;
    H =
      (P * N) /
      Math.sqrt(
        N * N * Math.cos(r) * Math.cos(r) + P * P * Math.sin(r) * Math.sin(r),
      );
    K = H * Math.cos(r);
    z = H * Math.sin(r);
    K = A + K;
    z = v + z;
    B = ((this.startAngle + this.arcAngle) * Math.PI) / 180;
    G =
      (P * N) /
      Math.sqrt(
        N * N * Math.cos(B) * Math.cos(B) + P * P * Math.sin(B) * Math.sin(B),
      );
    J = G * Math.cos(B);
    u = G * Math.sin(B);
    J = A + J;
    u = v + u;
    g.style.display = "none";
    if (!jsDraw2DX._isVML) {
      var E = L.getSVG();
      if (h) {
        E.appendChild(g);
        h = false;
      }
      if (!this.pen) {
        g.setAttribute("stroke", "none");
      } else {
        this.pen.updateSVG(g);
      }
      if (!this.brush) {
        g.setAttribute("fill", "none");
      } else {
        this.brush.updateSVG(g, L.getDefs());
      }
      if (q > 180) {
        g.setAttribute(
          "d",
          "M" +
            A +
            " " +
            v +
            " L" +
            K +
            " " +
            z +
            " A" +
            P +
            " " +
            N +
            " 0 1 1 " +
            J +
            " " +
            u +
            " Z",
        );
      } else {
        g.setAttribute(
          "d",
          "M" +
            A +
            " " +
            v +
            " L" +
            K +
            " " +
            z +
            " A" +
            P +
            " " +
            N +
            " 0 0 1 " +
            J +
            " " +
            u +
            " Z",
        );
      }
    } else {
      var s = L.getVML(),
        M;
      if (h) {
        s.appendChild(g);
        h = false;
      }
      var D, F, I, C;
      D = Math.min(u, Math.min(v, z));
      F = Math.min(J, Math.min(A, K));
      I = Math.max(u, Math.max(v, z)) - D;
      C = Math.max(J, Math.max(A, K)) - F;
      if (!this.pen) {
        g.Stroked = "False";
      } else {
        this.pen.updateVML(g);
      }
      M = g.fill;
      if (!this.brush) {
        M.On = "false";
      } else {
        this.brush.updateVML(M);
      }
      g.style.position = "absolute";
      g.style.height = 1;
      g.style.width = 1;
      g.CoordSize = 1 + " " + 1;
      g.Path =
        "M" +
        A +
        "," +
        v +
        " AT" +
        (A - P) +
        "," +
        (v - N) +
        "," +
        (A + P) +
        "," +
        (v + N) +
        "," +
        Math.round(J) +
        "," +
        Math.round(u) +
        "," +
        Math.round(K) +
        "," +
        Math.round(z) +
        " X E";
    }
    g.style.display = "";
    if (o && L != o) {
      o.removeShape(this);
    }
    o = L;
    o.addShape(this);
  }
  this.remove = d;
  function d() {
    if (o) {
      if (!jsDraw2DX._isVML) {
        var s = o.getSVG();
        s.removeChild(g);
      } else {
        var r = o.getVML();
        r.removeChild(g);
      }
      o.removeShape(this);
      o = null;
      h = true;
    }
  }
  this.show = n;
  function n() {
    g.style.display = "";
  }
  this.hide = f;
  function f() {
    g.style.display = "none";
  }
}
function jxCurve(n, c, g, l) {
  this.points = n;
  this.pen = null;
  this.brush = null;
  this.tension = 1;
  var e,
    f = true;
  var m;
  if (c) {
    this.pen = c;
  }
  if (g) {
    this.brush = g;
  }
  if (l != null) {
    this.tension = l;
  }
  if (!jsDraw2DX._isVML) {
    e = document.createElementNS("http://www.w3.org/2000/svg", "path");
  } else {
    e = document.createElement("v:shape");
  }
  this.getType = h;
  function h() {
    return "jxCurve";
  }
  this.addEventListener = a;
  function a(p, q) {
    if (e.addEventListener) {
      e.addEventListener(p, r, false);
    } else {
      if (e.attachEvent) {
        e.attachEvent("on" + p, r);
      }
    }
    var o = this;
    function r(s) {
      q(s, o);
    }
  }
  this.draw = j;
  function j(u) {
    var v = new Array();
    for (ind in this.points) {
      v[ind] = u.logicalToPhysicalPoint(this.points[ind]);
    }
    var z,
      p = this.tension,
      t = new Array(),
      w = new Array(),
      q = new Array();
    for (i in v) {
      i = parseInt(i);
      if (i == 0) {
        t[i] = new jxPoint(
          (p * (v[1].x - v[0].x)) / 2,
          (p * (v[1].y - v[0].y)) / 2,
        );
      } else {
        if (i == v.length - 1) {
          t[i] = new jxPoint(
            (p * (v[i].x - v[i - 1].x)) / 2,
            (p * (v[i].y - v[i - 1].y)) / 2,
          );
        } else {
          t[i] = new jxPoint(
            (p * (v[i + 1].x - v[i - 1].x)) / 2,
            (p * (v[i + 1].y - v[i - 1].y)) / 2,
          );
        }
      }
    }
    for (i in v) {
      i = parseInt(i);
      if (i == v.length - 1) {
        w[i] = new jxPoint(v[i].x + t[i].x / 3, v[i].y + t[i].y / 3);
        q[i] = new jxPoint(v[i].x - t[i].x / 3, v[i].y - t[i].y / 3);
      } else {
        w[i] = new jxPoint(v[i].x + t[i].x / 3, v[i].y + t[i].y / 3);
        q[i] = new jxPoint(
          v[i + 1].x - t[i + 1].x / 3,
          v[i + 1].y - t[i + 1].y / 3,
        );
      }
    }
    for (i in v) {
      i = parseInt(i);
      if (i == 0) {
        z = "M" + v[i].x + "," + v[i].y;
      }
      if (i < v.length - 1) {
        z =
          z +
          " C" +
          Math.round(w[i].x) +
          "," +
          Math.round(w[i].y) +
          "," +
          Math.round(q[i].x) +
          "," +
          Math.round(q[i].y) +
          "," +
          Math.round(v[i + 1].x) +
          "," +
          Math.round(v[i + 1].y);
      }
    }
    e.style.display = "none";
    if (!jsDraw2DX._isVML) {
      var s = u.getSVG();
      if (f) {
        s.appendChild(e);
        f = false;
      }
      if (!this.pen) {
        e.setAttribute("stroke", "none");
      } else {
        this.pen.updateSVG(e);
      }
      if (!this.brush) {
        e.setAttribute("fill", "none");
      } else {
        this.brush.updateSVG(e, u.getDefs());
      }
      e.setAttribute("d", z);
    } else {
      var o = u.getVML(),
        r;
      if (f) {
        o.appendChild(e);
        f = false;
      }
      if (!this.pen) {
        e.Stroked = "False";
      } else {
        this.pen.updateVML(e);
      }
      r = e.fill;
      if (!this.brush) {
        r.On = "false";
      } else {
        this.brush.updateVML(r);
      }
      z = z + " E";
      e.style.position = "absolute";
      e.style.width = 1;
      e.style.height = 1;
      e.CoordSize = 1 + " " + 1;
      e.Path = z;
    }
    e.style.display = "";
    if (m && u != m) {
      m.removeShape(this);
    }
    m = u;
    m.addShape(this);
  }
  this.remove = b;
  function b() {
    if (m) {
      if (!jsDraw2DX._isVML) {
        var p = m.getSVG();
        p.removeChild(e);
      } else {
        var o = m.getVML();
        o.removeChild(e);
      }
      m.removeShape(this);
      m = null;
      f = true;
    }
  }
  this.show = k;
  function k() {
    e.style.display = "";
  }
  this.hide = d;
  function d() {
    e.style.display = "none";
  }
}
function jxClosedCurve(n, c, g, l) {
  this.points = n;
  this.pen = null;
  this.brush = null;
  this.tension = 1;
  var e,
    f = true;
  var m;
  var e = null;
  if (c) {
    this.pen = c;
  }
  if (g) {
    this.brush = g;
  }
  if (l != null) {
    this.tension = l;
  }
  if (!jsDraw2DX._isVML) {
    e = document.createElementNS("http://www.w3.org/2000/svg", "path");
  } else {
    e = document.createElement("v:shape");
  }
  this.getType = h;
  function h() {
    return "jxClosedCurve";
  }
  this.addEventListener = a;
  function a(p, q) {
    if (e.addEventListener) {
      e.addEventListener(p, r, false);
    } else {
      if (e.attachEvent) {
        e.attachEvent("on" + p, r);
      }
    }
    var o = this;
    function r(s) {
      q(s, o);
    }
  }
  this.draw = j;
  function j(v) {
    var w = new Array();
    for (ind in this.points) {
      w[ind] = v.logicalToPhysicalPoint(this.points[ind]);
    }
    var A,
      p = w.length - 1,
      q = this.tension,
      u = new Array(),
      z = new Array(),
      r = new Array();
    for (i in w) {
      i = parseInt(i);
      if (i == 0) {
        u[i] = new jxPoint(
          (q * (w[1].x - w[p].x)) / 2,
          (q * (w[1].y - w[p].y)) / 2,
        );
      } else {
        if (i == w.length - 1) {
          u[i] = new jxPoint(
            (q * (w[0].x - w[i - 1].x)) / 2,
            (q * (w[0].y - w[i - 1].y)) / 2,
          );
        } else {
          u[i] = new jxPoint(
            (q * (w[i + 1].x - w[i - 1].x)) / 2,
            (q * (w[i + 1].y - w[i - 1].y)) / 2,
          );
        }
      }
    }
    for (i in w) {
      i = parseInt(i);
      if (i == w.length - 1) {
        z[i] = new jxPoint(w[i].x + u[i].x / 3, w[i].y + u[i].y / 3);
        r[i] = new jxPoint(w[0].x - u[0].x / 3, w[0].y - u[0].y / 3);
      } else {
        z[i] = new jxPoint(w[i].x + u[i].x / 3, w[i].y + u[i].y / 3);
        r[i] = new jxPoint(
          w[i + 1].x - u[i + 1].x / 3,
          w[i + 1].y - u[i + 1].y / 3,
        );
      }
    }
    for (i in w) {
      i = parseInt(i);
      if (i == 0) {
        A = "M" + w[i].x + "," + w[i].y;
      }
      if (i < w.length - 1) {
        A =
          A +
          " C" +
          Math.round(z[i].x) +
          "," +
          Math.round(z[i].y) +
          "," +
          Math.round(r[i].x) +
          "," +
          Math.round(r[i].y) +
          "," +
          Math.round(w[i + 1].x) +
          "," +
          Math.round(w[i + 1].y);
      }
      if (i == w.length - 1) {
        A =
          A +
          " C" +
          Math.round(z[i].x) +
          "," +
          Math.round(z[i].y) +
          "," +
          Math.round(r[i].x) +
          "," +
          Math.round(r[i].y) +
          "," +
          Math.round(w[0].x) +
          "," +
          Math.round(w[0].y);
      }
    }
    e.style.display = "none";
    if (!jsDraw2DX._isVML) {
      var t = v.getSVG();
      if (f) {
        t.appendChild(e);
        f = false;
      }
      if (!this.pen) {
        e.setAttribute("stroke", "none");
      } else {
        this.pen.updateSVG(e);
      }
      if (!this.brush) {
        e.setAttribute("fill", "none");
      } else {
        this.brush.updateSVG(e, v.getDefs());
      }
      e.setAttribute("d", A);
    } else {
      var o = v.getVML(),
        s;
      if (f) {
        o.appendChild(e);
        f = false;
      }
      A = A + " E";
      if (!this.pen) {
        e.Stroked = "False";
      } else {
        this.pen.updateVML(e);
      }
      s = e.fill;
      if (!this.brush) {
        s.On = "false";
      } else {
        this.brush.updateVML(s);
      }
      e.style.position = "absolute";
      e.style.width = 1;
      e.style.height = 1;
      e.CoordSize = 1 + " " + 1;
      e.Path = A;
    }
    e.style.display = "";
    if (m && v != m) {
      m.removeShape(this);
    }
    m = v;
    m.addShape(this);
  }
  this.remove = b;
  function b() {
    if (m) {
      if (!jsDraw2DX._isVML) {
        var p = m.getSVG();
        p.removeChild(e);
      } else {
        var o = m.getVML();
        o.removeChild(e);
      }
      m.removeShape(this);
      m = null;
      f = true;
    }
  }
  this.show = k;
  function k() {
    e.style.display = "";
  }
  this.hide = d;
  function d() {
    e.style.display = "none";
  }
}
function jxBezier(m, c, g) {
  this.points = m;
  this.pen = null;
  this.brush = null;
  var e,
    f = true;
  var l;
  if (c) {
    this.pen = c;
  }
  if (g) {
    this.brush = g;
  }
  if (!jsDraw2DX._isVML) {
    e = document.createElementNS("http://www.w3.org/2000/svg", "path");
  } else {
    e = document.createElement("v:shape");
  }
  this.getType = h;
  function h() {
    return "jxBezier";
  }
  this.addEventListener = a;
  function a(o, p) {
    if (e.addEventListener) {
      e.addEventListener(o, q, false);
    } else {
      if (e.attachEvent) {
        e.attachEvent("on" + o, q);
      }
    }
    var n = this;
    function q(r) {
      p(r, n);
    }
  }
  this.draw = j;
  function j(H) {
    var B = new Array();
    for (ind in this.points) {
      B[ind] = H.logicalToPhysicalPoint(this.points[ind]);
    }
    var w;
    if (B.length > 4) {
      var G = new Array();
      var u = new Array();
      var r = new Array();
      var E = new Array();
      var A = B.length - 1;
      var F,
        D,
        C,
        z,
        s,
        J =
          10 *
          Math.min(
            1 / Math.abs(B[A].x - B[0].x),
            1 / Math.abs(B[A].y - B[0].y),
          );
      z = 0;
      for (s = 0; s < 1; s += J) {
        x = 0;
        y = 0;
        for (C = 0; C <= A; C++) {
          F = Math.pow(s, C) * Math.pow(1 - s, A - C) * B[C].x;
          if (C != 0 || C != A) {
            F =
              (F * jsDraw2DX.fact(A)) /
              jsDraw2DX.fact(C) /
              jsDraw2DX.fact(A - C);
          }
          x = x + F;
          D = Math.pow(s, C) * Math.pow(1 - s, A - C) * B[C].y;
          if (C != 0 || C != A) {
            D =
              (D * jsDraw2DX.fact(A)) /
              jsDraw2DX.fact(C) /
              jsDraw2DX.fact(A - C);
          }
          y = y + D;
        }
        E[z] = new jxPoint(x, y);
        z++;
      }
      E[z] = new jxPoint(B[A].x, B[A].y);
      B = E;
      tension = 1;
      for (C in B) {
        C = parseInt(C);
        if (C == 0) {
          G[C] = new jxPoint(
            (tension * (B[1].x - B[0].x)) / 2,
            (tension * (B[1].y - B[0].y)) / 2,
          );
        } else {
          if (C == B.length - 1) {
            G[C] = new jxPoint(
              (tension * (B[C].x - B[C - 1].x)) / 2,
              (tension * (B[C].y - B[C - 1].y)) / 2,
            );
          } else {
            G[C] = new jxPoint(
              (tension * (B[C + 1].x - B[C - 1].x)) / 2,
              (tension * (B[C + 1].y - B[C - 1].y)) / 2,
            );
          }
        }
      }
      for (C in B) {
        C = parseInt(C);
        if (C == 0) {
          u[C] = new jxPoint(B[0].x + G[0].x / 3, B[0].y + G[0].y / 3);
          r[C] = new jxPoint(B[1].x - G[1].x / 3, B[1].y - G[1].y / 3);
        } else {
          if (C == B.length - 1) {
            u[C] = new jxPoint(B[C].x + G[C].x / 3, B[C].y + G[C].y / 3);
            r[C] = new jxPoint(B[C].x - G[C].x / 3, B[C].y - G[C].y / 3);
          } else {
            u[C] = new jxPoint(B[C].x + G[C].x / 3, B[C].y + G[C].y / 3);
            r[C] = new jxPoint(
              B[C + 1].x - G[C + 1].x / 3,
              B[C + 1].y - G[C + 1].y / 3,
            );
          }
        }
      }
      for (C in B) {
        C = parseInt(C);
        if (C == 0) {
          w = "M" + B[C].x + "," + B[C].y;
        }
        if (C < B.length - 1) {
          w =
            w +
            " C" +
            Math.round(u[C].x) +
            "," +
            Math.round(u[C].y) +
            "," +
            Math.round(r[C].x) +
            "," +
            Math.round(r[C].y) +
            "," +
            Math.round(B[C + 1].x) +
            "," +
            Math.round(B[C + 1].y);
        }
      }
    } else {
      if (B.length == 4) {
        w =
          " M" +
          B[0].x +
          "," +
          B[0].y +
          " C" +
          B[1].x +
          "," +
          B[1].y +
          " " +
          B[2].x +
          "," +
          B[2].y +
          " " +
          B[3].x +
          "," +
          B[3].y;
      } else {
        if (B.length == 3) {
          if (!jsDraw2DX._isVML) {
            w =
              " M" +
              B[0].x +
              "," +
              B[0].y +
              " Q" +
              B[1].x +
              "," +
              B[1].y +
              " " +
              B[2].x +
              "," +
              B[2].y;
          } else {
            var o = new jxPoint(
              (2 / 3) * B[1].x + (1 / 3) * B[0].x,
              (2 / 3) * B[1].y + (1 / 3) * B[0].y,
            );
            var q = new jxPoint(
              (2 / 3) * B[1].x + (1 / 3) * B[2].x,
              (2 / 3) * B[1].y + (1 / 3) * B[2].y,
            );
            w =
              " M" +
              B[0].x +
              "," +
              B[0].y +
              " C" +
              Math.round(o.x) +
              "," +
              Math.round(o.y) +
              " " +
              Math.round(q.x) +
              "," +
              Math.round(q.y) +
              " " +
              B[2].x +
              "," +
              B[2].y;
          }
        }
      }
    }
    e.style.display = "none";
    if (!jsDraw2DX._isVML) {
      var v = H.getSVG();
      if (f) {
        v.appendChild(e);
        f = false;
      }
      if (!this.pen) {
        e.setAttribute("stroke", "none");
      } else {
        this.pen.updateSVG(e);
      }
      if (!this.brush) {
        e.setAttribute("fill", "none");
      } else {
        this.brush.updateSVG(e, H.getDefs());
      }
      e.setAttribute("d", w);
    } else {
      var p = H.getVML(),
        I;
      if (f) {
        p.appendChild(e);
        f = false;
      }
      w = w + " E";
      if (!this.pen) {
        e.Stroked = "False";
      } else {
        this.pen.updateVML(e);
      }
      I = e.fill;
      if (!this.brush) {
        I.On = "false";
      } else {
        this.brush.updateVML(I);
      }
      e.style.position = "absolute";
      e.style.width = 1;
      e.style.height = 1;
      e.CoordSize = 1 + " " + 1;
      e.Path = w;
    }
    e.style.display = "";
    if (l && H != l) {
      l.removeShape(this);
    }
    l = H;
    l.addShape(this);
  }
  this.remove = b;
  function b() {
    if (l) {
      if (!jsDraw2DX._isVML) {
        var o = l.getSVG();
        o.removeChild(e);
      } else {
        var n = l.getVML();
        n.removeChild(e);
      }
      l.removeShape(this);
      l = null;
      f = true;
    }
  }
  this.show = k;
  function k() {
    e.style.display = "";
  }
  this.hide = d;
  function d() {
    e.style.display = "none";
  }
}
function jxFunctionGraph(fn, xMin, xMax, pen, brush) {
  this.fn = fn;
  this.xMin = xMin;
  this.xMax = xMax;
  this.pen = null;
  this.brush = null;
  var _svgvmlObj,
    _isFirst = true;
  var _graphics;
  if (pen) {
    this.pen = pen;
  }
  if (brush) {
    this.brush = brush;
  }
  if (!jsDraw2DX._isVML) {
    _svgvmlObj = document.createElementNS("http://www.w3.org/2000/svg", "path");
  } else {
    _svgvmlObj = document.createElement("v:shape");
  }
  this.getType = getType;
  function getType() {
    return "jxFunctionGraph";
  }
  this.addEventListener = addEventListener;
  function addEventListener(eventName, handler) {
    if (_svgvmlObj.addEventListener) {
      _svgvmlObj.addEventListener(eventName, handlerWrapper, false);
    } else {
      if (_svgvmlObj.attachEvent) {
        _svgvmlObj.attachEvent("on" + eventName, handlerWrapper);
      }
    }
    var currentObj = this;
    function handlerWrapper(evt) {
      handler(evt, currentObj);
    }
  }
  this.validate = validate;
  function validate(fn) {
    fn = fn.replace(/x/g, 1);
    with (Math) {
      try {
        eval(fn);
        return true;
      } catch (ex) {
        return false;
      }
    }
  }
  this.draw = draw;
  function draw(graphics) {
    var points = new Array();
    var path, pDpoints;
    var pDpoints = new Array();
    var b1points = new Array();
    var b2points = new Array();
    if (!this.validate(fn)) {
      return;
    }
    var x,
      y,
      ic = 0;
    for (x = xMin; x < xMax; x++) {
      with (Math) {
        y = eval(fn.replace(/x/g, x));
      }
      points[ic] = graphics.logicalToPhysicalPoint(new jxPoint(x, y));
      ic++;
    }
    with (Math) {
      y = eval(fn.replace(/x/g, xMax));
    }
    points[ic] = graphics.logicalToPhysicalPoint(new jxPoint(x, y));
    ic++;
    tension = 1;
    for (i in points) {
      i = parseInt(i);
      if (i == 0) {
        pDpoints[i] = new jxPoint(
          (tension * (points[1].x - points[0].x)) / 2,
          (tension * (points[1].y - points[0].y)) / 2,
        );
      } else {
        if (i == points.length - 1) {
          pDpoints[i] = new jxPoint(
            (tension * (points[i].x - points[i - 1].x)) / 2,
            (tension * (points[i].y - points[i - 1].y)) / 2,
          );
        } else {
          pDpoints[i] = new jxPoint(
            (tension * (points[i + 1].x - points[i - 1].x)) / 2,
            (tension * (points[i + 1].y - points[i - 1].y)) / 2,
          );
        }
      }
    }
    for (i in points) {
      i = parseInt(i);
      if (i == 0) {
        b1points[i] = new jxPoint(
          points[0].x + pDpoints[0].x / 3,
          points[0].y + pDpoints[0].y / 3,
        );
        b2points[i] = new jxPoint(
          points[1].x - pDpoints[1].x / 3,
          points[1].y - pDpoints[1].y / 3,
        );
      } else {
        if (i == points.length - 1) {
          b1points[i] = new jxPoint(
            points[i].x + pDpoints[i].x / 3,
            points[i].y + pDpoints[i].y / 3,
          );
          b2points[i] = new jxPoint(
            points[i].x - pDpoints[i].x / 3,
            points[i].y - pDpoints[i].y / 3,
          );
        } else {
          b1points[i] = new jxPoint(
            points[i].x + pDpoints[i].x / 3,
            points[i].y + pDpoints[i].y / 3,
          );
          b2points[i] = new jxPoint(
            points[i + 1].x - pDpoints[i + 1].x / 3,
            points[i + 1].y - pDpoints[i + 1].y / 3,
          );
        }
      }
    }
    for (i in points) {
      i = parseInt(i);
      if (i == 0) {
        path = "M" + points[i].x + "," + points[i].y;
      }
      if (i < points.length - 1) {
        path =
          path +
          " C" +
          Math.round(b1points[i].x) +
          "," +
          Math.round(b1points[i].y) +
          "," +
          Math.round(b2points[i].x) +
          "," +
          Math.round(b2points[i].y) +
          "," +
          Math.round(points[i + 1].x) +
          "," +
          Math.round(points[i + 1].y);
      }
    }
    _svgvmlObj.style.display = "none";
    if (!jsDraw2DX._isVML) {
      var svg = graphics.getSVG();
      if (_isFirst) {
        svg.appendChild(_svgvmlObj);
        _isFirst = false;
      }
      if (!this.pen) {
        _svgvmlObj.setAttribute("stroke", "none");
      } else {
        this.pen.updateSVG(_svgvmlObj);
      }
      if (!this.brush) {
        _svgvmlObj.setAttribute("fill", "none");
      } else {
        this.brush.updateSVG(_svgvmlObj, graphics.getDefs());
      }
      _svgvmlObj.setAttribute("d", path);
    } else {
      var vml = graphics.getVML(),
        vmlFill;
      if (_isFirst) {
        vml.appendChild(_svgvmlObj);
        _isFirst = false;
      }
      path = path + " E";
      if (!this.pen) {
        _svgvmlObj.Stroked = "False";
      } else {
        this.pen.updateVML(_svgvmlObj);
      }
      vmlFill = _svgvmlObj.fill;
      if (!this.brush) {
        vmlFill.On = "false";
      } else {
        this.brush.updateVML(vmlFill);
      }
      _svgvmlObj.style.position = "absolute";
      _svgvmlObj.style.width = 1;
      _svgvmlObj.style.height = 1;
      _svgvmlObj.CoordSize = 1 + " " + 1;
      _svgvmlObj.Path = path;
    }
    _svgvmlObj.style.display = "";
    if (_graphics && graphics != _graphics) {
      _graphics.removeShape(this);
    }
    _graphics = graphics;
    _graphics.addShape(this);
  }
  this.remove = remove;
  function remove() {
    if (_graphics) {
      if (!jsDraw2DX._isVML) {
        var svg = _graphics.getSVG();
        svg.removeChild(_svgvmlObj);
      } else {
        var vml = _graphics.getVML();
        vml.removeChild(_svgvmlObj);
      }
      _graphics.removeShape(this);
      _graphics = null;
      _isFirst = true;
    }
  }
  this.show = show;
  function show() {
    _svgvmlObj.style.display = "";
  }
  this.hide = hide;
  function hide() {
    _svgvmlObj.style.display = "none";
  }
}
function jxText(o, p, a, e, j, b) {
  this.point = o;
  this.text = p;
  this.font = null;
  this.pen = null;
  this.brush = null;
  this.angle = 0;
  var g,
    h = true;
  var n;
  if (a) {
    this.font = a;
  }
  if (e) {
    this.pen = e;
  }
  if (j) {
    this.brush = j;
  }
  if (b) {
    this.angle = b;
  }
  if (!jsDraw2DX._isVML) {
    g = document.createElementNS("http://www.w3.org/2000/svg", "text");
  } else {
    g = document.createElement("v:shape");
  }
  this.getType = k;
  function k() {
    return "jxText";
  }
  this.addEventListener = c;
  function c(r, s) {
    if (g.addEventListener) {
      g.addEventListener(r, t, false);
    } else {
      if (g.attachEvent) {
        g.attachEvent("on" + r, t);
      }
    }
    var q = this;
    function t(u) {
      s(u, q);
    }
  }
  this.draw = l;
  function l(B) {
    var F;
    F = B.logicalToPhysicalPoint(this.point);
    var E, A;
    E = F.x;
    A = F.y;
    g.style.display = "none";
    if (!jsDraw2DX._isVML) {
      var w = B.getSVG();
      if (h) {
        w.appendChild(g);
        h = false;
      }
      if (!this.pen) {
        g.setAttribute("stroke", "none");
      } else {
        this.pen.updateSVG(g);
      }
      if (!this.brush) {
        g.setAttribute("fill", "none");
      } else {
        this.brush.updateSVG(g, B.getDefs());
      }
      if (this.font) {
        this.font.updateSVG(g);
      } else {
        jxFont.updateSVG(g);
      }
      g.setAttribute("x", E);
      g.setAttribute("y", A);
      g.setAttribute(
        "transform",
        "rotate(" + this.angle + " " + E + "," + A + ")",
      );
      g.textContent = this.text;
    } else {
      var s = B.getVML(),
        v,
        z,
        u;
      if (h) {
        u = document.createElement("v:textpath");
        u.On = "True";
        u.style["v-text-align"] = "left";
        g.appendChild(u);
        s.appendChild(g);
        h = false;
      }
      v = g.fill;
      u = g.firstChild;
      if (!this.pen) {
        g.Stroked = "False";
      } else {
        this.pen.updateVML(g);
      }
      v = g.fill;
      if (!this.brush) {
        v.On = "false";
      } else {
        this.brush.updateVML(v);
      }
      g.style.position = "absolute";
      g.style.height = 1;
      g.CoordSize = 1 + " " + 1;
      z = g.Path;
      z.TextPathOk = "true";
      z.v = "M" + E + "," + A + " L" + (E + 100) + "," + A + " E";
      u.String = this.text;
      if (this.font) {
        this.font.updateVML(u);
      } else {
        jxFont.updateVML(u);
      }
      g.style.display = "";
      var t, D, q, C;
      q = (g.clientHeight / 2) * 0.8;
      C = this.angle;
      E = Math.round(E + q * Math.sin((C * Math.PI) / 180));
      A = Math.round(A - q * Math.cos((C * Math.PI) / 180));
      t = Math.round(E + Math.cos((C * Math.PI) / 180) * 100);
      D = Math.round(A + Math.sin((C * Math.PI) / 180) * 100);
      g.Path = "M" + E + "," + A + " L" + t + "," + D + " E";
      g.style.width = 1;
    }
    g.style.display = "";
    if (n && B != n) {
      n.removeShape(this);
    }
    n = B;
    n.addShape(this);
  }
  this.remove = d;
  function d() {
    if (n) {
      if (!jsDraw2DX._isVML) {
        var r = n.getSVG();
        r.removeChild(g);
      } else {
        var q = n.getVML();
        q.removeChild(g);
      }
      n.removeShape(this);
      n = null;
      h = true;
    }
  }
  this.show = m;
  function m() {
    g.style.display = "";
  }
  this.hide = f;
  function f() {
    g.style.display = "none";
  }
}
function jxImage(point, url, width, height, angle) {
  this.point = point;
  this.url = url;
  this.width = width;
  this.height = height;
  this.angle = 0;
  var _svgvmlObj,
    _isFirst = true;
  var _graphics;
  if (angle) {
    this.angle = angle;
  }
  if (!jsDraw2DX._isVML) {
    _svgvmlObj = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "image",
    );
  } else {
    _svgvmlObj = document.createElement("v:image");
  }
  this.getType = getType;
  function getType() {
    return "jxImage";
  }
  this.addEventListener = addEventListener;
  function addEventListener(eventName, handler) {
    if (_svgvmlObj.addEventListener) {
      _svgvmlObj.addEventListener(eventName, handlerWrapper, false);
    } else {
      if (_svgvmlObj.attachEvent) {
        _svgvmlObj.attachEvent("on" + eventName, handlerWrapper);
      }
    }
    var currentObj = this;
    function handlerWrapper(evt) {
      handler(evt, currentObj);
    }
  }
  this.draw = draw;
  function draw(graphics) {
    var point, scale;
    point = graphics.logicalToPhysicalPoint(this.point);
    scale = graphics.scale;
    var x, y;
    x = point.x;
    y = point.y;
    _svgvmlObj.style.display = "none";
    if (!jsDraw2DX._isVML) {
      var svg = graphics.getSVG();
      if (_isFirst) {
        svg.appendChild(_svgvmlObj);
        _isFirst = false;
      }
      _svgvmlObj.setAttribute("x", x);
      _svgvmlObj.setAttribute("y", y);
      _svgvmlObj.setAttribute("height", scale * this.height);
      _svgvmlObj.setAttribute("width", scale * this.width);
      _svgvmlObj.setAttribute("preserveAspectRatio", "none");
      _svgvmlObj.setAttributeNS(
        "http://www.w3.org/1999/xlink",
        "href",
        this.url,
      );
      _svgvmlObj.setAttribute(
        "transform",
        "rotate(" + this.angle + " " + x + "," + y + ")",
      );
    } else {
      with (Math) {
        var x1,
          y1,
          ang = this.angle,
          a = (this.angle * PI) / 180,
          w,
          h,
          m1,
          m2,
          m3,
          m4;
        w = scale * this.width;
        h = scale * this.height;
        x1 = x;
        y1 = y;
        if (abs(ang) > 360) {
          ang = ang % 360;
        }
        if (ang < 0) {
          ang = 360 + ang;
        }
        if (ang >= 0 && ang < 90) {
          y1 = y;
          x1 = x - h * sin(a);
        } else {
          if (ang >= 90 && ang < 180) {
            y1 = y - h * sin(a - PI / 2);
            x1 = x - (w * sin(a - PI / 2) + h * cos(a - PI / 2));
          } else {
            if (ang >= 180 && ang < 270) {
              y1 = y - (w * sin(a - PI) + h * cos(a - PI));
              x1 = x - w * cos(a - PI);
            } else {
              if (ang >= 270 && ang <= 360) {
                x1 = x;
                y1 = y - w * cos(a - 1.5 * PI);
              }
            }
          }
        }
        m1 = cos(a);
        m2 = -sin(a);
        m3 = sin(a);
        m4 = cos(a);
      }
      var vml = graphics.getVML(),
        vmlFill;
      if (_isFirst) {
        vml.appendChild(_svgvmlObj);
        _isFirst = false;
      }
      _svgvmlObj.style.width = w;
      _svgvmlObj.style.height = h;
      _svgvmlObj.style.position = "absolute";
      _svgvmlObj.style.top = y1;
      _svgvmlObj.style.left = x1;
      _svgvmlObj.style.filter =
        "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand',M11=" +
        m1 +
        ",M12=" +
        m2 +
        ",M21=" +
        m3 +
        ",M22=" +
        m4 +
        ") filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" +
        url +
        "', sizingMethod='scale');";
    }
    _svgvmlObj.style.display = "";
    if (_graphics && graphics != _graphics) {
      _graphics.removeShape(this);
    }
    _graphics = graphics;
    _graphics.addShape(this);
  }
  this.remove = remove;
  function remove() {
    if (_graphics) {
      if (!jsDraw2DX._isVML) {
        var svg = _graphics.getSVG();
        svg.removeChild(_svgvmlObj);
      } else {
        var vml = _graphics.getVML();
        vml.removeChild(_svgvmlObj);
      }
      _graphics.removeShape(this);
      _graphics = null;
      _isFirst = true;
    }
  }
  this.show = show;
  function show() {
    _svgvmlObj.style.display = "";
  }
  this.hide = hide;
  function hide() {
    _svgvmlObj.style.display = "none";
  }
}
