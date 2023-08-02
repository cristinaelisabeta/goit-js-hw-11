import Notiflix from 'notiflix';
import fetchImages from './JS/api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.search-form');
const wrapper = document.querySelector('.gallery');
const target = document.querySelector('.target-guard');

const options = {
  root: null,
  rootMargin: '400px',
  threshold: 1.0,
};
const observer = new IntersectionObserver(getImages, options);

form.addEventListener('submit', onSubmit);

let page = 1;
let searchOnInput = '';

function onSubmit(event) {
  event.preventDefault();

  searchOnInput = event.target.searchQuery.value;

  wrapper.innerHTML = '';
  observer.unobserve(target);

  if (!searchOnInput) {
    Notiflix.Notify.failure('Please, search any picture!');
    return;
  }

  page = 1;
  
  fetchImages(searchOnInput, page).then(response => {
    if (!response.data.total) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    } else if (response.data.hits.lengts <= 40) {
      observer.unobserve(target);
    } else {
      createMarkup(response.data.hits);
      observer.observe(target);
    }
    Notiflix.Notify.success(
      `Hooray! We found ${response.data.totalHits} images.`
    );
  });
}

function createMarkup(array) {
  const imgList = array
    .map(item => {
      return `
    <div class="photo-card"> 
      <a href="${item.largeImageURL}">
        <img  src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
      </a>
      <div class="information">
        <p class="descritions">
          <b>Likes: ${item.likes}</b>
        </p>
        <p class="descritions">
          <b>Views: ${item.views}</b>
        </p>
        <p class="descritions">
          <b>Comments: ${item.comments}</b>
        </p>
        <p class="descritions">
          <b>Downloads: ${item.downloads}</b>
        </p>
      </div>
    </div>`;
    })
    .join('');

  wrapper.insertAdjacentHTML('beforeend', imgList);

  const lightbox = new SimpleLightbox('.gallery a', {
  });
}

function getImages(entries) {
  entries.forEach(entrie => {
    if (entrie.isIntersecting) {
      page += 1;
      fetchImages(searchOnInput, page).then(response => {
        if (response.data.totalHits < page * 40) {
          Notiflix.Notify.failure(
            `We're sorry, but you've reached the end of search results.`
          );
          observer.unobserve(target);
          return;
        }
        createMarkup(response.data.hits);
      });
    }
  });
}
