document.addEventListener('DOMContentLoaded',() => {
    Promise.all([
        fetch('http://openlibrary.org/subjects/fantasy.json?limit=6&offset=6').then(value => value.json()),
        fetch('http://openlibrary.org/subjects/romance.json?limit=6&offset=6').then(value => value.json()),
        fetch('http://openlibrary.org/subjects/history.json?limit=6&offset=6').then(value => value.json()),
        fetch('http://openlibrary.org/subjects/biographies.json?limit=6&offset=6').then(value => value.json()),
        fetch('http://openlibrary.org/subjects/science.json?limit=6&offset=6').then(value => value.json()),
        fetch('http://openlibrary.org/subjects/religion.json?limit=6&offset=6').then(value => value.json()),
        fetch('http://openlibrary.org/subjects/music.json?limit=6&offset=6').then(value => value.json()),
        fetch('http://openlibrary.org/subjects/detective.json?limit=6&offset=6').then(value => value.json()),
        fetch('http://openlibrary.org/subjects/children.json?limit=6&offset=6').then(value => value.json()),
    ]).then((output) => {
        let authorName = "";
        let authorKey = "";
        for(let j = 0; j < output.length; j++) {
            let outputName = output[j].name;
            let uppercaseLetter = outputName.charAt(0).toUpperCase() + outputName.substr(1); //заглавные первые буквы
            let inner = `<h3 id = "mainSubject" class="${outputName}">${uppercaseLetter}</h3>`; //Темы
            output[j].works.forEach(function(item) { 
                item.authors = item.authors || [];
                item.authors.map((item) => authorName = item.name);
                item.authors.map((item) => authorKey = item.key);
                let resultAuth = authorKey.replace("/authors/", "");

                    let dataInfo = `data-title="${item.title}" data-type="${item.cover_edition_key}"`;
                    if (output[j].name) {
                        inner += ` 
                            <div class = "main_conteiner">
                            
                                <img class="cover-book" 
                                    src="${urlCover + item.cover_id + '-M.jpg'}" class="img_cover"
                                    alt="${item.title}" ${dataInfo}>
                            <div class = "authors_conteiner">
                                <div class="book_title">${item.title}</div>
                                <img class="cover-auth" 
                                src="${urlCoverAuth + resultAuth + '-M.jpg'}" class="img_auth" 
                                alt="${item.title}">
                                <div class="book_auth">${authorName}</div>
                            </div>
                                <div class = "onlineBook">
                                    <a href = "#" target="_blank">READ</a></button>
                                </div>

                            </div>
                        `
                    }
                });
            if (inner !== '') {
                 booksConteiner.innerHTML += inner;
            }  
                addEventMedia();
                openAllSubjects();
        }
    })
});

function addEventMedia() {
    const clickBook = booksConteiner.querySelectorAll("img[data-type]");
    clickBook.forEach(function(elem) {
        elem.style.cursor = "pointer";
        elem.addEventListener("click",  showFullInfo);
    });
}

function showFullInfo() {
    let newConteiner = document.getElementById("books");
    newConteiner.id = "newConteiner";
    let url = '';
    if (this.dataset.type ) {
        url = 'https://openlibrary.org/api/books?bibkeys=' + this.dataset.type + '&jscmd=details&jscmd=data&format=json';
    } else {
        newConteiner.innerHTML = '<h2 class="error">ERROR</h2>';
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
        for(let key in output) {
            let authorName = "",
                authorUrl = "",
                subjectsName = '',
                subjectsPeople = '',
                subjectsPlaces = '';
                publishPlaces = '';
                
        output[key].authors = output[key].authors || [];
        output[key].authors.map(function(item) {
            authorName = item.name;
            authorUrl = item.url;
        }); 
        output[key].publishers = output[key].publishers || [];
        output[key].publishers.map((item) => publishers = item.name);
        output[key].publish_places = output[key].publish_places || [];
        output[key].publish_places.map((item) => publishPlaces += item.name + ", ");
        output[key].subjects = output[key].subjects || [];
        output[key].subjects.map((item) => subjectsName += item.name + ", ");
        output[key].subject_people = output[key].subject_people || [];
        output[key].subject_people.map((item) => subjectsPeople += item.name + ", ");
        output[key].subject_places = output[key].subject_places || [];
        output[key].subject_places.map((item) => subjectsPlaces += item.name + ", ");

        newConteiner.innerHTML = `
        <div class = 'border'>
            <div class = "blockLargeCover">
                <img src = "${output[key].cover.large}" class="cover_large"
                    alt = "${output[key].title}"    
                >
                ${(output[key].url) ? `<p class="text_url"> 
                    <a href="${output[key].url}" target="_blank">openlibrary.org</a></p>` : ''} 
                    <div class = "onlineBook">
                        <a href = "#" target="_blank">READ</a></button>
                    </div>
            </div>
        </div>
            <div class = "detailed">
                <div class="publish">
                    <h4 class="title">${`"` +  output[key].title + `"`}</h4>
                    ${(authorUrl) ? `<h3 class ="author">
                    <a href = "${authorUrl}" target="_blank">${authorName}</a></h3>` : ''}
                    <p>Published ${output[key].publish_date + ' by ' + publishers + ' in '
                    + publishPlaces + '.<br /> '}</p>
                </div>

                <div class="subjectDiv">
                    <p><b>SUBJECTS:</b><br /><br />${subjectsName}</p>
                    <p><b>PEOPLE:</b><br /><br />${subjectsPeople}</p>
                    <p><b>PLACES:</b><br /><br />${subjectsPlaces}</p>
                </div>

                <div class = "back">
                    <a href="#" onclick="history.go(0); return false;">Back</a>
                </div>
            </div>

                <div class = "object">
                    <p><b>The Physical Object:  </b>${output[key].notes}</p>
                    <p><b>Pagination: </b>${output[key].pagination}</p>
                    <p><b>Number of pages: </b>${output[key].number_of_pages}</p>
                </div>
            
                `
    }
})
    .catch((reason) => {
        booksConteiner.innerHTML = 'ERROR';
        console.error(reason);
    })
}
/*{ <img class="authLargeCover" 
    src="${urlCoverAuth + resultAuth + '-L.jpg'}" class="auth_large" 
    alt="${item.title}"> }*/