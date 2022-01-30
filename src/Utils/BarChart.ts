import * as d3 from "d3";
import { RefObject } from "react";
import { IPlayer } from "../Interfaces/IPlayer.interface";
import { IBarConfig } from "../Interfaces/IBar.interface";

const BarChart = (
  ref: RefObject<HTMLElement>,
  data: Array<IPlayer>,
  selectedProp: string,
  options?: Partial<IBarConfig>
): d3.Selection<SVGGElement, unknown, null, undefined> => {
  const conf: IBarConfig = {
    width: 450,
    height: 500,
    opacity: 0.8,
    margin: {
      top: 30,
      bottom: 70,
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

  const x = d3
    .scaleBand()
    .range([0, conf.width])
    .domain(data.map((d) => d.short_name))
    .padding(0.2);
  svg
    .append("g")
    .attr("transform", `translate(0, ${conf.height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr(
      "transform",
      `translate(-10,${conf.width > 576 ? 0 : 15})rotate(-${
        conf.width > 576 ? 45 : 90
      })`
    )
    .style("text-anchor", "end");

  const yFeatures = data.map((d) => d[selectedProp]);

  const y = d3
    .scaleLinear()
    .domain([
      d3.min(yFeatures, (y) => Number(y)) || 0,
      d3.max(yFeatures, (y) => Number(y)) || 0,
    ])
    .range([conf.height, 0]);
  svg.append("g").call(d3.axisLeft(y));

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
    .selectAll("bars")
    .data(data)
    .join("rect")
    // @ts-ignore: Unreachable code error
    .attr("x", (d) => x(d.short_name))
    // @ts-ignore: Unreachable code error
    .attr("y", (d) => y(d[selectedProp]))
    .attr("width", x.bandwidth())
    // @ts-ignore: Unreachable code error
    .attr("height", (d) => conf.height - y(Number(d[selectedProp]) || 0))
    .attr("fill", "#1f77b4")
    .style("opacity", 0.5)
    .on("mouseover", function (_, d) {
      d3.select(this).style("opacity", 0.8).attr("stroke", "black");
      tooltip.style("visibility", "visible").text(String(d[selectedProp]));
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

  return svg;
};

export default BarChart;
