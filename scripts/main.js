document.addEventListener('DOMContentLoaded', function () {
    // Функция для захвата фокуса на странице
    function initFocusTrap() {
        // Получаем все фокусируемые элементы на странице
        const focusableSelectors = [
            'a[href]:not([tabindex="-1"])',
            'button:not([disabled]):not([tabindex="-1"])',
            'input:not([disabled]):not([tabindex="-1"])',
            'textarea:not([disabled]):not([tabindex="-1"])',
            'select:not([disabled]):not([tabindex="-1"])',
            '[tabindex]:not([tabindex="-1"])',
            'details:not([tabindex="-1"])',
            'summary:not([tabindex="-1"])'
        ].join(', ');

        const focusableElements = document.querySelectorAll(focusableSelectors);

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        console.log(`Focus trap: ${focusableElements.length} focusable elements found`);

        document.addEventListener('keydown', function (e) {
            // Работаем только с Tab
            if (e.key !== 'Tab') return;

            const activeElement = document.activeElement;

            // Если Shift+Tab на первом элементе - переходим на последний
            if (e.shiftKey && activeElement === firstElement) {
                console.log('Focus trap: Shift+Tab on first element, moving to last');
                e.preventDefault();
                lastElement.focus();
            }
            // Если Tab на последнем элементе - переходим на первый
            else if (!e.shiftKey && activeElement === lastElement) {
                console.log('Focus trap: Tab on last element, moving to first');
                e.preventDefault();
                firstElement.focus();
            }
            // Если фокус вне наших элементов (например, в браузерной панели)
            else if (!Array.from(focusableElements).includes(activeElement) && activeElement !== document.body) {
                console.log('Focus trap: Focus outside page, moving to first element');
                e.preventDefault();
                firstElement.focus();
            }
        });
    }

    // Функция для исправления границ изображений
    function fixImageBounds(imgElement, container) {
        if (!imgElement || !container) return;

        imgElement.style.maxWidth = '100%';
        imgElement.style.maxHeight = '100%';
        imgElement.style.objectFit = 'cover';
        imgElement.style.objectPosition = 'center';

        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        if (imgElement.naturalWidth > containerWidth || imgElement.naturalHeight > containerHeight) {
            imgElement.style.width = '100%';
            imgElement.style.height = '100%';
        }
    }

    // Обработка загрузки фото профиля
    const profilePhoto = document.querySelector('.profile-photo');
    const profileImage = document.querySelector('.profile-image');

    if (profilePhoto && profileImage) {
        profilePhoto.onload = function () {
            console.log('Фото профиля загружено успешно');
            fixImageBounds(this, profileImage);
        };

        profilePhoto.onerror = function () {
            console.error('Ошибка загрузки фото профиля: ' + this.src);
            // Показываем плейсхолдер если фото не загрузилось
            const placeholder = profileImage.querySelector('.photo-placeholder');
            if (placeholder) {
                placeholder.style.opacity = '1';
            }
        };

        if (profilePhoto.complete && profilePhoto.naturalHeight !== 0) {
            fixImageBounds(profilePhoto, profileImage);
        }
    }

    // Обработка загрузки фото проектов
    const projectPhotos = document.querySelectorAll('.project-photo');
    projectPhotos.forEach((photo) => {
        const projectImage = photo.closest('.project-image');

        if (projectImage) {
            photo.onload = function () {
                console.log('Фото проекта загружено успешно');
                fixImageBounds(this, projectImage);
            };

            photo.onerror = function () {
                console.error('Ошибка загрузки фото проекта: ' + this.src);
                // Устанавливаем градиентный фон если фото не загрузилось
                projectImage.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
            };

            if (photo.complete && photo.naturalHeight !== 0) {
                fixImageBounds(photo, projectImage);
            }
        }
    });

    // Обработка загрузки иконок контактов
    const contactIcons = document.querySelectorAll('.contact-icon');
    contactIcons.forEach((icon) => {
        icon.onerror = function () {
            console.error('Ошибка загрузки иконки: ' + this.src);
            // Заменяем сломанную иконку на эмодзи
            const alt = this.getAttribute('alt');
            let emoji = '📧';
            if (alt.includes('GitHub')) emoji = '🐙';
            if (alt.includes('местоположения')) emoji = '📍';
            this.style.display = 'none';
            const emojiSpan = document.createElement('span');
            emojiSpan.className = 'contact-emoji';
            emojiSpan.textContent = emoji;
            this.parentNode.insertBefore(emojiSpan, this);
        };
    });

    // Обработка фильтров на странице проектов с улучшениями доступности
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterButtons.length > 0 && projectCards.length > 0) {
        // Добавляем ARIA-атрибуты для фильтров
        filterButtons.forEach((button, index) => {
            button.setAttribute('role', 'button');
            button.setAttribute('aria-pressed', button.classList.contains('active'));
            button.setAttribute('tabindex', '0');

            if (index === 0) {
                button.setAttribute('aria-label', 'Показать все проекты');
            } else {
                const filterType = button.dataset.filter;
                button.setAttribute('aria-label', `Показать проекты с технологией ${filterType}`);
            }
        });

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;

                // Обновляем активную кнопку
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                });
                button.classList.add('active');
                button.setAttribute('aria-pressed', 'true');

                // Фильтруем проекты
                let visibleCount = 0;
                projectCards.forEach(card => {
                    if (filter === 'all' || card.dataset.tech === filter) {
                        card.style.display = 'block';
                        card.removeAttribute('aria-hidden');
                        visibleCount++;
                    } else {
                        card.style.display = 'none';
                        card.setAttribute('aria-hidden', 'true');
                    }
                });

                // Обновляем live region с количеством найденных проектов
                updateFilterResults(visibleCount, projectCards.length);
            });

            // Обработка клавиатуры для фильтров
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    button.click();
                }
            });
        });
    }

    function updateFilterResults(visible, total) {
        let liveRegion = document.getElementById('filter-live-region');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'filter-live-region';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'visually-hidden';
            document.querySelector('.projects-header')?.appendChild(liveRegion);
        }

        liveRegion.textContent = `Показано ${visible} из ${total} проектов`;
    }

    // Обработка отправки формы (обновленная с доступностью)
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm && contactForm.id !== 'contact-form') {
        // Старая простая обработка для других форм
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            alert('Сообщение отправлено! (Это демо-версия)');
            this.reset();
        });
    }

    // Инициализация валидации контактной формы
    if (document.getElementById('contact-form')) {
        initContactFormValidation();
    }

    // Данные для проектов
    const projectsData = {
        1: {
            title: "Личный сайт",
            image: "../images/project1.jpg",
            description: "Адаптивный сайт-визитка с современным дизайном и анимациями. Реализована полностью отзывчивая верстка, плавные переходы и интерактивные элементы.",
            tech: ["HTML", "CSS"]
        },
        2: {
            title: "Todo-приложение",
            image: "../images/project2.jpg",
            description: "Приложение для управления задачами с локальным хранилищем и фильтрацией. Удобный интерфейс для организации ежедневных задач.",
            tech: ["JavaScript"]
        },
        3: {
            title: "Интернет-магазин",
            image: "../images/project3.jpg",
            description: "Прототип интернет-магазина с корзиной товаров и оформлением заказа. Интуитивно понятный процесс покупки.",
            tech: ["React"]
        },
        4: {
            title: "Портфолио",
            image: "../images/project4.jpg",
            description: "Адаптивное портфолио на Bootstrap с сеткой проектов. Современный дизайн и кроссбраузерная совместимость.",
            tech: ["Bootstrap"]
        }
    };

    // Функции для модального окна с улучшениями доступности
    function initModal() {
        const modal = document.getElementById('project-modal');
        if (!modal) return;

        let previousActiveElement;

        const modalOverlay = modal.querySelector('.modal-overlay');
        const modalClose = modal.querySelector('.modal-close');
        const projectCards = document.querySelectorAll('.project-card');

        // Добавляем ARIA-атрибуты для модального окна
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'modal-title');
        modal.setAttribute('tabindex', '-1');

        // Открытие модального окна
        projectCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const projectId = card.dataset.project;
                openModal(projectId);
            });

            // Добавляем клавиатурную навигацию для карточек проектов
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const projectId = card.dataset.project;
                    openModal(projectId);
                }
            });

            // Делаем карточки доступными с клавиатуры
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `Открыть детали проекта: ${card.querySelector('.project-title')?.textContent}`);
        });

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

            // Escape закрывает модальное окно
            if (event.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });

        modalOverlay.addEventListener('click', closeModal);
        modalClose.addEventListener('click', closeModal);

        // Предотвращение закрытия при клике на контент
        modal.querySelector('.modal-content').addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // Инициализируем модальное окно если есть проекты
    if (document.querySelector('.project-card')) {
        initModal();
    }

    // Функции валидации для контактной формы
    function initContactFormValidation() {
        const contactForm = document.getElementById('contact-form');
        if (!contactForm) return;

        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');

        // Валидация в реальном времени
        nameInput?.addEventListener('blur', validateContactName);
        emailInput?.addEventListener('blur', validateContactEmail);
        messageInput?.addEventListener('blur', validateContactMessage);

        // Отправка формы
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            if (validateContactForm()) {
                // Имитация успешной отправки
                showSuccessMessage(contactForm, 'Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.');
                contactForm.reset();
                clearAllErrors(contactForm);

                // Фокусируемся на первом поле после успешной отправки
                setTimeout(() => {
                    nameInput?.focus();
                }, 100);
            }
        });

        // Обработка Escape для очистки ошибок
        contactForm.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                const activeError = document.querySelector('.error:focus');
                if (activeError) {
                    const errorId = activeError.getAttribute('aria-describedby')?.split(' ')[1];
                    if (errorId) {
                        const errorElement = document.getElementById(errorId);
                        clearError(activeError, errorElement);
                    }
                }
            }
        });
    }

    function validateContactName() {
        const nameInput = document.getElementById('name');
        const errorElement = document.getElementById('name-error');
        if (!nameInput || !errorElement) return false;

        const value = nameInput.value.trim();

        if (!validateRequired(value)) {
            showError(nameInput, errorElement, 'Пожалуйста, введите ваше имя');
            return false;
        } else if (value.length < 2) {
            showError(nameInput, errorElement, 'Имя должно содержать минимум 2 символа');
            return false;
        } else {
            clearError(nameInput, errorElement);
            return true;
        }
    }

    function validateContactEmail() {
        const emailInput = document.getElementById('email');
        const errorElement = document.getElementById('email-error');
        if (!emailInput || !errorElement) return false;

        const value = emailInput.value.trim();

        if (!validateRequired(value)) {
            showError(emailInput, errorElement, 'Пожалуйста, введите email адрес');
            return false;
        } else if (!validateEmail(value)) {
            showError(emailInput, errorElement, 'Пожалуйста, введите корректный email адрес');
            return false;
        } else {
            clearError(emailInput, errorElement);
            return true;
        }
    }

    function validateContactMessage() {
        const messageInput = document.getElementById('message');
        const errorElement = document.getElementById('message-error');
        if (!messageInput || !errorElement) return false;

        const value = messageInput.value.trim();

        if (!validateRequired(value)) {
            showError(messageInput, errorElement, 'Пожалуйста, введите сообщение');
            return false;
        } else if (value.length < 10) {
            showError(messageInput, errorElement, 'Сообщение должно содержать минимум 10 символов');
            return false;
        } else {
            clearError(messageInput, errorElement);
            return true;
        }
    }

    function validateContactForm() {
        const isNameValid = validateContactName();
        const isEmailValid = validateContactEmail();
        const isMessageValid = validateContactMessage();

        return isNameValid && isEmailValid && isMessageValid;
    }

    // Общие функции валидации
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validateRequired(value, minLength = 1) {
        return value && value.trim().length >= minLength;
    }

    function showError(input, errorElement, message) {
        input.setAttribute('aria-invalid', 'true');
        errorElement.textContent = message;
        input.classList.add('error');

        // Добавляем визуальный индикатор ошибки
        if (!input.parentNode.querySelector('.error-indicator')) {
            const errorIndicator = document.createElement('span');
            errorIndicator.className = 'error-indicator';
            errorIndicator.textContent = '⚠';
            errorIndicator.setAttribute('aria-hidden', 'true');
            input.parentNode.appendChild(errorIndicator);
        }
    }

    function clearError(input, errorElement) {
        input.setAttribute('aria-invalid', 'false');
        errorElement.textContent = '';
        input.classList.remove('error');

        // Убираем визуальный индикатор ошибки
        const errorIndicator = input.parentNode.querySelector('.error-indicator');
        if (errorIndicator) {
            errorIndicator.remove();
        }
    }

    function clearAllErrors(form) {
        const errors = form.querySelectorAll('.error-message');
        errors.forEach(error => error.textContent = '');

        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.setAttribute('aria-invalid', 'false');
            input.classList.remove('error');

            const errorIndicator = input.parentNode.querySelector('.error-indicator');
            if (errorIndicator) {
                errorIndicator.remove();
            }
        });
    }

    function showSuccessMessage(form, message = 'Данные успешно сохранены!') {
        let liveRegion = form.querySelector('.form-live-region');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.className = 'form-live-region visually-hidden';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            form.appendChild(liveRegion);
        }

        liveRegion.textContent = message;

        setTimeout(() => {
            liveRegion.textContent = '';
        }, 5000);
    }

    // Фолбэк валидация для контактной формы
    function initFallbackContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (!contactForm) return;

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('name')?.value.trim();
            const email = document.getElementById('email')?.value.trim();
            const message = document.getElementById('message')?.value.trim();

            let isValid = true;

            // Простая валидация
            if (!name) {
                alert('Пожалуйста, введите ваше имя');
                isValid = false;
            } else if (!email || !email.includes('@')) {
                alert('Пожалуйста, введите корректный email');
                isValid = false;
            } else if (!message || message.length < 10) {
                alert('Сообщение должно содержать минимум 10 символов');
                isValid = false;
            }

            if (isValid) {
                alert('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.');
                contactForm.reset();
            }
        });
    }

    // Инициализация доступности для навигации
    function initAccessibleNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.setAttribute('tabindex', '0');

            // Добавляем клавиатурную навигацию
            link.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    link.click();
                }
            });
        });
    }

    // Инициализация доступных кнопок
    function initAccessibleButtons() {
        const buttons = document.querySelectorAll('.btn:not([aria-label])');
        buttons.forEach(button => {
            if (!button.textContent.trim() && !button.getAttribute('aria-label')) {
                button.setAttribute('aria-label', 'Кнопка');
            }
        });
    }

    // Инициализация всех улучшений доступности
    initAccessibleNavigation();
    initAccessibleButtons();

    // Инициализация захвата фокуса на странице
    initFocusTrap();

    // Добавляем tabindex к основному контенту для улучшения навигации
    const mainContent = document.getElementById('main-content');
    if (mainContent && !mainContent.hasAttribute('tabindex')) {
        mainContent.setAttribute('tabindex', '-1');
    }

    console.log('All accessibility features initialized');
});

