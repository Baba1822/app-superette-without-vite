-- Création de la base de données
CREATE DATABASE IF NOT EXISTS baba;
USE baba;

-- Table des utilisateurs (employés, clients, administrateurs)
CREATE TABLE IF NOT EXISTS utilisateurs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type ENUM('admin', 'employe', 'client') NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    statut ENUM('actif', 'inactif', 'en_attente') DEFAULT 'actif',
    date_inscription DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_derniere_connexion DATETIME,
    poste VARCHAR(50) NULL,
    adresse VARCHAR(255) NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des catégories de dépenses
CREATE TABLE IF NOT EXISTS categories_depenses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    description TEXT,
    statut ENUM('actif', 'inactif') DEFAULT 'actif',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des catégories de produits
CREATE TABLE IF NOT EXISTS categories_produits (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    description TEXT,
    parent_id INT NULL,
    statut ENUM('actif', 'inactif') DEFAULT 'actif',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories_produits(id)
);

-- Table des produits
CREATE TABLE IF NOT EXISTS produits (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    description TEXT,
    prix DECIMAL(10,2) NOT NULL,
    prix_promo DECIMAL(10,2) NULL,
    categorie_id INT NOT NULL,
    stock_min INT NOT NULL DEFAULT 0,
    stock_actuel INT NOT NULL DEFAULT 0,
    unite_mesure ENUM('kg', 'g', 'L', 'ml', 'unité') NOT NULL,
    date_peremption DATE NULL,
    image_url VARCHAR(255),
    statut ENUM('actif', 'inactif') DEFAULT 'actif',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categorie_id) REFERENCES categories_produits(id)
);

-- Table des fournisseurs
CREATE TABLE IF NOT EXISTS fournisseurs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    telephone VARCHAR(20) NOT NULL,
    adresse VARCHAR(255),
    type_fournisseur ENUM('local', 'national', 'international') NOT NULL,
    statut ENUM('actif', 'inactif', 'en_attente') DEFAULT 'actif',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des commandes
CREATE TABLE IF NOT EXISTS commandes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_id INT NOT NULL,
    employe_id INT NOT NULL,
    montant_total DECIMAL(10,2) NOT NULL,
    methode_paiement ENUM('cash', 'mobile_money', 'carte', 'espece') NOT NULL,
    statut ENUM('en_attente', 'en_cours', 'terminee', 'annulee') DEFAULT 'en_attente',
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_mise_a_jour DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES utilisateurs(id),
    FOREIGN KEY (employe_id) REFERENCES utilisateurs(id)
);

-- Table des détails de commande
CREATE TABLE IF NOT EXISTS details_commande (
    id INT PRIMARY KEY AUTO_INCREMENT,
    commande_id INT NOT NULL,
    produit_id INT NOT NULL,
    quantite INT NOT NULL,
    prix_unitaire DECIMAL(10,2) NOT NULL,
    montant_total DECIMAL(10,2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (commande_id) REFERENCES commandes(id),
    FOREIGN KEY (produit_id) REFERENCES produits(id)
);

-- Table des livraisons
CREATE TABLE IF NOT EXISTS livraisons (
    id INT PRIMARY KEY AUTO_INCREMENT,
    commande_id INT NOT NULL,
    client_id INT NOT NULL,
    employe_id INT NOT NULL,
    adresse_livraison VARCHAR(255) NOT NULL,
    statut ENUM('en_attente', 'en_cours', 'terminee', 'annulee') DEFAULT 'en_attente',
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_livraison DATETIME,
    frais_livraison DECIMAL(10,2) NOT NULL,
    note TEXT,
    FOREIGN KEY (commande_id) REFERENCES commandes(id),
    FOREIGN KEY (client_id) REFERENCES utilisateurs(id),
    FOREIGN KEY (employe_id) REFERENCES utilisateurs(id)
);

-- Table des mouvements de stock
CREATE TABLE IF NOT EXISTS mouvements_stock (
    id INT PRIMARY KEY AUTO_INCREMENT,
    produit_id INT NOT NULL,
    quantite INT NOT NULL,
    type_mouvement ENUM('entree', 'sortie') NOT NULL,
    motif VARCHAR(255),
    utilisateur_id INT NOT NULL,
    date_mouvement DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (produit_id) REFERENCES produits(id),
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id)
);

