(function() {

	window.addEventListener("DOMContentLoaded", function() {
		console.log("Initializing DOM");
		//initializePOST();
		initializePingPreview();
		updatePreview();
		//testingSpreadsheetAccess();
	});

	/**
	 * @function initializePOST
	 * @description initializes the submision form
	 */
	function initializePOST(){
		const scriptURL = 'https://script.google.com/macros/s/AKfycbxDCXLMs7JjXIZM-4JOfVHiTndJgRuiAA8sS9FbC8gUniiB-2vG/exec'
		const form = document.forms['submit-to-google-sheet']

		form.addEventListener('submit', e => {
		  e.preventDefault();

		  const data = new FormData();
		  data.append("email", "apps");

		  fetch(scriptURL, { method: 'POST', body: data})
			.then(response => console.log('Success!', response))
			.catch(error => console.error('Error!', error.message))
		})
	}


	function initializePingPreview(){
		const settings = document.getElementsByClassName("input");
		for(let i = 0; i < settings.length; i++){
			settings[i].addEventListener("change", updatePreview);
		}
	}

	function testingSpreadsheetAccess() {
		const sheetURL = "https://cors-anywhere.herokuapp.com/https://sheets.googleapis.com/v4/spreadsheets/187xIFM7MPciWJ8GaVKaVwm-mH1DGog-MYg96RiB1TZA"
		fetch(sheetURL, {method: "GET", cache: "no-store"})
		.then(function(response) {
			console.log(response);
		}).catch(function(response) {
			console.log(response);
		});
	}


})();
