import React from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import '../../styles/Cart.css';

const Cart = () => {
    const { cart, removeFromCart, clearCart, getCartTotal } = useCart();

    const handleCheckout = () => {
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }
        alert("Proceeding to checkout with total: ₹" + getCartTotal());
        // In real app, redirect to a payment gateway block
        clearCart();
    };

    return (
        <div className="cart-container">
            <div className="cart-header">
                <h1>Your Food Cart</h1>
                <p>Review your items and proceed to checkout</p>
            </div>

            {cart.length === 0 ? (
                <div className="empty-cart">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="empty-cart-icon">
                        <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <h2>Your cart is empty</h2>
                    <p>Looks like you haven't added any delicious food yet!</p>
                    <Link to="/home" className="browse-food-btn">Browse Food Reels</Link>
                </div>
            ) : (
                <div className="cart-content">
                    <div className="cart-items">
                        {cart.map((item) => (
                            <div key={item._id} className="cart-item-card">
                                <img
                                    src={item.thumbnail || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60"}
                                    alt={item.name || item.foodName}
                                    className="cart-item-img"
                                />
                                <div className="cart-item-details">
                                    <h3>{item.name || item.foodName}</h3>
                                    <p className="cart-item-desc">{item.description}</p>
                                    <span className="cart-item-price">₹{item.price || 0}</span>
                                </div>
                                <div className="cart-item-actions">
                                    <button
                                        className="remove-btn"
                                        onClick={() => removeFromCart(item._id)}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                            <line x1="10" y1="11" x2="10" y2="17"></line>
                                            <line x1="14" y1="11" x2="14" y2="17"></line>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h3>Order Summary</h3>
                        <div className="summary-row">
                            <span>Total Items</span>
                            <span>{cart.length}</span>
                        </div>
                        <div className="summary-row">
                            <span>Delivery Fee</span>
                            <span>₹40</span>
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-row total-row">
                            <span>Total</span>
                            <span>₹{getCartTotal() + 40}</span>
                        </div>

                        <button className="checkout-btn" onClick={handleCheckout}>
                            Checkout
                        </button>
                        <button className="clear-cart-btn" onClick={clearCart}>
                            Clear Cart
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
