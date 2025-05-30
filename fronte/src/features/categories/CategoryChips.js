import { Box, Chip } from '@mui/material';
import React from 'react';

function CategoryChips({ selected, onSelect, categories }) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {categories.map((category) => (
        <Chip
          key={category}
          label={category}
          onClick={() => onSelect(category)}
          color={selected === category ? 'primary' : 'default'}
          variant={selected === category ? 'filled' : 'outlined'}
          sx={{ m: 0.5 }}
        />
      ))}
    </Box>
  );
}

export default CategoryChips;
