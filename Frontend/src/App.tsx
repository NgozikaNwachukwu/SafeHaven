import { useState } from "react";

type Page = "dashboard" | "report" | "camera";

function App() {
  const [page, setPage] = useState<Page>("dashboard");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">SafeHaven 🏡</h1>
          <p className="text-sm text-slate-400 mt-1">
            Neighborhood safety & community alerts
          </p>
        </div>

        <nav className="space-y-2">
          <NavButton
            label="Dashboard"
            active={page === "dashboard"}
            onClick={() => setPage("dashboard")}
          />
          <NavButton
            label="Report incident"
            active={page === "report"}
            onClick={() => setPage("report")}
          />
          <NavButton
            label="Camera view"
            active={page === "camera"}
            onClick={() => setPage("camera")}
          />
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {page === "dashboard" && <Dashboard />}
        {page === "report" && <Report />}
        {page === "camera" && <Camera />}
      </main>
    </div>
  );
}

type NavButtonProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

function NavButton({ label, active, onClick }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition
      ${active ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800/60"}`}
    >
      {label}
    </button>
  );
}

// --- Pages (simple placeholders for now) ---

function Dashboard() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">Dashboard</h2>
      <p className="text-slate-300">
        Overview of recent incidents, map, and school zone alerts will go here.
      </p>
    </div>
  );
}

function Report() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">Report an incident</h2>
      <p className="text-slate-300">
        This will be the form where residents submit text + photo reports.
      </p>
    </div>
  );
}

function Camera() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">Camera capture</h2>
      <p className="text-slate-300">
        Live webcam / snapshot analysis will be implemented here.
      </p>
    </div>
  );
}

export default App;

