const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const resultsContainer = document.getElementById("movie-results");
const modal = document.getElementById("movie-modal");
const modalTitle = modal.querySelector(".modal__title");
const modalPara = modal.querySelector("#movie-description");
const modalPoster = document.getElementById("modal-poster");
const titleElement = document.getElementById("results");

const API_KEY = "8b1ff702"; 

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  const query = input.value.trim();
  if (!query) return;

  resultsContainer.innerHTML = `<p>Loading...</p>`;

  try {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`);
    const data = await response.json();

    if (data.Response === "False") {
      resultsContainer.innerHTML = `<p>No results found.</p>`;
      return;
    }

    displayMovies(data.Search);
  } catch (error) {
    resultsContainer.innerHTML = `<p>Something went wrong. Please try again later.</p>`;
    console.error(error);
  }
});

function displayMovies(movies) {
  if (movies.length > 0) {
    titleElement.style.display = "block";
  }
  

  resultsContainer.innerHTML = movies.map(movie => `
    <div class="movie__card" onclick="showModal('${movie.imdbID}')">
      <img src="${movie.Poster !== 'N/A' ? movie.Poster : './assets/no-image.png'}" alt="${movie.Title}" />
      <div class="movie__title">${movie.Title}</div>
      <div class="movie__year">${movie.Year}</div>
    </div>
  `).join("");
}

function getRottenTomatoesRating(ratingsArray) {
  const rt = ratingsArray.find(rating => rating.Source === "Rotten Tomatoes");
  return rt ? rt.Value : null;
}

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
};

function toggleModal() {
  modal.classList.remove("show");
}

document.querySelector(".modal__exit").addEventListener("click", toggleModal);
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") toggleModal();
});



