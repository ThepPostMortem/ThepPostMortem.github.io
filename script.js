(function() {
    'use strict';

    // ----- CONFIGURACIÓN: NÚMERO DE WHATSAPP (cámbialo por el tuyo) -----
    const WHATSAPP_NUMBER = '573151611593'; // con código de país, sin '+' ni espacios

    // ----- Estado del carrito -----
    let cart = [];

    // DOM references
    const cartBadge = document.getElementById('cartBadge');
    const cartModal = document.getElementById('cartModal');
    const cartClose = document.getElementById('cartClose');
    const cartIcon = document.getElementById('cartIcon');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalSpan = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const toast = document.getElementById('toast');
    const contactForm = document.getElementById('contactForm');

    // ----- Funciones del carrito -----
    function updateCartUI() {
        const totalItems = cart.reduce((acc, item) => acc + 1, 0);
        cartBadge.textContent = totalItems;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `<div class="cart-empty">🛒 Aún no hay productos.</div>`;
            cartTotalSpan.textContent = 'Total: $0.00';
            return;
        }

        let html = '';
        let total = 0;
        cart.forEach((item, index) => {
            total += item.price;
            html += `
                <div class="cart-item">
                    <span><strong>${item.name}</strong></span>
                    <span>$${item.price.toFixed(2)} <button style="background:none;border:none;color:#ff6b35;cursor:pointer;font-size:1rem;" data-index="${index}" class="remove-item"><i class="fas fa-trash-alt"></i></button></span>
                </div>
            `;
        });
        cartItemsContainer.innerHTML = html;
        cartTotalSpan.textContent = `Total: $${total.toFixed(3)}`;

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function(e) {
                const idx = parseInt(this.dataset.index, 10);
                cart.splice(idx, 1);
                updateCartUI();
                showToast('Producto eliminado');
            });
        });
    }

    function showToast(message) {
        toast.textContent = message || '¡Producto añadido!';
        toast.classList.add('show');
        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => {
            toast.classList.remove('show');
        }, 2200);
    }

    function addToCart(productId, productName, productPrice) {
        const existing = cart.find(item => item.id === productId);
        if (existing) {
            showToast('Ya está en el carrito');
            return;
        }
        cart.push({
            id: productId,
            name: productName,
            price: productPrice
        });
        updateCartUI();
        showToast(`¡${productName} añadido!`);
    }

    function goToWhatsApp(message) {
        const url = `https://wa.me/${3151611593}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }

    function buyNow(productName, productPrice) {
        const message = `Hola, quiero comprar el producto: "${productName}" por $${productPrice.toFixed(2)} COP. ¿Cómo puedo realizar el pago?`;
        goToWhatsApp(message);
        showToast(`Redirigiendo a WhatsApp para "${productName}"`);
    }

    // ----- Eventos: botones "Añadir al carrito" y "Comprar ahora" -----
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.product-card');
            if (!card) return;
            const id = parseInt(card.dataset.id, 10);
            const name = card.dataset.name;
            const price = parseFloat(card.dataset.price);
            addToCart(id, name, price);
        });
    });

    document.querySelectorAll('.buy-now').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.product-card');
            if (!card) return;
            const name = card.dataset.name;
            const price = parseFloat(card.dataset.price);
            buyNow(name, price);
        });
    });

    // ----- Carrito modal -----
    cartIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        cartModal.classList.add('active');
    });

    cartClose.addEventListener('click', function() {
        cartModal.classList.remove('active');
    });

    cartModal.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            cartModal.classList.remove('active');
        }
    });

    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            showToast('El carrito está vacío');
            return;
        }

        let message = 'Hola, quiero comprar los siguientes productos:\n';
        let total = 0;
        cart.forEach(item => {
            message += `- ${item.name}: $${item.price.toFixed(2)} USD\n`;
            total += item.price;
        });
        message += `\nTotal: $${total.toFixed(2)} USD. ¿Cómo puedo realizar el pago?`;

        goToWhatsApp(message);
        cart = [];
        updateCartUI();
        cartModal.classList.remove('active');
        showToast('Pedido enviado a WhatsApp');
    });

    // ----- Contacto -----
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const mensaje = document.getElementById('mensaje').value.trim();

        if (!nombre || !email || !mensaje) {
            showToast('Por favor completa todos los campos');
            return;
        }

        const whatsappMsg = `Hola, soy ${nombre} (${email}). Mensaje: ${mensaje}`;
        goToWhatsApp(whatsappMsg);
        contactForm.reset();
        showToast('Mensaje enviado por WhatsApp ✅');
    });

    // Inicializar UI del carrito
    updateCartUI();

    // Cerrar modal con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && cartModal.classList.contains('active')) {
            cartModal.classList.remove('active');
        }
    });

})();

// ----- CONTADOR DINÁMICO Y FECHA ACTUAL -----
(function() {
    // Mostrar fecha de hoy
    const todayDateElement = document.getElementById('todayDate');
    if (todayDateElement) {
        const hoy = new Date();
        const opciones = { day: '2-digit', month: '2-digit', year: 'numeric' };
        todayDateElement.textContent = hoy.toLocaleDateString('es-ES', opciones);
    }

    // Contador que aumenta cada cierto tiempo (simula actividad)
    const counterElement = document.getElementById('counterNumber');
    if (counterElement) {
        let contador = parseInt(counterElement.textContent) || 54;
        
        // Aumenta cada 3-8 segundos (simula compras en tiempo real)
        setInterval(() => {
            contador += Math.floor(Math.random() * 3) + 1; // Suma entre 1 y 3
            counterElement.textContent = contador;
        }, 4000 + Math.random() * 4000); // Entre 4 y 8 segundos
    }
})();

// Leer fichas desde localStorage para mostrar en el index
(function() {
    const fichaCount = document.getElementById('fichaCount');
    if (fichaCount) {
        const fichas = parseInt(localStorage.getItem('fichasUsuario')) || 0;
        fichaCount.textContent = fichas;
        
        // Actualizar cada 2 segundos (por si se recarga desde otra pestaña)
        setInterval(() => {
            const nuevasFichas = parseInt(localStorage.getItem('fichasUsuario')) || 0;
            if (fichaCount.textContent != nuevasFichas) {
                fichaCount.textContent = nuevasFichas;
            }
        }, 2000);
    }
})();
