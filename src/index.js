import axios from 'axios';
import Notiflix from 'notiflix';
import fetchImages from './api/fetchImages';
import renderImage from './markup';

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');


const onSearchImages = event => {
  event.preventDefault();
  const images = event.target.elements.searchQuery.value.trim();

  fetchImages(images).then(image => {
    if (image.total === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    console.log(image);
  });
};

formEl.addEventListener('submit', onSearchImages);
