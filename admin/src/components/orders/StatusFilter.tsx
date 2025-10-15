import { type Status } from "@/types/order.type";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";

interface Props {
  status?: Status | undefined;
  setStatus?: (status: Status | undefined) => void;
}

const StatusFilter = ({ status, setStatus }: Props) => {
  const capitalize = (s: string) => {
    return `${s.charAt(0).toUpperCase()}${s.slice(1)}`;
  };

  const statusItems = [
    "default",
    "pending",
    "prepared",
    "refused",
    "sent",
    "delivered",
  ];

  return (
    <div className="flex flex-col gap-3">
      <Label>Order Status</Label>
      <Select
        value={status}
        onValueChange={(value) => {
          if (setStatus) {
            if (value === "default") setStatus(undefined);
            else setStatus(value as Status);
          }
        }}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Select a Status" />
        </SelectTrigger>
        <SelectContent defaultValue={status}>
          <SelectGroup>
            <SelectLabel>Order Status</SelectLabel>
            {statusItems.map((s) => (
              <SelectItem key={`key-${s}`} value={s}>
                {capitalize(s)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default StatusFilter;
