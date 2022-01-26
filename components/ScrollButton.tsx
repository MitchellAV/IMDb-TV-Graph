import { RefObject, useRef } from "react";

interface PropType {
  scrollToElementRef: RefObject<HTMLDivElement>;
}

const ScrollButton = ({ scrollToElementRef }: PropType) => {
  const btnRef = useRef<HTMLButtonElement>(null);

  const scrollToChart = () => {
    scrollToElementRef.current?.scrollIntoView();
  };

  return (
    <button
      onClick={() => scrollToChart()}
      className="btn btn--sticky"
      title="Scroll to Graph"
      ref={btnRef}
    >
      Graph
    </button>
  );
};

export default ScrollButton;
