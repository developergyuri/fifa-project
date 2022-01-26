import * as d3 from "d3";
import { RefObject } from "react";
import { IPlayer } from "../Interfaces/IPlayer.interface";
import { ILineConfig, ILineData } from "../Interfaces/ILine.interface";

const LineChart = (
  ref: RefObject<HTMLElement>,
  data: Array<IPlayer>,
  selectedProp: string,
  options?: Partial<ILineConfig>
): d3.Selection<SVGSVGElement, unknown, null, undefined> => {
  const conf: ILineConfig = {
    width: 600,
    height: 500,
    opacity: 0.7,
    paddingX: 100,
    paddingY: 50,
    radius: 5,
    color: d3.scaleOrdinal(d3.schemeCategory10),
    ...options,
  };

  // Dátum (évek) legenerálása
  const date = Array.from({ length: data.length }).map((_, idx) => 2015 + idx);

  // Ábra szélesség, magasság
  const width = conf.width - conf.paddingX,
    height = conf.height - conf.paddingY;

  // Tisztítás
  d3.select(ref.current).selectAll("*").remove();

  const svg = d3
    .select(ref.current)
    .append("svg")
    .attr("width", width + conf.paddingX)
    .attr("height", height + conf.paddingY);

  const g = svg
    .append("g")
    .attr("transform", `translate(${conf.paddingX / 2},${conf.paddingY / 2})`);

  // X tengely
  const x = d3
    .scaleLinear()
    .domain([d3.min(date) || 0, d3.max(date) || 0])
    .range([0, width]);

  g.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(8).tickFormat(d3.format(".0f")));

  // Y tengely
  const y = d3
    .scaleLinear()
    .domain([
      0,
      Math.ceil((d3.max(data, (d) => Number(d[selectedProp])) || 0) / 10) * 10,
    ])
    .range([height, 0]);

  g.append("g").call(d3.axisLeft(y));

  // Adat összesítés
  const mergedData: ILineData = data.map((d, idx) => ({
    year: date[idx],
    data: d,
  }));

  const nlg = svg
    .append("g")
    .attr("transform", `translate(${conf.paddingX / 2},${conf.paddingY / 2})`);

  // Tooltip feliratok
  const tooltip = nlg
    .append("text")
    .style("opacity", 0)
    .style("font-family", "sans-serif")
    .style("font-size", "11px")
    .style("stroke", "white")
    .attr("stroke-width", 0.5);

  // Koordináta csúcsok
  nlg
    .selectAll("*")
    .data(mergedData)
    .enter()
    .append("circle")
    .attr("r", conf.radius)
    .attr("cx", ({ year }) => x(year))
    .attr("cy", ({ data }) => y(Number(data[selectedProp] || 0)))
    .style("fill", "steelblue")
    .style("fill-opacity", conf.opacity + 0.2)
    .style("cursor", "pointer")
    .on("mouseover", function (_, { data }) {
      tooltip
        .attr("x", parseFloat(d3.select(this).attr("cx")) - 10)
        .attr("y", parseFloat(d3.select(this).attr("cy")) - 5)
        .text(Number(data[selectedProp] || 0))
        .transition()
        .duration(200)
        .style("opacity", 1);
    })
    .on("mouseout", function () {
      tooltip.transition().duration(200).style("opacity", 0);
    });

  // Vonal
  nlg
    .append("path")
    .datum(mergedData)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr(
      "d",
      d3
        .line<{ year: number; data: IPlayer }>()
        .x(({ year }) => x(year))
        .y(({ data }) => y(Number(data[selectedProp] || 0) || 0))
    );

  return svg;
};

export default LineChart;