// Вспомогательные CSS классы для доступности (добавляются динамически)
const accessibilityStyles = `
.visually-hidden {
    position: absolute !important;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

.error-indicator {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #ef4444;
    font-size: 16px;
}

.form-group {
    position: relative;
}

input.error,
textarea.error {
    border-color: #ef4444;
    box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1);
}

.nav-link:focus,
.btn:focus,
.filter-btn:focus,
input:focus,
textarea:focus,
button:focus {
    outline: 3px solid #3b82f6;
    outline-offset: 2px;
}

.project-card:focus {
    outline: 3px solid #3b82f6;
    outline-offset: 2px;
    transform: translateY(-2px);
}

.skip-link {
    position: absolute;
    inset-inline-start: 1rem;
    inset-block-start: -100%;
    z-index: 10000;
    padding: .5rem .75rem;
    background: #3b82f6;
    color: white;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 600;
    transition: inset-block-start 0.2s ease;
}

.skip-link:focus,
.skip-link:focus-visible {
    inset-block-start: 1rem;
}
`;

// Добавляем стили доступности в документ
if (document.head) {
    const styleElement = document.createElement('style');
    styleElement.textContent = accessibilityStyles;
    document.head.appendChild(styleElement);
}

// Альтернативный вариант захвата фокуса с созданием скрытых элементов
function createFocusTrapElements() {
    // Создаем скрытые элементы в начале и конце страницы
    const trapStart = document.createElement('div');
    trapStart.className = 'focus-trap';
    trapStart.setAttribute('tabindex', '0');
    trapStart.setAttribute('aria-hidden', 'true');
    trapStart.style.position = 'absolute';
    trapStart.style.width = '1px';
    trapStart.style.height = '1px';
    trapStart.style.padding = '0';
    trapStart.style.margin = '-1px';
    trapStart.style.overflow = 'hidden';
    trapStart.style.clip = 'rect(0, 0, 0, 0)';
    trapStart.style.whiteSpace = 'nowrap';
    trapStart.style.border = '0';

    const trapEnd = trapStart.cloneNode(true);

    // Вставляем в начало и конец body
    document.body.insertBefore(trapStart, document.body.firstChild);
    document.body.appendChild(trapEnd);

    // Обработка фокуса на ловушках
    trapStart.addEventListener('focus', () => {
        const focusableElements = getFocusableElements();
        if (focusableElements.length > 0) {
            focusableElements[focusableElements.length - 1].focus();
        }
    });

    trapEnd.addEventListener('focus', () => {
        const focusableElements = getFocusableElements();
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    });
}

function getFocusableElements() {
    return document.querySelectorAll(
        'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
    );
}
