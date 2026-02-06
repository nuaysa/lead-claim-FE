import Card from "@/components/Common/Card";


export default function SummaryCard({ icon, title, value, color }: { icon: React.ReactNode; title: string; value: string; color: "primary" | "yellow" | "green" }) {
  const bg = color === "primary" ? "bg-primary-surface text-primary-main" : color === "yellow" ? "bg-semantic-yellow3 text-semantic-yellow1" : "bg-semantic-green3 text-semantic-green1";

  return (
    <Card className="w-full lg:w-1/3 py-6 px-5">
      <div className="flex gap-3">
        <div className={`${bg} h-15 w-15 rounded-2xl flex justify-center items-center text-xl`}>{icon}</div>
        <div className="flex flex-col gap-1 font-bold">
          <h1 className="text-sm text-neutral-gray1 uppercase">{title}</h1>
          <p className="text-2xl font-extrabold text-neutral-black">{value}</p>
        </div>
      </div>
    </Card>
  );
}
