import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";


const PlaceOrder = () => {
  const { getTotalCartAmount, food_list, token, cartItems, url } =
    useContext(StoreContext);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHndler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };
  //to check onchangehandler
  // useEffect(()=>{
  //   console.log(data);
  // })
  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });
    // console.log(orderitems);
    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
    };
    let response = await axios.post(url + "/api/order/place", orderData, {
      headers: { token },
    });
    if (response.data.success) {
      const { session_url } = response.data;
      window.location.replace(session_url);
    } else {
      alert("Error");
    }
  };
  const navigate = useNavigate();

  useEffect(()=>{
    if(!token){
      navigate('/cart')
      alert("Please log in to continue to checkout.");
    }
    else if(getTotalCartAmount()===0){
      alert('Your cart is empty. Add items using the + button to continue.!')
      navigate('/cart')
    }
  },[token])

  return (
    <form className="place-order" onSubmit={placeOrder}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fileds">
          <input
            required
            name="firstName"
            onChange={onChangeHndler}
            value={data.firstName}
            type="text"
            placeholder="First name"
          />
          <input
            required
            name="lastName"
            onChange={onChangeHndler}
            value={data.lastName}
            type="text"
            placeholder="Last name"
          />
        </div>
        <input
          required
          name="email"
          onChange={onChangeHndler}
          value={data.email}
          type="email"
          placeholder="Email"
        />
        <input
          required
          name="street"
          onChange={onChangeHndler}
          value={data.street}
          type="text"
          placeholder="Street"
        />
        <div className="multi-fileds">
          <input
            required
            name="city"
            onChange={onChangeHndler}
            value={data.city}
            type="text"
            placeholder="City"
          />
          <input
            required
            name="state"
            onChange={onChangeHndler}
            value={data.state}
            type="text"
            placeholder="State"
          />
        </div>
        <div className="multi-fileds">
          <input
            required
            name="zipcode"
            onChange={onChangeHndler}
            value={data.zipcode}
            type="text"
            placeholder="Zip Code"
          />
          <input
            required
            name="country"
            onChange={onChangeHndler}
            value={data.country}
            type="text"
            placeholder="Country"
          />
        </div>
        <input
          required
          name="phone"
          onChange={onChangeHndler}
          value={data.phone}
          type="text"
          placeholder="Phone Number"
        />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>{getTotalCartAmount()} Birr</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>{getTotalCartAmount() === 0 ? 0 : 2} Birr</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                {getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2} Birr
              </b>
            </div>
          </div>
          <button type="submit">PROCEED TO PEYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
