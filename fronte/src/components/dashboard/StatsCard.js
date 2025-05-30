import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Stack,
  Avatar 
} from '@mui/material';

function StatsCard({ title, value, subValue, icon, color = 'primary' }) {
  return (
    React.createElement(Card, null,
      React.createElement(CardContent, null,
        React.createElement(Stack, { direction: "row", alignItems: "center", spacing: 2 },
          React.createElement(Avatar, { sx: { bgcolor: `${color}.main` } },
            icon
          ),
          React.createElement(Stack, null,
            React.createElement(Typography, { variant: "h6", color: "text.secondary" },
              title
            ),
            React.createElement(Typography, { variant: "h4" },
              value,
              subValue && React.createElement(Typography, { 
                component: "span",
                variant: "body1",
                color: "success.main",
                sx: { ml: 1 }
              },
                subValue
              )
            )
          )
        )
      )
    )
  );
}

export default StatsCard;