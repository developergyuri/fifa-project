export interface IMapData {
  type: string;
  features: Array<{
    type: string;
    properties: Array<{ name: string }>;
    geometry: Array<{ type: string; coordinates: Array<[number, number]> }>;
    id: string;
  }>;
}

export interface IMapConfig {
  width: number;
  height: number;
  paddingX: number;
  paddingY: number;
  color: any;
}
