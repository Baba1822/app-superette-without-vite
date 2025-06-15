-- Migration pour mettre à jour la structure de la table clients

-- Supprimer la table existante si elle existe
DROP TABLE IF EXISTS clients;

-- Créer la nouvelle table clients
CREATE TABLE clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    role ENUM('client', 'admin', 'cashier', 'stockist', 'manager') DEFAULT 'client',
    status ENUM('active', 'inactive', 'blocked') DEFAULT 'active',
    refresh_token VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Créer les index
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_role ON clients(role);
CREATE INDEX idx_clients_status ON clients(status);
