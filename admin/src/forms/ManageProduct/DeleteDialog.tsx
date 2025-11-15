import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Props {
  handleCancelDeletion: () => void;
  handleConfirmDeletion: () => void;
}

const DeleteDialog = ({
  handleCancelDeletion,
  handleConfirmDeletion,
}: Props) => {
  return (
    <div className="fixed inset-0 bg-gray-300/10 dark:bg-gray-950/10 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-400 mb-4">
          Confirm Deletion
        </h2>
        <p className="mb-6">Are you sure you want to delete this product ?</p>

        <div className="flex gap-3 justify-end">
          <Button
            onClick={handleCancelDeletion}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            No
          </Button>
          <Button
            onClick={handleConfirmDeletion}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Yes, Delete
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default DeleteDialog;
