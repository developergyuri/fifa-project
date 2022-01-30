import * as d3 from "d3";
import { RefObject } from "react";
import { IPlayer } from "../Interfaces/IPlayer.interface";
import { IPieConfig } from "../Interfaces/IPie.interface";
import { sort } from "fast-sort";
import { PieArcDatum } from "d3";

const PieChart = (
  ref: RefObject<HTMLElement>,
  data: Array<IPlayer>,
  options?: Partial<IPieConfig>
): d3.Selection<SVGGElement, unknown, null, undefined> => {
  const conf: IPieConfig = {
    width: 450,
    height: 500,
    opacity: 0.7,
    paddingX: 100,
    paddingY: 50,
    color: d3.scaleOrdinal(d3.schemeCategory10),
    ...options,
  };

  // Ábra szélesség, magasság
  const width = conf.width - conf.paddingX,
    height = conf.height - conf.paddingY;

  // Tisztítás
  d3.select(ref.current).selectAll("*").remove();

  const groupData = d3.group(data, (d) => d.preferred_foot);
  const fd = sort(
    Array.from(groupData.keys()).map((k) => ({
      name: k,
      value: groupData.get(k)?.length || 0,
    }))
  ).asc((d) => d.value);

  const radius = Math.min(width, height) / 2;

  const svg = d3
    .select(ref.current)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  const pie = d3.pie<{ name: string; value: number }>().value((d) => d.value);
  const data_pie = pie(fd);

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
    .selectAll("slice")
    .data(data_pie)
    .join("path")
    .attr(
      "d",
      d3
        .arc<PieArcDatum<{ name: string; value: number }>>()
        .innerRadius(0)
        .outerRadius(radius)
    )
    .attr("fill", (_, idx) => conf.color(idx))
    .attr("stroke", "transparent")
    .style("stroke-width", "1px")
    .style("opacity", 0.5)
    .style("cursor", "pointer")
    .on("mouseover", function (_, { data }) {
      d3.select(this).style("opacity", 0.8).attr("stroke", "black");
      tooltip
        .style("visibility", "visible")
        .text(
          `${(
            (data.value / fd.map((d) => d.value).reduce((a, b) => a + b, 0)) *
            100
          ).toFixed(2)}%`
        );
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
    .attr("transform", `translate(${-radius}, ${radius + 20})`);

  // Színes jelölő nézet
  legend
    .selectAll("rect")
    .data(fd.map((d) => d.name))
    .enter()
    .append("rect")
    .attr("x", 0)
    .attr("y", (_, idx) => idx * 20)
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", (_, idx) => conf.color(idx));

  // A címke neve
  legend
    .selectAll("text")
    .data(fd.map((d) => d.name))
    .enter()
    .append("text")
    .attr("x", 20)
    .attr("y", (_, idx) => idx * 20 + 9)
    .attr("font-size", "11px")
    .attr("fill", "white")
    .text((txt) => txt);

  return svg;
};

export default PieChart;
