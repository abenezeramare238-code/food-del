import { createContext, useEffect, useState } from "react";
export const StoreContext = createContext(null);
import axios from'axios'

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url= "http://localhost:4000"
  const [token,setToken] = useState("")
  const [food_list,setFoodlist] = useState([])

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if (token) {
    await axios.post(url +"/api/cart/add",{itemId},{headers:{token}})
  }
  };
  
  const removeFromCart =async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (token) {
      await axios.post(url + "/api/cart/remove",{itemId},{headers:{token}});
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };
//to fetch the food items from the database
  const fetchFoodlist = async () => {
  try {
    const response = await axios.get(url + "/api/food/list");
    setFoodlist(response.data.data);
  } catch (err) {
    console.error("Failed to fetch food list:", err);
  }
};

const loadCartData = async (token)=>{
  const response = await axios.post(url + "/api/cart/get",{},{headers:{token}});
  if (response?.data?.success && response.data.cartData) {
    setCartItems(response.data.cartData);
  } else {
    setCartItems({});
  }
}
 

  useEffect(()=>{
    // to desplay the food lists in the browser and 
      async function loadData(){
        await fetchFoodlist();
        // to stay loggedin
            if (localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"));
            await loadCartData(localStorage.getItem("token"));
        }
      }
      loadData();
  },[])

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
export default StoreContextProvider;
