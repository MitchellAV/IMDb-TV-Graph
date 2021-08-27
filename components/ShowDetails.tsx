import { IMDBShowInfoType } from "../types";

interface PropType {
  show_info: IMDBShowInfoType;
}

const ShowDetails = ({ show_info }: PropType) => {
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
  return (
    <div className="show">
      <img className="show__img" src={image} alt={title} />
      <div className="show__info">
        <a
          className="link link--main"
          href={`https://www.imdb.com/title/${id}`}
          target="_blank"
        >
          View on IMDb
        </a>
        <p className="show__title">{title}</p>
        <p className="show__attr">
          <b>Full Title:</b> {fullTitle}
        </p>
        <p className="show__attr">
          <b>Rating:</b> {imDbRating}/10 with {imDbRatingVotes} votes
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
            >
              {creator.name}
            </a>
          ))}
        </p>
        <div className="show__attr show__attr--actors">
          <b>Actors:</b>{" "}
          <div className="show__actors">
            {actorList.map((actor) => (
              <div className="actor">
                <img className="actor__img" src={actor.image} alt="" />

                <p className="actor__char">
                  <a
                    className="link link--actor"
                    href={`https://www.imdb.com/name/${actor.id}`}
                    target="_blank"
                  >
                    {actor.name}
                  </a>
                  <br />
                  as{" "}
                  {actor.asCharacter
                    .split(" ")

                    .filter((name, index, array) => {
                      if (
                        isNaN(name as any) &&
                        name !== "episodes" &&
                        name !== "episodes," &&
                        name !== "/" &&
                        name !== "..." &&
                        name.indexOf("(") < 0 &&
                        name.indexOf("-") < 0
                      )
                        return true;

                      return false;
                    })
                    .join(" ")}
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
            >
              {genre.value}
            </a>
          ))}
        </p>
        <p className="show__attr">
          <b>Tags:</b>{" "}
          {keywordList.map((keyword) => (
            <a
              className="link link--show"
              href={`https://www.imdb.com/search/keyword/?keywords=${keyword}`}
              target="_blank"
            >
              {keyword}
            </a>
          ))}
        </p>
      </div>
    </div>
  );
};

export default ShowDetails;
