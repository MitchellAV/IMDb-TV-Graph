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
    const yAxisGrid = d3.axisLeft(yScale).tickFormat(null).tickSize(-drawWidth);
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

    // svg
    //   .append("g")
    //   .attr("class", "y axis-grid")
    //   .attr("opacity", 0.2)
    //   .attr("transform", `translate(${margin.left},0)`)
    //   .call(yAxisGrid)
    //   .call((g: any) => g.select(".domain").remove())
    //   .call((g: any) => g.selectAll("text").remove());

    // Define xAxis using d3.axisBottom, assigning the scale as `xScale`
    let xAxis = (g: any) =>
      g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.format("d")).ticks(10))
        .call((g: any) => g.select(".domain").remove());
    // Define yAxis using d3.axisLeft(), assigning the scale as `yScale`
    let yAxis = (g: any) =>
      g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale).ticks(10).tickSize(-drawWidth))
        .call((g: any) => g.select(".domain").remove());

    /////////////////////////////

    // Append a `g` to the `svg` as an x axis label, specifying the 'transform' attribute to position it
    // Use the `.call` method to render the axis in the `g`
    let xAxisLabel = svg
      .append("g")
      .attr(
        "transform",
        "translate(" + margin.left + "," + (drawHeight + margin.top) + ")"
      )
      .attr("class", "axis")
      .call(xAxis);

    // Append a `g` to the `svg` as a y axis label, specifying the 'transform' attribute to position it
    // Use the `.call` method to render the axis in the `g`
    let yAxisLabel = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .attr("class", "axis")
      .call(yAxis);

    // Append a text element to the svg to label the x axis
    let xAxisText = svg
      .append("text")
      .attr(
        "transform",
        `translate(${drawWidth / 2 - 20}, ${height - margin.bottom + 40})`
      )
      .attr("class", "axis-label")
      .text(xLabel);

    // Append a text element to the svg to label the y axis
    let yAxisText = svg
      .append("text")
      .attr(
        "transform",
        `translate( ${margin.left - 30},${drawHeight / 2}) rotate(-90)`
      )
      .attr("class", "axis-label")
      .text(yLabel);

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
      console.log("hover");

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
    const data_points = svg.append("g").attr("clip-path", "url(#clip)");
    data_points
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
    data_points
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

    // const zoom = d3.zoom().scaleExtent([0.5, 32]).on("zoom", zoomed);

    // svg.call(zoom).call(zoom.transform, d3.zoomIdentity);

    // function zoomed({ transform }) {
    //   const zx = transform.rescaleX(x).interpolate(d3.interpolateRound);
    //   const zy = transform.rescaleY(y).interpolate(d3.interpolateRound);
    //   gDot.attr("transform", transform).attr("stroke-width", 5 / transform.k);
    //   gx.call(xAxis, zx);
    //   gy.call(yAxis, zy);
    //   gGrid.call(grid, zx, zy);
    // }
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
      if (std_err) {
        const sigma95 = std_err;
        svg
          .append("line") // attach a line
          .attr("stroke", color)
          .style("stroke-dasharray", "3, 3")
          .attr("x1", (d) => xScale(start.x)) // x position of the first end of the line
          .attr("y1", (d) => yScale(start.y + sigma95)) // y position of the first end of the line
          .attr("x2", (d) => xScale(end.x)) // x position of the second end of the line
          .attr("y2", (d) => yScale(end.y + sigma95));
        svg
          .append("line") // attach a line
          .attr("stroke", color)
          .style("stroke-dasharray", "3, 3")
          .attr("x1", (d) => xScale(start.x)) // x position of the first end of the line
          .attr("y1", (d) => yScale(start.y - sigma95)) // y position of the first end of the line
          .attr("x2", (d) => xScale(end.x)) // x position of the second end of the line
          .attr("y2", (d) => yScale(end.y - sigma95));
      }
      svg
        .append("line") // attach a line
        .attr("stroke", color)
        .attr("x1", (d) => xScale(start.x)) // x position of the first end of the line
        .attr("y1", (d) => yScale(start.y)) // y position of the first end of the line
        .attr("x2", (d) => xScale(end.x)) // x position of the second end of the line
        .attr("y2", (d) => yScale(end.y));
    };
    season_statistics.forEach((trendline, index) => {
      if (trendline) {
        const { start, end, std_err } = trendline;

        draw_trendline(
          start,
          end,
          colors[(index + 1) % colors.length],
          1.96 * std_err
        );
      }
    });

    // Use the .exit() and .remove() methods to remove elements that are no longer in the data
    // circles.exit().remove();

    // Add hovers using the d3-tip library
    // chartG.call(tip);
    // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
    // var zoom = d3
    //   .zoom()
    //   .scaleExtent([0.5, 20]) // This control how much you can unzoom (x0.5) and zoom (x20)
    //   .extent([
    //     [0, 0],
    //     [drawWidth, drawHeight],
    //   ])
    //   .on("zoom", updateChart);

    // // This add an invisible rect on top of the chart area. This rect can recover pointer events: necessary to understand when the user zoom
    // svg
    //   // .append("rect")
    //   // .attr("width", width)
    //   // .attr("height", height)
    //   // .style("fill", "none")
    //   // .style("pointer-events", "all")
    //   // .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    //   .call(zoom);
    // // now the user can zoom and it will trigger the function called updateChart

    // // A function that updates the chart when the user zoom and thus new boundaries are available
    // function updateChart(e: any) {
    //   // recover the new scale
    //   var newX = e.transform.rescaleX(xScale);
    //   var newY = e.transform.rescaleY(yScale);

    //   // update axes with these new boundaries
    //   // xAxis((g: any) => g.axisBottom(newX));
    //   // yAxis((g: any) => g.axisLeft(newY));

    //   // update circle position
    //   scatter.attr("transform", e.transform);
    //   // svg.call(xAxis, newX);
    //   // svg.call(yAxis, newY);
    // }
  };

  return <div id="tv-show-graph" className="graph" ref={graphRef}></div>;
};

export default D3ScatterPlot;
