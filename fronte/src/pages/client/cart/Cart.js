import React from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  Stack,
  Divider
} from '@mui/material';
import { useCart } from '../../../context/CartContext';
import CartItem from '../../../components/order/CartItem';

function Cart() {
  const { cartItems, removeFromCart, clearCart } = useCart();
  
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    React.createElement(Container, { maxWidth: "lg", sx: { py: 4 } },
      React.createElement(Paper, { elevation: 3, sx: { p: 3 } },
        React.createElement(Typography, { variant: "h4", gutterBottom: true },
          "Votre Panier"
        ),
        
        cartItems.length === 0 ? (
          React.createElement(Typography, { variant: "body1", sx: { py: 4 } },
            "Votre panier est vide"
          )
        ) : (
          React.createElement(React.Fragment, null,
            React.createElement(TableContainer, null,
              React.createElement(Table, null,
                React.createElement(TableHead, null,
                  React.createElement(TableRow, null,
                    React.createElement(TableCell, null, "Produit"),
                    React.createElement(TableCell, { align: "right" }, "Prix"),
                    React.createElement(TableCell, { align: "right" }, "Actions")
                  )
                ),
                React.createElement(TableBody, null,
                  cartItems.map((item) =>
                    React.createElement(CartItem, {
                      key: item.id,
                      item: item,
                      onRemove: removeFromCart
                    })
                  )
                )
              )
            ),
            
            React.createElement(Divider, { sx: { my: 3 } }),
            
            React.createElement(Stack, { direction: "row", justifyContent: "space-between", alignItems: "center" },
              React.createElement(Typography, { variant: "h5" },
                "Total: " + total.toLocaleString() + " GNF"
              ),
              React.createElement(Stack, { direction: "row", spacing: 2 },
                React.createElement(Button, { 
                  variant: "outlined",
                  onClick: clearCart
                },
                  "Vider le panier"
                ),
                React.createElement(Button, { 
                  variant: "contained",
                  href: "/checkout"
                },
                  "Passer commande"
                )
              )
            )
          )
        )
      )
    )
  );
}

export default Cart;