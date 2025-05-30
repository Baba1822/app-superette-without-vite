import React from 'react';
import {
  TableCell,
  TableRow,
  IconButton,
  Typography,
  TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function CartItem({ item, onRemove, onQuantityChange }) {
  const [quantity, setQuantity] = React.useState(item.quantity || 1);

  const handleQuantityChange = (event) => {
    const newQuantity = parseInt(event.target.value);
    setQuantity(newQuantity);
    if (onQuantityChange) onQuantityChange(item.id, newQuantity);
  };

  return (
    <TableRow>
      <TableCell>
        <Typography variant="body1">{item.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {item.category}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <TextField
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          inputProps={{ min: 1 }}
          size="small"
          sx={{ width: 80 }}
        />
      </TableCell>
      <TableCell align="right">
        {(item.price * quantity).toLocaleString()} GNF
      </TableCell>
      <TableCell align="right">
        <IconButton 
          onClick={() => onRemove(item.id)}
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

export default CartItem;