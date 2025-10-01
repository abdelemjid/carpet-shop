import {
  BadgeCent,
  ChartColumnStacked,
  Package,
  RulerDimensionLine,
} from "lucide-react";
import type { Product } from "../types/product.type";
import { Link } from "react-router-dom";
import { useImagePreview } from "../contexts/ImagePreviewContext";

const ProductItem = ({ product }: { product: Product }) => {
  const { setImages, setDisplayed } = useImagePreview();

  return (
    <div className="w-full flex flex-col justify-center items-center py-2 px-5 rounded-md shadow-md bg-gray-800/20 border border-gray-50/10 transition-all duration-100 ease-in-out hover:bg-gray-800/50">
      {/* Product Image */}
      <div className="mr-5">
        <img
          src={product.images[0]}
          alt="Product Image"
          className="w-[150px] object-cover cursor-pointer"
          onClick={() => {
            setImages(product.images);
            setDisplayed(true);
          }}
        />
      </div>
      {/* Product Info */}
      <div className="w-full flex flex-col gap-2 justify-between mt-2">
        <Link to={`${product._id}`}>
          <h2 className="text-lg font-semibold">{product.name}</h2>
        </Link>
        <p className="text-sm">
          {product.description.length > 250
            ? `${product.description.slice(0, 250)}...`
            : product.description}
        </p>
        <div className="w-full self-center flex flex-row flew-wrap justify-between items-center mt-2">
          {/* Category */}
          <div className="flex flex-row justify-center items-center gap-1">
            <ChartColumnStacked size={15} />
            <span className="text-sm">{product.category.toUpperCase()}</span>
          </div>
          {/* Size */}
          <div className="flex flex-row justify-center items-center gap-1">
            <RulerDimensionLine size={15} />
            <span className="text-sm">
              {product.height} / {product.width}
            </span>
          </div>
          {/* Quantity */}
          <div className="flex flex-row justify-center items-center gap-1">
            <Package size={15} />
            <span className="text-sm">{product.quantity}</span>
          </div>
          {/* Price  */}
          <div className="flex flex-row justify-around items-center gap-1">
            <BadgeCent size={15} />
            <span className="text-">{product.price}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
