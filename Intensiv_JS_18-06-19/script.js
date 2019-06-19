const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#moveis');

// console.log(searchForm);

function apiSearch(event) {
	event.preventDefault();
	const searchText = document.querySelector('.form-control').value,
		server = 'https://api.themoviedb.org/3/search/multi?api_key=76b8c7ad4d0f6bed7282b09c63628528&language=ru&query=' + searchText;
	requestApi('GET', server);
}

// apiSearch('Какие люди в Голливуде1!!!!');

searchForm.addEventListener('submit', apiSearch);

function requestApi(method, url) {
	const request = new XMLHttpRequest();
	request.open(method, url, true);
	request.send();

	request.addEventListener('readystatechange', () => {
		if (request.readyState !== 4) return;
		if (request.status !== 200) {
			console.log('Error: ' + request.status);
		}
		let inner = '';
		const output = JSON.parse(request.responseText);
		output.results.forEach(function (item){
			let nameItem = item.name || item.title;
			let dateItem = item.release_date;
			// console.log(nameItem);
			// console.log(item);
			// inner += '<div class="col-3">' + nameItem + '</div>'
			inner += `<div class="col-sm-12 col-md-6 col-lg-4 col-xl-3">${nameItem}<br><b>Дата выхода: ${dateItem}</b></div>`;

		});
		movie.innerHTML = inner;

		// console.log(output);
	});
}
