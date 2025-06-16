-- Vérifier si la colonne refresh_token existe déjà
SELECT COUNT(*) as count FROM information_schema.columns 
WHERE table_schema = DATABASE() AND table_name = 'utilisateurs' AND column_name = 'refresh_token';

-- Si la colonne n'existe pas, l'ajouter
SET @query = IF(
    (SELECT COUNT(*) as count FROM information_schema.columns 
     WHERE table_schema = DATABASE() AND table_name = 'utilisateurs' AND column_name = 'refresh_token') = 0,
    'ALTER TABLE utilisateurs ADD COLUMN refresh_token VARCHAR(255) NULL',
    'SELECT 1'
);
PREPARE stmt FROM @query;
EXECUTE stmt;

-- Vérifier si la colonne image existe déjà dans categories_produits
SELECT COUNT(*) as count FROM information_schema.columns 
WHERE table_schema = DATABASE() AND table_name = 'categories_produits' AND column_name = 'image';

-- Si la colonne n'existe pas, l'ajouter
SET @query = IF(
    (SELECT COUNT(*) as count FROM information_schema.columns 
     WHERE table_schema = DATABASE() AND table_name = 'categories_produits' AND column_name = 'image') = 0,
    'ALTER TABLE categories_produits ADD COLUMN image VARCHAR(255) NULL',
    'SELECT 1'
);
PREPARE stmt FROM @query;
EXECUTE stmt;

-- Mettre à jour les catégories existantes avec des images par défaut
UPDATE categories_produits SET image = 'default-category.jpg' WHERE image IS NULL;

-- Vérifier si la table images existe déjà
SELECT COUNT(*) as count FROM information_schema.tables 
WHERE table_schema = DATABASE() AND table_name = 'images';

-- Si la table n'existe pas, la créer
SET @query = IF(
    (SELECT COUNT(*) as count FROM information_schema.tables 
     WHERE table_schema = DATABASE() AND table_name = 'images') = 0,
    'CREATE TABLE images (
        id INT PRIMARY KEY AUTO_INCREMENT,
        produit_id INT NOT NULL,
        chemin VARCHAR(255) NOT NULL,
        type ENUM('principale', 'secondaire') DEFAULT 'secondaire',
        ordre INT DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci',
    'SELECT 1'
);
PREPARE stmt FROM @query;
EXECUTE stmt;

-- Vérifier si l'index existe déjà
SELECT COUNT(*) as count FROM information_schema.statistics 
WHERE table_schema = DATABASE() AND table_name = 'images' AND index_name = 'idx_produit_id';

-- Si l'index n'existe pas, le créer
SET @query = IF(
    (SELECT COUNT(*) as count FROM information_schema.statistics 
     WHERE table_schema = DATABASE() AND table_name = 'images' AND index_name = 'idx_produit_id') = 0,
    'CREATE INDEX idx_produit_id ON images(produit_id)',
    'SELECT 1'
);
PREPARE stmt FROM @query;
EXECUTE stmt;

-- Nettoyer la préparation
DEALLOCATE PREPARE stmt;
