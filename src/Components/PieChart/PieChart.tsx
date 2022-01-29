import { Box } from "@chakra-ui/react";
import { useRef, useEffect } from "react";
import * as d3 from "d3";
import { IPlayer } from "../../Interfaces/IPlayer.interface";
import PieChartUtil from "../../Utils/PieChart";

interface IProps {
  data: IPlayer[];
}

const PieChart = ({ data }: IProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    PieChartUtil(ref, data);

    return () => {
      d3.select(ref.current).selectAll("*").remove();
      d3.select(ref.current).exit().remove();
    };
  }, [data]);

  return <Box ref={ref} justifyContent="center" display="flex" />;
};

export default PieChart;
