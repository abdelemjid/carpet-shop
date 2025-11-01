import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import loading from "@/assets/loading.svg";
import * as apiClient from "@/apiClient";
import { useState } from "react";
import ZoomImage from "@/components/products/ZoomImage";
import {
  ArrowLeft,
  ArrowRight,
  CheckLine,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartContext } from "@/contexts/CartContext";

const ProductPreview = () => {
  const { productId } = useParams();
  const { addOrder, deleteOrder, getOrder } = useCartContext();
  const [currentImage, setCurrentImage] = useState(0);
  const [orderQuantity, setOrderQuantity] = useState<number>(
    (productId && getOrder(productId)?.orderQuantity) || 0
  );

  const { data: product, isLoading } = useQuery({
    queryKey: [`product-${productId}`],
    queryFn: () => apiClient.getProduct(productId || ""),
  });

  if (isLoading) {
    return (
      <div className="w-full h-[calc(100vh-73px)] flex justify-center items-center">
        <img src={loading} className="w-[35px]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-10 my-10">
      {/* Product Images */}
      <div className="w-full md:w-[360px] relative">
        <ZoomImage src={product?.images.at(currentImage) || ""} />
        {/* Left Arrow */}
        <button
          onClick={() => {
            if (currentImage > 0) setCurrentImage(currentImage - 1);
          }}
          className="w-[45px] h-[45px] absolute -left-5 top-[50%] -translate-y-[50%] rounded-full bg-indigo-500/50 hover:bg-indigo-500/90 transition-colors ease-in-out duration-150 shadow-black/50 shadow-md"
        >
          <ArrowLeft size={30} className="mx-auto" />
        </button>
        {/* Right Arrow */}
        <button
          onClick={() => {
            if (product?.images && currentImage < product?.images.length - 1)
              setCurrentImage(currentImage + 1);
          }}
          className="w-[45px] h-[45px] absolute -right-5 top-[50%] -translate-y-[50%] rounded-full bg-indigo-500/50 hover:bg-indigo-500/90 transition-colors ease-in-out duration-150 shadow-black/50 shadow-md"
        >
          <ArrowRight size={30} className="mx-auto" />
        </button>
      </div>
      {/* Product Info */}
      <div className="flex flex-col gap-3">
        {/* Product Name */}
        {<h3 className="text-md font-semibold">{product?.name}</h3>}
        {/* Product Description */}
        <p className="text-sm max-w-[500px]">{product?.description}</p>
        {/* Category */}
        <div className="flex flex-row gap-5 items-center">
          <span className="text-sm font-semibold">Category:</span>
          <p className="text-sm font-bold uppercase">{product?.category}</p>
        </div>
        {/* Size */}
        <div className="flex flex-row gap-5 items-center">
          <span className="text-sm font-semibold">Size:</span>
          <p className="text-sm font-bold">{`${product?.width}x${product?.height} cm`}</p>
        </div>
        {/* Publication Date */}
        <div className="flex flex-row gap-5 items-center">
          <span className="text-sm font-semibold">Price:</span>
          <p className="text-sm font-bold">
            {product?.price && `$${product?.price}`}
          </p>
        </div>
        {/* Ordering */}
        <div className="mt-5 p-5 rounded-md flex flex-col gap-5 border border-indigo-500/80 bg-indigo-500/10">
          {/* Total Price */}
          <div className="w-full flex flex-row justify-between items-center">
            <span className="text-sm font-semibold">Total price:</span>
            <p className="text-lg font-bold">
              {product?.price && `$${orderQuantity * product?.price}`}
            </p>
          </div>
          {/* Order Quantity */}
          <div className="mt-5 flex flex-col md:flex-row md:justify-between items-center gap-2">
            {/* Quantity */}
            <div className="w-fit flex flex-row gap-2 items-center justify-center">
              <Button
                onClick={() =>
                  orderQuantity > 0 && setOrderQuantity(orderQuantity - 1)
                }
              >
                <Minus size={25} />
              </Button>
              <p className="text-lg p-1 text-center font-bold min-w-[80px] border-2 border-gray-900/20 dark:border-gray-50/20 rounded-md">
                {orderQuantity}
              </p>
              <Button
                onClick={() =>
                  orderQuantity < 9999 && setOrderQuantity(orderQuantity + 1)
                }
              >
                <Plus size={25} />
              </Button>
            </div>
            <div className="flex flex-row justify-between items-center gap-2">
              {/* Add To Cart */}
              <Button
                disabled={orderQuantity <= 0}
                onClick={() => product && addOrder(product, orderQuantity)}
                className="flex flex-row gap-2 justify-center items-center"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </Button>
              {/* Delete */}
              <Button onClick={() => productId && deleteOrder(productId)}>
                <Trash2 size={20} className="text-red-500" />
              </Button>
            </div>
          </div>
          {/* Ordering Buttons */}
          <div className="mt-5 flex flex-row gap-3 justify-center items-center">
            {/* Buy Now */}
            <Button
              disabled={orderQuantity <= 0}
              className="w-full flex flex-row gap-2 justify-center items-center bg-green-500 hover:bg-green-400"
            >
              <CheckLine size={20} />
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPreview;
