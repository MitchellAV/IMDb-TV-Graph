import { GetServerSideProps } from "next";
import axios from "axios";
import {
  ShowWithSeasonInfoType,
  IMDBShowInfoType,
  ImdbSeasonType,
  D3EpisodeType,
  SeasonStatData,
} from "../../types";
import D3ScatterPlot from "../../components/D3ScatterPlot";
import Head from "next/head";

import ShowDetails from "../../components/ShowDetails";
import SimilarShows from "../../components/SimilarShows";
import EpisodesTable from "../../components/EpisodesTable";
import ShowStatistics from "../../components/ShowStatistics";
import {
  calculate_statistics_for_episodes,
  calculate_statistics_for_seasons,
  format_episodes_d3_scatter,
} from "../../util/statistics";
import SearchForm from "../../components/SearchForm";
import { useEffect, useRef, useState } from "react";
import ScrollButton from "../../components/ScrollButton";

interface ShowProps {
  show_info: IMDBShowInfoType;
}

const Show = ({ show_info }: ShowProps) => {
  const { title, similars } = show_info;
  const { id } = show_info;
  const [isLoading, setIsLoading] = useState(true);
  const [seasons, setSeasons] = useState<ImdbSeasonType[]>([]);
  const [episodes_info, setEpisodesInfo] = useState<D3EpisodeType[]>([]);
  const [episode_statistics, setEpisodeStatistics] =
    useState<SeasonStatData | null>(null);
  const [season_statistics, setSeasonStatistics] = useState<SeasonStatData[]>(
    []
  );
  const [rated_episodes, setRatedEpisodes] = useState<D3EpisodeType[]>([]);

  const fetchSeasons = async (imdb_id: string) => {
    const URI = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/tv/${imdb_id}/seasons`;

    const options = { timeout: 1000 * 60 };
    const res = await axios.get(URI, options);
    const data = res.data.seasons as ImdbSeasonType[];

    return data;
  };

  useEffect(() => {
    fetchAndUpdateSeasonInfo(id);
  }, [show_info]);

  const fetchAndUpdateSeasonInfo = async (imdb_id: string) => {
    const season_info = await fetchSeasons(id);
    setSeasons(season_info);
    const episodes_info = format_episodes_d3_scatter(season_info);
    setEpisodesInfo(episodes_info);
    const episode_statistics = calculate_statistics_for_episodes(episodes_info);
    setEpisodeStatistics(episode_statistics);
    const season_statistics = calculate_statistics_for_seasons(
      season_info,
      episodes_info
    );
    setSeasonStatistics(season_statistics);
    const rated_episodes = episodes_info.filter((ep) => ep.imDbRating !== 0);
    setRatedEpisodes(rated_episodes);
    setIsLoading(false);
  };
  const [currSeason, setCurrSeason] = useState(0);

  const plotRef = useRef<HTMLDivElement>(null);
  return (
    <main className="main">
      <Head>
        <title>IMDb TV Show Graph</title>
        <meta
          name="description"
          content="A web application that uses IMDb TV show data to visualize episode ratings for a given show with emphasis on exploring TV season trends and finding new shows to enjoy."
        />
        <meta property="og:title" content="IMDb TV Graph" />
        <meta
          property="og:image"
          content="https://imdb-tv-graph.mitchellvictoriano.com/images/thumbnail.png"
        />
        <meta
          property="og:description"
          content="A web application that uses IMDb TV show data to visualize episode ratings for a given show with emphasis on exploring TV season trends and finding new shows to enjoy."
        />
        <meta
          property="og:url"
          content="https://imdb-tv-graph.mitchellvictoriano.com/"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="shortcut icon" href="/favicon.ico" />

        <link rel="manifest" href="/site.webmanifest" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        ></link>
      </Head>
      <SearchForm />
      <ShowDetails
        show_info={show_info}
        seasons={seasons.length}
        episode_statistics={episode_statistics}
      />
      <SimilarShows similarShows={similars} />
      {isLoading ? (
        <h3 className="search-result__modal">
          <span>
            <i className="fa fa-spinner fa-spin"></i>
          </span>
          Getting Season Information
        </h3>
      ) : (
        <>
          {rated_episodes.length > 0 && (
            <>
              <div className="chart" ref={plotRef}>
                <h1 className="main__title">
                  {title}
                  {currSeason !== 0 && ` - Season ${currSeason}`}
                </h1>

                <D3ScatterPlot
                  data={episodes_info}
                  season_statistics={season_statistics}
                  currSeason={currSeason}
                  setCurrSeason={setCurrSeason}
                />
              </div>
              {episode_statistics && (
                <div className="main__stats">
                  <ShowStatistics episode_statistics={episode_statistics} />
                </div>
              )}

              <EpisodesTable
                episodes={episodes_info}
                season_statistics={season_statistics}
                plotRef={plotRef}
              />
            </>
          )}
        </>
      )}
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { query } = context;
    const { slug, ...rest } = query;

    if (isNaN(parseInt(slug as string))) throw new Error("nan");

    const URI = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/tv/${slug}`;

    const options = { params: rest };
    const res = await axios.get(URI, options);
    const data = res.data as ShowWithSeasonInfoType;
    if (!data.show_info.tvSeriesInfo.creatorList) {
      return {
        notFound: true,
      };
    }

    return { props: data };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};

export default Show;
