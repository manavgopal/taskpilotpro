// landingPage.jsx

import React from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';

const landingPage = ({ onCardClick }) => {
    const cards = ['Compliant Meeting', 'Data Loss Prevention', 'Dynamic Watermarking'];

    return (
        <Box
            display="flex"
            flexDirection="column"
            style={{ height: '40vh', overflowY: 'auto', paddingTop: '10px' }}
        >
            <Grid container spacing={0} justifyContent="space-around">
                {cards.map((card, index) => (
                    <Grid item xs={10} sm={3} key={index}>
                        <Card onClick={() => onCardClick(card)} style={{ border: '0.5px solid black', cursor: 'pointer' }}>
                            <CardContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Typography variant="body1" component="h2" style={{ fontFamily: 'Segoe UI', fontWeight: 'normal' }}>
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