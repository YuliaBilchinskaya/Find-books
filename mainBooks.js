document.addEventListener('DOMContentLoaded',() => {
Promise.all([
    fetch('http://openlibrary.org/subjects/fantasy.json?limit=7&offset=7').then(value => value.json()),
    fetch('http://openlibrary.org/subjects/romance.json?limit=7&offset=7').then(value => value.json()),
    fetch('http://openlibrary.org/subjects/history.json?limit=7&offset=7').then(value => value.json()),
    fetch('http://openlibrary.org/subjects/biographies.json?limit=7&offset=7').then(value => value.json()),
    fetch('http://openlibrary.org/subjects/science.json?limit=7&offset=7').then(value => value.json()),
    fetch('http://openlibrary.org/subjects/religion.json?limit=7&offset=7').then(value => value.json()),
    fetch('http://openlibrary.org/subjects/music.json?limit=7&offset=7').then(value => value.json()),
    fetch('http://openlibrary.org/subjects/detective.json?limit=7&offset=7').then(value => value.json()),
    fetch('http://openlibrary.org/subjects/children.json?limit=7&offset=7').then(value => value.json()),
    ]).then((output) => {
        for(let j = 0; j < output.length; j++) {
            let outputName = output[j].name;
            let uppercaseLetter = outputName.charAt(0).toUpperCase() + outputName.substr(1); //заглавные первые буквы
            let inner = `<h3 id = "mainSubject" class="${outputName}">${uppercaseLetter}</h3>`; //Темы
                output[j].works.forEach(function(item) { 
                    let dataInfo = `data-title="${item.title}" data-type="${item.cover_edition_key}"`;
                    if (output[j].name) {
                        inner += ` 
                            <div class = "main_conteiner">
                                <div class="book_title">${item.title}</div>
                                    <img class="cover-book" 
                                        src="${urlCover + item.cover_id + '-M.jpg'}" class="img_cover"
                                        alt="${item.title}" ${dataInfo}>
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

function openAllSubjects() {
    const clickSubject = booksConteiner.querySelectorAll("#mainSubject");
    clickSubject.forEach(function(elem) {
        elem.style.cursor = "pointer";
        elem.addEventListener("click",  showAllSubjects);
    });
}


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
        url = 'https://openlibrary.org/api/books?bibkeys=' + this.dataset.type + '&jscmd=data&format=json';
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
        
            let authorName = "";
            let authorUrl = "";
            let subjectsName = '';
            let subjectsUrl = '';
            let subjectsPeople = '';
            let subjectsPlaces = '';
            output[key].authors.map((item) => authorName = item.name);
            output[key].authors.map((item) => authorUrl = item.url);
            output[key].publishers.map((item) => publishers = item.name);
            output[key].publish_places.map((item) => publish_places = item.name);
            output[key].subjects.map((item) => subjectsName += item.name + ', ');
            output[key].subjects.map((item) => subjectsUrl = item.url);
            output[key].subject_people.map((item) => subjectsPeople += item.name + ', ');
            output[key].subject_places.map((item) => subjectsPlaces += item.name + ', ');

            newConteiner.innerHTML = `
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
            <div class = "detailed">
                <div class="publish">
                    <h4 class="title">${`"` +  output[key].title + `"`}</h4>

                    ${(authorUrl) ? `<h3 class ="author">
                    <a href = "${authorUrl}" target="_blank">${authorName}</a></h3>` : ''}
                    <p>Published ${output[key].publish_date + ' by ' + publishers + ' in '
                    + publish_places + '.<br /> '}</p>
                </div>

                <div class="subjectDiv">
                    ${(subjectsUrl) ? `<p><b>SUBJECTS:</b><br /><br />
                    <a href = "${subjectsUrl}" target="_blank">${subjectsName}</a></h3>` : ''}
                    <p><b>PEOPLE:</b><br /><br />${subjectsPeople}</p>
                    <p><b>PLACES:</b><br /><br />${subjectsPlaces}</p>
                </div>

                <div class = "object">
                    <p><b>The Physical Object:  </b>${output[key].notes}</p>
                    <p><b>Pagination: </b>${output[key].pagination}</p>
                    <p><b>Number of pages: </b>${output[key].number_of_pages}</p>
                </div>

                <div class = "back">
                    <a href="#" onclick="location.reload(); return false;">Back</a>
                </div>
            </div>
            `
           
        }
    })
    .catch((reason) => {
        booksConteiner.innerHTML = 'ERROR';
        console.error(reason);
    })
}

function showAllSubjects() {
    let subConteiner = document.getElementById("books");
    subConteiner.id = "subConteiner";
    let classSub = this.className;
    let subUrl = '';
        subUrl = 'https://openlibrary.org/subjects/' + classSub + '.json?limit=50';
    fetch(subUrl)
    .then(function(value) {
        if (value.status !== 200) {
            return Promise.reject(new Error(value));
        }
        return value.json();
    })
    .then(function(output) { 
        let inner = '';
        output.works.forEach(function(item) {
            if (output.name) {
            inner += ` 
            <div class = "main_conteiner">
            <div class="book_title">${item.title}</div>
                <img class="cover-book" 
                    src="${urlCover + item.cover_id + '-M.jpg'}" class="img_cover"
                    alt="${item.title}">
            <div class = "onlineBook">
                <a href = "#" target="_blank">READ</a></button>
            </div>
        </div>
            `
            }
        });
        if (inner !== '') {
            subConteiner.innerHTML = inner;
       }  
    });
        }

        $(function() {
            $.fn.scrollToTop = function() {
                $(this).hide().removeAttr("href");
                    if ($(window).scrollTop() != "0") {
                        $(this).fadeIn("slow")
                    }
                    let scrollDiv=$(this);
                    $(window).scroll(function() {
                        if ($(window).scrollTop() == "0"){
                            $(scrollDiv).fadeOut("slow")
                        } else { 
                            $(scrollDiv).fadeIn("slow")
                        }
                    }); 
                        $(this).click(function() {
                            $("html, body").animate({scrollTop:0},"slow")
                        })
            }});
        
        $(function() { 
            $("#toTop").scrollToTop(); 
        }); 