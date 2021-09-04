import { IMDBShowInfoType, SeasonStatData } from "../types";
import ShowStatistics from "./ShowStatistics";
import Image from "next/image";
import { min } from "d3-array";
import { useState } from "react";

interface PropType {
  show_info: IMDBShowInfoType;
  episode_statistics: SeasonStatData | null;
}

const format_runtime_string = (mins_total: number) => {
  const years_total = mins_total / 60 / 24 / 7 / (13 / 3) / 12;
  const years = Math.floor(years_total);
  const months_total = (years_total - years) * 12;
  const months = Math.floor(months_total);
  const weeks_total = (months_total - months) * (13 / 3);
  const weeks = Math.floor(weeks_total);
  const days_total = (weeks_total - weeks) * 7;
  const days = Math.floor(days_total);
  const hours_total = (days_total - days) * 24;
  const hours = Math.floor(hours_total);
  const mins = Math.ceil((hours_total - hours) * 24);

  let string = "";
  if (years === 1) {
    string += `${years} year `;
  } else if (years > 0) {
    string += `${years} years `;
  }
  if (months === 1) {
    string += `${months} month `;
  } else if (months > 0) {
    string += `${months} months `;
  }
  if (weeks === 1) {
    string += `${weeks} week `;
  } else if (weeks > 0) {
    string += `${weeks} weeks `;
  }
  if (days === 1) {
    string += `${days} day `;
  } else if (days > 0) {
    string += `${days} days `;
  }
  if (hours === 1) {
    string += `${hours} hour `;
  } else if (hours > 0) {
    string += `${hours} hours `;
  }
  if (mins === 1) {
    string += `${mins} min `;
  } else if (mins > 0) {
    string += `${mins} mins `;
  }
  return string;
};

