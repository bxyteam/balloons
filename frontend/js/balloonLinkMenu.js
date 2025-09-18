class BalloonLinkMenu {
  constructor() {
    this.did = {
      "2200m": "0.13",
      "630m": "0.47",
      "160m": "1.8",
      "60m": "5",
      "40m": "7",
      "30m": "10",
      "20m": "14",
      "17m": "18",
      "15m": "21",
      "12m": "24",
      "10m": "28",
      "6m": "50",
      "4m": "70",
      "2m": "144",
      "70cm": "432",
      "23cm": "1296",
    };
    ((this.tbanda = [
      ["All", "All", 14097100],
      ["LF", "-1", 137500],
      ["LF", "-1", 137500],
      ["MF", "0", 475700],
      ["1", "160m", 1838100],
      ["3", "80m", 3570100],
      ["5", "60m", 5288700],
      ["7", "40m", 7040100],
      ["10", "30m", 10140200],
      ["14", "20m", 14097100],
      ["18", "17m", 18106100],
      ["21", "15m", 21096100],
      ["24", "12m", 24926100],
      ["28", "10m", 28126100],
      ["50", "6m", 50294500],
      ["70", "4m", 70089500],
      ["144", "2m", 144487500],
      ["432", "70cm", 432298500],
      ["1296", "23cm", 1296498500],
    ]),
      (this.mes = [
        "",
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
      ]));
    this.searchParams = this.getSearchParams();
    this.processBalloonData = this.processBalloonData.bind(this);
  }

  getSearchParams() {
    const searchParams = new URLSearchParams(
      window.parent.window.location.search,
    );
    const params = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = encodeURIComponent(value);
    }
    return params;
  }

  processBalloonData(entry) {
    const launchd1 = entry.launch || "";
    let launchdate1 = "";
    let dias1 = 0;
    let was = "Was";

    // Ensure launch string is long enough
    if (launchd1.length >= 14) {
      const year = launchd1.substring(0, 4);
      const month = launchd1.substring(4, 6);
      const day = launchd1.substring(6, 8);
      const hour = launchd1.substring(8, 10);
      const minute = launchd1.substring(10, 12);
      const second = launchd1.substring(12, 14);

      const lanzado1 = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
      const lanzado2 = new Date(
        `${year}-${month}-${day}T${hour}:${minute}:${second}Z`,
      );
      const now = new Date();

      // Calculate day difference
      const diffTime = now.getTime() - lanzado2.getTime();
      dias1 = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      // Set 'was' info
      if (entry.SSID && entry.SSID !== "") {
        was = "-" + entry.SSID;
      }

      if (launchd1.length > 10) {
        launchdate1 = `Launched ${this.mes[parseInt(month, 10)]}-${day} ${year} ${hour}:${minute}&#13;${was} launched ${dias1} days ago`;

        if (dias1 < 0) {
          launchdate1 = `To be Launched &#13; ${this.mes[parseInt(month, 10)]}-${day} ${year} ${hour}:${minute}&#13; It will be in ${-dias1} days`;
        } else if (dias1 === 0) {
          launchdate1 = `To be Launched &#13; ${this.mes[parseInt(month, 10)]}-${day} ${year} ${hour}:${minute}&#13; ${was} Launch today`;
        }
      }
    } else {
      const ballooncall = (entry.other || "").toUpperCase();
      launchdate1 = `See ${ballooncall} aprs.fi tracking`;
    }

    return {
      ...entry,
      launchdate1,
      dias1,
    };
  }

  buildBalloonLinks(enrichedData, selectedOther, selectedSSID, comentm = [""]) {
    let balloonsurl = "";
    const callsurl = [];
    const bcidSet = new Set(); // replaces bcid array
    let comentariosballoon = "";
    let comentfull = "";

    enrichedData.forEach((entry, z) => {
      const ballooncall = (entry.other || "").toUpperCase();
      const ssidn = entry.SSID || "";
      const launchdate1 = entry.launchdate1 || "";
      const comentarios = entry.comments || "";
      const linea = entry.line;

      if (ballooncall.length > 0) {
        let tok1 = "<u>";
        //let diaslaunch = entry.dias1;

        if (
          ballooncall.toLowerCase() === selectedOther.toLowerCase() &&
          ssidn === selectedSSID
        ) {
          tok1 = "<u style='background-color:orange;'>";
        }

        // Tooltip with comments
        let tooltip = `${launchdate1} ${decodeURIComponent(comentarios).replace(/"/g, "''")}`;
        tooltip = tooltip.replace(/&#13;/g, " ").replace(/&#13/g, " ");

        const link = `<a title="${tooltip}" style="cursor:pointer;" onclick="event.preventDefault(); this.style.color='#ff0000'; formu.callsign.value='${ballooncall}'; logactivity('${linea}'); gourl('${linea}')">${tok1}${ballooncall}</u></a>`;
        balloonsurl += link + "<br>";

        // Set comentariosballoon
        if (ballooncall.toLowerCase() === selectedOther.toLowerCase()) {
          comentariosballoon =
            "\n" +
            comentarios
              .replace(/&#13;/g, " ")
              .replace(/&#13/g, " ")
              .replace(/"/g, "''")
              .replace(/\r\n|\r|\n/g, " ");

          if (comentariosballoon.trim().length < 5) {
            comentariosballoon = "";
          }
        }

        const ssidx = ssidn ? `-${ssidn}` : "";
        callsurl.push([ballooncall + ssidx, linea]);

        // Handle unique balloon calls (like bcid array)
        if (!bcidSet.has(ballooncall)) {
          bcidSet.add(ballooncall);
        }

        // Optional: comment processing if it's the active balloon
        if (
          ballooncall.toLowerCase() === selectedOther.toLowerCase() &&
          ssidn === selectedSSID
        ) {
          let comentx = decodeURIComponent(comentm[0] || "").replace(
            /\+/g,
            " ",
          );
          comentx = comentx
            .replace(/\.\./g, ".<br>")
            .replace(/"/g, "''")
            .replace(/\r\n|\r|\n/g, "<br>");

          comentfull = comentx;
        }
      }
    });

    return {
      balloonsurl,
      callsurl,
      bcidArray: Array.from(bcidSet),
      comentariosballoon,
      comentfull,
    };
  }

  processOutput(callsurl, selectedOther, selectedSSID, balloonsurl) {
    // Sort callsurl alphabetically by callSSID (index 0)
    callsurl.sort((a, b) => a[0].localeCompare(b[0]));

    // Build HTML call list with highlight
    let callsll = "";
    const bcidSet = new Set();
    callsurl.forEach(([callSSID, url]) => {
      //console.log("raw-url", rawUrl);
      // const url = ((str) => {
      //   const txt = document.createElement("textarea");
      //   txt.innerHTML = str;
      //   return txt.value;
      // })(rawUrl);

      const [callo, callssid = ""] = callSSID.split("-");
      const match =
        callo.toLowerCase() === selectedOther.toLowerCase() &&
        callssid === selectedSSID;

      if (match) {
        callsll += `<a title='${callSSID}' style='background-color:orange;' href='${url}'>${callSSID}</a><br>`;
      } else {
        callsll += `<a title='${callSSID}' href='${url}'>${callSSID}</a><br>`;
      }

      bcidSet.add(callo);
    });

    // Limit balloonurl length
    if (balloonsurl.length > 11000) {
      const midPoint = Math.floor((balloonsurl.length + 4800) / 2);
      const pos = balloonsurl.indexOf("<a title", midPoint);
      if (pos !== -1) {
        balloonsurl =
          balloonsurl.slice(0, pos - 12) + "<br>" + balloonsurl.slice(pos - 12);
      }
    }

    // Build JavaScript bcid array
    //const bcidm = `var bcid = [${[...bcidSet].map(c => `"${c}"`).join(",")}];`;
    const bcidm = JSON.parse(
      `[${[...bcidSet].map((c) => `"${c}"`).join(",")}]`,
    );

    // Rebuild query string
    const queryParams = new URLSearchParams(
      window.parent.window.location.search,
    );
    let qstring = "?";
    for (const [key, value] of queryParams.entries()) {
      qstring += `${key}=${encodeURIComponent(value)}&`;
    }

    // Add fixed action links (TRACK, [+], Presets, etc.)
    const banda = queryParams.get("banda")?.toLowerCase() || "";
    const didBand = this.did[banda.toLowerCase()] || "";

    balloonsurl += `
        <a style='background-color:lightblue;font-size:14px;color:red;' href='${HOST_URL}/wsprx${qstring}' target='_self' title='New using wspr.live'><b><u>TRACK</u></b></a>&nbsp;
        <a style='background-color:lightblue;font-size:14px;color:red;' href='${HOST_URL}/wsprx${qstring}&slower=true' target='_self' title='More points but slower'><b><u>[+]</u></b></a>&nbsp;
        <a style='background-color:lightblue;font-style: italic;' href='${HOST_URL}/wsprset' target='_blank' title='See these entries&#13 Or Enter New...'><b><u>Presets</u></b></a>
        &nbsp;&nbsp;<a href='https://www.qrp-labs.com/tracking.html' target='_blank' style='background-color:lightblue;font-style: italic;cursor:pointer;' title='U4B Settings'><b><u>U4B</u></b></a>
    `;

    if (selectedSSID) {
      balloonsurl += `
            &nbsp;&nbsp;<a href='${HOST_URL}/balloonchart?callsign=${selectedOther}-${selectedSSID}&flights=0&grafico=height%20m' target='_blank' title='Plot Graphs if data available on aprs.fi' style='background-color:lightblue;font-style: italic;cursor:pointer;'><b><u>Charts</u></b></a>
        `;
    }
    //        &nbsp;&nbsp;<a href='${HOST_URL}/wspruser' target='_blank' style='background-color:lightblue;font-style: italic;cursor:pointer;' title='Last Uses'><b><u>Users</u></b></a>
    balloonsurl += `
        &nbsp;&nbsp;<a href='${HOST_URL}/dx?call=${selectedOther}&band=${didBand}&bs=B' target='_blank' style='background-color:lightblue;font-style: italic;cursor:pointer;' title='WSPR DX Reports'><b><u>DX</u></b></a>
        &nbsp;&nbsp;<a href='https://satellites.browxy.com/pass' target='_blank' style='background-color:lightblue;font-style: italic;cursor:pointer;' title='Track Satellites'><b><u>Sat</u></b></a>

        </span></span></center>
    `;
    //  <a href='${HOST_URL}/wspruser' target='_blank' style='cursor:pointer;' title='Last Uses'><u><i>Usage</i></u></a>
    const calink = `
       <center>
        <table border=0 cellpadding=0 cellspacing=0 width=64px>
            <tr>
              <td align=center>
                <span style='font-size:11px;line-height:10px;font-weight:bold;text-align:center'>
                   <span style='font-size:12px;line-height:11px;'>Browse</span><br>
                   <hr width='60px' style='color:#ffffff;margin-top:0px;margin-bottom:0px;'>
                   <a style='cursor:pointer;' href="${HOST_URL}/wsprx${qstring}" target='_self' title='New using wspr.live'><u><i>ANY</i></u></a><br>
                   <a style='cursor:pointer;' href="${HOST_URL}/wsprset" target='_blank' title='See these entries&#13 Or Enter New...'><u>Presets</u></a></b><br>
                   <a href='https://www.qrp-labs.com/tracking.html' target='_blank' style='cursor:pointer;' title='U4B Settings'><u><i>U4B</i></u></a><br>
                   <a href="${HOST_URL}/balloonchart?callsign=${selectedOther}-${selectedSSID}&flights=0&grafico=height%20m"  target='_blank' title='Plot Graphs if data available on aprs.fi' style='cursor:pointer;'><u><i>Charts</i></u></a><br>
                   <a href='${HOST_URL}/dx?call=${selectedOther}&band=${didBand}&bs=B' target='_blank' style='cursor:pointer;' title='WSPR DX Reports'><u><i>DX-Prop</i></u></a><br>
                   <a href='https://satellites.browxy.com/pass' target='_blank' style='cursor:pointer;' title='Track Satellites'><u><i>Satellite</i></u></a><br>

                   <hr width='60px' style='color:#ffffff;margin-top:0px;margin-bottom:0px;'>
                    ${callsll}
                    <hr width='60px' style='color:#ffffff;margin-top:1px;margin-bottom:0px;'>
                    <i>${callsurl.length} Entries</i>
                </span>
             </td>
            </tr>
        </table>
    </center>`;

    return {
      bcidm, // bcid = [...]
      balloonsurl, // Full HTML block with buttons
      calink, // Calls list block with count
    };
  }

  chartMenuTemplate() {
    const ocultar =
      this.searchParams.tracker === "zachtek1"
        ? " style='visibility:hidden;line-height:1px;height:1px !important;'"
        : "";
    document.getElementById("chdiv").innerHTML = `<center>
           &nbsp;&nbsp;<i>Charts</i><br />
            <br /><button id="0" onclick="event.preventDefault();event.preventDefault();drawChart(0)" class='chartbutton'>&nbsp;&nbsp;Height mtrs&nbsp;</button><br />
            <br /><button id="1" onclick="event.preventDefault();drawChart(1)" class='chartbutton'>&nbsp;&nbsp;Height Feet&nbsp;&nbsp;</button>${this.searchParams.tracker !== "zachtek1" ? "<br />" : ""}
            <br /><button id="2" onclick="event.preventDefault();drawChart(2)" ${ocultar} class='chartbutton'">&nbsp;&nbsp;Solar Volts&nbsp;&nbsp;&nbsp;</button><br />
            <br /><button id="3" onclick="event.preventDefault();drawChart(3)" class='chartbutton' title='Solar Elev.° at&#13Balloon height'>&nbsp;&nbsp;&nbsp;Solar Elev.&nbsp;&nbsp;&nbsp;</button><br />
            <br /><button id="4" onclick="event.preventDefault();drawChart(4)" class='chartbutton'>&nbsp;Speed Km/h&nbsp;&nbsp;</button><br />
            <br /><button id="15" onclick="event.preventDefault();drawChart(12)" class='chartbutton'>&nbsp;Speed Knots&nbsp;&nbsp;</button><br />
            <br /><button id="5" onclick="event.preventDefault();drawChart(5)" class='chartbutton'>&nbsp;&nbsp;&nbsp;Asc. / Desc.&nbsp;&nbsp;</button><br />
            <br /><button id="6" onclick="event.preventDefault();drawChart(6)" ${ocultar} class='chartbutton'>&nbsp;&nbsp;Temperat. °C&nbsp;</button>${this.searchParams.tracker !== "zachtek1" ? "<br />" : ""}
            <br /><button id="11" onclick="event.preventDefault();drawChart(11)" ${ocultar} class='chartbutton'>&nbsp;&nbsp;Temperat. °F&nbsp;&nbsp;</button>${this.searchParams.tracker !== "zachtek1" ? "<br />" : ""}
            <br /><button id="7" onclick="event.preventDefault();drawChart(7)" class='chartbutton'>&nbsp;&nbsp;&nbsp;SNR dB Lvl&nbsp;&nbsp;&nbsp;</button><br />
            <br /><button id="8" onclick="event.preventDefault();drawChart(8)" class='chartbutton'>&nbsp;&nbsp;&nbsp;&nbsp;MULTIPLE&nbsp;&nbsp;&nbsp;&nbsp;</button><br />
            <br /><button id="9" onclick="event.preventDefault();drawChart(9)" class='chartbutton'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Longitude&nbsp;&nbsp;&nbsp;&nbsp</button><br />
            <br /><button id="10" onclick="event.preventDefault();drawChart(10)" class='chartbutton'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Frequency&nbsp;&nbsp;&nbsp;&nbsp</button><br />
            <br style="line-height:14px;" /><button id="12" onclick="event.preventDefault();drawKm(12)" class='chartbutton'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Distance&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</button><br />
            <br /><button id="13" onclick="event.preventDefault();solarflux();" class='chartbutton'>&nbsp;&nbsp;&nbsp;&nbsp;Solar Flux&nbsp;&nbsp;&nbsp;&nbsp;&nbsp</button><br />
            <br style="line-height:11px;" /><button id="14" class='chartbutton' onclick="event.preventDefault();drawChart(14)" title="Go to Map"><img src="https://i.postimg.cc/GpGtk56G/map.png" width="76px"></button><br />
            <br style="line-height:2px;" /><i style="font-size:11px;line-height:10px;">&nbsp;&nbsp;A graph is worth a<br />&nbsp;&nbsp;thousand numbers<br />&nbsp;Drag chart to Zoom<br />right click unzooms</i><br style="line-height:11px;" />
            <a href='https://www.paypal.me/AMSATARGENTINA/' title=' Please help keep site active, if possible&#13&#xbb; Donate to Amsat Argentina, Thanks! &#xab;' target='_blank' style='text-decoration:none;'><br style="line-height:1px;" />
              <img src="https://i.postimg.cc/QtqMzW8M/pen.gif"/>
            </a><br />
            <span style="font-size:11px;">&nbsp;Limit YYYYMMDD<br />&nbsp;&nbsp;
              <input type="text" size=8 onchange="checkdate();setid();" placeholder="YYYYMMDD" title="Set date limit&#13  for reports" maxlength="8" name="limit" id="limit" style="font-family: fixedsys, consolas, monospace;font-weight:bold;font-size:14px;line-height:10px;background-image:url(https://i.postimg.cc/cLY0j8TN/rayas3.gif);width:71px;" />
            </span>
        </center>`;
  }

  buildBalloonsUrlTemplate() {
    const { other = "", SSID = "" } = this.searchParams;
    const enriched = dataTracker.balloons
      .filter((b) => b.old !== "true")
      .map(this.processBalloonData);
    const result = this.buildBalloonLinks(enriched, other, SSID);
    window.comentfull = result.comentfull;
    window.comentariosballoon = result.comentariosballoon;

    const output = this.processOutput(
      result.callsurl,
      other,
      SSID,
      result.balloonsurl,
    );
    window.bcid = output.bcidm;

    document.getElementById("balloonsurl").innerHTML = `<center>
        <span style='font-family:Arial Narrow,Tahoma,Arial;font-size:10px;font-stretch:condensed;font-weight:normal;line-height:11px;white-space:nowrap;'>
            <center>
                <span style="display:flex; flex-direction: row; gap: 3px; align-items: center; justify-content: center;flex-wrap: wrap;padding: 5px;">
                    Flights ${output.balloonsurl}
                </span>
            </center>
        </span>
      </center>`;
    document.getElementById("calink").innerHTML = output.calink;
    this.chartMenuTemplate();
    setTimeout(() => {
      const h = document
        .getElementById("balloonsurl")
        .getBoundingClientRect().height;
      //document.getElementById("calink").style.visibility = 'visible';
      document.getElementById("calink").style.top = `${h + 20}px`;

      //document.getElementById("chdiv").style.visibility = 'visible';
      document.getElementById("chdiv").style.top = `${h + 20}px`;
    }, 200);
  }
}
