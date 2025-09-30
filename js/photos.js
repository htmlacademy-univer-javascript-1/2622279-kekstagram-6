import { getRandomInteger, getRandomArrayElement, createIdGenerator } from './util.js';
import { generateComment } from './comments.js';
import { DESCRIPTIONS, PHOTOS_COUNT } from './data.js';

// Функция для создания массива уникальных ID от 1 до 25 для фото
const createUniquePhotoIds = () => {
  const ids = [];
  for (let i = 1; i <= PHOTOS_COUNT; i++) {
    ids.push(i);
  }
  return ids.sort(() => Math.random() - 0.5);
};

// Создаем массив уникальных ID один раз
const photoIds = createUniquePhotoIds();

//Функция генерации массива фотографий
export const generatePhoto = (_, index) => {
  const commentIdGenerator = createIdGenerator();
  const commentsCount = getRandomInteger(0, 30);
  const comments = Array.from({length: commentsCount}, () => generateComment(commentIdGenerator));

  return {
    id: photoIds[index],
    url:  `photos/${index + 1}.jpg`,
    description: getRandomArrayElement(DESCRIPTIONS),
    likes: getRandomInteger(15, 200),
    comments: comments
  };
};

export const getPhotosArray = () => Array.from({length: PHOTOS_COUNT}, generatePhoto);
