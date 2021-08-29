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
            onChange={(e) => setDisplay(e.currentTarget.value)}
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
                <option value="season-asc">Season - Old to New</option>
                <option value="season-desc">Season - New to Old</option>
                <option value="avg-rating-desc">
                  Average Rating - High to Low
                </option>
                <option value="avg-rating-asc">
                  Average Rating - Low to High
                </option>
                <option value="median-desc">Median - High to Low</option>
                <option value="median-asc">Median - Low to High</option>
                <option value="slope-desc">
                  Trendline Direction - Positive to Negative
                </option>
                <option value="slope-asc">
                  Trendline Direction - Negative to Positive
                </option>
                <option value="std-asc">
                  Standard Deviation - Low to High
                </option>
                <option value="std-desc">
                  Standard Deviation - High to Low
                </option>
                <option value="r2-desc">R-Squared - High to Low</option>
                <option value="r2-asc">R-Squared - Low to High</option>
                <option value="std-err-asc">
                  Standard Error of Regression - Low to High
                </option>
                <option value="std-err-desc">
                  Standard Error of Regression - High to Low
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
            <option value="ep-asc">Episode - Old to New </option>
            <option value="ep-desc">Episode - New to Old</option>
            <option value="rating-desc">Rating - High to Low</option>
            <option value="rating-asc">Rating - Low to High</option>
            <option value="votes-desc">Votes - High to Low</option>
            <option value="votes-asc">Votes - Low to High</option>
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
