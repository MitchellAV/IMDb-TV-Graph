import { useState } from "react";
import { D3EpisodeType, SeasonStatData } from "../types";
import EpisodesDisplay from "./EpisodesDisplay";

interface PropType {
  episodes: D3EpisodeType[];
  season_statistics: (SeasonStatData | null)[];
  episode_statistics: SeasonStatData | null;
}
const EpisodesTable = ({
  episodes,
  season_statistics,
  episode_statistics,
}: PropType) => {
  const [allEpisodes, setAllEpisodes] = useState(episodes);
  const [display, setDisplay] = useState("episodes");
  const [sortBy, setSortBy] = useState("ep-desc");

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
            <option value="episodes">Episodes</option>
            <option value="seasons">Seasons</option>
          </select>
          <label htmlFor="sort_by">Sort by:</label>
          <select
            id="sort_by"
            name="sort_by"
            onChange={(e) => setSortBy(e.currentTarget.value)}
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
        <EpisodesDisplay episodes={episodes} sort_by={sortBy} />
      </div>
    </div>
  );
};

export default EpisodesTable;
