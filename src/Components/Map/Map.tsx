import { useRef, useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import MapMakerUtil from "../../Utils/Map";
import { IMapConfig } from "../../Interfaces/IGeoMap.interface";
import * as d3 from "d3";
import { IPlayer } from "../../Interfaces/IPlayer.interface";

interface IProps {
  data: IPlayer[];
  selectedCategory: string;
}

const Map = ({ selectedCategory, data }: IProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(300);

  const resizeWindow = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  useEffect(() => {
    resizeWindow();
    window.addEventListener("resize", resizeWindow);
    return () => window.removeEventListener("resize", resizeWindow);
  }, []);

  useEffect(() => {
    const currentConf: Partial<IMapConfig> = {
      width: width,
      height: height,
      paddingY: 100,
      paddingX: 100,
    };

    MapMakerUtil(ref, data, selectedCategory, currentConf);

    return () => {
      d3.select(ref.current).selectAll("*").remove();
      d3.select(ref.current).exit().remove();
    };
  }, [width, height, data, selectedCategory]);

  return <Box ref={ref} display="flex" justifyContent="center" />;
};

export default Map;
