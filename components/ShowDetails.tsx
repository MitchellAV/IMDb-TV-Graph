import { IMDBShowInfoType, SeasonStatData } from "../types";
import ShowStatistics from "./ShowStatistics";

interface PropType {
  show_info: IMDBShowInfoType;
  episode_statistics: SeasonStatData | null;
}

const ShowDetails = ({ show_info, episode_statistics }: PropType) => {
  const {
    actorList,
    companyList,
    countries,
    contentRating,
    fullTitle,
    genreList,
    id,
    imDbRating,
    imDbRatingVotes,
    image,
    keywordList,
    languages,
    plot,
    releaseDate,
    runtimeStr,
    starList,
    title,
    tvSeriesInfo: { creatorList, seasons },
  } = show_info;

  const num_stars = starList.length;
  const num_seasons = seasons.length;

  const remove_as_duplicates = (words: string[]) => {
    if (words.length % 2 == 0) {
      let half_index = words.length / 2;

      let wordA = words[half_index - 1];
      let wordA_as = wordA;
      wordA = wordA.slice(0, wordA.length - 2);

      let wordB = words[words.length - 1].replace("…", "");
      words[words.length - 1] = wordB;
      if (wordA === wordB || wordA_as === wordB) {
        return words.slice(-half_index);
      }
    }

    return words;
  };

  const clean_char_name = (char_name: string) => {
    let char_name_array = char_name.split(" ").filter((name) => {
      if (
        isNaN(name as any) &&
        name !== "episodes" &&
        name !== "episodes," &&
        name !== "/" &&
        name !== "..." &&
        name.indexOf("(") < 0 &&
        name.indexOf(")") < 0 &&
        name.indexOf("-") < 0
      )
        return true;

      return false;
    });
    if (char_name_array.length > 0) {
      char_name_array = remove_as_duplicates(char_name_array);
    }
    return char_name_array.join(" ");
  };
  return (
    <div className="show">
      <img className="show__img" src={image} alt={title} />
      <div className="show__info">
        <a
          className="link link--main"
          href={`https://www.imdb.com/title/${id}`}
          target="_blank"
          rel="noreferrer"
        >
          View on IMDb
        </a>
        <p className="show__title">{title}</p>
        <p className="show__attr">
          <b>Full Title:</b> {fullTitle}
        </p>
        <p className="show__attr">
          <b>Rating:</b> {imDbRating}/10 ({imDbRatingVotes} votes)
        </p>
        {/* <p className="show__attr">
          <b>IMDb Votes:</b> {imDbRatingVotes}
        </p> */}
        <p className="show__attr">
          <b>Languages:</b> {languages}
        </p>
        <p className="show__attr">
          <b>Number of Seasons:</b> {num_seasons}
        </p>
        {episode_statistics && (
          <p className="show__attr">
            <b>Number of Episodes:</b> {episode_statistics.n}
          </p>
        )}
        <p className="show__attr">
          <b>Episode Runtime:</b> {runtimeStr}
        </p>
        <p className="show__attr">
          <b>Release Date:</b> {releaseDate}
        </p>
        <p className="show__attr">
          <b>Content Rating:</b> {contentRating}
        </p>
        <p className="show__attr">
          <b>Countries:</b> {countries}
        </p>
        <p className="show__attr">
          <b>Synopsis:</b>
          <br /> {plot}
        </p>
        <p className="show__attr">
          <b>Creators:</b>{" "}
          {creatorList.map((creator) => (
            <a
              className="link link--show"
              href={`https://www.imdb.com/name/${creator.id}`}
              target="_blank"
              rel="noreferrer"
              key={creator.id}
            >
              {creator.name}
            </a>
          ))}
        </p>
        <div className="show__attr show__attr--actors">
          <b>Actors:</b>{" "}
          <div className="show__actors">
            {actorList.map((actor) => (
              <div className="actor" key={actor.id}>
                <a
                  className="link "
                  href={`https://www.imdb.com/name/${actor.id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    className="actor__img"
                    src={actor.image}
                    alt={actor.name}
                  />
                </a>

                <p className="actor__char">
                  <a
                    className="link link--actor"
                    href={`https://www.imdb.com/name/${actor.id}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {actor.name}
                  </a>
                  <br />
                  as {clean_char_name(actor.asCharacter)}
                </p>
              </div>
            ))}
          </div>
        </div>
        <p className="show__attr">
          <b>Companies:</b>{" "}
          {companyList.map((company) => (
            <a
              className="link link--show"
              href={`https://www.imdb.com/search/title/?companies=${company.id}`}
              target="_blank"
              rel="noreferrer"
              key={company.id}
            >
              {company.name}
            </a>
          ))}
        </p>
        <p className="show__attr">
          <b>Genres:</b>{" "}
          {genreList.map((genre) => (
            <a
              className="link link--show"
              href={`https://www.imdb.com/search/title/?genres=${genre.value}`}
              target="_blank"
              rel="noreferrer"
              key={genre.key}
            >
              {genre.value}
            </a>
          ))}
        </p>
        {/* <p className="show__attr">
          <b>Tags:</b>{" "}
          {keywordList.map((keyword) => (
            <a
              className="link link--show"
              href={`https://www.imdb.com/search/keyword/?keywords=${keyword}`}
              target="_blank"
              key={keyword}
            >
              {keyword}
            </a>
          ))}
        </p> */}
        {episode_statistics && (
          <ShowStatistics episode_statistics={episode_statistics} />
        )}
      </div>
    </div>
  );
};

export default ShowDetails;
