const apiKey = 'e466cb8c';
let currentPage = 1;
let totalResults = 0;
const resultsPerPage = 10;

const movieDetails = document.getElementById('movieDetails');
const container = document.getElementsByClassName('container')[0];

const debounceDelay = 300; // milliseconds
let debounceTimer;


function fetchMovies(searchQuery, page) {
    const apiUrl = `https://www.omdbapi.com/?apikey=${apiKey}&s=${searchQuery}&page=${page}`;
    return fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            totalResults = parseInt(data.totalResults);
            return data.Search || [];
        });
}

function displayMovies(movies) {
    const movieContainer = document.getElementById('movieContainer');
    movieContainer.innerHTML = '';

    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');
        movieElement.innerHTML = `
            <img src="${movie.Poster}" alt="${movie.Title}">
            <h3>${movie.Title}</h3>
        `;
        movieElement.addEventListener('click', () => {
            displayMovieDetails(movie.imdbID);
        });
        movieContainer.appendChild(movieElement);
    });
}

function displayMovieDetails(imdbID) {
    const apiUrl = `https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {

            movieDetails.innerHTML = `
                <h2>${data.Title}</h2>
                <img class="poster" src="${data.Poster}" alt="${data.Title}">
                <p><strong>Plot:</strong> ${data.Plot}</p>
                <p><strong>Director:</strong> ${data.Director}</p>
                <p><strong>Actors:</strong> ${data.Actors}</p>
                <p><strong>Genre:</strong> ${data.Genre}</p>
                <p><strong>Released:</strong> ${data.Released}</p>
                <p><strong>IMDB Rating:</strong> ${data.imdbRating}</p>
            `;
            movieDetails.style.display = "block";
        });
}

function updatePagination() {
    const pageInfo = document.getElementById('pageInfo');
    pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(totalResults / resultsPerPage)}`;

    const prevButton = document.getElementById('prevButton');
    prevButton.disabled = currentPage === 1;

    const nextButton = document.getElementById('nextButton');
    nextButton.disabled = currentPage === Math.ceil(totalResults / resultsPerPage);
}

// document.getElementById('searchButton').addEventListener('click', () => {
//     const searchQuery = document.getElementById('searchInput').value.trim();
//     if (searchQuery === '') {
//         alert('Please enter a search query.');
//         return;
//     }

//     fetchMovies(searchQuery, currentPage)
//         .then(movies => {
//             displayMovies(movies);
//             updatePagination();
//         });
// });


// Search input event listener with debouncing
document.getElementById('searchInput').addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        const searchQuery = document.getElementById('searchInput').value.trim();
        if (searchQuery === '') {
            alert('Please enter a search query.');
            return;
        }

        fetchMovies(searchQuery, currentPage)
            .then(movies => {
                displayMovies(movies);
                updatePagination();
            });
    }, debounceDelay);
});


document.getElementById('prevButton').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchMovies(document.getElementById('searchInput').value.trim(), currentPage)
            .then(movies => {
                displayMovies(movies);
                updatePagination();
            });
    }
});

document.getElementById('nextButton').addEventListener('click', () => {
    if (currentPage < Math.ceil(totalResults / resultsPerPage)) {
        currentPage++;
        fetchMovies(document.getElementById('searchInput').value.trim(), currentPage)
            .then(movies => {
                displayMovies(movies);
                updatePagination();
            });
    }
});


// Close modal when clicking outside the modal
window.addEventListener("click", (event) => {
    if (event.target !== movieDetails) {
        movieDetails.style.display = "none";
    }
});
