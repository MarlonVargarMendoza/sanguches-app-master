export class CustomizationService {
    static calculateBasePrice({ product }) {
        return product?.basePrice || 0;
    }

    static addCustomizationsCost({ product, selections }) {
        if (!product || !selections) return 0;

        return Object.entries(selections).reduce((total, [type, selected]) => {
            return total + this.calculateTypeTotal(type, selected);
        }, this.calculateBasePrice({ product }));
    }

    static calculateTypeTotal(type, selectedIds) {
        const getPriceKey = (type) =>
            type === CUSTOMIZATION_TYPES.DRINKS ? 'basePrice' : 'price';

        return selectedIds.reduce((sum, id) => {
            const item = this.findItemById(type, id);
            const priceKey = getPriceKey(type);
            return sum + (item ? (item[priceKey] || 0) : 0);
        }, 0);
    }

    static applyQuantity({ product, selections, quantity }) {
        const baseTotal = this.addCustomizationsCost({ product, selections });
        return baseTotal * quantity;
    }

    static mapSelections(selections) {
        return Object.entries(selections).reduce((acc, [type, ids]) => {
            acc[type] = ids.map(id => {
                const item = this.findItemById(type, id);
                return {
                    id: item.id,
                    text: item.text || item.name,
                    price: item[type === CUSTOMIZATION_TYPES.DRINKS ? 'basePrice' : 'price']
                };
            });
            return acc;
        }, {});
    }
}
