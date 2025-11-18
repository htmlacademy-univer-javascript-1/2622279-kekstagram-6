import { getPhotosArray } from './photos.js';
import { renderPictures } from './pictures.js';
import './form.js';

// Генерация массива фотографий
const photos = getPhotosArray();
renderPictures(photos);

// Экспорт для использования в других модулях (если понадобится)
export { photos };

