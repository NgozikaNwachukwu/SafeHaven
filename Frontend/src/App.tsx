import { useState, useRef } from "react";

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
  const [accessibilityMode, setAccessibilityMode] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            SafeHaven 🏡
          </h1>
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

        {/* Accessibility toggle */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Accessibility
          </p>
          <button
            type="button"
            onClick={() => setAccessibilityMode((prev) => !prev)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border
            ${
              accessibilityMode
                ? "bg-emerald-600/20 border-emerald-500 text-emerald-200"
                : "bg-slate-900 border-slate-700 text-slate-300"
            }`}
          >
            <span>Accessibility mode</span>
            <span
              className={`inline-flex items-center justify-center h-5 w-10 rounded-full text-[10px] font-semibold ${
                accessibilityMode ? "bg-emerald-500" : "bg-slate-600"
              }`}
            >
              {accessibilityMode ? "ON" : "OFF"}
            </span>
          </button>
          <p className="text-[11px] text-slate-500">
            Higher contrast and clearer layout for residents who need extra
            visual support.
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {page === "dashboard" && (
          <Dashboard accessibilityMode={accessibilityMode} />
        )}
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

function Dashboard({ accessibilityMode }: { accessibilityMode: boolean }) {
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
    <div
      className={`space-y-6 ${
        accessibilityMode ? "max-w-6xl" : "max-w-5xl"
      }`}
    >
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">Neighborhood Feed</h2>
          <p className="text-sm text-slate-400">
            Recent reports from residents in your area.
          </p>
        </div>

        <div
          className={`px-3 py-1 rounded-full text-xs border flex items-center gap-2
          ${
            accessibilityMode
              ? "border-emerald-400 bg-emerald-500/15 text-emerald-200"
              : "border-slate-700 bg-slate-900 text-slate-300"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              accessibilityMode ? "bg-emerald-400" : "bg-slate-500"
            }`}
          />
          <span>
            Accessibility mode:{" "}
            <strong>{accessibilityMode ? "On" : "Off"}</strong>
          </span>
        </div>
      </div>

      {/* Two-column layout: feed + map placeholder */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
        {/* Feed */}
        <div className="space-y-4">
          {mockIncidents.map((incident) => (
            <IncidentCard
              key={incident.id}
              incident={incident}
              accessibilityMode={accessibilityMode}
            />
          ))}
        </div>

        {/* Map / safe routes placeholder */}
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Map & Safe Routes</h3>
              <p className="text-xs text-slate-400">
                Visual overview of incidents, school zones & accessible paths.
              </p>
            </div>
            <span className="text-[10px] px-2 py-1 rounded-full bg-slate-800 text-slate-300">
              Coming soon
            </span>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 h-56 flex items-center justify-center">
            <p className="text-xs text-slate-400 text-center max-w-xs">
              This panel will show a live map with incident markers, school
              safety zones, and wheelchair-friendly routes for residents who
              need accessible navigation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function IncidentCard({
  incident,
  accessibilityMode,
}: {
  incident: Incident;
  accessibilityMode: boolean;
}) {
  const riskColors: Record<Incident["risk"], string> = {
    low: "bg-emerald-700",
    medium: "bg-amber-600",
    high: "bg-red-600",
  };

  const baseCardClasses =
    "rounded-xl p-5 space-y-2 border transition shadow-sm";
  const normal =
    "bg-slate-900 border-slate-700 shadow-slate-900/40";
  const accessible =
    "bg-slate-900 border-emerald-400 shadow-emerald-900/40";

  return (
    <div
      className={`${baseCardClasses} ${
        accessibilityMode ? accessible : normal
      }`}
    >
      <div className="flex justify-between items-center gap-3">
        <span
          className={`font-semibold ${
            accessibilityMode ? "text-white text-lg" : "text-white"
          }`}
        >
          {incident.type}
        </span>
        <span
          className={`text-xs text-white px-2 py-0.5 rounded-md ${
            riskColors[incident.risk]
          }`}
        >
          {incident.risk.toUpperCase()}
        </span>
      </div>

      <p
        className={`text-slate-300 ${
          accessibilityMode ? "text-base" : "text-sm"
        }`}
      >
        {incident.description}
      </p>

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
          <label className="block text-sm text-slate-300">
            Upload Photo (optional)
          </label>
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
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [captured, setCaptured] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsLive(true);
      }
    } catch (err) {
      alert("Camera access denied or unavailable.");
      console.error(err);
    }
  }

  function captureImage() {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataURL = canvas.toDataURL("image/png");
    setCaptured(dataURL);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl shadow-emerald-900/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold">Camera Capture</h2>
            <p className="text-sm text-slate-400">
              Use your device camera to capture what&apos;s happening around you.
            </p>
          </div>

          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium
            ${
              isLive
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "bg-slate-800 text-slate-400 border border-slate-700"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isLive ? "bg-emerald-400 animate-pulse" : "bg-slate-500"
              }`}
            />
            {isLive ? "LIVE" : "Offline"}
          </span>
        </div>

        {/* Video container */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl overflow-hidden mb-4">
          <video
            ref={videoRef}
            autoPlay
            className="w-full max-h-[360px] object-cover"
          />
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={startCamera}
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-medium"
          >
            {isLive ? "Restart Camera" : "Enable Camera"}
          </button>

          <button
            type="button"
            onClick={captureImage}
            className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-60"
            disabled={!isLive}
          >
            Capture Photo
          </button>
        </div>

        {/* Hidden canvas for capturing */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Captured image card */}
      {captured && (
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-lg shadow-slate-900/40">
          <p className="text-sm text-slate-300 mb-3">Captured Image:</p>
          <img
            src={captured}
            alt="Captured"
            className="rounded-xl border border-slate-700 max-w-full"
          />
        </div>
      )}
    </div>
  );
}

export default App;
