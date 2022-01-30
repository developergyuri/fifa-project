import { useEffect, useRef } from "react";
import { Box } from "@chakra-ui/react";
import * as d3 from "d3";
import { IPlayer } from "../../Interfaces/IPlayer.interface";
import { IBarConfig } from "../../Interfaces/IBar.interface";

import GroupedBarChartUtil from "../../Utils/GroupedBarChart";

interface IProps {
  data: IPlayer[];
}

const BarChart = ({ data }: IProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    GroupedBarChartUtil(ref, data);

    return () => {
      d3.select(ref.current).selectAll("*").remove();
      d3.select(ref.current).exit().remove();
    };
  }, [data]);

  return (
    <Box ref={ref} rounded="xl" bg="blackAlpha.500" padding={4} w="100%" />
  );
};

export default BarChart;
