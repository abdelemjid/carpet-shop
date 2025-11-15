import type { Product, ProductsResponse } from "@/types/product.type";
import loading from "@/assets/loading.svg";
import ProductItem from "./ProductItem";

interface Props {
  data: ProductsResponse | null | undefined;
  isLoading: boolean;
}

const ProductsSection = ({ data, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="w-full h-[200px] flex justify-center items-center">
        <img src={loading} className="w-[35px] h-[35px]" />
      </div>
    );
  }

  if (!data || !data?.data || data?.data?.length === 0) {
    return (
      <div className="w-full sm:h-[calc(100vh-450px)] md:h-[calc(100vh-470px)] lg:h-[calc(100vh-205px)] flex flex-col justify-start items-center">
        <span className="w-full text-center border border-gray-50/30 rounded-md p-5 bg-gray-800/20">
          No products yet
        </span>
      </div>
    );
  }

  return (
    <div className="w-full grid [grid-template-columns:repeat(auto-fit,minmax(330px,1fr))] gap-5 my-10">
      {data?.data &&
        data.data.map((product: Product) => (
          <ProductItem product={product} key={product._id} />
        ))}
    </div>
  );
};

export default ProductsSection;
