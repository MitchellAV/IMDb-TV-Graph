import { Popular, Trending } from "../types";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";

const PopularShows = () => {
  const [popular, setPopular] = useState<Trending[]>([]);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const URI = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/tv/trending/day`;
        const res = await axios.get(URI);
        const data = res.data.results as Trending[];
        console.log(data);

        setPopular(data);
        return data;
      } catch (err) {
        return "";
      }
    };
    fetchPopular();
  }, []);
  return (
    <>
      <h2 className="main__header">Trending Shows for the Day</h2>
      <div className="similar">
        {popular
          .filter((d) => d.overview !== "")
          .map((show, index) => {
            const {
              id,
              name,
              origin_country,
              original_language,
              genre_ids,
              backdrop_path,
              first_air_date,
              original_name,
              overview,
              popularity,
              poster_path,
              vote_average,
              vote_count,
            } = show;

            const o_size = overview.split(" ");
            const WORD_LIMIT = 50;
            const m_overview =
              o_size.length > WORD_LIMIT
                ? o_size.slice(0, WORD_LIMIT).join(" ") + "..."
                : o_size.join(" ");

            return (
              <div className="similar__show" key={index}>
                <div className="similar__img">
                  <Image
                    src={
                      (process.env.NEXT_PUBLIC_TMDB_IMG_PATH +
                        poster_path) as any
                    }
                    alt={name}
                    layout="fill"
                    objectFit="contain"
                  />
                </div>

                <div className="similar__details">
                  <h3 className="similar__title">{name}</h3>
                  <p className="similar__rating">Rating: {vote_average}</p>
                  <p className="similar__plot">{m_overview}</p>
                </div>
                <a className="link link--similar" href={`/show/${id}`}>
                  View Show
                </a>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default PopularShows;
