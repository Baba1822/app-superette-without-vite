export interface Product {
  id?: number;
  name: string;
  category: number;
  price: number;
  prixPromo?: number;
  quantity: number;
  alertThreshold: number;
  description?: string;
  image?: string;
  datePeremption?: Date;
  uniteMesure: string;

  // Champs pour le backend
  nom?: string;
  categorie_id?: number;
  prix?: number;
  prix_promo?: number;
  stock?: number;
  stock_min?: number;
  image_url?: string;
  date_peremption?: Date;
  unite_mesure?: string;
}
