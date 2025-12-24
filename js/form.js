import { validateHashtags, getHashtagErrorMessage } from './hashtags.js';
import { isEscapeKey } from './util.js';
import { initImageEditor, resetImageEditor } from './image-editor.js';
import { uploadData } from './fetch.js';
import { showSelectedImage, resetPreview } from './preview.js';

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
    // Исправление: использование метода toggle с булевым значением
    hashtagWrapper.classList.toggle('img-upload__field-wrapper--error', !!hashtagError);

    let errorElement = hashtagWrapper.querySelector('.pristine-error');

    if (hashtagError) {
      // Использование тернарного оператора с присваиванием
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
    // Исправление: использование метода toggle с булевым значением
    commentWrapper.classList.toggle('img-upload__field-wrapper--error', !!commentError);

    let errorElement = commentWrapper.querySelector('.pristine-error');

    if (commentError) {
      // Использование тернарного оператора с присваиванием
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
  // Валидация хэштегов с тернарным оператором
  const hashtagValue = hashtagInput.value;
  hashtagError = validateHashtags(hashtagValue) ? '' : getHashtagErrorMessage(hashtagValue);

  // Валидация комментария с тернарным оператором
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
  updateSubmitButton(); // Восстанавливаем состояние на основе валидации
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

  // Вариант 1: Использовать if/else вместо тернарного оператора
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

  const close = () => {
    message.remove();
    // eslint-disable-next-line no-use-before-define
    document.removeEventListener('keydown', onEsc);
    // Возвращаем обработчик ESC для формы
    document.addEventListener('keydown', onFormEscKeydown);
  };

  const onEsc = (evt) => {
    if (isEscapeKey(evt)) {
      close();
    }
  };

  message.addEventListener('click', (evt) => {
    if (!evt.target.closest('.success__inner')) {
      close();
    }
  });

  message.querySelector('.success__button').addEventListener('click', close);
  document.removeEventListener('keydown', onFormEscKeydown);
  document.addEventListener('keydown', onEsc);
};

// Показать сообщение об ошибке
const showErrorMessage = () => {
  const template = document.querySelector('#error').content.cloneNode(true);
  const message = template.querySelector('.error');
  message.style.zIndex = '10000';
  document.body.appendChild(message);

  const close = () => {
    message.remove();
    // eslint-disable-next-line no-use-before-define
    document.removeEventListener('keydown', onEsc);
    // Возвращаем обработчик ESC для формы
    document.addEventListener('keydown', onFormEscKeydown);
  };

  const onEsc = (evt) => {
    if (isEscapeKey(evt)) {
      close();
    }
  };

  message.addEventListener('click', (evt) => {
    if (!evt.target.closest('.error__inner')) {
      close();
    }
  });

  message.querySelector('.error__button').addEventListener('click', close);
  document.removeEventListener('keydown', onFormEscKeydown);
  document.addEventListener('keydown', onEsc);
};

// Успешная отправка
const onFormSuccess = () => {
  closeImageEditor();
  showSuccessMessage();
};

// Ошибка отправки
const onFormError = () => {
  unblockSubmitButton();
  showErrorMessage();
};

// Отправка формы
const onFormSubmit = (evt) => {
  evt.preventDefault();

  // Проверяем перед отправкой
  updateValidation();

  // Использование тернарного оператора
  if (hashtagError || commentError) {
    updateErrorUI();
  } else {
    blockSubmitButton();
    uploadData(onFormSuccess, onFormError, 'POST', new FormData(form));
  }
};

// Слушатели событий для валидации
hashtagInput.addEventListener('input', () => {
  updateValidation();
});

commentInput.addEventListener('input', () => {
  updateValidation();
});

// Основные слушатели
fileInput.addEventListener('change', onFileInputChange);
cancelButton.addEventListener('click', closeImageEditor);
form.addEventListener('submit', onFormSubmit);

// Предотвращение закрытия формы при фокусе
hashtagInput.addEventListener('keydown', (evt) => {
  if (isEscapeKey(evt)) {
    evt.stopPropagation();
  }
});

commentInput.addEventListener('keydown', (evt) => {
  if (isEscapeKey(evt)) {
    evt.stopPropagation();
  }
});

// Экспорты
export { closeImageEditor, resetForm };
