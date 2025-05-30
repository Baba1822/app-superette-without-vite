import React from 'react';
import {
  Box,
  Chip,
  Typography,
  Stack,
  useTheme
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import queryString from 'query-string';

const categories = [
  { id: 'all', label: 'Tous' },
  { id: 'alimentaire', label: 'Alimentaire' },
  { id: 'boissons', label: 'Boissons' },
  { id: 'hygiene', label: 'Hygiène' },
  { id: 'menage', label: 'Ménage' },
  { id: 'epicerie', label: 'Épicerie' },
  { id: 'fruits-legumes', label: 'Fruits & Légumes' },
  { id: 'surgeles', label: 'Surgelés' }
];

function CategoryChips() {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = queryString.parse(location.search);
  const [activeCategory, setActiveCategory] = React.useState(queryParams.category || 'all');

  const handleCategoryClick = (categoryId) => {
    const newQueryParams = { ...queryParams, category: categoryId === 'all' ? undefined : categoryId };
    navigate({
      pathname: location.pathname,
      search: queryString.stringify(newQueryParams, { skipNull: true })
    });
    setActiveCategory(categoryId);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
        Catégories :
      </Typography>
      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
        {categories.map((category) => (
          <Chip
            key={category.id}
            label={category.label}
            clickable
            onClick={() => handleCategoryClick(category.id)}
            variant={activeCategory === category.id ? 'filled' : 'outlined'}
            color={activeCategory === category.id ? 'primary' : 'default'}
            sx={{
              borderRadius: 1,
              px: 1,
              fontWeight: activeCategory === category.id ? 600 : 400,
              ...(activeCategory === category.id && {
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary.contrastText
              })
            }}
          />
        ))}
      </Stack>
    </Box>
  );
}

export default CategoryChips;