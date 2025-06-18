//API http://www.omdbapi.com/?apikey=[8b1ff702]&
const API_KEY = "8b1ff702";
const staffPicksContainer = document.getElementById("staff-picks");

const staffPickIDs = [
    "tt0241527", // Harry Potter 
    "tt31193180", // Sinners
    "tt0151804", // Office Space
    "tt0903624", // The Hobbit
    "tt0119116", // The Fifth Element   
    "tt26470109", // Oddity
    "tt1478338", //Bridesmaids
    "tt0240515", // Freddy got fingered
];

async function fetchMovieById(imdbID) {
  const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}`);
  const data = await response.json();
  return data;
}

async function loadStaffPicks() {
  staffPicksContainer.innerHTML = "<p>Loading staff picks...</p>";

  const movieData = await Promise.all(staffPickIDs.map(id => fetchMovieById(id)));

  staffPicksContainer.innerHTML = movieData.map(movie => `
    <div class="movie__card">
      <img src="${movie.Poster !== 'N/A' ? movie.Poster : './assets/no-image.png'}" alt="${movie.Title}" />
      <div class="movie__title">${movie.Title}</div>
      <div class="movie__year">${movie.Year}</div>
    </div>
  `).join("");
}


loadStaffPicks();