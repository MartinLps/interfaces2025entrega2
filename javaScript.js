// Loading Screen Script
document.addEventListener('DOMContentLoaded', function() {
    // Pantalla de carga de 5 segundos
    const pantallaCarga = document.getElementById('pantalla-carga');
    const progresoCarga = document.getElementById('relleno-progreso');
    const porcentajeProgreso = document.getElementById('porcentaje-progreso');
    const mainContent = document.querySelector('.main-content');
    const header = document.querySelector('.header');
    const footer = document.querySelector('.footer');
    const sidebar = document.querySelector('.nav-bar');

    // Ocultar contenido principal inicialmente
    mainContent.style.display = 'none';
    header.style.display = 'none';
    footer.style.display = 'none';
    sidebar.style.display = 'none';
    
    let progresion = 0;
    const duracion = 5000; // 5 segundos
    const intervalo = 50; // Actualizar cada 50ms
    const incrementacion = (100 / (duracion / intervalo));
    
    const progresionIntervalo = setInterval(() => {
        progresion += incrementacion;
        
        if (progresion >= 100) {
            progresion = 100;
            clearInterval(progresionIntervalo);
            
            // Esperar un momento antes de ocultar
            setTimeout(() => {
                pantallaCarga.style.opacity = '0';
                pantallaCarga.style.transition = 'opacity 0.5s ease';
                
                setTimeout(() => {
                    pantallaCarga.style.display = 'none';
                    mainContent.style.display = 'block';
                    header.style.display = 'flex';
                    footer.style.display = 'block';
                    sidebar.style.display = 'block';
                    
                    // Inicializar carrusel después de mostrar el contenido
                    initCarousel();
                    
                    // Inicializar menú hamburguesa
                    initHamburgerMenu();
                }, 500);
            }, 200);
        }
        
        // Actualizar barra de progreso y porcentaje
        progresoCarga.style.width = progresion + '%';
        porcentajeProgreso.textContent = Math.floor(progresion) + '%';
    }, intervalo);
    
    /*
    // MODO DESARROLLO: Mostrar todo inmediatamente
    const pantallaCarga = document.getElementById('pantalla-carga');
    const mainContent = document.querySelector('.main-content');
    const header = document.querySelector('.header');
    const footer = document.querySelector('.footer');
    const sidebar = document.querySelector('.nav-bar');
    
    // Ocultar pantalla de carga inmediatamente
    if (pantallaCarga) pantallaCarga.style.display = 'none';
    
    // Mostrar todo el contenido inmediatamente
    if (mainContent) mainContent.style.display = 'block';
    if (header) header.style.display = 'flex';
    if (footer) footer.style.display = 'block';
    if (sidebar) sidebar.style.display = 'block';
    */  
    // Funcionalidad de carrusel
    initCarousel();
    
    // Inicializar menú hamburguesa
    initHamburgerMenu();
    
    // Inicializar sidebar móvil
    initMobileSidebar();
    
});

