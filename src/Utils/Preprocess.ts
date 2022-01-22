import * as d3 from "d3";
import { IPlayer } from "../Interfaces/IPlayer.interface";
import { IData } from "../Interfaces/IData.interface";

export default async () => {
  return await Promise.all(
    [...Array<IData>(8)].map(async (_, i) => ({
      year: 2015 + i,
      data: await d3.csv(
        `${process.env.PUBLIC_URL}/data/players_${15 + i}.csv`,
        (d) => {
          return d3.autoType<IPlayer, string>(d);
        }
      ),
    }))
  );
};

/* 
  const data: Array<DSVParsedArray<IPlayer>> = [];
  for (let i = 15; i < 23; i++) {
    data.push(
      await d3.csv(`${process.env.PUBLIC_URL}/data/players_${i}.csv`, (d) => {
        return d3.autoType(d) as IPlayer;
      })
    );
  }*/

/*
export default async (): Promise<DSVParsedArray<IPlayer>[]> => {
  return await Promise.all(
    [...Array<IDataByYear>(8)].map(async (_, i) => {
      year: 2015 + i,
      data: await d3.csv(
        `${process.env.PUBLIC_URL}/data/players_${15 + i}.csv`,
        (d) => {
          return d3.autoType(d) as IPlayer;
        }
      );
    })
  );
  */
