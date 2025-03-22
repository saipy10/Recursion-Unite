import React, { useState } from 'react';
import { MdOutlineCancel } from "react-icons/md"; 
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai"; 
import { useStateContext } from "../Context/ContextProvider"; 
import { Button } from "."; 
import { cartData,ordersData } from "../data/dummy"; // Import cart data from dummy file
const AddData = ordersData.map(item => ({
  image: item.ProductImage,                      // Product image
  name: item.OrderItems,                         // Product name
  category: "Product",                           // Category set to "Product"
  price: `$${item.TotalAmount.toFixed(2)}`,       // Price formatted with "$" and 2 decimal places
}));


const Cart = () => {
  // Initialize cart state with dummy data
  const [cartItems, setCartItems] = useState(
    cartData.map(item => ({
      ...item,
      id: Date.now() + Math.random(), // Add unique id to each item
      quantity: 1,
      price: parseFloat(item.price.replace('$', '')), // Convert string price to numeric value
    }))
  );

  const { currentColor, handleClose } = useStateContext();

  // Function to increase item quantity
  const increaseQuantity = (id) => {
    setCartItems(cartItems.map(item => 
      item.id === id 
        ? { ...item, quantity: item.quantity + 1 } 
        : item
    ));
  };

  // Function to decrease item quantity
  const decreaseQuantity = (id) => {
    setCartItems(cartItems.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.max(0, item.quantity - 1) } 
        : item
    ).filter(item => item.quantity > 0));
  };

  // Function to remove item completely
  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // Calculate total price
  const subTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const taxRate = Math.random() * 0.20; // Generates a random number between 0 and 0.35 (which is 0% to 35%)
const Amount_Money = (subTotal * (1 + taxRate)).toFixed(2); // Add the tax to the subtotal


  // Function to add new item from AddData to the cart
  const addNewItem = () => {
    // Select a random item from AddData
    const randomItem = AddData[Math.floor(Math.random() * AddData.length)];
  
    // Add the selected item to the cart
    const newItem = {
      ...randomItem,
      id: Date.now() + Math.random(), // Unique id
      quantity: 1,
      price: parseFloat(randomItem.price.replace('$', '')), // Convert price back to numeric
    };
  
    // Add the new item to the cart
    setCartItems([...cartItems, newItem]);
  };
  

  return (
    <div className="bg-half-transparent w-full fixed nav-item top-0 right-0">
      <div className="float-right h-screen duration-1000 ease-in-out dark:text-gray-200 transition-all dark:bg-[#484B52] bg-white md:w-400 p-8">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-lg">Shopping Cart</p>
          
          <button 
            onClick={() => handleClose("cart")}  
            className="text-2xl p-3 hover:drop-shadow-xl hover:bg-light-gray" 
            style={{ color: "rgb(153, 171, 180)", borderRadius: "50%" }}  
          >
            <MdOutlineCancel />
          </button>
        </div>

        {/* Add New Item Button */}
        <button 
         onClick={addNewItem}
          className="mt-4 mb-4 p-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105"
        >
        Add New Item
        </button>


        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center leading-8 gap-5 border-b-1 border-color dark:border-gray-600 p-4">
            <img className="rounded-lg h-80 w-24" src={item.image} alt={item.name} />
            <div className="flex-grow">
              <p className="font-semibold">{item.name}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold">
                {item.category}
              </p>
              <div className="flex gap-4 mt-2 items-center">
                <p className="font-semibold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                <div className="flex items-center border-1 border-r-0 border-color rounded">
                  <button 
                    onClick={() => decreaseQuantity(item.id)}
                    className="p-2 border-r-1 dark:border-gray-600 border-color text-red-600"
                  >
                    <AiOutlineMinus />
                  </button>
                  <p className="p-2 border-r-1 border-color dark:border-gray-600 text-green-600">
                    {item.quantity}
                  </p>
                  <button 
                    onClick={() => increaseQuantity(item.id)}
                    className="p-2 border-r-1 border-color dark:border-gray-600 text-green-600"
                  >
                    <AiOutlinePlus />
                  </button>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-red-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <div className="mt-3 mb-3">
          <div className="flex justify-between items-center">
            <p className="text-gray-500 dark:text-gray-200">Sub Total</p>
            <p className="font-semibold">${subTotal.toFixed(2)}</p>
          </div>
          <div className="flex justify-between items-center mt-3">
            <p className="text-gray-500 dark:text-gray-200">Total</p>
            <p className="font-semibold">${Amount_Money}</p>
          </div>
        </div>
        
        <div className="mt-5">
          <Button 
            color="white" 
            bgColor={currentColor} 
            text="Place Order" 
            borderRadius="10px" 
            width="full" 
          />
        </div>
      </div>
    </div>
  );
};

export default Cart;
