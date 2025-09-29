window.HOST_URL = `${new URL(window.parent.window.location.href).origin}`;
window.Posicion = 1;
window.TARGET_WIDTH = 750;
window.isMobileOrTablet =
  /Mobi|Android|Tablet|iPad|iPhone/i.test(navigator.userAgent) ||
  screen.availWidth < TARGET_WIDTH;

window.getParamSafe = (key, defaultValue = "", encode = false) => {
  const params = new URLSearchParams(window.parent.window.location.search);
  const value = params.get(key);
  if (value === null || value.trim() === "") return defaultValue;
  return encode ? encodeURIComponent(value) : value.trim();
};

function getScaleFactor() {
  const currentWidth = window.innerWidth;
  return currentWidth / TARGET_WIDTH;
}

function applyScale(scale) {
  if (navigator.userAgent.includes("Firefox")) {
    document.body.style.MozTransform = `scale(${scale})`;
    document.body.style.MozTransformOrigin = "0 0";
  } else {
    document.body.style.zoom = scale;
  }
}

function resizeAndScale() {
  if (isMobileOrTablet) {
    const scale = getScaleFactor();
    applyScale(scale);
  } else {
    if (navigator.userAgent.includes("Firefox")) {
      document.body.style.MozTransform = "";
      document.body.style.MozTransformOrigin = "";
    } else {
      document.body.style.zoom = "";
    }
  }
}

function ucase(str) {
  return str ? str.toString().toUpperCase() : "";
}

function lcase(str) {
  return str ? str.toString().toLowerCase() : "";
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

function capitalizeWords(str) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

function capitalizeFirstLetter(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
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

function chr(code) {
  return String.fromCharCode(code);
}

function isNumeric(value) {
  return !isNaN(value) && !isNaN(parseFloat(value));
}

function ubound(arr) {
  return arr ? arr.length - 1 : -1;
}

function buscarTag(tagInicio, tagFin, texto) {
  let tagFinalEncontrado = false;
  let k = window.Posicion;
  let resultado = "";

  while (!tagFinalEncontrado && k < texto.length) {
    if (texto.substring(k, k + tagInicio.length) === tagInicio) {
      let j = k + tagInicio.length;
      let tagFinalLocalEncontrado = false;

      while (!tagFinalLocalEncontrado && j < texto.length) {
        if (texto.substring(j, j + tagFin.length) === tagFin) {
          resultado = texto.substring(k + tagInicio.length, j);
          tagFinalLocalEncontrado = true;
          tagFinalEncontrado = true;
          window.Posicion = j + tagFin.length;
        } else {
          j++;
        }
      }

      if (!tagFinalLocalEncontrado) {
        k++;
      }
    } else {
      k++;
    }
  }

  if (k >= texto.length) {
    window.Posicion = texto.length;
  }

  return resultado;
}

async function getURL(url, responseType = "text") {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result =
      responseType === "text" ? await response.text() : await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching URL:", error);
    return "";
  }
}

async function getURLXform(url, body = null, headers = {}) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        ...headers,
      },
      body: body,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    return text;
  } catch (error) {
    console.error("Error fetching URL:", error);
    return "";
  }
}

async function readShareAsset({ assetOutputType, assetUrl }) {
  try {
    return await window.parent.window.readAssetFile({
      assetOutputType,
      assetUrl,
    });
  } catch (error) {
    return { statusCode: 400, data: null, error: "Something went wrong." };
  }
}

async function getShareResource(file) {
  try {
    const assetUrl = `/api/v1/getAsset?file=${encodeURIComponent(`share/assets/${file}`)}`;
    // const assetUrl = `https://balloons.dev.browxy.com/api/v1/getAsset?file=${encodeURIComponent(`share/assets/${file}`)}`;
    let serverResponse;
    const response = await readShareAsset({
      assetOutputType: "txt",
      assetUrl,
    });
    serverResponse = response.data;

    return serverResponse;
  } catch (error) {
    console.error(error);
    return "";
  }
}

function cDate(dateString) {
  try {
    return new Date(dateString);
  } catch (error) {
    return new Date();
  }
}

function isDate(date) {
  return date instanceof Date && !isNaN(date.getTime());
}
