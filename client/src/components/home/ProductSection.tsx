import { useQuery } from "@tanstack/react-query";
import * as apiClient from "@/apiClient";
import loading from "@/assets/loading.svg";
import { ProductItem } from "../products/ProductItem";

const ProductSection = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: apiClient.getProducts,
  });

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <img src={loading} className="w-[25px]" />
      </div>
    );
  }

  return (
    <div className="grid [grid-template-columns:repeat(auto-fit,minmax(230px,1fr))] gap-5">
      {data?.data &&
        data.data?.map((product, _) => <ProductItem product={product} />)}
    </div>
  );
};

export default ProductSection;
