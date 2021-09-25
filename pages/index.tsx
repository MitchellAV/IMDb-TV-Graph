import Head from "next/head";
import SearchForm from "../components/SearchForm";

const Home = () => {
  return (
    <main>
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
          href="apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="favicon-16x16.png"
        />
        <link rel="manifest" href="site.webmanifest" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        ></link>
      </Head>
      <h1 className="home__header">Search for a TV Show to Explore</h1>
      <SearchForm />
    </main>
  );
};

export default Home;
