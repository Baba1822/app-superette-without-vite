-- Ajout des champs pour les saisons et les promotions
ALTER TABLE produits
ADD COLUMN IF NOT EXISTS saison BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS date_debut_saison DATE NULL,
ADD COLUMN IF NOT EXISTS date_fin_saison DATE NULL,
ADD COLUMN IF NOT EXISTS promotion BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS type_promotion ENUM('percentage', 'fixed') NULL,
ADD COLUMN IF NOT EXISTS valeur_promotion DECIMAL(10,2) NULL,
ADD COLUMN IF NOT EXISTS date_debut_promo DATE NULL,
ADD COLUMN IF NOT EXISTS date_fin_promo DATE NULL,
ADD COLUMN IF NOT EXISTS image VARCHAR(255) NULL,
ADD COLUMN IF NOT EXISTS date_peremption DATE NULL;
 

-- Ajout des contraintes
ALTER TABLE produits
ADD CONSTRAINT IF NOT EXISTS chk_type_promotion CHECK (type_promotion IN ('percentage', 'fixed'));
