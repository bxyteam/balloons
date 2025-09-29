window.bj = [];

class BalloonDataTable {
  constructor(balloons) {
    this.FREQUENCY_MAP = Object.freeze({
      "60m": 5,
      "40m": 7,
      "30m": 10,
      "20m": 14,
      "17m": 18,
      "15m": 21,
      "12m": 24,
      "10m": 28,
      "6m": 50,
      "4m": 70,
      "2m": 144,
    });
    this.flying = 0;
    this.balloons = balloons;
  }

  htmlEncode(str) {
    return str.replace(/[&<>"']/g, function (match) {
      const escapeMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      };
      return escapeMap[match];
    });
  }

  formatDate(dateStr) {
    if (!dateStr || dateStr.length < 14) return dateStr;

    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    const hour = dateStr.substring(8, 10);
    const minute = dateStr.substring(10, 12);
    const second = dateStr.substring(12, 14);

    return `${year}&nbsp;&nbsp;${month}/${day}&nbsp;&nbsp;${hour}:${minute}:${second}`;
  }

  getDaysSinceLaunch(launchDate) {
    if (!launchDate || launchDate.length < 8) return 999;

    const year = parseInt(launchDate.substring(0, 4));
    const month = parseInt(launchDate.substring(4, 6)) - 1;
    const day = parseInt(launchDate.substring(6, 8)) + 1;

    const launch = new Date(year, month, day);
    const now = new Date();
    const diffTime = now - launch;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  getLastContactTime(entry, daysSinceLaunch) {
    const cally = entry.other || "";
    const bandas = entry.banda || "";
    //const ssidx = entry.SSID || '';
    for (let x = 0; x < dataTracker.licenseData.length; x++) {
      const licekEntry = dataTracker.licenseData[x];
      if (
        licekEntry.callSign === cally.toUpperCase() &&
        parseInt(licekEntry.frequency) === this.FREQUENCY_MAP[bandas]
      ) {
        if (Math.abs(licekEntry.hoursDiff) > 120) {
          return {
            lastContactTime: Math.round(Math.abs(licekEntry.hoursDiff) / 24),
            lastHeardText: "days",
            ponerAsterisco: true,
          };
        } else if (daysSinceLaunch > 30) {
          return {
            lastContactTime: Math.abs(licekEntry.hoursDiff),
            lastHeardText: "",
            ponerAsterisco: true,
          };
        } else {
          return {
            lastContactTime: Math.abs(licekEntry.hoursDiff),
            lastHeardText: "",
            ponerAsterisco: true,
          };
        }
      }
    }
    return { lastContactTime: "-", lastHeardText: "", ponerAsterisco: false };
  }

  getContactStyle(ultimo) {
    let ponecolor = "";

    if (typeof ultimo === "number") {
      if (ultimo < 13) {
        this.flying++;
      }

      if (ultimo < 25) {
        ponecolor = "background-color:#abebc6;font-weight:bold;";
      } else {
        ponecolor = "";
      }

      if (ultimo > 240) {
        ponecolor =
          "background-color:#ffaaaa;font-weight:normal;font-style:italic;white-space:nowrap;";
      } else if (ultimo > 24 && ultimo < 240) {
        ponecolor =
          "background-color:#ffff33;font-weight:normal;font-style:italic;white-space:nowrap;";
      }
    } else {
      ponecolor =
        "background-color:#ffaaaa;font-weight:normal;font-style:italic;white-space:nowrap;";
    }
    return ponecolor;
  }
  calcfreq(band, qrpn) {
    let ffb = 0;
    let ffd = 0;
    let c1,
      c2,
      c3,
      fd = 0;

    switch (band.toLowerCase()) {
      case "160m":
        ffb = 1838000;
        break;
      case "80m":
        ffb = 3569000;
        break;
      case "40m":
        ffb = 7040000;
        break;
      case "30m":
        ffb = 10140100;
        break;
      case "22m":
        ffb = 13553300;
        break;
      case "20m":
        ffb = 14097000;
        break;
      case "17m":
        ffb = 18106000;
        break;
      case "15m":
        ffb = 21096000;
        break;
      case "12m":
        ffb = 24926000;
        break;
      case "10m":
        ffb = 28126000;
        break;
      case "6m":
        ffb = 50294000;
        break;
      case "2m":
        ffb = 144490400;
        break;
      default:
        ffb = 14097000;
        break;
    }

    if (qrpn !== null && qrpn !== undefined && qrpn.toString() !== "") {
      const qrp = parseInt(qrpn);

      if (qrp < 200) c1 = "0";
      else if (qrp < 400) c1 = "1";
      else c1 = "Q";

      let resto = parseInt(qrp.toString().slice(-2));
      c2 = Math.floor(resto / 20).toString();

      if (qrp >= 100 && qrp < 200) c2 = (parseInt(c2) + 5).toString();
      if (qrp >= 300 && qrp < 400) c2 = (parseInt(c2) + 5).toString();
      if (qrp > 499) c2 = (parseInt(c2) + 5).toString();

      const r1 = qrp % 10;
      if (r1 === 1 || r1 === 6) c3 = "2";
      else if (r1 === 0 || r1 === 5) c3 = "0";
      else if (r1 === 4 || r1 === 9) c3 = "8";
      else if (r1 === 3 || r1 === 8) c3 = "6";
      else if (r1 === 2 || r1 === 7) c3 = "4";

      if (band.toLowerCase() === "all") band = "20m";

      const modulo = Math.floor((qrp % 20) / 5);
      if (modulo === 0) fd = 20;
      else if (modulo === 1) fd = 60;
      else if (modulo === 2) fd = 140;
      else if (modulo === 3) fd = 180;

      ffd = fd;
    } else {
      ffd = 100;
    }

    let result = ffb + ffd;

    return band.toLowerCase() !== "all"
      ? result
      : result + "<span title='more bands'>&#x2295;</span>";
  }

  getFreqCell(balloon) {
    let uno = balloon.banda || "";
    let dos = balloon.qrpid !== " " ? balloon.qrpid : "";

    if (balloon.tracker === "qrplabs" || balloon.tracker === "dl6ow") {
      return `<td align="center">~${this.calcfreq(uno, dos)}</td>`;
    } else {
      return `<td align="center">&#1;${this.calcfreq(uno, dos)}</td>`;
    }
  }

  foundCallSignInSearchParams(balloon) {
    if (!balloon.other || balloon.other === "") {
      return false;
    }

    const queryString = window.location.search;

    const urlParams = new URLSearchParams(queryString);
    const callParam = urlParams.get("call");

    if (!callParam) {
      return false;
    }

    return callParam.toUpperCase() === balloon.other.toUpperCase();
  }

  replaceText(str, searchText, replaceWith) {
    if (!str) return "";
    return str.toString().replace(new RegExp(searchText, "g"), replaceWith);
  }

  getAdicionalInfo(balloon) {
    let adicio =
      this.replaceText(balloon.repito, "on", "") +
      this.replaceText(balloon.qp, "on", "");

    if (adicio === "wide=" || adicio === "wide=on") {
      adicio =
        this.replaceText(balloon.repito, "on", "") +
        this.replaceText(balloon.telen, "on", "");
    }

    if (adicio === "") {
      adicio = "x";
    }

    return adicio;
  }

  getFrequencyParams(balloon, index) {
    //on + banda, qrpid, other, SSID, qp, launch, tracker, detail, balloonid, timeslot, # index, qp
    const detail = `detail=${balloon.detail}`;

    return [
      `on ${balloon.banda}`,
      `${balloon.qrpid}`,
      `${balloon.other}`,
      `${balloon.SSID}`,
      `qp=${balloon.qp}`,
      `launch=${balloon.launch}`,
      `tracker=${balloon.tracker}`,
      `${detail}`,
      `balloonid=${balloon.balloonid}`,
      `timeslot=${balloon.timeslot}`,
      `${index}`,
      `qp=${balloon.qp}`,
    ]
      .reduce((acc, t) => `${acc}, '${t}'`, "")
      .slice(2);
  }

  getRowsTemplate() {
    return this.balloons
      .map((balloon, index) => {
        const daysSinceLaunch = this.getDaysSinceLaunch(balloon.launch);
        const { lastContactTime, lastHeardText, ponerAsterisco } =
          this.getLastContactTime(balloon, daysSinceLaunch);
        const contactStyle = this.getContactStyle(
          lastContactTime,
          lastHeardText,
        );
        const freqCell = this.getFreqCell(balloon);
        const foundCall = this.foundCallSignInSearchParams(balloon);
        const adicionalInfo = this.getAdicionalInfo(balloon);
        const freqParams = this.getFrequencyParams(balloon, index);
        const isOld = balloon.old === "true";
        //'on 20m','346','AB9LM','11','qp=','2024020600:00:00','qrplabs',' &lt;span title='Upload to aprs.fi'&gt;◬&lt;/u&gt;','17','2','0','qp='
        //showfreq('on 20m','346','AB9LM','11','qp=','launch=20240206000000','tracker=qrplabs','detail=','balloonid=17','timeslot=2','0','qp=')
        return `<tr onmouseout="if(popupwin1){popupwin1.close()}" style="cursor:pointer;" title="Show Emit Frequency Click for Hide/Restore Or Click to Update">
         <td align="center" style="white-space:nowrap;border-color:#ffffff;border-width:1px;${isOld ? "font-style:italic;color:#444;" : ""}">${isOld ? "old" : index + 1}</td>
         <td align="center" width="100px;" style="white-space:nowrap;border-color:#eeeeee;border-width:1px;border-left-width:0px;width:100px;${foundCall ? "background-color:orange;" : ""}">
           <a href="${balloon.url}" target="_blank'" title="Go Track ${balloon.other} !">${balloon.other.toUpperCase()}</a>
         </td>
         <td onclick="event.preventDefault(); showfreq(${freqParams})" align="center" style="white-space:nowrap;border-color:#eeeeee;border-width:1px;">${balloon.other}-${balloon.SSID}</td>
         <td onclick="event.preventDefault(); showfreq(${freqParams})" align="center" style="white-space:nowrap;border-color:#eeeeee;border-width:1px;">${balloon.banda}</td>
         <td onclick="event.preventDefault(); showfreq(${freqParams})" align="center" style="white-space:nowrap;border-color:#eeeeee;border-width:1px;">${balloon.balloonid}</td>
         <td onclick="event.preventDefault(); showfreq(${freqParams})" align="center" style="white-space:nowrap;border-color:#eeeeee;border-width:1px;">${balloon.timeslot}</td>
         <td onclick="event.preventDefault(); showfreq(${freqParams})" align="center" style="white-space:nowrap;border-color:#eeeeee;border-width:1px;">
           <span title="upload to aprs.fi">${balloon.telen && balloon.telen === "on" ? "#" : ""} ${balloon.detail && balloon.detail === "on" ? "on" : ""} ◬</span>
        </td>
        <td align="center" style="white-space:nowrap;border-color:#eeeeee;border-width:1px;" title="YYYYMMDDHHMMSS (z)">${this.formatDate(balloon.launch)}</td>
        <td onclick="event.preventDefault(); showfreq(${freqParams})" align="center" style="white-space:nowrap;border-color:#eeeeee;border-width:1px;">${balloon.SSID}</td>
        <td onclick="event.preventDefault(); showfreq(${freqParams})" align="center" style="white-space:nowrap;border-color:#eeeeee;border-width:1px;">${balloon.tracker}</td>
        <td onclick="event.preventDefault(); showfreq(${freqParams})" align="center" style="white-space:nowrap;border-color:#eeeeee;border-width:1px;">${balloon.qrpid}</td>
        ${freqCell}
        <td align="center">
          <b>${daysSinceLaunch}</b>
        </td>
        <td align="center" style="${contactStyle}">${lastContactTime} ${lastHeardText}</td>
        <td title="✓ Callsign seen last 24 hours" style="color:green;font-size:14px;border-width:0px;background-color:#eeeeee;">
          ${ponerAsterisco ? "<b>✓</b>" : ""}
        </td>
    </tr>`;
      })
      .join("");
  }

  buildTableTemplate() {
    document.getElementById("balloonsTable").innerHTML = `<thead'>
        <th width='8%' colspan=2 style='width:8%;white-space:nowrap;' align=left>&nbsp;#&nbsp;&nbsp&#x25BD;&nbsp;Links to Go Track&nbsp;&#x25BD;</th>
        <th align=center>&nbsp;CALL +SSID</th>
        <th align=center>BAND</th>
        <th align=center title='2nd TLM 1st+3rd character'>&nbsp;ID&nbsp;</th>
        <th align=center title='Start minute&#13of 2nd TLM'>TSlot</th>
        <th align=center title='Detail & upload selected & # if Telen'>Detail +#+&#x25EC;</th>
        <th align=center>Launch date time</th>
        <th align=center>SSID</th>
        <th align=center>Tracker</th>
        <th align=center title='U4B/Traquito Channel'>U4B Chnl</th>
        <th align=center style='font-size:11px;white-space:nowrap;'>Center<br>Freq Hertz</th>
        <th align=center title='Launched Days ago' style='font-size:11px;'>Launch Days&nbsp;</th>
        <th style='text-align:center;width:34px;font-family:Arial Narrow;font-size:10px;line-height:11px;white-space:nowrap;font-stretch: ultra-condensed;' title='Hours since last heard&#13If Green callsign active&#13during the last 24 hours&#13If yellow inactive > 1 day&#13If red inactive > 10 days&#13If - call was not heard'><center>Last heard<br>Hour-Days</center></th>
        <th title='&check; Callsign seen last 24 hours' style='font-family:Arial;font-size:7px;line-height:6px;text-align:center;'><b>AC<br>TI<br>VE<br>??</b></th>
      </thead>
        ${this.getRowsTemplate(this.balloons)}`;

    document.getElementById("flyingBalloonsActive").innerHTML =
      `${this.flying} Balloons Active`;
  }
}

