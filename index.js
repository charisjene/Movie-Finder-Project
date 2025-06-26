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

function toggleModal() {
  modal.classList.remove("show");
}

async function fetchMovieById(imdbID) {
  const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}`);
  const data = await response.json();
  return data;
}

async function loadStaffPicks() {
  staffPicksContainer.innerHTML = "<p>Loading staff picks...</p>";

  const movieData = await Promise.all(staffPickIDs.map(id => fetchMovieById(id)));

staffPicksContainer.innerHTML = movieData.map(movie => `
  <div class="movie__card click" onclick="showModal('${movie.imdbID}')">
    <img src="${movie.Poster !== 'N/A' ? movie.Poster : './assets/no-image.png'}" alt="${movie.Title}" />
    <div class="movie__title">${movie.Title}</div>
    <div class="movie__year">${movie.Year}</div>
  </div>
`).join("");
}


loadStaffPicks();
const modal = document.getElementById("movie-modal");
const modalTitle = modal.querySelector(".modal__title");
const modalPara = modal.querySelector("#movie-description");
const modalPoster = modal.querySelector("#modal-poster");



window.showModal = async function(imdbID) {
  try {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}`);
    const data = await response.json();

    modalTitle.textContent = data.Title;
    modalPoster.src = data.Poster !== 'N/A' ? data.Poster : './assets/no-image.png';
    modalPoster.alt = `${data.Title} poster`;

    modalPara.innerHTML = `
      <strong>Plot:</strong> ${data.Plot || "No plot available."}<br><br>
      <strong>Rated:</strong> ${data.Rated || "N/A"}<br>
      <strong>IMDb Rating:</strong> ${data.imdbRating || "N/A"}<br>
      <strong>Rotten Tomatoes:</strong> ${getRottenTomatoesRating(data.Ratings) || "N/A"}
    `;

    modal.classList.add("show");
  } catch (error) {
    console.error("Modal error:", error);
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") toggleModal();
});
function getRottenTomatoesRating(ratingsArray) {
  const rt = ratingsArray.find(rating => rating.Source === "Rotten Tomatoes");
  return rt ? rt.Value : null;
}