-- Ajout des champs pour les saisons et les promotions
ALTER TABLE produits
ADD COLUMN saison BOOLEAN DEFAULT FALSE,
ADD COLUMN date_debut_saison DATE NULL,
ADD COLUMN date_fin_saison DATE NULL,
ADD COLUMN promotion BOOLEAN DEFAULT FALSE,
ADD COLUMN type_promotion ENUM('percentage', 'fixed') NULL,
ADD COLUMN valeur_promotion DECIMAL(10,2) NULL,
ADD COLUMN date_debut_promo DATE NULL,
ADD COLUMN date_fin_promo DATE NULL,
ADD COLUMN image VARCHAR(255) NULL,
ADD COLUMN date_peremption DATE NULL;
 

-- Ajout des contraintes
ALTER TABLE produits
ADD CONSTRAINT chk_type_promotion CHECK (type_promotion IN ('percentage', 'fixed'));

-- Mise à jour des colonnes existantes
ALTER TABLE produits
CHANGE COLUMN stock_actuel stock INT NOT NULL DEFAULT 0,
CHANGE COLUMN alertThreshold stock_min INT NOT NULL DEFAULT 0;

-- Ajout d'index pour les recherches
CREATE INDEX idx_product_season ON produits(isSeasonal, seasonStart, seasonEnd);
CREATE INDEX idx_product_promo ON produits(hasPromotion, promotionStart, promotionEnd);
CREATE INDEX idx_product_stock ON produits(stock, stock_min);
