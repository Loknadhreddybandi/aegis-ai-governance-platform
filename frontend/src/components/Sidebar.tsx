type Page = "dashboard" | "assessment" | "history";

interface Props {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

export default function Sidebar({
  activePage,
  onNavigate,
}: Props) {
  const menuItems: {
    id: Page;
    label: string;
    icon: string;
  }[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "▦",
    },
    {
      id: "assessment",
      label: "New Assessment",
      icon: "+",
    },
    {
      id: "history",
      label: "Assessment History",
      icon: "◷",
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col">

      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold">
          Aegis AI
        </h1>

        <p className="text-slate-400 text-sm mt-1">
          AI Governance Platform
        </p>
      </div>

      <nav className="p-4 space-y-2 flex-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
              activePage === item.id
                ? "bg-blue-600 text-white"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            <span className="w-5 text-center">
              {item.icon}
            </span>

            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-5 border-t border-slate-700">
        <p className="text-xs text-slate-500">
          EU AI Act Compliance
        </p>

        <p className="text-xs text-slate-600 mt-1">
          Aegis AI v0.1.0
        </p>
      </div>

    </aside>
  );
}

export type { Page };