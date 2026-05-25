const chatbotData = {
  en: {
    welcome: {
      text: "Welcome to Autolux Concierge. How can I assist you today?",
      options: [
        { label: "Book a car", next: "book_car" },
        { label: "Rental requirements", next: "requirements" },
        { label: "Our services", next: "services" },
        { label: "Contact support", next: "contact" }
      ]
    },
    book_car: {
      text: "Excellent choice. Our fleet features the finest vehicles. You can book directly from our Fleet page or let our concierge arrange it for you.",
      options: [
        { label: "Go to Fleet page", action: "redirect_fleet" },
        { label: "Back to menu", next: "welcome" }
      ]
    },
    requirements: {
      text: "To rent with us, you need: 1. To be at least 25 years old. 2. A valid driver's license (held for at least 2 years). 3. A credit card in your name for the security deposit.",
      options: [
        { label: "Do you accept international licenses?", next: "intl_license" },
        { label: "Back to menu", next: "welcome" }
      ]
    },
    intl_license: {
      text: "Yes, we accept international driver's permits along with your original domestic license and passport.",
      options: [
        { label: "Back to menu", next: "welcome" }
      ]
    },
    services: {
      text: "We offer VIP Airport Handover, Flexible Schedules, and Pristine Condition vehicles. Which service would you like to know more about?",
      options: [
        { label: "Airport Handover", next: "airport" },
        { label: "Chauffeur Service", next: "chauffeur" },
        { label: "Back to menu", next: "welcome" }
      ]
    },
    airport: {
      text: "Our VIP Airport Handover means we meet you directly at the terminal with your vehicle. No queues, no waiting.",
      options: [
        { label: "Back to menu", next: "welcome" }
      ]
    },
    chauffeur: {
      text: "We provide professional, discreet chauffeur services for our most exclusive models. Perfect for business trips or special events.",
      options: [
        { label: "Back to menu", next: "welcome" }
      ]
    },
    contact: {
      text: "You can reach us at +212 5 20 34 56 78 or email contact@autolux.ma. Our office is open Mon-Sat, 9am-7pm.",
      options: [
        { label: "Go to Contact page", action: "redirect_contact" },
        { label: "Back to menu", next: "welcome" }
      ]
    }
  },
  fr: {
    welcome: {
      text: "Bienvenue à la Conciergerie Autolux. Comment puis-je vous assister ?",
      options: [
        { label: "Réserver un véhicule", next: "book_car" },
        { label: "Conditions de location", next: "requirements" },
        { label: "Nos services", next: "services" },
        { label: "Contacter le support", next: "contact" }
      ]
    },
    book_car: {
      text: "Excellent choix. Notre flotte comprend les meilleurs véhicules. Vous pouvez réserver directement sur notre page Flotte.",
      options: [
        { label: "Voir la Flotte", action: "redirect_fleet" },
        { label: "Retour au menu", next: "welcome" }
      ]
    },
    requirements: {
      text: "Pour louer chez nous, il faut : 1. Avoir au moins 25 ans. 2. Un permis de conduire valide (depuis au moins 2 ans). 3. Une carte de crédit à votre nom pour la caution.",
      options: [
        { label: "Acceptez-vous les permis internationaux ?", next: "intl_license" },
        { label: "Retour au menu", next: "welcome" }
      ]
    },
    intl_license: {
      text: "Oui, nous acceptons les permis internationaux accompagnés de votre permis original et de votre passeport.",
      options: [
        { label: "Retour au menu", next: "welcome" }
      ]
    },
    services: {
      text: "Nous proposons la remise VIP à l'aéroport, des horaires flexibles et des véhicules dans un état irréprochable.",
      options: [
        { label: "Remise à l'aéroport", next: "airport" },
        { label: "Service Chauffeur", next: "chauffeur" },
        { label: "Retour au menu", next: "welcome" }
      ]
    },
    airport: {
      text: "Notre remise VIP à l'aéroport signifie que nous vous accueillons directement au terminal avec votre véhicule.",
      options: [
        { label: "Retour au menu", next: "welcome" }
      ]
    },
    chauffeur: {
      text: "Nous proposons des services de chauffeur professionnels et discrets pour nos modèles les plus exclusifs.",
      options: [
        { label: "Retour au menu", next: "welcome" }
      ]
    },
    contact: {
      text: "Vous pouvez nous joindre au +212 5 20 34 56 78 ou par email à contact@autolux.ma.",
      options: [
        { label: "Aller à la page Contact", action: "redirect_contact" },
        { label: "Retour au menu", next: "welcome" }
      ]
    }
  },
  it: {
    welcome: {
      text: "Benvenuti alla Conciergerie Autolux. Come posso assisterla oggi?",
      options: [
        { label: "Prenota un'auto", next: "book_car" },
        { label: "Requisiti di noleggio", next: "requirements" },
        { label: "I nostri servizi", next: "services" },
        { label: "Contatta il supporto", next: "contact" }
      ]
    },
    book_car: {
      text: "Ottima scelta. Puoi prenotare direttamente dalla nostra pagina Flotta.",
      options: [
        { label: "Vai alla Flotta", action: "redirect_fleet" },
        { label: "Torna al menu", next: "welcome" }
      ]
    },
    requirements: {
      text: "Per noleggiare è necessario: 1. Avere almeno 25 anni. 2. Patente di guida valida. 3. Carta di credito a proprio nome.",
      options: [
        { label: "Accettate patenti internazionali?", next: "intl_license" },
        { label: "Torna al menu", next: "welcome" }
      ]
    },
    intl_license: {
      text: "Sì, accettiamo permessi di guida internazionali insieme alla patente originale e al passaporto.",
      options: [
        { label: "Torna al menu", next: "welcome" }
      ]
    },
    services: {
      text: "Offriamo consegna VIP in aeroporto, orari flessibili e veicoli in condizioni impeccabili.",
      options: [
        { label: "Consegna in Aeroporto", next: "airport" },
        { label: "Servizio Autista", next: "chauffeur" },
        { label: "Torna al menu", next: "welcome" }
      ]
    },
    airport: {
      text: "Ti accogliamo direttamente al terminal con il tuo veicolo pronto. Nessuna attesa.",
      options: [
        { label: "Torna al menu", next: "welcome" }
      ]
    },
    chauffeur: {
      text: "Forniamo servizi di autista professionali e discreti per i nostri modelli più esclusivi.",
      options: [
        { label: "Torna al menu", next: "welcome" }
      ]
    },
    contact: {
      text: "Puoi contattarci al +212 5 20 34 56 78 o email contact@autolux.ma.",
      options: [
        { label: "Vai alla pagina Contatti", action: "redirect_contact" },
        { label: "Torna al menu", next: "welcome" }
      ]
    }
  },
  pt: {
    welcome: {
      text: "Bem-vindo ao Concierge Autolux. Como posso ajudar hoje?",
      options: [
        { label: "Alugar um carro", next: "book_car" },
        { label: "Requisitos de aluguel", next: "requirements" },
        { label: "Nossos serviços", next: "services" },
        { label: "Contatar suporte", next: "contact" }
      ]
    },
    book_car: {
      text: "Excelente escolha. Nossa frota conta com os melhores veículos. Você pode reservar diretamente da nossa página de Frota.",
      options: [
        { label: "Ir para Frota", action: "redirect_fleet" },
        { label: "Voltar ao menu", next: "welcome" }
      ]
    },
    requirements: {
      text: "Para alugar conosco, você precisa: 1. Ter pelo menos 25 anos. 2. Carteira de motorista válida. 3. Cartão de crédito em seu nome.",
      options: [
        { label: "Aceitam licença internacional?", next: "intl_license" },
        { label: "Voltar ao menu", next: "welcome" }
      ]
    },
    intl_license: {
      text: "Sim, aceitamos carteira internacional de habilitação junto com sua habilitação original e passaporte.",
      options: [
        { label: "Voltar ao menu", next: "welcome" }
      ]
    },
    services: {
      text: "Oferecemos entrega VIP no aeroporto, horários flexíveis e veículos em condição impecável.",
      options: [
        { label: "Entrega Aeroporto", next: "airport" },
        { label: "Serviço de Motorista", next: "chauffeur" },
        { label: "Voltar ao menu", next: "welcome" }
      ]
    },
    airport: {
      text: "Encontramos você diretamente no terminal com seu veículo.",
      options: [
        { label: "Voltar ao menu", next: "welcome" }
      ]
    },
    chauffeur: {
      text: "Oferecemos serviços de motorista profissionais para nossos modelos mais exclusivos.",
      options: [
        { label: "Voltar ao menu", next: "welcome" }
      ]
    },
    contact: {
      text: "Fale conosco pelo +212 5 20 34 56 78 ou contact@autolux.ma.",
      options: [
        { label: "Página de Contato", action: "redirect_contact" },
        { label: "Voltar ao menu", next: "welcome" }
      ]
    }
  }
};

