document.addEventListener('DOMContentLoaded', function() {
    // Функция для исправления границ изображений
    function fixImageBounds(imgElement, container) {
        if (!imgElement || !container) return;
        
        // Гарантируем что фото не выходит за рамки
        imgElement.style.maxWidth = '100%';
        imgElement.style.maxHeight = '100%';
        imgElement.style.objectFit = 'cover';
        imgElement.style.objectPosition = 'center';
        
        // Принудительно пересчитываем размеры
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
        profilePhoto.onload = function() {
            console.log('Фото профиля загружено успешно');
            fixImageBounds(this, profileImage);
        };
        
        profilePhoto.onerror = function() {
            console.error('Ошибка загрузки фото профиля: ' + this.src);
        };
        
        // Применяем сразу если фото уже загружено
        if (profilePhoto.complete && profilePhoto.naturalHeight !== 0) {
            fixImageBounds(profilePhoto, profileImage);
        }
    }

    // Обработка загрузки фото проектов
    const projectPhotos = document.querySelectorAll('.project-photo');
    projectPhotos.forEach((photo) => {
        const projectImage = photo.closest('.project-image');
        
        if (projectImage) {
            photo.onload = function() {
                console.log('Фото проекта загружено успешно');
                fixImageBounds(this, projectImage);
            };
            
            photo.onerror = function() {
                console.error('Ошибка загрузки фото проекта: ' + this.src);
            };
            
            // Применяем сразу если фото уже загружено
            if (photo.complete && photo.naturalHeight !== 0) {
                fixImageBounds(photo, projectImage);
            }
        }
    });
});