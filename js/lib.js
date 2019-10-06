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


///////////////////////////////////////////////////////
//         Ping Shape Generation                     //
///////////////////////////////////////////////////////
function getPingDimensions(r, a, n, cx, cy, precision){
	let dims = "M 0,0"
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
        console.log(i);
	}
	return dims;
}
function updatePreview() {
	const pings = document.getElementsByClassName("settingPreview");

	for(const ping of pings) {
		let paths = ping.getElementsByTagName("path");

		paths[0].setAttribute("d", getPingDimensions(getPingSetting("radiusSlide"), getPingSetting("amplitudeSlide"), getPingSetting("frequencySlide"), 500, 100, getPingSetting("precisionSlide")));
	}
}
