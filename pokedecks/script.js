
const apiBase = 'https://pokeapi.co/api/v2';
const typeIconUrl = 'https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons';
let allPokemonsList = []; // Para armazenar lista completa

document.addEventListener('DOMContentLoaded', () => {
  setupTabs();
  setupSearchByName();
  fetchTotalCount();
  initTypesList();
});
// Inicializa funcionalidade de abas
function setupTabs() {
  const tabSearchBtn = document.getElementById('tab-search');
  const tabTypesBtn = document.getElementById('tab-types');
  const searchTab = document.getElementById('searchTab');
  const typesTab = document.getElementById('typesTab');

  function showSearch() {
    tabSearchBtn.classList.add('active');
    tabTypesBtn.classList.remove('active');
    searchTab.classList.remove('hidden');
    typesTab.classList.add('hidden');
  }

  function showTypes() {
    tabTypesBtn.classList.add('active');
    tabSearchBtn.classList.remove('active');
    typesTab.classList.remove('hidden');
    searchTab.classList.add('hidden');
  }

  tabSearchBtn.addEventListener('click', showSearch);
  tabTypesBtn.addEventListener('click', showTypes);
  // Mostrar aba de busca por nome por padrão
  showSearch();
}

// Configura busca por nome
function setupSearchByName() {
  document.getElementById('btnSearch').addEventListener('click', () => {
    const nameInput = document.getElementById('pokemonName');
    const name = nameInput.value.trim().toLowerCase();
    if (!name) {
      alert('Informe um nome válido.');
      nameInput.focus();
      return;
    }
    fetchPokemon(name);
  });
}

// Obtém total de Pokémons
async function fetchTotalCount() {
  try {
    const res = await fetch(`${apiBase}/pokemon?limit=0`);
    const data = await res.json();
    document.getElementById('totalCount').textContent = data.count;
  } catch (err) {
    console.error('Erro ao obter total de Pokémons:', err);
  }
}

// Extrai ID da URL
t:function getIdFromUrl(url) {
  const parts = url.split('/');
  return parseInt(parts[parts.length - 2], 10);
}

// Capitaliza texto
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Inicia lista de tipos e adiciona botão 'Todos'
async function initTypesList() {
  try {
    const res = await fetch(`${apiBase}/type`);
    const data = await res.json();
    const tipos = data.results.slice(0, 18);
    const grid = document.querySelector('.types-grid');
    
    // Botão Todos
    const allBtn = document.createElement('button');
    allBtn.textContent = 'Todos';
    allBtn.addEventListener('click', () => fetchAllPokemons(true));
    grid.appendChild(allBtn);

    tipos.forEach(t => {
      const btn = document.createElement('button');
      btn.innerHTML = `
        <img src="${typeIconUrl}/${t.name}.svg" alt="${t.name}" class="type-icon">
        <span>${capitalize(t.name)}</span>
      `;
      btn.addEventListener('click', () => fetchByType(t.name));
      grid.appendChild(btn);
    });
  } catch (err) {
    console.error('Erro ao carregar tipos:', err);
  }
}

// Busca por nome de Pokémon
async function fetchPokemon(name) {
  try {
    const res = await fetch(`${apiBase}/pokemon/${name}`);
    if (!res.ok) throw new Error('Pokémon não encontrado');
    const data = await res.json();
    renderSearchResult(data);
  } catch (err) {
    alert(err.message);
  }
}

// Renderiza resultado da busca
function renderSearchResult(p) {
  const container = document.getElementById('searchResult');
  container.innerHTML = '';
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <img src="${p.sprites.front_default}" alt="${p.name}">
    <h3>${capitalize(p.name)}</h3>
    <div class="types">${p.types.map(t => capitalize(t.type.name)).join(', ')}</div>
    <div class="moves">
      <strong>Ataques:</strong>
      <ul>${p.moves.slice(0,5).map(m => `<li>${capitalize(m.move.name)}</li>`).join('')}</ul>
    </div>
  `;
  container.appendChild(card);
}

// Busca todos os Pokémons e opcionalmente cria controles de filtro
async function fetchAllPokemons(initializeFilters = false) {
  try {
    const res = await fetch(`${apiBase}/pokemon?limit=100000&offset=0`);
    const data = await res.json();
    allPokemonsList = data.results;
    if (initializeFilters) createFilterControls();
    sortAndRenderAll();
  } catch (err) {
    alert('Erro ao buscar todos os Pokémons');
  }
}

// Busca Pokémons por tipo específico
async function fetchByType(type) {
  try {
    const res = await fetch(`${apiBase}/type/${type}`);
    if (!res.ok) throw new Error('Tipo não encontrado');
    const data = await res.json();
    renderTypeResult(data.pokemon);
  } catch (err) {
    alert(err.message);
  }
}

// Cria dropdown de filtros apenas uma vez
function createFilterControls() {
  const typesTab = document.getElementById('typesTab');
  if (document.getElementById('sortSelect')) return; // já criado

  const filterDiv = document.createElement('div');
  filterDiv.className = 'filter-controls';
  filterDiv.innerHTML = `
    <label for="sortSelect">Ordenar/Filtrar:</label>
    <select id="sortSelect">
      <option value="alphabet">Alfabética</option>
      <option value="number">Número Dex</option>
      <option value="base">Formas Base</option>
      <option value="mega">Megas</option>
    </select>
  `;
  typesTab.insertBefore(filterDiv, typesTab.querySelector('.types-grid').nextSibling);
  document.getElementById('sortSelect').addEventListener('change', sortAndRenderAll);
}

// Ordena e renderiza lista completa conforme filtro
function sortAndRenderAll() {
  const mode = document.getElementById('sortSelect').value;
  let list = [...allPokemonsList];
  switch (mode) {
    case 'alphabet':
      list.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'number':
      list.sort((a, b) => getIdFromUrl(a.url) - getIdFromUrl(b.url));
      break;
    case 'base':
      list = list.filter(p => !p.name.includes('-'));
      break;
    case 'mega':
      list = list.filter(p => p.name.includes('mega'));
      break;
  }
  renderAllResult(list);
}

// Renderiza lista completa
function renderAllResult(list) {
  const container = document.getElementById('typeResult')
  container.innerHTML = '';
  list.forEach(p => {
    const id = getIdFromUrl(p.url);
    const name = capitalize(p.name);
    const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = ` <img src="${img}" alt="${name}"><h3>${name}</h3>`;
    container.appendChild(card);
  });
}

// Renderiza resultado por tipo
function renderTypeResult(list) {
  const container = document.getElementById('typeResult');
  container.innerHTML = '';
  list.forEach(({ pokemon }) => {
    const id = getIdFromUrl(pokemon.url);
    const name = capitalize(pokemon.name);
    const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<img src="${img}" alt="${name}"><h3>${name}</h3>`;
    container.appendChild(card);
  });
}

