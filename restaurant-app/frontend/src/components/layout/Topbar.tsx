interface TopbarProps {
  titel: string;
  aktion?: React.ReactNode;
}

export default function Topbar({ titel, aktion }: TopbarProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-xl font-semibold text-gray-800">{titel}</h1>
      {aktion && <div>{aktion}</div>}
    </div>
  );
}
