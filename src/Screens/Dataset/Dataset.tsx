import { useEffect, useState } from "react";
import { IData } from "../../Interfaces/IData.interface";
import Selector from "../../Components/Selector/Selector";
import {
  Stack,
  SimpleGrid,
  Circle,
  Divider,
  TabList,
  Tabs,
  TabPanel,
  Tab,
  TabPanels,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import Map from "../../Components/Map/Map";

import PieChart from "../../Components/PieChart/PieChart";

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

  const selectYearHandler = (n: string) => {
    setSelectedYear(Number(n));
  };

  const selectCategoryHandler = (s: string) => {
    setSelectedCategory(s);
  };

  useEffect(() => {
    setSelectedCategory(null);
  }, [selectedYear]);

  return (
    <Tabs>
      <TabList>
        <Tab>Terkép</Tab>
        <Tab>Egyéb</Tab>
      </TabList>

      <TabPanels>
        <TabPanel paddingY={4} paddingX={0}>
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
                <Divider
                  maxW="75px"
                  visibility={{ base: "hidden", lg: "visible" }}
                />
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
                <Divider maxW="75px" display={{ base: "none", sm: "block" }} />
                <Selector
                  data={mapCategories.map((c) => ({ id: c.id, name: c.value }))}
                  defaultValue={selectedCategory}
                  isDisabled={!selectedYear}
                  selectHandler={selectCategoryHandler}
                />
              </Stack>
            </SimpleGrid>
            <Stack padding={0} spacing={4}>
              {selectedYear && selectedCategory && (
                <Map
                  data={
                    data.find(({ year }) => year === selectedYear)?.data || []
                  }
                  selectedCategory={selectedCategory}
                />
              )}
            </Stack>
          </Stack>
        </TabPanel>
        <TabPanel paddingY={4} paddingX={0}>
          <Stack padding={0} spacing={4}>
            <Selector
              data={data.map(({ year }) => ({
                id: year,
                name: year,
              }))}
              defaultValue={selectedYear}
              isDisabled={!data.length}
              selectHandler={selectYearHandler}
            />
            {selectedYear && (
              <PieChart
                data={data.find((d) => d.year === selectedYear)?.data || []}
              />
            )}
          </Stack>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default Dataset;
