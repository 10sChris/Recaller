const searchInput = document.querySelector('.food-page .search-input');
const resultsContainer = document.querySelector('.food-page .results-container');
const searchStatus = document.querySelector('.food-page .search-status');


if (searchInput && resultsContainer) {
    let timer; 

    searchInput.addEventListener('input', function() {
        clearTimeout(timer);
    })
}