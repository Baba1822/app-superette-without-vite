import { Box, Slider, Typography } from '@mui/material';
import React from 'react';

function PriceRangeFilter({ priceRange, onPriceChange, minPrice, maxPrice }) {
  const handleChange = (event, newValue) => {
    onPriceChange(newValue);
  };

  return (
    <Box sx={{ width: '100%', px: 2, mb: 3 }}>
      <Typography gutterBottom>Fourchette de prix</Typography>
      <Slider
        value={priceRange}
        onChange={handleChange}
        valueLabelDisplay="auto"
        min={minPrice}
        max={maxPrice}
        marks={[
          { value: minPrice, label: `${minPrice}€` },
          { value: maxPrice, label: `${maxPrice}€` }
        ]}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
        <Typography variant="body2">
          Min: {priceRange[0]}€
        </Typography>
        <Typography variant="body2">
          Max: {priceRange[1]}€
        </Typography>
      </Box>
    </Box>
  );
}

export default PriceRangeFilter; 