import { useEffect, useRef, useState } from "react";

import * as d3 from "d3";
import { D3EpisodeType } from "../types";

type TrendlineType = {
  start: {
    x: number;
    y: number;
  };
  end: {
    x: number;
    y: number;
  };
} | null;

interface D3ScatterPlotType {
  data: D3EpisodeType[];
  trendlines: TrendlineType[];
}

const D3ScatterPlot = ({ data, trendlines }: D3ScatterPlotType) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    draw();
  }, []);

  const draw = () => {
    const width = window.innerWidth;
    const height = 500;

    const margin = {
      top: 20,
      right: 60,
      bottom: 50,
      left: 60,
    };

    const radius = 5;
    const colors = ["blue", "red", "green", "pink", "purple"];

    // Chart width and height - accounting for margins
    let drawWidth = width - margin.left - margin.right;
    let drawHeight = height - margin.top - margin.bottom;

    // Variables to display (i.e., which columns to select in the dataset)
    const xVar = "Episode Number";
    const yVar = "Episode Rating";
    //////////////////////////////////////////
    const svg = d3
      .select(ref.current)
      .attr("width", width)
      .attr("height", height);

    // Find the maximum x value for the x Scale, and multiply it by 1.05 (to add space)
    let xMax = data.length;

    // Find the minimum x value for the x Scale, and multiply it by .9 (to add space)
    let xMin = 1;

    // Use `d3.scaleLinear` to define an `xScale` with the appropriate domain and range
    let xScale = d3
      .scaleLinear()
      .range([margin.left + 50, width - margin.right])
      .domain([xMin, xMax]);

    // Find the maximum y value for the x Scale, and multiply it by 1.05 (to add space)
    let yMax = Math.max(...data.map((ep) => ep.vote_average));

    // Find the minimum y value for the x Scale, and multiply it by .9 (to add space)
    let yMin =
      Math.min(
        ...data.map((ep) => ep.vote_average).filter((rating) => rating !== 0)
      ) * 0.95;

    // Use `d3.scaleLinear` to define a `yScale` with the appropriate domain and range
    let yScale = d3
      .scaleLinear()
      .range([height - margin.bottom, margin.top])
      .domain([yMin, yMax]);

    //////////////////////////

    // Define xAxis using d3.axisBottom, assigning the scale as `xScale`
    let xAxis = (g: any) =>
      g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xScale).ticks(width / 80))
        .call((g: any) => g.select(".domain").remove());
    // Define yAxis using d3.axisLeft(), assigning the scale as `yScale`
    let yAxis = (g: any) =>
      g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale).ticks(width / 80))
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
        `translate(${margin.left + drawWidth / 2 - 20}, ${
          height - margin.bottom + 40
        })`
      )
      .attr("class", "axis-label")
      .text(xVar);

    // Append a text element to the svg to label the y axis
    let yAxisText = svg
      .append("text")
      .attr(
        "transform",
        `translate( ${margin.left - 40},${
          margin.top + drawHeight / 2 + 20
        }) rotate(-90)`
      )
      .attr("class", "axis-label")
      .text(yVar);

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
      tooltip.style("opacity", 1);
      tooltip
        .html(
          `<div class='d3_tooltip'><h3> ${d.season_number} - ${d.episode_number}: ${d.name}</h3><p>Rating: ${d.vote_average}</p><p>Votes: ${d.vote_count}</p><p>Overview:<br>${d.overview}</p></div>`
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
    let mouseleave = function (e: any, d: D3EpisodeType) {
      tooltip

        .style("opacity", 0)
        .style("left", "-10000px")
        .style("top", "-10000px");
    };
    /* ************************************* Data Join ************************************** */
    // Select all circles and bind data to the selection
    svg
      .append("g")
      .attr("stroke", "#000")
      .attr("stroke-opacity", 0.2)
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", (d) => xScale(d.true_ep_count))
      .attr("cy", (d) => yScale(d.vote_average))
      .attr("fill", (d) => colors[d.season_number % colors.length])
      .attr("r", radius)
      .on("mouseover", mouseover)
      // .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);

    const draw_trendline = (trendline: TrendlineType, color: string) => {
      if (trendline) {
        console.log(trendline);

        const { start, end } = trendline;
        svg
          .append("line") // attach a line
          .attr("stroke", color)
          .attr("x1", (d) => xScale(start.x)) // x position of the first end of the line
          .attr("y1", (d) => yScale(start.y)) // y position of the first end of the line
          .attr("x2", (d) => xScale(end.x)) // x position of the second end of the line
          .attr("y2", (d) => yScale(end.y));
      }
    };
    trendlines.forEach((trendline, index) => {
      draw_trendline(trendline, colors[(index + 1) % colors.length]);
    });

    // Use the .exit() and .remove() methods to remove elements that are no longer in the data
    // circles.exit().remove();

    // Add hovers using the d3-tip library
    // chartG.call(tip);
  };

  return (
    <div id="tv-show-graph">
      <svg className="D3-Scatter-Plot" ref={ref}></svg>
    </div>
  );
};

export default D3ScatterPlot;
