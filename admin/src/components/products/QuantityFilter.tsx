import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface Props {
  fQuantity: number | undefined;
  tQuantity: number | undefined;
  setFQuantity: (from: number | undefined) => void;
  setTQuantity: (to: number | undefined) => void;
}

const QuantityFilter = ({
  fQuantity,
  setFQuantity,
  tQuantity,
  setTQuantity,
}: Props) => {
  const [fInput, setFInput] = useState<number | undefined>(fQuantity);
  const [tInput, setTInput] = useState<number | undefined>(tQuantity);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFQuantity(fInput);
    }, 800);

    return () => clearTimeout(timer);
  }, [fInput, setFQuantity]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTQuantity(tInput);
    }, 800);

    return () => clearTimeout(timer);
  }, [tInput, setTQuantity]);

  useEffect(() => {
    setFInput(fQuantity);
  }, [fQuantity]);

  useEffect(() => {
    setTInput(tQuantity);
  }, [tQuantity]);

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
          value={fInput}
          onChange={(e) => setFInput(Number(e?.target?.value) || undefined)}
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
          value={tInput}
          onChange={(e) => setTInput(Number(e?.target?.value) || undefined)}
          className="w-40"
        />
      </div>
    </div>
  );
};

export default QuantityFilter;
