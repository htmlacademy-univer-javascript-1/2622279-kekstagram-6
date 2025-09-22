// Функция для генерации случайного числа в диапазоне
const getRandomInteger = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

// Функция для создания массива уникальных ID от 1 до 25 для фото
const createUniquePhotoIds = () => {
  const ids = [];
  for (let i = 1; i <= 25; i++) {
    ids.push(i);
  }
  return ids.sort(() => Math.random() - 0.5);
};
// Создаем массив уникальных ID один раз
const photoIds = createUniquePhotoIds();

// Функция для генерации уникального ID комментариев
const createIdGenerator = () => {
  let lastGeneratedId = 0;
  return () => {
    lastGeneratedId += 1;
    return lastGeneratedId;
  };
};

const DESCRIPTIONS = [
  'Прекрасный вечер',
  'Любимое фото',
  'Летнее приключение',
  'Вечер с друзьями',
  'Приключения ждут',
  'Летний пейзаж',
  'Хорошее настроение'
];

const MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

const NAMES = [
  'Андрей',
  'Василиса',
  'Олег',
  'Роман',
  'Ольга',
  'Василий'
];

//Функция получения случайного элемента массива
const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

//Функция генерации комментария
const generateComment = (idGenerator)=>{
  const messageCount = getRandomInteger(1,2);
  const messages = Array.from({length: messageCount}, () => getRandomArrayElement(MESSAGES));

  return {
    id: idGenerator(),
    avatar: `img/avatar-${getRandomInteger(1, 6)}.svg`,
    message: messages.join(' '),
    name: getRandomArrayElement(NAMES)
  };
};

//Функция генерации массива фотографий
const generatePhoto = (_, index) => {
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

const photosArray = Array.from({length: 25}, generatePhoto);
// eslint-disable-next-line no-console
console.log(photosArray);
