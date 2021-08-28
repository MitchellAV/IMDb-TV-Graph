import { Similar } from "../types";
import { useRouter } from "next/router";

import axios from "axios";
import { useEffect, useState } from "react";

interface PropType {
  similarShows: Similar[];
}

const get_tmdb_id = async (imdb_id: string) => {
  try {
    const URI = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/id/${imdb_id}`;
    const res = await axios.get(URI);
    const data = res.data as { tmdb_id: string };
    const tmdb_id = data.tmdb_id;
    return tmdb_id;
  } catch (err) {
    return "";
  }
};

const SimilarShows = ({ similarShows }: PropType) => {
  const router = useRouter();
  const [exists, setExists] = useState<string[]>([]);
  // const showRedirect = async (imdb_id: string) => {
  //   try {
  //     const tmdb_id = await get_tmdb_id(imdb_id);
  //     console.log(router);

  //     router.push(`/show/${tmdb_id}`);
  //   } catch (err) {}
  // };

  useEffect(() => {
    const fetch_is_show = async () => {
      let promises = [];
      for (let i = 0; i < similarShows.length; i++) {
        const imdb_id = similarShows[i].id;

        promises.push(get_tmdb_id(imdb_id));
      }
      const show_exists = await Promise.all(promises);
      setExists(show_exists);
    };
    fetch_is_show();
  }, []);
  return (
    <div className="similar">
      {similarShows.map((show, index) => {
        const {
          directors,
          fullTitle,
          genres,
          id,
          imDbRating,
          image,
          plot,
          stars,
          title,
          year,
        } = show;

        const is_show = exists[index];

        return (
          <>
            {is_show && (
              <div className="similar__show" key={index}>
                <img className="similar__img" src={image} alt={title} />
                <div className="similar__details">
                  <h3 className="similar__title">{title}</h3>
                  <p className="similar__years"> {year}</p>
                  <p className="similar__rating">Score: {imDbRating}</p>
                  <p className="similar__genres">{genres}</p>
                  <p className="similar__plot">{plot}</p>
                </div>
                <a
                  className="link link--similar"
                  href={`/show/${exists[index]}`}
                >
                  View Show
                </a>
              </div>
            )}
          </>
        );
      })}
    </div>
  );
};

export default SimilarShows;
