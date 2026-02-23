

import { apiKey, baseUrl } from "./config.js";

// 2. SELEÇÃO DE ELEMENTOS (Pegando os "atores" do HTML)
const searchBtn = document.getElementById('search-btn');
const movieInput = document.getElementById('movie-input');
const container = document.getElementById('result-container');

// 3. FUNÇÃO DE BUSCA (A lógica que você já validou)
async function getMovie(title) {
    try {
        const url = `${baseUrl}?t=${title}&apikey=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.Response === "True") {
            container.innerHTML = `
                <div class="movie-info">
                    <img src="${data.Poster}" alt="Poster">
                    <h2>${data.Title}</h2>
                    <p>${data.Plot}</p>
                </div>
            `;
        } else {
            container.innerHTML = `<p>Movie not found!</p>`;
        }
    } catch (error) {
        console.error("Search error:", error);
    }
}

// 4. O EVENTO (Ouvindo o clique do usuário)
searchBtn.addEventListener('click', () => {
    const movieName = movieInput.value; // Pega o que foi digitado
    if (movieName) {
        getMovie(movieName); // Chama a busca com o nome digitado
    }
});