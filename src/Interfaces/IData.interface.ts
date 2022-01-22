import { DSVParsedArray } from "d3";
import { IPlayer } from "./IPlayer.interface";

export interface IData {
  year: number;
  data: DSVParsedArray<IPlayer>;
}
