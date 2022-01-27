import {
  Container,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  Spinner,
  Grid,
  GridItem,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import preprocess from "./Utils/Preprocess";
import { IData } from "./Interfaces/IData.interface";
import PlayerScreen from "./Screens/Player/Player";
import PlayerComparisonScreen from "./Screens/PlayerComparison/PlayerComparison";
import DatasetScreen from "./Screens/Dataset/Dataset";
import TeamScreen from "./Screens/Team/Team";

const App = () => {
  const [data, setData] = useState<IData[]>([]);

  useEffect(() => {
    preprocess()
      .then((res) => setData(res))
      .catch((error) => console.log(error));
  }, []);

  return (
    <>
      <Grid
        minHeight="100vh"
        templateColumns="repeat(3, 1fr)"
        templateRows="min-content 1fr"
        gap={4}
        padding={4}
      >
        <GridItem colSpan={3} rowSpan={1} rounded="xl" bg="blackAlpha.400">
          <Container centerContent={true} padding={4}>
            <Text fontSize="3xl">Football Visualization Project</Text>
          </Container>
        </GridItem>
        <GridItem colSpan={3} rowSpan={1} rounded="xl" bg="blackAlpha.400">
          <Tabs padding={4}>
            <TabList overflowX="auto" overflowY="hidden" paddingBottom={0.5}>
              <Tab>Játékos</Tab>
              <Tab>Játékos összehasonlítás</Tab>
              <Tab>Csapat</Tab>
              <Tab>Térkép</Tab>
            </TabList>

            <TabPanels>
              <TabPanel paddingY={4} paddingX={0}>
                <PlayerScreen data={data} />
              </TabPanel>
              <TabPanel paddingY={4} paddingX={0}>
                <PlayerComparisonScreen data={data} />
              </TabPanel>
              <TabPanel paddingY={4} paddingX={0}>
                <TeamScreen data={data} />
              </TabPanel>
              <TabPanel paddingY={4} paddingX={0}>
                <DatasetScreen data={data} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </GridItem>
      </Grid>
      <Modal isOpen={!data.length} isCentered={true} onClose={() => {}}>
        <ModalOverlay />
        <ModalContent
          bgColor="transparent"
          shadow="none"
          justifyContent="center"
          alignItems="center"
        >
          <Spinner thickness="5px" width="8rem" height="8rem" />
        </ModalContent>
      </Modal>
    </>
  );
};

export default App;
