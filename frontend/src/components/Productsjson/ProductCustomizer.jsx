import { Button, Grid, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

export const ProductCustomizer = ({ product, customizations, onCustomizationChange, onAddToCart }) => {
    const [previewImage, setPreviewImage] = useState(product.image);

    useEffect(() => {
        // Update the preview image whenever customizations change
        updatePreviewImage();
    }, [customizations]);

    const updatePreviewImage = () => {
        // Update the preview image URL based on customizations (simplified logic)
        setPreviewImage(`${product.image}?${new URLSearchParams(customizations).toString()}`);
    };

    const handleCustomizationChange = (key, value) => {
        // Update the customizations when the user selects a new option
        onCustomizationChange({ ...customizations, [key]: value });
    };

    return (
        <Grid container spacing={2}>
            {/* Product Image Preview */}
            <Grid item xs={12} md={6}>
                <img src={previewImage} alt="Product Preview" style={{ width: '100%', height: 'auto' }} />
            </Grid>

            {/* Customization Options */}
            <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                    Customize {product.name}
                </Typography>
                {product.customizationOptions.map((option) => (
                    <div key={option.key} style={{ marginBottom: '1rem' }}>
                        {option.type === 'text' ? (
                            <TextField
                                label={option.label}
                                value={customizations[option.key] || ''}
                                onChange={(e) => handleCustomizationChange(option.key, e.target.value)}
                                fullWidth
                            />
                        ) : option.type === 'select' ? (
                            <Select
                                value={customizations[option.key] || ''}
                                onChange={(e) => handleCustomizationChange(option.key, e.target.value)}
                                fullWidth
                            >
                                {option.choices.map((choice) => (
                                    <MenuItem key={choice.value} value={choice.value}>
                                        {choice.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        ) : null}
                    </div>
                ))}
                <Button variant="contained" color="primary" onClick={onAddToCart}>
                    Add to Cart
                </Button>
            </Grid>
        </Grid>
    );
};