export function initChatbot() {
  // Check if chatbot is already injected
  if (document.getElementById("autolux-chatbot-widget")) return;

  // Create Chatbot HTML Structure
  const chatbotHTML = `
    <div id="autolux-chatbot-widget" class="chatbot-widget">
      <!-- Chat Window -->
      <div id="chatbot-window" class="chatbot-window hidden">
        <div class="chatbot-header">
          <div class="chatbot-header-info">
            <img src="./public/assets/images/icon_real.png" alt="Autolux" class="chatbot-avatar" onerror="this.src='/assets/images/icon_real.png'"/>
            <div>
              <h3 class="chatbot-title">Autolux Concierge</h3>
              <span class="chatbot-status">Online</span>
            </div>
          </div>
          <button id="chatbot-close" class="chatbot-close-btn"><i class="fas fa-times"></i></button>
        </div>
        
        <div id="chatbot-messages" class="chatbot-messages">
          <!-- Messages will be injected here -->
        </div>
      </div>
      
      <!-- Floating Button -->
      <button id="chatbot-toggle" class="chatbot-toggle-btn btn-glow">
        <i class="fas fa-comment-dots text-2xl"></i>
      </button>
    </div>
  `;

  // Inject into body
  document.body.insertAdjacentHTML('beforeend', chatbotHTML);

  // DOM Elements
  const toggleBtn = document.getElementById("chatbot-toggle");
  const closeBtn = document.getElementById("chatbot-close");
  const chatWindow = document.getElementById("chatbot-window");
  const messagesContainer = document.getElementById("chatbot-messages");

  // State
  let isOpen = false;

  // Event Listeners for UI
  toggleBtn.addEventListener("click", () => {
    isOpen = !isOpen;
    toggleChatWindow();
  });

  closeBtn.addEventListener("click", () => {
    isOpen = false;
    toggleChatWindow();
  });

  function toggleChatWindow() {
    if (isOpen) {
      chatWindow.classList.remove("hidden");
      chatWindow.classList.add("flex");
      toggleBtn.classList.add("hidden"); // Hide toggle button when open
      if (messagesContainer.innerHTML.trim() === "") {
        renderNode("welcome"); // Initialize conversation
      }
    } else {
      chatWindow.classList.add("hidden");
      chatWindow.classList.remove("flex");
      toggleBtn.classList.remove("hidden"); // Show toggle button when closed
    }
  }

  // Render a conversation node
  function renderNode(nodeId) {
    const lang = localStorage.getItem("language") || "fr";
    // Fallback to English if language not supported in chatbot
    const activeData = chatbotData[lang] || chatbotData["en"];
    const node = activeData[nodeId];

    if (!node) return;

    // 1. Add Chatbot Message
    const msgDiv = document.createElement("div");
    msgDiv.className = "chat-message bot-message reveal active";
    msgDiv.innerHTML = `<p>${node.text}</p>`;
    messagesContainer.appendChild(msgDiv);

    // 2. Add Options Container
    const optionsDiv = document.createElement("div");
    optionsDiv.className = "chat-options reveal active";
    
    node.options.forEach(opt => {
      const btn = document.createElement("button");
      btn.className = "chat-option-btn";
      btn.textContent = opt.label;
      btn.addEventListener("click", () => handleOptionClick(opt));
      optionsDiv.appendChild(btn);
    });

    messagesContainer.appendChild(optionsDiv);
    
    // Auto-scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Handle User Option Click
  function handleOptionClick(option) {
    // Remove previous options visually to show progression
    const allOptions = messagesContainer.querySelectorAll(".chat-options");
    if (allOptions.length > 0) {
      allOptions[allOptions.length - 1].style.display = 'none';
    }

    // Add User Message
    const userMsgDiv = document.createElement("div");
    userMsgDiv.className = "chat-message user-message reveal active";
    userMsgDiv.innerHTML = `<p>${option.label}</p>`;
    messagesContainer.appendChild(userMsgDiv);

    // Handle Actions or Next State
    setTimeout(() => {
      if (option.action === "redirect_fleet") {
        window.location.href = "cars.html";
      } else if (option.action === "redirect_contact") {
        window.location.href = "contact.html";
      } else if (option.next) {
        renderNode(option.next);
      }
    }, 400); // slight delay for natural feel
  }

  // Listen to language changes from the rest of the app to re-render language dynamically if open
  window.addEventListener("storage", (e) => {
    if (e.key === "language") {
       // Reset chat if language changes
       messagesContainer.innerHTML = "";
       if (isOpen) renderNode("welcome");
    }
  });

  // Export a function that other scripts can call when language changes (since localstorage events don't fire in the same tab)
  window.updateChatbotLanguage = function() {
    messagesContainer.innerHTML = "";
    if (isOpen) renderNode("welcome");
  }
}
