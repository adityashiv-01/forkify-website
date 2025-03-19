import View from './View.js';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No Recipe found for that query. Please try again!';
  _message = '';

  _generateMarkup() {
    return this._data.map(this._generateMarkupPreview).join('');
  }

  _generateMarkupPreview(obj) {
    const id = window.location.hash.slice(1);

    return `
        <li class="preview">
            <a class="preview__link ${
              obj.id === id ? 'preview__link--active' : ''
            }" href="#${obj.id}">
              <figure class="preview__fig">
                <img src="${obj.image}" alt="${obj.title}" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${obj.title}</h4>
                <p class="preview__publisher">${obj.publisher}</p>
                <div class="preview__user-generated ${obj.key ? '' : 'hidden'}">
                <svg>
                use href="${icons}#icon-user"></use>
                </svg>
                 </div>
              </div>
            </a>
          </li>
        `;
  }
}

export default new ResultsView();
