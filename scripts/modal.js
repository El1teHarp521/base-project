// modal.js (дополнить существующий код)
// Функции для доступного модального окна

function initAccessibleModal() {
    const modal = document.getElementById('project-modal');
    if (!modal) return;

    let previousActiveElement;

    const modalOverlay = modal.querySelector('.modal-overlay');
    const modalClose = modal.querySelector('.modal-close');

    // Улучшенное открытие модального окна
    function openModal(projectId) {
        const project = projectsData[projectId];
        if (!project) return;

        // Заполняем модальное окно данными
        modal.querySelector('#modal-title').textContent = project.title;
        modal.querySelector('.modal-photo').src = project.image;
        modal.querySelector('.modal-photo').alt = project.title;
        modal.querySelector('.modal-description p').textContent = project.description;

        // Технологии
        const techTags = modal.querySelector('.tech-tags');
        techTags.innerHTML = '';
        project.tech.forEach(tech => {
            const tag = document.createElement('span');
            tag.className = 'tech-tag';
            tag.textContent = tech;
            techTags.appendChild(tag);
        });

        // Запоминаем активный элемент для возврата фокуса
        previousActiveElement = document.activeElement;

        // Скрываем основной контент от скринридера
        document.querySelectorAll('body > *:not(.modal):not(.overlay)')
            .forEach(el => el.setAttribute('aria-hidden', 'true'));

        // Показываем модальное окно
        modal.style.display = 'flex';
        document.body.classList.add('modal-open');

        // Фокусируемся на модальном окне
        modal.setAttribute('tabindex', '-1');
        modal.focus();

        // Добавляем обработчик Escape
        document.addEventListener('keydown', handleEscape);

        // Анимация появления
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }

    // Улучшенное закрытие модального окна
    function closeModal() {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');

        // Возвращаем видимость основному контенту
        document.querySelectorAll('[aria-hidden="true"]')
            .forEach(el => el.removeAttribute('aria-hidden'));

        // Возвращаем фокус на предыдущий элемент
        if (previousActiveElement) {
            previousActiveElement.focus();
        }

        // Убираем обработчик Escape
        document.removeEventListener('keydown', handleEscape);

        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    // Обработка клавиши Escape
    function handleEscape(event) {
        if (event.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    }

    // Захват фокуса внутри модалки
    modal.addEventListener('keydown', function (event) {
        if (event.key === 'Tab' && modal.classList.contains('active')) {
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );

            if (focusableElements.length === 0) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            // Зацикливаем фокус внутри модалки
            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    });

    // Закрытие модального окна
    modalOverlay.addEventListener('click', closeModal);
    modalClose.addEventListener('click', closeModal);

    // Предотвращение закрытия при клике на контент
    modal.querySelector('.modal-content').addEventListener('click', (e) => {
        e.stopPropagation();
    });

    return { openModal, closeModal };
}

// Инициализация доступных модальных окон при загрузке
document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('project-modal')) {
        initAccessibleModal();
    }
});