import {
  Container,
  Text,
  Box,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import "./App.css";
import preprocess from "./Utils/Preprocess";
import Selector from "./Components/Selector/Selector";
import { IData } from "./Interfaces/IData.interface";

const App = () => {
  const [data, setData] = useState<IData[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  useEffect(() => {
    preprocess()
      .then((res) => setData(res))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (selectedYear) {
      console.log(data.find((d) => d.year === selectedYear));
    }
  }, [selectedYear]);

  const selectYearHandler = (n: string) => {
    setSelectedYear(Number(n));
  };

  const selectTeamHandler = (s: string) => {
    setSelectedTeam(s);
  };

  const selectPlayerHandler = (s: string) => {
    setSelectedPlayer(s);
  };

  useEffect(() => {
    if (selectedTeam) {
      console.log(selectedTeam);
    }
  }, [selectedTeam]);

  useEffect(() => {
    setSelectedTeam(null);
    setSelectedPlayer(null);
  }, [selectedYear]);

  useEffect(() => {
    setSelectedPlayer(null);
  }, [selectedTeam]);

  return (
    <Container className="App" bg="gray.900" maxW="full" height="100vh">
      <SimpleGrid columns={1} spacingX="20px" spacingY="20px">
        <Box bg="blackAlpha.500" height="auto">
          <Container centerContent={true}>
            <Text fontSize="3xl" color="white">
              Football Visualization Project
            </Text>
          </Container>
        </Box>
        <Box bg="blackAlpha.500" rounded="xl" padding="4">
          <Container centerContent={true}>
            <Selector
              data={data.map((d) => d.year)}
              defaultValue={selectedYear}
              selectHandler={selectYearHandler}
            />
            {selectedYear && (
              <Selector
                data={Array.from(
                  new Set(
                    data
                      .find((d) => d.year === selectedYear)
                      ?.data.map((d) => d.club_name) || []
                  )
                )}
                defaultValue={selectedTeam}
                selectHandler={selectTeamHandler}
              />
            )}
            {selectedTeam && (
              <Selector
                data={
                  data
                    .find((d) => d.year === selectedYear)
                    ?.data.filter((d) => d.club_name === selectedTeam)
                    .map((d) => d.short_name) || []
                }
                defaultValue={selectedPlayer}
                selectHandler={selectPlayerHandler}
              />
            )}
          </Container>
        </Box>
      </SimpleGrid>
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
    </Container>
  );
};

export default App;

/**
 * data
                    .find((d) => d.year === selectedYear)
                    ?.data.map((d) => d.club_name) || 
 */
