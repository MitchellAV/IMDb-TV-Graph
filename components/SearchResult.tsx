import { ResultType } from "../types";
import Image from "next/image";
import { RefObject, useEffect, useRef, useState } from "react";

interface PropType {
  search_result: ResultType;
}

const SearchResult = ({ search_result }: PropType) => {
  const {
    id,
    overview,
    name,
    poster_path,
    first_air_date,
    backdrop_path,
    original_name,
  } = search_result;

  const start_year = new Date(first_air_date).getFullYear();

  const overview_words = overview.split(" ");

  const OVERVIEW_CHAR_LENGTH = 300;
  const OVERVIEW_WORD_COUNT = 50;

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

      return () =>
        window.removeEventListener("resize", () => updateDimensions());
    }, []);
    return dimensions;
  };
  const result = useRef<HTMLAnchorElement>(null);

  const dimensions = useRefDimensions(result);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    let result_el = result.current;
    if (result_el) {
      let new_width = result_el.getBoundingClientRect().width;
      setWidth(new_width);
    }
  }, [dimensions]);

  return (
    <a className="search-result" href={`/show/${id}`} ref={result}>
      <div
        className="search-result__container"
        style={
          poster_path
            ? {
                backgroundImage: backdrop_path
                  ? `linear-gradient(
        rgba(0, 0, 0, 0.4),
        rgba(0, 0, 0, 0.4)
      ),url(https://image.tmdb.org/t/p/w500${backdrop_path})`
                  : `linear-gradient( #1f1f1f,#1f1f1f)`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
                width: width,
              }
            : {
                backgroundImage: `linear-gradient( #1f1f1f,#1f1f1f)`,
                width: width,
                height: 0,
              }
        }
      ></div>

      <div className="search-result__info">
        {poster_path && (
          <div className="search-result__img">
            <Image
              src={`https://image.tmdb.org/t/p/w500${poster_path}` as any}
              alt={name}
              layout="fill"
              objectFit="contain"
            />
          </div>
        )}
        <h3 className="search-result__title">{name}</h3>

        <p className="search-result__air-date">
          {start_year ? start_year : ""}
        </p>
        {overview_words && (
          <p className="search-result__overview">
            {overview_words.length > OVERVIEW_WORD_COUNT
              ? overview_words.slice(0, OVERVIEW_WORD_COUNT).join(" ") + "..."
              : overview_words.join(" ")}
          </p>
        )}
      </div>
    </a>
  );
};

export default SearchResult;
