import { useRef, useEffect, useState } from "react";
import { IData } from "../../Interfaces/IData.interface";
import Selector from "../../Components/Selector/Selector";
import { Stack, SimpleGrid, Circle, Divider, Box } from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import MapMakerUtil from "../../Utils/Map";
import { IMapConfig } from "../../Interfaces/IGeoMap.interface";
import * as d3 from "d3";

interface IProps {
  data: IData[];
}

const mapCategories = [
  { id: "length", value: "Létszám" },
  { id: "height_cm", value: "Magasság" },
  { id: "weight_kg", value: "Tömeg" },
  { id: "age", value: "Átlag életkor" },
];

const Dataset = ({ data }: IProps) => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const ref = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(300);

  const selectYearHandler = (n: string) => {
    setSelectedYear(Number(n));
  };

  const selectCategoryHandler = (s: string) => {
    setSelectedCategory(s);
  };

  useEffect(() => {
    setSelectedCategory(null);
  }, [selectedYear]);

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
    if (selectedCategory) {
      const selectedData =
        data.find(({ year }) => year === selectedYear)?.data || [];

      const currentConf: Partial<IMapConfig> = {
        width: width,
        height: height,
        paddingY: 100,
        paddingX: 100,
      };

      MapMakerUtil(ref, selectedData, selectedCategory, currentConf);
    }

    return () => {
      d3.select(ref.current).selectAll("*").remove();
      d3.select(ref.current).exit().remove();
    };
  }, [width, height, data, selectedCategory]);

  return (
    <Stack padding={0} spacing={4}>
      <SimpleGrid
        minChildWidth="250px"
        spacing={4}
        padding={4}
        rounded="xl"
        bg="blackAlpha.400"
      >
        <Stack
          direction="row"
          alignItems="center"
          opacity={!data.length ? 0.4 : 1}
        >
          <Circle
            bg={!selectedYear ? "blackAlpha.400" : "green.400"}
            size="40px"
          >
            {!selectedYear ? "1." : <CheckIcon />}
          </Circle>
          <Divider maxW="75px" />
          <Selector
            data={data.map(({ year }) => ({
              id: year,
              name: year,
            }))}
            defaultValue={selectedYear}
            isDisabled={!data.length}
            selectHandler={selectYearHandler}
          />
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          opacity={!selectedYear ? 0.4 : 1}
        >
          <Circle
            bg={!selectedCategory ? "blackAlpha.400" : "green.400"}
            size="40px"
          >
            {!selectedCategory ? "2." : <CheckIcon />}
          </Circle>
          <Divider maxW="75px" />
          <Selector
            data={mapCategories.map((c) => ({ id: c.id, name: c.value }))}
            defaultValue={selectedCategory}
            isDisabled={!selectedYear}
            selectHandler={selectCategoryHandler}
          />
        </Stack>
      </SimpleGrid>
      <Stack padding={0} spacing={4}>
        {selectedYear && selectedCategory && <Box ref={ref} />}
      </Stack>
    </Stack>
  );
};

export default Dataset;
