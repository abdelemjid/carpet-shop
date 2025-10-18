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
      <Label htmlFor="status-filter" className="text-xs font-semibold">
        Order Status
      </Label>
      <Select
        value={status}
        onValueChange={(value) => {
          if (setStatus) {
            if (value === "default") setStatus(undefined);
            else setStatus(value as Status);
          }
        }}
      >
        <SelectTrigger id="status-filter" className="w-[150px] text-xs">
          <SelectValue placeholder="Select a Status" />
        </SelectTrigger>
        <SelectContent className="text-xs" defaultValue={status}>
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
