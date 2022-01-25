import { useEffect, useRef } from "react";
import * as d3 from "d3";
import SpiderChartUtil from "../../Utils/SpiderChart";
import { ISpiderConfig, ISpiderData } from "../../Interfaces/ISpider.interface";
import { Box } from "@chakra-ui/react";

interface IProps {
  legends: string[];
  data: ISpiderData[];
}

const SpiderChart = ({ legends, data }: IProps) => {
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<HTMLDivElement | null>(null);

  // Címke nevek
  //const legends = ["Messi" , "Ronaldo", "Test1", "Test2"];

  //Data
  /*const data = [
    [
      { axis: "PAC", value: 85 },
      { axis: "SHO", value: 92 },
      { axis: "PAS", value: 91 },
      { axis: "DRI", value: 95 },
      { axis: "DEF", value: 34 },
      { axis: "PHY", value: 65 },
    ],
     [
      { axis: "PAC", value: 79 },
      { axis: "SHO", value: 85 },
      { axis: "PAS", value: 90 },
      { axis: "DRI", value: 70 },
      { axis: "DEF", value: 65 },
      { axis: "PHY", value: 89 },
    ],
    [
      { axis: "PAC", value: 60 },
      { axis: "SHO", value: 70 },
      { axis: "PAS", value: 45 },
      { axis: "DRI", value: 80 },
      { axis: "DEF", value: 65 },
      { axis: "PHY", value: 45 },
    ],
    [
      { axis: "PAC", value: 63 },
      { axis: "SHO", value: 90 },
      { axis: "PAS", value: 90 },
      { axis: "DRI", value: 73 },
      { axis: "DEF", value: 20 },
      { axis: "PHY", value: 100 },
    ], 
  ];*/

  // Méretek
  const size = {
    width: 200,
    height: 200,
  };

  // Színek
  const colorscale = d3.scaleOrdinal(d3.schemeCategory10);

  // Opciók a SpiderCharthoz
  const currentConf: Partial<ISpiderConfig> = {
    /* w: size.width,
    h: size.height,
    maxValue: 100,
    levels: 5,
    ExtraWidthY: 100 + 50 * data.length,
    radius: 3, */
  };

  useEffect(() => {
    SpiderChartUtil(chartRef, data, currentConf);

    const svg = d3
      .select(bodyRef.current)
      .selectAll("svg")
      .append("svg")
      .attr("width", size.width + 300)
      .attr("height", size.height);

    // Jelmagyarázat címe
    const text = svg
      .append("text")
      .attr("class", "title")
      .attr("transform", "translate(90,0)")
      .attr("x", size.width - 70)
      .attr("y", 10)
      .attr("font-size", "12px")
      .attr("fill", "#404040")
      .text("Football player's parameters");

    const legend = svg
      .append("g")
      .attr("class", "legend")
      .attr("height", 100)
      .attr("width", 200)
      .attr("transform", "translate(90,20)");

    // Színes jelölő nézet
    legend
      .selectAll("rect")
      .data(legends)
      .enter()
      .append("rect")
      .attr("x", size.width - 65)
      .attr("y", (_, idx) => idx * 20)
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", (c) => colorscale(c));

    // A címke neve
    legend
      .selectAll("text")
      .data(legends)
      .enter()
      .append("text")
      .attr("x", size.width - 52)
      .attr("y", (_, idx) => idx * 20 + 9)
      .attr("font-size", "11px")
      .attr("fill", "#737373")
      .text((txt) => txt);

    return () => {
      svg.selectAll("*").remove();
      svg.exit().remove();
    };
  }, [data, legends]);

  return (
    <Box ref={bodyRef} rounded="xl" overflow="hidden">
      <Box bg="white" ref={chartRef} />
    </Box>
  );
};

export default SpiderChart;
