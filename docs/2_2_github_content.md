---
title: GitHub Repository Content
nav_order: 2
parent: Github
---

# <img style="vertical-align: middle;height:40px; width:40px;" src="https://raw.githubusercontent.com/bxyteam/balloons/refs/heads/main/docs/images/git-branch.png"> Github Repository Content

#### <img style="vertical-align: middle;" src="https://raw.githubusercontent.com/bxyteam/balloons/refs/heads/main/docs/images/folder-tree.png" /> Project structure

```bash
.
├── balloons_processor
│   ├── pom.xml
│   └── src
├── docs
├── frontend
│   ├── builder
│   ├── css
│   ├── images
│   ├── js
│   ├── share
│   └── templates
└── scripts

```
***Warning! Deleting or renaming files and folders may cause undesired effects on the application or cause it to stop working***

### <img style="vertical-align: middle;" src="https://raw.githubusercontent.com/bxyteam/balloons/refs/heads/main/docs/images/folder-open.png"> frontend directory
This directory contains files using in the web.


##### js
Directory with javascripts files used in html templates.

```bash
frontend/js
├── assetsSrc.js
├── ballonTracker.js
├── balloonchartFn.js
├── balloonchart.js
├── balloonLaunchedWsprx.js
├── balloonLinkMenu.js
├── commonAll.js
├── commonWsprx.js
├── dxFn.js
├── dx.js
├── indexDx.js
├── indexGmap.js
├── indexWsprset.js
├── indexWsprx.js
├── jsDraw2DX.js
├── loader.js
├── suncalc.js
├── timeZone.js
├── vorFn.js
├── vorGmap.js
├── vor.js
├── wsprxTelemetry1.js
├── wsprxTelemetry2.js
└── wsprxTelemetryUtils.js
```
#### <img style="vertical-align: middle;" src="https://raw.githubusercontent.com/bxyteam/balloons/refs/heads/main/docs/images/file-code.png">  js File Description

* ##### Common files
- ###### assetsSrc.js
  - Javascript file with a dictionary key, value pairs with image urls hosted in external server. Load by all html templates with cdn.
- ###### commonAll.js
  - Javascript file with utililities functions used by the following html files: wsprx.html, wsprset.html, vor.html, dx.html, balloonchart.html, and load from cdn.

* ##### wsprx
- ###### commonWsprx.js
  - Javascript file with utililities functions, load from cdn.
- ###### indexWsprx.js
   - Javascript file with main functions, load from cdn.
- ###### balloonLinkMenu.js
   - Javascript file to generate ballons active links, load from cdn.
- ###### wsprxTelemetryUtils.js
   - Javascript file with utililities functions to calculate telemetry, load from cdn.
- ###### wsprxTelemetry1.js
  - Javascript file to calculate telemetry 1, load from cdn.
- ###### wsprxTelemetry2.js
  - Javascript file to calculate telemetry 2, load from cdn.
- ###### balloonLaunchedWsprx.js
  - Javascript file to load wsprx application, load from cdn.
- ###### suncalc.js
  - Javascript file to calculate sun position, load from cdn.

* ##### wsprset
- ###### ballonTracker.js
  - Javascript file to generate table with active/old entries balloons, load from cdn.
- ###### indexWsprset.js
  - Javascript file with main functions, load from cdn

* ##### dx
- ###### loader.js
  - Javascript file library, load from cdn.
- ###### dxFn.js
  - Javascript file with dx util functions, load from cdn.
- ###### dx.js
  - Javascript file to generate telemetry and load app, load from cdn.
- ###### indexDx.js
  - Javascript file with main functions, load from cdn.

* ##### balloonchart
- ###### balloonchartFn.js
  - Javascript file with balloonchart util functions, load from cdn.
- ###### balloonchart.js
  - Javascript file with main functions to load the application, load from cdn.

* ##### vor
- ###### jsDraw2DX.js
  - Javascript file library, load from cdn.
- ###### vorFn.js
  - Javascript file with vor util functions, load from cdn.
- ###### vor.js
  - Javascript file with main functions to load the application, load from cdn.

* ##### balloonGmap
- ###### suncalc.js
  - Javascript file to calculate sun position, load from cdn.
- ###### balloonGmap.js
  - Javascript file with main functions to load google map, load from cdn.

* ##### vorGmap
- ###### jsDraw2DX.js
  - Javascript file library, load from cdn.
- ###### vorGmap.js
  - Javascript file with main functions to load google map, load from cdn.

##### images
Directory with balloons images.

##### css
Directory with css style files

##### templates
Directory with builder html template files

```bash
frontend/templates/
├── maps
│   ├── balloonGmap.html
│   └── vorGmap.html
├── balloonchart.html
├── dx.html
├── vor.html
├── wsprset.html
└── wsprx.html
```
#### <img style="vertical-align: middle;" src="https://raw.githubusercontent.com/bxyteam/balloons/refs/heads/main/docs/images/folder-open.png">  Templates File Description

- ###### wsprx.html
  - This file render the balloons main page in the web builder. Show telemetry and load balloonGmap html into iframe.

- ###### wsprset.html
  - This file render the active/old balloons, provide a form to add/hide/edit balloons.

- ###### balloonchart.html
  - This file render the flights statistics balloons calls.

- ###### dx.html
  - This file render callsigns balloon reports.

- ###### vor.html
  - This file render balloon position. Show telemetry and load vorGmap html into iframe.

- ###### balloonGmap.html
  - This file render google map from external source.

 - ###### vorGmap.html
  - This file render google map from external source.

### <img style="vertical-align: middle;" src="https://raw.githubusercontent.com/bxyteam/balloons/refs/heads/main/docs/images/folder-open.png"> builder directory

##### builder
Directory that contains the configuration files to render the htmls into browxy builder application.

```bash
frontend/builder/
├── builderPages
│   ├── balloonchart.json
│   ├── dx.json
│   ├── vor.json
│   ├── wsprset.json
│   └── wsprx.json
├── controller
│   └── config.json
└── metadata
    └── project.json
```

### <img style="vertical-align: middle;" src="https://raw.githubusercontent.com/bxyteam/balloons/refs/heads/main/docs/images/folder-open.png">  balloons_processor directory

#### balloons_processor
Directory with java files to update balloons tracker data.

```bash
balloons_processor/
├── pom.xml
└── src
    └── main
        └── java
            └── domain
                ├── BalloonData.java
                ├── BalloonDataProcessor.java
                ├── BalloonHideRestoreProcessor.java
                ├── Balloon.java
                ├── BalloonSortData.java
                ├── BalloonTrackerProcessor.java
                ├── BalloonUrlParameter.java
                ├── FileUtil.java
                ├── LicenseData.java
                ├── PayloadForm.java
                ├── ProcessingResult.java
                ├── RequestCheckWspr.java
                ├── RequestCheckWsprProcessResult.java
                └── SavePicoss.java
```
### <img style="vertical-align: middle;" src="https://raw.githubusercontent.com/bxyteam/balloons/refs/heads/main/docs/images/folder-open.png">  scripts directory

#### scripts
Directory containing bash files executed by the application in a cron job.

```bash
scripts/
└── copy_files.sh
```

#### <img style="vertical-align: middle;" src="https://raw.githubusercontent.com/bxyteam/balloons/refs/heads/main/docs/images/file-terminal.png">  Script Files Description

- ###### copy_files.sh
  - This script copy balloons_processor / builder / templates files to web directory.
