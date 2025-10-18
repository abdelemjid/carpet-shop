import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface Props {
  quantity: number[] | undefined;
  setQuantity: (quantity: number[]) => void;
}

const QuantityFilter = ({ quantity, setQuantity }: Props) => {
  return (
    <div className="flex flex-row gap-3 lg:justify-center">
      {/* Quantity From */}
      <div className="flex flex-col gap-3 bg-background">
        <Label htmlFor="quantity-start" className="text-xs font-semibold">
          Quantity from
        </Label>
        <Input
          type="number"
          placeholder="from..."
          name="quantity-start"
          id="quantity-start"
          min={-1}
          max={9999}
          value={quantity ? quantity[0] : 0}
          onChange={(e) =>
            setQuantity([parseInt(e.target.value), quantity ? quantity[1] : 0])
          }
          className="w-40"
        />
      </div>
      {/* Quantity To */}
      <div className="flex flex-col gap-3">
        <Label htmlFor="quantity-to" className="text-xs font-semibold">
          To
        </Label>
        <Input
          type="number"
          placeholder="to..."
          name="quantity-to"
          id="quantity-to"
          min={-1}
          max={9999}
          value={quantity ? quantity[1] : 0}
          onChange={(e) =>
            setQuantity([quantity ? quantity[0] : 0, parseInt(e.target.value)])
          }
          className="w-40"
        />
      </div>
    </div>
  );
};

export default QuantityFilter;
