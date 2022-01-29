import { useState, useEffect } from "react";
import {
  SimpleGrid,
  Image,
  Stack,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Divider,
  Grid,
  GridItem,
  Circle,
} from "@chakra-ui/react";
import SpiderChart from "../../Components/SpiderChart/SpiderChart";
import LineChart from "../../Components/LineChart/LineChart";
import { IPlayer } from "../../Interfaces/IPlayer.interface";
import { IData } from "../../Interfaces/IData.interface";
import Selector from "../../Components/Selector/Selector";
import { CheckIcon } from "@chakra-ui/icons";
import { capitalize } from "../../Utils/HelpersFn";

interface IProps {
  data: IData[];
}

const SelectablePropKeys = [
  "overall",
  "potential",
  "value_eur",
  "wage_eur",
  "age",
  "height_cm",
  "weight_kg",
  "league_level",
  "weak_foot",
  "skill_moves",
  "international_reputation",
  "pace",
  "shooting",
  "passing",
  "dribbling",
  "defending",
  "physic",
  "attacking_crossing",
  "attacking_finishing",
  "attacking_heading_accuracy",
  "attacking_short_passing",
  "attacking_volleys",
  "skill_dribbling",
  "skill_curve",
  "skill_fk_accuracy",
  "skill_long_passing",
  "skill_ball_control",
  "movement_acceleration",
  "movement_sprint_speed",
  "movement_agility",
  "movement_reactions",
  "movement_balance",
  "power_shot_power",
  "power_jumping",
  "power_stamina",
  "power_strength",
  "power_long_shots",
  "mentality_aggression",
  "mentality_interceptions",
  "mentality_positioning",
  "mentality_vision",
  "mentality_penalties",
  "mentality_composure",
  "defending_marking_awareness",
  "defending_standing_tackle",
  "defending_sliding_tackle",
  "goalkeeping_diving",
  "goalkeeping_handling",
  "goalkeeping_kicking",
  "goalkeeping_positioning",
  "goalkeeping_reflexes",
  "goalkeeping_speed",
];

