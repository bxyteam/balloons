
window.addEventListener('load', (event) => {
    const balloonLinkMenu = new BalloonLinkMenu();
    balloonLinkMenu.buildBalloonsUrlTemplate();
    const {other = "", SSID = "" } = balloonLinkMenu.searchParams;
    document.title = `${other.toUpperCase()}-${SSID} WSPR`; 


});


//let decoqrf ="";


// Default values
//let summhz = 0;
//let countmhz = 0;
//let avgfreq = 0;
//let showcap = "showcapture = false;";

// Default coordinates
//const Glatdeg = -34;
//const Glondeg = -58;

//let datataken = "";

// Get "other" query param in uppercase
//const other = (searchParams.get("other") || "").toUpperCase();

// Handle launch date
// let launchdate;
// if (searchParams.has("launch")) {
//   const launchd = searchParams.get("launch");
//   launchdate = `${launchd.substring(0,4)}-${launchd.substring(4,6)}-${launchd.substring(6,8)} ${launchd.substring(8,10)}:${launchd.substring(10,12)}:${launchd.substring(12,14)}`;
// } else {
//   const now = new Date();
//   const fe = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
//   const pad = (n) => String(n).padStart(2, '0');
//   launchdate = `${fe.getFullYear()}-${pad(fe.getMonth() + 1)}-${pad(fe.getDate())} 00:00:00`;
// }

// Get SSID if available
//const SSID = searchParams.get("SSID") || "";


// Example: print results
// console.log("Launch Date:", launchdate);
// console.log("SSID:", SSID);
// console.log("Other :", other);
// console.log("tbanda table:", tbanda);
           