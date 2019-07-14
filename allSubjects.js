function openAllSubjects() {
    const clickSubject = booksConteiner.querySelectorAll("#mainSubject");
    clickSubject.forEach(function(elem) {
        elem.style.cursor = "pointer";
        elem.addEventListener("click",  showAllSubjects);
    });
}
function showAllSubjects() {
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
        console.log(output)
        let inner = '';
        let authorName = "";
        let authorKey = "";

        output.works.forEach(function(item) {
            item.authors = item.authors || [];
            item.authors.map((item) => authorName = item.name);
            item.authors.map((item) => authorKey = item.key);
            let resultAuth = authorKey.replace("/authors/", "");
            
            if (output.name) {
                let dataInfo = `data-title="${item.title}" data-type="${item.cover_edition_key}"`;
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
            booksConteiner.innerHTML = inner;
       }  
       addEventMedia();
    });
        }
        function addEventMedia() {
            const clickBook = booksConteiner.querySelectorAll("img[data-type]");
            clickBook.forEach(function(elem) {
                elem.style.cursor = "pointer";
                elem.addEventListener("click", showFullInfo);
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

