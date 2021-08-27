import { ResultType } from "../types";

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
  const OVERVIEW_WORD_COUNT = 100;

  return (
    <a
      className="search-result"
      href={`/show/${id}`}
      //   style={{
      //     backgroundImage: backdrop_path
      //       ? `url(https://image.tmdb.org/t/p/w500${backdrop_path})`
      //       : "none",
      //     backgroundRepeat: "no-repeat",
      //     backgroundSize: "cover",
      //     backgroundPositionY: "center",
      //   }}
    >
      <h3 className="search-result__title">{name}</h3>
      {poster_path && (
        <div className="search-result__img">
          <img
            src={`https://image.tmdb.org/t/p/w500${poster_path}`}
            alt={name}
          />
        </div>
      )}

      <p className="search-result__air-date">{start_year ? start_year : ""}</p>
      <p className="search-result__overview">
        {overview_words.length > OVERVIEW_WORD_COUNT
          ? overview_words.slice(0, OVERVIEW_WORD_COUNT).join(" ") + "..."
          : overview_words.join(" ")}
      </p>
    </a>
  );
};

export default SearchResult;
