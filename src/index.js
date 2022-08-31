import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import fetchImages from './api/fetchImages';
import { renderImage } from './template/markup';

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const buttonLoadEl = document.querySelector('.load-more');

let page = 1;
let images = '';
let showLightbox = null;
buttonLoadEl.style.display = 'none';

const onSearchImages = event => {
  event.preventDefault();
  clearPage();
  const images = event.target.elements.searchQuery.value.trim();

  fetchImages(images, page).then(image => {
    console.log(image);
    if (image.data.total === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    if (images === '') {
      Notiflix.Notify.info('Please enter a word to search.');
      const array = image.data;
      galleryEl.insertAdjacentHTML('afterbegin', renderImage(array));
      buttonLoadEl.style.display = 'block';
      return;
    }
    if (page >= 1) {
     Notiflix.Notify.success(
        `Hooray! We found ${image.data.totalHits} images.`
      );
      const array = image.data;
      galleryEl.innerHTML = '';
      galleryEl.insertAdjacentHTML('afterbegin', renderImage(array));
      buttonLoadEl.style.display = 'block';
    } 
    if (image.data.hits.length < 40) {
      buttonLoadEl.style.display = 'none';
    }
  });
};

const onLoadMore = event => {
  fetchImages(images, (page += 1)).then(image => {
    const array = image.data;
    if (Math.floor(image.data.totalHits / 40) < page) {
      Notiflix.Notify.info(
        'We are sorry, but you have reached the end of search results.'
      );
      return;
    }
    galleryEl.insertAdjacentHTML('beforeend', renderImage(array));
    showLightbox.refresh();
  });
};

const onShowLargeImage = event => {
  event.preventDefault();
  if (event.target.nodeName !== 'IMG') {
    return;
  }
  if (!showLightbox) {
    showLightbox = new SimpleLightbox('.gallery a', { captionDelay: 250 });
  }
};

const clearPage = () => {
  page = 1;
  galleryEl.innerHTML = '';
  buttonLoadEl.style.display = 'none';
}

formEl.addEventListener('submit', onSearchImages);
buttonLoadEl.addEventListener('click', onLoadMore);
galleryEl.addEventListener('click', onShowLargeImage);

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
  lastScroll = scrollPosition();
});
formEl.addEventListener('mouseover', () => {
  formEl.classList.remove('hide');
});
