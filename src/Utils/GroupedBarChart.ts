import * as d3 from "d3";
import { RefObject } from "react";
import { IPlayer } from "../Interfaces/IPlayer.interface";
import { IBarConfig } from "../Interfaces/IBar.interface";

const BarChart = (
  ref: RefObject<HTMLElement>,
  data: Array<IPlayer>,
  options?: Partial<IBarConfig>
): d3.Selection<SVGGElement, unknown, null, undefined> => {
  const conf: IBarConfig = {
    width: 460,
    height: 500,
    opacity: 0.8,
    margin: {
      top: 30,
      bottom: 150,
      left: 20,
      right: 20,
    },
    ...options,
  };

  // Tisztítás
  d3.select(ref.current).selectAll("*").remove();

  const svg = d3
    .select(ref.current)
    .append("svg")
    .attr("width", conf.width + conf.margin.left + conf.margin.right)
    .attr("height", conf.height + conf.margin.top + conf.margin.bottom)
    .append("g")
    .attr("transform", `translate(${conf.margin.left},${conf.margin.top})`);

  const subgroups = [
    "pace",
    "shooting",
    "passing",
    "dribbling",
    "defending",
    "physic",
  ];

  const players = d3.map(data, (d) => d.short_name);

  const x = d3.scaleBand().domain(players).range([0, conf.width]).padding(0.2);

  svg
    .append("g")
    .attr("transform", `translate(0,${conf.height})`)
    .call(d3.axisBottom(x).tickSize(0));

  var y = d3.scaleLinear().domain([0, 100]).range([conf.height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  var xSubgroup = d3
    .scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding(0.05);

  const color: any = d3.scaleOrdinal(d3.schemeCategory10);

  const tooltip = d3
    .select(ref.current)
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("background", "#323e56")
    .style("padding", "5px")
    .style("border-radius", "5px");

  svg
    .append("g")
    .selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .attr("transform", (d) => `translate(${x(d.short_name)},0)`)
    .selectAll("rect")
    .data((d) => subgroups.map((key) => ({ key: key, value: d[key] })))
    .enter()
    .append("rect")
    .attr("x", (d) => xSubgroup(d.key) || 0)
    .attr("y", (d) => y(Number(d.value)))
    .attr("width", xSubgroup.bandwidth())
    .attr("height", (d) => conf.height - y(Number(d.value)))
    .attr("fill", (d) => color(d.key))
    .style("opacity", 0.5)
    .on("mouseover", function (_, { value }) {
      d3.select(this).style("opacity", 0.8).attr("stroke", "black");
      tooltip.style("visibility", "visible").text(String(value));
    })
    .on("mouseleave", function () {
      d3.select(this).style("opacity", 0.5).attr("stroke", "transparent");
      tooltip.style("visibility", "hidden");
    })
    .on("mousemove", function (e) {
      return tooltip
        .style("top", `${e.pageY - 15}px`)
        .style("left", `${e.pageX + 15}px`);
    });

  const legendGroup = svg.append("g").attr("class", "legendGroup");

  const legend = legendGroup
    .append("g")
    .attr("class", "legend")
    .attr("transform", `translate(0, ${conf.height + 30})`);

  legend
    .selectAll("rect")
    .data(subgroups)
    .enter()
    .append("rect")
    .attr("x", 0)
    .attr("y", (_, idx) => idx * 20)
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", (sg) => color(sg));

  legend
    .selectAll("text")
    .data(subgroups)
    .enter()
    .append("text")
    .attr("x", 20)
    .attr("y", (_, idx) => idx * 20 + 9)
    .attr("font-size", "11px")
    .attr("fill", "white")
    .text((txt) => txt);
  return svg;
};

export default BarChart;
