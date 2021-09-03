import {
  extent,
  sum,
  mean,
  median,
  standardDeviation,
  variance,
  interquartileRange,
  linearRegression,
  linearRegressionLine,
  rSquared,
  sampleCorrelation,
  sampleCovariance,
} from "simple-statistics";

import { D3EpisodeType, ImdbSeasonType, SeasonStatData } from "../types";

export const format_episodes_d3_scatter = (seasons: ImdbSeasonType[]) => {
  const episodes_info: D3EpisodeType[] = [];
  let true_ep_count = 1;
  seasons.forEach((season) => {
    if (season.episodes) {
      season.episodes.forEach((ep) => {
        episodes_info.push({
          ...ep,
          true_ep_count,
        });
        true_ep_count++;
      });
    }
  });

  return episodes_info;
};

export const calculate_statistics = (
  season_episodes: D3EpisodeType[],
  season_number?: number
): SeasonStatData | null => {
  let ratings = season_episodes
    .map((ep) => {
      return { x: ep.true_ep_count, y: ep.imDbRating };
    })
    .filter((rating) => rating.y !== 0);

  if (ratings.length > 1) {
    const n = ratings.length;
    const x = ratings.map((ep) => ep.x);
    const y = ratings.map((ep) => ep.y);
    const data_points = ratings.map((ep) => [ep.x, ep.y]);
    const range_x = extent(x);
    const range_y = extent(y);
    const sum_y = sum(y);
    const mean_y = mean(y);
    const median_y = median(y);
    const std_y = standardDeviation(y);
    const variance_y = variance(y);
    const iqr = interquartileRange(y);
    const line_mb = linearRegression(data_points);
    const f = linearRegressionLine(line_mb);
    const r2 = rSquared(data_points, f);
    const s_corr = sampleCorrelation(x, y);
    const s_cov = sampleCovariance(x, y);
    const std_err = Math.sqrt(
      ratings.reduce((sum, ep) => {
        return sum + Math.pow(ep.y - f(ep.x), 2);
      }, 0) /
        (n - 2)
    );

    const startX = ratings[0].x;
    const endX = ratings[ratings.length - 1].x;

    const seasonStatData = {
      season_number: season_number || 0,
      start: { x: startX, y: f(startX) },
      end: { x: endX, y: f(endX) },
      n,
      line_mb,
      range_x,
      range_y,
      median_y,
      sum_y,
      mean_y,
      std_y,
      iqr,
      variance_y,
      r2,
      s_corr,
      s_cov,
      f,
      std_err,
    };

    return seasonStatData;
  }
  return null;
  // throw new Error("Only one Episode");
};

export const calculate_statistics_for_episodes = (
  episodes_info: D3EpisodeType[]
) => {
  const episodes_statistics = calculate_statistics(episodes_info);
  return episodes_statistics;
};

export const calculate_statistics_for_seasons = (
  seasons: ImdbSeasonType[],
  episodes_info: D3EpisodeType[]
) => {
  const season_statistics = [];
  for (let index = 1; index <= seasons.length; index++) {
    const currentSeason = episodes_info.filter(
      (ep) => parseInt(ep.seasonNumber) === index
    );
    const currentSeasonStats = calculate_statistics(currentSeason, index);
    if (currentSeasonStats) {
      season_statistics.push(currentSeasonStats);
    }
  }
  return season_statistics;
};

