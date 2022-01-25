import {
  Container,
  Text,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  Spinner,
  Stack,
  Grid,
  GridItem,
  Image,
  Circle,
  Divider,
  SimpleGrid,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import "./App.css";
import preprocess from "./Utils/Preprocess";
import Selector from "./Components/Selector/Selector";
import { IData } from "./Interfaces/IData.interface";
import { IPlayer } from "./Interfaces/IPlayer.interface";
import SpiderChart from "./Components/SpiderChart/SpiderChart";

const App = () => {
  const [data, setData] = useState<IData[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [playerData, setPlayerData] = useState<IPlayer | null>(null);

  useEffect(() => {
    preprocess()
      .then((res) => setData(res))
      .catch((error) => console.log(error));
  }, []);

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
    if (playerData) {
      console.log(playerData);
    }
  }, [playerData]);

  useEffect(() => {
    setSelectedTeam(null);
    setSelectedPlayer(null);
  }, [selectedYear]);

  useEffect(() => {
    setSelectedPlayer(null);
  }, [selectedTeam]);

  useEffect(() => {
    if (selectedPlayer) {
      setPlayerData(
        data
          .find((d) => d.year === selectedYear)
          ?.data.find((d) => d.short_name === selectedPlayer) || null
      );
    }
  }, [selectedPlayer]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <>
      <Grid
        minHeight="100vh"
        templateColumns="repeat(3, 1fr)"
        templateRows="min-content min-content minmax(250px, 1fr)"
        gap={4}
        bg="gray.900"
        padding={4}
      >
        <GridItem colSpan={3} rowSpan={1} bg="blackAlpha.500" rounded="xl">
          <Container centerContent={true} padding={4}>
            <Text fontSize="3xl" color="white">
              Football Visualization Project
            </Text>
          </Container>
        </GridItem>
        <GridItem colSpan={3} rowSpan={1} bg="blackAlpha.500" rounded="xl">
          <SimpleGrid minChildWidth="250px" spacing={4} padding={4}>
            <Box>
              <Stack
                direction="row"
                alignItems="center"
                opacity={!data.length ? 0.4 : 1}
              >
                <Circle
                  bg={!selectedYear ? "gray.200" : "green.400"}
                  size="40px"
                >
                  {!selectedYear ? "1." : <CheckIcon />}
                </Circle>
                <Divider maxW="75px" />
                <Selector
                  data={data.map((d) => d.year)}
                  defaultValue={selectedYear}
                  isDisabled={!data.length}
                  selectHandler={selectYearHandler}
                />
              </Stack>
            </Box>
            <Box>
              <Stack
                direction="row"
                alignItems="center"
                opacity={!selectedYear ? 0.4 : 1}
              >
                <Circle
                  bg={!selectedTeam ? "gray.200" : "green.400"}
                  size="40px"
                >
                  {!selectedTeam ? "2." : <CheckIcon />}
                </Circle>
                <Divider maxW="75px" />
                <Selector
                  data={Array.from(
                    new Set(
                      data
                        .find((d) => d.year === selectedYear)
                        ?.data.map((d) => d.club_name) || []
                    )
                  )}
                  defaultValue={selectedTeam}
                  isDisabled={!selectedYear}
                  selectHandler={selectTeamHandler}
                />
              </Stack>
            </Box>
            <Box>
              <Stack
                direction="row"
                alignItems="center"
                opacity={!selectedTeam ? 0.4 : 1}
              >
                <Circle
                  bg={!selectedPlayer ? "gray.200" : "green.400"}
                  size="40px"
                >
                  {!selectedPlayer ? "3." : <CheckIcon />}
                </Circle>
                <Divider maxW="75px" />
                <Selector
                  data={
                    data
                      .find((d) => d.year === selectedYear)
                      ?.data.filter((d) => d.club_name === selectedTeam)
                      .map((d) => d.short_name) || []
                  }
                  defaultValue={selectedPlayer}
                  isDisabled={!selectedTeam}
                  selectHandler={selectPlayerHandler}
                />
              </Stack>
            </Box>
          </SimpleGrid>
        </GridItem>
        <GridItem rowSpan={1} colSpan={1} bg="blackAlpha.500" rounded="xl">
          <Stack spacing={4} padding={4}>
            <Stack direction="row" spacing={4} padding={4}>
              {selectedPlayer && (
                <>
                  <Image
                    height="100%"
                    minHeight="200px"
                    width="auto"
                    objectFit="cover"
                    bgColor="white"
                    rounded="xl"
                    src={
                      data
                        .find((d) => d.year === selectedYear)
                        ?.data.find((d) => d.short_name === selectedPlayer)
                        ?.player_face_url || ""
                    }
                    alt={selectedPlayer || ""}
                  />
                  <Stack spacing={4} color="white">
                    <Text fontSize="xl">Név: {playerData?.long_name}</Text>
                    <Text fontSize="md">
                      Pozíció: {playerData?.club_position}
                    </Text>
                    <Text fontSize="sm">Kor: {playerData?.age}</Text>
                    <Text fontSize="sm">Tömeg: {playerData?.weight_kg} kg</Text>
                    <Text fontSize="sm">
                      Magasság: {playerData?.height_cm} cm
                    </Text>
                    <Text fontSize="sm">Láb: {playerData?.preferred_foot}</Text>
                  </Stack>
                </>
              )}
            </Stack>
            {selectedPlayer && playerData && (
              <SpiderChart
                data={[
                  [
                    { axis: "PAC", value: playerData?.pace || 0 },
                    { axis: "SHO", value: playerData?.shooting || 0 },
                    { axis: "PAS", value: playerData?.passing || 0 },
                    { axis: "DRI", value: playerData?.dribbling || 0 },
                    { axis: "DEF", value: playerData?.defending || 0 },
                    { axis: "PHY", value: playerData?.physic || 0 },
                  ],
                ]}
                legends={[playerData?.short_name || ""]}
              />
            )}
          </Stack>
        </GridItem>
        <GridItem colSpan={2} rowSpan={1} bg="blackAlpha.500" rounded="xl">
          <Text color="gray.500" isTruncated>
            Lorem ipsum is placeholder text commonly used in the graphic, print,
            and publishing industries for previewing layouts and visual mockups.
          </Text>
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
