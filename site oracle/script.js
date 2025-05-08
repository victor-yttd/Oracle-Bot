// Set current year in footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Adjust for header height
                behavior: 'smooth'
            });
        }
    });
});

// Form submission (prevent default for demo)
const contactForm = document.querySelector('.form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Simple validation
        if (!name || !email || !message) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        
        // In a real application, you would send this data to a server
        alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
        
        // Reset form
        contactForm.reset();
    });
}

// Simple chat functionality for demo
const chatInput = document.querySelector('.chat-input');
const chatMessages = document.querySelector('.chat-messages');
const chatSend = document.querySelector('.chat-send');

if (chatInput && chatMessages && chatSend) {
    // Function to add a message to the chat
    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = isUser ? 'message-bot' : 'message-oracle';
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Handle send button click
    chatSend.addEventListener('click', function() {
        sendMessage();
    });
    
    // Handle enter key press
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Send message function
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            // Add user message
            addMessage(message, true);
            
            // Clear input
            chatInput.value = '';
            
            // Simulate Oracle response after a short delay
            setTimeout(() => {
                const responses = [
                    "Posso ajudar você com isso!",
                    "Entendi sua solicitação. Vamos resolver isso.",
                    "Interessante pergunta! Estou processando a melhor resposta.",
                    "Obrigado por perguntar. Aqui está o que você precisa saber."
                ];
                
                // Pick a random response
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                addMessage(randomResponse);
            }, 1000);
        }
    }
}

// Add mobile menu toggle functionality
const mobileMenuButton = document.createElement('button');
mobileMenuButton.className = 'mobile-menu-button';
mobileMenuButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
`;

// Add mobile menu styles
const style = document.createElement('style');
style.textContent = `
    .mobile-menu-button {
        display: block;
        background: none;
        border: none;
        color: white;
        cursor: pointer;
    }
    
    @media (min-width: 768px) {
        .mobile-menu-button {
            display: none;
        }
    }
    
    .mobile-menu {
        position: fixed;
        top: 4rem;
        left: 0;
        right: 0;
        background-color: var(--black);
        padding: 1rem;
        border-bottom: 1px solid var(--gray-800);
        display: flex;
        flex-direction: column;
        gap: 1rem;
        z-index: 40;
        transform: translateY(-100%);
        transition: transform 0.3s ease;
    }
    
    .mobile-menu.active {
        transform: translateY(0);
    }
`;

document.head.appendChild(style);

// Create mobile menu
const mobileMenu = document.createElement('div');
mobileMenu.className = 'mobile-menu';
mobileMenu.innerHTML = `
    <a href="#features" class="nav-link">Recursos</a>
    <a href="#how-it-works" class="nav-link">Como Funciona</a>
    <a href="#contact" class="nav-link">Contato</a>
`;

// Add mobile menu to DOM
const header = document.querySelector('.sticky-header');
if (header) {
    const container = header.querySelector('.container');
    container.insertBefore(mobileMenuButton, container.querySelector('.nav-menu'));
    header.after(mobileMenu);
    
    // Toggle mobile menu
    mobileMenuButton.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
            mobileMenu.classList.remove('active');
        }
    });
}