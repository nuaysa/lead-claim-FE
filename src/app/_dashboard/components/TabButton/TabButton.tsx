export default function TabButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-bold text-sm border-b-2 transition
        ${active ? "border-primary-main text-primary-main" : "border-transparent text-neutral-gray1"}`}
    >
      {label}
    </button>
  );
}
