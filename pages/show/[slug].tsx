import { GetServerSideProps } from "next";
import axios from "axios";
import {
  D3EpisodeType,
  ImdbSeasonType,
  SeasonStatData,
  ShowWithSeasonInfoType,
} from "../../types";
import D3ScatterPlot from "../../components/D3ScatterPlot";
import Head from "next/head";
import { RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";
import ShowDetails from "../../components/ShowDetails";
import SimilarShows from "../../components/SimilarShows";
import EpisodesTable from "../../components/EpisodesTable";

interface ShowProps {
  show: ShowWithSeasonInfoType;
}

const format_episodes_d3_scatter = (seasons: ImdbSeasonType[]) => {
  const episodes_info: D3EpisodeType[] = [];
  let true_ep_count = 1;
  seasons.forEach((season) => {
    if (season.episodes) {
      const ep = season.episodes.forEach((ep) => {
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

const find_regression_values = (
  season_episodes: D3EpisodeType[]
): SeasonStatData | null => {
  let ratings = season_episodes
    .map((ep) => {
      return { x: ep.true_ep_count, y: ep.imDbRating };
    })
    .filter((rating) => rating.y !== 0);

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

    const avgY = sumY / n;

    const std = Math.sqrt(
      ratings.reduce((sum, ep) => {
        return sum + Math.pow(ep.y - avgY, 2);
      }, 0) / n
    );

    const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

    const b = (sumY - m * sumX) / n;

    const startX = ratings[0].x;
    const endX = ratings[ratings.length - 1].x;

    const seasonStatData = {
      start: { x: startX, y: m * startX + b },
      end: { x: endX, y: m * endX + b },
      m,
      b,
      std,
    };
    return seasonStatData;
  }
  return null;
};

const get_trendline_for_seasons = (
  seasons: ImdbSeasonType[],
  episodes_info: D3EpisodeType[]
) => {
  const trendline_points = [];
  for (let index = 1; index <= seasons.length; index++) {
    const currentSeason = episodes_info.filter(
      (ep) => ep.seasonNumber == index
    );
    trendline_points.push(find_regression_values(currentSeason));
  }
  return trendline_points;
};

const Show = ({ show }: ShowProps) => {
  console.log(show);
  const { show_info } = show;
  const { title, similars } = show_info;
  const seasons = show.seasons;

  const episodes_info = format_episodes_d3_scatter(seasons);
  const trendline_points = get_trendline_for_seasons(seasons, episodes_info);

  return (
    <main>
      <Head>
        <title>{title} - Graph</title>
        <meta name="description" content="Generated by create next app" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        ></link>
      </Head>
      <h1 className="main__title">{title}</h1>

      <D3ScatterPlot data={episodes_info} trendlines={trendline_points} />
      <ShowDetails show_info={show_info} />
      <SimilarShows similarShows={similars} />
      <EpisodesTable episodes={episodes_info} season_stats={trendline_points} />
    </main>
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
