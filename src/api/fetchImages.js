import axios from "axios";

export default async function fetchImages(q) {

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '29531020-3b97d8056313c52b7859c1bca';
const FILTERS = 'image_type=photo&orientation=horizontal&safesearch=true&page=1&per_page=40'
 
    return fetch(`${BASE_URL}?key=${KEY}&q=${q}&${FILTERS}`).then(response => response.json())
};