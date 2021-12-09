import { RefObject, useEffect, useState } from "react";

const useRefDimensions = (ref: RefObject<any>) => {
  const [dimensions, setDimensions] = useState({ width: 1, height: 2 });

  const updateDimensions = () => {
    if (ref.current) {
      const { current } = ref;
      const boundingRect = current.getBoundingClientRect();
      const { width, height } = boundingRect;
      setDimensions({ width: Math.round(width), height: Math.round(height) });
    }
  };
  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", () => updateDimensions());

    return () => window.removeEventListener("resize", () => updateDimensions());
  }, []);
  return dimensions;
};

export default useRefDimensions;
