export interface ErrorType {
  message: string;
  status: number;
  errors: string[];
}
///////////////////////////////////////////////

export interface SeasonType {
  _id: string;
  air_date: string;
  episodes?: EpisodesType[] | null;
  name: string;
  overview: string;
  id: number;
  poster_path: string;
  season_number: number;
}
////////////////////////////////////////////////
export interface EpisodesType {
  air_date: string;
  episode_number: number;
  crew?: CrewType[] | null;
  guest_stars?: GuestStarsType[] | null;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  season_number: number;
  still_path: string;
  vote_average: number;
  vote_count: number;
}
export interface CrewType {
  department: string;
  job: string;
  credit_id: string;
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path?: string | null;
}
export interface GuestStarsType {
  credit_id: string;
  order: number;
  character: string;
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path?: string | null;
}
//////////////////////////////////////////////////////
export interface ResultType {
  backdrop_path: string;
  first_air_date: string;
  genre_ids: number[];
  id: number;
  name: string;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  vote_average: number;
  vote_count: number;
}

export interface SearchType {
  page: number;
  results: ResultType[];
  total_pages: number;
  total_results: number;
}

/////////////////////////////////////////////////

export interface ShowType {
  backdrop_path: string;
  created_by?: CreatedByType[] | null;
  episode_run_time?: number[] | null;
  first_air_date: string;
  genres?: GenresType[] | null;
  homepage: string;
  id: number;
  in_production: boolean;
  languages?: string[] | null;
  last_air_date: string;
  last_episode_to_air: LastEpisodeToAir;
  name: string;
  next_episode_to_air?: null;
  networks?: NetworksType[] | null;
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country?: string[] | null;
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies?: ProductionCompaniesType[] | null;
  production_countries?: ProductionCountriesType[] | null;
  seasons?: SeasonsType[] | null;
  spoken_languages?: SpokenLanguagesType[] | null;
  status: string;
  tagline: string;
  type: string;
  vote_average: number;
  vote_count: number;
}
export interface CreatedByType {
  id: number;
  credit_id: string;
  name: string;
  gender: number;
  profile_path: string;
}
export interface GenresType {
  id: number;
  name: string;
}
export interface LastEpisodeToAir {
  air_date: string;
  episode_number: number;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  season_number: number;
  still_path: string;
  vote_average: number;
  vote_count: number;
}
export interface NetworksType {
  name: string;
  id: number;
  logo_path: string;
  origin_country: string;
}
export interface ProductionCompaniesType {
  name: string;
  id: number;
  logo_path?: string | null;
  origin_country: string;
}
export interface ProductionCountriesType {
  iso_3166_1: string;
  name: string;
}
export interface SeasonsType {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
}
export interface SpokenLanguagesType {
  english_name: string;
  iso_639_1: string;
  name: string;
}
////////////////////////////////////////////////

export interface RecommendationsType {
  page: number;
  results?: ResultsEntity[] | null;
  total_pages: number;
  total_results: number;
}
export interface ResultsEntity {
  backdrop_path: string;
  first_air_date: string;
  genre_ids?: number[] | null;
  id: number;
  original_language: string;
  original_name: string;
  overview: string;
  origin_country?: string[] | null;
  poster_path: string;
  popularity: number;
  name: string;
  vote_average: number;
  vote_count: number;
}
/////////////////////////////////
export interface ShowWithSeasonInfoType {
  show_info: ShowType;
  seasons: SeasonType[];
}
/////////////////////////////

export interface D3EpisodeType {
  episode_number: number;
  air_date: string;
  name: string;
  overview: string;
  season_number: number;
  still_path: string;
  vote_average: number;
  vote_count: number;
  true_ep_count: number;
}
