window.addEventListener("load", async () => {
  resizeAndScale();
  window.dataTracker = await loadDataTrackerjson();
  const jsonArray = JSON.parse(dataTracker.jsonArray);
  window.bj = jsonArray.filter((item) => item[item.length - 1] !== "true");

  const balloonLinkMenu = new BalloonLinkMenu();
  balloonLinkMenu.buildBalloonsUrlTemplate();

  var callsign = getParamSafe("callsign").toUpperCase();
  var balloonid = getParamSafe("balloonid");
  var timeslot = getParamSafe("timeslot");
  var otherRaw = getParamSafe("other");
  var other = otherRaw.toUpperCase();
  var report = getParamSafe("reporters") === "all" ? "" : "uniquereporters=on";

  window.parent.document.title = `${other}-${getParamSafe("SSID")} WSPR`;

  let callsignFinal = callsign;
  if (other.length > 2) {
    callsignFinal = other.replace(",", "");
  }

  // var banda = params.get('banda') || 'All';
  // var SSID = params.get('SSID') || '';
  // var SSIDL = SSID !== '' ? `-${SSID}` : '';

  var qrpid = getParamSafe("qrpid");
  var qp = getParamSafe("qp");
  var tracker = getParamSafe("tracker");
  var fill =
    qrpid || qp === "on" || tracker === "qrplabs" || tracker === "traquito"
      ? ""
      : "&nbsp;";

  let licenciaaprs = "";
  if (otherRaw !== "") {
    var splitOther = otherRaw.split("/");
    licenciaaprs = splitOther[0] || otherRaw;
  } else {
    licenciaaprs = otherRaw;
  }

  var nuevahora = new Date(Date.now() + 600 * 1000);
  var Prox = `Next:<br style='line-height:2px;'>${String(nuevahora.getUTCHours()).padStart(2, "0")}:${String(nuevahora.getUTCMinutes()).padStart(2, "0")}`;

  let tablaheader = `
<tr style='background-color:#ffe6b3;'>
  <td colspan="15" style='font-family: monospace; font-size: 16px;
  margin-right: auto; line-height:16px;white-space:nowrap;'>
  <center><b>
    <span id="linksonde" target="_blank" style='width:15px;height:15px;position:relative;'></span>${fill}
    <a href='https://aprs.fi/#!mt=satellite&call=${licenciaaprs}${SSID}&timerange=604800&tail=604800&z=09' target='aprs' title='aprs.fi track'>
      <img src='${imageSrcUrl["aprs"]}' border=0 alt='aprs.fi track' style='vertical-align:-10%;'>
    </a>${fill}
    <a href='http://amsat.org.ar/wspr.ppt' target='_blank' title='Presentacion WSPR'>
      <img src='${imageSrcUrl["ppt"]}' border=0 alt='Presentacion WSPR' style='vertical-align:-10%;'>
    </a>${fill}
    <a href='http://wsprnet.org' target=_blank><u>WSPRNET</u></a>${fill}
    Band:
    <select name='banda' id='banda' onchange=";document.formu.callsign.value='${callsign}';" style='font-weight:bold;font-size:12px;line.height:12px;height:20px;vertical-align:0%;'>
      <option value='2m'>2m</option>
      <option value='6'>6m</option>
      <option value='10m'>10m</option>
      <option value='12m'>12m</option>
      <option value='15m'>15m</option>
      <option value='17m'>17m</option>
      <option value='20m'>20m</option>
      <option value='30m'>30m</option>
      <option value='40m'>40m</option>
      <option value='80m'>80m</option>
      <option value='160'>160m</option>
      <option value='All' SELECTED>ALL</option>
    </select>&nbsp;
    <span onclick='setlaunch()' id="launched" name=launched title=' Click here to Change or&#13;Enter Launch Date/Time' style='font-size:14px;line-height:14px;font-family:Arial Narrow;cursor:pointer;border:thin solid #555555;border-radius: 10px;'>&nbsp;&nbspLaunch Date/Time (z)&nbsp;&nbsp;</span>&nbsp;
    <span onclick='settracker()' id="settracker" name="settracker" title=' Click here to Set or Change Tracker ${tracker}' style='font-size:14px;line-height:14px;font-family:Arial Narrow;cursor:pointer;border:thin solid #555555;border-radius: 10px;'>&nbsp;T&nbsp;</span>&nbsp;
    <span style='font-family:Arial Narrow;font-size:17px;line-height:17px;'>Balloon Call:</span>
    <input type=text name=other value='${other.toUpperCase().trim()}' onclick='borrarother()' id=other size=8 maxlength=9 style='text-transform:uppercase;font-weight:bold;font-family: monospace;font-size:14px;line-height:14px;text-align:center;height:20px;vertical-align:18%;'>
    <span style='vertical-align:18%;'>-</span>
    <input type=text name=SSID value='${SSID.trim()}' title=' Enter or Change SSID&#13;For aprs.fi from 00-99' onclick='setssid()' id=SSID size=3 maxlength=3 style='font-weight:bold;font-family: monospace;font-size:14px;line-height:14px;text-align:center;height:20px;vertical-align:18%;cursor:pointer;'>
    <b><span id=qrpchn name=qrpchn onclick=""getqrp()"" title=' U4B & &#13;Traquito&#13Channel&#13;---------&#13; Click to&#13 Change' style='position:relative;top:0px;font-size:14px;font-family:Arial Narrow;text-decoration:underline;background-color:#ffffff;' class=button>${qrpid} ?</span>&nbsp;Id:</b>
    <input type=text maxlength=2 value='${balloonid}' size=1 name='balloonid' id='balloonid' title='First (0,1,Q) and third (0-9)&#13character of 2nd TLM packet' style='text-align:center;font-weight:bold;width:24px;text-transform:uppercase;height:20px;vertical-align:18%;'>
    <b>Time-Slot:</b>
    <input type=text maxlength=1 size=1 name='timeslot' id='timeslot' value='${timeslot.replace(",", "", 1, 10)}' title='TLM minute Slot&#13 For  2nd  Packet&#13 Enter: 0 2 4 6 or 8&#13 or Blank for ALL' style='text-align:center;font-weight:bold;height:19px;width:19px;height:20px;vertical-align:18%;'>&nbsp;+Detail
    <input type='checkbox' name='detail' id='detail' onchange='setid()'>
    `;

  let extra = "";

  // Check for qrplabs/telen condition
  if (
    qrpid !== "" ||
    qp === "on" ||
    tracker === "qrplabs" ||
    tracker === "traquito"
  ) {
    tablaheader += `
    <span onclick='showtelen()' title='Display Comment and TELEN #1 Coding' style='font-family:Arial Narrow;'>
      <u>Telen</u>
    </span>
    <input onclick='setid()' type='checkbox' checked name='qp' id='qp'
      title='Mark to see qrplabs&#13 Additional TLMs&#13 (${tracker.toUpperCase()} Decoding Test)'
      style='cursor:pointer;'>
  `;
    extra = "<th></th>";
  }

  // Voltage/Temperature condition
  if (tracker.startsWith("orio") || tracker.startsWith("bss9")) {
    extra = "<td colspan=2>Volt&nbsp;&nbsp;&deg;C&nbsp;</td>";
  }

  // Add OK button and placeholder for recarga span
  tablaheader += `
  <input type="button" onclick="setid()" name="enviar" id="enviar" value="OK" style="font-weight:bold;">
  <span id="recarga" style="font-size:12px;font-weight:bold;">
`;

  // Special case: nu7b with SSID 23
  if (other === "nu7b" && SSID === "23") {
    tablaheader += `
    &nbsp;<a href=${HOST_URL}/dx?por=H&tz=0&be=&multiplecalls=Select&scale=Lin&bs=B&call=x1*&band=14&timelimit=1209600&sel=0&t=m"
    target="_blank"
    style="border-color:cyan;height:27px;border-style:outset;color:navy;line-height:19px;font-size:13px;text-decoration:none;background-color:gold;font-weight:bold;"
    title="The prefix for telem will be X1 followed by the letters BAA to JJJ.&#13The letters A-J correspond to the digits 0-9. To compute the count,&#13subtract 100 from the digits corresponding to the three letter code.">
      &nbsp;<span style="font-size:14px;">&beta;/&gamma;</span> Rad&nbsp;
    </a>
  `;
  }

  tablaheader += `</span></center></td></tr>`;

  document.getElementById("telemetryTableContainer").innerHTML =
    `<table id="telemetryTable" width=100% border=0 cellpadding=0 cellspacing=0 style='font-family: monospace; font-size: 14px; font-weight:bold; line-height: 17px; margin-right: auto; white-space:nowrap;text-align:center;'>
      ${tablaheader}
      <tr style='background-color:#cccccc;font-size:16px;'>
        <th style='width:16%;'>Timestamp (z)</th>
        <th style='width:7%;'>Call</th><th style='width:8%;' title='! = out of Channel boundary&#13 due Spotter rcvr freq. offset&#13 and/or invalid channel set'>MHz</th>
        <th style='width:4%;'>SNR</th><th style='width:4%;cursor:pointer;' title='Measured Freq drift of&#13Balloon in Hz/minute'>Drift</th>
        <th style='width:7%;'>Grid</th><th style='width:5%;'>Pwr</th>
        <th style='width:10%;'>Reporter</th><th style='width:10%;'>RGrid</th>
        <th style='width:10%;'>Km.</th>
        <th style='width:6%;'>Az&deg;</th>
        <th style='width:7%;cursor:pointer' title='Shows Pwr x 300&#13Check 2nd TLM&#13In case Id: is set'>Heig.m</th>
        <th style='width:8%;cursor:pointer;align:right;' align=right title=' This column shows&#13solar elevation angle&#13 If at 12000m. add 3&deg;'>Sun&deg;&nbsp;</th>
        ${extra}
     </tr>`;

  //document.getElementById("Prox").innerHTML = Prox;
  window.proxElementValue = Prox;

  (async () => {
    const url = new URL(window.parent.window.location.href);
    if (![...url.searchParams].length) {
      document
        .getElementById("telemetryTableContainer")
        .insertAdjacentHTML("beforeend", "</table>");
      document.getElementById("telemetryTableLoader").classList.add("hidden");
      document.getElementById("gMapLoader").style.display = "none";
      return;
    }
    const wsprProcessQueryResult = await processWSPRQuery();

    if (wsprProcessQueryResult.error) {
      console.error(
        "Error:",
        wsprProcessQueryResult.message || wsprProcessQueryResult.output,
      );
      document
        .getElementById("telemetryTableContainer")
        .insertAdjacentHTML("beforeend", wsprProcessQueryResult.output);

      document.getElementById("telemetryTableLoader").classList.add("hidden");
      document.getElementById("gMapLoader").style.display = "none";

      return;
    }
    const { pag, cuenta, getURLreporters1 } = wsprProcessQueryResult;

    const telemetry1 = processTelemetry({ pag, cuenta });

    const telemetry2 = await processTelemetry2({
      getURLreporters1,
      ...telemetry1,
    });

    if (telemetry2.error) {
      console.error("Error:", telemetry2.message || telemetry2.output);
      document
        .getElementById("telemetryTableContainer")
        .insertAdjacentHTML(
          "beforeend",
          telemetry2.output ||
            "</table><div><h2 style='color:red;font-size:20px;padding:10px;text-align:center;'>Error processing data telemetry 2.</h2></div>",
        );

      document.getElementById("telemetryTableLoader").classList.add("hidden");
      document.getElementById("gMapLoader").style.display = "none";
      return;
    }
    try {
      document
        .getElementById("telemetryTable")
        .insertAdjacentHTML("beforeend", telemetry2.output);

      document.getElementById("telemetryTableLoader").classList.add("hidden");

      carga();
      ponermapa(mapainicio[0], mapainicio[1]);
    } catch (error) {
      console.error("Error:", error.message);
      document.getElementById("telemetryTableLoader").classList.add("hidden");
      document.getElementById("gMapLoader").style.display = "none";
      document.getElementById("mapDisplayError").style.display = "block";
    }
  })();
});

window.addEventListener("resize", resizeAndScale);
