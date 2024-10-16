// hooks/useProductImage.js
import { useMemo } from 'react';
import { getProductImage } from '../constants';

export const useProductImage = (productId) => {
  return useMemo(() => {
    return getProductImage(productId) || '/assets/products/default.png';
  }, [productId]);
};