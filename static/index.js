const search_input = document.querySelector('.search-input')
const row_boxes = document.querySelector('.results-container')

search_input.addEventListener('keydown', function(event) {
    
    if (event.key === 'Enter'){
        event.preventDefault()
        for (let i=0; i<=5; i++){
            const new_box = document.createElement('div')
            new_box.textContent = "Hello World"
            row_boxes.appendChild(new_box)
        }
    }
    
});


