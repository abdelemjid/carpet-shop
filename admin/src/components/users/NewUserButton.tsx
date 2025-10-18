import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  hidden: boolean;
}

const NewUserButton = ({ hidden }: Props) => {
  return (
    <div
      className={`fixed bottom-2 right-2 transition-opacity ${
        hidden ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <Link
        to="/admin/users/new"
        className="w-[50px] h-[50px] fixed z-50 bottom-[10px] right-[10px] md:bottom-[30px] md:right-[30px] rounded-full bg-indigo-500 hover:bg-indigo-400 transition-all duration-200 ease-in-out"
      >
        <Plus size={35} className="h-full m-auto" />
      </Link>
    </div>
  );
};

export default NewUserButton;
