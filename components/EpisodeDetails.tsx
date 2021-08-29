import { D3EpisodeType } from "../types";

interface PropType {
  episode: D3EpisodeType;
}
const EpisodeDetails = ({ episode }: PropType) => {
  const {
    id,
    episodeNumber,
    imDbRating,
    imDbRatingCount,
    image,
    plot,
    released,
    seasonNumber,
    title,
    true_ep_count,
    year,
  } = episode;
  return (
    <div className="episode">
      <img className="episode__img" src={image} alt="" />
      <div className="episode__info">
        <h3 className="episode__detail">
          {seasonNumber} - {episodeNumber}: {title}
        </h3>
        <div className="episode__detail">
          <span className="episode__span">
            <svg
              className="icon icon--star"
              xmlns="http://www.w3.org/2000/svg"
              fill="#000000"
              height="24"
              viewBox="0 0 24 24"
              width="24"
            >
              <path d="M0 0h24v24H0z" fill="none"></path>
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
              <path d="M0 0h24v24H0z" fill="none"></path>
            </svg>
          </span>
          <span className="episode__span">
            {imDbRating} ({imDbRatingCount} votes)
          </span>
        </div>
        <p className="episode__detail">Released: {released}</p>
        <p className="episode__detail"></p>

        <p className="episode__detail">{plot}</p>
      </div>
    </div>
  );
};

export default EpisodeDetails;
