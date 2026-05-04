import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageview } from "@/lib/analytics";

export default function AnalyticsTracker() {
  const location = useLocation();
  useEffect(() => {
    if (location.pathname.startsWith("/admin")) return;
    trackPageview(location.pathname + location.search);
  }, [location.pathname, location.search]);
  return null;
}
