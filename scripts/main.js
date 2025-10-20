document.addEventListener('DOMContentLoaded', function () {
    // Функция для исправления границ изображений
    function fixImageBounds(imgElement, container) {
        if (!imgElement || !container) return;

        imgElement.style.maxWidth = '100%';
        imgElement.style.maxHeight = '100%';
        imgElement.style.objectFit = 'cover';
        imgElement.style.objectPosition = 'center';
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
                projectImage.innerHTML = '<div style="color: white; text-align: center; padding: 20px;">Изображение не загружено</div>';
            };
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
});