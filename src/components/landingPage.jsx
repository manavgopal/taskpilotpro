// landingPage.jsx
 
import React from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
 
const landingPage = ({ onCardClick }) => {
    const cards = ['Compliant Meeting', 'Data Loss Prevention', 'Dynamic Watermarking'];
 
    return (
        <Box
      display="flex"
      flexDirection="column"
      alignItems="flex-end"
      style={{ height: '50vh', overflowY: 'auto' }}
    >
        <Grid container spacing={3}>
            {cards.map((card, index) => (
                <Grid item xs={12} sm={4} key={index}>
                    <Card onClick={() => onCardClick(card)}>
                        <CardContent>
                            <Typography variant="h5" component="h2">
                                {card}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
        </Box>
    );
};
 
export default landingPage;