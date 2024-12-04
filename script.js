const apiURL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false';

const tableBody = document.getElementById('cryptoTable').querySelector('tbody');
const searchInput = document.getElementById('searchInput');
const sortByMarketCapButton = document.getElementById('sortByMarketCap');
const sortByPercentageChangeButton = document.getElementById('sortByPercentageChange');

async function fetchData() {
    try {
        const response = await fetch(apiURL);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        renderTable(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function renderTable(data) {
    tableBody.innerHTML = '';
    data.forEach(coin => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${coin.image}" alt="${coin.name}"> ${coin.name}</td>
            <td>${coin.symbol.toUpperCase()}</td>
            <td>$${coin.current_price.toFixed(2)}</td>
            <td>$${coin.market_cap.toLocaleString()}</td>
            <td>$${coin.total_volume.toLocaleString()}</td>
            <td>${coin.price_change_percentage_24h.toFixed(2)}%</td>
        `;
        tableBody.appendChild(row);
    });
}

searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const rows = tableBody.getElementsByTagName('tr');
    
    Array.from(rows).forEach(row => {
        const name = row.cells[0].textContent.toLowerCase();
        if (name.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});

sortByMarketCapButton.addEventListener('click', () => {
    const rows = Array.from(tableBody.getElementsByTagName('tr'));
    rows.sort((a, b) => {
        const marketCapA = parseFloat(a.cells[3].textContent.replace('$', '').replace(',', ''));
        const marketCapB = parseFloat(b.cells[3].textContent.replace('$', '').replace(',', ''));
        return marketCapB - marketCapA;
    });
    rows.forEach(row => tableBody.appendChild(row));
});

sortByPercentageChangeButton.addEventListener('click', () => {
    const rows = Array.from(tableBody.getElementsByTagName('tr'));
    rows.sort((a, b) => {
        const percentA = parseFloat(a.cells[5].textContent.replace('%', ''));
        const percentB = parseFloat(b.cells[5].textContent.replace('%', ''));
        return percentB - percentA;
    });
    rows.forEach(row => tableBody.appendChild(row));
});

fetchData();
