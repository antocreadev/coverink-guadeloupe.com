import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie, Cell,
  AreaChart, Area,
  XAxis, YAxis, Tooltip, Legend, CartesianGrid,
} from "recharts";

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? "";
const TOKEN_KEY = "mm971_admin_token";

type Counts = { c: number };
type Pair<K extends string> = Record<K, string> & Counts;

type Analytics = {
  totals: { total_views: number; total_visitors: number; sessions: number };
  byDay: { d: string; views: number; uniques: number }[];
  byMonth: { m: string; views: number; uniques: number }[];
  byYear: { y: number; views: number; uniques: number }[];
  byHour: { h: number; views: number }[];
  byPath: { path: string; views: number; uniques: number }[];
  byBrowser: Pair<"browser">[];
  byOS: Pair<"os">[];
  byDevice: Pair<"device">[];
  byCountry: Pair<"country">[];
  byCity: Pair<"city">[];
  byLang: Pair<"language">[];
  byTz: Pair<"timezone">[];
  byScreen: Pair<"res">[];
  byReferrer: Pair<"ref">[];
  byConnection: Pair<"t">[];
  recent: Array<Record<string, unknown>>;
};

const PALETTE = [
  "#6366f1", "#ec4899", "#10b981", "#f59e0b", "#ef4444",
  "#06b6d4", "#8b5cf6", "#84cc16", "#f97316", "#14b8a6",
  "#a855f7", "#0ea5e9",
];

function toCsv(rows: Record<string, unknown>[]): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(","),
    ...rows.map((r) =>
      headers.map((h) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(","),
    ),
  ];
  return lines.join("\n");
}

