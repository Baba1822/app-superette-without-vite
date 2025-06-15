$sqlFile = "c:\Users\user\Documents\DS\backe\database\update_schema.sql"

# Lire le contenu du fichier SQL
$sqlContent = Get-Content $sqlFile -Raw

# Exécuter les commandes SQL
mysql -u root -p baba -e "$sqlContent"
