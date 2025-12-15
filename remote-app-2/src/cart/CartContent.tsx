import { useSelector, useDispatch } from "react-redux";
import { addToCart, type CartState } from "../store/cartSlice";
import { useInjectReducers } from "../hooks/useInjectReducers";
import cartSlice from "../store/cartSlice";

// const useSharedUtilsUtils = async () => {
//   const utils = await import("sharedUtils/utils");
//   return utils;
// };

interface RootState {
  user: { count: number };
  cart: CartState;
}

function CartContent() {
  const count = useSelector((state: RootState) => state.user.count);
  const { items, total } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();

  const handleAddItem = async () => {
    dispatch(
      addToCart({
        id: new Date(Date.now()).toISOString(),
        name: `Product-${items.length + 1}`,
        price: Math.floor(Math.random() * 100),
      })
    );
    // const data = await useSharedUtilsUtils().getUserMessage();
    // console.log(data);
  };

  return (
    <div>
      <h2>Shopping Cart</h2>
      <p>Total: ${total}</p>
      <button onClick={handleAddItem}>Add Item</button>
      {items.map((item) => (
        <div key={item.id}>
          {item.name} - ${item.price}
        </div>
      ))}

      <p>Inside Count: {count}</p>
    </div>
  );
}

function CartContentWrapper() {
  const { isReady } = useInjectReducers(cartSlice);
  console.count("Cart content" + isReady);
  if (!isReady) {
    console.count("Cart content is not ready");
    return <div>Loading cart...</div>;
  }
  console.count("Cart content is ready");
  return <CartContent />;
}

export default CartContentWrapper;
