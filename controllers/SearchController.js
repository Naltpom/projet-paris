import app from "../app/app.js";
import Events from "../models/Events.js";

class SearchController {
	constructor() {
		this.viewPath = "views/search.html";
	}
	createYearOptions() {
		const yearSelector = document.querySelector("#date_start");
		const currentYear = new Date().getFullYear();
		const options = [`<option value="">-- Choisir --</option>`];
		for (let i = currentYear + 1; i >= currentYear - 2; i--) {
			options.push(`<option value="${i}">${i}</option>`);
		}
		yearSelector.innerHTML = options.join("");
	}
	onSubmitForm(e) {
		e.preventDefault();
		const q = document.querySelector("#q").value;
		const date_start = document.querySelector("#date_start").value;
		const sort = document.querySelector("#sort").value;
		const eventsHandler = new Events();
		eventsHandler
			.searchEvents(q, date_start, sort)
			.then(this.onEventsReceived.bind(this));
	}
	onEventsReceived(data) {
		const {
			nhits: nbResults,
			npages: nbPages,
			parameters: { q, date_start, sort, page },
			records: eventList,
		} = data;
		console.log(nbResults, nbPages);
		// afficher les évènements (et le paginateur si besoin)
		app.dom.displayEvents(nbResults, nbPages, eventList, page);
		// écouter les clics sur les liens du paginateur
		document.querySelectorAll(".page-link").forEach((link) => {
			link.addEventListener("click", (e) => {
				e.preventDefault();
				const pageRequested = e.currentTarget.dataset.index;
				console.log(pageRequested);
				const eventsHandler = new Events();
				eventsHandler
					.searchEvents(q, date_start, sort, pageRequested)
					.then(this.onEventsReceived.bind(this));
			});
		});
	}
	executeAfterDomUpdate() {
		// Remplir la liste déroulante des années
		this.createYearOptions();
		// Ecouter le submit du formulaire
		document
			.querySelector("#searchForm")
			.addEventListener("submit", this.onSubmitForm.bind(this));
	}
}
export default SearchController;
