-- Migration pour renommer la colonne mot_de_passe en motdepasse
ALTER TABLE utilisateurs CHANGE mot_de_passe motdepasse VARCHAR(255) NOT NULL;
