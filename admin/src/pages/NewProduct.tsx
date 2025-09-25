import { useForm, type AnyFieldApi } from "@tanstack/react-form";
import { Upload, X } from "lucide-react";
import { useState } from "react";
import * as apiClient from "../apiClient";

const FieldInfo = ({ field }: { field: AnyFieldApi }) => {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em>{field.state.meta.errors.join(", ")}</em>
      ) : null}
    </>
  );
};

export type Category = "s" | "m" | "l";

const NewProduct = () => {
  const [images, setImages] = useState<File[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      height: 0,
      width: 0,
      price: 0,
      quantity: 0,
      category: "l",
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      formData.append("name", value.name);
      formData.append("description", value.description);
      formData.append("category", value.category);
      formData.append("price", value.price.toString());
      formData.append("quantity", value.quantity.toString());
      formData.append("width", value.width.toString());
      formData.append("height", value.height.toString());
      images.map((image) => {
        formData.append("images", image);
      });

      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const result = await apiClient.newProduct(formData);
      console.log(result);
    },
  });

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="container">
        <div className="bg-gray-50/20 backdrop-blur-md border border-gray-50/50 rounded-lg p-5 mx-auto lg:max-w-[80%]">
          {/* Form Heading */}
          <h1 className="text-2xl mb-5">New Product</h1>
          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <div>
              {/* Product Name */}
              <form.Field
                name="name"
                validators={{
                  onChange: ({ value }) =>
                    !value
                      ? "Product name required!"
                      : value.length < 3
                      ? "Product name must be at least 3 characters"
                      : undefined,
                  onChangeAsyncDebounceMs: 500,
                  onChangeAsync: async ({ value }) => {
                    await new Promise((resolve) => setTimeout(resolve, 500));
                    return (
                      value.includes("error") &&
                      'No "error" allowed in product name'
                    );
                  },
                }}
                children={(field) => {
                  return (
                    <div className="flex flex-col">
                      <label htmlFor={field.name} className="text-sm">
                        Name
                      </label>
                      <input
                        id={field.name}
                        type="text"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="w-full bg-gray-50/30 py-1 px-3 rounded-md border border-gray-50/40 outline-none focus:border-gray-50"
                      />
                      <span className="text-xs text-red-400 my-1">
                        <FieldInfo field={field} />
                      </span>
                    </div>
                  );
                }}
              />
              {/* Product Description */}
              <form.Field
                name="description"
                validators={{
                  onChange: ({ value }) =>
                    !value
                      ? "Product description required!"
                      : value.length < 3
                      ? "Product name must be at least 10 characters"
                      : undefined,
                  onChangeAsyncDebounceMs: 500,
                  onChangeAsync: async ({ value }) => {
                    await new Promise((resolve) => setTimeout(resolve, 500));
                    return (
                      value.includes("error") &&
                      'No "error" allowed in product description'
                    );
                  },
                }}
                children={(field) => {
                  return (
                    <div className="flex flex-col mt-1">
                      <label htmlFor={field.name} className="text-sm">
                        Description
                      </label>
                      <textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="w-full bg-gray-50/30 py-1 px-3 rounded-md border border-gray-50/40 outline-none focus:border-gray-50"
                      />
                      <span className="text-xs text-red-400 my-1">
                        <FieldInfo field={field} />
                      </span>
                    </div>
                  );
                }}
              />
              {/* Quantity and Price */}
              <div className="flex flex-col md:flex-row md:gap-2">
                {/* Product Price */}
                <form.Field
                  name="price"
                  validators={{
                    onChange: ({ value }) =>
                      !value
                        ? "Product price required!"
                        : value <= 0
                        ? "Product price must be greater than 0"
                        : undefined,
                    onChangeAsyncDebounceMs: 500,
                    onChangeAsync: async ({ value }) => {
                      await new Promise((resolve) => setTimeout(resolve, 500));
                      return !value && "Product price required!";
                    },
                  }}
                  children={(field) => {
                    return (
                      <div className="flex flex-col flex-1 mt-1">
                        <label htmlFor={field.name} className="text-sm">
                          Price
                        </label>
                        <input
                          id={field.name}
                          name={field.name}
                          type="number"
                          min={0}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) =>
                            field.handleChange(parseInt(e.target.value))
                          }
                          className="w-full bg-gray-50/30 py-1 px-3 rounded-md border border-gray-50/40 outline-none focus:border-gray-50"
                        />
                        <span className="text-xs text-red-400 my-1">
                          <FieldInfo field={field} />
                        </span>
                      </div>
                    );
                  }}
                />
                {/* Product Description */}
                <form.Field
                  name="quantity"
                  validators={{
                    onChange: ({ value }) =>
                      !value
                        ? "Product quantity required!"
                        : value < 0
                        ? "Product quantity must be greater or equal 0"
                        : undefined,
                    onChangeAsyncDebounceMs: 500,
                    onChangeAsync: async ({ value }) => {
                      await new Promise((resolve) => setTimeout(resolve, 500));
                      return !value && "Product quantity is required!";
                    },
                  }}
                  children={(field) => {
                    return (
                      <div className="flex flex-col flex-1 mt-1">
                        <label htmlFor={field.name} className="text-sm">
                          Quantity
                        </label>
                        <input
                          id={field.name}
                          name={field.name}
                          type="number"
                          min={0}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) =>
                            field.handleChange(parseInt(e.target.value))
                          }
                          className="w-full bg-gray-50/30 py-1 px-3 rounded-md border border-gray-50/40 outline-none focus:border-gray-50"
                        />
                        <span className="text-xs text-red-400 my-1">
                          <FieldInfo field={field} />
                        </span>
                      </div>
                    );
                  }}
                />
              </div>
              {/* Width,  Height and Category */}
              <div className="flex flex-col md:flex-row md:gap-2">
                {/* Product Height */}
                <form.Field
                  name="height"
                  validators={{
                    onChange: ({ value }) =>
                      !value
                        ? "Carpet height required!"
                        : value <= 0
                        ? "Carpet height must be greater than 0"
                        : undefined,
                    onChangeAsyncDebounceMs: 500,
                    onChangeAsync: async ({ value }) => {
                      await new Promise((resolve) => setTimeout(resolve, 500));
                      return !value && "Carpet height required!";
                    },
                  }}
                  children={(field) => {
                    return (
                      <div className="flex flex-col flex-1 mt-1">
                        <label htmlFor={field.name} className="text-sm">
                          Carpet Height
                        </label>
                        <input
                          id={field.name}
                          name={field.name}
                          type="number"
                          min={1}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) =>
                            field.handleChange(parseInt(e.target.value))
                          }
                          className="w-full bg-gray-50/30 py-1 px-3 rounded-md border border-gray-50/40 outline-none focus:border-gray-50"
                        />
                        <span className="text-xs text-red-400 my-1">
                          <FieldInfo field={field} />
                        </span>
                      </div>
                    );
                  }}
                />
                {/* Product Width */}
                <form.Field
                  name="width"
                  validators={{
                    onChange: ({ value }) =>
                      !value
                        ? "Carpet width required!"
                        : value <= 0
                        ? "Carpet width must be greater 0"
                        : undefined,
                    onChangeAsyncDebounceMs: 500,
                    onChangeAsync: async ({ value }) => {
                      await new Promise((resolve) => setTimeout(resolve, 500));
                      return !value && "Carpet width is required!";
                    },
                  }}
                  children={(field) => {
                    return (
                      <div className="flex flex-col flex-1 mt-1">
                        <label htmlFor={field.name} className="text-sm">
                          Carpet Width
                        </label>
                        <input
                          id={field.name}
                          name={field.name}
                          type="number"
                          min={1}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) =>
                            field.handleChange(parseInt(e.target.value))
                          }
                          className="w-full bg-gray-50/30 py-1 px-3 rounded-md border border-gray-50/40 outline-none focus:border-gray-50"
                        />
                        <span className="text-xs text-red-400 my-1">
                          <FieldInfo field={field} />
                        </span>
                      </div>
                    );
                  }}
                />
                {/* Product Category */}
                <form.Field
                  name="category"
                  validators={{
                    onChange: ({ value }) =>
                      !value
                        ? "Carpet category required!"
                        : value.length <= 0
                        ? "Carpet category must be included!"
                        : undefined,
                    onChangeAsyncDebounceMs: 500,
                    onChangeAsync: async ({ value }) => {
                      await new Promise((resolve) => setTimeout(resolve, 500));
                      return !value && "Carpet category is required!";
                    },
                  }}
                  children={(field) => {
                    return (
                      <div className="flex flex-col flex-1 mt-1">
                        <label htmlFor={field.name} className="text-sm">
                          Carpet Category
                        </label>
                        <select
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="w-full bg-gray-50/30 py-1 px-3 rounded-md border border-gray-50/40 outline-none focus:border-gray-50"
                        >
                          <option value="s">Small</option>
                          <option value="m">Medium</option>
                          <option value="l">Large</option>
                        </select>

                        <span className="text-xs text-red-400 my-1">
                          <FieldInfo field={field} />
                        </span>
                      </div>
                    );
                  }}
                />
              </div>
              {/* Product Images */}
              <div className="w-full flex flex-col gap-4 mt-1">
                <div className="flex flex-col">
                  <label
                    htmlFor="images"
                    className="w-full flex justify-center items-center gap-4 cursor-pointer bg-gray-50/30 hover:bg-indigo-400/30 py-1 px-3 rounded-md border border-gray-50/40 outline-none focus:border-gray-50 transition-all ease-in-out duration-200"
                  >
                    Upload Carpet Images <Upload />
                  </label>
                  <input
                    id="images"
                    name="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleChange}
                    className="hidden"
                  />
                  <div className="flex flex-wrap gap-3 mt-2">
                    {images.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`preview-${index}`}
                          className="h-24 w-24 rounded-lg object-cover shadow"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute right-1 top-1 rounded-full bg-red-400 hover:bg-red-500 p-1 text-xs text-white transition-all duration-200 ease-in-out"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-red-400 my-1">
                    {images &&
                      images.length === 0 &&
                      "Carpet images are required!"}
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Form */}
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full py-1 px-3 mt-3 rounded-md bg-indigo-500 hover:bg-indigo-400 transition-all ease-in-out duration-200 cursor-pointer"
                >
                  {isSubmitting ? "..." : "Submit"}
                </button>
              )}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewProduct;
