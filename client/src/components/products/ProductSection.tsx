import loading from "@/assets/loading.svg";
import { ProductItem } from "../products/ProductItem";
import type { Product, ProductsResponse } from "@/types/product.type";

interface Props {
  data: ProductsResponse | null | void;
  isLoading: boolean;
  addOrder: (order: Product, quantity?: number) => void;
}

const ProductSection = ({ data, isLoading, addOrder }: Props) => {
  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <img src={loading} className="w-[25px]" />
      </div>
    );
  }

  if ((!data || data?.data?.length === 0) && !isLoading) {
    return (
      <div className="mb-30 p-5 rounded-md border border-indigo-500 bg-indigo-500/10 text-center">
        No product found
      </div>
    );
  }

  return (
    <div className="my-10 grid [grid-template-columns:repeat(auto-fit,minmax(230px,1fr))] gap-5">
      {data?.data &&
        data.data?.map((product, _) => (
          <ProductItem
            product={product}
            handleAddToCart={addOrder}
            key={product?._id}
          />
        ))}
    </div>
  );
};

export default ProductSection;
