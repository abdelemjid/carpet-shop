import type { UserAccount } from "@/types/user.type";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import NewUserInputs from "./NewUserInputs";
import loading from "@/assets/loading.svg";

interface Props {
  onSave: (user: UserAccount) => void;
  isLoading: boolean;
}

const NewUserForm = ({ onSave, isLoading }: Props) => {
  const formMethods = useForm<UserAccount>();
  const { handleSubmit } = formMethods;

  const submit = handleSubmit((user: UserAccount) => {
    onSave(user);
  });

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={submit}>
        <div className="min-w-[300px] flex flex-col gap-2">
          <NewUserInputs />
          {/* Create Button */}
          <Button className="mt-3">
            {isLoading ? (
              <img src={loading} className="w-[15px] h-[15px]" />
            ) : (
              "Create User"
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default NewUserForm;
