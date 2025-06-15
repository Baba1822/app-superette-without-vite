-- Migration pour mettre à jour la structure de la table clients

-- Ajouter les nouveaux champs si ils n'existent pas déjà
ALTER TABLE clients
    ADD COLUMN IF NOT EXISTS password VARCHAR(255) NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS first_name VARCHAR(255) DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS last_name VARCHAR(255) DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS phone VARCHAR(20) DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS address TEXT DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS role ENUM('client', 'admin', 'cashier', 'stockist', 'manager') DEFAULT 'client',
    ADD COLUMN IF NOT EXISTS status ENUM('active', 'inactive', 'blocked') DEFAULT 'active',
    ADD COLUMN IF NOT EXISTS refresh_token VARCHAR(255) DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Créer les index s'ils n'existent pas déjà
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_role ON clients(role);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
