var params = new URLSearchParams(window.location.search);

var callsign = params.get('callsign') ? params.get('callsign').toUpperCase() : '';
var balloonid = params.get('balloonid') || '';
var timeslot = params.get('timeslot') || '';
var otherRaw = params.get('other') || '';
var other = otherRaw.toUpperCase();
var report = params.get('reporters') === 'all' ? '' : 'uniquereporters=on';

let callsignFinal = callsign;
if (other.length > 2) {
    callsignFinal = other.replace(",", "");
}

var banda = params.get('banda') || 'All';
var SSID = params.get('SSID') || '';
var SSIDL = SSID !== '' ? `-${SSID}` : '';

var qrpid = params.get('qrpid') || '';
var qp = params.get('qp') || '';
var tracker = params.get('tracker') || '';
var fill = (qrpid || qp === "on" || tracker === "qrplabs" || tracker === "traquito") ? "" : "&nbsp;";

let licenciaaprs = '';
if (otherRaw !== '') {
    var splitOther = otherRaw.split("/");
    licenciaaprs = splitOther[0] || otherRaw;
} else {
    licenciaaprs = otherRaw;
}

var nuevahora = new Date(Date.now() + 600 * 1000);
var Prox = `Next:<br style='line-height:2px;'>${String(nuevahora.getUTCHours()).padStart(2, '0')}:${String(nuevahora.getUTCMinutes()).padStart(2, '0')}`;

