export interface ISpiderConfig {
  radius: number;
  w: number;
  h: number;
  factor: number;
  factorLegend: number;
  levels: number;
  maxValue: number;
  radians: number;
  opacityArea: number;
  ToRight: number;
  ExtraWidthX: number;
  ExtraWidthY: number;
  color: any;
}

export interface ISpiderDataElement {
  axis: string;
  value: number;
}

export interface ICoord {
  x: number;
  y: number;
}

export interface ISpiderData extends Array<ISpiderDataElement> {}

export interface IPolygonData extends Array<ICoord> {}
