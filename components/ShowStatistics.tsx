import { SeasonStatData } from "../types";

interface PropType {
  episode_statistics: SeasonStatData;
}
const ShowStatistics = ({ episode_statistics }: PropType) => {
  const {
    season_number,
    iqr,
    line_mb,
    end,
    f,
    mean_y,
    median_y,
    n,
    r2,
    range_x,
    range_y,
    s_corr,
    s_cov,
    start,
    std_err,
    std_y,
    sum_y,
    variance_y,
  } = episode_statistics;
  const [low_rating, high_rating] = range_y;
  const { m } = line_mb;
  const trend_to_words = (m: number) => {
    let slope = "";
    if (m > 0) {
      slope = "Positive";
    } else if (m < 0) {
      slope = "Negative";
    } else {
      slope = "Stable";
    }
    return slope;
  };
  return (
    <div className="show__statistics">
      <div className="show__attr--table">
        <h3 className="show__header">Episode Ratings</h3>
        <table className="rating-table">
          <thead>
            <tr className="rating-table__row">
              <th className="rating-table__data  rating-table__data--header">
                Lowest
              </th>
              <th className="rating-table__data  rating-table__data--header">
                Average
              </th>

              <th className="rating-table__data  rating-table__data--header">
                Highest
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="rating-table__row">
              <td className="rating-table__data"> {low_rating}</td>
              <td className="rating-table__data">{mean_y.toFixed(1)}</td>

              <td className="rating-table__data">{high_rating}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="show__attr">
        <b>Number of Episodes</b>: {n}
      </p>
      <p className="show__attr">
        <b>Standard Deviation</b>: ±{std_y.toFixed(2)} Rating Points
      </p>
      <p className="show__attr">
        <b>
          R<sup>2</sup>
        </b>
        : {r2.toFixed(2)}
      </p>
      <p className="show__attr">
        <b>Standard Error of Regression</b>: ±{std_err.toFixed(2)} Rating Points
      </p>

      <p className="show__attr">
        <b>Trendline Direction</b>: {m.toPrecision(2)} {trend_to_words(m)}
      </p>
    </div>
  );
};

export default ShowStatistics;
