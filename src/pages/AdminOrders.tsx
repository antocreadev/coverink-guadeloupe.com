import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, RefreshCw, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type OrderRow = {
  id: number;
  paypal_order_id: string;
  paypal_capture_id: string;
  product_id: string | null;
  product_name: string | null;
  amount: string | number;
  currency: string;
  status: string;
  payer_name: string | null;
  payer_email: string | null;
  shipping_name: string | null;
  shipping_address: string | null;
  customer_firstname: string | null;
  customer_lastname: string | null;
  customer_phone: string | null;
  customer_address: string | null;
  customer_note: string | null;
  created_at: string;
};

function buildWhatsAppUrl(phone: string, msg: string) {
  const digits = phone.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`;
}

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? "";
const TOKEN_KEY = "mm971_admin_token";

export default function AdminOrders() {
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem(TOKEN_KEY);
    if (saved) {
      setToken(saved);
      setAuthed(true);
    }
  }, []);

  const load = async (tk: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/admin/orders`, {
        headers: { "x-admin-token": tk },
      });
      if (res.status === 401) {
        setError("Token invalide");
        setAuthed(false);
        sessionStorage.removeItem(TOKEN_KEY);
        return;
      }
      if (!res.ok) {
        setError(`Erreur ${res.status}`);
        return;
      }
      const data = await res.json();
      setOrders(data.orders ?? []);
      sessionStorage.setItem(TOKEN_KEY, tk);
      setAuthed(true);
    } catch (err) {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authed && token) load(token);
  }, [authed]);

  const total = useMemo(
    () => orders.reduce((s, o) => s + Number(o.amount), 0),
    [orders],
  );

  const exportCsv = () => {
    const header = [
      "date",
      "paypal_order_id",
      "produit",
      "montant",
      "devise",
      "statut",
      "prenom",
      "nom",
      "telephone",
      "email_paypal",
      "adresse",
      "note",
    ];
    const rows = orders.map((o) => [
      o.created_at,
      o.paypal_order_id,
      o.product_name ?? "",
      Number(o.amount).toFixed(2),
      o.currency,
      o.status,
      o.customer_firstname ?? "",
      o.customer_lastname ?? "",
      o.customer_phone ?? "",
      o.payer_email ?? "",
      o.customer_address ?? o.shipping_address ?? "",
      o.customer_note ?? "",
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `commandes-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            load(token);
          }}
          className="bg-card border rounded-xl p-8 w-full max-w-sm space-y-4"
        >
          <h1 className="text-xl font-semibold">Espace admin</h1>
          <input
            type="password"
            value={token}
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
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Accueil
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => load(token)}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Rafraîchir
            </Button>
            <Button variant="outline" size="sm" onClick={exportCsv}>
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Stat label="Commandes" value={orders.length.toString()} />
          <Stat label="Chiffre d'affaires" value={`${total.toFixed(2)} €`} />
          <Stat
            label="Dernière"
            value={
              orders[0]
                ? new Date(orders[0].created_at).toLocaleDateString("fr-FR")
                : "—"
            }
          />
        </div>

        <div className="bg-card border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="font-semibold">Commandes</h2>
          </div>

          {error ? (
            <div className="p-12 text-center text-destructive">{error}</div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              {loading ? "Chargement…" : "Aucune commande."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr className="text-left">
                    <Th>Date</Th>
                    <Th>PayPal ID</Th>
                    <Th>Produit</Th>
                    <Th>Client</Th>
                    <Th>Adresse</Th>
                    <Th>Montant</Th>
                    <Th>Statut</Th>
                    <Th>Action</Th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => {
                    const fullName =
                      [o.customer_firstname, o.customer_lastname]
                        .filter(Boolean)
                        .join(" ") || o.payer_name || "—";
                    const address =
                      o.customer_address || o.shipping_address || "—";
                    const waMsg = `Bonjour ${o.customer_firstname ?? ""}, merci pour votre commande ${o.product_name ?? ""} (${Number(o.amount).toFixed(2)}€). Je reviens vers vous pour organiser la suite. — John`;
                    return (
                      <tr key={o.id} className="border-t align-top">
                        <Td>
                          {new Date(o.created_at).toLocaleString("fr-FR", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </Td>
                        <Td>
                          <code className="text-xs">
                            {o.paypal_order_id.slice(0, 10)}…
                          </code>
                        </Td>
                        <Td>{o.product_name}</Td>
                        <Td>
                          <div>{fullName}</div>
                          <div className="text-xs text-muted-foreground">
                            {o.customer_phone || o.payer_email}
                          </div>
                          {o.customer_note && (
                            <div className="text-xs text-muted-foreground mt-1 italic">
                              {o.customer_note}
                            </div>
                          )}
                        </Td>
                        <Td className="max-w-xs text-xs">{address}</Td>
                        <Td className="font-semibold whitespace-nowrap">
                          {Number(o.amount).toFixed(2)} {o.currency}
                        </Td>
                        <Td>
                          <span className="inline-flex items-center gap-1.5 text-xs">
                            <span
                              className={`w-2 h-2 rounded-full ${o.status === "COMPLETED" ? "bg-green-500" : "bg-yellow-500"}`}
                            />
                            {o.status}
                          </span>
                        </Td>
                        <Td>
                          {o.customer_phone ? (
                            <Button
                              size="sm"
                              variant="outline"
                              asChild
                              className="whitespace-nowrap"
                            >
                              <a
                                href={buildWhatsAppUrl(o.customer_phone, waMsg)}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <MessageCircle className="w-3 h-3 mr-1" />
                                WhatsApp
                              </a>
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              pas de tél
                            </span>
                          )}
                        </Td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card border rounded-xl p-6">
      <div className="text-xs text-muted-foreground uppercase tracking-wide">
        {label}
      </div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 text-xs font-medium">{children}</th>;
}
function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-4 py-3 ${className}`}>{children}</td>;
}
