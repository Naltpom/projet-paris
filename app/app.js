import firebase from "firebase/app";
import "firebase/auth";

let app = {
	// ----------------------------------------------------------------------------------------------------------------
	// MANIPULATION DU DOM DE L'APPLICATION
	// ----------------------------------------------------------------------------------------------------------------
	dom: {
		displayEvents: (nbResults, nbPages, eventList, currentPage = 1) => {
			const eventTags = eventList.map(
				({ title, date_description, cover_url, cover_alt }) => `
				<li class="col-12 col-sm-6 col-md-4 col-lg-3 text-center list-group">
					<img src="${cover_url}" alt="${cover_alt}" class="img-fluid">
					<h6>${title}</h6>
					<p>${date_description}</p>
				</li>`
			);
			document.querySelector("#eventList").innerHTML = `
				<h5>${nbResults} résultats pour votre recherche</h5>
				<ul class="row">
					${eventTags.join("")}
				</ul>
			`;
			if (nbPages > 1) {
				app.dom.displayPaginator(nbPages, Number(currentPage));
			}
		},
		displayPaginator: (nbPages, currentPage = 1) => {
			let displayedLinks;
			if (currentPage === 1) {
				displayedLinks = [1, 2, 3];
			} else if (currentPage === nbPages) {
				displayedLinks = [currentPage - 2, currentPage - 1, currentPage];
			} else {
				displayedLinks = [currentPage - 1, currentPage, currentPage + 1];
			}

			const pagesTags = displayedLinks.map(
				(n) => `
				<li class="page-item ${n === currentPage ? "active" : ""}">
				<a class="page-link" href="#" data-index="${n}">${n}${
					n === currentPage ? ` <span class="sr-only">(current)</span>` : ""
				}</a>
				</li>
			`
			);
			document.querySelector("#eventList").innerHTML += `
			<nav aria-label="Pagination résultats">
				<ul class="pagination">
					<li class="page-item ${currentPage === 1 ? "disabled" : ""}">
						<a class="page-link" href="#" tabindex="-1" data-index="${
							currentPage - 1
						}">Previous</a>
					</li>
					${pagesTags.join("")}
					<li class="page-item ${currentPage === nbPages ? "disabled" : ""}">
						<a class="page-link" href="#" data-index="${currentPage + 1}">Next</a>
					</li>
				</ul>
			</nav>
			`;
		},
		checkLoginState(user = null) {
			const links = user !== null ? [
				{title: 'Accueil', href: '/#home'},
				{title: 'Recherche', href: '/#search'},
				{title: 'A propos', href: '/#about'},
				{title: 'Déconnexion', href: '/#logout'},
			] : [
				{title: 'Accueil', href: '/#home'},
				{title: 'A propos', href: '/#about'},
				{title: 'Connexion', href: '/#login'},
			];

			document.querySelector("#main-menu > ul").innerHTML = links.map(
				(link) => `
				<li class="nav-item">
					<a class="nav-link" href="${link.href}">${link.title}</a>
				</li>`
			).join("");
			console.log(user)
		}
	},

	// ----------------------------------------------------------------------------------------------------------------
	// ARCHITECTURE MVC DE L'APPLICATION
	// ----------------------------------------------------------------------------------------------------------------
	mvc: {
		router: null,
		dispatchRoute: (controllerInstance) => {
			fetch(controllerInstance.viewPath)
				.then((res) => res.text())
				.then((htmlString) => {
					document.querySelector("main").innerHTML = htmlString;
					controllerInstance.executeAfterDomUpdate();
				});
		},
	},

	connexion: {
		githubProvider: new firebase.auth.GithubAuthProvider(),
		signInWithGithub: () => {
			firebase
                .auth()
                .signInWithPopup(app.connexion.githubProvider)
                .then((result) => {
					app.dom.checkLoginState({displayName: result.user.displayName || result.additionalUserInfo.username, avatar: result.user.photoURL})
					app.dom.router.navigateTo("home");
			}).catch((error) => {
                    console.log("erreur" + error.message)
				});
		}
	},
	signOut: () => {
		firebase.auth().signOut().then(() => {

		}).catch((error) => {
			console.log(error.message)
		})
	}
};

// L'application est exportée afin d'être accessible par d'autres modules.
export default app;
