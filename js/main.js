'use strict'


class Movies {
    constructor() {
        this.boby = document.body;
        this.value = 'marvel';
        this.valueType;
        this.movCard = null;
        this.dataId;
        this.json = null;
        this.title = null;
        this.released = null;
        this.genre = null;
        this.country = null;
        this.director = null;
        this.actors = null;
        this.descr = null;
        this.poster = null;
        this.currentPage = 1;
        this.rows = 10;
        this.posts;
        this.start;
        this.end;
        this.paginationData;
        this.paginationEl;
        this.pagesCount;
        this.li;
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
    
    sendMov(e) {
    e.preventDefault();
    for(let input of this.elem) {
        this.value = input.value.trim();
        this.createMoviesCards(this.value,this.valueType);
        }
    }
    

    createMoviesCards() {
    
    const url = `https://www.omdbapi.com/?s=${encodeURIComponent(this.value)}&apikey=46429035`;
    const wrap = document.querySelector('.movies-cards');
    this.wrap.querySelector('.movies-cards').innerHTML = '';
        
    const temp = new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('GET', url);
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
                        </div>
                    </div> `;
                    wrap.insertAdjacentHTML('beforeend', str);
                    this.movCard = document.querySelector('.movies-card');
                });
                
                 
                this.displayList(response.Search);
                this.displayPagination(response.Search.length);
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
                    this.renderInfo();
                    this.modalWindow();
                }
        });

        request.send();
            
            document.querySelector('.descr').classList.remove('none');
            this.renderInfo();
            this.modalWindow();
        }
    }

    renderInfo() {
        this.title = this.json.Title;
        this.released = this.json.Released;
        this.genre = this.json.Genre;
        this.country = this.json.Country;
        this.director = this.json.Director;
        this.actors = this.json.Actors;
        this.descr = this.json.Plot;
        this.poster = this.json.Poster;
        
    }

    modalWindow() {
        document.querySelector('.descr').innerHTML = '';
        let str = `
            <div class="descr-modal">
                <p class="movies-descr_name">Name:${this.title}</p>
                <div class="movies-descr_main">
                    <div class="movies-descr_img">
                        <img src="${this.poster}" alt="">
                    </div>
                    <div class="movies_descr-about">
                        <p class="movies-card_item">Released: ${this.released}</p>
                        <p class="movies-card_item">Genre: ${this.genre}</p>
                        <p class="movies-card_item">Country: ${this.country}</p>
                        <p class="movies-card_item">Director: ${this.director}</p>  
                        <p class="movies-card_item">Actors: ${this.actors}</p>
                        <p class="movies-card_item">Description: ${this.descr}</p>
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

    displayList(res) {
        this.posts = document.querySelector('.movies-cards');
        this.currentPage--;
        this.start = this.rows * this.currentPage;
        this.end = this.start + this.rows;
        this.paginationData = res.slice(this.start, this.end);
        
    }
    displayPagination(res) {
        this.paginationEl = document.querySelector('.pagination');
        this.paginationEl.innerHTML = '';
        this.pagesCount = this.rows;
        const ul = document.createElement('ul');
        ul.classList.add('pagination__list');

        for (let i = 0; i < this.pagesCount; i++) {
            const li = this.displayPaginationBtn(i + 1, res);
            ul.appendChild(li)
        }
       
        this.paginationEl.appendChild(ul);
    }
    displayPaginationBtn(page, res) {
        const li = document.createElement('li');
        li.classList.add('pagination__item');
        li.innerText = page;
       
        li.addEventListener('click', () => {
            this.currentPage = page;
            this.displayList(res);
        })
        return li;
    }
    
    
    init() {
        console.dir(this);
        this.createMoviesCards();
        this.mov.addEventListener('submit', this.sendMov.bind(this));
        this.wrap.addEventListener('click', this.createModalWindow.bind(this));
        document.body.addEventListener('click', this.closeModalWindow.bind(this));
    }
}

const showMove = new Movies();

showMove.init();














































































































































































































































