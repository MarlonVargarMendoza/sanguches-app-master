import { LocationOn as LocationIcon, Restaurant as RestaurantIcon, Search as SearchIcon } from '@mui/icons-material';
import {
    Box, Button,
    Container,
    Fade,
    Grid,
    Paper,
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
            <Container maxWidth="lg" sx={{ py: { xs: 5, sm: 8, md: 8 }, pb: 8 }}>
                <Typography
                    variant="h2"
                    className="text-center text-[#C8151B] mb-8"
                    sx={{
                        fontWeight: 'bold',
                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                        textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                    }}
                >
                    ¡Encuentra tu Sanguche más cercano!
                </Typography>

                <Grid container spacing={4} className="my-8">
                    <Grid item xs={12} md={5}>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Paper
                                elevation={0}
                                className="my-4 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl"
                            >
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    placeholder="Buscar por nombre o dirección"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <SearchIcon className="text-gray-400 mr-2 transition-transform duration-300 hover:scale-110" />
                                        ),
                                        classes: {
                                            root: 'focus:ring-2 focus:ring-[#FFC603] focus:outline-none',
                                        },
                                    }}
                                    className="bg-white/90 rounded-lg transition-all duration-300 hover:bg-white focus:bg-white shadow-md"
                                />
                            </Paper>

                            <div className="space-y-4">
                                <AnimatePresence mode="wait">
                                    {filteredLocations.map((location) => (
                                        <motion.div
                                            key={location.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            whileHover={{ scale: 1.02, boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)" }}
                                            className={`p-4 rounded-2xl cursor-pointer transition-all duration-300
                                                         ${selectedLocation?.id === location.id
                                                    ? 'bg-[#C8151B] text-white shadow-lg'
                                                    : 'bg-white/80 backdrop-blur-lg hover:bg-[#FFC603]/20 hover:shadow-md'
                                                }
        `}
                                            onClick={() => setSelectedLocation(location)}
                                        >
                                            <div className="flex items-start gap-4">
                                                <RestaurantIcon
                                                    className={`w-6 h-6 ${selectedLocation?.id === location.id ? 'text-white' : 'text-[#FFC603]'
                                                        }`}
                                                />
                                                <div>
                                                    <h3
                                                        className="font-semibold text-lg mb-1 transition-colors duration-300 text-gray-700"
                                                    >
                                                        {location.name}
                                                    </h3>
                                                    <p
                                                        className={`text-sm flex items-center gap-2 transition-colors duration-300 ${selectedLocation?.id === location.id
                                                            ? 'text-white/90'
                                                            : 'text-gray-600'
                                                            }`}
                                                    >
                                                        <LocationIcon
                                                            fontSize="small"
                                                            className={`${selectedLocation?.id === location.id
                                                                ? 'text-white/80'
                                                                : 'text-gray-400'
                                                                }`}
                                                        />
                                                        {location.address}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                        </motion.div>
                    </Grid>

                    <Grid item xs={12} md={7}>
                        <Paper elevation={3} sx={{ height: '400px',margin: '16px' ,width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
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
                            <Paper
                                elevation={0}
                                className="p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg"
                            >
                                <Typography
                                    variant="h5"
                                    component="h3"
                                    className="flex items-center gap-2 text-[#C8151B] font-bold"
                                    gutterBottom
                                >
                                    <RestaurantIcon className="text-[#FFC603] w-6 h-6" />
                                    {selectedLocation.name}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    className="flex items-center gap-2 text-gray-700"
                                    paragraph
                                >
                                    <LocationIcon fontSize="small" className="text-gray-500" />
                                    {selectedLocation.address}
                                </Typography>
                                <Button
                                    variant="contained"
                                    className="bg-[#C8151B] hover:bg-[#FFC603] hover:text-black transition-all duration-300"
                                    startIcon={<LocationIcon />}
                                    onClick={() =>
                                        window.open(
                                            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                                selectedLocation.address
                                            )}`,
                                            '_blank'
                                        )
                                    }
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