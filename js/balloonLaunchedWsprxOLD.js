window.addEventListener("load", () => {
  var callsign = getParamSafe("callsign").toUpperCase();
  var balloonid = getParamSafe("balloonid");
  var timeslot = getParamSafe("timeslot");
  var otherRaw = getParamSafe("other");
  var other = otherRaw.toUpperCase();
  var report = getParamSafe("reporters") === "all" ? "" : "uniquereporters=on";

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
    <select name='banda' id='banda' onchange="document.formu.reporters.value='';document.formu.callsign.value='${callsign}';this.form.submit();" style='font-weight:bold;font-size:12px;line.height:12px;height:20px;vertical-align:0%;'>
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
    <span onclick='setlaunch()' id="launched" name=launched title=' Click here to Change or&#13Enter Launch Date/Time' style='font-size:14px;line-height:14px;font-family:Arial Narrow;cursor:pointer;border:thin solid #555555;border-radius: 10px;'>&nbsp;&nbspLaunch Date/Time (z)&nbsp;&nbsp;</span>&nbsp;
    <span onclick='settracker()' id="settracker" name="settracker" title=' Click here to Set or Change Tracker ${tracker}' style='font-size:14px;line-height:14px;font-family:Arial Narrow;cursor:pointer;border:thin solid #555555;border-radius: 10px;'>&nbsp;T&nbsp;</span>&nbsp;
    <span style='font-family:Arial Narrow;font-size:17px;line-height:17px;'>Balloon Call:</span>
    <input type=text name=other value='${other.toUpperCase().trim()}' onclick='borrarother()' id=other size=8 maxlength=9 style='text-transform:uppercase;font-weight:bold;font-family: monospace;font-size:14px;line-height:14px;text-align:center;height:20px;vertical-align:18%;'>
    <span style='vertical-align:18%;'>-</span>
    <input type=text name=SSID value='${SSID.trim()}' title=' Enter or Change SSID&#13For aprs.fi from 00-99' onclick='setssid()' id=SSID size=3 maxlength=3 style='font-weight:bold;font-family: monospace;font-size:14px;line-height:14px;text-align:center;height:20px;vertical-align:18%;cursor:pointer;'>
    <b><span id=qrpchn name=qrpchn onclick=""getqrp()"" title=' U4B & &#13Traquito&#13Channel&#13---------&#13 Click to&#13 Change' style='position:relative;top:0px;font-size:14px;font-family:Arial Narrow;text-decoration:underline;background-color:#ffffff;' class=button>${qrpid} ?</span>&nbsp;Id:</b>
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
    &nbsp;<a href="http://lu7aa.org/dx.asp?por=H&tz=0&be=&multiplecalls=Select&scale=Lin&bs=B&call=x1*&band=14&timelimit=1209600&sel=0&t=m"
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

  // let timeLimit = "1209600";
  // if (other.toUpperCase() === "LU1KCQ" || other.toUpperCase() === "G7PMO") {
  //   timeLimit = "604800";
  // }
  // banda logic default override

  (async () => {
    // Helper functions for ASP-like functionality
    function ucase(str) {
      return str ? str.toString().toUpperCase() : "";
    }

    function left(str, length) {
      return str.toString().substring(0, length);
    }

    function right(str, length) {
      return str.toString().slice(-length);
    }

    function mid(str, start, length) {
      return str.toString().substr(start - 1, length);
    }

    function trim(str) {
      return str ? str.toString().trim() : "";
    }

    function split(str, delimiter, limit = -1, compareType = 0) {
      if (!str) return [];
      let parts = str.split(delimiter);
      if (limit > 0 && parts.length > limit) {
        parts = parts.slice(0, limit);
      }
      return parts;
    }

    function ubound(arr) {
      return arr ? arr.length - 1 : -1;
    }

    function isNumeric(value) {
      return !isNaN(parseFloat(value)) && isFinite(value);
    }

    // Helper function to get character code (ASP chr equivalent)
    function chr(code) {
      return String.fromCharCode(code);
    }

    // Mock functions for xsnr and or1 - you'll need to implement these based on your logic
    function xsnr(dbm) {
      return window.xsnr[dbm] || 0;
    }

    function or1(dbm) {
      return window.or1[dbm] || 0;
    }

    function lcase(str) {
      return str ? str.toString().toLowerCase() : "";
    }

    function replace(
      str,
      find,
      replaceWith,
      start = 1,
      count = -1,
      compareType = 0,
    ) {
      if (!str) return "";
      let result = str.toString();
      if (count === -1) {
        // Replace all occurrences
        result = result.split(find).join(replaceWith);
      } else {
        // Replace limited occurrences
        let replaceCount = 0;
        let index = result.indexOf(find);
        while (index !== -1 && replaceCount < count) {
          result =
            result.substring(0, index) +
            replaceWith +
            result.substring(index + find.length);
          replaceCount++;
          index = result.indexOf(find, index + replaceWith.length);
        }
      }
      return result;
    }

    // Date manipulation functions
    function dateAdd(interval, number, date) {
      const result = new Date(date);
      switch (interval.toLowerCase()) {
        case "d":
          result.setDate(result.getDate() + number);
          break;
        case "m":
          result.setMonth(result.getMonth() + number);
          break;
        case "y":
          result.setFullYear(result.getFullYear() + number);
          break;
        case "n": // minutes
          result.setMinutes(result.getMinutes() + number);
          break;
        case "h": // hours
          result.setHours(result.getHours() + number);
          break;
        case "d": // days
          result.setDate(result.getDate() + number);
          break;
        case "yyyy": // years
          result.setFullYear(result.getFullYear() + number);
          break;
      }
      return result;
    }
    function dateDiff(unit, date1, date2) {
      const diffTime = Math.abs(date2 - date1);
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

      if (unit === "h") {
        return diffHours;
      }
      // Add other units as needed
      return 0;
    }
    function formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    function formatDateTime(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    function formatDateTimeFormat(date, format) {
      switch (format) {
        case 4: // Time format HH:MM
          return (
            date.getHours().toString().padStart(2, "0") +
            ":" +
            date.getMinutes().toString().padStart(2, "0")
          );
        case 1: // General date format
          return date.toLocaleString();
        case 2: // Short date format
          return date.toLocaleDateString();
        case 3: // Long date format
          return date.toDateString();
        // Add more formats as needed
        default:
          return date.toString();
      }
    }

    function dateDiffMinutes(date1, date2) {
      const d1 = new Date(date1);
      const d2 = new Date(date2);
      return Math.floor((d2 - d1) / (1000 * 60)); // Convert milliseconds to minutes
    }

    // Helper function to convert date string to Date object (equivalent to cDate)
    function cDate(dateString) {
      try {
        return new Date(dateString);
      } catch (error) {
        return new Date(); // Return current date on error
      }
    }

    function isDate(str) {
      if (typeof str !== "string") return false;
      const shortStr = str.slice(0, 16);
      const date = new Date(shortStr);
      return !isNaN(date.getTime());
    }

    function putsun(fecha, locator) {
      const radian = 57.29577951308;
      let sunelevation = "&nbsp;";
      if (locator.length > 3) {
        sunelevation =
          (
            SunCalc.getPosition(
              new Date(fecha + "Z"),
              loc2latlon(locator).loclat,
              loc2latlon(locator).loclon,
            ).altitude * radian
          ).toFixed(1) + "&nbsp;";
      }
      return sunelevation;
    }

    function decowspr(
      diahora,
      lcall,
      lloc,
      ldbm,
      reporter,
      rgrid,
      km,
      az,
      options = {},
    ) {
      // Default example values (equivalent to ASP's default assignment)
      lcall = lcall || "030QRY";
      lloc = lloc || "HK52";
      ldbm = ldbm || 23;

      // Extract characters from call sign and location
      const E5 = lcall.charAt(0);
      const F5 = lcall.charAt(1);
      const G5 = lcall.charAt(2);
      const H5 = lcall.charAt(3);
      const I5 = lcall.charAt(4);
      const J5 = lcall.charAt(5);

      const E7 = lloc.charAt(0);
      const F7 = lloc.charAt(1);
      const G7 = lloc.charAt(2);
      const H7 = lloc.charAt(3);

      const D5 = ldbm;

      // Determine multiplier based on first character
      let multi = 0;
      if (E5 === "0") multi = 0;
      if (E5 === "1") multi = 10;
      if (E5 === "Q") multi = 20;

      // Calculate channel
      let wchan = multi + parseInt(G5) || 0;

      // Check tracker type (simulated for browser environment)
      const tracker = getParamSafe("tracker");
      const qp = getParamSafe("qp");
      const timeslot = getParamSafe("timeslot");

      // Global variables that would need to be passed in or defined elsewhere

      const thora = options.thora || 0;
      const tgrid = options.tgrid || 0;
      const taltura = options.taltura || 0;

      let decoqr = options.decoqr || "";
      let decoqr1 = options.decoqr1 || "";
      let decoqrf = options.decoqrf || "";

      if (
        tracker.toUpperCase() !== "QRPLABS" &&
        tracker.toUpperCase() !== "TRAQUITO"
      ) {
        // Battery calculation

        if (tracker.toLowerCase() !== "ab5ss") {
          wbat =
            ((H5.charCodeAt(0) - "A".charCodeAt(0) + 32) / 10).toFixed(1) + "V";
          wspeed = Math.round(
            ((H5.charCodeAt(0) - "A".charCodeAt(0)) / 1) * 5 * 1.852,
          );
        } else {
          wspeed = Math.round(
            ((H5.charCodeAt(0) - "A".charCodeAt(0)) / 1) * 5 * 1.852,
          );
          wbat =
            ((H5.charCodeAt(0) - "A".charCodeAt(0) + 32) / 10).toFixed(1) + "V";
        }

        if (
          tracker.toLowerCase() === "ab5ss" ||
          tracker.toLowerCase() === "wb8elk"
        ) {
          wbat = (H5.charCodeAt(0) - "A".charCodeAt(0) + 32) / 10;
        }

        // Satellite Status
        let V28;
        if (F5.charCodeAt(0) - "0".charCodeAt(0) > 9) {
          V28 = String.fromCharCode(
            ((F5.charCodeAt(0) - 7) % 3) + "0".charCodeAt(0),
          );
        } else {
          V28 = String.fromCharCode((F5.charCodeAt(0) % 3) + "0".charCodeAt(0));
        }

        let wsats;
        if (V28 === "0") wsats = "NoF";
        if (V28 === "1") wsats = "4-8";
        if (V28 === "2") wsats = "> 8";

        // Temperature

        if (F5.charCodeAt(0) - "0".charCodeAt(0) > 9) {
          window.wtemp =
            Math.floor((F5.charCodeAt(0) - V28.charCodeAt(0) - 7) / 3) * 5 - 30;
        } else {
          window.wtemp = String.fromCharCode(
            (F5.charCodeAt(0) % 3) + "0".charCodeAt(0),
          );
        }

        // Delta altura calculation
        let deltaaltura = Math.round((D5 * 18.1132) / 10) * 10;

        // Search in tablahoras
        for (let u = 0; u < options.tablahoras.length; u++) {
          if (
            options.tablahoras[u] &&
            options.tablahoras[u] &&
            options.tablahoras[u][0] === diahora
          ) {
            deltaaltura = deltaaltura + (options.tablahoras[u][1] || 0);
            break;
          }
        }

        const actualdate = diahora.substring(0, 15);
        window.newloc = "";

        // Search in tablam
        for (let k = 3; k < options.tablam.length; k++) {
          if (
            options.tele1[k] &&
            actualdate === (options.tele1[k][thora] || "").substring(0, 15)
          ) {
            newloc = tele1[k + 1] ? options.tele1[k + 1][tgrid] : "";
            deltaaltura += options.tele1[k][taltura] || 0;
          }
          if (newloc !== "") break;
        }

        if (wchan < 10) wchan = "0" + wchan;
        window.walt = deltaaltura;
        const K6 = I5;
        const N6 = J5;

        let agregado = "&nbsp;";
        if (lloc.length > 3 && (wsats === "4-8" || wsats === "> 8")) {
          agregado = `${putsun(`${diahora}`, `${lloc}${I5}${J5}`)}`;
        }

        const wgps = ""; // This wasn't clearly defined in the original code for this branch

        return `<tr style="line-height:11px;"><td colspan=1>${diahora}</td><td>${lcall}&nbsp;${lloc}&nbsp;${String(ldbm).padStart(2)}</td><td>${lloc}${I5}${J5}</td><td>${String(window.wtemp).padStart(5).replace(/ /g, "&nbsp;")}&#176;C&nbsp;&nbsp;</td><td>${wbat}</td><td>${String(wspeed).padStart(3).replace(/ /g, "&nbsp;")}</td><td>${wgps}&nbsp;${wsats}&nbsp;</td><td>${reporter}</td><td>${rgrid}</td><td>${km}</td><td>${az}</td><td>${deltaaltura}</td><td align=right>${agregado}</td></tr>`;
      } else {
        // QRPLABS/TRAQUITO branch
        // Complex calculation for I7
        const I7 =
          (E7.charCodeAt(0) - "A".charCodeAt(0)) * 18 * 10 * 10 * 19 +
          (F7.charCodeAt(0) - "A".charCodeAt(0)) * 10 * 10 * 19 +
          parseInt(G7) * 10 * 19 +
          parseInt(H7) * 19 +
          (window.dic[D5] || 0);

        const J7 = Math.floor(I7 / (40 * 42 * 2 * 2));
        const J8 = J7 * 2 + 457;
        let J9 = (5 * J8) / 1024;

        if (J9 > 3) J9 = J9 - 0.85;
        let J10 = 100 * (J9 - 2) - 73;

        if (J10 < -45) J10 = -28 - J10;
        window.wtemp = Math.round(J10 + 2);

        // L5 calculation
        let L5;
        if (!isNaN(F5)) {
          L5 =
            26 * 26 * 26 * (F5.charCodeAt(0) - "0".charCodeAt(0)) +
            26 * 26 * (H5.charCodeAt(0) - "A".charCodeAt(0)) +
            26 * (I5.charCodeAt(0) - "A".charCodeAt(0)) +
            (J5.charCodeAt(0) - "A".charCodeAt(0));
        } else {
          L5 =
            26 * 26 * 26 * (10 + F5.charCodeAt(0) - "A".charCodeAt(0)) +
            26 * 26 * (H5.charCodeAt(0) - "A".charCodeAt(0)) +
            26 * (I5.charCodeAt(0) - "A".charCodeAt(0)) +
            (J5.charCodeAt(0) - "A".charCodeAt(0));
        }

        const I6 = L5;
        const resul = E5 === "Q" ? 10 : 0;
        const K5 = G5.charCodeAt(0) + resul;

        const J6 = Math.floor(I6 / (24 * 1068));
        const L6 = I6 - J6 * (24 * 1068);
        const L7 = I7 - J7 * (40 * 42 * 2 * 2);
        const M6 = Math.floor(L6 / 1068);
        const K6 = String.fromCharCode(J6 + "A".charCodeAt(0));
        const N6 = String.fromCharCode(M6 + "A".charCodeAt(0));
        const M7 = Math.floor(L7 / (42 * 2 * 2));
        const M8 = M7 * 10 + 614;

        // Battery voltage calculation
        const wb = 3.0 + Math.floor((M7 + 20) % 40) * 0.05;
        const wbat = wb.toFixed(2);

        const O6 = L6 - M6 * 1068;
        const P6 = O6 * 20;
        window.walt = P6;

        const O7 = L7 - M7 * 42 * 2 * 2;
        const P7 = Math.floor(O7 / (2 * 2));
        const Q7 = P7 * 2;
        const R7 = O7 - P7 * 2 * 2;

        window.wspeed = Q7;
        wspeed = Math.round((wspeed * 60 * 60) / 1000 / 1.852);
        if (wspeed < 84) wspeed = wspeed + 84;

        const S7 = Math.floor(R7 / 2);
        let wgps = S7;
        const T7 = R7 % 2;

        // Force GPS valid (as per original code comment)
        const S7_fixed = 1;
        const T7_fixed = 1;

        if (S7_fixed === 1 && T7_fixed === 0) {
          wgps = 0;
        } else {
          wgps = 1;
        }

        let walt1;
        if (S7_fixed === 1 && T7_fixed === 0) {
          wsats = "NOF";
          walt1 = " ";
        } else {
          wsats = "4-8";
          walt1 = walt;
        }

        if (wchan < 10) wchan = "0" + wchan;

        // Time calculation for search
        let buscohora;
        if (timeslot.trim() !== "") {
          buscohora = diahora.substring(0, 15);
        } else {
          // This would need a proper date manipulation library in a real implementation
          // For now, simplified version
          buscohora = diahora.substring(0, 15);
        }

        const actualdate = buscohora;
        window.newloc = "";

        // Search in tablam
        for (let k = 3; k < options.tablam.length; k++) {
          if (
            options.tele1[k] &&
            actualdate === (options.tele1[k][thora] || "").substring(0, 15)
          ) {
            newloc = options.tele1[k][tgrid] || "";
          }
          if (newloc !== "") break;
        }

        let agregado = "&nbsp;";
        if (newloc.length > 3) {
          agregado = `${putsun(`${diahora}`, `${newloc}${K6}${N6}`)}`;
        }

        // QP processing
        if (qp) {
          const dig2 = diahora.charAt(14);
          let colori, colorf;

          if (["1", "3", "5", "7", "9"].includes(dig2)) {
            colori = "<span class='narrow' style='color:gray;'>";
            colorf = "</span>";
            if (decoqr1 !== "" && decoqr1.length > 7 && decoqr1.length < 20) {
              decoqr1 = decoqr1 + "<br>" + decoqr;
            }
          } else {
            colori = "<span class='narrow' style='color:black;'>";
            colorf = "</span>";
            if (decoqr1 === "" && decoqr1.length > 7 && decoqr1.length < 20) {
              decoqr1 = decoqr;
            }
          }
          decoqr = colori + decoqr + colorf;
        } else {
          decoqr = "";
        }

        const retorno = `<tr style="line-height:11px;"><td colspan=1>${diahora}</td><td>${lcall}&nbsp;${lloc}&nbsp;${String(ldbm).padStart(2)}</td><td>${newloc.substring(0, 4)}${K6}${N6}</td><td>${String(window.wtemp).padStart(5).replace(/ /g, "&nbsp;")}&#176;C</td><td>${wbat}V</td><td>${String(wspeed).padStart(3).replace(/ /g, "&nbsp;")}</td><td>${wgps}&nbsp;${wsats}</td><td>${reporter}</td><td>${rgrid}</td><td>${km}</td><td>${az}</td><td>${String(walt1).padStart(5).replace(/ /g, "&nbsp;")}</td><td align=right>${agregado}</td><td style='font-family:Arial Narrow;text-align:left;'>${decoqr}</td></tr>`;

        if (decoqrf === "" && decoqr.length > 61) {
          decoqrf =
            "T# " +
            decoqr
              .replace(/<span class='narrow' style='color:gray;'>/g, "")
              .replace(/<\/span>/g, "")
              .replace(/<span class='narrow' style='color:black;'>/g, "")
              .replace(/\r\n/g, "")
              .trim();
        }

        return retorno;
      }
    }

    function decoqrp(diahora, lcall, lloc, ldbm) {
      try {
        // Extract location components
        const E7 = asc(mid(lloc, 1, 1)) - 65;
        const F7 = asc(mid(lloc, 2, 1)) - 65;
        const G7 = asc(mid(lloc, 3, 1)) - 48;
        const H7 = asc(mid(lloc, 4, 1)) - 48;

        // Extract call sign components
        const F5A = mid(lcall, 2, 1);
        const H5A = mid(lcall, 4, 1);
        const I5A = mid(lcall, 5, 1);
        const J5A = mid(lcall, 6, 1);

        // Convert call sign components to numbers
        let F5, H5, I5, J5;

        if (isNumeric(F5A)) {
          F5 = parseInt(F5A);
        } else {
          F5 = asc(F5A) - 55;
        }

        if (isNumeric(H5A)) {
          H5 = parseInt(H5A);
        } else {
          H5 = asc(H5A) - 65;
        }

        if (isNumeric(I5A)) {
          I5 = parseInt(I5A);
        } else {
          I5 = asc(I5A) - 65;
        }

        if (isNumeric(J5A)) {
          J5 = parseInt(J5A);
        } else {
          J5 = asc(J5A) - 65;
        }

        // Calculate first part (equivalent to the first calculation)
        const firstPart =
          (F5 * 26 * 26 * 26 + H5 * 26 * 26 + I5 * 26 + J5) % 632736;

        // Calculate second part (equivalent to the second calculation)
        const dicValue = window.dic[parseInt(ldbm)] || 0; // Replace with actual dictionary lookup
        const secondPart =
          Math.floor(
            (E7 * 18 * 10 * 10 * 19 +
              F7 * 10 * 10 * 19 +
              G7 * 10 * 19 +
              H7 * 19 +
              dicValue) /
              4,
          ) % 158184;

        // Format and return result
        return (
          rightPad(firstPart.toString(), 6) +
          " " +
          rightPad(secondPart.toString(), 6)
        );
      } catch (error) {
        console.error("Error in decoqrp:", error);
        return ""; // Return empty string on error (equivalent to VB's error handling)
      }
    }

    async function getPageResponse(url) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const text = await response.text();
          return {
            statusCode: response.status,
            content: text,
          };
        }

        return {
          statusCode: response.status,
          message: response.statusText,
        };
      } catch (error) {
        console.log(error);
        return {
          statusCode: 500,
          message: error,
        };
      }
    }

    async function getReportersTelemetry2(getURLreporters1, balloonid) {
      let pag1 = "";
      if (balloonid !== "") {
        let response = await getPageResponse(getURLreporters1);
        if (response.statusCode === 200) {
          pag1 = response.content;
        } else {
          alert("Error: " + response.message);
          pag1 = "";
        }
      }

      // Retry logic for balloon data
      if ((pag1.length < 20 || pag1 === "") && balloonid !== "") {
        let response = await getPageResponse(getURLreporters1);
        if (response.statusCode === 200) {
          pag1 = response.content;
          if ((pag1.length < 20 || pag1 === "") && other !== "") {
            response = await getPageResponse(getURLreporters1);
            if (response.statusCode === 200) {
              pag1 = response.content;
            } else {
              alert("Error: " + response.message);
              pag1 = "";
            }
          }
        } else {
          alert("Error: " + response.message);
          pag1 = "";
        }
      }

      return pag1;
    }

    // Main WSPR query processing function
    async function processWSPRQuery() {
      let output = "";
      let timeLimit = "1209600"; // 1209600 604800 CHECK THIS
      const launchdate = window.getLaunchDate();
      const balloonid = getParamSafe("balloonid");
      const callsign = getParamSafe("other").toUpperCase();

      // Check for special cases
      let other = getParamSafe("other");
      if (ucase(other) === "LU1KCQ" || ucase(other) === "G7PMO") {
        // CHECK THIS IS NEEDED
        timeLimit = "604800";
      }

      let banda = "14";
      let bandasearch = "All";

      // Process band selection
      for (let g = 0; g <= ubound(window.tbanda); g++) {
        if (ucase(getParamSafe("banda")) === ucase(window.tbanda[g].label)) {
          bandasearch = window.tbanda[g].band;
        }
      }

      let cuenta = 700;
      let count = 5000;
      timeLimit = "604800";

      if (getParamSafe("detail") !== "") {
        cuenta = 800;
      }

      if (bandasearch !== "All") {
        bandasearch = " band = " + bandasearch + " and ";
      } else {
        bandasearch = "";
      }

      let callsignm;
      if (callsign === "") {
        callsignm = "XYZ123";
      } else {
        callsignm = ucase(other);
      }

      // Calculate dates
      let finicio = dateAdd("d", -7, new Date());
      let fim = [
        finicio.getMonth() + 1,
        finicio.getDate(),
        finicio.getFullYear(),
      ];
      let filive =
        fim[2] + "-" + right("00" + fim[0], 2) + "-" + right("00" + fim[1], 2);

      if (launchdate !== "") {
        filive = left(trim(launchdate), 19);
      }
      console.log("filive:", filive);
      let filive2 = filive;

      try {
        let finicio2d = dateAdd("d", -3, new Date(left(trim(launchdate), 19)));
        filive2 =
          finicio2d.getFullYear() +
          "-" +
          right("00" + (finicio2d.getMonth() + 1), 2) +
          "-" +
          right("00" + finicio2d.getDate(), 2) +
          " 00:00:00";
      } catch (error) {
        // Error handling
        console.warn("Date processing error:", error);
      }

      let now = new Date();
      let futureDate = dateAdd("d", 2, now);
      let filast =
        futureDate.getFullYear() +
        "-" +
        right("00" + (futureDate.getMonth() + 1), 2) +
        "-" +
        right("00" + futureDate.getDate(), 2);

      let limit = getParamSafe("limit");
      if (limit !== "") {
        filast =
          left(limit, 4) + "-" + mid(limit, 5, 2) + "-" + mid(limit, 7, 2);
      }

      // Frequency search logic
      let frecsearch = "";
      let tracker = getParamSafe("tracker");
      let wide = getParamSafe("wide");

      if (tracker === "qrplabs" || tracker === "traquito") {
        if (wide !== "on") {
          frecsearch =
            " and frequency > " +
            (window.fcentral - 25) +
            " and frequency < " +
            (window.fcentral + 25) +
            " ";
        } else {
          frecsearch =
            " and frequency > " +
            Math.floor(window.fcentral / 1000) * 1000 +
            " and frequency < " +
            (Math.floor(window.fcentral / 1000) * 1000 + 200) +
            " ";
        }

        if (wide !== "") {
          frecsearch =
            " and frequency > " +
            (Math.floor(window.fcentral / 1000) * 1000 - 25) +
            " and frequency < " +
            (Math.floor(window.fcentral / 1000) * 1000 + 225) +
            " ";
        }
      }

      // Build URL queries
      let getURLreporters;
      let detail = getParamSafe("detail");

      if (detail === "on") {
        getURLreporters =
          "https://db1.wspr.live/?query=select time,tx_sign,frequency,snr,drift,tx_loc,power,rx_sign,rx_loc,distance,azimuth,code from rx where " +
          bandasearch +
          " time >= '" +
          filive +
          "' and time <= '" +
          filast +
          " 23:59:59' and ( ( tx_sign = '" +
          callsignm +
          "' ) ) order by time desc LIMIT 3000";
      } else {
        getURLreporters =
          "https://db1.wspr.live/?query=select time,any(tx_sign),cast(avg(frequency) AS DECIMAL(8,0)),max(snr),any(drift),any(tx_loc),any(power),any(rx_sign),max(rx_loc),max(distance),max(azimuth),any(code) from rx where " +
          bandasearch +
          " time >= '" +
          filive +
          "' and time <= '" +
          filast +
          " 23:59:59' and ( ( tx_sign = '" +
          callsignm +
          "' ) ) group by time order by time desc LIMIT 3000";
      }

      // Initialize page data
      let pag = "";
      // let pag1 = "";

      if (other !== "") {
        let response = await getPageResponse(getURLreporters);
        if (response.statusCode === 200) {
          pag = response.content;
        } else {
          alert("Error: " + response.message);
          pag = "";
        }
      }

      // Handle no data case
      if (pag.length < 10 && other !== "") {
        return {
          error: true,
          output: `</table><center><br><a href='http://lu7aa.org/wsprx.asp' title='Go Back' target='self' style='background-color:lightblue;'><b><i><u>&nbsp;There are no WSPR reports for ${ucase(other)}&nbsp;starting on ${launchdate}z&nbsp;<u></i></b></a><br><br></center>`,
        };
      }

      // Retry logic for failed requests
      if ((pag.length < 20 || pag === "") && other !== "") {
        // Retry attempts would go here

        let response = await getPageResponse(getURLreporters);
        if (response.statusCode === 200) {
          pag = response.content;
          if ((pag.length < 20 || pag === "") && other !== "") {
            response = await getPageResponse(getURLreporters);
            if (response.statusCode === 200) {
              pag = response.content;
            } else {
              alert("Error: " + response.message);
              pag = "";
            }
          }
        } else {
          alert("Error: " + response.message);
          pag = "";
        }
      }

      let getURLreporters1;
      // Balloon ID processing
      if (balloonid !== "") {
        let balid = left(balloonid, 1) + "_" + right(balloonid, 1) + "*";
        let balloonidParam = getParamSafe("balloonid");

        if (balloonidParam !== "" && detail === "on") {
          getURLreporters1 =
            "https://db1.wspr.live/?query=select time,tx_sign,frequency,snr,drift,tx_loc,power,rx_sign,rx_loc,distance,azimuth,code from rx where" +
            bandasearch +
            " time > '" +
            filive2 +
            "' and time <= '" +
            filast +
            " 23:59:59' and ( ( SUBSTRING(tx_sign, 1, 1)  = '" +
            ucase(left(balloonid, 1)) +
            "' and SUBSTRING(tx_sign, 3, 1) = '" +
            right(balloonid, 1) +
            "'  ) ) " +
            frecsearch +
            " order by time desc LIMIT 5000";
        } else {
          getURLreporters1 =
            "https://db1.wspr.live/?query=select time,any(tx_sign),cast(avg(frequency) AS DECIMAL(8,0)),max(snr),min(drift),any(tx_loc),min(power),any(rx_sign),max(rx_loc),max(distance),max(azimuth),any(code) from rx where" +
            bandasearch +
            " time > '" +
            filive2 +
            "' and time <= '" +
            filast +
            " 23:59:59' and ( ( SUBSTRING(tx_sign, 1, 1)  = '" +
            ucase(left(balloonid, 1)) +
            "' and SUBSTRING(tx_sign, 3, 1) = '" +
            right(balloonid, 1) +
            "'  ) ) " +
            frecsearch +
            " group by time order by time desc LIMIT 5000";
        }
        /*
            if (balloonid !== "") {
                let response = await getPageResponse(getURLreporters1);
                if (response.statusCode === 200) {
              pag1 = response.content;
                } else {
              alert("Error: " + response.message);
              pag1 = "";
                }
            }

            // Retry logic for balloon data
            if ((pag1.length < 20 || pag1 === "") && balloonid !== "") {
                let response = await getPageResponse(getURLreporters1);
                if (response.statusCode === 200) {
              pag1 = response.content;
              if ((pag1.length < 20 || pag1 === "") && other !== "") {
                  response = await getPageResponse(getURLreporters1);
                  if (response.statusCode === 200) {
                pag1 = response.content;
                  } else {
                alert("Error: " + response.message);
                pag1 = "";
                  }
              }
                } else {
              alert("Error: " + response.message);
              pag1 = "";
                }
            }
             */
      }

      let posicion = 1;

      if (pag.length < 20) {
        return {
          error: true,
          output: "</table>",
        };
      }

      return {
        error: false,
        pag: pag.trim(),
        //pag1: pag1.trim(),
        getURLreporters: getURLreporters,
        getURLreporters1: balloonid !== "" ? getURLreporters1 : "",
        filive: filive,
        filive2: filive2,
        filast: filast,
        callsignm: callsignm,
        frecsearch: frecsearch,
        bandasearch: bandasearch,
        output: output,
        posicion: posicion,
        cuenta,
      };
    }

    async function processTelemetryData({
      pag,
      getURLreporters1,
      output,
      cuenta,
    }) {
      // Initialize arrays
      let tablam = new Array(3000);
      let tablax = split(pag, chr(10), 3000, 1);
      let punt = Array(3002)
        .fill("")
        .map(() => Array(7).fill(""));
      let licentab = new Array(450);
      let distakm = new Array(85).fill(0);
      let tablahoras = Array(3002)
        .fill("")
        .map(() => Array(4).fill(""));
      let tele1 = Array(3002)
        .fill("")
        .map(() => Array(13).fill(""));

      let posicion = 1;
      let puntpointer = 0;
      let summhz = 0;
      let countmhz = 0;
      let haylista = false;
      let savealtu = 0;
      let savealtur = 0;
      let alturasave = 0;
      let last = 0;
      let locatorlast = "";
      let locatoro = "";
      let locator = "";
      let locatora = "";
      let snr = "";
      let vorlocsave = "";
      let altura = 0;
      let licencia = "";
      let horaoriginal = "";
      let fechahora2 = "";
      let ttipo = 0;
      let thora = 1;
      let tcall = 2;
      let tmhz = 3;
      let tsnr = 4;
      let tdrift = 5;
      let tgrid = 6;
      let tpwr = 7;
      let treporter = 8;
      let trgrid = 9;
      let tkm = 10;
      let taz = 11;
      let taltura = 12;
      let daysBack = -15;
      let spots = 0;

      let licenciao = "";
      let power = "";
      let i = 0;

      let decoqr = "";
      let decoqr1 = "";
      let decoqrf = "";

      let char1 = "";
      let char2 = "";

      let hora0 = "";
      let punto = [];
      let puntos = [];

      let mapainicio = [];

      // Initialize first element
      if (ubound(tablax) > 0) {
        tablam[0] = tablax[1];
      }

      // Get timeslot parameter
      let timeslot = getParamSafe("timeslot");
      let tlmchar = "";
      if (trim(timeslot) !== "") {
        tlmchar = right((8 + parseInt(timeslot)).toString(), 1);
      }

      // Get tracker parameter
      let tracker = getParamSafe("tracker");
      let tlmchar1 = tlmchar;
      if (
        (tracker === "zachtek1" || tracker === "6locators") &&
        trim(timeslot) !== ""
      ) {
        tlmchar1 = right((10 + parseInt(timeslot)).toString(), 1);
      }

      // Process table data with filtering
      for (let j = 0; j <= ubound(tablax); j++) {
        if (tracker !== "zachtek1") {
          if (tlmchar !== "") {
            if (mid(tablax[j], 16, 1) === tlmchar) {
              tablam[i] = tablax[j];
              i++;
            }
          } else {
            tablam[i] = tablax[j];
            i++;
          }
        } else {
          tablam[i] = tablax[j];
          i++;
        }
      }

      console.log("tablam:", tablam.length);
      let pwr = null;
      // Process first row only (i = 0 to 0)
      for (let i = 0; i <= 0; i++) {
        try {
          let pwrm = split(tablam[i], chr(9), 10, 1);
          pwr = pwrm[6];
          let dbm = Math.round(
            (10 * Math.log(pwr * 1000)) / Math.log(10) + 0.5,
          );
          alturasave = xsnr(dbm);

          // Check for special cases
          let other = getParamSafe("other");
          if (ucase(other) === "VE3PRO" || ucase(tracker) === "OSHPARK") {
            alturasave = or1(dbm);
          }

          let datosmod = tablam[i];
          let datos1 = split(datosmod, chr(9), 13, 1);
          tele1[i][0] = "1";

          for (let j = 1; j <= ubound(datos1); j++) {
            tele1[i][j] = datos1[j - 1];
          }
        } catch (error) {
          // Error handling (equivalent to "on error resume next")
          console.warn("Error processing row:", error);
        }
      }

      // Build distance variable string
      //const distavar = [];
      const row = [];
      window.dista = [];
      for (let i = 0; i <= ubound(distakm); i++) {
        row.push(i * 250);
      }

      window.dista.push(row);

      if (lcase(getParamSafe("other")) === "zl1rs") {
        daysBack = -13;
      }

      let desdefecham_date = dateAdd("d", daysBack, new Date());
      let desdefecham = [
        desdefecham_date.getMonth() + 1,
        desdefecham_date.getDate(),
        desdefecham_date.getFullYear(),
      ];

      let desdeFecha =
        desdefecham[2] +
        "-" +
        right("00" + desdefecham[0], 2) +
        "-" +
        right("00" + desdefecham[1], 2);

      if (launchdate !== "") {
        desdeFecha = launchdate;
      }

      let lastaltura = "";
      let arranque = 0;
      let use6loc = tracker === "zachtek1";

      // Set frequency range based on tracker type
      let bajo, alto;
      if (tracker === "qrplabs" || tracker === "traquito") {
        bajo = window.fcentral - 25;
        alto = window.fcentral + 25;
      } else {
        bajo = window.fcentral - 105;
        alto = window.fcentral + 105;
      }

      for (let i = arranque; i <= ubound(tablam); i++) {
        let checki = false;

        if (
          (tracker === "qrplabs" || tracker === "traquito") &&
          tele1[i + 1][tgrid].length < 6
        ) {
          checki = true;
        }

        if (tracker !== "qrplabs" && tracker !== "traquito") {
          checki = true;
        }

        if (checki) {
          try {
            // Replace spaces with tabs
            let xxx = replace(tablam[i], " ", chr(9), 1, 100, 1);
            let pwrm1 = split(xxx, chr(9), 100, 1);

            // Calculate power and dBm
            let pwr, dbm;
            try {
              pwr = parseFloat(pwrm[6]);
              dbm = Math.floor(
                (10 * Math.log(pwr * 1000)) / Math.log(10) + 0.5,
              );
            } catch (error) {
              // Handle power calculation errors
              pwr = 0;
              dbm = 0;
            }

            // Process data
            let datosmod = tablam[i];
            let datos1 = split(datosmod, chr(9), 12, 1);

            // Ensure tele1 array is properly sized
            if (!tele1[i + 1]) {
              tele1[i + 1] = Array(13).fill(null);
            }

            tele1[i + 1][0] = "1";

            if (use6loc) {
              // Process all data fields as-is
              for (let j = 1; j <= ubound(datos1); j++) {
                if (datos1[j - 1] !== undefined) {
                  tele1[i + 1][j] = datos1[j - 1];
                }
              }
            } else {
              // Process data fields with special handling for field 6
              for (let j = 1; j <= ubound(datos1); j++) {
                if (datos1[j - 1] !== undefined) {
                  if (j === 6) {
                    // Truncate field 6 to 4 characters
                    tele1[i + 1][j] = left(datos1[j - 1], 4);
                  } else {
                    tele1[i + 1][j] = datos1[j - 1];
                  }
                }
              }
            }

            ////////////////
            if (!tele1[i] || !tele1[i][0]) continue;

            // Update distance histogram
            if (tele1[i][tkm] > 0) {
              let distIndex = Math.floor(tele1[i][tkm] / 250);
              if (distIndex >= 0 && distIndex < distakm.length) {
                distakm[distIndex] = distakm[distIndex] + 1;
              }
            }

            // Set flag on first iteration
            if (i === arranque) {
              haylista = true;
            }

            let fechahora = tele1[i][thora];

            // Check if record is within date range
            if (fechahora > desdeFecha && fechahora >= launchdate) {
              if (
                punt[puntpointer][6] === "" &&
                parseInt(tele1[i + 1][tmhz]) > 10000
              ) {
                punt[puntpointer][6] = tele1[i + 1][tmhz];
                summhz = summhz + parseInt(tele1[i][tmhz]);
                countmhz = countmhz + 1;
              }

              // Process SNR data
              let snrr = tele1[i][tsnr];
              tablahoras[i][3] = trim(snrr);

              // Process locator data
              locatora = tele1[i][tgrid];
              locator = tele1[i][trgrid];

              // Handle power conversion
              if (tele1[i][tpwr] === "0.01") {
                tele1[i][tpwr] = 0;
              }

              altura = parseFloat(tele1[i][tpwr]) || 0;

              // Calculate altitude based on power
              if (altura !== 0) {
                altura = Math.floor(
                  (10 * Math.log(altura * 1000)) / Math.log(10) + 0.5,
                );
              }

              // Clean altitude value
              altura = replace(altura.toString(), "+", "", 1, 50, 1);
              altura = replace(altura.toString(), "-", "", 1, 50, 1);
              altura = parseFloat(altura) * 300;

              // Special handling for LU1KCQ
              if (lcase(other) === "lu1kcq") {
                for (let c = 0; c <= 60; c++) {
                  // You'll need to implement the kcq array assignment
                  // xsnr[c] = kcq(c);
                }
              }

              // Calculate altitude based on tracker type
              try {
                if (lcase(other) !== "zl1rs") {
                  altura = xsnr(tele1[i + 1] ? tele1[i + 1][tpwr] : 0);
                } else {
                  altura = 12000;
                }
              } catch (error) {
                // Error handling
                console.warn("Altitude calculation error:", error);
              }

              // Special handling for KM5XK
              if (lcase(other) === "km5xk") {
                altura = Math.floor(
                  (tele1[i + 1] ? tele1[i + 1][tpwr] : 0) * 180,
                );
              }

              // Special handling for VE3PRO and OSHPARK
              if (lcase(other) === "ve3pro" || ucase(tracker) === "OSHPARK") {
                try {
                  let timeEnding = right(tele1[i][thora], 2);
                  if (
                    timeEnding === "02" ||
                    timeEnding === "22" ||
                    timeEnding === "42"
                  ) {
                    altura = or1(tele1[i][tpwr]);
                    savealtu = altura;
                  } else {
                    altura = savealtu;
                  }
                } catch (error) {
                  console.warn("VE3PRO/OSHPARK processing error:", error);
                }
              }

              // Reset altitude for specific trackers
              if (lcase(tracker) === "zachtek1" || tracker === "6locators") {
                altura = 0;
              }

              // Special processing for zachtek1, 6locators, and lightaprs
              if (
                lcase(tracker) === "zachtek1" ||
                tracker === "6locators" ||
                tracker === "lightaprs"
              ) {
                try {
                  let minelapsed = dateDiff(
                    "n",
                    tele1[i + 1] ? tele1[i + 1][thora] : fechahora,
                    tele1[i][thora],
                  );

                  if (minelapsed === 2) {
                    let nextPwr = tele1[i + 1]
                      ? parseFloat(tele1[i + 1][tpwr]) || 0
                      : 0;
                    let currentPwr = parseFloat(tele1[i][tpwr]) || 0;
                    tele1[i][taltura] = nextPwr * 300 + currentPwr * 20;
                    savealtur = tele1[i][taltura];
                    lastaltura = savealtur.toString();
                  }

                  // Update last altitude
                  if (trim(tele1[i][taltura]) * 1 > 990 && lastaltura === "") {
                    lastaltura = (tele1[i][taltura] * 1).toString();
                  }

                  if (
                    (lcase(tracker) === "zachtek1" ||
                      tracker === "6locators") &&
                    savealtur > parseFloat(lastaltura) &&
                    savealtur < 15000 &&
                    i < 30
                  ) {
                    lastaltura = savealtur.toString();
                  }

                  // Fill in missing altitude data
                  if (tele1[i][taltura] < 10) {
                    tele1[i][taltura] = tele1[i - 1]
                      ? tele1[i - 1][taltura]
                      : tele1[i][taltura];
                  }
                  if (tele1[i][taltura] < 10) {
                    tele1[i][taltura] = tele1[i - 2]
                      ? tele1[i - 2][taltura]
                      : tele1[i][taltura];
                  }
                  if (tele1[i][taltura] < 10) {
                    tele1[i][taltura] = tele1[i - 3]
                      ? tele1[i - 3][taltura]
                      : tele1[i][taltura];
                  }
                } catch (error) {
                  console.warn("Special tracker processing error:", error);
                }
              }

              // WB8ELK tracker handling
              try {
                if (tracker === "wb8elk") {
                  tele1[i][taltura] = xsnr(tele1[i][tpwr]);
                }
              } catch (error) {
                console.warn("WB8ELK processing error:", error);
              }

              // Handle various tracker types
              if (
                lcase(tracker) === "qrplabs" ||
                lcase(tracker) === "traquito" ||
                lcase(tracker) === "zachtek" ||
                lcase(tracker) === "ab5ss"
              ) {
                tele1[i][taltura] = xsnr(tele1[i][tpwr]);
              }

              // Special zachtek1 handling
              if (lcase(tracker) === "zachtek1" && trim(timeslot) === "") {
                let calculatedAltitude =
                  tele1[i][twpr] * 20 +
                  (tele1[i + 1] ? tele1[i + 1][tpwr] * 300 : 0);
                if (calculatedAltitude < 15000 && calculatedAltitude > 3000) {
                  // Commented out in original code
                  // tele1[i][taltura] = calculatedAltitude;
                  // lastaltura = tele1[i][taltura].toString();
                }
              }

              // Store processed data
              tablahoras[i][0] = fechahora;
              tablahoras[i][1] = altura;

              // Process license information
              licencia = tele1[i][treporter];
              tablahoras[i][4] = licencia;

              // Check if license is already in list
              let found = false;
              for (let h = 0; h <= ubound(licentab); h++) {
                try {
                  if (licentab[h] === licencia) {
                    found = true;
                    break;
                  }
                } catch (error) {
                  // Continue on error
                }
              }

              // Add new license if not found and within date range
              if (
                !found &&
                left(fechahora, 13) >= left(desdeFecha, 13) &&
                fechahora >= launchdate
              ) {
                try {
                  licentab[last] = licencia;
                } catch (error) {
                  console.warn("License processing error:", error);
                }

                // Process locator
                let locatorm;
                if (locator.length < 5) {
                  locatorm = locator + "LL";
                } else {
                  locatorm = locator;
                }

                if (locatorm !== locatorlast) {
                  flechas.push(chr(34) + locatorm + chr(34));
                  last = last + 1;
                }
                locatorlast = locatorm;
              }
            }

            ////////////////// 3rd iteration

            tablahoras[i][2] = licencia;
            if (i === 0) {
              // Search for time, distance and locator of destination
              licenciao = tele1[i][tcall];
              power = tele1[i][tpwr] + " W";
              locatoro = ucase(tele1[i][tgrid]);

              if (locatoro.length === 4) {
                locatoro = locatoro + "LL";
              }

              let distance = tele1[i][tkm];
              let hora = tele1[i][thora];

              // Format hora
              let monthNum = parseInt(hora.substring(5, 7));
              let dayTime = hora.substring(8, 16);
              hora = mes[monthNum] + "-" + dayTime;

              hora0 = tele1[i][thora] + "z";

              power = "20 mW";

              // Check tracker conditions
              // if (tracker && (tracker.toLowerCase() === "zachtek1" || tracker === "6locators")) {
              //     if (timeslot && timeslot.trim() !== "" &&
              //         hora0.charAt(15) === timeslot.trim()) {
              //         let alturaf = tele1[i][tpwr] * 20 + tele1[i + 1][tpwr] * 300;
              //         let AltFinal = alturaf;

              //         // Note: This would affect altura but the original code is commented out
              //         // if (AltFinal !== "") altura = AltFinal;
              //     }
              // }

              if (lcase(tracker) === "zachtek1" || tracker === "6locators") {
                if (
                  trim(getParamSafe("timeslot")) !== "" &&
                  mid(tele1[i][thora], 16, 1) === trim(getParamSafe("timeslot"))
                ) {
                  alturaf = tele1[i][tpwr] * 20 + tele1[i + 1][tpwr] * 300;
                  AltFinal = alturaf;
                }
              }

              if (altura === "" || altura === 3000) {
                altura = alturasave;
              }

              // Build vorlocsave and vorloc strings
              let locatorTrim = locatoro.trim().substring(0, 6);
              let displayText =
                licenciao +
                " " +
                hora +
                "z" +
                " " +
                power +
                " " +
                locatoro +
                " " +
                altura +
                " m.";

              vorlocsave = '["' + locatorTrim + '","' + displayText + '"],\n';
              //vorloc += "[\"" + locatorTrim + "\",\"" + displayText + "\"],\n";
              window.locations.push([locatorTrim, displayText]);
              // Build mapainicio string
              mapainicio = [locatoro.substring(0, 6), displayText];
            }

            //////// 4th iteration

            if (i > 0) {
              spots = spots + 1;

              // Handle altura calculation for specific trackers
              if (
                tracker &&
                (lcase(tracker) === "zachtek1" || tracker === "6locators")
              ) {
                altura = tele1[i + 1][tpwr] * 300 + savealtur;
              }

              // Add to vorloc
              // Search for time, distance, locator and SNR of receiver
              // Search for taken locator
              snr = tele1[i][tsnr];
              snr = "SNR:" + snr;

              if (banda && lcase(banda) === "all") {
                let freq = tele1[i][tmhz];
                if (parseInt(freq) !== 14) {
                  snr = snr + "<br>" + parseInt(freq) + " Hz";
                }
              }

              /*
                if (snrnew === "") {
                    snrnew = snr.replace("SNR: ", "");
                    // if (parseFloat(snrnew) > -10) snrnew = snrnew + "!";
                }
                */
              let locatoma, locatortomado;

              if (
                !tracker ||
                ucase(tracker) !== "zachtek1" ||
                tracker === "6locators"
              ) {
                locatoma = tele1[i][tgrid];
                locatortomado = locatoma.substring(locatoma.length - 4);
                locatoro = tele1[i][trgrid];
                if (locatoro.length === 4) {
                  locatoro = locatoro + "LL";
                }
              } else {
                // Find first valid locator
                for (let z = i; z < tele1.length; z++) {
                  if (tele1[z][tgrid].length > 3) {
                    locatoma = tele1[z][tgrid];
                    break;
                  }
                }
                locatortomado = locatoma;
                locatoro = tele1[i][trgrid];
                if (locatoro.length === 4) {
                  locatoro = locatoro + "LL";
                }
                tele1[i][tgrid] = locatoma;
              }

              let distance = tele1[i][tkm];
              let hora = tele1[i][thora];
              horaoriginal = hora;
              let diahora = hora.substring(3, 11);

              // Format hora
              let monthNum = parseInt(hora.substring(5, 7));
              let endPart = hora.substring(hora.length - 11);
              hora = mes[monthNum] + "-" + endPart;

              let duplicated = false;

              // Check for duplicates in window.locations
              for (let f = 0; f < window.locations.length; f++) {
                if (window.locations[f][1].includes(licencia)) {
                  duplicated = true;
                  break;
                }
              }

              let swloc = true;

              if (window.locations.length < 200) {
                // Uncomment next 2 lines if there was no 2nd telemetry to see yellow pointer
                // flechas = flechas + "\"" + locatortomado.trim() + "\",";
                // window.locations.push([
                //     locatortomado.trim(),
                //     "Capture of<br>" + licencia + "<br>" + hora + "z" + "<br>@ " + distance + " Km" + "<br>Locator: " + locatortomado + "??<br>" + snr
                // ]);
                locatortomado = "@ " + locatortomado + "<br>";
              } else {
                locatortomado = "";
              }

              if (!duplicated && horaoriginal.substring(0, 13) > desdeFecha) {
                // Add new location entry to window.locations array
                window.locations.push([
                  trim(locatoro),
                  licencia +
                    "<br>" +
                    hora.substring(0, 12) +
                    "z" +
                    "<br>" +
                    distance +
                    " Km" +
                    "<br>" +
                    locatortomado +
                    snr,
                ]);
              }
            }

            if (getParamSafe("detail") !== "") {
              if (i < cuenta && i > 0) {
                if (
                  left(tracker, 4) === "orio" ||
                  left(tracker, 4) === "bss9"
                ) {
                  if (mid(tele1[i][1], 16, 1) === "0") {
                    tele1[i][6] = tele1[i][6] + oloc[tele1[i][7]];
                    saveorionloc = tele1[i][6];
                    locatora = tele1[i][6];
                  } else {
                    tele1[i][6] = saveorionloc;
                  }

                  let orionaltid = mid(tele1[i][1], 15, 1);
                  if (
                    (orionaltid === "0" ||
                      orionaltid === "4" ||
                      orionaltid === "8") &&
                    mid(tele1[i][1], 16, 1) === "2"
                  ) {
                    tele1[i][12] = oalt[tele1[i][7]];
                    saveorionalt = tele1[i][12];
                  } else {
                    tele1[i][12] = saveorionalt;
                  }

                  if (
                    (orionaltid === "1" || orionaltid === "5") &&
                    mid(tele1[i][1], 16, 1) === "2"
                  ) {
                    extra1 = "<td>" + ovolt[tele1[i][7]] + "</td>";
                  }

                  if (orionaltid === "3" && right(tele1[i][1], 1) === "2") {
                    extra2 =
                      "<td align=right>&nbsp;" +
                      otemp[tele1[i][7]] +
                      "&nbsp;</td>";
                  }
                }

                output += "<tr style='line-height:11px;color:#000000;'>";

                for (let j = 1; j <= 12; j++) {
                  let agre1 = "";
                  let agre2 = "";

                  if (tele1[i][3] * 1 > alto || tele1[i][3] * 1 < bajo) {
                    if (j === 3) {
                      agre1 = "&nbsp;";
                      agre2 = "!";
                    } else {
                      agre1 = "";
                      agre2 = "";
                    }
                  }

                  output += "<td>" + agre1 + tele1[i][j] + agre2 + "</td>";
                }

                if (i < cuenta + 1) {
                  let putsun =
                    (output += `<td align=right>${putsun(`${tele1[i][1]}`, `${tele1[i][6]}`)}</td>`);
                } else {
                  output += "<td></td>";
                }

                if (extra1 !== "") {
                  output += extra1 + extra2;
                }

                output += "</tr>\n";

                if (
                  left(tracker, 4) === "orio" ||
                  left(tracker, 4) === "bss9"
                ) {
                  if (
                    dateDiff(
                      "h",
                      new Date(tele1[i + 1][1]),
                      new Date(tele1[i][1]),
                    ) > 6
                  ) {
                    output += "<tr><td colspan=15><hr></td></tr>\n";
                  }
                } else {
                  if (
                    dateDiff(
                      "h",
                      new Date(tele1[i + 1][1]),
                      new Date(tele1[i][1]),
                    ) > 6
                  ) {
                    output += "<tr><td colspan=13><hr></td></tr>\n";
                  }
                }
              }
            } else {
              let extra1 = "";
              let extra2 = "";

              // Main logic - equivalent to your ASP code
              if (i < cuenta + 1 && tele1[i][1] !== tele1[i + 1][1]) {
                if (
                  left(tracker, 4) === "orio" ||
                  left(tracker, 4) === "bss9"
                ) {
                  if (mid(tele1[i][1], 16, 1) === "0") {
                    tele1[i][6] = tele1[i][6] + oloc[tele1[i][7]];
                    saveorionloc = tele1[i][6];
                    locatora = tele1[i][6];
                  } else {
                    tele1[i][6] = saveorionloc;
                  }

                  let orionaltid = mid(tele1[i][1], 15, 1);
                  if (
                    (orionaltid === "0" ||
                      orionaltid === "4" ||
                      orionaltid === "8") &&
                    mid(tele1[i][1], 16, 1) === "2"
                  ) {
                    tele1[i][12] = oalt[tele1[i][7]];
                    saveorionalt = tele1[i][12];
                  } else {
                    tele1[i][12] = saveorionalt;
                  }

                  if (
                    (orionaltid === "1" || orionaltid === "5") &&
                    mid(tele1[i][1], 16, 1) === "2"
                  ) {
                    extra1 = "<td>" + ovolt[tele1[i][7]] + "</td>";
                  }

                  if (orionaltid === "3" && mid(tele1[i][1], 16, 1) === "2") {
                    extra2 =
                      "<td align=right>&nbsp;" +
                      otemp[tele1[i][7]] +
                      "&nbsp;</td>";
                  }
                }

                output += "<tr style='line-height:11px;color:#000000;'>";

                for (let j = 1; j <= 12; j++) {
                  let agre1 = "";
                  let agre2 = "";

                  if (tele1[i][3] * 1 > alto || tele1[i][3] * 1 < bajo) {
                    if (j === 3) {
                      agre1 = "&nbsp;";
                      agre2 = "!";
                    } else {
                      agre1 = "";
                      agre2 = "";
                    }
                  }

                  output += "<td>" + agre1 + tele1[i][j] + agre2 + "</td>";
                }

                if (i < cuenta + 1) {
                  output += `<td align=right>${putsun(`${tele1[i][1]}`, `${tele1[i][6]}`)}</td>`;
                } else {
                  output += "<td></td>";
                }

                if (extra1 !== "") {
                  output += extra1 + extra2;
                }

                output += "</tr>\n";

                if (
                  left(tracker, 4) === "orio" ||
                  left(tracker, 4) === "bss9"
                ) {
                  if (
                    dateDiff(
                      "h",
                      new Date(tele1[i + 1][1]),
                      new Date(tele1[i][1]),
                    ) > 6
                  ) {
                    output += "<tr><td colspan=15><hr></td></tr>\n";
                  }
                } else {
                  if (
                    dateDiff(
                      "h",
                      new Date(tele1[i + 1][1]),
                      new Date(tele1[i][1]),
                    ) > 6
                  ) {
                    output += "<tr><td colspan=13><hr></td></tr>\n";
                  }
                }
              } else {
                cuenta = cuenta + 1;
              }
            }
          } catch (error) {
            console.error("Error processing tablam row:", error);
            continue;
          }
        } else {
          let html = "";
          try {
            let dbm = Math.floor(
              (10 * Math.log(pwr * 1000)) / Math.log(10) + 0.5,
            );
            tele1[i][12] = dbm * 300;
            let previousdate = tele1[0][1];
            const detail = getParamSafe("detail");
            if (detail !== "") {
              html = `${html}<tr title='Bad report ~ not plotted' style='line-height:11px;color:#b33c00;cursor:pointer;background-color:#e8e8e8;'>`;

              for (let j = 1; j <= 12; j++) {
                html = `${html} <td>${tele1[i][j]}</td>`;
              }
              if (i < cuenta + 1) {
                html = `${html} <td align=right>${putsun(`${tele1[i][1]}`, `${tele1[i][6]}`)}</td>`;
              } else {
                html = `${html} <td></td>`;
              }
              html = `${html} </tr>`;
            } else {
              if (i < cuenta + 1 && tele1[i][1] > previousdate) {
                html = `${html} <tr title='Bad report ~ not plotted' style='line-height:11px;color:#b33c00;cursor:pointer;background-color:#e8e8e8;'>`;
              }
              for (let j = 1; j <= 12; j++) {
                html = `${html} <td>${tele1[i][j]}</td>`;
              }

              if (i < cuenta + 1) {
                html = `${html} <td align=right>${putsun(`${tele1[i][1]}`, `${tele1[i][6]}`)}</td>`;
              } else {
                html = `${html} <td></td>`;
              }
              html = `${html} </tr>`;
              previousdate = tele1[i][1];
            }
            output = `${output}${html}`;
          } catch (error) {
            console.error("Error processing tablam row:", error);
          }
        }

        if (
          punt[puntpointer][6].length < 10 &&
          punt[puntpointer][6].length < 190
        ) {
          punt[puntpointer][6] =
            punt[puntpointer][6] +
            "<br>" +
            licencia +
            " " +
            replace(snr, "SNR:", "", 1, 40, 1);
        }

        if (
          punt[puntpointer][1] === locatora + "LL" &&
          punt[puntpointer][3] === altura
        ) {
          if (getParamSafe("detail") !== "onx") {
            puntpointer = puntpointer + 1; // ojo cambio on por onx
          }

          let insertar = true;
          for (let w = 1; w <= punt[puntpointer][6].length - 8; w++) {
            if (licencia === mid(punt[puntpointer][6], w, licencia.length)) {
              insertar = false;
              break;
            }
          }

          if (insertar && punt[puntpointer][6].length < 190) {
            punt[puntpointer][6] =
              punt[puntpointer][6] +
              "<br>" +
              licencia +
              " " +
              replace(snr, "SNR:", "", 1, 40, 1);
          }
        } else {
          if (trim(tracker) !== "zachtek1") {
            puntpointer = puntpointer + 1;

            if (locatora.length < 6) {
              punt[puntpointer][0] = horaoriginal + "z";
              punt[puntpointer][1] = locatora + "LL";
              punt[puntpointer][3] = altura;
            } else {
              punt[puntpointer][0] = horaoriginal + "z";
              punt[puntpointer][1] = locatora;
              punt[puntpointer][3] = altura;
            }

            punt[puntpointer][2] = "? ";
            punt[puntpointer][4] = "? ";
          } else {
            if (punt[puntpointer][0] !== horaoriginal + "z") {
              puntpointer = puntpointer + 1;
            }

            if (locatora.length < 6) {
              punt[puntpointer][0] = horaoriginal + "z";
              punt[puntpointer][1] = locatora + "LL";
              punt[puntpointer][3] = savealtur;
            } else {
              punt[puntpointer][0] = horaoriginal + "z";
              punt[puntpointer][1] = locatora;
              punt[puntpointer][3] = savealtur;

              if (
                trim(getParamSafe("tracker")) === "zachtek1" &&
                trim(getParamSafe("timeslot")) === ""
              ) {
                punt[puntpointer][3] = lastaltura;
              }
            }

            punt[puntpointer][2] = "? ";
            punt[puntpointer][4] = "? ";
          }
        }
      }

      countmhz = countmhz !== 0 ? countmhz : 1;
      let avgfreq = Math.floor(summhz / countmhz);
      window.dista.push(distakm);

      output = `${output}`;

      if (haylista) {
        const cuentaa = spots < cuenta ? spots : cuenta;
        output = `${output} <th align=center colspan=15>
                  <tr style='font-weight:bold;'>
                  <td align=center> Seen: ${spots} Spots </td>
                  <td align=center>Listing:</td><td align=center>Recent ${cuentaa}</td>
                  <td colspan=13><hr></td></tr></th>`;
      } else {
        // FIXME CHECK THIS
        let queryString = "?";
        let params = new URLSearchParams(window.location.search);
        for (let [key, value] of params.entries()) {
          queryString += `${encodeURIComponent(key)}=${encodeURIComponent(value)}&`;
        }

        // Check domain name
        let dedonde = window.location.hostname.toLowerCase();
        let irdonde = "org";
        for (let r = 0; r < dedonde.length - 2; r++) {
          if (dedonde.slice(r, r + 3) === "org") {
            irdonde = "com";
            break;
          }
        }
        // Message logic
        let other = params.get("other") || "";
        let leyinicial;
        if (other === "") {
          leyinicial = `<img src='http://lu7aa.com.ar/icon/habhub.png'>&nbsp;This free application tracks WSPR Balloons&nbsp;<img src='http://lu7aa.com.ar/icon/aprs.png'><br>Enter Balloon Callsign and click OK`;
        } else {
          leyinicial = `Not enough data found on WSPRNET for ${other.toUpperCase()}<br>Change Callsign or band and/or retry clicking 'OK'<br>Alternate site: <a href="http://lu7aa.${irdonde}.ar/wsprx.asp${queryString}" style='color:#FFCF00;'>http://lu7aa.${irdonde}.ar/wsprx.asp</a>`;
        }

        output = `${output} <center><b>
                        <div style="height:110px;width:550px;border-width:7px;border-color:#FFBF00;vertical-align:text-top;border-style:ridge;background-color:#045FB4;color:#FFCF00;font-family:Arial;font-size:20px;align:center;text-shadow: 2px 2px #000000;border-radius: 37px;">
                          <br>
                          ${leyinicial}
                       </div>
                    </b><br>
                </center>`;
      }

      if (trim(timeslot) !== "" && timeslot !== " ") {
        timeslot = " and for minutes starting on x" + timeslot;
      } else {
        timeslot = "";
      }

      if (getParamSafe("balloonid") !== "") {
        output = `${output}
                  <tr style='background-color:#cccccc;'>
                    <th align=center style='font-size:16px;' colspan=13>2nd Telemetry Transmissions received for Channel-Id ${ucase(getParamSafe("balloonid"))}${timeslot}&nbsp;&nbsp;<i>(${ucase(tracker)} Decoding test)</i>
                  </th><th></th></tr>`;
      }

      document
        .getElementById("telemetryTable")
        .insertAdjacentHTML("beforeend", output);

      output = "";

      puntos = Array(5002)
        .fill("")
        .map(() => Array(7).fill("")); // Contiene fecha, locator y telemetria del 2do paquete
      puntospointer = 0;
      punto = Array(5002)
        .fill("")
        .map(() => Array(8).fill("")); // Contiene fecha y locator 1er paquete
      puntopointer = 0;
      last = last - 1;
      banda = 14;
      bandasearch = "14";
      for (let g = 0; g <= ubound(tbanda); g++) {
        if (ucase(getParamSafe("banda")) === ucase(tbanda[g][1])) {
          bandasearch = tbanda[g][0];
        }
      }
      let balid = left(balloonid, 1) + "_" + right(balloonid, 1) + "*";
      timeLimit = "1209600"; // 1209600 604800
      count = "5000";
      cuenta = 8700;

      if (getParamSafe("detail") !== "") {
        cuenta = 698;
      }

      let cuentamax = cuenta * 1;
      let cuentalineas = 0;

      if (getParamSafe("balloonid") !== "") {
        const pag1 = await getReportersTelemetry2(
          getURLreporters1,
          getParamSafe("balloonid"),
        );
        tablax = split(pag1, chr(10), 5000, 1);
        let tablan = split(pag1, chr(10), 5000, 1);
        let tele2 = Array(5002)
          .fill("")
          .map(() => Array(13).fill(""));
        if (pag1.length > 0) {
          if (getParamSafe("qp") !== "") {
            output = `${output}
                          <tr style='background-color:#cccccc;font-size:16px;'>
                              <th style='width:16%;'>Timestamp (z)</th>
                              <th style='width:7%;'>&nbsp;Call Loc Pwr</th>
                              <th style='width:8%;'>Locator</th>
                              <th style='width:4%;'>Temp</th>
                              <th style='width:4%;'>Bat/Sun</th>
                              <th style='width:7%;'>Km/h</th>
                              <th style='width:5%;'>GPS#</th>
                              <th style='width:10%;'>Reporter</th>
                              <th style='width:10%;'>RGrid&nbsp;</th>
                              <th style='width:6%;'>&nbsp;Km.&nbsp;</th>
                              <th style='width:6%;'>&nbsp;Az&deg;&nbsp;</th>
                              <th style='width:7%;'>Heig.m</th>
                              <th style='width:8%;cursor:pointer;align:right' align=right title=' This column shows&#13solar elevation angle&#13 If at 12000m. add 3&deg;'>Sun&deg;&nbsp;</th>
                              <th title='qrplabs TLM&#13Decode Test'>
                                <span onclick='showtelen()' title='Display Comment and TELEN #1 Coding'><u>Telen 1/2</u></span>
                              </th>
                           </tr>`;
          } else {
            output = `${output}
                         <tr style='background-color:#cccccc;font-size:16px;'>
                            <th style='width:16%;'>Timestamp (z)</th>
                            <th style='width:7%;'>&nbsp;Call Loc Pwr</th>
                            <th style='width:8%;'>Locator</th>
                            <th style='width:4%;'>Temp</th>
                            <th style='width:4%;'>Bat/Sun</th>
                            <th style='width:7%;'>Km/h</th>
                            <th style='width:5%;'>GPS#</th>
                            <th style='width:10%;'>Reporter</th>
                            <th style='width:10%;'>RGrid</th>
                            <th style='width:6%;'>Km.</th>
                            <th style='width:6%;'>Az&deg;</th>
                            <th style='width:7%;'>Heig.m</th>
                            <th style='width:8%;cursor:pointer;align:right' align=right title=' This column shows&#13solar elevation angle&#13 If at 12000m. add 3&deg;'>Sun&deg;&nbsp;</th>
                         </tr>`;
          }
        }

        document
          .getElementById("telemetryTable")
          .insertAdjacentHTML("beforeend", output);

        output = "";

        for (let i = 0; i <= 0; i++) {
          tele2[i][0] = "2";
          let datosmod = tablan[i];
          let datos2 = split(datosmod, chr(9), 13, 1);
          for (let j = 1; j <= ubound(datos2); j++) {
            tele2[i][j] = datos2[j - 1];
          }
        }

        let previousdate = tele2[2][1];
        let firsttlm = Number(getParamSafe("timeslot")) * 1 + 2 * 1;
        if (firsttlm > 9) {
          firsttlm = firsttlm - 10;
        }
        let secondtlm = Number(getParamSafe("timeslot")) * 1 + 4 * 1;
        if (secondtlm > 9) {
          secondtlm = secondtlm - 10;
        }

        for (let i = 0; i <= ubound(tablan); i++) {
          tele2[i][0] = "2";
          let datosmod = tablan[i];
          let datos2 = datosmod.split("\t");

          if (lcase(tracker) === "qrplabs" || lcase(tracker) === "traquito") {
            if (datos2[5].length === 4) {
              for (let j = 1; j <= ubound(datos2); j++) {
                tele2[i + 1][j] = datos2[j - 1];
              }
            }
          } else {
            for (let j = 1; j <= ubound(datos2); j++) {
              tele2[i + 1][j] = datos2[j - 1];
            }
          }

          let fechahora = tele2[i][thora];
          let buscohora;

          if (trim(getParamSafe("timeslot")) !== "") {
            buscohora = left(fechahora, 15);
          } else {
            // Convert fechahora to Date object and subtract 1 minute
            let fechahoraDate = new Date(fechahora);
            let buschoraDate = dateAdd("n", -1, fechahoraDate);
            buscohora = formatDateTime(buschoraDate);

            let buscohorad = split(buscohora, " ", 2, 1);
            let buscohoram = split(buscohorad[0], "/", 3, 1);
            let buscohoras = split(buscohorad[1], ":", 3, 1);

            let hhora = buscohoras[0] * 1;
            let hmin = buscohoras[1] * 1;

            if (right(buscohora, 2) === "PM") {
              hhora = hhora + 12;
            }

            let bushora =
              buscohoram[2] +
              "-" +
              right("0" + buscohoram[0], 2) +
              "-" +
              right("0" + buscohoram[1], 2) +
              " " +
              right("0" + hhora, 2) +
              ":" +
              right("0" + hmin, 2);

            buscohora = left(bushora, 15);
          }

          let checkit = true;
          if (lcase(getParamSafe("tracker")) === "wb8elk") {
            let actuali = tele2[i][tgrid];
            checkit = false;

            for (let r = 2; r <= ubound(tele2); r++) {
              if (actuali === tele2[r][tgrid]) {
                checkit = true;
                break;
              }
            }
          }

          let qrplen4 =
            (tele2[i][tgrid].length === 4 &&
              lcase(getParamSafe("tracker")) === "qrplabs") ||
            lcase(getParamSafe("tracker")) === "traquito";

          if (fechahora > desdeFecha && fechahora >= launchdate && checkit) {
            let fh2 = dateAdd("n", -2, new Date(fechahora));
            fechahora2 =
              fh2.getFullYear() +
              "-" +
              right("00" + fh2.getMonth() + 1, 2) +
              "-" +
              right("00" + fh2.getDate(), 2) +
              " " +
              formatDateTimeFormat(fh2, 4) +
              "z";
            let telem2 = tele2[i][tcall];
            let loc4;
            if (
              lcase(getParamSafe("tracker")) === "qrplabs" ||
              lcase(getParamSafe("tracker")) === "traquito"
            ) {
              loc4 = left(tele2[i][tgrid], 4);
            } else {
              loc4 = tele2[i][tgrid];
            }
            let dbm = Math.floor(
              (10 * Math.log(tele2[i][tpwr]) * 1000) / Math.log(10) + 0.5,
            );
            // CHECK THIS
            /*
              if (trim(getParamSafe("timeslot")) === "" || getParamSafe("timeslot") === " ") {
                  if (i < cuenta && locator2.length === 4) {
                output = `${output} <tr> ${tablan[i]}`;
                  }
              } else {
                  if (i < cuenta && locator2.length === 4 && getParamSafe("timeslot") === right(fechahora, 1)) {
                output = `${output}  <tr> ${tablan[i]}`;
                  }
              }
               */
            if (tablan[i].length > 10) {
              let pase = false;

              // Check if conditions are met
              if (
                getParamSafe("timeslot") &&
                getParamSafe("timeslot").trim() !== "" &&
                (lcase(getParamSafe("tracker")) === "qrplabs" ||
                  lcase(getParamSafe("tracker")) === "traquito") &&
                getParamSafe("qp") === "on"
              ) {
                // First condition check
                if (parseInt(mid(fechahora, 16, 1)) === firsttlm) {
                  decoqr = decoqrp(fechahora, telem2, loc4, tele2[i][tpwr]);
                  pase = false;
                }

                // Second condition check
                const timeslotCalc = parseInt(
                  (" " + (parseInt(getParamSafe("timeslot")) + 4)).slice(-1),
                );
                if (timeslotCalc === secondtlm && pase && decoqr.length < 14) {
                  decoqr =
                    decoqr +
                    " " +
                    decoqrp(
                      tele2[i + 0][thora],
                      tele2[i + 1][tcall],
                      tele2[i + 1][tgrid].substring(0, 4),
                      tele2[i + 1][tpwr],
                    );
                }
                pase = true;
              } else if (
                (lcase(getParamSafe("tracker")) === "qrplabs" ||
                  lcase(getParamSafe("tracker")) === "traquito") &&
                lcase(getParamSafe("banda")) === "all" &&
                getParamSafe("qp") === "on"
              ) {
                decoqr = decoqrp(fechahora, telem2, loc4, tele2[i][tpwr]);
              }

              let retorno = "";
              if (
                getParamSafe("timeslot") == mid(fechahora, 16, 1) ||
                getParamSafe("timeslot") === "" ||
                getParamSafe("timeslot") === " " ||
                (getParamSafe("balloonid") !== "" && loc4.length === 4)
              ) {
                if (getParamSafe("detail") === "") {
                  if (
                    (tele2[i][thora] !== tele2[i + 1][thora] &&
                      cuentalineas < cuentamax) ||
                    i === 2
                  ) {
                    //  decowspr fechahora,telem2,loc4,tele2(i,tpwr),tele2(i,treporter),tele2(i,trgrid),tele2(i,tkm),tele2(i,taz)
                    retorno = decowspr(
                      fechahora,
                      telem2,
                      loc4,
                      tele2[i] && tele2[i][tpwr] ? tele2[i][tpwr] : "",
                      tele2[i] && tele2[i][treporter]
                        ? tele2[i][treporter]
                        : "",
                      tele2[i] && tele2[i][trgrid] ? tele2[i][trgrid] : "",
                      tele2[i] && tele2[i][tkm] ? tele2[i][tkm] : "",
                      tele2[i] && tele2[i][taz] ? tele2[i][taz] : "",
                      {
                        thora,
                        tgrid,
                        taltura,
                        decoqr,
                        decoqr1,
                        decoqrf,
                        tablahoras,
                        tablam,
                        tele1,
                      },
                    );
                    console.log("retorno", retorno);
                    output += retorno + "\n";
                  }
                } else {
                  if (cuentalineas < cuentamax || i === 2) {
                    //    decowspr fechahora,telem2,loc4,tele2(i,tpwr),tele2(i,treporter),tele2(i,trgrid),tele2(i,tkm),tele2(i,taz)
                    //  Response.Write retorno & vbCrLf
                    retorno = decowspr(
                      fechahora,
                      telem2,
                      loc4,
                      tele2[i] && tele2[i][tpwr] ? tele2[i][tpwr] : "",
                      tele2[i] && tele2[i][treporter]
                        ? tele2[i][treporter]
                        : "",
                      tele2[i] && tele2[i][trgrid] ? tele2[i][trgrid] : "",
                      tele2[i] && tele2[i][tkm] ? tele2[i][tkm] : "",
                      tele2[i] && tele2[i][taz] ? tele2[i][taz] : "",
                      {
                        thora,
                        tgrid,
                        taltura,
                        decoqr,
                        decoqr1,
                        decoqrf,
                        tablahoras,
                        tablam,
                        tele1,
                      },
                    );

                    output += retorno + "\n";
                  }
                }

                try {
                  const nextRowData =
                    tele2[i + 1] && tele2[i + 1][1] ? tele2[i + 1][1] : "";
                  if (
                    cuentalineas < cuentamax &&
                    nextRowData.length > 5 &&
                    dateDiffMinutes(cDate(nextRowData), cDate(previousdate)) >
                      360
                  ) {
                    output += "<tr><td colspan=13><hr></td></tr>\n";
                  }
                } catch (error) {
                  console.error("Error in time gap check:", error);
                }

                // Update previous date
                try {
                  const nextRowData =
                    tele2[i + 1] && tele2[i + 1][1] ? tele2[i + 1][1] : "";
                  if (nextRowData.length > 5) {
                    previousdate = nextRowData;
                  }
                } catch (error) {
                  console.error("Error updating previous date:", error);
                }

                // Increment line counter
                cuentalineas = cuentalineas + 1;

                // Set final values if this is the first data row (i=2)
                if (i === 2) {
                  console.log("telem2", telem2);
                  console.log("tele2[2]", tele2[i]);
                  console.log("tcall", tcall);
                  const K6 = telem2.charAt(4);
                  const N6 = telem2.charAt(5);

                  TempFinal = window.wtemp;
                  VoltFinal = window.wbat;
                  Altfinal = window.walt;
                  Locfinal = window.newloc + K6 + N6;
                  GPSfinal = window.wsats;
                }
              }
            }

            let datefound = false;
            for (let h = 0; h <= ubound(tablan); h++) {
              if (puntos[h][0] == fechahora2) {
                datefound = true;
                break;
              }
            }

            if (!datefound) {
              puntos[puntospointer][0] = fechahora2;
              puntos[puntospointer][1] = replace(
                locator,
                "&nbsp;",
                "",
                1,
                32,
                1,
              );
              puntos[puntospointer][2] = telem2;
              puntos[puntospointer][3] = altura;
              puntospointer = puntospointer + 1;
              char1 = balloonid !== "" ? mid(balloonid, 1, 1) : "0";
              char2 = balloonid !== "" ? mid(balloonid, 2, 1) : "7";
              if (mid(telem2, 1, 1) === char1 && mid(telem2, 3, 1) === char2) {
                hora = mid(fechahora, 3, 14);
                hora = mid(hora, 4, 14);
                hora = mes[left(hora, 2)] + "-" + right(hora, 8);
              }
            }

            let locatorfound = false;
            for (let h = 0; h <= ubound(tablan); h++) {
              if (punto[h][1] === locator) {
                locatorfound = true;
                break;
              }
            }

            if (locatorfound) {
              //'and (callsign="LU1ESY" or callsign="LU7AA" or callsign="VK3KCL" or callsign="LU4KC" or callsign="WB8ELK") then
              snr1 = "";
              licorigen = "";
              for (let h = 0; h <= ubound(tablahoras); h++) {
                if (tablahoras[h][0] == fechahora) {
                  licorigen = `${licorigen} ${tablahoras[h][4]} ${tablahoras[h][3]}<br>De: `;
                  break;
                }
              }

              licorigen =
                licorigen.length > 8
                  ? left(licorigen, licorigen.length - 8)
                  : licorigen;
              licorigen = licorigen === "" ? licorigenalt : licorigen;
              char1 = char1 === "" ? "0" : char1;
              char1 = balloonid !== "" ? mid(balloonid, 1, 1) : char1;
              char2 = balloonid !== "" ? mid(balloonid, 2, 1) : "7";
              if (mid(telem2, 1, 1) === char1 && mid(telem2, 3, 1) === char2) {
                agregar = wsats === "4-8 Sats" ? "gps" : "";
                punto[puntopointer][0] = fechahora + "z" + agregar;
                punto[puntopointer][1] = left(
                  replace(locator, "&nbsp;", "", 1, 12, 1),
                  6,
                );
                punto[puntopointer][2] = wtemp;
                punto[puntopointer][3] =
                  Math.round((altura * 18.1132) / 10) * 10;
                for (let u = 0; u < 300; u++) {
                  if (tablahoras[u][0] == fechahora) {
                    punto[puntopointer][3] =
                      punto[puntopointer][3] + tablahoras[u][1] * 1;
                    break;
                  }
                }
                punto[puntopointer][4] = wbat;
                punto[puntopointer][5] = wspeed;
                punto[puntopointer][6] = licorigen;
                puntopointer = puntopointer + 1;
              }
            }

            for (let z = 0; z <= ubound(punt); z++) {
              if (left(punt[z][0], 15) == buscohora && newloc.length > 2) {
                const K6 = telem2.charAt(4);
                const N6 = telem2.charAt(5);

                punt[z][1] = newloc + K6 + N6;
                punt[z][3] = walt;
                punt[z][2] = wtemp;
                punt[z][4] = wbat;
                punt[z][5] = wspeed;
                break;
              }
            }
          }
        }

        console.log("tele2", tele2);

        if (getParamSafe("balloonid") !== "" && ubound(tablan) > 0) {
          output = `${output} <tr>
                      <td colspan=5 align=left style='align:left;'>
                        <b>&nbsp;&nbsp;&nbsp;&nbsp;There were: ${ubound(tablan)} Spots for 2nd Telemetry.... Listing: Recent ${cuenta + 2} Spots</b>
                      </td>
                      <td colspan=8><hr></td>
                    </tr>`;
        }
        output = `${output} </table>`;
      }

      let llcount = 0;
      let totalcount = 0;
      for (let k = 1; k <= puntpointer + 1; k++) {
        punto[k - 1][0] = punt[k - 1][0];
        punto[k - 1][1] = replace(punt[k - 1][1], "&nbsp;", "", 1, 20, 1);
        punto[k - 1][2] = punt[k - 1][2];
        punto[k - 1][3] = punt[k - 1][3];
        punto[k - 1][4] = punt[k - 1][4];
        punto[k - 1][5] = punt[k - 1][5];
        punto[k - 1][6] = punt[k - 1][6];
        punto[k - 1][7] = punt[k - 1][7];
        puntos[k - 1][0] = punt[k - 1][0];
        puntos[k - 1][1] = replace(punt[k - 1][1], "&nbsp;", "", 1, 20, 1);
        puntos[k - 1][2] = punt[k - 1][2];
        puntos[k - 1][3] = punt[k - 1][3];
        puntos[k - 1][4] = punt[k - 1][4];
        puntos[k - 1][5] = punt[k - 1][5];
        puntos[k - 1][6] = punt[k - 1][6];
        puntos[k - 1][7] = punt[k - 1][7];
        if (right(punto[k - 1][1], 2) === "LL" && punto[k - 1][1].length > 3) {
          llcount = llcount + 1;
        }
        if (punto[k - 1][1].length > 3) {
          totalcount = totalcount + 1;
        }
      }

      let llaverage = llcount / totalcount;
      puntospointer = puntpointer;
      puntopointer = puntpointer;
      let lastpunto = "";

      for (let k = 0; k <= puntospointer - 1; k++) {
        if (punto[k][3] !== "" && punto[k][3] >= 0) {
          if (puntos[k][0].length < 10) {
            puntos[k][0] = hora0;
          }
          puntos[k][1] = replace(puntos[k][1], "db", "", 1, 1, 1);
          if (puntos[k][1].length > 3 && puntos[k][0] !== lastpunto) {
            if (getParamSafe("detail") === "on") {
              window.trayecto.push([
                puntos[k][0],
                left(puntos[k][1], 6),
                puntos[k][2],
                puntos[k][3],
              ]);
              lastpunto = puntos[k][0];
            } else {
              if (getParamSafe("detail") === "") {
                window.trayecto.push([
                  puntos[k][0],
                  left(puntos[k][1], 6),
                  puntos[k][2],
                  puntos[k][3],
                ]);
                lastpunto = puntos[k][0];
              }
            }
          }
        }
      }

      puntopointer = puntopointer - 1;

      for (let m = 1; m <= puntopointer + 2; m++) {
        punto[m - 1][0] = punto[m][0];
        punto[m - 1][1] = punto[m][1];
        punto[m - 1][2] = punto[m][2];
        punto[m - 1][3] = punto[m][3];
        punto[m - 1][4] = punto[m][4];
        punto[m - 1][5] = punto[m][5];
        punto[m - 1][6] = punto[m][6];
        punto[m - 1][7] = punto[m][7];
      }
      lastpunto = "";
      let bid = false;
      if (
        getParamSafe("balloonid") !== "" ||
        trim(getParamSafe("tracker")) !== "zachtek1" ||
        getParamSafe("tracker") !== "6locators"
      ) {
        bid = true;
      }
      if (getParamSafe("balloonid") === "") {
        bid = false;
      }
      if (
        trim(getParamSafe("tracker")) === "zachtek1" ||
        getParamSafe("tracker") === "6locators"
      ) {
        bid = true;
      }

      let veloci = 0;
      let distancia = 0;
      let lasttiempo = "";
      let tiempo = 0;

      for (let k = 0; k <= puntopointer + 2; k++) {
        if (punto[k][3] !== "" && punto[k][3] >= 0) {
          if (punto[k][0].length < 10) {
            punto[k][0] = hora0;
          }
          punto[k][1] = replace(punto[k][1], "db", "", 1, 1, 1);
          let estax = false;
          // for (let w = 0; w <= ubound(omi); w++) {
          //     if (window.omi[w] === punto[k][1]) {
          //         estax = true;
          //     }
          // }

          let llCheck = llaverage < 1;
          let llSuffixCheck = !(punto[k][1].slice(-2) === "LL");

          let xorResult = llCheck !== llSuffixCheck;

          let usell = !xorResult;

          if (
            punto[k][1].length > 3 &&
            punto[k][0] !== lastpunto &&
            !estax &&
            usell
          ) {
            if (punto[k][1].length > 3 && lastpunto !== "") {
              distancia =
                crsdist(
                  loctolatlon(punto[k][1]).lat,
                  loctolatlon(punto[k][1]).lon,
                  loctolatlon(lastpunto).lat,
                  loctolatlon(lastpunto).lon,
                ).distance * 1.852;
              if (lasttiempo !== "") {
                const currentTime = new Date(punto[k][0].replace(/z/gi, ""));
                const lastTime = new Date(lasttiempo.replace(/z/gi, ""));
                tiempo = dateDiff("s", currentTime, lastTime);
              }

              if (tiempo > 0) {
                veloci = (distancia * 3600) / tiempo;
              }
            }
            if (lastpunto !== punto[k][1]) {
              lastpunto = punto[k][1];
              lasttiempo = punto[k][0];
            }
            if (veloci < 301) {
              window.beacon1.push([
                punto[k][0],
                left(punto[k][1], 6),
                punto[k][2],
                punto[k][3],
                punto[k][4],
                punto[k][5],
                punto[k][6],
                punto[k][7],
              ]);
            }
          }
        }
      }

      if (window.beacon1.length < 10) {
        window.beacon1 = [];
      }
      if (trayecto.length < 10) {
        trayecto = [];
      }
      if (flechas.length < 5) {
        flechas = [];
      }

      let altutext = "";

      if (puntopointer > -1 && isDate(left(punto[0][0], 16))) {
        const TZDiff = -180 * 60 * 1000;
        let hlocal = cDate(left(punto[0][0], 16)) - TZDiff;
        let horalocal =
          "<br>Local: " +
          String(new Date(hlocal).getHours()).padStart(2, "0") +
          ":" +
          String(new Date(hlocal).getMinutes()).padStart(2, "0");
        hora = `${mes[mid(punto[0][0], 6, 2)]}-${mid(punto[0][0], 9, 2)} ${mid(punto[0][0], 12, 5)}`;
        if (punto[0][3] == "130") {
          punto[0][3] = "11120";
        }
        if (punto[0][1].length === 6) {
          locatorx = left(punto[0][1], 4) & lcase(right(punto[0][1], 2));
        } else {
          locatorx = punto[0][1];
        }
        for (let h = 0; h <= ubound(punto); h++) {
          if (punto[h][1].length > 4 && ucase(right(punto[h][1], 2)) !== "LL") {
            locatorx = punto[h][1];
            break;
          }
        }
        if (Altfinal !== "") {
          punto[0][3] = Altfinal;
        }
        if (TempFinal !== "") {
          punto[0][2] = TempFinal;
        }
        if (VoltFinal !== "") {
          punto[0][4] = VoltFinal;
        }
        if (GPSfinal !== "") {
          GPSx = "<br>GPS-Sats: " + GPSfinal;
        } else {
          GPSx = "";
        }
        if (decoqr1 !== "") {
          GPSx = "<br>" + decoqr1;
        }
        altutext = "<br>Alt.: " + "0" + "&nbsp;m.";
        for (let z = 0; z <= ubound(punto); z++) {
          if (
            punto[z][3] !== "" &&
            punto[z][3] != 15000 &&
            punto[z][3] != 14000 &&
            punto[z][3] != 3000 &&
            punto[z][3] != 4000 &&
            punto[z][3] > 360 &&
            punto[z][3] != 12000
          ) {
            altutext =
              "<br>Alt.: " +
              punto[z][3] +
              "&nbsp;m.&nbsp;&nbsp;<br>Alt.: " +
              parseInt(punto[z][3]) * 3.28084 +
              " feet";
            break;
          }
        }
        let temptext = "";
        for (let z = 0; z <= ubound(punto); z++) {
          if (punto[z][2].length > 1 && trim(punto[z][2]) !== "?") {
            temptext = "<br>Temperat: " + punto[z][2] + "&deg;C";
            break;
          }
        }
        let batetext = "";
        for (let z = 0; z <= ubound(punto); z++) {
          if (punto[z][4].length > 2 && punto[z][4] !== "?") {
            batetext =
              "<br>Bat/Sol: " + replace(punto[z][4], "V", "") * 1 + "Volts";
            break;
          }
        }
        if (trim(getParamSafe("tracker")) !== "") {
          trackertext = "<br>Tracker: " + trim(lcase(getParamSafe("tracker")));
        }
        if (getParamSafe("SSID") !== "") {
          addss =
            "APRS: " +
            "<a href=http:\/\/aprs.fi?call=" +
            ucase(getParamSafe("other")) +
            "-" +
            getParamSafe("SSID") +
            "&timerange=604800&tail=604800&mt=hybrid" +
            " title=\'See in APRS&#13If uploaded\' target=_blank><u style=\'line-height:13px;color:green;\'>" +
            ucase(trim(getParamSafe("other"))) +
            "-" +
            getParamSafe("SSID") +
            "</u></a><br>";
        } else {
          addss = "";
        }
        if (decoqrf !== "") {
          if (decoqrf.length > 16) {
            decoqrfm =
              replace(left(decoqrf, 17), "T#", "T1", 1, 1, 1) +
              "<br>T2 " +
              right(decoqrf, 13);
          }
        } else {
          decoqrfm = decoqrf;
        }
        if (decoqrf !== "") {
          trackertext = trackertext + "<br>" + decoqrfm;
        }
        mapainicio = [
          locatorx,
          licenciao +
            "<br>" +
            addss +
            hora +
            "z" +
            horalocal +
            "<br>Power: " +
            power +
            "<br>Locator: " +
            locatorx +
            altutext +
            temptext +
            batetext +
            GPSx +
            replace(
              replace(
                replace(
                  trackertext,
                  "<span class='narrow' style='color:black;'>",
                  "",
                  1,
                  300,
                  1,
                ),
                "<span class='narrow' style='color:gray;'>",
                "",
                1,
                300,
                1,
              ),
              "</span>",
              "",
              1,
              300,
              1,
            ) +
            "<span id=globo></span>" +
            punto[0][6] +
            "<br><a href=# onclick='gowinds1()' style='color: #3333ff;line-height:13px;overflow:hidden;font-weight:bold;white-space:nowrap;cursor:pointer;'><u>Click for Winds</u></a>",
        ];

        //"ponermapa ('"& locatorx &"','"& licenciao & "<br>" & addss & hora &  "z" & horalocal &"<br>Power: " & power & "<br>Locator: " & locatorx & altutext & temptext & batetext & GPSx & replace(replace(replace(trackertext,"<span class='narrow' style='color:black;'>","",1,300,1),"<span class='narrow' style='color:gray;'>","",1,300,1),"</span>","",1,300,1) & "<span id=globo></span>" & punto(0,6) &  "<br><a href=# onclick =""gowinds1()"" style=""color: #3333ff;line-height:13px;overflow:hidden//;font-weight:bold;white-space:nowrap;cursor:pointer;""><u>Click for Winds</u></a>" & "')" & vbCrLf

        window.locations[0] = [
          locatorx,
          licenciao +
            "<br>" +
            addss +
            hora +
            "z" +
            horalocal +
            "<br>Power: " +
            power +
            "<br>Locator: " +
            locatorx +
            altutext +
            temptext +
            batetext +
            GPSx +
            replace(
              replace(
                replace(
                  trackertext,
                  "<span class='narrow' style='color:black;'>",
                  "",
                  1,
                  300,
                  1,
                ),
                "<span class='narrow' style='color:gray;'>",
                "",
                1,
                300,
                1,
              ),
              "</span>",
              "",
              1,
              300,
              1,
            ) +
            punto[0][6] +
            " <br><a href=# onclick='gowinds1()' style='color: #3333ff;line-height:13px;overflow:hidden;font-weight:bold;white-space:nowrap;cursor:pointer;'><u>Click for Winds</u></a>",
        ];
      }

      window.showcapture = mid(punto[0][0], 9, 8) !== mid(hora, 5, 8);
      let addplus = "";

      if (avgfreq - fcentral < 10 && avgfreq - fcentral > -1) {
        addplus =
          "<span style='color:#ffffff;'>&#x25B3;+" +
          (avgfreq - fcentral) +
          "Hz</span>";
        window.addplusm = " \u25B3+" + (avgfreq - fcentral) + "Hz. ";
      }
      if (avgfreq - fcentral < 0 && avgfreq - fcentral > -10) {
        addplus =
          "<span style='color:#ffffff;'>&#x25B3;" +
          avgfreq -
          fcentral +
          "Hz</span>";
        window.addplusm = " \u25B3" + (avgfreq - fcentral) + "Hz. ";
      }
      if (avgfreq - fcentral > 9) {
        addplus =
          "<span style='color:#ff6e5e;'>&#x25B3;+" +
          (avgfreq - fcentral) +
          "Hz</span>";
        window.addplusm = " \u25B3+" + (avgfreq - fcentral) + "Hz. ";
      }
      if (avgfreq - fcentral < -9) {
        addplus =
          "<span style='color:#ff6e5e;'>&#x25B3;" +
          (avgfreq - fcentral) +
          "Hz</span>";
        window.addplusm = " \u25B3" + (avgfreq - fcentral) + "Hz. ";
      }
      document.getElementById("addPlus").innerHTML = addplus;

      return {
        error: false,
        output: `${output}`,
        //distavar,
        distakm,
        tele1,
        tablax,
        tablam,
        avgfreq,
        mapainicio,
      };
    }

    async function processAll() {
      const wsprProcessQueryResult = await processWSPRQuery(tablaheader);

      if (wsprProcessQueryResult.error) {
        console.log(
          "Error:",
          wsprProcessQueryResult.message || wsprProcessQueryResult.output,
        );
        document
          .getElementById("telemetryTableContainer")
          .insertAdjacentHTML("beforeend", wsprProcessQueryResult.output);
        return;
      }

      console.log("Success:", wsprProcessQueryResult);

      document
        .getElementById("telemetryTableContainer")
        .insertAdjacentHTML("beforeend", wsprProcessQueryResult.output);

      const { pag, cuenta, getURLreporters1 } = wsprProcessQueryResult;

      const telemetryProcessResult = await processTelemetryData({
        pag,
        getURLreporters1,
        output: "",
        cuenta,
      });

      console.log("telemetry - result:", telemetryProcessResult);

      if (telemetryProcessResult.error) {
        console.log(
          "Error:",
          telemetryProcessResult.message || telemetryProcessResult.output,
        );
        // document.getElementById("tableMap").insertAdjacentHTML('beforeend', telemetryProcessResult.output);
        return;
      }

      document
        .getElementById("telemetryTable")
        .insertAdjacentHTML("beforeend", telemetryProcessResult.output);
      document.getElementById("telemetryTableLoader").classList.add("hidden");

      window.beacon1 = beaconOrig();
      carga();
      ponermapa(
        telemetryProcessResult.mapainicio[0],
        telemetryProcessResult.mapainicio[1],
      );
    }

    processAll();
  })();
});

function beaconOrig() {
  return [
    [
      "2025-07-21 03:30:00z",
      "RG05XE",
      "15",
      "12380",
      "4.80",
      "157",
      "<br>VK5KJP/1 -11",
      "14097065",
    ],
    [
      "2025-07-21 03:10:00z",
      "RG05NH",
      "3",
      "12340",
      "3.00",
      "153",
      "<br>VK5KJP/1 -12",
      "14097066",
    ],
    [
      "2025-07-21 02:50:00z",
      "RG05EJ",
      "5",
      "12340",
      "3.05",
      "85",
      "<br>VK5KJP/1 -11",
      "14097067",
    ],
    [
      "2025-07-21 02:20:00z",
      "QG95OL",
      "10",
      "12300",
      "3.00",
      "93",
      "<br>VK5KJP/1 -16",
      "14097068",
    ],
    [
      "2025-07-21 02:00:00z",
      "QG95EL",
      "15",
      "12320",
      "4.90",
      "161",
      "<br>VK5KJP/1 -10",
      "14097066",
    ],
    [
      "2025-07-21 01:50:00z",
      "QG85XL",
      "14",
      "12300",
      "3.10",
      "85",
      "<br>VK5KJP/1 -8",
      "14097065",
    ],
    [
      "2025-07-21 01:30:00z",
      "QG85NL",
      "14",
      "12300",
      "4.30",
      "93",
      "<br>VK5KJP/1 -4",
      "14097065",
    ],
    [
      "2025-07-21 01:10:00z",
      "QG85DK",
      "15",
      "12340",
      "3.00",
      "85",
      "<br>VK5KJP/1 -10",
      "14097065",
    ],
    [
      "2025-07-21 01:00:00z",
      "QG75XK",
      "13",
      "12560",
      "3.00",
      "93",
      "<br>VK5KJP/1 -8",
      "14097066",
    ],
    [
      "2025-07-21 00:40:00z",
      "QG75NK",
      "11",
      "12280",
      "4.75",
      "85",
      "<br>VK5KJP/1 -10",
      "14097065",
    ],
    [
      "2025-07-20 21:40:00z",
      "QG44CV",
      "-7",
      "12400",
      "3.35",
      "165",
      "<br>VK3KHZ -24",
      "14097069",
    ],
    [
      "2025-07-20 21:30:00z",
      "QG34WT",
      "-5",
      "12320",
      "3.30",
      "157",
      "<br>ZL1KFM -22",
      "14097068",
    ],
    [
      "2025-07-19 09:10:00z",
      "MG36",
      "9",
      "12360",
      "3.00",
      "85",
      "<br>VK6PVL -20",
      "14097072",
    ],
    [
      "2025-07-19 08:50:00z",
      "MG36AE",
      "8",
      "12340",
      "3.40",
      "85",
      "<br>F61695 -18",
      "14097072",
    ],
    [
      "2025-07-19 08:40:00z",
      "MG26WF",
      "12",
      "12420",
      "3.25",
      "165",
      "<br>F61695 -16",
      "14097070",
    ],
    [
      "2025-07-19 08:20:00z",
      "MG26TI",
      "13",
      "12560",
      "4.80",
      "97",
      "<br>F61695 -23",
      "14097072",
    ],
    [
      "2025-07-19 08:00:00z",
      "MG26PL",
      "3",
      "12520",
      "4.90",
      "165",
      "<br>F61695 -13",
      "14097070",
    ],
    [
      "2025-07-19 07:40:00z",
      "MG26MN",
      "19",
      "12360",
      "4.60",
      "85",
      "<br>F61695 -16",
      "14097072",
    ],
    [
      "2025-07-19 07:20:00z",
      "MG26JQ",
      "24",
      "12460",
      "4.85",
      "157",
      "<br>F61695 -12",
      "14097072",
    ],
    [
      "2025-07-19 07:00:00z",
      "MG26GS",
      "20",
      "12440",
      "4.80",
      "150",
      "<br>F61695 -20",
      "14097072",
    ],
    [
      "2025-07-18 10:30:00z",
      "KG95LV",
      "8",
      "12560",
      "3.00",
      "116",
      "<br>ZS6BQQ -12",
      "14097072",
    ],
    [
      "2025-07-18 10:10:00z",
      "KG96GA",
      "16",
      "12620",
      "4.75",
      "112",
      "<br>A2NEW -5",
      "14097069",
    ],
    [
      "2025-07-18 09:50:00z",
      "KG96CC",
      "20",
      "12600",
      "4.85",
      "104",
      "<br>A2NEW -13",
      "14097069",
    ],
    [
      "2025-07-18 09:30:00z",
      "KG86WF",
      "18",
      "12580",
      "4.95",
      "116",
      "<br>FR5DN -11",
      "14097069",
    ],
    [
      "2025-07-18 09:10:00z",
      "KG86SI",
      "21",
      "12580",
      "4.80",
      "108",
      "<br>A2NEW -19",
      "14097074",
    ],
    [
      "2025-07-18 08:50:00z",
      "KG86OK",
      "21",
      "12580",
      "4.85",
      "112",
      "<br>A2NEW -13",
      "14097072",
    ],
    [
      "2025-07-18 08:30:00z",
      "KG86HO",
      "15",
      "0",
      "4.90",
      "151",
      "<br>FR5DN -24",
      "14097076",
    ],
    [
      "2025-07-18 05:30:00z",
      "KG67VD",
      "-2",
      "12600",
      "3.30",
      "108",
      "<br>FR5DN -15",
      "14097077",
    ],
    [
      "2025-07-17 13:00:00z",
      "JH70RC",
      "10",
      "12800",
      "4.25",
      "104",
      "<br>FR5DN -20",
      "14097074",
    ],
    [
      "2025-07-17 12:40:00z",
      "JH70ND",
      "16",
      "12820",
      "4.90",
      "120",
      "<br>ZS6GL -22",
      "14097075",
    ],
    [
      "2025-07-17 12:20:00z",
      "JH70IF",
      "14",
      "12840",
      "4.95",
      "112",
      "<br>A2NEW -26",
      "14097072",
    ],
    [
      "2025-07-17 12:00:00z",
      "JH70EH",
      "19",
      "12780",
      "4.85",
      "101",
      "<br>A2NEW -23",
      "14097071",
    ],
    [
      "2025-07-17 11:40:00z",
      "JH70AJ",
      "16",
      "12780",
      "3.05",
      "112",
      "<br>A2NEW -28",
      "14097079",
    ],
    [
      "2025-07-17 11:30:00z",
      "JH60WK",
      "15",
      "12760",
      "4.85",
      "112",
      "<br>A2NEW -23",
      "14097057",
    ],
    [
      "2025-07-17 10:30:00z",
      "JH60KQ",
      "21",
      "12760",
      "4.75",
      "104",
      "<br>A2NEW -25",
      "14097070",
    ],
    [
      "2025-07-17 10:10:00z",
      "JH60GS",
      "25",
      "12760",
      "4.65",
      "104",
      "<br>V51RS -23",
      "14097078",
    ],
    [
      "2025-07-17 09:20:00z",
      "JH50SW",
      "26",
      "0",
      "4.80",
      "155",
      "<br>A2NEW -26",
      "14097038",
    ],
    [
      "2025-07-17 06:00:00z",
      "JH40CX",
      "-21",
      "12700",
      "3.30",
      "128",
      "<br>ZD7GB -22",
      "14097065",
    ],
    [
      "2025-07-16 14:30:00z",
      "IG28PQ",
      "14",
      "12700",
      "4.80",
      "159",
      "<br>ZD7GB -19",
      "14097066",
    ],
    [
      "2025-07-16 14:10:00z",
      "IG28JS",
      "14",
      "12740",
      "4.75",
      "155",
      "<br>ZD7GB -20",
      "14097066",
    ],
    [
      "2025-07-16 13:50:00z",
      "IG28DT",
      "18",
      "12740",
      "4.95",
      "155",
      "<br>ZD7GB -18",
      "14097065",
    ],
    [
      "2025-07-16 13:30:00z",
      "IG18VW",
      "24",
      "12760",
      "4.45",
      "159",
      "<br>ZD7GB -20",
      "14097065",
    ],
    [
      "2025-07-16 13:10:00z",
      "IG19PA",
      "14",
      "12760",
      "4.80",
      "159",
      "<br>ZD7GB -18",
      "14097065",
    ],
    [
      "2025-07-16 12:50:00z",
      "IG19JC",
      "21",
      "12760",
      "4.70",
      "159",
      "<br>ZD7GB -21",
      "14097066",
    ],
    [
      "2025-07-16 12:30:00z",
      "IG19DF",
      "18",
      "12740",
      "4.85",
      "147",
      "<br>ZD7GB -24",
      "14097065",
    ],
    [
      "2025-07-16 12:10:00z",
      "IG09VI",
      "24",
      "12740",
      "4.70",
      "155",
      "<br>ZD7GB -19",
      "14097065",
    ],
    [
      "2025-07-15 16:10:00z",
      "HH29QV",
      "16",
      "12820",
      "3.15",
      "111",
      "<br>PT2FHC -23",
      "14097064",
    ],
    [
      "2025-07-15 15:40:00z",
      "HI20OA",
      "19",
      "12820",
      "4.95",
      "115",
      "<br>PT2FHC -24",
      "14097064",
    ],
    [
      "2025-07-15 15:20:00z",
      "HI20MB",
      "13",
      "12820",
      "4.90",
      "115",
      "<br>PT2FHC -24",
      "14097063",
    ],
    [
      "2025-07-15 15:00:00z",
      "HI20LC",
      "17",
      "12820",
      "4.80",
      "115",
      "<br>PT2FHC -24",
      "14097064",
    ],
    [
      "2025-07-15 14:40:00z",
      "HI20KE",
      "14",
      "12840",
      "4.80",
      "115",
      "<br>PT2FHC -22",
      "14097064",
    ],
    [
      "2025-07-15 14:20:00z",
      "HI20IF",
      "18",
      "12860",
      "4.85",
      "122",
      "<br>PT2FHC -22",
      "14097064",
    ],
    [
      "2025-07-15 13:40:00z",
      "HI20FG",
      "17",
      "12840",
      "4.80",
      "115",
      "<br>PT2FHC -24",
      "14097064",
    ],
    [
      "2025-07-15 13:20:00z",
      "HI20DG",
      "8",
      "12860",
      "3.10",
      "115",
      "<br>PT2FHC -27",
      "14097064",
    ],
    [
      "2025-07-15 13:00:00z",
      "HI20CG",
      "7",
      "12860",
      "3.10",
      "126",
      "<br>PT2FHC -24",
      "14097063",
    ],
    [
      "2025-07-15 12:00:00z",
      "HI10VG",
      "19",
      "12820",
      "4.80",
      "126",
      "<br>PT2FHC -26",
      "14097065",
    ],
    [
      "2025-07-15 09:40:00z",
      "HI10IF",
      "1",
      "12840",
      "3.10",
      "130",
      "<br>W4HOD -28",
      "14097066",
    ],
    [
      "2025-07-14 17:40:00z",
      "GH68HH",
      "4",
      "12840",
      "4.85",
      "150",
      "<br>LU3DJ -21",
      "14097066",
    ],
    [
      "2025-07-14 17:20:00z",
      "GH68EG",
      "4",
      "12880",
      "3.00",
      "122",
      "<br>PY2GN -18",
      "14097065",
    ],
    [
      "2025-07-14 17:00:00z",
      "GH68CF",
      "8",
      "12820",
      "3.00",
      "126",
      "<br>PY2GN -19",
      "14097065",
    ],
    [
      "2025-07-14 16:40:00z",
      "GH58XE",
      "8",
      "12840",
      "3.05",
      "130",
      "<br>PY2GN -21",
      "14097065",
    ],
    [
      "2025-07-14 16:20:00z",
      "GH58VC",
      "19",
      "12840",
      "4.75",
      "157",
      "<br>PY2GN -20",
      "14097064",
    ],
    [
      "2025-07-14 16:00:00z",
      "GH58SB",
      "21",
      "12840",
      "4.75",
      "153",
      "<br>PY2GN -12",
      "14097064",
    ],
    [
      "2025-07-14 15:40:00z",
      "GH57QX",
      "14",
      "12840",
      "3.00",
      "146",
      "<br>PY2GN -18",
      "14097065",
    ],
    [
      "2025-07-14 15:20:00z",
      "GH57NW",
      "9",
      "12860",
      "3.10",
      "157",
      "<br>PY2GN -12",
      "14097066",
    ],
    [
      "2025-07-14 15:00:00z",
      "GH57LV",
      "5",
      "12840",
      "3.10",
      "153",
      "<br>PY2GN -14",
      "14097066",
    ],
    [
      "2025-07-14 14:40:00z",
      "GH57IT",
      "12",
      "12880",
      "4.85",
      "151",
      "<br>PY2GN -20",
      "14097051",
    ],
    [
      "2025-07-14 14:20:00z",
      "GH57GR",
      "10",
      "12840",
      "3.05",
      "142",
      "<br>LU3DJ -18",
      "14097052",
    ],
    [
      "2025-07-14 14:00:00z",
      "GH57DQ",
      "14",
      "12840",
      "4.95",
      "161",
      "<br>LU3DJ -16",
      "14097066",
    ],
    [
      "2025-07-14 13:40:00z",
      "GH57AO",
      "8",
      "12840",
      "4.90",
      "157",
      "<br>LU3DJ -17",
      "14097066",
    ],
    [
      "2025-07-14 13:30:00z",
      "GH47XO",
      "2",
      "12840",
      "3.30",
      "146",
      "<br>PY2GN -22",
      "14097066",
    ],
    [
      "2025-07-14 13:10:00z",
      "GH47UM",
      "6",
      "12820",
      "4.00",
      "150",
      "<br>PY2GN -21",
      "14097065",
    ],
    [
      "2025-07-13 20:00:00z",
      "FH85JC",
      "6",
      "12840",
      "3.05",
      "89",
      "<br>LU8MIL -20",
      "14097051",
    ],
    [
      "2025-07-13 18:40:00z",
      "FH74UU",
      "16",
      "12840",
      "4.80",
      "161",
      "<br>LU3DJ -24",
      "14097064",
    ],
    [
      "2025-07-13 18:20:00z",
      "FH74RT",
      "16",
      "12840",
      "4.80",
      "161",
      "<br>PY2GN -26",
      "14097065",
    ],
    [
      "2025-07-13 16:20:00z",
      "FH74AP",
      "15",
      "12880",
      "4.60",
      "146",
      "<br>LU8MIL -26",
      "14097067",
    ],
    [
      "2025-07-13 16:10:00z",
      "FH64WO",
      "14",
      "12860",
      "4.95",
      "161",
      "<br>PY2GN -22",
      "14097066",
    ],
    [
      "2025-07-13 15:20:00z",
      "FH64PM",
      "6",
      "12880",
      "4.90",
      "146",
      "<br>KD7EFG-1 -25",
      "14097068",
    ],
    [
      "2025-07-09 01:40:00z",
      "DI17OH",
      "-12",
      "12820",
      "3.45",
      "142",
      "<br>W1CK -19",
      "14097063",
    ],
    [
      "2025-07-08 23:00:00z",
      "DI08WK",
      "22",
      "12680",
      "4.90",
      "150",
      "<br>W1CK -26",
      "14097063",
    ],
    [
      "2025-07-08 17:30:00z",
      "CI99IO",
      "3",
      "12800",
      "4.95",
      "150",
      "<br>W1CK -26",
      "14097066",
    ],
    [
      "2025-07-06 00:50:00z",
      "AH66QN",
      "10",
      "12540",
      "3.10",
      "146",
      "<br>VK4EMM -28",
      "14097064",
    ],
    [
      "2025-07-06 00:00:00z",
      "AH66KE",
      "8",
      "12760",
      "4.95",
      "161",
      "<br>ZL1KFM -21",
      "14097064",
    ],
    [
      "2025-07-05 23:40:00z",
      "AH66HA",
      "16",
      "12720",
      "4.90",
      "85",
      "<br>ZL1KFM -16",
      "14097064",
    ],
    [
      "2025-07-05 23:30:00z",
      "AH65GV",
      "18",
      "12600",
      "3.00",
      "85",
      "<br>VK4DL/SDR1 -24",
      "14097063",
    ],
    [
      "2025-07-05 22:30:00z",
      "AH55XF",
      "13",
      "12720",
      "4.90",
      "85",
      "<br>ZL1KFM -20",
      "14097063",
    ],
    [
      "2025-07-05 22:10:00z",
      "AH54UX",
      "21",
      "12720",
      "4.65",
      "116",
      "<br>VK5KJP/1 -14",
      "14097064",
    ],
    [
      "2025-07-05 21:50:00z",
      "AH54SQ",
      "20",
      "12660",
      "4.70",
      "116",
      "<br>ZL2005SWL -21",
      "14097064",
    ],
    [
      "2025-07-05 21:00:00z",
      "AH53MW",
      "19",
      "12720",
      "4.95",
      "124",
      "<br>VK4DL/SDR1 -23",
      "14097063",
    ],
    [
      "2025-07-05 20:40:00z",
      "AH53JP",
      "13",
      "12700",
      "3.55",
      "143",
      "<br>ZL2005SWL -25",
      "14097063",
    ],
    [
      "2025-07-05 20:00:00z",
      "AH52CS",
      "-4",
      "0",
      "4.90",
      "84",
      "<br>ZL1KFM -21",
      "14097064",
    ],
    [
      "2025-07-05 19:20:00z",
      "AH42VE",
      "10",
      "12680",
      "3.10",
      "155",
      "<br>VK5KJP/1 -10",
      "14097064",
    ],
    [
      "2025-07-05 01:50:00z",
      "QF58WB",
      "10",
      "12380",
      "3.15",
      "139",
      "<br>VK5KJP/1 -7",
      "14097065",
    ],
    [
      "2025-07-04 04:40:00z",
      "OG71GI",
      "8",
      "12520",
      "3.15",
      "108",
      "<br>VK6PVL -17",
      "14097072",
    ],
    [
      "2025-07-04 02:50:00z",
      "OF58ET",
      "5",
      "12500",
      "4.90",
      "112",
      "<br>VK5KJP/1 -13",
      "14097070",
    ],
    [
      "2025-07-04 02:20:00z",
      "OF48OF",
      "12",
      "12520",
      "4.95",
      "120",
      "<br>VK6XT -3",
      "14097069",
    ],
    [
      "2025-07-04 01:10:00z",
      "OF37BB",
      "-4",
      "12500",
      "3.45",
      "124",
      "<br>VK6PVL -11",
      "14097067",
    ],
    [
      "2025-07-03 08:40:00z",
      "MG48EK",
      "18",
      "12680",
      "3.10",
      "99",
      "<br>F61695 -20",
      "14097070",
    ],
    [
      "2025-07-03 08:20:00z",
      "MG38WQ",
      "21",
      "12760",
      "4.85",
      "103",
      "<br>F61695 -19",
      "14097069",
    ],
    [
      "2025-07-03 08:00:00z",
      "MG38RW",
      "15",
      "12680",
      "4.80",
      "84",
      "<br>F61695 -20",
      "14097069",
    ],
    [
      "2025-07-03 07:50:00z",
      "MG39OB",
      "14",
      "12700",
      "3.00",
      "87",
      "<br>VK6PVL -13",
      "14097071",
    ],
    [
      "2025-07-03 07:30:00z",
      "MG39IG",
      "16",
      "12680",
      "4.90",
      "95",
      "<br>F61695 -17",
      "14097071",
    ],
    [
      "2025-07-03 07:00:00z",
      "MG29XN",
      "5",
      "12680",
      "3.25",
      "151",
      "<br>F61695 -17",
      "14097071",
    ],
    [
      "2025-07-03 06:40:00z",
      "MG29SS",
      "15",
      "12700",
      "4.75",
      "143",
      "<br>F61695 -22",
      "14097071",
    ],
    [
      "2025-07-02 05:20:00z",
      "LG14VQ",
      "1",
      "12640",
      "3.25",
      "128",
      "<br>FR5DN -11",
      "14097076",
    ],
    [
      "2025-07-01 15:00:00z",
      "KG26HE",
      "2",
      "12660",
      "3.30",
      "136",
      "<br>ZS1Q -27",
      "14097076",
    ],
    [
      "2025-07-01 11:40:00z",
      "KG08LO",
      "17",
      "12740",
      "3.10",
      "120",
      "<br>ZS6WBT -23",
      "14097071",
    ],
    [
      "2025-07-01 11:20:00z",
      "KG08HU",
      "23",
      "12760",
      "4.45",
      "116",
      "<br>ZS6WBT -23",
      "14097070",
    ],
    [
      "2025-07-01 11:00:00z",
      "KG09DC",
      "18",
      "12760",
      "4.75",
      "124",
      "<br>ZS6WBT -21",
      "14097068",
    ],
    [
      "2025-07-01 10:40:00z",
      "KG09AI",
      "19",
      "12740",
      "4.85",
      "116",
      "<br>FR5DN -17",
      "14097067",
    ],
    [
      "2025-07-01 10:30:00z",
      "JG99WL",
      "17",
      "12820",
      "4.95",
      "112",
      "<br>ZS6WBT -24",
      "14097070",
    ],
    [
      "2025-07-01 10:10:00z",
      "JG99TR",
      "17",
      "12880",
      "4.90",
      "108",
      "<br>V51RS -17",
      "14097065",
    ],
    [
      "2025-07-01 09:50:00z",
      "JG99QW",
      "20",
      "12760",
      "3.00",
      "112",
      "<br>V51RS -16",
      "14097065",
    ],
    [
      "2025-06-30 13:40:00z",
      "JH59GO",
      "11",
      "12740",
      "3.05",
      "130",
      "<br>V51RS 3",
      "14097087",
    ],
    [
      "2025-06-30 13:20:00z",
      "JH59FS",
      "8",
      "12760",
      "4.75",
      "130",
      "<br>V51RS -1",
      "14097065",
    ],
    [
      "2025-06-30 13:00:00z",
      "JH59FV",
      "14",
      "12700",
      "4.85",
      "118",
      "<br>V51RS -4",
      "14097065",
    ],
    [
      "2025-06-30 12:40:00z",
      "JI50FB",
      "10",
      "12660",
      "3.25",
      "134",
      "<br>V51RS -1",
      "14097064",
    ],
    [
      "2025-06-30 12:20:00z",
      "JI50EE",
      "14",
      "12820",
      "4.95",
      "122",
      "<br>V51RS 0",
      "14097054",
    ],
    [
      "2025-06-30 12:00:00z",
      "JI50EI",
      "20",
      "12700",
      "4.80",
      "130",
      "<br>ZS6EMS -1",
      "14097064",
    ],
    [
      "2025-06-30 11:40:00z",
      "JI50EL",
      "28",
      "12720",
      "4.55",
      "126",
      "<br>ZD7GB -6",
      "14097063",
    ],
    [
      "2025-06-30 11:20:00z",
      "JI50DO",
      "22",
      "12720",
      "4.75",
      "122",
      "<br>ZD7GB -9",
      "14097065",
    ],
    [
      "2025-06-30 11:00:00z",
      "JI50DR",
      "19",
      "12720",
      "4.75",
      "122",
      "<br>V51RS -4",
      "14097064",
    ],
    [
      "2025-06-30 10:40:00z",
      "JI50DV",
      "27",
      "12700",
      "4.70",
      "130",
      "<br>V51RS -9",
      "14097065",
    ],
    [
      "2025-06-30 10:20:00z",
      "JI51DA",
      "23",
      "12660",
      "4.75",
      "126",
      "<br>V51RS -11",
      "14097065",
    ],
    [
      "2025-06-30 10:00:00z",
      "JI51DE",
      "21",
      "12700",
      "4.65",
      "126",
      "<br>V51RS -9",
      "14097065",
    ],
    [
      "2025-06-30 09:40:00z",
      "JI51CH",
      "17",
      "12720",
      "3.10",
      "130",
      "<br>V51RS -2",
      "14097064",
    ],
    [
      "2025-06-30 09:20:00z",
      "JI51CK",
      "20",
      "12680",
      "4.75",
      "126",
      "<br>ZD7GB -13",
      "14097063",
    ],
    [
      "2025-06-29 16:10:00z",
      "JI65PI",
      "-9",
      "0",
      "4.80",
      "147",
      "<br>V51RS -9",
      "14097065",
    ],
    [
      "2025-06-29 15:50:00z",
      "JI65PI",
      "-8",
      "12000",
      "3.20",
      "134",
      "<br>V51RS -15",
      "14097065",
    ],
    [
      "2025-06-29 15:30:00z",
      "JI65RI",
      "-13",
      "11940",
      "3.20",
      "122",
      "<br>ZD7GB -12",
      "14097065",
    ],
    [
      "2025-06-29 15:00:00z",
      "JI65UJ",
      "-1",
      "12240",
      "3.35",
      "134",
      "<br>V51RS -10",
      "14097065",
    ],
    [
      "2025-06-29 14:40:00z",
      "JI65XK",
      "6",
      "11720",
      "3.25",
      "111",
      "<br>ZD7GB -6",
      "14097065",
    ],
    [
      "2025-06-29 14:20:00z",
      "JI75AK",
      "11",
      "0",
      "3.20",
      "147",
      "<br>V51RS -7",
      "14097064",
    ],
    [
      "2025-06-29 14:00:00z",
      "JI75BJ",
      "23",
      "10720",
      "3.00",
      "103",
      "<br>V51RS -14",
      "14097063",
    ],
    [
      "2025-06-29 13:40:00z",
      "JI75CJ",
      "28",
      "10240",
      "4.55",
      "107",
      "<br>V51RS -14",
      "14097061",
    ],
    [
      "2025-06-29 13:00:00z",
      "JI75DJ",
      "22",
      "9500",
      "4.45",
      "95",
      "<br>V51RS -9",
      "14097062",
    ],
    [
      "2025-06-29 12:40:00z",
      "JI75EJ",
      "29",
      "9740",
      "4.70",
      "95",
      "<br>V51RS -17",
      "14097062",
    ],
    [
      "2025-06-29 12:20:00z",
      "JI75EI",
      "31",
      "10080",
      "4.75",
      "107",
      "<br>V51RS -23",
      "14097062",
    ],
    [
      "2025-06-29 12:00:00z",
      "JI75FI",
      "27",
      "10780",
      "4.80",
      "99",
      "<br>V51RS -14",
      "14097063",
    ],
    [
      "2025-06-29 11:40:00z",
      "JI75GH",
      "24",
      "11380",
      "4.80",
      "118",
      "<br>V51RS -12",
      "14097062",
    ],
    [
      "2025-06-29 11:20:00z",
      "JI75IG",
      "29",
      "11660",
      "4.65",
      "130",
      "<br>V51RS -16",
      "14097062",
    ],
    [
      "2025-06-29 10:00:00z",
      "JI75MA",
      "23",
      "11140",
      "4.95",
      "118",
      "<br>V51RS -11",
      "14097064",
    ],
    [
      "2025-06-29 09:40:00z",
      "JI74OX",
      "19",
      "11780",
      "4.95",
      "115",
      "<br>V51RS -9",
      "14097064",
    ],
    [
      "2025-06-29 09:00:00z",
      "JI74RU",
      "21",
      "12240",
      "4.70",
      "130",
      "<br>V51RS -11",
      "14097065",
    ],
    [
      "2025-06-29 08:40:00z",
      "JI74TU",
      "15",
      "12340",
      "4.75",
      "118",
      "<br>ZD7GB -12",
      "14097065",
    ],
    [
      "2025-06-29 07:50:00z",
      "JI74XR",
      "16",
      "13180",
      "4.85",
      "130",
      "<br>V51RS -8",
      "14097066",
    ],
    [
      "2025-06-29 07:20:00z",
      "JI84BR",
      "10",
      "12600",
      "3.10",
      "126",
      "<br>ZD7GB -9",
      "14097066",
    ],
    [
      "2025-06-29 07:00:00z",
      "JI84DR",
      "-6",
      "12640",
      "4.40",
      "134",
      "<br>V51RS -19",
      "14097065",
    ],
    [
      "2025-06-28 13:10:00z",
      "KI05PL",
      "15",
      "12820",
      "3.05",
      "115",
      "<br>V51RS -19",
      "14097064",
    ],
    [
      "2025-06-28 12:50:00z",
      "KI05QJ",
      "14",
      "12840",
      "4.85",
      "118",
      "<br>V51RS -14",
      "14097064",
    ],
    [
      "2025-06-28 12:30:00z",
      "KI05SJ",
      "21",
      "12760",
      "4.95",
      "107",
      "<br>V51RS -18",
      "14097064",
    ],
    [
      "2025-06-28 12:10:00z",
      "KI05TI",
      "20",
      "12780",
      "4.85",
      "115",
      "<br>V51RS -18",
      "14097064",
    ],
    [
      "2025-06-28 11:50:00z",
      "KI05UH",
      "20",
      "12820",
      "4.80",
      "111",
      "<br>V51RS -19",
      "14097064",
    ],
    [
      "2025-06-28 11:30:00z",
      "KI05WH",
      "20",
      "12820",
      "4.95",
      "122",
      "<br>V51RS -12",
      "14097064",
    ],
    [
      "2025-06-28 11:10:00z",
      "KI05XH",
      "21",
      "12820",
      "4.85",
      "103",
      "<br>V51RS -18",
      "14097064",
    ],
    [
      "2025-06-28 11:00:00z",
      "KI15AG",
      "19",
      "12840",
      "4.90",
      "111",
      "<br>V51RS -18",
      "14097063",
    ],
    [
      "2025-06-28 09:10:00z",
      "KI15FF",
      "17",
      "12740",
      "4.85",
      "115",
      "<br>V51RS -15",
      "14097064",
    ],
    [
      "2025-06-28 08:50:00z",
      "KI15GF",
      "13",
      "12760",
      "4.70",
      "103",
      "<br>V51RS -16",
      "14097065",
    ],
    [
      "2025-06-28 08:30:00z",
      "KI15HF",
      "14",
      "12780",
      "4.50",
      "95",
      "<br>V51RS -19",
      "14097065",
    ],
    [
      "2025-06-27 12:40:00z",
      "KI57AI",
      "8",
      "12800",
      "4.80",
      "104",
      "<br>V51RS -23",
      "14097067",
    ],
    [
      "2025-06-27 12:20:00z",
      "KI57EL",
      "8",
      "12780",
      "3.05",
      "120",
      "<br>V51RS -26",
      "14097067",
    ],
    [
      "2025-06-27 09:30:00z",
      "KI68RH",
      "16",
      "12700",
      "4.95",
      "124",
      "<br>FR5DN -30",
      "14097073",
    ],
    [
      "2025-06-26 11:20:00z",
      "LJ90QP",
      "-3",
      "12720",
      "3.15",
      "112",
      "<br>VK6PVL -24",
      "14097064",
    ],
    [
      "2025-06-26 10:40:00z",
      "MJ00AP",
      "3",
      "12740",
      "3.05",
      "108",
      "<br>VK6PVL -23",
      "14097063",
    ],
    [
      "2025-06-25 12:40:00z",
      "MJ11DC",
      "-12",
      "12780",
      "3.50",
      "116",
      "<br>VK6PVL -20",
      "14097062",
    ],
    [
      "2025-06-25 12:20:00z",
      "MJ11DC",
      "-7",
      "12780",
      "3.05",
      "120",
      "<br>FR5DN -25",
      "14097065",
    ],
    [
      "2025-06-24 03:00:00z",
      "NJ65WH",
      "22",
      "12880",
      "4.80",
      "142",
      "<br>VK6PVL -26",
      "14097067",
    ],
    [
      "2025-06-23 04:20:00z",
      "OK01KT",
      "19",
      "13320",
      "4.90",
      "130",
      "<br>HS0ZQS -21",
      "14097064",
    ],
    [
      "2025-06-23 03:50:00z",
      "OK01NW",
      "20",
      "13180",
      "4.80",
      "150",
      "<br>HS0ZQS -22",
      "14097065",
    ],
    [
      "2025-06-23 03:00:00z",
      "OK02TE",
      "13",
      "13240",
      "4.90",
      "150",
      "<br>HS0ZQS -19",
      "14097065",
    ],
    [
      "2025-06-23 02:40:00z",
      "OK02VH",
      "17",
      "13260",
      "4.85",
      "153",
      "<br>N0HAQ -25",
      "14097067",
    ],
    [
      "2025-06-22 03:20:00z",
      "OK43FB",
      "13",
      "13200",
      "3.20",
      "95",
      "<br>N0HAQ -23",
      "14097066",
    ],
    [
      "2025-06-22 02:50:00z",
      "OK43GD",
      "17",
      "13200",
      "4.95",
      "122",
      "<br>N0HAQ -26",
      "14097066",
    ],
    [
      "2025-06-22 02:30:00z",
      "OK43HF",
      "14",
      "13280",
      "4.85",
      "118",
      "<br>N0HAQ -24",
      "14097068",
    ],
    [
      "2025-06-22 02:00:00z",
      "OK43IH",
      "-2",
      "13060",
      "3.15",
      "91",
      "<br>N0HAQ -23",
      "14097103",
    ],
    [
      "2025-06-21 08:10:00z",
      "OK53JQ",
      "-1",
      "13380",
      "3.10",
      "99",
      "<br>VR25C-75 -24",
      "14097067",
    ],
    [
      "2025-06-21 07:50:00z",
      "OK53KR",
      "5",
      "13420",
      "3.20",
      "103",
      "<br>BM2KVV -24",
      "14097066",
    ],
    [
      "2025-06-21 07:20:00z",
      "OK53LS",
      "5",
      "13520",
      "3.15",
      "99",
      "<br>N0HAQ -27",
      "14097063",
    ],
    [
      "2025-06-21 06:40:00z",
      "OK53NT",
      "22",
      "13400",
      "4.70",
      "99",
      "<br>BV7AU -25",
      "14097084",
    ],
    [
      "2025-06-21 05:40:00z",
      "OK53RV",
      "18",
      "13400",
      "4.95",
      "111",
      "<br>BM2KVV -20",
      "14097064",
    ],
    [
      "2025-06-21 05:20:00z",
      "OK53SW",
      "22",
      "13580",
      "4.80",
      "122",
      "<br>BM2KVV -23",
      "14097064",
    ],
    [
      "2025-06-21 04:50:00z",
      "OK54UA",
      "18",
      "13300",
      "4.85",
      "122",
      "<br>N0HAQ -21",
      "14097066",
    ],
    [
      "2025-06-21 04:30:00z",
      "OK54VB",
      "20",
      "13380",
      "4.85",
      "115",
      "<br>BM2KVV -20",
      "14097065",
    ],
    [
      "2025-06-21 04:10:00z",
      "OK54WC",
      "19",
      "13280",
      "4.85",
      "111",
      "<br>N0HAQ -23",
      "14097067",
    ],
    [
      "2025-06-21 03:50:00z",
      "OK64AD",
      "16",
      "13420",
      "3.00",
      "118",
      "<br>BM2KVV -21",
      "14097072",
    ],
    [
      "2025-06-21 03:30:00z",
      "OK64BE",
      "16",
      "13400",
      "4.95",
      "115",
      "<br>BV7AU -22",
      "14097064",
    ],
    [
      "2025-06-21 03:10:00z",
      "OK64CF",
      "19",
      "13400",
      "4.85",
      "111",
      "<br>BM2KVV -26",
      "14097066",
    ],
    [
      "2025-06-21 02:50:00z",
      "OK64EG",
      "21",
      "13380",
      "4.90",
      "122",
      "<br>N0HAQ -23",
      "14097064",
    ],
    [
      "2025-06-21 02:30:00z",
      "OK64FH",
      "19",
      "13400",
      "4.85",
      "126",
      "<br>BV7AU -22",
      "14097072",
    ],
    [
      "2025-06-21 02:10:00z",
      "OK64HI",
      "17",
      "13420",
      "4.85",
      "115",
      "<br>BM2KVV -23",
      "14097064",
    ],
    [
      "2025-06-21 01:50:00z",
      "OK64IJ",
      "20",
      "13400",
      "3.00",
      "122",
      "<br>BM7GUP -17",
      "14097070",
    ],
    [
      "2025-06-21 01:30:00z",
      "OK64KL",
      "19",
      "13360",
      "4.95",
      "115",
      "<br>BM2KVV -22",
      "14097065",
    ],
    [
      "2025-06-21 01:10:00z",
      "OK64LM",
      "8",
      "13380",
      "3.20",
      "122",
      "<br>BM2KVV -23",
      "14097078",
    ],
    [
      "2025-06-20 09:50:00z",
      "PK19HT",
      "-16",
      "13320",
      "3.65",
      "85",
      "<br>BG5DMW -20",
      "14097068",
    ],
    [
      "2025-06-20 07:20:00z",
      "PL20GU",
      "-1",
      "13340",
      "3.30",
      "161",
      "<br>JA5NVN -16",
      "14097064",
    ],
    [
      "2025-06-20 07:00:00z",
      "PL21JA",
      "11",
      "13380",
      "3.00",
      "165",
      "<br>BG5DMW -21",
      "14097067",
    ],
    [
      "2025-06-20 06:40:00z",
      "PL21LD",
      "13",
      "13360",
      "4.95",
      "153",
      "<br>BG5DMW -23",
      "14097067",
    ],
    [
      "2025-06-20 06:20:00z",
      "PL21OH",
      "5",
      "13340",
      "3.10",
      "153",
      "<br>JA5FFO -22",
      "14097069",
    ],
    [
      "2025-06-20 06:00:00z",
      "PL21QK",
      "16",
      "13360",
      "4.80",
      "161",
      "<br>BG5DMW -18",
      "14097064",
    ],
    [
      "2025-06-20 05:20:00z",
      "PL21VR",
      "17",
      "13300",
      "4.90",
      "157",
      "<br>JA5FFO -9",
      "14097066",
    ],
    [
      "2025-06-20 05:00:00z",
      "PL21XV",
      "16",
      "13300",
      "4.80",
      "146",
      "<br>BG5DMW -21",
      "14097068",
    ],
    [
      "2025-06-20 04:50:00z",
      "PL31AX",
      "11",
      "13320",
      "3.00",
      "146",
      "<br>BG5DMW -25",
      "14097071",
    ],
    [
      "2025-06-20 03:50:00z",
      "PL32FJ",
      "-1",
      "13240",
      "3.40",
      "134",
      "<br>JA5NVN -24",
      "14097071",
    ],
    [
      "2025-06-20 03:30:00z",
      "PL32GM",
      "-2",
      "13400",
      "3.35",
      "138",
      "<br>JA5NVN -12",
      "14097070",
    ],
    [
      "2025-06-20 03:10:00z",
      "PL32IQ",
      "12",
      "13260",
      "4.95",
      "150",
      "<br>JA5NVN -19",
      "14097071",
    ],
    [
      "2025-06-20 02:50:00z",
      "PL32KU",
      "12",
      "13360",
      "3.00",
      "150",
      "<br>JH1ARY/2 -23",
      "14097098",
    ],
    [
      "2025-06-20 02:30:00z",
      "PL33MA",
      "11",
      "13280",
      "3.10",
      "150",
      "<br>BG5DMW -21",
      "14097071",
    ],
    [
      "2025-06-20 02:10:00z",
      "PL33ND",
      "3",
      "13100",
      "3.50",
      "146",
      "<br>JA5NVN -19",
      "14097067",
    ],
    [
      "2025-06-20 01:10:00z",
      "PL33SN",
      "-1",
      "13280",
      "3.40",
      "134",
      "<br>JA5FFO -20",
      "14097067",
    ],
    [
      "2025-06-20 00:50:00z",
      "PL33UQ",
      "11",
      "13240",
      "4.90",
      "122",
      "<br>BG5DMW -9",
      "14097097",
    ],
    [
      "2025-06-20 00:30:00z",
      "PL33VT",
      "6",
      "13340",
      "4.95",
      "130",
      "<br>JP1ODJ/SDR -26",
      "14097068",
    ],
    [
      "2025-06-19 07:00:00z",
      "PM34RP",
      "5",
      "13300",
      "3.30",
      "101",
      "<br>JA5NVN -14",
      "14097068",
    ],
    [
      "2025-06-19 06:40:00z",
      "PM34OT",
      "25",
      "13400",
      "4.65",
      "95",
      "<br>JA5NVN -19",
      "14097069",
    ],
    [
      "2025-06-19 06:20:00z",
      "PM34LX",
      "19",
      "13320",
      "3.05",
      "157",
      "<br>JA5NVN -21",
      "14097069",
    ],
    [
      "2025-06-19 06:10:00z",
      "PM35KB",
      "15",
      "13280",
      "4.65",
      "165",
      "<br>JA5NVN -24",
      "14097125",
    ],
    [
      "2025-06-19 05:50:00z",
      "PM35IF",
      "22",
      "13320",
      "4.90",
      "165",
      "<br>JA5FFO -27",
      "14097072",
    ],
    [
      "2025-06-19 05:20:00z",
      "PM35DL",
      "21",
      "13240",
      "4.80",
      "89",
      "<br>JA5NVN -24",
      "14097068",
    ],
    [
      "2025-06-19 05:00:00z",
      "PM35AQ",
      "21",
      "13260",
      "4.80",
      "89",
      "<br>JA5NVN -25",
      "14097068",
    ],
    [
      "2025-06-19 04:50:00z",
      "PM25WS",
      "19",
      "13280",
      "4.85",
      "101",
      "<br>BM2KVV -24",
      "14097072",
    ],
    [
      "2025-06-19 04:30:00z",
      "PM25TW",
      "19",
      "13240",
      "4.90",
      "101",
      "<br>JA5FFO -20",
      "14097068",
    ],
    [
      "2025-06-19 03:50:00z",
      "PM26LG",
      "19",
      "13280",
      "4.85",
      "101",
      "<br>JA5FFO -20",
      "14097068",
    ],
    [
      "2025-06-19 03:30:00z",
      "PM26HK",
      "18",
      "13220",
      "4.90",
      "97",
      "<br>BM2KVV -28",
      "14097073",
    ],
    [
      "2025-06-19 02:50:00z",
      "PM16WS",
      "25",
      "13160",
      "4.75",
      "108",
      "<br>BY1HT -18",
      "14097073",
    ],
    [
      "2025-06-19 02:30:00z",
      "PM16SW",
      "18",
      "13200",
      "4.90",
      "97",
      "<br>BY1HT -25",
      "14097072",
    ],
    [
      "2025-06-19 02:20:00z",
      "PM17QA",
      "23",
      "13180",
      "4.70",
      "112",
      "<br>JA5FFO -25",
      "14097071",
    ],
    [
      "2025-06-19 02:00:00z",
      "PM17LE",
      "19",
      "13140",
      "4.80",
      "97",
      "<br>BY1HT -23",
      "14097072",
    ],
    [
      "2025-06-19 01:40:00z",
      "PM17HH",
      "14",
      "13200",
      "4.80",
      "104",
      "<br>JA5FFO -21",
      "14097072",
    ],
    [
      "2025-06-19 01:20:00z",
      "PM17DL",
      "9",
      "13220",
      "3.00",
      "104",
      "<br>BY1HT -17",
      "14097072",
    ],
    [
      "2025-06-19 01:00:00z",
      "PM07WO",
      "12",
      "13160",
      "4.70",
      "104",
      "<br>JA5FFO -22",
      "14097066",
    ],
    [
      "2025-06-19 00:40:00z",
      "PM07RS",
      "12",
      "13120",
      "4.85",
      "112",
      "<br>JA5FFO -21",
      "14097071",
    ],
    [
      "2025-06-19 00:20:00z",
      "PM07NV",
      "17",
      "13180",
      "4.80",
      "120",
      "<br>JA5FFO -26",
      "14097066",
    ],
    [
      "2025-06-18 23:00:00z",
      "OM98VK",
      "-7",
      "0",
      "4.95",
      "151",
      "<br>OE9XRV -20",
      "14097065",
    ],
    [
      "2025-06-17 23:10:00z",
      "NN21VL",
      "-1",
      "12660",
      "4.85",
      "93",
      "<br>OE9XRV -18",
      "14097063",
    ],
    [
      "2025-06-17 04:20:00z",
      "MN42DR",
      "19",
      "12720",
      "4.75",
      "157",
      "<br>OE9XRV -24",
      "14097062",
    ],
    [
      "2025-06-17 03:50:00z",
      "MN32VS",
      "27",
      "12740",
      "4.60",
      "161",
      "<br>ON5KQ -24",
      "14097064",
    ],
    [
      "2025-06-16 06:20:00z",
      "KM73BH",
      "8",
      "660",
      "4.95",
      "132",
      "<br>TA4/G8SCU -16",
      "14097065",
    ],
    [
      "2025-06-15 14:50:00z",
      "JL89QJ",
      "17",
      "13060",
      "3.05",
      "165",
      "<br>I4AWX -18",
      "14097064",
    ],
    [
      "2025-06-15 14:30:00z",
      "JL89JI",
      "24",
      "13040",
      "4.75",
      "85",
      "<br>F6KGL -18",
      "14096993",
    ],
    [
      "2025-06-15 12:30:00z",
      "JL79FC",
      "29",
      "0",
      "4.55",
      "151",
      "<br>HB9GZW -11",
      "14097154",
    ],
    [
      "2025-06-15 10:40:00z",
      "JL68OU",
      "26",
      "13120",
      "4.75",
      "161",
      "<br>SV3CIX -23",
      "14097129",
    ],
    [
      "2025-06-15 10:20:00z",
      "JL68LT",
      "25",
      "13140",
      "4.75",
      "157",
      "<br>HB9GZW -13",
      "14097110",
    ],
    [
      "2025-06-15 10:00:00z",
      "JL68IR",
      "18",
      "13140",
      "4.85",
      "157",
      "<br>HB9GZW -22",
      "14097065",
    ],
    [
      "2025-06-15 09:40:00z",
      "JL68FP",
      "21",
      "13140",
      "4.85",
      "157",
      "<br>I0UVN -21",
      "14097066",
    ],
    [
      "2025-06-15 09:10:00z",
      "JL68BM",
      "16",
      "13180",
      "4.95",
      "134",
      "<br>I0UVN -13",
      "14097086",
    ],
    [
      "2025-06-15 08:50:00z",
      "JL58XK",
      "14",
      "13160",
      "4.90",
      "138",
      "<br>HB9GZW -15",
      "14097095",
    ],
    [
      "2025-06-15 08:30:00z",
      "JL58VJ",
      "12",
      "13160",
      "4.85",
      "122",
      "<br>I0UVN -13",
      "14097065",
    ],
    [
      "2025-06-15 07:50:00z",
      "JL58QI",
      "3",
      "13200",
      "3.20",
      "130",
      "<br>DD5XX -12",
      "14097105",
    ],
    [
      "2025-06-14 14:50:00z",
      "JL18IM",
      "7",
      "13200",
      "3.05",
      "107",
      "<br>EA8BFK -16",
      "14097064",
    ],
    [
      "2025-06-14 12:20:00z",
      "JL08RL",
      "24",
      "13380",
      "4.85",
      "138",
      "<br>EA8/DF4UE -20",
      "14097086",
    ],
    [
      "2025-06-14 11:50:00z",
      "JL08NK",
      "25",
      "13380",
      "4.70",
      "134",
      "<br>EA8BFK -26",
      "14097063",
    ],
    [
      "2025-06-14 11:10:00z",
      "JL08JF",
      "21",
      "13380",
      "4.80",
      "138",
      "<br>EA8BFK -19",
      "14097064",
    ],
    [
      "2025-06-14 10:50:00z",
      "JL08HD",
      "22",
      "13360",
      "4.85",
      "126",
      "<br>EA8/DF4UE -20",
      "14097085",
    ],
    [
      "2025-06-14 09:40:00z",
      "JL07BT",
      "13",
      "13340",
      "3.15",
      "130",
      "<br>EA8BFK -17",
      "14097064",
    ],
    [
      "2025-06-14 09:20:00z",
      "IL97XR",
      "22",
      "13360",
      "4.90",
      "130",
      "<br>HB9GZW -15",
      "14097064",
    ],
    [
      "2025-06-14 09:00:00z",
      "IL97WP",
      "21",
      "13320",
      "4.70",
      "130",
      "<br>EA8BFK -17",
      "14097095",
    ],
    [
      "2025-06-14 08:40:00z",
      "IL97UM",
      "-3",
      "13360",
      "3.15",
      "122",
      "<br>EA8BFK -14",
      "14097088",
    ],
    [
      "2025-06-14 08:20:00z",
      "IL97TJ",
      "14",
      "13340",
      "3.10",
      "130",
      "<br>HB9GZW -19",
      "14097062",
    ],
    [
      "2025-06-13 16:20:00z",
      "IL66XR",
      "-3",
      "13380",
      "3.15",
      "142",
      "<br>EA1FAQ -11",
      "14097096",
    ],
    [
      "2025-06-13 15:40:00z",
      "IL66SO",
      "7",
      "13380",
      "3.10",
      "146",
      "<br>EA1FAQ -17",
      "14097066",
    ],
    [
      "2025-06-13 15:20:00z",
      "IL66PN",
      "7",
      "13340",
      "3.10",
      "146",
      "<br>HB9GZW -22",
      "14097072",
    ],
    [
      "2025-06-13 14:50:00z",
      "IL66ML",
      "15",
      "13360",
      "3.05",
      "134",
      "<br>DD5XX -12",
      "14097080",
    ],
    [
      "2025-06-13 14:20:00z",
      "IL66IK",
      "21",
      "13320",
      "4.75",
      "134",
      "<br>EA1FAQ -20",
      "14097050",
    ],
    [
      "2025-06-13 14:00:00z",
      "IL66GK",
      "22",
      "13380",
      "4.80",
      "122",
      "<br>HB9GZW -19",
      "14097043",
    ],
    [
      "2025-06-13 13:40:00z",
      "IL66FJ",
      "23",
      "15340",
      "4.80",
      "130",
      "<br>EA8/DF4UE -23",
      "14097050",
    ],
    [
      "2025-06-13 13:20:00z",
      "IL66CJ",
      "25",
      "13380",
      "4.80",
      "142",
      "<br>EA1FAQ -11",
      "14097049",
    ],
    [
      "2025-06-13 13:00:00z",
      "IL56XJ",
      "23",
      "13380",
      "4.75",
      "126",
      "<br>EA8BFK -9",
      "14097078",
    ],
    [
      "2025-06-13 12:40:00z",
      "IL56VI",
      "5",
      "13360",
      "4.95",
      "146",
      "<br>EA1FAQ -5",
      "14097050",
    ],
    [
      "2025-06-13 12:20:00z",
      "IL56SI",
      "23",
      "13360",
      "4.70",
      "142",
      "<br>EA1FAQ -9",
      "14097094",
    ],
    [
      "2025-06-13 12:00:00z",
      "IL56QI",
      "21",
      "13520",
      "4.85",
      "138",
      "<br>EA8BFK -6",
      "14097057",
    ],
    [
      "2025-06-13 11:40:00z",
      "IL56NI",
      "21",
      "13240",
      "4.70",
      "150",
      "<br>DD5XX -7",
      "14097065",
    ],
    [
      "2025-06-13 11:20:00z",
      "IL56KI",
      "17",
      "13300",
      "4.80",
      "150",
      "<br>EA1FAQ -16",
      "14097044",
    ],
    [
      "2025-06-13 11:00:00z",
      "IL56HI",
      "11",
      "13300",
      "4.90",
      "157",
      "<br>EA7CL -20",
      "14097065",
    ],
    [
      "2025-06-13 10:40:00z",
      "IL56EI",
      "13",
      "13320",
      "4.90",
      "150",
      "<br>EA7CL -1",
      "14097059",
    ],
    [
      "2025-06-13 10:20:00z",
      "IL56BJ",
      "19",
      "13320",
      "4.75",
      "157",
      "<br>EA1FAQ -2",
      "14097054",
    ],
    [
      "2025-06-13 10:00:00z",
      "IL46WJ",
      "10",
      "13260",
      "4.85",
      "150",
      "<br>EA8BFK -2",
      "14097068",
    ],
    [
      "2025-06-13 09:40:00z",
      "IL46UJ",
      "9",
      "13320",
      "3.00",
      "153",
      "<br>EA8BFK -2",
      "14097052",
    ],
    [
      "2025-06-13 09:20:00z",
      "IL46RJ",
      "7",
      "13280",
      "4.95",
      "157",
      "<br>EA8BFK -13",
      "14097066",
    ],
    [
      "2025-06-13 09:00:00z",
      "IL46OJ",
      "-1",
      "13300",
      "3.10",
      "153",
      "<br>EA8BFK -10",
      "14097063",
    ],
    [
      "2025-06-13 07:00:00z",
      "IL36VM",
      "-33",
      "13220",
      "3.40",
      "146",
      "<br>G8LZI/3 -15",
      "14097072",
    ],
    [
      "2025-06-12 17:50:00z",
      "HL69VN",
      "7",
      "13160",
      "3.20",
      "124",
      "<br>EA8BFK -5",
      "14097067",
    ],
    [
      "2025-06-12 17:30:00z",
      "HL69QN",
      "4",
      "13240",
      "4.95",
      "128",
      "<br>EA8BFK -5",
      "14097068",
    ],
    [
      "2025-06-12 17:10:00z",
      "HL69LO",
      "6",
      "13220",
      "4.95",
      "120",
      "<br>EA8BFK -6",
      "14097067",
    ],
    [
      "2025-06-12 16:50:00z",
      "HL69GO",
      "5",
      "13220",
      "3.25",
      "116",
      "<br>EA8BFK -6",
      "14097068",
    ],
    [
      "2025-06-12 16:30:00z",
      "HL69BO",
      "4",
      "13260",
      "3.15",
      "120",
      "<br>ZD7GB -8",
      "14097067",
    ],
    [
      "2025-06-12 16:20:00z",
      "HL59WP",
      "4",
      "13220",
      "3.15",
      "120",
      "<br>EA8BFK -10",
      "14097067",
    ],
    [
      "2025-06-12 16:00:00z",
      "HL59RO",
      "11",
      "13220",
      "3.00",
      "116",
      "<br>DK4RW/1 -9",
      "14097065",
    ],
    [
      "2025-06-12 15:30:00z",
      "HL59KO",
      "14",
      "13300",
      "3.10",
      "104",
      "<br>EA8BFK -6",
      "14097066",
    ],
    [
      "2025-06-12 15:10:00z",
      "HL59FO",
      "18",
      "13220",
      "4.90",
      "116",
      "<br>EA8BFK -13",
      "14097068",
    ],
    [
      "2025-06-12 14:50:00z",
      "HL59AO",
      "21",
      "13240",
      "4.85",
      "112",
      "<br>EA8BFK -11",
      "14097066",
    ],
    [
      "2025-06-12 14:40:00z",
      "HL49WN",
      "22",
      "13240",
      "4.75",
      "112",
      "<br>EA8BFK -13",
      "14097066",
    ],
    [
      "2025-06-12 14:20:00z",
      "HL49RN",
      "20",
      "13240",
      "4.80",
      "120",
      "<br>EA8/DF4UE -10",
      "14097065",
    ],
    [
      "2025-06-12 14:00:00z",
      "HL49MQ",
      "26",
      "12860",
      "4.80",
      "120",
      "<br>EA8/DF4UE -7",
      "14097065",
    ],
    [
      "2025-06-12 13:20:00z",
      "HL49CL",
      "24",
      "13260",
      "4.75",
      "124",
      "<br>EA8BFK -17",
      "14097064",
    ],
    [
      "2025-06-12 13:00:00z",
      "HL39VK",
      "25",
      "13260",
      "4.75",
      "128",
      "<br>KQ2Y -14",
      "14097066",
    ],
    [
      "2025-06-12 12:10:00z",
      "HL39JI",
      "22",
      "13240",
      "4.85",
      "97",
      "<br>EA8BFK -16",
      "14097066",
    ],
    [
      "2025-06-12 11:20:00z",
      "HL29VG",
      "18",
      "13200",
      "4.80",
      "108",
      "<br>EA8BFK -12",
      "14097067",
    ],
    [
      "2025-06-12 11:00:00z",
      "HL29RF",
      "14",
      "13240",
      "4.95",
      "112",
      "<br>EA8/EA4DBS -17",
      "14097067",
    ],
    [
      "2025-06-12 10:20:00z",
      "HL29HC",
      "-2",
      "0",
      "3.15",
      "101",
      "<br>KQ2Y -20",
      "14097066",
    ],
    [
      "2025-06-12 09:10:00z",
      "HL18TX",
      "5",
      "2920",
      "3.05",
      "104",
      "<br>KQ2Y -16",
      "14097067",
    ],
    [
      "2025-06-11 18:50:00z",
      "GL53XP",
      "9",
      "13180",
      "4.80",
      "142",
      "<br>KQ2Y -16",
      "14097066",
    ],
    [
      "2025-06-11 18:40:00z",
      "GL63AM",
      "7",
      "0",
      "3.10",
      "101",
      "<br>N2HQI -15",
      "14097066",
    ],
    [
      "2025-06-11 18:30:00z",
      "GL53VM",
      "2",
      "13140",
      "3.05",
      "150",
      "<br>KQ2Y -16",
      "14097064",
    ],
    [
      "2025-06-11 18:10:00z",
      "GL53SK",
      "6",
      "13160",
      "3.10",
      "142",
      "<br>KQ2Y -21",
      "14097066",
    ],
    [
      "2025-06-11 16:00:00z",
      "GL52CX",
      "21",
      "13180",
      "4.85",
      "138",
      "<br>N2HQI -26",
      "14097067",
    ],
    [
      "2025-06-11 15:30:00z",
      "GL42WU",
      "8",
      "13160",
      "3.05",
      "150",
      "<br>KQ2Y -22",
      "14097073",
    ],
    [
      "2025-06-11 12:30:00z",
      "GL42EK",
      "17",
      "13140",
      "4.80",
      "130",
      "<br>K1RA-PI -24",
      "14097065",
    ],
    [
      "2025-06-11 12:10:00z",
      "GL42CJ",
      "6",
      "13140",
      "3.10",
      "122",
      "<br>N2YCH-1 -23",
      "14097062",
    ],
    [
      "2025-06-10 19:10:00z",
      "GL45BA",
      "3",
      "13160",
      "4.60",
      "111",
      "<br>WD4ELG -20",
      "14097063",
    ],
    [
      "2025-06-10 18:20:00z",
      "GL45EF",
      "9",
      "13000",
      "3.05",
      "118",
      "<br>EA8BFK -22",
      "14096999",
    ],
    [
      "2025-06-10 18:00:00z",
      "GL45GI",
      "5",
      "12780",
      "3.10",
      "115",
      "<br>W3OA -23",
      "14097000",
    ],
    [
      "2025-06-10 17:30:00z",
      "GL45IL",
      "10",
      "13180",
      "3.05",
      "122",
      "<br>W3OA -26",
      "14097064",
    ],
    [
      "2025-06-10 17:00:00z",
      "GL45KP",
      "17",
      "13200",
      "4.90",
      "118",
      "<br>GW2HFR -22",
      "14097065",
    ],
    [
      "2025-06-10 15:30:00z",
      "GL46PB",
      "0",
      "13180",
      "3.10",
      "122",
      "<br>EA8BFK -20",
      "14097070",
    ],
    [
      "2025-06-10 14:30:00z",
      "GL46TJ",
      "22",
      "13180",
      "4.80",
      "122",
      "<br>W4HOD -21",
      "14097071",
    ],
    [
      "2025-06-10 13:40:00z",
      "GL46WQ",
      "20",
      "13140",
      "4.70",
      "126",
      "<br>WZ7I -18",
      "14097070",
    ],
    [
      "2025-06-10 13:20:00z",
      "GL56AS",
      "19",
      "13180",
      "4.80",
      "126",
      "<br>WZ7I -18",
      "14097072",
    ],
    [
      "2025-06-10 12:50:00z",
      "GL56CX",
      "16",
      "13160",
      "3.00",
      "118",
      "<br>WA2TP -22",
      "14097044",
    ],
    [
      "2025-06-10 12:40:00z",
      "GL57CA",
      "19",
      "13160",
      "4.70",
      "138",
      "<br>W4HOD -9",
      "14097070",
    ],
    [
      "2025-06-10 12:20:00z",
      "GL57EF",
      "24",
      "0",
      "4.60",
      "151",
      "<br>WA9FIO -20",
      "14097069",
    ],
    [
      "2025-06-10 12:00:00z",
      "GL57EG",
      "16",
      "13180",
      "4.85",
      "130",
      "<br>KD9KHZ -14",
      "14097069",
    ],
    [
      "2025-06-10 11:40:00z",
      "GL57FJ",
      "20",
      "13180",
      "4.75",
      "126",
      "<br>W4HOD -23",
      "14097064",
    ],
    [
      "2025-06-09 18:50:00z",
      "GM83QK",
      "10",
      "13160",
      "3.05",
      "122",
      "<br>HB9VQQ/RS -13",
      "14097064",
    ],
    [
      "2025-06-09 18:30:00z",
      "GM83RN",
      "5",
      "13160",
      "3.15",
      "118",
      "<br>M0UNI -19",
      "14097067",
    ],
    [
      "2025-06-09 18:10:00z",
      "GM83SP",
      "10",
      "13160",
      "4.95",
      "118",
      "<br>GM0DHD -14",
      "14097065",
    ],
    [
      "2025-06-09 17:50:00z",
      "GM83TQ",
      "16",
      "13180",
      "4.80",
      "107",
      "<br>GM0DHD -17",
      "14097064",
    ],
    [
      "2025-06-09 17:30:00z",
      "GM83US",
      "14",
      "13180",
      "4.90",
      "103",
      "<br>DK6UG -15",
      "14097064",
    ],
    [
      "2025-06-09 17:10:00z",
      "GM83VT",
      "21",
      "13160",
      "4.90",
      "107",
      "<br>GW2HFR -19",
      "14097065",
    ],
    [
      "2025-06-09 16:50:00z",
      "GM83WV",
      "14",
      "13260",
      "3.00",
      "107",
      "<br>GW2HFR -14",
      "14097068",
    ],
    [
      "2025-06-09 16:30:00z",
      "GM83XW",
      "14",
      "13180",
      "4.95",
      "103",
      "<br>EA8/DF4UE -22",
      "14097064",
    ],
    [
      "2025-06-09 16:20:00z",
      "GM93AW",
      "12",
      "13180",
      "3.00",
      "115",
      "<br>EA8BFK -21",
      "14097065",
    ],
    [
      "2025-06-09 16:00:00z",
      "GM93BX",
      "16",
      "13180",
      "4.85",
      "111",
      "<br>EA8/DF4UE -21",
      "14097067",
    ],
    [
      "2025-06-09 15:50:00z",
      "GM94BA",
      "16",
      "13160",
      "4.90",
      "95",
      "<br>GW2HFR -20",
      "14097066",
    ],
    [
      "2025-06-09 15:30:00z",
      "GM94",
      "20",
      "13080",
      "4.90",
      "99",
      "<br>GW2HFR -19",
      "14097069",
    ],
    [
      "2025-06-09 15:10:00z",
      "GM94EC",
      "20",
      "13140",
      "4.80",
      "111",
      "<br>GW2HFR -21",
      "14097065",
    ],
    [
      "2025-06-09 14:30:00z",
      "GM94GD",
      "19",
      "13160",
      "4.85",
      "111",
      "<br>GW2HFR -19",
      "14097069",
    ],
    [
      "2025-06-09 13:50:00z",
      "GM94JE",
      "23",
      "13160",
      "4.80",
      "111",
      "<br>KQ2Y -17",
      "14097066",
    ],
    [
      "2025-06-09 13:20:00z",
      "GM94LE",
      "18",
      "13160",
      "4.85",
      "122",
      "<br>EA8/DF4UE -21",
      "14097067",
    ],
    [
      "2025-06-09 13:00:00z",
      "GM94NF",
      "20",
      "13160",
      "4.80",
      "111",
      "<br>KQ2Y -16",
      "14097067",
    ],
    [
      "2025-06-09 12:40:00z",
      "GM94PF",
      "18",
      "13140",
      "4.80",
      "118",
      "<br>EA8/DF4UE -22",
      "14097064",
    ],
    [
      "2025-06-09 12:20:00z",
      "GM94QF",
      "15",
      "13160",
      "4.80",
      "118",
      "<br>GM0UDL -26",
      "14097057",
    ],
    [
      "2025-06-09 12:00:00z",
      "GM94SF",
      "12",
      "13160",
      "3.10",
      "118",
      "<br>GW2HFR -16",
      "14097056",
    ],
    [
      "2025-06-09 11:40:00z",
      "GM94UF",
      "7",
      "13180",
      "4.90",
      "115",
      "<br>KQ2Y -10",
      "14097057",
    ],
    [
      "2025-06-09 11:20:00z",
      "GM94WF",
      "3",
      "13180",
      "3.00",
      "118",
      "<br>KQ2Y -14",
      "14097068",
    ],
    [
      "2025-06-09 11:00:00z",
      "HM04AF",
      "16",
      "13160",
      "3.00",
      "118",
      "<br>KQ2Y -22",
      "14097067",
    ],
    [
      "2025-06-09 10:40:00z",
      "HM04CG",
      "-13",
      "13180",
      "3.25",
      "126",
      "<br>KQ2Y -21",
      "14097068",
    ],
    [
      "2025-06-08 21:00:00z",
      "HM24RH",
      "-4",
      "13200",
      "3.30",
      "107",
      "<br>DK4RW/1 -18",
      "14097065",
    ],
    [
      "2025-06-08 20:30:00z",
      "HM24TH",
      "-6",
      "13180",
      "3.35",
      "115",
      "<br>DL3EL -15",
      "14097064",
    ],
    [
      "2025-06-08 18:00:00z",
      "HM34HL",
      "15",
      "13160",
      "4.85",
      "103",
      "<br>GM0DHD -8",
      "14097063",
    ],
    [
      "2025-06-08 17:40:00z",
      "HM34JM",
      "23",
      "13160",
      "4.85",
      "115",
      "<br>M0UNI -18",
      "14097064",
    ],
    [
      "2025-06-08 17:20:00z",
      "HM34KN",
      "24",
      "13160",
      "4.70",
      "111",
      "<br>DD5XX -15",
      "14097064",
    ],
    [
      "2025-06-08 17:00:00z",
      "HM34LO",
      "21",
      "13140",
      "4.80",
      "118",
      "<br>OZ2JBR -11",
      "14097064",
    ],
    [
      "2025-06-08 16:40:00z",
      "HM34NQ",
      "22",
      "13140",
      "4.85",
      "107",
      "<br>PD0OHW -18",
      "14097067",
    ],
    [
      "2025-06-08 16:20:00z",
      "HM34OR",
      "22",
      "13100",
      "4.85",
      "107",
      "<br>PD0OHW -14",
      "14097066",
    ],
    [
      "2025-06-08 16:00:00z",
      "HM34QS",
      "17",
      "13160",
      "4.85",
      "115",
      "<br>GM0DHD -13",
      "14097066",
    ],
    [
      "2025-06-08 15:40:00z",
      "HM34RU",
      "16",
      "13180",
      "4.90",
      "115",
      "<br>GW2HFR -11",
      "14097065",
    ],
    [
      "2025-06-08 15:20:00z",
      "HM34SW",
      "22",
      "13180",
      "4.80",
      "107",
      "<br>EA8/DF4UE -13",
      "14097065",
    ],
    [
      "2025-06-08 15:00:00z",
      "HM34UX",
      "20",
      "13140",
      "4.80",
      "111",
      "<br>GW2HFR -13",
      "14097065",
    ],
    [
      "2025-06-08 14:50:00z",
      "HM35VA",
      "16",
      "13160",
      "4.95",
      "115",
      "<br>HB9VQQ/RS -14",
      "14097070",
    ],
    [
      "2025-06-08 14:30:00z",
      "HM35WB",
      "16",
      "13160",
      "4.85",
      "111",
      "<br>GW2HFR -16",
      "14097058",
    ],
    [
      "2025-06-08 14:10:00z",
      "HM45AD",
      "16",
      "13160",
      "4.85",
      "111",
      "<br>GM0DHD -19",
      "14097067",
    ],
    [
      "2025-06-08 13:50:00z",
      "HM45BE",
      "16",
      "13180",
      "4.90",
      "115",
      "<br>GW2HFR -19",
      "14097067",
    ],
    [
      "2025-06-08 13:30:00z",
      "HM45CG",
      "15",
      "13160",
      "4.95",
      "111",
      "<br>GW2HFR -21",
      "14097068",
    ],
    [
      "2025-06-08 13:10:00z",
      "HM45EH",
      "16",
      "13200",
      "4.85",
      "111",
      "<br>EA8/DF4UE -23",
      "14097066",
    ],
    [
      "2025-06-08 12:50:00z",
      "HM45GJ",
      "19",
      "13200",
      "4.85",
      "111",
      "<br>GW2HFR -17",
      "14097065",
    ],
    [
      "2025-06-08 12:30:00z",
      "HM45IK",
      "24",
      "13180",
      "4.65",
      "165",
      "<br>GW2HFR -17",
      "14097065",
    ],
    [
      "2025-06-08 12:10:00z",
      "HM45JM",
      "18",
      "13180",
      "4.90",
      "126",
      "<br>GW2HFR -15",
      "14097066",
    ],
    [
      "2025-06-08 11:50:00z",
      "HM45LN",
      "9",
      "13120",
      "3.05",
      "118",
      "<br>KQ2Y -16",
      "14097068",
    ],
    [
      "2025-06-08 11:30:00z",
      "HM45NP",
      "12",
      "13160",
      "4.95",
      "130",
      "<br>KQ2Y -19",
      "14097069",
    ],
    [
      "2025-06-08 11:10:00z",
      "HM45PR",
      "15",
      "13200",
      "4.90",
      "126",
      "<br>GM0DHD -15",
      "14097066",
    ],
    [
      "2025-06-08 10:50:00z",
      "HM45RT",
      "21",
      "13160",
      "4.70",
      "130",
      "<br>GM0DHD -18",
      "14097043",
    ],
    [
      "2025-06-08 10:30:00z",
      "HM45TW",
      "14",
      "13160",
      "4.75",
      "130",
      "<br>EA1FAQ -18",
      "14097067",
    ],
    [
      "2025-06-08 10:10:00z",
      "HM46VA",
      "12",
      "13140",
      "3.05",
      "134",
      "<br>GW2HFR -17",
      "14097052",
    ],
    [
      "2025-06-08 08:50:00z",
      "HM56FM",
      "6",
      "13160",
      "3.20",
      "126",
      "<br>KQ2Y -16",
      "14097068",
    ],
    [
      "2025-06-08 07:30:00z",
      "HM57MA",
      "-6",
      "13140",
      "3.15",
      "142",
      "<br>KQ2Y -10",
      "14097069",
    ],
    [
      "2025-06-07 19:10:00z",
      "HN81MP",
      "-6",
      "13280",
      "3.00",
      "115",
      "<br>GW2HFR -9",
      "14097071",
    ],
    [
      "2025-06-07 18:40:00z",
      "HN81NU",
      "2",
      "0",
      "3.25",
      "151",
      "<br>GM0DHD -20",
      "14097071",
    ],
    [
      "2025-06-07 18:00:00z",
      "HN82PA",
      "18",
      "13280",
      "3.10",
      "99",
      "<br>GM0DHD -8",
      "14097066",
    ],
    [
      "2025-06-07 17:40:00z",
      "HN82QC",
      "17",
      "13240",
      "4.80",
      "115",
      "<br>GM0UDL -1",
      "14097064",
    ],
    [
      "2025-06-07 17:20:00z",
      "HN82SE",
      "8",
      "80",
      "3.05",
      "159",
      "<br>GM0UDL -9",
      "14097067",
    ],
    [
      "2025-06-07 17:00:00z",
      "HN82RF",
      "16",
      "13260",
      "3.00",
      "99",
      "<br>HB9FID -5",
      "14097068",
    ],
    [
      "2025-06-07 16:40:00z",
      "HN82RG",
      "21",
      "13260",
      "4.85",
      "103",
      "<br>G4SDL -9",
      "14097069",
    ],
    [
      "2025-06-07 16:20:00z",
      "HN82SI",
      "23",
      "13300",
      "4.90",
      "99",
      "<br>DJ6DK -10",
      "14097069",
    ],
    [
      "2025-06-07 16:00:00z",
      "HN82SJ",
      "20",
      "13340",
      "4.85",
      "95",
      "<br>HB9GZW -7",
      "14097070",
    ],
    [
      "2025-06-07 15:40:00z",
      "HN82TL",
      "18",
      "13340",
      "3.00",
      "95",
      "<br>G8LZI/3 -6",
      "14097060",
    ],
    [
      "2025-06-07 15:20:00z",
      "HN82UM",
      "22",
      "13260",
      "4.85",
      "91",
      "<br>HB9FID -7",
      "14097069",
    ],
    [
      "2025-06-07 15:00:00z",
      "HN82UN",
      "26",
      "13240",
      "4.70",
      "87",
      "<br>OZ2JBR -13",
      "14097062",
    ],
    [
      "2025-06-07 14:40:00z",
      "HN82VO",
      "25",
      "13240",
      "4.80",
      "87",
      "<br>DL1DAF -6",
      "14097067",
    ],
    [
      "2025-06-07 14:20:00z",
      "HN82VP",
      "23",
      "13320",
      "4.75",
      "91",
      "<br>GW2HFR -6",
      "14097062",
    ],
    [
      "2025-06-07 14:00:00z",
      "HN82WQ",
      "23",
      "13320",
      "4.80",
      "91",
      "<br>DL1DAF -9",
      "14097066",
    ],
    [
      "2025-06-07 13:40:00z",
      "HN82WS",
      "25",
      "13260",
      "4.75",
      "103",
      "<br>GM0DHD -9",
      "14097060",
    ],
    [
      "2025-06-07 13:20:00z",
      "HN82XT",
      "24",
      "13280",
      "4.80",
      "99",
      "<br>GW2HFR -7",
      "14097068",
    ],
    [
      "2025-06-07 13:00:00z",
      "HN92AU",
      "26",
      "13260",
      "4.70",
      "103",
      "<br>LA1ZM -12",
      "14097064",
    ],
    [
      "2025-06-07 12:40:00z",
      "HN92AV",
      "18",
      "13300",
      "4.90",
      "107",
      "<br>PD0OHW -8",
      "14097064",
    ],
    [
      "2025-06-07 12:20:00z",
      "HN92BX",
      "14",
      "13260",
      "4.85",
      "99",
      "<br>DD5XX -16",
      "14097072",
    ],
    [
      "2025-06-07 12:10:00z",
      "HN93BA",
      "11",
      "13260",
      "4.90",
      "103",
      "<br>K1OF -18",
      "14097071",
    ],
    [
      "2025-06-07 11:50:00z",
      "HN93BB",
      "17",
      "13280",
      "4.85",
      "99",
      "<br>DL1DAF -9",
      "14097067",
    ],
    [
      "2025-06-07 11:30:00z",
      "HN93CD",
      "12",
      "13260",
      "3.05",
      "99",
      "<br>EB1TR -8",
      "14097066",
    ],
    [
      "2025-06-07 11:10:00z",
      "HN93CE",
      "14",
      "13260",
      "4.90",
      "103",
      "<br>DL3EL -15",
      "14097064",
    ],
    [
      "2025-06-07 10:50:00z",
      "HN93DG",
      "10",
      "13260",
      "4.95",
      "99",
      "<br>KQ2Y -11",
      "14097067",
    ],
    [
      "2025-06-07 10:30:00z",
      "HN93DI",
      "8",
      "13300",
      "3.20",
      "103",
      "<br>DL1DAF -9",
      "14097067",
    ],
    [
      "2025-06-07 10:10:00z",
      "HN93DJ",
      "7",
      "13240",
      "3.10",
      "91",
      "<br>GM0DHD -13",
      "14097065",
    ],
    [
      "2025-06-07 09:40:00z",
      "HN93DM",
      "-5",
      "13220",
      "3.05",
      "103",
      "<br>G4ZFQ -21",
      "14097069",
    ],
    [
      "2025-06-06 22:00:00z",
      "HN58MG",
      "-22",
      "13180",
      "3.10",
      "89",
      "<br>YL1VA -13",
      "14097073",
    ],
    [
      "2025-06-06 20:50:00z",
      "HN48UN",
      "-5",
      "13240",
      "3.25",
      "89",
      "<br>DJ6DK -15",
      "14097067",
    ],
    [
      "2025-06-06 19:40:00z",
      "HN48DT",
      "-3",
      "13220",
      "3.40",
      "89",
      "<br>DK6UG -23",
      "14097072",
    ],
    [
      "2025-06-06 18:50:00z",
      "HN38PX",
      "8",
      "13240",
      "3.30",
      "165",
      "<br>GW2HFR -17",
      "14097067",
    ],
    [
      "2025-06-06 18:10:00z",
      "HN39GB",
      "14",
      "13220",
      "4.80",
      "85",
      "<br>DL0PF -9",
      "14097069",
    ],
    [
      "2025-06-06 17:50:00z",
      "HN39CC",
      "21",
      "13260",
      "4.80",
      "89",
      "<br>MW0KEC -11",
      "14097067",
    ],
    [
      "2025-06-06 17:40:00z",
      "HN29XD",
      "21",
      "13200",
      "4.75",
      "85",
      "<br>EI6JJB -8",
      "14097064",
    ],
    [
      "2025-06-06 17:20:00z",
      "HN29TD",
      "21",
      "13240",
      "4.75",
      "85",
      "<br>EI6JJB -16",
      "14097060",
    ],
    [
      "2025-06-06 17:00:00z",
      "HN29OE",
      "23",
      "13220",
      "4.95",
      "157",
      "<br>EI6JJB -20",
      "14097064",
    ],
    [
      "2025-06-06 16:30:00z",
      "HN29IG",
      "25",
      "13200",
      "4.80",
      "161",
      "<br>GW2HFR -16",
      "14097071",
    ],
    [
      "2025-06-06 15:30:00z",
      "HN19SI",
      "30",
      "13200",
      "4.65",
      "161",
      "<br>EI6JJB -22",
      "14097064",
    ],
    [
      "2025-06-06 14:10:00z",
      "HN19BL",
      "26",
      "13200",
      "4.60",
      "153",
      "<br>GW2HFR -20",
      "14097061",
    ],
    [
      "2025-06-06 14:00:00z",
      "HN09XL",
      "28",
      "13200",
      "4.80",
      "157",
      "<br>WA2TP -27",
      "14097071",
    ],
    [
      "2025-06-06 13:00:00z",
      "HN09LN",
      "28",
      "13200",
      "4.65",
      "150",
      "<br>GW2HFR -16",
      "14097063",
    ],
    [
      "2025-06-06 12:40:00z",
      "HN09HN",
      "25",
      "13200",
      "4.80",
      "142",
      "<br>KQ2Y -21",
      "14097069",
    ],
    [
      "2025-06-06 12:20:00z",
      "HN09DO",
      "24",
      "13180",
      "4.75",
      "150",
      "<br>GW2HFR -13",
      "14097056",
    ],
    [
      "2025-06-06 12:00:00z",
      "GN99XP",
      "21",
      "13200",
      "4.70",
      "150",
      "<br>KM4RK -14",
      "14097065",
    ],
    [
      "2025-06-06 11:30:00z",
      "GN99RQ",
      "16",
      "13180",
      "4.90",
      "150",
      "<br>WZ7I -11",
      "14097069",
    ],
    [
      "2025-06-06 09:40:00z",
      "GN89QU",
      "17",
      "13180",
      "4.90",
      "89",
      "<br>VA3XA -15",
      "14097064",
    ],
    [
      "2025-06-06 09:20:00z",
      "GN89LU",
      "12",
      "13180",
      "4.90",
      "165",
      "<br>N8VIM -20",
      "14097064",
    ],
    [
      "2025-06-06 09:00:00z",
      "GN89HU",
      "-1",
      "13180",
      "3.45",
      "93",
      "<br>N8VIM -22",
      "14097054",
    ],
    [
      "2025-06-05 19:40:00z",
      "GN26JR",
      "8",
      "13240",
      "3.15",
      "153",
      "<br>AJ1Z -6",
      "14097065",
    ],
    [
      "2025-06-05 19:20:00z",
      "GN26HM",
      "10",
      "13260",
      "3.10",
      "146",
      "<br>KC2CDY -5",
      "14097060",
    ],
    [
      "2025-06-05 19:00:00z",
      "GN26FH",
      "8",
      "13240",
      "3.05",
      "150",
      "<br>VE3NM -4",
      "14097067",
    ],
    [
      "2025-06-05 18:40:00z",
      "GN26EC",
      "14",
      "13260",
      "3.00",
      "161",
      "<br>KC2CDY -7",
      "14097066",
    ],
    [
      "2025-06-05 18:30:00z",
      "GN25EX",
      "19",
      "13240",
      "4.85",
      "165",
      "<br>N8ZRY -5",
      "14097060",
    ],
    [
      "2025-06-05 18:10:00z",
      "GN25DR",
      "16",
      "13360",
      "4.90",
      "150",
      "<br>KQ2Y -4",
      "14097062",
    ],
    [
      "2025-06-05 17:50:00z",
      "GN25DL",
      "10",
      "13320",
      "3.05",
      "161",
      "<br>N8ZRY -9",
      "14097066",
    ],
    [
      "2025-06-05 17:30:00z",
      "GN25EG",
      "13",
      "13400",
      "3.05",
      "142",
      "<br>KQ2Y -11",
      "14097067",
    ],
    [
      "2025-06-05 17:10:00z",
      "GN25EC",
      "13",
      "13300",
      "3.00",
      "138",
      "<br>N3EYQ -9",
      "14097062",
    ],
    [
      "2025-06-05 16:50:00z",
      "GN24FW",
      "19",
      "13340",
      "4.75",
      "142",
      "<br>VE3NM -6",
      "14097069",
    ],
    [
      "2025-06-05 16:30:00z",
      "GN24FR",
      "26",
      "13280",
      "4.75",
      "146",
      "<br>VE3NM -7",
      "14097065",
    ],
    [
      "2025-06-05 16:10:00z",
      "GN24GN",
      "16",
      "13300",
      "4.85",
      "146",
      "<br>VE3NM -9",
      "14097061",
    ],
    [
      "2025-06-05 15:50:00z",
      "GN24GI",
      "25",
      "13280",
      "4.70",
      "134",
      "<br>KQ2Y -11",
      "14097064",
    ],
    [
      "2025-06-05 15:30:00z",
      "GN24IC",
      "20",
      "12040",
      "4.90",
      "153",
      "<br>N8ZRY -10",
      "14097066",
    ],
    [
      "2025-06-05 15:10:00z",
      "GN23HX",
      "26",
      "13260",
      "4.80",
      "146",
      "<br>N3EYQ -5",
      "14097055",
    ],
    [
      "2025-06-05 14:50:00z",
      "GN23IS",
      "20",
      "13280",
      "4.90",
      "153",
      "<br>N2HQI -11",
      "14097064",
    ],
    [
      "2025-06-05 14:30:00z",
      "GN23JO",
      "17",
      "13260",
      "4.95",
      "122",
      "<br>KQ2Y -9",
      "14097063",
    ],
    [
      "2025-06-05 14:10:00z",
      "GN23KL",
      "17",
      "13220",
      "3.05",
      "126",
      "<br>KK1D -5",
      "14097067",
    ],
    [
      "2025-06-05 13:50:00z",
      "GN23MI",
      "19",
      "13280",
      "4.75",
      "103",
      "<br>N8VIM -6",
      "14097068",
    ],
    [
      "2025-06-05 13:30:00z",
      "GN23ND",
      "14",
      "13240",
      "4.90",
      "157",
      "<br>N8LI/1 -10",
      "14097057",
    ],
    [
      "2025-06-05 13:10:00z",
      "GN22OW",
      "13",
      "13240",
      "4.70",
      "157",
      "<br>VA1TTY -13",
      "14097067",
    ],
    [
      "2025-06-05 12:50:00z",
      "GN22PQ",
      "19",
      "13200",
      "4.90",
      "150",
      "<br>VA1TTY -11",
      "14097063",
    ],
    [
      "2025-06-05 12:30:00z",
      "GN22QL",
      "7",
      "13240",
      "3.15",
      "150",
      "<br>VA1TTY -6",
      "14097060",
    ],
    [
      "2025-06-05 12:10:00z",
      "GN22RF",
      "4",
      "13220",
      "3.15",
      "150",
      "<br>KK1D -9",
      "14097062",
    ],
    [
      "2025-06-05 11:50:00z",
      "GN22SA",
      "1",
      "13220",
      "3.30",
      "161",
      "<br>N2HQI -18",
      "14097070",
    ],
    [
      "2025-06-05 11:40:00z",
      "GN21SV",
      "0",
      "13220",
      "3.25",
      "85",
      "<br>WZ7I -18",
      "14097069",
    ],
    [
      "2025-06-04 20:50:00z",
      "FM91IQ",
      "6",
      "13140",
      "3.10",
      "93",
      "<br>KI4KEB -13",
      "14097060",
    ],
    [
      "2025-06-04 20:30:00z",
      "FM91DP",
      "5",
      "13160",
      "3.20",
      "93",
      "<br>KI4KEB -11",
      "14097063",
    ],
    [
      "2025-06-04 19:50:00z",
      "FM81TP",
      "10",
      "13160",
      "4.95",
      "89",
      "<br>WA4DT -9",
      "14097068",
    ],
    [
      "2025-06-04 19:30:00z",
      "FM81PQ",
      "0",
      "13200",
      "3.10",
      "161",
      "<br>KI4KEB -9",
      "14097063",
    ],
    [
      "2025-06-04 19:10:00z",
      "FM81MR",
      "13",
      "13200",
      "4.90",
      "85",
      "<br>WD4ELG -9",
      "14097065",
    ],
    [
      "2025-06-04 18:50:00z",
      "FM81IS",
      "11",
      "13160",
      "3.00",
      "165",
      "<br>N2DED -9",
      "14097070",
    ],
    [
      "2025-06-04 18:30:00z",
      "FM81EU",
      "18",
      "13180",
      "4.90",
      "97",
      "<br>N8ZRY -10",
      "14097066",
    ],
    [
      "2025-06-04 18:10:00z",
      "FM81AX",
      "19",
      "13100",
      "4.90",
      "85",
      "<br>KI4KEB -7",
      "14097050",
    ],
    [
      "2025-06-04 18:00:00z",
      "FM72WA",
      "14",
      "13160",
      "4.90",
      "93",
      "<br>WA9WTK -3",
      "14097067",
    ],
    [
      "2025-06-04 17:40:00z",
      "FM72SC",
      "14",
      "13200",
      "3.05",
      "101",
      "<br>WA9WTK -7",
      "14097055",
    ],
    [
      "2025-06-04 17:20:00z",
      "FM72PE",
      "18",
      "13200",
      "4.90",
      "97",
      "<br>WA9WTK -4",
      "14097066",
    ],
    [
      "2025-06-04 17:00:00z",
      "FM72LH",
      "17",
      "13180",
      "4.80",
      "85",
      "<br>WA4DT -10",
      "14097065",
    ],
    [
      "2025-06-04 16:40:00z",
      "FM72HK",
      "20",
      "13160",
      "4.85",
      "85",
      "<br>WA9WTK -15",
      "14097062",
    ],
    [
      "2025-06-04 16:20:00z",
      "FM72EO",
      "20",
      "13160",
      "4.85",
      "85",
      "<br>KR4LO -20",
      "14097068",
    ],
    [
      "2025-06-04 16:00:00z",
      "FM72BR",
      "19",
      "13140",
      "4.80",
      "161",
      "<br>K3ZV -16",
      "14097065",
    ],
    [
      "2025-06-04 15:50:00z",
      "FM62XT",
      "22",
      "13120",
      "4.75",
      "93",
      "<br>WD4ELG -16",
      "14097050",
    ],
    [
      "2025-06-04 15:30:00z",
      "FM62TW",
      "22",
      "13200",
      "4.75",
      "93",
      "<br>N2HQI -13",
      "14097066",
    ],
    [
      "2025-06-04 15:20:00z",
      "FM63SA",
      "16",
      "13240",
      "3.00",
      "89",
      "<br>KI4KEB -12",
      "14097068",
    ],
    [
      "2025-06-04 15:00:00z",
      "FM63OC",
      "17",
      "13220",
      "4.85",
      "89",
      "<br>WA9WTK -10",
      "14097063",
    ],
    [
      "2025-06-04 14:40:00z",
      "FM63LF",
      "8",
      "13220",
      "3.10",
      "85",
      "<br>WA9WTK -15",
      "14097068",
    ],
    [
      "2025-06-04 14:20:00z",
      "FM63HH",
      "8",
      "13260",
      "3.20",
      "157",
      "<br>WA9WTK -12",
      "14097068",
    ],
    [
      "2025-06-04 14:00:00z",
      "FM63EK",
      "17",
      "13200",
      "4.80",
      "85",
      "<br>AB4WL -9",
      "14097069",
    ],
    [
      "2025-06-04 13:40:00z",
      "FM63BN",
      "13",
      "13240",
      "3.05",
      "161",
      "<br>KI4KEB -1",
      "14097067",
    ],
    [
      "2025-06-04 13:30:00z",
      "FM53XO",
      "4",
      "13200",
      "3.25",
      "157",
      "<br>WA4DT -11",
      "14097068",
    ],
    [
      "2025-06-04 13:10:00z",
      "FM53UQ",
      "1",
      "13200",
      "3.10",
      "150",
      "<br>KI4KEB -6",
      "14097064",
    ],
    [
      "2025-06-04 12:50:00z",
      "FM53OX",
      "2",
      "0",
      "4.95",
      "91",
      "<br>KR4LO -13",
      "14097072",
    ],
    [
      "2025-06-03 22:30:00z",
      "FN33SC",
      "-11",
      "13160",
      "3.55",
      "153",
      "<br>WA4DT -5",
      "14097070",
    ],
    [
      "2025-06-03 22:10:00z",
      "FN33SJ",
      "7",
      "13160",
      "3.10",
      "165",
      "<br>VE2DPF -1",
      "14097069",
    ],
    [
      "2025-06-03 21:00:00z",
      "FN34VO",
      "17",
      "0",
      "4.75",
      "155",
      "<br>N8ZRY -6",
      "14097067",
    ],
    [
      "2025-06-03 20:40:00z",
      "FN34VR",
      "19",
      "13120",
      "4.90",
      "101",
      "<br>N8ZRY 13",
      "14097067",
    ],
    [
      "2025-06-03 20:20:00z",
      "FN35WB",
      "21",
      "13120",
      "4.75",
      "104",
      "<br>AC1IM -1",
      "14097071",
    ],
    [
      "2025-06-03 20:00:00z",
      "FN35WJ",
      "12",
      "13100",
      "3.05",
      "108",
      "<br>KC2STA1 -6",
      "14097065",
    ],
    [
      "2025-06-03 19:40:00z",
      "FN35WR",
      "5",
      "13020",
      "3.00",
      "101",
      "<br>KK1D -4",
      "14097072",
    ],
    [
      "2025-06-03 19:20:00z",
      "FN36WB",
      "20",
      "13060",
      "4.85",
      "104",
      "<br>KK1D -8",
      "14097074",
    ],
    [
      "2025-06-03 19:00:00z",
      "FN36WJ",
      "16",
      "13040",
      "4.90",
      "104",
      "<br>WA9WTK -1",
      "14097073",
    ],
    [
      "2025-06-03 18:40:00z",
      "FN36VR",
      "16",
      "13080",
      "4.95",
      "104",
      "<br>WA9WTK 1",
      "14097066",
    ],
    [
      "2025-06-03 18:20:00z",
      "FN37UB",
      "13",
      "13080",
      "4.90",
      "104",
      "<br>WA9WTK -9",
      "14097068",
    ],
    [
      "2025-06-03 18:00:00z",
      "FN37TJ",
      "21",
      "12780",
      "3.00",
      "101",
      "<br>WA9WTK -12",
      "14097071",
    ],
    [
      "2025-06-03 17:40:00z",
      "FN37RQ",
      "18",
      "13000",
      "4.75",
      "104",
      "<br>VE2DPF -16",
      "14097064",
    ],
    [
      "2025-06-03 17:20:00z",
      "FN37OX",
      "18",
      "13000",
      "4.70",
      "104",
      "<br>VE2DPF -21",
      "14097072",
    ],
    [
      "2025-06-03 17:10:00z",
      "FN38ND",
      "19",
      "12980",
      "4.80",
      "116",
      "<br>VE2DPF -19",
      "14097060",
    ],
    [
      "2025-06-03 16:50:00z",
      "FN38KK",
      "20",
      "12920",
      "4.75",
      "116",
      "<br>N8ZRY -20",
      "14097061",
    ],
    [
      "2025-06-03 16:30:00z",
      "FN38HR",
      "10",
      "12960",
      "3.10",
      "97",
      "<br>W4KEL -17",
      "14097075",
    ],
    [
      "2025-06-03 16:10:00z",
      "FN39DA",
      "12",
      "12900",
      "4.95",
      "101",
      "<br>WZ7I -13",
      "14097068",
    ],
    [
      "2025-06-03 15:50:00z",
      "FN39AG",
      "10",
      "12960",
      "3.25",
      "108",
      "<br>W4KEL -17",
      "14097066",
    ],
    [
      "2025-06-03 15:40:00z",
      "FN29WJ",
      "17",
      "12860",
      "4.85",
      "104",
      "<br>W4KEL -19",
      "14097066",
    ],
    [
      "2025-06-03 15:20:00z",
      "FN29SO",
      "13",
      "13400",
      "4.95",
      "124",
      "<br>WZ7I -16",
      "14097067",
    ],
    [
      "2025-06-03 15:00:00z",
      "FN29OT",
      "11",
      "12920",
      "3.10",
      "85",
      "<br>W4KEL -18",
      "14097073",
    ],
    [
      "2025-06-03 14:30:00z",
      "FO20IC",
      "2",
      "12820",
      "3.10",
      "89",
      "<br>WA2TP -24",
      "14097067",
    ],
    [
      "2025-06-03 14:10:00z",
      "FO20DF",
      "6",
      "12920",
      "4.80",
      "93",
      "<br>W4KEL -20",
      "14097074",
    ],
    [
      "2025-06-03 13:50:00z",
      "FO10WJ",
      "-5",
      "12960",
      "3.40",
      "97",
      "<br>W4KEL -17",
      "14097067",
    ],
    [
      "2025-06-03 13:30:00z",
      "FO10SM",
      "-1",
      "12860",
      "3.05",
      "85",
      "<br>VE4KRK -28",
      "14097073",
    ],
    [
      "2025-06-03 01:10:00z",
      "EN28RA",
      "-24",
      "12940",
      "3.50",
      "139",
      "<br>VE6JY -18",
      "14097064",
    ],
    [
      "2025-06-03 01:00:00z",
      "EN27OV",
      "-4",
      "12940",
      "3.30",
      "132",
      "<br>AC0G/ND -13",
      "14097065",
    ],
    [
      "2025-06-02 23:50:00z",
      "EN17VA",
      "1",
      "0",
      "4.90",
      "89",
      "<br>AC0G/ND 0",
      "14097071",
    ],
    [
      "2025-06-02 22:40:00z",
      "EN16EL",
      "1",
      "12880",
      "3.55",
      "108",
      "<br>VE6JY 4",
      "14097071",
    ],
    [
      "2025-06-02 22:20:00z",
      "EN06XH",
      "14",
      "12920",
      "4.95",
      "112",
      "<br>W7EL/L 0",
      "14097073",
    ],
    [
      "2025-06-02 22:00:00z",
      "EN06RD",
      "21",
      "12940",
      "4.60",
      "116",
      "<br>VE6JY -5",
      "14097070",
    ],
    [
      "2025-06-02 21:40:00z",
      "EN05MX",
      "18",
      "12940",
      "4.70",
      "104",
      "<br>VE3CWM -9",
      "14097066",
    ],
    [
      "2025-06-02 21:20:00z",
      "EN05HT",
      "21",
      "12940",
      "4.70",
      "120",
      "<br>VE6JY -12",
      "14097077",
    ],
    [
      "2025-06-02 21:00:00z",
      "EN05BQ",
      "24",
      "12880",
      "4.75",
      "124",
      "<br>N6TDM -16",
      "14097067",
    ],
    [
      "2025-06-02 20:50:00z",
      "DN95WO",
      "19",
      "12880",
      "4.80",
      "132",
      "<br>N6TDM -11",
      "14097060",
    ],
    [
      "2025-06-02 20:30:00z",
      "DN95QL",
      "21",
      "12880",
      "4.65",
      "116",
      "<br>KG0D -20",
      "14097064",
    ],
    [
      "2025-06-02 20:10:00z",
      "DN95LH",
      "22",
      "12900",
      "4.70",
      "128",
      "<br>W7STF -17",
      "14097063",
    ],
    [
      "2025-06-02 19:50:00z",
      "DN95FD",
      "20",
      "12900",
      "4.75",
      "116",
      "<br>K6VZK -19",
      "14097046",
    ],
    [
      "2025-06-02 19:30:00z",
      "DN94AX",
      "26",
      "12840",
      "4.75",
      "116",
      "<br>KG0D -19",
      "14097073",
    ],
    [
      "2025-06-02 19:20:00z",
      "DN84VV",
      "29",
      "12760",
      "4.55",
      "116",
      "<br>N6TDM -12",
      "14097063",
    ],
    [
      "2025-06-02 19:00:00z",
      "DN84PS",
      "24",
      "12860",
      "4.60",
      "132",
      "<br>N0KAM -11",
      "14097064",
    ],
    [
      "2025-06-02 18:40:00z",
      "DN84KN",
      "25",
      "12920",
      "4.75",
      "128",
      "<br>N6TDM -9",
      "14097065",
    ],
    [
      "2025-06-02 18:20:00z",
      "DN84EI",
      "21",
      "12920",
      "4.70",
      "120",
      "<br>VE6JY -16",
      "14097071",
    ],
    [
      "2025-06-02 18:00:00z",
      "DN74XE",
      "21",
      "12940",
      "4.85",
      "128",
      "<br>VE6JY -11",
      "14097067",
    ],
    [
      "2025-06-02 17:40:00z",
      "DN74RA",
      "15",
      "12960",
      "4.80",
      "128",
      "<br>KX4AZ/T -6",
      "14097068",
    ],
    [
      "2025-06-02 17:30:00z",
      "DN73OV",
      "11",
      "12940",
      "3.00",
      "116",
      "<br>KG0D -11",
      "14097064",
    ],
    [
      "2025-06-02 17:10:00z",
      "DN73JR",
      "15",
      "13020",
      "4.85",
      "112",
      "<br>VE6JY -10",
      "14097067",
    ],
    [
      "2025-06-02 16:50:00z",
      "DN73DN",
      "8",
      "12980",
      "3.10",
      "124",
      "<br>W6EXT -16",
      "14097066",
    ],
    [
      "2025-06-02 16:30:00z",
      "DN63WK",
      "8",
      "12960",
      "4.90",
      "112",
      "<br>AK0SK -21",
      "14097067",
    ],
    [
      "2025-06-02 16:10:00z",
      "DN63RH",
      "10",
      "12980",
      "4.95",
      "108",
      "<br>AK0SK -20",
      "14097068",
    ],
    [
      "2025-06-02 15:50:00z",
      "DN63ME",
      "9",
      "13000",
      "4.65",
      "104",
      "<br>VA7PP -13",
      "14097073",
    ],
    [
      "2025-06-02 15:30:00z",
      "DN63HA",
      "-3",
      "13220",
      "3.35",
      "104",
      "<br>VA7PP -22",
      "14097065",
    ],
    [
      "2025-06-02 15:20:00z",
      "DN62FX",
      "-3",
      "12960",
      "4.70",
      "104",
      "<br>N4RVE -20",
      "14097065",
    ],
    [
      "2025-06-02 00:40:00z",
      "DM08CG",
      "-1",
      "13160",
      "3.40",
      "165",
      "<br>KN6TNH -11",
      "14097067",
    ],
    [
      "2025-06-02 00:10:00z",
      "CM98WA",
      "8",
      "13060",
      "3.15",
      "153",
      "<br>WB6JHI -5",
      "14097065",
    ],
    [
      "2025-06-02 00:00:00z",
      "CM97VW",
      "17",
      "13060",
      "4.90",
      "138",
      "<br>WB6JHI -3",
      "14097070",
    ],
    [
      "2025-06-01 23:40:00z",
      "CM97ST",
      "11",
      "13100",
      "3.00",
      "146",
      "<br>W6SRI -10",
      "14097071",
    ],
    [
      "2025-06-01 23:20:00z",
      "CM97QP",
      "14",
      "13180",
      "4.75",
      "150",
      "<br>WB6JHI -2",
      "14097067",
    ],
    [
      "2025-06-01 23:00:00z",
      "CM97OM",
      "6",
      "13180",
      "4.90",
      "146",
      "<br>WB6JHI 3",
      "14097077",
    ],
    [
      "2025-06-01 22:40:00z",
      "CM97MJ",
      "10",
      "13160",
      "4.95",
      "138",
      "<br>W6BB -1",
      "14097072",
    ],
    [
      "2025-06-01 22:20:00z",
      "CM97JH",
      "13",
      "13260",
      "4.95",
      "134",
      "<br>WB6JHI 5",
      "14097075",
    ],
    [
      "2025-06-01 22:00:00z",
      "CM97HE",
      "16",
      "13160",
      "4.90",
      "130",
      "<br>W6BB 5",
      "14097073",
    ],
    [
      "2025-06-01 21:40:00z",
      "CM97FD",
      "14",
      "13140",
      "4.90",
      "118",
      "<br>KN6TNH 10",
      "14097071",
    ],
    [
      "2025-06-01 21:20:00z",
      "CM97CB",
      "19",
      "13120",
      "4.75",
      "142",
      "<br>WB6JHI 13",
      "14097070",
    ],
    [
      "2025-06-01 21:10:00z",
      "CM87XD",
      "17",
      "10160",
      "3.00",
      "142",
      "<br>W6BB 5",
      "14097071",
    ],
    [
      "2025-06-01 21:00:00z",
      "CM96AX",
      "18",
      "13120",
      "4.85",
      "122",
      "<br>WB6JHI 13",
      "14097070",
    ],
    [
      "2025-06-01 20:50:00z",
      "CM86WX",
      "20",
      "13120",
      "4.80",
      "130",
      "<br>AA6KL 16",
      "14097068",
    ],
    [
      "2025-06-01 20:30:00z",
      "CM86UV",
      "24",
      "13120",
      "4.75",
      "134",
      "<br>AA6KL 14",
      "14097067",
    ],
    [
      "2025-06-01 20:10:00z",
      "CM86RU",
      "27",
      "13140",
      "4.70",
      "130",
      "<br>AE7TF 16",
      "14097066",
    ],
    [
      "2025-06-01 19:50:00z",
      "CM86PT",
      "25",
      "13160",
      "4.70",
      "134",
      "<br>AA6KL 4",
      "14097075",
    ],
    [
      "2025-06-01 19:30:00z",
      "CM86NR",
      "24",
      "13160",
      "4.80",
      "134",
      "<br>W6BB 12",
      "14097075",
    ],
    [
      "2025-06-01 19:10:00z",
      "CM86KQ",
      "24",
      "13140",
      "4.80",
      "134",
      "<br>W6BB -2",
      "14097075",
    ],
    [
      "2025-06-01 18:50:00z",
      "CM86IP",
      "19",
      "13160",
      "4.85",
      "126",
      "<br>KG0D 4",
      "14097067",
    ],
    [
      "2025-06-01 18:30:00z",
      "CM86FO",
      "25",
      "13180",
      "4.70",
      "134",
      "<br>W6BB -2",
      "14097070",
    ],
    [
      "2025-06-01 18:10:00z",
      "CM86DN",
      "22",
      "13180",
      "4.75",
      "122",
      "<br>AE7TF -3",
      "14097073",
    ],
    [
      "2025-06-01 17:50:00z",
      "CM86AM",
      "27",
      "13180",
      "4.65",
      "126",
      "<br>KI7JOD -4",
      "14097073",
    ],
    [
      "2025-06-01 17:40:00z",
      "CM76XL",
      "26",
      "13220",
      "4.65",
      "138",
      "<br>W6SRI -4",
      "14097076",
    ],
    [
      "2025-06-01 17:20:00z",
      "CM76UK",
      "28",
      "13180",
      "4.50",
      "142",
      "<br>VA7PP -3",
      "14097076",
    ],
    [
      "2025-06-01 17:00:00z",
      "CM76RK",
      "18",
      "13200",
      "4.80",
      "157",
      "<br>W0AY -4",
      "14097072",
    ],
    [
      "2025-06-01 16:40:00z",
      "CM76OJ",
      "16",
      "13200",
      "4.65",
      "153",
      "<br>KM6TEA -10",
      "14097084",
    ],
    [
      "2025-06-01 16:20:00z",
      "CM76LJ",
      "19",
      "13220",
      "4.80",
      "142",
      "<br>VE6JY -13",
      "14097077",
    ],
    [
      "2025-06-01 16:00:00z",
      "CM76II",
      "16",
      "13200",
      "4.80",
      "146",
      "<br>W0AY -10",
      "14097084",
    ],
    [
      "2025-06-01 15:40:00z",
      "CM76FH",
      "14",
      "0",
      "4.80",
      "159",
      "<br>VE6JY -16",
      "14097077",
    ],
    [
      "2025-06-01 14:50:00z",
      "CM66VF",
      "1",
      "13180",
      "3.30",
      "161",
      "<br>VE6JY -24",
      "14097087",
    ],
    [
      "2025-06-01 03:50:00z",
      "CM33EM",
      "-28",
      "13240",
      "3.60",
      "130",
      "<br>K6ACJ -14",
      "14097064",
    ],
    [
      "2025-06-01 02:20:00z",
      "CM22XV",
      "-1",
      "13220",
      "3.15",
      "134",
      "<br>AE7TF -8",
      "14097069",
    ],
    [
      "2025-06-01 01:20:00z",
      "CM22TM",
      "-1",
      "13200",
      "4.65",
      "122",
      "<br>AE7TF -27",
      "14097065",
    ],
    [
      "2025-06-01 01:00:00z",
      "CM22SI",
      "3",
      "13200",
      "3.05",
      "118",
      "<br>KI7JOD -14",
      "14097061",
    ],
    [
      "2025-06-01 00:40:00z",
      "CM22RF",
      "9",
      "13180",
      "3.05",
      "118",
      "<br>VE6JY -17",
      "14097064",
    ],
    [
      "2025-06-01 00:20:00z",
      "CM22QC",
      "15",
      "13180",
      "4.85",
      "122",
      "<br>VE6PDQ -5",
      "14097067",
    ],
    [
      "2025-06-01 00:00:00z",
      "CM21PX",
      "11",
      "13360",
      "4.90",
      "122",
      "<br>WB6JHI -11",
      "14097060",
    ],
    [
      "2025-05-31 23:40:00z",
      "CM21OU",
      "11",
      "13200",
      "4.95",
      "122",
      "<br>K6ACJ -13",
      "14097053",
    ],
    [
      "2025-05-31 23:20:00z",
      "CM21MR",
      "15",
      "13180",
      "4.90",
      "107",
      "<br>K6ACJ -12",
      "14097064",
    ],
    [
      "2025-05-31 23:00:00z",
      "CM21LO",
      "22",
      "13180",
      "4.80",
      "122",
      "<br>K9CZI -18",
      "14097063",
    ],
    [
      "2025-05-31 22:20:00z",
      "CM21KI",
      "22",
      "13140",
      "4.75",
      "122",
      "<br>KI7JOD -8",
      "14097068",
    ],
    [
      "2025-05-31 22:00:00z",
      "CM21IE",
      "20",
      "13140",
      "4.85",
      "134",
      "<br>KI7JOD -12",
      "14097062",
    ],
    [
      "2025-05-31 21:40:00z",
      "CM21HB",
      "19",
      "13280",
      "4.80",
      "126",
      "<br>W7WKR-K1 -20",
      "14097067",
    ],
    [
      "2025-05-31 21:20:00z",
      "CM20GW",
      "24",
      "13200",
      "4.80",
      "118",
      "<br>W7EL/L -13",
      "14097063",
    ],
    [
      "2025-05-31 21:00:00z",
      "CM20FU",
      "21",
      "13140",
      "4.70",
      "130",
      "<br>KFS/OMNI -26",
      "14097165",
    ],
    [
      "2025-05-31 20:40:00z",
      "CM20ER",
      "21",
      "13040",
      "4.70",
      "130",
      "<br>K6VZK -16",
      "14097063",
    ],
    [
      "2025-05-31 19:50:00z",
      "CM20CL",
      "31",
      "13120",
      "4.70",
      "122",
      "<br>KQ6RS/6 -14",
      "14097062",
    ],
    [
      "2025-05-31 19:30:00z",
      "CM20BI",
      "27",
      "13100",
      "4.70",
      "111",
      "<br>KQ6RS/6 -16",
      "14097063",
    ],
    [
      "2025-05-31 19:10:00z",
      "CM20AG",
      "26",
      "13080",
      "4.65",
      "118",
      "<br>KQ6RS/6 -18",
      "14097063",
    ],
    [
      "2025-05-31 19:00:00z",
      "CM10XG",
      "26",
      "13100",
      "4.65",
      "118",
      "<br>KQ6RS/6 -18",
      "14097063",
    ],
    [
      "2025-05-31 18:40:00z",
      "CM10WE",
      "25",
      "13140",
      "4.70",
      "118",
      "<br>KQ6RS/6 -21",
      "14097063",
    ],
    [
      "2025-05-31 18:20:00z",
      "CM10VB",
      "17",
      "13140",
      "4.80",
      "115",
      "<br>KQ6RS/6 -18",
      "14097065",
    ],
    [
      "2025-05-31 18:00:00z",
      "CM10TA",
      "18",
      "13120",
      "4.85",
      "122",
      "<br>KQ6RS/6 -11",
      "14097065",
    ],
    [
      "2025-05-31 17:50:00z",
      "CL19SX",
      "16",
      "13140",
      "4.85",
      "111",
      "<br>KQ6RS/6 -10",
      "14097064",
    ],
    [
      "2025-05-31 17:30:00z",
      "CL19RV",
      "14",
      "13120",
      "4.80",
      "115",
      "<br>KQ6RS/6 -31",
      "14097065",
    ],
    [
      "2025-05-31 16:50:00z",
      "CL19OR",
      "11",
      "13140",
      "4.95",
      "122",
      "<br>W7EL/L -19",
      "14097066",
    ],
    [
      "2025-05-31 16:20:00z",
      "CL19MP",
      "-7",
      "13160",
      "3.45",
      "115",
      "<br>VE6PDQ -19",
      "14097065",
    ],
    [
      "2025-05-31 01:30:00z",
      "BM72NH",
      "19",
      "13220",
      "4.75",
      "93",
      "<br>KD7EFG-1 -21",
      "14097064",
    ],
    [
      "2025-05-31 00:30:00z",
      "BM72BQ",
      "18",
      "13160",
      "4.90",
      "97",
      "<br>KPH -25",
      "14097065",
    ],
    [
      "2025-05-30 23:30:00z",
      "BM62NX",
      "21",
      "13180",
      "4.80",
      "138",
      "<br>W0AY -18",
      "14097064",
    ],
    [
      "2025-05-30 23:10:00z",
      "BM63JA",
      "21",
      "13160",
      "4.85",
      "112",
      "<br>VA7JX -14",
      "14097065",
    ],
    [
      "2025-05-30 22:50:00z",
      "BM63EC",
      "17",
      "12940",
      "4.95",
      "93",
      "<br>KFS/OMNI -19",
      "14097064",
    ],
    [
      "2025-05-30 22:30:00z",
      "BM63AE",
      "25",
      "13160",
      "4.70",
      "108",
      "<br>W2ADW -26",
      "14097077",
    ],
    [
      "2025-05-30 22:20:00z",
      "BM53VF",
      "27",
      "13160",
      "4.70",
      "101",
      "<br>VA7JX -18",
      "14097070",
    ],
    [
      "2025-05-30 22:00:00z",
      "BM53RG",
      "26",
      "13220",
      "4.70",
      "93",
      "<br>KFS/OMNI -18",
      "14097063",
    ],
    [
      "2025-05-30 21:40:00z",
      "BM53MH",
      "27",
      "13340",
      "4.65",
      "97",
      "<br>VE6JY -15",
      "14097073",
    ],
    [
      "2025-05-30 21:10:00z",
      "BM53GJ",
      "21",
      "13220",
      "4.80",
      "89",
      "<br>KFS/OMNI -20",
      "14097064",
    ],
    [
      "2025-05-30 20:50:00z",
      "BM53BL",
      "20",
      "13200",
      "4.85",
      "104",
      "<br>VA7JX -23",
      "14097065",
    ],
    [
      "2025-05-30 20:40:00z",
      "BM43XM",
      "13",
      "13180",
      "4.85",
      "101",
      "<br>KFS/OMNI -21",
      "14097065",
    ],
    [
      "2025-05-30 20:00:00z",
      "BM43NQ",
      "23",
      "13200",
      "4.65",
      "112",
      "<br>AI6VN/KH6 -18",
      "14097064",
    ],
    [
      "2025-05-30 19:40:00z",
      "BM43JS",
      "20",
      "13200",
      "4.95",
      "112",
      "<br>AI6VN/KH6 -22",
      "14097065",
    ],
    [
      "2025-05-30 19:20:00z",
      "BM43EU",
      "21",
      "13220",
      "4.90",
      "112",
      "<br>AI6VN/KH6 -28",
      "14097065",
    ],
    [
      "2025-05-30 19:00:00z",
      "BM33XW",
      "14",
      "13240",
      "4.95",
      "112",
      "<br>AI6VN/KH6 -18",
      "14097066",
    ],
    [
      "2025-05-30 18:20:00z",
      "BM34NC",
      "8",
      "13200",
      "3.10",
      "124",
      "<br>AI6VN/KH6 -21",
      "14097066",
    ],
    [
      "2025-05-30 06:00:00z",
      "AM48JA",
      "-12",
      "13220",
      "3.45",
      "132",
      "<br>KQ6RS/6 -9",
      "14097065",
    ],
    [
      "2025-05-30 03:30:00z",
      "AM28OJ",
      "10",
      "13160",
      "4.95",
      "128",
      "<br>KD7EFG-1 -22",
      "14097065",
    ],
    [
      "2025-05-29 06:00:00z",
      "QM39MS",
      "-4",
      "12920",
      "3.50",
      "138",
      "<br>JA5NVN -25",
      "14097064",
    ],
    [
      "2025-05-29 05:40:00z",
      "QM39DQ",
      "1",
      "12960",
      "3.35",
      "146",
      "<br>JA5FFO -16",
      "14097067",
    ],
    [
      "2025-05-29 05:30:00z",
      "QM29WO",
      "2",
      "12980",
      "4.90",
      "142",
      "<br>JA5NVN -15",
      "14097068",
    ],
    [
      "2025-05-29 05:10:00z",
      "QM29MK",
      "9",
      "12960",
      "4.80",
      "142",
      "<br>JA5NVN -26",
      "14097066",
    ],
    [
      "2025-05-29 04:40:00z",
      "QM19WE",
      "19",
      "13000",
      "4.95",
      "134",
      "<br>JA5FFO -20",
      "14097069",
    ],
    [
      "2025-05-29 03:50:00z",
      "QM18AR",
      "14",
      "13020",
      "4.85",
      "118",
      "<br>JA5NVN -23",
      "14097066",
    ],
    [
      "2025-05-29 03:10:00z",
      "QM08HI",
      "20",
      "12900",
      "4.80",
      "111",
      "<br>JA5FFO -23",
      "14097081",
    ],
    [
      "2025-05-29 02:30:00z",
      "PM98QA",
      "19",
      "12960",
      "4.85",
      "91",
      "<br>JI1HFJ -15",
      "14097077",
    ],
    [
      "2025-05-29 02:20:00z",
      "PM97MW",
      "21",
      "12940",
      "4.80",
      "99",
      "<br>JA7KBR -13",
      "14097075",
    ],
    [
      "2025-05-29 02:00:00z",
      "PM97ES",
      "18",
      "12940",
      "4.80",
      "99",
      "<br>7L4IOU -17",
      "14097066",
    ],
    [
      "2025-05-29 01:40:00z",
      "PM87VO",
      "22",
      "12900",
      "4.80",
      "87",
      "<br>JA7KBR -18",
      "14097067",
    ],
    [
      "2025-05-29 01:20:00z",
      "PM87NL",
      "25",
      "12900",
      "4.70",
      "99",
      "<br>JJ8NTM -20",
      "14097065",
    ],
    [
      "2025-05-29 01:00:00z",
      "PM87GG",
      "21",
      "12900",
      "4.70",
      "95",
      "<br>JJ8NTM -17",
      "14097112",
    ],
    [
      "2025-05-28 23:40:00z",
      "PM76BL",
      "16",
      "12860",
      "3.10",
      "87",
      "<br>JA5NVN -10",
      "14097085",
    ],
    [
      "2025-05-28 23:30:00z",
      "PM66VI",
      "11",
      "12860",
      "4.80",
      "143",
      "<br>7L4IOU4 -20",
      "14097067",
    ],
    [
      "2025-05-28 23:10:00z",
      "PM66OD",
      "13",
      "12880",
      "4.70",
      "84",
      "<br>7L4IOU -22",
      "14097080",
    ],
    [
      "2025-05-28 22:50:00z",
      "PM65HX",
      "17",
      "12820",
      "4.80",
      "95",
      "<br>7L4IOU -21",
      "14097071",
    ],
    [
      "2025-05-28 22:30:00z",
      "PM65BU",
      "13",
      "12800",
      "4.90",
      "95",
      "<br>7L4IOU -23",
      "14097079",
    ],
    [
      "2025-05-28 22:10:00z",
      "PM55RP",
      "11",
      "12780",
      "3.00",
      "91",
      "<br>7L4IOU -28",
      "14097079",
    ],
    [
      "2025-05-28 08:20:00z",
      "OM74FW",
      "4",
      "12780",
      "3.15",
      "85",
      "<br>7L4IOU4 -20",
      "14097069",
    ],
    [
      "2025-05-28 08:00:00z",
      "OM75CC",
      "21",
      "12800",
      "3.00",
      "165",
      "<br>JA5NVN -26",
      "14097092",
    ],
    [
      "2025-05-26 02:40:00z",
      "MM09TV",
      "-2",
      "12820",
      "3.15",
      "116",
      "<br>LY3FF-11 -24",
      "14097062",
    ],
    [
      "2025-05-25 06:10:00z",
      "LM05KD",
      "26",
      "12880",
      "4.70",
      "161",
      "<br>OK2IP -16",
      "14097070",
    ],
    [
      "2025-05-25 05:50:00z",
      "LM05GD",
      "18",
      "12880",
      "4.80",
      "89",
      "<br>OK2IT -16",
      "14097080",
    ],
    [
      "2025-05-24 13:50:00z",
      "KM37VW",
      "14",
      "12920",
      "4.85",
      "153",
      "<br>OK2IP -17",
      "14097095",
    ],
    [
      "2025-05-24 13:30:00z",
      "KM37SX",
      "15",
      "12920",
      "4.90",
      "146",
      "<br>HA5GB -10",
      "14097104",
    ],
    [
      "2025-05-24 13:20:00z",
      "KM38QA",
      "20",
      "12900",
      "4.80",
      "150",
      "<br>HB9GZW -14",
      "14097082",
    ],
    [
      "2025-05-24 13:00:00z",
      "KM38NB",
      "20",
      "12920",
      "4.90",
      "153",
      "<br>OE9XRV -18",
      "14097095",
    ],
    [
      "2025-05-24 12:40:00z",
      "KM38KD",
      "17",
      "12920",
      "3.15",
      "153",
      "<br>HB9GZW -13",
      "14097087",
    ],
    [
      "2025-05-24 12:20:00z",
      "KM38GE",
      "22",
      "12900",
      "4.60",
      "150",
      "<br>OK2IP -7",
      "14097082",
    ],
    [
      "2025-05-24 12:00:00z",
      "KM38DF",
      "17",
      "12860",
      "4.80",
      "150",
      "<br>OK2IP -15",
      "14097062",
    ],
    [
      "2025-05-24 11:40:00z",
      "KM28XG",
      "20",
      "12880",
      "4.70",
      "161",
      "<br>OE3ICA -14",
      "14097083",
    ],
    [
      "2025-05-24 11:20:00z",
      "KM28TH",
      "20",
      "12860",
      "4.80",
      "85",
      "<br>HB9VQQ/ZACH -9",
      "14097078",
    ],
    [
      "2025-05-24 11:00:00z",
      "KM28QJ",
      "21",
      "12860",
      "4.80",
      "153",
      "<br>HB9VQQ/AS -12",
      "14097076",
    ],
    [
      "2025-05-24 10:40:00z",
      "KM28MK",
      "16",
      "12860",
      "4.80",
      "161",
      "<br>HB9VQQ/AS -13",
      "14097078",
    ],
    [
      "2025-05-24 10:20:00z",
      "KM28IL",
      "19",
      "12700",
      "4.80",
      "161",
      "<br>HB9VQQ/ZACH -10",
      "14097077",
    ],
    [
      "2025-05-24 10:00:00z",
      "KM28EM",
      "18",
      "12820",
      "4.85",
      "157",
      "<br>HA5GB -11",
      "14097081",
    ],
    [
      "2025-05-24 09:40:00z",
      "KM28AN",
      "16",
      "12780",
      "4.80",
      "97",
      "<br>HB9VQQ/ZACH -16",
      "14097078",
    ],
    [
      "2025-05-24 09:30:00z",
      "KM18WO",
      "19",
      "12800",
      "4.85",
      "101",
      "<br>HB9VQQ/ZACH -13",
      "14097078",
    ],
    [
      "2025-05-24 09:10:00z",
      "KM18RQ",
      "13",
      "12820",
      "3.10",
      "116",
      "<br>HB9VQQ/ZACH -7",
      "14097071",
    ],
    [
      "2025-05-24 08:50:00z",
      "KM18MR",
      "20",
      "12840",
      "3.00",
      "112",
      "<br>HB9VQQ/ZACH -12",
      "14097068",
    ],
    [
      "2025-05-24 08:30:00z",
      "KM18GO",
      "18",
      "2400",
      "4.75",
      "104",
      "<br>HB9VQQ/ZACH -8",
      "14097076",
    ],
    [
      "2025-05-24 08:10:00z",
      "KM18CT",
      "13",
      "12660",
      "4.95",
      "108",
      "<br>DM3ME -11",
      "14097079",
    ],
    [
      "2025-05-24 07:50:00z",
      "KM08VU",
      "11",
      "12900",
      "4.85",
      "128",
      "<br>IU2ITE -9",
      "14097072",
    ],
    [
      "2025-05-24 07:30:00z",
      "KM08QU",
      "13",
      "12760",
      "4.95",
      "124",
      "<br>DL7KST 1",
      "14097072",
    ],
    [
      "2025-05-24 07:10:00z",
      "KM08KU",
      "13",
      "12780",
      "4.90",
      "124",
      "<br>PA1GVZ -9",
      "14097069",
    ],
    [
      "2025-05-24 06:50:00z",
      "KM08IW",
      "5",
      "3680",
      "3.00",
      "91",
      "<br>IZ0FKE -16",
      "14097073",
    ],
    [
      "2025-05-24 06:30:00z",
      "JM98XT",
      "16",
      "12700",
      "4.90",
      "120",
      "<br>HB9GZW -16",
      "14097067",
    ],
    [
      "2025-05-24 05:20:00z",
      "JM98AQ",
      "13",
      "12680",
      "3.05",
      "103",
      "<br>EI4ACB -23",
      "14097074",
    ],
    [
      "2025-05-24 05:10:00z",
      "JM88VP",
      "11",
      "12780",
      "3.20",
      "147",
      "<br>HB9GZW -17",
      "14097065",
    ],
    [
      "2025-05-24 04:50:00z",
      "JM88PN",
      "2",
      "12760",
      "3.30",
      "136",
      "<br>HB9VQQ/AS -17",
      "14096992",
    ],
    [
      "2025-05-23 16:10:00z",
      "JM04PN",
      "-9",
      "0",
      "4.80",
      "147",
      "<br>ON5KQ -15",
      "14097070",
    ],
    [
      "2025-05-23 15:40:00z",
      "JM04LN",
      "-6",
      "12740",
      "4.95",
      "101",
      "<br>ON5SE -13",
      "14097074",
    ],
    [
      "2025-05-23 15:20:00z",
      "JM04GN",
      "14",
      "12660",
      "4.80",
      "104",
      "<br>DD5XX -10",
      "14097072",
    ],
    [
      "2025-05-23 15:00:00z",
      "JM04BM",
      "9",
      "12620",
      "4.85",
      "97",
      "<br>DL9SW -3",
      "14097076",
    ],
    [
      "2025-05-23 14:50:00z",
      "IM94XN",
      "4",
      "12680",
      "3.05",
      "97",
      "<br>HB9GZW -12",
      "14097077",
    ],
    [
      "2025-05-23 14:30:00z",
      "IM94TN",
      "21",
      "12680",
      "4.90",
      "97",
      "<br>HB9GZW -14",
      "14097091",
    ],
    [
      "2025-05-23 14:10:00z",
      "IM94ON",
      "26",
      "12680",
      "4.65",
      "93",
      "<br>DD5XX -16",
      "14097092",
    ],
    [
      "2025-05-23 13:50:00z",
      "IM94KN",
      "23",
      "12640",
      "4.85",
      "85",
      "<br>HB9VQQ -8",
      "14097061",
    ],
    [
      "2025-05-23 13:30:00z",
      "IM94GN",
      "27",
      "12560",
      "4.80",
      "104",
      "<br>EA8/DF4UE -6",
      "14097073",
    ],
    [
      "2025-05-23 13:10:00z",
      "IM94BO",
      "30",
      "12680",
      "4.60",
      "93",
      "<br>HB9VQQ/RL -11",
      "14097068",
    ],
    [
      "2025-05-23 13:00:00z",
      "IM84XP",
      "29",
      "12640",
      "4.55",
      "97",
      "<br>DF7PNX -13",
      "14097061",
    ],
    [
      "2025-05-23 12:40:00z",
      "IM84TQ",
      "25",
      "12680",
      "4.65",
      "104",
      "<br>HB9GZW -10",
      "14097061",
    ],
    [
      "2025-05-23 12:20:00z",
      "IM84PR",
      "28",
      "12700",
      "4.60",
      "101",
      "<br>EA8BFK -11",
      "14097091",
    ],
    [
      "2025-05-23 12:00:00z",
      "IM84LT",
      "31",
      "12740",
      "4.65",
      "89",
      "<br>HB9GZW -19",
      "14097064",
    ],
    [
      "2025-05-23 11:40:00z",
      "IM84HW",
      "29",
      "12760",
      "4.60",
      "165",
      "<br>EA7CL -11",
      "14097062",
    ],
    [
      "2025-05-23 11:20:00z",
      "IM85DA",
      "23",
      "12760",
      "4.80",
      "165",
      "<br>EA7CL -17",
      "14097064",
    ],
    [
      "2025-05-23 11:00:00z",
      "IM75XC",
      "23",
      "12780",
      "4.75",
      "165",
      "<br>EA8/DF4UE -14",
      "14097064",
    ],
    [
      "2025-05-23 10:40:00z",
      "IM75UF",
      "25",
      "12800",
      "4.75",
      "93",
      "<br>EA8/DF4UE -10",
      "14097063",
    ],
    [
      "2025-05-23 10:20:00z",
      "IM75QH",
      "20",
      "12780",
      "4.75",
      "165",
      "<br>EA1FAQ -11",
      "14097083",
    ],
    [
      "2025-05-23 10:00:00z",
      "IM75NK",
      "14",
      "12760",
      "4.95",
      "93",
      "<br>EA8BFK -12",
      "14097066",
    ],
    [
      "2025-05-23 09:40:00z",
      "IM75KO",
      "10",
      "12800",
      "4.90",
      "153",
      "<br>EA8/DF4UE -12",
      "14097068",
    ],
    [
      "2025-05-23 09:20:00z",
      "IM75HR",
      "15",
      "12760",
      "4.75",
      "153",
      "<br>HB9GZW -10",
      "14097069",
    ],
    [
      "2025-05-23 09:00:00z",
      "IM75EW",
      "5",
      "12780",
      "3.00",
      "165",
      "<br>DL2ZZ -8",
      "14097065",
    ],
    [
      "2025-05-23 08:50:00z",
      "IM76DA",
      "6",
      "12800",
      "4.90",
      "165",
      "<br>EA8/DF4UE -6",
      "14097065",
    ],
    [
      "2025-05-23 08:30:00z",
      "IM76AF",
      "0",
      "12860",
      "3.05",
      "93",
      "<br>F4VTQ/H -5",
      "14097068",
    ],
    [
      "2025-05-22 18:20:00z",
      "IO41PM",
      "10",
      "12740",
      "4.95",
      "108",
      "<br>DL3EL -14",
      "14097070",
    ],
    [
      "2025-05-22 18:00:00z",
      "IO41NU",
      "12",
      "12840",
      "3.00",
      "124",
      "<br>LA1ZM -10",
      "14097067",
    ],
    [
      "2025-05-22 17:50:00z",
      "IO42LD",
      "13",
      "0",
      "4.90",
      "159",
      "<br>DL3EL -12",
      "14097066",
    ],
    [
      "2025-05-22 17:20:00z",
      "IO42HO",
      "18",
      "0",
      "4.90",
      "151",
      "<br>DL3EL -14",
      "14097063",
    ],
    [
      "2025-05-22 16:50:00z",
      "IO43CB",
      "19",
      "12700",
      "3.00",
      "108",
      "<br>ON5SE -6",
      "14097072",
    ],
    [
      "2025-05-22 16:20:00z",
      "IO33VL",
      "19",
      "12760",
      "4.75",
      "112",
      "<br>DL3HRM -5",
      "14097072",
    ],
    [
      "2025-05-22 16:00:00z",
      "IO33RR",
      "19",
      "12620",
      "4.65",
      "104",
      "<br>DL3HRM -11",
      "14097066",
    ],
    [
      "2025-05-22 15:40:00z",
      "IO34NA",
      "25",
      "12740",
      "4.70",
      "89",
      "<br>DL4XU -3",
      "14097066",
    ],
    [
      "2025-05-22 15:20:00z",
      "IO34JG",
      "11",
      "12600",
      "3.20",
      "108",
      "<br>SWLHOL -6",
      "14097072",
    ],
    [
      "2025-05-22 15:00:00z",
      "IO34FM",
      "24",
      "12660",
      "4.75",
      "104",
      "<br>M0UNI -14",
      "14097076",
    ],
    [
      "2025-05-22 14:40:00z",
      "IO34BS",
      "20",
      "12740",
      "4.80",
      "101",
      "<br>DL3EL -12",
      "14097065",
    ],
    [
      "2025-05-22 14:20:00z",
      "IO25UA",
      "16",
      "12660",
      "4.85",
      "101",
      "<br>DL3HRM -13",
      "14097072",
    ],
    [
      "2025-05-22 14:00:00z",
      "IO25PF",
      "13",
      "12640",
      "4.85",
      "101",
      "<br>DM3ME -12",
      "14097067",
    ],
    [
      "2025-05-22 13:40:00z",
      "IO25KK",
      "25",
      "12680",
      "4.65",
      "104",
      "<br>DM3ME -10",
      "14097067",
    ],
    [
      "2025-05-22 13:20:00z",
      "IO25FP",
      "24",
      "12680",
      "4.60",
      "97",
      "<br>HB9VQQ/AS -11",
      "14097064",
    ],
    [
      "2025-05-22 13:00:00z",
      "IO25AT",
      "28",
      "12720",
      "4.65",
      "85",
      "<br>HB9VQQ/ZACH -15",
      "14097077",
    ],
    [
      "2025-05-22 12:50:00z",
      "IO15WV",
      "30",
      "12620",
      "4.60",
      "157",
      "<br>OZ1LFI -14",
      "14097071",
    ],
    [
      "2025-05-22 12:30:00z",
      "IO16SB",
      "27",
      "12620",
      "4.50",
      "153",
      "<br>LA1ZM -14",
      "14097068",
    ],
    [
      "2025-05-22 12:10:00z",
      "IO16PF",
      "27",
      "12640",
      "4.55",
      "153",
      "<br>LA1ZM -13",
      "14097063",
    ],
    [
      "2025-05-22 11:50:00z",
      "IO16LJ",
      "28",
      "12680",
      "4.50",
      "161",
      "<br>M0UNI -9",
      "14097062",
    ],
    [
      "2025-05-22 11:30:00z",
      "IO16HN",
      "25",
      "12600",
      "4.70",
      "153",
      "<br>LA1ZM -14",
      "14097063",
    ],
    [
      "2025-05-22 11:10:00z",
      "IO16ER",
      "31",
      "12560",
      "4.60",
      "153",
      "<br>LA1ZM -14",
      "14097064",
    ],
    [
      "2025-05-22 10:50:00z",
      "IO16AV",
      "30",
      "12580",
      "4.60",
      "157",
      "<br>DF8OE -10",
      "14097067",
    ],
    [
      "2025-05-22 10:40:00z",
      "IO06VX",
      "18",
      "12600",
      "4.80",
      "89",
      "<br>DL3EL -5",
      "14097064",
    ],
    [
      "2025-05-22 10:30:00z",
      "IO07TA",
      "26",
      "12600",
      "4.75",
      "161",
      "<br>LA1ZM -7",
      "14097055",
    ],
    [
      "2025-05-22 10:10:00z",
      "IO07OE",
      "27",
      "12580",
      "4.80",
      "153",
      "<br>PA2W -6",
      "14097060",
    ],
    [
      "2025-05-22 09:50:00z",
      "IO07KH",
      "22",
      "12580",
      "4.90",
      "165",
      "<br>LA3FY/2 -15",
      "14097065",
    ],
    [
      "2025-05-22 09:30:00z",
      "IO07BM",
      "8",
      "0",
      "4.90",
      "147",
      "<br>ON5KQ -16",
      "14097065",
    ],
    [
      "2025-05-22 05:20:00z",
      "HO77XW",
      "-11",
      "12420",
      "3.35",
      "122",
      "<br>N8VIM -15",
      "14097067",
    ],
    [
      "2025-05-21 20:30:00z",
      "HO36QF",
      "-15",
      "12080",
      "3.10",
      "122",
      "<br>GM0UDL -12",
      "14097067",
    ],
    [
      "2025-05-21 19:30:00z",
      "HO36JA",
      "-9",
      "12340",
      "3.00",
      "134",
      "<br>MM0KKF -8",
      "14097065",
    ],
    [
      "2025-05-21 18:40:00z",
      "HO25WQ",
      "17",
      "0",
      "4.90",
      "147",
      "<br>GM0UDL -13",
      "14097061",
    ],
    [
      "2025-05-21 18:10:00z",
      "HO25SO",
      "25",
      "12320",
      "4.60",
      "150",
      "<br>DL7KST -5",
      "14097067",
    ],
    [
      "2025-05-21 17:50:00z",
      "HO25OL",
      "27",
      "12300",
      "4.65",
      "146",
      "<br>DK4RW/1 -4",
      "14097067",
    ],
    [
      "2025-05-21 17:30:00z",
      "HO25LI",
      "18",
      "12280",
      "4.80",
      "138",
      "<br>HB9VQQ/ZACH -4",
      "14097068",
    ],
    [
      "2025-05-21 17:10:00z",
      "HO25IF",
      "17",
      "12280",
      "4.90",
      "138",
      "<br>GM0UDL -6",
      "14097069",
    ],
    [
      "2025-05-21 16:50:00z",
      "HO25FC",
      "11",
      "12260",
      "3.00",
      "146",
      "<br>GM0UDL -6",
      "14097065",
    ],
    [
      "2025-05-21 16:30:00z",
      "HO24CX",
      "21",
      "12160",
      "4.85",
      "138",
      "<br>GM0UDL -11",
      "14097065",
    ],
    [
      "2025-05-21 16:10:00z",
      "HO14XU",
      "24",
      "12260",
      "4.75",
      "134",
      "<br>MM0KKF -8",
      "14097071",
    ],
    [
      "2025-05-21 15:50:00z",
      "HO14US",
      "28",
      "12300",
      "4.65",
      "130",
      "<br>GM0UDL -10",
      "14097066",
    ],
    [
      "2025-05-21 15:30:00z",
      "HO14RP",
      "31",
      "12300",
      "4.65",
      "138",
      "<br>TF3HZ -6",
      "14097069",
    ],
    [
      "2025-05-21 15:10:00z",
      "HO14PL",
      "30",
      "12300",
      "4.55",
      "138",
      "<br>MM0KKF -13",
      "14097068",
    ],
    [
      "2025-05-21 14:50:00z",
      "HO14MI",
      "27",
      "12300",
      "4.70",
      "146",
      "<br>GW2HFR -16",
      "14097068",
    ],
    [
      "2025-05-21 14:30:00z",
      "HO14JF",
      "25",
      "12280",
      "4.80",
      "142",
      "<br>GM0UDL -12",
      "14097070",
    ],
    [
      "2025-05-21 14:10:00z",
      "HO14GC",
      "28",
      "12280",
      "4.60",
      "146",
      "<br>TF3HZ -19",
      "14097067",
    ],
    [
      "2025-05-21 13:50:00z",
      "HO13EX",
      "28",
      "12280",
      "4.60",
      "134",
      "<br>TF3HZ -20",
      "14097061",
    ],
    [
      "2025-05-21 13:10:00z",
      "HO03WQ",
      "31",
      "12260",
      "4.60",
      "134",
      "<br>OH6BG -26",
      "14097070",
    ],
    [
      "2025-05-21 12:50:00z",
      "HO03UN",
      "26",
      "12260",
      "4.65",
      "138",
      "<br>MM0KKF -17",
      "14097074",
    ],
    [
      "2025-05-21 12:30:00z",
      "HO03RK",
      "27",
      "12220",
      "4.60",
      "142",
      "<br>WA2TP -33",
      "14097071",
    ],
    [
      "2025-05-21 12:10:00z",
      "HO03OG",
      "25",
      "12220",
      "4.70",
      "134",
      "<br>WZ7I -17",
      "14097063",
    ],
    [
      "2025-05-21 11:50:00z",
      "HO03MD",
      "20",
      "12220",
      "4.75",
      "146",
      "<br>MM0KKF -13",
      "14097064",
    ],
    [
      "2025-05-21 11:30:00z",
      "HO03JA",
      "25",
      "12220",
      "4.80",
      "142",
      "<br>MM0KKF -17",
      "14097067",
    ],
    [
      "2025-05-21 11:20:00z",
      "HO02IX",
      "21",
      "12200",
      "4.70",
      "130",
      "<br>MM0KKF -16",
      "14097056",
    ],
    [
      "2025-05-21 11:00:00z",
      "HO02GU",
      "22",
      "12220",
      "4.70",
      "138",
      "<br>GW2HFR -22",
      "14097065",
    ],
    [
      "2025-05-21 10:10:00z",
      "GO92XM",
      "6",
      "12200",
      "3.00",
      "134",
      "<br>GW2HFR -11",
      "14097072",
    ],
    [
      "2025-05-20 22:30:00z",
      "GO92WK",
      "0",
      "0",
      "3.05",
      "147",
      "<br>N8VIM -16",
      "14097058",
    ],
    [
      "2025-05-20 20:00:00z",
      "GN56NV",
      "14",
      "0",
      "4.75",
      "155",
      "<br>WA9WTK -16",
      "14097061",
    ],
    [
      "2025-05-20 19:00:00z",
      "GN56GN",
      "8",
      "12140",
      "4.65",
      "146",
      "<br>KQ2Y -12",
      "14097065",
    ],
    [
      "2025-05-20 18:40:00z",
      "GN56DK",
      "22",
      "12240",
      "4.80",
      "142",
      "<br>N8VIM -15",
      "14097064",
    ],
    [
      "2025-05-20 18:20:00z",
      "GN56BH",
      "15",
      "12280",
      "4.90",
      "146",
      "<br>WZ7I -14",
      "14097063",
    ],
    [
      "2025-05-20 18:00:00z",
      "GN46XE",
      "21",
      "12260",
      "4.65",
      "146",
      "<br>W3BH -11",
      "14097064",
    ],
    [
      "2025-05-20 17:40:00z",
      "GN46VB",
      "25",
      "12040",
      "4.65",
      "150",
      "<br>N8VIM -15",
      "14097044",
    ],
    [
      "2025-05-20 17:30:00z",
      "GN45TX",
      "28",
      "12220",
      "4.70",
      "134",
      "<br>N8VIM -13",
      "14097053",
    ],
    [
      "2025-05-20 17:10:00z",
      "GN45RU",
      "28",
      "12300",
      "4.75",
      "138",
      "<br>KQ2Y -19",
      "14097057",
    ],
    [
      "2025-05-20 16:50:00z",
      "GN45OR",
      "25",
      "12300",
      "4.50",
      "146",
      "<br>G4FPH -8",
      "14097056",
    ],
    [
      "2025-05-20 16:30:00z",
      "GN45MO",
      "25",
      "12300",
      "4.60",
      "130",
      "<br>KB1MCT -11",
      "14097058",
    ],
    [
      "2025-05-20 16:10:00z",
      "GN45KL",
      "28",
      "12300",
      "4.65",
      "130",
      "<br>N8VIM -11",
      "14097064",
    ],
    [
      "2025-05-20 15:40:00z",
      "GN45HG",
      "25",
      "12320",
      "4.70",
      "134",
      "<br>KQ2Y -13",
      "14097062",
    ],
    [
      "2025-05-20 15:20:00z",
      "GN45FD",
      "27",
      "12300",
      "4.55",
      "138",
      "<br>KB1MCT 5",
      "14097063",
    ],
    [
      "2025-05-20 15:00:00z",
      "GN45DA",
      "31",
      "12320",
      "4.60",
      "134",
      "<br>KQ2Y -10",
      "14097058",
    ],
    [
      "2025-05-20 14:50:00z",
      "GN44CW",
      "26",
      "12300",
      "4.60",
      "134",
      "<br>KQ2Y -6",
      "14097057",
    ],
    [
      "2025-05-20 14:30:00z",
      "GN44AT",
      "28",
      "12300",
      "4.75",
      "138",
      "<br>KB1MCT -8",
      "14097070",
    ],
    [
      "2025-05-20 14:10:00z",
      "GN34XQ",
      "25",
      "12340",
      "4.65",
      "134",
      "<br>KB1MCT -14",
      "14097059",
    ],
    [
      "2025-05-20 13:50:00z",
      "GN34VN",
      "20",
      "12280",
      "4.75",
      "126",
      "<br>VE2DPF -12",
      "14097063",
    ],
    [
      "2025-05-20 13:30:00z",
      "GN34UK",
      "21",
      "12280",
      "4.75",
      "134",
      "<br>WA9FIO -2",
      "14097064",
    ],
    [
      "2025-05-20 13:10:00z",
      "GN34SI",
      "26",
      "12300",
      "4.65",
      "118",
      "<br>N8VIM -11",
      "14097062",
    ],
    [
      "2025-05-20 12:50:00z",
      "GN34QG",
      "25",
      "12340",
      "4.70",
      "118",
      "<br>KK1D -3",
      "14097064",
    ],
    [
      "2025-05-20 12:30:00z",
      "GN34PD",
      "25",
      "12360",
      "4.65",
      "134",
      "<br>G4FPH -4",
      "14097057",
    ],
    [
      "2025-05-20 12:10:00z",
      "GN34NB",
      "18",
      "12360",
      "3.10",
      "118",
      "<br>N3EYQ -4",
      "14097059",
    ],
    [
      "2025-05-20 12:00:00z",
      "GN33MX",
      "19",
      "12340",
      "4.75",
      "122",
      "<br>WA9WTK -10",
      "14097047",
    ],
    [
      "2025-05-20 11:40:00z",
      "GN33LV",
      "23",
      "12380",
      "4.75",
      "126",
      "<br>WA9WTK -15",
      "14097060",
    ],
    [
      "2025-05-20 09:40:00z",
      "GN23XH",
      "-6",
      "12380",
      "3.45",
      "122",
      "<br>K4COD -19",
      "14097065",
    ],
    [
      "2025-05-20 08:40:00z",
      "GN22RX",
      "-20",
      "12360",
      "3.60",
      "142",
      "<br>K5XL -9",
      "14097076",
    ],
    [
      "2025-05-20 08:20:00z",
      "GN22PT",
      "-31",
      "12360",
      "3.40",
      "138",
      "<br>LA1ZM -10",
      "14097067",
    ],
    [
      "2025-05-19 22:40:00z",
      "FM99WO",
      "-12",
      "12400",
      "3.40",
      "157",
      "<br>KE8UZF -10",
      "14097069",
    ],
    [
      "2025-05-19 20:00:00z",
      "FM98AT",
      "9",
      "12460",
      "3.05",
      "138",
      "<br>KE8UZF -12",
      "14097069",
    ],
    [
      "2025-05-19 19:50:00z",
      "FM88XT",
      "2",
      "12440",
      "3.05",
      "134",
      "<br>KA3LNA -11",
      "14097069",
    ],
    [
      "2025-05-19 19:30:00z",
      "FM88VS",
      "2",
      "12440",
      "3.00",
      "130",
      "<br>KE8UZF -12",
      "14097069",
    ],
    [
      "2025-05-19 19:10:00z",
      "FM88SR",
      "21",
      "12440",
      "4.70",
      "150",
      "<br>KI4WKZ -12",
      "14097069",
    ],
    [
      "2025-05-19 18:50:00z",
      "FM88PR",
      "13",
      "12440",
      "4.85",
      "130",
      "<br>KA3LNA -7",
      "14097069",
    ],
    [
      "2025-05-19 18:30:00z",
      "FM88MQ",
      "25",
      "12420",
      "4.65",
      "134",
      "<br>KA3LNA -10",
      "14097061",
    ],
    [
      "2025-05-19 18:10:00z",
      "FM88KQ",
      "22",
      "12440",
      "4.95",
      "150",
      "<br>W4KEL -12",
      "14097067",
    ],
    [
      "2025-05-19 17:50:00z",
      "FM88GQ",
      "30",
      "12440",
      "4.75",
      "150",
      "<br>KB1VC -7",
      "14097066",
    ],
    [
      "2025-05-19 17:30:00z",
      "FM88DP",
      "18",
      "12440",
      "4.95",
      "146",
      "<br>W4HOD -7",
      "14097064",
    ],
    [
      "2025-05-19 17:10:00z",
      "FM88AP",
      "30",
      "12420",
      "4.70",
      "146",
      "<br>KQ2Y -14",
      "14097069",
    ],
    [
      "2025-05-19 17:00:00z",
      "FM78WP",
      "25",
      "12460",
      "4.75",
      "157",
      "<br>KE2EYN -13",
      "14097069",
    ],
    [
      "2025-05-19 16:40:00z",
      "FM78SP",
      "30",
      "12400",
      "4.65",
      "161",
      "<br>N4MXZ -11",
      "14097067",
    ],
    [
      "2025-05-19 16:20:00z",
      "FM78PO",
      "30",
      "12460",
      "4.65",
      "161",
      "<br>KA3LNA -9",
      "14097064",
    ],
    [
      "2025-05-19 16:00:00z",
      "FM78MO",
      "23",
      "12480",
      "4.75",
      "146",
      "<br>K1HTV-4 -9",
      "14097060",
    ],
    [
      "2025-05-19 15:40:00z",
      "FM78IN",
      "27",
      "12440",
      "4.55",
      "153",
      "<br>KA3LNA -8",
      "14097064",
    ],
    [
      "2025-05-19 15:20:00z",
      "FM78FN",
      "28",
      "12420",
      "4.55",
      "150",
      "<br>KA3LNA -12",
      "14097062",
    ],
    [
      "2025-05-19 15:00:00z",
      "FM78CN",
      "26",
      "12360",
      "4.65",
      "138",
      "<br>K1HTV-4 -7",
      "14097070",
    ],
    [
      "2025-05-19 14:40:00z",
      "FM68WM",
      "19",
      "12400",
      "4.75",
      "84",
      "<br>W3VAC -11",
      "14097068",
    ],
    [
      "2025-05-19 14:20:00z",
      "FM68TN",
      "27",
      "12360",
      "4.85",
      "138",
      "<br>WD4IMI -6",
      "14097067",
    ],
    [
      "2025-05-19 14:00:00z",
      "FM68RN",
      "16",
      "12380",
      "4.95",
      "134",
      "<br>WA9WTK -1",
      "14097065",
    ],
    [
      "2025-05-19 13:40:00z",
      "FM68OO",
      "24",
      "12400",
      "4.75",
      "134",
      "<br>WD4IMI -6",
      "14097066",
    ],
    [
      "2025-05-19 13:20:00z",
      "FM68LO",
      "14",
      "12400",
      "4.65",
      "142",
      "<br>VE3XLZ 7",
      "14097067",
    ],
    [
      "2025-05-19 13:00:00z",
      "FM68IP",
      "7",
      "12360",
      "4.85",
      "130",
      "<br>KC2STA1 1",
      "14097067",
    ],
    [
      "2025-05-19 12:40:00z",
      "FM68GQ",
      "26",
      "12380",
      "4.70",
      "142",
      "<br>K1HTV-4 -5",
      "14097063",
    ],
    [
      "2025-05-19 12:20:00z",
      "FM68DR",
      "24",
      "12400",
      "3.05",
      "150",
      "<br>K3FZ -9",
      "14097067",
    ],
    [
      "2025-05-19 12:00:00z",
      "FM68AS",
      "19",
      "12400",
      "4.80",
      "161",
      "<br>WD0E -4",
      "14097063",
    ],
    [
      "2025-05-19 11:50:00z",
      "FM58WR",
      "5",
      "12160",
      "3.10",
      "99",
      "<br>N8GA-1 -23",
      "14097060",
    ],
    [
      "2025-05-19 11:20:00z",
      "FM58RV",
      "-14",
      "12440",
      "3.35",
      "142",
      "<br>W4KEL -19",
      "14097082",
    ],
    [
      "2025-05-19 10:40:00z",
      "FM59LA",
      "-11",
      "12420",
      "3.30",
      "157",
      "<br>SWLKCL -2",
      "14097072",
    ],
    [
      "2025-05-18 21:10:00z",
      "EN92MO",
      "27",
      "12440",
      "4.65",
      "161",
      "<br>KE8VOX 0",
      "14097080",
    ],
    [
      "2025-05-18 20:50:00z",
      "EN92IP",
      "31",
      "12500",
      "4.65",
      "157",
      "<br>KE8UZF -3",
      "14097081",
    ],
    [
      "2025-05-18 20:30:00z",
      "EN92FR",
      "20",
      "12500",
      "4.75",
      "165",
      "<br>KE8UZF -5",
      "14097071",
    ],
    [
      "2025-05-18 20:10:00z",
      "EN92BS",
      "21",
      "12500",
      "4.70",
      "150",
      "<br>KE8UZF -6",
      "14097072",
    ],
    [
      "2025-05-18 20:00:00z",
      "EN82XS",
      "19",
      "12520",
      "4.95",
      "85",
      "<br>KE8VOX -1",
      "14097068",
    ],
    [
      "2025-05-18 19:40:00z",
      "EN82RV",
      "26",
      "220",
      "4.55",
      "161",
      "<br>KE8VOX 0",
      "14097071",
    ],
    [
      "2025-05-18 19:20:00z",
      "EN82PU",
      "27",
      "12540",
      "4.60",
      "157",
      "<br>VA3KTJ -2",
      "14097067",
    ],
    [
      "2025-05-18 19:00:00z",
      "EN82LV",
      "24",
      "12520",
      "4.50",
      "150",
      "<br>W8UM 3",
      "14097064",
    ],
    [
      "2025-05-18 18:40:00z",
      "EN82IW",
      "27",
      "12520",
      "4.70",
      "165",
      "<br>KE8UZF 13",
      "14097062",
    ],
    [
      "2025-05-18 18:20:00z",
      "EN82EX",
      "23",
      "12500",
      "4.50",
      "157",
      "<br>WA1RAJ 14",
      "14097064",
    ],
    [
      "2025-05-18 18:00:00z",
      "EN83AA",
      "27",
      "12440",
      "4.60",
      "157",
      "<br>WA1RAJ 6",
      "14097068",
    ],
    [
      "2025-05-18 17:50:00z",
      "EN73WA",
      "23",
      "12480",
      "4.60",
      "161",
      "<br>KB8EZX -6",
      "14097063",
    ],
    [
      "2025-05-18 17:30:00z",
      "EN73SB",
      "23",
      "12440",
      "4.40",
      "161",
      "<br>KA7VIK -8",
      "14097063",
    ],
    [
      "2025-05-18 17:10:00z",
      "EN73PB",
      "29",
      "12460",
      "4.50",
      "157",
      "<br>KE8UZF -6",
      "14097064",
    ],
    [
      "2025-05-18 16:50:00z",
      "EN73LC",
      "29",
      "12520",
      "4.55",
      "161",
      "<br>KE8UZF -2",
      "14097062",
    ],
    [
      "2025-05-18 16:30:00z",
      "EN73HD",
      "21",
      "12520",
      "4.80",
      "153",
      "<br>KI4TWB/0 -6",
      "14097064",
    ],
    [
      "2025-05-18 16:10:00z",
      "EN73DE",
      "13",
      "12480",
      "4.95",
      "153",
      "<br>KB8VME 7",
      "14097066",
    ],
    [
      "2025-05-18 15:50:00z",
      "EN63XF",
      "13",
      "12540",
      "4.95",
      "153",
      "<br>K5XL 8",
      "14097064",
    ],
    [
      "2025-05-18 15:30:00z",
      "EN63TG",
      "8",
      "12540",
      "3.15",
      "153",
      "<br>K9REO 8",
      "14097059",
    ],
    [
      "2025-05-18 15:10:00z",
      "EN63QH",
      "24",
      "12500",
      "4.75",
      "85",
      "<br>KB8VME 5",
      "14097062",
    ],
    [
      "2025-05-18 14:50:00z",
      "EN63LI",
      "14",
      "12460",
      "3.15",
      "89",
      "<br>N9YBX 10",
      "14097064",
    ],
    [
      "2025-05-18 14:30:00z",
      "EN63HJ",
      "11",
      "12520",
      "4.95",
      "97",
      "<br>K9REO 7",
      "14097071",
    ],
    [
      "2025-05-18 14:10:00z",
      "EN63DK",
      "2",
      "12540",
      "4.75",
      "85",
      "<br>K9YWO 6",
      "14097067",
    ],
    [
      "2025-05-17 23:20:00z",
      "DN81SD",
      "2",
      "12600",
      "3.05",
      "150",
      "<br>WD0E -10",
      "14097071",
    ],
    [
      "2025-05-17 23:00:00z",
      "DN81OB",
      "8",
      "16600",
      "4.90",
      "157",
      "<br>VA7PP 9",
      "14097065",
    ],
    [
      "2025-05-17 22:40:00z",
      "DN80JX",
      "3",
      "0",
      "4.95",
      "85",
      "<br>KX4AZ/T 7",
      "14097066",
    ],
    [
      "2025-05-17 22:20:00z",
      "DN80IW",
      "9",
      "12640",
      "3.00",
      "153",
      "<br>VA7PP 3",
      "14097078",
    ],
    [
      "2025-05-17 22:00:00z",
      "DN80FU",
      "5",
      "12640",
      "3.10",
      "153",
      "<br>N6RY 11",
      "14097064",
    ],
    [
      "2025-05-17 21:40:00z",
      "DN80CS",
      "14",
      "12540",
      "4.75",
      "165",
      "<br>KC0KVR 8",
      "14097078",
    ],
    [
      "2025-05-17 21:20:00z",
      "DN70WQ",
      "22",
      "12560",
      "4.80",
      "161",
      "<br>N6RY 11",
      "14097064",
    ],
    [
      "2025-05-17 21:00:00z",
      "DN70SN",
      "19",
      "12600",
      "4.75",
      "157",
      "<br>KG0D 16",
      "14097073",
    ],
    [
      "2025-05-17 20:40:00z",
      "DN70PL",
      "28",
      "12560",
      "4.65",
      "85",
      "<br>WD0E 19",
      "14097062",
    ],
    [
      "2025-05-17 20:20:00z",
      "DN70LJ",
      "31",
      "12580",
      "4.70",
      "157",
      "<br>KG0D 20",
      "14097073",
    ],
    [
      "2025-05-17 20:00:00z",
      "DN70HG",
      "24",
      "12640",
      "4.70",
      "165",
      "<br>KG0D 9",
      "14097069",
    ],
    [
      "2025-05-17 19:40:00z",
      "DN70DE",
      "24",
      "12640",
      "4.75",
      "85",
      "<br>K1NTL 5",
      "14097067",
    ],
    [
      "2025-05-17 19:20:00z",
      "DN60XB",
      "22",
      "12620",
      "4.75",
      "157",
      "<br>VE7WEX 6",
      "14097075",
    ],
    [
      "2025-05-17 19:00:00z",
      "DM69UX",
      "26",
      "12560",
      "4.65",
      "157",
      "<br>KK6HPB -12",
      "14097070",
    ],
    [
      "2025-05-17 18:40:00z",
      "DM69QU",
      "28",
      "12620",
      "4.50",
      "165",
      "<br>W6EXT -2",
      "14097069",
    ],
    [
      "2025-05-17 18:20:00z",
      "DM69MR",
      "18",
      "12640",
      "4.80",
      "89",
      "<br>WD0E -2",
      "14097066",
    ],
    [
      "2025-05-17 18:00:00z",
      "DM69JO",
      "13",
      "12660",
      "4.90",
      "85",
      "<br>VE7FML -8",
      "14097066",
    ],
    [
      "2025-05-17 17:40:00z",
      "DM69FM",
      "10",
      "12660",
      "4.95",
      "89",
      "<br>WD0E -5",
      "14097067",
    ],
    [
      "2025-05-17 17:20:00z",
      "DM69CJ",
      "13",
      "12660",
      "3.00",
      "93",
      "<br>KI7E -11",
      "14097068",
    ],
    [
      "2025-05-17 17:00:00z",
      "DM59WF",
      "5",
      "12640",
      "3.00",
      "165",
      "<br>VE7WEX -12",
      "14097067",
    ],
    [
      "2025-05-17 16:40:00z",
      "DM59SC",
      "16",
      "12660",
      "3.00",
      "89",
      "<br>KG0D -12",
      "14097067",
    ],
    [
      "2025-05-17 16:20:00z",
      "DM58OX",
      "9",
      "12660",
      "4.90",
      "165",
      "<br>W5WTH -12",
      "14097066",
    ],
    [
      "2025-05-17 16:00:00z",
      "DM58LT",
      "22",
      "12640",
      "4.80",
      "161",
      "<br>KG5FNU -14",
      "14097065",
    ],
    [
      "2025-05-17 15:40:00z",
      "DM58IQ",
      "9",
      "12680",
      "4.95",
      "85",
      "<br>VE7FML -17",
      "14097066",
    ],
    [
      "2025-05-17 15:20:00z",
      "DM58GN",
      "18",
      "12640",
      "4.80",
      "157",
      "<br>VE6PDQ -4",
      "14097068",
    ],
    [
      "2025-05-17 01:00:00z",
      "DM05PM",
      "-9",
      "12860",
      "4.95",
      "130",
      "<br>K6VZK -18",
      "14097064",
    ],
    [
      "2025-05-17 00:20:00z",
      "DM05KM",
      "12",
      "12920",
      "3.00",
      "134",
      "<br>KC6WPK -16",
      "14097066",
    ],
    [
      "2025-05-17 00:00:00z",
      "DM05IL",
      "12",
      "12900",
      "3.00",
      "134",
      "<br>WD0E -9",
      "14097073",
    ],
    [
      "2025-05-16 23:40:00z",
      "DM05FL",
      "7",
      "12920",
      "3.05",
      "126",
      "<br>W6EXT -9",
      "14097077",
    ],
    [
      "2025-05-16 23:20:00z",
      "DM05DK",
      "20",
      "12960",
      "4.80",
      "130",
      "<br>VA7PP -8",
      "14097077",
    ],
    [
      "2025-05-16 23:00:00z",
      "DM05AK",
      "10",
      "12940",
      "4.90",
      "134",
      "<br>WI6P -8",
      "14097083",
    ],
    [
      "2025-05-16 22:50:00z",
      "CM95XK",
      "19",
      "12900",
      "4.75",
      "122",
      "<br>KG0D -6",
      "14097076",
    ],
    [
      "2025-05-16 22:30:00z",
      "CM95VJ",
      "20",
      "12860",
      "4.75",
      "126",
      "<br>KE4TH -7",
      "14097073",
    ],
    [
      "2025-05-16 22:10:00z",
      "CM95TJ",
      "14",
      "12980",
      "4.75",
      "130",
      "<br>KG0D -5",
      "14097068",
    ],
    [
      "2025-05-16 21:50:00z",
      "CM95RJ",
      "21",
      "13000",
      "4.80",
      "138",
      "<br>KG0D -8",
      "14097075",
    ],
    [
      "2025-05-16 21:30:00z",
      "CM95PJ",
      "20",
      "12980",
      "4.70",
      "126",
      "<br>KG0D -5",
      "14097078",
    ],
    [
      "2025-05-16 21:10:00z",
      "CM95MJ",
      "22",
      "12920",
      "4.75",
      "122",
      "<br>KG0D -5",
      "14097067",
    ],
    [
      "2025-05-16 20:50:00z",
      "CM95KJ",
      "19",
      "13000",
      "4.85",
      "126",
      "<br>KK7SB -5",
      "14097075",
    ],
    [
      "2025-05-16 20:30:00z",
      "CM95IJ",
      "22",
      "12800",
      "4.75",
      "122",
      "<br>WD0E -10",
      "14097069",
    ],
    [
      "2025-05-16 20:10:00z",
      "CM95HJ",
      "19",
      "12880",
      "4.70",
      "118",
      "<br>KM6TEA -8",
      "14097068",
    ],
    [
      "2025-05-16 19:50:00z",
      "CM95FJ",
      "18",
      "12880",
      "4.80",
      "118",
      "<br>VE6JY -8",
      "14097073",
    ],
    [
      "2025-05-16 19:30:00z",
      "CM95DJ",
      "18",
      "12940",
      "4.85",
      "122",
      "<br>KC6WPK -9",
      "14097069",
    ],
    [
      "2025-05-16 19:10:00z",
      "CM95BJ",
      "17",
      "12940",
      "4.80",
      "115",
      "<br>VE7FML -9",
      "14097069",
    ],
    [
      "2025-05-16 18:50:00z",
      "CM95AK",
      "18",
      "12880",
      "4.90",
      "107",
      "<br>KC6WPK -5",
      "14097068",
    ],
    [
      "2025-05-16 18:40:00z",
      "CM85XK",
      "22",
      "12940",
      "4.75",
      "103",
      "<br>AE7TF -5",
      "14097068",
    ],
    [
      "2025-05-16 18:20:00z",
      "CM85VK",
      "8",
      "12980",
      "4.95",
      "107",
      "<br>KI7E 4",
      "14097071",
    ],
    [
      "2025-05-16 18:00:00z",
      "CM85UL",
      "10",
      "13000",
      "3.05",
      "107",
      "<br>KC6WPK -5",
      "14097071",
    ],
    [
      "2025-05-16 17:40:00z",
      "CM85SM",
      "7",
      "12960",
      "3.10",
      "111",
      "<br>W6BB -5",
      "14097068",
    ],
    [
      "2025-05-16 17:20:00z",
      "CM85RN",
      "10",
      "12960",
      "3.15",
      "130",
      "<br>VE6JY -8",
      "14097073",
    ],
    [
      "2025-05-16 17:00:00z",
      "CM85PP",
      "0",
      "12960",
      "3.15",
      "126",
      "<br>VE7FML -5",
      "14097083",
    ],
    [
      "2025-05-16 16:40:00z",
      "CM85NQ",
      "2",
      "12960",
      "4.90",
      "122",
      "<br>AE7TF -6",
      "14097067",
    ],
    [
      "2025-05-16 16:20:00z",
      "CM85MS",
      "13",
      "12980",
      "3.00",
      "118",
      "<br>KG5FJI -3",
      "14097073",
    ],
    [
      "2025-05-16 16:00:00z",
      "CM85KT",
      "11",
      "12920",
      "3.25",
      "87",
      "<br>KFS/OMNI -15",
      "14097066",
    ],
    [
      "2025-05-16 15:30:00z",
      "CM85HW",
      "-6",
      "13000",
      "3.25",
      "130",
      "<br>W6BB 1",
      "14097074",
    ],
    [
      "2025-05-16 15:10:00z",
      "CM86FB",
      "-1",
      "13000",
      "3.25",
      "138",
      "<br>VE7FML -11",
      "14097062",
    ],
    [
      "2025-05-16 14:50:00z",
      "CM86DD",
      "-12",
      "12960",
      "3.40",
      "138",
      "<br>KL3RR -10",
      "14097065",
    ],
    [
      "2025-05-16 14:00:00z",
      "CM76VL",
      "-21",
      "13000",
      "3.30",
      "153",
      "<br>WD0E -17",
      "14097077",
    ],
    [
      "2025-05-16 01:40:00z",
      "CN21ET",
      "-16",
      "12960",
      "3.15",
      "128",
      "<br>KQ6RS/6 -12",
      "14097068",
    ],
    [
      "2025-05-16 00:50:00z",
      "CN12ME",
      "-9",
      "12960",
      "3.10",
      "128",
      "<br>WB6JHI -5",
      "14097078",
    ],
    [
      "2025-05-16 00:30:00z",
      "CN12GH",
      "-3",
      "12980",
      "3.20",
      "132",
      "<br>KK6PXP -6",
      "14097081",
    ],
    [
      "2025-05-16 00:10:00z",
      "CN02XK",
      "-1",
      "13020",
      "3.10",
      "143",
      "<br>WB6JHI -1",
      "14097076",
    ],
    [
      "2025-05-15 23:50:00z",
      "CN02RM",
      "3",
      "12980",
      "3.10",
      "132",
      "<br>WB6JHI -7",
      "14097075",
    ],
    [
      "2025-05-15 23:30:00z",
      "CN02KP",
      "10",
      "12980",
      "4.95",
      "143",
      "<br>KK6PXP -4",
      "14097072",
    ],
    [
      "2025-05-15 23:10:00z",
      "CN02DR",
      "10",
      "12980",
      "4.90",
      "143",
      "<br>KL3RR -7",
      "14097076",
    ],
    [
      "2025-05-15 22:50:00z",
      "BN92UT",
      "12",
      "13000",
      "4.90",
      "136",
      "<br>VA7JX -11",
      "14097069",
    ],
    [
      "2025-05-15 22:30:00z",
      "BN92NV",
      "17",
      "12880",
      "3.00",
      "132",
      "<br>VA7JX -12",
      "14097066",
    ],
    [
      "2025-05-15 22:10:00z",
      "BN92GX",
      "25",
      "12920",
      "4.65",
      "139",
      "<br>VA7JX -11",
      "14097068",
    ],
    [
      "2025-05-15 22:00:00z",
      "BN93DA",
      "13",
      "12940",
      "4.95",
      "143",
      "<br>KL3RR -6",
      "14097070",
    ],
    [
      "2025-05-15 21:50:00z",
      "BN83XB",
      "19",
      "12900",
      "4.90",
      "139",
      "<br>VA7JX -10",
      "14097066",
    ],
    [
      "2025-05-15 21:30:00z",
      "BN83QC",
      "29",
      "12940",
      "4.60",
      "155",
      "<br>KL5SE -13",
      "14097073",
    ],
    [
      "2025-05-15 21:10:00z",
      "BN83JD",
      "28",
      "12940",
      "4.60",
      "143",
      "<br>KL5SE -4",
      "14097065",
    ],
    [
      "2025-05-15 20:50:00z",
      "BN83BE",
      "28",
      "12920",
      "4.55",
      "139",
      "<br>KL3RR -8",
      "14097068",
    ],
    [
      "2025-05-15 20:40:00z",
      "BN73WE",
      "27",
      "12940",
      "4.55",
      "143",
      "<br>AE7TF -10",
      "14097071",
    ],
    [
      "2025-05-15 20:20:00z",
      "BN73OF",
      "31",
      "12920",
      "4.60",
      "143",
      "<br>KL5SE -16",
      "14097076",
    ],
    [
      "2025-05-15 20:00:00z",
      "BN73HF",
      "31",
      "12920",
      "4.65",
      "147",
      "<br>KQ6RS/6 -11",
      "14097074",
    ],
    [
      "2025-05-15 19:40:00z",
      "BN73AF",
      "25",
      "12900",
      "4.65",
      "159",
      "<br>KL5SE -11",
      "14097088",
    ],
    [
      "2025-05-15 19:30:00z",
      "BN63UF",
      "26",
      "12900",
      "4.65",
      "147",
      "<br>KG0D -7",
      "14097079",
    ],
    [
      "2025-05-15 19:10:00z",
      "BN63NF",
      "26",
      "12900",
      "4.60",
      "143",
      "<br>VA7JX -12",
      "14097067",
    ],
    [
      "2025-05-15 18:50:00z",
      "BN63GF",
      "26",
      "2680",
      "4.65",
      "84",
      "<br>KL3RR -8",
      "14097067",
    ],
    [
      "2025-05-15 18:30:00z",
      "BN53WG",
      "21",
      "12900",
      "4.75",
      "159",
      "<br>VE6JY -19",
      "14097078",
    ],
    [
      "2025-05-15 18:10:00z",
      "BN53PG",
      "23",
      "12880",
      "4.65",
      "147",
      "<br>K9CZI -11",
      "14097074",
    ],
    [
      "2025-05-15 17:50:00z",
      "BN53HG",
      "17",
      "12880",
      "4.90",
      "147",
      "<br>KB7GF -24",
      "14097066",
    ],
    [
      "2025-05-15 17:10:00z",
      "BN43QG",
      "9",
      "12880",
      "4.90",
      "155",
      "<br>KL5SE -9",
      "14097065",
    ],
    [
      "2025-05-15 16:50:00z",
      "BN43IF",
      "7",
      "12680",
      "4.95",
      "84",
      "<br>KL5SE -19",
      "14097065",
    ],
    [
      "2025-05-15 15:40:00z",
      "BN23UC",
      "-15",
      "0",
      "3.35",
      "147",
      "<br>K0ESQ -20",
      "14097100",
    ],
    [
      "2025-05-15 06:10:00z",
      "AN20IT",
      "-3",
      "0",
      "3.20",
      "151",
      "<br>KQ6RS/6 -11",
      "14097070",
    ],
    [
      "2025-05-15 03:20:00z",
      "RM89VX",
      "1",
      "12620",
      "3.20",
      "134",
      "<br>KQ6RS/6 -27",
      "14097067",
    ],
    [
      "2025-05-15 02:00:00z",
      "RM79GP",
      "14",
      "12540",
      "4.90",
      "118",
      "<br>KD7EFG-1 -25",
      "14097062",
    ],
    [
      "2025-05-14 21:30:00z",
      "RM28DR",
      "31",
      "12720",
      "4.70",
      "103",
      "<br>JJ0VBZ -24",
      "14097073",
    ],
    [
      "2025-05-14 21:20:00z",
      "RM18XS",
      "18",
      "12740",
      "4.80",
      "99",
      "<br>7L4IOU -26",
      "14097069",
    ],
    [
      "2025-05-14 19:20:00z",
      "RM09CC",
      "-9",
      "12620",
      "3.20",
      "91",
      "<br>7L4IOU -21",
      "14097064",
    ],
    [
      "2025-05-14 06:20:00z",
      "QM08GV",
      "-9",
      "12780",
      "4.95",
      "101",
      "<br>7L4IOU5 -8",
      "14097068",
    ],
    [
      "2025-05-14 05:50:00z",
      "PM98XT",
      "0",
      "12820",
      "3.15",
      "97",
      "<br>JA5NVN -15",
      "14097062",
    ],
    [
      "2025-05-14 03:50:00z",
      "PM88AH",
      "15",
      "9180",
      "4.75",
      "153",
      "<br>JA5FFO -23",
      "14097075",
    ],
    [
      "2025-05-14 02:50:00z",
      "PM88GK",
      "22",
      "12840",
      "4.70",
      "108",
      "<br>7L4IOU5 -15",
      "14097069",
    ],
    [
      "2025-05-14 02:30:00z",
      "PM88BK",
      "23",
      "12820",
      "4.80",
      "101",
      "<br>JA5NVN -22",
      "14097069",
    ],
    [
      "2025-05-14 01:50:00z",
      "PM78QJ",
      "25",
      "12820",
      "4.75",
      "93",
      "<br>JA7KBR3 -20",
      "14097070",
    ],
    [
      "2025-05-14 01:00:00z",
      "PM78EI",
      "29",
      "12820",
      "4.65",
      "101",
      "<br>7L4IOU -20",
      "14097060",
    ],
    [
      "2025-05-14 00:40:00z",
      "PM68WH",
      "24",
      "12800",
      "4.75",
      "104",
      "<br>JH6LAV -11",
      "14097068",
    ],
    [
      "2025-05-14 00:10:00z",
      "PM68PG",
      "21",
      "12820",
      "4.80",
      "108",
      "<br>JJ8NTM -18",
      "14097070",
    ],
    [
      "2025-05-13 22:30:00z",
      "PM58QD",
      "8",
      "12800",
      "3.10",
      "104",
      "<br>JA5NVN -21",
      "14097073",
    ],
    [
      "2025-05-13 21:40:00z",
      "PM58EB",
      "-6",
      "12820",
      "3.35",
      "104",
      "<br>OE3GBB/Q2 -28",
      "14097061",
    ],
    [
      "2025-05-12 23:10:00z",
      "NN90MD",
      "-8",
      "12680",
      "3.40",
      "136",
      "<br>OH6BG -28",
      "14097063",
    ],
    [
      "2025-05-12 04:20:00z",
      "MN70AH",
      "15",
      "17500",
      "3.55",
      "126",
      "<br>OE3GBB/Q2 -26",
      "14097063",
    ],
    [
      "2025-05-12 02:30:00z",
      "MN60XH",
      "9",
      "12740",
      "3.00",
      "153",
      "<br>HB9TJM -28",
      "14097064",
    ],
    [
      "2025-05-11 05:10:00z",
      "LN90PR",
      "12",
      "12840",
      "3.00",
      "134",
      "<br>ES5TVI -25",
      "14097075",
    ],
    [
      "2025-05-11 04:50:00z",
      "LN90MS",
      "14",
      "12820",
      "4.95",
      "122",
      "<br>ES5TVI -19",
      "14097065",
    ],
    [
      "2025-05-11 04:30:00z",
      "LN90IT",
      "-1",
      "0",
      "3.05",
      "155",
      "<br>ES5TVI -23",
      "14097057",
    ],
    [
      "2025-05-11 02:50:00z",
      "LN80VX",
      "-1",
      "12820",
      "3.20",
      "122",
      "<br>ES5TVI -21",
      "14097073",
    ],
    [
      "2025-05-10 12:50:00z",
      "LN30TQ",
      "16",
      "12820",
      "4.80",
      "146",
      "<br>ES5TVI -17",
      "14097064",
    ],
    [
      "2025-05-10 12:30:00z",
      "LN30QQ",
      "7",
      "12780",
      "4.70",
      "142",
      "<br>RZ3DVP -15",
      "14097063",
    ],
    [
      "2025-05-10 11:30:00z",
      "LN30HP",
      "19",
      "12820",
      "3.15",
      "146",
      "<br>OE3GBB/Q2 -25",
      "14097192",
    ],
    [
      "2025-05-10 11:10:00z",
      "LN30EO",
      "13",
      "12820",
      "3.10",
      "146",
      "<br>OE3GBB/Q2 -17",
      "14097063",
    ],
    [
      "2025-05-10 10:30:00z",
      "LN20WN",
      "25",
      "12840",
      "4.80",
      "142",
      "<br>OE3GBB/Q2 -17",
      "14097064",
    ],
    [
      "2025-05-10 10:10:00z",
      "LN20TM",
      "13",
      "12940",
      "3.05",
      "142",
      "<br>LY3FF-11 -19",
      "14097063",
    ],
    [
      "2025-05-10 09:50:00z",
      "LN20RL",
      "15",
      "12840",
      "3.05",
      "134",
      "<br>LY3FF-11 -19",
      "14097046",
    ],
    [
      "2025-05-10 09:30:00z",
      "LN20OL",
      "31",
      "12760",
      "4.60",
      "134",
      "<br>OE3GBB/Q2 -26",
      "14097064",
    ],
    [
      "2025-05-10 08:40:00z",
      "LN20HL",
      "25",
      "12760",
      "4.85",
      "146",
      "<br>OE3GBB/Q2 -23",
      "14097057",
    ],
    [
      "2025-05-10 08:20:00z",
      "LN20DM",
      "25",
      "12820",
      "4.70",
      "153",
      "<br>GM0UDL -20",
      "14097062",
    ],
    [
      "2025-05-10 08:00:00z",
      "LN10XM",
      "26",
      "12820",
      "4.65",
      "157",
      "<br>TA5/DL6JH -20",
      "14097064",
    ],
    [
      "2025-05-10 07:40:00z",
      "LN10TM",
      "26",
      "12660",
      "4.70",
      "93",
      "<br>OE3GBB/Q2 -18",
      "14097062",
    ],
    [
      "2025-05-10 07:00:00z",
      "LN10KM",
      "21",
      "12840",
      "4.75",
      "85",
      "<br>TA5/DL6JH -13",
      "14097068",
    ],
    [
      "2025-05-10 06:40:00z",
      "LN10GM",
      "6",
      "12840",
      "4.80",
      "93",
      "<br>OK2MTB -22",
      "14097084",
    ],
    [
      "2025-05-10 06:20:00z",
      "LN10BL",
      "8",
      "12880",
      "3.25",
      "97",
      "<br>UA6WKM -22",
      "14097089",
    ],
    [
      "2025-05-10 06:10:00z",
      "LN00SK",
      "12",
      "0",
      "4.80",
      "147",
      "<br>OE3GBB/Q2 -19",
      "14097064",
    ],
    [
      "2025-05-10 05:50:00z",
      "LN00SK",
      "18",
      "12900",
      "4.90",
      "97",
      "<br>ON5KQ -17",
      "14097064",
    ],
    [
      "2025-05-10 05:30:00z",
      "LN00MJ",
      "23",
      "0",
      "4.85",
      "159",
      "<br>ON5KQ -23",
      "14097063",
    ],
    [
      "2025-05-10 05:10:00z",
      "LN00II",
      "15",
      "12820",
      "3.10",
      "89",
      "<br>OE3GBB -23",
      "14097113",
    ],
    [
      "2025-05-10 04:50:00z",
      "LN00GH",
      "9",
      "12780",
      "3.15",
      "97",
      "<br>LY4PR-11 -20",
      "14097096",
    ],
    [
      "2025-05-10 04:20:00z",
      "KN90WF",
      "-2",
      "0",
      "3.15",
      "155",
      "<br>OK2IP -15",
      "14097102",
    ],
    [
      "2025-05-09 13:40:00z",
      "KM28NO",
      "10",
      "12860",
      "3.00",
      "128",
      "<br>DL9SW -9",
      "14097074",
    ],
    [
      "2025-05-09 13:20:00z",
      "KM28HN",
      "14",
      "12820",
      "4.85",
      "124",
      "<br>OK2IP -12",
      "14097081",
    ],
    [
      "2025-05-09 13:00:00z",
      "KM28CL",
      "16",
      "12820",
      "4.80",
      "116",
      "<br>DJ2MG -12",
      "14097072",
    ],
    [
      "2025-05-09 12:50:00z",
      "KM18XK",
      "24",
      "12800",
      "4.70",
      "120",
      "<br>DL4RU -9",
      "14097074",
    ],
    [
      "2025-05-09 12:30:00z",
      "KM18SI",
      "27",
      "12780",
      "4.70",
      "120",
      "<br>OK2IP -11",
      "14097080",
    ],
    [
      "2025-05-09 12:10:00z",
      "KM18MH",
      "22",
      "12820",
      "4.70",
      "108",
      "<br>HA4BM -12",
      "14097063",
    ],
    [
      "2025-05-09 11:50:00z",
      "KM18HF",
      "21",
      "12580",
      "4.80",
      "108",
      "<br>OE7HKJ -16",
      "14097103",
    ],
    [
      "2025-05-09 11:30:00z",
      "KM18CE",
      "19",
      "12780",
      "4.80",
      "116",
      "<br>OK2IP -13",
      "14097081",
    ],
    [
      "2025-05-09 11:20:00z",
      "KM08XD",
      "24",
      "12780",
      "4.70",
      "120",
      "<br>DL9SW -11",
      "14097084",
    ],
    [
      "2025-05-09 11:00:00z",
      "KM08SB",
      "21",
      "12780",
      "4.70",
      "120",
      "<br>DJ2MG -9",
      "14097073",
    ],
    [
      "2025-05-09 10:40:00z",
      "KM07MX",
      "17",
      "12820",
      "4.85",
      "124",
      "<br>OK2IT -10",
      "14097073",
    ],
    [
      "2025-05-09 10:20:00z",
      "KM07HV",
      "15",
      "12840",
      "3.00",
      "120",
      "<br>OK2IP -9",
      "14097072",
    ],
    [
      "2025-05-09 10:00:00z",
      "KM07BR",
      "17",
      "9920",
      "4.90",
      "108",
      "<br>OK2IP -10",
      "14097072",
    ],
    [
      "2025-05-09 09:50:00z",
      "JM97XR",
      "21",
      "12800",
      "4.70",
      "120",
      "<br>OK2IP -8",
      "14097072",
    ],
    [
      "2025-05-09 09:30:00z",
      "JM97SN",
      "23",
      "12760",
      "4.65",
      "112",
      "<br>TA4/G8SCU -9",
      "14097069",
    ],
    [
      "2025-05-09 09:10:00z",
      "JM97NK",
      "15",
      "12780",
      "4.85",
      "112",
      "<br>OK2IP -7",
      "14097072",
    ],
    [
      "2025-05-09 08:40:00z",
      "JM97GG",
      "25",
      "12740",
      "4.60",
      "101",
      "<br>TA4/G8SCU -7",
      "14097066",
    ],
    [
      "2025-05-09 08:20:00z",
      "JM97BD",
      "20",
      "12740",
      "4.70",
      "116",
      "<br>LA1ZM -7",
      "14097075",
    ],
    [
      "2025-05-09 08:10:00z",
      "JM87XC",
      "13",
      "12760",
      "4.95",
      "124",
      "<br>TA4/G8SCU -4",
      "14097074",
    ],
    [
      "2025-05-09 07:50:00z",
      "JM87SA",
      "13",
      "12740",
      "4.95",
      "108",
      "<br>DF5VL -6",
      "14097070",
    ],
    [
      "2025-05-09 07:40:00z",
      "JM86PX",
      "19",
      "12740",
      "4.80",
      "97",
      "<br>OZ2JBR -6",
      "14097082",
    ],
    [
      "2025-05-09 07:20:00z",
      "JM86KW",
      "16",
      "12720",
      "4.95",
      "124",
      "<br>IW2DMO -4",
      "14097092",
    ],
    [
      "2025-05-09 06:50:00z",
      "JM86DT",
      "1",
      "12780",
      "3.00",
      "132",
      "<br>LA1ZM -12",
      "14097065",
    ],
    [
      "2025-05-08 16:20:00z",
      "IM74UG",
      "14",
      "12700",
      "4.80",
      "139",
      "<br>HB9VQQ/RE -24",
      "14097072",
    ],
    [
      "2025-05-08 16:00:00z",
      "IM74ME",
      "14",
      "12660",
      "4.90",
      "147",
      "<br>DD5XX -21",
      "14097071",
    ],
    [
      "2025-05-08 15:40:00z",
      "IM74GD",
      "15",
      "12700",
      "3.10",
      "128",
      "<br>EB4FJN -7",
      "14097072",
    ],
    [
      "2025-05-08 15:20:00z",
      "IM74AC",
      "20",
      "12740",
      "4.80",
      "139",
      "<br>EB4FJN -12",
      "14097055",
    ],
    [
      "2025-05-08 15:10:00z",
      "IM64VC",
      "25",
      "12700",
      "4.65",
      "139",
      "<br>EB4FJN -7",
      "14097054",
    ],
    [
      "2025-05-08 14:50:00z",
      "IM64QB",
      "19",
      "12740",
      "4.85",
      "136",
      "<br>CT1ANO -11",
      "14097061",
    ],
    [
      "2025-05-08 14:30:00z",
      "IM64KA",
      "23",
      "12680",
      "4.60",
      "143",
      "<br>CT1ANO -10",
      "14097046",
    ],
    [
      "2025-05-08 14:10:00z",
      "IM63EX",
      "23",
      "12720",
      "4.65",
      "128",
      "<br>EA1FAQ -11",
      "14097064",
    ],
    [
      "2025-05-08 13:50:00z",
      "IM53WW",
      "19",
      "12660",
      "4.90",
      "139",
      "<br>EA1FAQ -6",
      "14097062",
    ],
    [
      "2025-05-08 13:30:00z",
      "IM53QV",
      "24",
      "12720",
      "4.65",
      "136",
      "<br>EA1FAQ -6",
      "14097063",
    ],
    [
      "2025-05-08 13:10:00z",
      "IM53JT",
      "23",
      "12700",
      "4.80",
      "139",
      "<br>DD5XX -7",
      "14097032",
    ],
    [
      "2025-05-08 12:50:00z",
      "IM53DR",
      "19",
      "12680",
      "4.85",
      "136",
      "<br>EA1FAQ -7",
      "14097064",
    ],
    [
      "2025-05-08 12:30:00z",
      "IM43VP",
      "21",
      "12700",
      "4.85",
      "147",
      "<br>DD5XX -8",
      "14097032",
    ],
    [
      "2025-05-08 12:10:00z",
      "IM43PN",
      "23",
      "12720",
      "4.80",
      "139",
      "<br>EA1FAQ -7",
      "14097067",
    ],
    [
      "2025-05-08 11:50:00z",
      "IM43JL",
      "21",
      "12720",
      "4.85",
      "147",
      "<br>EA7CL -7",
      "14097065",
    ],
    [
      "2025-05-08 11:30:00z",
      "IM43DI",
      "14",
      "12720",
      "4.95",
      "151",
      "<br>EA8BFK -16",
      "14097036",
    ],
    [
      "2025-05-08 11:10:00z",
      "IM33VF",
      "16",
      "12720",
      "4.95",
      "143",
      "<br>EA1FAQ -16",
      "14097034",
    ],
    [
      "2025-05-08 10:50:00z",
      "IM33PD",
      "8",
      "12800",
      "3.10",
      "143",
      "<br>EA7CL -12",
      "14097066",
    ],
    [
      "2025-05-08 10:30:00z",
      "IM33JB",
      "25",
      "12760",
      "4.70",
      "124",
      "<br>EA1FAQ -12",
      "14097032",
    ],
    [
      "2025-05-08 10:10:00z",
      "IM32EX",
      "24",
      "12800",
      "4.65",
      "136",
      "<br>EA1FAQ -13",
      "14097071",
    ],
    [
      "2025-05-08 09:50:00z",
      "IM22WU",
      "7",
      "12820",
      "3.00",
      "132",
      "<br>DD5XX -12",
      "14097070",
    ],
    [
      "2025-05-08 09:30:00z",
      "IM22RS",
      "-1",
      "12800",
      "3.05",
      "116",
      "<br>EA1FAQ -16",
      "14097106",
    ],
    [
      "2025-05-08 09:10:00z",
      "IM22LQ",
      "9",
      "12820",
      "4.65",
      "120",
      "<br>ON5KQ -17",
      "14097092",
    ],
    [
      "2025-05-08 08:00:00z",
      "IM12QH",
      "-30",
      "12840",
      "3.60",
      "128",
      "<br>KP2RUM -16",
      "14097066",
    ],
    [
      "2025-05-07 20:20:00z",
      "HL38VR",
      "-6",
      "0",
      "3.30",
      "159",
      "<br>DK4RW/1 -8",
      "14097071",
    ],
    [
      "2025-05-07 20:00:00z",
      "HL38RQ",
      "-14",
      "12920",
      "3.45",
      "101",
      "<br>ON5KQ -13",
      "14097081",
    ],
    [
      "2025-05-07 19:00:00z",
      "HL38EP",
      "4",
      "12860",
      "3.05",
      "97",
      "<br>GM0UDL -18",
      "14097064",
    ],
    [
      "2025-05-07 18:40:00z",
      "HL28VQ",
      "17",
      "0",
      "4.80",
      "159",
      "<br>GM0DHD -13",
      "14097065",
    ],
    [
      "2025-05-07 18:10:00z",
      "HL28SR",
      "18",
      "12880",
      "3.00",
      "101",
      "<br>KQ2Y -11",
      "14097066",
    ],
    [
      "2025-05-07 17:50:00z",
      "HL28MS",
      "21",
      "12940",
      "4.80",
      "108",
      "<br>GM0UDL -10",
      "14097069",
    ],
    [
      "2025-05-07 17:30:00z",
      "HL28IT",
      "25",
      "12940",
      "4.75",
      "108",
      "<br>GM0UDL -16",
      "14097064",
    ],
    [
      "2025-05-07 17:10:00z",
      "HL28EU",
      "25",
      "12920",
      "4.75",
      "93",
      "<br>EA8BFK -9",
      "14097065",
    ],
    [
      "2025-05-07 16:50:00z",
      "HL28AU",
      "22",
      "12940",
      "4.75",
      "93",
      "<br>EA8BFK -11",
      "14097065",
    ],
    [
      "2025-05-07 16:40:00z",
      "HL18VV",
      "26",
      "12840",
      "4.80",
      "101",
      "<br>GM0DHD -14",
      "14097064",
    ],
    [
      "2025-05-07 16:20:00z",
      "HL18RV",
      "19",
      "12940",
      "4.75",
      "93",
      "<br>EA8BFK -10",
      "14097065",
    ],
    [
      "2025-05-07 16:00:00z",
      "HL18NW",
      "20",
      "12920",
      "4.70",
      "97",
      "<br>EA8BFK -14",
      "14097064",
    ],
    [
      "2025-05-07 15:30:00z",
      "HL18GX",
      "21",
      "12680",
      "4.85",
      "93",
      "<br>EA8BFK -15",
      "14097065",
    ],
    [
      "2025-05-07 15:10:00z",
      "HL18CX",
      "22",
      "12900",
      "4.75",
      "93",
      "<br>EA8BFK -9",
      "14097064",
    ],
    [
      "2025-05-07 14:50:00z",
      "HL08WX",
      "24",
      "12720",
      "4.70",
      "165",
      "<br>EA8BFK -15",
      "14097065",
    ],
    [
      "2025-05-07 14:30:00z",
      "HL08TX",
      "22",
      "12700",
      "4.75",
      "93",
      "<br>WA2TP -26",
      "14097068",
    ],
    [
      "2025-05-07 13:50:00z",
      "HL08LX",
      "23",
      "12840",
      "4.90",
      "89",
      "<br>KX4O -27",
      "14097065",
    ],
    [
      "2025-05-07 13:30:00z",
      "HL08HW",
      "23",
      "12820",
      "4.75",
      "116",
      "<br>KQ2Y -15",
      "14097064",
    ],
    [
      "2025-05-07 13:10:00z",
      "HL08EW",
      "22",
      "12940",
      "4.80",
      "161",
      "<br>EA8BFK -13",
      "14097063",
    ],
    [
      "2025-05-07 12:50:00z",
      "HL08BV",
      "23",
      "12940",
      "4.65",
      "157",
      "<br>W4MXZ -19",
      "14097067",
    ],
    [
      "2025-05-07 12:40:00z",
      "GL98XV",
      "11",
      "12940",
      "3.05",
      "165",
      "<br>WZ7I -27",
      "",
    ],
    [
      "2025-05-07 11:30:00z",
      "GL98MX",
      "8",
      "13020",
      "4.90",
      "157",
      "<br>KQ2Y -22",
      "14097062",
    ],
    [
      "2025-05-06 20:40:00z",
      "GM52CD",
      "7",
      "13140",
      "3.20",
      "115",
      "<br>KQ2Y -18",
      "14097087",
    ],
    [
      "2025-05-06 20:20:00z",
      "GM52AF",
      "14",
      "13180",
      "4.85",
      "118",
      "<br>N2YCH-1 -19",
      "14097065",
    ],
    [
      "2025-05-06 20:10:00z",
      "GM42XG",
      "11",
      "13160",
      "3.15",
      "118",
      "<br>N2HQI -23",
      "14097065",
    ],
    [
      "2025-05-06 19:30:00z",
      "GM42TL",
      "13",
      "0",
      "4.90",
      "159",
      "<br>KP2RUM -20",
      "14097133",
    ],
    [
      "2025-05-06 18:50:00z",
      "GM42RO",
      "8",
      "13160",
      "4.80",
      "115",
      "<br>N2HQI -18",
      "14097081",
    ],
    [
      "2025-05-06 18:30:00z",
      "GM42QQ",
      "6",
      "13200",
      "3.00",
      "134",
      "<br>N2HQI -14",
      "14097093",
    ],
    [
      "2025-05-06 18:10:00z",
      "GM42OT",
      "14",
      "13220",
      "4.90",
      "118",
      "<br>N2HQI -8",
      "14097087",
    ],
    [
      "2025-05-06 17:40:00z",
      "GM42MW",
      "6",
      "13140",
      "4.95",
      "115",
      "<br>KR4LO -22",
      "14097094",
    ],
    [
      "2025-05-06 17:20:00z",
      "GM43KA",
      "9",
      "13200",
      "3.00",
      "159",
      "<br>KP2RUM -14",
      "14097132",
    ],
    [
      "2025-05-06 16:40:00z",
      "GM43HE",
      "16",
      "13180",
      "4.85",
      "130",
      "<br>KP2RUM -19",
      "14097199",
    ],
    [
      "2025-05-06 16:10:00z",
      "GM43FH",
      "14",
      "12980",
      "4.80",
      "115",
      "<br>W1BW -30",
      "14097198",
    ],
    [
      "2025-05-06 15:50:00z",
      "GM43DJ",
      "15",
      "13140",
      "4.85",
      "122",
      "<br>KP2RUM -20",
      "14097198",
    ],
    [
      "2025-05-06 15:30:00z",
      "GM43CL",
      "14",
      "13100",
      "3.00",
      "107",
      "<br>KP2RUM -20",
      "14097099",
    ],
    [
      "2025-05-06 15:10:00z",
      "GM43AM",
      "15",
      "13100",
      "4.95",
      "111",
      "<br>W1BW -30",
      "14097097",
    ],
    [
      "2025-05-06 15:00:00z",
      "GM43AM",
      "15",
      "13100",
      "4.95",
      "111",
      "<br>KP2RUM -15",
      "14097110",
    ],
    [
      "2025-05-06 14:40:00z",
      "GM33WO",
      "16",
      "13120",
      "4.90",
      "115",
      "<br>N2HQI -16",
      "14097081",
    ],
    [
      "2025-05-06 14:20:00z",
      "GM33UP",
      "15",
      "13100",
      "4.85",
      "103",
      "<br>N2HQI -15",
      "14097065",
    ],
    [
      "2025-05-06 13:40:00z",
      "GM33SS",
      "19",
      "13140",
      "4.95",
      "115",
      "<br>KQ2Y -18",
      "14097073",
    ],
    [
      "2025-05-06 13:20:00z",
      "GM33QT",
      "19",
      "13160",
      "4.75",
      "122",
      "<br>KP2RUM -12",
      "14097076",
    ],
    [
      "2025-05-06 12:50:00z",
      "GM33OW",
      "14",
      "13140",
      "4.85",
      "118",
      "<br>KQ2Y -8",
      "14097070",
    ],
    [
      "2025-05-06 12:30:00z",
      "GM34NA",
      "13",
      "13140",
      "3.15",
      "111",
      "<br>KH6FA -12",
      "14097067",
    ],
    [
      "2025-05-06 12:10:00z",
      "GM34MC",
      "16",
      "13180",
      "4.85",
      "111",
      "<br>KQ2Y -13",
      "14097080",
    ],
    [
      "2025-05-06 11:40:00z",
      "GM34JF",
      "6",
      "0",
      "3.15",
      "151",
      "<br>W4HOD -22",
      "14097076",
    ],
    [
      "2025-05-06 11:20:00z",
      "GM34HH",
      "7",
      "0",
      "3.20",
      "159",
      "<br>K4NLC -8",
      "14097097",
    ],
    [
      "2025-05-06 09:30:00z",
      "GM34CO",
      "-18",
      "13140",
      "3.45",
      "107",
      "<br>K4COD -12",
      "14097071",
    ],
    [
      "2025-05-05 19:30:00z",
      "GM16EM",
      "-5",
      "13140",
      "4.70",
      "103",
      "<br>KB1VC -3",
      "14097063",
    ],
    [
      "2025-05-05 19:10:00z",
      "GM16CN",
      "3",
      "13120",
      "3.35",
      "99",
      "<br>KA3LNA 4",
      "14097070",
    ],
    [
      "2025-05-05 18:40:00z",
      "GM16AO",
      "12",
      "13120",
      "3.15",
      "103",
      "<br>KA3LNA -2",
      "14097066",
    ],
    [
      "2025-05-05 18:20:00z",
      "GM06XP",
      "9",
      "13100",
      "3.15",
      "107",
      "<br>WA9WTK -2",
      "14097060",
    ],
    [
      "2025-05-05 17:50:00z",
      "GM06WQ",
      "22",
      "13100",
      "4.90",
      "91",
      "<br>WA9FIO 3",
      "14097071",
    ],
    [
      "2025-05-05 17:30:00z",
      "GM06VQ",
      "12",
      "13120",
      "4.95",
      "91",
      "<br>KB1VC -1",
      "14097067",
    ],
    [
      "2025-05-05 17:10:00z",
      "GM06UR",
      "30",
      "13080",
      "4.65",
      "87",
      "<br>WA9WTK -6",
      "14097065",
    ],
    [
      "2025-05-05 16:40:00z",
      "GM06SS",
      "19",
      "13100",
      "4.80",
      "107",
      "<br>WA9WTK -5",
      "14097062",
    ],
    [
      "2025-05-05 16:20:00z",
      "GM06RS",
      "17",
      "12960",
      "4.90",
      "99",
      "<br>W3CHB -3",
      "14097057",
    ],
    [
      "2025-05-05 15:50:00z",
      "GM06QT",
      "21",
      "13120",
      "4.80",
      "99",
      "<br>W4MXZ -4",
      "14097071",
    ],
    [
      "2025-05-05 15:30:00z",
      "GM06PT",
      "17",
      "13100",
      "4.95",
      "84",
      "<br>KA3LNA -2",
      "14097071",
    ],
    [
      "2025-05-05 15:10:00z",
      "GM06OU",
      "26",
      "13100",
      "4.80",
      "91",
      "<br>N4TVC/4 -8",
      "14097069",
    ],
    [
      "2025-05-05 14:40:00z",
      "GM06NV",
      "12",
      "13080",
      "4.95",
      "91",
      "<br>VA7PP -3",
      "14097070",
    ],
    [
      "2025-05-05 14:20:00z",
      "GM06MW",
      "13",
      "13100",
      "3.00",
      "103",
      "<br>WA9WTK -4",
      "14097068",
    ],
    [
      "2025-05-05 13:50:00z",
      "GM06KX",
      "8",
      "13120",
      "3.00",
      "91",
      "<br>W4MXZ -4",
      "14097072",
    ],
    [
      "2025-05-05 13:30:00z",
      "GM07JA",
      "5",
      "13120",
      "3.10",
      "99",
      "<br>KD7SCT -7",
      "14097069",
    ],
    [
      "2025-05-05 13:10:00z",
      "GM07IA",
      "14",
      "13120",
      "3.00",
      "87",
      "<br>N3CHX -10",
      "14097065",
    ],
    [
      "2025-05-05 12:40:00z",
      "GM07HB",
      "-2",
      "13100",
      "3.00",
      "99",
      "<br>N3CHX -5",
      "14097057",
    ],
    [
      "2025-05-05 12:20:00z",
      "GM07GC",
      "-13",
      "13080",
      "4.80",
      "99",
      "<br>KA3LNA -15",
      "14097081",
    ],
    [
      "2025-05-04 22:20:00z",
      "FM87JT",
      "-11",
      "12980",
      "3.15",
      "111",
      "<br>N2HQI -7",
      "14097065",
    ],
    [
      "2025-05-04 20:50:00z",
      "FM78XA",
      "-25",
      "13020",
      "4.90",
      "126",
      "<br>KA8BRK -2",
      "14097062",
    ],
    [
      "2025-05-04 19:40:00z",
      "FM78PB",
      "20",
      "13060",
      "3.00",
      "122",
      "<br>KA3LNA -8",
      "14097064",
    ],
    [
      "2025-05-04 19:20:00z",
      "FM78MB",
      "25",
      "13080",
      "4.75",
      "138",
      "<br>KE2EYN -10",
      "14097061",
    ],
    [
      "2025-05-04 18:50:00z",
      "FM78JB",
      "21",
      "13100",
      "4.95",
      "126",
      "<br>KC8FCE -5",
      "14097066",
    ],
    [
      "2025-05-04 18:30:00z",
      "FM78HB",
      "21",
      "13120",
      "4.90",
      "122",
      "<br>AJ8S -5",
      "14097058",
    ],
    [
      "2025-05-04 18:10:00z",
      "FM78FA",
      "24",
      "13100",
      "4.70",
      "130",
      "<br>WD4ELG 0",
      "14097061",
    ],
    [
      "2025-05-04 17:50:00z",
      "FM77CX",
      "23",
      "13100",
      "4.85",
      "134",
      "<br>W4MXZ -8",
      "14097065",
    ],
    [
      "2025-05-04 17:30:00z",
      "FM77AW",
      "23",
      "13100",
      "4.80",
      "130",
      "<br>KK4KTV -11",
      "14097067",
    ],
    [
      "2025-05-04 17:20:00z",
      "FM67XW",
      "15",
      "13120",
      "4.80",
      "118",
      "<br>W4MXZ -11",
      "14097066",
    ],
    [
      "2025-05-04 16:50:00z",
      "FM67VV",
      "21",
      "13100",
      "4.75",
      "115",
      "<br>WD4ELG -13",
      "14097062",
    ],
    [
      "2025-05-04 16:30:00z",
      "FM67TU",
      "22",
      "13100",
      "4.75",
      "103",
      "<br>KC8FCE -6",
      "14097057",
    ],
    [
      "2025-05-04 16:10:00z",
      "FM67RT",
      "22",
      "13120",
      "4.80",
      "122",
      "<br>KE8MYP -8",
      "14097065",
    ],
    [
      "2025-05-04 15:40:00z",
      "FM67PS",
      "24",
      "13100",
      "4.75",
      "115",
      "<br>KE8MYP -11",
      "14097064",
    ],
    [
      "2025-05-04 15:20:00z",
      "FM67OR",
      "18",
      "13100",
      "4.80",
      "118",
      "<br>KE8MYP -6",
      "14097063",
    ],
    [
      "2025-05-04 14:50:00z",
      "FM67MQ",
      "22",
      "13080",
      "4.75",
      "103",
      "<br>KE8MYP -13",
      "14097065",
    ],
    [
      "2025-05-04 14:30:00z",
      "FM67KP",
      "16",
      "13080",
      "3.05",
      "103",
      "<br>W4HOD -11",
      "14097065",
    ],
    [
      "2025-05-04 14:10:00z",
      "FM67JO",
      "16",
      "13100",
      "4.85",
      "111",
      "<br>WA9WTK -7",
      "14097058",
    ],
    [
      "2025-05-04 13:40:00z",
      "FM67HM",
      "11",
      "13020",
      "3.15",
      "99",
      "<br>WA9WTK -9",
      "14097065",
    ],
    [
      "2025-05-04 13:20:00z",
      "FM67GL",
      "-2",
      "13060",
      "3.35",
      "103",
      "<br>KB8VME -9",
      "14097065",
    ],
    [
      "2025-05-04 12:50:00z",
      "FM67EJ",
      "-12",
      "13020",
      "3.40",
      "103",
      "<br>K5XL -20",
      "14097059",
    ],
    [
      "2025-05-03 20:30:00z",
      "FM24VR",
      "-3",
      "13020",
      "3.35",
      "134",
      "<br>SWLKCL -2",
      "14097073",
    ],
    [
      "2025-05-03 20:10:00z",
      "FM24TP",
      "6",
      "13020",
      "3.10",
      "122",
      "<br>VA3JDL -6",
      "14097068",
    ],
    [
      "2025-05-03 19:40:00z",
      "FM24QM",
      "2",
      "12980",
      "3.15",
      "138",
      "<br>K9YWO -4",
      "14097065",
    ],
    [
      "2025-05-03 19:20:00z",
      "FM24OK",
      "15",
      "13000",
      "4.90",
      "126",
      "<br>KB8VME -12",
      "14097068",
    ],
    [
      "2025-05-03 18:50:00z",
      "FM24MG",
      "16",
      "13000",
      "4.85",
      "111",
      "<br>AE5AU -9",
      "14097063",
    ],
    [
      "2025-05-03 18:30:00z",
      "FM24LD",
      "16",
      "13000",
      "4.80",
      "107",
      "<br>KE8MYP -12",
      "14097062",
    ],
    [
      "2025-05-03 18:10:00z",
      "FM24JB",
      "21",
      "13020",
      "4.85",
      "122",
      "<br>WB3AK -6",
      "14097061",
    ],
    [
      "2025-05-03 17:50:00z",
      "FM23IX",
      "22",
      "13060",
      "4.70",
      "118",
      "<br>AE5AU -9",
      "14097063",
    ],
    [
      "2025-05-03 17:30:00z",
      "FM23HU",
      "22",
      "13080",
      "4.75",
      "122",
      "<br>KK4KTV 2",
      "14097063",
    ],
    [
      "2025-05-03 17:10:00z",
      "FM23GS",
      "20",
      "13080",
      "4.80",
      "111",
      "<br>K9YWO -9",
      "14097067",
    ],
    [
      "2025-05-03 16:40:00z",
      "FM23FP",
      "22",
      "13120",
      "4.70",
      "118",
      "<br>N9MKC -8",
      "14097062",
    ],
    [
      "2025-05-03 16:20:00z",
      "FM23EO",
      "21",
      "13080",
      "4.75",
      "115",
      "<br>K9YWO -7",
      "14097064",
    ],
    [
      "2025-05-03 15:50:00z",
      "FM23CM",
      "20",
      "13080",
      "4.90",
      "118",
      "<br>KE8MYP -8",
      "14097062",
    ],
    [
      "2025-05-03 15:30:00z",
      "FM23BK",
      "25",
      "13080",
      "4.70",
      "118",
      "<br>K4AGR -10",
      "14097066",
    ],
    [
      "2025-05-03 15:10:00z",
      "FM13XJ",
      "25",
      "13100",
      "4.80",
      "103",
      "<br>WA1RAJ -11",
      "14097063",
    ],
    [
      "2025-05-03 14:40:00z",
      "FM13VH",
      "20",
      "13080",
      "4.75",
      "111",
      "<br>N8MH -14",
      "14097063",
    ],
    [
      "2025-05-03 14:20:00z",
      "FM13UG",
      "11",
      "13060",
      "4.85",
      "99",
      "<br>N8MH 14",
      "14097066",
    ],
    [
      "2025-05-03 13:50:00z",
      "FM13SF",
      "16",
      "13080",
      "4.80",
      "107",
      "<br>WB3AK -11",
      "14097070",
    ],
    [
      "2025-05-03 13:30:00z",
      "FM13RE",
      "11",
      "13080",
      "3.00",
      "107",
      "<br>WB3AK -20",
      "14097065",
    ],
    [
      "2025-05-03 13:10:00z",
      "FM13QD",
      "3",
      "13120",
      "3.45",
      "126",
      "<br>K5XL -11",
      "14097070",
    ],
    [
      "2025-05-02 23:50:00z",
      "EM72EC",
      "-6",
      "13060",
      "3.25",
      "111",
      "<br>NI5F -19",
      "14097087",
    ],
    [
      "2025-05-02 23:30:00z",
      "EM72",
      "-10",
      "13020",
      "3.25",
      "107",
      "<br>AI4RY -8",
      "14097074",
    ],
    [
      "2025-05-02 22:10:00z",
      "EM62VD",
      "12",
      "12960",
      "3.00",
      "115",
      "<br>AI4RY -10",
      "14097078",
    ],
    [
      "2025-05-02 21:20:00z",
      "EM62QE",
      "10",
      "13000",
      "4.80",
      "126",
      "<br>WD0E -6",
      "14097081",
    ],
    [
      "2025-05-02 20:50:00z",
      "EM62NE",
      "10",
      "13060",
      "3.10",
      "126",
      "<br>N2NXZ -15",
      "14097068",
    ],
    [
      "2025-05-02 20:30:00z",
      "EM62LF",
      "21",
      "13060",
      "4.70",
      "130",
      "<br>AI4RY -11",
      "14097068",
    ],
    [
      "2025-05-02 20:10:00z",
      "EM62JG",
      "28",
      "12840",
      "4.80",
      "142",
      "<br>AI4RY -7",
      "14097073",
    ],
    [
      "2025-05-02 19:40:00z",
      "EM62FI",
      "25",
      "12840",
      "4.60",
      "130",
      "<br>WD4IMI -15",
      "14097076",
    ],
    [
      "2025-05-02 19:20:00z",
      "EM62CI",
      "24",
      "12840",
      "4.70",
      "150",
      "<br>AI4RY -14",
      "14097073",
    ],
    [
      "2025-05-02 18:50:00z",
      "EM52WK",
      "31",
      "12820",
      "4.65",
      "157",
      "<br>K4FMH -18",
      "14097062",
    ],
    [
      "2025-05-02 18:30:00z",
      "EM52TK",
      "30",
      "12860",
      "4.60",
      "157",
      "<br>KE8MYP -18",
      "14097074",
    ],
    [
      "2025-05-02 18:10:00z",
      "EM52PL",
      "25",
      "12840",
      "4.65",
      "85",
      "<br>KE8MYP -11",
      "14097063",
    ],
    [
      "2025-05-02 17:40:00z",
      "EM52KM",
      "27",
      "12800",
      "4.60",
      "161",
      "<br>WD0E -7",
      "14097073",
    ],
    [
      "2025-05-02 17:20:00z",
      "EM52GM",
      "31",
      "12800",
      "4.60",
      "89",
      "<br>K4FMH -4",
      "14097064",
    ],
    [
      "2025-05-02 16:50:00z",
      "EM52BN",
      "25",
      "12820",
      "4.80",
      "161",
      "<br>WB3AK 6",
      "14097073",
    ],
    [
      "2025-05-02 16:40:00z",
      "EM42XN",
      "24",
      "12800",
      "4.75",
      "85",
      "<br>AJ8S 9",
      "14097067",
    ],
    [
      "2025-05-02 16:20:00z",
      "EM42TN",
      "31",
      "12820",
      "4.60",
      "89",
      "<br>AE5AU -3",
      "14097068",
    ],
    [
      "2025-05-02 15:50:00z",
      "EM42NO",
      "13",
      "12380",
      "3.05",
      "93",
      "<br>AE5AU -13",
      "14097067",
    ],
    [
      "2025-05-02 15:30:00z",
      "EM42IP",
      "8",
      "12760",
      "3.10",
      "104",
      "<br>N6RY -11",
      "14097064",
    ],
    [
      "2025-05-02 15:10:00z",
      "EM42EQ",
      "16",
      "12700",
      "4.85",
      "101",
      "<br>KE8MYP -8",
      "14097062",
    ],
    [
      "2025-05-02 14:50:00z",
      "EM32XQ",
      "17",
      "12740",
      "3.00",
      "116",
      "<br>K9YWO -9",
      "14097068",
    ],
    [
      "2025-05-02 14:30:00z",
      "EM32SR",
      "21",
      "12760",
      "4.70",
      "101",
      "<br>K9YWO -24",
      "14097063",
    ],
    [
      "2025-05-02 14:10:00z",
      "EM32NR",
      "0",
      "12760",
      "3.10",
      "112",
      "<br>KC1LXO -15",
      "14097070",
    ],
    [
      "2025-05-02 13:20:00z",
      "EM22WR",
      "-19",
      "0",
      "3.15",
      "147",
      "<br>KD7EFG-1 -23",
      "14097068",
    ],
    [
      "2025-05-02 12:30:00z",
      "EM22NQ",
      "-27",
      "12820",
      "3.70",
      "116",
      "<br>KD7EFG-1 -15",
      "14097063",
    ],
    [
      "2025-05-01 23:10:00z",
      "DM42IF",
      "25",
      "12760",
      "4.75",
      "128",
      "<br>KB8VME -2",
      "14097056",
    ],
    [
      "2025-05-01 22:40:00z",
      "DM42AE",
      "26",
      "12760",
      "4.70",
      "132",
      "<br>N5AQM -5",
      "14097061",
    ],
    [
      "2025-05-01 22:30:00z",
      "DM32VD",
      "28",
      "12760",
      "4.65",
      "139",
      "<br>KC6WPK -3",
      "14097068",
    ],
    [
      "2025-05-01 22:10:00z",
      "DM32PC",
      "27",
      "12780",
      "4.70",
      "136",
      "<br>WB5DYG 2",
      "14097062",
    ],
    [
      "2025-05-01 21:50:00z",
      "DM31KX",
      "27",
      "12560",
      "4.65",
      "136",
      "<br>KC6WPK 0",
      "14097064",
    ],
    [
      "2025-05-01 21:30:00z",
      "DM31FV",
      "27",
      "12400",
      "4.60",
      "128",
      "<br>KC6WPK 1",
      "14097067",
    ],
    [
      "2025-05-01 21:10:00z",
      "DM21XS",
      "31",
      "12800",
      "4.70",
      "132",
      "<br>WB6JHI 3",
      "14097062",
    ],
    [
      "2025-05-01 20:40:00z",
      "DM21QO",
      "27",
      "13140",
      "4.70",
      "120",
      "<br>KE4TH 6",
      "14097072",
    ],
    [
      "2025-05-01 20:00:00z",
      "DM21GJ",
      "31",
      "12780",
      "4.65",
      "128",
      "<br>KQ6RS/6 0",
      "14097070",
    ],
    [
      "2025-05-01 19:40:00z",
      "DM21BH",
      "24",
      "12800",
      "4.70",
      "120",
      "<br>KQ6RS/6 -1",
      "14097064",
    ],
    [
      "2025-05-01 19:30:00z",
      "DM11WG",
      "27",
      "12800",
      "4.70",
      "101",
      "<br>KC6WPK -6",
      "14097060",
    ],
    [
      "2025-05-01 19:10:00z",
      "DM11SE",
      "26",
      "14480",
      "4.50",
      "128",
      "<br>AF7KR 2",
      "14097064",
    ],
    [
      "2025-05-01 18:40:00z",
      "DM11KA",
      "24",
      "12800",
      "4.70",
      "120",
      "<br>KQ6RS/6 -2",
      "14097065",
    ],
    [
      "2025-05-01 18:20:00z",
      "DM10FX",
      "30",
      "12820",
      "4.60",
      "112",
      "<br>KQ6RS/6 -5",
      "14097063",
    ],
    [
      "2025-05-01 18:00:00z",
      "DM10AW",
      "26",
      "12820",
      "4.75",
      "116",
      "<br>KN6ZPL 0",
      "14097060",
    ],
    [
      "2025-05-01 17:50:00z",
      "DM00VW",
      "31",
      "12820",
      "4.55",
      "120",
      "<br>KN6ZPL -1",
      "14097061",
    ],
    [
      "2025-05-01 17:30:00z",
      "DM00QV",
      "25",
      "12780",
      "4.60",
      "104",
      "<br>KN6ZPL 0",
      "14097067",
    ],
    [
      "2025-05-01 17:10:00z",
      "DM00MV",
      "26",
      "12760",
      "4.30",
      "116",
      "<br>W7EL -2",
      "14097075",
    ],
    [
      "2025-05-01 16:40:00z",
      "DM00FV",
      "28",
      "12800",
      "4.60",
      "104",
      "<br>W1CK -10",
      "14097062",
    ],
    [
      "2025-05-01 16:20:00z",
      "DM00AV",
      "24",
      "12760",
      "4.80",
      "89",
      "<br>W1CK -15",
      "14097065",
    ],
    [
      "2025-05-01 16:10:00z",
      "CM90VV",
      "9",
      "0",
      "4.30",
      "155",
      "<br>W1CK -10",
      "14097095",
    ],
    [
      "2025-05-01 00:30:00z",
      "CL38JJ",
      "14",
      "12960",
      "3.10",
      "150",
      "<br>WB6VEX -13",
      "14097058",
    ],
    [
      "2025-05-01 00:10:00z",
      "CL38GG",
      "12",
      "12960",
      "3.00",
      "150",
      "<br>WB6VEX -11",
      "14097060",
    ],
    [
      "2025-04-30 23:40:00z",
      "CL38CC",
      "14",
      "12980",
      "4.80",
      "150",
      "<br>KN6ZPL -12",
      "14097062",
    ],
    [
      "2025-04-30 23:20:00z",
      "CL28XA",
      "11",
      "12960",
      "3.00",
      "146",
      "<br>WB6VEX -14",
      "14097060",
    ],
    [
      "2025-04-30 23:10:00z",
      "CL27WW",
      "9",
      "13340",
      "4.95",
      "150",
      "<br>WB6VEX -5",
      "14097059",
    ],
    [
      "2025-04-30 22:40:00z",
      "CL27SS",
      "18",
      "12980",
      "4.75",
      "153",
      "<br>WB6VEX -26",
      "14097057",
    ],
    [
      "2025-04-30 22:20:00z",
      "CL27PP",
      "23",
      "12980",
      "4.80",
      "165",
      "<br>KN6ZPL -22",
      "14097055",
    ],
    [
      "2025-04-30 20:20:00z",
      "CL16WX",
      "19",
      "12960",
      "4.85",
      "165",
      "<br>KQ6RS/6 -19",
      "14097065",
    ],
    [
      "2025-04-30 19:50:00z",
      "CL16SU",
      "16",
      "12960",
      "4.95",
      "153",
      "<br>N4RVE -18",
      "14097065",
    ],
    [
      "2025-04-30 19:30:00z",
      "CL16PR",
      "17",
      "12960",
      "3.00",
      "161",
      "<br>W0AY -10",
      "14097065",
    ],
    [
      "2025-04-30 18:50:00z",
      "CL16JL",
      "15",
      "12940",
      "4.90",
      "161",
      "<br>W7EL -16",
      "14097065",
    ],
    [
      "2025-04-30 17:30:00z",
      "CL05WW",
      "-2",
      "12940",
      "3.25",
      "85",
      "<br>NH6V -9",
      "14097067",
    ],
    [
      "2025-04-30 01:30:00z",
      "BL51JX",
      "-1",
      "12960",
      "3.25",
      "165",
      "<br>NH6V -14",
      "14097066",
    ],
    [
      "2025-04-30 01:10:00z",
      "BL51GW",
      "16",
      "12940",
      "4.70",
      "157",
      "<br>NH6V -16",
      "14097064",
    ],
    [
      "2025-04-30 00:40:00z",
      "BL51BV",
      "24",
      "12960",
      "4.65",
      "146",
      "<br>AI6VN/KH6 -21",
      "14097066",
    ],
    [
      "2025-04-30 00:30:00z",
      "BL41XV",
      "12",
      "12980",
      "4.75",
      "153",
      "<br>NH6V -19",
      "14097067",
    ],
    [
      "2025-04-30 00:10:00z",
      "BL41UU",
      "24",
      "12920",
      "4.90",
      "161",
      "<br>KFS/SW -21",
      "14097064",
    ],
    [
      "2025-04-29 23:40:00z",
      "BL41QT",
      "17",
      "12940",
      "4.85",
      "153",
      "<br>AI6VN/KH6 -23",
      "14097064",
    ],
    [
      "2025-04-29 23:20:00z",
      "BL41NS",
      "15",
      "12940",
      "4.90",
      "161",
      "<br>AI6VN/KH6 -22",
      "14097064",
    ],
    [
      "2025-04-29 22:50:00z",
      "BL41IR",
      "24",
      "12960",
      "4.75",
      "150",
      "<br>KFS/SW -22",
      "14097063",
    ],
    [
      "2025-04-29 21:50:00z",
      "BL41AR",
      "23",
      "12880",
      "4.75",
      "146",
      "<br>AI6VN/KH6 -24",
      "14097063",
    ],
    [
      "2025-04-29 21:40:00z",
      "BL31XR",
      "20",
      "12880",
      "4.75",
      "146",
      "<br>AI6VN/KH6 -22",
      "14097063",
    ],
    [
      "2025-04-29 21:20:00z",
      "BL31UR",
      "25",
      "12880",
      "4.70",
      "134",
      "<br>AI6VN/KH6 -21",
      "14097063",
    ],
    [
      "2025-04-29 20:50:00z",
      "BL31QT",
      "18",
      "12900",
      "4.80",
      "138",
      "<br>AI6VN/KH6 -19",
      "14097064",
    ],
    [
      "2025-04-29 20:30:00z",
      "BL31OU",
      "21",
      "12880",
      "4.60",
      "142",
      "<br>AI6VN/KH6 -18",
      "14097064",
    ],
    [
      "2025-04-29 20:10:00z",
      "BL31MV",
      "15",
      "12880",
      "4.95",
      "146",
      "<br>AI6VN/KH6 -13",
      "14097065",
    ],
    [
      "2025-04-29 19:40:00z",
      "BL32IB",
      "7",
      "12860",
      "3.00",
      "142",
      "<br>AI6VN/KH6 -13",
      "14097065",
    ],
    [
      "2025-04-29 19:20:00z",
      "BL32GD",
      "8",
      "12800",
      "4.95",
      "142",
      "<br>AI6VN/KH6 -12",
      "14097066",
    ],
    [
      "2025-04-29 18:50:00z",
      "BL32DI",
      "1",
      "12820",
      "4.85",
      "153",
      "<br>KFS/OMNI -10",
      "14097066",
    ],
    [
      "2025-04-29 18:30:00z",
      "BL32BL",
      "5",
      "12860",
      "3.10",
      "153",
      "<br>AI6VN/KH6 -17",
      "14097066",
    ],
    [
      "2025-04-29 18:20:00z",
      "BL22XN",
      "-1",
      "12820",
      "3.05",
      "153",
      "<br>AI6VN/KH6 -17",
      "14097076",
    ],
    [
      "2025-04-29 03:50:00z",
      "BL49AR",
      "-3",
      "12920",
      "3.30",
      "130",
      "<br>KQ6RS/6 -7",
      "14097063",
    ],
    [
      "2025-04-29 03:10:00z",
      "BL49DW",
      "10",
      "12900",
      "3.00",
      "138",
      "<br>KQ6RS/6 -20",
      "14097064",
    ],
    [
      "2025-04-29 02:40:00z",
      "BM40IH",
      "-1",
      "0",
      "3.00",
      "151",
      "<br>KPH2 -21",
      "14097065",
    ],
    [
      "2025-04-29 02:20:00z",
      "BM40IH",
      "-11",
      "12940",
      "3.25",
      "138",
      "<br>NH6V -17",
      "14097065",
    ],
    [
      "2025-04-29 01:30:00z",
      "BM40KO",
      "9",
      "12960",
      "4.80",
      "122",
      "<br>AE7TF -15",
      "14097064",
    ],
    [
      "2025-04-29 01:10:00z",
      "BM40LR",
      "1",
      "12960",
      "3.25",
      "118",
      "<br>AI6VN/KH6 -18",
      "14097066",
    ],
    [
      "2025-04-29 00:40:00z",
      "BM40MW",
      "2",
      "12940",
      "3.20",
      "122",
      "<br>AI6VN/KH6 -23",
      "14097066",
    ],
    [
      "2025-04-29 00:20:00z",
      "BM41MA",
      "8",
      "12940",
      "3.10",
      "115",
      "<br>AI6VN/KH6 -18",
      "14097064",
    ],
    [
      "2025-04-28 23:50:00z",
      "BM41ME",
      "22",
      "12940",
      "4.90",
      "111",
      "<br>AI6VN/KH6 -17",
      "14097064",
    ],
    [
      "2025-04-28 23:30:00z",
      "BM41NH",
      "17",
      "12940",
      "4.90",
      "99",
      "<br>N1CL -19",
      "14097064",
    ],
    [
      "2025-04-28 23:10:00z",
      "BM41NJ",
      "16",
      "12900",
      "4.80",
      "107",
      "<br>AI6VN/KH6 -18",
      "14097064",
    ],
    [
      "2025-04-28 22:40:00z",
      "BM41NM",
      "22",
      "12940",
      "4.70",
      "99",
      "<br>AI6VN/KH6 -18",
      "14097064",
    ],
    [
      "2025-04-28 22:20:00z",
      "BM41NO",
      "27",
      "12940",
      "4.65",
      "107",
      "<br>AI6VN/KH6 -22",
      "14097062",
    ],
    [
      "2025-04-28 21:50:00z",
      "BM41OR",
      "30",
      "12900",
      "4.55",
      "99",
      "<br>AI6VN/KH6 -20",
      "14097062",
    ],
    [
      "2025-04-28 21:30:00z",
      "BM41OT",
      "30",
      "12880",
      "4.60",
      "103",
      "<br>AI6VN/KH6 -17",
      "14097062",
    ],
    [
      "2025-04-28 21:10:00z",
      "BM41OV",
      "28",
      "12840",
      "4.55",
      "107",
      "<br>KFS/O -18",
      "14097062",
    ],
    [
      "2025-04-28 20:40:00z",
      "BM42NA",
      "28",
      "12860",
      "4.55",
      "95",
      "<br>AI6VN/KH6 -18",
      "14097063",
    ],
    [
      "2025-04-28 20:20:00z",
      "BM42NC",
      "23",
      "12860",
      "4.65",
      "103",
      "<br>AI6VN/KH6 -16",
      "14097069",
    ],
    [
      "2025-04-28 19:50:00z",
      "BM42LE",
      "26",
      "12800",
      "4.70",
      "103",
      "<br>AI6VN/KH6 -11",
      "14097064",
    ],
    [
      "2025-04-28 19:30:00z",
      "BM42LG",
      "20",
      "12820",
      "4.75",
      "91",
      "<br>KFS/OMNI -19",
      "14097064",
    ],
    [
      "2025-04-28 18:50:00z",
      "BM42KI",
      "22",
      "12800",
      "4.70",
      "99",
      "<br>AI6VN/KH6 -21",
      "14097065",
    ],
    [
      "2025-04-28 15:40:00z",
      "BM42ER",
      "-17",
      "12800",
      "3.25",
      "84",
      "<br>AI6VN/KH6 -15",
      "14097066",
    ],
    [
      "2025-04-28 01:50:00z",
      "BM22SQ",
      "-5",
      "12760",
      "3.05",
      "122",
      "<br>NH6V -18",
      "14097065",
    ],
    [
      "2025-04-28 01:30:00z",
      "BM22RR",
      "5",
      "12740",
      "4.85",
      "118",
      "<br>KG0D -18",
      "14097070",
    ],
    [
      "2025-04-28 01:10:00z",
      "BM22PR",
      "8",
      "12780",
      "4.90",
      "122",
      "<br>NH6V -17",
      "14097067",
    ],
    [
      "2025-04-28 00:20:00z",
      "BM22KS",
      "11",
      "12760",
      "4.95",
      "122",
      "<br>AI6VN/KH6 -21",
      "14097065",
    ],
    [
      "2025-04-27 23:50:00z",
      "BM22HT",
      "12",
      "12860",
      "3.00",
      "115",
      "<br>NH6V -18",
      "14097064",
    ],
    [
      "2025-04-27 23:30:00z",
      "BM22FU",
      "19",
      "12760",
      "4.90",
      "111",
      "<br>KFS/OMNI -18",
      "14097064",
    ],
    [
      "2025-04-27 23:10:00z",
      "BM22EV",
      "19",
      "12780",
      "4.85",
      "126",
      "<br>AI6VN/KH6 -19",
      "14097064",
    ],
    [
      "2025-04-27 22:40:00z",
      "BM22BW",
      "26",
      "12740",
      "4.70",
      "122",
      "<br>AI6VN/KH6 -20",
      "14097064",
    ],
    [
      "2025-04-27 22:20:00z",
      "BM12XX",
      "21",
      "12760",
      "4.75",
      "115",
      "<br>AI6VN/KH6 -19",
      "14097064",
    ],
    [
      "2025-04-27 22:10:00z",
      "BM13WA",
      "22",
      "12760",
      "4.80",
      "122",
      "<br>AI6VN/KH6 -21",
      "14097064",
    ],
    [
      "2025-04-27 21:40:00z",
      "BM13UB",
      "23",
      "12780",
      "4.75",
      "126",
      "<br>AI6VN/KH6 -22",
      "14097063",
    ],
    [
      "2025-04-27 21:20:00z",
      "BM13SD",
      "31",
      "12760",
      "4.65",
      "118",
      "<br>AI6VN/KH6 -21",
      "14097063",
    ],
    [
      "2025-04-27 20:50:00z",
      "BM13PE",
      "28",
      "12720",
      "4.65",
      "130",
      "<br>AI6VN/KH6 -20",
      "14097063",
    ],
    [
      "2025-04-27 20:30:00z",
      "BM13NF",
      "21",
      "12760",
      "4.75",
      "115",
      "<br>AI6VN/KH6 -20",
      "14097065",
    ],
    [
      "2025-04-27 20:10:00z",
      "BM13LG",
      "15",
      "12740",
      "4.80",
      "118",
      "<br>AI6VN/KH6 -19",
      "14097064",
    ],
    [
      "2025-04-27 19:40:00z",
      "BM13JI",
      "16",
      "12720",
      "4.90",
      "130",
      "<br>AI6VN/KH6 -17",
      "14097064",
    ],
    [
      "2025-04-27 19:20:00z",
      "BM13HJ",
      "31",
      "12720",
      "4.65",
      "118",
      "<br>AI6VN/KH6 -23",
      "14097065",
    ],
    [
      "2025-04-27 02:40:00z",
      "AN50UW",
      "13",
      "12500",
      "4.35",
      "128",
      "<br>KL7QN -18",
      "14097069",
    ],
    [
      "2025-04-26 05:40:00z",
      "QN63PN",
      "22",
      "12300",
      "4.65",
      "95",
      "<br>KPH2 -13",
      "14097063",
    ],
    [
      "2025-04-26 04:50:00z",
      "QN52TV",
      "27",
      "12220",
      "4.65",
      "107",
      "<br>KD7EFG-1 -21",
      "14097064",
    ],
    [
      "2025-04-26 03:10:00z",
      "QN41DL",
      "24",
      "12280",
      "4.95",
      "126",
      "<br>JJ0VBZ -21",
      "14097068",
    ],
    [
      "2025-04-26 01:50:00z",
      "QN20TF",
      "28",
      "12200",
      "4.55",
      "107",
      "<br>JR5JEU -21",
      "14097059",
    ],
    [
      "2025-04-26 01:30:00z",
      "QM29LW",
      "28",
      "12220",
      "4.60",
      "115",
      "<br>JA5NVN -21",
      "14097062",
    ],
    [
      "2025-04-26 01:10:00z",
      "QM29DP",
      "26",
      "12280",
      "4.85",
      "115",
      "<br>JA5FFO -13",
      "14097059",
    ],
    [
      "2025-04-26 00:50:00z",
      "QM19TI",
      "31",
      "12240",
      "4.75",
      "126",
      "<br>JR5JEU -20",
      "14097061",
    ],
    [
      "2025-04-26 00:30:00z",
      "QM19LB",
      "30",
      "12220",
      "4.60",
      "122",
      "<br>JA5FFO -18",
      "14097061",
    ],
    [
      "2025-04-26 00:20:00z",
      "QM18HW",
      "31",
      "12180",
      "4.65",
      "138",
      "<br>JA5FFO -14",
      "14097060",
    ],
    [
      "2025-04-25 23:50:00z",
      "QM08RO",
      "23",
      "12260",
      "4.95",
      "138",
      "<br>JR5JEU -19",
      "14097066",
    ],
    [
      "2025-04-25 23:30:00z",
      "QM08IJ",
      "20",
      "12200",
      "4.80",
      "150",
      "<br>JA5FFO -20",
      "14097061",
    ],
    [
      "2025-04-25 23:10:00z",
      "PM98VD",
      "21",
      "12220",
      "4.70",
      "130",
      "<br>JJ0VBZ -15",
      "14097060",
    ],
    [
      "2025-04-25 22:30:00z",
      "PM97ES",
      "13",
      "0",
      "4.75",
      "151",
      "<br>JR5JEU -16",
      "14097062",
    ],
    [
      "2025-04-23 06:40:00z",
      "LM57QN",
      "17",
      "12660",
      "4.80",
      "120",
      "<br>OE3GBB/Q2 -21",
      "14097063",
    ],
    [
      "2025-04-23 06:20:00z",
      "LM57LK",
      "18",
      "12680",
      "4.85",
      "112",
      "<br>OE3GBB/Q2 -13",
      "14097064",
    ],
    [
      "2025-04-23 05:50:00z",
      "LM57DH",
      "8",
      "12760",
      "3.25",
      "112",
      "<br>DL0PF -15",
      "14097065",
    ],
    [
      "2025-04-23 05:30:00z",
      "LM47WF",
      "11",
      "12760",
      "4.95",
      "112",
      "<br>OE3GBB/Q2 -19",
      "14097065",
    ],
    [
      "2025-04-22 13:20:00z",
      "KM44HV",
      "7",
      "12620",
      "4.95",
      "147",
      "<br>I0UVN -12",
      "14097064",
    ],
    [
      "2025-04-22 11:50:00z",
      "KM34AH",
      "-15",
      "10880",
      "3.10",
      "132",
      "<br>OE9GHV -20",
      "14097063",
    ],
    [
      "2025-04-22 11:30:00z",
      "KM33CX",
      "21",
      "12620",
      "4.85",
      "112",
      "<br>ON5KQ -18",
      "14097062",
    ],
    [
      "2025-04-22 11:10:00z",
      "KM23VT",
      "31",
      "12680",
      "4.60",
      "104",
      "<br>I0UVN -25",
      "14097062",
    ],
    [
      "2025-04-22 10:40:00z",
      "KM23PP",
      "30",
      "12680",
      "4.70",
      "165",
      "<br>I0UVN -14",
      "14097062",
    ],
    [
      "2025-04-22 10:20:00z",
      "KM23LN",
      "28",
      "12640",
      "4.65",
      "85",
      "<br>ON5KQ -14",
      "14097061",
    ],
    [
      "2025-04-22 09:50:00z",
      "KM23GM",
      "27",
      "12640",
      "4.75",
      "85",
      "<br>ON5KQ -10",
      "14097063",
    ],
    [
      "2025-04-22 09:30:00z",
      "KM23CM",
      "27",
      "12600",
      "4.70",
      "101",
      "<br>PE0MJX -10",
      "14097064",
    ],
    [
      "2025-04-22 09:20:00z",
      "KM13XM",
      "22",
      "12660",
      "4.70",
      "89",
      "<br>ON5KQ -11",
      "14097065",
    ],
    [
      "2025-04-22 08:50:00z",
      "KM13RL",
      "18",
      "12620",
      "4.85",
      "112",
      "<br>F5OIH -9",
      "14097064",
    ],
    [
      "2025-04-22 08:30:00z",
      "KM13ML",
      "10",
      "12640",
      "4.95",
      "108",
      "<br>IZ6QQTRX -15",
      "14097065",
    ],
    [
      "2025-04-22 08:10:00z",
      "KM13HL",
      "12",
      "12620",
      "4.95",
      "101",
      "<br>PE0MJX -18",
      "14097063",
    ],
    [
      "2025-04-22 07:40:00z",
      "KM13AM",
      "10",
      "12640",
      "4.95",
      "108",
      "<br>TA4/G8SCU -11",
      "14097064",
    ],
    [
      "2025-04-22 07:30:00z",
      "KM03VM",
      "10",
      "12600",
      "3.20",
      "124",
      "<br>IZ6QQT -23",
      "14097064",
    ],
    [
      "2025-04-22 06:40:00z",
      "KM03GQ",
      "-3",
      "0",
      "3.35",
      "159",
      "<br>LA1ZM -13",
      "14097071",
    ],
    [
      "2025-04-21 16:40:00z",
      "JM18AX",
      "11",
      "12620",
      "4.95",
      "112",
      "<br>M0PWX -9",
      "14097066",
    ],
    [
      "2025-04-21 16:30:00z",
      "JM08XX",
      "13",
      "12620",
      "3.10",
      "116",
      "<br>LA1ZM -12",
      "14097062",
    ],
    [
      "2025-04-21 16:10:00z",
      "JM09RA",
      "5",
      "12660",
      "3.00",
      "120",
      "<br>DJ2DS-2 -23",
      "14097065",
    ],
    [
      "2025-04-21 15:30:00z",
      "JM09EB",
      "11",
      "12640",
      "3.00",
      "116",
      "<br>DL1XH -10",
      "14097087",
    ],
    [
      "2025-04-21 14:40:00z",
      "IM99PB",
      "23",
      "12660",
      "4.75",
      "116",
      "<br>DK8OK -9",
      "14097063",
    ],
    [
      "2025-04-21 14:20:00z",
      "IM99KB",
      "24",
      "12620",
      "4.65",
      "97",
      "<br>DK8OK -9",
      "14097068",
    ],
    [
      "2025-04-21 13:50:00z",
      "IM99CB",
      "23",
      "12420",
      "4.80",
      "101",
      "<br>F1OIL -4",
      "14097067",
    ],
    [
      "2025-04-21 13:30:00z",
      "IM89VB",
      "23",
      "12700",
      "4.70",
      "97",
      "<br>ON7AN -6",
      "14097063",
    ],
    [
      "2025-04-21 13:10:00z",
      "IM89RB",
      "28",
      "12580",
      "4.75",
      "89",
      "<br>M0UNI -6",
      "14097056",
    ],
    [
      "2025-04-21 12:40:00z",
      "IM89JB",
      "31",
      "12620",
      "4.60",
      "104",
      "<br>EA1FAQ -1",
      "14097058",
    ],
    [
      "2025-04-21 12:20:00z",
      "IM89EB",
      "28",
      "12640",
      "4.60",
      "101",
      "<br>DL3EL -15",
      "14097057",
    ],
    [
      "2025-04-21 11:50:00z",
      "IM79UA",
      "25",
      "12580",
      "4.65",
      "104",
      "<br>DL6OW-MH -11",
      "14097058",
    ],
    [
      "2025-04-21 11:30:00z",
      "IM79PB",
      "24",
      "12580",
      "4.85",
      "108",
      "<br>DP0POL -11",
      "14097061",
    ],
    [
      "2025-04-21 11:10:00z",
      "IM79KB",
      "15",
      "12600",
      "4.90",
      "116",
      "<br>EA1FAQ -6",
      "14097052",
    ],
    [
      "2025-04-21 10:40:00z",
      "IM79CA",
      "22",
      "12620",
      "4.75",
      "112",
      "<br>TM86REF -7",
      "14097055",
    ],
    [
      "2025-04-21 10:30:00z",
      "IM69XA",
      "23",
      "12600",
      "4.85",
      "124",
      "<br>TM86REF -11",
      "14097055",
    ],
    [
      "2025-04-21 10:10:00z",
      "IM69RA",
      "22",
      "12580",
      "4.75",
      "112",
      "<br>DD5XX -12",
      "14097066",
    ],
    [
      "2025-04-21 09:40:00z",
      "IM68JX",
      "21",
      "12700",
      "4.80",
      "128",
      "<br>DK4RW/1 -14",
      "14097063",
    ],
    [
      "2025-04-21 09:20:00z",
      "IM68EX",
      "21",
      "13760",
      "4.60",
      "107",
      "<br>EA8/DF4UE -16",
      "14097081",
    ],
    [
      "2025-04-21 08:50:00z",
      "IM58UX",
      "22",
      "12560",
      "4.95",
      "124",
      "<br>EA8BFK -18",
      "14097081",
    ],
    [
      "2025-04-21 07:50:00z",
      "IM59DA",
      "17",
      "12460",
      "3.00",
      "116",
      "<br>HB9VQQ/RW3 -21",
      "14097070",
    ],
    [
      "2025-04-21 07:30:00z",
      "IM49VA",
      "15",
      "12480",
      "4.85",
      "132",
      "<br>CT1EDG -18",
      "14097071",
    ],
    [
      "2025-04-21 07:10:00z",
      "IM49PB",
      "8",
      "12440",
      "4.90",
      "132",
      "<br>W4HOD -26",
      "14097073",
    ],
    [
      "2025-04-20 17:20:00z",
      "HM48PO",
      "10",
      "12480",
      "4.90",
      "124",
      "<br>GM0UDL -8",
      "14097066",
    ],
    [
      "2025-04-20 16:50:00z",
      "HM48HN",
      "5",
      "12820",
      "4.80",
      "124",
      "<br>EA8/DF4UE -13",
      "14097065",
    ],
    [
      "2025-04-20 16:30:00z",
      "HM48BM",
      "23",
      "12800",
      "4.70",
      "112",
      "<br>GM0UDL -18",
      "14097064",
    ],
    [
      "2025-04-20 16:20:00z",
      "HM38WL",
      "22",
      "12820",
      "4.75",
      "112",
      "<br>GM0UDL -14",
      "14097065",
    ],
    [
      "2025-04-20 15:50:00z",
      "HM38OD",
      "18",
      "10280",
      "3.00",
      "101",
      "<br>GM0UDL -16",
      "14097065",
    ],
    [
      "2025-04-20 15:30:00z",
      "HM38JJ",
      "16",
      "12620",
      "4.75",
      "112",
      "<br>EA8/DF4UE -8",
      "14097065",
    ],
    [
      "2025-04-20 15:10:00z",
      "HM38DI",
      "16",
      "12760",
      "4.95",
      "104",
      "<br>GM0UDL -18",
      "14097065",
    ],
    [
      "2025-04-20 14:50:00z",
      "HM28WH",
      "15",
      "12860",
      "3.05",
      "104",
      "<br>GM0UDL -16",
      "14097064",
    ],
    [
      "2025-04-20 14:30:00z",
      "HM28RH",
      "21",
      "12840",
      "4.90",
      "112",
      "<br>GM0UDL -10",
      "14097065",
    ],
    [
      "2025-04-20 14:10:00z",
      "HM28MG",
      "20",
      "12820",
      "4.80",
      "120",
      "<br>GM0UDL -21",
      "14097064",
    ],
    [
      "2025-04-20 13:20:00z",
      "HM18XG",
      "17",
      "12860",
      "4.90",
      "108",
      "<br>W4HOD -11",
      "14097063",
    ],
    [
      "2025-04-20 12:40:00z",
      "HM18JF",
      "10",
      "3660",
      "3.05",
      "132",
      "<br>GM0UDL -19",
      "14097065",
    ],
    [
      "2025-04-20 12:20:00z",
      "HM18IG",
      "9",
      "12860",
      "3.15",
      "97",
      "<br>GM0UDL -23",
      "14097062",
    ],
    [
      "2025-04-20 11:50:00z",
      "HM18AG",
      "12",
      "12880",
      "4.95",
      "101",
      "<br>N2NXZ -12",
      "14097078",
    ],
    [
      "2025-04-20 11:40:00z",
      "HM08WH",
      "21",
      "12880",
      "4.75",
      "104",
      "<br>KC1LXO -15",
      "14097061",
    ],
    [
      "2025-04-19 19:40:00z",
      "GN21JD",
      "-7",
      "0",
      "3.40",
      "159",
      "<br>KX4O -14",
      "14097067",
    ],
    [
      "2025-04-19 19:20:00z",
      "GN21FG",
      "2",
      "13000",
      "3.05",
      "85",
      "<br>WA9WTK -9",
      "14097069",
    ],
    [
      "2025-04-19 18:50:00z",
      "GN11XJ",
      "5",
      "13020",
      "3.05",
      "85",
      "<br>N8LI/1 -6",
      "14097068",
    ],
    [
      "2025-04-19 18:30:00z",
      "GN11TM",
      "0",
      "12980",
      "3.20",
      "165",
      "<br>N8AYY -5",
      "14097066",
    ],
    [
      "2025-04-19 18:10:00z",
      "GN11PP",
      "8",
      "13000",
      "3.15",
      "153",
      "<br>N2DED -6",
      "14097066",
    ],
    [
      "2025-04-19 17:40:00z",
      "GN11KS",
      "13",
      "13040",
      "4.90",
      "150",
      "<br>K3FZ -5",
      "14097067",
    ],
    [
      "2025-04-19 17:20:00z",
      "GN11GV",
      "11",
      "13020",
      "4.85",
      "89",
      "<br>NA1S -5",
      "14097069",
    ],
    [
      "2025-04-19 16:50:00z",
      "GN12BB",
      "13",
      "12960",
      "3.05",
      "161",
      "<br>W4KEL -9",
      "14097071",
    ],
    [
      "2025-04-19 16:40:00z",
      "GN02XC",
      "14",
      "12940",
      "4.65",
      "161",
      "<br>K3FZ -7",
      "14097067",
    ],
    [
      "2025-04-19 16:20:00z",
      "GN02TE",
      "10",
      "12920",
      "4.85",
      "85",
      "<br>K3FZ -11",
      "14097071",
    ],
    [
      "2025-04-19 15:50:00z",
      "GN02OI",
      "9",
      "12840",
      "3.00",
      "85",
      "<br>N2NXZ -3",
      "14097072",
    ],
    [
      "2025-04-19 15:30:00z",
      "GN02KL",
      "6",
      "12820",
      "3.00",
      "89",
      "<br>N2NXZ -2",
      "14097069",
    ],
    [
      "2025-04-19 15:10:00z",
      "GN02HO",
      "6",
      "12820",
      "4.95",
      "85",
      "<br>KR4LO -9",
      "14097070",
    ],
    [
      "2025-04-19 14:40:00z",
      "GN02BT",
      "1",
      "12880",
      "3.20",
      "153",
      "<br>N2NXZ -10",
      "14097069",
    ],
    [
      "2025-04-19 14:20:00z",
      "FN92WV",
      "0",
      "12820",
      "3.20",
      "165",
      "<br>W4KEL -12",
      "14097064",
    ],
    [
      "2025-04-19 13:50:00z",
      "FN93RD",
      "-1",
      "12820",
      "3.20",
      "161",
      "<br>KE5HDE -4",
      "14097069",
    ],
    [
      "2025-04-19 13:30:00z",
      "FN93NG",
      "-4",
      "12780",
      "3.05",
      "165",
      "<br>WA9FIO -6",
      "14097074",
    ],
    [
      "2025-04-19 13:10:00z",
      "FN93KK",
      "-4",
      "12760",
      "3.15",
      "89",
      "<br>N8MH -12",
      "14097067",
    ],
    [
      "2025-04-18 22:50:00z",
      "EN77IN",
      "12",
      "12480",
      "4.90",
      "155",
      "<br>WD0E -24",
      "14097069",
    ],
    [
      "2025-04-18 21:30:00z",
      "EN67BB",
      "24",
      "12500",
      "4.75",
      "139",
      "<br>WA4DT -16",
      "14097064",
    ],
    [
      "2025-04-18 21:20:00z",
      "EN57WA",
      "28",
      "12500",
      "4.65",
      "139",
      "<br>NS8C -7",
      "14097066",
    ],
    [
      "2025-04-18 21:10:00z",
      "EN56SW",
      "21",
      "12500",
      "4.75",
      "143",
      "<br>NS8C -6",
      "14097070",
    ],
    [
      "2025-04-18 20:40:00z",
      "EN56HR",
      "25",
      "12520",
      "4.80",
      "151",
      "<br>N8MH -13",
      "14097061",
    ],
    [
      "2025-04-18 20:10:00z",
      "EN46UL",
      "27",
      "12480",
      "4.55",
      "143",
      "<br>NS8C -17",
      "14097061",
    ],
    [
      "2025-04-18 19:40:00z",
      "EN46KF",
      "25",
      "12520",
      "4.60",
      "139",
      "<br>W0VI -11",
      "14097061",
    ],
    [
      "2025-04-18 19:20:00z",
      "EN46",
      "26",
      "12520",
      "4.55",
      "132",
      "<br>W0VI -10",
      "14097071",
    ],
    [
      "2025-04-18 18:50:00z",
      "EN35RT",
      "30",
      "12520",
      "4.65",
      "132",
      "<br>KK7IXU -12",
      "14097065",
    ],
    [
      "2025-04-18 18:30:00z",
      "EN35LP",
      "27",
      "12480",
      "4.70",
      "136",
      "<br>WA9FIO -15",
      "14097063",
    ],
    [
      "2025-04-18 18:10:00z",
      "EN35EL",
      "26",
      "12480",
      "4.70",
      "132",
      "<br>KE8MYP 5",
      "14097049",
    ],
    [
      "2025-04-18 17:50:00z",
      "EN25XH",
      "26",
      "12460",
      "4.65",
      "128",
      "<br>VE6JY 3",
      "14097061",
    ],
    [
      "2025-04-18 17:30:00z",
      "EN25RD",
      "24",
      "12540",
      "4.70",
      "120",
      "<br>NK0V -10",
      "14097063",
    ],
    [
      "2025-04-18 17:10:00z",
      "EN25LA",
      "31",
      "12420",
      "4.65",
      "108",
      "<br>W0ASW 1",
      "14097058",
    ],
    [
      "2025-04-18 16:50:00z",
      "EN24GU",
      "25",
      "12420",
      "4.95",
      "120",
      "<br>NK0V -6",
      "14097058",
    ],
    [
      "2025-04-18 16:30:00z",
      "EN24AQ",
      "25",
      "12440",
      "4.70",
      "124",
      "<br>NK0V -7",
      "14097066",
    ],
    [
      "2025-04-18 16:20:00z",
      "EN14VP",
      "28",
      "12420",
      "4.60",
      "120",
      "<br>AJ8S -8",
      "14097061",
    ],
    [
      "2025-04-18 15:50:00z",
      "EN14MJ",
      "28",
      "12420",
      "4.75",
      "128",
      "<br>K4COD -3",
      "14097058",
    ],
    [
      "2025-04-18 15:30:00z",
      "EN14FF",
      "19",
      "12420",
      "4.75",
      "147",
      "<br>KR4LO -4",
      "14097064",
    ],
    [
      "2025-04-18 15:10:00z",
      "EN04XA",
      "22",
      "12420",
      "4.65",
      "143",
      "<br>WA2N -9",
      "14097066",
    ],
    [
      "2025-04-18 14:50:00z",
      "EN03RS",
      "7",
      "12360",
      "3.10",
      "136",
      "<br>KR4LO -10",
      "14097056",
    ],
    [
      "2025-04-18 14:10:00z",
      "EN03EH",
      "13",
      "0",
      "4.45",
      "151",
      "<br>WD4ELG -12",
      "14097063",
    ],
    [
      "2025-04-18 13:40:00z",
      "DN93VB",
      "13",
      "12380",
      "4.95",
      "143",
      "<br>KG0D -14",
      "14097056",
    ],
    [
      "2025-04-18 13:30:00z",
      "DN92SX",
      "13",
      "12340",
      "4.85",
      "139",
      "<br>K4COD -11",
      "14097066",
    ],
    [
      "2025-04-18 13:10:00z",
      "DN92NR",
      "-11",
      "12300",
      "3.35",
      "132",
      "<br>N6GN/K -5",
      "14097062",
    ],
    [
      "2025-04-18 12:20:00z",
      "DN82XD",
      "-13",
      "12240",
      "3.50",
      "147",
      "<br>KM4RK 0",
      "14097076",
    ],
    [
      "2025-04-17 23:50:00z",
      "DM13QI",
      "-1",
      "12440",
      "3.05",
      "165",
      "<br>KG0D 27",
      "14097076",
    ],
    [
      "2025-04-17 23:30:00z",
      "DM13MD",
      "10",
      "12520",
      "4.85",
      "85",
      "<br>AC7IJ 23",
      "14097072",
    ],
    [
      "2025-04-17 23:10:00z",
      "DM12JX",
      "2",
      "12560",
      "3.15",
      "157",
      "<br>KQ6RS/6 15",
      "14097072",
    ],
    [
      "2025-04-17 22:40:00z",
      "DM12FS",
      "8",
      "12560",
      "3.05",
      "150",
      "<br>VA7PP 13",
      "14097071",
    ],
    [
      "2025-04-17 22:20:00z",
      "DM12CP",
      "18",
      "12600",
      "3.00",
      "150",
      "<br>AE7TF 9",
      "14097069",
    ],
    [
      "2025-04-17 21:50:00z",
      "DM02WL",
      "18",
      "12580",
      "3.05",
      "153",
      "<br>N7OR 6",
      "14097070",
    ],
    [
      "2025-04-17 21:30:00z",
      "DM02TI",
      "11",
      "12560",
      "3.00",
      "146",
      "<br>WD0E 5",
      "14097067",
    ],
    [
      "2025-04-17 21:10:00z",
      "DM02RG",
      "14",
      "12580",
      "3.00",
      "146",
      "<br>AE7TF 2",
      "14097071",
    ],
    [
      "2025-04-17 20:40:00z",
      "DM02NC",
      "16",
      "12540",
      "3.00",
      "138",
      "<br>KI7VEM 0",
      "14097072",
    ],
    [
      "2025-04-17 20:20:00z",
      "DM02LA",
      "16",
      "12540",
      "4.90",
      "130",
      "<br>KI7VEM -2",
      "14097071",
    ],
    [
      "2025-04-17 20:10:00z",
      "DM01JX",
      "27",
      "12560",
      "4.70",
      "111",
      "<br>AE7TF 1",
      "14097068",
    ],
    [
      "2025-04-17 19:40:00z",
      "DM01GV",
      "25",
      "12500",
      "4.70",
      "99",
      "<br>AE7TF -2",
      "14097075",
    ],
    [
      "2025-04-17 19:20:00z",
      "DM01AI",
      "-15",
      "940",
      "3.10",
      "142",
      "<br>KG0D 0",
      "14097072",
    ],
    [
      "2025-04-17 18:50:00z",
      "DM01AR",
      "23",
      "12480",
      "4.80",
      "130",
      "<br>W7EL -3",
      "14097074",
    ],
    [
      "2025-04-17 18:40:00z",
      "CM91WQ",
      "22",
      "12500",
      "4.80",
      "142",
      "<br>VE6JY -6",
      "14097076",
    ],
    [
      "2025-04-17 18:20:00z",
      "CM91UP",
      "22",
      "12460",
      "4.85",
      "146",
      "<br>WD0E -7",
      "14097079",
    ],
    [
      "2025-04-17 17:50:00z",
      "CM91PO",
      "18",
      "12460",
      "4.80",
      "157",
      "<br>KD7HGL -7",
      "",
    ],
    [
      "2025-04-17 17:40:00z",
      "CM91ON",
      "26",
      "12460",
      "4.60",
      "146",
      "<br>KD7HGL -7",
      "",
    ],
  ];
}
