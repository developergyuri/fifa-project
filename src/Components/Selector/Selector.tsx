import { Select } from "@chakra-ui/react";
import { sort } from "fast-sort";

interface Props {
  data: Array<{ id: number | string; name: number | string }>;
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
        .by([{ asc: (n) => n.name }])
        .map(({ id, name }, idx) => (
          <option value={id} key={idx} color="black">{`${name}`}</option>
        ))}
    </Select>
  );
};

export default Selector;
