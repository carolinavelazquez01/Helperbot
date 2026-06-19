// Función para desplazarse a secciones
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Animación de aparición de elementos al hacer scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar tarjetas y elementos para animación
document.addEventListener('DOMContentLoaded', () => {
    console.log('✨ HelperBot cargado exitosamente');
    
    // Aplicar animaciones de entrada a elementos
    const elements = document.querySelectorAll('.problem-card, .component-card, .phase-card, .impact-card');
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Eventos para emociones interactivas
    const emotions = document.querySelectorAll('.emotion');
    emotions.forEach(emotion => {
        emotion.addEventListener('click', () => {
            console.log('Estado emocional seleccionado:', emotion.textContent);
        });
    });

    // Log de navegación
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const section = link.getAttribute('href');
            console.log('Navegando a:', section);
        });
    });
});

// Función para botones de CTA
function contactarInfo() {
    alert('Pronto más información sobre cómo implementar HelperBot en tu institución.');
}

// Evento para el botón de contacto
window.addEventListener('load', () => {
    const ctaButtons = document.querySelectorAll('.cta-button-large');
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', contactarInfo);
    });
});
