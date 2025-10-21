document.addEventListener('DOMContentLoaded', function () {
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

    // Обработка фильтров на странице проектов
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterButtons.length > 0 && projectCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;

                // Обновляем активную кнопку
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Фильтруем проекты
                projectCards.forEach(card => {
                    if (filter === 'all' || card.dataset.tech === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // Обработка отправки формы
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            alert('Сообщение отправлено! (Это демо-версия)');
            this.reset();
        });
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

    // Функции для модального окна
    function initModal() {
        const modal = document.getElementById('project-modal');
        if (!modal) return;

        const modalOverlay = modal.querySelector('.modal-overlay');
        const modalClose = modal.querySelector('.modal-close');
        const projectCards = document.querySelectorAll('.project-card');

        // Открытие модального окна
        projectCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const projectId = card.dataset.project;
                openModal(projectId);
            });
        });

        // Закрытие модального окна
        function closeModal() {
            modal.classList.remove('active');
            document.body.classList.remove('modal-open');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }

        modalOverlay.addEventListener('click', closeModal);
        modalClose.addEventListener('click', closeModal);

        // Закрытие по ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });

        // Предотвращение закрытия при клике на контент
        modal.querySelector('.modal-content').addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    function openModal(projectId) {
        const modal = document.getElementById('project-modal');
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

        // Показываем модальное окно
        modal.style.display = 'flex';
        document.body.classList.add('modal-open');

        // Анимация появления
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }

    // Инициализируем модальное окно если есть проекты
    if (document.querySelector('.project-card')) {
        initModal();
    }
});