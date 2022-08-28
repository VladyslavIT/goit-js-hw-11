import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import fetchImages from './api/fetchImages';
import { renderImage } from './markup';

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const buttonLoadEl = document.querySelector('.load-more');

let page = 1;
let images = '';
let showLightbox = null;
buttonLoadEl.style.display = 'none';

const onSearchImages = (event) => {
  event.preventDefault();
  const images = event.target.elements.searchQuery.value.trim();

  fetchImages(images, page).then(image => {
    if (image.data.total === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    } else if (images === '') {
      galleryEl.innerHTML = '';
      Notiflix.Notify.info(
        'Sorry, there are no images matching your search query. Please enter a word to search.'
      );
      return;
    }
    if (page !== 1) {
      Notiflix.Notify.success(
        `Hooray! We found ${image.data.totalHits} images.`
      );
      buttonLoadEl.style.display = 'none';
    }
    const array = image.data;
    galleryEl.innerHTML = '';
    galleryEl.insertAdjacentHTML('afterbegin', renderImage(array));
    buttonLoadEl.style.display = 'block';
  });
};

const onLoadMore = (event) => {
  fetchImages(images, (page += 1)).then(image => {
    console.log(image);
    const array = image.data;
    if (Math.floor(image.data.totalHits / 40) < page) {
      Notiflix.Notify.info(
        'We are sorry, but you have reached the end of search results.'
      );
      return;
    }
    let showLightbox = new SimpleLightbox('.gallery a').refresh();
    galleryEl.insertAdjacentHTML('beforeend', renderImage(array));
  });
};


const onShowLargeImage = (event) => {
  event.preventDefault();
  if (event.target.nodeName !== 'IMG') {
    return;
  }
  let showLightbox = new SimpleLightbox('.gallery a', { captionDelay: 250 });
  showLightbox.on('show.simplelightbox', function () {});
};

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
    scrollPosition() > lastScroll &&
    !containHide() &&
    scrollPosition() > defaultOffset
  ) {
    //scroll down
    formEl.classList.add('hide');
  } else if (scrollPosition() < lastScroll && containHide()) {
    //scroll up
    formEl.classList.remove('hide');
  }

  lastScroll = scrollPosition();
});
formEl.addEventListener('click', () => {
  formEl.classList.remove('hide');
});
