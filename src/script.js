const API_KEY = '702a7363';
const BASE_URL = 'https://www.omdbapi.com/';

const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const movieList = document.getElementById('movieList');
const movieModal = document.getElementById('movieModal');
const modalDetails = document.getElementById('modalDetails');
const closeButton = document.querySelector('.close-button');

// paginação
const paginationContainer = document.getElementById('pagination');
const firstPageButton = document.getElementById('firstPage');
const prevPageButton = document.getElementById('prevPage');
const nextPageButton = document.getElementById('nextPage');
const lastPageButton = document.getElementById('lastPage');
const currentPageSpan = document.getElementById('currentPage');

// Botão de tema
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

let currentPage = 1;
let totalResults = 0;
let currentSearchTerm = '';

paginationContainer.style.display = 'none';

searchButton.addEventListener('click', () => {
    currentPage = 1;
    searchMovies();
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        currentPage = 1;
        searchMovies();
    }
});

closeButton.addEventListener('click', closeModal);

window.addEventListener('click', (e) => {
    if (e.target === movieModal) {
        closeModal();
    }
});

firstPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage = 1;
        searchMovies(currentSearchTerm, currentPage);
    }
});

prevPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        searchMovies(currentSearchTerm, currentPage);
    }
});

nextPageButton.addEventListener('click', () => {
    if (currentPage * 10 < totalResults) {
        currentPage++;
        searchMovies(currentSearchTerm, currentPage);
    }
});

lastPageButton.addEventListener('click', () => {
    const lastPage = Math.ceil(totalResults / 10);
    if (currentPage < lastPage) {
        currentPage = lastPage;
        searchMovies(currentSearchTerm, currentPage);
    }
});

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');

    // Salvar preferência do usuário
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});

// Inicializar com tema de preferência
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
} else {
    body.classList.remove('dark-mode');
}

async function searchMovies(searchTerm = searchInput.value.trim(), page = currentPage) {
    if (searchTerm === '') {
        alert('Por favor, digite um título de filme para buscar.');
        movieList.innerHTML = '';
        paginationContainer.style.display = 'none';
        return;
    }

    currentSearchTerm = searchTerm;

    try {
        const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${searchTerm}&page=${page}`);
        const data = await response.json();

        if (data.Response === 'True') {
            totalResults = parseInt(data.totalResults);
            displayMovies(data.Search);
            updatePaginationControls();
            paginationContainer.style.display = 'flex';
        } else {
            movieList.innerHTML = `<p class="error-message">${translateErrorMessage(data.Error)}</p>`;
            paginationContainer.style.display = 'none';
        }
    } catch (error) {
        console.error('Erro ao buscar filmes:', error);
        movieList.innerHTML = `<p class="error-message">Ocorreu um erro ao buscar filmes. Tente novamente mais tarde.</p>`;
        paginationContainer.style.display = 'none';
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

function updatePaginationControls() {
    const lastPage = Math.ceil(totalResults / 10);
    currentPageSpan.textContent = `Página ${currentPage} de ${lastPage}`;

    firstPageButton.disabled = currentPage === 1;
    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === lastPage || totalResults === 0;
    lastPageButton.disabled = currentPage === lastPage || totalResults === 0;
}

function translateErrorMessage(errorMessage) {
    switch (errorMessage) {
        case 'Movie not found!':
            return 'Filme não encontrado!';
        case 'Too many results.':
            return 'Muitos resultados. Seja mais específico.';
        case 'Invalid API key!':
            return 'Chave da API inválida!';
        case 'Request limit reached!':
            return 'Limite de requisições atingido!';
        default:
            return 'Ocorreu um erro desconhecido: ' + errorMessage;
    }
}

