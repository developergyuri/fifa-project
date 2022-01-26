import { useRef, useEffect } from "react";
import { IPlayer } from "../../Interfaces/IPlayer.interface";
import { Box } from "@chakra-ui/react";

import LineChartUtil from "../../Utils/LineChart";

interface IProps {
  data: IPlayer[];
  selectedProp: string;
}

const LineChart = ({ data, selectedProp }: IProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const svg = LineChartUtil(ref, data, selectedProp);

    return () => {
      svg.selectAll("*").remove();
      svg.exit().remove();
    };
  }, [data, selectedProp]);

  return <Box ref={ref} bg="blackAlpha.400" rounded="xl" paddingY={4} />;
};

export default LineChart;
