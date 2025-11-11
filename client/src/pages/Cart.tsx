import CartItem from "@/components/cart/CartItem";
import CheckoutCart from "@/components/cart/CheckoutCart";
import { useAuth } from "@/contexts/AuthContext";
import { useCartContext } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { isAuthenticated } = useAuth();
  const { cart, selectedItems } = useCartContext();
  const navigate = useNavigate();

  const handleValidateCheckout = () => {
    const url = new URLSearchParams();
    for (const id of selectedItems) url.append("id", id);

    navigate(`/checkout?${url.toString()}`);
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="flex justify-center items-center p-5 rounded-md border border-indigo-500/50 bg-indigo-500/10">
        There is no order yet
      </div>
    );
  }

  return (
    <div className="my-10 flex flex-col gap-8">
      {/* Cart Items */}
      <div className="flex flex-col gap-2 justify-center items-center">
        {cart.map((item, _) => (
          <CartItem order={item} key={_} />
        ))}
      </div>
      {/* Checkout Cart */}
      {selectedItems && selectedItems.length > 0 && isAuthenticated && (
        <CheckoutCart handleCheckout={handleValidateCheckout} />
      )}
    </div>
  );
};

export default Cart;
