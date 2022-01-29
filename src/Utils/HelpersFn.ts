export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const normalize = (val: number, max: number, min: number) =>
  (val - min) / (max - min);