const Player = ({ data }: IProps) => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [playerData, setPlayerData] = useState<IPlayer | null>(null);
  const [playerDataForEachYear, setPlayerDataForEachYear] = useState<
    IPlayer[] | null
  >(null);

  const [selectedProp, setSelectedProp] = useState<string | null>(null);

  const selectYearHandler = (n: string) => {
    setSelectedYear(Number(n));
  };

  const selectTeamHandler = (n: number) => {
    setSelectedTeam(Number(n));
  };

  const selectPlayerHandler = (n: number) => {
    setSelectedPlayer(Number(n));
  };

  const selectPropHandler = (s: string) => {
    setSelectedProp(s);
  };

  useEffect(() => {
    setSelectedTeam(null);
    setSelectedPlayer(null);
    //setSelectedProp(null);
  }, [selectedYear]);

  useEffect(() => {
    setSelectedPlayer(null);
    //setSelectedProp(null);
  }, [selectedTeam]);

  useEffect(() => {
    if (selectedPlayer) {
      setPlayerData(
        data
          .find((d) => d.year === selectedYear)
          ?.data.find((d) => d.sofifa_id === selectedPlayer) || null
      );
      setPlayerDataForEachYear(
        data.map(
          ({ data }) =>
            data.find((d) => d.sofifa_id === selectedPlayer) || ({} as IPlayer)
        )
      );
    }
    //setSelectedProp(null);
  }, [selectedPlayer]);

  const properties = Object.keys(playerData || {});
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

  return (
    <Grid
      minHeight="100vh"
      templateColumns="repeat(3, 1fr)"
      templateRows="min-content 1fr"
      gap={4}
    >
      <GridItem colSpan={3} rowSpan={1} rounded="xl" bg="blackAlpha.400">
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
            <Divider maxW="75px" display={{base: "none", sm: "block"}} />
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
            <Divider maxW="75px" display={{base: "none", sm: "block"}} />
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
            <Divider maxW="75px" display={{base: "none", sm: "block"}}/>
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
        </SimpleGrid>
      </GridItem>
      <GridItem colSpan={3} rowSpan={1} rounded="xl">
        {selectedPlayer && playerData && playerDataForEachYear && (
          <SimpleGrid
            minH="100%"
            templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }}
            templateRows={{ base: "min-content 1fr", lg: "1fr" }}
            templateAreas={{
              base: '"Player" "Stat"',
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
              <Stack direction="column" spacing={4}>
                <Stack direction="row">
                  <Image
                    height="100%"
                    minH="200px"
                    width="auto"
                    maxW="200px"
                    objectFit="cover"
                    bgColor="white"
                    rounded="xl"
                    src={playerData?.player_face_url || ""}
                    alt={playerData?.short_name || ""}
                  />
                  <Stack spacing={4}>
                    <Text fontSize="xl">Név: {playerData?.long_name}</Text>
                    <Text fontSize="md">Érték: {playerData?.overall}</Text>
                    <Text fontSize="md">
                      Pozíció: {playerData?.player_positions}
                    </Text>
                    <Text fontSize="md">
                      Nemzetiség: {playerData?.nationality_name}
                    </Text>
                  </Stack>
                </Stack>
                <Stack spacing={4} direction="row" minWidth="full">
                  <Text fontSize="sm">
                    Kor: <br /> {playerData?.age}
                  </Text>
                  <Divider orientation="vertical" />
                  <Text fontSize="sm">
                    Tömeg: <br /> {playerData?.weight_kg} kg
                  </Text>
                  <Divider orientation="vertical" />
                  <Text fontSize="sm">
                    Magasság: <br /> {playerData?.height_cm} cm
                  </Text>
                  <Divider orientation="vertical" />
                  <Text fontSize="sm">
                    Láb: <br /> {playerData?.preferred_foot}
                  </Text>
                </Stack>
              </Stack>
              <SpiderChart
                // Fő tulajdonságok
                data={[
                  mainCategories.map(({ axis, name }) => ({
                    axis: axis,
                    value: Number(playerData[name]) || 0,
                  })),
                ]}
                legends={[playerData?.short_name || ""]}
                title="Main parameters"
                size={{ height: 300, width: 300 }}
              />
            </Stack>
            <Tabs rounded="xl" bg="blackAlpha.400" gridArea="Stat" padding={4}>
              <TabList>
                <Tab>Képességek</Tab>
                <Tab>Éves adatok</Tab>
              </TabList>

              <TabPanels>
                <TabPanel paddingY={4} paddingX={0}>
                  <SimpleGrid minChildWidth="350px" spacing={4}>
                    {categories.map((c, idx) => (
                      <SpiderChart
                        key={idx}
                        data={[
                          properties
                            .filter((p) => p.includes(`${c}_`))
                            .map((fp) => ({
                              axis: capitalize(
                                fp.split("_").slice(1).join(" ")
                              ),
                              value: Number(playerData[fp]) || 0,
                            })),
                        ]}
                        legends={[playerData.short_name]}
                        title={`${capitalize(c)} parameters`}
                        size={{ height: 175, width: 175, paddingX: 75 }}
                      />
                    ))}
                  </SimpleGrid>
                </TabPanel>
                <TabPanel>
                  <Stack padding={0} spacing={4}>
                    <Selector
                      data={SelectablePropKeys.map((key) => ({
                        id: key,
                        name: capitalize(key).split("_").join(" "),
                      }))}
                      defaultValue={selectedProp}
                      isDisabled={!setSelectedPlayer}
                      selectHandler={selectPropHandler}
                    />
                    {selectedProp && (
                      <LineChart
                        data={playerDataForEachYear}
                        selectedProp={selectedProp}
                      />
                    )}
                  </Stack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </SimpleGrid>
        )}
      </GridItem>
    </Grid>
  );
};

export default Player;
