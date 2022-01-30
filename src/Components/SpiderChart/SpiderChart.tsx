import { useEffect, useRef } from "react";
import SpiderChartUtil from "../../Utils/SpiderChart";
import { ISpiderConfig, ISpiderData } from "../../Interfaces/ISpider.interface";
import { Box } from "@chakra-ui/react";
import * as d3 from "d3";

interface IProps {
  legends: string[];
  data: ISpiderData[];
  title: string;
  size: { width: number; height: number; paddingX?: number; paddingY?: number };
}

const SpiderChart = ({ data, legends, title, size }: IProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  // Opciók a SpiderCharthoz
  const currentConf: Partial<ISpiderConfig> = {
    width: size.width,
    height: size.height,
    maxValue: 100,
    levels: 5,
    PaddingY: size.paddingY ? size.paddingY * 2 : 100 + 50 * data.length,
    PaddingX: size.paddingX ? size.paddingX * 2 : 100,
    radius: 3,
  };

  useEffect(() => {
    SpiderChartUtil(ref, data, legends, title, currentConf);

    return () => {
      d3.select(ref.current).selectAll("*").remove();
      d3.select(ref.current).exit().remove();
    };
  }, [data, legends]);

  return (
    <Box
      ref={ref}
      bg="blackAlpha.400"
      rounded="xl"
      overflowX="hidden"
      w="100%"
    />
  );
};

export default SpiderChart;
