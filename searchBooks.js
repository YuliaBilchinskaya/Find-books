const searchForm = document.querySelector("#search-form");
const booksConteiner = document.querySelector("#books");
const urlCover = 'http://covers.openlibrary.org/b/id/';

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
                        inner += `<div class = "main_conteiner">
                                    <div class="book_title" data-id="${item.author_key}">"${item.title}"</div>
                                    <div class="book_author">${item.author_name}</div>
                                    <img src="${urlCover + item.cover_i + '-M.jpg'}" class="img_cover" ${dataInfo}>
                                    <div class = "onlineBook">
                                        <a href = "#" target="_blank">READ</a></button>
                                    </div>
                                </div>`;
                    }
                } else if (item.cover_i == undefined && item.title !== undefined && item.author_name !== undefined) {
                        inner += `<div class = "main_conteiner">
                                    <div class="book_title" data-id="${item.author_key}">"${item.title}"</div>
                                    <div class="book_author">${item.author_name}</div>
                                    <img src="${'1.jpg'}" class="img_cover" ${dataInfo} width ="180" height: 277px>
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
/* 
function showFullInfoForSearchBooks() {
    let flexbooksConteiner = document.getElementById("books");
    flexbooksConteiner.id = "flexBooks";
    let url = '';
    if (this.dataset.type ) {
        url = 'https://openlibrary.org/api/books?bibkeys=' + this.dataset.type + '&jscmd=data&format=json';
    } else {
        booksConteiner.innerHTML = '<h2 class="error">ERROR</h2>';
        return; 
    } 
     fetch(url)
        .then(function(value) {
            if (value.status !== 200) {
                return Promise.reject(new Error(value));
            }
            return value.json();
        })
        .then(function(output) {
            console.log(output)
            for(let key in output) {
                let authorsName = '';
                let subjectsName = '';
                if (output[key] !== 0) {
                output[key].authors.map((item) => authors = item.url);
                output[key].authors.map((item) => authorsName = item.name);
                output[key].publishers.map((item) => publishers = item.name);
                output[key].publish_places.map((item) => publish_places = item.name);
                output[key].subjects.map((s) => subjectsName += s.name + ', ');
                output[key].ebooks.map((item) => ebooks = item.preview_url);
                flexbooksConteiner.innerHTML = `
                <div class="blockLargeCover">

                    <img src="${output[key].cover.large}" class="cover_large" alt="${output[key].authors.name || output[key].title}}">
                    ${(output[key].url) ? `<p class="text_url"> <a href="${output[key].url}" target="_blank">openlibrary.org</a></p>` : ''} 
                </div>
                <div class = "detailed">

                    <div class="publish">
                    <h4 class="title">${`"` +  output[key].title + `"`}</h4>
                        <h3 class="author"><a href = "${authors}" target="_blank">${authorsName}</a></h3>
                <p>Published ${output[key].publish_date + ' by ' + publishers + ' in '
                + publish_places + '.<br /> '}</p>
                    </div>

                    <div class="subjectDiv">
                        <p><b>SUBJECTS:</b><br />${subjectsName}</p>
                       
                    </div>
                    <div class = "object">
                        <p><b>The Physical Object:  </b>${output[key].notes}</p>
                        <p><b>Pagination: </b>${output[key].pagination}</p>
                        <p><b>Number of pages: </b>${output[key].number_of_pages}</p>
                    </div>
                    <div class = "onlineBook">
                        <a href = "${ebooks}" target="_blank">READ ONLINE</a></button>
                    </div>
                    <div class = "back">
                        <a href="#" onclick="location.reload(); return false;">Back</a>
                    </div>
                `   
                }
            }
        })
}

 */
