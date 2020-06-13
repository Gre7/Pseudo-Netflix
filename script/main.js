'use strict'

const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';


const leftMenu = document.querySelector('.left-menu'),
  hamburger = document.querySelector('.hamburger'),
  tvShowsList = document.querySelector('.tv-shows__list'),
  modal = document.querySelector('.modal'),
  tvShows = document.querySelector('.tv-shows'),
  tvCardImg = document.querySelector('.tv-card__img'),
  modalTitle = document.querySelector('.modal__title'),
  genresList = document.querySelector('.genres-list'),
  rating = document.querySelector('.rating'),
  description = document.querySelector('.description'),
  modalLink = document.querySelector('.modal__link'),
  searchForm = document.querySelector('.search__form'),
  searchFormInput = document.querySelector('.search__form-input'),
  preloader = document.querySelector('.preloader'),
  dropdown  = document.querySelectorAll('.dropdown '),
  tvShowsHead = document.querySelector('.tv-shows__head'),
  trailer = document.querySelector('#trailer'),
  headTrailer = document.querySelector('#head-trailer');


  //preloader

  const loading = document.createElement('div');
  loading.className = 'loading';

//Get data response

const DBservice = class {

  constructor() {
    this.SERVER = 'https://api.themoviedb.org/3/';
    this.API_KEY = '87c607eca59b8817f3346ff74c87fa16';
  }

  getData = async url => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Ops we could not to get Data on url: ${url}`)
    }
    return await res.json();
  }
  getDataTest = () => {
    return this.getData('test.json');
  }

  getTestCard = () => {
    return this.getData('card.json')
  }

  getSearchResults = query => this
    .getData(`${this.SERVER}search/tv?api_key=${this.API_KEY}&language=ru-RU&query=${query}`)

  getTvShow = id => this.getData(`${this.SERVER}tv/${id}?api_key=${this.API_KEY}&language=ru-Ru`) 

  getTopRated = () => this.getData(`${this.SERVER}tv/top_rated?api_key=${this.API_KEY}&language=ru-Ru&page=1`)

  getPopular = () => this.getData(`${this.SERVER}tv/popular?api_key=${this.API_KEY}&language=ru-Ru&page=1`)

  getToday = () => this.getData(`${this.SERVER}tv/airing_today?api_key=${this.API_KEY}&language=ru-Ru&page=1`)

  getWeek = () => this.getData(`${this.SERVER}tv/on_the_air?api_key=${this.API_KEY}&language=ru-Ru&page=1`)

  getTrailer = id => this.getData(`${this.SERVER}tv/${id}/videos?api_key=${this.API_KEY}&language=ru-Ru`)
};

const dbService = new DBservice();

// render card

const renderCards = (response, target) => {
  tvShowsList.textContent = '';

  if (!response.total_results) {
    loading.className = '';
    tvShowsHead.textContent = 'К сожалению по вашему запросу ничего не найдено.';
    return;
  }

  tvShowsHead.textContent = target ? target.textContent : 'Результат поиска';
  
  response.results.forEach(item => {
    const { 
      backdrop_path: backdrop,
      name: title,
      poster_path: poster,
      vote_average: vote,
      id
    } = item;

    const posterImg = poster ? IMG_URL + poster : 'img/no-poster.jpg';
    const backdropImg = backdrop ? IMG_URL + backdrop : '';
    const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : ''; 

    const card = document.createElement('li');
    card.id = id;
    card.className = 'tv-shows__item';
    card.insertAdjacentHTML('beforeend', `
      <a href="#" class="tv-card">
        ${voteElem}
        <img class="tv-card__img"
              src="${posterImg}"
              data-backdrop="${backdropImg}"
              alt="${title}">
        <h4 class="tv-card__head">${title}</h4>
      </a>
    `)
    loading.remove();
    tvShowsList.append(card);
  });
  
};

// search

searchForm.addEventListener('submit', event => {
  event.preventDefault()
  const value = searchFormInput.value;
  searchFormInput.style.borderTopColor = '';
  if (value.trim()) {
    tvShows.append(loading);
    dbService.getSearchResults(value).then(renderCards);
  } else {
    searchFormInput.style.borderTopColor = 'red';
  }
  return false;
});

//change Backdrop Image

const changeImg = event => {
  const target = event.target;
  const card = target.closest('.tv-shows__item');
  if (card) {
    let img = card.querySelector('.tv-card__img');
      if (img.dataset.backdrop) {
        [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src]
      }
  }
};

// Open and cloe menu

const closeDropdown= () => {
  dropdown.forEach(item => {
    item.classList.remove('active');
  })
};

  hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
  });
  
  document.addEventListener('click', event => {
    const target = event.target;
    if (!target.closest('.left-menu')) {
      leftMenu.classList.remove('openMenu');
      hamburger.classList.remove('open');
      closeDropdown();
    }
  });
  
  leftMenu.addEventListener('click', event => {
    event.preventDefault();
    const target = event.target;

    if (target.closest('#top-rated')) {
      dbService.getTopRated().then(response => renderCards(response, target));
    }

    if (target.closest('#popular')) {
      dbService.getPopular().then(response => renderCards(response, target));
    }

    if (target.closest('#today')) {
      dbService.getToday().then(response => renderCards(response, target));
    }

    if (target.closest('#week')) {
      dbService.getWeek().then(response => renderCards(response, target));
    }
    const dropdown = target.closest('.dropdown');
    if (dropdown) {
      dropdown.classList.toggle('active');
      leftMenu.classList.add('openMenu');
      hamburger.classList.add('open');
    }
  });  

  tvShowsList.addEventListener('mouseover', changeImg);
  tvShowsList.addEventListener('mouseout', changeImg);

// Open and cloe modal window

  tvShowsList.addEventListener('click', event => {
    event.preventDefault();
    const target = event.target.closest('.tv-shows__item');
    if (target) {
      preloader.style.display = 'block';
      dbService.getTvShow(target.id)
      // .then(response => {
        //   console.log('response: ', response);
        //   tvCardImg.src = IMG_URL + response.poster_path;
        //   tvCardImg.alt = response.name;
        //   if (response.homepage) {
        //     modalLink.href = response.homepage;
        //     modalLink.style.display = '';
        //   } else {
        //     modalLink.style.display = 'none';
        //   }
        //   modalTitle.textContent = response.name;
        //   genresList.textContent = '';
        //   response.genres.forEach(item => {
        //     genresList.innerHTML += `<li>${item.name}</li>`
        //   });
        //   rating.textContent = response.vote_average;
        //   description.textContent = response.overview;
        //   return response.id;
        // })
        .then(({ 
            poster_path: posterPath, 
            name: title, 
            genres, 
            vote_average: voteAverage, 
            overview, 
            homepage,
            id}) => {
          posterPath ? tvCardImg.src = IMG_URL + posterPath : tvCardImg;
          tvCardImg.alt = title;
          modalTitle.textContent = title;
          genresList.innerHTML = '';
          for (const item of genres) {
            genresList.innerHTML += `<li>${item.name}</li>`;
          }
          rating.textContent = voteAverage;
          description.textContent = overview;
          modalLink.href = homepage;
          return id;
        })
        .then(dbService.getTrailer)
        .then(response => {
          headTrailer.classList.add('hide');
          trailer.textContent = '';
          if (response.results.length) {
            headTrailer.classList.remove('hide');
            response.results.forEach(item => {
              const trailerItem = document.createElement('li');
              trailerItem.className = "trailer-item"
              trailerItem.insertAdjacentHTML('beforeend', `
                <iframe 
                  width="480" 
                  height="300" 
                  src="https://www.youtube.com/embed/${item.key}" 
                  frameborder="0" 
                  allowfullscreen>
                </iframe>
              `)
              trailer.append(trailerItem);
            })
          }
        })
        .then(() => {
          document.body.style.overflow = 'hidden';
          modal.classList.remove('hide');
        })
        .finally(() => {
          preloader.style.display = '';
        })
    } 
  });

  modal.addEventListener('click', event => {
    const target = event.target;
    if (target.closest('.cross') || !modal.classList.contains('hide')) {
      document.body.style.overflow = '';
      modal.classList.add('hide');
    }
  })

