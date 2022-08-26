import axios from "axios";
import Notiflix from "notiflix";
import fetchImages from "./api/fetchImages";

const inputEL = document.querySelector('.form-input');
const buttonEl = document.querySelector('.form-button');

const onSearchImages = event => {
  const image = event.target.value.trim();

  fetchImages(image)
    .then(images => console.log(images))
    .catch(error => {
      if (error.status === 404) {
        Notiflix.Notify.failure();
      }
    });
};

inputEL.addEventListener('input', onSearchImages);

