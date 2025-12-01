import { validateHashtags, getHashtagErrorMessage } from './hashtags.js';
import { isEscapeKey } from './util.js';
import { initImageEditor, resetImageEditor } from './image-editor.js';

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

// СБРОС ПОЛЯ ВЫБОРА ФАЙЛА
const resetFileInput = () => {
  fileInput.value = '';
};

// ПОЛНЫЙ СБРОС ФОРМЫ
const resetForm = () => {
  form.reset();
  pristine.reset();
  resetImageEditor();
  submitButton.disabled = false;
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
  overlay.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onFormEscKeydown);

  // Инициализируем редактор изображения
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

// ОБРАБОТЧИК ОТПРАВКИ ФОРМЫ
const onFormSubmit = (evt) => {
  evt.preventDefault();

  const isValid = pristine.validate();

  if (isValid) {
    closeImageEditor();
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
