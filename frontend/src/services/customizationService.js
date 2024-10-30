// services/customizationService.js

const COMBO_TYPES = {
    REGULAR: 'regular',
    SPECIAL: 'special'
  };
  
  class CustomizationHandler {
    static createForProduct(product) {
      return product.isCombo 
        ? new ComboCustomizationStrategy(product)
        : new RegularCustomizationStrategy(product);
    }
  }
  
  class ComboCustomizationStrategy {
    constructor(product) {
      this.product = product;
      this.basePrice = product.basePrice;
      this.includedItems = {
        drink: null,
        sideDish: null
      };
    }
  
    validateComboConfiguration(config) {
      const { drink, sideDish } = config;
      const requiredFields = [
        { field: drink, name: 'bebida' },
        { field: sideDish, name: 'acompañamiento' }
      ];
  
      const missingFields = requiredFields
        .filter(({ field }) => !field)
        .map(({ name }) => name);
  
      if (missingFields.length > 0) {
        throw new Error(`Por favor selecciona: ${missingFields.join(', ')}`);
      }
  
      return true;
    }
  
    calculatePrice(customizations = {}) {
      let finalPrice = this.basePrice;
  
      // Add price for additional customizations beyond combo basics
      if (customizations.additions) {
        finalPrice += customizations.additions.reduce((sum, item) => sum + item.price, 0);
      }
  
      // Handle upgrades from basic combo items
      if (customizations.drinkUpgrade) {
        finalPrice += customizations.drinkUpgrade.price;
      }
      if (customizations.sideDishUpgrade) {
        finalPrice += customizations.sideDishUpgrade.price;
      }
  
      return finalPrice;
    }
  
    formatCustomizationSummary(customizations) {
      return {
        baseItems: {
          drink: customizations.drink?.name || 'Bebida no seleccionada',
          sideDish: customizations.sideDish?.name || 'Acompañamiento no seleccionado'
        },
        additions: customizations.additions || [],
        upgrades: {
          drink: customizations.drinkUpgrade,
          sideDish: customizations.sideDishUpgrade
        },
        totalPrice: this.calculatePrice(customizations)
      };
    }
  
    getAvailableCustomizations(type) {
      switch (type) {
        case 'drinks':
          return async () => {
            const response = await fetch('/api/drinks/combo');
            return response.json();
          };
        case 'sideDishes':
          return async () => {
            const response = await fetch('/api/companions/combo');
            return response.json();
          };
        default:
          return async () => [];
      }
    }
  }
  
  // Factory for creating customization instances
  export const createCustomizationStrategy = (product) => {
    return CustomizationHandler.createForProduct(product);
  };