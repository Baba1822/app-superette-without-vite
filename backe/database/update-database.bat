@echo off
echo Updating database schema...
mysql -u root -p baba -e "ALTER TABLE utilisateurs ADD COLUMN IF NOT EXISTS refresh_token VARCHAR(255) NULL;"
mysql -u root -p baba -e "ALTER TABLE categories_produits ADD COLUMN IF NOT EXISTS image VARCHAR(255) NULL;"
mysql -u root -p baba -e "UPDATE categories_produits SET image = 'default-category.jpg' WHERE image IS NULL;"
echo Database schema updated successfully.
