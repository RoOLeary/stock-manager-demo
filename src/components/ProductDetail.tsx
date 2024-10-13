import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetProductByIdQuery } from '../services/productApi';
import { useNavigate } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  const { data: product, isLoading, error } = useGetProductByIdQuery(id);

  const [quantity, setQuantity] = useState(1);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
const navigate = useNavigate();
  const handleQuantityChange = (e) => setQuantity(e.target.value);

  const handleOrder = (id) => {
    // Add order logic here
    console.log(`Ordered ${quantity} of ${product.title}`);
    navigate(`/product/${id}/checkout`)
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    console.log('Payment submitted:', { cardNumber, expiryDate, cvv });
    // Hook up payment logic here
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading product details...</p>;

  return (
    <div className="container mx-auto py-8">
      <a href="/">Back to Products</a>
      {product && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="product-image">
            <img
              src="https://via.placeholder.com/600"
              alt={product.title}
              className="w-full h-auto rounded shadow-lg"
            />
          </div>

          {/* Product Details */}
          <div className="product-details">
            <h2 className="text-3xl font-bold mb-2">{product.title}</h2>
            <p className="text-lg text-gray-700 mb-4">{product.description}</p>

            <p className="text-2xl font-semibold text-green-600 mb-4">€{product.price}</p>

            <p className={`mb-4 ${product.isAvailable ? 'text-green-500' : 'text-red-500'}`}>
              {product.isAvailable ? 'In Stock' : 'Out of Stock'}
            </p>

            {/* Quantity Selector */}
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <select
              value={quantity}
              onChange={handleQuantityChange}
              className="border rounded p-2 w-24 mb-4"
            >
              {[...Array(product.quantity).keys()].map((num) => (
                <option key={num + 1} value={num + 1}>
                  {num + 1}
                </option>
              ))}
            </select>

            {/* Order Button */}
            <button
              onClick={() => handleOrder(product.id)}
              className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition"
              disabled={!product.isAvailable}
            >
              {product.isAvailable ? 'Complete Purchase' : 'Out of Stock'}
            </button>

            {/* Dynamic Price Display */}
            <p className="text-lg text-gray-600 mt-4">
              Total Price: <span className="font-semibold">€{(product.price * quantity).toFixed(2)}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
