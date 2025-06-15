-- Ajouter la colonne image à la table categories_produits
ALTER TABLE categories_produits ADD COLUMN IF NOT EXISTS image VARCHAR(255) NULL;

-- Mettre à jour les catégories existantes avec des images par défaut
UPDATE categories_produits SET image = 'default-category.jpg' WHERE image IS NULL;
