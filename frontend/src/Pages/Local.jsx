import { LocationOn as LocationIcon, Restaurant as RestaurantIcon, Search as SearchIcon } from '@mui/icons-material';
import {
    Box, Button,
    Container,
    Fade,
    Grid,
    List, ListItem, ListItemText, Paper, Skeleton,
    TextField, Typography, useMediaQuery, useTheme
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import Map from '../Pages/Map';

const Local = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [locations, setLocations] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLocations([
                { id: 1, name: 'Sanguches Floresta', address: 'Carrera 84 #45-124, Medellín' },
                { id: 2, name: 'Sanguches Provenza', address: 'Carrera 36 #8A-53, Medellín' },
                { id: 3, name: 'Sanguches Cristo Rey', address: 'Carrera 51B #3 Sur-46, Medellín' },
            ]);
            setIsLoading(false);
        }, 1000);
    }, []);

    const filteredLocations = locations.filter((location) =>
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleLocationSelect = (location) => {
        setSelectedLocation(location);
    };

    return (
        <Box className="min-h-screen py-[80px] bg-gradient-to-b from-[#FFC603] to-[#EFEFEF]">
            <Container maxWidth="lg" sx={{ pt: { xs: 12, sm: 16, md: 20 }, pb: 8 }}>
                <Typography 
                    variant="h2" 
                    className="text-center text-[#C8151B] mb-8"
                    sx={{ 
                        fontWeight: 'bold', 
                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                        textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                    }}
                >
                    ¡Encuentra tu Sanguches más cercano!
                </Typography>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={5}>
                        <Paper elevation={3} className="p-4 mb-4">
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Busca por nombre o dirección"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: <SearchIcon color="action" />,
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: '#FFC603' },
                                        '&:hover fieldset': { borderColor: '#C8151B' },
                                        '&.Mui-focused fieldset': { borderColor: '#C8151B' },
                                    },
                                }}
                            />
                        </Paper>

                        <AnimatePresence>
                            {isLoading ? (
                                <Box>
                                    {[...Array(3)].map((_, index) => (
                                        <Skeleton key={index} variant="rectangular" height={80} sx={{ mb: 2, borderRadius: 2 }} />
                                    ))}
                                </Box>
                            ) : (
                                <List>
                                    {filteredLocations.map((location) => (
                                        <motion.div
                                            key={location.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <ListItem 
                                                component={Paper} 
                                                elevation={3}
                                                onClick={() => handleLocationSelect(location)}
                                                sx={{ 
                                                    mb: 2, 
                                                    cursor: 'pointer', 
                                                    transition: 'all 0.3s',
                                                    '&:hover': { 
                                                        backgroundColor: '#FFC603',
                                                        transform: 'translateY(-5px)',
                                                    },
                                                    ...(selectedLocation === location && {
                                                        backgroundColor: '#C8151B',
                                                        color: 'white',
                                                    }),
                                                }}
                                            >
                                                <ListItemText
                                                    primary={
                                                        <Typography variant="h6" component="h3">
                                                            <RestaurantIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
                                                            {location.name}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Typography variant="body2" color={selectedLocation === location ? 'white' : 'text.secondary'}>
                                                            <LocationIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                                                            {location.address}
                                                        </Typography>
                                                    }
                                                />
                                            </ListItem>
                                        </motion.div>
                                    ))}
                                </List>
                            )}
                        </AnimatePresence>
                    </Grid>

                    <Grid item xs={12} md={7}>
                        <Paper elevation={3} sx={{ height: '400px', borderRadius: '8px', overflow: 'hidden' }}>
                            <Map
                                locations={filteredLocations}
                                selectedLocation={selectedLocation}
                                onLocationSelect={handleLocationSelect}
                            />
                        </Paper>
                    </Grid>
                </Grid>

                <Fade in={selectedLocation !== null}>
                    <Box mt={4}>
                        {selectedLocation && (
                            <Paper elevation={3} className="p-4 bg-white">
                                <Typography variant="h5" component="h3" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
                                    <RestaurantIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
                                    {selectedLocation.name}
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    <LocationIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    {selectedLocation.address}
                                </Typography>
                                <Button 
                                    variant="contained" 
                                    color="primary"
                                    startIcon={<LocationIcon />}
                                    sx={{ 
                                        backgroundColor: '#C8151B',
                                        '&:hover': { backgroundColor: '#FFC603', color: 'black' }
                                    }}
                                    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedLocation.address)}`, '_blank')}
                                >
                                    Cómo llegar
                                </Button>
                            </Paper>
                        )}
                    </Box>
                </Fade>
            </Container>
        </Box>
    );
};

export default Local;