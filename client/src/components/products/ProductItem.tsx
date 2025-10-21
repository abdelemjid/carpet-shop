import type { Product } from "@/types/product.type";

interface Props {
  product: Product | null;
}
export const ProductItem = ({ product }: Props) => {
  return (
    <div className="flex flex-col gap-3">
      {/* Product Image */}
      <img
        src={product?.images && product?.images?.at(0)}
        alt="product image"
        className="w-full h-[350px] bg-cover mx-auto"
      />
      {/* Product Name & Price */}
      <div className="w-full flex flex-row justify-between">
        <p className="text-xs">{product?.name}</p>
        <p className="text-xs font-semibold">${product?.price}</p>
      </div>
      {/* Produce Description  */}
      <p className="w-full text-xs line-clamp-3">{product?.description}</p>
      {/* Product Quantity */}
      {product?.quantity && <p className="">0/{product?.quantity}</p>}
    </div>
  );
};
