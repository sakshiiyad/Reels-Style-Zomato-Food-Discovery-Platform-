import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    // Initialize cart from localStorage so it persists across refreshes
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('zomato_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('zomato_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item) => {
        setCart((prevCart) => {
            // Check if item is already in cart
            const existingItemIndex = prevCart.findIndex(cartItem => cartItem._id === item._id);

            if (existingItemIndex >= 0) {
                // Item exists, just increment quantity (if we had quantities, but for now we just show a toast or increase qty)
                toast.info(`${item.name || item.foodName} is already in your cart!`);
                return prevCart;
            } else {
                toast.success(`${item.name || item.foodName} added to cart!`);
                return [...prevCart, { ...item, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (itemId) => {
        setCart((prevCart) => prevCart.filter(item => item._id !== itemId));
        toast.info("Item removed from cart");
    };

    const clearCart = () => {
        setCart([]);
        toast.info("Cart cleared");
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => {
            const price = item.price || 0;
            return total + (price * (item.quantity || 1));
        }, 0);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getCartTotal }}>
            {children}
        </CartContext.Provider>
    );
};
