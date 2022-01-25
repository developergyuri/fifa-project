import * as d3 from "d3";
import { RefObject } from "react";
import {
  IPolygonData,
  ISpiderConfig,
  ISpiderData,
  ISpiderDataElement,
} from "../Interfaces/ISpider.interface";

const RadarChart = (
  ref: RefObject<HTMLElement>,
  data: Array<ISpiderData>,
  options: Partial<ISpiderConfig>
) => {
  const conf: ISpiderConfig = {
    radius: 5,
    w: 600,
    h: 600,
    factor: 1,
    factorLegend: 0.85,
    levels: 3,
    maxValue: 0,
    radians: 2 * Math.PI,
    opacityArea: 0.5,
    ToRight: 10, // A feliratok eltolásának mértéke
    TranslateX: 80, // ábra eltolás a szélétől
    TranslateY: 30, // ábra eltolás a tetejétől
    ExtraWidthX: 100,
    ExtraWidthY: 100,
    color: d3.scaleOrdinal(d3.schemeCategory10),
    ...options,
  };

  // Maximum érték kalkulálása ha nincsen megadva
  conf.maxValue = Math.max(
    conf.maxValue,
    d3.max(data, (sd) => d3.max(sd.map(({ value }) => value))) || 0
  );

  // Tengely feliratok (tulajdonságok)
  const allAxis = data[0].map(({ axis }) => axis);

  // Tengelyek száma
  const total = allAxis.length;

  const radius = conf.factor * Math.min(conf.w / 2, conf.h / 2);

  // Tisztítás
  d3.select(ref.current).select("svg").remove();

  const g = d3
    .select(ref.current)
    .append("svg")
    .attr("width", conf.w + conf.ExtraWidthX)
    .attr("height", conf.h + conf.ExtraWidthY)
    .append("g")
    .attr("transform", `translate(${conf.TranslateX}, ${conf.TranslateY})`);

  // Sávok és Feliratok
  Array.from({ length: conf.levels }, (_, i) => {
    const levelFactor = conf.factor * radius * ((i + 1) / conf.levels);

    // Sávok
    g.selectAll(".levels")
      .data(allAxis)
      .enter()
      .append("svg:line")
      .attr(
        "x1",
        (_, i) =>
          levelFactor * (1 - conf.factor * Math.sin((i * conf.radians) / total))
      )
      .attr(
        "y1",
        (_, i) =>
          levelFactor * (1 - conf.factor * Math.cos((i * conf.radians) / total))
      )
      .attr(
        "x2",
        (_, i) =>
          levelFactor *
          (1 - conf.factor * Math.sin(((i + 1) * conf.radians) / total))
      )
      .attr(
        "y2",
        (_, i) =>
          levelFactor *
          (1 - conf.factor * Math.cos(((i + 1) * conf.radians) / total))
      )
      .attr("class", "line")
      .style("stroke", "grey")
      .style("stroke-opacity", "0.75")
      .style("stroke-width", "0.2px")
      .attr(
        "transform",
        `translate(${conf.w / 2 - levelFactor}, ${conf.h / 2 - levelFactor})`
      );

    // Feliratok
    g.selectAll(".levels")
      .data(
        Array.from({ length: conf.levels }).map(
          (_, idx) => idx * (conf.maxValue / conf.levels)
        )
      )
      .enter()
      .append("svg:text")
      .attr("x", () => levelFactor * (1 - conf.factor * Math.sin(0)))
      .attr("y", () => levelFactor * (1 - conf.factor * Math.cos(0)))
      .attr("class", "legend")
      .style("font-family", "sans-serif")
      .style("font-size", "10px")
      .attr(
        "transform",
        `translate(${conf.w / 2 - levelFactor + conf.ToRight}, ${
          conf.h / 2 - levelFactor
        })`
      )
      .attr("fill", "#737373")
      .text(Math.round(((i + 1) * conf.maxValue) / conf.levels));
  });

  // Tengelyek
  const axis = g
    .selectAll(".axis")
    .data(allAxis)
    .enter()
    .append("g")
    .attr("class", "axis");

  axis
    .append("line")
    .attr("x1", conf.w / 2)
    .attr("y1", conf.h / 2)
    .attr(
      "x2",
      (_, i) =>
        (conf.w / 2) * (1 - conf.factor * Math.sin((i * conf.radians) / total))
    )
    .attr(
      "y2",
      (_, i) =>
        (conf.h / 2) * (1 - conf.factor * Math.cos((i * conf.radians) / total))
    )
    .attr("class", "line")
    .style("stroke", "grey")
    .style("stroke-width", "1px");

  axis
    .append("text")
    .attr("class", "legend")
    .text((txt) => txt)
    .style("font-family", "sans-serif")
    .style("font-size", "11px")
    .attr("text-anchor", "middle")
    .attr("dy", "1.5em")
    .attr("transform", () => "translate(0, -10)")
    .attr(
      "x",
      (_, i) =>
        (conf.w / 2) *
          (1 - conf.factorLegend * Math.sin((i * conf.radians) / total)) -
        60 * Math.sin((i * conf.radians) / total)
    )
    .attr(
      "y",
      (_, i) =>
        (conf.h / 2) * (1 - Math.cos((i * conf.radians) / total)) -
        20 * Math.cos((i * conf.radians) / total)
    );

  data.forEach((sd, idx) => {
    const dataValues: IPolygonData = sd.map(({ value }, idx) => ({
      x:
        (conf.w / 2) *
        (1 -
          (Math.max(value, 0) / conf.maxValue) *
            conf.factor *
            Math.sin((idx * conf.radians) / total)),
      y:
        (conf.h / 2) *
        (1 -
          (Math.max(value, 0) / conf.maxValue) *
            conf.factor *
            Math.cos((idx * conf.radians) / total)),
    }));

    g.selectAll(".area")
      .data([dataValues])
      .enter()
      .append("polygon")
      .attr("class", `radar-chart-serie-${idx}`)
      .style("stroke-width", "1px")
      .style("stroke", conf.color(idx))
      .attr("points", (pd: IPolygonData) =>
        pd.map(({ x, y }) => `${x}, ${y}`).join(" ")
      )
      .style("fill", () => conf.color(idx))
      .style("fill-opacity", conf.opacityArea)
      .on("mouseover", function () {
        let z = "polygon." + d3.select(this).attr("class");
        g.selectAll("polygon")
          .transition()
          .duration(200)
          .style("fill-opacity", 0.1);
        g.selectAll(z).transition().duration(200).style("fill-opacity", 0.7);
      })
      .on("mouseout", function () {
        g.selectAll("polygon")
          .transition()
          .duration(200)
          .style("fill-opacity", conf.opacityArea);
      });
  });

  //Tooltip
  const tooltip = g
    .append("text")
    .style("opacity", 0)
    .style("font-family", "sans-serif")
    .style("font-size", "13px");

  data.forEach((sd, idx) => {
    g.selectAll(".nodes")
      .data(sd)
      .enter()
      .append("svg:circle")
      .attr("class", `radar-chart-serie-${idx}`)
      .attr("r", conf.radius)
      .attr("alt", ({ value }) => Math.max(value, 0))
      .attr(
        "cx",
        ({ value }, idx) =>
          (conf.w / 2) *
          (1 -
            (Math.max(value, 0) / conf.maxValue) *
              conf.factor *
              Math.sin((idx * conf.radians) / total))
      )
      .attr("cy", ({ value }, idx) => {
        return (
          (conf.h / 2) *
          (1 -
            (Math.max(value, 0) / conf.maxValue) *
              conf.factor *
              Math.cos((idx * conf.radians) / total))
        );
      })
      .attr("data-ref", ({ axis }) => axis)
      .style("fill", conf.color(idx))
      .style("fill-opacity", 0.9)
      .on("mouseover", function (_, { value }) {
        let newX = parseFloat(d3.select(this).attr("cx")) - 10;
        let newY = parseFloat(d3.select(this).attr("cy")) - 5;

        tooltip
          .attr("x", newX)
          .attr("y", newY)
          .text(value)
          .transition()
          .duration(200)
          .style("opacity", 1);

        let z = "polygon." + d3.select(this).attr("class");
        g.selectAll("polygon")
          .transition()
          .duration(200)
          .style("fill-opacity", 0.1);
        g.selectAll(z).transition().duration(200).style("fill-opacity", 0.7);
      })
      .on("mouseout", function () {
        tooltip.transition().duration(200).style("opacity", 0);
        g.selectAll("polygon")
          .transition()
          .duration(200)
          .style("fill-opacity", conf.opacityArea);
      })
      .append("svg:title")
      .text(({ value }) => Math.max(value, 0));
  });
};

export default RadarChart;
