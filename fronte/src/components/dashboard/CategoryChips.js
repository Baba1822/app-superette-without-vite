import React from 'react';
import { 
  Chip,
  Stack,
  Typography,
  Box
} from '@mui/material';

const categories = [
  'Alimentaire',
  'Boissons',
  'Hygiène',
  'Ménage',
  'Autres'
];

function CategoryChips({ onCategorySelect }) {
  const [selected, setSelected] = React.useState('Alimentaire');

  const handleClick = (category) => {
    setSelected(category);
    if (onCategorySelect) onCategorySelect(category);
  };

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Filtrer par catégorie:
      </Typography>
      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
        {categories.map((category) => (
          <Chip
            key={category}
            label={category}
            clickable
            color={selected === category ? 'primary' : 'default'}
            onClick={() => handleClick(category)}
            sx={{ mb: 1 }}
          />
        ))}
      </Stack>
    </Box>
  );
}

export default CategoryChips;