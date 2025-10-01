import React, { createContext, useContext, useState } from "react";

interface ContextType {
  displayed: boolean;
  images: string[] | undefined;
  setDisplayed: (isDisplayed: boolean) => void;
  setImages: (images: string[]) => void;
}

const ImagePreviewContext = createContext<ContextType | undefined>(undefined);

export const ImageViewProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [displayed, setDisplayed] = useState(false);
  const [images, setImages] = useState<string[] | undefined>(undefined);

  return (
    <ImagePreviewContext.Provider
      value={{ displayed, setDisplayed, images, setImages }}
    >
      {children}
    </ImagePreviewContext.Provider>
  );
};

export const useImagePreview = () => {
  const context = useContext(ImagePreviewContext);

  if (!context)
    throw new Error("useImagePreview must be used within ImageViewProvider!");

  return context;
};