const loadBalloonApp = async () => {
  resizeAndScale();
  window.dataTracker = await loadDataTrackerjson();
  const more = getParamSafe("more") === "1";
  const jsonArray = JSON.parse(dataTracker.jsonArray);
  window.bj = !more
    ? jsonArray.filter((item) => item[item.length - 1] !== "true")
    : jsonArray;
  const filteredBalloons = !more
    ? dataTracker.balloons.filter((b) => b.old !== "true")
    : dataTracker.balloons;
  const bdt = new BalloonDataTable(filteredBalloons);
  bdt.buildTableTemplate();
  cargarfotos();
  setInterval(verimagen, 15000);
  document.getElementById("spinner-overlay").style.display = "none";
};

const messageActionHandler = (apiPayload) => {
  const { data } = apiPayload;
  switch (data.action) {
    case "SEND":
      const url = data.url;
      window.parent.window.location.href = url;
      break;
    case "HIDE_RESTORE":
      document.getElementById("executionState").value = data.taskState;
      document.getElementById("wspr-overlay-content").innerHTML =
        `<h2 style="color: #FFFFFF; font-size: 22px;font-weight:bold;margin-bottom: 20px;margin-top: 20px;">${data.taskStateMessage}</h2>`;
      setTimeout(() => {
        document.getElementById("wspr-overlay").remove();
        if (data.taskState === "RELOADING") {
          window.parent.window.location.reload();
        }
      }, 7000);
      break;
    default:
      console.log("Unknown action:", data.action);
  }
};
const handleMessage = (event) => {
  const { response } = event.data;
  document.getElementById("spinner-overlay").style.display = "none";
  if (response && response.apiPayload) {
    const apiPayload = response.apiPayload;
    if (apiPayload.statusCode === 200) {
      messageActionHandler(apiPayload);
    } else if (apiPayload.statusCode === 400) {
      if (apiPayload.error) {
        console.error("apiPayload.error.message");
        window.parent.window.alert(apiPayload.error.message);
      }
    }
  }
};

window.addEventListener("load", loadBalloonApp);

window.addEventListener("resize", resizeAndScale);

window.addEventListener("message", handleMessage);
