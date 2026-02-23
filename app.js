// 1. Imports: Getting secure configurations from local module
import { apiKey, baseUrl } from './config.js';

// 2. DOM Elements: Selecting interface components
const searchBtn = document.getElementById('search-btn');
const movieInput = document.getElementById('movie-input');
const container = document.getElementById('result-container');
const favListContainer = document.getElementById('favorites-list');

/**
 * Fetches movie data from OMDb API and renders the result
 * @param {string} title - The movie title to search for
 */
async function getMovie(title) {
    try {
        // UI Feedback: Show loading spinner before fetching
        container.innerHTML = '<div class="loader"></div>';

        const response = await fetch(`${baseUrl}?t=${title}&apikey=${apiKey}`);
        const data = await response.json();

        if (data.Response === "True") {
            // Render movie card with dynamic data
            container.innerHTML = `
                <div class="movie-info">
                    <img src="${data.Poster}" alt="${data.Title} Poster">
                    <h2>${data.Title}</h2>
                    <p>${data.Plot}</p>
                    <button id="fav-btn" class="btn-favorite">⭐ Add to Favorites</button>
                </div>
            `;

            // Persistence: Save the last searched movie title
            localStorage.setItem('lastMovie', title);

            // Add event listener to the newly created favorite button
            document.getElementById('fav-btn').addEventListener('click', () => saveFavorite(data));
        } else {
            // Handle cases where movie title is not found
            container.innerHTML = `<p class="error-msg">Movie not found! Try another one.</p>`;
        }
    } catch (error) {
        // Network or API connection error handling
        container.innerHTML = `<p class="error-msg">Connection error. Please try again.</p>`;
        console.error("API Error:", error);
    }
}

/**
 * Saves a movie object to the browser's LocalStorage
 * @param {object} movie - The movie data object
 */
function saveFavorite(movie) {
    // Get existing favorites or initialize an empty array
    let favorites = JSON.parse(localStorage.getItem('myFavorites')) || [];

    // Check for duplicates using the unique imdbID
    const exists = favorites.some(fav => fav.imdbID === movie.imdbID);

    if (!exists) {
        favorites.push({
            imdbID: movie.imdbID,
            Title: movie.Title,
            Poster: movie.Poster
        });
        localStorage.setItem('myFavorites', JSON.stringify(favorites));
        renderFavorites(); // Refresh the list on UI
    } else {
        alert("This movie is already in your favorites!");
    }
}

/**
 * Retrieves favorites from storage and displays them in the grid
 */
function renderFavorites() {
    const favorites = JSON.parse(localStorage.getItem('myFavorites')) || [];
    
    // Mapping array to HTML string and joining
    favListContainer.innerHTML = favorites.map(movie => `
        <div class="fav-item">
            <img src="${movie.Poster}" alt="Poster">
            <div class="fav-info">
                <span>${movie.Title}</span>
                <button onclick="removeFavorite('${movie.imdbID}')" title="Remove">🗑️</button>
            </div>
        </div>
    `).join('');
}

/**
 * Removes a specific movie from the favorites list
 * Exposed to window object to work with module scope
 */
window.removeFavorite = (id) => {
    let favorites = JSON.parse(localStorage.getItem('myFavorites')) || [];
    // Filter out the selected movie ID
    favorites = favorites.filter(movie => movie.imdbID !== id);
    localStorage.setItem('myFavorites', JSON.stringify(favorites));
    renderFavorites();
};

// Event Listeners for search actions
searchBtn.addEventListener('click', () => {
    if (movieInput.value.trim() !== "") {
        getMovie(movieInput.value);
    }
});

// Initialization: Load data when the page finishes loading
window.addEventListener('DOMContentLoaded', () => {
    // Restore the last searched movie for better UX
    const lastSeen = localStorage.getItem('lastMovie');
    if (lastSeen) getMovie(lastSeen);

    // Initial render of saved favorites
    renderFavorites();
});