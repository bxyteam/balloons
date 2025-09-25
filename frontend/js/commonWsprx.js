var slowerParam = getParamSafe("slower") === "true";
var DATA_SIZE_TELE_1 = slowerParam ? 20001 : 3001;
var DATA_SIZE_TELE_2 = slowerParam ? 20001 : 5001;
var CUENTA_SIZE_TELE_1 = slowerParam ? 20000 : 700;
var CUENTA_SIZE_TELE_2 = slowerParam ? 12500 : 8700;
var COUNT_SIZE_TELE_1 = slowerParam ? 20300 : 5000;
var COUNT_SIZE_TELE_2 = slowerParam ? 20000 : 5000;
var COUNT_SIZE_1_TELE_1 = slowerParam ? 20300 : 800;
var COUNT_SIZE_2_TELE_2 = slowerParam ? 20000 : 698;
var LIMIT_URL_1 = slowerParam ? 20000 : 3000;
var LIMIT_URL_2 = slowerParam ? 22000 : 5000;

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

window.getFrequency = () => {
  let fd = 0;
  if (
    getParamSafe("tracker") === "qrplabs" ||
    getParamSafe("tracker") === "traquito"
  ) {
    const modulo = Math.floor(((getParamSafe("qrpid") * 1) % 20) / 5);
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
  return frecu + fd;
};

function createArray(size, defaultValue) {
  return Array.from({ length: size + 1 }, () => defaultValue);
}

window.tbanda = [
  { band: "All", label: "All", frequency: 14097100 },
  { band: "LF", label: "-1", frequency: 137500 },
  { band: "LF", label: "-1", frequency: 137500 },
  { band: "MF", label: "0", frequency: 475700 },
  { band: "1", label: "160m", frequency: 1838100 },
  { band: "3", label: "80m", frequency: 3570100 },
  { band: "5", label: "60m", frequency: 5288700 },
  { band: "7", label: "40m", frequency: 7040100 },
  { band: "10", label: "30m", frequency: 10140200 },
  { band: "14", label: "20m", frequency: 14097100 },
  { band: "18", label: "17m", frequency: 18106100 },
  { band: "21", label: "15m", frequency: 21096100 },
  { band: "24", label: "12m", frequency: 24926100 },
  { band: "28", label: "10m", frequency: 28126100 },
  { band: "50", label: "6m", frequency: 50294500 },
  { band: "70", label: "4m", frequency: 70089500 },
  { band: "144", label: "2m", frequency: 144487500 },
  { band: "432", label: "70cm", frequency: 432298500 },
  { band: "1296", label: "23cm", frequency: 1296498500 },
];

// or1
window.or1 = createArray(60, 0);
window.or1[0] = 0;
window.or1[3] = 500;
window.or1[7] = 1000;
window.or1[10] = 1500;
window.or1[13] = 2000;
window.or1[17] = 2500;
window.or1[20] = 3000;
window.or1[23] = 4000;
window.or1[27] = 5000;
window.or1[30] = 6000;
window.or1[33] = 7000;
window.or1[37] = 8000;
window.or1[40] = 8500;
window.or1[43] = 9000;
window.or1[47] = 9500;
window.or1[50] = 10000;
window.or1[53] = 10500;
window.or1[57] = 11000;
window.or1[60] = 15000;

// xsnr
window.xsnr = createArray(120, 0);
window.xsnr[0] = 0;
window.xsnr[3] = 1000;
window.xsnr[7] = 2000;
window.xsnr[10] = 3000;
window.xsnr[13] = 4000;
window.xsnr[17] = 5000;
window.xsnr[20] = getParamSafe("other") !== "NC4ES" ? 6000 : 13000;
window.xsnr[23] = 7000;
window.xsnr[27] = 8000;
window.xsnr[30] = 9000;
window.xsnr[33] = 10000;
window.xsnr[37] = 11000;
window.xsnr[40] = 12000;
window.xsnr[43] = 13000;
window.xsnr[47] = 14000;
window.xsnr[50] = 15000;
window.xsnr[53] = 16000;
window.xsnr[57] = 17000;
window.xsnr[60] = 18000;
window.xsnr[63] = 19000;
window.xsnr[67] = 20000;
window.xsnr[70] = 21000;
window.xsnr[73] = 22000;
window.xsnr[77] = 23000;
window.xsnr[80] = 24000;

// kcq
window.kcq = createArray(60, 0);
window.kcq[0] = 0;
window.kcq[3] = 3000;
window.kcq[7] = 4582;
window.kcq[10] = 5477;
window.kcq[13] = 6244;
window.kcq[17] = 7141;
window.kcq[20] = 7745;
window.kcq[23] = 8306;
window.kcq[27] = 9000;
window.kcq[30] = 9486;
window.kcq[33] = 9949;
window.kcq[37] = 10535;
window.kcq[40] = 10954;
window.kcq[43] = 11357;
window.kcq[47] = 11874;
window.kcq[50] = 12369;
window.kcq[53] = 12609;
window.kcq[57] = 13076;
window.kcq[60] = 13416;

// oloc
window.oloc = createArray(60, "");
window.oloc[0] = "bd";
window.oloc[3] = "bm";
window.oloc[7] = "bu";
window.oloc[10] = "fd";
window.oloc[13] = "fm";
window.oloc[17] = "fu";
window.oloc[20] = "kd";
window.oloc[23] = "km";
window.oloc[27] = "ku";
window.oloc[30] = "nd";
window.oloc[33] = "nm";
window.oloc[37] = "nu";
window.oloc[40] = "rd";
window.oloc[43] = "rm";
window.oloc[47] = "ru";
window.oloc[50] = "wd";
window.oloc[53] = "wm";
window.oloc[57] = "wu";
window.oloc[60] = "ru";

// oalt
window.oalt = createArray(60, "");
window.oalt[0] = "200";
window.oalt[3] = "700";
window.oalt[7] = "1200";
window.oalt[10] = "1700";
window.oalt[13] = "2200";
window.oalt[17] = "2700";
window.oalt[20] = "3200";
window.oalt[23] = "4200";
window.oalt[27] = "5200";
window.oalt[30] = "6200";
window.oalt[33] = "7200";
window.oalt[37] = "8200";
window.oalt[40] = "8700";
window.oalt[43] = "9200";
window.oalt[47] = "9700";
window.oalt[50] = "10200";
window.oalt[53] = "10700";
window.oalt[57] = "11200";
window.oalt[60] = "15200";

// ovolt
window.ovolt = createArray(60, "");
window.ovolt[0] = "<3.3v";
window.ovolt[3] = "3.3v";
window.ovolt[7] = "3.4v";
window.ovolt[10] = "3.5v";
window.ovolt[13] = "3.6v";
window.ovolt[17] = "3.7v";
window.ovolt[20] = "3.7v";
window.ovolt[23] = "3.9v";
window.ovolt[27] = "4.0v";
window.ovolt[30] = "4.1v";
window.ovolt[33] = "4.2v";
window.ovolt[37] = "4.3v";
window.ovolt[40] = "4.4v";
window.ovolt[43] = "4.5v";
window.ovolt[47] = "4.6v";
window.ovolt[50] = "4.7v";
window.ovolt[53] = "4.8v";
window.ovolt[57] = "4.9v";
window.ovolt[60] = ">=5v";

// otemp
window.otemp = createArray(60, "");
window.otemp[0] = ">+35°";
window.otemp[3] = "+32°";
window.otemp[7] = "+27°";
window.otemp[10] = "+22°";
window.otemp[13] = "+17°";
window.otemp[17] = "+12°";
window.otemp[20] = "+7°";
window.otemp[23] = "+2°";
window.otemp[27] = "-3°";
window.otemp[30] = "-8°";
window.otemp[33] = "-13°";
window.otemp[37] = "-18°";
window.otemp[40] = "-23°";
window.otemp[43] = "-28°";
window.otemp[47] = "-33°";
window.otemp[50] = "-38°";
window.otemp[53] = "-43°";
window.otemp[57] = "-48v";
window.otemp[60] = "<-50°";

window.dic = {
  0: 0,
  3: 1,
  7: 2,
  10: 3,
  13: 4,
  17: 5,
  20: 6,
  23: 7,
  27: 8,
  30: 9,
  33: 10,
  37: 11,
  40: 12,
  43: 13,
  47: 14,
  50: 15,
  53: 16,
  57: 17,
  60: 18,
};

window.mes = [
  "",
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
];

window.fcentral = getFrequency();

window.wtemp = 0;
window.wbat = "";
window.wspeed = 0;
window.wsats = "";
window.walt = "";
window.newloc = "";

window.addplusm = "";

window.locations = [];
window.flechas = [];
window.dista = [];
window.beacon1 = [];
window.trayecto = [];

window.ttipo = 0;
window.thora = 1;
window.tcall = 2;
window.tmhz = 3;
window.tsnr = 4;
window.tdrift = 5;
window.tgrid = 6;
window.tpwr = 7;
window.treporter = 8;
window.trgrid = 9;
window.tkm = 10;
window.taz = 11;
window.taltura = 12;

window.K6_SAVE = "";
window.N6_SAVE = "";

window.addplusElementValue = "";
window.avgfreqElementValue = "";
window.proxElementValue = "";

//var banda = getParamSafe("banda").length > 0 ? getParamSafe("banda") : "All";
var SSID = getParamSafe("SSID");
var SSIDL = SSID !== "" ? `-${SSID}` : "";
