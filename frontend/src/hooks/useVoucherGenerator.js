// src/hooks/useVoucherGenerator.js
import { useCallback } from 'react';
import { useCart } from './useCart';

export const useVoucherGenerator = () => {
    const { cart, calculateItemPrice } = useCart();

    const generateVoucher = useCallback(() => {
        let voucherText = "Detalle del Pedido:\n\n";
        let totalPrice = 0;

        cart.forEach((item, index) => {
            const itemPrice = calculateItemPrice(item);
            totalPrice += itemPrice;

            voucherText += `${index + 1}. ${item.name} x${item.quantity} - $${itemPrice.toFixed(2)}\n`;

            if (item.customizations) {
                if (item.customizations.additions?.length > 0) {
                    voucherText += "   Adiciones:\n";
                    item.customizations.additions.forEach(addition => {
                        voucherText += `     - ${addition || 'Sin nombre'}\n`;
                    });
                }
                if (item.customizations.drinks?.length > 0) {
                    voucherText += "   Bebidas:\n";
                    item.customizations.drinks.forEach(drink => {
                        voucherText += `     - ${drink.name || 'Sin nombre'}: $${drink.price ? drink.price.toFixed(2) : 'N/A'}\n`;
                    });
                }
                if (item.customizations.sauces?.length > 0) {
                    voucherText += `   Salsas: ${item.customizations.sauces.join(', ')}\n`;
                }
            }
            voucherText += '\n';
        });

        voucherText += `\nTotal: $${totalPrice.toFixed(2)}`;
        return voucherText;
    }, [cart, calculateItemPrice]);

    return generateVoucher;
};