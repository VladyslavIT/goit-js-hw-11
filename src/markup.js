export function renderImage(array) {
    const markup = array.hits
        .map(
            array =>
                `<a class="gallery__item" href="${array.largeImageURL}">
                <div class="photo-card">
    <img src="${array.webformatURL}" alt="${array.tags}" loading="lazy" />
      <div class="info">
      <p class="info-item">
      <b>Likes:</b>${array.likes}</p>  
         <p class="info-item">
          <b>Views:</b>${array.views}</p>
           <p class="info-item">
            <b>Comments:</b>${array.comments}</p>
             <p class="info-item">
              <b>Downloads:</b>${array.downloads}</p></div>
    </div></a>`
        ).join('');
    
    return markup;
}


