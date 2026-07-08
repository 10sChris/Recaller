const searchInput = document.querySelector('.food-page .search-input');
const resultsContainer = document.querySelector('.food-page .results-container');
const searchStatus = document.querySelector('.food-page .search-status');


if (searchInput && resultsContainer) {
    let timer; 

    searchInput.addEventListener('input', function() {
        clearTimeout(timer);

        timer = setTimeout(async function () { 
            const query = searchInput.value.trim(); 

            resultsContainer.innerHTML = '';

            if (!query) {
                searchStatus.textContent = '';
                return;
            }

            searchStatus.textContent = 'Searching...'

            const resp = await fetch(`/api/food/search?q=${encodeURIComponent(query)}`)
            const data = await resp.json()

            if (data.error) {
                searchStatus.textContent = data.error;
                return; 
            }

            if (data.results.length === 0) {
                searchStatus.textContent = 'No recalls found.'; 
                return; 
            }

            searchStatus.textContent = `Showing ${data.results.length} result(s).`;

            data.results.forEach(function (item) {
                const card = document.createElement('div');
                card.className = 'food-card'

                card.innerHTML = `
                <h3>${item.food}</h3>
                <p><strong>Company:</strong> ${item.company}</p>
                <p><strong>Reason:</strong> ${item.reason}</p>
                <p><strong>Recall date: </strong>${item.date}</p>
                <p><strong>Status: </strong>${item.status}</p>


                `; 
                resultsContainer.appendChild(card);
            });


        }, 400);
    });
}