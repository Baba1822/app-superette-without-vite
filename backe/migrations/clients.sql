CREATE TABLE IF NOT EXISTS clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telephone VARCHAR(20),
    date_naissance DATE,
    genre ENUM('homme', 'femme', 'autre'),
    adresse VARCHAR(255),
    ville VARCHAR(100),
    pays VARCHAR(100),
    code_postal VARCHAR(20),
    type_client ENUM('particulier', 'professionnel') DEFAULT 'particulier',
    status ENUM('actif', 'inactif', 'suspendu') DEFAULT 'actif',
    date_inscription DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
