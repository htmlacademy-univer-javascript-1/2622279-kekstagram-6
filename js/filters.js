import { renderPictures, removePictures } from './pictures.js';
import {debounce, shuffleArray} from './util.js';
import {getPhotos} from './main.js';

const COUNT_OF_FILTER = 10;
const ACTIVE_CLASS = 'img-filters__button--active';

const imgFilters = document.querySelector('.img-filters');
const imgFiltersForm = imgFilters.querySelector('.img-filters__form');

const isButton = (evt) => evt.target.tagName === 'BUTTON';


// Доступные фильтры
const availableFilters = {
  'filter-default': () => getPhotos(),
  'filter-random': () => {
    const allPhotos = getPhotos();
    const shuffled = shuffleArray(allPhotos);
    return shuffled.slice(0, COUNT_OF_FILTER);
  },
  'filter-discussed': () => getPhotos().sort((firstElement, secondElement) => secondElement.comments.length - firstElement.comments.length
  )
};

// Обработчик клика по форме фильтров
const onImgFilterFormClick = debounce((evt) => {
  if (isButton(evt) && availableFilters[evt.target.id]) {
    // Удаляем старые фотографии
    removePictures();
    // Рендерим новые фотографии
    renderPictures(availableFilters[evt.target.id]());
  }
});

// Обработчик клика по кнопке
const onButtonClick = (evt) => {
  if (isButton(evt) && availableFilters[evt.target.id]) {
    const selectedButton = imgFiltersForm.querySelector(`.${ACTIVE_CLASS}`);
    if (selectedButton) {
      selectedButton.classList.remove(ACTIVE_CLASS);
    }
    evt.target.classList.add(ACTIVE_CLASS);
  }
};

imgFiltersForm.addEventListener('click', onImgFilterFormClick);
imgFiltersForm.addEventListener('click', onButtonClick);
