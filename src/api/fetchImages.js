import axios from 'axios';
import Notiflix from 'notiflix';

export default async function fetchImages(q, page=1) {
  try {
    const BASE_URL = 'https://pixabay.com/api/';
   
    const response = await axios.get(`${BASE_URL}`, {
      params : {
      key: '29531020-3b97d8056313c52b7859c1bca',
      q: `${q}`,
      image_type: `photo`,
      orientation: `horizontal`,
      safesearch: `true`,
      per_page: 40,
      page: `${ page }`, 
    },
    });
   
      return response;
  }
  catch (error) { 
      if (error.status === 404) {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');   
      }
      }
};


