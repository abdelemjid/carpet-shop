interface Props {
  title: string;
  subtitle: string;
  icon: any;
}

const StatsCard = ({ title, subtitle, icon }: Props) => {
  return (
    <div className="flex flex-col gap-3 py-2 px-5 rounded-md border border-gray-50/20 bg-gray-900/50">
      <h3 className="text-sm text-center font-semibold">{title}</h3>
      <div className="flex flex-row gap-2 justify-center items-center transition-all duration-200 ease-in-out">
        <div>{icon}</div>
        <p className="text-md text-center font-bold">{subtitle}</p>
      </div>
    </div>
  );
};

export default StatsCard;
