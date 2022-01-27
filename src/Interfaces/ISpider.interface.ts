export interface ISpiderConfig {
  radius: number;
  width: number;
  height: number;
  factorLegend: number;
  levels: number;
  maxValue: number;
  radians: number;
  opacity: number;
  PaddingX: number;
  PaddingY: number;
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
