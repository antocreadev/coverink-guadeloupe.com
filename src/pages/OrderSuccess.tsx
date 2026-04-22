import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, MessageCircle, ArrowLeft, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLastOrder } from "@/lib/notify";
import { buildWhatsAppLink } from "@/lib/products";
import { toast } from "@/components/ui/sonner";

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? "";

type CustomerInfo = {
  firstname: string;
  lastname: string;
  phone: string;
  address: string;
  note: string;
};

export default function OrderSuccess() {
  const { id } = useParams<{ id: string }>();
  const [order] = useState(() => (id ? getLastOrder(id) : undefined));
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<CustomerInfo>({
    firstname: "",
    lastname: "",
    phone: "",
    address: "",
    note: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    if (order) {
      const [first = "", last = ""] = (order.payerName ?? "").split(" ");
      setForm((f) => ({
        ...f,
        firstname: f.firstname || first,
        lastname: f.lastname || last,
        address: f.address || order.shippingAddress || "",
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-semibold">Commande introuvable</h1>
          <p className="text-muted-foreground">
            Si vous venez de régler, votre paiement est bien enregistré. Contactez-nous avec votre n° de transaction.
          </p>
          <Button asChild>
            <Link to="/">Retour à l'accueil</Link>
          </Button>
        </div>
      </div>
    );
  }

  const submitCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstname || !form.lastname || !form.phone || !form.address) {
      toast.error("Merci de remplir tous les champs obligatoires");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/orders/${order.id}/customer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        toast.error("Erreur lors de l'enregistrement");
        return;
      }
      setSaved(true);
      toast.success("Informations enregistrées");
    } catch {
      toast.error("Erreur réseau");
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappMsg = `Bonjour John, je viens de régler ma commande sur le site.
Numéro : ${order.id}
Produit : ${order.productName}
Montant : ${order.amount.toFixed(2)}€
Nom : ${form.firstname} ${form.lastname}
Téléphone : ${form.phone}
Adresse : ${form.address}${form.note ? `\nNote : ${form.note}` : ""}`;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Link>
        </Button>

        <div className="bg-card border rounded-xl p-8 shadow-sm">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-semibold mb-2">
              Merci{order.payerName ? `, ${order.payerName}` : ""} !
            </h1>
            <p className="text-muted-foreground">
              Votre paiement a bien été reçu.
            </p>
          </div>

          <div className="space-y-4 border-t border-b py-6">
            <Row label="Numéro de commande">
              <div className="flex items-center gap-2">
                <code className="text-sm bg-muted px-2 py-1 rounded">{order.id}</code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(order.id);
                    toast("Numéro copié");
                  }}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Copier"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </Row>
            <Row label="Produit">{order.productName}</Row>
            <Row label="Montant payé">
              <span className="font-semibold text-primary">
                {order.amount.toFixed(2)} {order.currency}
              </span>
            </Row>
          </div>

          {!saved ? (
            <form onSubmit={submitCustomer} className="mt-8 space-y-4">
              <div>
                <h2 className="font-semibold mb-1">Vos coordonnées de livraison</h2>
                <p className="text-xs text-muted-foreground">
                  Pour que John puisse vous contacter et organiser la livraison/pose.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Prénom *"
                  value={form.firstname}
                  onChange={(v) => setForm({ ...form, firstname: v })}
                />
                <Field
                  label="Nom *"
                  value={form.lastname}
                  onChange={(v) => setForm({ ...form, lastname: v })}
                />
              </div>
              <Field
                label="Téléphone *"
                type="tel"
                value={form.phone}
                onChange={(v) => setForm({ ...form, phone: v })}
                placeholder="+590 690 xx xx xx"
              />
              <Field
                label="Adresse complète *"
                value={form.address}
                onChange={(v) => setForm({ ...form, address: v })}
                textarea
              />
              <Field
                label="Note (optionnel)"
                value={form.note}
                onChange={(v) => setForm({ ...form, note: v })}
                textarea
                placeholder="Horaires, accès, précisions…"
              />
              <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                {submitting ? "Enregistrement…" : "Valider mes coordonnées"}
              </Button>
            </form>
          ) : (
            <div className="mt-8">
              <Button
                asChild
                size="lg"
                className="w-full bg-primary hover:bg-primary-glow text-primary-foreground"
              >
                <a
                  href={buildWhatsAppLink(whatsappMsg)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contacter John sur WhatsApp
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm text-right">{children}</span>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium mb-1 block">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full border rounded-md px-3 py-2 bg-background text-sm"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full border rounded-md px-3 py-2 bg-background text-sm"
        />
      )}
    </label>
  );
}
