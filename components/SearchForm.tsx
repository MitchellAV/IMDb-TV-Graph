import axios from "axios";
import { ResultType, SearchType } from "../types";
import { useEffect, useState } from "react";
import SearchResult from "../components/SearchResult";

const SearchForm = () => {
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<ResultType[]>([]);
  const TYPING_DELAY = 200;

  const fetchSearchResults = async (searchTerm: string) => {
    if (searchTerm === "") return setSearchResults([]);
    try {
      const URI = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/search/${searchTerm}`;
      const res = await axios.get(URI);
      const data = res.data as SearchType;
      setSearchResults(data.results);
    } catch (err) {
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
        {searchResults.length !== 0 &&
          searchResults.map((result, index) => {
            return <SearchResult search_result={result} key={index} />;
          })}
      </div>
    </form>
  );
};

export default SearchForm;
