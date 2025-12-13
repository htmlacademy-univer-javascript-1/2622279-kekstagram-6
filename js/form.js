import { validateHashtags, getHashtagErrorMessage } from './hashtags.js';
import { isEscapeKey } from './util.js';
import { initImageEditor, resetImageEditor } from './image-editor.js';
import { uploadData } from './fetch.js';

const Pristine = window.Pristine;

// Элементы DOM
const form = document.querySelector('.img-upload__form');
const fileInput = document.querySelector('.img-upload__input');
const overlay = document.querySelector('.img-upload__overlay');
const cancelButton = document.querySelector('.img-upload__cancel');
const hashtagInput = document.querySelector('.text__hashtags');
const commentInput = document.querySelector('.text__description');
const body = document.body;
const submitButton = document.querySelector('.img-upload__submit');

// Константы
const MAX_COMMENT_LENGTH = 140;

const successTemplate = document.querySelector('#success');
const errorTemplate = document.querySelector('#error');

let closeSuccessMessage = () => {};
let closeErrorMessage = () => {};

// Обработчики ESC для сообщений
const onSuccessEscKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeSuccessMessage();
  }
};

const onErrorEscKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeErrorMessage();
  }
};

// Инициализация Pristine
const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__field-wrapper--error',
});

// ВАЛИДАЦИЯ КОММЕНТАРИЯ
const validateComment = (value) => value.length <= MAX_COMMENT_LENGTH;

// Функция для обновления состояния кнопки
const updateSubmitButton = () => {
  submitButton.disabled = !pristine.validate();
};

// Блокировка/разблокировка кнопки отправки
const blockSubmitButton = () => {
  submitButton.disabled = true;
  submitButton.textContent = 'Отправляется...';
};

const unblockSubmitButton = () => {
  submitButton.disabled = false;
  submitButton.textContent = 'Опубликовать';
  updateSubmitButton();
};

// СБРОС ПОЛЯ ВЫБОРА ФАЙЛА
const resetFileInput = () => {
  fileInput.value = '';
};

// ПОЛНЫЙ СБРОС ФОРМЫ
const resetForm = () => {
  form.reset();
  pristine.reset();
  resetImageEditor();
  unblockSubmitButton();
  resetFileInput();
};

// ЗАКРЫТИЕ ФОРМЫ
function closeImageEditor() {
  overlay.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onFormEscKeydown);
  resetForm();
}

// ОТКРЫТИЕ ФОРМЫ
function openImageEditor() {
  unblockSubmitButton();

  overlay.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onFormEscKeydown);

  initImageEditor();
  updateSubmitButton();
}

// ОБРАБОТЧИК ESCAPE ДЛЯ ФОРМЫ
function onFormEscKeydown(evt) {
  if (isEscapeKey(evt)) {
    if (document.activeElement === hashtagInput || document.activeElement === commentInput) {
      return;
    }
    evt.preventDefault();
    closeImageEditor();
  }
}

// ПРЕДОТВРАЩЕНИЕ ЗАКРЫТИЯ ФОРМЫ ПРИ ФОКУСЕ НА ПОЛЯХ ВВОДА
const onHashtagInputKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.stopPropagation();
  }
};

const onCommentInputKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.stopPropagation();
  }
};

// ОБРАБОТЧИК ИЗМЕНЕНИЯ ПОЛЯ ВЫБОРА ФАЙЛА
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

// ОБРАБОТЧИК КЛИКА ПО КНОПКЕ ОТМЕНЫ
const onCancelButtonClick = () => {
  closeImageEditor();
};

// ПОКАЗАТЬ СООБЩЕНИЕ ОБ УСПЕХЕ
const showSuccessMessage = () => {
  const successElement = successTemplate.content.cloneNode(true);
  const successSection = successElement.querySelector('.success');

  successSection.style.cssText = 'position: fixed; z-index: 10001; top: 0; left: 0; width: 100%; height: 100%;';

  document.body.append(successSection);

  const successButton = successSection.querySelector('.success__button');

  closeSuccessMessage = () => {
    successSection.remove();
    document.removeEventListener('keydown', onSuccessEscKeydown);
  };

  // Обработчик клика на кнопку
  successButton.addEventListener('click', closeSuccessMessage);

  // Обработчик клика на фон (за пределами блока с сообщением)
  successSection.addEventListener('click', (evt) => {
    if (!evt.target.closest('.success__inner')) {
      closeSuccessMessage();
    }
  });

  // Обработчик ESC
  document.addEventListener('keydown', onSuccessEscKeydown);
};

// ПОКАЗАТЬ СООБЩЕНИЕ ОБ ОШИБКЕ
const showErrorMessage = () => {
  const errorElement = errorTemplate.content.cloneNode(true);
  const errorSection = errorElement.querySelector('.error');

  errorSection.style.cssText = 'position: fixed; z-index: 10001; top: 0; left: 0; width: 100%; height: 100%;';

  document.body.append(errorSection);

  const errorButton = errorSection.querySelector('.error__button');

  closeErrorMessage = () => {
    errorSection.remove();
    document.removeEventListener('keydown', onErrorEscKeydown);
    document.addEventListener('keydown', onFormEscKeydown);
  };

  // Временно отключаем обработчик ESC для формы
  document.removeEventListener('keydown', onFormEscKeydown);

  // Обработчик клика на кнопку
  errorButton.addEventListener('click', closeErrorMessage);

  // Обработчик клика на фон (за пределами блока с сообщением)
  errorSection.addEventListener('click', (evt) => {
    if (!evt.target.closest('.error__inner')) {
      closeErrorMessage();
    }
  });

  // Обработчик ESC
  document.addEventListener('keydown', onErrorEscKeydown);
};

// ФУНКЦИЯ УСПЕШНОЙ ОТПРАВКИ
const onFormSuccess = () => {
  closeImageEditor();
  showSuccessMessage();
};

// ФУНКЦИЯ ОШИБКИ ОТПРАВКИ
const onFormError = () => {
  unblockSubmitButton();
  showErrorMessage();
};

// ОБРАБОТЧИК ОТПРАВКИ ФОРМЫ
const onFormSubmit = (evt) => {
  evt.preventDefault();

  const isValid = pristine.validate();

  if (isValid) {
    // Блокируем кнопку отправки
    blockSubmitButton();

    const formData = new FormData(form);

    uploadData(
      onFormSuccess,
      onFormError,
      'POST',
      formData
    );
  }
};

// ДОБАВЛЕНИЕ ВАЛИДАТОРОВ
pristine.addValidator(
  hashtagInput,
  validateHashtags,
  getHashtagErrorMessage
);

pristine.addValidator(
  commentInput,
  validateComment,
  `Длина комментария не должна превышать ${MAX_COMMENT_LENGTH} символов`
);

// ВАЛИДАЦИЯ ПРИ ВВОДЕ
const setupRealTimeValidation = () => {
  hashtagInput.addEventListener('input', () => {
    pristine.validate(hashtagInput);
    updateSubmitButton();
  });

  commentInput.addEventListener('input', () => {
    pristine.validate(commentInput);
    updateSubmitButton();
  });
};

// ДОБАВЛЕНИЕ ОБРАБОТЧИКОВ СОБЫТИЙ
fileInput.addEventListener('change', onFileInputChange);
cancelButton.addEventListener('click', onCancelButtonClick);
form.addEventListener('submit', onFormSubmit);

hashtagInput.addEventListener('keydown', onHashtagInputKeydown);
commentInput.addEventListener('keydown', onCommentInputKeydown);

setupRealTimeValidation();

export { closeImageEditor, resetForm, isEscapeKey };
