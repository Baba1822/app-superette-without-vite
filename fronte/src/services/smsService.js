const sendCredentialsSMS = async (phone, username, password) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/send-sms`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                to: phone,
                body: `Bonjour,\n\nVoici vos identifiants de connexion :\nNom d'utilisateur : ${username}\nMot de passe : ${password}\n\nVeuillez changer votre mot de passe après connexion.\n\nCordialement,\nL'équipe de la supérette.`
            })
        });

        if (!response.ok) {
            throw new Error(`Erreur lors de l'envoi du SMS. Statut: ${response.status}`);
        }

        const result = await response.json();
        return true; // SMS envoyé avec succès
    } catch (error) {
        console.error('Erreur lors de l\'envoi du SMS', error);
        return false; // Échec de l'envoi
    }
};

export { sendCredentialsSMS };
