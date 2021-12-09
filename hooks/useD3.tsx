import * as d3 from "d3";
import { D3EpisodeType, SeasonStatData } from "../types";

interface drawDimensions {
  width: number;
  height: number;
  drawWidth: number;
  drawHeight: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  padding: number;
  radius: number;
  colors: string[];
}

export const setXScale = (
  xMin: number,
  xMax: number,
  drawDimensions: drawDimensions
) => {
  const { margin, padding, width } = drawDimensions;
  return d3
    .scaleLinear()
    .range([margin.left + padding, width - padding])
    .domain([xMin, xMax]);
};

// Use `d3.scaleLinear` to define an `xScale` with the appropriate domain and range

export const setYScale = (
  yMin: number,
  yMax: number,
  drawDimensions: drawDimensions
) => {
  const { margin, height } = drawDimensions;
  return d3
    .scaleLinear()
    .range([height - margin.bottom, margin.top])
    .domain([yMin, yMax]);
};

const drawXAxis = (
  g: any,
  x: any,
  xMax: number,
  drawDimensions: drawDimensions
) =>
  g
    .attr(
      "transform",
      `translate(0,${drawDimensions.height - drawDimensions.margin.bottom})`
    )
    //@ts-ignore
    .call(
      //@ts-ignore

      d3
        .axisBottom(x)
        // @ts-ignore
        .tickFormat((x) => (x >= 0 && x % 1 == 0 && x <= xMax ? x : null))
    )
    .call((g: any) => g.select(".domain").remove());
// Define yAxis using d3.axisLeft(), assigning the scale as `yScale`
const drawYAxis = (g: any, y: any, drawDimensions: drawDimensions) =>
  g
    .attr("transform", `translate(${drawDimensions.margin.left},0)`)
    .call(
      //@ts-ignore
      d3
        .axisLeft(y)
        .tickFormat((y) => (y >= 1 && y <= 10 ? y : null))
        .ticks(null)
        .tickSize(-drawDimensions.drawWidth)
    )
    .call((g: any) => g.select(".domain").remove());
// Define xAxis using d3.axisBottom, assigning the scale as `xScale`

// Append a text element to the svg to label the x axis

// A function that change this tooltip when the user hover a point.
// Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)

// A function that change this tooltip when the leaves a point: just need to set opacity to 0 again

export const initSVGElements = (drawDimensions: drawDimensions) => {
  const {
    drawHeight,
    colors,
    drawWidth,
    height,
    margin,
    padding,
    radius,
    width,
  } = drawDimensions;

  // Variables to display (i.e., which columns to select in the dataset)
  const xLabel = "Episode Number";
  const yLabel = "Episode Rating";

  const svg = d3
    .select("#tv-show-graph")
    .append("svg")
    .attr("class", "d3")
    .attr("viewBox", `0 0 ${width} ${height}`);

  const graph_decorations = svg
    .append("g")
    .attr("class", "d3__decorations")
    .attr("id", "chart-y");
  const xAxis = graph_decorations
    .append("g")
    .attr("class", "d3__axis d3__axis--x");
  const yAxis = graph_decorations
    .append("g")

    .attr("class", "d3__axis d3__axis--y");
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
        height - x_label_height / 2 + 5
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
  const chart = document.getElementById("chart-y");

  if (y_label_el && chart) {
    const { width: y_label_width, height: y_label_height } =
      y_label_el.getBoundingClientRect();
    yAxisText.attr(
      "transform",
      `translate( ${y_label_height - 5},${
        chart.getBoundingClientRect().height / 2 + y_label_width / 2
      }) rotate(-90)`
    );
  }

  const tooltip = d3
    .select("#tv-show-graph")
    .append("div")
    .attr("class", "tooltip");

  const mouseover = (e: MouseEvent, d: D3EpisodeType) => {
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

  const mouseleave = (e: MouseEvent, d: D3EpisodeType) => {
    tooltip.style("opacity", 0).style("display", "none");
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
        return padding;
      } else if (half_position + tooltip_width > page_width) {
        return page_width - tooltip_width - 2 * padding;
      } else {
        return half_position;
      }
    }
    return 0;
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

  return {
    svg,
    drawArea,
    xAxis,
    yAxis,
    tooltip,
    trendlines,
    mouseover,
    mouseleave,
  };
};

// export const enableZoom = (
//   svg,
//   xScale,
//   yScale,
//   drawArea,
//   line,
//   xAxis,
//   yAxis,
//   drawDimensions: drawDimensions
// ) => {
//   const { height, width } = drawDimensions;

//   const zoom = d3
//     .zoom()
//     .translateExtent([
//       [-width * 0.1, -height * 0.1],
//       [width * 1.1, height * 1.1],
//     ])
//     .scaleExtent([1, 10])
//     .on("zoom", (e, d) =>
//       zoomed(e, xScale, yScale, drawArea, line, xAxis, yAxis, drawDimensions)
//     );
//   svg.on("dblclick", function () {
//     svg
//       .transition()
//       .duration(750)
//       .call(zoom.transform as any, d3.zoomIdentity);
//   });
//   svg
//     .call(zoom as any)
//     .call(zoom.transform as any, d3.zoomIdentity)
//     .on("dblclick.zoom", null);
// };

export const drawGrid = (
  xMax: number,
  xScale: d3.ScaleLinear<number, number, never>,
  yScale: d3.ScaleLinear<number, number, never>,
  xAxis: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
  yAxis: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
  drawDimensions: drawDimensions
) => {
  xAxis.call((g, x) => drawXAxis(g, x, xMax, drawDimensions), xScale);
  yAxis.call((g, x) => drawYAxis(g, x, drawDimensions), yScale);
};

