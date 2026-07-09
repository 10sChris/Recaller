const searchInput = document.querySelector('.food-page .search-input');
const resultsContainer = document.querySelector('.food-page .results-container');
const searchStatus = document.querySelector('.food-page .search-status');
const loadMoreButton = document.querySelector('.food-page .load-more-button');

const drugSearchStatus = document.querySelector('.drugs-page .search-status');
const drugSearchInput = document.querySelector('.drugs-page .search-input');
const drugResultsContainer = document.querySelector('.drugs-page .results-container');
const drugLoadMoreButton = document.querySelector('.drugs-page .load-more-button');

const cosmeticsSearchStatus = document.querySelector('.cosmetics-page .search-status');
const cosmeticsSearchInput = document.querySelector('.cosmetics-page .search-input');
const cosmeticsResultsContainer = document.querySelector('.cosmetics-page .results-container');
const cosmeticsLoadMoreButton = document.querySelector('.cosmetics-page .load-more-button');

const foodRecommenderContainer = document.querySelector('.food-page .popular-foods')
const foodRecommendOption = document.querySelector('.food-page .access-button')

const drugsRecommnderContainer = document.querySelector('.drugs-page .popular-drugs')
const drugsRecommendOption = document.querySelector('.drugs-page .access-button')

const cosmeticRecommenderContainer = document.querySelector('.cosmetics-page  .popular-cosmetics')
const cosmeticRecommendOption = document.querySelector('.cosmetics-page .access-button')


if(cosmeticRecommenderContainer && cosmeticRecommendOption){
    cosmeticRecommendOption.addEventListener('click', function(event){
        event.preventDefault()
        cosmeticRecommenderContainer.classList.add('visible')
    })
}

if(drugsRecommnderContainer && drugsRecommendOption){
    drugsRecommendOption.addEventListener('click', function(event){
        event.preventDefault()
        drugsRecommnderContainer.classList.add('visible')
    })
}


if(foodRecommendOption && foodRecommenderContainer){
    foodRecommendOption.addEventListener('click', function(event){
        event.preventDefault()
        foodRecommenderContainer.classList.add('visible')
    })
}

//function to load alternatives
async function loadAlternatives(button, resultBox, payload) {
    button.disabled = true;
    resultBox.hidden = false;
    resultBox.textContent = 'Loading alternatives..';

    const resp = await fetch('/api/alternatives', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    });
    const data = await resp.json();

    if (data.error) {
        resultBox.textContent = data.error;
    } else {
        resultBox.textContent = data.alternatives;
    }

    button.disabled = false;
}

function formatRecallDate(value) {
    if (!value || value === 'N/A' || value.length !== 8) {
        return value;
    }

    return `${value.slice(4, 6)}/${value.slice(6, 8)}/${value.slice(0, 4)}`;
}

