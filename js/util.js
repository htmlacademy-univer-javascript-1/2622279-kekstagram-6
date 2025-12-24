const DELAY = 500;

// Функция для проверки нажатия Escape
const isEscapeKey = (evt) => evt.key === 'Escape';

// Функция для устранения дребезга
const debounce = (cb) => {
  let lastTimeout = null;

  return (...rest) => {
    if (lastTimeout){
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(()=>{
      cb(...rest);
    }, DELAY);
  };
};

// Функция для перемешивания массива
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export {isEscapeKey,debounce, shuffleArray};
