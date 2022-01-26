import { useEffect, useRef } from "react";
import { Box } from "@chakra-ui/react";
import * as d3 from "d3";

interface IProps {}

const BarPlot = ({}: IProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // set the dimensions and margins of the graph
    const margin = { top: 10, right: 30, bottom: 90, left: 40 },
      width = 460 - margin.left - margin.right,
      height = 450 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Parse the Data
    const data = d3
      .csv(
        "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv",
        (d) => d3.autoType<{ Country: string; Value: string }, string>(d)
      )
      .then((data) => {
        console.log(data);

        // X axis
        const x = d3
          .scaleBand()
          .range([0, width])
          .domain(data.map((d) => d.Country))
          .padding(0.2);
        svg
          .append("g")
          .attr("transform", `translate(0,${height})`)
          .call(d3.axisBottom(x))
          .selectAll("text")
          .attr("transform", "translate(-10,0)rotate(-45)")
          .style("text-anchor", "end");

        // Add Y axis
        const y = d3.scaleLinear().domain([0, 13000]).range([height, 0]);
        svg.append("g").call(d3.axisLeft(y));

        // Bars
        svg
          .selectAll("mybar")
          .data(data)
          .join("rect")
          //.attr("x", (d) => x(d.Country))
          .attr("width", x.bandwidth())
          .attr("fill", "#69b3a2")
          // no bar at the beginning thus:
          .attr("height", (d) => height - y(0)) // always equal to 0
          .attr("y", (d) => y(0));

        // Animation
        svg
          .selectAll("rect")
          .transition()
          .duration(800)
          .attr("y", (d: any) => y(d.Value))
          .attr("height", (d: any) => height - y(d.Value))
          .delay((d, i) => {
            console.log(i);
            return i * 100;
          });
      });

    return () => {
      svg.selectAll("*").remove();
      svg.exit().remove();
    };
  }, []);

  return <Box ref={ref} rounded="xl" overflow="hidden" />;
};

export default BarPlot;
