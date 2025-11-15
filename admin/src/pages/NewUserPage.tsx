import NewUserForm from "@/forms/NewUser/NewUserForm";
import type { UserAccount } from "@/types/user.type";
import { ApiClient } from "@/utils/ApiClient";
import { useMutation } from "@tanstack/react-query";

const NewUserPage = () => {
  const { isPending, mutate: createUser } = useMutation({
    mutationKey: ["create-user"],
    mutationFn: ApiClient.createUser,
  });

  const onSave = async (user: UserAccount) => {
    createUser(user);
  };

  return (
    <div className="w-full flex flex-col justify-center items-center my-2">
      <div className="container w-full h-full border border-indigo-900/80 bg-indigo-900/20 dark:bg-gray-900/20 dark:border-gray-50/20 rounded-lg p-5 mx-auto lg:max-w-[80%]">
        <div className="flex flex-col gap-5 justify-center">
          {/* Form Heading */}
          <h1 className="text-2xl mb-5">Create New User</h1>
          {/* User Form */}
          <NewUserForm isLoading={isPending} onSave={onSave} />
        </div>
      </div>
    </div>
  );
};

export default NewUserPage;
