import {
    Box, Breadcrumbs,
    CircularProgress, Grid,
    Typography, useMediaQuery, useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import {
    Coffee, Droplet, Gift,
    Pizza
} from 'lucide-react';
import React from 'react';
import { SideBySideMagnifier } from "react-image-magnifiers";
import { Link, useLocation } from 'react-router-dom';
import priceUtils from '../../../utils/priceUtils.js';
import QuantityAndCartControls from '../../components/combo/QuantityAndCartControls.jsx';
import { CustomizationProvider } from '../../context/CustomizeContext';
import { useComboCustomization } from '../../hooks/useComboCustomization';
import ComboCustomSelect from '../combo/sections/ComboCustomSelect.jsx';
import ErrorView, { ErrorBoundary } from '../Error/ErrorComponents';
import CustomSelect from '../ui/CustomSelect.jsx';
const DOMAIN = import.meta.env.VITE_APP_DOMAIN;

const typeIcons = {
    accompaniments: <Gift className="w-5 h-5" />,
    drinks: <Coffee className="w-5 h-5" />,
    extras: <Pizza className="w-5 h-5" />,
    sauces: <Droplet className="w-5 h-5" />
};

const sectionLabels = {
    accompaniments: "Selecciona tu Acompañamiento",
    drinks: "Elige tu Bebida",
    extras: "Agregar Extras",
    sauces: "Agregar Salsas"
};

function ComboCustomize() {
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { selectedCombo: initialCombo } = location.state || {};

    const {
        combo,
        loading,
        error,
        selections,
        quantity,
        snackbarOpen,
        handleSelectionChange,
        handleQuantityChange,
        handleAddToCart,
        setSnackbarOpen,
        calculatePrice,
        isEditing,
        customizationOptions,
    } = useComboCustomization(initialCombo);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#F5F5F5]">
                <CircularProgress />
            </div>
        );
    }

    if (error || !combo) {
        return <ErrorView error={error} />;
    }

    return (
        <div className="bg-[#F5F5F5] min-h-screen">
            <main className="container mx-auto px-4 py-6" style={{ 
        paddingTop: isMobile ? '120px' : '140px' 
            }}>
                <BreadcrumbNav />

               
                <Grid container spacing={4} className="bg-white rounded-lg shadow-lg p-6">
                    
                    <ProductImageSection combo={combo} />
                    <CustomizationSection
                        combo={combo}
                        selections={selections}
                        quantity={quantity}
                        handleSelectionChange={handleSelectionChange}
                        handleQuantityChange={handleQuantityChange}
                        handleAddToCart={handleAddToCart}
                        calculatePrice={calculatePrice}
                        isEditing={isEditing}
                        customizationOptions={customizationOptions}
                    />
                </Grid>
            </main>
        </div>
    );
}

const BreadcrumbNav = () => (
    <Breadcrumbs className="mb-6">
        <Link to="/" className="hover:text-[#C3151A]">Inicio</Link>
        <Link to="/combos" className="hover:text-[#C3151A]">Combos</Link>
        <Typography color="text.primary">Personaliza tu combo</Typography>
    </Breadcrumbs>
);

const ProductImageSection = ({ combo }) => (
    <Grid item xs={12} md={5}>
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Box className="rounded-xl overflow-hidden shadow-lg">
                <SideBySideMagnifier
                    imageSrc={`${DOMAIN}${combo.image}`}
                    imageAlt={combo.name}
                    largeImageSrc={`${DOMAIN}${combo.image}`}
                    alwaysInPlace={true}
                    overlayBoxOpacity={0.8}
                    cursorStyle="crosshair"
                    className="w-full"
                />
            </Box>
           
        </motion.div>
    </Grid>
);
const CustomizationSection = ({
    combo,
    selections,
    quantity,
    handleSelectionChange,
    handleQuantityChange,
    handleAddToCart,
    calculatePrice,
    isEditing,
    customizationOptions
}) => (

    <Grid item xs={12} md={7}>
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
        >
            <ComboHeader combo={combo} calculatePrice={calculatePrice} />
            <ComboOptions
                combo={combo}
                selections={selections}
                handleSelectionChange={handleSelectionChange}
            />
            <Box className="space-y-4">
                {customizationOptions.drinks && (
                    <ComboCustomSelect
                        type="drinks"
                        items={customizationOptions.drinks}
                        selectedItem={selections.drinks}
                        onSelect={(item) => handleSelectionChange('drinks', item)}
                        required={true}
                    />
                )}

                {customizationOptions.accompaniments && (
                    <ComboCustomSelect
                        type="accompaniments"
                        items={customizationOptions.accompaniments}
                        selectedItem={selections.accompaniments}
                        onSelect={(item) => handleSelectionChange('accompaniments', item)}
                        required={true}
                    />
                )}
            </Box>

            <QuantityAndCartControls
                quantity={quantity}
                handleQuantityChange={handleQuantityChange}
                handleAddToCart={handleAddToCart}
                isEditing={isEditing}
            />

            {/* Información adicional del combo */}
            <Box className="mt-6 p-4 bg-gray-50 rounded-lg">
                <Typography variant="subtitle2" className="font-semibold text-gray-700 mb-2">
                    Información del combo
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                    {combo.description}
                </Typography>
                {combo.terms && (
                    <Typography variant="caption" className="block mt-2 text-gray-500">
                        * {combo.terms}
                    </Typography>
                )}
            </Box>
        </motion.div>
    </Grid>
);

const ComboHeader = ({ combo, calculatePrice }) => (
    <div>
        <Typography variant="h4" className="font-bold text-[#525D5A]">
            {combo.name}
        </Typography>
        <Typography variant="body1" className="text-gray-600 mt-1 mb-3">
            {combo.description}
        </Typography>
        <Box className="flex items-center gap-3">
            <Typography variant="h5" className="font-black text-[#FFC603]">
                {priceUtils(calculatePrice().toFixed(2))}
            </Typography>
            {combo.originalPrice && (
                <Typography
                    variant="body1"
                    className="line-through text-gray-400"
                >
                    {priceUtils(combo.originalPrice.toFixed(2))}
                </Typography>
            )}
        </Box>
    </div>
);

const ComboOptions = ({ combo, selections, handleSelectionChange }) => (
    <div className="space-y-6">
        {Object.entries(sectionLabels).map(([type, label]) => {
            // Solo mostrar las secciones que apliquen al combo
            if (!combo.customizations?.[type]?.length) return null;

            return (
                <CustomSelect
                    key={type}
                    label={label}
                    items={combo.customizations[type]}
                    selectedItems={selections[type]}
                    onChange={(newSelection) => handleSelectionChange(type, newSelection)}
                    icon={typeIcons[type]}
                    required={type === 'accompaniments' || type === 'drinks'}
                    maxSelections={type === 'accompaniments' || type === 'drinks' ? 1 : undefined}
                    priceDisplay={type === 'extras'}
                />
            );
        })}
    </div>
);

// Exportar el componente envuelto con los providers necesarios
export default function ComboCustomizeWrapper() {
    return (
        <ErrorBoundary>
            <CustomizationProvider>
                <ComboCustomize />
            </CustomizationProvider>
        </ErrorBoundary>
    );
}