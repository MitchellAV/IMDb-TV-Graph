import { RefObject, SetStateAction, useEffect, useRef, useState } from "react";
import useRefDimensions from "../hooks/useRefDimensions";

import * as d3 from "d3";
import { D3EpisodeType, SeasonStatData } from "../types";
import {
  drawGrid,
  drawPlot,
  drawTrendlines,
  initSVGElements,
  setXScale,
  setYScale,
} from "../hooks/useD3";

interface D3ScatterPlotType {
  data: D3EpisodeType[];
  season_statistics: SeasonStatData[];
  currSeason: number;
  setCurrSeason: (value: SetStateAction<number>) => void;
}

const D3ScatterPlot = ({
  data,
  season_statistics,
  setCurrSeason,
  currSeason,
}: D3ScatterPlotType) => {
  data = data
    .filter((ep) => ep.imDbRating !== 0)
    .sort((a, b) => a.true_ep_count - b.true_ep_count);
  season_statistics = season_statistics.sort((a, b) => {
    return a.season_number - b.season_number;
  });
  // Find the maximum x value for the x Scale, and multiply it by 1.05 (to add space)
  let xMax = data.length;

  // Find the minimum x value for the x Scale, and multiply it by .9 (to add space)
  let xMin = 1;
  const [xRange, setXRange] = useState([xMin, xMax]);

  const graphRef = useRef<HTMLDivElement>(null);
  const dimensions = useRefDimensions(graphRef);

  const width = dimensions.width;
  const height = dimensions.height;

  const margin = {
    top: 20,
    right: 0,
    bottom: 50,
    left: 50,
  };
  const padding = 20;
  const radius = 5;
  const colors = ["#197BBD", "#17B890", "#F5C518", "#FF6201", "#AA4465"];

  // Chart width and height - accounting for margins
  let drawWidth = width - margin.left - margin.right;

  let drawHeight = height - margin.top - margin.bottom;

  const drawDimensions = {
    width,
    height,
    margin,
    padding,
    radius,
    colors,
    drawWidth,
    drawHeight,
  };

  useEffect(() => {
    // draw();

    let xScale = setXScale(xRange[0], xRange[1], drawDimensions);

    // Find the maximum y value for the x Scale, and multiply it by 1.05 (to add space)
    let yMax = Math.min(
      Math.max(
        ...data
          .filter(
            (ep) =>
              ep.true_ep_count >= xRange[0] && ep.true_ep_count <= xRange[1]
          )
          .map((ep) => ep.imDbRating)
      ) * 1.05,
      10.1
    );

    // Find the minimum y value for the x Scale, and multiply it by .9 (to add space)
    let yMin =
      Math.min(
        ...data
          .filter(
            (ep) =>
              ep.true_ep_count >= xRange[0] && ep.true_ep_count <= xRange[1]
          )
          .map((ep) => ep.imDbRating)
          .filter((rating) => rating !== 0)
      ) * 0.95;

    let yScale = setYScale(yMin, yMax, drawDimensions);
    d3.select("#tv-show-graph").html("");
    const {
      svg,
      drawArea,
      xAxis,
      yAxis,
      tooltip,
      trendlines,
      mouseover,
      mouseleave,
    } = initSVGElements(drawDimensions);
    drawGrid(xMax, xScale, yScale, xAxis, yAxis, drawDimensions);
    const [line, scatter] = drawPlot(
      drawArea,
      data,
      xScale,
      yScale,
      drawDimensions,
      mouseover,
      mouseleave
    );
    drawTrendlines(
      trendlines,
      xScale,
      yScale,
      season_statistics,
      drawDimensions
    );
  }, [dimensions, xRange]);

  return (
    <>
      <div id="tv-show-graph" className="graph" ref={graphRef}></div>
      <div className="graph__controls">
        {season_statistics.map((s) => (
          <button
            className="graph__button"
            style={{
              background: colors[(s.season_number - 1) % colors.length],
            }}
            onClick={() => {
              setXRange([s.range_x[0] - 1, s.range_x[1] + 1]);
              setCurrSeason(s.season_number);
            }}
            key={s.season_number}
          >
            {s.season_number}
          </button>
        ))}
        {currSeason !== 0 && (
          <button
            className="graph__button"
            style={{
              background: "#fff",
            }}
            onClick={() => {
              setXRange([xMin, xMax]);
              setCurrSeason(0);
            }}
          >
            Reset
          </button>
        )}
      </div>
    </>
  );
};

export default D3ScatterPlot;
