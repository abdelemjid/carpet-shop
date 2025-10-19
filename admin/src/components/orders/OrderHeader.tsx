const OrderHeader = () => {
  return (
    <div className="hidden md:flex flex-row items-center py-2 px-3 rounded-md border border-indigo-900/80 bg-indigo-900/20 dark:border-gray-50/20 dark:bg-gray-900/20">
      <p className="flex-3 text-xs text-center">Product ID</p>
      <p className="flex-1 text-xs text-center">Quantity</p>
      <p className="text-xs flex-1  text-center">Delivered</p>
      <p className="text-xs flex-3  text-center">Date</p>
      <p className="text-xs flex-1  text-center">Total Price</p>
      <p className="text-xs flex-2 text-center">Order Status</p>
    </div>
  );
};

export default OrderHeader;
