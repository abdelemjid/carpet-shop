import { ChartColumnStacked, Package } from "lucide-react";
import type { Product } from "@/types/product.type";
import { Link } from "react-router-dom";
import { useImagePreview } from "@/contexts/ImagePreviewContext";

const ProductItem = ({ product }: { product: Product }) => {
  const { setImages, setDisplayed } = useImagePreview();

  return (
    <div className="shadow-lg p-5 w-full flex flex-col justify-center items-center rounded-md transition-all duration-100 ease-in-out">
      {/* Product Image */}
      <div className="rounded-md overflow-hidden">
        <img
          src={product.images[0]}
          alt="Product Image"
          className="w-[300px] h-[380px] object-cover cursor-pointer"
          onClick={() => {
            setImages(product.images);
            setDisplayed(true);
          }}
        />
      </div>
      {/* Product Info */}
      <div className="w-[300px] flex flex-col justify-between mt-4">
        <div className="flex flex-row justify-between items-center gap-2">
          {/* Title */}
          <Link to={`${product._id}`}>
            <h2 className="text-sm font-semibold">{product.name}</h2>
          </Link>

          {/* Price  */}
          <span className="text-lg text-center font-semibold" title="Price">
            ${product.price}
          </span>
        </div>

        {/* Description */}
        <span
          className="text-xs dark:text-gray-50/80 text-gray-900/80 mt-2 line-clamp-2"
          title="Description"
        >
          {product.description}
        </span>

        <div className="w-full  flex flex-row justify-between items-center mt-2">
          {/* Category */}
          <div
            className="flex flex-row justify-center items-center gap-1"
            title="Category"
          >
            <ChartColumnStacked size={15} />
            <span className="text-sm dark:text-gray-50/80">
              {product.category.toUpperCase()}
            </span>
          </div>

          {/* Size */}
          <span
            className="text-sm dark:text-gray-50/80 text-center font-semibold"
            title="Size"
          >
            {product.width}x{product.height} cm
          </span>

          {/* Quantity */}
          <div
            className="flex flex-row justify-center items-center gap-1"
            title="Quantity"
          >
            <Package size={15} />
            <span className="text-sm dark:text-gray-50/80 ">
              {product.quantity}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
