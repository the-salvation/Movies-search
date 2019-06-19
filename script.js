const searchForm = document.querySelector("#search-form");
const movie = document.querySelector("#movies");
const urlPoster = 'https://image.tmdb.org/t/p/w500/';

function apiSearch(event) {
  event.preventDefault();
  const searchText = document.querySelector(".form-control").value,
    server =
      "https://api.themoviedb.org/3/search/multi?api_key=3c6b5a6fe41eedd4960be722f6bc85b7&language=ru&query=" +
      searchText;
  movie.innerHTML = "Loading...";
  fetch(server)
    .then(function(value) {
      if (value.status !== 200) {
        return Promise.reject(value.status);
      } 
      return value.json();
    })
    .then(function(output) {
      console.log(output);
      let inner = "";
      output.results.forEach(function (item) {
        let nameItem = item.name || item.title;
        let itemDate = item.first_air_date || item.release_date;
        inner += `<div class="col-12 col-md-4 col-xl-3 item">
        (<img src="${urlPoster + item.poster_path}" alt="${nameItem}">) ? 'No picture'
        <h5>${nameItem}</h5><br>Release Date: <b>${itemDate}</b>
        </div>`;
      });
      movie.innerHTML = inner;
    })
    .catch(function(reason){
      movie.innerHTML = "Oopsee something just went wrong..!";
      console.error("error: " + reason.status);
    });
  }
searchForm.addEventListener("submit", apiSearch);


