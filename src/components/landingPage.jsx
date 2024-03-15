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
            style={{ height: '50vh', overflowY: 'auto', paddingTop: '10px' }}
        >
            <Grid container spacing={3}>
                {cards.map((card, index) => (
                    <Grid item xs={10} sm={3} key={index}>
                        <Card onClick={() => onCardClick(card)} style={{ border: '1px solid black', cursor: 'pointer' }}>
                            <CardContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Typography variant="h6" component="h2" style={{ fontFamily: 'Segoe UI', fontWeight: 'normal' }}>
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