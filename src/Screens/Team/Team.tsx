import { useState, useEffect } from "react";
import { Stack, Circle, SimpleGrid, Divider } from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import Selector from "../../Components/Selector/Selector";
import BarChart from "../../Components/BarChart/BarChart";
import { IData } from "../../Interfaces/IData.interface";
import { capitalize } from "../../Utils/StringHelper";
import { IPlayer } from "../../Interfaces/IPlayer.interface";
import { sort } from "fast-sort";

const SelectablePropKeys = [
  "value_eur",
  "wage_eur",
  "age",
  "height_cm",
  "weight_kg",
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

interface IProps {
  data: IData[];
}

const Team = ({ data }: IProps) => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [selectedProp, setSelectedProp] = useState<string | null>(null);

  const [playersData, setPlayersData] = useState<IPlayer[] | null>(null);

  const selectYearHandler = (n: string) => {
    setSelectedYear(Number(n));
  };

  const selectTeamHandler = (n: number) => {
    setSelectedTeam(Number(n));
  };

  const selectPropHandler = (s: string) => {
    setSelectedProp(s);
  };

  useEffect(() => {
    setSelectedTeam(null);
  }, [selectedYear]);

  useEffect(() => {
    if (selectedTeam) {
      setPlayersData(
        data
          .find((d) => d.year === selectedYear)
          ?.data.filter((d) => d.club_team_id === selectedTeam) || null
      );
    }
  }, [selectedTeam]);

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
      </SimpleGrid>
      <Stack padding={0} spacing={4}>
        <Selector
          data={SelectablePropKeys.map((key) => ({
            id: key,
            name: capitalize(key).split("_").join(" "),
          }))}
          defaultValue={selectedProp}
          isDisabled={!setSelectedTeam}
          selectHandler={selectPropHandler}
        />
        {selectedTeam && playersData && selectedProp && (
          <BarChart
            data={sort(playersData).asc([(p) => p[selectedProp] || 0])}
            selectedProp={selectedProp}
          />
        )}
      </Stack>
    </Stack>
  );
};

export default Team;