export const sort_episodes = (episodes: D3EpisodeType[], sort_by: string) => {
  let sorted_episodes = episodes;
  switch (sort_by) {
    case "ep-desc":
      sorted_episodes = episodes.sort(
        (a, b) => b.true_ep_count - a.true_ep_count
      );
      break;
    case "ep-asc":
      sorted_episodes = episodes.sort(
        (a, b) => a.true_ep_count - b.true_ep_count
      );
      break;
    case "rating-desc":
      sorted_episodes = episodes.sort(
        (a, b) =>
          b.imDbRating - a.imDbRating ||
          parseInt(b.imDbRatingCount) - parseInt(a.imDbRatingCount)
      );
      break;
    case "rating-asc":
      sorted_episodes = episodes.sort(
        (a, b) =>
          a.imDbRating - b.imDbRating ||
          parseInt(a.imDbRatingCount) - parseInt(b.imDbRatingCount)
      );
      break;
    case "votes-desc":
      sorted_episodes = episodes.sort(
        (a, b) => parseInt(b.imDbRatingCount) - parseInt(a.imDbRatingCount)
      );
      break;
    case "votes-asc":
      sorted_episodes = episodes.sort(
        (a, b) => parseInt(a.imDbRatingCount) - parseInt(b.imDbRatingCount)
      );
      break;

    default:
      sorted_episodes = episodes.sort(
        (a, b) => a.true_ep_count - b.true_ep_count
      );
      break;
  }
  return sorted_episodes;
};
export const sort_seasons = (
  season_episodes: (D3EpisodeType[] | undefined)[],
  season_statistics: SeasonStatData[],
  sort_by: string
) => {
  const seasons_map = new Map<number, D3EpisodeType[]>();

  season_episodes.forEach((season) => {
    if (season) {
      const season_number = parseInt(season[0].seasonNumber);
      seasons_map.set(season_number, season);
    }
  });

  let sorted_seasons = season_statistics;
  switch (sort_by) {
    case "season-desc":
      sorted_seasons = season_statistics.sort(
        (a, b) => b.season_number - a.season_number
      );
      break;
    case "season-asc":
      sorted_seasons = season_statistics.sort(
        (a, b) => a.season_number - b.season_number
      );
      break;
    case "avg-rating-desc":
      sorted_seasons = season_statistics.sort((a, b) => b.mean_y - a.mean_y);
      break;
    case "avg-rating-asc":
      sorted_seasons = season_statistics.sort((a, b) => a.mean_y - b.mean_y);
      break;
    case "median-desc":
      sorted_seasons = season_statistics.sort(
        (a, b) => b.median_y - a.median_y
      );
      break;
    case "median-asc":
      sorted_seasons = season_statistics.sort(
        (a, b) => a.median_y - b.median_y
      );
      break;
    case "slope-desc":
      sorted_seasons = season_statistics.sort(
        (a, b) => b.line_mb.m - a.line_mb.m
      );
      break;
    case "slope-asc":
      sorted_seasons = season_statistics.sort(
        (a, b) => a.line_mb.m - b.line_mb.m
      );
      break;
    case "std-desc":
      sorted_seasons = season_statistics.sort((a, b) => b.std_y - a.std_y);
      break;
    case "std-asc":
      sorted_seasons = season_statistics.sort((a, b) => a.std_y - b.std_y);
      break;
    case "r2-desc":
      sorted_seasons = season_statistics.sort((a, b) => b.r2 - a.r2);
      break;
    case "r2-asc":
      sorted_seasons = season_statistics.sort((a, b) => a.r2 - b.r2);
      break;
    case "std-err-desc":
      sorted_seasons = season_statistics.sort((a, b) => b.std_err - a.std_err);
      break;
    case "std-err-asc":
      sorted_seasons = season_statistics.sort((a, b) => a.std_err - b.std_err);
      break;

    default:
      sorted_seasons = season_statistics.sort(
        (a, b) => a.season_number - b.season_number
      );
      break;
  }

  const sorted_season_episodes: D3EpisodeType[][] = [];
  sorted_seasons.forEach((season) => {
    const { season_number } = season;
    const currentSeason = seasons_map.get(season_number);
    if (currentSeason) {
      sorted_season_episodes.push(currentSeason);
    }
  });

  return sorted_season_episodes;
};

export const separate_seasons = (episodes: D3EpisodeType[]) => {
  const season_episodes_map = new Map<number, D3EpisodeType[]>();

  for (let i = 0; i < episodes.length; i++) {
    const episode = episodes[i];
    const seasonNumber = parseInt(episode.seasonNumber);

    const season = season_episodes_map.get(seasonNumber);
    if (season) {
      season.push(episode);
      season_episodes_map.set(seasonNumber, season);
    } else {
      season_episodes_map.set(seasonNumber, [episode]);
    }
  }
  const season_numbers = [...season_episodes_map.keys()].sort((a, b) => a - b);
  let season_episodes = season_numbers.map((number) => {
    const season_episodes = season_episodes_map.get(number);
    if (season_episodes) {
      return season_episodes;
    }
  });
  return season_episodes;
};
