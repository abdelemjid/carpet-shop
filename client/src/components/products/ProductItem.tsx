import type { Product } from "@/types/product.type";
import { ALargeSmall, Box, Ruler, ShoppingBasket } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

interface Props {
  product: Product | null;
  handleAddToCart: (product: Product, quantity?: number | undefined) => void;
}

export const ProductItem = ({ product, handleAddToCart }: Props) => {
  return (
    <div className="max-w-[280px] flex flex-col gap-3">
      {/* Product Image */}
      <img
        src={product?.images && product?.images?.at(0)}
        alt="product image"
        className="w-full h-[350px] bg-cover mx-auto"
      />
      {/* Product Name & Price */}
      <div className="w-full flex flex-row justify-between">
        <Link to={`/products/${product?._id}`}>
          <p className="text-xs font-bold cursor-pointer line-clamp-1">
            {product?.name}
          </p>
        </Link>
        <p className="text-xs font-semibold">${product?.price}</p>
      </div>
      {/* Produce Description  */}
      <p className="w-full text-xs line-clamp-3">{product?.description}</p>
      {/* Product Quantity */}
      <div className="flex flex-row justify-between">
        {/* Category */}
        <div className="flex flex-row gap-1" title="Category">
          <ALargeSmall size={18} />
          {product?.category && (
            <p className="text-xs font-semibold">
              {product?.category.toUpperCase()}
            </p>
          )}
        </div>
        {/* Size */}
        <div className="flex flex-row gap-1" title="Size">
          <Ruler size={18} />
          {product?.width && (
            <p className="text-xs font-semibold">
              {`${product?.width}x${product?.height}`}
            </p>
          )}
        </div>
        {/* Quantity */}
        <div className="flex flex-row gap-1" title="Quantity">
          <Box size={18} />
          {product?.quantity && (
            <p className="text-xs font-semibold">{product?.quantity}</p>
          )}
        </div>
      </div>
      {/* Add To Cart */}
      <Button
        onClick={() => product && handleAddToCart(product)}
        className="p-0"
      >
        <ShoppingBasket size={18} /> Add to Cart
      </Button>
    </div>
  );
};
