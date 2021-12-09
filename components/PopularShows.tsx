import { Popular } from "../types";
import Image from "next/image";

interface PropType {
  popularShows: Popular[];
}

const PopularShows = ({ popularShows }: PropType) => {
  return (
    <>
      <div className="similar">
        {popularShows
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
              <>
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
              </>
            );
          })}
      </div>
    </>
  );
};

export default PopularShows;