let tablaheader = `
<tr style='background-color:#ffe6b3;'>
  <td colspan="15" style='font-family: monospace; font-size: 16px; 
  margin-right: auto; line-height:16px;white-space:nowrap;'>
  <center><b>
    <span id="linksonde" target="_blank" style='width:15px;height:15px;position:relative;'></span>${fill}
    <a href='https://aprs.fi/#!mt=satellite&call=${licenciaaprs}${SSID}&timerange=604800&tail=604800&z=09' target='aprs' title='aprs.fi track'>
      <img src='${imageSrcUrl['aprs']}' border=0 alt='aprs.fi track' style='vertical-align:-10%;'>
    </a>${fill}
    <a href='http://amsat.org.ar/wspr.ppt' target='_blank' title='Presentacion WSPR'>
      <img src='${imageSrcUrl['ppt']}' border=0 alt='Presentacion WSPR' style='vertical-align:-10%;'>
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
if (qrpid !== "" || qp === "on" || tracker === "qrplabs" || tracker === "traquito") {
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

tablaheader += `</span>`;   



let timeLimit = "1209600";
if (other.toUpperCase() === "LU1KCQ" || other.toUpperCase() === "G7PMO") {
  timeLimit = "604800";
}
// banda logic default override
var bandaDefault = "14";



window.addEventListener('load', () => {
    document.getElementById("tableMap").innerHTML = tablaheader;
})

/*

Haylista = false
spots = 0
flechas = "var flechas = ["
vorloc = "<script language=javascript type='text/javascript'>" & vbCrLf & "var locations = [" & vbCrLf 
if Request("callsign")="" then callsign="" else callsign=ucase(Request("callsign")) end if
if Request("balloonid")<>"" then balloonid=(Request("balloonid")) end if
if Request("other")="" then other="" else other=ucase(Request("other")) end if
report="uniquereporters=on"
if Request("reporters")="all" then report=""
if len(Request("other")) > 2 then callsign=replace(ucase(Request("other")),",","",1,10,1)
if Request("banda")="" then banda = "All" else banda = Request("banda") end if
tablaheader = "<tr style='background-color:#ffe6b3;'><td colspan=15 style='font-family: monospace; font-size: 16px; margin-right: auto; line-height:16px;white-space:nowrap;'><center><b>"
nuevahora = DateAdd("s",600,Now())
Prox="Next:<br style='line-height:2px;'>"&right("0"&hour(nuevahora),2) & ":" & right("0"&minute(nuevahora),2)
if SSID <> "" then SSIDL="-" & SSID else SSIDL="" end if
if Request("qrpid")<>"" or Request("qp")="on" or Request("tracker")="qrplabs" or Request("tracker")="traquito" then fill = "" else fill = "&nbsp;" end if
if Request("other")<>"" then licenciaaprsm = split(Request("other"),"/",3,1):licenciaaprs=licenciaaprsm(0) else licenciaaprs=Request("other") end if
tablaheader = tablaheader & "<span id=linksonde target=_blank style='width:15px;height:15px;position:relative;'></span>" & fill
tablaheader = tablaheader & "<a href='https://aprs.fi/#!mt=satellite&call="&licenciaaprs&SSIDL&"&timerange=604800&tail=604800&z=09' target='aprs' title='aprs.fi track'><img src='icon/aprs.png' border=0 alt='aprs.fi track' style='vertical-align:-10%;'></a>" & fill
tablaheader = tablaheader & "<a href='http://amsat.org.ar/wspr.ppt' target=_blank' title='Presentacion WSPR'><img src='ppt.gif' border=0 alt='Presentacion WSPR' style='vertical-align:-10%;'></a>&nbsp;" & fill
tablaheader = tablaheader & "<a href='http://wsprnet.org' target=_blank><u>WSPRNET</u></a>&nbsp;Band:<select name='banda' id='banda' onchange=""document.formu.reporters.value='';document.formu.callsign.value='"&request("callsign")&"';this.form.submit();"" style='font-weight:bold;font-size:12px;line.height:12px;height:20px;vertical-align:0%;'><option value='2m'>2m</option><option value='6'>6m</option><option value='10m'>10m</option><option value='12m'>12m</option><option value='15m'>15m</option><option value='17m'>17m</option><option value='20m'>20m</option><option value='30m'>30m</option><option value='40m'>40m</option><option value='80m'>80m</option><option value='160'>160m</option><option value='All' SELECTED>ALL</option></select>&nbsp;"
tablaheader = tablaheader & "<span onclick='setlaunch()' id=launched name=launched title=' Click here to Change or&#13Enter Launch Date/Time' style='font-size:14px;line-height:14px;font-family:Arial Narrow;cursor:pointer;border:thin solid #555555;border-radius: 10px;'>&nbsp;&nbspLaunch Date/Time (z)&nbsp;&nbsp;</span>&nbsp;"
tablaheader = tablaheader & "<span onclick='settracker()' id=settracker name=settracker title=' Click here to Set or Change Tracker "&Request("tracker")&"' style='font-size:14px;line-height:14px;font-family:Arial Narrow;cursor:pointer;border:thin solid #555555;border-radius: 10px;'>&nbsp;T&nbsp;</span>&nbsp;"
tablaheader = tablaheader & "<span style='font-family:Arial Narrow;font-size:17px;line-height:17px;'>Balloon Call:</span><input type=text name=other value='"&trim(ucase(Request("other")))&"' onclick='borrarother()' id=other size=8 maxlength=9 style='text-transform:uppercase;font-weight:bold;font-family: monospace;font-size:14px;line-height:14px;text-align:center;height:20px;vertical-align:18%;'><span style='vertical-align:18%;'>-</span><input type=text name=SSID value='"&trim(Request("SSID"))&"' title=' Enter or Change SSID&#13For aprs.fi from 00-99' onclick='setssid()' id=SSID size=3 maxlength=3 style='font-weight:bold;font-family: monospace;font-size:14px;line-height:14px;text-align:center;height:20px;vertical-align:18%;cursor:pointer;'>" & vbCrLf
tablaheader = tablaheader & "<b>"&"<span id=qrpchn name=qrpchn onclick=""getqrp()"" title=' U4B & &#13Traquito&#13Channel&#13---------&#13 Click to&#13 Change' style='position:relative;top:0px;font-size:14px;font-family:Arial Narrow;text-decoration:underline;background-color:#ffffff;' class=button>"&Request("qrpid")& "?</span>&nbsp;Id:</b><input type=text maxlength=2 value='"&Request("balloonid")&"' size=1 name='balloonid' id='balloonid' title='First (0,1,Q) and third (0-9)&#13character of 2nd TLM packet' style='text-align:center;font-weight:bold;width:24px;text-transform:uppercase;height:20px;vertical-align:18%;'>" & vbCrLf
tablaheader = tablaheader & "<b>Time-Slot:</b><input type=text maxlength=1 size=1 name='timeslot' id='timeslot' value='"&replace(request("timeslot"),",","",1,10)&"' title='TLM minute Slot&#13 For  2nd  Packet&#13 Enter: 0 2 4 6 or 8&#13 or Blank for ALL' style='text-align:center;font-weight:bold;height:19px;width:19px;height:20px;vertical-align:18%;'>&nbsp;+Detail<input type='checkbox' name='detail' id='detail' onchange='setid()'>" & vbCrLf
if Request("qrpid")<>"" or Request("qp")="on" or Request("tracker")="qrplabs" or request("tracker") = "traquito" then tablaheader = tablaheader & "<span onclick='showtelen()' title='Display Comment and TELEN #1 Coding' style='font-family:Arial Narrow;'><u>Telen</u></span><input onclick='setid()' type='checkbox' checked name='qp' id='qp' title='Mark to see qrplabs&#13 Additional TLMs&#13 ("&ucase(Request("tracker"))&" Decoding Test)' style='cursor:pointer;'>" & vbCrLf:extra="<th></th>"
if left(Request("tracker"),4)="orio" or left(Request("tracker"),4)="bss9" then extra = "<td colspan=2>Volt&nbsp;&nbsp;&deg;C&nbsp;</td>" & vbCrLf
tablaheader = tablaheader & "<input type=button onclick='setid()' name=enviar id=enviar value='OK' style='font-weight:bold;'><span id='recarga' style=""font-size:12px;font-weight:bold;"">"
if lcase(Request("other"))="nu7b" and Request("SSID")="23" then tablaheader = tablaheader & "&nbsp;<a href='http://lu7aa.org/dx.asp?por=H&tz=0&be=&multiplecalls=Select&scale=Lin&bs=B&call=x1*&band=14&timelimit=1209600&sel=0&t=m' target='_blank' style='border-color:cyan;height:27px;border-style:outset;color:navy;line-height:19px;font-size:13px;text-decoration:none;background-color:gold;font-weight:bold;' title='The prefix for telem will be X1 followed by the letters BAA to JJJ.&#13The letters A-J correspond to the digits 0-9, To compute the count,&#13subtract 100 from the digits corresponding to the three letter code.'>&nbsp;<span style='font-size:14px;'>&beta;/&gamma;</span> Rad&nbsp;</a>"
tablaheader = tablaheader & "</span></center></td></tr>" & vbCrLf

tablaheader="<table width=100% border=0 cellpadding=0 cellspacing=0 style='font-family: monospace; font-size: 14px; font-weight:bold; line-height: 17px; margin-right: auto; white-space:nowrap;text-align:center;'>"&tablaheader&"<tr style='background-color:#cccccc;font-size:16px;'><th style='width:16%;'>Timestamp (z)</th><th style='width:7%;'>Call</th><th style='width:8%;' title='! = out of Channel boundary&#13 due Spotter rcvr freq. offset&#13 and/or invalid channel set'>MHz</th><th style='width:4%;'>SNR</th><th style='width:4%;cursor:pointer;' title='Measured Freq drift of&#13Balloon in Hz/minute'>Drift</th><th style='width:7%;'>Grid</th><th style='width:5%;'>Pwr</th><th style='width:10%;'>Reporter</th><th style='width:10%;'>RGrid</th><th style='width:10%;'>Km.</th><th style='width:6%;'>Az&deg;</th><th style='width:7%;cursor:pointer' title='Shows Pwr x 300&#13Check 2nd TLM&#13In case Id: is set'>Heig.m</th><th style='width:8%;cursor:pointer;align:right;' align=right title=' This column shows&#13solar elevation angle&#13 If at 12000m. add 3&deg;'>Sun&deg;&nbsp;</th>"&extra&"</tr>" & vbCrLf
timeLimit = "1209600" '1209600 604800
if ucase(Request("other"))="LU1KCQ" or ucase(Request("other"))="G7PMO" then timeLimit = "604800"
'if ucase(Request("other"))="W5KUB" then timeLimit = "604800"
banda="14"
bandasearch="All"
for g=0 to ubound(tbanda)
    if ucase(Request("banda"))=ucase(tbanda(g,1)) then 
        bandasearch = tbanda(g,0)
    end if
next
cuenta = 700
count = 5000
timeLimit = "604800"
if Request("detail") <> "" then cuenta = 800
if bandasearch <>"All" then bandasearch = " band = "& bandasearch & " and " else bandasearch = ""
if callsign="" then callsignm="XYZ123" else callsignm=ucase(Request("other")) end if
finicio = DateAdd("d", -7, Date()):fim = split(finicio,"/",3,1):filive=fim(2)&"-"&right("00" & fim(0),2) & "-" & right("00"&fim(1),2) 'fecha inicio busqueda en live desde 30 dias antes de hoy
if launchdate<>"" then filive = left(trim(launchdate),19)
filive2 = flive
on error resume next
finicio2d = DateAdd("d", -3, cdate(left(trim(launchdate),19)))
filive2 = year(finicio2d) & "-" & right("00" & month(finicio2d),2) & "-" & right("00" & day(finicio2d),2)& " 00:00:00"
on error goto 0
filast=year(Now()+2) & "-" & right("00" & month(Now()+2),2) & "-" & right("00" & day(Now()+2),2)
if Request("limit")<>"" then filast=left(Request("limit"),4)&"-"&mid(Request("limit"),5,2)&"-"&mid(Request("limit"),7,2)':Response.write filast:Response.End
frecsearch = ""
if Request("tracker")="qrplabs" or Request("tracker") = "traquito" then
'    if Session("avgfreq")<>"" and isnumeric(Session("avgfreq")) then 
    if Request("wide")<>"on" then
        frecsearch = " and frequency > " & fcentral-25 & " and frequency < " & fcentral + 25 & " "
    else
        frecsearch = " and frequency > " & int(fcentral / 1000) * 1000 & " and frequency < " & int(fcentral / 1000) * 1000 + 200 & " "
    end if
    if Request("wide")<>"" then frecsearch = " and frequency > " & int(fcentral / 1000) * 1000 - 25 & " and frequency < " & int(fcentral / 1000) * 1000 + 225 & " "
end if
'    Response.write fcentral & ", " & frecsearch
if Request("detail")= "on" then
    getURLreporters="http://db1.wspr.live/?query=select time,tx_sign,frequency,snr,drift,tx_loc,power,rx_sign,rx_loc,distance,azimuth,code from rx where " & bandasearch & " time >= '"&filive&"' and time <= '" & filast &" 23:59:59' and ( ( tx_sign = '"&callsignm&"' ) ) order by time desc LIMIT 3000"
else
    getURLreporters="http://db1.wspr.live/?query=select time,any(tx_sign),cast(avg(frequency) AS DECIMAL(8,0)),max(snr),any(drift),any(tx_loc),any(power),any(rx_sign),max(rx_loc),max(distance),max(azimuth),any(code) from rx where " & bandasearch & " time >= '"&filive&"' and time <= '" & filast &" 23:59:59' and ( ( tx_sign = '"&callsignm&"' ) ) group by time order by time desc LIMIT 3000"
end if
if Request("other")<> "" then pag=getURL(getURLreporters)
if len(pag)<10 and Request("other") <> "" then Response.Write "<center><br><a href='http://lu7aa.org/wsprx.asp' title='Go Back' target='self' style='background-color:lightblue;'><b><i><u>&nbsp;There are no WSPR reports for " & ucase(Request("other"))&"&nbsp;starting on " & launchdate & "z&nbsp;<u></i></b></a><br><br>"
if (len(pag)<20 or pag="") and Request("other")<> "" then pag=getURL(getURLreporters):if (len(pag)<20 or pag="") and Request("other")<> "" then pag=getURL(getURLreporters)
if balloonid<>"" then
balid=left(balloonid,1) & "_" & right(balloonid,1) & "*"
if Request("balloonid")<>"" and detail="on" then  
    getURLreporters1="http://db1.wspr.live/?query=select time,tx_sign,frequency,snr,drift,tx_loc,power,rx_sign,rx_loc,distance,azimuth,code from rx where" & bandasearch & " time > '"&filive2&"' and time <= '" & filast & " 23:59:59' and ( ( SUBSTRING(tx_sign, 1, 1)  = '"&ucase(left(balloonid,1))&"' and SUBSTRING(tx_sign, 3, 1) = '"&right(balloonid,1)&"'  ) ) " & frecsearch & " order by time desc LIMIT 5000"
else
    getURLreporters1="http://db1.wspr.live/?query=select time,any(tx_sign),cast(avg(frequency) AS DECIMAL(8,0)),max(snr),min(drift),any(tx_loc),min(power),any(rx_sign),max(rx_loc),max(distance),max(azimuth),any(code) from rx where" & bandasearch & " time > '"&filive2&"' and time <= '" & filast & " 23:59:59' and ( ( SUBSTRING(tx_sign, 1, 1)  = '"&ucase(left(balloonid,1))&"' and SUBSTRING(tx_sign, 3, 1) = '"&right(balloonid,1)&"'  ) ) " & frecsearch & " group by time order by time desc LIMIT 5000"
end if
'Response.write getURLreporters1
    if balloonid<>"" then pag1=getURL1(getURLreporters1)
    if (len(pag1)<20 or pag1="") and balloonid<>"" then pag1=getURL(getURLreporters1):if (len(pag1)<20 or pag1="") and balloonid<>"" then pag1=getURL(getURLreporters1)
end if
Posicion = 1
Response.Write "<center><table width=80% border=0 style='line-height:11px;white-space:nowrap;text-align:center;'>"
if len(pag) < 20 then Response.Write tablaheader & "</table>":Response.End
ttipo=0:thora=1:tcall=2:tmhz=3:tsnr=4:tdrift=5:tgrid=6:tpwr=7:treporter=8:trgrid=9:tkm=10:taz=11:taltura=12
'tablam = split(tabla,"<tr>",10000,1)
tablax = split(pag,chr(10),5000,1)
i=0
dim tablam(5000)
if ubound(tablax)>0 then tablam(0)=tablax(1)
if trim(Request("timeslot")) <> "" then tlmchar = right(8+Request("timeslot")*1,1) else tlmchar = "" end if
if (Request("tracker")="zachtek1" or Request("tracker")="6locators") and trim(Request("timeslot")) <> "" then tlmchar1 = right(10+Request("timeslot")*1,1) else tlmchar1 = tlmchar end if
for j=0 to ubound(tablax)
    if Request("tracker")<>"zachtek1" then
        if tlmchar<>"" then
             if mid(tablax(j),16,1) = tlmchar then
                tablam(i)=tablax(j)
                i = i + 1
            end if
        else
            tablam(i)=tablax(j)
            i = i + 1  
        end if
    else
        tablam(i)=tablax(j)
        i = i + 1 
    end if
next
dim tele1(5002,13)
for i = 0 to 0
    on error resume next
    pwrm = split(tablam(i),chr(09),10,1)
    pwr = pwrm(6)
    dbm = int(10*log(pwr*1000) / log(10)+.5)
    alturasave = xsnr(dbm)
    on error goto 0
    if ucase(Request("other"))="VE3PRO" or ucase(Request("tracker")) = "OSHPARK" then alturasave = or1(dbm)
    datosmod=tablam(i)
    datos1 = split(datosmod,chr(09),13,1)
    tele1(i,0)="1"
    for j=1 to ubound(datos1)
        tele1(i,j)=datos1(j-1)
    next
next
'redim preserve tele1(ubound(tablam),13)
response.Write "</table></center>"
'Response.Flush
dim punt(5002,7) 
puntpointer = 0
dim licentab(450)
dim distakm(84):for i=0 to ubound(distakm):distakm(i)=0:next:distavar="var dista = [["
for i=0 to ubound(distakm):distavar=distavar & i*250 & ",":next:distavar=left(distavar,len(distavar)-1)&"],"
last=0
Posicion=1
dim tablahoras(5002,4)
' Obtener fecha actual menos 15 dias en DesdeFecha
Desdefecham = split(DateAdd("d", -15, Date()),"/",3,1)
if lcase(Request("other"))="zl1rs" then Desdefecham = split(DateAdd("d", -13, Date()),"/",3,1)    
DesdeFecha = Desdefecham(2) & "-" & right("00"&Desdefecham(0),2) & "-" & right("00"&Desdefecham(1),2)
if launchdate <> "" then  DesdeFecha = launchdate
Response.Write tablaheader & vbCrLf
lastaltura=""
arranque = 0
use6loc=true:if Request("tracker")<>"zachtek1" then use6loc = false end if
if Request("tracker")="qrplabs" or Request("tracker")="traquito" then bajo=fcentral-25:alto=fcentral+25 else bajo=fcentral-105:alto=fcentral+105:end if
for i=arranque to ubound(tablam)
    checki = false: if (Request("tracker")="qrplabs" or Request("tracker") = "traquito") and len(tele1(i+1,tgrid)) < 6 then checki = true
    if (Request("tracker")<>"qrplabs" or Request("tracker") <> "traquito") then checki = true
    if checki then  ' Tenia if checki then
'        on error resume next
        xxx=replace(tablam(i)," ",chr(09),1,100,1)
        pwrm1 = split(xxx,chr(09),100,1)
        on error resume next 
        pwr = pwrm(6)
        dbm = int(10*log(pwr*1000) / log(10)+.5)
        on error goto 0
        datosmod=tablam(i)
        datos1 = split(datosmod,chr(09),12,1)
        tele1(i+1,0)="1"
        if use6loc then
            for j=1 to ubound(datos1)
                tele1(i+1,j)=datos1(j-1)
            next
        else
            for j=1 to ubound(datos1)
                if j=6 then 
                    tele1(i+1,j)=left(datos1(j-1),4) 
                else
                    tele1(i+1,j)=datos1(j-1)
                end if
            next
        end if
        on error resume next
        if tele1(i,tkm)>0 then distakm(int(tele1(i,tkm)/250))=distakm(int(tele1(i,tkm)/250))+1
        on error goto 0            
        if i=arranque then 
            Haylista = true
        end if  
        fechahora = tele1(i,thora)
'        fechahora = left(fechahora,15)&right(fechahora,1)+2
'        Response.write fechahora & " = " & DesdeFecha & "<br>"
        if fechahora > DesdeFecha and fechahora >= launchdate then
        if punt(puntpointer,7) = "" and tele1(i+1,TMHZ) > 10000 then
            punt(puntpointer,7)=tele1(i+1,TMHZ)
            summhz=summhz+tele1(i,TMHZ)
            countmhz=countmhz+1
        end if
            snrr=tele1(i,tsnr)
            tablahoras(i,3)=trim(snrr)        
            locatora=tele1(i,tgrid)
            locator=tele1(i,trgrid)
            if tele1(i,tpwr)="0.01" then tele1(i,tpwr)=0
            altura=tele1(i,tpwr)*1
            if altura<>0 then altura = int(10*log(altura*1000) / log(10)+.5)
            altura=replace(altura,"+","",1,50,1):altura=replace(altura,"-","",1,50,1)
            altura=altura*300
            if lcase(Request("other")) = "lu1kcq" then for c=0 to 60 : xsnr(c)= kcq(c): next
            on error resume next
            if lcase(Request("other")) <> "zl1rs" then altura=xsnr(tele1(i+1,tpwr)) else altura = 12000 end if
            on error goto 0
            if lcase(Request("other")) = "km5xk" then altura = int(tele1(i+1,tpwr) * 180)
            if lcase(Request("other")) = "ve3pro" or ucase(Request("tracker")) = "OSHPARK" then
                on error resume next
                if right(tele1(i,thora),2)="02" or right(tele1(i,thora),2)="22" or right(tele1(i,thora),2)="42" then 
                    altura = or1(tele1(i,tpwr))
                    savealtu = altura
                else
                    altura = savealtu
                end if
                on error goto 0
            end if
            if lcase(Request("tracker"))="zachtek1"  or Request("tracker")="6locators" then altura = 0
            if lcase(Request("tracker"))="zachtek1"  or Request("tracker")="6locators" or Request("tracker")="lightaprs"  then
                minelapsed = DateDiff("n",cDate(tele1(i+1,thora)),cDate(tele1(i,thora)))*1
                if minelapsed = 2 then
                        tele1(i,taltura)=tele1(i+1,tpwr)*300 + tele1(i,tpwr)*20
                        savealtur = tele1(i,taltura):lastaltura=savealtur
                end if
                on error resume next
                if trim(tele1(i,taltura))*1 > 990 and lastaltura = "" then lastaltura = tele1(i,taltura)*1
                if (lcase(Request("tracker"))="zachtek1"  or Request("tracker")="6locators") and savealtur > lastaltura and savealtur < 15000 and i < 30 then lastaltura = savealtur 
                on error goto 0
                on error resume next
                if tele1(i,taltura)<10 then tele1(i,taltura) = tele1(i-1,taltura)
                if tele1(i,taltura)<10 then tele1(i,taltura) = tele1(i-2,taltura)
                if tele1(i,taltura)<10 then tele1(i,taltura) = tele1(i-3,taltura)
                on error goto 0
            end if
            on error resume next
            if Request("tracker") = "wb8elk" then tele1(i,taltura) = xsnr(tele1(i,tpwr))
            on error goto 0
            if lcase(Request("tracker")) = "qrplabs" or lcase(Request("tracker"))="traquito" or lcase(Request("tracker")) = "zachtek" or lcase(Request("tracker")) = "ab5ss" then tele1(i,taltura)=xsnr(tele1(i,tpwr))
            if lcase(Request("tracker")) = "zachtek1" and trim(Request("timeslot"))="" and tele1(i,twpr)*20 + tele1(i+1,tpwr)*300 < 15000 and tele1(i,twpr)*20 + tele1(i+1,tpwr)*300 > 3000 then 
'                tele1(i,taltura)=tele1(i,twpr)*20 + tele1(i+1,tpwr)*300
'                lastaltura = tele1(i,taltura)
            end if
            tablahoras(i,0)=fechahora:tablahoras(i,1)=altura
            ' Buscar licencias que han tomado
            licencia = tele1(i,treporter)
            tablahoras(i,4)=licencia
            found=false
            for h=0 to ubound(licentab)
                on error resume next
                    if licentab(h)=licencia then 
                        found=true
                        exit for
                    end if
                on error goto 0
            next
            if not found and left(fechahora,13) >= left(DesdeFecha,13) and fechahora >= launchdate then 
                on error resume next
                licentab(last)=licencia
                on error goto 0
                if len(locator)<5 then locatorm = locator&"LL" else locatorm=locator end if
                if locatorm <> locatorlast then
                    flechas=flechas & chr(34) & locatorm & chr(34) & ","
                    last=last+1
                end if
                locatorlast = locatorm
            end if
            tablahoras(i,2)=licencia
            if i=0 then
            ' Buscar hora, distancia y locator del destino
                licenciao = tele1(i,tcall)
                power = tele1(i,tpwr) + "&nbsp;W"
                locatoro = tele1(i,tgrid):locatoro=ucase(locatoro)
                if len(locatoro)=4 then locatoro = locatoro & "LL"
                distance = tele1(i,tkm)
                hora = tele1(i,thora):'Response.write hora & " " & mes(mid(hora,6,2)) & "-" &  mid(hora,9,8) & "z"
                hora =  mes(mid(hora,6,2)) & "-" &  mid(hora,9,8)
                hora0 = tele1(i,thora) & "z"
                power="20 mW"
                if lcase(Request("tracker"))="zachtek1" or Request("tracker")="6locators" then
                    if trim(request("timeslot"))<>"" and mid(tele1(i,thora),16,1) = trim(Request("timeslot")) then 
                            alturaf= tele1(i,tpwr)*20 +  tele1(i+1,tpwr)*300
                            AltFinal = alturaf
                    end if 
                end if
                if altura = "" or altura=3000 then altura = alturasave 
                '
                if AltFinal <> "" then altura = AltFinal end if
                vorlocsave = "["& chr(34) & left(trim(locatoro),6) & chr(34) & ","& chr(34) & licenciao & "<br>" & hora & "z" & "<br>" & power & "<br>" & locatoro  & "<br>"  & altura & "&nbsp;m." &  """]," & vbCrLf
                vorloc = vorloc & "["& chr(34) & left(trim(locatoro),6) & chr(34) & ","& chr(34) & licenciao & "<br>" & hora & "z" & "<br>" & power & "<br>" & locatoro  & "<br>"  & altura & "&nbsp;m." &  """]," & vbCrLf        
                mapainicio = "ponermapa ('"&left(locatoro,6)&"','"& licenciao &  "<br>" & hora & "z" &  "<br>" & power & "<br>" & locatoro & "<br>"  & altura & "&nbsp;m." & "')" & vbCrLf
            end if
            if i>0 then
                spots = spots + 1
                if lcase(Request("tracker"))="zachtek1"  or Request("tracker")="6locators" then altura = tele1(i+1,tpwr)*300 + savealtur 'tele1(i+1,tpwr)*300 + savealtur
            ' Agregar al vorloc
            ' Buscar hora, distancia, locator y SNR del que recibe
                'Buscar locator tomado
                snr = tele1(i,tsnr) 
                snr = "SNR:" & snr
                if lcase(Request("Banda"))="all" then
                    freq = tele1(i,tmhz) 
                    if int(freq)<> 14  then snr = snr & "<br>" & int(freq) & " Hz"
                end if
                if snrnew = "" then 
                    snrnew = replace(SNR,"SNR: ","",1,10,1)
'                    if snrnew*1 > -10 then snrnew = snrnew + "!" 
                end if
                if lcase(Request("tracker"))<>"zachtek1" or Request("tracker")="6locators" then
                    locatoma = tele1(i,tgrid)
                    locatortomado = right(locatoma,4)
                    locatoro = tele1(i,trgrid)
                    if len(locatoro)=4 then locatoro = locatoro & "LL"
                else
                    for z = i to ubound(tele1)
                        if len(tele1(z,tgrid)) > 3 then
                            locatoma = tele1(z,tgrid)
                            exit for
                        end if
                    next
                    locatortomado = locatoma
                    locatoro = tele1(i,trgrid)
                    if len(locatoro)=4 then locatoro = locatoro & "LL"
                    tele1(i,tgrid) = locatoma
                end if
                Posi=132
                distance = tele1(i,tkm)
                Posi=1
                hora = tele1(i,thora)
                horaoriginal = hora
                diahora = mid(hora,4,8)
                'hora = mid(hora,4,14)
                hora = mes(mid(hora,6,2)) & "-" & right(hora,11)
                duplicated = false
                for f=1 to len(vorloc)-10
                    if mid(vorloc,f,len(licencia)) = licencia then 
                        duplicated = true
                        exit for
                    end if
                next
                swloc = true
                if len(vorloc)<200 then
                ' Descomentar las 2 lineas siguiente si no hubo 2da telemetria para ver pointer amarillo
'                    flechas=flechas & chr(34) & trim(locatortomado) & chr(34) & ","
'                    vorloc = vorloc & "["& chr(34) & trim(locatortomado) & chr(34) & ","& chr(34) & "Capture of<br>" & licencia & "<br>" & hora & "z" & "<br>@ " & distance & " Km" & "<br>Locator: " & locatortomado & "??<br>" & snr &  """]," & vbCrLf             
                    locatortomado = "@ " & locatortomado & "<br>" 
                else 
                    locatortomado = ""
                end if
                if (duplicated = false and left(horaoriginal,13) > DesdeFecha) then vorloc = vorloc & "["& chr(34) & trim(locatoro) & chr(34) & ","& chr(34) & licencia & "<br>" & left(hora,12) & "z" & "<br>" & distance & " Km" & "<br>" & locatortomado & snr &  """]," & vbCrLf
            end if
            ' Fin de agregar al vorloc
            if Request("detail") <> "" then
                if i < cuenta and i > 0 then
                   if left(request("tracker"),4)="orio" or left(request("tracker"),4)="bss9" then
                        if mid(tele1(i,1),16,1)="0" then 
                            tele1(i,6)=tele1(i,6)&oloc(tele1(i,7)):saveorionloc=tele1(i,6)
                            locatora = tele1(i,6)
                        else
                            tele1(i,6)=saveorionloc
                        end if
                        orionaltid=mid(tele1(i,1),15,1)
                        if (orionaltid="0" or orionaltid="4" or orionaltid=8) and mid(tele1(i,1),16,1)="2" then
                            tele1(i,12)=oalt(tele1(i,7)):saveorionalt=tele1(i,12)
                        else
                            tele1(i,12)=saveorionalt                            
                        end if
                        if (orionaltid="1" or orionaltid="5") and mid(tele1(i,1),16,1)="2" then
                            extra1 = "<td>"&ovolt(tele1(i,7)) & "</td>"
                        end if
                        if orionaltid="3" and right(tele1(i,1),1)="2" then
                            extra2 = "<td align=right>&nbsp;"&otemp(tele1(i,7)) & "&nbsp;</td>"
                        end if
                    end if
                    Response.Write "<tr style='line-height:11px;color:#000000;'>"
                    for j=1 to 12
                    if tele1(i,3)*1 > alto or tele1(i,3)*1 < bajo then
                       if j = 3 then agre1="&nbsp;":agre2="!" else agre1="":agre2="" end if
                    end if
                        Response.Write "<td>" & agre1 & tele1(i,j) & agre2 & "</td>"  
                    next
                    if i<cuenta+1 then  
                        Response.Write "<td align=right>" & "<script>ponersun('"&tele1(i,1)&"','"&tele1(i,6)&"')</script>" & "</td>"
                    else
                        Response.Write "<td></td>"
                    end if
                    if extra1<>"" then Response.Write extra1 & extra2
                     Response.Write "</tr>" & vbCrLf 
                   if left(request("tracker"),4)="orio" or left(request("tracker"),4)="bss9" then
                        if DateDiff("h",cDate(tele1(i+1,1)),cDate(tele1(i,1))) > 6 then Response.Write "<tr><td colspan=15><hr></td></tr>" & vbCrLf
                    else
                        if DateDiff("h",cDate(tele1(i+1,1)),cDate(tele1(i,1))) > 6 then Response.Write "<tr><td colspan=13><hr></td></tr>" & vbCrLf
                    end if 
                end if
'                if int(i/10)*10=i then Response.Flush
            else
                if i < cuenta+1 and tele1(i,1) <> tele1(i+1,1) then
                   if left(request("tracker"),4)="orio" or left(request("tracker"),4)="bss9" then
                        if mid(tele1(i,1),16,1)="0" then 
                            tele1(i,6)=tele1(i,6)&oloc(tele1(i,7)):saveorionloc=tele1(i,6)
                            locatora = tele1(i,6)
                        else
                            tele1(i,6)=saveorionloc
                        end if
                        orionaltid=mid(tele1(i,1),15,1)
                        if (orionaltid="0" or orionaltid="4" or orionaltid=8) and mid(tele1(i,1),16,1)="2" then
                            tele1(i,12)=oalt(tele1(i,7)):saveorionalt=tele1(i,12)
                        else
                            tele1(i,12)=saveorionalt                            
                        end if
                        if (orionaltid="1" or orionaltid="5") and mid(tele1(i,1),16,1)="2" then
                            extra1 = "<td>"&ovolt(tele1(i,7)) & "</td>"
                        end if
                        if orionaltid="3" and mid(tele1(i,1),16,1)="2" then
                            extra2 = "<td align=right>&nbsp;"&otemp(tele1(i,7)) & "&nbsp;</td>"
                        end if
                    end if
                    Response.Write "<tr style='line-height:11px;color:#000000;'>"
                    for j=1 to 12
                    if tele1(i,3)*1 > alto or tele1(i,3)*1 < bajo then
                        if j = 3 then agre1="&nbsp;":agre2="!" else agre1="":agre2="" end if
                    end if
                    Response.Write "<td>" & agre1 & tele1(i,j) & agre2 & "</td>"  
                    next
                    if i<cuenta+1 then  
                        Response.Write "<td align=right>" & "<script>ponersun('"&tele1(i,1)&"','"&tele1(i,6)&"')</script>" & "</td>"
                    else
                        Response.Write "<td></td>"
                    end if
                    if extra1<>"" then Response.Write extra1 & extra2
                    Response.Write "</tr>" & vbCrLf
                   if left(request("tracker"),4)="orio" or left(request("tracker"),4)="bss9" then
                        if DateDiff("h",cDate(tele1(i+1,1)),cDate(tele1(i,1))) > 6 then Response.Write "<tr><td colspan=15><hr></td></tr>" & vbCrLf
                    else
                        if DateDiff("h",cDate(tele1(i+1,1)),cDate(tele1(i,1))) > 6 then Response.Write "<tr><td colspan=13><hr></td></tr>" & vbCrLf
                    end if 
                else
                    cuenta = cuenta + 1
                end if
                'if int(i/10)*10=i then Response.Flush   
            end if
        end if
    else
        on error resume next
        dbm = int(10*log(pwr*1000) / log(10)+.5)
        tele1(i,12)=dbm*300
        on error goto 0
            if Request("detail") <> "" then
                Response.Write "<tr title='Bad report ~ not plotted' style='line-height:11px;color:#b33c00;cursor:pointer;background-color:#e8e8e8;'>"
                for j=1 to 12
                    Response.Write "<td>" & tele1(i,j) & "</td>"  
                next
                if i<cuenta+1 then  
                    Response.Write "<td align=right>" & "<script>ponersun('"&tele1(i,1)&"','"&tele1(i,6)&"')</script>" & "</td>"
                else
                    Response.Write "<td></td>"
                end if
                Response.Write "</tr>" & vbCrLf
            else
                if i < cuenta+1 and tele1(i,1) > previousdate then
                    Response.Write "<tr title='Bad report ~ not plotted' style='line-height:11px;color:#b33c00;cursor:pointer;background-color:#e8e8e8;'>"
                    for j=1 to 12
                        Response.Write "<td>" & tele1(i,j) & "</td>"  
                    next
                    if i<cuenta+1 then  
                        Response.Write "<td align=right>" & "<script>ponersun('"&tele1(i,1)&"','"&tele1(i,6)&"')</script>" & "</td>"
                    else
                        Response.Write "<td></td>"
                    end if
                    Response.Write "</tr>" & vbCrLf
                    previousdate = tele1(i,1)
                end if
            end if
    end if
    'if int(i/10)*10=i then Response.Flush
    if len(punt(puntpointer,6)) < 10 and len(punt(puntpointer,6)) < 190 then punt(puntpointer,6)=punt(puntpointer,6) & "<br>" & licencia & " " & replace(SNR,"SNR:","",1,40,1)
        if punt(puntpointer,1)=locatora&"LL" and punt(puntpointer,3) = altura then
    if Request("detail")<>"onx" then puntpointer=puntpointer+1 'ojo cambio on por onx
        insertar = true    
        for w=1 to len(punt(puntpointer,6))-8
            if licencia=mid(punt(puntpointer,6),w,len(licencia)) then insertar = false
        next
        if insertar and len(punt(puntpointer,6)) < 190 then punt(puntpointer,6)=punt(puntpointer,6) & "<br>" & licencia & " " & replace(SNR,"SNR:","",1,40,1) 
    else
        if trim(Request("tracker"))<>"zachtek1" then
                puntpointer = puntpointer + 1
                if len(locatora)<6 then    
                    punt(puntpointer,0)=horaoriginal+"z":punt(puntpointer,1)=locatora&"LL":punt(puntpointer,3) = altura
                else
                    punt(puntpointer,0)=horaoriginal+"z":punt(puntpointer,1)=locatora:punt(puntpointer,3) = altura
                end  if
                punt(puntpointer,2)="? ":punt(puntpointer,4)="? "
        else
            if punt(puntpointer,0)<>horaoriginal+"z" then puntpointer = puntpointer + 1
            if len(locatora)<6 then    
                punt(puntpointer,0)=horaoriginal+"z":punt(puntpointer,1)=locatora&"LL":punt(puntpointer,3) = savealtur
            else
                punt(puntpointer,0)=horaoriginal+"z":punt(puntpointer,1)=locatora:punt(puntpointer,3) = savealtur
                if trim(Request("tracker"))="zachtek1" and trim(Request("timeslot"))="" then punt(puntpointer,3) = lastaltura
            end  if
            punt(puntpointer,2)="? ":punt(puntpointer,4)="? " 
        end if
    end if
next
on error resume next
avgfreq=int(summhz/countmhz)
Session("avgfreq")=avgfreq
on error goto 0
distavar=distavar & "[":for i = 0 to ubound(distakm):distavar = distavar & distakm(i) & ",":next:distavar = left(distavar,len(distavar)-1) & "]];" & vbCrLf
'Response.Flush
'puntpointer = puntpointer - 1

Response.Write "<div id=""estaciones"" style=""font-family:monospace;font-size:12px;line-height:11px;font-weight:normal;text-align:left;background-color:#fff7e6;white-space:nowrap;""></div>" & vbCrLf
if Haylista then 
    if spots < cuenta then cuentaa = spots else cuentaa = cuenta end if
    Response.Write "<th align=center colspan=15><tr style='font-weight:bold;'><td align=center> Seen: "&spots&" Spots </td><td align=center>Listing:</td><td align=center>Recent "&cuentaa&"</td><td colspan=13><hr></td></tr></th>" & vbCrLf
'    Response.Write "<tr style='background-color:#cccccc;'><th align=center colspan=5>Segundos Paquetes de Telemetr&iacute;a recibidos</th><th align=center><b>Datos</b></th><th align=center colspan=2><b>Uso para TLM</b></th><th align=center colspan=2><b>Recibido</b></th><th align=center colspan=2><b>&nbsp;&nbsp;Distancia</b></th><th align=center colspan=2><b>Localizaci&oacute;n</b></th><th align=center colspan=2>Altura</th></tr>"&vbCrLf&"<tr style='background-color:#cccccc;'><th align=center><b>Fecha / Hora UTC</b></th><th align=center><b>Telem.</b></th><th align=center><b>Frecuencia</b></th><th align=center><b>SNR</b></th><th align=center><b>&#x25BA;&#x25C4;</b></th><th align=center><b>Telem.</b></th><th align=center><b>dBm</b></th><th align=center><b>W<br></b></th><th align=center><b>Por&nbsp;</b></th><th align=center><b>Locator</b></th><th align=center><b>&nbsp;Km</b></th><th align=center><b>Millas</b></th><th align=center><b>&nbsp;Latitud&nbsp;</b></th><th align=center><b>&nbsp;Longitud&nbsp;</b></th><th align=center><b>&nbsp;metros&nbsp;</b></th></tr>" & vbCrLf
else
    qstring="?"
    for each formQuery in Request.QueryString
       qstring = qstring & formQuery & "=" & Request.QueryString.Item(formQuery) & "&"
    Next
    dedonde = lcase(Request.ServerVariables("SERVER_NAME")):irdonde="org"
    for r=1 to len(dedonde)-3
        if mid(dedonde,r,3)="org" then irdonde="com"        
    next
    if Request("other")="" then leyinicial = "<img src='http://lu7aa.com.ar/icon/habhub.png'>&nbsp;This free application tracks WSPR Balloons&nbsp;<img src='http://lu7aa.com.ar/icon/aprs.png'><br>Enter Balloon Callsign and click OK" else leyinicial = "Not enough data found on WSPRNET for "&ucase(Request("other"))& "<br>Change Callsign or band and/or retry clicking 'OK'<br>Alternate site: <a href=http://lu7aa."&irdonde&".ar/wsprx.asp"&qstring&" style='color:#FFCF00;'>http://lu7aa."&irdonde&".ar/wsprx.asp</a>" end if
    Response.Write "<center><b><div style='height:110px;width:550px;border-width:7px;border-color:#FFBF00;vertical-align:text-top;border-style:ridge;background-color:#045FB4;color:#FFCF00;font-family:Arial;font-size:20px;align:center;text-shadow: 2px 2px #000000;border-radius: 37px 37px 37px 37px;border-width:4px;'><br>"&leyinicial&"</div></b><br></center>"' & tablaheader1 
end if

if trim(Request("timeslot"))<>"" and Request("timeslot")<> " " then timeslot = " and for minutes starting on x" & Request("timeslot") : else timeslot = "" end if
'if Haylista then 
if Request("balloonid") <> "" then  Response.Write "<tr style='background-color:#cccccc;'><th align=center style='font-size:16px;' colspan=13>2nd Telemetry Transmissions received for Channel-Id "&ucase(Request("balloonid"))&timeslot&"&nbsp;&nbsp;<i>("&ucase(Request("tracker"))&" Decoding test)</i></th><th></th></tr>" & vbCrLf
Dim puntos(5002,7) ' Contiene fecha, locator y telemetria del 2do paquete
puntospointer = 0
Dim punto(5002,8) ' Contiene fecha y locator 1er paquete
puntopointer = 0
last=last-1
banda = 14
bandasearch = "14"
for g=0 to ubound(tbanda)
    if ucase(Request("banda"))=ucase(tbanda(g,1)) then 
        bandasearch = tbanda(g,0)
    end if
next
balid=left(balloonid,1) & "_" & right(balloonid,1) & "*"
timeLimit = "1209600" '1209600 604800
'if ucase(Request("other"))="W5KUB" then timeLimit = "604800"
count="5000"
cuenta= 8700
if Request("detail") <> "" then cuenta = 698
cuentamax = cuenta*1
cuentalineas=0
if balloonid<>"" then
        tablax = split(pag1,chr(10),5000,1)
        tablan = split(pag1,chr(10),5000,1)
        dim tele2(5002,13)
'        redim preserve tele2(ubound(tablan),13)
        if len(pag1)> 0 then 
            if Request("qp")<>"" then
                Response.Write "<tr style='background-color:#cccccc;font-size:16px;'><th style='width:16%;'>Timestamp (z)</th><th style='width:7%;'>&nbsp;Call Loc Pwr</th><th style='width:8%;'>Locator</th><th style='width:4%;'>Temp</th><th style='width:4%;'>Bat/Sun</th><th style='width:7%;'>Km/h</th><th style='width:5%;'>GPS#</th><th style='width:10%;'>Reporter</th><th style='width:10%;'>RGrid&nbsp;</th><th style='width:6%;'>&nbsp;Km.&nbsp;</th><th style='width:6%;'>&nbsp;Az&deg;&nbsp;</th><th style='width:7%;'>Heig.m</th><th style='width:8%;cursor:pointer;align:right' align=right title=' This column shows&#13solar elevation angle&#13 If at 12000m. add 3&deg;'>Sun&deg;&nbsp;</th><th title='qrplabs TLM&#13Decode Test'><span onclick='showtelen()' title='Display Comment and TELEN #1 Coding'><u>Telen 1/2</u></span></th></tr>" & vbCrLf
            else
                 Response.Write "<tr style='background-color:#cccccc;font-size:16px;'><th style='width:16%;'>Timestamp (z)</th><th style='width:7%;'>&nbsp;Call Loc Pwr</th><th style='width:8%;'>Locator</th><th style='width:4%;'>Temp</th><th style='width:4%;'>Bat/Sun</th><th style='width:7%;'>Km/h</th><th style='width:5%;'>GPS#</th><th style='width:10%;'>Reporter</th><th style='width:10%;'>RGrid</th><th style='width:6%;'>Km.</th><th style='width:6%;'>Az&deg;</th><th style='width:7%;'>Heig.m</th><th style='width:8%;cursor:pointer;align:right' align=right title=' This column shows&#13solar elevation angle&#13 If at 12000m. add 3&deg;'>Sun&deg;&nbsp;</th></tr>" & vbCrLf
            end if
        end if
        for i = 0 to 0
            on error resume next
            tele2(i,0)="2"
            datosmod=tablan(i)
            datos2 = split(datosmod,chr(09),13,1)
            for j=1 to ubound(datos2)
                tele2(i,j)=datos2(j-1)
            next
            on error goto 0
        next
        previousdate = tele2(2,1)
        firsttlm = Request("timeslot")*1 + 2*1
        if firsttlm> 9 then firsttlm = firsttlm - 10
        secondtlm = Request("timeslot")*1 + 4*1
        if secondtlm > 9 then secondtlm = secondtlm - 10
        for i=0 to ubound(tablan)
            tele2(i,0)="2"
            datosmod=tablan(i)
            datos2 = split(datosmod,chr(09),13,1)
            if Request("tracker")="qrplabs" or Request("tracker")="traquito" then
                on error resume next
                if len(datos2(5)) = 4 then 
                    for j=1 to ubound(datos2)
                        tele2(i+1,j)=datos2(j-1)
                    next
                else
                end if
                on error goto 0
            else
                for j=1 to ubound(datos2)
                    tele2(i+1,j)=datos2(j-1)
                next
            end if

            Posi=1
'            if Request("detail") <> "" then 
                fechahora = tele2(i,thora)
                if trim(Request("timeslot")) <> "" then 
                    buscohora = left(fechahora,15)
                else
                    buscohora = DateAdd("n",-1,fechahora)
                    buscohorad = split(buscohora," ",2,1)
                    buscohoram = split(buscohorad(0),"/",3,1)
                    buscohoras = split(buscohorad(1),":",3,1)
                    hhora=buscohoras(0)*1:hmin=buscohoras(1)*1:if right(buscohora,2)="PM" then hhora=hhora+12
                    bushora = buscohoram(2) & "-" & right("0" & buscohoram(0),2) & "-" & right("0" & buscohoram(1),2) & " " & right("0" & hhora,2) & ":" & right("0" & hmin,2)
                    'Response.Write fechahora & " = " & bushora & "<br>"
                    buscohora = left(bushora,15)
                end if
                checkit = true:if lcase(request("tracker"))="wb8elk" then actuali = tele2(i,tgrid):checkit = false:for r=2 to ubound(tele2):if actuali=tele2(r,tgrid) then:checkit=true:exit for:end if:next end if
'            end if
'    Response.write "fechahora:" & fechahora & " DesdeFecha:" & DesdeFecha & " launchdate:" & launchdate & "<br>"
            'Response.write tele2(i,tgrid) & ", "
            if len(tele2(i,tgrid))=4 and (Request("tracker")="qrplabs" or Request("tracker")="traquito") then qrplen4 = true else qrplen4 = false: end if
            if fechahora > DesdeFecha and fechahora >= launchdate and checkit then
                fh2 = DateAdd("n",-2,cDate(fechahora))
                fechahora2=year(fh2)&"-"&right("00"&month(fh2),2)&"-"&right("00"&day(fh2),2) & " " & formatdatetime(fh2,4)&"z"
                telem2 = tele2(i,tcall)
                if Request("tracker") = "qrplabs" or Request("tracker")="traquito" then loc4 = left(tele2(i,tgrid),4) else loc4 = tele2(i,tgrid) end if
                on error resume next
                dbm = int(10*log(tele2(i,tpwr)*1000) / log(10)+.5)
                on error goto 0                   
    '            Response.Write fechahora & " " & "telem2:" & telem2 & "; " & " loc4:" & loc4 & " dbm:" & dbm & "<br>"
                if trim(Request("timeslot"))="" or Request("timeslot")=" " then    
                    if i<cuenta and len(locator2)=4 then Response.Write "<tr>" & tablan(i) & vbCrLf
                else
                    if i<cuenta and len(locator2)=4 and Request("timeslot") = right(fechahora,1) then Response.Write "<tr>" & tablan(i) & vbCrLf
                end if
                    if len(tablan(i)) > 10 then
                        if balloonid <> "" then
                            if left(tele2(i,tcall),1) & mid(tele2(i,tcall),3,1) = balloonid then
                                if trim((Request("timeslot"))<>"" and (Request("tracker")="qrplabs" or Request("tracker")="traquito")) and Request("qp")="on" then 
                                    if mid(fechahora,16,1)*1 = firsttlm then decoqr = decoqrp(fechahora,telem2,loc4,tele2(i,tpwr)):pase=false
                                    if right(" " & (Request("timeslot")*1) + 4,1)*1=secondtlm and pase and len(decoqr)< 14 then decoqr = decoqr & " " & decoqrp(tele2(i+0,thora),tele2(i+1,tcall),left(tele2(i+1,tgrid),4),tele2(i+1,tpwr)) '" & mid(telem2,2,1) & right(telem2,3) & loc4
                                    pase = true
                                else
                                    if (Request("tracker")="qrplabs" or Request("tracker")="traquito") and Request("banda")="All" and Request("qp")="on" then decoqr = decoqrp(fechahora,telem2,loc4,tele2(i,tpwr))
                                end if
                            end if
                            if (Request("timeslot") = mid(fechahora,16,1) or Request("timeslot") = "" or Request("timeslot") = " " and Request("balloonid")<>"") and len(loc4)=4 then 
                            if Request("detail") = "" then
                                on error resume next
                                    if tele2(i,thora)<>tele2(i+1,thora) and cuentalineas < cuentamax or i=2 then
                                        decowspr fechahora,telem2,loc4,tele2(i,tpwr),tele2(i,treporter),tele2(i,trgrid),tele2(i,tkm),tele2(i,taz)
                                        Response.Write retorno & vbCrLf
                                    end if
                                on error goto 0
                            else
                                on error resume next
                                    if cuentalineas < cuentamax or i=2 then
                                        decowspr fechahora,telem2,loc4,tele2(i,tpwr),tele2(i,treporter),tele2(i,trgrid),tele2(i,tkm),tele2(i,taz)
                                        Response.Write retorno & vbCrLf
                                    end if
                                on error goto 0
                            end if
                            if cuentalineas < cuentamax and len(tele2(i+1,1))>5 and DateDiff("n",cDate(tele2(i+1,1)),cDate(previousdate)) > 360 then Response.Write "<tr><td colspan=13><hr></td></tr>" & vbCrLf
                            if len(tele2(i+1,1))>5 then previousdate = tele2(i+1,1)
                            cuentalineas = cuentalineas + 1
                                if i=2 then
                                    TempFinal = wtemp
                                    VoltFinal = wbat
                                    Altfinal = walt
                                    Locfinal = newloc&K6&N6
                                    GPSfinal = wsats
                                end if
                        end if
                    end if
                        datefound = false
                        on error resume next
                        for h=0 to ubound(tablan)
                            if puntos(h,0)=fechahora2 then
                                datefound=true
                                exit for
                            else
                            end if
                        next
                        on error goto 0    
                        if datefound=false then
                             puntos(puntospointer,0)=fechahora2
                             puntos(puntospointer,1)=replace(locator,"&nbsp;","",1,32,1)
                             puntos(puntospointer,2)=telem2
                             puntos(puntospointer,3)=altura
         '                   Response.Write puntos(puntospointer,0) & "<br>"
                             puntospointer=puntospointer+1
                             char1="0":if balloonid<>"" then char1 = mid(balloonid,1,1)
                             char2="7":if balloonid<>"" then char2 = mid(balloonid,2,1)       
                             if mid(telem2,1,1)=char1 and mid(telem2,3,1)=char2 then
                                hora = mid(fechahora,3,14)
                                hora = mid(hora,4,14)
                                hora = mes(left(hora,2)) & "-" & right(hora,8)
        '                        Response.Write diahora & "," & "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;LU7AA<br>" &  hora & "," & locator  & ",+"& altura*18 & "<br>"
                             end if
                        end if
                
         '               
                        locatorfound=false
                         for h=0 to ubound(tablan)
                            on error resume next
                            if punto(h,1)=locator then
                                locatorfound=true
                                exit for
                            end if
                            on error goto 0
                        next 
                        if locatorfound=false then 'and (callsign="LU1ESY" or callsign="LU7AA" or callsign="VK3KCL" or callsign="LU4KC" or callsign="WB8ELK") then
                                snr1 = "":licorigen=""
                                for h=0 to ubound(tablahoras)
                                    if tablahoras(h,0) = fechahora then 
                                        licorigen = licorigen & tablahoras(h,4)&" "&tablahoras(h,3)&"<br>De: "
                                        'snr1=tablahoras(h,3)
                                        exit for
                                    end if 
                                next
                            if len(licorigen) > 8 then licorigen=left(licorigen,len(licorigen)-8)    ' cambio                     
                            if licorigen = "" then licorigen = licorigenalt
                            if char1="" then char1="0"
                            if balloonid<>"" then char1 = mid(balloonid,1,1)
                             char2="7":if balloonid<>"" then char2 = mid(balloonid,2,1) 
                             if mid(telem2,1,1)=char1 and mid(telem2,3,1)=char2  then
                                    if wsats = "4-8 Sats" then agregar = "gps" else agregar = ""
                                    punto(puntopointer,0)=fechahora + "z"+agregar
                                    punto(puntopointer,1)=left(replace(locator,"&nbsp;","",1,12,1),6)
                                    punto(puntopointer,2)=wtemp
                                    punto(puntopointer,3)=int(round(altura*18.11320/10))*10
                                    punto(puntopointer,5)=wspeed
                                    for u=0 to 300
                                    if tablahoras(u,0)=fechahora then
                                        punto(puntopointer,3)=punto(puntopointer,3)+(tablahoras(u,1)*1)                                
                                        exit for
                                    end if
                                    next  
                                    punto(puntopointer,4)=wbat
                                    punto(puntopointer,5)=wspeed
                                    punto(puntopointer,6)=licorigen
                                    puntopointer=puntopointer+1                            
                             end if                     
                        end if  
    
                    end if

                    for z=0 to ubound(punt)
                        if left(punt(z,0),15)=buscohora and len(newloc)>2 then
                            punt(z,1)=newloc&K6&N6
                            punt(z,3)=walt
                            punt(z,2)=wtemp:punt(z,4)=wbat:punt(z,5)=wspeed
                            exit for
                        end if 
                    next
               end if
            next
        if Request("balloonid") <> "" and ubound(tablan) > 0 then Response.Write "<tr><td colspan=5 align=left style='align:left;'><b>&nbsp;&nbsp;&nbsp;&nbsp;There were: +" & ubound(tablan)-1 & " Spots for 2nd Telemetry.... Listing: Recent "&cuenta+2&" Spots</b></td><td colspan=8><hr></td></tr>" & vbCrLf
        Response.Write "</table>" & vbCrLf
end if
llcount = 0:totalcount=0
for k = 1 to puntpointer+1
        on error resume next
        punto(k-1,0)=punt(k-1,0): punto(k-1,1)=replace(punt(k-1,1),"&nbsp;","",1,20,1): punto(k-1,2)=punt(k-1,2): punto(k-1,3)=punt(k-1,3): punto(k-1,4)=punt(k-1,4): punto(k-1,5)=punt(k-1,5): punto(k-1,6)=punt(k-1,6): punto(k-1,7)=punt(k-1,7)
        puntos(k-1,0)=punt(k-1,0): puntos(k-1,1)=replace(punt(k-1,1),"&nbsp;","",1,20,1): puntos(k-1,2)=punt(k-1,2): puntos(k-1,3)=punt(k-1,3): puntos(k-1,4)=punt(k-1,4): puntos(k-1,5)=punt(k-1,5): puntos(k-1,6)=punt(k-1,6): puntos(k-1,7)=punt(k-1,7)
        if right(punto(k-1,1),2)="LL" and len(punto(k-1,1))>3 then llcount=llcount+1
        if len(punto(k-1,1))>3 then totalcount=totalcount+1 
        on error goto 0
next
on error resume next
llaverage = llcount/totalcount
on error goto 0
puntospointer=puntpointer
puntopointer=puntpointer
'puntospointer=puntospointer-1
lastpunto = ""
for k=0 to puntospointer -1
    if punto(k,3) >= 0 then
        if len(puntos(k,0))<10 then puntos(k,0)=hora0
        puntos(k,1)=replace(puntos(k,1),"db","",1,1,1)
            ' agregar a linea siguiente  and mid(puntos(k,0),16,1) = Request("timeslot")
            if len(puntos(k,1))>3 and puntos(k,0) <> lastpunto then
                if Request("detail")="on" then
                    trayecto=trayecto & "["""&puntos(k,0)&""","""&left(puntos(k,1),6)&""","""&puntos(k,2)&""","""&puntos(k,3)&""""&"]," & vbCrLf
                    lastpunto = puntos(k,0)
                else
                    if Request("detail")="" then
                        trayecto=trayecto & "["""&puntos(k,0)&""","""&left(puntos(k,1),6)&""","""&puntos(k,2)&""","""&puntos(k,3)&""""&"]," & vbCrLf
                        lastpunto = puntos(k,0)
                    end if
                end if
            end if 
    end if
next
'
puntopointer = puntopointer - 1
for m =1 to puntopointer+2
        punto(m-1,0)=punto(m,0):punto(m-1,1)=punto(m,1):punto(m-1,2)=punto(m,2):punto(m-1,3)=punto(m,3):punto(m-1,4)=punto(m,4):punto(m-1,5)=punto(m,5):punto(m-1,6)=punto(m,6):punto(m-1,7)=punto(m,7)
next
lastpunto = ""
bid = false
if Request("balloonid")<>"" or trim(request("tracker"))<>"zachtek1"  or Request("tracker")<> "6locators" then bid = true
if Request("balloonid") = "" then bid = false
if trim(Request("tracker"))="zachtek1" or Request("tracker")="6locators" then bid = true
'
for k=0 to puntopointer+2
    if punto(k,3) >= 0 then 'tenia if punto(k,3) >= 0 and mid(punto(k,1),2,1) < checkletter then
        if len(punto(k,0))<10 then punto(k,0)=hora0
        punto(k,1)=replace(punto(k,1),"db","",1,1,1)
        estax=false:for w=0 to ubound(omi)
            if omi(w)=punto(k,1) then estax=true
        next
        'loctolatlon(locact).lon
        ' crsdist(lat1, lon1, lat2, lon2)
'        if k < 5000 then
'            if len(punto(k,1))= 4 then 
'                    dista = crsdist(loctolatlon(punto(k,1)).lat, loctolatlon(punto(k,1)).lon, loctolatlon(punto(k+1,1)).lat, loctolatlon(punto(k+1,1)).lon).distance
'                    Response.write punto(k+1,1) & ", "
'            end if
'       end if
        if llaverage < 1 xor not right(punto(k,1),2)="LL" then usell = false else usell = true end if
        if len(punto(k,1))>3 and punto(k,0) <> lastpunto  and not estax and usell then
            if len(punto(k,1))>3 and lastpunto <> "" then 
                dista = crsdist(loctolatlon(punto(k,1)).lat, loctolatlon(punto(k,1)).lon, loctolatlon(lastpunto).lat, loctolatlon(lastpunto).lon).distance*1.852
                if lasttiempo <>"" then tiempo = datediff("s",cDate(replace(punto(k,0),"z","",1,20,1)),cDate(replace(lasttiempo,"z","",1,20,1)))
                on error resume next
                veloci = dista*3600/tiempo
                on error goto 0
            end if
            'Response.write punto(k,1) & ", " & lastpunto & " Dist = " & dista & "Km. elapsed:" & tiempo & " Veloc:" & veloci & " Km/h<br>"
            if lastpunto<> punto(k,1) then lastpunto = punto(k,1):lasttiempo = punto(k,0)
             if veloci < 301 then beacon1=beacon1 & "["""&punto(k,0)&""","""&left(punto(k,1),6)&""","""&punto(k,2)&""","""&punto(k,3)&""","""&punto(k,4)&""","""&punto(k,5)&""","""&punto(k,6)&""","""&punto(k,7)&""""&"]," & vbCrLf
        end if
    end if
next
    if len(beacon1)>10 then beacon1 = vbCrLf & "var beacon1 = [" & vbCrLf & left(beacon1,len(beacon1)-3) & "];" & vbCrLf else beacon1= vbCrLf & "var beacon1 = [];" & vbCrLf
    if len(trayecto)>10 then trayecto = "var trayecto = [" & vbCrLf & left(trayecto,len(trayecto)-3) & "];" else trayecto = vbCrLf & "var trayecto = [];" end if
    if len(flechas) > 5 then flechas = left(flechas,len(flechas)-1)&"];"

    if puntopointer > -1 and isDate(left(punto(0,0),16)) then
        hlocal = cdate(left(punto(0,0),16))-TZDiff/60/24:horalocal = "<br>Local: " & right("00"&hour(hlocal),2)&":"&right("00"&minute(hlocal),2)
        hora = mes(mid(punto(0,0),6,2)) & "-" & mid(punto(0,0),9,2) & " " & mid(punto(0,0),12,5)
        if punto(0,3)="130" then punto(0,3)="11120"
        if len(punto(0,1))=6 then locatorx=left(punto(0,1),4) & lcase(right(punto(0,1),2)) else locatorx = punto(0,1) end if
        'if punto(0,3)="3000" then punto(0,3)="12000"
        for h=0 to ubound(punto)
            if len(punto(h,1))> 4 and ucase(right(punto(h,1),2))<>"LL" then
                locatorx = punto(h,1)
                exit for
            end if        
        next
        if Altfinal <> "" then punto(0,3)=Altfinal
        if TempFinal <> "" then punto(0,2)=TempFinal
        if VoltFinal <> "" then punto(0,4)=VoltFinal
        if GPSfinal <> "" then GPSx="<br>GPS-Sats: " & GPSfinal else GPSx = "" end if
        if decoqr1<>"" then GPSx = "<br>" & decoqr1
        altutext = "<br>Alt.: " & "0" & "&nbsp;m."
        for z=0 to ubound(punto)
            if punto(z,3)<>"" and punto(z,3) <> 15000 and punto(z,3) <> 14000 and punto(z,3) <> 3000 and punto(z,3) <> 4000 and punto(z,3) > 360 and punto(z,3) <> 12000 then altutext = "<br>Alt.: "  & punto(z,3)& "&nbsp;m.&nbsp;&nbsp;<br>Alt.: " & int(punto(z,3) * 3.28084) & " feet":exit for end if
        next
        'if (Request("tracker")="zachtek1" or Request("tracker")="yo3ict") and lastaltura <> "" then altutext = "<br>Alt.: "  & lastaltura & "&nbsp;m.&nbsp;&nbsp;<br>Alt.: " & int(lastaltura * 3.28084) & " feet"
        temptext="":for z=0 to ubound(punto):if len(punto(z,2)) > 1 and trim(punto(z,2))<>"?" then:temptext = "<br>Temperat: "  & punto(z,2) & "&deg;C":exit for:end if:next
        batetext="":for z=0 to ubound(punto):if len(punto(z,4)) > 2 and punto(z,4)<>"?" then:batetext = "<br>Bat/Sol: " & replace(punto(z,4),"V","")*1 & "Volts":exit for:end if:next
        if trim(Request("tracker"))<>"" then trackertext = "<br>Tracker: " & trim(lcase(Request("tracker")))
        if Request("SSID")<>"" then addss = "APRS: " &  "<a href=http:\/\/aprs.fi?call="&ucase(Request("other"))&"-"&Request("SSID")& "&timerange=604800&tail=604800&mt=hybrid" & " title=\'See in APRS&#13If uploaded\' target=_blank><u style=\'line-height:13px;color:green;\'>"&ucase(trim(Request("other"))) & "-" & Request("SSID")&"</u></a><br>" else addss = "" end if
        if decoqrf <> "" then
            if len(decoqrf)>16 then  
                decoqrfm = replace(left(decoqrf,17),"T#","T1",1,1,1) & "<br>T2 " & right(decoqrf,13)
            else
                decoqrfm = decoqrf
            end if
        end if
        if decoqrf <> "" then trackertext = trackertext & "<br>" & decoqrfm
        mapainicio = "ponermapa ('"& locatorx &"','"& licenciao & "<br>" & addss & hora &  "z" & horalocal &"<br>Power: " & power & "<br>Locator: " & locatorx & altutext & temptext & batetext & GPSx & replace(replace(replace(trackertext,"<span class='narrow' style='color:black;'>","",1,300,1),"<span class='narrow' style='color:gray;'>","",1,300,1),"</span>","",1,300,1) & "<span id=globo></span>" & punto(0,6) &  "<br><a href=# onclick =""gowinds1()"" style=""color: #3333ff;line-height:13px;overflow:hidden;font-weight:bold;white-space:nowrap;cursor:pointer;""><u>Click for Winds</u></a>" & "')" & vbCrLf
        newvorloc = "["& chr(34) & locatorx & chr(34) & ","& chr(34) & licenciao & "<br>" & addss & hora & "z" & horalocal & "<br>Power: " & power & "<br>Locator: "  & locatorx & altutext & temptext & batetext & GPSx & replace(replace(replace(trackertext,"<span class='narrow' style='color:black;'>","",1,300,1),"<span class='narrow' style='color:gray;'>","",1,300,1),"</span>","",1,300,1) & punto(0,6) & " <br><a href=# onclick =\""gowinds1()\"" style=\""color: #3333ff;line-height:13px;overflow:hidden;font-weight:bold;white-space:nowrap;cursor:pointer;\""><u>Click for Winds<\/u><\/a>" & """]," & vbCrLf
        vorloc = replace(vorloc,vorlocsave,newvorloc,1,2000,1) 
    end if
    ' Lo siguiente es para mostrar captura si ultima fecha/hora diferente a fecha/hora del globo
    if mid(punto(0,0),9,8) <> mid(hora,5,8) then showcap = "showcapture = true;" else showcap = "showcapture = false;" end if
    if avgfreq-fcentral < 10 and avgfreq-fcentral >-1 then addplus="<span style='color:#ffffff;'>&#x25B3;+" & avgfreq-fcentral & "Hz</span>":addplusm=" \u25B3+" & avgfreq-fcentral & "Hz. "
    if avgfreq-fcentral < 0 and avgfreq-fcentral > -10 then addplus="<span style='color:#ffffff;'>&#x25B3;" & avgfreq-fcentral & "Hz</span>":addplusm= " \u25B3" & avgfreq-fcentral & "Hz. "
    if avgfreq-fcentral > 9 then addplus="<span style='color:#ff6e5e;'>&#x25B3;+" & avgfreq-fcentral & "Hz</span>":addplusm=" \u25B3+" & avgfreq-fcentral & "Hz. "
    if avgfreq-fcentral < -9 then addplus="<span style='color:#ff6e5e;'>&#x25B3;" & avgfreq-fcentral & "Hz</span>":addplusm=" \u25B3" & avgfreq-fcentral & "Hz. "
    addplusm="var addplusm='"&addplusm&"';"  
	vorloc = left(vorloc,len(vorloc)-3) & "];" & vbCrLf & bcidm & vbCrLf & showcap & vbCrLf & flechas & vbCrLf & trayecto & beacon1 & addplusm & distavar & mapainicio & "</script>"


 Session("delay")=DateDiff("s",Session("timestart"),Now())

 */