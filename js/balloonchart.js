var x;
var y;
var element;
var being_dragged = false;
var Vuelo = window.getParamSafe("Vuelo");
var callsign = window.getParamSafe("callsign");

// change Height title by search params selected
window.parent.window.document.title = `${callsign} Balloon Height M Chart from EOSS & Findu`;

function mouser(event) {
  if (event.offsetX || event.offsetY) {
    x = event.clientX - 90;
    y = event.clientY - 50;
  } else {
    x = event.pageX;
    y = event.pageY;
  }
  if (being_dragged == true) {
    document.getElementById(element).style.left = x + "px";
    document.getElementById(element).style.top = y + "px";
  }
}
function mouse_down(ele_name) {
  being_dragged = true;
  element = ele_name;
  document.getElementById(element).style.cursor = "move";
}
function mouse_up() {
  being_dragged = false;
  document.getElementById(element).style.top = y + "px";
  document.getElementById(element).style.left = x + "px";
  document.getElementById(element).style.cursor = "auto";
}
function letsgo(wheretogo) {
  var flights = "";
  if (document.showgraph.flights.checked) {
    var flights = "&flights=1";
  }
  var nowgo =
    "balloonchart?callsign=" +
    callsign +
    "&grafico=" +
    wheretogo +
    flights +
    "&Vuelo=" +
    Vuelo;
  document.location.href = nowgo;
}
function map(wheretogo) {
  var flights = "";
  if (document.showgraph.flights.checked) {
    var flights = "&flights=1";
  }

  if ("<%=ucase(left(callsign,1))%>" != "L")
    if ("<%=ssavempointer%>" > 1) {
      var nowgo = "vor?callsign=" + wheretogo + flights + "&Vuelo=" + Vuelo;
    } else {
      var nowgo = "vor?callsign=" + wheretogo + flights + "&Vuelo=" + Vuelo;
    }
  else {
    var nowgo = "vor?callsign=" + wheretogo + flights + "&Vuelo=" + Vuelo;
  }
  document.location.href = nowgo;
}
function loadPageVar(sVar) {
  return unescape(
    window.parent.window.location.search.replace(
      new RegExp(
        "^(?:.*[&\\?]" +
          escape(sVar).replace(/[\.\+\*]/g, "\\$&") +
          "(?:\\=([^&]*))?)?.*$",
        "i",
      ),
      "$1",
    ),
  );
}
function markbutton() {
  if (loadPageVar("grafico") != "") {
    var grafico = loadPageVar("grafico");
  } else {
    var grafico = "Height f";
  }
  for (t = 0; t < 8; t++) {
    if (document.showgraph[t].value.toUpperCase() == grafico.toUpperCase()) {
      document.showgraph[t].style.textDecoration = "underline";
      document.showgraph[t].style.fontWeight = "bold";
    }
  }
}
