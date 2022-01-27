import * as d3 from "d3";
import { RefObject } from "react";
import {
  IPolygonData,
  ISpiderConfig,
  ISpiderData,
} from "../Interfaces/ISpider.interface";

const RadarChart = (
  ref: RefObject<HTMLElement>,
  data: Array<ISpiderData>,
  legends: Array<string>,
  title: string,
  options?: Partial<ISpiderConfig>
): d3.Selection<SVGSVGElement, unknown, null, undefined> => {
  const conf: ISpiderConfig = {
    radius: 5,
    width: 600,
    height: 600,
    factorLegend: 0.85,
    levels: 3,
    maxValue: 0,
    radians: 2 * Math.PI,
    opacity: 0.5,
    PaddingX: 100,
    PaddingY: 100 + 50 * data.length,
    color: d3.scaleOrdinal(d3.schemeCategory10),
    ...options,
  };

  // Maximum érték kalkulálása ha nincsen megadva
  conf.maxValue = Math.max(
    conf.maxValue,
    d3.max(data, (sd) => d3.max(sd.map(({ value }) => value))) || 0
  );

  // Tengely feliratok (tulajdonságok)
  const axisLabels = data[0].map(({ axis }) => axis);

  // Tengelyek száma
  const numOfAxis = axisLabels.length;

  const radius = Math.min(conf.width / 2, conf.height / 2);

  // Tisztítás
  d3.select(ref.current).select("svg").remove();

  const svg = d3
    .select(ref.current)
    .append("svg")
    .attr("width", conf.width + conf.PaddingX)
    .attr("height", conf.height + conf.PaddingY);

  const g = svg
    .append("g")
    .attr(
      "transform",
      `translate(${conf.PaddingX / 2}, ${
        (conf.PaddingY - data.length * 50) / 2
      })`
    );

  // Sávok és Feliratok
  Array.from({ length: conf.levels }, (_, i) => {
    const levelFactor = radius * ((i + 1) / conf.levels);

    // Sávok
    g.selectAll(".levels")
      .data(axisLabels)
      .enter()
      .append("line")
      .attr(
        "x1",
        (_, i) => levelFactor * (1 - Math.sin((i * conf.radians) / numOfAxis))
      )
      .attr(
        "y1",
        (_, i) => levelFactor * (1 - Math.cos((i * conf.radians) / numOfAxis))
      )
      .attr(
        "x2",
        (_, i) =>
          levelFactor * (1 - Math.sin(((i + 1) * conf.radians) / numOfAxis))
      )
      .attr(
        "y2",
        (_, i) =>
          levelFactor * (1 - Math.cos(((i + 1) * conf.radians) / numOfAxis))
      )
      .attr("class", "line")
      .style("stroke", "white")
      .style("stroke-opacity", conf.opacity + 0.2)
      .style("stroke-width", "0.2px")
      .attr(
        "transform",
        `translate(${conf.width / 2 - levelFactor}, ${
          conf.height / 2 - levelFactor
        })`
      );

    // Feliratok
    g.selectAll(".levels")
      .data(
        Array.from({ length: conf.levels }).map(
          (_, idx) => idx * (conf.maxValue / conf.levels)
        )
      )
      .enter()
      .append("text")
      .attr("x", () => levelFactor * (1 - Math.sin(0)))
      .attr("y", () => levelFactor * (1 - Math.cos(0)))
      .attr("class", "legend")
      .style("font-family", "sans-serif")
      .style("font-size", "10px")
      .attr(
        "transform",
        `translate(${conf.width / 2 - levelFactor + 10}, ${
          conf.height / 2 - levelFactor
        })`
      )
      .attr("fill", "#A1A1A1")
      .text(Math.round(((i + 1) * conf.maxValue) / conf.levels));
  });

  // Tengelyek
  const axis = g
    .selectAll(".axis")
    .data(axisLabels)
    .enter()
    .append("g")
    .attr("class", "axis");

  axis
    .append("line")
    .attr("x1", conf.width / 2)
    .attr("y1", conf.height / 2)
    .attr(
      "x2",
      (_, i) =>
        (conf.width / 2) * (1 - Math.sin((i * conf.radians) / numOfAxis))
    )
    .attr(
      "y2",
      (_, i) =>
        (conf.height / 2) * (1 - Math.cos((i * conf.radians) / numOfAxis))
    )
    .attr("class", "line")
    .style("stroke", "white")
    .style("stroke-width", "1px");

  axis
    .append("text")
    .attr("width", 50)
    .attr("height", 100)
    .attr(
      "x",
      (_, i) =>
        (conf.width / 2) *
          (1 - conf.factorLegend * Math.sin((i * conf.radians) / numOfAxis)) -
        60 * Math.sin((i * conf.radians) / numOfAxis)
    )
    .attr(
      "y",
      (_, i) =>
        (conf.height / 2) * (1 - Math.cos((i * conf.radians) / numOfAxis)) -
        20 * Math.cos((i * conf.radians) / numOfAxis)
    )
    .attr("class", "legend")
    .each(function (text) {
      text.split(" ").map((t, i) => {
        d3.select(this)
          .append("tspan")
          .text(t)
          .attr("dy", `${i * 0.5}rem`)
          .attr("text-anchor", "middle");
      });
    })
    .style("font-family", "sans-serif")
    .style("font-size", "11px")
    .attr("fill", "white")
    .attr("text-anchor", "middle")
    .attr("dy", "1.5em")
    .attr("transform", () => "translate(0, -10)");

  data.forEach((sd, idx) => {
    const dataValues: IPolygonData = sd.map(({ value }, idx) => ({
      x:
        (conf.width / 2) *
        (1 -
          (Math.max(value, 0) / conf.maxValue) *
            Math.sin((idx * conf.radians) / numOfAxis)),
      y:
        (conf.height / 2) *
        (1 -
          (Math.max(value, 0) / conf.maxValue) *
            Math.cos((idx * conf.radians) / numOfAxis)),
    }));

    g.selectAll(".area")
      .data([dataValues])
      .enter()
      .append("polygon")
      .attr("class", `polygon-${idx}`)
      .style("stroke-width", "1px")
      .style("stroke", conf.color(idx))
      .attr("points", (pd: IPolygonData) =>
        pd.map(({ x, y }) => `${x}, ${y}`).join(" ")
      )
      .style("fill", () => conf.color(idx))
      .style("fill-opacity", conf.opacity)
      .on("mouseover", function () {
        g.selectAll("polygon")
          .transition()
          .duration(200)
          .style("fill-opacity", 0.1);

        g.selectAll(`polygon.${d3.select(this).attr("class")}`)
          .transition()
          .duration(200)
          .style("fill-opacity", conf.opacity);
      })
      .on("mouseout", function () {
        g.selectAll("polygon")
          .transition()
          .duration(200)
          .style("fill-opacity", conf.opacity);
      });
  });

  // Tooltip feliratok
  const tooltip = g
    .append("text")
    .style("opacity", 0)
    .style("font-family", "sans-serif")
    .style("font-size", "13px")
    .style("cursor", "pointer")
    .attr("fill", "white");

  // Koordináta csúcsok
  data.forEach((sd, idx) => {
    g.selectAll(".nodes")
      .data(sd)
      .enter()
      .append("circle")
      .attr("class", `circle-${idx}`)
      .attr("r", conf.radius)
      .attr("alt", ({ value }) => Math.max(value, 0))
      .attr(
        "cx",
        ({ value }, idx) =>
          (conf.width / 2) *
          (1 -
            (Math.max(value, 0) / conf.maxValue) *
              Math.sin((idx * conf.radians) / numOfAxis))
      )
      .attr("cy", ({ value }, idx) => {
        return (
          (conf.height / 2) *
          (1 -
            (Math.max(value, 0) / conf.maxValue) *
              Math.cos((idx * conf.radians) / numOfAxis))
        );
      })
      //.attr("data-ref", ({ axis }) => axis)
      .style("fill", conf.color(idx))
      .style("fill-opacity", 0.9)
      .on("mouseover", function (_, { value }) {
        tooltip
          .attr("x", parseFloat(d3.select(this).attr("cx")) - 10)
          .attr("y", parseFloat(d3.select(this).attr("cy")) - 5)
          .text(value)
          .transition()
          .duration(200)
          .style("opacity", 1);

        g.selectAll("polygon")
          .transition()
          .duration(200)
          .style("fill-opacity", 0.1);

        g.selectAll(`polygon.${d3.select(this).attr("class")}`)
          .transition()
          .duration(200)
          .style("fill-opacity", 0.7);
      })
      .on("mouseout", () => {
        tooltip.transition().duration(200).style("opacity", 0);
        g.selectAll("polygon")
          .transition()
          .duration(200)
          .style("fill-opacity", conf.opacity);
      })
      .append("title")
      .text(({ value }) => Math.max(value, 0));
  });

  // Jelmagyarázat
  const legendGroup = svg.append("g").attr("class", "legendGroup");

  legendGroup
    .append("text")
    .attr("class", "title")
    .attr("x", 0)
    .attr("y", 0)
    .attr(
      "transform",
      `translate(50, ${conf.height + (conf.PaddingY || 0) / 2 + 10 + 12})`
    )
    .attr("font-size", "12px")
    .attr("fill", "white")
    .text(title);

  const legend = legendGroup
    .append("g")
    .attr("class", "legend")
    .attr(
      "transform",
      `translate(70, ${conf.height + (conf.PaddingY || 0) / 2 + 20 + 12})`
    );

  // Színes jelölő nézet
  legend
    .selectAll("rect")
    .data(legends)
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
    .data(legends)
    .enter()
    .append("text")
    .attr("x", 20)
    .attr("y", (_, idx) => idx * 20 + 9)
    .attr("font-size", "11px")
    .attr("fill", "white")
    .text((txt) => txt);

  return svg;
};

export default RadarChart;
