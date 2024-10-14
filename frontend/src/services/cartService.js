export const calculateItemPrice = (item) => {
    let price = item.basePrice;
    if (item.customizations) {
        if (item.customizations.additions) {
            price += item.customizations.additions.reduce((sum, addition) => sum + addition.price, 0);
        }
        if (item.customizations.drinks) {
            price += item.customizations.drinks.reduce((sum, drink) => sum + drink.price, 0);
        }
    }
    return price * item.quantity;
};

export const calculateTotalPrice = (items) => {
    return items.reduce((total, item) => total + calculateItemPrice(item), 0);
};

export const generateVoucherDetails = (items) => {
    return items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: calculateItemPrice(item),
        customizations: item.customizations
    }));
};  