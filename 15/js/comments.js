import { getRandomInteger, getRandomArrayElement } from './util.js';
import { MESSAGES, NAMES } from './data.js';

//Функция генерации комментария
export const generateComment = (idGenerator) => {
  const messageCount = getRandomInteger(1, 2);
  const messages = Array.from({length: messageCount}, () => getRandomArrayElement(MESSAGES));

  return {
    id: idGenerator(),
    avatar: `img/avatar-${getRandomInteger(1, 6)}.svg`,
    message: messages.join(' '),
    name: getRandomArrayElement(NAMES)
  };
};
