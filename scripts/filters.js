function initAccessibleFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterButtons.length > 0 && projectCards.length > 0) {
        // ARIA-атрибуты для фильтров
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
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                });
                button.classList.add('active');
                button.setAttribute('aria-pressed', 'true');
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

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function () {
    if (document.querySelector('.filter-btn')) {
        initAccessibleFilters();
    }
});