class LoginController {
    constructor() {
        this.viewPath = "views/login.html"
    }

    executeAfterDomUpdate() {
        console.log("Chargement vue login OK")
    }
}

export default LoginController;
