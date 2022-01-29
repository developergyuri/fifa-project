import { useEffect, useRef, useState } from "react";
import { Box } from "@chakra-ui/react";
import * as d3 from "d3";
import { IPlayer } from "../../Interfaces/IPlayer.interface";

interface IProps {
  data: IPlayer[];
  selectedProp: string;
}

const BarChart = ({ data, selectedProp }: IProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const [windowW, setWindowW] = useState(460);

  const resizeWindow = () => {
    setWindowW(window.innerWidth);
  };

  useEffect(() => {
    resizeWindow();
    window.addEventListener("resize", resizeWindow);
    return () => window.removeEventListener("resize", resizeWindow);
  }, []);

  useEffect(() => {
    const sizes = {
      paddingX: 100,
      paddingY: 60,
      width: windowW - 120,
      height: 40 * data.length - 60,
    };

    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", `${sizes.width + sizes.paddingX}px`)
      .attr("height", `${sizes.height + sizes.paddingY}px`)
      .append("g")
      .attr(
        "transform",
        `translate(${(sizes.paddingX / 3) * 2}, ${sizes.paddingY / 2})`
      );

    const xFeatures = data.map((d) => d[selectedProp]);

    const x = d3
      .scaleLinear()
      .domain([
        d3.min(xFeatures, (x) => Number(x)) || 0,
        d3.max(xFeatures, (x) => Number(x)) || 0,
      ])
      .range([0, sizes.width]);
    svg
      .append("g")
      .attr("transform", `translate(0, ${sizes.height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    const y = d3
      .scaleBand()
      .range([0, sizes.height])
      .domain(data.map((d) => d.short_name))
      .padding(0.1);
    svg.append("g").attr("x", x(0)).call(d3.axisLeft(y));

    //Bars
    const bars = svg
      .append("g")
      .attr("transform", `translate(${(90 / 460) * sizes.width}, 0)`);

    bars
      .selectAll("bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", x(0))
      // @ts-ignore: Unreachable code error
      .attr("y", (d) => y(d.short_name))
      // @ts-ignore: Unreachable code error
      .attr("width", (d) => x(d[selectedProp]))
      .attr("height", y.bandwidth())
      .attr("fill", "#69b3a2");
    //.attr("transform", `translate(${(71 / 460) * sizes.width}, 0)`);

    console.log(bars.attr("sizes.width"));

    return () => {
      d3.select(ref.current).selectAll("*").remove();
      d3.select(ref.current).exit().remove();
    };
  }, [data, windowW, selectedProp]);

  return <Box ref={ref} rounded="xl" overflow="hidden" />;
};

export default BarChart;
