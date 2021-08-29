import { useState } from "react";
import { D3EpisodeType, SeasonStatData } from "../types";
import EpisodeDetails from "./EpisodeDetails";
import ShowStatistics from "./ShowStatistics";

interface PropType {
  season_number: number;
  season: D3EpisodeType[];
  season_statistic: SeasonStatData;
}
const SeasonDetails = ({
  season_number,
  season,
  season_statistic,
}: PropType) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="season">
      <div className="season__stats" onClick={() => setIsOpen(!isOpen)}>
        <h3 className="season__header">Season {season_number}</h3>
        <ShowStatistics episode_statistics={season_statistic} />
      </div>
      {isOpen && (
        <div className="season__episodes">
          {season.map((ep, index) => (
            <EpisodeDetails episode={ep} key={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SeasonDetails;
