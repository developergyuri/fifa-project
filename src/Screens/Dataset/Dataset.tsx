import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { IData } from "../../Interfaces/IData.interface";
import Selector from "../../Components/Selector/Selector";
import { Stack } from "@chakra-ui/react";
import { lookup } from "country-data";

interface IProps {
  data: IData[];
}

interface IMapData {
  type: string;
  features: Array<{
    type: string;
    properties: Array<{ name: string }>;
    geometry: Array<{ type: string; coordinates: Array<[number, number]> }>;
    id: string;
  }>;
}

const Dataset = ({ data }: IProps) => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [occuracy, setOccuracy] = useState<Map<string, number> | null>(null);

  const ref = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(300);

  const selectYearHandler = (n: string) => {
    setSelectedYear(Number(n));
  };

  useEffect(() => {
    setOccuracy(
      data
        .find(({ year }) => year === selectedYear)
        ?.data.reduce(
          (acc, e) =>
            acc.set(
              lookup.countries({ name: `${e.nationality_name}` })[0]?.alpha3 ||
                " ",
              (acc.get(
                lookup.countries({ name: `${e.nationality_name}` })[0]
                  ?.alpha3 || " "
              ) || 0) + 1
            ),
          new Map<string, number>()
        ) || null
    );
  }, [selectedYear]);

  const resizeWindow = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  useEffect(() => {
    resizeWindow();
    window.addEventListener("resize", resizeWindow);
    return () => window.removeEventListener("resize", resizeWindow);
  }, []);

  useEffect(() => {
    occuracy?.delete(" ");
    const oc = Array.from(occuracy?.values() || []);

    const color = d3
      .scaleLinear<string, string>()
      .domain([d3.min(oc) || 0, d3.max(oc) || 0])
      .range(["#ffffff", "#63b3ed"])
      .interpolate(d3.interpolateRgb);

    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", `${width - 100}px`)
      .attr("height", `${height - 100}px`)
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
          .attr("fill", (d) => color(occuracy?.get(d.id) || 0))
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
              .text(occuracy?.get(d.id) || 0);
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
    const lg = defs
      .append("linearGradient")
      .attr("id", "grad")
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("y1", 0)
      .attr("y2", 1);

    lg.append("stop").attr("offset", "0%").attr("stop-color", "#63b3ed");

    lg.append("stop").attr("offset", "100%").attr("stop-color", "#FFFFFF");

    mg.append("rect")
      .attr("x", 10)
      .attr("y", 30)
      .attr("width", 20)
      .attr("height", 200)
      .attr("fill-opacity", 0.8)
      .style("fill", "url(#grad)");

    mg.append("text")
      .attr("x", 10)
      .attr("y", 20)
      .text(d3.max(oc) || 0)
      .style("fill", "white");

    mg.append("text")
      .attr("x", 10)
      .attr("y", 250)
      .text(d3.min(oc) || 0)
      .style("fill", "white");

    return () => {
      d3.select(ref.current).selectAll("*").remove();
      d3.select(ref.current).exit().remove();
    };
  }, [width, height, occuracy]);

  return (
    <Stack padding={0} spacing={4}>
      <Selector
        data={data.map(({ year }) => ({
          id: year,
          name: year,
        }))}
        defaultValue={selectedYear}
        isDisabled={!data.length}
        selectHandler={selectYearHandler}
      />
      {selectedYear && <div ref={ref} />}
    </Stack>
  );
};

export default Dataset;
