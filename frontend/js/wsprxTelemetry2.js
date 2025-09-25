async function processTelemetry2({
  getURLreporters1,
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
}) {
  let output = "";
  let puntos = Array(DATA_SIZE_TELE_2)
    .fill("")
    .map(() => Array(8).fill("")); // Contiene fecha, locator y telemetria del 2do paquete
  let punto = Array(DATA_SIZE_TELE_2)
    .fill("")
    .map(() => Array(8).fill("")); // Contiene fecha y locator 1er paquete

  const launchdate = window.getLaunchDate();

  let puntospointer = 0;
  let puntopointer = 0;
  last = last - 1;
  let banda = 14;
  let bandasearch = "14";

  const balloonid = getParamSafe("balloonid");

  for (let g = 0; g <= ubound(window.tbanda); g++) {
    if (ucase(getParamSafe("banda")) === ucase(window.tbanda[g][1])) {
      bandasearch = window.tbanda[g][0];
    }
  }

  let balid = left(balloonid, 1) + "_" + right(balloonid, 1) + "*";
  let timeLimit = "1209600"; // 1209600 604800
  let count = COUNT_SIZE_TELE_2;
  let cuenta = CUENTA_SIZE_TELE_2;

  if (getParamSafe("detail") !== "") {
    cuenta = COUNT_SIZE_2_TELE_2;
  }

  let cuentamax = cuenta * 1;
  let cuentalineas = 0;

  let tablahoras;
  let tablax;
  let tablan;
  let tele2;
  let fechahora = "";
  let fechahora2 = "";
  let buscohora = "";
  let checkit = true;
  let dbm;
  let decoqr = "";
  let decoqr1 = "";
  let decoqrf = "";
  let altura = 0;
  let char1 = "";
  let char2 = "";
  let hora = "";
  let TempFinal = "";
  let VoltFinal = "";
  let Altfinal = "";
  let Locfinal = "";
  let GPSfinal = "";

  if (balloonid !== "") {
    try {
      const pag1 = await getReportersTelemetry2(getURLreporters1, balloonid);

      tablax = split(pag1, chr(10), DATA_SIZE_TELE_2, 1);
      tablan = split(pag1, chr(10), DATA_SIZE_TELE_2, 1);
      tele2 = Array(DATA_SIZE_TELE_2 + 1)
        .fill("")
        .map(() => Array(14).fill(""));

      // TODO CHECK IF NEED REMOVE FIRST line
      //tablan.splice(0, 1);

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
                          <th style='width:8%;cursor:pointer;align:right' align=right title=' This column shows&#13solar elevation angle&#13;If at 12000m. add 3&deg;'>Sun&deg;&nbsp;</th>
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
                        <th style='width:8%;cursor:pointer;align:right' align=right title=' This column shows&#13solar elevation angle&#13;If at 12000m. add 3&deg;'>Sun&deg;&nbsp;</th>
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
        // } // END FOR LOOP

        Posi = 1;
        fechahora = tele2[i][thora];
        buscohora;

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

        checkit = true;
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

        if (
          new Date(fechahora) > new Date(desdeFecha) &&
          new Date(fechahora) >= new Date(launchdate) &&
          checkit
        ) {
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

          dbm = Math.floor(
            (10 * Math.log(Number(tele2[i][tpwr])) * 1000) / Math.log(10) + 0.5,
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
            if (balloonid !== "") {
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
                loc4.length === 4
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
                      tele2[i][tpwr],
                      tele2[i][treporter],
                      tele2[i][trgrid],
                      tele2[i][tkm],
                      tele2[i][taz],
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
                } else {
                  if (cuentalineas < cuentamax || i === 2) {
                    //    decowspr fechahora,telem2,loc4,tele2(i,tpwr),tele2(i,treporter),tele2(i,trgrid),tele2(i,tkm),tele2(i,taz)
                    //  Response.Write retorno & vbCrLf
                    retorno = decowspr(
                      fechahora,
                      telem2,
                      loc4,
                      tele2[i][tpwr],
                      tele2[i][treporter],
                      tele2[i][trgrid],
                      tele2[i][tkm],
                      tele2[i][taz],
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
                  TempFinal = window.wtemp;
                  VoltFinal = window.wbat;
                  Altfinal = window.walt;
                  Locfinal = window.newloc + window.K6_SAVE + window.N6_SAVE;
                  GPSfinal = window.wsats;
                }
              } // END loc 4
            } // END Balloon id !== ""

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
                punto[puntopointer][2] = window.wtemp;
                punto[puntopointer][3] =
                  Math.round((altura * 18.1132) / 10) * 10;
                for (let u = 0; u < 300; u++) {
                  if (tablahoras[u][0] == fechahora) {
                    punto[puntopointer][3] =
                      punto[puntopointer][3] + tablahoras[u][1] * 1;
                    break;
                  }
                }
                punto[puntopointer][4] = window.wbat;
                punto[puntopointer][5] = window.wspeed;
                punto[puntopointer][6] = licorigen;
                puntopointer = puntopointer + 1;
              }
            }
          } // END IF tablan[i].length > 10
          for (let z = 0; z <= ubound(punt); z++) {
            if (
              left(punt[z][0], 15) === buscohora.substring(0, 15) &&
              window.newloc.length > 2
            ) {
              punt[z][1] = window.newloc + window.K6_SAVE + window.N6_SAVE;
              punt[z][3] = window.walt;
              punt[z][2] = window.wtemp;
              punt[z][4] = window.wbat;
              punt[z][5] = window.wspeed;
              break;
            }
          }
        } // end if new Date(fechahora) > new Date(desdeFecha) && new Date(fechahora) >= new Date(launchdate) && checkit
      } // END FOR LOOP
      if (getParamSafe("balloonid") !== "" && ubound(tablan) > 0) {
        output = `${output} <tr>
                    <td colspan=5 align=left style='align:left;'>
                      <b>&nbsp;&nbsp;&nbsp;&nbsp;There were: ${ubound(tablan)} Spots for 2nd Telemetry.... Listing: Recent ${cuenta + 2} Spots</b>
                    </td>
                    <td colspan=8><hr></td>
                  </tr>`;
      }
      output = `${output} </table>`;
    } catch (error) {
      console.error(error);
      alert("Error process telemetry 2 data");
      // return {
      //   error: true,
      //   message: error.message,
      // };
    }
  } // END if (getParamSafe("balloonid") !== "")

  let llcount = 0;
  let totalcount = 0;
  for (let k = 1; k <= puntpointer; k++) {
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

  for (let k = 0; k <= puntospointer; k++) {
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

  for (let k = 0; k <= puntopointer + 1; k++) {
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
      // let usell;
      // if (llaverage < 1 || punto[k][1].slice(-2) !== "LL") {
      //   usell = false;
      // } else {
      //   usell = true;
      // }
      //let usell = !(llaverage < 1 !== !(punto[k][1].slice(-2) === "LL"));

      if (
        punto[k][1].length > 3 &&
        punto[k][0] !== lastpunto &&
        !estax &&
        usell
      ) {
        if (punto[k][1].length > 3 && lastpunto !== "") {
          const calcDist = crsdist(
            loctolatlon(punto[k][1]).lat,
            loctolatlon(punto[k][1]).lon,
            loctolatlon(lastpunto).lat,
            loctolatlon(lastpunto).lon,
          );
          distancia = isNaN(calcDist.distance) ? 0 : calcDist.distance * 1.852;

          if (lasttiempo !== "") {
            const currentTime = new Date(punto[k][0].replace(/z/gi, ""));
            const lastTime = new Date(lasttiempo.replace(/z/gi, ""));
            tiempo = dateDiff("s", currentTime, lastTime);
          }

          if (tiempo !== 0) {
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

  if (!window.beacon1.length) {
    if (punto[0][0] !== beacon1[0][0]) {
      beacon1.unshift([
        punto[0][0],
        left(punto[0][1], 6),
        punto[0][2],
        punto[0][3],
        punto[0][4],
        punto[0][5],
        punto[0][6],
        punto[0][7],
      ]);
    }
  } else {
    beacon1.unshift([
      punto[0][0],
      left(punto[0][1], 6),
      punto[0][2],
      punto[0][3],
      punto[0][4],
      punto[0][5],
      punto[0][6],
      punto[0][7],
    ]);
  }

  let altutext = "";
  let puntoDate = new Date(left(punto[0][0], 16));
  if (puntopointer > -1 && isDate(puntoDate)) {
    const TZDiff = new Date().getTimezoneOffset();
    let hlocal = cDate(left(punto[0][0], 16)) - TZDiff;
    let horalocal =
      "<br>Local: " +
      String(new Date(hlocal).getHours()).padStart(2, "0") +
      ":" +
      String(new Date(hlocal).getMinutes()).padStart(2, "0");

    hora = `${mes[puntoDate.getMonth() + 1]}-${puntoDate.getDate()} ${puntoDate.getHours()}:${puntoDate.getMinutes()}`;
    if (punto[0][3] == "130") {
      punto[0][3] = "11120";
    }
    if (punto[0][1].length === 6) {
      locatorx = left(punto[0][1], 4) + lcase(right(punto[0][1], 2));
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
      addss = `APRS: <a href='http://aprs.fi?call=${ucase(getParamSafe("other"))}-${getParamSafe("SSID")}&timerange=604800&tail=604800&mt=hybrid' title='See in APRS&#13If; uploaded' target=_blank>
        <u style='line-height:13px;color:green;'>${ucase(trim(getParamSafe("other")))}-${getParamSafe("SSID")}</u></a><br>`;
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
        "<span id='globo'></span>" +
        punto[0][6] +
        "<br><a href=# onclick='gowinds1()' style='color: #3333ff;line-height:13px;overflow:hidden;font-weight:bold;white-space:nowrap;cursor:pointer;'><u>Click for Winds</u></a>",
    ];

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
  //document.getElementById("addPlus").innerHTML = addplus;
  //document.getElementById("avgfreq").innerHTML = avgfreq;

  window.addplusElementValue = addplus;
  window.avgfreqElementValue = avgfreq;

  return {
    error: false,
    output,
  };
}
