import { Select } from "@chakra-ui/react";
import { sort } from "fast-sort";

interface Props {
  data: number[] | string[];
  defaultValue: null | string | number;
  selectHandler: (a: any) => void;
  isDisabled?: boolean;
}

const Selector = ({ data, defaultValue, isDisabled, selectHandler }: Props) => {
  return (
    <Select
      placeholder="Kiválasztás"
      value={defaultValue ? defaultValue : ""}
      color="darkgray"
      onChange={({ target: { value } }) => selectHandler(value)}
      disabled={isDisabled}
    >
      {sort([...data])
        .asc()
        .map((d, idx) => (
          <option value={d} key={idx} color="black">{`${d}`}</option>
        ))}
    </Select>
  );
};

export default Selector;
