const searchInput = document.querySelector('.food-page .search-input');
const resultsContainer = document.querySelector('.food-page .results-container');
const searchStatus = document.querySelector('.food-page .search-status');

const drugSearchStatus = document.querySelector('.drugs-page .search-status');
const drugSearchInput = document.querySelector('.drugs-page .search-input');
const drugResultsContainer = document.querySelector('.drugs-page .results-container');
const drugRecommenderContainer = document.querySelector('.drugs-page .popular-drugs')
const drugRecommendOption = document.querySelector('.drugs-page .access-button')

const cosmeticsSearchStatus = document.querySelector('.cosmetics-page .search-status');
const cosmeticsSearchInput = document.querySelector('.cosmetics-page .search-input');
const cosmeticsResultsContainer = document.querySelector('.cosmetics-page .results-container');

const foodRecommenderContainer = document.querySelector('.food-page .popular-foods')
const foodRecommendOption = document.querySelector('.food-page .access-button')

if(foodRecommendOption && foodRecommenderContainer){
    foodRecommendOption.addEventListener('click', function(event){
        event.preventDefault()
        foodRecommenderContainer.classList.add('visible')
    })
}

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
            console.log(data)

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
                if (item.status === "Terminated") {
                    card.innerHTML = `
                    <h3>${item.food}</h3>
                    <p><strong>Company:</strong> ${item.company}</p>
                    <p><strong>Reason:</strong> ${item.reason}</p>
                    <p><strong>Recall date: </strong>${item.date}</p>
                    <p class="status-bad">${item.status}</p>
                    `; 

                } else if(item.status === "Ongoing"){
                    card.innerHTML = `
                    <h3>${item.food}</h3>
                    <p><strong>Company:</strong> ${item.company}</p>
                    <p><strong>Reason:</strong> ${item.reason}</p>
                    <p><strong>Recall date: </strong>${item.date}</p>
                    <p class="status-okay">${item.status}</p>
                `; 
                }
                resultsContainer.appendChild(card);
            });


        }, 400);
    });
}

if (drugSearchInput && drugResultsContainer) {
    let timer; 

    drugSearchInput.addEventListener('input', function() {
        clearTimeout(timer);

        timer = setTimeout(async function () { 
            const query = drugSearchInput.value.trim(); 

            drugResultsContainer.innerHTML = '';

            if (!query) {
                drugSearchStatus.textContent = '';
                return;
            }

            drugSearchStatus.textContent = 'Searching...'

            const resp = await fetch(`/api/drug/search?q=${encodeURIComponent(query)}`)
            const data = await resp.json()
            console.log(data)

            if (data.error) {
                drugSearchStatus.textContent = data.error;
                return; 
            }

            if (data.results.length === 0) {
                drugSearchStatus.textContent = 'No recalls found.'; 
                return; 
            }

            drugSearchStatus.textContent = `Showing ${data.results.length} result(s).`;

            data.results.forEach(function (item) {
                const card = document.createElement('div');
                card.className = 'drug-card'
                if (item["Status"] === "Terminated") {
                    card.innerHTML = `
                    <h3>${item.Drug}</h3>
                    <p><strong>Company:</strong> ${item["Company"]}</p>
                    <p><strong>Reason:</strong> ${item["Reason for recall"]}</p>
                    <p><strong>Recall date: </strong>${item["Recall date"]}</p>
                    <p class="status-bad"><strong>${item["Status"]}</p>
                    `; 
                } else if(item["Status"] === "Ongoing"){
                    card.innerHTML = `
                    <h3>${item.Drug}</h3>
                    <p><strong>Company:</strong> ${item["Company"]}</p>
                    <p><strong>Reason:</strong> ${item["Reason for recall"]}</p>
                    <p><strong>Recall date: </strong>${item["Recall date"]}</p>
                    <p class="status-okay">${item["Status"]}</p>
                    `;
                }

                
                drugResultsContainer.appendChild(card);
            });


        }, 400);
    });
}



if (cosmeticsSearchInput && cosmeticsResultsContainer) {
    let timer; 

    cosmeticsSearchInput.addEventListener('input', function() {
        clearTimeout(timer);

        timer = setTimeout(async function () { 
            const query = cosmeticsSearchInput.value.trim(); 

            cosmeticsResultsContainer.innerHTML = '';

            if (!query) {
                cosmeticsSearchStatus.textContent = '';
                return;
            }

            cosmeticsSearchStatus.textContent = 'Searching...'

            const resp = await fetch(`/api/cosmetic/search?q=${encodeURIComponent(query)}`)
            const data = await resp.json()
            console.log(data)
            

            if (data.error) {
                cosmeticsSearchStatus.textContent = data.error;
                return; 
            }

            if (data.results.length === 0) {
                cosmeticsSearchStatus.textContent = 'No recalls found.'; 
                return; 
            }

            cosmeticsSearchStatus.textContent = `Showing ${data.results.length} result(s).`;

            data.results.forEach(function (item) {
                const card = document.createElement('div');
                card.className = 'cosmetics-card'

                card.innerHTML = `
                <h3>${item.Cosmetic}</h3>
                <p><strong>Cosmetic:</strong> ${item["Cosmetic"]}</p>
                <p><strong>Reactions:</strong> ${item["Reactions"]}</p>
                <p><strong>Report Date: </strong>${item["Report date"]}</p>
                `; 
                cosmeticsResultsContainer.appendChild(card);
            });


        }, 400);
    });
}