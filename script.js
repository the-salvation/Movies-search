const searchForm = document.querySelector("#search-form");
const movie = document.querySelector("#movies");
// const urlPoster = 'https://image.tmdb.org/t/p/w500/';
const apiKey = '3c6b5a6fe41eedd4960be722f6bc85b7';
const apiHost = 'https://api.themoviedb.org';
const imgHost = 'https://image.tmdb.org/t/p/w500';
// const trends = `${apiHost}/3/trending/all/day?api_key=${apiKey}&language=ru`;

function apiSearch(event) {
  event.preventDefault();
  const searchText = document.querySelector(".form-control").value;
    
  if (searchText.trim().length === 0){
    movie.innerHTML = '<h2 class="col-12 text-center text-danger">Поле поиска пусто</h2>';
    return;
  }
    movie.innerHTML = '<div class="spinner"></div>';
  fetch(`${apiHost}/3/search/multi?api_key=${apiKey}&language=ru&query= + ${searchText}`)
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
      } 
      output.results.forEach(function (item) {

        // console.log(item);
        let nameItem = item.name || item.title;
        let itemDate = item.first_air_date || item.release_date;
        const poster = item.poster_path ? imgHost + item.poster_path : './img/missed.jpg';
        let dataInfo = '';
        
        if(item.media_type !== 'person') dataInfo = `data-id="${item.id}" data-type = "${item.media_type}"`;
        
        inner += 
        `<div class="col-12 col-md-6 col-xl-3 item">
        <img src="${poster}" class="img_poster" alt="${nameItem}" ${dataInfo}>
        <h5>${nameItem}</h5><br>Release Date: <b>${itemDate}</b>
        </div>`;
      });
      movie.innerHTML = inner;
      // const dataInfo = '';
      addEventMedia();
    })
    .catch(function(reason){
      movie.innerHTML = "Oopsee something just went wrong..!";
      console.error("error: " + reason.status);
    });
  }
searchForm.addEventListener("submit", apiSearch);

function addEventMedia(){
  const media = movie.querySelectorAll('img[data-id]');
      media.forEach(function(elem) {
        elem.style.cursor = 'pointer';
        elem.addEventListener('click', showFullInfo);
      });
}

function showFullInfo(){
  let url = '';
  if(this.dataset.type === 'movie'){
    url = `${apiHost}/3/movie/' + ${this.dataset.id} + '?api_key=${apiKey}&language=ru`    
  }else if (this.dataset.type === 'tv'){
    url = `${apiHost}/3/tv/' + ${this.dataset.id} + '?api_key=${apiKey}&language=ru`
  }else{
    movie.innerHTML = '<h2 class="col-12 text-center text-danger">Произошла ошибка. Повторите позже</h2>'
  }

  const mediaType = this.dataset.type;

  fetch(url)
    .then(function(value) {
      if (value.status !== 200) {
        return Promise.reject(new Error (value.status));
      }
      return value.json();
    })
    .then(function(output) {
      // console.log(output);
      let genres = '',
        nameItem = output.name || output.title,
        img = output.poster_path === null ? `<img src="./img/missed.jpg" class="img-fluid img-thumbnail mb-2" alt="no poster"> ` : ` <img src="${imgHost}${output.poster_path}" class="img-fluid img-thumbnail mb-2" alt="${nameItem}"}>`

      output.genres.forEach((genre) => { genres += genre.name + ', ' })
      genres = genres.substr(0, genres.length - 2)

      movie.innerHTML = `
      <h2 class="col-12 text-center text-info mb-5" >${output.name || output.title}</h2 >
      
      <div class ="col-4 bg-light p-5"> 
       ${img}
       ${(output.homepage != 0) ? `<p class="text-center text-info mb-2"> <a href="${output.homepage}" target="_blank">Официальная страница</a></p>` : ''}
       ${(output.imdb_id) ? `<p class="text-center text-info mb-2"> <a href="https://www.imdb.com/title/${output.imdb_id}" target="_blank">Страница на www.imdb.com</a></p>` : ''}
      </div>
      <div class ="col-8 bg-light p-5"> 
      <p class="badge badge-danger p-3">Рейтинг: ${output.vote_average}</p>
      <p class="badge badge-info p-3">Статус: ${output.status}</p>
      <p class="badge badge-success p-3">Премьера: ${output.first_air_date || output.release_date}</p>
      ${(output.last_episode_to_air) ? `<p class="badge badge-warning p-3">${output.number_of_seasons} сезон. Вышло ${output.last_episode_to_air.episode_number} серий </p>` : ''}
      ${(genres.length != 0) ? `<p class="badge badge-info p-3">Жанр: ${genres}</p>` : '' }
      ${(output.overview.length != 0) ? `<div class="mt-5">${output.overview} </div>` : `<h4 class="col-12 text-center text-danger mt-5"> Информация о фильме отсутствует </h4>`}
      </div>
      <br>
      <div class='youtube'></div>
      `;

      getVideo(mediaType, output.id);

    })
    .catch(function(reason){
      movie.innerHTML = "Oopsee something just went wrong..!";
      console.error("error: " + reason.status);
    });
}