if (searchInput && resultsContainer) {
    let timer; 
    let offset = 0;
    let showingCount = 0;
    let currentQuery = '';

    function addFoodCards(items) {
        items.forEach(function (item) {
            const card = document.createElement('div');
            card.className = 'food-card'
            if (item.status === "Terminated") {
                card.innerHTML = `
                <h3>${item.food}</h3>
                <p><strong>Company:</strong> ${item.company}</p>
                <p><strong>Reason:</strong> ${item.reason}</p>
                <p><strong>Recall date: </strong>${formatRecallDate(item.date)}</p>
                <p class="status-okay">${item.status}</p>
                `; 

            } else if(item.status === "Ongoing"){
                card.innerHTML = `
                <h3>${item.food}</h3>
                <p><strong>Company:</strong> ${item.company}</p>
                <p><strong>Reason:</strong> ${item.reason}</p>
                <p><strong>Recall date: </strong>${formatRecallDate(item.date)}</p>
                <p class="status-bad">${item.status}</p>
            `; 
            }
            const button = document.createElement('button');
            const resultBox = document.createElement('div');
            button.className = 'alternative-button';
            button.textContent = 'Alternatives';
            resultBox.className = 'alternative-result';
            resultBox.hidden = true;
            button.addEventListener('click', function () {
                loadAlternatives(button, resultBox, {
                    kind: 'food',
                    name: item.food,
                    reason: item.reason
                });
            });
            card.appendChild(button);
            card.appendChild(resultBox);
            resultsContainer.appendChild(card);
        });
    }

    searchInput.addEventListener('input', function() {
        clearTimeout(timer);

        timer = setTimeout(async function () { 
            const query = searchInput.value.trim(); 
            currentQuery = query;
            offset = 0;
            showingCount = 0;

            resultsContainer.innerHTML = '';
            loadMoreButton.hidden = true;

            if (!query) {
                searchStatus.textContent = '';
                return;
            }

            searchStatus.textContent = 'Searching...'

            const resp = await fetch(`/api/food/search?q=${encodeURIComponent(query)}&offset=${offset}`)
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

            addFoodCards(data.results);

            showingCount += data.results.length;
            offset += data.results.length;
            searchStatus.textContent = `Showing ${showingCount} result(s).`;
            loadMoreButton.hidden = !data.has_more;
            loadMoreButton.disabled = false;

        }, 400);
    });

    //load more button function 
    loadMoreButton.addEventListener('click', async function () {
        if (!currentQuery) {
            return;
        }

        searchStatus.textContent = 'Loading more';
        loadMoreButton.disabled = true;

        const resp = await fetch(`/api/food/search?q=${encodeURIComponent(currentQuery)}&offset=${offset}`)
        const data = await resp.json()
        console.log(data)

        if (data.error) {
            searchStatus.textContent = data.error;
            loadMoreButton.hidden = true;
            return; 
        }

        addFoodCards(data.results);

        showingCount += data.results.length;
        offset += data.results.length;
        searchStatus.textContent = `Showing ${showingCount} result(s).`;
        loadMoreButton.hidden = !data.has_more;
        loadMoreButton.disabled = false;
    });
}

if (drugSearchInput && drugResultsContainer) {
    let timer; 
    let offset = 0;
    let showingCount = 0;
    let currentQuery = '';

    //creates the cards for each drug
    function addDrugCards(items) {
        items.forEach(function (item) {
            const card = document.createElement('div');
            card.className = 'drug-card'
            if (item["Status"] === "Terminated") {
                card.innerHTML = `
                <h3>${item.Drug}</h3>
                <p><strong>Company:</strong> ${item["Company"]}</p>
                <p><strong>Reason:</strong> ${item["Reason for recall"]}</p>
                <p><strong>Recall date: </strong>${formatRecallDate(item["Recall date"])}</p>
                <p class="status-okay"><strong>${item["Status"]}</strong></p>
                `; 
            } else if(item["Status"] === "Ongoing"){
                card.innerHTML = `
                <h3>${item.Drug}</h3>
                <p><strong>Company:</strong> ${item["Company"]}</p>
                <p><strong>Reason:</strong> ${item["Reason for recall"]}</p>
                <p><strong>Recall date: </strong>${formatRecallDate(item["Recall date"])}</p>
                <p class="status-bad"><strong>${item["Status"]}</strong></p>
                `;
            }

            const button = document.createElement('button');
            const resultBox = document.createElement('div');
            button.className = 'alternative-button';
            button.textContent = 'Alternatives';
            resultBox.className = 'alternative-result';
            resultBox.hidden = true;
            button.addEventListener('click', function () {
                loadAlternatives(button, resultBox, {
                    kind: 'drug',
                    name: item.Drug,
                    reason: item["Reason for recall"]
                });
            });
            card.appendChild(button);
            card.appendChild(resultBox);
            drugResultsContainer.appendChild(card);
        });
    }

    drugSearchInput.addEventListener('input', function() {
        clearTimeout(timer);

        timer = setTimeout(async function () { 
            const query = drugSearchInput.value.trim(); 
            currentQuery = query;
            offset = 0;
            showingCount = 0;

            drugResultsContainer.innerHTML = '';
            drugLoadMoreButton.hidden = true;

            if (!query) {
                drugSearchStatus.textContent = '';
                return;
            }

            drugSearchStatus.textContent = 'Searching...'

            const resp = await fetch(`/api/drug/search?q=${encodeURIComponent(query)}&offset=${offset}`)
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

            addDrugCards(data.results);

            showingCount += data.results.length;
            offset += data.results.length;
            drugSearchStatus.textContent = `Showing ${showingCount} result(s).`;
            drugLoadMoreButton.hidden = !data.has_more;
            drugLoadMoreButton.disabled = false;

        }, 400);
    });

    drugLoadMoreButton.addEventListener('click', async function () {
        if (!currentQuery) {
            return;
        }

        drugSearchStatus.textContent = 'Loading more...';
        drugLoadMoreButton.disabled = true;

        const resp = await fetch(`/api/drug/search?q=${encodeURIComponent(currentQuery)}&offset=${offset}`)
        const data = await resp.json()
        console.log(data)

        if (data.error) {
            drugSearchStatus.textContent = data.error;
            drugLoadMoreButton.hidden = true;
            return; 
        }

        addDrugCards(data.results);

        showingCount += data.results.length;
        offset += data.results.length;
        drugSearchStatus.textContent = `Showing ${showingCount} result(s).`;
        drugLoadMoreButton.hidden = !data.has_more;
        drugLoadMoreButton.disabled = false;
    });
}


