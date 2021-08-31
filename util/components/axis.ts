import * as d3 from "d3";
import { D3EpisodeType } from "../../types";
import { D3Component } from "../d3Component";

// export class Axis extends D3Component {
//   private _data: D3EpisodeType[];
//   private _xAxis: d3.Axis<d3.NumberValue> | undefined;
//   private _yAxis: d3.Axis<d3.NumberValue> | undefined;

//   constructor(data: D3EpisodeType[], width: number, height: number) {
//     super(width, height);
//     this._data = data;
//     this.init(width, height);
//   }

//   init(width: number, height: number) {
//     const margin = {
//       top: 50,
//       right: 50,
//       bottom: 50,
//       left: 50,
//     };

//     const padding = 30;

//     let xMax = this._data.length;
//     let xMin = 1;

//     let xScale = d3
//       .scaleLinear()
//       .range([margin.left + padding, width - margin.right - padding])
//       .domain([xMin, xMax]);

//     let yMax = Math.min(
//       Math.max(...this._data.map((ep) => ep.imDbRating)) * 1.05,
//       10
//     );

//     let yMin =
//       Math.min(
//         ...this._data
//           .map((ep) => ep.imDbRating)
//           .filter((rating) => rating !== 0)
//       ) * 0.95;

//     let yScale = d3
//       .scaleLinear()
//       .range([height - margin.bottom, margin.top])
//       .domain([yMin, yMax]);

//     this._xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d")).ticks(10);

//     this._yAxis = d3
//       .axisLeft(yScale)
//       .ticks(10)
//       .tickSize(-(width - margin.left - margin.right));
//   }

//   draw() {
//     const margin = {
//       top: 50,
//       right: 50,
//       bottom: 50,
//       left: 50,
//     };
//     let drawWidth = this._width - margin.left - margin.right;
//     let drawHeight = this._height - margin.top - margin.bottom;

//     const xLabel = "Episode Number";
//     const yLabel = "Episode Rating";

//     let xAxis = (g: any) =>
//       g
//         .attr("transform", `translate(0,${this._height - margin.bottom})`)
//         .call(this._xAxis)
//         .call((g: any) => g.select(".domain").remove());

//     let yAxis = (g: any) =>
//       g
//         .attr("transform", `translate(${margin.left},0)`)
//         .call(this._yAxis)
//         .call((g: any) => g.select(".domain").remove());

//     let xAxisLabel = svg
//       .append("g")
//       .attr(
//         "transform",
//         "translate(" + margin.left + "," + (drawHeight + margin.top) + ")"
//       )
//       .attr("class", "axis")
//       .call(xAxis);

//     // Append a `g` to the `svg` as a y axis label, specifying the 'transform' attribute to position it
//     // Use the `.call` method to render the axis in the `g`
//     let yAxisLabel = svg
//       .append("g")
//       .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
//       .attr("class", "axis")
//       .call(yAxis);

//     // Append a text element to the svg to label the x axis
//     let xAxisText = svg
//       .append("text")
//       .attr(
//         "transform",
//         `translate(${margin.left + drawWidth / 2 - 20}, ${
//           this._height - margin.bottom + 40
//         })`
//       )
//       .attr("class", "axis-label")
//       .text(xLabel);

//     // Append a text element to the svg to label the y axis
//     let yAxisText = svg
//       .append("text")
//       .attr(
//         "transform",
//         `translate( ${margin.left - 40},${
//           margin.top + drawHeight / 2 + 20
//         }) rotate(-90)`
//       )
//       .attr("class", "axis-label")
//       .text(yLabel);
//   }
// }