document.addEventListener('DOMContentLoaded', function(){
  fetch('https://api.themoviedb.org/3/trending/all/week?api_key=3c6b5a6fe41eedd4960be722f6bc85b7&language=ru')
    .then(function(value) {
      if (value.status !== 200) {
        return Promise.reject(new Error (value.status));
      } 
      return value.json();
    })
    .then(function(output) {
      console.log(output);
      let inner = '<h4 class="col-12 text-center text-info">Популярные за неделю!</h4>';
      if(output.results.length === 0){
        inner = '<h2 class="col-12 text-center text-info">По вашему запросу ничего не найдено</h2>';
      }; 
      output.results.forEach(function (item) {
        // console.log(item);
        let nameItem = item.name || item.title;
        let mediaType = item.title ? 'movie' : 'tv';
        let itemDate = item.first_air_date || item.release_date;
        const poster = item.poster_path ? imgHost + item.poster_path : './img/missed.jpg';
        let dataInfo = `data-id="${item.id}" data-type = "${mediaType}"`;
       
        
        inner += 
        `<div class="col-12 col-md-6 col-xl-3 item">
        <img src="${poster}" class="img_poster" alt="${nameItem}" ${dataInfo}>
        <h5>${nameItem}</h5><br>Release Date: <b>${itemDate}</b>
        </div>`;
      });
      movie.innerHTML = inner;
      // const dataInfo = '';
      addEventMedia();
    })
    .catch(function(reason){
      movie.innerHTML = "Oopsee something just went wrong..!";
      console.error("error: " + reason.status);
    });
});

const getVideo = (type, id) => {
  let youtube = movie.querySelector('.youtube');

  fetch(`${apiHost}/3/${type}/${id}/videos?api_key=${apiKey}&language=ru`)
    .then((value) => {
      if (value.status !== 200) {
        return Promise.reject(new Error (value.status));
      } 
      return value.json();
    })
    .then((output) => {
      console.log(output);
      let videoFrame = '<h5 class="col-12 text-center text-info mt-5 mb-5"> Фрагменты из видео </h5>';

      if(output.results.length === 0){
        videoFrame = '<h5 class="col-12 text-center text-danger mt-5 mb-5"> К сожалению видео отсутствует </h5>'
      }

      output.results.forEach((item)=>{
        console.log(item.site);
        if (item.site == "Youtube") {
          videoFrame += `<iframe width="560" height="315" src="https://www.youtube.com/embed/${item.key}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>` + ' ';
        }
      });
      
      youtube.innerHTML = videoFrame;

    })
    .catch((reason) => {
      youtube.innerHTML = "По вашему запросу видео отсутствует";
      console.error("error: " + reason.status);
    });



  // youtube.innerHTML = type;
}
