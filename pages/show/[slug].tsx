import { GetServerSideProps } from "next";
import axios from "axios";
import { ShowWithSeasonInfoType } from "../../types";
import D3ScatterPlot from "../../components/D3ScatterPlot";
import Head from "next/head";

import ShowDetails from "../../components/ShowDetails";
import SimilarShows from "../../components/SimilarShows";
import EpisodesTable from "../../components/EpisodesTable";
import {
  calculate_statistics_for_episodes,
  calculate_statistics_for_seasons,
  format_episodes_d3_scatter,
} from "../../util/statistics";
import SearchForm from "../../components/SearchForm";

interface ShowProps {
  show: ShowWithSeasonInfoType;
}

const Show = ({ show }: ShowProps) => {
  console.log(show);
  const { show_info } = show;
  const { title, similars } = show_info;
  const seasons = show.seasons;

  const episodes_info = format_episodes_d3_scatter(seasons);

  const episode_statistics = calculate_statistics_for_episodes(episodes_info);
  const season_statistics = calculate_statistics_for_seasons(
    seasons,
    episodes_info
  );
  const rated_episodes = episodes_info.filter((ep) => ep.imDbRating !== 0);
  console.log(episode_statistics);

  return (
    <main className="main">
      <Head>
        <title>{title} - Graph</title>
        <meta name="description" content="Generated by create next app" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        ></link>
      </Head>
      <SearchForm />
      <ShowDetails
        show_info={show_info}
        episode_statistics={episode_statistics}
      />
      <SimilarShows similarShows={similars} />
      {rated_episodes.length > 0 && (
        <>
          <h1 className="main__title">{title}</h1>
          <D3ScatterPlot
            data={episodes_info}
            season_statistics={season_statistics}
          />
          <EpisodesTable
            episodes={episodes_info}
            season_statistics={season_statistics}
          />
        </>
      )}
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
