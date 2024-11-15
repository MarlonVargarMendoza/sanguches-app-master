// useVoucherGenerator.js
import { useCallback } from 'react';
import priceUtils from '../../utils/priceUtils';
import { useCart } from './useCart';

export const useVoucherGenerator = () => {
    const { cart, calculateItemPrice } = useCart();

    const generateVoucher = useCallback(() => {
        let voucherText = "Detalle del Pedido:\n\n";
        let totalPrice = 0;

        cart.forEach((item, index) => {
            const itemPrice = calculateItemPrice(item);
            totalPrice += itemPrice;

            voucherText += `${index + 1}. ${item.name} x${item.quantity} - $${itemPrice}\n`;

            if (item.customizations) {
                if (item.customizations.additions?.length > 0) {
                    voucherText += "   Adiciones:\n";
                    item.customizations.additions.forEach(addition => {
                        voucherText += `     - ${addition.text || addition.name}\n`;
                    });
                }
                if (item.customizations.drinks?.length > 0) {
                    voucherText += "   Bebidas:\n";
                    item.customizations.drinks.forEach(drink => {
                        voucherText += `     - ${drink.text || drink.name}\n`;
                    });
                }
                if (item.customizations.sauces?.length > 0) {
                    voucherText += `   Salsas: \n ${item.customizations.sauces.map(sauce => sauce.text || sauce.name).join(', ')}\n`;
                }
                if (item.customizations.accompaniments?.length > 0) {
                    voucherText += "   Acompanimentos:\n";
                    item.customizations.accompaniments.forEach(accompaniment => {
                        voucherText += `     - ${accompaniment.text || accompaniment.name}\n`;
                    });
                }
            }
            voucherText += '\n';
        });

        voucherText += `\nTotal: ${priceUtils(totalPrice)}`;
        return voucherText;
    }, [cart, calculateItemPrice]);

    return generateVoucher;
};