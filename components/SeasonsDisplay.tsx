import { useState } from "react";
import { D3EpisodeType, SeasonStatData } from "../types";
import EpisodeDetails from "./EpisodeDetails";
import SeasonDetails from "./SeasonDetails";
import ShowStatistics from "./ShowStatistics";

interface PropType {
  seasons: (D3EpisodeType[] | undefined)[];
  season_statistics: (SeasonStatData | null)[];
}

const SeasonsDisplay = ({ seasons, season_statistics }: PropType) => {
  const season_statistics_map = new Map<number, SeasonStatData>();
  season_statistics.forEach((season) => {
    if (season) {
      const { season_number } = season;
      season_statistics_map.set(season_number, season);
    }
  });
  return (
    <>
      {seasons.map((season, index) => {
        if (season) {
          const season_number = parseInt(season[0].seasonNumber);
          const season_statistic = season_statistics_map.get(season_number);

          if (season_statistic) {
            return (
              <SeasonDetails
                season={season}
                season_number={season_number}
                season_statistic={season_statistic}
                key={season_number}
              />
            );
          }
        }
        return;
      })}
    </>
  );
};

export default SeasonsDisplay;
