function processTelemetry({ pag, cuenta }) {
  let tablam = new Array(DATA_SIZE_TELE_1);
  let tablax = split(pag, chr(10), DATA_SIZE_TELE_1, 1);
  let tablahoras = Array(DATA_SIZE_TELE_1 + 1)
    .fill("")
    .map(() => Array(4).fill(""));
  let tele1 = Array(DATA_SIZE_TELE_1 + 1)
    .fill("")
    .map(() => Array(14).fill(""));
  let licentab = new Array(450);
  let distakm = new Array(85).fill(0);
  let punt = Array(DATA_SIZE_TELE_1 + 1)
    .fill("")
    .map(() => Array(8).fill(""));

  let output = "";
  let horaoriginal = "";

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
    (lcase(tracker) === "zachtek1" || lcase(tracker) === "6locators") &&
    trim(timeslot) !== ""
  ) {
    tlmchar1 = right((10 + parseInt(timeslot)).toString(), 1);
  }

  let index = 0;
  // Process table data with filtering
  for (let i = 0; i <= ubound(tablax); i++) {
    if (lcase(tracker) !== "zachtek1") {
      if (tlmchar !== "") {
        if (mid(tablax[i], 16, 1) === tlmchar) {
          tablam[index] = tablax[i];
          index++;
        }
      } else {
        tablam[index] = tablax[i];
        index++;
      }
    } else {
      tablam[index] = tablax[i];
      index++;
    }
  }

  let pwr = 0;
  let dbm = 0;
  let alturasave = 0;
  let pwrm = "";

  // Process first row only (i = 0 to 0)
  for (let i = 0; i <= 0; i++) {
    try {
      pwrm = split(tablam[i], chr(9), 10, 1);
      pwr = isNaN(Number(pwrm[6])) ? 0 : Number(pwrm[6]);
      dbm = Math.round((10 * Math.log(pwr * 1000)) / Math.log(10) + 0.5);
      alturasave = xsnrFun(dbm);

      // Check for special cases
      let other = getParamSafe("other");
      if (ucase(other) === "VE3PRO" || ucase(tracker) === "OSHPARK") {
        alturasave = or1Fun(dbm);
      }

      let datosmod = tablam[i];
      let datos1 = datosmod.split("\t"); //split(datosmod, chr(9), 13, 1);
      tele1[i][0] = "1";

      for (let j = 1; j <= ubound(datos1); j++) {
        tele1[i][j] = datos1[j - 1];
      }
      horaoriginal = tele1[0][1];
    } catch (error) {
      // Error handling (equivalent to "on error resume next")
      console.error("Error processing row:", error);
      alert("Error processing telemetry rows");
      return {
        error: true,
      };
    }
  }

  const row = [];
  window.dista = [];
  for (let i = 0; i <= ubound(distakm); i++) {
    row.push(i * 250);
  }

  window.dista.push(row);

  const launchdate = window.getLaunchDate();
  let daysBack = -15;

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

  // Set frequency range based on tracker type
  let bajo, alto;
  if (ucase(tracker) === "qrplabs" || ucase(tracker) === "traquito") {
    bajo = window.fcentral - 25;
    alto = window.fcentral + 25;
  } else {
    bajo = window.fcentral - 105;
    alto = window.fcentral + 105;
  }

  let use6loc = lcase(tracker) === "zachtek1";
  let arranque = 0;
  let puntpointer = 0;
  let summhz = 0;
  let countmhz = 0;
  let haylista = false;
  let locatora = "";
  let locator = "";
  let locatorlast = "";
  let locatoro = "";
  let altura = 0;
  let savealtu = 0;
  let savealtur = 0;
  let lastaltura = "";
  let last = 0;
  let power = "";
  let hora0 = "";
  //let hora = "";
  let licencia = "";
  let licenciao = "";
  let vorlocsave = "";
  let spots = 0;
  let snr = "";
  let extra1 = "";
  let extra2 = "";
  let saveorionalt = "";
  let saveorionloc = "";
  let previousdate;
  let AltFinal = 0;

  for (let i = arranque; i <= ubound(tablam); i++) {
    let checki = false;
    // FIXME: Implement logic for checki check empty trim(tele1[i + 1][tgrid]) !== "" is needed
    if (
      (ucase(tracker) === "qrplabs" || ucase(tracker) === "traquito") &&
      trim(tele1[i + 1][tgrid]) !== "" &&
      tele1[i + 1][tgrid].length < 6
    ) {
      checki = true;
    }
    if (ucase(tracker) !== "qrplabs" || ucase(tracker) !== "traquito") {
      checki = true;
    }

    if (checki) {
      try {
        let xxx = replace(tablam[i], " ", "\t", 1, 100, 1); //replace(tablam[i], " ", chr(9), 1, 100, 1);
        let pwrm1 = xxx.split("\t");

        // Calculate power and dBm
        try {
          pwr = isNaN(Number(pwrm[6])) ? 0 : Number(pwrm[6]);
          dbm = Math.floor((10 * Math.log(pwr * 1000)) / Math.log(10) + 0.5);
        } catch (error) {
          console.error(error);
          alert("Error power and dBm claculation");
          return {
            error: true,
          };
        }

        // Process data
        let datosmod = tablam[i];
        //let datosmod = tablam[i]; // Check repeated data in the first index
        let datos1 = datosmod ? datosmod.split("\t") : []; //split(datosmod, chr(9), 12, 1);

        // Ensure tele1 array is properly sized
        if (!tele1[i + 1].length || tele1[i + 1].length < 14) {
          tele1[i + 1] = Array(14).fill("");
        }
        tele1[i + 1][0] = "1";

        if (use6loc) {
          // Process all data fields as-is
          for (let j = 1; j <= ubound(datos1); j++) {
            if (datos1[j - 1] !== undefined && tele1[i + 1] !== undefined) {
              tele1[i + 1][j] = datos1[j - 1];
            }
          }
        } else {
          // Process data fields with special handling for field 6
          for (let j = 1; j <= ubound(datos1); j++) {
            if (datos1[j - 1] !== undefined && tele1[i + 1] !== undefined) {
              if (j === 6) {
                // Truncate field 6 to 4 characters
                tele1[i + 1][j] = left(datos1[j - 1], 4);
              } else {
                tele1[i + 1][j] = datos1[j - 1];
              }
            }
          }
        }

        if (!tele1[i].length || !tele1[i][0].length) continue;

        // Update distance histogram
        if (!isNaN(Number(tele1[i][tkm])) && Number(tele1[i][tkm]) > 0) {
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
        //if (fechahora > desdeFecha && fechahora >= launchdate && tele1[i + 1]) {
        if (
          new Date(fechahora) > new Date(desdeFecha) &&
          new Date(fechahora) >= new Date(launchdate)
        ) {
          if (
            punt[puntpointer][7] === "" &&
            Number(tele1[i + 1][tmhz]) > 10000
          ) {
            punt[puntpointer][7] = Number(tele1[i + 1][tmhz]);
            summhz = summhz + Number(tele1[i][tmhz]);
            countmhz = countmhz + 1;
          }

          // Process SNR data
          let snrr = tele1[i][tsnr];
          tablahoras[i][3] = trim(snrr);

          // Process locator data
          locatora = tele1[i][tgrid];
          locator = tele1[i][trgrid];

          // Handle power conversion
          if (tele1[i][tpwr] == "0.01") {
            tele1[i][tpwr] = 0;
          }

          altura = Number(tele1[i][tpwr]);

          // Calculate altitude based on power
          if (altura !== 0) {
            altura = Math.floor(
              (10 * Math.log(altura * 1000)) / Math.log(10) + 0.5,
            );
          }

          // Clean altitude value
          //altura = replace(altura.toString(), "+", "", 1, 50, 1);
          //altura = replace(altura.toString(), "-", "", 1, 50, 1);
          altura = Math.abs(parseFloat(altura) * 300);

          // Special handling for LU1KCQ
          if (lcase(other) === "lu1kcq") {
            for (let c = 0; c <= 60; c++) {
              window.xsnr[c] = window.kcq[c];
            }
          }

          // Calculate altitude based on tracker type
          try {
            if (lcase(other) !== "zl1rs") {
              altura = Number(tele1[i + 1][tpwr]) * 300;
            } else {
              altura = 12000;
            }
          } catch (error) {
            // Error handling
            console.error("Altitude calculation error:", error);
            return {
              error: true,
              message: "Altitude calculation error",
            };
          }
          // Special handling for KM5XK
          if (lcase(other) === "km5xk") {
            altura = Math.floor(Number(tele1[i + 1][tpwr]) * 180);
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
                altura = or1Fun(Number(tele1[i][tpwr]));
                savealtu = altura;
              } else {
                altura = savealtu;
              }
            } catch (error) {
              console.error("VE3PRO/OSHPARK processing error:", error);
              return {
                error: true,
                message: "VE3PRO/OSHPARK processing error",
              };
            }
          }

          // Reset altitude for specific trackers
          if (lcase(tracker) === "zachtek1" || lcase(tracker) === "6locators") {
            altura = 0;
          }

          // Special processing for zachtek1, 6locators, and lightaprs
          if (
            lcase(tracker) === "zachtek1" ||
            lcase(tracker) === "6locators" ||
            lcase(tracker) === "lightaprs"
          ) {
            try {
              let minelapsed = dateDiff(
                "n",
                tele1[i + 1][thora],
                tele1[i][thora],
              );

              if (minelapsed === 2) {
                let nextPwr = Number(tele1[i + 1][tpwr]) || 0;
                let currentPwr = Number(tele1[i][tpwr]) || 0;
                tele1[i][taltura] = nextPwr * 300 + currentPwr * 20;
                savealtur = tele1[i][taltura];
                lastaltura = savealtur.toString();
              }

              // Update last altitude
              if (trim(tele1[i][taltura]) * 1 > 990 && lastaltura === "") {
                lastaltura = Number(tele1[i][taltura]);
              }

              if (
                (lcase(tracker) === "zachtek1" ||
                  lcase(tracker) === "6locators") &&
                savealtur > parseFloat(lastaltura) &&
                savealtur < 15000 &&
                i < 30
              ) {
                lastaltura = savealtur;
              }

              // Fill in missing altitude data
              if (i > 2 && tele1[i][taltura] < 10) {
                tele1[i][taltura] = tele1[i - 1][taltura];
                if (tele1[i - 2]) {
                  tele1[i][taltura] = tele1[i - 2][taltura];
                }
                if (tele1[i - 3]) {
                  tele1[i][taltura] = tele1[i - 3][taltura];
                }
              }
            } catch (error) {
              console.error("Special tracker processing error:", error);
              return {
                error: true,
                message: "Special tracker processing error",
              };
            }
          }

          // WB8ELK tracker handling
          try {
            if (tracker === "wb8elk") {
              tele1[i][taltura] = xsnrFun(Number(tele1[i][tpwr]));
            }
          } catch (error) {
            console.error("WB8ELK processing error:", error);
          }

          // Handle various tracker types
          if (
            lcase(tracker) === "qrplabs" ||
            lcase(tracker) === "traquito" ||
            lcase(tracker) === "zachtek" ||
            lcase(tracker) === "ab5ss"
          ) {
            tele1[i][taltura] = xsnrFun(Number(tele1[i][tpwr]));
          }

          // Special zachtek1 handling
          if (
            lcase(tracker) === "zachtek1" &&
            trim(timeslot) === "" &&
            Number(tele1[i][tpwr]) * 20 + Number(tele1[i + 1][tpwr]) * 300 <
              15000 &&
            Number(tele1[i][tpwr]) * 20 + Number(tele1[i + 1][tpwr]) * 300 >
              3000
          ) {
            let calculatedAltitude =
              Number(tele1[i][tpwr]) * 20 + Number(tele1[i + 1][tpwr]) * 300;
            // Commented out in original code
            // tele1[i][taltura] = calculatedAltitude;
            // lastaltura = tele1[i][taltura];
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
              console.error(error);
            }
          }

          // Add new license if not found and within date range
          if (
            !found &&
            //left(fechahora, 13) >= left(desdeFecha, 13) &&
            new Date(fechahora) >= new Date(launchdate)
          ) {
            try {
              licentab[last] = licencia;
            } catch (error) {
              console.error("License processing error:", error);
            }

            // Process locator
            let locatorm;
            if (locator.length < 5) {
              locatorm = locator + "LL";
            } else {
              locatorm = locator;
            }

            if (locatorm !== locatorlast) {
              window.flechas.push(locatorm);
              last = last + 1;
            }
            locatorlast = locatorm;
          }

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
            if (
              lcase(tracker) === "zachtek1" ||
              lcase(tracker) === "6locators"
            ) {
              if (
                trim(getParamSafe("timeslot")) !== "" &&
                mid(tele1[i][thora], 16, 1) === trim(getParamSafe("timeslot"))
              ) {
                let alturaf =
                  Number(tele1[i][tpwr]) * 20 +
                  Number(tele1[i + 1][tpwr]) * 300;
                AltFinal = alturaf;
              }
            }

            if (altura === undefined || altura === "" || altura == 3000) {
              altura = alturasave;
            }
            // Note: This would affect altura but the original code is commented out
            // if (AltFinal !== "") altura = AltFinal;

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
            mapainicio = [locatorTrim, displayText];
          }

          if (i > 0) {
            spots = spots + 1;
            // Handle altura calculation for specific trackers
            if (
              tracker &&
              (lcase(tracker) === "zachtek1" || ucase(tracker) === "6locators")
            ) {
              altura = Number(tele1[i + 1][tpwr]) * 300 + savealtur;
            }

            // Add to vorloc
            // Search for time, distance, locator and SNR of receiver
            // Search for taken locator
            snr = tele1[i][tsnr];
            snr = "SNR:" + snr;

            if (banda && lcase(banda) === "all") {
              const freq = Number(tele1[i][tmhz]);
              if (freq !== 14) {
                snr = snr + "<br>" + freq + " Hz";
              }
            }

            /* Commented in asp code
              if (snrnew === "") {
                  snrnew = snr.replace("SNR: ", "");
                  // if (parseFloat(snrnew) > -10) snrnew = snrnew + "!";
              }
            */

            let locatoma, locatortomado;

            if (
              !tracker ||
              ucase(tracker) !== "zachtek1" ||
              ucase(tracker) === "6locators"
            ) {
              locatoma = tele1[i][tgrid];
              locatortomado = right(locatoma, 4);
              locatoro = tele1[i][trgrid];
              if (locatoro.length === 4) {
                locatoro = locatoro + "LL";
              }
            } else {
              // Find first valid locator
              for (let z = i; z < ubound(tele1); z++) {
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

            // Posi=132
            let distance = Number(tele1[i][tkm]);
            // Posi=1
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
              // window.flechas = window.flechas + "\"" + locatortomado.trim() + "\",";
              // window.locations.push([
              //     locatortomado.trim(),
              //     "Capture of<br>" + licencia + "<br>" + hora + "z" + "<br>@ " + distance + " Km" + "<br>Locator: " + locatortomado + "??<br>" + snr
              // ]);
              locatortomado = "@ " + locatortomado + "<br>";
            } else {
              locatortomado = "";
            }

            if (!duplicated && new Date(horaoriginal) > new Date(desdeFecha)) {
              // Add new location entry to window.locations array
              window.locations.push([
                trim(locatoro),
                licencia +
                  "<br>" +
                  left(hora, 12) +
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
                lcase(left(tracker, 4)) === "orio" ||
                lcase(left(tracker, 4)) === "bss9"
              ) {
                if (mid(tele1[i][1], 16, 1) === "0") {
                  tele1[i][6] = tele1[i][6] + window.oloc[tele1[i][7]];
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
                  tele1[i][12] = window.oalt[tele1[i][7]];
                  saveorionalt = tele1[i][12];
                } else {
                  tele1[i][12] = saveorionalt;
                }

                if (
                  (orionaltid === "1" || orionaltid === "5") &&
                  mid(tele1[i][1], 16, 1) === "2"
                ) {
                  extra1 = "<td>" + window.ovolt[tele1[i][7]] + "</td>";
                }

                if (orionaltid === "3" && right(tele1[i][1], 1) === "2") {
                  extra2 =
                    "<td align=right>&nbsp;" +
                    window.otemp[tele1[i][7]] +
                    "&nbsp;</td>";
                }
              }

              output += "<tr style='line-height:11px;color:#000000;'>";

              for (let j = 1; j <= 12; j++) {
                let agre1 = "";
                let agre2 = "";

                if (Number(tele1[i][3]) > alto || Number(tele1[i][3]) < bajo) {
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
                output += `${extra1}${extra2}`;
              }

              output += "</tr>\n";

              if (
                lcase(left(tracker, 4)) === "orio" ||
                lcase(left(tracker, 4)) === "bss9"
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
            if (i < cuenta + 1 && tele1[i][1] !== tele1[i + 1][1]) {
              if (
                lcase(left(tracker, 4)) === "orio" ||
                lcase(left(tracker, 4)) === "bss9"
              ) {
                if (mid(tele1[i][1], 16, 1) === "0") {
                  tele1[i][6] = tele1[i][6] + window.oloc[tele1[i][7]];
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
                  tele1[i][12] = window.oalt[tele1[i][7]];
                  saveorionalt = tele1[i][12];
                } else {
                  tele1[i][12] = saveorionalt;
                }

                if (
                  (orionaltid === "1" || orionaltid === "5") &&
                  mid(tele1[i][1], 16, 1) === "2"
                ) {
                  extra1 = "<td>" + window.ovolt[tele1[i][7]] + "</td>";
                }

                if (orionaltid === "3" && mid(tele1[i][1], 16, 1) === "2") {
                  extra2 =
                    "<td align=right>&nbsp;" +
                    window.otemp[tele1[i][7]] +
                    "&nbsp;</td>";
                }
              }

              output += "<tr style='line-height:11px;color:#000000;'>";

              for (let j = 1; j <= 12; j++) {
                let agre1 = "";
                let agre2 = "";

                if (Number(tele1[i][3]) > alto || Number(tele1[i][3]) < bajo) {
                  if (j === 3) {
                    agre1 = "&nbsp;";
                    agre2 = "!";
                  } else {
                    agre1 = "";
                    agre2 = "";
                  }
                }

                output += `<td>${agre1}${tele1[i][j]}${agre2}</td>`;
              }

              if (i < cuenta + 1) {
                output += `<td align=right>${putsun(`${tele1[i][1]}`, `${tele1[i][6]}`)}</td>`;
              } else {
                output += "<td></td>";
              }

              if (extra1 !== "") {
                output += `${extra1}${extra2}`;
              }

              output += "</tr>\n";

              if (
                ucase(left(tracker, 4)) === "orio" ||
                ucase(left(tracker, 4)) === "bss9"
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
        }
      } catch (error) {
        console.error(error);
        alert("An error occurred processing data");
        return {
          error: true,
          message: "An error occurred processing data",
        };
      }
    } else {
      try {
        dbm = Math.floor((10 * Math.log(pwr * 1000)) / Math.log(10) + 0.5);
        tele1[i][12] = dbm * 300;
        const col = i === 0 ? 0 : i - 1;
        previousdate = !previousdate ? new Date(tele1[col][1]) : previousdate;
        if (getParamSafe("detail") !== "") {
          output +=
            "<tr title='Bad report ~ not plotted' style='line-height:11px;color:#b33c00;cursor:pointer;background-color:#e8e8e8;'>";
          for (let j = 1; j <= 12; j++) {
            output += `<td>${tele1[i][j]}</td>`;
          }
          if (i < cuenta + 1) {
            output += `<td align=right>${putsun(`${tele1[i][1]}`, ` ${tele1[i][6]}`)}</td>`;
          } else {
            output += "<td></td>";
          }
          output += "</tr>";
        } else {
          if (
            i < cuenta + 1 &&
            previousdate !== undefined &&
            new Date(tele1[i][1]) > previousdate
          ) {
            output +=
              "<tr title='Bad report ~ not plotted' style='line-height:11px;color:#b33c00;cursor:pointer;background-color:#e8e8e8;'>";
            for (let j = 1; j <= 12; j++) {
              output += `<td>${tele1[i][j]}</td>`;
            }
            if (i < cuenta + 1) {
              output += `<td align=right>${putsun(`${tele1[i][1]}`, ` ${tele1[i][6]}`)}</td>`;
            } else {
              output += "<td></td>";
            }
            output += "</tr>";
            previousdate = tele1[i][1];
          }
        }
      } catch (error) {
        console.error(error);
        alert("An error occurred processing data");
        return {
          error: true,
          message: "An error occurred processing data",
        };
      }
    }

    if (punt[puntpointer][6].length < 10 && punt[puntpointer][6].length < 190) {
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
      if (lcase(trim(tracker)) !== "zachtek1") {
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
  } // END FOR LOOP

  countmhz = countmhz !== 0 ? countmhz : 1;
  let avgfreq = Math.floor(summhz / countmhz);
  window.dista.push(distakm);

  if (haylista) {
    const cuentaa = spots < cuenta ? spots : cuenta;
    output = `${output} <th align=center colspan=15>
              <tr style='font-weight:bold;'>
              <td align=center> Seen: ${spots} Spots </td>
              <td align=center>Listing:</td><td align=center>Recent ${cuentaa}</td>
              <td colspan=13><hr></td></tr></th>`;
  } else {
    // TODO CHECK THIS
    let queryString = "?";
    let params = new URLSearchParams(window.parent.window.location.search);
    for (let [key, value] of params.entries()) {
      queryString += `${encodeURIComponent(key)}=${encodeURIComponent(value)}&`;
    }

    // Check domain name
    let dedonde = window.parent.window.location.hostname.toLowerCase();
    let irdonde = "org";
    for (let r = 0; r < dedonde.length - 2; r++) {
      if (dedonde.slice(r, r + 3) === "org") {
        irdonde = "com";
        break;
      }
    }

    let other = params.get("other") || "";
    let leyinicial;
    if (other === "") {
      leyinicial = `<img src='${imageSrcUrl["habhub"] || ""}'>&nbsp;This free application tracks WSPR Balloons&nbsp;<img src='${imageSrcUrl["aprs"]}'><br>Enter Balloon Callsign and click OK`;
    } else {
      leyinicial = `Not enough data found on WSPRNET for ${other.toUpperCase()}<br>Change Callsign or band and/or retry clicking 'OK'<br>Alternate site: <a href="${HOST_URL}/wsprx${queryString}" style='color:#FFCF00;'>${HOST_URL}/wsprx</a>`;
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

  return {
    error: false,
    last,
    punt,
    desdeFecha,
    locator,
    tablam,
    tele1,
    puntpointer,
    hora0,
    licenciao,
    power,
    avgfreq,
  };
}
