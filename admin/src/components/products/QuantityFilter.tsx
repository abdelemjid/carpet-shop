import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface Props {
  quantity: { from: number | undefined; to: number | undefined } | undefined;
  setQuantity: (quantity: {
    from: number | undefined;
    to: number | undefined;
  }) => void;
}

const QuantityFilter = ({ quantity, setQuantity }: Props) => {
  let timerFrom: ReturnType<typeof setTimeout> | null = null;
  let timerTo: ReturnType<typeof setTimeout> | null = null;

  const handleFromQuantity = (value: number | undefined) => {
    if (timerFrom) clearTimeout(timerFrom);

    timerFrom = setTimeout(() => {
      setQuantity({
        from: value,
        to: quantity?.to || undefined,
      });
    }, 1000);
  };

  const handleToQuantity = (value: number | undefined) => {
    if (timerTo) clearTimeout(timerTo);

    timerTo = setTimeout(() => {
      setQuantity({
        from: quantity?.from || undefined,
        to: value,
      });
    }, 1000);
  };

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
          value={quantity?.from || undefined}
          onChange={(e) =>
            setQuantity({
              from: parseInt(e.target.value) || undefined,
              to: quantity?.to || undefined,
            })
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
          value={quantity?.to || undefined}
          onChange={(e) =>
            setQuantity({
              from: quantity?.from || undefined,
              to: parseInt(e.target.value) || undefined,
            })
          }
          className="w-40"
        />
      </div>
    </div>
  );
};

export default QuantityFilter;
