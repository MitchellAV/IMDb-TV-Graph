import { RefObject, useEffect, useRef, useState } from "react";

import * as d3 from "d3";
import { D3EpisodeType, SeasonStatData } from "../types";

interface D3ScatterPlotType {
  data: D3EpisodeType[];
  season_statistics: SeasonStatData[];
}

const D3ScatterPlot = ({ data, season_statistics }: D3ScatterPlotType) => {
  data = data
    .filter((ep) => ep.imDbRating !== 0)
    .sort((a, b) => a.true_ep_count - b.true_ep_count);
  season_statistics = season_statistics.sort((a, b) => {
    return a.season_number - b.season_number;
  });

  const useRefDimensions = (ref: RefObject<any>) => {
    const [dimensions, setDimensions] = useState({ width: 1, height: 2 });

    const updateDimensions = () => {
      if (ref.current) {
        const { current } = ref;
        const boundingRect = current.getBoundingClientRect();
        const { width, height } = boundingRect;
        setDimensions({ width: Math.round(width), height: Math.round(height) });
      }
    };
    useEffect(() => {
      updateDimensions();
      window.addEventListener("resize", () => updateDimensions());

      return () =>
        window.removeEventListener("resize", () => updateDimensions());
    }, []);
    return dimensions;
  };
  const graphRef = useRef<HTMLDivElement>(null);
  const dimensions = useRefDimensions(graphRef);

  useEffect(() => {
    draw();
  }, [dimensions]);

  const draw = () => {
    d3.select("#tv-show-graph").html("");

    const width = dimensions.width;
    const height = dimensions.height;

    const margin = {
      top: 10,
      right: 0,
      bottom: 50,
      left: 50,
    };

    const padding = 20;

    const radius = 5;
    const colors = ["blue", "red", "green", "pink", "purple"];

    // Chart width and height - accounting for margins
    let drawWidth = width - margin.left;
    let drawHeight = height - margin.top - margin.bottom;

    // Variables to display (i.e., which columns to select in the dataset)
    const xLabel = "Episode Number";
    const yLabel = "Episode Rating";
    //////////////////////////////////////////

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

    //////////////////////////
    ////////////////////////////////////////////////////////

    // const xAxisGrid = d3
    //   .axisBottom(xScale)
    //   .tickFormat(null)
    //   .tickSize(-drawHeight);

    // svg
    //   .append("g")
    //   .attr("class", "x axis-grid")
    //   .attr("transform", `translate(0,${height - margin.bottom})`)
    //   .call(xAxisGrid);

    const svg = d3
      .select("#tv-show-graph")
      .append("svg")
      .attr("class", "D3-graph")
      .attr("viewBox", `0 0 ${width} ${height}`);

    // const drawGrid = (g: any) => {
    //   g.axisLeft(yScale).tickFormat(null).tickSize(-drawWidth);
    // };

    // svg
    //   .append("g")
    //   .attr("class", "y axis-grid")
    //   .attr("opacity", 0.2)
    //   .attr("transform", `translate(${margin.left},0)`)
    //   .call(yAxisGrid)
    //   .call((g: any) => g.select(".domain").remove())
    //   .call((g: any) => g.selectAll("text").remove());

    // Define xAxis using d3.axisBottom, assigning the scale as `xScale`
    const yAxisGrid = svg.append("g");

    const xAxis = svg.append("g");
    const yAxis = svg.append("g");
    let drawXAxis = (g: any, x: any) =>
      g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        //@ts-ignore
        .call(d3.axisBottom(x).tickFormat(d3.format("d")).ticks(10))
        .call((g: any) => g.select(".domain").remove());
    // Define yAxis using d3.axisLeft(), assigning the scale as `yScale`
    let drawYAxis = (g: any, y: any) =>
      g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(null).tickSize(-drawWidth))
        .call((g: any) => g.select(".domain").remove());

    /////////////////////////////

    // Append a `g` to the `svg` as an x axis label, specifying the 'transform' attribute to position it
    // Use the `.call` method to render the axis in the `g`
    // xAxis
    //   .attr(
    //     "transform",
    //     "translate(" + margin.left + "," + (drawHeight + margin.top) + ")"
    //   )
    //   .attr("class", "axis")
    //   .call(drawXAxis);

    // Append a `g` to the `svg` as a y axis label, specifying the 'transform' attribute to position it
    // Use the `.call` method to render the axis in the `g`
    // yAxis
    //   .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    //   .attr("class", "axis")
    //   .call(drawYAxis);

    // Append a text element to the svg to label the x axis
    let xAxisText = svg
      .append("text")
      // .attr(
      //   "transform",
      //   `translate(${drawWidth / 2 - 20}, ${height - margin.bottom + 40})`
      // )
      .attr("id", "x-axis")
      .attr("class", "axis axis__label--x")
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
    let yAxisText = svg
      .append("text")
      .attr("id", "y-axis")

      .attr("class", "axis axis__label--y")
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
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("opacity", "0")
      .style("color", "black")
      .style("font-size", "16px")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("position", "absolute")
      .style("max-width", "300px");

    // A function that change this tooltip when the user hover a point.
    // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
    let mouseover = function (e: MouseEvent, d: D3EpisodeType) {
      tooltip.style("opacity", 1).style("display", "block");
      tooltip
        .html(
          `<div class='d3_tooltip'><h3> ${d.seasonNumber} - ${d.episodeNumber}: ${d.title}</h3><p><b>Rating:</b> ${d.imDbRating}</p><p><b>Votes:</b> ${d.imDbRatingCount}</p><p><b>Aired:<b/> ${d.released}</p><p>Overview: ${d.plot}</p></div>`
        )
        .style("top", e.pageY + 20 + "px")
        .style(
          "left",
          // @ts-ignore
          e.pageX - document.querySelector(".d3_tooltip").offsetWidth / 2 + "px"
        );
    };

    // let mousemove = function (e: any, d: any) {
    //   tooltip
    //     .style("top", e.pageY + 30 + "px")
    //     .style("left", e.pageX + 30 + "px");
    // };

    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    let mouseleave = function (e: MouseEvent, d: D3EpisodeType) {
      tooltip.style("opacity", 0).style("display", "none");
    };
    /* ************************************* Data Join ************************************** */
    // Select all circles and bind data to the selection

    // Create the scatter variable: where both the circles and the brush take place
    const chart_area = svg
      .append("defs")
      .append("SVG:clipPath")
      .attr("id", "clip-path")
      .append("rect")
      .attr("x", margin.left)
      .attr("y", margin.top)
      .attr("height", drawHeight)
      .attr("width", drawWidth);
    const drawArea = svg.append("g").attr("clip-path", "url(#clip-path)");
    const line = drawArea
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke-opacity", 0.5)
      .attr("stroke", "black")
      .attr("stroke-width", 1.5)
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
      .attr("stroke", "#000")
      .attr("stroke-opacity", 0.2)
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", (d) => xScale(d.true_ep_count))
      .attr("cy", (d) => yScale(d.imDbRating))
      .attr("fill", (d) => colors[parseInt(d.seasonNumber) % colors.length])
      .attr("r", radius)
      .on("mouseover", mouseover)
      // .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .on("click", (e, d) => {
        window.open(`https://www.imdb.com/title/${d.id}`, "_blank");
      });

    let extra_lines: d3.Selection<
      SVGLineElement,
      unknown,
      HTMLElement,
      any
    >[][] = [];

    svg.on("dblclick", function () {
      svg
        .transition()
        .duration(750)
        .call(zoom.transform as any, d3.zoomIdentity);
    });

    function zoomed({ transform }: any) {
      const zx = transform.rescaleX(xScale);
      const zy = transform.rescaleY(yScale);
      // console.log(transform);

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
      // yAxisGrid.call(drawGrid, zx, zy);
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
      std_err?: number
    ) => {
      const lines = [];
      if (std_err) {
        const sigma95 = std_err;
        const upper = drawArea
          .append("line") // attach a line
          .attr("stroke", color)
          .style("stroke-dasharray", "3, 3")
          .attr("x1", (d) => xScale(start.x)) // x position of the first end of the line
          .attr("y1", (d) => yScale(start.y + sigma95)) // y position of the first end of the line
          .attr("x2", (d) => xScale(end.x)) // x position of the second end of the line
          .attr("y2", (d) => yScale(end.y + sigma95));
        lines.push(upper);
        const lower = drawArea
          .append("line") // attach a line
          .attr("stroke", color)
          .style("stroke-dasharray", "3, 3")
          .attr("x1", (d) => xScale(start.x)) // x position of the first end of the line
          .attr("y1", (d) => yScale(start.y - sigma95)) // y position of the first end of the line
          .attr("x2", (d) => xScale(end.x)) // x position of the second end of the line
          .attr("y2", (d) => yScale(end.y - sigma95));
        lines.push(lower);
      }
      const middle = drawArea
        .append("line") // attach a line
        .attr("stroke", color)
        .attr("x1", (d) => xScale(start.x)) // x position of the first end of the line
        .attr("y1", (d) => yScale(start.y)) // y position of the first end of the line
        .attr("x2", (d) => xScale(end.x)) // x position of the second end of the line
        .attr("y2", (d) => yScale(end.y));
      lines.push(middle);

      return lines;
    };
    season_statistics.forEach((trendline, index) => {
      extra_lines = [];
      if (trendline) {
        const { start, end, std_err, season_number } = trendline;

        const season_lines = draw_trendline(
          start,
          end,
          colors[season_number % colors.length],
          1.96 * std_err
        );
        extra_lines.push([...season_lines]);
      }
    });

    const zoom = d3
      .zoom()
      .translateExtent([
        [-width * 0.5, -height * 0.5],
        [width * 1.5, height * 1.5],
      ])
      .scaleExtent([1, 10])
      .on("zoom", zoomed);

    svg
      .call(zoom as any)
      .call(zoom.transform as any, d3.zoomIdentity)
      .on("dblclick.zoom", null);
  };

  return <div id="tv-show-graph" className="graph" ref={graphRef}></div>;
};

export default D3ScatterPlot;
