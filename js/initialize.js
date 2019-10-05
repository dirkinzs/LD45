(function() {

	//initializePOST();

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
		  console.log(JSON.stringify(data));
		  fetch(scriptURL, { method: 'POST', body: data})
			.then(response => console.log('Success!', response))
			.catch(error => console.error('Error!', error.message))
		})
	}
})();
