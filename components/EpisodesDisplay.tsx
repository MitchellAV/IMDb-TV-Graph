import { D3EpisodeType } from "../types";
import EpisodeDetails from "./EpisodeDetails";

interface PropType {
  episodes: D3EpisodeType[];
  sort_by: string;
}

const sort_episodes = (episodes: D3EpisodeType[], sort_by: string) => {
  let sorted_episodes = episodes;
  switch (sort_by) {
    case "ep-desc":
      sorted_episodes = episodes.sort(
        (a, b) => a.true_ep_count - b.true_ep_count
      );
      break;
    case "ep-asc":
      sorted_episodes = episodes.sort(
        (a, b) => b.true_ep_count - a.true_ep_count
      );
      break;
    case "rating-desc":
      sorted_episodes = episodes.sort(
        (a, b) =>
          b.imDbRating - a.imDbRating || b.imDbRatingCount - a.imDbRatingCount
      );
      break;
    case "rating-asc":
      sorted_episodes = episodes.sort(
        (a, b) =>
          a.imDbRating - b.imDbRating || a.imDbRatingCount - b.imDbRatingCount
      );
      break;
    case "votes-desc":
      sorted_episodes = episodes.sort(
        (a, b) => b.imDbRatingCount - a.imDbRatingCount
      );
      break;
    case "votes-asc":
      sorted_episodes = episodes.sort(
        (a, b) => a.imDbRatingCount - b.imDbRatingCount
      );
      break;

    default:
      sorted_episodes = episodes.sort(
        (a, b) => b.true_ep_count - a.true_ep_count
      );
      break;
  }
  return sorted_episodes;
};

const separate_seasons = (episodes: D3EpisodeType[]) => {
  const season_episodes_map = new Map<number, D3EpisodeType[]>();

  for (let i = 0; i < episodes.length; i++) {
    const episode = episodes[i];
    const { seasonNumber } = episode;

    const season = season_episodes_map.get(seasonNumber);
    if (season) {
      season.push(episode);
      season_episodes_map.set(seasonNumber, season);
    } else {
      season_episodes_map.set(seasonNumber, [episode]);
    }
  }
  const season_numbers = [...season_episodes_map.keys()].sort((a, b) => a - b);
  const season_episodes = season_numbers.map((number) =>
    season_episodes_map.get(number)
  );
  console.log(season_episodes);

  return season_episodes;
};

const EpisodesDisplay = ({ episodes, sort_by }: PropType) => {
  let sorted_episodes = sort_episodes(episodes, sort_by);
  let season_episodes = separate_seasons(sorted_episodes);
  return (
    <>
      {sorted_episodes.map((ep, index) => (
        <EpisodeDetails episode={ep} key={index} />
      ))}
    </>
  );
};

export default EpisodesDisplay;
