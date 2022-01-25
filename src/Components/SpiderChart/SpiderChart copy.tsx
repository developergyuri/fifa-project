import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface IDataElement {
  [key: string]: number;
}

interface ICoord {
  x: number;
  y: number;
}

function RadarChart() {
  const ref = useRef<HTMLDivElement | null>(null);

  const data: Array<IDataElement> = [];
  const features = ["A", "B", "C", "D", "E", "F"];

  for (let i = 0; i < 3; i++) {
    data.push(
      Object.fromEntries(features.map((f) => [f, 1 + Math.random() * 8]))
    );
  }

  const radialScale = d3.scaleLinear().domain([0, 10]).range([0, 250]);

  const angleToCoordinate = (angle: number, value: number) => {
    let x = Math.cos(angle) * radialScale(value);
    let y = Math.sin(angle) * radialScale(value);
    return { x: 300 + x, y: 300 - y };
  };

  const getPathCoordinates = (data_point: IDataElement): ICoord[] => {
    return features.map((f, i) =>
      angleToCoordinate(
        Math.PI / 2 + (2 * Math.PI * i) / features.length,
        data_point[`${f}`]
      )
    );
  };

  useEffect(() => {
    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", 600)
      .attr("height", 600);

    const ticks = [2, 4, 6, 8, 10];

    ticks.forEach((t) =>
      svg
        .append("circle")
        .attr("cx", 300)
        .attr("cy", 300)
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("r", radialScale(t))
    );

    ticks.forEach((t) =>
      svg
        .append("text")
        .attr("stroke", "yellow")
        .attr("x", 310)
        .attr("y", 305 - radialScale(t))
        .text(t.toString())
    );

    for (let i = 0; i < features.length; i++) {
      let ft_name = features[i];
      let angle = Math.PI / 2 + (2 * Math.PI * i) / features.length;
      let line_coordinate = angleToCoordinate(angle, 10);
      let label_coordinate = angleToCoordinate(angle, 10.5);

      //draw axis line
      svg
        .append("line")
        .attr("x1", 300)
        .attr("y1", 300)
        .attr("x2", line_coordinate.x)
        .attr("y2", line_coordinate.y)
        .attr("stroke", "white");

      //draw axis label
      svg
        .append("text")
        .attr("x", label_coordinate.x)
        .attr("y", label_coordinate.y)
        .attr("stroke", "white")
        .text(ft_name);
    }

    const line = d3
      .line<ICoord>()
      .x((d) => d.x)
      .y((d) => d.y);
    let colors = ["darkorange", "gray", "navy"];

    for (var i = 0; i < data.length; i++) {
      let d = data[i];
      let color = colors[i];
      let coordinates = getPathCoordinates(d);

      console.log(coordinates);
      //draw the path element
      svg
        .append("path")
        .datum(coordinates)
        .attr("d", line)
        .attr("stroke-width", 3)
        .attr("stroke", color)
        .attr("fill", color)
        .attr("stroke-opacity", 1)
        .attr("opacity", 0.5);
    }

    return () => {
      svg.selectAll("*").remove();
      svg.remove();
    };
  }, []);

  return <div ref={ref} />;
}
export default RadarChart;
