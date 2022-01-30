import { useEffect, useRef, useState } from "react";
import { Box } from "@chakra-ui/react";
import * as d3 from "d3";
import { IPlayer } from "../../Interfaces/IPlayer.interface";
import { IBarConfig } from "../../Interfaces/IBar.interface";
import BarChartUtil from "../../Utils/BarChart";

interface IProps {
  data: IPlayer[];
  selectedProp: string;
}

const BarChart = ({ data, selectedProp }: IProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const [windowW, setWindowW] = useState(460);

  const resizeWindow = () => {
    setWindowW(window.innerWidth);
  };

  useEffect(() => {
    resizeWindow();
    window.addEventListener("resize", resizeWindow);
    return () => window.removeEventListener("resize", resizeWindow);
  }, []);

  useEffect(() => {
    const margin = { top: 30, right: 20, bottom: 70, left: 20 },
      width = windowW - 76 - margin.left - margin.right,
      height = width > 576 ? 600 : 500 - margin.top - margin.bottom;

    const currentConf: Partial<IBarConfig> = {
      width: width,
      height: height,
      ...margin,
    };

    BarChartUtil(ref, data, selectedProp, currentConf);

    return () => {
      d3.select(ref.current).selectAll("*").remove();
      d3.select(ref.current).exit().remove();
    };
  }, [data, windowW, selectedProp]);

  return (
    <Box
      ref={ref}
      rounded="xl"
      overflow="hidden"
      display="flex"
      justifyContent="center"
    />
  );
};

export default BarChart;
