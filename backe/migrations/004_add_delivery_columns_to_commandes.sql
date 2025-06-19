-- backe/migrations/004_add_delivery_columns_to_commandes.sql

-- Modifier la table commandes pour rendre employe_id NULLABLE
ALTER TABLE commandes
MODIFY COLUMN employe_id INT NULL;

-- Ajouter les nouvelles colonnes liées à la livraison, seulement si elles n'existent pas
ALTER TABLE commandes
ADD COLUMN IF NOT EXISTS delivery_address VARCHAR(255) NULL,
ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10,2) NULL,
ADD COLUMN IF NOT EXISTS note TEXT NULL,
ADD COLUMN IF NOT EXISTS delivery_quarter VARCHAR(100) NULL,
ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20) NULL; 