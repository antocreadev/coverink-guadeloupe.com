import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { recordOrder, storeLastOrder } from "@/lib/notify";

declare global {
  interface Window {
    paypal?: any;
  }
}

const CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID as string | undefined;
const SDK_SRC = CLIENT_ID
  ? `https://www.paypal.com/sdk/js?client-id=${CLIENT_ID}&currency=EUR&intent=capture&enable-funding=card&disable-funding=credit,paylater`
  : null;

let sdkPromise: Promise<void> | null = null;
function loadPayPalSdk(): Promise<void> {
  if (!SDK_SRC) return Promise.reject(new Error("PayPal client ID manquant"));
  if (typeof window === "undefined") return Promise.reject(new Error("SSR"));
  if (window.paypal) return Promise.resolve();
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-paypal-sdk="true"]',
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("SDK load error")),
      );
      return;
    }
    const s = document.createElement("script");
    s.src = SDK_SRC;
    s.dataset.paypalSdk = "true";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("SDK load error"));
    document.body.appendChild(s);
  });
  return sdkPromise;
}

type Props = {
  productId: string;
  productName: string;
  amount: number;
  description: string;
  paypalOnly?: boolean;
};

export function PayPalButton({
  productId,
  productName,
  amount,
  description,
  paypalOnly = false,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!CLIENT_ID) {
      setStatus("error");
      setMessage("Configuration PayPal manquante.");
      return;
    }

    loadPayPalSdk()
      .then(() => {
        if (cancelled || !containerRef.current || !window.paypal) return;
        containerRef.current.innerHTML = "";
        const buttonOpts: any = {
            style: { layout: "vertical", shape: "rect", label: "paypal" },
            createOrder: (_: any, actions: any) =>
              actions.order.create({
                purchase_units: [
                  {
                    description,
                    amount: {
                      value: amount.toFixed(2),
                      currency_code: "EUR",
                    },
                  },
                ],
              }),
            onApprove: async (_: any, actions: any) => {
              try {
                const details = await actions.order.capture();
                const order = await recordOrder({
                  paypalOrderId: details.id,
                  productId,
                  productName,
                });
                if (!order) {
                  setStatus("error");
                  setMessage(
                    "Paiement reçu mais enregistrement échoué — contactez-nous avec votre n° PayPal : " +
                      details.id,
                  );
                  return;
                }
                storeLastOrder(order);
                navigate(`/commande/${order.id}`);
              } catch (err) {
                setStatus("error");
                setMessage("Erreur pendant la validation du paiement.");
                console.error(err);
              }
            },
            onError: (err: unknown) => {
              setStatus("error");
              setMessage("Une erreur est survenue pendant le paiement.");
              console.error(err);
            },
            onCancel: () => {
              setMessage("Paiement annulé.");
            },
        };
        if (paypalOnly) {
          buttonOpts.fundingSource = window.paypal.FUNDING.PAYPAL;
          window.paypal
            .Buttons(buttonOpts)
            .render(containerRef.current)
            .then(() => {
              if (!cancelled) setStatus("ready");
            });
        } else {
          const sources = [
            window.paypal.FUNDING.PAYPAL,
            window.paypal.FUNDING.CARD,
          ];
          Promise.all(
            sources.map((fundingSource) =>
              window.paypal
                .Buttons({ ...buttonOpts, fundingSource })
                .render(containerRef.current!),
            ),
          ).then(() => {
            if (!cancelled) setStatus("ready");
          });
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setStatus("error");
        setMessage("Impossible de charger PayPal.");
        console.error(err);
      });

    return () => {
      cancelled = true;
    };
  }, [amount, description, productId, productName, navigate, paypalOnly]);

  return (
    <div className="w-full">
      {status === "loading" && (
        <div className="text-sm text-muted-foreground text-center py-2">
          Chargement du paiement…
        </div>
      )}
      <div ref={containerRef} />
      {message && (
        <p className="text-sm mt-2 text-muted-foreground">{message}</p>
      )}
    </div>
  );
}
