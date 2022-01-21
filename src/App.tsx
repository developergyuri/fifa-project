import { useEffect, useState } from "react";
import { Container, Text } from "@chakra-ui/react";
import { Grid, GridItem } from "@chakra-ui/react";
import { DSVRowArray } from "d3";
import * as d3 from "d3";
import "./App.css";
import { IPlayer } from "./Interfaces/Player.interface";

type CSVData = DSVRowArray | null;

const App = () => {
  /* const initialState: CSVData = null;
  const [fetchedCSVData, setFetchedCSVdata] = useState<CSVData>(initialState);

  if (!fetchedCSVData) {
    d3.csv(`./data/players_12.csv`).then((res) => {
      setFetchedCSVdata(res);
    });
  } */

  useEffect(() => {
    for (let i = 15; i < 23; i++) {
      d3.csv(`${process.env.PUBLIC_URL}/data/players_${i}.csv`, (d) => {
        return d3.autoType(d) as IPlayer;
      }).then((res) => console.log(res));
    }
  }, []);

  return (
    <div className="App">
      <Grid
        //templateRows="repeat(5, 1fr)"
        templateColumns="repeat(3, 1fr)"
        autoRows="min-content"
        gap={4}
      >
        <GridItem rowSpan={1} colSpan={3} bg="tomato" height="50px">
          <Container centerContent={true}>
            <Text fontSize="3xl">Football Visualization Project</Text>
          </Container>
        </GridItem>
        <GridItem rowSpan={4} colSpan={3} bg="papayawhip">
          <Container centerContent={true}>Content</Container>
        </GridItem>
      </Grid>
    </div>
  );
};

export default App;

/* d3.csv(`${process.env.PUBLIC_URL}/data/players_${i}.csv`, (d) => {
        return {
          player_url: d["player_url"],
          short_name: d["short_name"],
          long_name: d["long_name"],
          player_positions: d["player_positions"],
          overall: Number(d["overall"]),
          potential: Number(d["potential"]),
          value_eur: Number(d["value_eur"]),
          wage_eur: Number(d["wage_eur"]),
          age: Number(d["age"]),
          dob: new Date(d["dob"] || ""),
          height_cm: Number(d["height_cm"]),
          weight_kg: Number(d["weight_kg"]),
          club_team_id: Number(d["club_team_id"]),
          club_name: d["club_name"],
          league_name: d["league_name"],
          league_level: Number(d["league_level"]),
          club_position: d["club_position"],
          club_jersey_number: Number(d["club_jersey_number"]),
          club_loaned_from: new Date(d["club_loaned_from"] || ""),
          club_joined: new Date(d["club_joined"] || ""),
          club_contract_valid_until: Number(d["club_contract_valid_until"]),
          nationality_id: Number(d["nationality_id"]),
          nationality_name: d["ationality_name"],
          nation_team_id: Number(d["nation_team_id"]),
          nation_position: d["nation_position"],
          nation_jersey_number: Number(d["nation_jersey_number"]),
          preferred_foot: d["preferred_foot"],
          weak_foot: Number(d["weak_foot"]),
        } as IPlayer;
      }).then((res) => {
        console.log(res);
      });*/
