-- backe/migrations/004_add_delivery_columns_to_commandes.sql

-- Modifier la table commandes pour rendre employe_id NULLABLE
ALTER TABLE commandes
MODIFY COLUMN employe_id INT NULL;

-- Ajouter les nouvelles colonnes liées à la livraison
ALTER TABLE commandes
ADD COLUMN delivery_address VARCHAR(255) NULL,
ADD COLUMN delivery_fee DECIMAL(10,2) NULL,
ADD COLUMN note TEXT NULL,
ADD COLUMN delivery_quarter VARCHAR(100) NULL,
ADD COLUMN phone_number VARCHAR(20) NULL; 