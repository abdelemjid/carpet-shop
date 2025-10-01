import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useState } from "react";
import { useImagePreview } from "../contexts/ImagePreviewContext";

const ImagePreview = () => {
  const { images, setDisplayed } = useImagePreview();
  const [index, setIndex] = useState(0);

  return (
    <div className="fixed left-0 top-0 z-20 w-screen h-screen bg-gray-800/5 backdrop-blur-sm">
      <div className="relative w-full h-full flex justify-center items-center">
        <button
          className="absolute top-[50px] right-[50px] z-[100] cursor-pointer rounded-full p-3 bg-red-400 hover:bg-red-500"
          onClick={() => setDisplayed(false)}
        >
          <X />
        </button>
        <div className="h-[80%] md:w-[80%]">
          <div className="z-50 relative h-full flex flex-row gap-2 items-center justify-center">
            <button
              className="w-fit h-fit p-3 bg-gray-50/10 rounded-full hover:bg-gray-50/30 transition-all duration-150 ease-in-out translate-x-[25px]"
              onClick={() => {
                if (index > 0) setIndex(index - 1);
                else if (images && index === 0) setIndex(images.length - 1);
              }}
            >
              <ArrowLeft />
            </button>
            <img
              src={images && images.at(index)}
              className="mx-auto h-[80%] transition-all duration-200 ease-in-out"
            />
            <button
              className="w-fit h-fit p-3 bg-gray-50/10 rounded-full hover:bg-gray-50/30 transition-all duration-150 ease-in-out translate-x-[-25px]"
              onClick={() => {
                if (images && index < images.length - 1) setIndex(index + 1);
                else if (images && index === images.length - 1) setIndex(0);
              }}
            >
              <ArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;
