const searchForm = document.querySelector("#search-form");
const booksConteiner = document.querySelector("#books");
const urlCover = 'http://covers.openlibrary.org/b/id/';
const urlCoverAuth = 'http://covers.openlibrary.org/a/olid/';

function apiSearch(event) {
    event.preventDefault();
    const searchText = document.querySelector(".form-control").value;
    if (searchText.trim().length === 0) {
        booksConteiner.innerHTML = '<h2 class="error">Enter book title...</h2>';
        return;
    }
    Promise.all([
        fetch('http://openlibrary.org/search.json?title=' + searchText).then(value => value.json()),
        fetch('http://openlibrary.org/search.json?author=' + searchText).then(value => value.json())
    ])
    .then(function (output) {
        let inner = '';
        for(let j = 0; j < output.length; j++) {
            if (output[j].docs.length === 0) {
                inner = '<h2 class="text-info">No results...</h2>';
            }
            output[j].docs.forEach(function (item) {
                 let dataInfo = '';
                dataInfo = `data-title="${item.title}" data-type="${item.isbn}"`; 
                if (item.cover_i !== undefined) { 
                    if (item.title !== undefined && item.author_name !== undefined) {
                        inner += `
                            <div class = "main_conteiner">
                                <img class="cover-book" 
                                    src="${urlCover + item.cover_i + '-M.jpg'}" class="img_cover"
                                    alt="${item.title}" ${dataInfo}>
                            <div class = "authors_conteiner">  
                                <div class="book_title" data-id="${item.author_key}">${item.title}</div>
                                <img class="cover-auth" 
                                    src="${urlCoverAuth + item.author_key + '-M.jpg'}" class="img_auth" 
                                    alt="${item.title}">
                                <div class="book_auth">${item.author_name}</div>
                            </div> 
                                <div class = "onlineBook">
                                    <a href = "#" target="_blank">READ</a></button>
                                </div>

                            </div>`;
                    }
                } else if (item.cover_i == undefined && item.title !== undefined && item.author_name !== undefined) {
                    inner += `
                    <div class = "main_conteiner">
                        <img class="cover-book" 
                            src="${'1.jpg'}" class="img_cover"
                            alt="${item.title}" ${dataInfo}>
                    <div class = "authors_conteiner">  
                        <div class="book_title" data-id="${item.author_key}">${item.title}</div>
                        <img class="cover-auth" 
                            src="${urlCoverAuth + item.author_key + '-M.jpg'}" class="img_auth" 
                            alt="${item.title}">
                        <div class="book_auth">${item.author_name}</div>
                    </div> 
                        <div class = "onlineBook">
                            <a href = "#" target="_blank">READ</a></button>
                        </div>

                    </div>`;
                    }
                });
                booksConteiner.innerHTML = inner;
                addEventMedia();
        }
        })
}

searchForm.addEventListener("submit", apiSearch);

function addEventMedia() {
    const clickBook = booksConteiner.querySelectorAll("img[data-type]");
    clickBook.forEach(function(elem) {
        elem.style.cursor = "pointer";
        elem.addEventListener("click", showFullInfo);
    });
}
