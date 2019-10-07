let savedPingData = {};
let loading = true;
let putting = false;
const maxPingSize = 150;
let hasEdited = false;

window.addEventListener("DOMContentLoaded", function() {
	console.log("Initializing DOM");
	initializePingPreview();
	updatePreview();
	getAllPingData().then(function(response) {
		savedPingData = response;
		console.log("savedPingData: " + JSON.stringify(savedPingData));
		initializeViewPort();
	});
	hideUnfinishedSettings();
});


function initializePingPreview(){
	const settings = document.getElementsByClassName("input");
	for(let i = 0; i < settings.length; i++){
		settings[i].addEventListener("change", updatePreview);
	}
}

function initializeViewPort() {
updateViewPort();
	setTimeout(function() {
		document.getElementById("viewPort").addEventListener("click", createPing);
		loading = false;
		document.getElementById("loadingScreen").style.opacity = 0;
		document.getElementById("loadingScreen").style.pointerEvents = "none";


	}, 4000);
}

function hideUnfinishedSettings() {

}
