const Pristine = window.Pristine;

const form = document.querySelector('.img-upload__form');
const fileInput = document.querySelector('.img-upload__input');
const overlay = document.querySelector('.img-upload__overlay');
const cancelButton = document.querySelector('.img-upload__cancel');
const hashtagInput = document.querySelector('.text__hashtags');
const commentInput = document.querySelector('.text__description');
const body = document.body;

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__field-wrapper--error',
});

// ВАЛИДАЦИЯ ХЭШ-ТЕГОВ
const validateHashtags = (value) => {
  if (!value.trim()) {
    return true; // хэш-теги не обязательны
  }

  const hashtags = value.trim().split(/\s+/).filter(Boolean);

  // Проверка на максимальное количество
  if (hashtags.length > 5) {
    return false;
  }

  const hashtagRegex = /^#[A-Za-zА-Яа-яЁё0-9]{1,19}$/;
  const seen = new Set();

  for (const hashtag of hashtags) {
    const lowerCaseHashtag = hashtag.toLowerCase();

    // Проверка, что тег не состоит только из решетки
    if (hashtag === '#') {
      return false;
    }

    // Проверка, что тег начинается с решетки
    if (!hashtag.startsWith('#')) {
      return false;
    }

    // Проверка формата (только буквы и цифры после #)
    if (!hashtagRegex.test(hashtag)) {
      return false;
    }

    // Проверка максимальной длины (20 символов включая #)
    if (hashtag.length > 20) {
      return false;
    }

    // Проверка на повторение (нечувствительность к регистру)
    if (seen.has(lowerCaseHashtag)) {
      return false;
    }
    seen.add(lowerCaseHashtag);
  }

  return true;
};

// ВАЛИДАЦИЯ КОММЕНТАРИЯ
const validateComment = (value) => value.length <= 140;

// СООБЩЕНИЯ ОБ ОШИБКАХ ДЛЯ ХЭШ-ТЕГОВ
const getHashtagErrorMessage = (value) => {
  if (!value.trim()) {
    return '';
  }

  const hashtags = value.trim().split(/\s+/).filter(Boolean);
  const seen = new Set();

  // Проверка на максимальное количество
  if (hashtags.length > 5) {
    return 'Не более 5 хэш-тегов';
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
    if (hashtag.length > 20) {
      return 'Максимальная длина хэш-тега - 20 символов (включая #)';
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

// сброс поля выбора файла
const resetFileInput = () => {
  fileInput.value = '';
};

// полный сброс формы
const resetForm = () => {
  form.reset();
  pristine.reset();
};

// закрытие формы
function closeImageEditor() {
  overlay.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onFormEscKeydown);
  resetForm();
}

// открытие формы
function openImageEditor() {
  overlay.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onFormEscKeydown);
}

// обработчик escape
function onFormEscKeydown(evt) {
  if (evt.key === 'Escape') {
    if (document.activeElement === hashtagInput || document.activeElement === commentInput) {
      return;
    }
    evt.preventDefault();
    closeImageEditor();
  }
}

const onHashtagInputKeydown = (evt) => {
  if (evt.key === 'Escape') {
    evt.stopPropagation();
  }
};

const onCommentInputKeydown = (evt) => {
  if (evt.key === 'Escape') {
    evt.stopPropagation();
  }
};

const onFileInputChange = () => {
  const file = fileInput.files[0];

  if (file) {
    if (file.type.startsWith('image/')) {
      openImageEditor();
    } else {
      resetFileInput();
    }
  }
};

const onCancelButtonClick = () => {
  closeImageEditor();
};

const onFormSubmit = (evt) => {
  evt.preventDefault();

  const isValid = pristine.validate();

  if (isValid) {
    closeImageEditor();
  }
};

pristine.addValidator(
  hashtagInput,
  validateHashtags,
  getHashtagErrorMessage
);

pristine.addValidator(
  commentInput,
  validateComment,
  'Длина комментария не должна превышать 140 символов'
);

const setupRealTimeValidation = () => {
  hashtagInput.addEventListener('input', () => {
    pristine.validate(hashtagInput);
  });

  commentInput.addEventListener('input', () => {
    pristine.validate(commentInput);
  });
};

fileInput.addEventListener('change', onFileInputChange);
cancelButton.addEventListener('click', onCancelButtonClick);
form.addEventListener('submit', onFormSubmit);

hashtagInput.addEventListener('keydown', onHashtagInputKeydown);
commentInput.addEventListener('keydown', onCommentInputKeydown);

setupRealTimeValidation();

export { closeImageEditor, resetForm };
