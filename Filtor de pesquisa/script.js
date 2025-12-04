// script.js
let currentCategory = 'all';
let allResults = [];

// 1. DADOS LOCAIS - FILMES
const movies = {
    action: [
        { title: 'John Wick', year: 2014, rating: 8.1, id: 1 },
        { title: 'Mad Max Fury Road', year: 2015, rating: 8.1, id: 2 },
        { title: 'Mission Impossible', year: 2018, rating: 7.7, id: 3 },
        { title: 'The Matrix', year: 1999, rating: 8.7, id: 5 },
        { title: 'Inception', year: 2010, rating: 8.8, id: 6 },
        { title: 'Dark Knight', year: 2008, rating: 9.0, id: 7 },
        { title: 'Avengers Endgame', year: 2019, rating: 8.4, id: 8 },
        { title: 'Terminator 2', year: 1991, rating: 8.5, id: 13 },
        { title: 'Die Hard', year: 1988, rating: 8.3, id: 15 }
    ],
    comedy: [
        { title: 'Superbad', year: 2007, rating: 7.6, id: 16 },
        { title: 'The Hangover', year: 2009, rating: 7.7, id: 17 },
        { title: 'Bridesmaids', year: 2011, rating: 7.1, id: 18 },
        { title: 'Groundhog Day', year: 1993, rating: 8.0, id: 22 },
        { title: 'Elf', year: 2003, rating: 7.3, id: 23 },
        { title: 'Anchorman', year: 2004, rating: 7.2, id: 26 },
        { title: 'Borat', year: 2006, rating: 7.1, id: 28 },
        { title: 'The Nice Guys', year: 2016, rating: 7.5, id: 30 }
    ],
    drama: [
        { title: 'The Shawshank Redemption', year: 1994, rating: 9.3, id: 31 },
        { title: 'Forrest Gump', year: 1994, rating: 8.8, id: 32 },
        { title: 'The Green Mile', year: 1999, rating: 8.6, id: 33 },
        { title: 'Parasite', year: 2019, rating: 8.5, id: 41 },
        { title: 'Joker', year: 2019, rating: 8.4, id: 42 },
        { title: 'The Pianist', year: 2002, rating: 8.5, id: 39 }
    ],
    horror: [
        { title: 'The Exorcist', year: 1973, rating: 8.1, id: 46 },
        { title: 'Hereditary', year: 2018, rating: 7.6, id: 47 },
        { title: 'The Ring', year: 2002, rating: 7.1, id: 51 },
        { title: 'Psycho', year: 1960, rating: 8.4, id: 54 },
        { title: 'The Shining', year: 1980, rating: 8.4, id: 55 },
        { title: 'Scream', year: 1996, rating: 7.3, id: 58 }
    ],
    sci_fi: [
        { title: 'Interstellar', year: 2014, rating: 8.6, id: 61 },
        { title: 'Blade Runner', year: 1982, rating: 8.1, id: 62 },
        { title: 'Dune', year: 2021, rating: 8.0, id: 64 },
        { title: 'Star Wars Episode IV', year: 1977, rating: 8.6, id: 69 },
        { title: 'Avatar', year: 2009, rating: 7.8, id: 70 },
        { title: 'Her', year: 2013, rating: 8.0, id: 73 }
    ],
    adventure: [
        { title: 'Indiana Jones', year: 1981, rating: 8.4, id: 76 },
        { title: 'The Lord of the Rings', year: 2001, rating: 8.8, id: 77 },
        { title: 'Pirates of Caribbean', year: 2003, rating: 8.0, id: 79 },
        { title: 'Jurassic Park', year: 1993, rating: 8.2, id: 80 },
        { title: 'The Mummy', year: 1999, rating: 7.1, id: 82 }
    ]
};

// FUNÇÃO: Exibir resultados
function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    if (!resultsDiv) return;

    if (!results || results.length === 0) {
        resultsDiv.innerHTML = `
            <div class="empty">
                <div class="empty-icon">:(</div>
                <p>Nenhum resultado encontrado</p>
            </div>
        `;
        return;
    }

    resultsDiv.innerHTML = results.map((item, idx) => `
        <div class="result-card">
            <div class="poster">🎬 Filme</div>
            <div class="info">
                <div class="title">${item.title || 'Sem titulo'}</div>
                <div class="year">${item.year || 'N/A'}</div>
                <div class="rating">⭐ ${item.rating || '0'}</div>
            </div>
        </div>
    `).join('');
}

// BUSCAR FILMES
function searchMovies(query) {
    console.log('Buscando Filmes:', query);
    let filtered = getAllMovies().filter(movie =>
        movie.title.toLowerCase().includes(query.toLowerCase())
    );

    if (currentCategory !== 'all') {
        filtered = filtered.filter(movie => {
            const movieList = movies[currentCategory] || [];
            return movieList.some(m => m.id === movie.id);
        });
    }

    console.log('Filmes encontrados:', filtered.length);
    displayResults(filtered);
}

// FUNÇÕES AUXILIARES
function search() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    const query = searchInput.value.trim();
    console.log('Executando busca:', query);
    
    if (query === '') {
        allResults = getAllMovies();
        displayResults(allResults);
        return;
    }

    searchMovies(query);
}

function filterCategory(category) {
    console.log('Filtrando categoria:', category);
    currentCategory = category;

    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    const searchInput = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (category === 'all') {
        allResults = searchInput === '' ? getAllMovies() : getAllMovies().filter(m => m.title.toLowerCase().includes(searchInput));
    } else {
        allResults = searchInput === '' ? (movies[category] || []) : (movies[category] || []).filter(m => m.title.toLowerCase().includes(searchInput));
    }

    displayResults(allResults);
}

function getAllMovies() {
    let all = [];
    Object.keys(movies).forEach(category => {
        all = all.concat(movies[category]);
    });
    return all;
}

// EVENTOS
document.addEventListener('DOMContentLoaded', () => {
    console.log('Página carregada - Inicializando buscador');
    allResults = getAllMovies();
    displayResults(allResults);
});

document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.target.id === 'searchInput') {
        console.log('Enter pressionado no campo de busca');
        search();
    }
});