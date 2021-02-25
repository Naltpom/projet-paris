class HomeController {
    constructor() {
        this.viewPath = "views/home.html"
    }

    executeAfterDomUpdate() {
        console.log("Chargement vue home OK")
    }
}

export default HomeController;
