const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const resultsContainer = document.getElementById("movie-results");
const loadingSpinner = document.getElementById("loading-spinner");
const modal = document.getElementById("movie-modal");
const modalTitle = modal.querySelector(".modal__title");
const modalPara = modal.querySelector("#movie-description");
const modalPoster = document.getElementById("modal-poster");
const titleElement = document.getElementById("results");

const API_KEY = "8b1ff702";

// Store fetched movies in a variable
let moviesData = [];

// Show Modal
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

// Search and fetch movies
form.addEventListener("submit", async function (e) {
  e.preventDefault();
  const query = input.value.trim();
  if (!query) return;

  // Show the loading spinner and hide the results
  loadingSpinner.style.display = "block";
  resultsContainer.innerHTML = ""; 

  setTimeout(async function() {
    try {
      const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`);
      const data = await response.json();

      if (data.Response === "False") {
        resultsContainer.innerHTML = `<p>No results found.</p>`;
        return;
      }

      

      // Fetch full data for each movie
      moviesData = await Promise.all(data.Search.map(async (movie) => {
      const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`);
        return await res.json();
      }));

      // Log the entire movie data object to inspect
      console.log(moviesData); // Check the structure of the movie data

      // Display the movies
      displayMovies(moviesData);
    } catch (error) {
      resultsContainer.innerHTML = `<p>Something went wrong. Please try again later.</p>`;
      console.error(error);
    } finally {
      // Hide the spinner once results are displayed
      loadingSpinner.style.display = "none";
    }
  }, 800); 
});

// Display movies
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

// Get Rotten Tomatoes Rating
function getRottenTomatoesRating(ratingsArray) {
  const rt = ratingsArray.find(rating => rating.Source === "Rotten Tomatoes");
  return rt ? rt.Value : null;
}

// Filter function to handle sorting by date
function filterMovies(event) {
  const filter = event.target.value;
  
  if (!moviesData || moviesData.length === 0) return;

  // Sort the movies based on the selected filter
  if (filter === 'NEWEST_TO_OLDEST') {
    // Sort by release date (newest to oldest)
    moviesData.sort((a, b) => parseInt(b.Year) - parseInt(a.Year)); // Compare year values
  }
  else if (filter === 'OLDEST_TO_NEWEST') {
    // Sort by release date (oldest to newest)
    moviesData.sort((a, b) => parseInt(a.Year) - parseInt(b.Year)); // Compare year values
  }
  else if (filter === 'RATING') {
    // Sort by IMDb rating (highest to lowest)
    moviesData.sort((a, b) => {
      // Handle cases where imdbRating is missing (set it to 0 or NaN)
      const ratingA = a.imdbRating ? parseFloat(a.imdbRating) : 0;
      const ratingB = b.imdbRating ? parseFloat(b.imdbRating) : 0;
      
      
      // Return the comparison result: descending order (highest first)
      return ratingB - ratingA; 
      
    });
  }

  // Update the displayed list of movies
  displayMovies(moviesData); // Re-display the sorted movies
}


// Add event listener for the filter dropdown
document.getElementById("filter").addEventListener("change", filterMovies);