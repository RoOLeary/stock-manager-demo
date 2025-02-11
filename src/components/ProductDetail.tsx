import { SetStateAction, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductByIdQuery, useGetProductListQuery } from '../services/productApi';
import productImg_tshirt from  './../assets/tshirt.png'; 
import productImg_trousers from './../assets/trousers.png';

const ProductDetail = () => {
  const { id } = useParams();
  // @ts-expect-error ack
  const { data: product, isLoading, error } = useGetProductByIdQuery(id);
  const { data: productsList } = useGetProductListQuery();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const handleBuyNowClick = (id: string, quantity: number) => {
    navigate(`/product/${id}/checkout`, { state: { product, quantity } });
  };

  const handleQuantityChange = (e: { target: { value: SetStateAction<number>; }; }) => setQuantity(e.target.value);

  const relatedProducts = productsList?.filter(
    (relatedProduct) => relatedProduct.type === product?.type && relatedProduct.id !== product?.id
  );

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading product details...</p>;

  return (
    <div className="container mx-auto py-8">
      {product && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="product-image">
            <img
               src={product.type === 't-shirt' ? productImg_tshirt : productImg_trousers }
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
              // @ts-expect-error ack
              onChange={handleQuantityChange}
              className="border rounded p-2 w-24 mb-4"
            >
              {[...Array(product.quantity).keys()].map((num) => (
                <option key={num + 1} value={num + 1}>
                  {num + 1}
                </option>
              ))}
            </select>

            {/* Buy Now Button */}
            <button
              onClick={() => handleBuyNowClick(product.id, quantity)}
              className="w-full bg-yellow-500 text-white py-3 rounded hover:bg-yellow-600 transition"
              disabled={!product.isAvailable}
            >
              {product.isAvailable ? 'Buy Now' : 'Out of Stock'}
            </button>

            {/* Total Price Display */}
            <p className="text-lg text-gray-600 mt-4">
              Total Price: <span className="font-semibold">€{(product.price * quantity).toFixed(2)}</span>
            </p>
          </div>
        </div>
      )}

      {/* Related Products Section */}
      <div className="related-products mt-12">
        <h3 className="text-2xl font-bold mb-4">Related Products</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {relatedProducts?.slice(0, 4).map((related) => (
            <div key={related.id} className="bg-white rounded shadow-lg p-4">
              <a href={`/product/${related.id}`}>
                <img
                  src={related.type === 't-shirt' ? productImg_tshirt : productImg_trousers }
                  alt={related.title}
                  className="w-full h-auto mb-2"
                />
                <h4 className="text-md font-semibold">{related.title}</h4>
                {/* <p className="text-gray-600">€{related?.price?.toFixed(2)}</p> */}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
