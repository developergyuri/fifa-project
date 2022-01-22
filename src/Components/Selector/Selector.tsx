import { Select } from "@chakra-ui/react";

interface Props {
  data: number[] | string[];
  defaultValue: null | string | number;
  selectHandler: (a: any) => void;
}

const Selector = ({ data, defaultValue, selectHandler }: Props) => {
  return (
    <Select
      placeholder="Kiválasztás"
      value={defaultValue ? defaultValue : ""}
      color="darkgray"
      onChange={({ target: { value } }) => selectHandler(value)}
    >
      {data.map((d, idx) => (
        <option value={d} key={idx} color="black">{`${d}`}</option>
      ))}
    </Select>
  );
};

export default Selector;