// Función para inicializar la funcionalidad del carrusel
function initCarousel() {
    const sections = document.querySelectorAll('.section');
    
    sections.forEach((section, index) => {
        const gamesGrid = section.querySelector('.games-grid');
        const scrollRightBtn = section.querySelector('.scroll-derecha');
        const scrollLeftBtn = section.querySelector('.scroll-izquierda');
        
        if (!gamesGrid || !scrollRightBtn) {
            return;
        }
        
        // Función para calcular si debe haber overflow basado en el contenido
        function shouldHaveOverflow() {
            const totalCards = gamesGrid.children.length;
            const containerWidth = gamesGrid.clientWidth;
            const firstCard = gamesGrid.querySelector('.game-card, .game-card-horizontal');
            
            if (!firstCard) return totalCards > 3; // Fallback básico
            
            const cardWidth = firstCard.offsetWidth;
            const gap = 20;
            const totalContentWidth = (cardWidth + gap) * totalCards - gap;
            
            // Múltiples criterios para detectar overflow - más inteligente
            const shouldOverflowByContent = totalContentWidth > containerWidth;
            const shouldOverflowByCount = totalCards > 4; // Ahora más conservador para pantallas grandes
            const shouldOverflowByWidth = containerWidth < 1000; // Ajustado para el nuevo max-width
            
            // Para la primera sección (7 cards verticales), siempre debe haber overflow
            const isFirstSection = gamesGrid.querySelector('.game-card') !== null;
            const shouldOverflowFirstSection = isFirstSection && totalCards >= 7;
            
            // Para secciones horizontales con más de 4 cards
            const isHorizontalSection = gamesGrid.querySelector('.game-card-horizontal') !== null;
            const shouldOverflowHorizontalSection = isHorizontalSection && totalCards > 4;
            
            const finalDecision = shouldOverflowByContent || shouldOverflowByCount || shouldOverflowByWidth || 
                                shouldOverflowFirstSection || shouldOverflowHorizontalSection;
            
            return finalDecision;
        }
        
        // Función para actualizar la visibilidad de las flechas
        function updateArrows() {
            const scrollWidth = gamesGrid.scrollWidth;
            const clientWidth = gamesGrid.clientWidth;
            const scrollLeft = gamesGrid.scrollLeft;
            const maxScroll = Math.max(0, scrollWidth - clientWidth);
            
            // Usar múltiples métodos para detectar overflow
            const hasOverflowBySize = scrollWidth > clientWidth;
            const hasOverflowByCalc = shouldHaveOverflow();
            const hasOverflow = hasOverflowBySize || hasOverflowByCalc;
            
            // Mostrar/ocultar flecha izquierda
            if (scrollLeftBtn) {
                const showLeft = hasOverflow && scrollLeft > 1;
                scrollLeftBtn.style.display = showLeft ? 'flex' : 'none';
                scrollLeftBtn.style.opacity = showLeft ? '1' : '0';
                scrollLeftBtn.style.visibility = showLeft ? 'visible' : 'hidden';
            }
            
            // Mostrar/ocultar flecha derecha
            if (scrollRightBtn) {
                const showRight = hasOverflow && (maxScroll === 0 || scrollLeft < maxScroll - 1);
                scrollRightBtn.style.display = showRight ? 'flex' : 'none';
                scrollRightBtn.style.opacity = showRight ? '1' : '0';
                scrollRightBtn.style.visibility = showRight ? 'visible' : 'hidden';
            }
        }
        
        // Calcular scroll amount dinámicamente
        function getScrollAmount() {
            const firstCard = gamesGrid.querySelector('.game-card, .game-card-horizontal');
            if (!firstCard) return 200;
            
            const cardWidth = firstCard.offsetWidth;
            const gap = 20;
            return cardWidth + gap;
        }
        
        // Scroll hacia la derecha
        scrollRightBtn.addEventListener('click', () => {
            const scrollAmount = getScrollAmount();
            
            // Agregar animación de achique a las cards
            addScrollAnimation(gamesGrid);
            
            gamesGrid.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
            
            setTimeout(updateArrows, 300);
        });
        
        // Scroll hacia la izquierda
        if (scrollLeftBtn) {
            scrollLeftBtn.addEventListener('click', () => {
                const scrollAmount = getScrollAmount();
                
                // Agregar animación de achique a las cards
                addScrollAnimation(gamesGrid);
                
                gamesGrid.scrollBy({
                    left: -scrollAmount,
                    behavior: 'smooth'
                });
                
                setTimeout(updateArrows, 300);
            });
        }
        
        // Inicializar después de que todo se haya cargado
        function initializeSection() {
            updateArrows();
        }
        
        // Esperar a que las imágenes se carguen
        const images = gamesGrid.querySelectorAll('img');
        let loadedImages = 0;
        
        if (images.length === 0) {
            // Si no hay imágenes, inicializar inmediatamente
            setTimeout(initializeSection, 100);
        } else {
            images.forEach(img => {
                if (img.complete) {
                    loadedImages++;
                } else {
                    img.addEventListener('load', () => {
                        loadedImages++;
                        if (loadedImages === images.length) {
                            setTimeout(initializeSection, 100);
                        }
                    });
                    img.addEventListener('error', () => {
                        loadedImages++;
                        if (loadedImages === images.length) {
                            setTimeout(initializeSection, 100);
                        }
                    });
                }
            });
            
            // Si todas las imágenes ya están cargadas
            if (loadedImages === images.length) {
                setTimeout(initializeSection, 100);
            }
            
            // Fallback en caso de que algo falle
            setTimeout(initializeSection, 1500);
        }
        
        // Actualizar flechas cuando cambie el scroll
        gamesGrid.addEventListener('scroll', updateArrows);
        
        // Actualizar flechas cuando cambie el tamaño de la ventana
        window.addEventListener('resize', () => {
            setTimeout(updateArrows, 200);
        });
    });
}


// Función para agregar animación de achique durante el scroll
function addScrollAnimation(gamesGrid) {
    const cards = gamesGrid.querySelectorAll('.game-card, .game-card-horizontal');
    
    // Agregar clase de animación a todas las cards
    cards.forEach(card => {
        card.classList.add('scrolling-animation');
    });
    
    // Remover la clase después de que termine el scroll (tiempo del smooth scroll)
    setTimeout(() => {
        cards.forEach(card => {
            card.classList.remove('scrolling-animation');
        });
    }, 250); // 250ms es aproximadamente el tiempo del smooth scroll
}

