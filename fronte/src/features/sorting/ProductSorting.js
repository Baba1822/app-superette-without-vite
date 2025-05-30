import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React from 'react';

function ProductSorting({ sortBy, onSortChange }) {
  return (
    <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
      <InputLabel>Trier par</InputLabel>
      <Select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        label="Trier par"
      >
        <MenuItem value="default">Par défaut</MenuItem>
        <MenuItem value="price-asc">Prix croissant</MenuItem>
        <MenuItem value="price-desc">Prix décroissant</MenuItem>
        <MenuItem value="name-asc">Nom A-Z</MenuItem>
        <MenuItem value="name-desc">Nom Z-A</MenuItem>
        <MenuItem value="stock-desc">Stock disponible</MenuItem>
      </Select>
    </FormControl>
  );
}

export default ProductSorting; 