-- Table des dépenses
CREATE TABLE IF NOT EXISTS depenses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type ENUM('approvisionnement', 'maintenance', 'salaires', 'autre') NOT NULL,
    description TEXT NOT NULL,
    montant DECIMAL(10,2) NOT NULL,
    date_depense DATE NOT NULL,
    categorie_id INT NULL,
    reference VARCHAR(100),
    utilisateur_id INT NOT NULL,
    statut ENUM('en_attente', 'approuve', 'rejete') DEFAULT 'en_attente',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categorie_id) REFERENCES categories_depenses(id),
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id)
);

-- Table des promotions
CREATE TABLE IF NOT EXISTS promotions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    description TEXT,
    type ENUM('pourcentage', 'montant_fixe', 'buy_get_free') NOT NULL,
    valeur DECIMAL(10,2) NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    produit_id INT NULL,
    categorie_id INT NULL,
    minimum_achat DECIMAL(10,2) NULL,
    statut ENUM('actif', 'inactif') DEFAULT 'actif',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (produit_id) REFERENCES produits(id),
    FOREIGN KEY (categorie_id) REFERENCES categories_produits(id)
);

-- Table des cartes de fidélité
CREATE TABLE IF NOT EXISTS cartes_fidelite (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_id INT NOT NULL,
    points INT NOT NULL DEFAULT 0,
    niveau ENUM('bronze', 'silver', 'gold', 'platinum') DEFAULT 'bronze',
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES utilisateurs(id)
);

-- Table des récompenses
CREATE TABLE IF NOT EXISTS recompenses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    description TEXT,
    points_requis INT NOT NULL,
    type_recompense ENUM('remise', 'produit_gratuit', 'livraison_gratuite') NOT NULL,
    statut ENUM('actif', 'inactif') DEFAULT 'actif',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table de l'historique des récompenses
CREATE TABLE IF NOT EXISTS historique_recompenses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_id INT NOT NULL,
    recompense_id INT NOT NULL,
    date_recompense DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES utilisateurs(id),
    FOREIGN KEY (recompense_id) REFERENCES recompenses(id)
);

-- Table des avis produits
CREATE TABLE IF NOT EXISTS avis_produits (
    id INT PRIMARY KEY AUTO_INCREMENT,
    produit_id INT NOT NULL,
    client_id INT NOT NULL,
    note INT NOT NULL CHECK (note BETWEEN 1 AND 5),
    commentaire TEXT,
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (produit_id) REFERENCES produits(id),
    FOREIGN KEY (client_id) REFERENCES utilisateurs(id)
);

-- Table des offres saisonnières
CREATE TABLE IF NOT EXISTS offres_saisonniere (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    description TEXT,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    statut ENUM('actif', 'inactif') DEFAULT 'actif',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des produits en offre saisonnière
CREATE TABLE IF NOT EXISTS produits_offre_saisonniere (
    id INT PRIMARY KEY AUTO_INCREMENT,
    offre_id INT NOT NULL,
    produit_id INT NOT NULL,
    prix_special DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (offre_id) REFERENCES offres_saisonniere(id),
    FOREIGN KEY (produit_id) REFERENCES produits(id)
);

-- Table des paiements
CREATE TABLE IF NOT EXISTS paiements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    commande_id INT NOT NULL,
    montant DECIMAL(10,2) NOT NULL,
    methode_paiement ENUM('cash', 'mobile_money', 'carte', 'espece') NOT NULL,
    statut ENUM('en_attente', 'terminee', 'annulee') DEFAULT 'en_attente',
    date_paiement DATETIME DEFAULT CURRENT_TIMESTAMP,
    reference VARCHAR(100),
    FOREIGN KEY (commande_id) REFERENCES commandes(id)
);

-- Table des rapports de stock
CREATE TABLE IF NOT EXISTS rapports_stock (
    id INT PRIMARY KEY AUTO_INCREMENT,
    produit_id INT NOT NULL,
    quantite_initiale INT NOT NULL,
    quantite_actuelle INT NOT NULL,
    date_rapport DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (produit_id) REFERENCES produits(id)
);

-- Table des alertes de stock
CREATE TABLE IF NOT EXISTS alertes_stock (
    id INT PRIMARY KEY AUTO_INCREMENT,
    produit_id INT NOT NULL,
    seuil INT NOT NULL,
    message TEXT NOT NULL,
    statut ENUM('active', 'resou') DEFAULT 'active',
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_resolution DATETIME NULL,
    FOREIGN KEY (produit_id) REFERENCES produits(id)
);
