import React from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button,
  CardActions,
  Chip 
} from '@mui/material';
import { useCart } from '../../context/CartContext';

function ProductGrid({ products }) {
  const { addToCart } = useCart();

  return (
    React.createElement(Grid, { container: true, spacing: 3 },
      products.map((product) =>
        React.createElement(Grid, { item: true, xs: 12, sm: 6, md: 4, key: product.id },
          React.createElement(Card, null,
            React.createElement(CardContent, null,
              React.createElement(Typography, { variant: "h6" },
                product.name
              ),
              React.createElement(Chip, { 
                label: product.category,
                size: "small",
                sx: { mt: 1, mb: 2 }
              }),
              React.createElement(Typography, { variant: "h5", color: "primary" },
                product.price.toLocaleString() + " GNF"
              )
            ),
            React.createElement(CardActions, null,
              React.createElement(Button, { 
                size: "small",
                onClick: () => addToCart(product)
              },
                "Ajouter au panier"
              )
            )
          )
        )
      )
    )
  );
}

export default ProductGrid;