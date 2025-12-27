import { validateHashtags, getHashtagErrorMessage } from './hashtags.js';
import { isEscapeKey } from './util.js';
import { initImageEditor, resetImageEditor } from './image-editor.js';
import { uploadData } from './fetch.js';
import { showSelectedImage, resetPreview } from './preview.js';

// Константы
const MAX_COMMENT_LENGTH = 140;

// Элементы DOM
const form = document.querySelector('.img-upload__form');
const fileInput = form.querySelector('.img-upload__input');
const overlay = form.querySelector('.img-upload__overlay');
const cancelButton = form.querySelector('.img-upload__cancel');
const hashtagInput = form.querySelector('.text__hashtags');
const commentInput = form.querySelector('.text__description');
const submitButton = form.querySelector('.img-upload__submit');
const body = document.body;

// Храним текущие ошибки
let hashtagError = '';
let commentError = '';

// ВАЛИДАЦИЯ КОММЕНТАРИЯ
const validateComment = (value) => value.length <= MAX_COMMENT_LENGTH;

// Обновление отображения ошибок
const updateErrorUI = () => {
  // Хэштеги
  const hashtagWrapper = hashtagInput.closest('.img-upload__field-wrapper');
  if (hashtagWrapper) {
    hashtagWrapper.classList.toggle('img-upload__field-wrapper--error', !!hashtagError);

    let errorElement = hashtagWrapper.querySelector('.pristine-error');

    if (hashtagError) {
      errorElement = errorElement || document.createElement('div');
      if (!hashtagWrapper.querySelector('.pristine-error')) {
        errorElement.className = 'pristine-error';
        hashtagWrapper.appendChild(errorElement);
      }
      errorElement.textContent = hashtagError;
    } else if (errorElement) {
      errorElement.remove();
    }
  }

  // Комментарий
  const commentWrapper = commentInput.closest('.img-upload__field-wrapper');
  if (commentWrapper) {
    commentWrapper.classList.toggle('img-upload__field-wrapper--error', !!commentError);

    let errorElement = commentWrapper.querySelector('.pristine-error');

    if (commentError) {
      errorElement = errorElement || document.createElement('div');
      if (!commentWrapper.querySelector('.pristine-error')) {
        errorElement.className = 'pristine-error';
        commentWrapper.appendChild(errorElement);
      }
      errorElement.textContent = commentError;
    } else if (errorElement) {
      errorElement.remove();
    }
  }
};

// Обновление кнопки отправки
const updateSubmitButton = () => {
  const isValid = !hashtagError && !commentError;
  submitButton.disabled = !isValid;
  submitButton.textContent = 'Опубликовать';
};

// Обновление ошибок и UI
const updateValidation = () => {
  // Валидация хэштегов
  const hashtagValue = hashtagInput.value;
  hashtagError = validateHashtags(hashtagValue) ? '' : getHashtagErrorMessage(hashtagValue);

  // Валидация комментария
  const commentValue = commentInput.value;
  commentError = validateComment(commentValue) ? '' : `Длина комментария не должна превышать ${MAX_COMMENT_LENGTH} символов`;

  // Обновляем UI
  updateErrorUI();
  updateSubmitButton();
};

// Блокировка кнопки при отправке
const blockSubmitButton = () => {
  submitButton.disabled = true;
  submitButton.textContent = 'Отправляется...';
};

const unblockSubmitButton = () => {
  updateSubmitButton();
};

// Сброс формы
const resetForm = () => {
  form.reset();
  resetImageEditor();

  // Сбрасываем состояния полей
  hashtagInput.disabled = false;
  commentInput.disabled = false;

  unblockSubmitButton();
  resetPreview();

  // Сбрасываем ошибки
  hashtagError = '';
  commentError = '';
  updateErrorUI();
  updateSubmitButton();
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

// Обработчик выбора файла
const onFileInputChange = () => {
  const file = fileInput.files[0];
  if (!file) {
    return;
  }

  if (showSelectedImage(file)) {
    openImageEditor();
  } else {
    fileInput.value = '';
  }
};

// Показать сообщение об успехе
const showSuccessMessage = () => {
  const template = document.querySelector('#success').content.cloneNode(true);
  const message = template.querySelector('.success');
  message.style.zIndex = '10000';
  document.body.appendChild(message);

  const onSuccessMessageClose = () => {
    message.remove();
    document.removeEventListener('keydown', onSuccessMessageEscKeydown);
    // Возвращаем обработчик ESC для формы
    document.addEventListener('keydown', onFormEscKeydown);
  };

  function onSuccessMessageEscKeydown(evt) {
    if (isEscapeKey(evt)) {
      onSuccessMessageClose();
    }
  }

  const onSuccessMessageClick = (evt) => {
    if (!evt.target.closest('.success__inner')) {
      onSuccessMessageClose();
    }
  };

  message.addEventListener('click', onSuccessMessageClick);
  message.querySelector('.success__button').addEventListener('click', onSuccessMessageClose);
  document.removeEventListener('keydown', onFormEscKeydown);
  document.addEventListener('keydown', onSuccessMessageEscKeydown);
};

// Показать сообщение об ошибке
const showErrorMessage = () => {
  const template = document.querySelector('#error').content.cloneNode(true);
  const message = template.querySelector('.error');
  message.style.zIndex = '10000';
  document.body.appendChild(message);

  const onErrorMessageClose = () => {
    message.remove();
    document.removeEventListener('keydown', onErrorMessageEscKeydown);
    // Возвращаем обработчик ESC для формы
    document.addEventListener('keydown', onFormEscKeydown);
  };

  // Объявляем функцию перед использованием
  function onErrorMessageEscKeydown(evt) {
    if (isEscapeKey(evt)) {
      onErrorMessageClose();
    }
  }

  const onErrorMessageClick = (evt) => {
    if (!evt.target.closest('.error__inner')) {
      onErrorMessageClose();
    }
  };

  message.addEventListener('click', onErrorMessageClick);
  message.querySelector('.error__button').addEventListener('click', onErrorMessageClose);
  document.removeEventListener('keydown', onFormEscKeydown);
  document.addEventListener('keydown', onErrorMessageEscKeydown);
};

// Успешная отправка
const onFormSubmitSuccess = () => {
  closeImageEditor();
  showSuccessMessage();
};

// Ошибка отправки
const onFormSubmitError = () => {
  unblockSubmitButton();
  showErrorMessage();
};

// Отправка формы
const onFormSubmit = (evt) => {
  evt.preventDefault();

  // Проверяем перед отправкой
  updateValidation();

  if (hashtagError || commentError) {
    updateErrorUI();
  } else {
    blockSubmitButton();
    uploadData(onFormSubmitSuccess, onFormSubmitError, 'POST', new FormData(form));
  }
};

// Слушатели событий для валидации
const onHashtagInput = () => {
  updateValidation();
};

const onCommentInput = () => {
  updateValidation();
};

// Основные слушатели
fileInput.addEventListener('change', onFileInputChange);
cancelButton.addEventListener('click', closeImageEditor);
form.addEventListener('submit', onFormSubmit);

// Предотвращение закрытия формы при фокусе
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

hashtagInput.addEventListener('input', onHashtagInput);
commentInput.addEventListener('input', onCommentInput);
hashtagInput.addEventListener('keydown', onHashtagInputKeydown);
commentInput.addEventListener('keydown', onCommentInputKeydown);

// Экспорты
export { closeImageEditor, resetForm };
