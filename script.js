const gridTab = document.getElementById('grid-tab');
const listTab = document.getElementById('list-tab');
const container = document.querySelector('.container');
let activeView = 'grid'; // Initially set to 'grid' view

async function fetchCryptocurrencyData() {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

function displayGridView(data) {
  container.innerHTML = '';
  data.forEach(crypto => {
    const card = document.createElement('div');
    card.classList.add('card');

    const changeClass = crypto.price_change_percentage_24h < 0 ? 'negative-change' : 'positive-change';
    card.innerHTML = `
      <img src="${crypto.image}" alt="${crypto.name}">
      <h3>${crypto.name}</h3>
      <p>Price: $${crypto.current_price}</p>
      <p class="${changeClass}">24h Change: ${crypto.price_change_percentage_24h}%</p>
      <p>Market Cap: $${crypto.market_cap}</p>
    `;
    container.appendChild(card);
  });
}

function displayListView(data) {
  container.innerHTML = '';
  const tableContainer = document.createElement('div');
  tableContainer.classList.add('table-container');
  const table = document.createElement('table');
  table.classList.add('table');

  // Table header
  const headerRow = document.createElement('tr');
  headerRow.innerHTML = `
    <th>Image</th>
    <th>Name</th>
    <th>Price</th>
    <th>24h Change</th>
    <th>Market Cap</th>
  `;
  table.appendChild(headerRow);

  // Table rows
  data.forEach(crypto => {
    const row = document.createElement('tr');

    const changeClass = crypto.price_change_percentage_24h < 0 ? 'negative-change' : 'positive-change';
    row.innerHTML = `
      <td><img src="${crypto.image}" alt="${crypto.name}" width="30"></td>
      <td>${crypto.name}</td>
      <td>$${crypto.current_price}</td>
      <td class="${changeClass}">${crypto.price_change_percentage_24h}%</td>
      <td>$${crypto.market_cap}</td>
    `;
    table.appendChild(row);
  });

  tableContainer.appendChild(table);
  container.appendChild(tableContainer);
}


function updateView() {
  if (activeView === 'grid') {
    fetchCryptocurrencyData().then(data => displayGridView(data));
  } else if (activeView === 'list') {
    fetchCryptocurrencyData().then(data => displayListView(data));
  }
}

function setActiveTab(tab) {
  gridTab.classList.remove('active');
  listTab.classList.remove('active');
  tab.classList.add('active');
}

gridTab.addEventListener('click', () => {
  if (activeView !== 'grid') {
    activeView = 'grid';
    updateView();
    setActiveTab(gridTab);
  }
});

listTab.addEventListener('click', () => {
  if (activeView !== 'list') {
    activeView = 'list';
    updateView();
    setActiveTab(listTab);
  }
});

// Display grid view by default
updateView();
gridTab.classList.add('active');
