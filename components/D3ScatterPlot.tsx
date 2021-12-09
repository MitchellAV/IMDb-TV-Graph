import { RefObject, SetStateAction, useEffect, useRef, useState } from "react";
import useRefDimensions from "../hooks/useRefDimensions";

import * as d3 from "d3";
import { D3EpisodeType, SeasonStatData } from "../types";
import {
  drawGrid,
  drawPlot,
  drawTrendlines,
  enableZoom,
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
    const [
      svg,
      drawArea,
      xAxis,
      yAxis,
      tooltip,
      trendlines,
      mouseover,
      mouseleave,
    ] = initSVGElements(drawDimensions);
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

    // enableZoom(
    //   svg,
    //   xScale,
    //   yScale,
    //   drawArea,
    //   line,
    //   xAxis,
    //   yAxis,
    //   drawDimensions
    // );
  }, [dimensions, xRange]);

  const draw = () => {
    d3.select("#tv-show-graph").html("");

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
    const colors = ["blue", "red", "green", "pink", "purple"];

    // Chart width and height - accounting for margins
    let drawWidth = width - margin.left - margin.right;

    let drawHeight = height - margin.top - margin.bottom;

    // Variables to display (i.e., which columns to select in the dataset)
    const xLabel = "Episode Number";
    const yLabel = "Episode Rating";

    // Find the maximum x value for the x Scale, and multiply it by 1.05 (to add space)
    let xMax = data.length;

    // Find the minimum x value for the x Scale, and multiply it by .9 (to add space)
    let xMin = 1;

    // Use `d3.scaleLinear` to define an `xScale` with the appropriate domain and range
    let xScale = d3
      .scaleLinear()
      .range([margin.left + padding, width - padding])
      .domain([xMin, xMax]);

    // Find the maximum y value for the x Scale, and multiply it by 1.05 (to add space)
    let yMax = Math.min(
      Math.max(...data.map((ep) => ep.imDbRating)) * 1.05,
      10
    );

    // Find the minimum y value for the x Scale, and multiply it by .9 (to add space)
    let yMin =
      Math.min(
        ...data.map((ep) => ep.imDbRating).filter((rating) => rating !== 0)
      ) * 0.95;

    // Use `d3.scaleLinear` to define a `yScale` with the appropriate domain and range
    let yScale = d3
      .scaleLinear()
      .range([height - margin.bottom, margin.top])
      .domain([yMin, yMax]);

    const svg = d3
      .select("#tv-show-graph")
      .append("svg")
      .attr("class", "d3")
      .attr("viewBox", `0 0 ${width} ${height}`);

    // Define xAxis using d3.axisBottom, assigning the scale as `xScale`
    const graph_decorations = svg.append("g").attr("class", "d3__decorations");
    const xAxis = graph_decorations
      .append("g")
      .attr("class", "d3__axis d3__axis--x");
    const yAxis = graph_decorations
      .append("g")
      .attr("class", "d3__axis d3__axis--y");

    let drawXAxis = (g: any, x: any) =>
      g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        //@ts-ignore
        .call(
          //@ts-ignore

          d3.axisBottom(x).tickFormat((x) => (x >= 0 && x <= xMax ? x : null))
        )
        .call((g: any) => g.select(".domain").remove());
    // Define yAxis using d3.axisLeft(), assigning the scale as `yScale`
    let drawYAxis = (g: any, y: any) =>
      g
        .attr("transform", `translate(${margin.left},0)`)
        .call(
          //@ts-ignore
          d3
            .axisLeft(y)
            .tickFormat((y) => (y >= 1 && y <= 10 ? y : null))
            .ticks(null)
            .tickSize(-drawWidth)
        )
        .call((g: any) => g.select(".domain").remove());

    // Append a text element to the svg to label the x axis
    let xAxisText = graph_decorations
      .append("text")
      .attr("id", "x-axis")
      .attr("class", "d3__label")
      .text(xLabel);

    const x_label_el = document.getElementById("x-axis");
    if (x_label_el) {
      const { width: x_label_width, height: x_label_height } =
        x_label_el.getBoundingClientRect();
      xAxisText.attr(
        "transform",
        `translate( ${width / 2 - x_label_width / 2},${
          height - x_label_height / 2
        })`
      );
    }

    // Append a text element to the svg to label the y axis
    let yAxisText = graph_decorations
      .append("text")
      .attr("id", "y-axis")
      .attr("class", "d3__label")
      .text(yLabel);

    const y_label_el = document.getElementById("y-axis");
    if (y_label_el) {
      const { width: y_label_width, height: y_label_height } =
        y_label_el.getBoundingClientRect();
      yAxisText.attr(
        "transform",
        `translate( ${y_label_height},${
          drawHeight / 2 + y_label_width / 2
        }) rotate(-90)`
      );
    }

    let tooltip = d3
      .select("#tv-show-graph")
      .append("div")
      .attr("class", "tooltip");

    // A function that change this tooltip when the user hover a point.
    // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
    let mouseover = function (e: MouseEvent, d: D3EpisodeType) {
      tooltip.style("opacity", 1).style("display", "block");
      tooltip
        .html(
          `<div id='tooltip' class='tooltip__container'><div class='tooltip__img'><img src=${d.image}></img></div><h3>${d.seasonNumber} - ${d.episodeNumber}: ${d.title}</h3><span class='tooltip__wrapper'><svg
          class="tooltip__item icon icon--star"
          xmlns="http://www.w3.org/2000/svg"
          fill="#000000"
          height="24"
          viewBox="0 0 24 24"
          width="24"
        >
          <path d="M0 0h24v24H0z" fill="none"></path>
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
          <path d="M0 0h24v24H0z" fill="none"></path>
        </svg> <p class='tooltip__item'>${d.imDbRating} (${d.imDbRatingCount} votes)</p></span><p class='tooltip__item'>Released: ${d.released}</p><p class='tooltip__item'>${d.plot}</p></div>`
        )
        .style("top", e.pageY + 20 + "px")
        .style(
          "left",
          // @ts-ignore
          tooltip_position(e) + "px"
        );
    };

    const tooltip_position = (e: MouseEvent) => {
      const pageX = e.pageX;
      const tooltip = document.getElementById("tooltip");
      const page_width = window.innerWidth;
      const padding = 50;

      if (tooltip) {
        const tooltip_width = tooltip.offsetWidth;
        const half_position = pageX - tooltip_width / 2;
        if (half_position < 0) {
          return 0;
        } else if (half_position + tooltip_width > page_width) {
          return page_width - tooltip_width - padding;
        } else {
          return half_position;
        }
      }
      return 0;
    };
    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    let mouseleave = function (e: MouseEvent, d: D3EpisodeType) {
      tooltip.style("opacity", 0).style("display", "none");
    };

    // Create the scatter variable: where both the circles and the brush take place
    const clip_path = svg
      .append("defs")
      .append("SVG:clipPath")
      .attr("id", "clip-path")
      .append("rect")
      .attr("class", "d3__clip-path")
      .attr("x", margin.left)
      .attr("y", margin.top)
      .attr("height", drawHeight)
      .attr("width", drawWidth);
    const drawArea = svg
      .append("g")
      .attr("clip-path", "url(#clip-path)")
      .attr("class", "d3__draw-area");
    const trendlines = drawArea.append("g").attr("class", "d3__trendlines");
    const line = drawArea
      .append("path")
      .attr("class", "d3__line-plot")
      .datum(data)
      .attr(
        "d",
        // @ts-ignore
        d3
          .line()
          // @ts-ignore
          .x((d: D3EpisodeType) => {
            return xScale(d.true_ep_count);
          })
          // @ts-ignore
          .y((d: D3EpisodeType) => {
            return yScale(d.imDbRating);
          })
      );
    const scatter = drawArea
      .append("g")
      .attr("class", "d3__scatter-plot")
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("class", (d) => `d3__circle season-${d.seasonNumber}`)
      .attr("cx", (d) => xScale(d.true_ep_count))
      .attr("cy", (d) => yScale(d.imDbRating))
      .attr("fill", (d) => colors[parseInt(d.seasonNumber) % colors.length])
      .attr("r", radius)
      .on("mouseover", mouseover)
      .on("mouseleave", mouseleave)
      .on("click", (e, d) => {
        document
          .getElementById(`${d.seasonNumber}-${d.episodeNumber}`)
          ?.scrollIntoView();
      });

    svg.on("dblclick", function () {
      // const season = svg.selectAll(".season-1");
      // // @ts-ignore
      // const area = season.nodes();
      // // const { width: area_width, height: area_height } = area;
      // // console.log(area_width, area_height);
      // let xMin = Infinity,
      //   xMax = -Infinity,
      //   yMin = Infinity,
      //   yMax = -Infinity;
      // for (const selection of area) {
      //   console.log(selection);
      //   // @ts-ignore
      //   const { left, right, top, bottom } = selection.getBoundingClientRect();
      //   if (left < xMin) {
      //     xMin = left;
      //   }
      //   if (right > xMax) {
      //     xMax = right;
      //   }
      //   if (top < yMin) {
      //     yMin = top;
      //   }
      //   if (bottom > yMax) {
      //     yMax = bottom;
      //   }
      // }
      // const area_width = xMax - xMin;
      // const area_height = yMax - yMin;
      // console.log(xMin, yMin);

      // xScale.domain([1, 10]);

      // svg
      //   .call(zoom.transform as any, d3.zoomIdentity)
      //   .transition()
      //   .duration(750)
      //   .call(
      //     zoom.transform as any,
      //     d3.zoomIdentity.translate(xMin, 0)
      // .scale(1 / Math.max(area_width / width, area_height / height))
      // .translate(-xMin, -yMin)
      // d3.pointer(event, svg.node()
      // );
      svg
        .transition()
        .duration(750)
        .call(zoom.transform as any, d3.zoomIdentity);
    });

    function zoomed({ transform }: any) {
      const zx = transform.rescaleX(xScale);
      const zy = transform.rescaleY(yScale);

      drawArea
        .selectAll("circle")
        .attr("transform", transform)
        .attr("r", radius / transform.k);
      line.attr(
        "d",
        // @ts-ignore
        d3
          .line()
          // @ts-ignore

          .x((d: D3EpisodeType) => {
            return zx(d.true_ep_count);
          })
          // @ts-ignore

          .y((d: D3EpisodeType) => {
            return zy(d.imDbRating);
          })
      );

      const x = drawArea.selectAll("line").attr("transform", transform);
      // @ts-ignore

      xAxis.call(drawXAxis, zx);
      yAxis.call(drawYAxis, zy);
    }

    const draw_trendline = (
      start: {
        x: number;
        y: number;
      },
      end: {
        x: number;
        y: number;
      },
      color: string,
      season_number: number,
      std_err?: number
    ) => {
      const season_g = trendlines
        .append("g")
        .attr("class", `season-${season_number}`);
      if (std_err) {
        const sigma95 = std_err;
        const upper = season_g
          .append("line")
          .attr("class", `d3__line d3__line--std`) // attach a line
          .attr("stroke", color)
          .attr("x1", (d) => xScale(start.x)) // x position of the first end of the line
          .attr("y1", (d) => yScale(start.y + sigma95)) // y position of the first end of the line
          .attr("x2", (d) => xScale(end.x)) // x position of the second end of the line
          .attr("y2", (d) => yScale(end.y + sigma95));

        const lower = season_g
          .append("line")
          .attr("class", `d3__line d3__line--std`) // attach a line
          .attr("stroke", color)
          .attr("x1", (d) => xScale(start.x)) // x position of the first end of the line
          .attr("y1", (d) => yScale(start.y - sigma95)) // y position of the first end of the line
          .attr("x2", (d) => xScale(end.x)) // x position of the second end of the line
          .attr("y2", (d) => yScale(end.y - sigma95));
      }
      const middle = season_g
        .append("line")
        .attr("class", `d3__line`) // attach a line
        .attr("stroke", color)
        .attr("x1", (d) => xScale(start.x)) // x position of the first end of the line
        .attr("y1", (d) => yScale(start.y)) // y position of the first end of the line
        .attr("x2", (d) => xScale(end.x)) // x position of the second end of the line
        .attr("y2", (d) => yScale(end.y));
    };
    season_statistics.forEach((trendline) => {
      if (trendline) {
        const { start, end, std_err, season_number } = trendline;
        draw_trendline(
          start,
          end,
          colors[season_number % colors.length],
          season_number,
          1.96 * std_err
        );
      }
    });

    const zoom = d3
      .zoom()
      .translateExtent([
        [-width * 0.1, -height * 0.1],
        [width * 1.1, height * 1.1],
      ])
      .scaleExtent([1, 10])
      .on("zoom", zoomed);

    svg
      .call(zoom as any)
      .call(zoom.transform as any, d3.zoomIdentity)
      .on("dblclick.zoom", null);
  };

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
