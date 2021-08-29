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
      <h3 className="show__header">Statistics:</h3>
      <p className="show__attr">
        <b>
          R<sup>2</sup>
        </b>
        : {r2.toFixed(2)}
      </p>
      <div className="show__attr--table">
        <h4>Episode Ratings</h4>
        <table className="rating-table">
          <tr className="rating-table__row">
            <th className="rating-table__data  rating-table__data--header">
              Lowest
            </th>
            <th className="rating-table__data  rating-table__data--header">
              Average
            </th>
            <th className="rating-table__data  rating-table__data--header">
              Median
            </th>
            <th className="rating-table__data  rating-table__data--header">
              Highest
            </th>
          </tr>
          <tr className="rating-table__row">
            <td className="rating-table__data"> {low_rating}</td>
            <td className="rating-table__data">{mean_y.toFixed(1)}</td>
            <td className="rating-table__data">{median_y.toFixed(1)}</td>
            <td className="rating-table__data">{high_rating}</td>
          </tr>
        </table>
      </div>
      <p className="show__attr">
        <b>Number of Episodes</b>: {n}
      </p>
      <p className="show__attr">
        <b>Standard Deviation</b>: ±{std_y.toFixed(2)}
      </p>
      <p className="show__attr">
        <b>Standard Error of Regression</b>: {std_err.toFixed(2)}
      </p>
      <p className="show__attr">
        <b>Sample Correlation</b>: {s_corr.toFixed(2)}
      </p>
      <p className="show__attr">
        <b>Sample Covariance</b>: {s_cov.toFixed(2)}
      </p>
      <p className="show__attr">
        <b>Variance</b>: {variance_y.toFixed(2)}
      </p>
      <p className="show__attr">
        <b>Trend Direction</b>: {trend_to_words(m)}
      </p>
    </div>
  );
};

export default ShowStatistics;
