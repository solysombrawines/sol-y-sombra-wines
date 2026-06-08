/**
 * Sol y Sombra Wines — script-v2.js
 * Header scroll · Menú hamburguesa robusto · Smooth scroll · Fade-in on-scroll
 */
document.addEventListener('DOMContentLoaded', () => {

    const header = document.getElementById('site-header');
    const toggle = document.getElementById('nav-toggle');
    const nav = document.getElementById('site-nav');

    // ── 1. Header: siempre visible, fondo oscuro al scroll ──────────────────
    // Arranca con fondo semitransparente para ser legible sobre imagen clara
    const onScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 80);

        // Barra de progreso de lectura (Scroll)
        const progressBar = document.getElementById('scroll-progress-bar');
        if (progressBar) {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            progressBar.style.width = scrollPercent + '%';
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();  // ejecutar al inicio para el estado correcto

    // ── 2. Menú hamburguesa: abrir/cerrar con botón ─────────────────────────
    const openMenu = () => {
        nav.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-label', 'Cerrar menú');
        document.body.style.overflow = 'hidden';
        // Dibujar X en el botón
        toggle.classList.add('is-open');
        header.classList.add('menu-open');
    };

    const closeMenu = () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir menú');
        document.body.style.overflow = '';
        toggle.classList.remove('is-open');
        header.classList.remove('menu-open');
    };

    toggle?.addEventListener('click', () => {
        nav.classList.contains('open') ? closeMenu() : openMenu();
    });

    // Cerrar al hacer click en cualquier link del menú
    nav?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Cerrar al hacer click fuera del menú (en overlay)
    document.addEventListener('click', (e) => {
        if (nav.classList.contains('open') &&
            !nav.contains(e.target) &&
            !toggle.contains(e.target)) {
            closeMenu();
        }
    });

    // Cerrar con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('open')) closeMenu();
    });

    // ── 3. Smooth scroll suave para todos los anchors ───────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const id = a.getAttribute('href');
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            const offset = (header?.offsetHeight ?? 0);
            window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
        });
    });

    // ── 5. Fade-in on-scroll con IntersectionObserver ───────────────────────
    const fadeEls = document.querySelectorAll(
        '.wine-card, .arte__text, .arte__visual, .hija__body-inner, .historia__left-content, .historia__right, .hero__dark-content'
    );
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    fadeEls.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(28px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });

    // ── 6. Parallax Hija del Sol — funciona en Safari y 4K ─────────────────
    // Usamos transform:translateY en lugar de background-attachment:fixed
    // para máxima compatibilidad y suavidad en pantallas grandes
    const hijaBg = document.getElementById('hijaBg');
    const hijaSection = document.querySelector('.hija');

    if (hijaBg && hijaSection) {
        let rafPending = false;

        const updateHijaParallax = () => {
            const rect = hijaSection.getBoundingClientRect();
            const vpH = window.innerHeight;
            // Solo actualizamos mientras la sección esté en pantalla
            if (rect.bottom < 0 || rect.top > vpH) return;

            // Progreso: 0 cuando entra, 1 cuando sale completamente
            const scrolled = -rect.top;
            // Parallax: imagen se mueve 30% más lento que el scroll
            const shift = scrolled * 0.30;
            hijaBg.style.transform = `translateY(${shift}px)`;
        };

        const onScrollHija = () => {
            if (!rafPending) {
                rafPending = true;
                requestAnimationFrame(() => {
                    updateHijaParallax();
                    rafPending = false;
                });
            }
        };

        window.addEventListener('scroll', onScrollHija, { passive: true });
        updateHijaParallax(); // estado inicial
    }

    // ── 7. WINE MODAL FUNCTIONALITY ──────────────────────────────────────────
    const wineModal = document.getElementById('wineModal');
    const openModalBtns = document.querySelectorAll('.js-open-wine-modal');
    const closeModalBtns = document.querySelectorAll('.wine-modal__close, .js-close-modal');
    const modalOverlay = document.querySelector('.wine-modal__overlay');
    const navPrev = document.querySelector('.wine-modal__nav--prev');
    const navNext = document.querySelector('.wine-modal__nav--next');

    // Elementos del DOM dentro del Modal
    const modalName = document.getElementById('modalWineName');
    const modalTags = document.getElementById('modalWineTags');
    const modalQuote = document.getElementById('modalWineQuote');
    const modalImg = document.getElementById('modalWineImg');
    const modalTech = document.getElementById('modalWineTech');

    // Base de datos dummy (Datos ficticios, estructura real)
    const wineCatalog = [
        {
            id: 'varietal-malbec',
            name: 'Sol y Sombra Malbec',
            tags: 'Varietal · 2023 · Tupungato',
            theme: 'light',
            quote: 'La expresión más directa del sol de altura.',
            image: 'assets/img/malbec-varietal.webp',
            tech: {
                'Alcohol': '13.8%',
                'Cosecha': 'Manual en cajas de 15kg',
                'Viñedo': 'Cordón del Plata, Tupungato (Viñedos propios)',
                'Altitud': '1.100 m.s.n.m.',
                'Suelo': 'Franco-arenoso de formación aluvional',
                'Crianza': '1 año en botella',
                'Temp. de servicio': '16°C - 18°C',
                'Guarda': '3 a 5 años',
                'Maridaje': ['Carnes rojas magras', 'Pastas', 'Quesos semi-duros']
            }
        },
        {
            id: 'varietal-cabernet',
            name: 'Sol y Sombra Cabernet Franc',
            tags: 'Varietal · San Pablo, Tupungato',
            theme: 'light',
            quote: 'Joven, floral y de aroma elegante.',
            image: 'assets/img/cabfranc-varietal.webp',
            tech: {
                'Alcohol': '13.5%',
                'Perfil': 'Vino joven floral, de aroma elegante',
                'En boca': 'Taninos presentes pero suaves',
                'Viñedo': 'Cordón del Plata, Tupungato (Viñedos propios)',
                'Altitud': '1.100 m.s.n.m.',
                'Suelo': 'Franco-arenoso de formación aluvional',
                'Crianza': '1 año en botella'
            }
        },
        {
            id: 'reserva-malbec',
            name: 'Reserva Malbec',
            tags: 'Reserva Boutique · 2021 · Tupungato',
            theme: 'dark',
            quote: 'La paciencia de la sombra condensada en cada sorbo.',
            image: 'assets/img/malbec-reserva.webp',
            tech: {
                'Alcohol': '13.5%',
                'Cosecha': 'Manual, selección de racimos',
                'Viñedo': 'Finca Los Chicos, Cordón del Plata, Tupungato',
                'Altitud': '1.100 m.s.n.m.',
                'Suelo': 'Formación aluvional, arenoso a franco arenoso',
                'Crianza': 'Fudres de hormigón y 15% de crianza en barrica de roble',
                'Temp. de servicio': '18°C',
                'Guarda': '8 a 10 años',
                'Maridaje': ['Ojo de bife', 'Cordero', 'Quesos curados']
            }
        },
        {
            id: 'reserva-cabernet',
            name: 'Reserva Cabernet Franc',
            tags: 'Reserva Boutique · San Pablo, Tupungato',
            theme: 'dark',
            quote: 'Moderno y ligero pero de tipicidad inconfundible.',
            image: 'assets/img/cabfranc-reserva.webp',
            tech: {
                'Alcohol': '13.5%',
                'Perfil': 'Más especiado que el varietal, aroma persistente',
                'En boca': 'Ligero, final intermedio y taninos presentes',
                'Estilo': 'Moderno, respecting las características típicas',
                'Viñedo': 'Viñedo de altura (San Pablo, Tupungato)',
                'Crianza': '30% de paso por barrica de primer uso de roble'
            }
        }
    ];

    let currentWineIndex = 0;

    const populateModal = (wineData) => {
        // Tema dinámico (Light para Varietal, Dark para Reserva)
        if (wineData.theme === 'light') {
            wineModal.classList.add('wine-modal--light');
        } else {
            wineModal.classList.remove('wine-modal--light');
        }

        modalName.innerHTML = wineData.name.replace('Sol y Sombra', 'Sol y Sombra<br><em>').replace('Reserva', 'Reserva<br><em>') + '</em>'; // Mantiene la cursiva
        modalTags.textContent = wineData.tags;
        modalQuote.textContent = `❝ ${wineData.quote} ❞`;
        modalImg.src = wineData.image;
        modalImg.alt = wineData.name;

        // Construir Ficha Técnica
        modalTech.innerHTML = '';
        for (const [key, val] of Object.entries(wineData.tech)) {
            const dt = document.createElement('dt');
            dt.textContent = key;
            const dd = document.createElement('dd');

            if (key === 'Maridaje' && Array.isArray(val)) {
                val.forEach(tag => {
                    const span = document.createElement('span');
                    span.className = 'wine-pairing-tag';
                    span.textContent = tag;
                    dd.appendChild(span);
                });
            } else {
                dd.textContent = val;
            }

            modalTech.appendChild(dt);
            modalTech.appendChild(dd);
        }
    };

    const openModal = (wineId) => {
        if (!wineModal) return;
        const index = wineCatalog.findIndex(w => w.id === wineId);
        if (index > -1) {
            currentWineIndex = index;
            populateModal(wineCatalog[currentWineIndex]);
            wineModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Bloquear scroll del fondo
        }
    };

    const closeModalFunc = () => {
        if (!wineModal) return;
        wineModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    const nextWine = () => {
        currentWineIndex = (currentWineIndex + 1) % wineCatalog.length;
        populateModal(wineCatalog[currentWineIndex]);
    };

    const prevWine = () => {
        currentWineIndex = (currentWineIndex - 1 + wineCatalog.length) % wineCatalog.length;
        populateModal(wineCatalog[currentWineIndex]);
    };

    // Event Listeners
    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const wineId = btn.getAttribute('data-wine');
            openModal(wineId);
        });
    });

    closeModalBtns.forEach(btn => btn.addEventListener('click', (e) => {
        if (btn.tagName === 'A') return; // Si es un link real (Consultar disp) dejamos que navegue
        e.preventDefault();
        closeModalFunc();
    }));

    // Si el contacto del modal se clickea, cerramos el modal
    document.querySelector('.wine-modal__cta')?.addEventListener('click', () => {
        closeModalFunc();
    });

    modalOverlay?.addEventListener('click', closeModalFunc);

    // Flechas
    navNext?.addEventListener('click', nextWine);
    navPrev?.addEventListener('click', prevWine);

    // Escape Key y Navegación teclado para modal
    document.addEventListener('keydown', (e) => {
        if (wineModal?.getAttribute('aria-hidden') === 'false') {
            if (e.key === 'Escape') closeModalFunc();
            if (e.key === 'ArrowRight') nextWine();
            if (e.key === 'ArrowLeft') prevWine();
        }
    });

});
