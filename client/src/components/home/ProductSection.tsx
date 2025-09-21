import { useEffect, useState } from "react";

interface ProductType {
  _id?: string;
  name?: string;
  description?: string;
  quantity?: number;
  price?: number;
  images?: string[];
}

const ProductItem = ({
  name,
  description,
  quantity,
  price,
  images,
}: ProductType) => {
  return (
    <div className="flex flex-col gap-3">
      {/* Product Image */}
      <img
        src={images && images[0]}
        alt="product image"
        className="w-[250px] bg-cover"
      />
      {/* Product Name & Price */}
      <div className="w-full flex flex-row justify-between">
        <p className="text-sm">{name}</p>
        <p className="text-lg">${price}</p>
      </div>
      {/* Produce Description  */}
      <p className="w-full text-sm text-gray-50/50">{description}</p>
      {/* Product Quantity */}
      {quantity && <p className="">0/{quantity}</p>}
    </div>
  );
};

const ProductSection = () => {
  const [products, setProducts] = useState<ProductType[] | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("/api/products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Error fetching products!");

      const data = await response.json();

      console.log(data.data);

      setProducts(data.data as ProductType[]);
    };

    fetchProducts();
  }, []);

  return (
    <div className="mt-10 flex flex-row gap-5 flex-wrap justify-center">
      {products && products.map((product, _) => <ProductItem {...product} />)}
    </div>
  );
};

export default ProductSection;
