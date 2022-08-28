import axios from 'axios';
import Notiflix from 'notiflix';
import fetchImages from './api/fetchImages';
import { renderImage } from './markup';

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');

const onSearchImages = event => {
  event.preventDefault();
  const images = event.target.elements.searchQuery.value.trim();

  fetchImages(images).then(image => {
    if (image.data.total === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    } else if (images === '') {
      galleryEl.innerHTML = '';
      return;
    };
     const array = image.data;
    galleryEl.innerHTML = '';
    galleryEl.insertAdjacentHTML('afterbegin', renderImage(array));
  });
};

formEl.addEventListener('submit', onSearchImages);



let lastScroll = 0;
const defaultOffset = 100;

const scrollPosition = () => window.pageYOffset || document.documentElement.scrollTop;
const containHide = () => formEl.classList.contains('hide');

window.addEventListener('scroll', () => {
    if(scrollPosition() > lastScroll && !containHide() && scrollPosition() > defaultOffset) {
        //scroll down
        formEl.classList.add('hide');
    }
    else if(scrollPosition() < lastScroll && containHide()){
        //scroll up
        formEl.classList.remove('hide');
    }

    lastScroll = scrollPosition();
})
formEl.addEventListener('click', () => { formEl.classList.remove('hide') });