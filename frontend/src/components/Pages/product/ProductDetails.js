import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';


const ProductDetails = () => {

  const { slug } = useParams(); // Obtener el slug de la URL
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    // Fetch product details from your API
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${slug}`); // Ajusta el endpoint según tu configuración
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [slug]);

  if (!product) return <div>Loading...</div>;

  return (
    <div>ProductDetails</div>
  )
}

export default ProductDetails