// Константы для хэштегов
const MAX_HASHTAGS_COUNT = 5;
const MAX_HASHTAG_LENGTH = 20;

// ВАЛИДАЦИЯ ХЭШ-ТЕГОВ
const validateHashtags = (value) => {
  // Убираем пробелы в начале и конце
  const trimmedValue = value.trim();
  // Если поле пустое - валидно (хэш-теги необязательны)
  if (trimmedValue === '') {
    return true;
  }

  // Разбиваем на хэштеги, убираем пустые строки
  const hashtags = trimmedValue.split(/\s+/).filter((tag) => tag !== '');
  // 1. Не больше пяти хэштегов
  if (hashtags.length > MAX_HASHTAGS_COUNT) {
    return false;
  }

  const seen = new Set();

  for (const hashtag of hashtags) {
    const lowerCaseTag = hashtag.toLowerCase();

    // 2. Хэштег должен начинаться с символа #
    if (!hashtag.startsWith('#')) {
      return false;
    }

    // 3. Хэштег не может состоять только из одной решётки
    if (hashtag === '#') {
      return false;
    }

    // 4. Максимальная длина одного хэш-тега 20 символов, включая решётку
    if (hashtag.length > MAX_HASHTAG_LENGTH) {
      return false;
    }

    // 5. Хэштег не может содержать спецсимволы, пунктуацию, эмодзи
    // Разрешаем только: буквы (латиница и кириллица) и цифры
    // Используем регулярное выражение для проверки
    const content = hashtag.substring(1); // Все что после #
    // Проверяем что после # что-то есть
    if (content.length === 0) {
      return false;
    }
    // Регулярное выражение: только буквы и цифры
    // [A-Za-zА-Яа-яЁё] - латиница + кириллица (включая Ёё)
    // [0-9] - цифры
    if (!/^[A-Za-zА-Яа-яЁё0-9]+$/.test(content)) {
      return false;
    }

    // 6. Один и тот же хэш-тег не может быть использован дважды (регистр неважен)
    if (seen.has(lowerCaseTag)) {
      return false;
    }
    seen.add(lowerCaseTag);
  }

  return true;
};

// СООБЩЕНИЯ ОБ ОШИБКАХ ДЛЯ ХЭШ-ТЕГОВ
const getHashtagErrorMessage = (value) => {
  const trimmedValue = value.trim();
  // Если поле пустое - нет ошибки
  if (trimmedValue === '') {
    return '';
  }

  const hashtags = trimmedValue.split(/\s+/).filter((tag) => tag !== '');
  const seen = new Set();

  // 1. Не больше пяти хэштегов
  if (hashtags.length > MAX_HASHTAGS_COUNT) {
    return `Не более ${MAX_HASHTAGS_COUNT} хэш-тегов`;
  }

  for (const hashtag of hashtags) {
    const lowerCaseTag = hashtag.toLowerCase();

    // 2. Хэштег должен начинаться с символа #
    if (!hashtag.startsWith('#')) {
      return 'Хэш-тег должен начинаться с символа #';
    }

    // 3. Хэштег не может состоять только из одной решётки
    if (hashtag === '#') {
      return 'Хэш-тег не может состоять только из решётки';
    }

    // 4. Максимальная длина одного хэш-тега 20 символов, включая решётку
    if (hashtag.length > MAX_HASHTAG_LENGTH) {
      return `Максимальная длина хэш-тега - ${MAX_HASHTAG_LENGTH} символов (включая #)`;
    }

    // 5. Хэштег не может содержать спецсимволы, пунктуацию, эмодзи
    const content = hashtag.substring(1);
    if (content.length === 0) {
      return 'Хэш-тег не может состоять только из решётки';
    }
    if (!/^[A-Za-zА-Яа-яЁё0-9]+$/.test(content)) {
      return 'Хэш-тег должен содержать только буквы и цифры';
    }

    // 6. Один и тот же хэш-тег не может быть использован дважды
    if (seen.has(lowerCaseTag)) {
      return 'Хэш-теги не должны повторяться';
    }
    seen.add(lowerCaseTag);
  }

  return '';
};

export { validateHashtags, getHashtagErrorMessage };
