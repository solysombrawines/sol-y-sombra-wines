/**
 * Sol y Sombra Wines — script-v2.js
 * Header scroll · Menú hamburguesa robusto · Smooth scroll · Fade-in on-scroll
 */
document.addEventListener('DOMContentLoaded', () => {

    // Declaración de función para alternar campo de empresa en formulario
    let toggleBusinessField = () => {};

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
    let isTransitioning = false;

    const populateModal = (wineData) => {
        // Reset scroll position of the info column to the top
        const modalColInfo = document.querySelector('.wine-modal__col-info');
        if (modalColInfo) {
            modalColInfo.scrollTop = 0;
        }

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

        // Configurar enlace dinámico de WhatsApp B2C en el modal
        const modalWhatsappBtn = document.querySelector('.js-modal-whatsapp-cta');
        if (modalWhatsappBtn) {
            const wineCleanName = wineData.name.replace('<br>', ' ');
            const message = `Hola Sol y Sombra! Quisiera consultar la disponibilidad del vino ${wineCleanName} para consumidor particular. ¡Muchas gracias!`;
            modalWhatsappBtn.href = `https://wa.me/5492617599941?text=${encodeURIComponent(message)}`;
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
        isTransitioning = false;
        const modalContent = document.querySelector('.wine-modal__content');
        if (modalContent) {
            modalContent.classList.remove('fade-out');
        }
    };

    const changeWineWithTransition = (newIndex) => {
        if (isTransitioning) return;
        isTransitioning = true;

        const modalContent = document.querySelector('.wine-modal__content');
        if (modalContent) {
            modalContent.classList.add('fade-out');
            setTimeout(() => {
                currentWineIndex = newIndex;
                populateModal(wineCatalog[currentWineIndex]);
                modalContent.classList.remove('fade-out');
                
                // Allow another transition after the fade-in finishes (200ms)
                setTimeout(() => {
                    isTransitioning = false;
                }, 200);
            }, 200);
        } else {
            currentWineIndex = newIndex;
            populateModal(wineCatalog[currentWineIndex]);
            isTransitioning = false;
        }
    };

    const nextWine = () => {
        const newIndex = (currentWineIndex + 1) % wineCatalog.length;
        changeWineWithTransition(newIndex);
    };

    const prevWine = () => {
        const newIndex = (currentWineIndex - 1 + wineCatalog.length) % wineCatalog.length;
        changeWineWithTransition(newIndex);
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
        if (btn.classList.contains('wine-modal__cta')) return; // Dejamos que los CTAs del modal hagan sus acciones
        e.preventDefault();
        closeModalFunc();
    }));

    // Acción de Contacto Mayorista/Distribuidor desde el modal
    const modalDistributorBtn = document.querySelector('.js-modal-distributor-cta');
    modalDistributorBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        const wineData = wineCatalog[currentWineIndex];
        
        // Cerrar modal
        closeModalFunc();

        // Hacer scroll suave a #contacto
        const target = document.querySelector('#contacto');
        if (target) {
            const offset = (header?.offsetHeight ?? 0);
            window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
        }

        // Auto-seleccionar datos en el formulario
        const clientTypeSelect = document.getElementById('formClientType');
        const formContainer = document.getElementById('contactoFormContainer');
        const nameInput = document.getElementById('formName');

        if (clientTypeSelect) {
            if (clientTypeSelect.type === 'checkbox') {
                clientTypeSelect.checked = true;
                // Forzar actualización inmediata del campo Empresa/Negocio
                if (typeof toggleBusinessField === 'function') {
                    toggleBusinessField();
                }
            } else {
                clientTypeSelect.value = 'distribuidor';
            }
        }

        // Auto-seleccionar el vino en las chips de multiselección
        const specificWineCheckbox = document.getElementById(`wine-${wineData.id}`);
        if (specificWineCheckbox) {
            // Desmarcar todas las opciones primero
            const allWineCheckboxes = document.querySelectorAll('.chip-input');
            allWineCheckboxes.forEach(cb => cb.checked = false);
            
            // Marcar solo el vino específico
            specificWineCheckbox.checked = true;
        } else {
            // Fallback: marcar Consulta General y todos los vinos
            const chipGeneral = document.getElementById('wine-general');
            if (chipGeneral) {
                chipGeneral.checked = true;
                const otherChips = Array.from(document.querySelectorAll('.chip-input')).filter(cb => cb.id !== 'wine-general');
                otherChips.forEach(cb => cb.checked = true);
            }
        }

        // Registrar un IntersectionObserver temporal para enfocar y realzar cuando sea visible
        if (formContainer) {
            formContainer.classList.remove('form-highlight'); // Limpiar estado previo
            
            const highlightObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Iniciar la animación de realce
                        entry.target.classList.add('form-highlight');
                        
                        // Enfocar campo de Empresa/Negocio si el B2B está activo (evita saltos bruscos del navegador)
                        const businessInput = document.getElementById('formBusiness');
                        if (clientTypeSelect && clientTypeSelect.checked && businessInput) {
                            businessInput.focus();
                        } else if (nameInput) {
                            nameInput.focus();
                        }
                        
                        // Quitar la animación después de 2s
                        setTimeout(() => {
                            entry.target.classList.remove('form-highlight');
                        }, 2000);
                        
                        // Dejar de observar inmediatamente
                        highlightObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 }); // Se activa al estar visible al menos un 30% del formulario
            
            highlightObserver.observe(formContainer);
        }
    });

    // Cerrar modal si se hace clic en WhatsApp B2C
    const modalWhatsappBtn = document.querySelector('.js-modal-whatsapp-cta');
    modalWhatsappBtn?.addEventListener('click', () => {
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

    // ── 8. LOGICA DE FORMULARIO DE CONTACTO DINAMICO B2B/B2C ──────────────────
    const contactForm = document.getElementById('wineContactForm');
    const btnSubmitWhatsapp = document.getElementById('btnSubmitWhatsapp');
    const btnSubmitEmail = document.getElementById('btnSubmitEmail');

    if (contactForm && btnSubmitWhatsapp && btnSubmitEmail) {
        
        // Controladores del campo condicional de Empresa / Negocio
        const clientTypeInput = document.getElementById('formClientType');
        const groupBusiness = document.getElementById('groupBusiness');
        const inputBusiness = document.getElementById('formBusiness');

        toggleBusinessField = () => {
            if (clientTypeInput && groupBusiness) {
                if (clientTypeInput.checked) {
                    groupBusiness.style.display = 'block';
                    groupBusiness.classList.add('fade-in-field');
                    if (inputBusiness) inputBusiness.required = true;
                } else {
                    groupBusiness.style.display = 'none';
                    groupBusiness.classList.remove('fade-in-field');
                    if (inputBusiness) {
                        inputBusiness.value = '';
                        inputBusiness.required = false;
                        inputBusiness.classList.remove('form-error');
                    }
                }
            }
        };

        if (clientTypeInput) {
            clientTypeInput.addEventListener('change', toggleBusinessField);
        }
        // Inicializar el estado de visibilidad del campo comercial al cargar
        toggleBusinessField();

        // Función de sanitización para proteger el formulario contra XSS e inyecciones
        const sanitizeInput = (str, maxLength = 500) => {
            if (typeof str !== 'string') return '';
            // Recortar longitud máxima para evitar payloads excesivos
            let clean = str.substring(0, maxLength);
            // Eliminar etiquetas HTML simples para prevenir inyección XSS
            clean = clean.replace(/<\/?[^>]+(>|$)/g, "");
            return clean.trim();
        };

        // Cooldown para evitar spam de clics en envíos
        const checkRateLimit = () => {
            const LAST_SUBMIT_KEY = 'sys_last_form_submit';
            const now = Date.now();
            const lastSubmit = localStorage.getItem(LAST_SUBMIT_KEY);
            if (lastSubmit && (now - parseInt(lastSubmit, 10) < 4000)) { // 4 segundos de cooldown
                alert("Por favor, espera unos segundos antes de enviar otra consulta.");
                return false;
            }
            localStorage.setItem(LAST_SUBMIT_KEY, now.toString());
            return true;
        };
        
        const validateForm = () => {
            const nameInput = document.getElementById('formName');
            const businessInput = document.getElementById('formBusiness');
            const honeypotInput = document.getElementById('formHoneypot');
            let isValid = true;

            // 1. Detección de bots automatizados (Honeypot)
            if (honeypotInput && honeypotInput.value.trim() !== '') {
                console.warn("Spam detectado y bloqueado silenciosamente.");
                return false; // Detiene la ejecución en silencio
            }

            // Limpiar errores previos
            nameInput.classList.remove('form-error');
            if (businessInput) {
                businessInput.classList.remove('form-error');
            }

            if (!nameInput.value.trim()) {
                nameInput.classList.add('form-error');
                nameInput.focus();
                isValid = false;
            }

            // Validar Empresa si es obligatorio (switch de Distribuidor activo)
            if (businessInput && businessInput.required && !businessInput.value.trim()) {
                businessInput.classList.add('form-error');
                if (isValid) {
                    businessInput.focus();
                }
                isValid = false;
            }

            return isValid;
        };

        // ── Lógica de Multiselección de Vinos (Grid) ──
        const btnAll = document.getElementById('btn-select-all');
        const btnVarietales = document.getElementById('btn-select-varietales');
        const btnReservas = document.getElementById('btn-select-reservas');

        const chkVarietales = [
            document.getElementById('wine-varietal-malbec'),
            document.getElementById('wine-varietal-cabernet')
        ];
        const chkReservas = [
            document.getElementById('wine-reserva-malbec'),
            document.getElementById('wine-reserva-cabernet')
        ];
        const chkAll = [...chkVarietales, ...chkReservas];

        // Toggle "Todos" (selecciona/deselecciona todo el catálogo)
        if (btnAll) {
            btnAll.addEventListener('click', () => {
                const anyUnchecked = chkAll.some(cb => cb && !cb.checked);
                chkAll.forEach(cb => {
                    if (cb) cb.checked = anyUnchecked;
                });
            });
        }

        // Toggle "Varietales" (selecciona/deselecciona columna Varietales)
        if (btnVarietales) {
            btnVarietales.addEventListener('click', () => {
                const anyUnchecked = chkVarietales.some(cb => cb && !cb.checked);
                chkVarietales.forEach(cb => {
                    if (cb) cb.checked = anyUnchecked;
                });
            });
        }

        // Toggle "Reservas" (selecciona/deselecciona columna Reservas)
        if (btnReservas) {
            btnReservas.addEventListener('click', () => {
                const anyUnchecked = chkReservas.some(cb => cb && !cb.checked);
                chkReservas.forEach(cb => {
                    if (cb) cb.checked = anyUnchecked;
                });
            });
        }

        // Configurar los botones de vista rápida (icono del ojo)
        const viewWineBtns = document.querySelectorAll('.js-view-wine');
        viewWineBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation(); // Evita que se marque/desmarque el checkbox del label
                const wineId = this.getAttribute('data-wine');
                if (typeof openModal === 'function') {
                    openModal(wineId);
                }
            });
        });

        const getWineText = (wineVal) => {
            const wineMap = {
                'general': 'Consulta General',
                'varietal-malbec': 'Sol y Sombra Malbec (Varietal)',
                'varietal-cabernet': 'Sol y Sombra Cabernet Franc (Varietal)',
                'reserva-malbec': 'Reserva Malbec (Reserva Boutique)',
                'reserva-cabernet': 'Reserva Cabernet Franc (Reserva Boutique)'
            };
            return wineMap[wineVal] || wineVal;
        };

        const getFormValues = () => {
            const rawName = document.getElementById('formName').value;
            const clientTypeInput = document.getElementById('formClientType');
            const rawBusiness = document.getElementById('formBusiness') ? document.getElementById('formBusiness').value : '';
            
            // Si es checkbox, leemos .checked
            let clientType = 'Consumidor Particular';
            if (clientTypeInput) {
                clientType = clientTypeInput.checked ? 'Distribuidor / Vinoteca' : 'Consumidor Particular';
            }
            
            // Lógica para compilar los vinos de interés seleccionados
            let wineName = 'Consulta General';
            let wineVal = 'general';

            const checkedWines = chkAll.filter(cb => cb && cb.checked);
            if (checkedWines.length === 0 || checkedWines.length === chkAll.length) {
                // Si no seleccionó ninguno o seleccionó todos, es Consulta General
                wineName = 'Consulta General';
                wineVal = 'general';
            } else {
                // Si seleccionó específicos, listarlos ordenados
                const names = checkedWines.map(cb => getWineText(cb.value));
                wineName = names.join(', ');
                wineVal = checkedWines.map(cb => cb.value).join(',');
            }
            
            const rawMessage = document.getElementById('formMessage').value;

            // Sanitización profunda de los campos
            const name = sanitizeInput(rawName, 100);
            const business = sanitizeInput(rawBusiness, 150);
            const message = sanitizeInput(rawMessage, 1000) || 'Sin comentarios adicionales.';

            return { name, clientType, business, wineName, wineVal, message };
        };

        btnSubmitWhatsapp.addEventListener('click', () => {
            if (!validateForm()) return;
            if (!checkRateLimit()) return;
            const { name, clientType, business, wineName, message } = getFormValues();

            let waMessage = `Hola Sol y Sombra!\n\n` +
                            `Mi nombre: ${name}\n`;
            
            if (clientType === 'Distribuidor / Vinoteca' && business) {
                waMessage += `Empresa/Negocio: ${business}\n`;
            }
            
            waMessage += `Tipo de cliente: ${clientType}\n` +
                         `Vino de interés: ${wineName}\n\n` +
                         `Consulta:\n${message}`;

            const waUrl = `https://wa.me/5492617599941?text=${encodeURIComponent(waMessage)}`;
            window.open(waUrl, '_blank');
        });

        btnSubmitEmail.addEventListener('click', () => {
            if (!validateForm()) return;
            if (!checkRateLimit()) return;
            const { name, clientType, business, wineName, message } = getFormValues();

            const emailSubject = `Consulta Sol y Sombra — ${wineName} (${clientType})`;
            
            let emailBody = `Hola Sol y Sombra!\n\n` +
                            `Mi nombre: ${name}\n`;
            
            if (clientType === 'Distribuidor / Vinoteca' && business) {
                emailBody += `Empresa/Negocio: ${business}\n`;
            }
            
            emailBody += `Tipo de cliente: ${clientType}\n` +
                         `Vino de interés: ${wineName}\n\n` +
                         `Consulta:\n${message}`;

            const mailtoUrl = `mailto:ventas@solysombrawines.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
            window.location.href = mailtoUrl;
        });

        // Limpiar errores visuales al escribir
        document.getElementById('formName').addEventListener('input', function() {
            this.classList.remove('form-error');
        });
        const businessInput = document.getElementById('formBusiness');
        if (businessInput) {
            businessInput.addEventListener('input', function() {
                this.classList.remove('form-error');
            });
        }
    }

});
