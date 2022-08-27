export function renderImage(image) {
    const markup = image.hits
        .map(
            img =>
                `<div class="photo-card">
    <img src="${img.webformatURL}" alt="${img.tags}" loading="lazy" />
      <div class="info">  <p class="info-item <b>Likes:</b>${img.likes}</p>
       <p class="info-item  <b>Views:</b>${img.views}</p>
        <p class="info-item">
         <b>Comments:</b>${img.comments}</p>
          <p class="info-item">
           <b>Downloads:</b>${img.downloads}</p></div>
    </div>`
    ).join('');
    
    return markup;
};
