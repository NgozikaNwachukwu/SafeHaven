import { useState } from "react";

type Page = "dashboard" | "report" | "camera";

type Incident = {
  id: number;
  type: string;
  description: string;
  time: string;
  location: string;
  risk: "low" | "medium" | "high";
};

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

// --- Dashboard + Incident feed ---

function Dashboard() {
  const mockIncidents: Incident[] = [
    {
      id: 1,
      type: "Suspicious Activity",
      description: "Person seen checking car door handles at night.",
      time: "5 minutes ago",
      location: "Maple Street",
      risk: "medium",
    },
    {
      id: 2,
      type: "Lost Pet",
      description: "Small brown dog wandering near Oak Ave.",
      time: "20 minutes ago",
      location: "Oak Avenue",
      risk: "low",
    },
    {
      id: 3,
      type: "Traffic Hazard",
      description:
        "Broken traffic light causing confusion at intersection.",
      time: "1 hour ago",
      location: "Pine & 3rd",
      risk: "high",
    },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-2xl font-semibold">Neighborhood Feed</h2>

      <div className="space-y-4">
        {mockIncidents.map((incident) => (
          <IncidentCard key={incident.id} incident={incident} />
        ))}
      </div>
    </div>
  );
}

function IncidentCard({ incident }: { incident: Incident }) {
  const riskColors: Record<Incident["risk"], string> = {
    low: "bg-emerald-700",
    medium: "bg-amber-600",
    high: "bg-red-600",
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 space-y-2">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-white">{incident.type}</span>
        <span
          className={`text-xs text-white px-2 py-0.5 rounded-md ${
            riskColors[incident.risk]
          }`}
        >
          {incident.risk.toUpperCase()}
        </span>
      </div>

      <p className="text-slate-300 text-sm">{incident.description}</p>

      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
        <span>{incident.location}</span>
        <span>{incident.time}</span>
      </div>
    </div>
  );
}

// --- Report page ---

function Report() {
  const [type, setType] = useState("suspicious");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<null | "idle" | "submitting" | "done">(
    null
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!description.trim()) {
      alert("Please add a short description of what happened.");
      return;
    }

    setStatus("submitting");

    // For now, just log it. Later we'll send to backend + Claude.
    console.log("New incident:", {
      type,
      description,
      fileName: file?.name ?? null,
    });

    setTimeout(() => {
      setStatus("done");
      // clear fields
      setDescription("");
      setFile(null);
      setType("suspicious");
    }, 600);
  }

  return (
    <div className="space-y-6 max-w-xl">
      <h2 className="text-2xl font-semibold mb-2">Report an Incident</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Category */}
        <div className="space-y-1">
          <label className="block text-sm text-slate-300">Incident Type</label>
          <select
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="suspicious">Suspicious Activity</option>
            <option value="crime">Crime / Danger</option>
            <option value="vandalism">Vandalism / Damage</option>
            <option value="traffic">Traffic Issue</option>
            <option value="pet">Lost / Found Pet</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="block text-sm text-slate-300">Description</label>
          <textarea
            rows={4}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white"
            placeholder="Describe what happened..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <p className="text-xs text-slate-500">
            Avoid personal details or names. Focus on what you saw or heard.
          </p>
        </div>

        {/* Photo Upload */}
        <div className="space-y-1">
          <label className="block text-sm text-slate-300">Upload Photo (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-white file:bg-slate-700 file:border-none file:px-4 file:py-2 file:rounded-lg file:text-white hover:file:bg-slate-600"
          />
          {file && (
            <p className="text-xs text-slate-400 mt-1">
              Selected: <span className="font-medium">{file.name}</span>
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={status === "submitting"}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 px-5 py-2 rounded-lg text-sm font-medium"
        >
          {status === "submitting" ? "Submitting..." : "Submit"}
        </button>

        {status === "done" && (
          <p className="text-sm text-emerald-400 mt-2">
            Thank you — your report has been recorded (demo mode).
          </p>
        )}
      </form>
    </div>
  );
}


// --- Camera page ---

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
