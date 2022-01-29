import { useRef, useEffect } from "react";
import { IPlayer } from "../../Interfaces/IPlayer.interface";
import { Box } from "@chakra-ui/react";
import * as d3 from "d3";

import LineChartUtil from "../../Utils/LineChart";

interface IProps {
  data: IPlayer[];
  selectedProp: string;
}

const LineChart = ({ data, selectedProp }: IProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    LineChartUtil(ref, data, selectedProp);

    return () => {
      d3.select(ref.current).selectAll("*").remove();
      d3.select(ref.current).exit().remove();
    };
  }, [data, selectedProp]);

  return <Box ref={ref} bg="blackAlpha.400" rounded="xl" paddingY={4} />;
};

export default LineChart;
