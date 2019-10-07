/**
 * @description This should run before page load to initialize several Library functions
 */
 console.log("Initializing Library");

/**
 * @function testLib
 * @description Can be called to test if the library is loaded
 */
function testLib() {
	console.log("The library is available");
	return true;
}




///////////////////////////////////////////////////////
//                UI Manipulation                    //
///////////////////////////////////////////////////////
let menuOpen = false;
function toggleSettingMenu() {

    const pingMenu = document.getElementById("pingSettings");
    const toggleButton = document.getElementById("toggleSettingsButton");

    if(menuOpen) {
        pingMenu.style.left = "100%";
        toggleButton.style.left = "-105px";
        toggleButton.style.transform = "rotate(0deg)";
    } else {
        pingMenu.style.left = "0%";
        toggleButton.style.left = "5px";
        toggleButton.style.transform = "rotate(45deg)";
    }

    menuOpen = !menuOpen;
}




///////////////////////////////////////////////////////
//         Interact with database                    //
///////////////////////////////////////////////////////
function dbSendPing(pingData) {
    const data = new FormData();
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxDCXLMs7JjXIZM-4JOfVHiTndJgRuiAA8sS9FbC8gUniiB-2vG/exec';

    data.append("color", pingData.color);
    data.append("pos.x", pingData.pos.x);
    data.append("pos.y", pingData.pos.y);
    data.append("shape.radius", pingData.shape.radius);
    data.append("shape.amplitude", pingData.shape.amplitude);
    data.append("shape.frequency", pingData.shape.frequency);
    data.append("shape.precision", pingData.shape.precision);
    data.append("animation.name", pingData.animation.name);
    data.append("animation.speed", pingData.animation.name);
    data.append("animation.delay", pingData.animation.delay);
    data.append("text.content", pingData.text.content);
    data.append("text.color", pingData.text.color);
    data.append("sound", pingData.sound);

    fetch(scriptURL, { method: 'POST', body: data})
        .then(response => console.log('Success!', response))
        .catch(error => console.error('Error!', error.message))
}

///////////////////////////////////////////////////////
//            User Identification                    //
///////////////////////////////////////////////////////
let pingsRemaining = 5;
const uidName = "specialUserId"

function getNewId() {
    let id = Math.random().toFixed(10).toString();
    id = id.substr(2);
    return id;
}

function validateUser() {
    let cookies = document.cookies;
    if(cookies.includes(uidName)) {
        pingsRemaining = getCookie("pingsRemaining");
    } else {
        document.cookies = `${uidName}=${getNewId}; pingsRemaining=5; expires=Thu, 18 Dec 2022 12:00:00 UTC`
    }
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}


///////////////////////////////////////////////////////
//        Interact with Settings                     //
///////////////////////////////////////////////////////
function getPingSetting(name) {
	const form = document.querySelector("#settingOptions form");
	setting = document.getElementById(name);

	if(setting) {
		return Number(setting.value);
	} else {
		console.log("Setting request for " + name + " was not found");
		return false;
	}
}

function getSettingsObject() {
    const setObj = {};

    setObj.color = `hsl(${getPingSetting("hueSlide")}, ${getPingSetting("saturationSlide")}%, ${getPingSetting("lightSlide")}%)`
    setObj.shape = {
        radius: getPingSetting("radiusSlide"),
        amplitude: getPingSetting("amplitudeSlide"),
        frequency: getPingSetting("frequencySlide"),
        precision: getPingSetting("precisionSlide")
    };
    setObj.animation = {
        name: getPingSetting("animationSelect"),
        speed: getPingSetting("animSpeedSlide"),
        delay: getPingSetting("animDelaySlide")
    };
    setObj.sound = getPingSetting("soundSelect")
    setObj.text = {
        content: getPingSetting("textInput"),
        color: `hsl(${getPingSetting("ThueSlide")}, ${getPingSetting("TsaturationSlide")}%, ${getPingSetting("TlightSlide")}%)`
    };
    setObj.pos = {
        x: 500,
        y: 500
    }

    return setObj;
}


///////////////////////////////////////////////////////
//         Ping Shape Generation                     //
///////////////////////////////////////////////////////
function getPingDimensions(r, a, n, cx, cy, precision){
	let dims = ""
	console.log("getting dims");
    let theta = 0;

	for(let i = 0; i <= n * precision; i++){
		let newx = (r + a * Math.sin(n * theta)) * Math.cos(theta) + cx;
		let newy = (r + a * Math.sin(n * theta)) * Math.sin(theta) + cy;

        if(i === 0) {
            dims += ` M ${newx},${newy}`;
        } else {
            dims += ` L ${newx},${newy}`;
        }

        theta = i * Math.PI / (n * precision / 2)
	}
	return dims;
}
function updatePreview() {
	const pings = document.getElementsByClassName("settingPreview");

	for(const ping of pings) {
        //update shape
		let paths = ping.getElementsByTagName("path");
		paths[0].setAttribute("d", getPingDimensions(getPingSetting("radiusSlide"), getPingSetting("amplitudeSlide"), getPingSetting("frequencySlide"), ping.clientWidth / 2, ping.clientHeight / 2, getPingSetting("precisionSlide")));

        //update Color
        paths[0].style.fill = `hsl(${getPingSetting("hueSlide")}, ${getPingSetting("saturationSlide")}%, ${getPingSetting("lightSlide")}%)`
    }
}
