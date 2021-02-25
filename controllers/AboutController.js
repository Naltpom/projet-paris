class AboutController {
	constructor() {
		this.viewPath = "views/about.html";
	}
	executeAfterDomUpdate() {
		console.log("Chargement vue about OK");
	}
}

export default AboutController;
