// Services data
const services = {
    'lavagem-simples': {
        name: 'Lavagem Simples',
        price: 25
    },
    'lavagem-completa': {
        name: 'Lavagem Completa',
        price: 45
    },
    'enceramento': {
        name: 'Enceramento',
        price: 80
    },
    'detailing': {
        name: 'Detailing Premium',
        price: 150
    }
};

// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
    
    // Set minimum date to today
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
});

// Mobile menu toggle
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const isVisible = mobileMenu.style.display === 'block';
    mobileMenu.style.display = isVisible ? 'none' : 'block';
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
    
    // Close mobile menu if open
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.style.display = 'none';
}

// Select service and scroll to booking
function selectService(serviceId) {
    const serviceSelect = document.getElementById('service');
    serviceSelect.value = serviceId;
    
    // Add visual feedback
    const serviceCard = document.querySelector(`[data-service="${serviceId}"]`);
    serviceCard.style.transform = 'scale(0.95)';
    setTimeout(() => {
        serviceCard.style.transform = 'scale(1)';
    }, 150);
    
    // Scroll to booking section
    scrollToSection('booking');
}

// Format phone number
function formatPhone(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length >= 11) {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (value.length >= 7) {
        value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else if (value.length >= 3) {
        value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    }
    
    input.value = value;
}

// Add phone formatting
document.getElementById('phone').addEventListener('input', function() {
    formatPhone(this);
});

// Form submission
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // Validate required fields
    const requiredFields = ['name', 'phone', 'carModel', 'carColor', 'service', 'date', 'time'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    // Get selected service info
    const selectedService = services[data.service];
    
    // Format date
    const formattedDate = new Date(data.date).toLocaleDateString('pt-BR');
    
    // Create WhatsApp message
    const message = `*🚗 AGENDAMENTO LAVA-JATO*\n\n` +
        `👤 *Nome:* ${data.name}\n` +
        `📱 *Telefone:* ${data.phone}\n` +
        `📧 *Email:* ${data.email || 'Não informado'}\n` +
        `🚙 *Modelo do Carro:* ${data.carModel}\n` +
        `🎨 *Cor:* ${data.carColor}\n\n` +
        `🔧 *Serviço:* ${selectedService.name}\n` +
        `💰 *Preço:* R$ ${selectedService.price},00\n` +
        `📅 *Data:* ${formattedDate}\n` +
        `⏰ *Horário:* ${data.time}\n\n` +
        `📝 *Observações:* ${data.observations || 'Nenhuma'}\n\n` +
        `✅ *Agendamento solicitado!*`;
    
    // WhatsApp URL (replace with your actual WhatsApp number)
    const whatsappNumber = '5561981227195'; // Replace with your number
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp
    window.open(whatsappURL, '_blank');
    
    // Show success message
    showSuccessMessage();
});

// Show success message
function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(16, 185, 129, 0.95);
            color: white;
            padding: 2rem;
            border-radius: 1rem;
            text-align: center;
            z-index: 10000;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        ">
            <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
            <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">Agendamento Enviado!</h3>
            <p>Você será redirecionado para o WhatsApp para confirmar seu agendamento.</p>
        </div>
    `;
    
    document.body.appendChild(successDiv);
    
    // Remove success message after 3 seconds
    setTimeout(() => {
        document.body.removeChild(successDiv);
    }, 3000);
}

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(0, 0, 0, 0.8)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.1)';
    }
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        mobileMenu.style.display = 'none';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.service-card, .contact-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Form validation feedback
function addValidationFeedback() {
    const inputs = document.querySelectorAll('input[required], select[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.style.borderColor = '#ef4444';
                this.style.boxShadow = '0 0 0 1px #ef4444';
            } else {
                this.style.borderColor = '#10b981';
                this.style.boxShadow = '0 0 0 1px #10b981';
            }
        });
        
        input.addEventListener('input', function() {
            if (this.value) {
                this.style.borderColor = '#10b981';
                this.style.boxShadow = '0 0 0 1px #10b981';
            }
        });
    });
}

// Initialize validation feedback
document.addEventListener('DOMContentLoaded', addValidationFeedback);

// Prevent form submission on Enter key (except for textarea)
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.type !== 'submit') {
        e.preventDefault();
    }
});

// Auto-resize textarea
document.getElementById('observations').addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
});