function downloadCsv(name: string, rows: Record<string, unknown>[]) {
  const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminAnalytics() {
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem(TOKEN_KEY);
    if (saved) { setToken(saved); setAuthed(true); }
  }, []);

  const load = async (tk: string) => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/admin/analytics`, {
        headers: { "x-admin-token": tk },
      });
      if (res.status === 401) { setError("Token invalide"); setAuthed(false); sessionStorage.removeItem(TOKEN_KEY); return; }
      if (!res.ok) { setError(`Erreur ${res.status}`); return; }
      const j = await res.json();
      setData(j);
      sessionStorage.setItem(TOKEN_KEY, tk);
      setAuthed(true);
    } catch { setError("Erreur réseau"); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (authed && token) load(token); }, [authed]);

  const dayData = useMemo(
    () => (data?.byDay ?? []).map((r) => ({ ...r, d: r.d?.slice(0, 10) })),
    [data],
  );

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <form
          onSubmit={(e) => { e.preventDefault(); load(token); }}
          className="bg-card border rounded-xl p-8 w-full max-w-sm space-y-4"
        >
          <h1 className="text-xl font-semibold">Analytics — admin</h1>
          <input
            type="password" value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Token admin"
            className="w-full border rounded-md px-3 py-2 bg-background"
            autoFocus
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Connexion…" : "Se connecter"}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" asChild>
            <Link to="/"><ArrowLeft className="w-4 h-4 mr-2" />Accueil</Link>
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => load(token)} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Rafraîchir
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/commandes">Commandes</Link>
            </Button>
          </div>
        </div>

        <h1 className="text-2xl font-semibold mb-6">Analytics</h1>

        {error && <div className="p-4 bg-destructive/10 text-destructive rounded mb-4">{error}</div>}
        {!data ? (
          <div className="text-muted-foreground">Chargement…</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Stat label="Vues totales" value={data.totals.total_views} />
              <Stat label="Visiteurs uniques" value={data.totals.total_visitors} />
              <Stat label="Sessions" value={data.totals.sessions} />
            </div>

            <Section
              title="Trafic par jour (90j)"
              onCsv={() => downloadCsv("trafic-jour", dayData)}
            >
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dayData}>
                  <defs>
                    <linearGradient id="gV" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={PALETTE[0]} stopOpacity={0.6}/>
                      <stop offset="95%" stopColor={PALETTE[0]} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="gU" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={PALETTE[2]} stopOpacity={0.6}/>
                      <stop offset="95%" stopColor={PALETTE[2]} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3}/>
                  <XAxis dataKey="d" /><YAxis /><Tooltip /><Legend />
                  <Area type="monotone" dataKey="views" stroke={PALETTE[0]} fill="url(#gV)" name="Vues" />
                  <Area type="monotone" dataKey="uniques" stroke={PALETTE[2]} fill="url(#gU)" name="Uniques" />
                </AreaChart>
              </ResponsiveContainer>
            </Section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Section
                title="Trafic par mois (24m)"
                onCsv={() => downloadCsv("trafic-mois", data.byMonth)}
              >
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={data.byMonth}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3}/>
                    <XAxis dataKey="m" /><YAxis /><Tooltip /><Legend />
                    <Line type="monotone" dataKey="views" stroke={PALETTE[0]} name="Vues" />
                    <Line type="monotone" dataKey="uniques" stroke={PALETTE[2]} name="Uniques" />
                  </LineChart>
                </ResponsiveContainer>
              </Section>

              <Section
                title="Trafic par année"
                onCsv={() => downloadCsv("trafic-annee", data.byYear)}
              >
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={data.byYear}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3}/>
                    <XAxis dataKey="y" /><YAxis /><Tooltip /><Legend />
                    <Bar dataKey="views" fill={PALETTE[0]} name="Vues" />
                    <Bar dataKey="uniques" fill={PALETTE[2]} name="Uniques" />
                  </BarChart>
                </ResponsiveContainer>
              </Section>
            </div>

            <Section
              title="Heures de la journée (30j)"
              onCsv={() => downloadCsv("trafic-heures", data.byHour)}
            >
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data.byHour}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3}/>
                  <XAxis dataKey="h" /><YAxis /><Tooltip />
                  <Bar dataKey="views" fill={PALETTE[5]} name="Vues" />
                </BarChart>
              </ResponsiveContainer>
            </Section>

            <Section
              title="Pages les plus vues"
              onCsv={() => downloadCsv("pages", data.byPath)}
            >
              <ResponsiveContainer width="100%" height={Math.min(500, 30 + data.byPath.length * 28)}>
                <BarChart data={data.byPath} layout="vertical" margin={{ left: 120 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3}/>
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="path" width={200} />
                  <Tooltip /><Legend />
                  <Bar dataKey="views" fill={PALETTE[0]} name="Vues" />
                  <Bar dataKey="uniques" fill={PALETTE[2]} name="Uniques" />
                </BarChart>
              </ResponsiveContainer>
            </Section>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <PieSection title="Navigateurs" rows={data.byBrowser} k="browser" />
              <PieSection title="OS" rows={data.byOS} k="os" />
              <PieSection title="Type d'appareil" rows={data.byDevice} k="device" />
              <PieSection title="Pays" rows={data.byCountry} k="country" />
              <PieSection title="Langues" rows={data.byLang} k="language" />
              <PieSection title="Connexion" rows={data.byConnection} k="t" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <BarSection title="Villes" rows={data.byCity} k="city" />
              <BarSection title="Fuseaux horaires" rows={data.byTz} k="timezone" />
              <BarSection title="Résolutions" rows={data.byScreen} k="res" />
              <BarSection title="Referrers" rows={data.byReferrer} k="ref" />
            </div>

            <Section
              title="Visiteurs récents"
              onCsv={() => downloadCsv("visiteurs", data.recent)}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-muted/50 text-left">
                    <tr>
                      <Th>Vu</Th><Th>IP</Th><Th>Pays</Th><Th>Ville</Th>
                      <Th>Navigateur</Th><Th>OS</Th><Th>Appareil</Th>
                      <Th>Langue</Th><Th>TZ</Th><Th>Écran</Th>
                      <Th>CPU</Th><Th>RAM</Th><Th>Net</Th>
                      <Th>GPU</Th><Th>FP</Th><Th>Visites</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recent.map((r, i) => (
                      <tr key={i} className="border-t">
                        <Td>{String(r.last_seen ?? "").replace("T"," ").slice(0,16)}</Td>
                        <Td>{String(r.ip ?? "")}</Td>
                        <Td>{String(r.country ?? "")}</Td>
                        <Td>{String(r.city ?? "")}</Td>
                        <Td>{String(r.browser ?? "")}</Td>
                        <Td>{String(r.os ?? "")}</Td>
                        <Td>{String(r.device_type ?? "")}</Td>
                        <Td>{String(r.language ?? "")}</Td>
                        <Td>{String(r.timezone ?? "")}</Td>
                        <Td>{String(r.screen_width ?? "")}×{String(r.screen_height ?? "")}</Td>
                        <Td>{String(r.hardware_concurrency ?? "")}</Td>
                        <Td>{String(r.device_memory ?? "")}</Td>
                        <Td>{String(r.connection_type ?? "")}</Td>
                        <Td className="max-w-xs truncate">{String(r.webgl_renderer ?? "")}</Td>
                        <Td><code>{String(r.canvas_fp ?? "").slice(0,8)}</code></Td>
                        <Td>{String(r.visits ?? "")}</Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          </>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-card border rounded-xl p-6">
      <div className="text-xs text-muted-foreground uppercase tracking-wide">{label}</div>
      <div className="text-3xl font-semibold mt-1">{value}</div>
    </div>
  );
}

function Section({
  title, children, onCsv,
}: { title: string; children: React.ReactNode; onCsv?: () => void }) {
  return (
    <div className="bg-card border rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">{title}</h3>
        {onCsv && (
          <Button size="sm" variant="outline" onClick={onCsv}>
            <Download className="w-3 h-3 mr-1" />CSV
          </Button>
        )}
      </div>
      {children}
    </div>
  );
}

function PieSection<K extends string>({
  title, rows, k,
}: { title: string; rows: (Record<K, string> & Counts)[]; k: K }) {
  const data = (rows ?? []).slice(0, 10).map((r) => ({ name: String(r[k] ?? "—"), value: Number(r.c) }));
  return (
    <Section title={title} onCsv={() => downloadCsv(title, rows as unknown as Record<string, unknown>[])}>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={80} label>
            {data.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
          </Pie>
          <Tooltip /><Legend />
        </PieChart>
      </ResponsiveContainer>
    </Section>
  );
}

function BarSection<K extends string>({
  title, rows, k,
}: { title: string; rows: (Record<K, string> & Counts)[]; k: K }) {
  const data = (rows ?? []).slice(0, 15).map((r) => ({ name: String(r[k] ?? "—"), value: Number(r.c) }));
  return (
    <Section title={title} onCsv={() => downloadCsv(title, rows as unknown as Record<string, unknown>[])}>
      <ResponsiveContainer width="100%" height={Math.min(400, 30 + data.length * 24)}>
        <BarChart data={data} layout="vertical" margin={{ left: 80 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3}/>
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" width={140} />
          <Tooltip />
          <Bar dataKey="value" fill={PALETTE[3]} />
        </BarChart>
      </ResponsiveContainer>
    </Section>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-3 py-2 font-medium whitespace-nowrap">{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-3 py-2 ${className}`}>{children}</td>;
}
