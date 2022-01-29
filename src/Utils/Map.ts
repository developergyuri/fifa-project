import * as d3 from "d3";
import { RefObject } from "react";
import { IMapConfig } from "../Interfaces/IGeoMap.interface";
import { IMapData } from "../Interfaces/IGeoMap.interface";
import { IPlayer } from "../Interfaces/IPlayer.interface";
import { lookup } from "country-data";
import { normalize } from "../Utils/HelpersFn";

const MapMaker = (
  ref: RefObject<HTMLElement>,
  data: IPlayer[],
  selectedProps: string,
  options?: Partial<IMapConfig>
): d3.Selection<SVGSVGElement, unknown, null, undefined> => {
  const conf: IMapConfig = {
    width: 600,
    height: 500,
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

  const sumset = d3.group(data, (d) => d.nationality_name);

  const ocuraccy = Array.from(sumset.values()).map((s) => ({
    alpha3:
      lookup.countries({ name: `${s[0].nationality_name}` })[0]?.alpha3 || " ",
    value:
      selectedProps !== "length"
        ? s.reduce((a, b) => a + Number(b[selectedProps]) || 0, 0) / s.length
        : s.length,
  }));

  const min = d3.min(ocuraccy, (oc) => oc.value) || 0,
    max = d3.max(ocuraccy, (oc) => oc.value) || 0;

  const color = d3.interpolateViridis;

  const svg = d3
    .select(ref.current)
    .append("svg")
    .attr("width", `${width}px`)
    .attr("height", `${height}px`)
    .attr("max-height", "720px");

  const projection = d3
    .geoMercator()
    .scale((width / 400) * 50)
    .center([30, 0])
    .translate([width / 2, height / 2]);

  const tooltip = d3
    .select(ref.current)
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("background", "#323e56")
    .style("padding", "5px")
    .style("border-radius", "5px");

  d3.json<IMapData>(`${process.env.PUBLIC_URL}/data/world-geo.json`).then(
    (loadData) => {
      svg
        .append("g")
        .selectAll("path")
        .data(loadData?.features || [])
        .join("path")
        // @ts-ignore: Unreachable code error
        .attr("d", d3.geoPath().projection(projection))
        .attr("fill", (d) => {
          let val = ocuraccy.find((oc) => oc.alpha3 === d.id)?.value || 0;
          if (val === 0) {
            if (min === 0) return color(0);
            else return "#FFFFFF";
          } else {
            return color(normalize(val, max, min));
          }
        })
        .attr("id", (d) => d.id)
        .style("cursor", "pointer")
        .style("fill-opacity", 0.8)
        .on("mouseover", function (_, d) {
          d3.selectAll(".country")
            .transition()
            .duration(200)
            .style("fill-opacity", 0.8);

          d3.select(this)
            .transition()
            .duration(200)
            .style("fill-opacity", 1)
            .style("stroke", "black");

          tooltip
            .style("visibility", "visible")
            .text(
              (ocuraccy.find((oc) => oc.alpha3 === d.id)?.value || 0).toFixed(2)
            );
        })
        .on("mouseleave", function () {
          d3.selectAll(".country")
            .transition()
            .duration(200)
            .style("fill-opacity", 0.8);

          d3.select(this)
            .transition()
            .duration(200)
            .style("stroke", "transparent")
            .style("fill-opacity", 0.8);

          tooltip.style("visibility", "hidden");
        })
        .on("mousemove", function (e) {
          return tooltip
            .style("top", `${e.pageY - 15}px`)
            .style("left", `${e.pageX + 15}px`);
        });
    }
  );

  const mg = svg.append("g");
  const defs = mg.append("defs");
  const lg1 = defs
    .append("linearGradient")
    .attr("id", "grad1")
    .attr("x1", 0)
    .attr("x2", 0)
    .attr("y1", 0)
    .attr("y2", 1);

  lg1.append("stop").attr("offset", "0%").attr("stop-color", "#fde725");

  lg1.append("stop").attr("offset", "100%").attr("stop-color", "#21918c");

  const lg2 = defs
    .append("linearGradient")
    .attr("id", "grad2")
    .attr("x1", 0)
    .attr("x2", 0)
    .attr("y1", 0)
    .attr("y2", 1);

  lg2.append("stop").attr("offset", "0%").attr("stop-color", "#21918c");

  lg2.append("stop").attr("offset", "100%").attr("stop-color", "#440154");

  mg.append("rect")
    .attr("x", 10)
    .attr("y", 30)
    .attr("width", 20)
    .attr("height", 100)
    .attr("fill-opacity", 0.8)
    .style("fill", "url(#grad1)");

  mg.append("rect")
    .attr("x", 10)
    .attr("y", 130)
    .attr("width", 20)
    .attr("height", 100)
    .attr("fill-opacity", 0.8)
    .style("fill", "url(#grad2)");

  mg.append("text")
    .attr("x", 10)
    .attr("y", 20)
    .text(max)
    .style("fill", "white");

  mg.append("text")
    .attr("x", 10)
    .attr("y", 250)
    .text(min)
    .style("fill", "white");

  return svg;
};

export default MapMaker;
