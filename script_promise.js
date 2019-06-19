const searchForm = document.querySelector("#search-form");
const movie = document.querySelector("#movies");

function apiSearch(event) {
  event.preventDefault();
  const searchText = document.querySelector(".form-control").value,
    server = "https://api.themoviedb.org/3/search/multi?api_key=3c6b5a6fe41eedd4960be722f6bc85b7&language=ru&query=" + searchText;
    movie.innerHTML = "Loading...";
    requestApi("GET", server).then(function (result) {
      const output = JSON.parse(result);
      console.log(output);

      let inner = "";

      output.results.forEach(function(item) {
        let nameItem = item.name || item.title;
        let itemDate = item.first_air_date || item.release_date;

        console.log(nameItem);
        inner += `<div class="col-12 col-md-4 col-xl-3">${nameItem}<br>Release Date: ${itemDate}</div>`;
      });
      movie.innerHTML = inner;
    })
    .catch(function(reason){
        movie.innerHTML = 'Oopsee something just went wrong..!';
        console.log('error: ' + reason.status);
    });
}
// apiSearch('hi');
searchForm.addEventListener("submit", apiSearch);

function requestApi(method, url) {
  return new Promise(function(resolve, reject) {
    const request = new XMLHttpRequest();
    request.open(method, url);

    request.addEventListener("load", function() {
      if (request.status !== 200) {
        reject({
          status: request.status
        });
        return;
      }

      resolve(request.response);
    });

    request.addEventListener("error", function() {
      reject({
        status: request.status
      });
    });
    request.send();
  });

  // console.log(request);

  // request.addEventListener('readystatechange', () => {
  //     if (request.readyState !== 4) return;
  //     movie.innerHTML = 'Loading...';
  //     if (request.status !== 200){
  //         movie.innerHTML = 'Something went wrong';
  //         console.log('error: ' + request.status);
  //         return;
  //     }

  //     console.log(output);
  // });

  // return url;
}
