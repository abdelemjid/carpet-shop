import { Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

interface Props {
  hidden: boolean;
}

const NewUserButton = ({ hidden }: Props) => {
  const navigate = useNavigate();

  return (
    <div
      className={`fixed bottom-[25px] right-[25px] md:bottom-[35px] md:right-[50px] transition-opacity ${
        hidden ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <Button
        onClick={() => navigate("/admin/users/new")}
        title="New User"
        className="p-5 rounded-full cursor-pointer"
      >
        <Plus />
      </Button>
    </div>
  );
};

export default NewUserButton;