const ShowDetails = ({ show_info, episode_statistics }: PropType) => {
  const {
    actorList,
    companyList,
    countries,
    contentRating,
    fullTitle,
    genreList,
    id,
    imDbRating,
    imDbRatingVotes,
    image,
    keywordList,
    languages,
    plot,
    releaseDate,
    runtimeStr,
    runtimeMins,
    starList,
    title,
    tvSeriesInfo: { creatorList, seasons },
  } = show_info;

  const num_stars = starList.length;
  const num_seasons = seasons.length;
  let runtime_length_string = "";
  let total_runtime_mins = 0;
  if (runtimeMins && episode_statistics) {
    total_runtime_mins = parseInt(runtimeMins) * episode_statistics.n;
    runtime_length_string = format_runtime_string(total_runtime_mins);
  }

  const [hours, setHours] = useState(0);

  const remove_as_duplicates = (words: string[]) => {
    if (words.length % 2 == 0) {
      let half_index = words.length / 2;

      let wordA = words[half_index - 1];
      let wordA_as = wordA;
      wordA = wordA.slice(0, wordA.length - 2);

      let wordB = words[words.length - 1].replace("…", "");
      words[words.length - 1] = wordB;
      if (wordA === wordB || wordA_as === wordB) {
        return words.slice(-half_index);
      }
    }

    return words;
  };

  const clean_char_name = (char_name: string) => {
    let char_name_array = char_name.split(" ").filter((name) => {
      if (
        isNaN(name as any) &&
        name !== "episodes" &&
        name !== "episodes," &&
        name !== "/" &&
        name !== "..." &&
        name.indexOf("(") < 0 &&
        name.indexOf(")") < 0 &&
        name.indexOf("-") < 0
      )
        return true;

      return false;
    });
    if (char_name_array.length > 0) {
      char_name_array = remove_as_duplicates(char_name_array);
    }
    return char_name_array.join(" ");
  };
  return (
    <div className="show">
      <div className="show__img">
        <Image
          src={image as any}
          alt={title}
          layout="fill"
          objectFit="contain"
        />
      </div>

      <div className="show__info">
        <a
          className="link link--main"
          href={`https://www.imdb.com/title/${id}`}
          target="_blank"
          rel="noreferrer"
        >
          View on IMDb
        </a>
        <p className="show__title">{title}</p>
        <p className="show__attr">
          <b>Full Title:</b> {fullTitle}
        </p>
        <p className="show__attr">
          <b>Rating:</b> {imDbRating}/10 ({imDbRatingVotes} votes)
        </p>
        <p className="show__attr">
          <b>Release Date:</b> {releaseDate}
        </p>

        <p className="show__attr">
          <b>Content Rating:</b> {contentRating}
        </p>
        <p className="show__attr">
          <b>Languages:</b> {languages}
        </p>
        <p className="show__attr">
          <b>Countries:</b> {countries}
        </p>
        <p className="show__attr">
          <b>Number of Seasons:</b> {num_seasons}
        </p>
        {episode_statistics && (
          <p className="show__attr">
            <b>Number of Episodes:</b> {episode_statistics.n}
          </p>
        )}
        {runtimeStr && (
          <p className="show__attr">
            <b>Episode Runtime:</b> {runtimeStr}
          </p>
        )}
        {runtime_length_string && (
          <p className="show__attr">
            <b>Total Runtime:</b> {runtime_length_string}
          </p>
        )}
        <div className="show__attr">
          <label htmlFor="time">
            How many hours of free time do you have per day?
          </label>
          <input
            id="time"
            name="time"
            type="number"
            onChange={(e) => {
              let value = parseInt(e.currentTarget.value);
              if (!isNaN(value)) {
                setHours(value);
              }
            }}
          ></input>
          <p>{Math.ceil(total_runtime_mins / (hours * 60))} days</p>
        </div>
        <p className="show__attr">
          <b>Synopsis:</b>
          <br /> {plot}
        </p>
        <p className="show__attr">
          <b>Creators:</b>{" "}
          {creatorList.map((creator) => (
            <a
              className="link link--show"
              href={`https://www.imdb.com/name/${creator.id}`}
              target="_blank"
              rel="noreferrer"
              key={creator.id}
            >
              {creator.name}
            </a>
          ))}
        </p>
        <div className="show__attr show__attr--actors">
          <b>Actors:</b>
          <div className="show__actors">
            {actorList.map((actor) => (
              <div className="actor" key={actor.id}>
                <a
                  className="link "
                  href={`https://www.imdb.com/name/${actor.id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="actor__img">
                    <Image
                      src={actor.image as any}
                      alt={actor.name}
                      layout="fill"
                      objectFit="cover"
                      objectPosition="top"
                    />
                  </div>
                </a>

                <p className="actor__char">
                  <a
                    className="link link--actor"
                    href={`https://www.imdb.com/name/${actor.id}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {actor.name}
                  </a>
                  <br />
                  as {clean_char_name(actor.asCharacter)}
                </p>
              </div>
            ))}
          </div>
        </div>
        <p className="show__attr">
          <b>Companies:</b>{" "}
          {companyList.map((company) => (
            <a
              className="link link--show"
              href={`https://www.imdb.com/search/title/?companies=${company.id}`}
              target="_blank"
              rel="noreferrer"
              key={company.id}
            >
              {company.name}
            </a>
          ))}
        </p>
        <p className="show__attr">
          <b>Genres:</b>{" "}
          {genreList.map((genre) => (
            <a
              className="link link--show"
              href={`https://www.imdb.com/search/title/?genres=${genre.value}`}
              target="_blank"
              rel="noreferrer"
              key={genre.key}
            >
              {genre.value}
            </a>
          ))}
        </p>
        {/* <p className="show__attr">
          <b>Tags:</b>{" "}
          {keywordList.map((keyword) => (
            <a
              className="link link--show"
              href={`https://www.imdb.com/search/keyword/?keywords=${keyword}`}
              target="_blank"
              key={keyword}
            >
              {keyword}
            </a>
          ))}
        </p> */}
        {episode_statistics && (
          <ShowStatistics episode_statistics={episode_statistics} />
        )}
      </div>
    </div>
  );
};

export default ShowDetails;
