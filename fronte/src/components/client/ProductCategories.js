import React from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const categories = [
  { id: 'all', label: 'Tous les produits' },
  { id: 'fruits', label: 'Fruits & Légumes' },
  { id: 'boissons', label: 'Boissons' },
  { id: 'epicerie', label: 'Epicerie' },
  { id: 'hygiene', label: 'Hygiène & Beauté' },
  { id: 'frais', label: 'Produits Frais' },
];

const ProductCategories = () => {
  const navigate = useNavigate();
  const [value, setValue] = React.useState('all');

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(`/category/${newValue}`);
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        sx={{
          '& .MuiTabs-flexContainer': {
            justifyContent: 'center',
          },
        }}
      >
        {categories.map((category) => (
          <Tab key={category.id} value={category.id} label={category.label} />
        ))}
      </Tabs>
    </Box>
  );
};

export default ProductCategories;
