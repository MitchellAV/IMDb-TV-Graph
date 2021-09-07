import { Similar } from "../types";
import Image from "next/image";

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
  const [exists, setExists] = useState<string[]>([]);

  useEffect(() => {
    const fetch_is_show = async (similarShows: Similar[]) => {
      let promises = [];
      for (let i = 0; i < similarShows.length; i++) {
        const imdb_id = similarShows[i].id;

        promises.push(get_tmdb_id(imdb_id));
      }
      const show_exists = await Promise.all(promises);
      setExists(show_exists);
    };
    fetch_is_show(similarShows);
  }, [similarShows]);
  return (
    <>
      <h3 className="main__header">Similar Shows</h3>
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
                  <div className="similar__img">
                    <Image
                      src={image as any}
                      alt={title}
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>

                  <div className="similar__details">
                    <h3 className="similar__title">{title}</h3>
                    <p className="similar__years"> {year}</p>
                    <p className="similar__rating">Rating: {imDbRating}</p>
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
    </>
  );
};

export default SimilarShows;
