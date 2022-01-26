import { useEffect, useRef } from "react";
import SpiderChartUtil from "../../Utils/SpiderChart";
import { ISpiderConfig, ISpiderData } from "../../Interfaces/ISpider.interface";
import { Box } from "@chakra-ui/react";

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
    w: size.width,
    h: size.height,
    maxValue: 100,
    levels: 5,
    ExtraWidthY: size.paddingY ? size.paddingY * 2 : 100 + 50 * data.length,
    ExtraWidthX: size.paddingX ? size.paddingX * 2 : 100,
    radius: 3,
  };

  useEffect(() => {
    const svg = SpiderChartUtil(ref, data, legends, title, currentConf);

    return () => {
      svg.selectAll("*").remove();
      svg.exit().remove();
    };
  }, [data, legends]);

  return <Box ref={ref} bg="white" rounded="xl" overflowX="hidden" />;
};

export default SpiderChart;
