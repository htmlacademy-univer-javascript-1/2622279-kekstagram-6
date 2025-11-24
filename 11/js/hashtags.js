// Константы для хэштегов
const MAX_HASHTAGS_COUNT = 5;
const MAX_HASHTAG_LENGTH = 20;

// ВАЛИДАЦИЯ ХЭШ-ТЕГОВ
const validateHashtags = (value) => {
  if (!value.trim()) {
    return true;
  }

  const hashtags = value.trim().split(/\s+/).filter(Boolean);

  if (hashtags.length > MAX_HASHTAGS_COUNT) {
    return false;
  }

  const seen = new Set();

  for (const hashtag of hashtags) {
    const lowerCaseHashtag = hashtag.toLowerCase();

    if (hashtag === '#') {
      return false;
    }

    if (!hashtag.startsWith('#')) {
      return false;
    }

    if (!/^#[A-Za-zА-Яа-яЁё0-9]{1,19}$/.test(hashtag)) {
      return false;
    }

    if (hashtag.length > MAX_HASHTAG_LENGTH) {
      return false;
    }

    if (seen.has(lowerCaseHashtag)) {
      return false;
    }
    seen.add(lowerCaseHashtag);
  }

  return true;
};

// СООБЩЕНИЯ ОБ ОШИБКАХ ДЛЯ ХЭШ-ТЕГОВ
const getHashtagErrorMessage = (value) => {
  if (!value.trim()) {
    return '';
  }

  const hashtags = value.trim().split(/\s+/).filter(Boolean);
  const seen = new Set();

  // Проверка на максимальное количество
  if (hashtags.length > MAX_HASHTAGS_COUNT) {
    return `Не более ${MAX_HASHTAGS_COUNT} хэш-тегов`;
  }

  for (const hashtag of hashtags) {
    const lowerCaseHashtag = hashtag.toLowerCase();

    // Проверка, что тег не состоит только из решетки
    if (hashtag === '#') {
      return 'Хэш-тег не может состоять только из решётки';
    }

    // Проверка, что тег начинается с решетки
    if (!hashtag.startsWith('#')) {
      return 'Хэш-тег должен начинаться с символа #';
    }

    // Проверка максимальной длины
    if (hashtag.length > MAX_HASHTAG_LENGTH) {
      return `Максимальная длина хэш-тега - ${MAX_HASHTAG_LENGTH} символов (включая #)`;
    }

    // Проверка формата
    if (!/^#[A-Za-zА-Яа-яЁё0-9]{1,19}$/.test(hashtag)) {
      return 'Хэш-тег должен содержать только буквы и цифры после #';
    }

    // Проверка на повторение
    if (seen.has(lowerCaseHashtag)) {
      return 'Хэш-теги не должны повторяться';
    }
    seen.add(lowerCaseHashtag);
  }

  return '';
};

export { validateHashtags, getHashtagErrorMessage };
