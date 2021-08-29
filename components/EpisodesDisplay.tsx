import { D3EpisodeType } from "../types";
import EpisodeDetails from "./EpisodeDetails";

interface PropType {
  episodes: D3EpisodeType[];
}

const EpisodesDisplay = ({ episodes }: PropType) => {
  return (
    <>
      {episodes.map((ep, index) => (
        <EpisodeDetails episode={ep} key={index} />
      ))}
    </>
  );
};

export default EpisodesDisplay;
