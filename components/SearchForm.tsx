import axios from "axios";
import { ResultType, SearchType } from "../types";
import { useEffect, useState } from "react";
import SearchResult from "../components/SearchResult";

const SearchForm = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<ResultType[]>([]);
  const TYPING_DELAY = 200;
  const MIN_SEARCH_LENGTH = 3;

  const fetchSearchResults = async (searchTerm: string) => {
    if (searchTerm === "") return setSearchResults([]);
    if (searchTerm.length < MIN_SEARCH_LENGTH) return setSearchResults([]);
    try {
      setIsLoading(true);
      const URI = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/search/${searchTerm}`;
      const res = await axios.get(URI);
      const data = res.data as SearchType;
      setIsLoading(false);
      setSearchResults(data.results);
      console.log(data.results);
    } catch (err) {
      setIsLoading(false);
      setSearchResults([]);
    }
  };

  useEffect(() => {
    const timeOutId = setTimeout(async () => {
      await fetchSearchResults(searchValue);
    }, TYPING_DELAY);
    return () => clearTimeout(timeOutId);
  }, [searchValue]);

  const onSubmitHandler: React.FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    e.preventDefault();
    await fetchSearchResults(searchValue);
  };
  return (
    <form className="search-form" onSubmit={(e) => onSubmitHandler(e)}>
      <div className="search-form__search-box">
        <div className="search-form__field">
          <input
            className="search-form__input"
            type="text"
            id="search"
            name="search"
            autoComplete="off"
            onChange={(e) => setSearchValue(e.currentTarget.value)}
          />
          <button className="search-form__submit" type="submit" value="Search">
            <i className="fa fa-search"></i>
          </button>
        </div>
      </div>
      <div className="search-form__results">
        {(() => {
          if (isLoading) {
            return (
              <h3 className="search-result__modal">
                <span>
                  <i className="fa fa-spinner fa-spin"></i>
                </span>
                Searching for TV Shows
              </h3>
            );
          } else {
            if (
              searchValue.length >= MIN_SEARCH_LENGTH &&
              searchResults.length === 0
            ) {
              return <h3 className="search-result__modal">No results found</h3>;
            } else {
              return searchResults.map((result, index) => {
                return <SearchResult search_result={result} key={index} />;
              });
            }
          }
        })()}
        {/* {isLoading ? (
          <div className="search-result">Loading...</div>
          ) : (
            <>
            {searchResults.length !== 0 ?({<>
              searchResults.map((result, index) => {
                return <SearchResult search_result={result} key={index} />
              })</>}):

              <div className="search-result">No results found</div>
              }
          </>
        )} */}
      </div>
    </form>
  );
};

export default SearchForm;
