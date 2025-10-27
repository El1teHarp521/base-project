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
}

function clearError(input, errorElement) {
    input.setAttribute('aria-invalid', 'false');
    errorElement.textContent = '';
    input.classList.remove('error');
}

function clearAllErrors(form) {
    const errors = form.querySelectorAll('.error-message');
    errors.forEach(error => error.textContent = '');

    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.setAttribute('aria-invalid', 'false');
        input.classList.remove('error');
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

// Инициализация валидации для контактной формы
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

// Экспорт функций для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateEmail,
        validateRequired,
        showError,
        clearError,
        clearAllErrors,
        showSuccessMessage,
        initContactFormValidation
    };
}