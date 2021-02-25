const API_ENDPOINT = "https://opendata.paris.fr/api/records/1.0/search/";
const RESULTS_PER_PAGE = 12;

class Events {
	constructor() {
		this._queryParams = {
			dataset: "que-faire-a-paris-",
			rows: RESULTS_PER_PAGE,
		};
	}

	buildQueryString(q, date_start, sort, page) {
		this._queryParams.q = q;
		this._queryParams.sort = sort;
		this._queryParams.start = RESULTS_PER_PAGE * (page - 1);
		if (date_start !== "") {
			this._queryParams.facet = "date_start";
			this._queryParams["refine.date_start"] = date_start;
		}
		console.log(this._queryParams);
		return Object.entries(this._queryParams)
			.map(([key, value]) => `${key}=${value}`)
			.join("&");
	}

	searchEvents(q, date_start, sort, page = 1) {
		const queryString = this.buildQueryString(q, date_start, sort, page);
		return fetch(`${API_ENDPOINT}?${queryString}`)
			.then((res) => res.json())
			.then(({ nhits, records }) => {
				return {
					nhits,
					npages: this.computeNbOfPages(nhits),
					parameters: { q, date_start, sort, page },
					records: records.map(
						({
							fields: { title, date_description, cover_url, cover_alt },
						}) => ({
							title,
							date_description,
							cover_url,
							cover_alt,
						})
					),
				};
			});
	}

	computeNbOfPages(nbResults) {
		return Math.ceil(nbResults / RESULTS_PER_PAGE);
	}
}

export default Events;
