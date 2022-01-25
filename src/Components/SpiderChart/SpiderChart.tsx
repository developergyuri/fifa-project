import { useEffect, useRef } from "react";
import * as d3 from "d3";
import SpiderChartUtil from "../../Utils/SpiderChart";
import { ISpiderConfig, ISpiderData } from "../../Interfaces/ISpider.interface";
import { Box } from "@chakra-ui/react";

interface IProps {
  legends: string[];
  data: ISpiderData[];
}

const SpiderChart = ({ data, legends }: IProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  // Méretek
  const size = {
    width: 300,
    height: 300,
  };

  // Opciók a SpiderCharthoz
  const currentConf: Partial<ISpiderConfig> = {
    w: size.width,
    h: size.height,
    maxValue: 100,
    levels: 5,
    ExtraWidthY: 100 + 50 * data.length,
    radius: 3,
  };

  useEffect(() => {
    const svg = SpiderChartUtil(ref, data, legends, currentConf);

    return () => {
      svg.selectAll("*").remove();
      svg.exit().remove();
    };
  }, [data, legends]);

  return <Box ref={ref} bg="white" rounded="xl" overflow="hidden" />;
};

export default SpiderChart;
