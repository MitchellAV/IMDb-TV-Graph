import { useState } from "react";
import { D3EpisodeType, ImdbSeasonType, SeasonStatData } from "../types";
import {
  calculate_statistics_for_seasons,
  separate_seasons,
  sort_episodes,
} from "../util/statistics";
import EpisodesDisplay from "./EpisodesDisplay";
import SeasonsDisplay from "./SeasonsDisplay";

interface PropType {
  episodes: D3EpisodeType[];
  season_statistics: (SeasonStatData | null)[];
}

const EpisodesTable = ({ episodes, season_statistics }: PropType) => {
  const [allEpisodes, setAllEpisodes] = useState(episodes);
  const [display, setDisplay] = useState("episodes");
  const [epSortBy, setEpSortBy] = useState("ep-desc");
  const [seasonSortBy, setSeasonSortBy] = useState("ep-desc");

  let sorted_episodes = sort_episodes(episodes, epSortBy);
  let season_episodes = separate_seasons(sorted_episodes);

  return (
    <div className="table">
      <div className="table__filters">
        <form className="table__filter">
          <label htmlFor="display">Display:</label>
          <select
            id="display"
            name="display"
            onChange={(e) => setDisplay(e.currentTarget.value)}
          >
            <option value="seasons">Seasons</option>
            <option value="episodes">Episodes</option>
          </select>
          <label htmlFor="ep_sort">Sort by:</label>
          <select
            id="ep_sort"
            name="ep_sort"
            onChange={(e) => setEpSortBy(e.currentTarget.value)}
          >
            <option value="ep-desc">Episode Number - Desc</option>
            <option value="ep-asc">Episode Number - Asc </option>
            <option value="rating-desc">Rating - Desc</option>
            <option value="rating-asc">Rating - Asc</option>
            <option value="votes-desc">Votes - Desc</option>
            <option value="votes-asc">Votes - Asc</option>
          </select>
          <label htmlFor="season_sort">Sort by:</label>
          <select
            id="season_sort"
            name="season_sort"
            onChange={(e) => setSeasonSortBy(e.currentTarget.value)}
          >
            <option value="ep-desc">Episode Number - Desc</option>
            <option value="ep-asc">Episode Number - Asc </option>
            <option value="rating-desc">Rating - Desc</option>
            <option value="rating-asc">Rating - Asc</option>
            <option value="votes-desc">Votes - Desc</option>
            <option value="votes-asc">Votes - Asc</option>
          </select>
        </form>
      </div>
      <div className="table__container">
        {(() => {
          switch (display) {
            case "episodes":
              return <EpisodesDisplay episodes={sorted_episodes} />;
            case "seasons":
              return (
                <SeasonsDisplay
                  seasons={season_episodes}
                  season_statistics={season_statistics}
                />
              );

            default:
              null;
          }
        })()}
      </div>
    </div>
  );
};

export default EpisodesTable;