// Función para inicializar el menú hamburguesa
function initHamburgerMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const menuDropdown = document.getElementById('menu-dropdown');
    const menuClose = document.getElementById('menu-close');
    const menuOverlay = document.getElementById('menu-overlay');
    
    function closeMenu() {
        menuDropdown.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Abrir menú
    menuToggle?.addEventListener('click', () => {
        menuDropdown.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Cerrar menú
    menuClose?.addEventListener('click', closeMenu);
    menuOverlay?.addEventListener('click', closeMenu);
    
    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });
    
    // Cerrar al hacer click en cualquier opción
    document.querySelectorAll('.menu-option').forEach(option => {
        option.addEventListener('click', closeMenu);
    });
}

// Función para manejar el sidebar en móvil
function initMobileSidebar() {
    const navToggle = document.getElementById('nav-toggle');
    const navBar = document.getElementById('nav-bar');
    const navOverlay = document.getElementById('nav-overlay');
    
    function closeSidebar() {
        navBar.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function openSidebar() {
        navBar.classList.add('active');
        navOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Mostrar/ocultar botón según el tamaño de pantalla
    function toggleNavButton() {
        if (window.innerWidth <= 768) {
            navToggle.style.display = 'block';
        } else {
            navToggle.style.display = 'none';
            closeSidebar();
        }
    }
    
    // Eventos
    navToggle?.addEventListener('click', openSidebar);
    navOverlay?.addEventListener('click', closeSidebar);
    
    // Cerrar sidebar al hacer click en un elemento del nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', closeSidebar);
    });
    
    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSidebar();
    });
    
    // Inicializar y escuchar cambios de tamaño
    toggleNavButton();
    window.addEventListener('resize', toggleNavButton);
}

// Función para mostrar animación de éxito
function showSuccessAnimation() {
    // Crear overlay de éxito
    const successOverlay = document.createElement('div');
    successOverlay.innerHTML = `
        <div class="success-container">
            <div class="success-icon">
                <i class="fas fa-check"></i>
            </div>
            <h2>¡Éxito!</h2>
            <p>Redirigiendo...</p>
        </div>
    `;
    successOverlay.className = 'success-overlay';
    document.body.appendChild(successOverlay);
    
    // Forzar reflow para que la animación funcione
    successOverlay.offsetHeight;
    successOverlay.classList.add('show');
}

 //Login Register
  



    document.addEventListener('DOMContentLoaded', function() {
    // Mostrar/ocultar contraseña
    document.querySelectorAll('.register-toggle-password').forEach(icon => {
        icon.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            if (input.type === "password") {
                input.type = "text";
                this.innerHTML = '<i class="fas fa-eye-slash"></i>';
            } else {
                input.type = "password";
                this.innerHTML = '<i class="fas fa-eye"></i>';
            }
        });
    });

    // Generar código captcha aleatorio de 5 caracteres (letras o números)
    function generarCaptcha() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let code = '';
        for (let i = 0; i < 5; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    const captchaCodeDiv = document.getElementById('codigo-captcha');
    let captchaValue = '';
    if (captchaCodeDiv) {
        captchaValue = generarCaptcha();
        captchaCodeDiv.textContent = captchaValue;
    }

    // Validar captcha al enviar el formulario de registro
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevenir el envío por defecto
            
            // PASO 1: Verificar que las contraseñas coincidan
            const password1 = document.getElementById('password');
            const password2 = document.getElementById('password2');
            
            if (password1.value !== password2.value) {
                password2.value = '';
                password2.focus();
                password2.placeholder = 'Las contraseñas no coinciden!';
                return; // Detener aquí si las contraseñas no coinciden
            }
            
            // PASO 2: Si las contraseñas coinciden, validar el captcha
            const captchaInput = document.getElementById('captcha-input');
            
            if (captchaInput && captchaInput.value.trim() !== captchaValue) {
                captchaInput.value = '';
                captchaInput.focus();
                captchaInput.placeholder = 'Código incorrecto!';
                captchaValue = generarCaptcha();
                captchaCodeDiv.textContent = captchaValue;
            } else {
                // Si todo es correcto, mostrar animación de éxito
                const submitBtn = registerForm.querySelector('.register-submit-btn');
                submitBtn.textContent = 'Procesando...';
                submitBtn.classList.add('success');
            
                setTimeout(() => {
                    submitBtn.textContent = 'Exitoso!';
                }, 700);
            
                setTimeout(() => {
                    window.location.href = 'Home.html';
                }, 1200);
            }
        });
    }

    // Manejar formulario de login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevenir el envío por defecto
            
            const emailPhone = document.getElementById('email-telefono');
            const password = document.getElementById('password');
            
        
            // Mostrar animación de éxito y luego redirigir
            const submitBtn = loginForm.querySelector('.register-submit-btn');
            submitBtn.textContent = 'Procesando...';
            submitBtn.classList.add('success');
            
            setTimeout(() => {
                submitBtn.textContent = 'Exitoso!';
            }, 700);
            
            setTimeout(() => {
                window.location.href = 'Home.html';
            }, 1200);
        });
    }
});