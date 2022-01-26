import { useState, useEffect } from "react";
import {
  SimpleGrid,
  Stack,
  Box,
  Divider,
  Grid,
  GridItem,
  Circle,
  Button,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import SpiderChart from "../../Components/SpiderChart/SpiderChart";
import BarPlot from "../../Components/BarPlot/BarPlot";
import { IPlayer } from "../../Interfaces/IPlayer.interface";
import { IData } from "../../Interfaces/IData.interface";
import Selector from "../../Components/Selector/Selector";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";

interface IProps {
  data: IData[];
}

const PlayerComparison = ({ data }: IProps) => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);

  const [playerList, setPlayerList] = useState<IPlayer[]>();

  const selectYearHandler = (n: string) => {
    setSelectedYear(Number(n));
  };

  const selectTeamHandler = (n: number) => {
    setSelectedTeam(Number(n));
  };

  const selectPlayerHandler = (n: number) => {
    setSelectedPlayer(Number(n));
  };

  useEffect(() => {
    setSelectedTeam(null);
    setSelectedPlayer(null);
  }, [selectedYear]);

  useEffect(() => {
    setSelectedPlayer(null);
  }, [selectedTeam]);

  const addPlayerToListHandler = () => {
    const p: IPlayer =
      data
        .find((d) => d.year === selectedYear)
        ?.data.filter(
          ({ club_team_id }) =>
            (club_team_id === null ? -1 : club_team_id) === selectedTeam
        )
        .find((d) => d.sofifa_id === selectedPlayer) || ({} as IPlayer);
    setPlayerList([...(playerList || []), p]);
  };

  const removePlayerFromList = (index: number) => {
    setPlayerList(playerList?.filter((_, idx) => idx !== index));
  };

  const properties = Object.keys(!!playerList?.length ? playerList[0] : {});
  const mainCategories = [
    { axis: "PAC", name: "pace" },
    { axis: "SHO", name: "shooting" },
    { axis: "PAS", name: "passing" },
    { axis: "DRI", name: "dribbling" },
    { axis: "DEF", name: "defending" },
    { axis: "PHY", name: "physic" },
  ];

  const categories = [
    "attacking",
    "skill",
    "movement",
    "power",
    "mentality",
    "defending",
    "goalkeeping",
  ];

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  return (
    <Grid
      minHeight="100vh"
      templateColumns="repeat(4, 1fr)"
      templateRows="min-content 1fr"
      gap={4}
    >
      <GridItem colSpan={4} rowSpan={1} rounded="xl" bg="blackAlpha.400">
        <SimpleGrid minChildWidth="250px" spacing={4} padding={4}>
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
              bg={!selectedTeam ? "blackAlpha.400" : "green.400"}
              size="40px"
            >
              {!selectedTeam ? "2." : <CheckIcon />}
            </Circle>
            <Divider maxW="75px" />
            <Selector
              data={
                Array.from(
                  new Map(
                    data
                      .find((d) => d.year === selectedYear)
                      ?.data.map((d) => [`${d.club_team_id}`, d.club_name])
                  ),
                  (v) => ({
                    id: Number(v[0]) || -1,
                    name: v[1] || "Csapat nélküli",
                  })
                ) || []
              }
              defaultValue={selectedTeam}
              isDisabled={!selectedYear}
              selectHandler={selectTeamHandler}
            />
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            opacity={!selectedTeam ? 0.4 : 1}
          >
            <Circle
              bg={!selectedPlayer ? "blackAlpha.400" : "green.400"}
              size="40px"
            >
              {!selectedPlayer ? "3." : <CheckIcon />}
            </Circle>
            <Divider maxW="75px" />
            <Selector
              data={
                data
                  .find((d) => d.year === selectedYear)
                  ?.data.filter(
                    ({ club_team_id }) =>
                      (club_team_id === null ? -1 : club_team_id) ===
                      selectedTeam
                  )
                  .map(({ sofifa_id, short_name }) => ({
                    id: sofifa_id,
                    name: short_name,
                  })) || []
              }
              defaultValue={selectedPlayer}
              isDisabled={!selectedTeam}
              selectHandler={selectPlayerHandler}
            />
          </Stack>
          <Button isDisabled={!selectedPlayer} onClick={addPlayerToListHandler}>
            Listába
          </Button>
        </SimpleGrid>
      </GridItem>
      <GridItem colSpan={4} rowSpan={1} rounded="xl">
        {!!playerList?.length && (
          <SimpleGrid
            minH="100%"
            templateColumns={{ sm: "1fr", lg: "repeat(3, 1fr)" }}
            templateRows={{ sm: "min-content 1fr", lg: "1fr" }}
            templateAreas={{
              sm: '"Player" "Stat"',
              lg: '"Player Stat Stat"',
            }}
            gap={4}
          >
            <Stack
              spacing={8}
              padding={4}
              alignItems={{ base: "center", lg: "flex-start" }}
              rounded="xl"
              bg="blackAlpha.400"
              gridArea="Player"
            >
              <Box width="100%" rounded="xl" bg="blackAlpha.500" padding={4}>
                <List spacing={4}>
                  {playerList?.map((p, idx) => (
                    <ListItem
                      key={idx}
                      borderBottom="1px solid"
                      borderColor="whiteAlpha.400"
                    >
                      <ListIcon
                        as={CloseIcon}
                        color="red.400"
                        bg="blackAlpha.400"
                        overflow="hidden"
                        rounded="xl"
                        onClick={() => removePlayerFromList(idx)}
                        cursor="pointer"
                      />
                      {p.short_name}
                    </ListItem>
                  ))}
                </List>
              </Box>

              <SpiderChart
                // Fő tulajdonságok
                data={playerList.map((p) =>
                  mainCategories.map(({ axis, name }) => ({
                    axis: axis,
                    value: Number(p[name]) || 0,
                  }))
                )}
                legends={playerList.map((p) => p.short_name)}
                title="Main parameters"
                size={{ height: 300, width: 300 }}
              />
            </Stack>
            <SimpleGrid
              minChildWidth="350px"
              rounded="xl"
              bg="blackAlpha.400"
              gridArea="Stat"
              padding={4}
              gap={4}
            >
              {categories.map((c, idx) => (
                <SpiderChart
                  key={idx}
                  data={playerList.map((p) =>
                    properties
                      .filter((prop) => prop.includes(`${c}_`))
                      .map((fprop) => ({
                        axis: capitalize(fprop.split("_").slice(1).join(" ")),
                        value: Number(p[fprop]),
                      }))
                  )}
                  legends={playerList.map((p) => p.short_name)}
                  title={`${capitalize(c)} parameters`}
                  size={{ height: 175, width: 175, paddingX: 75 }}
                />
              ))}
            </SimpleGrid>
          </SimpleGrid>
        )}
      </GridItem>
    </Grid>
  );
};

export default PlayerComparison;
