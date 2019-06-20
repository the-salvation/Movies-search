const searchForm = document.querySelector("#search-form");
const movie = document.querySelector("#movies");
const urlPoster = 'https://image.tmdb.org/t/p/w500/';

function apiSearch(event) {
  event.preventDefault();
  const searchText = document.querySelector(".form-control").value,
    server =
      "https://api.themoviedb.org/3/search/multi?api_key=3c6b5a6fe41eedd4960be722f6bc85b7&language=ru&query=" +
      searchText;
  if (searchText.trim().length === 0){
    movie.innerHTML = '<h2 class="col-12 text-center text-danger">Поле поиска пусто</h2>';
    return
  }
  movie.innerHTML = "Loading...";
  
  fetch(server)
    .then(function(value) {
      if (value.status !== 200) {
        return Promise.reject(new Error (value.status));
      } 
      return value.json();
    })
    .then(function(output) {
      console.log(output);
      let inner = "";
      if(output.results.length === 0){
        inner = '<h2 class="col-12 text-center text-info">Нет такого фильма =(</h2>';
      }; 
      output.results.forEach(function (item) {
        console.log(item);
        let nameItem = item.name || item.title;
        let itemDate = item.first_air_date || item.release_date;
        const poster = item.poster_path ? urlPoster + item.poster_path : './img/missed.jpg';
        let dataInfo = '';
        if(item.media_type !== 'person') dataInfo = `data-id="${item.id}" data-type = "${item.media_type}"`;
        inner += 
        `<div class="col-12 col-md-6 col-xl-3 item">
        <img src="${poster}" class="img_poster" alt="${nameItem}" ${dataInfo}">
        <h5>${nameItem}</h5><br>Release Date: <b>${itemDate}</b>
        </div>`;
      });
      movie.innerHTML = inner;

      
      const media = movie.querySelectorAll('.item');
      media.forEach(function(elem) {
        elem.addEventListener('click', showFullInfo);
      });
    })
    .catch(function(reason){
      movie.innerHTML = "Oopsee something just went wrong..!";
      console.error("error: " + reason.status);
    });
  }
searchForm.addEventListener("submit", apiSearch);

function showFullInfo(){
  console.log(this);
}


