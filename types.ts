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
  show_info: IMDBShowInfoType;
  seasons: ImdbSeasonType[];
}
export interface ImdbSeasonType {
  imDbId: string;
  title: string;
  fullTitle: string;
  type: string;
  year: string;
  episodes?: ImdbEpisodesType[] | null;
  errorMessage: string;
}
export interface ImdbEpisodesType {
  id: string;
  seasonNumber: string;
  episodeNumber: string;
  title: string;
  image: string;
  year: string;
  released: string;
  plot: string;
  imDbRating: number;
  imDbRatingCount: string;
}
/////////////////////////////

export interface D3EpisodeType {
  id: string;
  seasonNumber: string;
  episodeNumber: string;
  title: string;
  image: string;
  year: string;
  released: string;
  plot: string;
  imDbRating: number;
  imDbRatingCount: string;
  true_ep_count: number;
}

//////////////////

export interface SeasonStatData {
  season_number: number;
  start: {
    x: number;
    y: number;
  };
  end: {
    x: number;
    y: number;
  };

  n: number;
  line_mb: {
    m: number;
    b: number;
  };
  range_x: [number, number];
  range_y: [number, number];
  median_y: number;
  sum_y: number;
  mean_y: number;
  std_y: number;
  iqr: number;
  variance_y: number;
  r2: number;
  s_corr: number;
  s_cov: number;
  f: (x: number) => number;
  std_err: number;
  outliers: number[];
}

///////////////////////////

export interface StarList {
  id: string;
  name: string;
}

export interface ActorList {
  id: string;
  image: string;
  name: string;
  asCharacter: string;
}

export interface GenreList {
  key: string;
  value: string;
}

export interface CompanyList {
  id: string;
  name: string;
}

export interface CountryList {
  key: string;
  value: string;
}

export interface LanguageList {
  key: string;
  value: string;
}

export interface BoxOffice {
  budget: string;
  openingWeekendUSA: string;
  grossUSA: string;
  cumulativeWorldwideGross: string;
}

export interface Similar {
  exists: string;
  id: string;
  title: string;
  fullTitle: string;
  year: string;
  image: string;
  plot: string;
  directors: string;
  stars: string;
  genres: string;
  imDbRating: string;
}
export interface Popular {
  backdrop_path: string;
  first_air_date: string;
  genre_ids: [number];
  id: number;
  name: string;
  origin_country: [string];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  vote_average: number;
  vote_count: number;
}
export interface Trending {
  backdrop_path: string;
  first_air_date: string;
  genre_ids: [number];
  id: number;
  name: string;
  origin_country: [string];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  vote_average: number;
  vote_count: number;
  media_type: string;
}

export interface CreatorList {
  id: string;
  name: string;
}

export interface TvSeriesInfo {
  yearEnd: string;
  creators: string;
  creatorList: CreatorList[];
  seasons: string[];
}

export interface IMDBShowInfoType {
  id: string;
  title: string;
  originalTitle: string;
  fullTitle: string;
  type: string;
  year: string;
  image: string;
  releaseDate: string;
  runtimeMins: string;
  runtimeStr: string;
  plot: string;
  plotLocal: string;
  plotLocalIsRtl: boolean;
  awards: string;
  directors: string;
  directorList: any[];
  writers: string;
  writerList: any[];
  stars: string;
  starList: StarList[];
  actorList: ActorList[];
  fullCast?: any;
  genres: string;
  genreList: GenreList[];
  companies: string;
  companyList: CompanyList[];
  countries: string;
  countryList: CountryList[];
  languages: string;
  languageList: LanguageList[];
  contentRating: string;
  imDbRating: string;
  imDbRatingVotes: string;
  metacriticRating: string;
  ratings?: any;
  wikipedia?: any;
  posters?: any;
  images?: any;
  trailer?: any;
  boxOffice: BoxOffice;
  tagline: string;
  keywords: string;
  keywordList: string[];
  similars: Similar[];
  tvSeriesInfo: TvSeriesInfo;
  tvEpisodeInfo?: any;
  errorMessage: string;
}
