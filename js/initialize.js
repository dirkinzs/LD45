let savedPingData = {};
let loading = true;
let putting = false;
const maxPingSize = 150;

window.addEventListener("DOMContentLoaded", function() {
	console.log("Initializing DOM");
	initializePingPreview();
	updatePreview();
	getAllPingData().then(function(response) {
		savedPingData = response;
		console.log("savedPingData: " + JSON.stringify(savedPingData));
		initializeViewPort();
	});
});


function initializePingPreview(){
	const settings = document.getElementsByClassName("input");
	for(let i = 0; i < settings.length; i++){
		settings[i].addEventListener("change", updatePreview);
	}
}

function initializeViewPort() {
	document.getElementById("viewPort").addEventListener("click", createPing);
	updateViewPort();
	loading = false;
}
