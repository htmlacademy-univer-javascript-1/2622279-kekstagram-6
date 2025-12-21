import { isEscapeKey } from './util.js';

const COMMENTS_PER_PORTION = 5;

const bigPicture = document.querySelector('.big-picture');
const bigPictureImg = bigPicture.querySelector('.big-picture__img img');
const likesCount = bigPicture.querySelector('.likes-count');
const commentsCount = bigPicture.querySelector('.comments-count');
const socialComments = bigPicture.querySelector('.social__comments');
const socialCaption = bigPicture.querySelector('.social__caption');
const cancelButton = bigPicture.querySelector('.big-picture__cancel');
const commentCountElement = bigPicture.querySelector('.social__comment-count');
const commentsLoader = bigPicture.querySelector('.comments-loader');

let currentComments = [];
let commentsShown = 0;

const createComment = (comment) => {
  const commentElement = document.createElement('li');
  commentElement.classList.add('social__comment');

  const img = document.createElement('img');
  img.classList.add('social__picture');
  img.src = comment.avatar;
  img.alt = comment.name;
  img.width = 35;
  img.height = 35;

  const text = document.createElement('p');
  text.classList.add('social__text');
  text.textContent = comment.message;

  commentElement.appendChild(img);
  commentElement.appendChild(text);

  return commentElement;
};

const renderComments = () => {
  const commentsToShow = currentComments.slice(commentsShown, commentsShown + COMMENTS_PER_PORTION);

  const fragment = document.createDocumentFragment();
  commentsToShow.forEach((comment) => {
    fragment.appendChild(createComment(comment));
  });

  socialComments.appendChild(fragment);

  commentsShown += commentsToShow.length;

  commentCountElement.innerHTML = `${commentsShown} из <span class="comments-count">${currentComments.length}</span> комментариев`;

  if (commentsShown >= currentComments.length) {
    commentsLoader.classList.add('hidden');
  } else {
    commentsLoader.classList.remove('hidden');
  }
};

const onCommentsLoaderClick = () => {
  renderComments();
};

// Функция для сброса состояния комментариев
const resetComments = () => {
  socialComments.innerHTML = '';
  commentsShown = 0;
  currentComments = [];
  commentsLoader.classList.remove('hidden');
};

const checkCommentsLoaderVisibility = () => {
  if (currentComments.length <= COMMENTS_PER_PORTION) {
    commentsLoader.classList.add('hidden');
  } else {
    commentsLoader.classList.remove('hidden');
  }
};

const openBigPicture = (photo) => {
  const { url, likes, comments, description } = photo;

  resetComments();

  bigPictureImg.src = url;
  bigPictureImg.alt = description;
  likesCount.textContent = likes;
  commentsCount.textContent = comments.length;
  socialCaption.textContent = description;

  // Сохраняем комментарии и отображаем первую порцию
  currentComments = comments;
  renderComments();


  commentCountElement.classList.remove('hidden');
  commentsLoader.classList.remove('hidden');

  // Проверяем нужно ли показывать кнопку "Загрузить ещё"
  checkCommentsLoaderVisibility();

  bigPicture.classList.remove('hidden');
  document.body.classList.add('modal-open');
};

// Функция для закрытия полноразмерного изображения
const closeBigPicture = () => {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
};

// Обработчик нажатия Esc
const onBigPictureEscKeydown = (evt) => {
  if (isEscapeKey && !bigPicture.classList.contains('hidden')) {
    evt.preventDefault();
    closeBigPicture();
  }
};

// Добавляем обработчики событий
cancelButton.addEventListener('click', () => {
  closeBigPicture();
});

commentsLoader.addEventListener('click', onCommentsLoaderClick);

document.addEventListener('keydown', onBigPictureEscKeydown);

// Экспортируем функции
export { openBigPicture };
