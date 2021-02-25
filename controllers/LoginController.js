
import app from "../app/app.js";

class LoginController {
    constructor() {
        this.viewPath = "views/login.html"
    }

    executeAfterDomUpdate() {
		document
			.querySelector("#githubLoginBtn")
			.addEventListener("click", app.connexion.signInWithGithub);
        
    }
    
}

export default LoginController;
