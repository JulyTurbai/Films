'use strict'


class Movies {
    constructor() {
        this.boby = document.body;
        this.url;
        this.movCard = null;
        this.dataId;
        this.json = null;
        this.currentPage = 1;
        this.rows = 10;
        this.posts;
        this.paginationEl;
        this.pagesCount;
    }

    get wrap() {
        return document.querySelector('.movies');
    }
    get mov() {
        return document.forms.userMovie;
    }
    get data() {
        return this.mov.mov.data;
    }
    get elem() {
        return this.mov.data.elements
    }

   
    
    namedMov(e) {
    e.preventDefault();

    const informData = {};
    let valid = true;

    for(let input of this.elem) {
        this.value = input.value.trim();

        if (!this.value) {
            valid = false;
            return;
        }
        
        informData[input.name] = this.value;
        }
        
        if(!informData) return;

        this.url = `https://www.omdbapi.com/?s=${encodeURIComponent(informData.movie)}&type=${informData.type}&page=${this.currentPage}&apikey=46429035`;
        this.createMoviesCards(this.url);
    }

    
    createMoviesCards() {
    
    const wrap = document.querySelector('.movies-cards');
    this.wrap.querySelector('.movies-cards').innerHTML = '';
        
    const temp = new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('GET', this.url);
    request.responseType = 'json';
    request.addEventListener('readystatechange', ()=> {
        if(request.readyState === 4  && request.status == 200) {
            resolve(request.response)
        }
        if(request.status == 404) {
            reject('Ресурс не знайдено');
            
        }
        
    });
    request.send();
    
    })
    temp
    .then((response)=> {
            response.Search.forEach(element => {
            let str = `
                    <div class="movies-card">
                        <div class="movies-card_img">
                            <img src="${element.Poster}" data-id=${element.imdbID} alt="">
                        </div>
                        <div class="movies-card_main">
                            <p class="movies-card_name">${element.Title}</p>
                            <p class="movies-card_year">${element.Year}</p>
                            <p class="movies-card_type">${element.Type}</p>
                        </div>
                    </div> `;
                    wrap.insertAdjacentHTML('beforeend', str);
                });
                
            })
        .catch((error) => console.error(error))
        
    }

    
    createModalWindow(event) {
        
        let t = event.target;
        if(t.matches('.movies-card_img img')) {
            this.dataId = t.dataset.id;
            const url = `https://www.omdbapi.com/?i=${this.dataId}&apikey=46429035`;
            const request = new XMLHttpRequest();

            request.open('GET', url);
            request.responseType = 'json';

            request.addEventListener('readystatechange', () => {
                if(request.readyState === 4 && request.status === 200) {
                    this.json = request.response;
                    document.querySelector('.descr').classList.remove('none');
                    document.querySelector('.descr').classList.add('animate');
                    document.querySelector('.descr').classList.add('animate-fade');
                    this.modalWindow();
                }
        });

        request.send();
            document.querySelector('.descr').classList.remove('none');
            this.modalWindow();
        }
    }

    modalWindow() {
        
        let title = this.json.Title;
        let released = this.json.Released;
        let genre = this.json.Genre;
        let country = this.json.Country;
        let director = this.json.Director;
        let actors = this.json.Actors;
        let descr = this.json.Plot;
        let poster = this.json.Poster;
        
        document.querySelector('.descr').innerHTML = '';
        let str = `
            <div class="descr-modal">
                <p class="movies-descr_name">Name:${title}</p>
                <div class="movies-descr_main">
                    <div class="movies-descr_img">
                        <img src="${poster}" alt="">
                    </div>
                    <div class="movies_descr-about">
                        <p class="movies-card_item">Released: ${released}</p>
                        <p class="movies-card_item">Genre: ${genre}</p>
                        <p class="movies-card_item">Country: ${country}</p>
                        <p class="movies-card_item">Director: ${director}</p>  
                        <p class="movies-card_item">Actors: ${actors}</p>
                        <p class="movies-card_item">Description: ${descr}</p>
                    </div>
                </div>
            </div>`
            document.querySelector('.descr').insertAdjacentHTML('beforeend', str);
    }

    closeModalWindow(event) {
        let t = event.target;
        if(t.matches('.descr')) {
           document.querySelector('.descr').classList.add('none');
        }
    }

    displayList(res, rowPerPage, page) {
        this.posts = document.querySelector('.movies-cards');
        this.currentPage--;
        const start = rowPerPage * page;
        const end = start + rowPerPage;
        const paginationData = res.slice(start, end);
    }

    displayPagination(res) {
        this.paginationEl = document.querySelector('.pagination');
        this.paginationEl.innerHTML = '';
        this.pagesCount = Math.ceil(res / this.rows);
        const ul = document.createElement('ul');
        ul.classList.add('pagination__list');

        for (let i = 0; i < this.pagesCount; i++) {
            const li = this.displayPaginationBtn(i + 1);
            ul.appendChild(li)
        }
       
        this.paginationEl.appendChild(ul);
    }
    displayPaginationBtn(page) {
        const li = document.createElement('li');
        li.classList.add('pagination__item');
        li.innerText = page;
       
        li.addEventListener('click', (res,) => {
            this.currentPage = page;
            this.displayList(res, this.rows, page);
        })
        return li;
    }
    
    init() {
        this.createMoviesCards();
        this.mov.addEventListener('submit', this.namedMov.bind(this));
        this.wrap.addEventListener('click', this.createModalWindow.bind(this));
        document.body.addEventListener('click', this.closeModalWindow.bind(this));
        
    }
}

const showMove = new Movies();

showMove.init();














































































































































































































































