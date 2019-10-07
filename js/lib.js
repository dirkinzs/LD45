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
//              Local Ping Storage                   //
///////////////////////////////////////////////////////
function saveLocalPing(pingObject) {
    savedPingData.pings[pingObject.id] = pingObject;
}


///////////////////////////////////////////////////////
//      Viewport & local ping display                //
///////////////////////////////////////////////////////
function createPing(event) {
    console.log(`the mouse was clicked at (${event.clientX},${event.clientY})`);
    let newPing = getSettingsObject();

    newPing.pos.x = event.clientX;
    newPing.pos.y = event.clientY;

    saveLocalPing(newPing);
    putPingData();

    updateViewPort();
}

//call this to update the display of pings
function updateViewPort() {
    let viewPort = document.getElementById("viewPort");
    for(let ping in savedPingData.pings) {
        if(!document.getElementById(savedPingData.pings[ping].id)) {
            let newPingEl = createPingElement(savedPingData.pings[ping]);
            console.log(newPingEl);
            viewPort.appendChild(newPingEl);
        }
    }
}

function createPingElement(pingObject) {
    let pingEl = {};
    pingEl.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    pingEl.ping = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pingEl.text = document.createElementNS('http://www.w3.org/2000/svg', 'text');

    pingEl.svg.appendChild(pingEl.ping);
    pingEl.svg.appendChild(pingEl.text);

    pingEl.svg.setAttribute("width", maxPingSize + "px");
    pingEl.svg.setAttribute("height", maxPingSize + "px");
    pingEl.svg.setAttribute("preserveAspectRatio", "xMidYMin")

    pingEl.ping.style.fill = pingObject.color;
    pingEl.ping.setAttribute("d", getPingDimensions(
        pingObject.shape.radius,
        pingObject.shape.amplitude,
        pingObject.shape.frequency,
        maxPingSize / 2,
        maxPingSize / 2,
        pingObject.shape.precision
    ));

    let style = pingEl.svg.style;
    style.position = "absolute";
    style.left = pingObject.pos.x - maxPingSize / 2;
    style.top = pingObject.pos.y - maxPingSize / 2;

    return pingEl.svg;
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
const pingDataUri = "https://api.myjson.com/bins/gmg3v";

function putPingData() {

    if(!putting)
    {
        putting = true

        getAllPingData().then(response => {
            let oldPingData = response;

            console.log("Updating data");
            console.log("old db data:");
            console.log(oldPingData);
            console.log("saved ping data:");
            console.log(savedPingData);

            let newUsers = savedPingData.userIds;
            oldPingData.userIds.forEach(function(userId) {
                if(!newUsers.includes(userId)) {
                    newUsers.push(userId);
                }
            });

            let newPings = savedPingData.pings;
            for(let ping in oldPingData.pings) {
                if(!newPings.hasOwnProperty(ping)) {
                    newPings[ping.id] = ping;
                }
            }

            let newPingData = {
                userIds: newUsers,
                pings: newPings
            }

            console.log("newPingData:");
            console.log(newPingData);

            fetch(pingDataUri, {
                method: "PUT",
                body: JSON.stringify(savedPingData),
                headers: new Headers({
                  'Content-Type': 'application/json'
                }),
            })
            .then(response => response.json())
            .then(data => {
                console.log("data was put" + JSON.stringify(data));
                putting = false;
            })
            .catch(error => {
                console.error(error);
                putting = false;
            });
        });
    }

}

function getAllPingData() {
    return new Promise(function(resolve, reject) {
        fetch(pingDataUri)
            .then(response => response.json())
            .then(data => {
                resolve(data)
            }).catch(error => reject(Error(data.statusText)));
    });
}

///////////////////////////////////////////////////////
//            User Identification                    //
///////////////////////////////////////////////////////
let pingsRemaining = 5;
const uidName = "specialUserId"

function getNewUserId() {
    let id = -1;
    do {
        id = Math.random().toFixed(10).toString();
        id = id.substr(2);
        console.log("new id= " + id);
    }
    while(savedPingData.userIds.includes(id));
    return id;
}

function getNewPingId() {
    let id = -1;
    console.log("getting new ping id");
    console.log(savedPingData);
    do {
        id = Math.random().toFixed(10).toString();
        id = id.substr(2);
    }
    while(savedPingData.pings.hasOwnProperty(id));
    console.log("new id= " + id);
    return id;
}

function validateUser() {
    let cookies = document.cookies;
    if(cookies.includes(uidName)) {
        pingsRemaining = getCookie("pingsRemaining");
    } else {
        document.cookies = `${uidName}=${getNewUserId}; pingsRemaining=5; expires=Thu, 18 Dec 2022 12:00:00 UTC`
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
    let d = new Date();
    setObj.time = d.getTime();
    setObj.id = getNewPingId();

    return setObj;
}


///////////////////////////////////////////////////////
//         Ping Shape Generation                     //
///////////////////////////////////////////////////////
function getPingDimensions(r, a, n, cx, cy, precision){
	let dims = ""

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
