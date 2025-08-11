const API_KEY = '702a7363';
const BASE_URL = 'https://www.omdbapi.com/';

const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const movieList = document.getElementById('movieList');
const movieModal = document.getElementById('movieModal');
const modalDetails = document.getElementById('modalDetails');
const closeButton = document.querySelector('.close-button');

searchButton.addEventListener('click', searchMovies);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchMovies();
    }
});
closeButton.addEventListener('click', closeModal);
window.addEventListener('click', (e) => {
    if (e.target === movieModal) {
        closeModal();
    }
});

async function searchMovies() {
    const searchTerm = searchInput.value.trim();
    if (searchTerm === '') {
        alert('Por favor, digite um título de filme para buscar.');
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${searchTerm}`);
        const data = await response.json();
        
        console.log(data);

        if (data.Response === 'True') {
            displayMovies(data.Search);
        } else {
            movieList.innerHTML = `<p class="error-message">${data.Error}</p>`;
        }
    } catch (error) {
        console.error('Erro ao buscar filmes:', error);
        movieList.innerHTML = `<p class="error-message">Ocorreu um erro ao buscar filmes. Tente novamente mais tarde.</p>`;
    }
}

function displayMovies(movies) {
    movieList.innerHTML = '';
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.dataset.imdbID = movie.imdbID;
        movieCard.innerHTML = `
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150x225?text=No+Image'}" alt="${movie.Title}">
            <h3>${movie.Title}</h3>
            <p>${movie.Year} - ${movie.Type}</p>
        `;
        movieCard.addEventListener('click', () => showMovieDetails(movie.imdbID));
        movieList.appendChild(movieCard);
    });
}

async function showMovieDetails(imdbID) {
    try {
        const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${imdbID}`);
        const data = await response.json();

        if (data.Response === 'True') {
            modalDetails.innerHTML = `
                <img src="${data.Poster !== 'N/A' ? data.Poster : 'https://via.placeholder.com/300x450?text=No+Image'}" alt="${data.Title}">
                <h2>${data.Title} (${data.Year})</h2>
                <p><strong>Gênero:</strong> ${data.Genre}</p>
                <p><strong>Diretor:</strong> ${data.Director}</p>
                <p><strong>Atores:</strong> ${data.Actors}</p>
                <p><strong>Sinopse:</strong> ${data.Plot}</p>
                <p><strong>Avaliação IMDB:</strong> ${data.imdbRating}</p>
            `;
            movieModal.style.display = 'block';
        } else {
            alert('Não foi possível carregar os detalhes do filme.');
        }
    } catch (error) {
        console.error('Erro ao buscar detalhes do filme:', error);
        alert('Ocorreu um erro ao carregar os detalhes do filme.');
    }
}

function closeModal() {
    movieModal.style.display = 'none';
}


const body = document.body;
body.classList.add('dark-mode');

