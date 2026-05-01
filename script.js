// =========================
// MENU (BURGER)
// toggle hace esta acción: enciende/apaga algo.

// toggle enciende/apaga una clase CSS:

// Si la clase no está, toggle la agrega.
// Si la clase ya está, toggle la quita.
// Ejemplo con el menú:

// Cuando toggle('is-open', true) → abre el menú porque agrega la clase is-open.
// Cuando toggle('is-open', false) → cierra el menú porque quita la clase is-open.
// Sin el segundo parámetro, sería así:

// element.classList.toggle('is-open') → la pone si no está, y la quita si ya estaba (cambia el estado cada vez que haces click).





// =========================

const burger = document.getElementById('burger'); // Busca el botón del menú (id="burger") en el HTML.
const navLinks = document.getElementById('nav-links'); // Busca la lista <ul> del menú (id="nav-links").

function setMenu(open) { // Función para abrir/cerrar el menú en móvil.
    if (!navLinks || !burger) return; // Si no existe el menú o el botón, no hacemos nada (evita errores).
    navLinks.classList.toggle('is-open', open); // Agrega o quita la clase "is-open" según open (true/false).
    burger.setAttribute('aria-expanded', String(open)); // Actualiza accesibilidad: "true" si está abierto, "false" si está cerrado.
}


// && se llama operador AND lógico (en español: “y lógico”).
// Se pronuncia “and” o “y”.

// Qué hace:

// Evalúa dos cosas.
// Solo da “verdadero” si las dos son verdaderas.
if (burger && navLinks) { // Solo agrega eventos si encontramos ambos elementos.
    burger.addEventListener('click', () => { // Cuando haces click en el burger...
        const isOpen = navLinks.classList.contains('is-open'); // Revisa si el menú ya está abierto.
        setMenu(!isOpen); // Si estaba abierto lo cierra; si estaba cerrado lo abre.
    }); // Fin del evento click.

    navLinks.addEventListener('click', (event) => { // Cuando haces click dentro del menú...
        if (event.target instanceof Element && event.target.matches('a') && window.innerWidth <= 768) { // Si fue un link y estás en móvil...
            setMenu(false); // Cierra el menú (para que no se quede abierto).
        } // Fin del if.
    }); // Fin del evento click del menú.

    document.addEventListener('click', (event) => { // Detecta clicks en cualquier parte de la página.
        if (!(event.target instanceof Element)) return; // Si no es un elemento válido, salimos.
        const clickedInsideMenu = navLinks.contains(event.target) || burger.contains(event.target); // ¿El click fue dentro del menú o el botón?
        if (!clickedInsideMenu && navLinks.classList.contains('is-open')) setMenu(false); // Si fue afuera y está abierto, lo cerramos.
    }); // Fin del evento click global.
} // Fin del bloque del menú.

// =========================
// SLIDER (BANNER)
// =========================

const slides = Array.from(document.querySelectorAll('.js-slide')); // Guarda todos los banners (elementos con clase "js-slide").
const dotsContainer = document.getElementById('slider-dots'); // Contenedor donde van los puntitos (dots).

let currentIndex = 0; // Índice del banner actual (0 = el primero).
let intervalId = null; // Aquí guardamos el ID del setInterval para poder detenerlo.

function showSlide(index) { // Muestra un banner por índice.
    if (slides.length === 0) return; // Si no hay slides, no hacemos nada.

    currentIndex = (index + slides.length) % slides.length; // Ajusta el índice para que nunca se salga (circular).

    slides.forEach((slide, i) => { // Recorre todos los banners...
        const isActive = i === currentIndex; // Revisa si este banner es el actual.
        slide.classList.toggle('is-active', isActive); // Activa/desactiva la clase "is-active".
        slide.setAttribute('aria-hidden', String(!isActive)); // Accesibilidad: los no activos quedan "ocultos" para lectores.
    }); // Fin del forEach de slides.

    const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll('.dot')) : []; // Toma todos los dots (si existe el contenedor).
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === currentIndex)); // Marca como activo el dot del banner actual.
} // Fin de showSlide.

function nextSlide() { // Función que pasa al siguiente banner.
    showSlide(currentIndex + 1); // Muestra el siguiente índice.
} // Fin de nextSlide.

function stopAuto() { // Detiene el cambio automático.
    if (intervalId === null) return; // Si no hay intervalo, no hay nada que detener.
    clearInterval(intervalId); // Detiene el setInterval.
    intervalId = null; // Limpia el ID.
} // Fin de stopAuto.

function startAuto() { // Inicia el cambio automático.
    stopAuto(); // Primero detiene por si ya estaba corriendo (evita duplicados).
    intervalId = setInterval(nextSlide, 3000); // Cada 3000ms (3s) llama a nextSlide.
} // Fin de startAuto.

function renderDots() { // Dibuja los puntitos según la cantidad de slides.
    if (!dotsContainer) return; // Si no existe el contenedor, no hacemos nada.
    dotsContainer.innerHTML = ''; // Limpia el contenedor antes de volver a pintar.

    slides.forEach((_, i) => { // Por cada slide, creamos un dot...
        const dot = document.createElement('button'); // Crea un botón (mejor que un div, porque es clickeable).
        dot.type = 'button'; // Evita que se comporte como "submit" si algún día queda dentro de un form.
        dot.className = 'dot' + (i === 0 ? ' is-active' : ''); // Agrega clase "dot" y activa el primero.
        dot.setAttribute('aria-label', `Ir al slide ${i + 1}`); // Texto para accesibilidad.
        dot.addEventListener('click', () => { // Al hacer click en un dot...
            showSlide(i); // Muestra ese banner.
            startAuto(); // Reinicia el auto (para que siga cambiando).
        }); // Fin del click del dot.
        dotsContainer.appendChild(dot); // Mete el dot en el contenedor.
    }); // Fin del forEach.
} // Fin de renderDots.

if (slides.length > 0) { // Solo inicializamos si hay banners.
    renderDots(); // Crea los dots.
    showSlide(0); // Muestra el primer banner.
    startAuto(); // Inicia el auto-cambio cada 3s.

    const slider = document.querySelector('.slider'); // Busca la sección del slider.
    if (slider) { // Si existe...
        slider.addEventListener('mouseenter', stopAuto); // Cuando el mouse entra, pausa el auto.
        slider.addEventListener('mouseleave', startAuto); // Cuando el mouse sale, reanuda el auto.
    } // Fin del if slider.
} // Fin del if slides.

// =========================
// BOTONES (OPCIONAL) DEL SLIDER
// =========================

// Para activarlos:
// 1) Descomenta los botones en `index.html` dentro del <section class="slider">.
// 2) Descomenta este bloque:

const prevBtn = document.querySelector('.slider-btn-prev'); // Botón "anterior".
const nextBtn = document.querySelector('.slider-btn-next'); // Botón "siguiente".

if (prevBtn) { // Si existe el botón...
    prevBtn.addEventListener('click', () => { // Al hacer click...
        showSlide(currentIndex - 1); // Va al banner anterior.
        startAuto(); // Reinicia el auto.
    }); // Fin del click.
} // Fin del if.

if (nextBtn) { // Si existe el botón...
    nextBtn.addEventListener('click', () => { // Al hacer click...
        showSlide(currentIndex + 1); // Va al banner siguiente.
        startAuto(); // Reinicia el auto.
    }); // Fin del click.
} // Fin del if.


// =========================
// FOOTER: AÑO AUTOMÁTICO
// =========================

const year = document.getElementById('year'); // Busca el <span id="year"> del footer.
if (year) year.textContent = String(new Date().getFullYear()); // Coloca el año actual (ej: 2026).
