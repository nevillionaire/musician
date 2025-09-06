import React, { useState } from 'react';
import { X, ShoppingCart, Plus, Minus, CreditCard, Building, Smartphone } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: 'apparel' | 'music' | 'accessories';
  sizes?: string[];
}

interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Band T-Shirt',
    price: 25,
    image: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'apparel',
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 2,
    name: 'Vinyl Record',
    price: 35,
    image: 'https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'music'
  },
  {
    id: 3,
    name: 'Coffee Mug',
    price: 15,
    image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'accessories'
  },
  {
    id: 4,
    name: 'Hoodie',
    price: 45,
    image: 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'apparel',
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 5,
    name: 'Poster',
    price: 20,
    image: 'https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'accessories'
  },
  {
    id: 6,
    name: 'Digital Album',
    price: 10,
    image: 'https://images.pexels.com/photos/3721941/pexels-photo-3721941.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'music'
  }
];

export function MerchandiseSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'payment' | 'details' | 'confirmation'>('cart');
  const [selectedPayment, setSelectedPayment] = useState<'paypal' | 'bank' | 'mpesa' | null>(null);
  const [customerDetails, setCustomerDetails] = useState({
    email: '',
    name: '',
    phone: '',
    address: '',
    city: '',
    country: ''
  });
  const [orderNumber, setOrderNumber] = useState('');

  const addToCart = (product: Product, size?: string) => {
    const existingItem = cart.find(item => 
      item.id === product.id && item.selectedSize === size
    );

    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id && item.selectedSize === size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1, selectedSize: size }]);
    }
  };

  const removeFromCart = (productId: number, size?: string) => {
    setCart(cart.filter(item => 
      !(item.id === productId && item.selectedSize === size)
    ));
  };

  const updateQuantity = (productId: number, quantity: number, size?: string) => {
    if (quantity === 0) {
      removeFromCart(productId, size);
    } else {
      setCart(cart.map(item =>
        item.id === productId && item.selectedSize === size
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const handleAddToCart = (product: Product) => {
    if (product.sizes && product.sizes.length > 0) {
      setSelectedProduct(product);
      setShowSizeModal(true);
    } else {
      addToCart(product);
    }
  };

  const handleSizeSelection = (size: string) => {
    if (selectedProduct) {
      addToCart(selectedProduct, size);
      setShowSizeModal(false);
      setSelectedProduct(null);
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = () => {
    setShowCart(false);
    setCheckoutStep('payment');
  };

  const handlePaymentSelection = (payment: 'paypal' | 'bank' | 'mpesa') => {
    setSelectedPayment(payment);
    setCheckoutStep('details');
  };

  const handleOrderSubmit = () => {
    const orderNum = 'ORD-' + Date.now().toString().slice(-6);
    setOrderNumber(orderNum);
    setCheckoutStep('confirmation');
    // Here you would integrate with actual payment processors
  };

  const resetCheckout = () => {
    setCheckoutStep('cart');
    setSelectedPayment(null);
    setCustomerDetails({
      email: '',
      name: '',
      phone: '',
      address: '',
      city: '',
      country: ''
    });
    setOrderNumber('');
    setCart([]);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="relative bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-full hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
      >
        <ShoppingCart className="w-5 h-5" />
        Merch
        {getTotalItems() > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            {getTotalItems()}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {checkoutStep === 'cart' ? 'Merchandise Store' :
             checkoutStep === 'payment' ? 'Select Payment Method' :
             checkoutStep === 'details' ? 'Order Details' :
             'Order Confirmation'}
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {checkoutStep === 'cart' && (
            <div className="flex gap-8">
              {/* Products Grid */}
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product.id} className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-800">{product.name}</h3>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {product.category}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-gray-900">${product.price}</span>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart Sidebar */}
              <div className="w-80 bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Shopping Cart</h3>
                  <span className="text-sm text-gray-600">{getTotalItems()} items</span>
                </div>

                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Your cart is empty</p>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {cart.map((item, index) => (
                        <div key={`${item.id}-${item.selectedSize || 'no-size'}-${index}`} className="flex items-center gap-3 bg-white p-3 rounded-lg">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{item.name}</h4>
                            {item.selectedSize && (
                              <p className="text-xs text-gray-600">Size: {item.selectedSize}</p>
                            )}
                            <p className="text-sm font-semibold">${item.price}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedSize)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedSize)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold">Total:</span>
                        <span className="text-xl font-bold">${getTotalPrice()}</span>
                      </div>
                      <button
                        onClick={handleCheckout}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Proceed to Checkout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {checkoutStep === 'payment' && (
            <div className="max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                  onClick={() => handlePaymentSelection('paypal')}
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
                >
                  <CreditCard className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="font-semibold mb-2">PayPal</h3>
                  <p className="text-sm text-gray-600">Secure online payment</p>
                </button>

                <button
                  onClick={() => handlePaymentSelection('bank')}
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-center"
                >
                  <Building className="w-12 h-12 mx-auto mb-4 text-green-600" />
                  <h3 className="font-semibold mb-2">Bank Transfer</h3>
                  <p className="text-sm text-gray-600">Direct bank payment</p>
                </button>

                <button
                  onClick={() => handlePaymentSelection('mpesa')}
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all text-center"
                >
                  <Smartphone className="w-12 h-12 mx-auto mb-4 text-orange-600" />
                  <h3 className="font-semibold mb-2">M-Pesa</h3>
                  <p className="text-sm text-gray-600">Mobile money payment</p>
                </button>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setCheckoutStep('cart')}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Back to Cart
                </button>
              </div>
            </div>
          )}

          {checkoutStep === 'details' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold mb-2">Payment Method: {selectedPayment?.toUpperCase()}</h3>
                <p className="text-sm text-gray-600">Total: ${getTotalPrice()}</p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleOrderSubmit(); }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={customerDetails.email}
                      onChange={(e) => setCustomerDetails({...customerDetails, email: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={customerDetails.name}
                      onChange={(e) => setCustomerDetails({...customerDetails, name: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={customerDetails.phone}
                    onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input
                    type="text"
                    value={customerDetails.address}
                    onChange={(e) => setCustomerDetails({...customerDetails, address: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <input
                      type="text"
                      value={customerDetails.city}
                      onChange={(e) => setCustomerDetails({...customerDetails, city: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Country</label>
                    <input
                      type="text"
                      value={customerDetails.country}
                      onChange={(e) => setCustomerDetails({...customerDetails, country: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-6">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('payment')}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Complete Order
                  </button>
                </div>
              </form>
            </div>
          )}

          {checkoutStep === 'confirmation' && (
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-green-50 p-8 rounded-xl mb-6">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-green-800 mb-2">Order Confirmed!</h3>
                <p className="text-green-700">Order Number: {orderNumber}</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg mb-6 text-left">
                <h4 className="font-semibold mb-4">Next Steps:</h4>
                {selectedPayment === 'paypal' && (
                  <p className="text-sm text-gray-600">
                    You will receive a PayPal payment link via email shortly. Please complete the payment to process your order.
                  </p>
                )}
                {selectedPayment === 'bank' && (
                  <div className="text-sm text-gray-600">
                    <p className="mb-2">Please transfer ${getTotalPrice()} to:</p>
                    <p><strong>Bank:</strong> Example Bank</p>
                    <p><strong>Account:</strong> 1234567890</p>
                    <p><strong>Reference:</strong> {orderNumber}</p>
                  </div>
                )}
                {selectedPayment === 'mpesa' && (
                  <p className="text-sm text-gray-600">
                    You will receive an M-Pesa payment prompt on your phone shortly. Please complete the payment to process your order.
                  </p>
                )}
              </div>

              <button
                onClick={resetCheckout}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Size Selection Modal */}
      {showSizeModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Select Size for {selectedProduct.name}</h3>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {selectedProduct.sizes?.map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeSelection(size)}
                  className="p-3 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center font-medium"
                >
                  {size}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowSizeModal(false)}
              className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}