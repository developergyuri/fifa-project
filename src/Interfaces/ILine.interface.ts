import { IPlayer } from "./IPlayer.interface";

export interface ILineConfig {
  width: number;
  height: number;
  opacity: number;
  paddingX: number;
  paddingY: number;
  color: any;
}

export interface ILineData extends Array<{ year: number; data: IPlayer }> {}
