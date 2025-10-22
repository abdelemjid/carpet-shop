import React, { useState, useRef } from "react";

interface ZoomImageProps {
  src: string;
  zoom?: number;
}

const ZoomImage: React.FC<ZoomImageProps> = ({ src, zoom = 2 }) => {
  const [backgroundPosition, setBackgroundPosition] = useState("center");
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      containerRef.current!.getBoundingClientRect();

    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;

    setBackgroundPosition(`${x}% ${y}%`);
  };

  const handleMouseLeave = () => {
    setBackgroundPosition("center");
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full h-full overflow-hidden bg-no-repeat bg-center"
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: `${zoom * 100}%`,
        backgroundPosition,
      }}
    >
      <img
        src={src}
        alt=""
        className="w-full h-full object-cover opacity-0 select-none pointer-events-none"
      />
    </div>
  );
};

export default ZoomImage;
