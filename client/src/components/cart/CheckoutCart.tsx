import { useCartContext } from "@/contexts/CartContext";
import { Card } from "../ui/card";
import { useQuery } from "@tanstack/react-query";
import type { CheckoutResponse } from "@/types/checkout.type";
import { Separator } from "@radix-ui/react-select";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import loading from "@/assets/loading.svg";

const API_BASE_URL = "http://localhost:5000";

interface Props {
  handleCheckout: () => void;
}

const CheckoutCart = ({ handleCheckout }: Props) => {
  const { selectedItems } = useCartContext();

  const { data: calculation, isLoading } = useQuery({
    queryKey: ["cart-checkout", selectedItems],
    queryFn: async (): Promise<CheckoutResponse | null> => {
      const queryParams = new URLSearchParams();

      for (let id of selectedItems) queryParams.append("id", id);

      const response = await fetch(
        `${API_BASE_URL}/api/checkout/calculate?${queryParams.toString()}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) return null;

      return result;
    },
  });

  return (
    <Card className="w-full p-5 flex flex-col gap-3">
      {isLoading ? (
        <div className="w-full flex justify-center items-center">
          <img src={loading} className="w-[50px]" />
        </div>
      ) : (
        <div className="w-full flex flex-col gap-10 justify-between items-center">
          {/* Total Products & Price  */}
          <div className="w-full flex flex-col md:flex-row gap-5">
            {/* Total Products */}
            <div className="flex-1 flex flex-row justify-between items-center">
              <h3 className="">Total products:</h3>
              <p className="">{calculation?.totalItems}</p>
            </div>
            <Separator className="w-full h-[2px] md:w-[2px] md:h-[30px] dark:bg-gray-50/15 bg-gray-950/15" />
            {/* Total Price */}
            <div className="flex-1 flex flex-row justify-between items-center">
              <h3 className="">Total price:</h3>
              <p className="">${calculation?.totalPrice}</p>
            </div>
            <Separator className="w-full h-[2px] md:w-[2px] md:h-[30px] dark:bg-gray-50/15 bg-gray-950/15" />
          </div>

          {/* Not found Products */}
          {calculation?.notFoundProducts &&
            calculation?.notFoundProducts?.length > 0 && (
              <div className="w-full flex flex-col gap-2 p-3 rounded-md border border-red-500/80 bg-red-500/10">
                <h3 className="text-sm font-semibold">Not found products:</h3>
                {calculation?.notFoundProducts.map((product, _) => (
                  <span className="font-xs" key={`product-${_}`}>
                    {product}
                  </span>
                ))}
              </div>
            )}

          {/* Insufficient Stock Products */}
          {calculation?.insufficientStock &&
            calculation?.insufficientStock?.length > 0 && (
              <div className="w-full flex flex-col gap-2 p-3 rounded-md border border-red-500/80 bg-red-500/10">
                <h3 className="text-sm font-semibold">Insufficient Stock:</h3>
                {calculation?.insufficientStock.map((product, _) => (
                  <span className="font-xs" key={`product-${_}`}>
                    {product}
                  </span>
                ))}
              </div>
            )}

          {/* Checkout Button */}
          <Button onClick={handleCheckout} className="self-end cursor-pointer">
            <ArrowRight /> Checkout
          </Button>
        </div>
      )}
    </Card>
  );
};

export default CheckoutCart;
