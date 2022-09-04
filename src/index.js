import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import fetchImages from './api/fetchImages';
import { renderImage } from './template/renderImage';

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const buttonLoadEl = document.querySelector('.load-more');

let page = 1;
let query = '';
let showLightbox = new SimpleLightbox('.gallery a', { captionDelay: 250 });

const onSearchImages = event => {
  event.preventDefault();

  if (
    query === event.target.elements.searchQuery.value.trim() &&
    query !== ''
  ) {
    Notiflix.Notify.failure('Please enter another word!');
    return;
  }
  query = event.target.elements.searchQuery.value.trim();

  if (query === '') {
    Notiflix.Notify.info('Please enter a word to search.');
    return;
  }

  clearPage();

  fetchImages(query, page).then(image => {
    if (image.data.total === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    if (image.data.totalHits > 40) {
      buttonLoadEl.classList.remove('hide-btn');
    }
    Notiflix.Notify.success(`Hooray! We found ${image.data.totalHits} images.`);
    galleryEl.innerHTML = '';
    galleryEl.insertAdjacentHTML('afterbegin', renderImage(image.data));
    showLightbox.refresh();
  });
};

const onLoadMore = event => {
  page += 1;
  fetchImages(query, page).then(image => {
    if (Math.floor(image.data.totalHits / 40) < page) {
      Notiflix.Notify.info(
        'We are sorry, but you have reached the end of search results.'
      );
      galleryEl.insertAdjacentHTML('beforeend', renderImage(image.data));
      buttonLoadEl.classList.add('hide-btn');
      return;
    }
    galleryEl.insertAdjacentHTML('beforeend', renderImage(image.data));
    showLightbox.refresh();
  });
};

const clearPage = () => {
  page = 1;
  galleryEl.innerHTML = '';
  buttonLoadEl.classList.add('hide-btn');
};

formEl.addEventListener('submit', onSearchImages);
buttonLoadEl.addEventListener('click', onLoadMore);

// Scroll
let lastScroll = 0;
const defaultOffset = 100;

const scrollPosition = () =>
  window.pageYOffset || document.documentElement.scrollTop;
const containHide = () => formEl.classList.contains('hide');

window.addEventListener('scroll', () => {
  if (
    (scrollPosition() > lastScroll &&
      !containHide() &&
      scrollPosition() > defaultOffset) ||
    (scrollPosition() < lastScroll && !containHide())
  ) {
    //scroll up-down
    formEl.classList.add('hide');
  }
  if (scrollPosition() < defaultOffset && containHide()) {
    formEl.classList.remove('hide');
  }
  lastScroll = scrollPosition();
});
formEl.addEventListener('mouseover', () => {
  formEl.classList.remove('hide');
});
