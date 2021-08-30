import { useState } from "react";
import { D3EpisodeType, ImdbSeasonType, SeasonStatData } from "../types";
import {
  calculate_statistics_for_seasons,
  separate_seasons,
  sort_episodes,
  sort_seasons,
} from "../util/statistics";
import EpisodesDisplay from "./EpisodesDisplay";
import SeasonsDisplay from "./SeasonsDisplay";

interface PropType {
  episodes: D3EpisodeType[];
  season_statistics: SeasonStatData[];
}

const EpisodesTable = ({ episodes, season_statistics }: PropType) => {
  const [display, setDisplay] = useState("seasons");
  const [epSortBy, setEpSortBy] = useState("ep-asc");
  const [seasonSortBy, setSeasonSortBy] = useState("season-asc");

  let sorted_episodes = sort_episodes(episodes, epSortBy);
  let season_episodes = separate_seasons(sorted_episodes);
  let sorted_seasons = sort_seasons(
    season_episodes,
    season_statistics,
    seasonSortBy
  );

  return (
    <div className="table">
      <div className="table__filters">
        <form className="table__filter">
          <label htmlFor="display">Display:</label>
          <select
            id="display"
            name="display"
            onChange={(e) => {
              setDisplay(e.currentTarget.value);
              setSeasonSortBy(seasonSortBy);
              setEpSortBy(epSortBy);
            }}
          >
            <option value="seasons">Seasons</option>
            <option value="episodes">Episodes</option>
          </select>
          {display === "seasons" && (
            <>
              <label htmlFor="season_sort">Sort Season By:</label>
              <select
                id="season_sort"
                name="season_sort"
                onChange={(e) => setSeasonSortBy(e.currentTarget.value)}
              >
                <option value="season-asc">Season - Oldest</option>
                <option value="season-desc">Season - Latest</option>
                <option value="avg-rating-desc">
                  Average Rating - Highest
                </option>
                <option value="avg-rating-asc">Average Rating - Lowest</option>
                <option value="median-desc">Median - Highest</option>
                <option value="median-asc">Median - Lowest</option>
                <option value="slope-desc">
                  Trendline Direction - Most Positive
                </option>
                <option value="slope-asc">
                  Trendline Direction - Most Negative
                </option>
                <option value="std-asc">Standard Deviation - Lowest</option>
                <option value="std-desc">Standard Deviation - Highest</option>
                <option value="r2-desc">R-Squared - Highest</option>
                <option value="r2-asc">R-Squared - Lowest</option>
                <option value="std-err-asc">
                  Standard Error of Regression - Lowest
                </option>
                <option value="std-err-desc">
                  Standard Error of Regression - Highest
                </option>
              </select>
            </>
          )}

          <label htmlFor="ep_sort">Sort Episodes By:</label>
          <select
            id="ep_sort"
            name="ep_sort"
            onChange={(e) => setEpSortBy(e.currentTarget.value)}
          >
            <option value="ep-asc">Episode - Oldest </option>
            <option value="ep-desc">Episode - Latest</option>
            <option value="rating-desc">Rating - Highest</option>
            <option value="rating-asc">Rating - Lowest</option>
            <option value="votes-desc">Votes - Highest</option>
            <option value="votes-asc">Votes - Lowest</option>
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
                  seasons={sorted_seasons}
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
