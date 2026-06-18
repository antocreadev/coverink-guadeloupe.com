import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const SIMULATEUR_URL = "https://passwallet.speedpost.fr/f/yc8g9pu";
const POPUP_SEEN_KEY = "mm971_simulateur_popup";

const SimulateurFrame = () => (
  <iframe
    src={SIMULATEUR_URL}
    title="Simulateur de projet covering"
    loading="lazy"
    className="block w-full mx-auto"
    style={{ border: 0, maxWidth: 480, height: 720 }}
  />
);

const SimulateurBody = () => (
  <DialogContent className="max-w-[520px] gap-0 p-0 overflow-hidden max-h-[92vh] flex flex-col">
    <DialogHeader className="space-y-1.5 p-5 pb-3 text-center sm:text-center">
      <DialogTitle className="flex items-center justify-center gap-2 text-xl">
        <Sparkles className="w-5 h-5 text-primary" /> Simulez votre projet
      </DialogTitle>
      <DialogDescription>
        Estimez en quelques clics le budget de votre covering Cover Styl'.
      </DialogDescription>
    </DialogHeader>
    <div className="overflow-y-auto px-3 pb-4">
      <SimulateurFrame />
    </div>
  </DialogContent>
);

/** Dialog du simulateur déclenché par un élément personnalisé (ex: bouton du hero). */
export const SimulateurDialog = ({ children }: { children: React.ReactNode }) => (
  <Dialog>
    <DialogTrigger asChild>{children}</DialogTrigger>
    <SimulateurBody />
  </Dialog>
);

/** Pop-up automatique de mise en avant du simulateur (une fois par session). */
export const SimulateurPopup = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(POPUP_SEEN_KEY)) return;
    } catch {
      /* sessionStorage indisponible : on affiche quand même */
    }
    const timer = window.setTimeout(() => setOpen(true), 2500);
    return () => window.clearTimeout(timer);
  }, []);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      try {
        sessionStorage.setItem(POPUP_SEEN_KEY, "1");
      } catch {
        /* ignore */
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <SimulateurBody />
    </Dialog>
  );
};
