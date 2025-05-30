class VoiceAssistantService {
    constructor() {
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.isListening = false;
        this.commands = new Map();
        this.setupSpeechRecognition();
    }

    setupSpeechRecognition() {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new window.webkitSpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = 'fr-FR';

            this.recognition.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(result => result[0].transcript.toLowerCase())
                    .join('');

                if (event.results[0].isFinal) {
                    this.processCommand(transcript);
                }
            };

            this.recognition.onerror = (event) => {
                console.error('Erreur de reconnaissance vocale:', event.error);
                this.isListening = false;
            };
        }
    }

    registerCommands(commands) {
        commands.forEach(({ command, action, description }) => {
            this.commands.set(command.toLowerCase(), { action, description });
        });
    }

    processCommand(transcript) {
        for (const [command, { action }] of this.commands) {
            if (transcript.includes(command)) {
                action(transcript);
                break;
            }
        }
    }

    startListening() {
        if (this.recognition && !this.isListening) {
            this.recognition.start();
            this.isListening = true;
            this.speak('Assistant vocal activé');
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this.isListening = false;
            this.speak('Assistant vocal désactivé');
        }
    }

    toggleListening() {
        if (this.isListening) {
            this.stopListening();
        } else {
            this.startListening();
        }
    }

    speak(text) {
        if (this.synthesis) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'fr-FR';
            this.synthesis.speak(utterance);
        }
    }

    getAvailableCommands() {
        return Array.from(this.commands.entries()).map(([command, { description }]) => ({
            command,
            description
        }));
    }

    // Commandes spécifiques pour la gestion des livraisons
    setupDeliveryCommands(navigationCallback, searchCallback, statusUpdateCallback) {
        const deliveryCommands = [
            {
                command: 'nouvelle livraison',
                action: () => navigationCallback('/deliveries/new'),
                description: 'Créer une nouvelle livraison'
            },
            {
                command: 'rechercher livraison',
                action: (transcript) => {
                    const query = transcript.split('rechercher livraison')[1].trim();
                    if (query) {
                        searchCallback(query);
                    } else {
                        this.speak('Veuillez spécifier les critères de recherche');
                    }
                },
                description: 'Rechercher une livraison'
            },
            {
                command: 'mettre à jour statut',
                action: (transcript) => {
                    const parts = transcript.split('mettre à jour statut')[1].trim().split('à');
                    if (parts.length === 2) {
                        const [deliveryId, status] = parts.map(p => p.trim());
                        statusUpdateCallback(deliveryId, status);
                    } else {
                        this.speak('Format incorrect. Exemple: mettre à jour statut 123 à en cours');
                    }
                },
                description: 'Mettre à jour le statut d\'une livraison'
            },
            {
                command: 'afficher statistiques',
                action: () => navigationCallback('/deliveries/stats'),
                description: 'Afficher les statistiques de livraison'
            }
        ];

        this.registerCommands(deliveryCommands);
    }

    // Commandes spécifiques pour la gestion des stocks
    setupInventoryCommands(navigationCallback, searchCallback, alertCallback) {
        const inventoryCommands = [
            {
                command: 'vérifier stock',
                action: (transcript) => {
                    const product = transcript.split('vérifier stock')[1].trim();
                    if (product) {
                        searchCallback(product);
                    } else {
                        this.speak('Veuillez spécifier le produit');
                    }
                },
                description: 'Vérifier le stock d\'un produit'
            },
            {
                command: 'alertes stock',
                action: () => alertCallback(),
                description: 'Afficher les alertes de stock bas'
            }
        ];

        this.registerCommands(inventoryCommands);
    }

    // Commandes spécifiques pour la gestion des paiements
    setupPaymentCommands(navigationCallback, processPaymentCallback) {
        const paymentCommands = [
            {
                command: 'nouveau paiement',
                action: () => navigationCallback('/payments/new'),
                description: 'Créer un nouveau paiement'
            },
            {
                command: 'traiter paiement',
                action: (transcript) => {
                    const amount = transcript.split('traiter paiement')[1].trim();
                    if (amount) {
                        processPaymentCallback(amount);
                    } else {
                        this.speak('Veuillez spécifier le montant');
                    }
                },
                description: 'Traiter un paiement'
            }
        ];

        this.registerCommands(paymentCommands);
    }
}

export default new VoiceAssistantService(); 