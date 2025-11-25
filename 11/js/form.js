import { validateHashtags, getHashtagErrorMessage } from './hashtags.js';

const Pristine = window.Pristine;

// Элементы DOM
const form = document.querySelector('.img-upload__form');
const fileInput = document.querySelector('.img-upload__input');
const overlay = document.querySelector('.img-upload__overlay');
const cancelButton = document.querySelector('.img-upload__cancel');
const hashtagInput = document.querySelector('.text__hashtags');
const commentInput = document.querySelector('.text__description');
const body = document.body;

// Константа для комментария
const MAX_COMMENT_LENGTH = 140;

// Функция для проверки нажатия Escape
const isEscapeKey = (evt) => evt.key === 'Escape';

// Инициализация Pristine
const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__field-wrapper--error',
});

// ВАЛИДАЦИЯ КОММЕНТАРИЯ
const validateComment = (value) => value.length <= MAX_COMMENT_LENGTH;

// СБРОС ПОЛЯ ВЫБОРА ФАЙЛА
const resetFileInput = () => {
  fileInput.value = '';
};

// ПОЛНЫЙ СБРОС ФОРМЫ
const resetForm = () => {
  form.reset();
  pristine.reset();
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
}

// ОБРАБОТЧИК ESCAPE
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
  else {
    const submitButton = document.querySelector('.img-upload__submit');
    submitButton.disabled = true;
    setTimeout(() => {
      submitButton.disabled = false;
    },);
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
  `Длина комментария не должна превышать ${MAX_COMMENT_LENGTH} символов`
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