if (cosmeticsSearchInput && cosmeticsResultsContainer) {
    let timer; 
    let offset = 0;
    let showingCount = 0;
    let currentQuery = '';

    function addCosmeticCards(items) {
        items.forEach(function (item) {
            const card = document.createElement('div');
            card.className = 'cosmetics-card'
            card.innerHTML = `
            <h3>${item.Cosmetic}</h3>
            <p><strong>Cosmetic:</strong> ${item["Cosmetic"]}</p>
            <p><strong>Reactions:</strong> ${item["Reactions"]}</p>
            <p><strong>Report Date: </strong>${item["Report date"]}</p>
            <p><strong> Patient Age: </strong>${item["Patient Age"]}</p>
            <p><strong> Patient Gender: </strong>${item["Patient Gender"]}</p>
            `; 
            const button = document.createElement('button');
            const resultBox = document.createElement('div');
            button.className = 'alternative-button';
            button.textContent = 'Alternatives';
            resultBox.className = 'alternative-result';
            resultBox.hidden = true;
            button.addEventListener('click', function () {
                loadAlternatives(button, resultBox, {
                    kind: 'cosmetic',
                    name: item.Cosmetic,
                    reason: item.Reactions
                });
            });
            card.appendChild(button);
            card.appendChild(resultBox);
            cosmeticsResultsContainer.appendChild(card);
        });
    }

    cosmeticsSearchInput.addEventListener('input', function() {
        clearTimeout(timer);

        timer = setTimeout(async function () { 
            const query = cosmeticsSearchInput.value.trim(); 
            currentQuery = query;
            offset = 0;
            showingCount = 0;

            cosmeticsResultsContainer.innerHTML = '';
            cosmeticsLoadMoreButton.hidden = true;

            if (!query) {
                cosmeticsSearchStatus.textContent = '';
                return;
            }

            cosmeticsSearchStatus.textContent = 'Searching...'

            const resp = await fetch(`/api/cosmetic/search?q=${encodeURIComponent(query)}&offset=${offset}`)
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

            addCosmeticCards(data.results);

            showingCount += data.results.length;
            offset += data.results.length;
            cosmeticsSearchStatus.textContent = `Showing ${showingCount} result(s).`;
            cosmeticsLoadMoreButton.hidden = !data.has_more;
            cosmeticsLoadMoreButton.disabled = false;

        }, 400);
    });

    //same for cosmetics load button 
    cosmeticsLoadMoreButton.addEventListener('click', async function () {
        if (!currentQuery) {
            return;
        }

        cosmeticsSearchStatus.textContent = 'Loading more...';
        cosmeticsLoadMoreButton.disabled = true;

        const resp = await fetch(`/api/cosmetic/search?q=${encodeURIComponent(currentQuery)}&offset=${offset}`)
        const data = await resp.json()
        console.log(data)
        

        if (data.error) {
            cosmeticsSearchStatus.textContent = data.error;
            cosmeticsLoadMoreButton.hidden = true;
            return; 
        }

        addCosmeticCards(data.results);

        showingCount += data.results.length;
        offset += data.results.length;
        cosmeticsSearchStatus.textContent = `Showing ${showingCount} result(s).`;
        cosmeticsLoadMoreButton.hidden = !data.has_more;
        cosmeticsLoadMoreButton.disabled = false;
    });
}
