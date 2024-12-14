
const API_URL = import.meta.env.VITE_APP_DOMAIN;
import axios from 'axios';

export class OrderService {
    static async createOrder(orderDetails) {
        try {
            // Separar los items por tipo
            const categorizedItems = this.categorizeItems(orderDetails.items);

            const formattedOrder = {
                personal_id: orderDetails.personalId,
                products: categorizedItems.products.map(item => ({
                    id: item.id,
                    quantity: item.quantity,
                    price: item.basePrice,
                    ...(item.customizations && {
                        additions: item.customizations.additions?.map(a => ({
                            id: a.id,
                            price: a.price
                        })),
                        drinks: item.customizations.drinks?.map(d => ({
                            id: d.id,
                            price: d.price || d.basePrice
                        })),
                        companions: item.customizations.accompaniments?.map(c => ({
                            id: c.id,
                            price: c.price || c.basePrice
                        }))
                    })
                })),
                combos: categorizedItems.combos.map(combo => ({
                    id: combo.id,
                    price: combo.basePrice,
                    quantity: combo.quantity,
                    drink_id: combo.customizations?.drinks?.[0]?.id,
                    companion_id: combo.customizations?.accompaniments?.[0]?.id
                })),
                drinks: categorizedItems.drinks.map(drink => ({
                    id: drink.id,
                    price: drink.basePrice,
                    quantity: drink.quantity
                })),
                total_price: orderDetails.total
            };

            // Log detallado para el backend
            console.group('🚀 Pedido enviado al Backend');
            console.log('URL:', `${API_URL}/api/orders`);
            // Log del objeto completo en formato JSON
            console.log('📋 Objeto JSON completo:');
            console.log(JSON.stringify(formattedOrder, null, 2));
            console.groupEnd();

            const response = await axios.post(`${API_URL}/api/orders`, formattedOrder, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            // Verificar y extraer el ID del pedido de la estructura correcta
            // Verificación de respuesta
            if (!response.data?.data?.id) {
                console.warn('Respuesta del servidor sin ID:', response.data);
                throw new Error('No se pudo obtener el ID del pedido');
            }

            // Return corregido con la estructura correcta
            return {
                success: true,
                data: response.data.data,
                orderId: response.data.data.id
            };

        } catch (error) {
            console.error('❌ Error en la petición:', error);
            console.error('Detalles del error:', error.response?.data);

            const errorMessage = error.response?.data?.message || 'Error al procesar el pedido';
            throw {
                success: false,
                error: errorMessage,
                details: error.response?.data
            };
        }
    }

    static categorizeItems(items) {
        return items.reduce((acc, item) => {
            if (item.isCombo) {
                acc.combos.push(item);
            } else if (item.isDrink) {
                acc.drinks.push(item);
            } else {
                acc.products.push(item);
            }
            return acc;
        }, { products: [], combos: [], drinks: [] });
    }
}