export const drawPlot = (
  drawArea: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
  data: D3EpisodeType[],
  xScale: d3.ScaleLinear<number, number, never>,
  yScale: d3.ScaleLinear<number, number, never>,
  drawDimensions: drawDimensions,
  mouseover: (e: MouseEvent, d: D3EpisodeType) => void,
  mouseleave: (e: MouseEvent, d: D3EpisodeType) => void
) => {
  const { colors, radius } = drawDimensions;
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
    .attr("fill", (d) => colors[(parseInt(d.seasonNumber) - 1) % colors.length])
    .attr("r", radius)
    .on("mouseover", mouseover)
    .on("mouseleave", mouseleave)
    .on("click", (e, d) => {
      document
        .getElementById(`${d.seasonNumber}-${d.episodeNumber}`)
        ?.scrollIntoView();
    });
  return [line, scatter];
};

// const zoomed = (
//   e,
//   xScale,
//   yScale,
//   drawArea,
//   line,
//   xAxis,
//   yAxis,
//   drawDimensions
// ) => {
//   const { transform } = e;
//   const zx = transform.rescaleX(xScale);
//   const zy = transform.rescaleY(yScale);

//   drawArea
//     .selectAll("circle")
//     .attr("transform", transform)
//     .attr("r", drawDimensions.radius / transform.k);
//   line.attr(
//     "d",
//     // @ts-ignore
//     d3
//       .line()
//       // @ts-ignore

//       .x((d: D3EpisodeType) => {
//         return zx(d.true_ep_count);
//       })
//       // @ts-ignore

//       .y((d: D3EpisodeType) => {
//         return zy(d.imDbRating);
//       })
//   );

//   const x = drawArea.selectAll("line").attr("transform", transform);
//   // @ts-ignore

//   xAxis.call(drawXAxis, zx);
//   yAxis.call(drawYAxis, zy);
// };

const draw_trendline = (
  trendlines:
    | d3.Selection<SVGSVGElement, unknown, HTMLElement, any>
    | d3.Selection<SVGGElement, unknown, HTMLElement, any>
    | d3.Selection<HTMLDivElement, unknown, HTMLElement, any>,
  xScale: d3.ScaleLinear<number, number, never>,
  yScale: d3.ScaleLinear<number, number, never>,
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
  r2: number,
  mean: number,
  std: number,
  std_err: number
) => {
  const r2_cutoff = 0.4;
  const season_g = trendlines
    .append("g")
    .attr("class", `season-${season_number}`);
  if (r2 < r2_cutoff) {
    const sigma95 = 1.96 * std;
    const upper = season_g
      .append("line")
      .attr("class", `d3__line d3__line--std`) // attach a line
      .attr("stroke", color)
      .attr("x1", (d) => xScale(start.x)) // x position of the first end of the line
      .attr("y1", (d) => yScale(mean + sigma95)) // y position of the first end of the line
      .attr("x2", (d) => xScale(end.x)) // x position of the second end of the line
      .attr("y2", (d) => yScale(mean + sigma95));

    const lower = season_g
      .append("line")
      .attr("class", `d3__line d3__line--std`) // attach a line
      .attr("stroke", color)
      .attr("x1", (d) => xScale(start.x)) // x position of the first end of the line
      .attr("y1", (d) => yScale(mean - sigma95)) // y position of the first end of the line
      .attr("x2", (d) => xScale(end.x)) // x position of the second end of the line
      .attr("y2", (d) => yScale(mean - sigma95));

    const middle = season_g
      .append("line")
      .attr("class", `d3__line`) // attach a line
      .attr("stroke", color)
      .attr("x1", (d) => xScale(start.x)) // x position of the first end of the line
      .attr("y1", (d) => yScale(mean)) // y position of the first end of the line
      .attr("x2", (d) => xScale(end.x)) // x position of the second end of the line
      .attr("y2", (d) => yScale(mean));
  } else {
    const sigma95 = 1.96 * std_err;
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

    const middle = season_g
      .append("line")
      .attr("class", `d3__line`) // attach a line
      .attr("stroke", color)
      .attr("x1", (d) => xScale(start.x)) // x position of the first end of the line
      .attr("y1", (d) => yScale(start.y)) // y position of the first end of the line
      .attr("x2", (d) => xScale(end.x)) // x position of the second end of the line
      .attr("y2", (d) => yScale(end.y));
  }
};

export const drawTrendlines = (
  trendlines:
    | d3.Selection<SVGSVGElement, unknown, HTMLElement, any>
    | d3.Selection<SVGGElement, unknown, HTMLElement, any>
    | d3.Selection<HTMLDivElement, unknown, HTMLElement, any>,
  xScale: d3.ScaleLinear<number, number, never>,
  yScale: d3.ScaleLinear<number, number, never>,
  season_statistics: SeasonStatData[],
  drawDimensions: drawDimensions
) => {
  const { colors } = drawDimensions;
  season_statistics.forEach((trendline) => {
    if (trendline) {
      const { start, end, std_err, season_number, r2, std_y, mean_y } =
        trendline;
      draw_trendline(
        trendlines,
        xScale,
        yScale,
        start,
        end,
        colors[(season_number - 1) % colors.length],
        season_number,
        r2,
        mean_y,
        std_y,
        std_err
      );
    }
  });
};
