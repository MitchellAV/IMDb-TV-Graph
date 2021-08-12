import { GetServerSideProps } from "next";
import axios from "axios";
import { D3EpisodeType, SeasonType, ShowWithSeasonInfoType } from "../../types";
import D3ScatterPlot from "../../components/D3ScatterPlot";

interface ShowProps {
  show: ShowWithSeasonInfoType;
}

const format_episodes_d3_scatter = (seasons: SeasonType[]) => {
  const episodes_info: D3EpisodeType[] = [];
  let true_ep_count = 1;
  seasons.forEach((season) => {
    if (season.episodes) {
      const ep = season.episodes.forEach((ep) => {
        const {
          episode_number,
          air_date,
          name,
          overview,
          season_number,
          still_path,
          vote_average,
          vote_count,
        } = ep;
        episodes_info.push({
          episode_number,
          air_date,
          name,
          overview,
          season_number,
          still_path,
          vote_average,
          vote_count,
          true_ep_count,
        });
        true_ep_count++;
      });
    }
  });

  return episodes_info;
};

const find_regression_values = (season_episodes: D3EpisodeType[]) => {
  let ratings = season_episodes
    .map((ep) => {
      return { x: ep.true_ep_count, y: ep.vote_average };
    })
    .filter((rating) => rating.y !== 0);
  console.log(ratings);

  if (ratings.length > 1) {
    const n = ratings.length;
    const sumX = ratings.reduce((sum, ep) => {
      return sum + ep.x;
    }, 0);
    const sumX2 = ratings.reduce((sum, ep) => {
      return sum + ep.x * ep.x;
    }, 0);
    const sumY = ratings.reduce((sum, ep) => {
      return sum + ep.y;
    }, 0);
    const sumXY = ratings.reduce((sum, ep) => {
      return sum + ep.x * ep.y;
    }, 0);

    const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

    const b = (sumY - m * sumX) / n;

    const startX = ratings[0].x;
    const endX = ratings[ratings.length - 1].x;
    const endPoints = {
      start: { x: startX, y: m * startX + b },
      end: { x: endX, y: m * endX + b },
    };
    return endPoints;
  }
  return null;
};

const get_trendline_for_seasons = (
  seasons: SeasonType[],
  episodes_info: D3EpisodeType[]
) => {
  const trendline_points = [];
  for (let index = 1; index <= seasons.length; index++) {
    const currentSeason = episodes_info.filter(
      (ep) => ep.season_number === index
    );
    trendline_points.push(find_regression_values(currentSeason));
  }
  return trendline_points;
};

const Show = ({ show }: ShowProps) => {
  console.log(show);
  const { episode_run_time, name } = show.show_info;
  const seasons = show.seasons;

  const episodes_info = format_episodes_d3_scatter(seasons);
  const trendline_points = get_trendline_for_seasons(seasons, episodes_info);
  return (
    <>
      <h1>{name}</h1>
      <D3ScatterPlot data={episodes_info} trendlines={trendline_points} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  const { slug, ...rest } = query;
  const URI = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/tv/${slug}`;

  const options = { params: rest, timeout: 1000 * 60 * 5 };
  const res = await axios.get(URI, options);
  const data = res.data as ShowWithSeasonInfoType;

  if (!data) {
    return {
      notFound: true,
    };
  }

  return { props: { show: data } };
};

export default Show;
