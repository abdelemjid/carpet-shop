import CartItem from "@/components/cart/CartItem";
import { useCartContext } from "@/contexts/CartContext";

const Cart = () => {
  const { cart } = useCartContext();

  if (!cart || cart.length === 0) {
    return (
      <div className="flex justify-center items-center p-5 rounded-md border border-indigo-500/50 bg-indigo-500/10">
        There is no order yet
      </div>
    );
  }

  return (
    <div className="my-10 flex flex-col gap-2 justify-center items-center">
      {cart.map((item, _) => (
        <CartItem order={item} key={_} />
      ))}
    </div>
  );
};

export default Cart;
